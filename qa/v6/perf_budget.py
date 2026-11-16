#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""今晚飞行棋 V6 · 性能预算（对照 docs/v6/architecture.md §4.1 · PB-1~PB-13）。

取样口径（与 AR 一致）：
- 视口 390×844 DPR2；service_workers=block；CDP Network.emulateNetworkConditions slow4G
  （download 1.6Mbps / upload 750kbps / latency 150ms）；Emulation.setCPUThrottlingRate 4；
  cacheDisabled=true；本机静态服务（禁缓存）。
- 每项 3 次取中位数，报告同时给 3 个原始值。
- 体积类（PB-1/2/3）以磁盘落盘文件 + gzip -9 为准（唯一可信口径）。
- PB-6：从点「摆上棋盘」到主桌「掷骰」可见可点 ≤800ms。
- PB-7：主桌稳定 2.5s 后 performance.memory.usedJSHeapSize ≤6MB。
- PB-12：SW 接管后断网 reload → 门厅可开局 ≤1500ms（另见 e2e 的离线用例）。
- PB-13：首屏必需请求数（document + 阻塞资源）≤2。

用法：
  python qa/v6/perf_budget.py
  python qa/v6/perf_budget.py --samples 3 --dist dist/rebuild
产物：reports/v6/qa-perf.json / qa-perf.md
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import statistics
import sys
import time

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import qa_lib as Q  # noqa: E402
from qa_lib import Recorder  # noqa: E402

from playwright.sync_api import sync_playwright  # noqa: E402

# AR §1.2 / §4.2 的 slow4G 参数
SLOW4G = {
    "offline": False,
    "downloadThroughput": 1.6 * 1024 * 1024 / 8,
    "uploadThroughput": 750 * 1024 / 8,
    "latency": 150,
}
CPU_RATE = 4
VIEWPORT = (390, 844)


def _median(values):
    vals = [v for v in values if v is not None]
    return statistics.median(vals) if vals else None


def _fmt(v, unit="ms"):
    if v is None:
        return "-"
    return ("%.1f %s" % (v, unit)) if isinstance(v, float) and unit != "B" else ("%s %s" % (v, unit))


def _kb(v):
    return None if v is None else round(v / 1024.0, 1)


def measure_sample(browser, base_url: str, sample_no: int):
    """一次完整采样：门厅 DCL/FCP → 主桌可掷骰 → heap。"""
    ctx = Q.new_context(browser, viewport=VIEWPORT, dsf=2, service_workers="block")
    page = ctx.new_page()
    ps = Q.PageSession(ctx, page)
    out = {"sample": sample_no}
    try:
        cdp = ctx.new_cdp_session(page)
        cdp.send("Network.enable")
        cdp.send("Network.emulateNetworkConditions", SLOW4G)
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": CPU_RATE})
        cdp.send("Network.setCacheDisabled", {"cacheDisabled": True})

        t0 = time.time()
        page.goto(base_url, wait_until="load", timeout=60000)
        out["wall_load_ms"] = int((time.time() - t0) * 1000)
        metrics = page.evaluate(
            """() => {
                const n = performance.getEntriesByType('navigation')[0] || {};
                const paints = performance.getEntriesByType('paint') || [];
                const fcp = paints.find(p => p.name === 'first-contentful-paint');
                const res = performance.getEntriesByType('resource').map(e => ({
                    name: e.name, type: e.initiatorType, start: e.startTime, dur: e.duration,
                    transfer: e.transferSize || 0
                }));
                return {
                    dcl: n.domContentLoadedEventEnd || null,
                    load: n.loadEventEnd || null,
                    start: n.startTime || 0,
                    fcp: fcp ? fcp.startTime : null,
                    resources: res,
                    now: performance.now()
                };
            }"""
        )
        out["dcl"] = metrics.get("dcl")
        out["load"] = metrics.get("load")
        out["fcp"] = metrics.get("fcp")
        out["resources"] = metrics.get("resources") or []

        # 门厅可操作（开始按钮可见）
        boot_ok = False
        deadline = time.time() + 20
        while time.time() < deadline:
            if Q.exists(page, ["test:start"], timeout=300):
                boot_ok = True
                break
            page.wait_for_timeout(100)
        out["boot_ready_ms"] = int((time.time() - t0) * 1000) if boot_ok else None
        out["boot_ok"] = boot_ok
        if not boot_ok:
            out["error"] = "门厅开始按钮 20s 内未出现"
            return out
        # 首次进入可能先出现「玩法速览」层，先按 UI 关掉（与真实用户一致）
        if "玩法速览" in Q.body_text(page) or "规则速览" in Q.body_text(page):
            Q.try_click(page, ["role:button:/知道了/", "test:rules-ok"], timeout=4000)
            page.wait_for_timeout(400)
        # FCP 在慢网+降频下可能晚于 load 记录，补采一次
        if out.get("fcp") is None:
            paints2 = page.evaluate(
                "() => performance.getEntriesByType('paint').map(e => ({name: e.name, start: e.startTime}))"
            ) or []
            for p in paints2:
                if p.get("name") == "first-contentful-paint":
                    out["fcp"] = p.get("start")
                    break

        # 首屏请求（DCL 之前的 script/link/document）
        reqs = []
        for r in out["resources"]:
            if r.get("start", 0) <= (out.get("dcl") or 1e9):
                reqs.append(r)
        out["first_screen_resources"] = [r["name"] for r in reqs]
        out["blocking_requests"] = [r for r in reqs
                                    if r.get("type") in ("script", "link", "css") or
                                    r["name"].endswith((".js", ".css"))]
        out["request_count"] = len([1 for r in reqs])

        # 主桌可掷骰
        Q.try_click(page, ["test:mode-quick"], timeout=1500)
        Q.fill_names(page, ("阿岚", "阿策"))
        t_click = time.time()
        try:
            Q.click(page, ["test:start"], timeout=8000, desc="摆上棋盘")
        except Exception as e:  # noqa: BLE001
            out["error"] = "点开始失败：%s" % e
            return out
        table_ok = False
        deadline = time.time() + 20
        while time.time() < deadline:
            loc, _ = Q.find(page, ["test:roll"], timeout=200)
            if loc is not None:
                table_ok = True
                break
            page.wait_for_timeout(50)
        out["table_ready_ms"] = int((time.time() - t_click) * 1000) if table_ok else None
        out["table_ok"] = table_ok
        # 稳定 2.5s 读 heap
        page.wait_for_timeout(2500)
        out["heap"] = page.evaluate(
            "() => (performance.memory && performance.memory.usedJSHeapSize) ? performance.memory.usedJSHeapSize : null"
        )
        out["console_errors"] = list(ps.console_errors)
        out["pageerrors"] = list(ps.pageerrors)
        return out
    finally:
        ctx.close()


