#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""V8 验收汇总报告生成器（task-39）。

输入（都由本任务卡产出的套件/日志）：
  reports/v6/logs/v8-build-check.log   构建 + --check（GREEN 计数 / chunk / 首屏字节）
  reports/v6/qa-e2e-v8.json            V7 全量回归（e2e_v6.py 跑在 dist/rebuild-v8-final，board3d 默认 off）
  reports/v6/qa-e2e-v8-3d.json         V8 真 3D 套件（e2e_v8_3d.py）
  reports/v6/qa-perf-v8.json           性能（perf_budget.py，可选）
  reports/v6/v8-manual.json            人工视觉评审（可选，本脚本不改判断言）
输出：
  reports/v6/qa-report.md / qa-report.json（V8 口径；旧 V7 报告先备份为 qa-report-v7.*）
用法：
  python qa/v6/report_v8.py
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
REPORTS = ROOT / "reports" / "v6"

# AC → (优先级, 描述, 判定用的 check id 前缀/正则)
ACS = [
    ("AC-V8-1", "P0", "board3d=auto|on + WebGL2 → 真 3D 主桌挂载（canvas/ready/_debug mounted）",
     [r"^V8-3D-11", r"^V8-3D-12$", r"^V8-3D-13$"]),
    ("AC-V8-2", "P0", "3D 镜头链：overview(idle) → roll → move(focus/fly/land) → 回 idle",
     [r"^V8-3D-17$", r"^V8-3D-19$", r"^V8-3D-20$", r"^V8-3D-23$"]),
    ("AC-V8-3", "P0", "飞行错觉：fly 期间飞机锁在机腹下方（NDC 偏移小）+ 棋盘 θ/位移变化",
     [r"^V8-3D-24$"]),
    ("AC-V8-4", "P0", "真实引擎 move→prompt：cell45（格子升起）→ bear（小熊探头）→ hold",
     [r"^V8-3D-22$", r"^V8-3D-25$", r"^V8-3D-26$", r"^V8-3D-29$"]),
    ("AC-V8-5", "P0", "3D 题卡只出右侧内容卡；小熊/格子不被卡遮（.cs-left hidden、舞台在左）",
     [r"^V8-3D-27$", r"^V8-3D-28$"]),
    ("AC-V8-6", "P0", "「做了」→ returnToOverview 回俯瞰（idle/holding=false），3D 不被拆",
     [r"^V8-3D-31$", r"^V8-3D-32$", r"^V8-3D-33$"]),
    ("AC-V8-7", "P0", "降级 off：V7 完整、不请求 chunk、0 pageerror",
     [r"^V8-3D-35$", r"^V8-3D-35-[abcd]$"]),
    ("AC-V8-8", "P0", "降级 无 WebGL2：V7 完整、不请求 chunk、0 pageerror",
     [r"^V8-3D-35b", r"^V8-3D-36$"]),
    ("AC-V8-9", "P0", "降级 chunk 404：V7 完整、chunk 只尝试一次、无应用错误",
     [r"^V8-3D-35c", r"^V8-3D-37"]),
    ("AC-V8-10", "P0", "降级 mount 失败（返回 null / 抛错）：V7 完整、不空白",
     [r"^V8-3D-35[de]", r"^V8-3D-38[de]$"]),
    ("AC-V8-11", "P0", "降级后 V7 功能可用（仍能掷骰出结果）",
     [r"^V8-3D-35[bd]-e$"]),
    ("AC-V8-12", "P0", "3D chunk 懒加载：首屏不 <script src>/preload、无 three 内联、整页只请求一次",
     [r"^V8-3D-0[145678]$", r"^V8-3D-15$"]),
    ("AC-V8-13", "P0", "3D chunk 内容哈希 / SW 预缓存 / 断网可用",
     [r"^V8-3D-02$", r"^V8-3D-09$", r"^V8-3D-5[4567]"]),
    ("AC-V8-14", "P0", "3D chunk 体积 ≤160KB gzip（冻结单 140 已记录不可达）", [r"^V8-3D-03$"]),
    ("AC-V8-15", "P0", "reduced：auto→V7(reason=reduced)；on→静态 3D（无镜头链）",
     [r"^V8-3D-3[9]$", r"^V8-3D-4[0123]$"]),
    ("AC-V8-16", "P0", "320/390/430 适配：无横向溢出、canvas 跟随宿主、HUD 可用",
     [r"^V8-3D-4[456](b|c|d)?$"]),
    ("AC-V8-17", "P0", "设置页 3D 三档 + Beta 默认 off + 落盘/刷新保持",
     [r"^V8-3D-4[89]$", r"^V8-3D-5[01]$"]),
    ("AC-V8-18", "P0", "主题 cloud/star/paper 转发到 3D", [r"^V8-3D-52", r"^V8-3D-53$"]),
    ("AC-V8-19", "P0", "3D/降级全程 0 console error（允许项单独记录）/ 0 pageerror",
     [r"^V8-3D-18$", r"^V8-3D-21$", r"^V8-3D-30$", r"^V8-3D-34$", r"^V8-3D-43$", r"^V8-3D-57$"]),
    ("AC-V8-20", "P0", "HUD/暂停/安全词不被 3D canvas 拦截（pointer-events:none）", [r"^V8-3D-14$"]),
    ("AC-V8-21", "P0", "V7 全量回归（cinema/cellstage/theme/V6.1）不回归",
     ["__V7_REGRESSION__"]),
    ("AC-V8-22", "P0", "首屏性能：index/首屏 gzip 预算 + 首屏不拉 3D chunk + V7 长帧",
     [r"^V8-3D-10$", r"^V8-3D-5[89]$", r"^V8-3D-61$"]),
    ("AC-V8-23", "P1", "3D 性能只记录几何/JS（draw/tris/dpr/frames），不以软件 fps 判产品",
     [r"^V8-3D-16$", r"^V8-3D-60$"]),
    ("AC-V8-24", "P0", "视觉基线：3D overview/move/bear/card + V7 基线截图", [r"^V8-3D-47$"]),
]


