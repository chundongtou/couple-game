#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""今晚飞行棋 V6 · QA 一键总控：构建 → 引擎测试 → E2E → 性能 → 视觉 → 汇总报告。

用法：
  python qa/v6/run_all.py                 # 默认：构建 + 引擎 + e2e(全部) + perf + visual
  python qa/v6/run_all.py --final         # 加 --strict / 发布门口径（缺模块即失败）
  python qa/v6/run_all.py --only e2e,perf # 只跑部分步骤
  python qa/v6/run_all.py --e2e-groups main,pause --e2e-viewports 390x844
  python qa/v6/run_all.py --skip-visual --samples 1

产物：
  reports/v6/qa-report.md / qa-report.json   ← 交付汇总（结论 + 统计 + 缺陷 + AC 矩阵 + 证据）
  reports/v6/qa-e2e.json / qa-perf.json / qa-visual.json
  reports/v6/logs/*.log
  qa/v6/shots/**；reports/v6/visual/**
退出码：0 PASS / 1 FAIL / 2 PARTIAL。
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import subprocess
import sys
import time

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
REPORTS = ROOT / "reports" / "v6"
LOGS = REPORTS / "logs"
sys.path.insert(0, str(HERE))
import qa_lib as Q  # noqa: E402

PY = sys.executable
NODE = "node"
DIST = ROOT / "dist" / "rebuild-v7"

# spec §4 的 P0 AC（用于覆盖率矩阵；P1 不逐条列，结果见各自报告）
# V6.1（2026-11-17）：结束=一方全部到家；起飞保底；题卡/心动值不再结束；回顾写「先到家/已到家」。
P0_ACS = [
    "AC-A1-1", "AC-A1-2", "AC-A2-1", "AC-A2-2", "AC-A2-3", "AC-A3-1", "AC-A3-4",
    "AC-A4-1", "AC-A4-3", "AC-A5-1", "AC-A5-2", "AC-A5-3", "AC-A6-1", "AC-A6-2",
    "AC-A6-3",
    "AC-B1-1", "AC-B1-2", "AC-B1-3", "AC-B2-1", "AC-B3-1", "AC-B3-3",
    "AC-B4-1", "AC-B4-2", "AC-B5-1", "AC-B5-2", "AC-B6-1", "AC-B6-2",
    "AC-C1-1", "AC-C1-2", "AC-C1-3", "AC-C2-1", "AC-C2-2", "AC-C2-5", "AC-C3-1",
    "AC-D1-1", "AC-D1-3", "AC-D2-1", "AC-D2-2", "AC-D3-1",
    "AC-E1-1", "AC-E1-2", "AC-E2-1", "AC-E2-3", "AC-E2-5",
    "AC-E3-1", "AC-E3-2", "AC-E3-3", "AC-E3-4",
    "AC-F1-1", "AC-F2-1", "AC-F2-2", "AC-F2-3", "AC-F2-5",
    "AC-G1-1", "AC-G1-2", "AC-G1-3", "AC-G2-1", "AC-G2-2", "AC-G2-3", "AC-G5-1",
    "AC-H1-1", "AC-H1-2", "AC-H2-1", "AC-H3-1", "AC-H4-1", "AC-H4-2", "AC-H6-1",
    # V6.2「夜航机舱」沉浸主桌（docs/v6/impl-freeze-cabin.md §5）
    "AC-V6.2-1", "AC-V6.2-2", "AC-V6.2-3", "AC-V6.2-4", "AC-V6.2-5", "AC-V6.2-6",
    # V7「云海机舱 · 45° 格子剧场」（docs/v7/impl-freeze.md §6）
    "AC-V7-1", "AC-V7-2", "AC-V7-3", "AC-V7-4", "AC-V7-5",
    "AC-V7-6", "AC-V7-7", "AC-V7-8", "AC-V7-9", "AC-V7-10", "AC-V7-11",
]
P1_ACS = ["AC-C5-1", "AC-C6-1", "AC-D4-1", "AC-D5-1", "AC-E4-1", "AC-E5-1", "AC-E5-2",
          "AC-E5-3", "AC-E6-1", "AC-E7-3", "AC-F3-1", "AC-G3-1", "AC-B7-1", "AC-B8-1",
          "AC-B9-1", "AC-C4-1", "AC-H6-2", "AC-B5-3", "AC-V6.2-7"]

AC_TEXT = {
    "AC-A1-1": "360×640 首屏可见「摆上棋盘」",
    "AC-A1-2": "390×844 首屏可见开始按钮",
    "AC-A2-1": "门厅有快局/长夜",
    "AC-A2-2": "模式卡写「先送完 N 架飞机 · 约 X–Y 分钟 · 每人 N 架」（V6.1）",
    "AC-A2-3": "开始后引擎状态与模式一致",
    "AC-A3-1": "空名字行内报错不进主桌",
    "AC-A3-4": "修复后进主桌",
    "AC-A4-1": "尺度四档各一句说明",
    "AC-A4-3": "尺度选择被记住",
    "AC-A5-1": "规则速览 6 条（含保底起飞 / 先到家就收尾）",
    "AC-A5-2": "知道了后不再出现",
    "AC-A5-3": "主桌可再次打开规则",
    "AC-A6-1": "刷新后显示继续",
    "AC-A6-2": "继续回到同一状态",
    "AC-A6-3": "旧档缺 takeoffMiss → 补 {a:0,b:0} 且可续玩",
    "AC-B1-1": "掷骰 ≤800ms 出现点数文本",
    "AC-B1-2": "点数文本保留到下次掷骰",
    "AC-B1-3": "6 点提示再掷一次",
    "AC-B2-1": "无子可走说明原因并换人",
    "AC-B3-1": "可走子文字按钮",
    "AC-B3-3": "文字按钮与棋子入口同一步",
    "AC-B4-1": "安全词全屏可达",
    "AC-B4-2": "主桌按钮不被安全词遮挡",
    "AC-B5-1": "主桌暂停按钮进 pause",
    "AC-B5-2": "返回后状态不变",
    "AC-B6-1": "状态条：双方已到家 + 心动值 + 连击 + 回合（V6.1）",
    "AC-B6-2": "结算后 ≤500ms 同步",
    "AC-C1-1": "题卡 100% 带人名",
    "AC-C1-2": "击落卡显示被击落方",
    "AC-C1-3": "叠机卡两人一起",
    "AC-C2-1": "放过心动值不减少",
    "AC-C2-2": "进航题放过仍进军",
    "AC-C2-5": "回顾只写今晚先放过",
    "AC-C3-1": "≤500ms 记录 toast",
    "AC-D1-1": "小游戏格可玩面板",
    "AC-D1-3": "无「玩过了」空按钮",
    "AC-D2-1": "小游戏有跳过",
    "AC-D2-2": "跳过回桌不扣心动",
    "AC-D3-1": "小游戏结束回原状态",
    "AC-E1-1": "心动值数值严格",
    "AC-E1-2": "心动值不下降",
    "AC-E2-1": "收尾出现「今晚最后一段」+ 两张收尾卡归属正确",
    "AC-E2-3": "回顾无输赢词",
    "AC-E2-5": "收尾卡 +10，不惩罚任一方",
    "AC-E3-1": "一方全部到家 → win/先到家/两张收尾卡（≤1s）",
    "AC-E3-2": "题卡 20 张未全到家 → 不结束",
    "AC-E3-3": "心动值 100 未全到家 → 不结束",
    "AC-E3-4": "长夜只 1 架到家 → 不结束",
    "AC-F1-1": "完成文本",
    "AC-F2-1": "回顾 6 类信息",
    "AC-F2-2": "明细含归属/类型/结果/星级",
    "AC-F2-3": "无占位文案",
    "AC-F2-5": "回顾「先到家」+「已到家 X/Y」+ ledger win-a/win-b",
    "AC-G1-1": "任意屏可暂停",
    "AC-G1-2": "暂停页四动作",
    "AC-G1-3": "继续回原状态",
    "AC-G2-1": "长按 1.6s 触发/短按不触发",
    "AC-G2-2": "触发后 session 仍在",
    "AC-G2-3": "今晚就到这归档",
    "AC-G5-1": "记录会留着",
    "AC-H1-1": "关键按钮 ≥44px",
    "AC-H1-2": "hit-test 命中自身",
    "AC-H2-1": "减少动画 ≤100ms",
    "AC-H3-1": "断网可开局",
    "AC-H4-1": "320–430 无横向滚动",
    "AC-H4-2": "题卡正文 ≥15px",
    "AC-H6-1": "主路径 0 错误",
    # V6.2「夜航机舱」（docs/v6/impl-freeze-cabin.md §5）
    "AC-V6.2-1": "机舱层存在/pointer-events:none/Canvas≥1/92 格点击不落 cabin",
    "AC-V6.2-2": "掷骰/走子/击落/换手/收家触发 .v6-board transform（reduced 无）",
    "AC-V6.2-3": "减少动画（设置/系统偏好）无镜头 transform、无震动、无闪灯",
    "AC-V6.2-4": "题卡/安全词/暂停不被 cabin 覆盖；320/360/390/430 无横向溢出",
    "AC-V6.2-5": "门厅 DCL/FCP/gzip 达标；主桌空闲长帧≤5%、20 次走子、reduced 停止",
    "AC-V6.2-6": "页面隐藏暂停（cabin 场景 rAF 停）且恢复后继续",
    "AC-V6.2-7": "视觉基线更新（主桌/题卡有意变化；boot/ledger 无变化）",
    # V7「云海机舱 · 45° 格子剧场」（docs/v7/impl-freeze.md §6）
    "AC-V7-1": "镜头状态链 overview→roll→pov→chase→land→cell45→bear→return，5–8s",
    "AC-V7-2": "POV 与第三人称跟拍都出现；目标格发光",
    "AC-V7-3": "落地后 CellStage（cell45/bear）；小熊 data-test=bear 随主题换装",
    "AC-V7-4": "CellStage 接管题卡：data-test 对齐；做了/放过/命运/收尾/功能格/长文本",
    "AC-V7-5": "三主题 cloud/star/paper + data-theme/变量 + 刷新保持",
    "AC-V7-6": "320/360/390/430 无溢出；92 格不被 cinema/cell 拦截；安全词/暂停 hit-test",
    "AC-V7-7": "reduced 无 POV/跟拍/震动；data-cinema-reduced=1；格子舞台静态",
    "AC-V7-8": "快进：动画中可点；点按立即到终态",
    "AC-V7-9": "性能：门厅 DCL/FCP/gzip；20 回合镜头链长帧>25ms≤5%；页面隐藏暂停",
    "AC-V7-10": "视觉基线按 V7 重建（主桌/格子舞台/主题变化）",
    "AC-V7-11": "V6.1 全量回归（main/skip/takeoff/win/notend/legacy/resume/pause/minigame/fate/events/responsive/offline/reduced）",
}


def run_step(name, cmd, timeout=2400, cwd=None):
    LOGS.mkdir(parents=True, exist_ok=True)
    log_path = LOGS / ("%s.log" % name)
    t0 = time.time()
    print("\n[RUN] %s: %s" % (name, " ".join(str(c) for c in cmd)))
    with open(log_path, "w", encoding="utf-8", errors="replace") as log:
        log.write("$ %s\n\n" % " ".join(str(c) for c in cmd))
        log.flush()
        try:
            proc = subprocess.run(
                [str(c) for c in cmd], cwd=str(cwd or ROOT), timeout=timeout,
                stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            )
            out = proc.stdout.decode("utf-8", errors="replace")
            log.write(out)
            code = proc.returncode
        except subprocess.TimeoutExpired as e:
            out = (e.stdout or b"").decode("utf-8", errors="replace") if e.stdout else ""
            log.write(out + "\n[TIMEOUT] %ss\n" % timeout)
            code = 124
    elapsed = time.time() - t0
    tail = out.strip().splitlines()[-12:]
    print("[RUN] %s exit=%s in %.1fs" % (name, code, elapsed))
    for line in tail:
        print("   " + line)
    return {"name": name, "cmd": [str(c) for c in cmd], "exit": code,
            "elapsed": round(elapsed, 1), "log": str(log_path.relative_to(ROOT)),
            "tail": tail, "output": out[-20000:]}


def load_json(rel):
    p = REPORTS / rel
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return None


def ac_status(checks, ac):
    hits = [c for c in checks if ac in (c.get("ac") or "") or (c.get("id") or "").startswith(ac)]
    if not hits:
        return "未覆盖", None
    if any(c["status"] == "FAIL" for c in hits):
        return "FAIL", hits
    if any(c["status"] == "PASS" for c in hits):
        return "PASS", hits
    return "SKIP", hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default=str(DIST))
    ap.add_argument("--only", default="", help="逗号分隔：build,engine,e2e,perf,visual")
    ap.add_argument("--final", action="store_true", help="最终集成口径（build --strict --check）")
    ap.add_argument("--e2e-groups", default="", help="透传 e2e --only，如 main,pause")
    ap.add_argument("--e2e-viewports", default="", help="透传 e2e --viewports")
    ap.add_argument("--samples", type=int, default=3)
    ap.add_argument("--skip-visual", action="store_true")
    ap.add_argument("--update-baseline", action="store_true")
    ap.add_argument("--timeout", type=int, default=2400)
    args = ap.parse_args()
    steps = [s.strip() for s in args.only.split(",") if s.strip()] or \
            ["build", "engine", "e2e", "perf", "visual"]
    if args.skip_visual and "visual" in steps:
        steps.remove("visual")
    dist = pathlib.Path(args.dist)
    REPORTS.mkdir(parents=True, exist_ok=True)

    results = {}
    build_cmd = [PY, str(ROOT / "tools" / "rebuild" / "build_app.py"), "--out", str(dist)]
    if args.final:
        build_cmd += ["--strict", "--check"]
    if "build" in steps:
        results["build"] = run_step("build", build_cmd, timeout=600)
        if results["build"]["exit"] != 0:
            print("[RUN] 构建失败，后续 UI 步骤仍会尝试（可能用旧产物）")
    if "engine" in steps:
        results["engine"] = run_step("engine", [NODE, str(ROOT / "qa" / "rebuild" / "flight-engine.test.mjs")],
                                     timeout=300)
    if "e2e" in steps:
        cmd = [PY, str(HERE / "e2e_v6.py"), "--dist", str(dist)]
        if args.e2e_groups:
            cmd += ["--only", args.e2e_groups]
        if args.e2e_viewports:
            cmd += ["--viewports", args.e2e_viewports]
        results["e2e"] = run_step("e2e", cmd, timeout=args.timeout)
    if "perf" in steps:
        results["perf"] = run_step("perf", [PY, str(HERE / "perf_budget.py"),
                                            "--dist", str(dist), "--samples", str(args.samples)],
                                   timeout=900)
    if "visual" in steps:
        cmd = [PY, str(HERE / "visual.py"), "--dist", str(dist)]
        if args.update_baseline:
            cmd.append("--update-baseline")
        results["visual"] = run_step("visual", cmd, timeout=900)

    # ---------------- 汇总 ----------------
    suites = {}
    for name, rel in (("e2e", "qa-e2e.json"), ("perf", "qa-perf.json"), ("visual", "qa-visual.json")):
        data = load_json(rel)
        if data:
            suites[name] = data

    checks = []
    defects = []
    for name in ("e2e", "perf", "visual"):
        data = suites.get(name)
        if not data:
            continue
        for c in data.get("checks", []):
            c = dict(c)
            c["suite"] = name
            checks.append(c)
        for d in data.get("defects", []):
            d = dict(d)
            d["suite"] = name
            defects.append(d)

    # 全局缺陷编号：按 suite 顺序（e2e→perf→visual）+ 原顺序
    order = {"e2e": 0, "perf": 1, "visual": 2}
    defects.sort(key=lambda d: (order.get(d.get("suite"), 9), d.get("time", ""), d.get("id", "")))
    for i, d in enumerate(defects, 1):
        d["original_id"] = d.get("id")
        d["id"] = "Q-%02d" % i

    # 构建/引擎作为检查项
    if "build" in results:
        ok = results["build"]["exit"] == 0
        checks.append({"id": "BUILD-01", "name": "构建（build_app.py%s）" % (" --strict --check" if args.final else ""),
                       "status": "PASS" if ok else "FAIL", "ac": "impl-freeze §5",
                       "severity": "P0", "expected": "exit 0", "actual": "exit %s" % results["build"]["exit"],
                       "evidence": results["build"]["log"], "suite": "build", "viewport": "-",
                       "detail": "\n".join(results["build"]["tail"][-8:])})
        if not ok:
            defects.append({"id": "Q-%02d" % (len(defects) + 1), "original_id": "BUILD",
                            "title": "构建失败", "severity": "P0", "suite": "build",
                            "expected": "exit 0", "actual": "exit %s" % results["build"]["exit"],
                            "repro": "python tools/rebuild/build_app.py --out dist/rebuild",
                            "evidence": results["build"]["log"], "check_id": "BUILD-01"})
    if "engine" in results:
        out = results["engine"]["output"] or ""
        m = re.search(r"(\d+)\s+passed,\s*(\d+)\s+failed", out)
        passed, failed = (int(m.group(1)), int(m.group(2))) if m else (None, None)
        ok = results["engine"]["exit"] == 0 and (failed == 0 if failed is not None else True)
        checks.append({"id": "ENGINE-01", "name": "引擎单测 0 failed",
                       "status": "PASS" if ok else "FAIL", "ac": "spec §9.2 / impl-freeze §5",
                       "severity": "P0", "expected": "0 failed",
                       "actual": ("%s passed, %s failed" % (passed, failed)) if m else "exit %s" % results["engine"]["exit"],
                       "evidence": results["engine"]["log"], "suite": "engine", "viewport": "-",
                       "detail": "\n".join(results["engine"]["tail"][-6:])})
        if not ok:
            defects.append({"id": "Q-%02d" % (len(defects) + 1), "original_id": "ENGINE",
                            "title": "引擎测试失败", "severity": "P0", "suite": "engine",
                            "expected": "0 failed", "actual": str(failed),
                            "repro": "node qa/rebuild/flight-engine.test.mjs",
                            "evidence": results["engine"]["log"], "check_id": "ENGINE-01"})

    # AC-V7-11：V6.1 全量回归（仅完整 e2e 口径汇总：非 AC-V7-* 的 e2e 检查全部 PASS）
    if "e2e" in results and not args.e2e_groups:
        e2e_checks = [c for c in checks if c.get("suite") == "e2e"]
        legacy = [c for c in e2e_checks if not str(c.get("ac", "")).startswith("AC-V7")]
        legacy_bad = [c for c in legacy if c.get("status") != "PASS"]
        ok = bool(legacy) and not legacy_bad
        checks.append({
            "id": "AC-V7-11", "name": "V6.1/V6.2 全量回归（main/skip/takeoff/win/notend/legacy/resume/"
                                     "pause/minigame/fate/events/responsive/offline/reduced/cabin）",
            "status": "PASS" if ok else "FAIL", "ac": "AC-V7-11", "severity": "P0",
            "expected": "V6 组全部 PASS（无 FAIL/SKIP）",
            "actual": "V6 检查 %d 条，异常 %d 条" % (len(legacy), len(legacy_bad)),
            "evidence": "reports/v6/qa-e2e.json", "suite": "e2e", "viewport": "-",
            "detail": json.dumps([c.get("id") for c in legacy_bad][:20], ensure_ascii=False),
        })
        if not ok:
            defects.append({"id": "Q-%02d" % (len(defects) + 1), "original_id": "AC-V7-11",
                            "title": "V6.1/V6.2 回归未全绿", "severity": "P0", "suite": "e2e",
                            "expected": "V6 组全部 PASS", "actual": "异常 %d 条" % len(legacy_bad),
                            "repro": "python qa/v6/e2e_v6.py --dist dist/rebuild-v7",
                            "evidence": "reports/v6/qa-e2e.json", "check_id": "AC-V7-11"})

    counts = {"PASS": 0, "FAIL": 0, "SKIP": 0}
    for c in checks:
        counts[c.get("status", "SKIP")] = counts.get(c.get("status", "SKIP"), 0) + 1
    p0 = [c for c in checks if c.get("severity") == "P0"]
    p0_exec = [c for c in p0 if c.get("status") != "SKIP"]
    p0_pass = [c for c in p0 if c.get("status") == "PASS"]
    p1 = [c for c in checks if c.get("severity") != "P0"]
    p0_fail = [c for c in p0 if c.get("status") == "FAIL"]
    p0_skip = [c for c in p0 if c.get("status") == "SKIP"]
    p1_fail = [c for c in p1 if c.get("status") == "FAIL"]
    skips = [c for c in checks if c.get("status") == "SKIP"]
    build_ok = results.get("build", {}).get("exit", 0) == 0
    engine_ok = results.get("engine", {}).get("exit", 0) == 0
    # 发布门：P0 全绿 + 构建/引擎通过 → PASS（P1 遗留单独列出，不阻塞发布）
    if p0_fail or not build_ok or not engine_ok:
        conclusion = "FAIL"
        publishable = False
    elif p0_skip or (len(p0_exec) < len(p0)):
        conclusion = "PARTIAL"
        publishable = False
    else:
        conclusion = "PASS"
        publishable = True

    # AC 矩阵
    ac_rows = []
    for ac in P0_ACS + P1_ACS:
        status, hits = ac_status(checks, ac)
        ev = ""
        if hits:
            h0 = [h for h in hits if h["status"] == "PASS"] or hits
            ev = "%s（%s）" % (h0[0].get("id"), h0[0].get("actual", "")[:40])
        ac_rows.append({"ac": ac, "text": AC_TEXT.get(ac, ""), "status": status,
                        "severity": "P0" if ac in P0_ACS else "P1", "evidence": ev})

    build_info = Q.build_info(dist)
    meta = {
        "generated_at": Q.now_str(),
        "dist": str(dist),
        "build": build_info,
        "env": {"python": sys.version.split()[0], "node": subprocess.run([NODE, "--version"], capture_output=True, text=True).stdout.strip()},
        "steps": {k: {"exit": v["exit"], "elapsed": v["elapsed"], "log": v["log"]} for k, v in results.items()},
        "final_mode": args.final,
    }

    # 写 MD
    lines = []
    lines.append("# 今晚飞行棋 V7 · QA 验收报告")
    lines.append("")
    lines.append("- 结论：**%s**" % conclusion)
    lines.append("- 是否可发布：**%s**（发布门 = P0 全绿 + 构建 --check + 引擎 0 failed）" %
                 ("可以发布" if publishable else "暂不可发布"))
    lines.append("- 本版规则（V6.1，V7 不回归）：结束 = **一方全部飞机到家**（快局 2 / 长夜 4）；"
                 "起飞 = 6 + **连续两次没掷出 6 后第 3 个回合任意点数保底**；"
                 "题卡数 / 心动值不再触发结束；回顾只写「<姓名> 先到家 / 已到家 X/Y」。")
    lines.append("- 本版画面（V7）：每回合电影镜头链（overview→roll→pov→chase→land→cell45→bear→return，5–8s）；"
                 "第一人称 POV + 第三人称跟拍 + 目标格发光 + 落地尘土；45° 格子剧场 CellStage + 随主题换装的小熊；"
                 "三主题 cloud/star/paper（门厅可选、刷新保持）；「快进」立即到终态；reduced 跳过 POV/跟拍与震动。")
    if p1_fail:
        lines.append("- P1 遗留（不阻塞发布）：%d 条，见第 2 节缺陷清单（severity=P1）" % len(p1_fail))
    lines.append("- 生成时间：%s" % meta["generated_at"])
    lines.append("- 构建产物：`%s`（index %s KB raw / %s KB gzip，sha256 %s）" %
                 (dist, round((build_info.get("raw") or 0) / 1024.0, 1),
                  round((build_info.get("gzip") or 0) / 1024.0, 1), build_info.get("sha256")))
    lines.append("- 环境：Python %s · Node %s · Playwright(chromium) channel=msedge headless" %
                 (meta["env"]["python"], meta["env"]["node"]))
    lines.append("- 视口：320×568 / 360×640 / 390×844 / 430×932；慢网 slow4G + 4×CPU（AR §4.2）")
    lines.append("")
    lines.append("## 1. 结论与统计")
    lines.append("")
    lines.append("| 指标 | 数值 |")
    lines.append("|---|---|")
    lines.append("| 结论 | **%s** |" % conclusion)
    lines.append("| 检查项 | PASS %d / FAIL %d / SKIP %d |" % (counts.get("PASS", 0), counts.get("FAIL", 0), counts.get("SKIP", 0)))
    lines.append("| P0 用例执行率 | %d/%d（%.0f%%） |" % (len(p0_exec), len(p0), 100.0 * len(p0_exec) / max(1, len(p0))))
    lines.append("| P0 通过 | %d/%d |" % (len(p0_pass), len(p0)))
    lines.append("| 缺陷 | P0 %d / 其他 %d |" % (
        len([d for d in defects if d.get("severity") == "P0"]),
        len([d for d in defects if d.get("severity") != "P0"])))
    lines.append("")
    lines.append("各步骤：")
    lines.append("")
    lines.append("| 步骤 | exit | 耗时(s) | 日志 |")
    lines.append("|---|---|---|---|")
    for k, v in results.items():
        lines.append("| %s | %s | %s | `%s` |" % (k, v["exit"], v["elapsed"], v["log"]))
    lines.append("")
    lines.append("## 2. 缺陷清单（按严重度）")
    lines.append("")
    if not defects:
        lines.append("无。")
    else:
        lines.append("| 编号 | 严重度 | 标题 | 期望 | 实际 | 复现 | 证据 |")
        lines.append("|---|---|---|---|---|---|---|")
        for d in sorted(defects, key=lambda x: (0 if x.get("severity") == "P0" else 1, x.get("id", ""))):
            lines.append("| **%s** | %s | %s | %s | %s | %s | %s |" % (
                d.get("id"), d.get("severity", ""), _esc(d.get("title", "")),
                _esc(d.get("expected", "")), _esc(d.get("actual", "")),
                _esc(d.get("repro", "")), _esc(d.get("evidence", ""))))
    lines.append("")
    lines.append("## 3. 验收标准覆盖矩阵")
    lines.append("")
    lines.append("| AC | 优先级 | 描述 | 状态 | 证据 |")
    lines.append("|---|---|---|---|---|")
    for r in ac_rows:
        lines.append("| %s | %s | %s | %s | %s |" % (
            r["ac"], r["severity"], _esc(r["text"]), r["status"], _esc(r["evidence"])))
    lines.append("")
    lines.append("## 4. 用例明细（按套件）")
    lines.append("")
    for name, data in suites.items():
        c = data.get("counts", {})
        lines.append("### %s · %s（PASS %s / FAIL %s / SKIP %s）" % (
            name, data.get("conclusion"), c.get("PASS", 0), c.get("FAIL", 0), c.get("SKIP", 0)))
        lines.append("")
        lines.append("| 用例 | AC | 视口 | 状态 | 期望 | 实际 |")
        lines.append("|---|---|---|---|---|---|")
        shown = 0
        for ck in data.get("checks", []):
            if ck.get("status") == "PASS" and shown > 80:
                continue
            shown += 1
            lines.append("| %s %s | %s | %s | **%s** | %s | %s |" % (
                ck.get("id"), _esc(ck.get("name", "")), _esc(ck.get("ac", "")),
                _esc(ck.get("viewport", "")), ck.get("status"),
                _esc(ck.get("expected", "")), _esc(ck.get("actual", ""))))
        lines.append("")
    lines.append("## 5. 回归清单（发布前每次执行）")
    lines.append("")
    lines.append("```powershell")
    lines.append("$py=\"C:\\Users\\xiaohu\\.dsh\\dsh-runtimes\\dsh-primary-runtime\\dependencies\\python\\python.exe\"")
    lines.append("$env:PYTHONIOENCODING='utf-8'; $env:PYTHONUTF8='1'")
    lines.append("& $py qa/v6/run_all.py --final")
    lines.append("```")
    lines.append("")
    lines.append("- V6.1 必跑（P0）：")
    lines.append("  - 主路径 `--only main`：注入「一方差一步全到家」→ 掷骰/选子到家 → `winner-text`「<姓名> 先到家」"
                 "→ 两张收尾卡 → 回顾 `ledger.ending=win-a` + `已到家 X/Y`（3 视口，点击 ≤22）。")
    lines.append("  - 起飞保底 `--only takeoff`：第 1/2 个自己的回合非 6 **不提前起飞**、第 3 个回合任意点数可起飞、"
                 "起飞后 / 掷 6 均清零、`takeoff-pity` 提示只跟随当前行动方。")
    lines.append("  - 结束判定 `--only notend`：题卡 20 张、心动值 100、长夜只 1 架到家 → 均**不**结束。")
    lines.append("  - 另一方先到家 `--only win`：`winnerId=b` 时文案与 `ledger.ending=win-b`。")
    lines.append("  - 旧档兼容 `--only legacy`：缺 `takeoffMiss` 补 `{a:0,b:0}` 可续玩；旧 `ending='shared'` "
                 "回顾写「今晚一起走到这里」。")
    lines.append("  - 全放过 `--only skip`：放过不惩罚 + 两张收尾卡都放过仍进回顾，明细写「今晚先放过」。")
    lines.append("- V6.2 必跑（P1，保留）：")
    lines.append("  - 机舱层 `--only cabin`：`[data-test=cabin]` 存在、`pointer-events:none`、Canvas≥1、"
                 "92 格 `elementFromPoint` 全部命中棋盘层（cinema/cell/cabin 0 拦截）；320/360/390/430 无横向溢出。")
    lines.append("  - 浮层 hit-test：题卡/安全词/暂停不被机舱层覆盖（CellStage z=320，低于暂停/安全词）。")
    lines.append("- V7 必跑（P0，新增）：")
    lines.append("  - 镜头链 `--only cinema`：`data-cinema-state` 依序出现 roll→pov→chase→land→cell45→bear→return；"
                 "roll 0.9–1.2s / pov 1.0–1.2s / chase 1.5–2.5s / land 0.4–0.6s / return 0.7–0.9s，全链 5–8s；"
                 "POV 前景（机翼/云/速度线）不透明度>0.5；跟拍 scale≥1.05 + 目标格光晕；落地 dust/ripple。")
    lines.append("  - 快进 `--only cinema`：roll/move 动画中 `[data-test=cinema-skip]` 可见可点，点按 ≤2.5s 到终态，"
                 "stats.log 中 pov/chase skipped=true。")
    lines.append("  - reduced `--only cinema`：设置开关下 `data-cinema-reduced=1`、无 transform、无 pov/chase、"
                 "CellStage `data-reduced=1` 且动画≤10ms；系统 prefers-reduced-motion 为 P1 观察项（当前未接入 Cinema）。")
    lines.append("  - 格子舞台 `--only cellstage`：CellStage 接管题卡（.cs-root 且无 .pc-root）；"
                 "做了/放过/命运二选一/收尾/功能格/小游戏入口/长文本滚动；45° 3D + 文字不倾斜；"
                 "小熊 data-test=bear 可见且 aria-hidden；做了/放过 ≥44px；安全词/暂停 hit-test；92 格不被拦截。")
    lines.append("  - 主题 `--only theme`：cloud/star/paper 三选一；html/body/table data-theme 与 CSS 变量；"
                 "刷新保持；cell-stage data-theme/outfit 与小熊 pilot/starlight/paper 换装；52 格拓扑不变。")
    lines.append("  - V7 响应式 `--only v7responsive`：320/360/390/430 门厅/主桌/长文本格子舞台无横向溢出；"
                 "卡片在视口内、按钮固定；92 格不被拦截。")
    lines.append("  - V6.1 全量回归：main/skip/takeoff/win/notend/legacy/resume/pause/minigame/fate/events/"
                 "responsive/offline/reduced 全组（V7 构建上复跑）。")
    lines.append("- 视觉：V7 主桌/格子舞台/三主题基线已重建（`--update-baseline` 后 `--only visual` 复核）；"
                 "截图前测试侧冻结场景（CabinScene reduced + CSS animation 暂停），不改产品行为；对比容差 1.5%。")
    lines.append("- 红线：安全词 7 屏可达（B4）、题卡 100% 人名（C1）、放过不阻断进军/全放过能收尾（C2/E3）、"
                 "边界 100 次抽题无命中（H5）、刷新续玩（A6）、断网开局（H3）。")
    lines.append("- 引擎：`node qa/rebuild/flight-engine.test.mjs` 0 failed（含 V6.1 §15/§20 全到家与保底用例）。")
    lines.append("- 构建：`python tools/rebuild/build_app.py --out dist/rebuild-v7 --strict --check` 退出 0（33 模块）。")
    lines.append("")
    lines.append("## 6. 偏差与遗留")
    lines.append("")
    notes = []
    for name, data in suites.items():
        for n in data.get("notes") or []:
            notes.append("[%s] %s" % (name, n))
    if notes:
        for n in notes:
            lines.append("- %s" % n)
    else:
        lines.append("- 无")
    lines.append("")
    lines.append("## 7. 证据（截图与原始 JSON）")
    lines.append("")
    lines.append("- E2E 截图：`qa/v6/shots/e2e/`")
    lines.append("- 视觉基线与实际：`reports/v6/visual/`")
    lines.append("- 原始 JSON：`reports/v6/qa-e2e.json`、`qa-perf.json`、`qa-visual.json`")
    lines.append("- 步骤日志：`reports/v6/logs/`")
    lines.append("")
    lines.append("> 说明：本报告只由 QA 生成，不改实现代码；缺陷编号 Q-xx 与各套件原始编号的映射见 JSON 的 original_id。")
    md_path = REPORTS / "qa-report.md"
    md_path.write_text("\n".join(lines), encoding="utf-8")
    final = {
        "conclusion": conclusion,
        "publishable": publishable,
        "meta": meta,
        "counts": counts,
        "p0": {"total": len(p0), "executed": len(p0_exec), "passed": len(p0_pass)},
        "checks": checks,
        "defects": defects,
        "ac_matrix": ac_rows,
        "suite_summaries": {k: {"conclusion": v.get("conclusion"), "counts": v.get("counts"),
                                "json": "reports/v6/%s" % {"e2e": "qa-e2e.json", "perf": "qa-perf.json",
                                                            "visual": "qa-visual.json"}[k]}
                            for k, v in suites.items()},
    }
    json_path = REPORTS / "qa-report.json"
    json_path.write_text(json.dumps(final, ensure_ascii=False, indent=2), encoding="utf-8")

    print("\n================ QA SUMMARY ================")
    print("结论: %s  可发布: %s" % (conclusion, "是" if publishable else "否"))
    print("检查: PASS %d / FAIL %d / SKIP %d" % (counts.get("PASS", 0), counts.get("FAIL", 0), counts.get("SKIP", 0)))
    print("P0 执行: %d/%d  P0 通过: %d" % (len(p0_exec), len(p0), len(p0_pass)))
    print("缺陷: %d（P0 %d / P1 %d）" % (len(defects),
                                        len([d for d in defects if d.get("severity") == "P0"]),
                                        len([d for d in defects if d.get("severity") != "P0"])))
    print("报告: %s" % md_path)
    for d in sorted(defects, key=lambda x: (0 if x.get("severity") == "P0" else 1, x.get("id", ""))):
        print("  [%s][%s] %s (%s)" % (d.get("severity"), d.get("id"), d.get("title"), d.get("suite")))
    print("============================================")
    if conclusion == "FAIL":
        sys.exit(1)
    if conclusion == "PARTIAL":
        sys.exit(2)


def _esc(s):
    return str(s if s is not None else "").replace("|", "\\|").replace("\n", " ")[:260]


if __name__ == "__main__":
    main()