def measure_offline(browser, base_url: str):
    """PB-12：SW 接管后断网 reload 的门厅可操作时间。"""
    out = {"ok": False}
    ctx = Q.new_context(browser, viewport=VIEWPORT, dsf=2, service_workers="allow")
    page = ctx.new_page()
    ps = Q.PageSession(ctx, page)
    try:
        page.goto(base_url, wait_until="domcontentloaded", timeout=30000)
        Q.ensure_boot(page, None, timeout=15000)
        ctrl = None
        deadline = time.time() + 12
        while time.time() < deadline:
            ctrl = Q.eval_js(page, "() => navigator.serviceWorker && navigator.serviceWorker.controller ? navigator.serviceWorker.controller.scriptURL : null")
            if ctrl:
                break
            page.wait_for_timeout(300)
        out["controller"] = ctrl
        if not ctrl:
            out["error"] = "service worker 未接管（dev 构建可能不注册）"
            return out
        ctx.set_offline(True)
        t0 = time.time()
        try:
            page.reload(wait_until="domcontentloaded", timeout=30000)
        except Exception as e:  # noqa: BLE001
            out["error"] = "断网 reload 失败：%s" % e
            return out
        deadline = time.time() + 10
        while time.time() < deadline:
            if Q.exists(page, ["test:start"], timeout=300):
                out["ok"] = True
                out["boot_ms"] = int((time.time() - t0) * 1000)
                break
            page.wait_for_timeout(100)
        if not out["ok"]:
            out["error"] = "断网 reload 后 10s 内没出现开始按钮"
        return out
    finally:
        ctx.close()