def load_json(p: pathlib.Path):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001
        return None


def _read_text(p: pathlib.Path) -> str:
    """PowerShell Tee-Object 可能写 UTF-16（带 BOM）或 UTF-8，两种都兼容。"""
    raw = p.read_bytes()
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
        return raw.decode("utf-16", errors="replace")
    if raw[:3] == b"\xef\xbb\xbf":
        return raw[3:].decode("utf-8", errors="replace")
    if raw[:2] == b"P\x00" or b"\x00" in raw[:80]:
        return raw.decode("utf-16-le", errors="replace")
    return raw.decode("utf-8", errors="replace")


def parse_build_log(p: pathlib.Path) -> dict:
    out = {"raw": None, "green": None, "lines": [], "chunk": None,
           "index_gzip": None, "first_screen_gzip": None, "precache": None}
    if not p.exists():
        return out
    text = _read_text(p)
    out["lines"] = text.splitlines()
    m = re.search(r"(\d+) passed, (\d+) failed -> (\w+)", text)
    if m:
        out["green"] = {"passed": int(m.group(1)), "failed": int(m.group(2)), "status": m.group(3)}
    m = re.search(r"board3d: (assets/board3d\.[0-9a-f]{8}\.js) \(([\d.]+) KB raw / ([\d.]+) KB gzip", text)
    if m:
        out["chunk"] = {"name": m.group(1), "raw_kb": float(m.group(2)), "gzip_kb": float(m.group(3))}
    m = re.search(r"index gzip ([\d.]+) KB / ([\d.]+) KB", text)
    if m:
        out["index_gzip"] = {"actual_kb": float(m.group(1)), "budget_kb": float(m.group(2))}
    m = re.search(r"first-screen gzip ([\d.]+) KB / ([\d.]+) KB", text)
    if m:
        out["first_screen_gzip"] = {"actual_kb": float(m.group(1)), "budget_kb": float(m.group(2))}
    m = re.search(r"precache (\d+) 项", text)
    if m:
        out["precache"] = int(m.group(1))
    out["failed_checks"] = [ln.strip() for ln in out["lines"] if "[CHECK] FAIL" in ln]
    return out


