#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""今晚飞行棋 V6 · 视觉/结构回归（结构化断言 + 关键屏截图基线）。

覆盖：
- 结构化断言：data-square / data-piece / 状态条 / 回合名 / 题卡 kicker / 回顾统计；
- 关键屏截图：boot / table / prompt / ledger（390×844）；
- 基线：首次运行写 reports/v6/visual/baseline/*.png（gitignore），后续运行做像素对比
  （容差 1.5% 像素，允许时钟/动画微差）；`--update-baseline` 可显式重建基线。

用法：
  python qa/v6/visual.py
  python qa/v6/visual.py --update-baseline
产物：reports/v6/qa-visual.json / qa-visual.md；报告截图在 qa/v6/shots/visual/
"""
from __future__ import annotations

import argparse
import json
import pathlib
import sys
import time

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import qa_lib as Q  # noqa: E402
from qa_lib import Recorder  # noqa: E402
import e2e_v6 as E  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

BASELINE = Q.REPORTS / "visual" / "baseline"
ACTUAL = Q.REPORTS / "visual" / "actual"
SEED_JS = """(() => {
  let s = 20261116;
  const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  Math.random = rnd;
})();"""


def ensure_dirs():
    BASELINE.mkdir(parents=True, exist_ok=True)
    ACTUAL.mkdir(parents=True, exist_ok=True)


def grab(page, name, full_page=False):
    ensure_dirs()
    path = ACTUAL / ("%s.png" % name)
    page.screenshot(path=str(path), full_page=full_page, timeout=10000)
    return path


def compare_with_baseline(page, rec, name, full_page=False, tolerance=0.015):
    actual = grab(page, name, full_page=full_page)
    base = BASELINE / ("%s.png" % name)
    if not base.exists():
        import shutil
        shutil.copyfile(actual, base)
        rec.ok("VIS-BASE-%s" % name, "视觉基线 %s" % name, "首次运行生成基线",
               "baseline=%s" % base.relative_to(Q.ROOT), ac="视觉回归", severity="P1",
               evidence=str(actual.relative_to(Q.ROOT)))
        return
    try:
        from PIL import Image, ImageChops
        a = Image.open(actual).convert("RGB")
        b = Image.open(base).convert("RGB")
        if a.size != b.size:
            rec.fail("VIS-DIFF-%s" % name, "视觉基线 %s 尺寸一致" % name,
                     "尺寸 %s" % (b.size,), "实际 %s" % (a.size,), ac="视觉回归",
                     severity="P1", repro="python qa/v6/visual.py", evidence=str(actual.relative_to(Q.ROOT)))
            return
        diff = ImageChops.difference(a, b)
        # 逐像素最大通道差
        mask = diff.convert("L").point(lambda v: 255 if v > 24 else 0)
        changed = sum(1 for p in mask.getdata() if p)
        ratio = changed / float(a.size[0] * a.size[1])
        if ratio <= tolerance:
            rec.ok("VIS-DIFF-%s" % name, "视觉基线 %s 像素差 ≤%.1f%%" % (name, tolerance * 100),
                   "≤%.1f%%" % (tolerance * 100), "changed=%.3f%%（%d px）" % (ratio * 100, changed),
                   ac="视觉回归", severity="P1", evidence=str(actual.relative_to(Q.ROOT)))
        else:
            rec.fail("VIS-DIFF-%s" % name, "视觉基线 %s 像素差 ≤%.1f%%" % (name, tolerance * 100),
                     "≤%.1f%%" % (tolerance * 100), "changed=%.3f%%（%d px）" % (ratio * 100, changed),
                     ac="视觉回归", severity="P1", repro="python qa/v6/visual.py；对比 reports/v6/visual/{baseline,actual}/%s.png" % name,
                     evidence=str(actual.relative_to(Q.ROOT)))
    except Exception as e:  # noqa: BLE001
        rec.check("VIS-DIFF-%s" % name, "视觉基线 %s 对比" % name, "SKIP",
                  "可对比", "Pillow 对比失败：%s" % e, ac="视觉回归", severity="P1")


def assert_boot(page, rec):
    txt = Q.body_text(page)
    checks = [
        ("data-test=boot 根节点", page.locator("[data-test='boot']").count() >= 1),
        ("模式卡 2 个", page.locator("[data-mode]").count() == 2),
        ("尺度卡 4 个", page.locator("[data-scale]").count() == 4),
        ("开始按钮可见", Q.exists(page, ["test:start"], timeout=2000)),
        ("规则速览入口", Q.exists(page, ["test:rules-open"], timeout=800)),
        ("以前的夜入口", Q.exists(page, ["test:go-nights"], timeout=800)),
        ("安全词常驻", Q.exists(page, ["test:safety-word"], timeout=800)),
    ]
    for name, ok in checks:
        if ok:
            rec.ok("VIS-BOOT-%s" % name, "门厅结构：%s" % name, "存在/数量正确", "通过",
                   ac="visual", severity="P1", viewport="390x844")
        else:
            rec.fail("VIS-BOOT-%s" % name, "门厅结构：%s" % name, "存在/数量正确", "缺失",
                     ac="visual", severity="P1", viewport="390x844",
                     repro="打开 390×844 门厅→检查结构")
    if "今晚" in txt and "飞行棋" in txt:
        rec.ok("VIS-BOOT-title", "门厅标题「今晚/飞行棋」", "可见", "命中", ac="visual",
               severity="P1", viewport="390x844")
    else:
        rec.fail("VIS-BOOT-title", "门厅标题「今晚/飞行棋」", "可见", "未命中", ac="visual",
                 severity="P1", viewport="390x844", repro="打开门厅→读取标题")


def assert_table(page, rec):
    sq = page.locator("[data-square]")
    pieces = page.locator(".bv-piece[data-piece]")
    if pieces.count() == 0:
        pieces = page.locator("[data-piece]")
    n_sq = sq.count()
    n_pc = pieces.count()
    sess = Q.get_session(page) or {}
    plane_count = int(sess.get("planeCount") or 2)
    expected_pc = plane_count * 2  # 2 位玩家各 planeCount 架（快局 2 架/人 = 共 4 架）
    if n_sq >= 52:
        rec.ok("VIS-TABLE-squares", "棋盘格位 ≥52", "≥52", "squares=%d" % n_sq,
               ac="B7/B8", severity="P1", viewport="390x844")
    else:
        rec.fail("VIS-TABLE-squares", "棋盘格位 ≥52", "≥52", "squares=%d" % n_sq,
                 ac="B7/B8", severity="P1", viewport="390x844",
                 repro="进入主桌→统计 [data-square]")
    # 92 = ring 52 + hangar 16 + home 24（含 goal）
    counts = page.evaluate(
        """() => ({
            ring: document.querySelectorAll('[data-square^="ring:"]').length,
            hangar: document.querySelectorAll('[data-square^="hangar:"]').length,
            home: document.querySelectorAll('[data-square^="home:"]').length,
            goal: document.querySelectorAll('[data-square-type="goal"]').length
        })"""
    )
    if counts.get("ring") == 52 and counts.get("hangar") == 16 and counts.get("home") == 24:
        rec.ok("VIS-TABLE-squares-92", "棋盘 92 格结构（52 环+16 机坪+24 航线）", "52/16/24",
               json.dumps(counts, ensure_ascii=False), ac="B7/B8", severity="P1", viewport="390x844")
    else:
        rec.fail("VIS-TABLE-squares-92", "棋盘 92 格结构（52 环+16 机坪+24 航线）", "52/16/24",
                 json.dumps(counts, ensure_ascii=False), ac="B7/B8", severity="P1",
                 viewport="390x844", repro="进入主桌→统计 data-square 前缀")
    if n_pc == expected_pc:
        rec.ok("VIS-TABLE-pieces", "快局棋子数 %d（%d 架/人 ×2）" % (expected_pc, plane_count),
               "%d" % expected_pc, "pieces=%d mode=%s" % (n_pc, sess.get("mode")),
               ac="B6", severity="P1", viewport="390x844")
    else:
        rec.fail("VIS-TABLE-pieces", "快局棋子数 %d" % expected_pc, "%d" % expected_pc,
                 "pieces=%d mode=%s planeCount=%s" % (n_pc, sess.get("mode"), sess.get("planeCount")),
                 ac="B6", severity="P1", viewport="390x844",
                 repro="快局进入主桌→统计 [data-piece]")
    for test, name in (("status-cards", "状态条·张数"), ("status-heat", "状态条·心动值"),
                       ("status-streak", "状态条·连击"), ("turn-name", "回合名"),
                       ("die-text", "骰子文本"), ("roll", "掷骰按钮"),
                       ("pause", "暂停按钮"), ("rules", "规则按钮")):
        loc, _ = Q.find(page, ['test:%s' % test], timeout=2000)
        if loc is not None:
            rec.ok("VIS-TABLE-%s" % test, "主桌结构：%s" % name, "可见", "通过",
                   ac="visual", severity="P1", viewport="390x844")
        else:
            rec.fail("VIS-TABLE-%s" % test, "主桌结构：%s" % name, "可见", "缺失",
                     ac="visual", severity="P1", viewport="390x844",
                     repro="进入主桌→检查 [data-test=%s]" % test)
    # 棋盘类型可读（图例面板/行列）
    if Q.exists(page, ["[data-legend]", "test:board-legend"], timeout=800):
        rec.ok("VIS-TABLE-legend-panel", "棋盘图例行/入口存在", "存在", "通过", ac="B8",
               severity="P1", viewport="390x844")
    else:
        rec.fail("VIS-TABLE-legend-panel", "棋盘图例行/入口存在", "存在", "缺失", ac="B8",
                 severity="P1", viewport="390x844", repro="主桌→检查图例面板")
    # 中心热环 / 连击 / 回合（fe-board 口径）
    for test, name, must in (("board-heat", "中心热环", ("心动温度", "°")),
                             ("board-streak", "中心连击", ("连击",)),
                             ("board-turn", "棋盘回合(读屏)", ("的回合",))):
        loc, _ = Q.find(page, ["test:%s" % test], timeout=1500)
        if loc is not None:
            txt = (loc.inner_text() or "").replace("\n", " ")
            if all(m in txt for m in must):
                rec.ok("VIS-BOARD-%s" % test, "棋盘结构：%s" % name, "含 %s" % (must,), txt[:80],
                       ac="B6", severity="P1", viewport="390x844")
            else:
                rec.fail("VIS-BOARD-%s" % test, "棋盘结构：%s" % name, "含 %s" % (must,),
                         txt[:80], ac="B6", severity="P1", viewport="390x844",
                         repro="主桌→读取 [data-test=%s]" % test)
        else:
            rec.fail("VIS-BOARD-%s" % test, "棋盘结构：%s" % name, "存在", "缺失", ac="B6",
                     severity="P1", viewport="390x844",
                     repro="主桌→查找 [data-test=%s]" % test)


def assert_prompt(page, rec, names):
    dom = E.prompt_dom(page)
    if not dom:
        rec.fail("VIS-PROMPT-visible", "题卡可见", "pc-root", "未找到", ac="C1",
                 severity="P1", viewport="390x844", repro="进入题卡→检查 .pc-root")
        return
    text = dom.get("text") or ""
    kicker = page.locator("[data-test='prompt-kicker']")
    ktxt = kicker.first.inner_text() if kicker.count() else ""
    if any(n in ktxt for n in names) or "两人一起" in ktxt or "这张给你们俩" in ktxt:
        rec.ok("VIS-PROMPT-actor", "题卡 kicker 含归属", "含姓名/两人一起", ktxt.replace("\n", " "),
               ac="C1", severity="P1", viewport="390x844")
    else:
        rec.fail("VIS-PROMPT-actor", "题卡 kicker 含归属", "含姓名/两人一起", ktxt[:80],
                 ac="C1", severity="P1", viewport="390x844", repro="题卡出现→读取 kicker")
    for test, name in (("prompt-done", "做了"), ("prompt-skip", "放过"),
                       ("prompt-collapse", "先看棋盘"), ("prompt-stars", "星级")):
        loc = page.locator('[data-test="%s"]' % test)
        if loc.count() and loc.first.is_visible():
            rec.ok("VIS-PROMPT-%s" % test, "题卡结构：%s" % name, "可见", "通过",
                   ac="visual", severity="P1", viewport="390x844")
        else:
            rec.fail("VIS-PROMPT-%s" % test, "题卡结构：%s" % name, "可见", "缺失",
                     ac="visual", severity="P1", viewport="390x844",
                     repro="题卡出现→检查 [data-test=%s]" % test)
    fs = page.evaluate(
        """() => {
            var el = document.querySelector('[data-test="prompt-text"]');
            return el ? parseFloat(getComputedStyle(el).fontSize) : null;
        }"""
    )
    if fs and fs >= 15:
        rec.ok("VIS-PROMPT-font", "题卡正文 ≥15px", "≥15px", "%.1fpx" % fs, ac="H4-2",
               severity="P1", viewport="390x844")
    else:
        rec.fail("VIS-PROMPT-font", "题卡正文 ≥15px", "≥15px", "fontSize=%s" % fs, ac="H4-2",
                 severity="P1", viewport="390x844", repro="题卡出现→读 computed font-size")


def assert_ledger(page, rec, names):
    txt = Q.body_text(page)
    title = page.locator("[data-test='ledger-title']")
    if title.count() and "今晚回顾" in title.first.inner_text():
        rec.ok("VIS-LEDGER-title", "回顾标题", "今晚回顾", "命中", ac="F2", severity="P1",
               viewport="390x844")
    else:
        rec.fail("VIS-LEDGER-title", "回顾标题", "今晚回顾", "未命中", ac="F2",
                 severity="P1", viewport="390x844", repro="进入回顾页→读标题")
    for test, name in (("ledger-subtitle", "日期+姓名"), ("ledger-stats", "6 项统计"),
                       ("ledger-prompt", "题卡明细"), ("ledger-save", "保存按钮"),
                       ("again-night", "再开一夜")):
        loc = page.locator('[data-test="%s"]' % test)
        if loc.count():
            rec.ok("VIS-LEDGER-%s" % test, "回顾结构：%s" % name, "存在", "通过",
                   ac="F2/F3", severity="P1", viewport="390x844")
        else:
            rec.fail("VIS-LEDGER-%s" % test, "回顾结构：%s" % name, "存在", "缺失",
                     ac="F2/F3", severity="P1", viewport="390x844",
                     repro="进入回顾页→检查 [data-test=%s]" % test)
    if "（这一笔没有句子）" in txt:
        rec.fail("VIS-LEDGER-placeholder", "回顾无占位文案", "无", "出现占位文案", ac="F2",
                 severity="P1", viewport="390x844", repro="进入回顾页→读取文本")
    else:
        rec.ok("VIS-LEDGER-placeholder", "回顾无占位文案", "无", "无", ac="F2",
               severity="P1", viewport="390x844")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default=str(Q.DEFAULT_DIST))
    ap.add_argument("--update-baseline", action="store_true")
    ap.add_argument("--json", default="qa-visual")
    args = ap.parse_args()
    dist = pathlib.Path(args.dist)
    if not (dist / "index.html").exists():
        print("[FATAL] 找不到 %s/index.html" % dist)
        sys.exit(1)
    ensure_dirs()
    if args.update_baseline:
        for p in BASELINE.glob("*.png"):
            p.unlink()

    rec = Recorder("visual", meta={
        "dist": str(dist),
        "build": Q.build_info(dist),
        "viewport": "390x844",
        "seed": "Math.random 固定序列 20261116",
        "baseline": str(BASELINE.relative_to(Q.ROOT)),
    })
    with Q.serve(dist) as base:
        with sync_playwright() as pw:
            browser = Q.launch_browser(pw)
            try:
                ctx = Q.new_context(browser, viewport=(390, 844), dsf=2, init_script=SEED_JS)
                page = ctx.new_page()
                ps = Q.PageSession(ctx, page)
                page.goto(base, wait_until="domcontentloaded", timeout=30000)
                Q.ensure_boot(page, rec, timeout=15000)
                # 规则层可能首次出现，先按 e2e 逻辑处理
                if "玩法速览" in Q.body_text(page):
                    Q.try_click(page, ["role:button:/知道了/"], timeout=2500)
                    page.wait_for_timeout(400)
                print("[VISUAL] boot")
                assert_boot(page, rec)
                compare_with_baseline(page, rec, "boot", full_page=True)

                # 进入主桌
                Q.try_click(page, ["test:mode-quick"], timeout=1200)
                Q.fill_names(page, E.NAMES)
                Q.try_click(page, ["test:start"], timeout=6000)
                screen = Q.wait_screen(page, ["table"], timeout=9000)
                if screen != "table":
                    rec.fail("VIS-TABLE-entry", "进入主桌", "data-screen=table", "screen=%r" % screen,
                             ac="visual", severity="P1", viewport="390x844",
                             repro="门厅点开始→读取 data-screen")
                    raise SystemExit(1)
                page.wait_for_timeout(1200)
                print("[VISUAL] table")
                assert_table(page, rec)
                compare_with_baseline(page, rec, "table", full_page=False)

                # 驱动到第一张题卡
                drv = E.TableDriver(ps, rec, "390x844", names=E.NAMES,
                                    prompt_outcome="done", minigame_outcome="skip", max_steps=60,
                                    target_kinds=["truth", "dare", "touch"])
                reached = False
                guard = 0
                while guard < 60:
                    guard += 1
                    sess = Q.get_session(page) or {}
                    aw = (sess.get("awaiting") or {}).get("type")
                    if aw in ("prompt", "ending-prompt"):
                        reached = True
                        break
                    if aw == "minigame":
                        Q.try_click(page, ["test:mini-skip", "role:button:/这次先跳过/"], timeout=2000)
                        page.wait_for_timeout(600)
                        continue
                    if aw in ("roll", "choose-piece") or aw is None:
                        r = drv.step()
                        if r == "stuck":
                            break
                        page.wait_for_timeout(300)
                        continue
                    page.wait_for_timeout(250)
                if reached:
                    # 等题卡真正挂上（board 动画结束后才 open）
                    Q.find(page, ["test:prompt-card", ".pc-root"], timeout=8000)
                    page.wait_for_timeout(500)
                    print("[VISUAL] prompt")
                    assert_prompt(page, rec, E.NAMES)
                    compare_with_baseline(page, rec, "prompt", full_page=False)
                    # 处理这张卡，保证能进入回顾
                    s = Q.get_session(page) or {}
                    aw = s.get("awaiting") or {}
                    if aw.get("type") in ("prompt", "ending-prompt"):
                        if aw.get("prompt", {}).get("kind") == "fate":
                            Q.try_click(page, ["test:prompt-fate-option"], timeout=2000)
                        else:
                            Q.try_click(page, ["test:prompt-done"], timeout=3000)
                        page.wait_for_timeout(1200)
                else:
                    rec.skip("VIS-PROMPT-skip", "驱动到题卡", "未在步数内落到题格（依赖骰子）",
                             ac="visual", severity="P1")

                # 用「暂停→今晚就到这」进入回顾（不依赖打完 4 张）
                page.wait_for_timeout(600)
                safety, _ = Q.find(page, E.SEL["safety"], timeout=3000)
                got_ledger = False
                if safety is not None and Q.get_session(page):
                    Q.safe_longpress(page, safety, hold_ms=1700)
                    if Q.wait_screen(page, ["pause"], timeout=3000) == "pause":
                        Q.try_click(page, E.SEL["pause_end"], timeout=2500)
                        page.wait_for_timeout(500)
                        if Q.exists(page, E.SEL["pause_confirm"], timeout=1000):
                            Q.try_click(page, E.SEL["pause_confirm"], timeout=2500)
                        Q.wait_screen(page, ["ledger"], timeout=9000)
                        got_ledger = Q.screen_name(page) == "ledger"
                if got_ledger:
                    page.wait_for_timeout(800)
                    print("[VISUAL] ledger")
                    assert_ledger(page, rec, E.NAMES)
                    compare_with_baseline(page, rec, "ledger", full_page=True)
                else:
                    rec.skip("VIS-LEDGER-entry", "进入回顾", "无法通过暂停路径进入回顾",
                             ac="F2", severity="P1")
                # 错误
                if ps.pageerrors or ps.console_errors:
                    rec.fail("VIS-ERRORS", "视觉路径无 JS 错误", "0/0",
                             json.dumps({"pageerrors": ps.pageerrors[:3],
                                         "console_errors": ps.console_errors[:3]}, ensure_ascii=False),
                             ac="H6", severity="P1", viewport="390x844",
                             repro="跑视觉路径→读控制台")
                else:
                    rec.ok("VIS-ERRORS", "视觉路径无 JS 错误", "0/0", "0/0", ac="H6",
                           severity="P1", viewport="390x844")
                ctx.close()
            finally:
                browser.close()

    extra = ["## 基线", "",
             "- 基线目录：`%s`（gitignore，首次运行生成）" % BASELINE.relative_to(Q.ROOT),
             "- 实际截图：`%s`" % ACTUAL.relative_to(Q.ROOT),
             "- 对比容差：1.5% 像素（单通道差 >24 计为变化）",
             "- 随机数已固定（seed=20261116），题卡/骰子可复现",
             ""]
    json_path, md_path = Q.write_suite_report(rec, args.json, extra_md=extra)
    counts = rec.counts()
    print("\n[VISUAL] %s PASS=%d FAIL=%d SKIP=%d" %
          (rec.conclusion(), counts.get("PASS", 0), counts.get("FAIL", 0), counts.get("SKIP", 0)))
    print("[VISUAL] report: %s" % md_path)
    if rec.conclusion() == "FAIL":
        sys.exit(1)
    if rec.conclusion() == "PARTIAL":
        sys.exit(2)


if __name__ == "__main__":
    main()