def disk_budget(dist: pathlib.Path):
    """PB-1/2/3：index 体积与首屏总 gzip（以落盘为准；ADR-012 口径）。"""
    info = Q.build_info(dist)
    index_raw = info.get("raw") or 0
    index_gz = info.get("gzip") or 0
    files = info.get("files") or {}
    def _gz(rel):
        p = dist / rel
        if p.exists():
            return len(Q.gzip.compress(p.read_bytes(), 9))
        return 0

    cards_rel = next((k for k in files if "cards" in k and k.endswith(".js")), None)
    if cards_rel is None:
        cand = list(dist.rglob("cards*.js"))
        cards_rel = str(cand[0].relative_to(dist)).replace("\\", "/") if cand else None
    cards_gz = _gz(cards_rel) if cards_rel else 0
    manifest_gz = _gz("manifest.webmanifest")
    first_screen_gzip = index_gz + cards_gz + manifest_gz
    # 兼容旧口径：若模板仍有同步 <script src>，把对应文件算进 blocking（仅供报告参考）
    html = (dist / "index.html").read_text(encoding="utf-8", errors="replace") if (dist / "index.html").exists() else ""
    blocking = []
    for m in re.finditer(r'<script(?![^>]*\b(?:defer|async)\b)[^>]+src=["\']([^"\']+)["\']', html):
        src = m.group(1)
        p = dist / src.lstrip("./")
        if p.exists():
            blocking.append({"src": src, "raw": p.stat().st_size})
    blocking_raw = index_raw + sum(b["raw"] for b in blocking)
    return {"index_raw": index_raw, "index_gzip": index_gz, "cards_gzip": cards_gz,
            "manifest_gzip": manifest_gz, "first_screen_gzip": first_screen_gzip,
            "blocking": blocking, "blocking_raw": blocking_raw}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default=str(Q.DEFAULT_DIST))
    ap.add_argument("--samples", type=int, default=3)
    ap.add_argument("--json", default="qa-perf")
    args = ap.parse_args()
    dist = pathlib.Path(args.dist)
    if not (dist / "index.html").exists():
        print("[FATAL] 找不到 %s/index.html" % dist)
        sys.exit(1)

    rec = Recorder("perf", meta={
        "dist": str(dist),
        "build": Q.build_info(dist),
        "throttle": {"network": SLOW4G, "cpu": CPU_RATE, "viewport": list(VIEWPORT)},
        "samples": args.samples,
    })
    disk = disk_budget(dist)
    rec.meta["disk"] = disk
    print("[PERF] build gzip=%sKB raw=%sKB sha=%s" %
          (_kb(disk["index_gzip"]), _kb(disk["index_raw"]), rec.meta["build"].get("sha256")))

    with Q.serve_gzip(dist) as gz_base, Q.serve(dist) as raw_base:
        # 性能采样统一从 /index.html 进入（与 fe-build _fe_perf.py 一致；"/" 是目录，
        # 部分静态服务不会对目录回落 index.html 做 gzip，会污染主口径）
        gz_url = gz_base.rstrip("/") + "/index.html"
        raw_url = raw_base.rstrip("/") + "/index.html"
        with sync_playwright() as pw:
            browser = Q.launch_browser(pw)
            try:
                samples = []
                for i in range(1, args.samples + 1):
                    s = measure_sample(browser, gz_url, i)
                    samples.append(s)
                    print("[PERF] gzip sample %d: dcl=%sms fcp=%sms table=%sms heap=%sKB boot=%sms" %
                          (i, s.get("dcl"), s.get("fcp"), s.get("table_ready_ms"),
                           (s.get("heap") or 0) / 1024.0, s.get("boot_ready_ms")))
                # 裸文件（python http.server 默认）作为最差参考，不进入发布门槛
                raw_sample = measure_sample(browser, raw_url, 1)
                print("[PERF] raw-file reference: dcl=%sms fcp=%sms table=%sms" %
                      (raw_sample.get("dcl"), raw_sample.get("fcp"), raw_sample.get("table_ready_ms")))
                offline = measure_offline(browser, gz_url)
                print("[PERF] offline: ok=%s boot=%sms (%s)" %
                      (offline.get("ok"), offline.get("boot_ms"), offline.get("error") or ""))
            finally:
                browser.close()

    dcl_vals = [s.get("dcl") for s in samples if s.get("dcl") is not None]
    fcp_vals = [s.get("fcp") for s in samples if s.get("fcp") is not None]
    table_vals = [s.get("table_ready_ms") for s in samples if s.get("table_ready_ms") is not None]
    heap_vals = [s.get("heap") for s in samples if s.get("heap") is not None]
    boot_vals = [s.get("boot_ready_ms") for s in samples if s.get("boot_ready_ms") is not None]

    rec.meta["samples"] = samples
    rec.meta["raw_reference"] = raw_sample
    rec.meta["offline"] = offline
    rec.meta["perf_url"] = gz_url
    rec.add_note("性能主口径 = gzip 静态服务（GitHub Pages 行为，入口 /index.html）；裸文件（python http.server）仅作最差参考。")
    rec.add_note("预算口径：ADR-012（index ≤520KB raw / ≤140KB gzip；首屏总 gzip ≤180KB）；"
                 "AR 旧 PB-1=220KB、PB-2=58KB 已由 ADR-012 取代（Lead 2026-11-16 裁决）。")
    rec.add_note("DCL 对比：V5 同档（slow4G+4×CPU）4630ms（AR §1.2）；V6 gzip 本次中位数 %s ms；"
                 "裸文件中位数 %s ms；fe-build 参考值 1470ms（3 次 1521/1431/1470）。" %
                 (_median(dcl_vals) if dcl_vals else "-",
                  raw_sample.get("dcl") if raw_sample.get("dcl") else "-"))
    rec.add_note("FCP（inline 产物，优化前）：中位数 %s ms；fe-build 正在做「静态首绘骨架 + 外部 defer JS」实验，"
                 "最终产物若切换外部 JS 需复测 FCP/DCL；本报告不据此判 FAIL（Lead 2026-11-16 裁决）。" %
                 (_median(fcp_vals) if fcp_vals else "-"))

    measured = {
        "PB-1": disk["index_raw"],
        "PB-2": disk["index_gzip"],
        "PB-3": disk["first_screen_gzip"],
        "PB-4": _median(dcl_vals),
        "PB-5": _median(fcp_vals),
        "PB-6": _median(table_vals),
        "PB-7": _median(heap_vals),
        "PB-12": offline.get("boot_ms"),
        "PB-13": samples[0].get("request_count") if samples else None,
    }
    units = {"PB-1": "B", "PB-2": "B", "PB-3": "B", "PB-4": "ms", "PB-5": "ms",
             "PB-6": "ms", "PB-7": "B", "PB-12": "ms", "PB-13": "requests"}
    for key in ("PB-1", "PB-2", "PB-3", "PB-4", "PB-5", "PB-6", "PB-7", "PB-12", "PB-13"):
        name, limit, kind = Q.PB[key]
        limit_value = Q.PB_LIMITS[key]
        val = measured.get(key)
        unit = units[key]
        if val is None:
            if key == "PB-12" and offline.get("error"):
                rec.skip("%s/%s" % (key, "offline"), "%s · %s" % (key, name),
                         "%s；上限 %s" % (offline.get("error"), limit), ac="PB-%s" % key.split("-")[1],
                         evidence=json.dumps(offline, ensure_ascii=False))
            else:
                rec.skip("%s" % key, "%s · %s" % (key, name), "无法采样（上限 %s）" % limit,
                         ac="PB-%s" % key.split("-")[1])
            continue
        if key in ("PB-1", "PB-2", "PB-3", "PB-7", "PB-6", "PB-4", "PB-5", "PB-12", "PB-13"):
            ok = val <= limit_value
        else:  # pragma: no cover
            ok = True
        shown = ("%.1f KB" % (val / 1024.0)) if unit == "B" else ("%s %s" % (val, unit))
        if key == "PB-6":
            samples_txt = ", ".join("%sms" % v for v in table_vals)
        elif key == "PB-4":
            samples_txt = ", ".join("%sms" % (round(v) if v is not None else "-") for v in dcl_vals)
        elif key == "PB-7":
            samples_txt = ", ".join("%.2fMB" % (v / 1024.0 / 1024.0) for v in heap_vals)
        elif key == "PB-2":
            samples_txt = "%sB / %.1fKB（gzip -9）" % (val, val / 1024.0)
        else:
            samples_txt = shown
        if key == "PB-5" and val is not None and val > Q.PB_LIMITS["PB-5"]:
            # Lead 裁决：600ms 对 291KB 单文件 slow4G 不现实；fe-build 正在做外部 defer JS 优化实验。
            # inline 产物 FCP 记录为「优化前」，不判 FAIL；等最终产物复测或 ADR 调整后再定性。
            rec.skip(key, "%s · %s" % (key, name),
                     "优化前 FCP %s（上限 %s）；待 fe-build 外部 JS 优化后复测/ADR 调整" % (shown, limit),
                     ac="PB-5", evidence="qa-perf.json")
            continue
        if ok:
            note = ""
            if key == "PB-4" and val is not None and val > 2500:
                note = "（未达目标 2500ms，但在硬门槛 3500ms 内）"
            rec.ok(key, "%s · %s" % (key, name), "上限 %s" % limit, "%s（%s）%s" % (shown, samples_txt, note),
                   ac="PB-%s" % key.split("-")[1],
                   detail="原始采样：%s" % samples_txt)
        else:
            rec.fail(key, "%s · %s" % (key, name), "上限 %s" % limit, "%s（%s）" % (shown, samples_txt),
                     ac="PB-%s" % key.split("-")[1],
                     repro="%s 下打开 %s；采样 %d 次取中位数" % (
                         "slow4G+4xCPU" if key in ("PB-4", "PB-5", "PB-6", "PB-7", "PB-12") else "磁盘/gzip",
                         dist, args.samples),
                     detail="原始采样：%s" % samples_txt, owner="FE")
    # 裸文件参考（不参与发布门槛）
    raw_refs = [
        ("PB-4raw", "DCL（裸文件参考）", 3500, raw_sample.get("dcl"), "ms"),
        ("PB-5raw", "FCP（裸文件参考）", 600, raw_sample.get("fcp"), "ms"),
        ("PB-6raw", "主桌可掷骰（裸文件参考）", 800, raw_sample.get("table_ready_ms"), "ms"),
    ]
    for key, name, limit, val, unit in raw_refs:
        if val is None:
            rec.check(key, "%s · %s" % (key, name), "SKIP", "≤%d %s" % (limit, unit),
                      "未采样", ac="PB-ref", severity="P2")
            continue
        ok = val <= limit
        rec.check(key, "%s · %s" % (key, name), "PASS" if ok else "SKIP",
                  "≤%d %s（仅参考）" % (limit, unit), "%s %s" % (val, unit),
                  ac="PB-ref", severity="P2",
                  detail="裸文件参考，不参与发布门槛；gzip 主口径见 PB-4/5/6")

    # 额外的可观测数据（不设门槛）
    rec.add_note("门厅可操作（开始按钮可见）：%s" % ", ".join("%sms" % v for v in boot_vals))
    rec.add_note("首屏请求：%s" % json.dumps([s.get("request_count") for s in samples]))
    errors = []
    for s in samples:
        if s.get("error"):
            errors.append(s["error"])
        errors.extend(s.get("pageerrors") or [])
        errors.extend(s.get("console_errors") or [])
    if errors:
        rec.fail("PERF-RUNTIME", "性能采样过程无 JS 错误", "0 pageerror/console error",
                 json.dumps(errors[:5], ensure_ascii=False), ac="H6", severity="P2",
                 repro="性能采样路径", owner="FE")

    extra = ["## 预算明细（AR §4.1）", "",
             "| 编号 | 预算项 | 上限 | 实测（中位数） | 状态 |", "|---|---|---|---|---|"]
    for key in ("PB-1", "PB-2", "PB-3", "PB-4", "PB-5", "PB-6", "PB-7", "PB-12", "PB-13"):
        name, limit, _kind = Q.PB[key]
        val = measured.get(key)
        unit = units[key]
        if val is None:
            shown = "-（未采样）"
        elif unit == "B":
            shown = "%.1f KB" % (val / 1024.0)
        else:
            shown = "%s %s" % (val, unit)
        row = [c for c in rec.checks if c["id"] == key]
        status = row[0]["status"] if row else "SKIP"
        extra.append("| %s | %s | %s | %s | %s |" % (key, name, limit, shown, status))
    for key, label, limit in (("PB-4raw", "DCL 裸文件参考", "≤3500 ms"),
                               ("PB-5raw", "FCP 裸文件参考", "≤600 ms"),
                               ("PB-6raw", "主桌可掷骰 裸文件参考", "≤800 ms")):
        val = {"PB-4raw": raw_sample.get("dcl"), "PB-5raw": raw_sample.get("fcp"),
               "PB-6raw": raw_sample.get("table_ready_ms")}[key]
        row = [c for c in rec.checks if c["id"] == key]
        extra.append("| %s | %s | %s（参考） | %s | %s |" %
                     (key, label, limit, ("%s ms" % val) if val is not None else "-",
                      row[0]["status"] if row else "SKIP"))
    extra.append("")
    extra.append("### 原始采样")
    extra.append("")
    extra.append("```json")
    extra.append(json.dumps({"samples": samples, "offline": offline, "disk": disk},
                            ensure_ascii=False, indent=1)[:12000])
    extra.append("```")
    json_path, md_path = Q.write_suite_report(rec, args.json, extra_md=extra)
    counts = rec.counts()
    print("\n[PERF] %s PASS=%d FAIL=%d SKIP=%d" %
          (rec.conclusion(), counts.get("PASS", 0), counts.get("FAIL", 0), counts.get("SKIP", 0)))
    print("[PERF] report: %s" % md_path)
    for d in rec.defects:
        print("  [%s][%s] %s (%s)" % (d["severity"], d["id"], d["title"], d["check_id"]))
    if rec.conclusion() == "FAIL":
        sys.exit(1)
    if rec.conclusion() == "PARTIAL":
        sys.exit(2)


if __name__ == "__main__":
    main()