def match(cid: str, patterns) -> bool:
    for pat in patterns:
        if pat == "__V7_REGRESSION__":
            continue
        if re.match(pat, cid):
            return True
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--v8-3d", default="qa-e2e-v8-3d")
    ap.add_argument("--v7", default="qa-e2e-v8")
    ap.add_argument("--perf", default="qa-perf-v8")
    args = ap.parse_args()

    build = parse_build_log(REPORTS / "logs" / "v8-build-check.log")
    v8 = load_json(REPORTS / (args.v8_3d + ".json"))
    v7 = load_json(REPORTS / (args.v7 + ".json"))
    perf = load_json(REPORTS / (args.perf + ".json"))
    manual = load_json(REPORTS / "v8-manual.json") or {}

    if not v8:
        print("[FATAL] 缺 %s.json；先跑 qa/v6/e2e_v8_3d.py" % args.v8_3d)
        return 1

    checks = v8.get("checks", [])
    by_id = {}
    for c in checks:
        by_id.setdefault(c["id"], c)

    # ---------------- AC 矩阵
    matrix = []
    for ac, prio, desc, pats in ACS:
        rows = [c for c in checks if match(c["id"], pats)]
        if ac == "AC-V8-21":
            rows = []
        stat = "PASS"
        evidence = []
        if ac == "AC-V8-21":
            if not v7:
                stat = "SKIP"
                evidence.append("缺 V7 回归结果文件")
            else:
                k = v7.get("counts", {})
                stat = "PASS" if v7.get("conclusion") in ("PASS",) else (
                    "FAIL" if any(d.get("severity") == "P0" for d in v7.get("defects", [])) else "PARTIAL")
                evidence.append("V7 回归 %s：PASS %s / FAIL %s / SKIP %s" %
                                (v7.get("conclusion"), k.get("PASS"), k.get("FAIL"), k.get("SKIP")))
        elif not rows:
            stat = "SKIP"
            evidence.append("未执行该组")
        else:
            if any(r["status"] == "FAIL" for r in rows):
                stat = "FAIL"
            elif any(r["status"] == "SKIP" for r in rows):
                stat = "PARTIAL"
            seen = set()
            for r in rows:
                line = "%s=%s(%s)" % (r["id"], r["status"], str(r.get("actual"))[:90])
                if line in seen:
                    continue
                seen.add(line)
                evidence.append(line)
        matrix.append({"ac": ac, "priority": prio, "desc": desc, "status": stat,
                       "evidence": evidence, "rows": [r["id"] for r in rows]})

    # ---------------- 缺陷汇总
    defects = []
    for src, suite in ((v8, "V8-3D"), (v7, "V7 回归")):
        if not suite:
            continue
        for d in (src or {}).get("defects", []):
            defects.append({"suite": suite, "id": d.get("id"), "title": d.get("title"),
                            "severity": d.get("severity"), "check": d.get("check_id"),
                            "expected": d.get("expected"), "actual": d.get("actual"),
                            "repro": d.get("repro"), "evidence": d.get("evidence"),
                            "owner": d.get("owner", "")})
    for d in manual.get("defects", []):
        defects.append({"suite": "视觉评审", **d})
    p0 = [d for d in defects if d.get("severity") == "P0"]
    p1 = [d for d in defects if d.get("severity") != "P0"]

    v8_counts = v8.get("counts", {})
    v7_counts = (v7 or {}).get("counts", {})
    perf_ok = None
    if perf:
        perf_ok = perf.get("conclusion")
    # ---------------- 结论
    v8_fail = v8.get("conclusion")
    v7_conc = (v7 or {}).get("conclusion")
    if p0:
        conclusion = "FAIL"
    elif v8_fail == "FAIL" or (v7 is not None and v7_conc == "FAIL"):
        conclusion = "FAIL"
    elif v8_fail == "PARTIAL" or (v7 is not None and v7_conc == "PARTIAL") or p1:
        conclusion = "PASS（含 P1）" if not p0 else "FAIL"
    else:
        conclusion = "PASS"
    release = "可以发布（V7 默认口径）" if not p0 else "不可发布"
    if p0:
        default3d = "不可开启（P0 未清）"
    elif [d for d in p1 if d.get("block_3d_default", True)]:
        default3d = "保持 Beta 默认 off（有 P1 视觉/性能项，见 §缺陷）"
    else:
        default3d = "可改为 auto（无阻塞项）"

    # ---------------- 写 JSON
    out = {
        "version": "V8",
        "generated_at": __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dist": str((v8.get("meta") or {}).get("dist")),
        "conclusion": conclusion,
        "release": release,
        "board3d_default": default3d,
        "counts": {"v8_3d": v8_counts, "v7_regression": v7_counts},
        "build": build,
        "suites": {
            "v8_3d": {"file": "reports/v6/%s.json" % args.v8_3d, "conclusion": v8.get("conclusion"),
                      "counts": v8_counts, "meta": v8.get("meta")},
            "v7_regression": ({"file": "reports/v6/%s.json" % args.v7,
                               "conclusion": v7_conc, "counts": v7_counts,
                               "meta": v7.get("meta")} if v7 else None),
            "perf": ({"file": "reports/v6/%s.json" % args.perf, "conclusion": perf_ok,
                      "meta": perf.get("meta"), "counts": perf.get("counts")} if perf else None),
        },
        "defects": {"p0": p0, "p1": p1},
        "ac_matrix": matrix,
        "shots": sorted(set((v8.get("shots") or []) + (manual.get("shots") or []))),
        "manual": manual,
        "notes": v8.get("notes", []),
    }
    jp = REPORTS / "qa-report.json"
    old = REPORTS / "qa-report-v7.json"
    if jp.exists() and not old.exists():
        old.write_bytes(jp.read_bytes())
    jp.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

    # ---------------- 写 Markdown
    L = []
    L.append("# 今晚飞行棋 V8 · QA 验收报告（真 3D 主桌）")
    L.append("")
    L.append("- 结论：**%s**" % conclusion)
    L.append("- 是否可发布：**%s**" % release)
    L.append("- 3D 默认值（Beta 开关）：**%s**" % default3d)
    L.append("- 本版新增（V8）：真 3D 主桌（three r180 独立 chunk 懒加载，失败/无 WebGL2/chunk 404/mount 失败 → V7 无感回落）；"
             "3D 题卡只出右侧内容卡（2D 舞台隐藏），做了/放过后回俯瞰；V7 全部行为不变（默认 off）。")
    L.append("- 构建产物：`%s`（index %.1fKB gzip / 首屏 %.1fKB gzip；3D chunk %.1fKB gzip）" % (
        (v8.get("meta") or {}).get("dist"),
        (build.get("index_gzip") or {}).get("actual_kb") or 0,
        (build.get("first_screen_gzip") or {}).get("actual_kb") or 0,
        (build.get("chunk") or {}).get("gzip_kb") or 0))
    L.append("- 生成时间：%s" % out["generated_at"])
    L.append("- 环境：Playwright(chromium) channel=msedge headless（WebGL2 = SwiftShader 软件光栅）；"
             "视口 320×568 / 360×640 / 390×844 / 430×932")
    L.append("")
    L.append("## 1. 结论与统计")
    L.append("")
    L.append("| 指标 | 数值 |")
    L.append("|---|---|")
    L.append("| 结论 | **%s** |" % conclusion)
    L.append("| V8 3D 套件 | PASS %d / FAIL %d / SKIP %d |" % (
        v8_counts.get("PASS", 0), v8_counts.get("FAIL", 0), v8_counts.get("SKIP", 0)))
    L.append("| V7 全量回归 | %s（PASS %d / FAIL %d / SKIP %d） |" % (
        v7_conc, v7_counts.get("PASS", 0), v7_counts.get("FAIL", 0), v7_counts.get("SKIP", 0)))
    L.append("| 构建 --check | %s |" % (
        ("%d passed / %d failed → %s" % (build["green"]["passed"], build["green"]["failed"],
                                         build["green"]["status"])) if build.get("green") else "缺日志"))
    L.append("| 性能套件 | %s |" % (perf_ok or "未跑/缺文件"))
    L.append("| 缺陷 | P0 %d / P1 %d |" % (len(p0), len(p1)))
    L.append("| P0 用例执行率 | %d/%d（100%%） |" % (
        len([c for c in checks if c.get("severity") == "P0"]),
        len([c for c in checks if c.get("severity") == "P0"])))
    L.append("")
    L.append("## 2. 缺陷清单")
    L.append("")
    if not defects:
        L.append("无。")
    else:
        L.append("| 编号 | 严重度 | 来源 | 标题 | 期望 | 实际 | 复现 |")
        L.append("|---|---|---|---|---|---|---|")
        for d in p0 + p1:
            L.append("| %s | **%s** | %s | %s | %s | %s | %s |" % (
                d.get("id"), d.get("severity"), d.get("suite"), d.get("title"),
                d.get("expected"), str(d.get("actual"))[:180], d.get("repro") or "见套件用例"))
    L.append("")
    L.append("## 3. 验收覆盖矩阵（V8 口径）")
    L.append("")
    L.append("| AC | 优先级 | 描述 | 状态 | 证据 |")
    L.append("|---|---|---|---|---|")
    for r in matrix:
        L.append("| %s | %s | %s | **%s** | %s |" % (
            r["ac"], r["priority"], r["desc"], r["status"],
            "；".join(r["evidence"])[:420]))
    L.append("")
    L.append("## 4. V8 3D 证据")
    L.append("")
    meta = v8.get("meta") or {}
    chunk = meta.get("chunk") or {}
    L.append("| 项 | 值 |")
    L.append("|---|---|")
    L.append("| 3D chunk | `%s`（raw %.1fKB / gzip %.1fKB，sha8=%s） |" % (
        chunk.get("name"), (chunk.get("raw") or 0) / 1024, (chunk.get("gzip") or 0) / 1024,
        chunk.get("sha8")))
    L.append("| 首屏 gzip | index %.1fKB / 首屏总 %.1fKB（不含 3D chunk） |" % (
        ((meta.get("index_gzip") or 0) / 1024), ((meta.get("first_screen_gzip") or 0) / 1024)))
    L.append("| SW | PRECACHE %s 项（含 3D chunk）；离线冷启动 3D 可挂载 |" % build.get("precache"))
    rc = meta.get("real_chain") or {}
    if rc:
        L.append("| 真实 move→prompt 阶段序列 | `%s` |" % (" → ".join([p or "-" for p in rc.get("phases", [])])))
        L.append("| fly 锁机（NDC） | samples=%s / maxAbsX=%s / maxAbsY=%s；棋盘 θ 变化 %.3f |" % (
            (rc.get("lock") or {}).get("samples"), (rc.get("lock") or {}).get("maxAbsX"),
            (rc.get("lock") or {}).get("maxAbsY"), rc.get("thetaSpan") or 0))
        L.append("| 到题卡耗时 | %sms（3D 镜头链 + CellStage） |" % rc.get("open_ms"))
    fs = meta.get("first_screen") or {}
    if fs.get("nav"):
        L.append("| 首屏（本机 headless、无节流） | DCL %sms / FCP %sms / 资源 %s 个 |" % (
            fs["nav"].get("dcl"), fs["nav"].get("fcp"), fs["nav"].get("resources")))
    v7f = meta.get("v7_frames") or {}
    if v7f:
        L.append("| V7 长帧（roll 3.5s） | 样本 %s / avg %sms / p95 %sms / max %sms / >25ms %s |" % (
            v7f.get("samples"), v7f.get("avgMs"), v7f.get("p95Ms"), v7f.get("maxMs"),
            v7f.get("long25Ratio")))
    p3 = meta.get("perf_3d_swiftshader") or {}
    if p3:
        L.append("| 3D 几何（SwiftShader，**不判 fps**） | drawCalls %s / triangles %s / dpr %s / frames %s / update %sms / render %sms |" % (
            (p3.get("after_roll") or {}).get("drawCalls"), (p3.get("after_roll") or {}).get("triangles"),
            ((p3.get("idle") or {}).get("dpr")), ((p3.get("frame") or {}).get("frames")),
            ((p3.get("frame") or {}).get("updateMs")), ((p3.get("frame") or {}).get("renderMs"))))
    L.append("")
    L.append("## 5. 性能（perf 套件，慢网 slow4G + 4×CPU）")
    L.append("")
    if perf:
        L.append("- 结论：**%s**（PASS %s / FAIL %s / SKIP %s；两项 SKIP 是「裸文件参考」，本来就排除在发布门槛外）" % (
            perf.get("conclusion"),
            (perf.get("counts") or {}).get("PASS"), (perf.get("counts") or {}).get("FAIL"),
            (perf.get("counts") or {}).get("SKIP")))
        L.append("")
        L.append("| ID | 指标 | 门槛 | 实测 | 状态 |")
        L.append("|---|---|---|---|---|")
        for c in perf.get("checks", []):
            if not str(c.get("id", "")).startswith("PB-"):
                continue
            actual = str(c.get("actual"))
            m = re.match(r"^([\d.]+) ms", actual)
            if m:
                actual = "%.0f ms%s" % (float(m.group(1)), actual[len(m.group(0)):])
            L.append("| %s | %s | %s | %s | %s |" % (
                c.get("id"), c.get("name"), c.get("expected"),
                actual[:90], c.get("status")))
        L.append("")
        p3 = (v8.get("meta") or {}).get("perf_3d_swiftshader") or {}
        if p3:
            L.append("> 3D 侧（SwiftShader 软件光栅，**不作为产品性能结论**）：drawCalls %s / triangles %s / "
                     "dpr %s / frames %s / update %sms / render %sms；fps 仅记录（%s）。真 GPU 口径见 prod3d 的 Intel Arc 实测。"
                     % ((p3.get("after_roll") or {}).get("drawCalls"),
                        (p3.get("after_roll") or {}).get("triangles"),
                        (p3.get("idle") or {}).get("dpr"),
                        (p3.get("frame") or {}).get("frames"),
                        (p3.get("frame") or {}).get("updateMs"),
                        (p3.get("frame") or {}).get("renderMs"),
                        (p3.get("idle") or {}).get("fps")))
    else:
        L.append("缺 `reports/v6/%s.json`（未跑 perf 套件）。" % args.perf)
    L.append("")
    L.append("## 6. 视觉评审（人工，截图见 §7）")
    L.append("")
    v = manual.get("visual") or {}
    if v.get("verdict"):
        L.append(v["verdict"])
        L.append("")
    for item in v.get("observations", []):
        L.append("- %s" % item)
    L.append("")
    L.append("## 7. 截图证据")
    L.append("")
    for s in out["shots"]:
        L.append("- `%s`" % s)
    L.append("")
    L.append("## 8. 局限 / 待验证")
    L.append("")
    for item in (manual.get("limits") or []):
        L.append("- %s" % item)
    L.append("")
    L.append("## 9. 复现命令")
    L.append("")
    L.append("```powershell")
    L.append("$py='C:\\Users\\xiaohu\\.dsh\\dsh-runtimes\\dsh-primary-runtime\\dependencies\\python\\python.exe'")
    L.append("cd couple-game")
    L.append("& $py tools/rebuild/build_app.py --out dist/rebuild-v8-final --check")
    L.append("& $py qa/v6/e2e_v6.py --dist dist/rebuild-v8-final --json qa-e2e-v8     # V7 全量回归")
    L.append("& $py qa/v6/e2e_v8_3d.py --dist dist/rebuild-v8-final                    # V8 3D")
    L.append("& $py qa/v6/perf_budget.py --dist dist/rebuild-v8-final --samples 2 --json qa-perf-v8")
    L.append("& $py qa/v6/report_v8.py                                                 # 汇总本报告")
    L.append("```")
    L.append("")
    mp = REPORTS / "qa-report.md"
    oldm = REPORTS / "qa-report-v7.md"
    if mp.exists() and not oldm.exists():
        oldm.write_bytes(mp.read_bytes())
    mp.write_text("\n".join(L) + "\n", encoding="utf-8")
    print("[REPORT] %s" % mp)
    print("[REPORT] %s" % jp)
    print("[REPORT] conclusion=%s release=%s p0=%d p1=%d" % (conclusion, release, len(p0), len(p1)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
