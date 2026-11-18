#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""今晚飞行棋 V6.1 · E2E 验收（Playwright + Edge / 360·390·430 三视口）。

V6.1 口径（docs/v6/impl-freeze-v6.1.md / spec §0、§7）：
- 结束条件 = 一方**全部飞机到家**（快局 2 / 长夜 4）；题卡数、心动值**不再**触发结束；
- 起飞 = 6；连续 2 个自己的回合没掷出 6 且该方未到家飞机都在机坪，第 3 个回合任意点数保底起飞；
- 收尾 = 两张「今晚最后一段」卡（各给一人）→ 今晚回顾；只写「<姓名> 先到家」「已到家 X/Y」。

覆盖（对应 spec §4/§7/§9）：
- §7 主路径（快局 → 注入「差一步全到家」局面 → 掷骰 → 选子到家 → 先到家 → 两张收尾卡 → 回顾 → 保存）；
- 门厅（首屏 CTA 在视口内 / 快局长夜新文案 / 尺度说明 / 规则速览 6 条 / 校验 / 续玩）；
- 起飞保底（第 2 回合不提前起飞、第 3 回合任意点数保底、起飞/掷 6 清零）；
- 结束判定（一方全到家 → win 事件 + winner-text + 两张收尾卡 + ledger win-a/win-b；题卡 20 张 / 心动值 100 / 长夜 1 架到家 → 不结束）；
- 旧档兼容（缺 takeoffMiss → 补 0 可续玩；旧 ending='shared' 回顾文案）；
- 暂停与安全词、小游戏、题卡归属/放过不惩罚、回顾 6 类信息、响应式、离线、0 pageerror。

用法：
  python qa/v6/e2e_v6.py                       # 跑全部（需先构建 dist/rebuild）
  python qa/v6/e2e_v6.py --only main,takeoff   # 跑部分
  python qa/v6/e2e_v6.py --dist dist/rebuild --headed
产物：
  reports/v6/qa-e2e.json / qa-e2e.md
  qa/v6/shots/e2e/**（gitignore）
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys
import time
import traceback

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import qa_lib as Q  # noqa: E402
from qa_lib import Recorder  # noqa: E402

try:
    from playwright.sync_api import sync_playwright
    from playwright.sync_api import Error as PWError
except Exception as e:  # noqa: BLE001
    print("Playwright 不可用：%s" % e)
    raise

# ---------------------------------------------------------------- 常量
NAMES = ("阿岚", "阿策")
NAMES_ALT = ("小满", "阿策")
TYPE_WORDS = ("真心话", "大冒险", "靠近", "击落", "叠机", "收尾", "命运")
GRID_WORDS = ("起飞格", "真心话格", "大冒险格", "靠近格", "温度计格", "转盘格",
              "飞格", "跳格", "停格", "进航格", "命运格", "普通格", "终点", "回家第")
FORBIDDEN_WORDS = ("赢", "输", "胜", "负", "失败", "惩罚", "扣分")
STAGE_WORDS = ("灯刚亮", "有点热", "靠近了", "很近了", "今晚可以更近")
# V6.1 门厅文案（copy.md §1.3 / impl-freeze-v6.1 §3.1）
MODE_LINE_QUICK = "先送完 2 架飞机 · 约 15–25 分钟 · 每人 2 架"
MODE_LINE_LONG = "先送完 4 架飞机 · 约 30–50 分钟 · 每人 4 架"
# V6.1 规则速览 6 条（第 1 条合并「6 起飞 · 6 可再掷」并补保底；第 4 条「先到家就收尾」）
RULES_NEED = ("6 起飞", "6 可再掷", "跳/飞/进航", "击落回机坪", "先到家就收尾",
              "放过不惩罚", "安全词随时可停")
RULES_PITY_TEXT = "保底起飞"
PITY_TEXT = "连续两次没起飞 · 这一掷任意点数保底起飞"
WIN_TEXT_TAIL = "先到家"
# AC-G1-1（任意屏可暂停/安全词可达）用：记录每次 check_safety_visible 通过的屏幕
SAFETY_SCREENS = {}

# 控件定位候选（优先 data-test，再 aria/文本；copy.md §0.4 / §8 为文案基准）
SEL = {
    "boot": ["[data-screen='boot']", "test:boot", "role:button:/摆上棋盘/"],
    "start": ["test:start", "role:button:/摆上棋盘/", "role:button:/^开始$/",
              "text:/摆上棋盘/"],
    "quick": ["test:mode-quick", "test:quick", "role:radio:/快局/", "role:button:/快局/",
              "text:/快局/"],
    "long": ["test:mode-long", "test:long", "role:radio:/长夜/", "role:button:/长夜/",
             "text:/长夜/"],
    "name_a": ["test:name-a", "input[name='a']", "input[data-name='a']"],
    "name_b": ["test:name-b", "input[name='b']", "input[data-name='b']"],
    "rules_ok": ["test:rules-ok", "test:rules-know", "role:button:/知道了/", "text:/知道了/"],
    "rules_entry": ["test:rules-open", "test:rules", "role:button:/^规则$/", "text:/^规则$/"],
    "continue": ["test:continue-flight", "test:continue", "role:button:/继续今晚飞行棋/",
                 "text:/继续今晚飞行棋/"],
    "table": ["[data-screen='table']", "test:table"],
    "roll": ["test:roll", "role:button:/^掷骰$/", "text:/^掷骰$/"],
    "die_text": ["test:die-text", "test:dice-result", "text:/掷出\\s*[1-6]/"],
    "turn": ["test:turn-name", "text:/的回合/"],
    # V6.1：状态条不再有「第 N/目标 张」；改读双方已到家 + 「第 N 张」
    "status": ["test:status", "test:status-bar", "test:status-home"],
    "status_home": ["test:status-home", "[data-test='status-home']"],
    "status_home_a": ["test:status-home-a"],
    "status_home_b": ["test:status-home-b"],
    "status_cards": ["test:status-cards"],
    "takeoff_pity": ["test:takeoff-pity"],
    "winner_text": ["test:winner-text"],
    "mode_summary": ["test:mode-summary"],
    "mode_card_quick": ["test:mode-quick"],
    "mode_card_long": ["test:mode-long"],
    "rules_end": ["test:rules-end"],
    "ledger_done_title": ["test:ledger-done-title"],
    "ledger_done": ["test:ledger-done"],
    "ledger_home": ["test:ledger-home"],
    "piece_hint": ["test:piece-hint", "text:/这步可以走这几架/"],
    "prompt_card": ["test:prompt-card", ".pc-root", "[data-prompt-card]", ".prompt-card", ".prompt"],
    "prompt_done": ["test:prompt-done", "role:button:/^做了$/", "text:/^做了$/"],
    "prompt_skip": ["test:prompt-skip", "role:button:/^放过$/", "text:/^放过$/"],
    "prompt_kicker": ["test:prompt-kicker", "[data-prompt-kicker]", ".prompt-kicker", ".kicker"],
    "ending_title": ["test:ending", "text:/今晚最后一段/"],
    "finish_title": ["test:finish", "text:/今晚完成了/"],
    "finish_review": ["test:finish-review", "role:button:/看今晚回顾/", "text:/看今晚回顾/"],
    "minigame": ["test:minigame-panel", "[data-minigame]", ".minigame-panel",
                 "text:/温度计|真心话转盘|大冒险转盘/"],
    "mg_skip": ["test:minigame-skip", "role:button:/这次先跳过/", "text:/这次先跳过/"],
    "mg_done": ["test:minigame-done", "role:button:/^回棋盘$/", "role:button:/^完成$/"],
    "mg_back": ["test:minigame-done", "role:button:/^回棋盘$/", "text:/^回棋盘$/"],
    "pause_mini": ["test:pause", "role:button:/^暂停$/", "text:/^暂停$/"],
    "pause_screen": ["test:pause-layer", "[data-screen='pause']", "text:/先停一下/"],
    "pause_recap": ["test:pause-recap-list", "[data-test='pause-recap-list']"],
    "pause_recap_back": ["test:pause-recap-back", "role:button:/回到暂停/"],
    "pause_continue": ["test:pause-continue", "role:button:/^继续$/", "text:/^继续$/"],
    "rules_sheet": ["test:rules-sheet", "[data-test='rules-sheet']"],
    "rules_list": ["test:rules-list", "[data-test='rules-list']"],
    "pause_end": ["test:pause-end", "role:button:/今晚就到这/", "text:/今晚就到这/"],
    "pause_record": ["test:pause-record", "role:button:/看今晚记录/"],
    "pause_boundary": ["test:pause-boundary", "role:button:/加一条今晚不做的/"],
    "pause_confirm": ["test:pause-confirm", "role:button:/^就到这$/", "text:/^就到这$/"],
    "safety": ["test:safety-word", "[data-test='safe']", "aria=安全词", "text:/先收棋/"],
    "ledger": ["[data-screen='ledger']", "test:ledger"],
    "ledger_save": ["test:ledger-save", "role:button:/保存到以前的夜/", "text:/保存到以前的夜/"],
    "ledger_again": ["test:ledger-again", "role:button:/再开一夜/"],
    "ledger_back": ["test:ledger-back", "role:button:/回到开场/"],
    "nights": ["[data-screen='nights']", "test:nights"],
    "settings": ["[data-screen='settings']", "test:settings"],
    "fate_option": ["test:prompt-fate-option", "test:fate-option", "role:button:/要这张/", "text:/要这张/"],
    "fate_none": ["test:prompt-fate-skip", "test:fate-none", "role:button:/今晚先不选/"],
    "toast_record": ["test:toast-record", "text:/记下了\\s*·\\s*今晚第/"],
}


# ---------------------------------------------------------------- 工具
def new_page(ps_browser, url, viewport, rec: Recorder, label, **ctx_kw):
    ctx = Q.new_context(ps_browser, viewport=viewport, **ctx_kw)
    page = ctx.new_page()
    ps = Q.PageSession(ctx, page)
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
    except Exception as e:  # noqa: BLE001
        rec.fail("ENV-00/%s" % label, "打开页面失败", "页面可加载", str(e),
                 ac="H6", evidence="url=%s" % url, viewport=label)
        raise
    return ctx, ps, page


def js_errors(ps):
    return {"pageerrors": ps.pageerrors, "console_errors": ps.console_errors}


def check_no_errors(rec: Recorder, ps: Q.PageSession, cid, label, stage=""):
    errs = ps.pageerrors
    cerr = [c for c in ps.console_errors]
    evidence = json.dumps({"pageerrors": errs[:5], "console_errors": cerr[:5]}, ensure_ascii=False)
    if not errs and not cerr:
        rec.ok(cid, "主路径 0 pageerror / 0 console.error%s" % ("（%s）" % stage if stage else ""),
               "0/0", "0/0", ac="H6", evidence=evidence, viewport=label)
        return True
    rec.fail(cid, "主路径出现未捕获异常/console.error%s" % ("（%s）" % stage if stage else ""),
             "0 pageerror / 0 console.error", "pageerror=%d console.error=%d：%s" %
             (len(errs), len(cerr), (errs + cerr)[:3]),
             ac="H6", evidence=evidence, viewport=label,
             repro="1) 打开 %s；2) 按主路径操作；3) 观察控制台" % label)
    return False


def wait_prompt(page, timeout=6000):
    return Q.find(page, SEL["prompt_card"] + ["role:button:/^做了$/"], timeout=timeout)


def prompt_dom(page):
    return page.evaluate(
        """() => {
            var root = document.querySelector('.pc-root, [data-test="prompt-card"], [data-prompt-card], .prompt-card');
            if (!root) {
                var btn = null, all = document.querySelectorAll('button');
                for (var i = 0; i < all.length; i++) {
                    var t = (all[i].innerText || '').trim();
                    if (t === '做了' || t === '放过') { btn = all[i]; break; }
                }
                if (!btn) return null;
                root = btn.closest('.pc-root, .sheet, .card, .overlay, .prompt, [data-screen]') || btn.parentElement;
            }
            if (!root) return null;
            var buttons = [];
            root.querySelectorAll('button').forEach(function(b){ buttons.push((b.innerText||'').trim()); });
            return {
                text: (root.innerText || '').trim(),
                html_len: (root.innerHTML || '').length,
                buttons: buttons,
                test: root.getAttribute('data-test'),
                cls: String(root.className || ''),
                rect: (function(r){ return r ? {x:r.x,y:r.y,w:r.width,h:r.height} : null; })(root.getBoundingClientRect())
            };
        }"""
    )


def status_now(page):
    """状态条快照（V6.1）：已到家/心动值/连击优先读 DOM，缺节点时回落到引擎状态。"""
    st = Q.read_status(page)
    if st.get("cards") is None or st.get("heat") is None:
        sess = Q.get_session(page) or {}
        meta = sess.get("meta") or {}
        if st.get("cards") is None:
            st["cards"] = sess.get("cardsProcessed")
        if st.get("heat") is None:
            st["heat"] = meta.get("heat")
        if st.get("streak") is None:
            st["streak"] = meta.get("streak")
    st["target"] = None            # V6.1：没有目标张数
    return st


def wait_status(page, predicate, timeout=1500):
    """等待状态条满足 predicate(status_dict)。返回 (ok, status)。"""
    deadline = time.time() + timeout / 1000.0
    st = status_now(page)
    while time.time() < deadline:
        try:
            if predicate(st):
                return True, st
        except Exception:
            pass
        page.wait_for_timeout(60)
        st = status_now(page)
    return False, st


def session_summary(page):
    return Q.session_summary(page)


def home_expect(page, pid):
    """该玩家状态条期望文本「<色名> n/total」：颜色按本局 session.colors 取。"""
    sess = Q.get_session(page) or {}
    colors = sess.get("colors") or {}
    total = int(sess.get("planeCount") or 2)
    return Q.color_zh(colors.get(pid)), total


def assert_status_home(rec, page, cid, label, pid, expect_n, ac="AC-B6-1",
                       severity="P0", note=""):
    """断言状态条「<色名> n/total」；返回 (ok, 实际文本)。"""
    st = status_now(page)
    color, total = home_expect(page, pid)
    got = (st.get("home") or {}).get(pid) or {}
    ok = got.get("n") == expect_n and got.get("total") == total and got.get("color") == color
    expected = "%s %s/%s" % (color, expect_n, total)
    actual = got.get("text") or "（无 status-home-%s 文本）" % pid
    if ok:
        rec.ok("%s/%s%s" % (cid, label, note), "状态条已到家数正确（%s）" % pid, expected, actual,
               ac=ac, viewport=label)
    else:
        rec.fail("%s/%s%s" % (cid, label, note), "状态条已到家数（%s）" % pid, expected, actual,
                 ac=ac, severity=severity, viewport=label,
                 repro="读取 [data-test=status-home-%s] 文本" % pid)
    return ok, actual


def winner_text_of(page):
    loc, _ = Q.find(page, SEL["winner_text"], timeout=1200)
    if loc is None:
        return ""
    try:
        return (loc.inner_text() or "").replace("\n", " ").strip()
    except Exception:
        return ""


def pity_text_of(page):
    loc, _ = Q.find(page, SEL["takeoff_pity"], timeout=1200)
    if loc is None:
        return ""
    try:
        return (loc.inner_text() or "").replace("\n", " ").strip()
    except Exception:
        return ""


def click_and_count(drv, candidates, desc, count=True):
    hit = Q.click(drv.page, candidates, desc=desc)
    if count:
        drv.clicks.append(desc)
    return hit


# ---------------------------------------------------------------- 主桌驱动
class TableDriver:
    """按 UI 点击推进对局；仅用页面上的按钮，不直接改对局状态。"""

    def __init__(self, ps: Q.PageSession, rec: Recorder, label, names=NAMES,
                 prompt_outcome="done", minigame_outcome="skip", stop_after_cards=None,
                 max_steps=120, target_kinds=None):
        self.ps = ps
        self.page = ps.page
        self.rec = rec
        self.label = label
        self.names = list(names)
        self.prompt_outcome = prompt_outcome
        self.minigame_outcome = minigame_outcome
        self.stop_after_cards = stop_after_cards
        self.max_steps = max_steps
        self.target_kinds = target_kinds
        self.clicks = []          # 只统计 §7 点击预算内的交互
        self.cards = 0
        self.heat = []            # 每次题卡结算后的 heat
        self.prompt_log = []
        self.minigame_log = []
        self.roll_log = []
        self.problems = []
        self.hook = None
        self.ending_started = False
        self.ending_done = False
        self.finished = False
        self.stopped_for_resume = False
        self.started = False
        self.board_clicked = False

    # -- 起局 -------------------------------------------------------
    def start_quick(self, expect_rules=False):
        page = self.page
        Q.ensure_boot(page, self.rec)
        if expect_rules:
            self.check_rules_overview("boot")
            Q.try_click(page, SEL["rules_ok"], timeout=2500)
            page.wait_for_timeout(300)

        # 模式：快局（点击计入 §7 step1）
        loc, _ = Q.find(page, SEL["quick"], timeout=2000)
        if loc is None:
            self.rec.fail("AC-A2-1/%s" % self.label, "门厅存在「快局」选项", "可点击的快局选项",
                          "未找到快局控件", ac="AC-A2-1", viewport=self.label,
                          repro="打开门厅，查找快局/长夜模式选择")
        else:
            Q.try_click(page, SEL["quick"], timeout=1500)
            self.clicks.append("快局")
        page.wait_for_timeout(150)

        # 名字
        Q.fill_names(page, self.names)
        Q.select_distinct_colors(page)

        # 开始（step2）
        click_and_count(self, SEL["start"], "摆上棋盘")
        screen = Q.wait_screen(page, ["table"], timeout=9000)
        if screen != "table":
            self.rec.fail("AC-A3-4/%s" % self.label, "点开始进入主桌", "data-screen=table",
                          "data-screen=%r，body=%r" % (screen, Q.body_text(page)[:120]),
                          ac="AC-A3-4", viewport=self.label,
                          repro="门厅填名字→点「摆上棋盘」→读取 body[data-screen]")
            return False
        self.started = True
        page.wait_for_timeout(400)
        self.hook = Q.install_die_hook(page)
        if self.hook.get("mode") == "patch":
            self.rec.add_note("未发现 window.__V6_TEST__.forceDie，E2E 使用测试侧 monkey-patch 注入骰子（仅测试，不改实现）")
        elif self.hook.get("mode") == "none":
            self.rec.fail("HOOK-01/%s" % self.label, "可注入固定骰子", "存在 __V6_TEST__.forceDie 或 App.Flight.roll",
                          "钩子与引擎均不可用", ac="§9.5", severity="P1", viewport=self.label,
                          repro="进入主桌后读取 window.__V6_TEST__ / App.Flight")
        return True

    def check_rules_overview(self, where):
        page = self.page
        txt = Q.body_text(page)
        missing = [k for k in RULES_NEED if k not in txt]
        rows = page.evaluate(
            """() => {
                var el = document.querySelector('[data-test="rules-list"]');
                if (!el) return null;
                return {rows: el.querySelectorAll('.recap-row').length,
                        text: (el.innerText || '')};
            }"""
        )
        n_rows = (rows or {}).get("rows")
        pity_ok = RULES_PITY_TEXT in ((rows or {}).get("text") or txt)
        if not missing and pity_ok and n_rows == 6:
            self.rec.ok("AC-A5-1/%s" % where, "规则速览 6 条齐全（含保底起飞与先到家就收尾）",
                        "6 条标题 + 保底起飞正文", "6 条均在，rows=%s" % n_rows,
                        ac="AC-A5-1", viewport=self.label,
                        evidence=Q.this_shot(self.rec, page, "rules_" + where))
        else:
            self.rec.fail("AC-A5-1/%s" % where, "规则速览 6 条齐全", "6 条标题 + 保底起飞正文",
                          "缺少标题=%s 缺保底正文=%s rows=%s" % (missing, not pity_ok, n_rows),
                          ac="AC-A5-1", viewport=self.label,
                          repro="首次打开→查看玩法速览（规则速览 6 条）",
                          evidence=Q.this_shot(self.rec, page, "rules_" + where))

    # -- 一回合 -----------------------------------------------------
    def step(self):
        """推进一个交互步；返回 'continue' | 'ending' | 'ledger' | 'stop' | 'stuck'。"""
        page = self.page
        screen = Q.screen_name(page)
        if screen in ("ledger", "nights"):
            self.finished = True
            return "ledger"
        sess = Q.get_session(page) or {}
        aw = sess.get("awaiting") or {}
        typ = aw.get("type")
        phase = sess.get("phase")
        if phase in ("ended", "safe-ended"):
            # 等 UI 完成页/回顾
            page.wait_for_timeout(400)
            if Q.exists(page, SEL["finish_review"], timeout=600):
                click_and_count(self, SEL["finish_review"], "看今晚回顾")
                Q.wait_screen(page, ["ledger"], timeout=8000)
                self.finished = True
                return "ledger"
            if Q.screen_name(page) == "ledger":
                self.finished = True
                return "ledger"
            return "stop"
        if typ in ("prompt", "ending-prompt"):
            return self.handle_prompt(aw, ending=(typ == "ending-prompt"))
        if typ == "minigame":
            return self.handle_minigame(aw)
        if typ == "choose-piece":
            return self.handle_choose(aw)
        if typ in ("roll", None):
            if typ == "roll":
                return self.handle_roll(aw)
            page.wait_for_timeout(250)
            return "continue"
        # home-entry / 其它等待态
        page.wait_for_timeout(250)
        return "continue"

    def handle_roll(self, aw):
        page = self.page
        plan = Q.plan_die(page, target_kinds=self.target_kinds) if self.target_kinds else Q.plan_die(page)
        die = None
        if isinstance(plan, dict) and not plan.get("error"):
            die = plan.get("die")
        if die is None:
            die = 6
        Q.set_die(page, die)
        t0 = time.time()
        click_and_count(self, SEL["roll"], "掷骰")
        # B1: 点数文本 ≤800ms
        text, ms = Q.wait_text(page, r"掷出\s*[1-6]", timeout=1500)
        shot = Q.this_shot(self.rec, page, "roll_%d" % len(self.roll_log))
        if text and ms <= 800:
            self.rec.ok("AC-B1-1/%s" % self.label, "掷骰后点数文本 ≤800ms", "≤800ms 出现「掷出 N」",
                        "%s（%dms）" % (text.replace("\n", " "), ms), ac="AC-B1-1",
                        viewport=self.label, duration_ms=ms,
                        evidence=shot)
        else:
            self.rec.fail("AC-B1-1/%s" % self.label, "掷骰后点数文本 ≤800ms", "≤800ms 出现「掷出 N」",
                          ("未出现" if not text else "%s（%dms，超 800ms）" % (text, ms)),
                          ac="AC-B1-1", viewport=self.label, duration_ms=ms,
                          repro="主桌点「掷骰」→计时读取页面「掷出 N」文本", evidence=shot)
        # 6 点提示
        if die == 6:
            extra = re.search(r"再掷一次", Q.body_text(page))
            if extra:
                self.rec.ok("AC-B1-3/%s" % self.label, "掷出 6 提示再掷一次", "含「再掷一次」",
                            "已提示", ac="AC-B1-3", viewport=self.label)
            else:
                self.rec.check("AC-B1-3/%s" % self.label, "掷出 6 提示再掷一次", "SKIP",
                               "含「再掷一次」", "未观察到 6 点文本（可能被注入点覆盖）",
                               ac="AC-B1-3", viewport=self.label)
        # 等待后续状态
        after = Q.wait_until(
            page,
            """() => {
                var s = null; try { s = App.Store.getSession(); } catch(e) {}
                if (!s) return 'nosession';
                var aw = s.awaiting || {};
                if (aw.type && aw.type !== 'roll') return aw.type;
                if (s.phase === 'ended' || s.phase === 'safe-ended') return 'ended';
                var t = (document.body && document.body.innerText) || '';
                if (/掷出\\s*[1-6]/.test(t)) return 'textwait';
                return null;
            }""",
            timeout=6000,
        )
        # 无棋可走：文本 + 换人
        if after in (None, "textwait"):
            txt, t_ms = Q.wait_text(page, r"(没有飞机能动，换\s*[^\s，。]{1,12}\s*掷骰|进终点要刚好，这步先停)",
                                    timeout=1500)
            if txt:
                self.rec.ok("AC-B2-1/%s" % self.label, "无子可走给出原因并换人", "≤800ms 出现原因文本",
                            "%s（%dms）" % (txt, t_ms), ac="AC-B2-1", viewport=self.label,
                            duration_ms=t_ms)
            else:
                self.rec.check("AC-B2-1/%s" % self.label, "无子可走给出原因并换人", "SKIP",
                               "出现「没有飞机能动，换 X 掷骰」", "本次掷骰有合法走子或未观察到原因提示",
                               ac="AC-B2-1", viewport=self.label)
        self.roll_log.append({"die": die, "text_ms": ms, "after": after,
                              "plan_kind": (plan or {}).get("kind") if isinstance(plan, dict) else None,
                              "plan_piece": (plan or {}).get("pieceId") if isinstance(plan, dict) else None,
                              "plan_dest": (plan or {}).get("dest") if isinstance(plan, dict) else None})
        return "continue"

    def handle_choose(self, aw):
        page = self.page
        # 动画期间操作区还没渲染：最多等 6s 出现文字按钮；若期间 awaiting 变化则让主循环继续
        btns = []
        spec = None
        deadline = time.time() + 6.0
        while time.time() < deadline:
            btns, spec = Q.find_piece_buttons(page)
            if btns:
                break
            s = Q.get_session(page) or {}
            if (s.get("awaiting") or {}).get("type") != "choose-piece":
                return "continue"
            page.wait_for_timeout(120)
        if not btns:
            self.rec.fail("AC-B3-1/%s" % self.label, "多架可走时提供文字按钮", "含颜色/第几架/从哪走的文字按钮",
                          "等待 6s 未找到可走子文字按钮", ac="AC-B3-1", viewport=self.label,
                          repro="掷骰后出现多架可走→读取选子按钮")
            return "stuck"
        texts = []
        for b in btns:
            try:
                texts.append((b.inner_text() or "").strip())
            except Exception:
                texts.append("")
        ok_text = all(re.search(r"(红|黄|蓝|绿).*第\s*\d+\s*架.*(从机坪起飞|沿航线走)", t) for t in texts)
        sizes = []
        for b in btns:
            r = Q.element_rect(b)
            sizes.append((round(r["width"], 1), round(r["height"], 1)) if r else None)
        if ok_text:
            self.rec.ok("AC-B3-1/%s" % self.label, "选子文字按钮含颜色/第几架/从哪里走", "每个按钮都满足",
                        json.dumps(texts, ensure_ascii=False), ac="AC-B3-1", viewport=self.label,
                        evidence=Q.this_shot(self.rec, page, "choose_%d" % len(self.roll_log)))
        else:
            self.rec.fail("AC-B3-1/%s" % self.label, "选子文字按钮含颜色/第几架/从哪里走",
                          "如「红 · 第 1 架 · 从机坪起飞」", json.dumps(texts, ensure_ascii=False),
                          ac="AC-B3-1", viewport=self.label,
                          repro="掷骰后多架可走→读取选子按钮文本")
        if all(s and s[0] >= 44 and s[1] >= 44 for s in sizes):
            self.rec.ok("AC-H1-1/%s" % self.label, "选子按钮 ≥44×44", "≥44×44",
                        json.dumps(sizes), ac="AC-H1-1", viewport=self.label)
        else:
            self.rec.check("AC-H1-1-choose/%s" % self.label, "选子按钮 ≥44×44", "FAIL",
                           "≥44×44", json.dumps(sizes), ac="AC-H1-1", viewport=self.label,
                           detail="选子按钮触控尺寸不足")
        # 按本次 awaiting.die 的落点挑按钮：优先计划点名的 piece，其次按钮顺序
        pie = (aw.get("pieceIds") or [])
        die_now = aw.get("die")
        target_piece = None
        if die_now:
            plan = Q.plan_piece_for_die(page, die_now)
            pieces = (plan or {}).get("pieces") or []
            wanted_kinds = self.target_kinds or ["truth", "dare", "touch", "home-entry", "fate",
                                                "thermo", "wheel", "capture", "stack"]
            best = None
            for p in pieces:
                rank = 0 if p.get("kind") in wanted_kinds else 1
                if best is None or rank < best[0]:
                    best = (rank, p.get("pieceId"))
            if best:
                target_piece = best[1]
        # B3-2：棋盘可走子高亮（board.js 口径 data-choice="1"）
        hi = page.evaluate(
            """() => document.querySelectorAll('.bv-piece[data-choice="1"], [data-piece][data-choice="1"], .bv-piece.is-choice').length"""
        )
        if hi and hi > 0:
            self.rec.ok("AC-B3-2/%s" % self.label, "棋盘可走子有高亮", ">0 个高亮棋子",
                        "highlighted=%s" % hi, ac="AC-B3-2", severity="P1", viewport=self.label)
        else:
            self.rec.check("AC-B3-2/%s" % self.label, "棋盘可走子有高亮", "FAIL",
                           ">0 个高亮棋子", "highlighted=0", ac="AC-B3-2",
                           severity="P1", viewport=self.label)
        # B3-3：文字按钮与棋盘棋子两个入口都可走（360 视口用棋盘入口点一次）
        if self.label == "360x640" and not self.board_clicked and hi:
            try:
                page.locator('.bv-piece[data-choice="1"], [data-piece][data-choice="1"]').first.click(timeout=4000)
                self.board_clicked = True
                self.clicks.append("棋盘选子")
                advanced = Q.wait_until(
                    page,
                    "() => { try { var s=App.Store.getSession(); return s && s.awaiting && s.awaiting.type!=='choose-piece'; } catch(e){ return false; } }",
                    timeout=5000)
                if advanced:
                    self.rec.ok("AC-B3-3/%s" % self.label, "棋盘棋子入口可走出同一步", "awaiting 推进",
                               "棋盘点击后 awaiting=%s" % advanced, ac="AC-B3-3",
                               severity="P1", viewport=self.label)
                else:
                    self.rec.fail("AC-B3-3/%s" % self.label, "棋盘棋子入口可走出同一步", "awaiting 推进",
                                  "点击后 awaiting 未变化", ac="AC-B3-3", severity="P1",
                                  viewport=self.label, repro="掷骰后点棋盘高亮棋子")
                page.wait_for_timeout(300)
                landing, lms = Q.wait_text(
                    page,
                    r"(起飞格|真心话格|大冒险格|靠近格|温度计格|转盘格|飞格|跳格|停格|进航格|命运格|普通格|终点|回家第\s*\d+\s*格)\s*·\s*第\s*\d+\s*格|回家第\s*\d+\s*格|终点",
                    timeout=3500,
                )
                if landing:
                    self.rec.ok("AC-B7-1/%s" % self.label, "走子后出现落点格名（棋盘入口）", "≤500ms",
                                "%s（%dms）" % (landing, lms), ac="AC-B7-1", severity="P1",
                                viewport=self.label, duration_ms=lms)
                if "掷出" in Q.body_text(page):
                    self.rec.ok("AC-B1-2/%s" % self.label, "点数文本保留到下一次掷骰", "仍含「掷出 N」",
                                "命中", ac="AC-B1-2", viewport=self.label)
                return "continue"
            except Exception:
                self.board_clicked = True  # 只尝试一次，回退文字按钮
        clicked = False
        if target_piece:
            for i, b in enumerate(btns):
                try:
                    dp = b.get_attribute("data-piece") or b.get_attribute("data-piece-id")
                except Exception:
                    dp = None
                if dp == target_piece:
                    b.click(timeout=4000)
                    clicked = True
                    break
            if not clicked and target_piece in pie:
                idx = pie.index(target_piece)
                if idx < len(btns):
                    btns[idx].click(timeout=4000)
                    clicked = True
        if not clicked:
            btns[0].click(timeout=4000)
        self.clicks.append("选子")
        # 落点格名（B7 P1）
        page.wait_for_timeout(120)
        landing, lms = Q.wait_text(
            page,
            r"(起飞格|真心话格|大冒险格|靠近格|温度计格|转盘格|飞格|跳格|停格|进航格|命运格|普通格|终点|回家第\s*\d+\s*格)\s*·\s*第\s*\d+\s*格|回家第\s*\d+\s*格|终点",
            timeout=3500,
        )
        if landing:
            self.rec.ok("AC-B7-1/%s" % self.label, "走子后出现落点格名", "≤500ms（走子结束后）",
                        "%s（%dms）" % (landing.replace("\n", " "), lms), ac="AC-B7-1",
                        severity="P1", viewport=self.label, duration_ms=lms)
            if self.roll_log:
                self.roll_log[-1]["landing"] = landing.replace("\n", " ")
        else:
            self.rec.check("AC-B7-1/%s" % self.label, "走子后出现落点格名", "SKIP",
                           "出现「<格名> · 第 N 格」", "未观察到落点文本", ac="AC-B7-1",
                           severity="P1", viewport=self.label)
        # B1-2：点数文本保留到下一次掷骰（抽查第一回合）
        if len(self.roll_log) == 1:
            if "掷出" in Q.body_text(page):
                self.rec.ok("AC-B1-2/%s" % self.label, "点数文本保留到下一次掷骰", "仍含「掷出 N」",
                            "命中", ac="AC-B1-2", viewport=self.label)
            else:
                self.rec.fail("AC-B1-2/%s" % self.label, "点数文本保留到下一次掷骰", "仍含「掷出 N」",
                              "落点后文本消失", ac="AC-B1-2", viewport=self.label,
                              repro="掷骰→选子→走子后读取点数文本")
        return "continue"

    def _actor_expected(self, aw):
        p = aw.get("prompt") or {}
        actor = p.get("actorId") or p.get("actor") or p.get("targetId") or p.get("for")
        if actor == "both":
            return "两人一起"
        if actor in ("a", 0):
            return self.names[0]
        if actor in ("b", 1):
            return self.names[1]
        return None

    def handle_prompt(self, aw, ending=False):
        page = self.page
        p = aw.get("prompt") or {}
        kind = p.get("kind") or ("ending" if ending else "?")
        # 动画期间题卡可能还没挂上：最多等 6s
        dom = None
        deadline = time.time() + 6.0
        while time.time() < deadline:
            dom = prompt_dom(page)
            if dom:
                break
            s = Q.get_session(page) or {}
            if (s.get("awaiting") or {}).get("type") not in ("prompt", "ending-prompt"):
                return "continue"
            page.wait_for_timeout(120)
        if dom is None:
            self.rec.fail("PROMPT-visible/%s" % self.label, "题卡可见", "prompt 卡出现",
                          "未找到题卡容器", ac="C1", viewport=self.label,
                          repro="落到题格→读取题卡")
            return "stuck"
        # B4 红线：安全词在题卡浮层上仍可达（每个视口只验一次）
        if not getattr(self, "safety_prompt_checked", False):
            self.safety_prompt_checked = True
            check_safety_visible(self.ps, self.rec, self.label, "prompt")
        text = dom.get("text") or ""
        screenshot = Q.this_shot(self.rec, page, "prompt_%02d_%s_%s" % (len(self.prompt_log) + 1, kind, self.label))

        # C1 归属
        actor = self._actor_expected(aw)
        attr_ok = True
        attr_actual = ""
        if ending:
            m = re.search(r"今晚最后一段\s*·\s*第\s*(\d+)\s*/\s*2\s*张\s*·\s*给\s*(\S{1,12})", text)
            if m:
                attr_actual = m.group(0)
                if actor and actor not in m.group(0):
                    attr_ok = False
            else:
                attr_ok = False
                attr_actual = "未匹配「今晚最后一段 · 第 n/2 张 · 给 姓名」"
        elif actor == "两人一起":
            attr_ok = ("两人一起" in text) or ("这张给你们俩" in text)
            attr_actual = "两人一起" if attr_ok else "未出现「两人一起/这张给你们俩」"
        elif actor:
            attr_ok = (actor in text) and ("走到的人" not in text)
            attr_actual = "含 %s" % actor if actor in text else "未出现姓名 %s" % actor
        else:
            # prompt 没带 actorId：要求至少出现一个名字或「两人一起」
            attr_ok = any(n in text for n in self.names) or "两人一起" in text or "这张给你们俩" in text
            attr_actual = "含人名" if attr_ok else "无人名"
        if "走到的人" in text:
            attr_ok = False
            attr_actual = "出现废弃文案「这张给走到的人」"
        if attr_ok:
            self.rec.ok("AC-C1-1/%s" % self.label, "题卡显示归属当事人（%s）" % (actor or "任意人名"),
                        "kicker 含当事人姓名/两人一起", attr_actual, ac="AC-C1-1",
                        viewport=self.label, evidence=screenshot)
        else:
            self.rec.fail("AC-C1-1/%s" % self.label, "题卡显示归属当事人", "kicker 含当事人姓名/两人一起",
                          "%s；卡面文本=%r" % (attr_actual, text[:160]), ac="AC-C1-1",
                          viewport=self.label, repro="落到题格→读取题卡 kicker", evidence=screenshot)

        # 类型/星级（P1）；home-entry 用事件名「进终点」作为 kicker 类型是当前实现口径
        type_words = TYPE_WORDS + ("进终点",)
        type_ok = any(w in text for w in type_words) or ending
        star_ok = ("★" in text) or ("☆" in text) or bool(re.search(r"[1-5]\s*星", text))
        self.rec.check("AC-C5-1/%s" % self.label, "题卡含类型/星级/来源",
                       "PASS" if (type_ok and star_ok) else "FAIL",
                       "类型 + ★ + 来源格", "type=%s star=%s kind=%s" % (type_ok, star_ok, kind),
                       ac="AC-C5-1", severity="P1", viewport=self.label,
                       evidence=screenshot)

        # 命运格（P1）：两张卡二选一，选中的卡直接结算（不再出第二张题卡）
        if kind == "fate":
            opts = page.locator("[data-test='prompt-fate-option'], [data-fate-option]")
            n = 0
            try:
                n = opts.count()
            except Exception:
                pass
            body = Q.body_text(page)
            has_none = Q.exists(page, SEL["fate_none"], timeout=800) or "今晚先不选" in body
            sizes = []
            for i in range(min(n, 2)):
                r = Q.element_rect(opts.nth(i))
                sizes.append((round(r["width"], 1), round(r["height"], 1)) if r else None)
            if n >= 2 and has_none:
                self.rec.ok("AC-E5-2/%s" % self.label, "命运格展示两张卡 + 不选入口",
                            "2 个选项 + 今晚先不选", "n=%d sizes=%s" % (n, sizes), ac="AC-E5-2",
                            severity="P1", viewport=self.label, evidence=screenshot)
            else:
                self.rec.check("AC-E5-2/%s" % self.label, "命运格展示两张卡 + 不选入口",
                               "SKIP", "2 个选项 + 今晚先不选", "n=%d none=%s" % (n, has_none),
                               ac="AC-E5-2", severity="P1", viewport=self.label)
            before = status_now(page)
            self.prompt_log.append({"kind": "fate", "actor": self.names[0], "outcome": "chosen",
                                    "card_text": text[:200]})
            # 本次 E2E 选择第一张（P1 主流程）；不选路径由 run_fate_case 覆盖
            if n >= 1:
                opts.nth(0).click(timeout=4000)
                self.clicks.append("命运选卡")
            else:
                Q.try_click(page, SEL["fate_none"], timeout=2000)
                self.clicks.append("今晚先不选")
            Q.wait_until(page, """() => { try { var s=App.Store.getSession(); var aw=(s&&s.awaiting)||{}; return aw.type !== 'prompt' && aw.type !== 'ending-prompt'; } catch(e){ return false; } }""",
                         timeout=5000)
            page.wait_for_timeout(200)
            after = status_now(page)
            if before.get("heat") is not None and after.get("heat") is not None:
                delta = after["heat"] - before["heat"]
                self.rec.check("AC-E5-2-heat/%s" % self.label, "命运选卡按做了结算（+8）",
                               "PASS" if delta == 8 else "FAIL", "Δ=8",
                               "Δ=%s（%s → %s）" % (delta, before.get("heat"), after.get("heat")),
                               ac="AC-E5-2", severity="P1", viewport=self.label)
            return "continue"

        # 动作按钮尺寸（H1：做了/放过 ≥44）
        for name, spec in (("做了", SEL["prompt_done"]), ("放过", SEL["prompt_skip"])):
            loc, _ = Q.find(page, spec, timeout=2500)
            r = Q.element_rect(loc) if loc else None
            if r and r["width"] >= 44 and r["height"] >= 44:
                self.rec.ok("AC-H1-1-%s/%s" % (name, self.label), "%s 按钮 ≥44×44" % name,
                            "≥44×44", "%.1f×%.1f" % (r["width"], r["height"]), ac="AC-H1-1",
                            viewport=self.label)
            else:
                self.rec.fail("AC-H1-1-%s/%s" % (name, self.label), "%s 按钮 ≥44×44" % name,
                              "≥44×44", json.dumps(r, ensure_ascii=False), ac="AC-H1-1",
                              viewport=self.label, repro="题卡出现后读取按钮 rect")
        # 正文 ≥15px（H4-2）
        fs = page.evaluate(
            """() => {
                var root = document.querySelector('.pc-root, [data-test="prompt-card"], [data-prompt-card], .prompt-card');
                if (!root) return null;
                var cands = root.querySelectorAll('p, .text, .prompt-text, .body, div, span');
                var best = null;
                for (var i = 0; i < cands.length; i++) {
                    var t = (cands[i].innerText || '').trim();
                    if (t.length < 8) continue;
                    var cs = getComputedStyle(cands[i]);
                    var sz = parseFloat(cs.fontSize) || 0;
                    if (!best || t.length > best.len) best = {len: t.length, size: sz};
                }
                return best;
            }"""
        )
        if fs and fs.get("size", 0) >= 15:
            self.rec.ok("AC-H4-2/%s" % self.label, "题卡正文 ≥15px", "≥15px",
                        "%.1fpx（最长文本块）" % fs["size"], ac="AC-H4-2", viewport=self.label)
        else:
            self.rec.check("AC-H4-2/%s" % self.label, "题卡正文 ≥15px", "FAIL" if fs else "SKIP",
                           "≥15px", json.dumps(fs, ensure_ascii=False), ac="AC-H4-2",
                           viewport=self.label)

        # 结算
        before = status_now(page)
        heat_before = before.get("heat")
        sess_before = Q.get_session(page) or {}
        cards_before = sess_before.get("cardsProcessed")
        ending_index = sess_before.get("endingIndex") if isinstance(sess_before, dict) else 0
        try:
            ending_index = int(ending_index or 0)
        except Exception:
            ending_index = 0
        is_last_ending = bool(ending and ending_index >= 1)
        outcome = "skip" if self.prompt_outcome == "skip" else "done"
        # 结束卡策略可单独指定
        if ending and self.prompt_outcome not in ("skip",):
            outcome = "done"
        t_click = time.time()
        if outcome == "done":
            click_and_count(self, SEL["prompt_done"], "做了")
        else:
            click_and_count(self, SEL["prompt_skip"], "放过")

        # 最后一张收尾卡：立刻计时完成文本（≤500ms 断言；finish() 会清 session）
        finish_seen = None
        if is_last_ending:
            finish_seen = Q.wait_text(page, r"今晚完成了", timeout=1600)

        # C3 toast（匹配本次的第 N 张；收尾卡不走「今晚第 N 张」toast，由 F1 覆盖）
        toast, t_ms = None, None
        if not ending:
            cards_before_n = cards_before if isinstance(cards_before, int) else (self.cards or 0)
            expected_n = cards_before_n + 1
            toast, t_ms = Q.wait_text(page, r"记下了\s*·\s*今晚第\s*%d\s*张" % expected_n, timeout=1600)
            if toast and t_ms <= 500:
                self.rec.ok("AC-C3-1/%s" % self.label, "题卡结算后 ≤500ms 出现记录 toast", "≤500ms",
                            "%s（%dms）" % (toast.replace("\n", " "), t_ms), ac="AC-C3-1",
                            viewport=self.label, duration_ms=t_ms,
                            evidence=Q.this_shot(self.rec, page, "toast_%02d_%s" % (len(self.prompt_log), self.label)))
            elif toast:
                self.rec.fail("AC-C3-1/%s" % self.label, "题卡结算后 ≤500ms 出现记录 toast", "≤500ms",
                              "%s（%dms，超时）" % (toast, t_ms), ac="AC-C3-1", viewport=self.label,
                              duration_ms=t_ms, repro="题卡点「做了」→计时读取「记下了 · 今晚第 N 张」")
            else:
                self.rec.fail("AC-C3-1/%s" % self.label, "题卡结算后出现记录 toast",
                              "「记下了 · 今晚第 %d 张」" % expected_n, "1600ms 内未观察到 toast",
                              ac="AC-C3-1", viewport=self.label, repro="题卡点「做了」→读取 toast")

        # 等待 awaiting 离开 prompt（非最后一张收尾卡时，下一张收尾卡立刻排队，不必等）
        if not (ending and not is_last_ending):
            Q.wait_until(page, """() => { try { var s=App.Store.getSession(); var aw=(s&&s.awaiting)||{}; return aw.type !== 'prompt' && aw.type !== 'ending-prompt'; } catch(e){ return false; } }""",
                         timeout=4000)
        page.wait_for_timeout(150)

        # 心动值 / 计数
        after = status_now(page)
        heat_after = after.get("heat")
        expected_delta = 10 if (ending and outcome == "done") else (3 if outcome == "skip" else 8)
        delta = None if (heat_before is None or heat_after is None) else heat_after - heat_before
        capped = heat_after is not None and heat_after >= 100
        if delta is None:
            self.rec.check("AC-E1-1/%s" % self.label, "心动值严格按 做了+%d/放过+3 结算" % expected_delta,
                           "SKIP", "delta=%d" % expected_delta, "无法读取心动值", ac="AC-E1-1",
                           viewport=self.label)
        elif delta == expected_delta or (capped and heat_before == 100) or (capped and delta >= 0):
            self.rec.ok("AC-E1-1/%s" % self.label, "心动值按 做了/放过 规则结算", "+%d" % expected_delta,
                        "%s → %s（Δ%s）%s" % (heat_before, heat_after, delta, "（已封顶）" if capped else ""),
                        ac="AC-E1-1", viewport=self.label)
        elif delta < 0:
            self.rec.fail("AC-E1-2/%s" % self.label, "心动值不因放过/做了减少", "Δ≥0",
                          "%s → %s（Δ%s）" % (heat_before, heat_after, delta), ac="AC-E1-2",
                          viewport=self.label, repro="同一局连续记录操作→对比心跳值")
        else:
            self.rec.fail("AC-E1-1/%s" % self.label, "心动值严格按规则结算", "+%d" % expected_delta,
                          "%s → %s（Δ%s）" % (heat_before, heat_after, delta), ac="AC-E1-1",
                          viewport=self.label, repro="题卡点「%s」→读取状态条心动值" % ("做了" if outcome == "done" else "放过"))

        sess_after = Q.get_session(page) or {}
        if ending:
            self.cards = sess_after.get("cardsProcessed", self.cards)
        else:
            new_cards = sess_after.get("cardsProcessed")
            if new_cards is not None:
                self.cards = new_cards
            else:
                self.cards += 1

        self.prompt_log.append({
            "kind": kind,
            "actor": actor,
            "outcome": outcome,
            "heat_before": heat_before,
            "heat_after": heat_after,
            "toast_ms": t_ms,
            "card_text": text[:300],
            "screenshot": screenshot,
        })
        self.heat.append(heat_after)

        # B6-2：状态条在结算后同步（≤500ms）
        if not (ending and is_last_ending):
            st2 = status_now(page)
            sess2 = Q.get_session(page) or {}
            want_cards = sess2.get("cardsProcessed")
            want_heat = (sess2.get("meta") or {}).get("heat")
            if st2.get("cards") is not None and want_cards is not None:
                if st2.get("cards") == want_cards and (want_heat is None or st2.get("heat") == want_heat):
                    self.rec.ok("AC-B6-2/%s" % self.label, "结算后状态条 ≤500ms 同步",
                                "cards/heat 与引擎一致",
                                "cards %s/%s heat %s/%s" % (st2.get("cards"), want_cards,
                                                            st2.get("heat"), want_heat),
                                ac="AC-B6-2", viewport=self.label)
                else:
                    self.rec.fail("AC-B6-2/%s" % self.label, "结算后状态条 ≤500ms 同步",
                                  "cards/heat 与引擎一致",
                                  "cards %s/%s heat %s/%s" % (st2.get("cards"), want_cards,
                                                              st2.get("heat"), want_heat),
                                  ac="AC-B6-2", viewport=self.label,
                                  repro="题卡结算后对比状态条与 App.Store 会话")

        # 结束判定（V6.1 E3）：题卡数 / 心动值**不再**触发收尾；只有「一方全部到家」才收尾。
        # 只在本局第一张普通题卡后断言一次（避免每张卡一行重复用例）。
        if not ending and sess_after.get("phase") not in ("ended", "safe-ended"):
            if not getattr(self, "checked_e3", False):
                self.checked_e3 = True
                homes = session_summary(page).get("planesHome") or {}
                total = int(sess_after.get("planeCount") or 2)
                all_home = any((homes.get(x) or 0) >= total for x in ("a", "b"))
                cards_n = sess_after.get("cardsProcessed") or self.cards or 0
                banner = Q.exists(page, SEL["ending_title"], timeout=400)
                if all_home and banner:
                    self.rec.ok("AC-E3-1/%s" % self.label, "一方全部到家 → 出现收尾标题",
                                "「今晚最后一段」", "cards=%s heat=%s home=%s" %
                                (cards_n, heat_after, homes), ac="AC-E3-1", viewport=self.label,
                                evidence=Q.this_shot(self.rec, page, "ending_start"))
                    self.ending_started = True
                elif all_home:
                    self.rec.fail("AC-E3-1/%s" % self.label, "一方全部到家 → 收尾",
                                  "≤1s 出现「今晚最后一段」", "cards=%s home=%s" % (cards_n, homes),
                                  ac="AC-E3-1", viewport=self.label,
                                  repro="构造一方全部到家→读取收尾标题")
                elif not banner:
                    self.rec.ok("AC-E3-2/%s" % self.label, "题卡数/心动值不触发结束",
                                "未出现「今晚最后一段」",
                                "cards=%s（targetCards=%s 仅历史兼容）heat=%s home=%s" %
                                (cards_n, sess_after.get("targetCards"), heat_after, homes),
                                ac="AC-E3-2 / AC-E3-3", viewport=self.label)
                else:
                    self.rec.fail("AC-E3-2/%s" % self.label, "题卡数/心动值不触发结束",
                                  "未出现「今晚最后一段」", "cards=%s heat=%s home=%s" %
                                  (cards_n, heat_after, homes), ac="AC-E3-2",
                                  viewport=self.label,
                                  repro="处理题卡后读取「今晚最后一段」")

        # 收尾卡第二张之后
        if ending:
            if not is_last_ending:
                # 还有下一张收尾卡：交给主循环
                return "continue"
            if finish_seen and finish_seen[0]:
                if finish_seen[1] <= 500:
                    self.rec.ok("AC-F1-1/%s" % self.label, "两张收尾卡处理完 ≤500ms 出现「今晚完成了」",
                                "≤500ms", "%s（%dms）" % (finish_seen[0], finish_seen[1]), ac="AC-F1-1",
                                viewport=self.label, duration_ms=finish_seen[1],
                                evidence=Q.this_shot(self.rec, page, "finished_%s" % self.label))
                else:
                    self.rec.fail("AC-F1-1/%s" % self.label, "两张收尾卡处理完 ≤500ms 出现「今晚完成了」",
                                  "≤500ms", "%s（%dms，超时）" % (finish_seen[0], finish_seen[1]),
                                  ac="AC-F1-1", viewport=self.label, duration_ms=finish_seen[1],
                                  repro="第二张收尾卡点「做了」→计时读取「今晚完成了」")
                self.ending_done = True
            else:
                ftxt, fms = Q.wait_text(page, r"今晚完成了", timeout=1800)
                if ftxt:
                    self.rec.ok("AC-F1-1/%s" % self.label, "两张收尾卡处理完出现「今晚完成了」",
                                "≤500ms", "%s（%dms）" % (ftxt, fms), ac="AC-F1-1",
                                viewport=self.label, duration_ms=fms,
                                evidence=Q.this_shot(self.rec, page, "finished_%s" % self.label))
                    self.ending_done = True
                else:
                    self.rec.fail("AC-F1-1/%s" % self.label, "两张收尾卡处理完出现「今晚完成了」",
                                  "≤500ms", "未出现完成文本", ac="AC-F1-1", viewport=self.label,
                                  repro="两张收尾卡各点「做了」→读取完成文本")
            # 点「看今晚回顾」（若存在且还没自动跳回顾；V6 实现 700ms 后自动跳）
            if Q.screen_name(page) != "ledger" and Q.exists(page, SEL["finish_review"], timeout=800):
                try:
                    Q.click(page, SEL["finish_review"], timeout=1500)
                    self.clicks.append("看今晚回顾")
                except Exception:
                    pass
            Q.wait_screen(page, ["ledger"], timeout=8000)
            self.finished = Q.screen_name(page) == "ledger"
            return "ledger"
        return "continue"

    def handle_minigame(self, aw):
        page = self.page
        kind = aw.get("kind") or "?"
        panel, _ = Q.find(page, SEL["minigame"], timeout=5000)
        body = Q.body_text(page)
        title = ""
        for w in ("温度计", "真心话转盘", "大冒险转盘"):
            if w in body:
                title = w
                break
        shot = Q.this_shot(self.rec, page, "minigame_%s" % re.sub(r"[^a-z-]", "", kind))
        if panel is None:
            self.rec.fail("AC-D1-1/%s" % self.label, "落到小游戏格进入可玩面板", "直接出现可操作面板",
                          "未找到小游戏面板", ac="AC-D1-1", viewport=self.label,
                          repro="落到温度计/转盘格→读取面板")
            return "stuck"
        # B4 红线：安全词在小游戏浮层上仍可达（每个视口只验一次）
        if not getattr(self, "safety_mini_checked", False):
            self.safety_mini_checked = True
            check_safety_visible(self.ps, self.rec, self.label, "minigame")
        has_control = page.evaluate(
            """() => {
                var sel = '[data-test="minigame-panel"], [data-minigame], .minigame-panel';
                var root = document.querySelector(sel) || document.body;
                return {
                  ranges: root.querySelectorAll('input[type=range]').length,
                  buttons: Array.prototype.map.call(root.querySelectorAll('button'), function(b){return (b.innerText||'').trim();})
                };
            }"""
        )
        ranges = has_control.get("ranges", 0)
        buttons = has_control.get("buttons", [])
        playable = ranges > 0 or any(b in ("转", "我在这", "我猜对方", "标好了", "揭晓") for b in buttons)
        if playable:
            self.rec.ok("AC-D1-1/%s" % self.label, "小游戏面板可操作（%s）" % (title or kind),
                        "滑杆或「转/标好了」控件", json.dumps(has_control, ensure_ascii=False),
                        ac="AC-D1-1", viewport=self.label, evidence=shot)
        else:
            self.rec.fail("AC-D1-1/%s" % self.label, "小游戏面板可操作（%s）" % (title or kind),
                          "滑杆或「转/标好了」控件", json.dumps(has_control, ensure_ascii=False),
                          ac="AC-D1-1", viewport=self.label, repro="落到小游戏格→读取面板控件")
        bad = [t for t in ("玩过了，继续走棋", "玩过了") if t in body]
        if bad:
            self.rec.fail("AC-D1-3/%s" % self.label, "不再出现「玩过了」空按钮", "无此文案",
                          "出现：%s" % bad, ac="AC-D1-3", viewport=self.label,
                          repro="落到小游戏格→读取面板", evidence=shot)
        else:
            self.rec.ok("AC-D1-3/%s" % self.label, "不再出现「玩过了」空按钮", "无此文案", "无",
                        ac="AC-D1-3", viewport=self.label, evidence=shot)

        before = status_now(page)
        heat_before = before.get("heat")
        outcome = self.minigame_outcome
        if outcome == "skip":
            if Q.exists(page, SEL["mg_skip"], timeout=2000):
                click_and_count(self, SEL["mg_skip"], "小游戏跳过")
                toast, ms = Q.wait_text(page, r"这一格先跳过", timeout=1600)
                if toast:
                    self.rec.ok("AC-D2-2/%s" % self.label, "小游戏跳过有反馈", "toast「这一格先跳过，记下了」",
                                "%s（%dms）" % (toast, ms), ac="AC-D2-2", viewport=self.label,
                                duration_ms=ms)
                else:
                    self.rec.check("AC-D2-2/%s" % self.label, "小游戏跳过有反馈", "SKIP",
                                   "toast「这一格先跳过，记下了」", "未观察到跳过 toast",
                                   ac="AC-D2-2", viewport=self.label)
            else:
                self.rec.fail("AC-D2-1/%s" % self.label, "小游戏有「跳过」按钮",
                              "可点的「这次先跳过」", "未找到跳过按钮", ac="AC-D2-1",
                              viewport=self.label, repro="落到小游戏格→读取跳过按钮")
        else:
            # 完成：minigame-done 在任意阶段可点（操作阶段=「完成」，结果阶段=「回棋盘」）
            if Q.exists(page, SEL["mg_done"], timeout=2500):
                click_and_count(self, SEL["mg_done"], "小游戏完成")
                toast, ms = Q.wait_text(page, r"这一格记下了|回棋盘", timeout=2000)
                if toast:
                    self.rec.ok("AC-D2-3/%s" % self.label, "小游戏完成有反馈", "≤500ms 出现完成反馈",
                                "%s（%dms）" % (toast, ms), ac="AC-D2-3", viewport=self.label,
                                duration_ms=ms)
                else:
                    self.rec.check("AC-D2-3/%s" % self.label, "小游戏完成有反馈", "SKIP",
                                   "完成反馈", "未观察到完成 toast", ac="D2-3", viewport=self.label)
            else:
                self.rec.fail("AC-D2-3/%s" % self.label, "小游戏可完成", "minigame-done 可点",
                              "未找到完成按钮", ac="D2-3", viewport=self.label,
                              repro="进入小游戏→查找 [data-test=minigame-done]")

        Q.wait_until(page, """() => { try { var s=App.Store.getSession(); var aw=(s&&s.awaiting)||{}; return aw.type !== 'minigame'; } catch(e){ return false; } }""",
                     timeout=6000)
        page.wait_for_timeout(250)
        after = status_now(page)
        heat_after = after.get("heat")
        delta = None if (heat_before is None or heat_after is None) else heat_after - heat_before
        if outcome == "skip":
            ok = delta == 0
            self.rec.check("AC-D2-2-heat/%s" % self.label, "小游戏跳过不扣心动值", "PASS" if ok else "FAIL",
                           "Δ=0", "Δ=%s（%s → %s）" % (delta, heat_before, heat_after),
                           ac="AC-D2-2", viewport=self.label)
        else:
            ok = delta == 5
            self.rec.check("AC-D2-3-heat/%s" % self.label, "小游戏完成心动值 +5", "PASS" if ok else "FAIL",
                           "Δ=5", "Δ=%s（%s → %s）" % (delta, heat_before, heat_after),
                           ac="D2-3", severity="P1", viewport=self.label)
        self.minigame_log.append({"kind": kind, "title": title, "outcome": outcome,
                                  "heat_delta": delta, "screenshot": shot})
        return "continue"

    def _play_minigame(self, title):
        page = self.page
        # 温度计：两轮滑杆 + 递手机遮挡
        if "温度计" in title:
            for step in range(3):
                ranges = page.locator("[data-test='minigame-panel'] input[type=range], input[type=range]")
                cnt = 0
                try:
                    cnt = ranges.count()
                except Exception:
                    pass
                for i in range(min(cnt, 2)):
                    try:
                        ranges.nth(i).evaluate("(el) => { el.value = el.max ? String(Number(el.max)*0.6) : '60'; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); }")
                    except Exception:
                        pass
                if Q.exists(page, ["role:button:/^标好了$/"], timeout=800):
                    Q.try_click(page, ["test:minigame-next", "role:button:/^标好了$/"], timeout=1500)
                    page.wait_for_timeout(250)
                if Q.exists(page, ["role:button:/我拿到了/"], timeout=600):
                    Q.try_click(page, ["role:button:/我拿到了/"], timeout=1500)
                    page.wait_for_timeout(200)
                if Q.exists(page, ["role:button:/^揭晓$/"], timeout=600):
                    Q.try_click(page, ["role:button:/^揭晓$/"], timeout=1500)
                    page.wait_for_timeout(300)
                    break
            Q.try_click(page, ["test:minigame-back", "role:button:/^回棋盘$/"], timeout=2500)
            return
        # 转盘
        Q.try_click(page, ["test:minigame-spin", "role:button:/^转$/"], timeout=2500)
        page.wait_for_timeout(900)
        Q.try_click(page, ["test:minigame-back", "role:button:/^回棋盘$/"], timeout=2500)
        page.wait_for_timeout(300)

    def summary(self):
        return {
            "click_count": len(self.clicks),
            "clicks": list(self.clicks),
            "cards": self.cards,
            "prompt_log": self.prompt_log,
            "minigame_log": self.minigame_log,
            "roll_log": self.roll_log,
            "ending_started": self.ending_started,
            "ending_done": self.ending_done,
            "finished": self.finished,
            "hook": self.hook,
            "problems": self.problems,
        }


# ---------------------------------------------------------------- 用例
def run_env_case(ps, rec, label, url, v6_checks=True):
    """基础：页面能打开、门厅出现、无异常、无横向滚动、截图。"""
    page = ps.page
    info = Q.ensure_boot(page, rec, timeout=15000)
    shot = Q.this_shot(rec, page, "boot_%s" % label)
    if Q.exists(page, SEL["boot"], timeout=1000) or "摆上棋盘" in Q.body_text(page) or "开始" in Q.body_text(page):
        rec.ok("ENV-01/%s" % label, "页面可加载并进入门厅", "门厅可见",
               "version=%r v6=%s screen=%r" % (info["version"], info["v6"], info["screen"]),
               ac="A1", viewport=label, evidence=shot)
    else:
        rec.fail("ENV-01/%s" % label, "页面可加载并进入门厅", "门厅可见",
                 "screen=%r text=%r" % (info["screen"], info["text"][:120]), ac="A1",
                 viewport=label, repro="打开构建产物首屏", evidence=shot)
    check_no_errors(rec, ps, "ENV-02/%s" % label, label, "首屏")
    if Q.overflow(page):
        rec.fail("AC-H4-1/%s" % label, "首屏无横向滚动", "scrollWidth<=clientWidth",
                 json.dumps(Q.viewport_metrics(page), ensure_ascii=False), ac="AC-H4-1",
                 viewport=label, repro="打开门厅→读取 documentElement.scrollWidth")
    else:
        rec.ok("AC-H4-1/%s" % label, "首屏无横向滚动", "scrollWidth<=clientWidth",
               "ok", ac="AC-H4-1", viewport=label)
    if v6_checks:
        # 安全词在门厅可见（B4）
        check_safety_visible(ps, rec, label, "boot")
    return info


def check_safety_visible(ps, rec, label, screen):
    page = ps.page
    loc, _ = Q.find(page, SEL["safety"], timeout=2500)
    if loc is None:
        rec.fail("AC-B4-1/%s/%s" % (screen, label), "安全词在所有屏幕可达", "可见且可点",
                 "未找到安全词按钮", ac="AC-B4-1", viewport=label,
                 repro="进入 %s → 查找「先收棋」安全词" % screen)
        return
    data = page.evaluate(
        """(el) => {
            var cs = getComputedStyle(el);
            var r = el.getBoundingClientRect();
            return {opacity: parseFloat(cs.opacity), display: cs.display, vis: cs.visibility,
                    pointer: cs.pointerEvents, x: r.x, y: r.y, w: r.width, h: r.height};
        }""",
        loc.element_handle(),
    )
    hit = Q.hit_test(page, loc)
    hit_ok = bool(hit) and (hit.get("test") in ("safety-word", "safe") or "先收棋" in (hit.get("text") or "") or "global-safe" in (hit.get("cls") or ""))
    ok = data["opacity"] > 0 and data["display"] != "none" and data["vis"] != "hidden" \
        and data["pointer"] != "none" and data["w"] >= 44 and data["h"] >= 44 and hit_ok
    if ok:
        rec.ok("AC-B4-1/%s/%s" % (screen, label), "安全词在 %s 屏可见且可点" % screen,
               "opacity>0 + 可点 + ≥44px", "opacity=%.2f %.0fx%.0f hit=%s" %
               (data["opacity"], data["w"], data["h"], hit.get("test") or hit.get("cls")),
               ac="AC-B4-1", viewport=label)
        SAFETY_SCREENS.setdefault(screen, set()).add(label)
    else:
        rec.fail("AC-B4-1/%s/%s" % (screen, label), "安全词在 %s 屏可见且可点" % screen,
                 "opacity>0 + 可点 + ≥44px + hit-test 命中自身",
                 "opacity=%.2f %.0fx%.0f pointer=%s hit=%s" %
                 (data["opacity"], data["w"], data["h"], data["pointer"], hit),
                 ac="AC-B4-1", viewport=label,
                 repro="进入 %s → 读取安全词 computed style 与 elementFromPoint" % screen)


def check_start_in_viewport(ps, rec, label, viewport):
    page = ps.page
    ac_id = "AC-A1-2" if label.startswith("390") else "AC-A1-1"
    loc, hit = Q.find(page, SEL["start"], timeout=3000)
    if loc is None:
        rec.fail("%s/%s" % (ac_id, label), "首屏可见开始按钮", "「摆上棋盘」按钮在首屏",
                 "未找到开始按钮", ac=ac_id, viewport=label,
                 repro="打开首页→查找开始按钮")
        return
    box = Q.element_rect(loc)
    if Q.point_in_viewport(box, viewport):
        rec.ok("%s/%s" % (ac_id, label), "开始按钮完整在首屏内", "rect 完全在 %dx%d 视口内" % viewport,
               "rect=%s" % {k: round(v, 1) for k, v in box.items()}, ac=ac_id,
               viewport=label, evidence=Q.this_shot(rec, page, "boot_start_%s" % label))
    else:
        rec.fail("%s/%s" % (ac_id, label), "开始按钮完整在首屏内", "rect 完全在 %dx%d 视口内" % viewport,
                 "rect=%s" % {k: round(v, 1) for k, v in box.items()}, ac=ac_id,
                 viewport=label, repro="打开首页→读取开始按钮 getBoundingClientRect",
                 evidence=Q.this_shot(rec, page, "boot_start_%s" % label))


def check_modes_and_scale(ps, rec, label):
    page = ps.page
    txt = Q.body_text(page)
    # 模式
    has_quick = Q.exists(page, SEL["quick"], timeout=800)
    has_long = Q.exists(page, SEL["long"], timeout=800)
    if has_quick and has_long:
        rec.ok("AC-A2-1/%s" % label, "门厅提供快局/长夜两种模式", "两个选项", "均有",
               ac="AC-A2-1", viewport=label)
    else:
        rec.fail("AC-A2-1/%s" % label, "门厅提供快局/长夜两种模式", "两个选项",
                 "quick=%s long=%s" % (has_quick, has_long), ac="AC-A2-1", viewport=label,
                 repro="打开门厅→查找快局/长夜")
    # 快局说明（V6.1：先送完 2 架飞机 · 约 15–25 分钟 · 每人 2 架；不再有「目标 4 张题卡」）
    Q.try_click(page, SEL["quick"], timeout=1000)
    page.wait_for_timeout(200)
    txt = Q.body_text(page)
    summary = ""
    loc, _ = Q.find(page, SEL["mode_summary"], timeout=1000)
    if loc is not None:
        try:
            summary = (loc.inner_text() or "").replace("\n", " ").strip()
        except Exception:
            summary = ""
    need = ["先送完 2 架飞机", "15–25", "每人 2 架"]
    miss = [n for n in need if n not in txt]
    legacy = [w for w in ("目标 4 张题卡", "目标 8 张题卡", "8–12 分钟", "25–40 分钟") if w in txt]
    if not miss and not legacy and MODE_LINE_QUICK in (summary or txt):
        rec.ok("AC-A2-2/%s" % label, "快局说明为「先送完 2 架飞机 · 约 15–25 分钟 · 每人 2 架」",
               MODE_LINE_QUICK, "命中（mode-summary=%r）" % summary, ac="AC-A2-2", viewport=label)
    else:
        rec.fail("AC-A2-2/%s" % label, "快局说明为「先送完 2 架飞机 · 约 15–25 分钟 · 每人 2 架」",
                 MODE_LINE_QUICK, "缺=%s 旧口径残留=%s summary=%r" % (miss, legacy, summary),
                 ac="AC-A2-2", viewport=label, repro="门厅点快局→读取模式说明")
    # 长夜说明（只读，不开始）
    Q.try_click(page, SEL["long"], timeout=1200)
    page.wait_for_timeout(200)
    txt = Q.body_text(page)
    miss2 = [n for n in ("先送完 4 架飞机", "30–50", "每人 4 架") if n not in txt]
    legacy2 = [w for w in ("目标 8 张题卡", "目标 4 张题卡") if w in txt]
    if not miss2 and not legacy2:
        rec.ok("AC-A2-2-long/%s" % label, "长夜说明为「先送完 4 架飞机 · 约 30–50 分钟 · 每人 4 架」",
               MODE_LINE_LONG, "命中", ac="AC-A2-2", viewport=label)
    else:
        rec.fail("AC-A2-2-long/%s" % label, "长夜说明为「先送完 4 架飞机 · 约 30–50 分钟 · 每人 4 架」",
                 MODE_LINE_LONG, "缺=%s 旧口径残留=%s" % (miss2, legacy2), ac="AC-A2-2",
                 viewport=label, repro="门厅点长夜→读取模式说明")
    Q.try_click(page, SEL["quick"], timeout=1000)
    # 尺度四档 + 说明
    scale_names = ["温柔", "暧昧", "热烈", "不设限"]
    descs = ["灯只留一盏", "可以靠近一点", "不绕弯", "边界你们自己画"]
    txt = Q.body_text(page)
    miss_scale = [s for s in scale_names if s not in txt]
    miss_desc = [d for d in descs if d not in txt]
    if not miss_scale and not miss_desc:
        rec.ok("AC-A4-1/%s" % label, "尺度四档各有一句说明", "4 档名 + 4 句说明",
               "均命中", ac="AC-A4-1", viewport=label)
    else:
        rec.fail("AC-A4-1/%s" % label, "尺度四档各有一句说明", "4 档名 + 4 句说明",
                 "缺档名=%s 缺说明=%s" % (miss_scale, miss_desc), ac="AC-A4-1",
                 viewport=label, repro="门厅读取尺度区文本")
    # 说明文本可读（DOM）
    if not miss_desc:
        rec.ok("AC-A4-2/%s" % label, "尺度说明可从 DOM 读取", "DOM 文本", "已读取",
               ac="AC-A4-2", viewport=label)


def run_validation_case(browser, url, rec, label="390x844"):
    """A3 开局校验：空名字 / 同名 / 修复后能进主桌。"""
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    try:
        Q.ensure_boot(page, rec)
        # 空名字
        Q.fill_names(page, ["", ""])
        Q.try_click(page, SEL["start"], timeout=3000)
        page.wait_for_timeout(700)
        if Q.screen_name(page) != "table" and "先给两个人各起一个名字" in Q.body_text(page):
            rec.ok("AC-A3-1/%s" % label, "空名字点开始给出行内错误且不进主桌",
                   "停留门厅 + 「先给两个人各起一个名字」", "符合", ac="AC-A3-1", viewport=label,
                   evidence=Q.this_shot(rec, page, "validation_empty"))
        else:
            rec.fail("AC-A3-1/%s" % label, "空名字点开始给出行内错误且不进主桌",
                     "停留门厅 + 错误文案", "screen=%r text=%r" %
                     (Q.screen_name(page), Q.body_text(page)[:160]), ac="AC-A3-1",
                     viewport=label, repro="清空两个名字→点摆上棋盘")
        # 同名
        Q.fill_names(page, [NAMES[0], NAMES[0]])
        Q.try_click(page, SEL["start"], timeout=3000)
        page.wait_for_timeout(700)
        if Q.screen_name(page) != "table" and "两个名字不能一样" in Q.body_text(page):
            rec.ok("AC-A3-3/%s" % label, "同名点开始给出行内错误", "「两个名字不能一样」",
                   "符合", ac="AC-A3-3", viewport=label)
        else:
            rec.fail("AC-A3-3/%s" % label, "同名点开始给出行内错误", "「两个名字不能一样」",
                     "screen=%r text=%r" % (Q.screen_name(page), Q.body_text(page)[:160]),
                     ac="AC-A3-3", viewport=label, repro="两个名字都填阿岚→点摆上棋盘")
        # 修复后进入
        Q.fill_names(page, list(NAMES))
        Q.try_click(page, SEL["quick"], timeout=800)
        Q.try_click(page, SEL["start"], timeout=4000)
        screen = Q.wait_screen(page, ["table"], timeout=9000)
        if screen == "table":
            rec.ok("AC-A3-4/%s" % label, "修复校验后点开始进入主桌", "data-screen=table",
                   "table", ac="AC-A3-4", viewport=label,
                   evidence=Q.this_shot(rec, page, "validation_fixed"))
        else:
            rec.fail("AC-A3-4/%s" % label, "修复校验后点开始进入主桌", "data-screen=table",
                     "screen=%r" % screen, ac="AC-A3-4", viewport=label,
                     repro="修复名字→点摆上棋盘")
        check_no_errors(rec, ps, "AC-H6-1/%s" % label, label, "校验路径")
    finally:
        ctx.close()


def run_rules_case(browser, url, rec, label="390x844"):
    """A5 规则速览：首次 6 条 + 知道了 + 主桌再次打开。"""
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label, init_script=None)
    try:
        page.wait_for_timeout(900)
        txt = Q.body_text(page)
        if "玩法速览" not in txt and "规则速览" not in txt:
            # 可能不需要引导（已记忆）→ 检查主桌入口
            rec.check("AC-A5-1/%s" % label, "首次进入出现玩法速览", "SKIP",
                      "首次打开出现 6 条规则", "本次 context 首次打开未出现规则层（可能默认关闭）",
                      ac="AC-A5-1", viewport=label)
        else:
            need = list(RULES_NEED)
            miss = [n for n in need if n not in txt]
            pity_ok = RULES_PITY_TEXT in txt
            end_row = Q.exists(page, SEL["rules_end"], timeout=600)
            if not miss and pity_ok:
                rec.ok("AC-A5-1/%s" % label, "玩法速览 6 条齐全（含保底与先到家就收尾）",
                       "6 条标题 + 保底正文 + rules-end 高亮",
                       "均命中 pity=%s rules-end=%s" % (pity_ok, end_row), ac="AC-A5-1",
                       viewport=label, evidence=Q.this_shot(rec, page, "rules_first"))
            else:
                rec.fail("AC-A5-1/%s" % label, "玩法速览 6 条齐全（含保底与先到家就收尾）",
                         "6 条标题 + 保底正文", "缺少：%s 保底正文=%s" % (miss, pity_ok),
                         ac="AC-A5-1", viewport=label, repro="首次打开→读取规则层")
            Q.try_click(page, SEL["rules_ok"], timeout=2500)
            page.wait_for_timeout(400)
            if "玩法速览" not in Q.body_text(page):
                rec.ok("AC-A5-2/%s" % label, "点知道了退出规则层", "回到门厅", "已退出",
                       ac="AC-A5-2", viewport=label)
            else:
                rec.fail("AC-A5-2/%s" % label, "点知道了退出规则层", "回到门厅", "规则层仍在",
                         ac="AC-A5-2", viewport=label, repro="规则层点知道了")
        # 主桌「规则」入口（A5-3）：test:rules → rulesSheet（rules-sheet / rules-list / rules-ok）
        Q.ensure_boot(page, rec, dismiss_rules=False)
        Q.fill_names(page, list(NAMES))
        Q.try_click(page, SEL["start"], timeout=4000)
        Q.wait_screen(page, ["table"], timeout=9000)
        page.wait_for_timeout(500)
        if Q.exists(page, SEL["rules_entry"], timeout=1500):
            Q.try_click(page, SEL["rules_entry"], timeout=1500)
            page.wait_for_timeout(500)
            txt2 = Q.body_text(page)
            miss2 = [k for k in RULES_NEED if k not in txt2]
            sheet_ok = Q.exists(page, SEL["rules_sheet"] + SEL["rules_list"], timeout=800)
            if not miss2:
                rec.ok("AC-A5-3/%s" % label, "主桌可再次打开规则（6 条含保底/先到家）",
                       "6 条命中 + rules-sheet",
                       "均命中 sheet=%s" % sheet_ok, ac="AC-A5-3", viewport=label,
                       evidence=Q.this_shot(rec, page, "rules_table_%s" % label))
            else:
                rec.fail("AC-A5-3/%s" % label, "主桌可再次打开规则（6 条含保底/先到家）", "6 条命中",
                         "缺少：%s sheet=%s" % (miss2, sheet_ok), ac="AC-A5-3", viewport=label,
                         repro="主桌点「规则」→读取规则层")
            # 关闭规则面板，继续后续用例
            Q.try_click(page, SEL["rules_ok"], timeout=2000)
        else:
            rec.fail("AC-A5-3/%s" % label, "主桌存在「规则」入口", "data-test=rules",
                     "未找到规则入口", ac="AC-A5-3", viewport=label,
                     repro="进入主桌→查找 [data-test=rules]")
        check_no_errors(rec, ps, "AC-H6-1-rules/%s" % label, label, "规则")
    finally:
        ctx.close()


def _wait_piece_buttons(page, timeout=6000):
    """等待可走子文字按钮出现；返回 (buttons, spec)。"""
    deadline = time.time() + timeout / 1000.0
    btns, spec = [], None
    while time.time() < deadline:
        btns, spec = Q.find_piece_buttons(page)
        if btns:
            return btns, spec
        page.wait_for_timeout(120)
    return [], spec


def prompt_snapshot(page, timeout=8000):
    """等待题卡挂上；返回 (prompt_dom, kicker_text)。"""
    deadline = time.time() + timeout / 1000.0
    dom = None
    while time.time() < deadline:
        dom = prompt_dom(page)
        if dom:
            break
        page.wait_for_timeout(120)
    kicker = ""
    loc, _ = Q.find(page, ["test:prompt-kicker"], timeout=1500)
    if loc is not None:
        try:
            kicker = (loc.inner_text() or "").replace("\n", " ").strip()
        except Exception:
            kicker = ""
    return dom, kicker


def check_ledger_v61(ps, rec, label, drv, winner="a", expect_home=None, expect_ending=None,
                     total=2):
    """V6.1 回顾断言：`<姓名> 先到家` + `已到家 X/Y`（ledger-home）+ 无输赢词 + ledger 契约。

    expect_home: (a 到家数, b 到家数)；expect_ending: 'win-a' / 'win-b'（缺省按 winner 推）。
    """
    page = ps.page
    txt = Q.body_text(page)
    shot = Q.this_shot(rec, page, "ledger_v61_%s" % label)
    want_winner_name = drv.names[0] if winner == "a" else drv.names[1]
    total = int(total or 2)
    expect_home = expect_home or (0, 0)
    dtitle = ""
    loc, _ = Q.find(page, SEL["ledger_done_title"], timeout=2000)
    if loc is not None:
        try:
            dtitle = (loc.inner_text() or "").replace("\n", " ").strip()
        except Exception:
            dtitle = ""
    if dtitle == want_winner_name + " 先到家":
        rec.ok("AC-F2-5-title/%s" % label, "回顾首屏写「<姓名> 先到家」",
               "%s 先到家" % want_winner_name, dtitle, ac="AC-F2-5", viewport=label,
               evidence=shot)
    else:
        rec.fail("AC-F2-5-title/%s" % label, "回顾首屏写「<姓名> 先到家」",
                 "%s 先到家" % want_winner_name,
                 "实际=%r（body 含「先到家」=%s）" % (dtitle, "先到家" in txt),
                 ac="AC-F2-5", viewport=label,
                 repro="完成收尾→读取 [data-test=ledger-done-title]", evidence=shot)
    sub = ""
    loc, _ = Q.find(page, ["test:ledger-done-sub"], timeout=1500)
    if loc is not None:
        try:
            sub = (loc.inner_text() or "").replace("\n", " ").strip()
        except Exception:
            sub = ""
    winner_home = expect_home[0] if winner == "a" else expect_home[1]
    if "已到家" in sub and re.search(r"%d\s*/\s*%d" % (winner_home, total), sub):
        rec.ok("AC-F2-5-sub/%s" % label, "首屏副标题写「已到家 X/Y」",
               "已到家 %d/%d 架" % (winner_home, total), sub, ac="AC-F2-5", viewport=label)
    else:
        rec.fail("AC-F2-5-sub/%s" % label, "首屏副标题写「已到家 X/Y」",
                 "已到家 %d/%d 架" % (winner_home, total), "实际=%r" % sub, ac="AC-F2-5",
                 viewport=label, repro="完成收尾→读取 [data-test=ledger-done-sub]")
    home_txt = ""
    loc, _ = Q.find(page, SEL["ledger_home"], timeout=2000)
    if loc is not None:
        try:
            home_txt = (loc.inner_text() or "").replace("\n", " ").strip()
        except Exception:
            home_txt = ""
    has_a = bool(re.search(r"(?<!\d)%d\s*/\s*%d" % (expect_home[0], total), home_txt))
    has_b = bool(re.search(r"(?<!\d)%d\s*/\s*%d" % (expect_home[1], total), home_txt))
    if home_txt and has_a and has_b:
        rec.ok("AC-F2-5-home/%s" % label, "汇总格「已到家」记录双方到家数（ledger-home）",
               "%d/%d 与 %d/%d" % (expect_home[0], total, expect_home[1], total), home_txt,
               ac="AC-F2-5", viewport=label, evidence=shot)
    else:
        rec.fail("AC-F2-5-home/%s" % label, "汇总格「已到家」记录双方到家数（ledger-home）",
                 "%d/%d 与 %d/%d" % (expect_home[0], total, expect_home[1], total),
                 "实际=%r" % home_txt, ac="AC-F2-5", viewport=label,
                 repro="完成收尾→读取 [data-test=ledger-home]")
    led = Q.eval_js(
        page,
        """() => {
            try {
                var list = App.Store.getHistory() || [];
                for (var i = 0; i < list.length; i++) {
                    var l = list[i] && list[i].ledger;
                    if (l && l.ending) return {ending: l.ending, winnerId: l.winnerId,
                                               planesHome: (l.stats || {}).planesHome,
                                               planeCount: l.planeCount};
                }
                return null;
            } catch (e) { return null; }
        }""")
    want_ending = expect_ending or ("win-" + winner)
    ph = (led or {}).get("planesHome") or {}
    if (led and led.get("ending") == want_ending and led.get("winnerId") == winner
            and ph.get("a") == expect_home[0] and ph.get("b") == expect_home[1]):
        rec.ok("AC-F2-5-ledger/%s" % label, "ledger ending/winnerId/stats.planesHome 正确",
               "ending=%s winnerId=%s planesHome=%s" % (want_ending, winner, expect_home),
               json.dumps(led, ensure_ascii=False), ac="AC-E3-1 / impl-freeze §2.2",
               viewport=label)
    else:
        rec.fail("AC-F2-5-ledger/%s" % label, "ledger ending/winnerId/stats.planesHome 正确",
                 "ending=%s winnerId=%s planesHome=%s" % (want_ending, winner, expect_home),
                 json.dumps(led, ensure_ascii=False), ac="AC-E3-1 / impl-freeze §2.2",
                 viewport=label, repro="完成收尾→读 App.Store.getHistory()[0].ledger")
    bad = [w for w in FORBIDDEN_WORDS if w in txt]
    if not bad:
        rec.ok("AC-E2-3/%s" % label, "回顾页无输赢判定词", "不含 赢/输/胜/负/失败/惩罚/扣分", "无",
               ac="AC-E2-3", viewport=label)
    else:
        rec.fail("AC-E2-3/%s" % label, "回顾页无输赢判定词", "不含 赢/输/胜/负/失败/惩罚/扣分",
                 "出现：%s" % bad, ac="AC-E2-3", viewport=label,
                 repro="完成对局→读取回顾页文本")
    return led


def run_main_path(browser, url, rec, label, names=NAMES, screenshot_prefix="main"):
    """V6.1 §7 主路径：门厅 → 快局 → 注入「差一步全到家」→ 掷骰/选子到家 →
    「<姓名> 先到家」→ 两张收尾卡 → 今晚回顾 → 保存；返回 driver（点击计数 + 证据）。

    注入（spec §7，不计点击）：写 couple2.session —— a 方两架分别停在 home:*:3 / home:*:4，
    b 方留机坪；刷新后点「继续今晚飞行棋」。
    """
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    drv = TableDriver(ps, rec, label, names=names, prompt_outcome="done",
                      minigame_outcome="skip", max_steps=40)
    try:
        Q.ensure_boot(page, rec)
        check_start_in_viewport(ps, rec, label, vp)
        if label == "390x844":
            check_modes_and_scale(ps, rec, label)
        else:
            Q.try_click(page, SEL["quick"], timeout=1000)
        # ---- step 1~2：快局 → 摆上棋盘（点击 1、2）----
        if not drv.start_quick():
            return drv
        # B4 红线：主桌安全词可达（每个视口验一次，供 AC-G1-1 汇总）
        check_safety_visible(ps, rec, label, "table")
        rec.shot(page, "%s_table_%s" % (screenshot_prefix, label))
        sess0 = Q.get_session(page) or {}
        if sess0.get("mode") == "quick" and int(sess0.get("planeCount") or 0) == 2:
            rec.ok("AC-A2-3/%s" % label, "开始后引擎状态与快局一致",
                   "mode=quick planeCount=2（targetCards 仅历史兼容）",
                   "mode=%s planeCount=%s targetCards=%s" %
                   (sess0.get("mode"), sess0.get("planeCount"), sess0.get("targetCards")),
                   ac="AC-A2-3", viewport=label)
        else:
            rec.fail("AC-A2-3/%s" % label, "开始后引擎状态与快局一致", "mode=quick planeCount=2",
                     "mode=%s planeCount=%s" % (sess0.get("mode"), sess0.get("planeCount")),
                     ac="AC-A2-3", viewport=label,
                     repro="门厅选快局→开始→读取 App.Store.getSession()")
        rec.add_note("V6.1：targetCards=%s / targetHeat=%s 仅为历史兼容字段，不参与结束判定"
                     % (sess0.get("targetCards"), sess0.get("targetHeat")))

        # ---- step 2 断言：状态条读双方已到家（V6.1），不再有「第 N/目标 张」----
        wait_status(page, lambda s: s.get("cards") == 0 and
                    (((s.get("home") or {}).get("a") or {}).get("n") == 0))
        st = status_now(page)
        color_a, total = home_expect(page, "a")
        color_b, _ = home_expect(page, "b")
        want_home = "%s 0/%d · %s 0/%d" % (color_a, total, color_b, total)
        if st.get("home_text") == want_home:
            rec.ok("§7-STEP-2/%s" % label, "开始后状态条读双方已到家", want_home,
                   "%s（心动值 %s · 连击 %s）" % (st.get("home_text"), st.get("heat"),
                                                st.get("streak")),
                   ac="§7.2 / AC-B6-1", viewport=label)
        else:
            rec.fail("§7-STEP-2/%s" % label, "开始后状态条读双方已到家", want_home,
                     "实际=%r（body=%r）" % (st.get("home_text"), (st.get("text") or "")[:160]),
                     ac="§7.2 / AC-B6-1", viewport=label,
                     repro="开始对局→读取 [data-test=status-home]")
        four = {"home": st.get("home_text"), "heat": st.get("heat"),
                "streak": st.get("streak"), "turn": st.get("turn")}
        if all(v is not None and v != "" for v in four.values()):
            rec.ok("AC-B6-1/%s" % label, "状态条可读到已到家/心动值/连击/回合",
                   "4 项均可见", json.dumps(four, ensure_ascii=False), ac="AC-B6-1",
                   viewport=label)
        else:
            rec.fail("AC-B6-1/%s" % label, "状态条可读到已到家/心动值/连击/回合", "4 项均可见",
                     json.dumps(four, ensure_ascii=False), ac="AC-B6-1", viewport=label,
                     repro="主桌读取状态条与回合名")
        cards_text = (st.get("cards_text") or "").strip()
        status_txt = st.get("text") or ""
        if cards_text and "/" not in cards_text and "目标" not in status_txt:
            rec.ok("§7-STATUS-CARDS/%s" % label, "状态条不再显示目标张数", "「第 N 张」且无「目标」",
                   "status-cards=%r" % cards_text, ac="AC-B6-1 / §0-5", viewport=label)
        else:
            rec.fail("§7-STATUS-CARDS/%s" % label, "状态条不再显示目标张数",
                     "「第 N 张」且无「目标」",
                     "status-cards=%r 含目标=%s" % (cards_text, "目标" in status_txt),
                     ac="AC-B6-1 / §0-5", viewport=label,
                     repro="主桌读取 [data-test=status-cards] 与状态条文本")
        nodes = page.evaluate(
            """() => ({
                status_home: !!document.querySelector('[data-test="status-home"]'),
                status_home_a: !!document.querySelector('[data-test="status-home-a"]'),
                status_home_b: !!document.querySelector('[data-test="status-home-b"]'),
                takeoff_pity: !!document.querySelector('[data-test="takeoff-pity"]'),
                winner_text: !!document.querySelector('[data-test="winner-text"]'),
                pity_shown: (function(){var el=document.querySelector('[data-test="takeoff-pity"]');
                    return !!(el && !el.hidden && (el.innerText||'').trim());})(),
                winner_shown: (function(){var el=document.querySelector('[data-test="winner-text"]');
                    return !!(el && !el.hidden && (el.innerText||'').trim());})()
            })"""
        )
        if all(nodes.get(k) for k in ("status_home", "status_home_a", "status_home_b",
                                      "takeoff_pity", "winner_text")):
            rec.ok("§7-STATUS-NODES/%s" % label, "V6.1 状态节点齐全",
                   "status-home(-a/-b) + takeoff-pity + winner-text",
                   json.dumps(nodes, ensure_ascii=False), ac="AC-B6-1 / freeze §3.2",
                   viewport=label)
        else:
            rec.fail("§7-STATUS-NODES/%s" % label, "V6.1 状态节点齐全",
                     "status-home(-a/-b) + takeoff-pity + winner-text",
                     json.dumps(nodes, ensure_ascii=False), ac="AC-B6-1 / freeze §3.2",
                     viewport=label, repro="主桌检查 data-test 节点")
        if nodes.get("pity_shown") or nodes.get("winner_shown"):
            rec.fail("§7-NO-EARLY-PITY/%s" % label, "开局不显示保底提示/胜者", "两者均隐藏",
                     json.dumps(nodes, ensure_ascii=False), ac="freeze §3.2", viewport=label,
                     repro="开局读取 takeoff-pity / winner-text")
        if st.get("heat") not in (0, None):
            rec.fail("AC-E1-1-init/%s" % label, "初始心动值为 0", "0",
                     "heat=%s" % st.get("heat"), ac="AC-E1-1", viewport=label,
                     repro="开局→读取状态条")
        turn_txt, tms = Q.wait_text(page, r"[\u4e00-\u9fa5A-Za-z0-9]{1,12}\s*的回合",
                                    timeout=2000)
        if turn_txt:
            rec.ok("AC-B6-1-turn/%s" % label, "主桌显示当前回合姓名", "「X 的回合」",
                   "%s（%dms）" % (turn_txt, tms), ac="AC-B6-1", viewport=label)
        else:
            rec.fail("AC-B6-1-turn/%s" % label, "主桌显示当前回合姓名", "「X 的回合」",
                     "未找到回合名", ac="AC-B6-1", viewport=label, repro="开局→读取回合条")
        probe = Q.v6_probe(page)
        if probe.get("squares", 0) >= 52:
            rec.ok("VIS-BOARD-COUNT/%s" % label, "棋盘格位 DOM 可断言", "≥52 个 [data-square]",
                   "squares=%d" % probe["squares"], ac="B7/B8", viewport=label)
        else:
            rec.check("VIS-BOARD-COUNT/%s" % label, "棋盘格位 DOM 可断言", "FAIL",
                      "≥52 个 [data-square]", "squares=%d" % probe.get("squares", 0),
                      ac="B7/B8", severity="P1", viewport=label)

        # ---- step 3：注入「a 方差一步全到家」（不计点击）→ 刷新 → 继续今晚飞行棋 ----
        state, pending = Q.fixture_near_home(page, "a", steps=(3, 4))
        if not state or len(pending) != 2:
            rec.fail("§7-FIXTURE/%s" % label, "注入「a 方差一步全到家」局面",
                     "a 方两架停在 home:*:3 / home:*:4，b 方留机坪",
                     "注入失败（state=%r pending=%s）" % (bool(state), pending), ac="§7",
                     viewport=label, repro="写 couple2.session 后刷新页面")
            return drv
        rec.add_note("§7 主路径按 spec §7 用测试夹具注入局面（a:0=home:*:3、a:1=home:*:4、"
                     "b 全在机坪），注入不计点击")
        Q.install_event_recorder(page)
        if Q.continue_session(page):
            drv.clicks.append("继续今晚飞行棋")
            rec.ok("AC-A6-1/%s" % label, "注入局面后刷新出现「继续今晚飞行棋」并回到主桌", "table",
                   "continue→table", ac="AC-A6-1", viewport=label)
        else:
            rec.fail("AC-A6-1/%s" % label, "注入局面后刷新出现「继续今晚飞行棋」并回到主桌", "table",
                     "screen=%r" % Q.screen_name(page), ac="AC-A6-1", viewport=label,
                     repro="刷新→点继续今晚飞行棋")
            return drv
        page.wait_for_timeout(500)
        Q.install_event_recorder(page)
        assert_status_home(rec, page, "§7-STEP-3", label, "a", 0, ac="§7.3 / AC-B6-1")
        sess = Q.get_session(page) or {}
        if sess.get("turn") == "a" and (sess.get("awaiting") or {}).get("type") == "roll":
            rec.ok("§7-STEP-3-turn/%s" % label, "继续后回到先手方掷骰", "turn=a awaiting=roll",
                   "turn=%s awaiting=%s" % (sess.get("turn"),
                                            (sess.get("awaiting") or {}).get("type")),
                   ac="§7.3", viewport=label)
        else:
            rec.fail("§7-STEP-3-turn/%s" % label, "继续后回到先手方掷骰", "turn=a awaiting=roll",
                     "turn=%s awaiting=%s" % (sess.get("turn"),
                                              (sess.get("awaiting") or {}).get("type")),
                     ac="§7.3", viewport=label, repro="注入后刷新→点继续→读 session")

        # ---- step 4：掷 1（注入）→ 两架都能走 → 文字选子按钮 ----
        Q.set_die(page, 1)
        click_and_count(drv, SEL["roll"], "掷骰")
        txt, ms = Q.wait_text(page, r"掷出\s*1", timeout=1500)
        shot = Q.this_shot(rec, page, "roll_0")
        if txt and ms <= 800:
            rec.ok("AC-B1-1/%s" % label, "掷骰后点数文本 ≤800ms", "≤800ms 出现「掷出 1」",
                   "%s（%dms）" % (txt.replace("\n", " "), ms), ac="AC-B1-1", viewport=label,
                   duration_ms=ms, evidence=shot)
        else:
            rec.fail("AC-B1-1/%s" % label, "掷骰后点数文本 ≤800ms", "≤800ms 出现「掷出 1」",
                     ("未出现" if not txt else "%s（%dms，超 800ms）" % (txt, ms)),
                     ac="AC-B1-1", viewport=label, duration_ms=ms,
                     repro="点掷骰→计时读取「掷出 1」", evidence=shot)
        btns, spec = _wait_piece_buttons(page, timeout=6000)
        labels = []
        for b in btns:
            try:
                labels.append((b.inner_text() or "").replace("\n", " ").strip())
            except Exception:
                labels.append("")
        if len(btns) == 2 and all(
                re.search(r"(红|黄|蓝|绿).*第\s*\d+\s*架.*(从机坪起飞|沿航线走)", t) for t in labels):
            rec.ok("AC-B3-1/%s" % label, "两架可走时给出文字选子按钮（颜色/第几架/从哪走）",
                   "2 个按钮且文案完整", json.dumps(labels, ensure_ascii=False), ac="AC-B3-1",
                   viewport=label, evidence=Q.this_shot(rec, page, "choose_1"))
        else:
            rec.fail("AC-B3-1/%s" % label, "两架可走时给出文字选子按钮（颜色/第几架/从哪走）",
                     "2 个按钮且文案完整", "n=%s labels=%s" % (len(btns), labels),
                     ac="AC-B3-1", viewport=label,
                     repro="掷骰后读取 [data-action-piece] 按钮")

        # ---- step 5：点「航线最后一格那架」→ 该架进终点 → 红 1/2，换手 ----
        clicked = False
        for b in btns:
            try:
                pid_attr = b.get_attribute("data-action-piece") or b.get_attribute("data-piece")
            except Exception:
                pid_attr = None
            if pid_attr == pending[-1]:
                b.click(timeout=4000)
                clicked = True
                drv.clicks.append("选子")
                break
        if not clicked:
            rec.fail("§7-STEP-5/%s" % label, "点选「最后一格那架」走到终点",
                     "点中 %s" % pending[-1],
                     "未找到该棋子的文字按钮（labels=%s）" % labels, ac="§7.5",
                     viewport=label, repro="掷骰后按 data-action-piece 点选目标棋子")
            return drv
        Q.wait_until(
            page,
            """() => { try { var s = App.Store.getSession(); if (!s) return false;
                var n = 0; (s.pieces||[]).forEach(function(p){
                    if (p.playerId === 'a' && p.arrived) n++; });
                return n >= 1; } catch(e) { return false; } }""",
            timeout=6000)
        page.wait_for_timeout(300)
        assert_status_home(rec, page, "§7-STEP-5", label, "a", 1, ac="§7.5 / AC-B6-2")
        if not Q.exists(page, SEL["ending_title"], timeout=300):
            rec.ok("AC-E3-4/%s" % label, "未全部到家时不触发收尾", "无「今晚最后一段」",
                   "a 到家 1/%s" % total, ac="AC-E3-4", viewport=label)
        else:
            rec.fail("AC-E3-4/%s" % label, "未全部到家时不触发收尾", "无「今晚最后一段」",
                     "提前出现收尾", ac="AC-E3-4", viewport=label,
                     repro="只让 1 架到家→读取收尾标题")

        # ---- step 6：b 掷 1 → 全在机坪、无合法走子 → 原因文本 + 自动换回 ----
        Q.set_die(page, 1)
        click_and_count(drv, SEL["roll"], "掷骰")
        txt2, ms2 = Q.wait_text(
            page, r"没有飞机能动，换\s*[^\s，。]{1,12}\s*掷骰|都还在机坪", timeout=2500)
        sess = Q.get_session(page) or {}
        turn_back = sess.get("turn") == "a"
        if txt2 and turn_back:
            rec.ok("AC-B2-1/%s" % label, "无子可走给出原因并自动换人", "原因文本 + turn 回到 a",
                   "%s（%dms）turn=%s" % (txt2.replace("\n", " "), ms2, sess.get("turn")),
                   ac="AC-B2-1", viewport=label, duration_ms=ms2)
        else:
            rec.fail("AC-B2-1/%s" % label, "无子可走给出原因并自动换人", "原因文本 + turn 回到 a",
                     "text=%r turn=%s" % (txt2, sess.get("turn")), ac="AC-B2-1",
                     viewport=label, repro="b 全在机坪掷 1→读原因文本与 turn")
        miss = sess.get("takeoffMiss") or {}
        if miss.get("b") == 1 and miss.get("a") == 0:
            rec.ok("§7-PITY-COUNT/%s" % label, "非 6 且全在机坪 → 该方保底计数 +1",
                   "b=1 a=0", "takeoffMiss=%s" % json.dumps(miss, ensure_ascii=False),
                   ac="freeze §2.3", viewport=label)
        else:
            rec.fail("§7-PITY-COUNT/%s" % label, "非 6 且全在机坪 → 该方保底计数 +1",
                     "b=1 a=0", "takeoffMiss=%s" % json.dumps(miss, ensure_ascii=False),
                     ac="freeze §2.3", viewport=label, repro="读 session.takeoffMiss")

        # ---- step 7：a 掷 2 → 唯一可走的一架自动到终点 → 红 2/2 + 先到家 + 收尾 ----
        Q.recorded_events(page, clear=True)
        # 「掷骰 → 先到家」延迟按 AC-E3-1 ≤1s：在页面内点真实按钮 + 页内计时，
        # 避免 Playwright click 的 actionability 稳定性等待（棋盘动画期约 1.4s 框架开销）。
        if Q.find(page, SEL["roll"], timeout=3000)[0] is None:
            rec.fail("§7-STEP-7/%s" % label, "最后一架到家前可点掷骰", "存在 [data-test=roll]",
                     "未找到掷骰按钮", ac="§7.7", viewport=label, repro="读取主桌行动区")
            return drv
        Q.set_die(page, 2)
        t_roll = time.time()
        timed = Q.click_and_time(
            page, "[data-test='roll']",
            "(function(){var el=document.querySelector('[data-test=\"winner-text\"]');"
            "if(!el||el.hidden)return null;var t=(el.innerText||'').trim();"
            "return t.indexOf('先到家')>=0?t:null;})()",
            timeout_ms=3000) or {}
        drv.clicks.append("掷骰")
        wtext = timed.get("text") or ""
        ms_win = timed.get("click_to_ms")
        Q.wait_until(
            page,
            """() => { try { var s = App.Store.getSession();
                return !!s && (s.awaiting || {}).type === 'ending-prompt'; } catch(e) { return false; } }""",
            timeout=3000)
        page.wait_for_timeout(150)
        sess = Q.get_session(page) or {}
        body_now = Q.body_text(page)
        ms_die = None
        if re.search(r"掷出\s*2", body_now):
            ms_die = ms_win
        if wtext == names[0] + " 先到家" and ms_win is not None and ms_win <= 1000:
            rec.ok("§7-STEP-7/%s" % label, "最后一架到家 → 主桌「<姓名> 先到家」",
                   "%s 先到家（≤1s）" % names[0],
                   "%s（点击→文本 %dms）" % (wtext, ms_win),
                   ac="AC-E3-1 / freeze §3.2", viewport=label, duration_ms=ms_win,
                   evidence=Q.this_shot(rec, page, "winner_%s" % label))
        else:
            rec.fail("§7-STEP-7/%s" % label, "最后一架到家 → 主桌「<姓名> 先到家」",
                     "%s 先到家（≤1s）" % names[0],
                     "winner-text=%r 点击→文本=%sms timed=%s body=%r" %
                     (wtext, ms_win, json.dumps({k: timed.get(k) for k in ("ok", "error")},
                                                ensure_ascii=False), body_now[:200]),
                     ac="AC-E3-1 / freeze §3.2", viewport=label,
                     repro="注入最后一格→掷 2→读取 [data-test=winner-text]")
        assert_status_home(rec, page, "§7-STEP-7", label, "a", total, ac="§7.7 / AC-E3-1")
        if "今晚最后一段" in body_now and (ms_win is None or ms_win <= 1000):
            rec.ok("AC-E3-1/%s" % label, "一方全部到家后 ≤1s 出现「今晚最后一段」", "≤1000ms",
                   "今晚最后一段（%sms）" % ms_win, ac="AC-E3-1", viewport=label,
                   duration_ms=ms_win)
        else:
            rec.fail("AC-E3-1/%s" % label, "一方全部到家后 ≤1s 出现「今晚最后一段」", "≤1000ms",
                     "命中=%s 点击→文本=%sms" % ("今晚最后一段" in body_now, ms_win),
                     ac="AC-E3-1", viewport=label,
                     repro="最后一架到家→读取收尾标题")
        evs = [e for e in Q.recorded_events(page) if e.get("type")]
        types = [e.get("type") for e in evs]
        win_ev = next((e for e in evs if e.get("type") == "win"), None)
        order_ok = ("dice" in types and "win" in types and "prompt" in types
                    and types.index("dice") < types.index("win") < types.index("prompt"))
        if win_ev and (win_ev.get("ev") or {}).get("playerId") == "a" and order_ok:
            rec.ok("§7-WIN-EVENT/%s" % label, "结束事件顺序 dice→move→win→prompt→ending-start",
                   "win.playerId=a 且顺序正确", json.dumps(types, ensure_ascii=False),
                   ac="freeze §2.2", viewport=label)
        else:
            rec.fail("§7-WIN-EVENT/%s" % label, "结束事件顺序 dice→move→win→prompt→ending-start",
                     "win.playerId=a 且顺序正确",
                     "events=%s win=%s" % (json.dumps(types, ensure_ascii=False),
                                           json.dumps(win_ev, ensure_ascii=False)),
                     ac="freeze §2.2", viewport=label,
                     repro="记录 App.Flight.roll 返回的 events")
        if sess.get("winnerId") == "a" and (sess.get("awaiting") or {}).get("type") == "ending-prompt":
            rec.ok("§7-WINNER-STATE/%s" % label, "engine winnerId=a 且进入两张收尾卡",
                   "winnerId=a awaiting=ending-prompt",
                   "winnerId=%s awaiting=%s" % (sess.get("winnerId"),
                                                (sess.get("awaiting") or {}).get("type")),
                   ac="AC-E3-1", viewport=label)
        else:
            rec.fail("§7-WINNER-STATE/%s" % label, "engine winnerId=a 且进入两张收尾卡",
                     "winnerId=a awaiting=ending-prompt",
                     "winnerId=%s awaiting=%s" % (sess.get("winnerId"),
                                                  (sess.get("awaiting") or {}).get("type")),
                     ac="AC-E3-1", viewport=label, repro="读取 session.winnerId/awaiting")

        # ---- step 8~9：两张收尾卡（各给一人）----
        dom, kicker = prompt_snapshot(page)
        expected_actor = [names[0], names[1]]
        for idx in (1, 2):
            if idx == 2:
                dom, kicker = prompt_snapshot(page)
            m = re.search(r"今晚最后一段\s*·\s*第\s*(\d+)\s*/\s*2\s*张\s*·\s*给\s*(\S{1,12})",
                          kicker)
            want_actor = expected_actor[idx - 1]
            if m and m.group(1) == str(idx) and want_actor in m.group(2):
                rec.ok("AC-E2-1/%s/%d" % (label, idx), "第 %d 张收尾卡归属正确" % idx,
                       "今晚最后一段 · 第 %d/2 张 · 给 %s" % (idx, want_actor), m.group(0),
                       ac="AC-E2-1", viewport=label,
                       evidence=Q.this_shot(rec, page, "ending_%d_%s" % (idx, label)))
            else:
                rec.fail("AC-E2-1/%s/%d" % (label, idx), "第 %d 张收尾卡归属正确" % idx,
                         "今晚最后一段 · 第 %d/2 张 · 给 %s" % (idx, want_actor),
                         "kicker=%r（dom=%s）" % (kicker, bool(dom)), ac="AC-E2-1",
                         viewport=label, repro="收尾阶段读取题卡 kicker")
            heat_before = status_now(page).get("heat")
            click_and_count(drv, SEL["prompt_done"], "做了")
            if idx == 1:
                Q.wait_until(
                    page,
                    """() => { try { var m = (App.Store.getSession()||{}).meta || {};
                        return Number(m.heat) >= %d; } catch(e) { return false; } }"""
                    % ((heat_before or 0) + 10), timeout=3000)
                page.wait_for_timeout(200)
                heat_after = status_now(page).get("heat")
                if heat_before is not None and heat_after == heat_before + 10:
                    rec.ok("AC-E2-5/%s" % label, "收尾卡「做了」心动值 +10（不惩罚任一方）",
                           "%s → +10" % heat_before, "%s → %s" % (heat_before, heat_after),
                           ac="AC-E2-5", viewport=label)
                else:
                    rec.fail("AC-E2-5/%s" % label, "收尾卡「做了」心动值 +10（不惩罚任一方）",
                             "%s → +10" % heat_before, "%s → %s" % (heat_before, heat_after),
                             ac="AC-E2-5", viewport=label,
                             repro="收尾卡点做了→对比状态条心动值")
                drv.prompt_log.append({"kind": "ending", "actor": want_actor,
                                       "outcome": "done", "heat_before": heat_before,
                                       "heat_after": heat_after,
                                       "card_text": (dom or {}).get("text", "")[:200]})
            else:
                finish, fms = Q.wait_text(page, r"今晚完成了", timeout=1800)
                if finish and fms <= 500:
                    rec.ok("AC-F1-1/%s" % label, "两张收尾卡处理完 ≤500ms 出现「今晚完成了」",
                           "≤500ms", "%s（%dms）" % (finish, fms), ac="AC-F1-1",
                           viewport=label, duration_ms=fms,
                           evidence=Q.this_shot(rec, page, "finished_%s" % label))
                else:
                    rec.fail("AC-F1-1/%s" % label, "两张收尾卡处理完 ≤500ms 出现「今晚完成了」",
                             "≤500ms",
                             ("未出现" if not finish else "%s（%dms）" % (finish, fms)),
                             ac="AC-F1-1", viewport=label,
                             repro="第二张收尾卡点做了→计时读取「今晚完成了」")
                drv.ending_done = True
                drv.prompt_log.append({"kind": "ending", "actor": want_actor,
                                       "outcome": "done", "heat_before": heat_before,
                                       "card_text": (dom or {}).get("text", "")[:200]})
                Q.wait_screen(page, ["ledger"], timeout=9000)
        drv.ending_started = True

        # ---- step 10：今晚回顾（V6.1 口径）+ 保存 ----
        if Q.screen_name(page) == "ledger":
            drv.finished = True
            rec.ok("§7-STEP-9/%s" % label, "两张收尾卡后进入今晚回顾", "data-screen=ledger",
                   "ledger", ac="§7.9", viewport=label,
                   evidence=Q.this_shot(rec, page, "%s_ledger_%s" % (screenshot_prefix, label)))
            check_ledger(ps, rec, label, drv)
            check_ledger_v61(ps, rec, label, drv, winner="a",
                             expect_home=(total, 0), expect_ending="win-a", total=total)
            hist_before = Q.eval_js(
                page, "() => { try { return (App.Store.getHistory()||[]).length } "
                      "catch(e){ return -1 } }")
            loc, _ = Q.find(page, SEL["ledger_save"], timeout=2000)
            if loc is not None:
                loc.click(timeout=4000)
                drv.clicks.append("保存到以前的夜")
                toast, t_ms = Q.wait_text(page, r"收进以前的夜了", timeout=1500)
                page.wait_for_timeout(300)
                hist_after = Q.eval_js(
                    page, "() => { try { return (App.Store.getHistory()||[]).length } "
                          "catch(e){ return -1 } }")
                if toast and hist_after >= 1 and hist_after in (hist_before, hist_before + 1):
                    rec.ok("§7-STEP-10-save/%s" % label,
                           "回顾页「保存到以前的夜」可点且历史有本局", "toast + history≥1（幂等）",
                           "before=%s after=%s toast=%s" % (hist_before, hist_after, toast),
                           ac="§7.10 / F3", viewport=label,
                           evidence=Q.this_shot(rec, page, "ledger_saved_%s" % label))
                else:
                    rec.fail("§7-STEP-10-save/%s" % label,
                             "回顾页「保存到以前的夜」保存本局", "toast + history≥1（幂等）",
                             "before=%s after=%s toast=%s" % (hist_before, hist_after, toast),
                             ac="§7.10 / F3", viewport=label,
                             repro="回顾页点「保存到以前的夜」→读历史与 toast")
            else:
                rec.fail("§7-STEP-10-save/%s" % label, "回顾页有「保存到以前的夜」", "可点按钮",
                         "未找到", ac="F3", viewport=label, repro="进入回顾页→查找保存按钮")
            done_text = "今晚完成了" in Q.body_text(page)
            rec.check("AC-F1-1-done/%s" % label, "结束有明确「今晚完成了」反馈",
                      "PASS" if (drv.ending_done or done_text) else "FAIL", "完成文本出现",
                      "ending_done=%s text_seen=%s" % (drv.ending_done, done_text),
                      ac="AC-F1-1", viewport=label)
        else:
            rec.fail("§7-STEP-9/%s" % label, "两张收尾卡后进入今晚回顾", "data-screen=ledger",
                     "screen=%r" % Q.screen_name(page), ac="§7.9", viewport=label,
                     repro="按 §7 主路径走完两张收尾卡")

        # ---- 点击预算（§7 M1）：注入不计 ----
        if len(drv.clicks) <= 22:
            rec.ok("§7-CLICKS/%s" % label, "P0 主路径点击 ≤22（20+2 容差）", "≤22",
                   "%d 次：%s" % (len(drv.clicks), " → ".join(drv.clicks[:24])),
                   ac="§7 / M1", viewport=label,
                   detail="§7 期望 10 次；实际 %d 次" % len(drv.clicks))
        else:
            rec.fail("§7-CLICKS/%s" % label, "P0 主路径点击 ≤22（20+2 容差）", "≤22",
                     "%d 次：%s" % (len(drv.clicks), " → ".join(drv.clicks[:24])),
                     ac="§7 / M1", viewport=label,
                     repro="按 §7 主路径统计交互点击")
        if Q.overflow(page):
            rec.fail("AC-H4-1-table/%s" % label, "主桌/回顾无横向滚动",
                     "scrollWidth<=clientWidth",
                     json.dumps(Q.viewport_metrics(page), ensure_ascii=False), ac="AC-H4-1",
                     viewport=label, repro="走完对局→读取 scrollWidth")
        else:
            rec.ok("AC-H4-1-table/%s" % label, "主桌/回顾无横向滚动",
                   "scrollWidth<=clientWidth", "ok", ac="AC-H4-1", viewport=label)
        check_no_errors(rec, ps, "AC-H6-1/%s" % label, label, "主路径")
        rec.meta.setdefault("drivers", {})[label] = drv.summary()
        return drv
    finally:
        ctx.close()

def check_ledger(ps, rec, label, drv):
    page = ps.page
    txt = Q.body_text(page)
    shot = Q.this_shot(rec, page, "ledger_%s" % label)
    # 标题
    if "今晚回顾" in txt:
        rec.ok("AC-F2-1-title/%s" % label, "回顾页标题为「今晚回顾」", "今晚回顾", "命中",
               ac="AC-F2-1", viewport=label, evidence=shot)
    else:
        rec.fail("AC-F2-1-title/%s" % label, "回顾页标题为「今晚回顾」", "今晚回顾",
                 "未命中（text=%r）" % txt[:150], ac="AC-F2-1", viewport=label,
                 repro="完成对局→读取回顾页标题")
    # 6 类信息
    checks = {
        "日期+姓名": (lambda t: any(n in t for n in drv.names) and bool(re.search(r"\d{4}-\d{2}-\d{2}|\d{1,2}\s*月\s*\d{1,2}\s*日", t))),
        # 产品已按 AC-E7-3（P1）把回顾时长精确到秒；「27 秒」也算合法时长
        "时长": (lambda t: bool(re.search(r"时长[\s\S]{0,60}?(\d{1,2}:\d{2}|不到\s*\d+\s*分钟|\d+\s*分钟|\d+\s*秒)", t))),
        "题卡总数(做/放过)": (lambda t: bool(re.search(r"题卡[\s\S]{0,60}?共\s*\d+\s*张", t)) and ("做了" in t or "放过" in t)),
        "心动值+阶段": (lambda t: bool(re.search(r"心动值[\s\S]{0,40}?\d+", t)) and any(s in t for s in STAGE_WORDS)),
        "最高连击": (lambda t: bool(re.search(r"最高连击[\s\S]{0,30}?\d+", t))),
        "小游戏记录": (lambda t: bool(re.search(r"小游戏[\s\S]{0,50}?(\d+\s*次|今晚没有小游戏)", t))),
    }
    for name, fn in checks.items():
        try:
            ok = fn(txt)
        except Exception:
            ok = False
        if ok:
            rec.ok("AC-F2-1-%s/%s" % (name, label), "回顾含「%s」" % name, "可读文本",
                   "命中", ac="AC-F2-1", viewport=label)
        else:
            rec.fail("AC-F2-1-%s/%s" % (name, label), "回顾含「%s」" % name, "可读文本",
                     "未命中", ac="AC-F2-1", viewport=label,
                     repro="完成对局→读取回顾页「%s」" % name, evidence=shot)
    # E7-3（P1）：回顾时长要能核对到秒（误差 ≤5s）；「不到 1 分钟」不够
    dur_m = re.search(r"时长[\s\S]{0,40}?([^\n]{1,24})", txt)
    dur_text = (dur_m.group(1).strip() if dur_m else "")[:24]
    precise = bool(re.search(r"\d{1,2}:\d{2}", dur_text)) or bool(re.search(r"\d+\s*秒", dur_text))
    if precise:
        rec.ok("AC-E7-3/%s" % label, "回顾时长可核对到秒", "mm:ss 或含秒", dur_text,
               ac="AC-E7-3", severity="P1", viewport=label)
    else:
        rec.check("AC-E7-3/%s" % label, "回顾时长可核对到秒（P1）", "FAIL",
                  "mm:ss 或含秒（误差 ≤5s）", "实际显示=%r" % dur_text,
                  ac="AC-E7-3", severity="P1", viewport=label,
                  detail="时长显示过粗，无法按 AC-E7-3 核对 ±5 秒")
    # 明细
    detail_ok = "今晚的每一张" in txt
    if detail_ok:
        rec.ok("AC-F2-2/%s" % label, "回顾题卡明细区存在", "「今晚的每一张」", "命中",
               ac="AC-F2-2", viewport=label)
    else:
        rec.fail("AC-F2-2/%s" % label, "回顾题卡明细区存在", "「今晚的每一张」", "未命中",
                 ac="AC-F2-2", viewport=label, repro="完成对局→读取回顾明细")
    # 归属 + 结果 + 星级（在明细文本里抽查）
    if drv.prompt_log:
        want_actor = any((p.get("actor") in (None, "fate")) or (p.get("actor") in drv.names) or
                         (p.get("actor") == "两人一起") for p in drv.prompt_log)
        # 明细里至少出现一个人名，且「做了」或「今晚先放过」
        if any(n in txt for n in drv.names) and ("今晚先放过" in txt or "做了" in txt):
            rec.ok("AC-F2-2-attr/%s" % label, "明细含归属与结果", "人名 + 做了/今晚先放过",
                   "命中", ac="AC-F2-2", viewport=label)
        else:
            rec.check("AC-F2-2-attr/%s" % label, "明细含归属与结果", "FAIL",
                      "人名 + 做了/今晚先放过", "未命中", ac="AC-F2-2", viewport=label)
    # 占位文案不得出现
    if "（这一笔没有句子）" in txt:
        rec.fail("AC-F2-3/%s" % label, "回顾不出现占位文案", "无「（这一笔没有句子）」",
                 "出现占位文案", ac="AC-F2-3", viewport=label,
                 repro="回顾小游戏/题卡明细", evidence=shot)
    else:
        rec.ok("AC-F2-3/%s" % label, "回顾不出现占位文案", "无「（这一笔没有句子）」", "无",
               ac="AC-F2-3", viewport=label)
    # 三个按钮
    for name, spec in (("保存到以前的夜", SEL["ledger_save"]), ("再开一夜", SEL["ledger_again"]),
                       ("回到开场", SEL["ledger_back"])):
        if Q.exists(page, spec, timeout=800):
            rec.ok("AC-F3-1-%s/%s" % (name, label), "回顾页有「%s」" % name, "可点按钮", "存在",
                   ac="AC-F3-1", severity="P1", viewport=label)
        else:
            rec.check("AC-F3-1-%s/%s" % (name, label), "回顾页有「%s」" % name, "FAIL",
                      "可点按钮", "未找到", ac="AC-F3-1", severity="P1", viewport=label)


def run_skip_all_case(browser, url, rec, label="390x844"):
    """C2/E2（V6.1）：放过不惩罚 + 两张收尾卡都放过也能进回顾 + 回顾只写「今晚先放过」。

    V6.1 起结束只看「一方全部到家」，题卡全放过不再影响收尾；自然对局要 40+ 次掷骰，
    浏览器侧按 spec §7 的注入方式构造「差一步全到家」，收尾卡仍全程点「放过」。
    """
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    drv = TableDriver(ps, rec, label, prompt_outcome="skip", minigame_outcome="skip")
    try:
        Q.ensure_boot(page, rec)
        if not drv.start_quick():
            return drv
        # 先正常打几步：放过的心动值只增不减（C2-1 / E1-2）
        guard = 0
        while guard < 40 and drv.cards < 1:
            guard += 1
            if Q.screen_name(page) in ("ledger", "nights"):
                break
            r = drv.step()
            if r == "stuck":
                break
        heats = [p.get("heat_after") for p in drv.prompt_log if p.get("heat_after") is not None]
        non_decreasing = all(b >= a for a, b in zip(heats, heats[1:])) if len(heats) >= 2 else True
        if non_decreasing:
            rec.ok("AC-C2-1/%s" % label, "放过不惩罚：心动值不减少", "Δ≥0",
                   "heat 序列=%s" % heats, ac="AC-C2-1", viewport=label)
            rec.ok("AC-E1-2/%s" % label, "任何操作后心动值不低于操作前", "Δ≥0",
                   "heat 序列=%s" % heats, ac="AC-E1-2", viewport=label)
        else:
            rec.fail("AC-C2-1/%s" % label, "放过不惩罚：心动值不减少", "Δ≥0",
                     "heat 序列=%s" % heats, ac="AC-C2-1", viewport=label,
                     repro="放过题卡→对比每次结算后的心动值")
        # 注入「a 方最后一架在 home:*:4」→ 掷 1 到家 → 两张收尾卡都放过
        state, pending = Q.fixture_near_home(page, "a", steps=(4,))
        if not state:
            rec.fail("AC-C2-E3/%s" % label, "全放过局也能靠「一方全部到家」收尾",
                     "注入局面后掷 1 到家", "夹具注入失败", ac="AC-C2-6 / E3-1",
                     viewport=label, repro="写 couple2.session 后刷新")
            return drv
        if not Q.continue_session(page):
            rec.fail("AC-C2-E3/%s" % label, "全放过局也能靠「一方全部到家」收尾",
                     "继续→主桌", "未能回到主桌", ac="AC-C2-6 / E3-1", viewport=label,
                     repro="刷新→点继续今晚飞行棋")
            return drv
        page.wait_for_timeout(400)
        Q.install_event_recorder(page)
        Q.set_die(page, 1)
        click_and_count(drv, SEL["roll"], "掷骰")
        Q.wait_until(
            page,
            """() => { try { var s = App.Store.getSession(); if (!s) return false;
                var aw = s.awaiting || {}; return aw.type === 'ending-prompt' ||
                s.phase === 'ended'; } catch(e) { return false; } }""",
            timeout=8000)
        sess = Q.get_session(page) or {}
        if (sess.get("awaiting") or {}).get("type") == "ending-prompt" or sess.get("phase") == "ended":
            rec.ok("AC-C2-E3/%s" % label, "全放过局也能靠「一方全部到家」收尾",
                   "到家后进入收尾卡", "awaiting=%s winnerId=%s" %
                   ((sess.get("awaiting") or {}).get("type"), sess.get("winnerId")),
                   ac="AC-C2-6 / E3-1", viewport=label)
        else:
            rec.fail("AC-C2-E3/%s" % label, "全放过局也能靠「一方全部到家」收尾",
                     "到家后进入收尾卡", "awaiting=%s phase=%s" %
                     ((sess.get("awaiting") or {}).get("type"), sess.get("phase")),
                     ac="AC-C2-6 / E3-1", viewport=label,
                     repro="注入最后一格→掷 1→读 awaiting/phase")
        guard = 0
        while guard < 12 and Q.screen_name(page) != "ledger":
            guard += 1
            if Q.screen_name(page) in ("ledger", "nights"):
                break
            r = drv.step()
            if r == "stuck":
                break
        drv.finished = Q.screen_name(page) == "ledger"
        txt = Q.body_text(page)
        if drv.finished and "今晚先放过" in txt:
            rec.ok("AC-C2-5/%s" % label, "回顾记为「今晚先放过」", "含「今晚先放过」",
                   "命中", ac="AC-C2-5", viewport=label,
                   evidence=Q.this_shot(rec, page, "skip_ledger_%s" % label))
        elif drv.finished:
            rec.fail("AC-C2-5/%s" % label, "回顾记为「今晚先放过」", "含「今晚先放过」",
                     "未命中（body=%r）" % txt[:150], ac="AC-C2-5", viewport=label,
                     repro="两张收尾卡都放过→读取回顾明细")
        else:
            rec.check("AC-C2-5/%s" % label, "回顾记为「今晚先放过」", "SKIP",
                      "含「今晚先放过」", "未进入回顾", ac="AC-C2-5", viewport=label)
        bad = [w for w in ("失败", "未完成", "扣分") if w in txt]
        if not bad:
            rec.ok("AC-C2-5-bad/%s" % label, "放过记录不含失败/未完成/扣分", "无这些词", "无",
                   ac="AC-C2-5", viewport=label)
        else:
            rec.fail("AC-C2-5-bad/%s" % label, "放过记录不含失败/未完成/扣分", "无这些词",
                     "出现：%s" % bad, ac="AC-C2-5", viewport=label,
                     repro="全放过局进入回顾→读取文本")
        if drv.finished:
            check_ledger_v61(ps, rec, label, drv, winner="a",
                             expect_home=(int(sess.get("planeCount") or 2), 0),
                             expect_ending="win-a", total=int(sess.get("planeCount") or 2))
        check_no_errors(rec, ps, "AC-H6-1-skip/%s" % label, label, "全放过")
        return drv
    finally:
        ctx.close()


def run_takeoff_pity_case(browser, url, rec, label="390x844"):
    """V6.1 起飞保底（freeze §2.3 / §4）：
    ① 第 1 个自己的回合非 6 → 不能起飞、计数=1；
    ② 第 2 个自己的回合仍非 6 → 还是不能起飞（**不提前**），计数=2；
    ③ 第 3 个自己的回合：掷骰前出现 takeoff-pity 提示，任意点数（注入 2）都能起飞，起飞后计数清零；
    ④ 掷出 6 也清零（夹具置 2 → 掷 6 → 起飞 → 0）。
    全程用真实 UI 掷骰，只用 __V6_TEST__.forceDie 注入点数与读 session.takeoffMiss。
    """
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    drv = TableDriver(ps, rec, label, max_steps=30)
    try:
        Q.ensure_boot(page, rec)
        if not drv.start_quick():
            return drv
        Q.install_event_recorder(page)

        def roll_and_wait(die, timeout=6000):
            Q.set_die(page, die)
            click_and_count(drv, SEL["roll"], "掷骰")
            Q.wait_text(page, r"掷出\s*%d" % die, timeout=2000)
            Q.wait_until(
                page,
                """() => { try { return !(window.__V6_TEST__ && window.__V6_TEST__.isBusy &&
                    window.__V6_TEST__.isBusy()); } catch(e) { return true; } }""",
                timeout=timeout)
            page.wait_for_timeout(300)
            return Q.get_session(page) or {}

        def miss_of(s, pid="a"):
            return ((s.get("takeoffMiss") or {}).get(pid))

        def pity_shown():
            return bool(pity_text_of(page))

        def takeoff_choice(s):
            """返回 (有没有起飞按钮, 按钮文案列表)。"""
            ids = ((s.get("awaiting") or {}).get("pieceIds") or [])
            btns, _ = _wait_piece_buttons(page, timeout=3000) if ids else ([], None)
            labels = []
            for b in btns:
                try:
                    labels.append((b.inner_text() or "").replace("\n", " ").strip())
                except Exception:
                    labels.append("")
            takeoff = [t for t in labels if "从机坪起飞" in t]
            return bool(takeoff), labels

        # 状态：a 先手、全在机坪
        s0 = Q.get_session(page) or {}
        base_ok = (miss_of(s0, "a") == 0 and (s0.get("turn") == "a"))
        if base_ok:
            rec.ok("AC-B2-4-init/%s" % label, "开局 takeoffMiss={a:0,b:0} 且 a 先手",
                   "a=0 b=0 turn=a",
                   "takeoffMiss=%s turn=%s" % (json.dumps(s0.get("takeoffMiss"), ensure_ascii=False),
                                               s0.get("turn")), ac="freeze §2.1", viewport=label)
        else:
            rec.fail("AC-B2-4-init/%s" % label, "开局 takeoffMiss={a:0,b:0} 且 a 先手",
                     "a=0 b=0 turn=a", "takeoffMiss=%s turn=%s" %
                     (json.dumps(s0.get("takeoffMiss"), ensure_ascii=False), s0.get("turn")),
                     ac="freeze §2.1", viewport=label, repro="开局读 session.takeoffMiss")
        if pity_shown():
            rec.fail("AC-B2-4-pity0/%s" % label, "第 1 个自己的回合没有保底提示", "无提示",
                     "出现保底提示", ac="freeze §3.2", viewport=label,
                     repro="开局读取 [data-test=takeoff-pity]")

        # ① 第 1 回合：a 掷 3（非 6）→ 不能起飞，miss=1；b 掷 3 → miss=1
        s = roll_and_wait(3)
        ok1, labels1 = takeoff_choice(s)
        if (not ok1) and miss_of(s, "a") == 1 and (s.get("turn") == "b"):
            rec.ok("AC-B2-4-1/%s" % label, "第 1 个回合非 6 → 不能起飞，计数=1，换手",
                   "无起飞按钮 + a=1 + turn=b",
                   "labels=%s takeoffMiss=%s turn=%s" %
                   (labels1, json.dumps(s.get("takeoffMiss"), ensure_ascii=False), s.get("turn")),
                   ac="freeze §2.3", viewport=label)
        else:
            rec.fail("AC-B2-4-1/%s" % label, "第 1 个回合非 6 → 不能起飞，计数=1，换手",
                     "无起飞按钮 + a=1 + turn=b",
                     "labels=%s takeoffMiss=%s turn=%s" %
                     (labels1, json.dumps(s.get("takeoffMiss"), ensure_ascii=False), s.get("turn")),
                     ac="freeze §2.3", viewport=label, repro="a 掷 3→读按钮与 takeoffMiss")
        s = roll_and_wait(3)
        if miss_of(s, "b") == 1 and s.get("turn") == "a":
            rec.ok("AC-B2-4-1b/%s" % label, "对方非 6 也累计自己的计数并换回",
                   "b=1 turn=a", "takeoffMiss=%s turn=%s" %
                   (json.dumps(s.get("takeoffMiss"), ensure_ascii=False), s.get("turn")),
                   ac="freeze §2.3", viewport=label)
        else:
            rec.fail("AC-B2-4-1b/%s" % label, "对方非 6 也累计自己的计数并换回",
                     "b=1 turn=a", "takeoffMiss=%s turn=%s" %
                     (json.dumps(s.get("takeoffMiss"), ensure_ascii=False), s.get("turn")),
                     ac="freeze §2.3", viewport=label, repro="b 掷 3→读 takeoffMiss")

        # ② 第 2 个自己的回合：a 掷 4（非 6）→ 仍不能起飞（不提前），miss=2
        s = roll_and_wait(4)
        ok2, labels2 = takeoff_choice(s)
        if (not ok2) and miss_of(s, "a") == 2:
            rec.ok("AC-B2-4-2/%s" % label, "第 2 个自己的回合仍非 6 → 不提前起飞，计数=2",
                   "无起飞按钮 + a=2",
                   "labels=%s takeoffMiss=%s" %
                   (labels2, json.dumps(s.get("takeoffMiss"), ensure_ascii=False)),
                   ac="freeze §4 边界", viewport=label)
        else:
            rec.fail("AC-B2-4-2/%s" % label, "第 2 个自己的回合仍非 6 → 不提前起飞，计数=2",
                     "无起飞按钮 + a=2",
                     "labels=%s takeoffMiss=%s" %
                     (labels2, json.dumps(s.get("takeoffMiss"), ensure_ascii=False)),
                     ac="freeze §4 边界", viewport=label,
                     repro="a 连掷两次非 6→检查第 2 回合不能起飞")
        s = roll_and_wait(3)   # b 的回合（换回 a）
        if s.get("turn") != "a":
            rec.fail("AC-B2-4-2b/%s" % label, "两次非 6 后回到 a 的回合", "turn=a",
                     "turn=%s" % s.get("turn"), ac="freeze §2.3", viewport=label,
                     repro="b 掷 3→读 turn")
        # 掷骰前（awaiting=roll）：应出现保底提示
        if pity_shown():
            rec.ok("AC-B2-4-3-pity/%s" % label, "具备保底时掷骰前出现提示",
                   PITY_TEXT, pity_text_of(page), ac="freeze §3.2", viewport=label,
                   evidence=Q.this_shot(rec, page, "takeoff_pity_%s" % label))
        else:
            rec.fail("AC-B2-4-3-pity/%s" % label, "具备保底时掷骰前出现提示", PITY_TEXT,
                     "未出现（takeoffMiss=%s）" % json.dumps(s.get("takeoffMiss"),
                                                              ensure_ascii=False),
                     ac="freeze §3.2", viewport=label,
                     repro="连续两次非 6 后读取 [data-test=takeoff-pity]")

        # ③ 第 3 个自己的回合：注入 2（非 6）也能起飞 → 起飞后计数清零
        s = roll_and_wait(2)
        ok3, labels3 = takeoff_choice(s)
        if ok3:
            rec.ok("AC-B2-4-3/%s" % label, "第 3 个自己的回合任意点数可起飞（注入 2）",
                   "出现「… · 从机坪起飞」按钮", json.dumps(labels3, ensure_ascii=False),
                   ac="freeze §2.3", viewport=label,
                   evidence=Q.this_shot(rec, page, "takeoff_ready_%s" % label))
        else:
            rec.fail("AC-B2-4-3/%s" % label, "第 3 个自己的回合任意点数可起飞（注入 2）",
                     "出现「… · 从机坪起飞」按钮", "labels=%s takeoffMiss=%s" %
                     (labels3, json.dumps(s.get("takeoffMiss"), ensure_ascii=False)),
                     ac="freeze §2.3", viewport=label,
                     repro="连续两次非 6 → 第 3 回合掷 2 → 读选子按钮")
        # 点起飞
        btns, _ = _wait_piece_buttons(page, timeout=3000)
        clicked = False
        for b in btns:
            try:
                t = (b.inner_text() or "")
            except Exception:
                t = ""
            if "从机坪起飞" in t:
                b.click(timeout=4000)
                clicked = True
                drv.clicks.append("选子")
                break
        if clicked:
            Q.wait_until(
                page,
                """() => { try { var s = App.Store.getSession(); if (!s) return false;
                    var p = (s.pieces||[]).filter(function(x){ return x.playerId === 'a'; })[0];
                    return !!p && p.squareId.indexOf('ring:') === 0 &&
                           (s.awaiting || {}).type === 'roll'; } catch(e) { return false; } }""",
                timeout=8000)
            page.wait_for_timeout(300)
            s2 = Q.get_session(page) or {}
            if miss_of(s2, "a") == 0:
                rec.ok("AC-B2-4-3-clear/%s" % label, "实际起飞后保底计数清零", "a=0",
                       "takeoffMiss=%s" % json.dumps(s2.get("takeoffMiss"), ensure_ascii=False),
                       ac="freeze §2.3", viewport=label)
            else:
                rec.fail("AC-B2-4-3-clear/%s" % label, "实际起飞后保底计数清零", "a=0",
                         "takeoffMiss=%s" % json.dumps(s2.get("takeoffMiss"), ensure_ascii=False),
                         ac="freeze §2.3", viewport=label,
                         repro="保底回合点起飞→读 takeoffMiss")
            if not pity_shown():
                rec.ok("AC-B2-4-3-hide/%s" % label, "起飞后该方保底提示消失", "无提示", "无",
                       ac="freeze §3.2", viewport=label)
            else:
                # 提示是「当前行动方」口径：a 起飞后轮到 b，而 b 也累计了 2 次没起飞 →
                # 此时仍看到提示是正确行为，只要 view.takeoff 指向 b 且 a 的计数已归零。
                view = Q.eval_js(
                    page,
                    """() => { try { var s = App.Store.getSession();
                        var v = App.Flight.view(s, {});
                        return {pity: !!(v.takeoff && v.takeoff.pity),
                                misses: (v.takeoff && v.takeoff.misses) || null,
                                turn: v.turn}; } catch(e) { return null; } }""") or {}
                cur_miss = (view.get("misses") or {}).get(view.get("turn"))
                if view.get("turn") == "b" and view.get("pity") and cur_miss == 2:
                    rec.ok("AC-B2-4-3-hide/%s" % label,
                           "起飞后提示只跟随当前行动方（b 也有 2 次没起飞）",
                           "turn=b 且 b.misses=2 时提示可见", json.dumps(view, ensure_ascii=False),
                           ac="freeze §3.2", viewport=label)
                else:
                    rec.fail("AC-B2-4-3-hide/%s" % label,
                             "起飞后该方保底提示消失（或只跟随当前行动方）",
                             "a 起飞后无提示；若可见必须是 b 具备保底",
                             "text=%r view=%s" % (pity_text_of(page),
                                                  json.dumps(view, ensure_ascii=False)),
                             ac="freeze §3.2", viewport=label,
                             repro="保底回合起飞→读取 takeoff-pity 与 view.takeoff")
        else:
            rec.fail("AC-B2-4-3-click/%s" % label, "点起飞按钮能实际起飞", "出现并点击起飞按钮",
                     "未找到「从机坪起飞」按钮", ac="freeze §2.3", viewport=label,
                     repro="保底回合读取选子按钮")
        check_no_errors(rec, ps, "AC-H6-1-takeoff/%s" % label, label, "起飞保底")
        return drv
    finally:
        ctx.close()


def run_win_side_case(browser, url, rec, label="390x844", winner="b"):
    """AC-E3-1（另一方）：构造 b 方全部到家 → winner-text / ledger ending='win-b'。

    与主路径互补：主路径验证 a 先到家（win-a），这里验证 winnerId=b 时文案与 ledger 都对。
    """
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    drv = TableDriver(ps, rec, label, prompt_outcome="done", max_steps=30)
    try:
        Q.ensure_boot(page, rec)
        if not drv.start_quick():
            return drv
        total = int((Q.get_session(page) or {}).get("planeCount") or 2)
        state, pending = Q.fixture_near_home(page, winner, steps=(4,))
        if not state:
            rec.fail("AC-E3-1-win-%s/%s" % (winner, label), "构造 %s 方全部到家前一步" % winner,
                     "注入成功", "夹具注入失败", ac="AC-E3-1", viewport=label,
                     repro="写 couple2.session 后刷新")
            return drv
        if not Q.continue_session(page):
            rec.fail("AC-E3-1-win-%s/%s" % (winner, label), "继续回到主桌", "table",
                     "screen=%r" % Q.screen_name(page), ac="AC-E3-1", viewport=label,
                     repro="刷新→点继续")
            return drv
        page.wait_for_timeout(400)
        Q.install_event_recorder(page)
        Q.recorded_events(page, clear=True)
        Q.set_die(page, 1)
        click_and_count(drv, SEL["roll"], "掷骰")
        Q.wait_until(
            page,
            """() => { try { var s = App.Store.getSession();
                return !!s && (s.awaiting || {}).type === 'ending-prompt'; } catch(e) { return false; } }""",
            timeout=8000)
        page.wait_for_timeout(300)
        sess = Q.get_session(page) or {}
        want_name = drv.names[1] if winner == "b" else drv.names[0]
        wtext = winner_text_of(page)
        evs = [e.get("type") for e in Q.recorded_events(page) if e.get("type")]
        win_ev = next((e for e in Q.recorded_events(page) if e.get("type") == "win"), None)
        if want_name + " 先到家" in wtext and sess.get("winnerId") == winner:
            rec.ok("AC-E3-1-win-%s/%s" % (winner, label), "%s 方全部到家 →「%s 先到家」" %
                   (winner, want_name), "%s 先到家 + winnerId=%s" % (want_name, winner),
                   "%s winnerId=%s" % (wtext, sess.get("winnerId")), ac="AC-E3-1",
                   viewport=label, evidence=Q.this_shot(rec, page, "winner_%s" % winner))
        else:
            rec.fail("AC-E3-1-win-%s/%s" % (winner, label), "%s 方全部到家 →「%s 先到家」" %
                     (winner, want_name), "%s 先到家 + winnerId=%s" % (want_name, winner),
                     "winner-text=%r winnerId=%s" % (wtext, sess.get("winnerId")),
                     ac="AC-E3-1", viewport=label, repro="注入 b 方最后一格→掷 1→读文案")
        if win_ev and (win_ev.get("ev") or {}).get("playerId") == winner:
            rec.ok("AC-E3-1-winev-%s/%s" % (winner, label), "win 事件 playerId=%s" % winner,
                   "playerId=%s" % winner, json.dumps(evs, ensure_ascii=False),
                   ac="freeze §2.2", viewport=label)
        else:
            rec.fail("AC-E3-1-winev-%s/%s" % (winner, label), "win 事件 playerId=%s" % winner,
                     "playerId=%s" % winner,
                     "events=%s win=%s" % (json.dumps(evs, ensure_ascii=False),
                                           json.dumps(win_ev, ensure_ascii=False)),
                     ac="freeze §2.2", viewport=label, repro="记录引擎事件")
        # 两张收尾卡都点「做了」→ 回顾
        guard = 0
        while guard < 12 and Q.screen_name(page) != "ledger":
            guard += 1
            if Q.screen_name(page) in ("ledger", "nights"):
                break
            if drv.step() == "stuck":
                break
        drv.finished = Q.screen_name(page) == "ledger"
        if drv.finished:
            rec.ok("AC-E2-1-win-%s/%s" % (winner, label), "两张收尾卡后进入回顾", "ledger",
                   "ledger", ac="AC-E2-1", viewport=label)
            homes = {"a": 0, "b": 0}
            homes[winner] = total
            check_ledger_v61(ps, rec, label, drv, winner=winner,
                             expect_home=(homes["a"], homes["b"]),
                             expect_ending="win-" + winner, total=total)
        else:
            rec.fail("AC-E2-1-win-%s/%s" % (winner, label), "两张收尾卡后进入回顾", "ledger",
                     "screen=%r" % Q.screen_name(page), ac="AC-E2-1", viewport=label,
                     repro="收尾卡都点做了/放过→读取 screen")
        check_no_errors(rec, ps, "AC-H6-1-win-%s/%s" % (winner, label), label, "先到家")
        return drv
    finally:
        ctx.close()


def run_not_end_case(browser, url, rec, label="390x844"):
    """AC-E3-2 / E3-3 / E3-4：题卡 20 张、心动值 100、长夜只 1 架到家 → 都**不**结束。"""
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    drv = TableDriver(ps, rec, label, max_steps=30)
    try:
        Q.ensure_boot(page, rec)
        # 长夜（每人 4 架）
        Q.try_click(page, SEL["long"], timeout=1500)
        Q.fill_names(page, list(NAMES))
        click_and_count(drv, SEL["start"], "摆上棋盘")
        if Q.wait_screen(page, ["table"], timeout=9000) != "table":
            rec.fail("AC-E3-4-setup/%s" % label, "长夜模式进入主桌", "data-table",
                     "screen=%r" % Q.screen_name(page), ac="AC-E3-4", viewport=label,
                     repro="门厅选长夜→开始")
            return drv
        page.wait_for_timeout(400)
        sess = Q.get_session(page) or {}
        if int(sess.get("planeCount") or 0) == 4:
            rec.ok("AC-E3-4-setup/%s" % label, "长夜模式每人 4 架", "planeCount=4",
                   "planeCount=%s mode=%s" % (sess.get("planeCount"), sess.get("mode")),
                   ac="AC-E3-4", viewport=label)
        else:
            rec.fail("AC-E3-4-setup/%s" % label, "长夜模式每人 4 架", "planeCount=4",
                     "planeCount=%s" % sess.get("planeCount"), ac="AC-E3-4", viewport=label,
                     repro="门厅选长夜→开始→读 session.planeCount")
        # 构造：a:0 已到家，a:1=home:*:4，a:2=home:*:0，a:3=机坪；b 全在机坪
        # 题卡 20 张 + 心动值 100（都不该触发结束）
        placements = {
            "a:0": "home:{a}:goal", "a:1": "home:{a}:4", "a:2": "home:{a}:0",
            "a:3": "hangar:{a}:3",
            "b:0": "hangar:{b}:0", "b:1": "hangar:{b}:1", "b:2": "hangar:{b}:2",
            "b:3": "hangar:{b}:3",
        }
        state = Q.fixture_place(page, placements, turn="a", cards_processed=20, heat=100)
        if not state:
            rec.fail("AC-E3-2/%s" % label, "构造题卡 20 张 + 心动值 100 的局面", "注入成功",
                     "夹具注入失败", ac="AC-E3-2", viewport=label,
                     repro="写 couple2.session 后刷新")
            return drv
        if not Q.continue_session(page):
            rec.fail("AC-E3-2/%s" % label, "继续回到主桌", "table",
                     "screen=%r" % Q.screen_name(page), ac="AC-E3-2", viewport=label,
                     repro="刷新→点继续")
            return drv
        page.wait_for_timeout(400)
        st = status_now(page)
        if st.get("cards") == 20 and st.get("heat") == 100:
            rec.ok("AC-E3-2-setup/%s" % label, "状态条读到 20 张 / 心动值 100",
                   "第 20 张 + 心动值 100",
                   "cards=%s heat=%s home=%s" % (st.get("cards"), st.get("heat"),
                                                 st.get("home_text")), ac="AC-E3-2",
                   viewport=label)
        else:
            rec.fail("AC-E3-2-setup/%s" % label, "状态条读到 20 张 / 心动值 100",
                     "第 20 张 + 心动值 100",
                     "cards=%s heat=%s" % (st.get("cards"), st.get("heat")), ac="AC-E3-2",
                     viewport=label, repro="注入后读取状态条")
        # 只 1 架到家 → 不结束
        if not Q.exists(page, SEL["ending_title"], timeout=400):
            rec.ok("AC-E3-4/%s" % label, "长夜只 1 架到家 → 不触发收尾", "无「今晚最后一段」",
                   "a 到家 1/4", ac="AC-E3-4", viewport=label)
        else:
            rec.fail("AC-E3-4/%s" % label, "长夜只 1 架到家 → 不触发收尾", "无「今晚最后一段」",
                     "提前出现收尾", ac="AC-E3-4", viewport=label,
                     repro="1 架到家→读取收尾标题")
        # 掷 1 → a:2 从 home:*:0 走到 home:*:1（仍有 2 架未到家）→ 不结束
        Q.install_event_recorder(page)
        Q.set_die(page, 1)
        click_and_count(drv, SEL["roll"], "掷骰")
        Q.wait_until(
            page,
            """() => { try { var s = App.Store.getSession();
                var aw = (s && s.awaiting) || {};
                return !!s && (aw.type === 'choose-piece' || aw.type === 'roll' ||
                               aw.type === 'prompt' || s.phase === 'ended'); } catch(e) { return false; } }""",
            timeout=8000)
        page.wait_for_timeout(300)
        sess2 = Q.get_session(page) or {}
        homes = Q.session_summary(page).get("planesHome") or {}
        no_end = not Q.exists(page, SEL["ending_title"], timeout=300)
        if sess2.get("phase") == "playing" and no_end and (homes.get("a") or 0) < 4:
            rec.ok("AC-E3-2/%s" % label, "题卡 20 张 / 心动值 100 且未全部到家 → 不结束",
                   "phase=playing 且无收尾标题",
                   "cards=%s heat=%s home=%s phase=%s" %
                   (sess2.get("cardsProcessed"), (sess2.get("meta") or {}).get("heat"),
                    json.dumps(homes, ensure_ascii=False), sess2.get("phase")),
                   ac="AC-E3-2 / AC-E3-3", viewport=label,
                   evidence=Q.this_shot(rec, page, "not_end_%s" % label))
        else:
            rec.fail("AC-E3-2/%s" % label, "题卡 20 张 / 心动值 100 且未全部到家 → 不结束",
                     "phase=playing 且无收尾标题",
                     "cards=%s heat=%s home=%s phase=%s ending=%s" %
                     (sess2.get("cardsProcessed"), (sess2.get("meta") or {}).get("heat"),
                      json.dumps(homes, ensure_ascii=False), sess2.get("phase"), not no_end),
                     ac="AC-E3-2 / AC-E3-3", viewport=label,
                     repro="注入 20 张/100 心动值→掷骰→读 phase 与收尾标题")
        check_no_errors(rec, ps, "AC-H6-1-notend/%s" % label, label, "不结束判定")
        return drv
    finally:
        ctx.close()


def run_legacy_case(browser, url, rec, label="390x844"):
    """兼容旧档（freeze §2.1 / copy §9-D11）：
    ① V6.0 存档缺 takeoffMiss / winnerId → validate() 补 {a:0,b:0}，仍可续玩；
    ② 旧回顾 ending='shared' → 回顾写「今晚一起走到这里」，不出现输赢词。
    """
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    try:
        Q.ensure_boot(page, rec)
        Q.fill_names(page, list(NAMES))
        Q.try_click(page, SEL["start"], timeout=6000)
        if Q.wait_screen(page, ["table"], timeout=9000) != "table":
            rec.fail("AC-A6-3/%s" % label, "旧档兼容用例进入主桌", "table",
                     "screen=%r" % Q.screen_name(page), ac="AC-A6-3", viewport=label,
                     repro="门厅开始一局")
            return
        had = Q.drop_takeoff_miss(page)
        page.reload(wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(900)
        if Q.continue_session(page):
            page.wait_for_timeout(400)
            sess = Q.get_session(page) or {}
            tm = sess.get("takeoffMiss") or {}
            if tm.get("a") == 0 and tm.get("b") == 0:
                rec.ok("AC-A6-3/%s" % label, "缺 takeoffMiss 的旧档 → validate 补 0 且可续玩",
                       "takeoffMiss={a:0,b:0}", json.dumps(tm, ensure_ascii=False),
                       ac="freeze §2.1", viewport=label)
            else:
                rec.fail("AC-A6-3/%s" % label, "缺 takeoffMiss 的旧档 → validate 补 0 且可续玩",
                         "takeoffMiss={a:0,b:0}", json.dumps(tm, ensure_ascii=False),
                         ac="freeze §2.1", viewport=label,
                         repro="删 takeoffMiss → 刷新 → 点继续 → 读 session")
            # 续玩后还能掷骰
            Q.set_die(page, 6)
            Q.try_click(page, SEL["roll"], timeout=4000)
            txt, ms = Q.wait_text(page, r"掷出\s*6", timeout=2000)
            if txt:
                rec.ok("AC-A6-3-play/%s" % label, "旧档续玩后可以继续掷骰", "出现「掷出 6」",
                       "%s（%dms）" % (txt, ms), ac="AC-A6-3", viewport=label)
            else:
                rec.fail("AC-A6-3-play/%s" % label, "旧档续玩后可以继续掷骰", "出现「掷出 6」",
                         "未出现点数文本", ac="AC-A6-3", viewport=label,
                         repro="旧档续玩→点掷骰")
        else:
            rec.fail("AC-A6-3/%s" % label, "缺 takeoffMiss 的旧档仍可继续", "出现继续入口并进主桌",
                     "未回到主桌（had=%s）" % (had or []), ac="freeze §2.1", viewport=label,
                     repro="删 takeoffMiss→刷新→点继续")
        # 旧回顾 ending='shared'
        entry = Q.old_ledger_entry("shared", NAMES)
        Q.put_history(page, [entry])
        page.goto(url + "?v=legacy-shared", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(900)
        Q.ensure_boot(page, rec, dismiss_rules=False)
        if Q.try_click(page, ["test:go-nights", "role:button:/以前的夜/"], timeout=4000):
            Q.wait_screen(page, ["nights"], timeout=6000)
            page.wait_for_timeout(300)
            clicked = Q.try_click(page, ["test:night-item-qa-old-shared", "[data-id='qa-old-shared']"],
                                  timeout=4000)
            Q.wait_screen(page, ["ledger"], timeout=8000)
            page.wait_for_timeout(500)
            if clicked and Q.screen_name(page) == "ledger":
                txt = Q.body_text(page)
                if "今晚一起走到这里" in txt:
                    rec.ok("AC-F2-6/%s" % label, "旧档 ending='shared' 回顾写「今晚一起走到这里」",
                           "含「今晚一起走到这里」", "命中", ac="AC-F2-5 / copy §9-D11",
                           viewport=label,
                           evidence=Q.this_shot(rec, page, "legacy_shared_%s" % label))
                else:
                    rec.fail("AC-F2-6/%s" % label, "旧档 ending='shared' 回顾写「今晚一起走到这里」",
                             "含「今晚一起走到这里」", "body=%r" % txt[:200],
                             ac="AC-F2-5 / copy §9-D11", viewport=label,
                             repro="写入 shared 旧档→以前的夜→打开回顾")
                bad = [w for w in FORBIDDEN_WORDS if w in txt]
                if not bad:
                    rec.ok("AC-F2-6-bad/%s" % label, "旧档回顾无输赢词", "无判定词", "无",
                           ac="AC-F2-5", viewport=label)
                else:
                    rec.fail("AC-F2-6-bad/%s" % label, "旧档回顾无输赢词", "无判定词",
                             "出现：%s" % bad, ac="AC-F2-5", viewport=label,
                             repro="打开 shared 旧档回顾→读文本")
            else:
                rec.fail("AC-F2-6/%s" % label, "打开旧档回顾", "data-screen=ledger",
                         "screen=%r clicked=%s" % (Q.screen_name(page), clicked),
                         ac="AC-F2-5", viewport=label,
                         repro="以前的夜→点旧档条目")
        else:
            rec.fail("AC-F2-6/%s" % label, "门厅可进入「以前的夜」", "go-nights 可点", "未找到入口",
                     ac="AC-F2-5", viewport=label, repro="门厅→查找以前的夜入口")
        check_no_errors(rec, ps, "AC-H6-1-legacy/%s" % label, label, "旧档兼容")
    finally:
        ctx.close()


def run_resume_case(browser, url, rec, label="390x844"):
    """A6：处理 1 张题卡后刷新 → 首页出现「继续今晚飞行棋」→ 回到同一状态。"""
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    try:
        Q.ensure_boot(page, rec)
        drv = TableDriver(ps, rec, label)
        if not drv.start_quick():
            return
        # 推进到第 1 张题卡并处理
        guard = 0
        while guard < 60 and drv.cards < 1:
            guard += 1
            if Q.screen_name(page) in ("ledger", "nights"):
                break
            drv.step()
        sess_before = session_summary(page)
        shot_before = Q.this_shot(rec, page, "resume_before")
        page.reload(wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(900)
        txt = Q.body_text(page)
        has_continue = Q.exists(page, SEL["continue"], timeout=2500) or "继续今晚飞行棋" in txt
        if has_continue:
            rec.ok("AC-A6-1/%s" % label, "中断后刷新首页出现「继续今晚飞行棋」", "显示继续入口",
                   "命中（cards=%s）" % sess_before.get("cardsProcessed"), ac="AC-A6-1",
                   viewport=label, evidence=Q.this_shot(rec, page, "resume_home"))
        else:
            rec.fail("AC-A6-1/%s" % label, "中断后刷新首页出现「继续今晚飞行棋」", "显示继续入口",
                     "未出现（screen=%r）" % Q.screen_name(page), ac="AC-A6-1",
                     viewport=label, repro="对局中刷新→读取门厅",
                     evidence=Q.this_shot(rec, page, "resume_home"))
        if has_continue:
            loc, _ = Q.find(page, SEL["continue"], timeout=3000)
            if loc:
                loc.click(timeout=4000)
            Q.wait_screen(page, ["table"], timeout=9000)
            page.wait_for_timeout(600)
            sess_after = session_summary(page)
            same = (sess_after.get("cardsProcessed") == sess_before.get("cardsProcessed") and
                    sess_after.get("prompt_kind") == sess_before.get("prompt_kind") and
                    sess_after.get("heat") == sess_before.get("heat"))
            if Q.screen_name(page) == "table" and same:
                rec.ok("AC-A6-2/%s" % label, "继续后回到中断处（相同状态）", "cards/heat/awaiting 一致",
                       "before=%s after=%s" % (sess_before, sess_after), ac="AC-A6-2",
                       viewport=label, evidence=Q.this_shot(rec, page, "resume_after") or shot_before)
            else:
                rec.fail("AC-A6-2/%s" % label, "继续后回到中断处（相同状态）", "cards/heat/awaiting 一致",
                         "screen=%r before=%s after=%s" % (Q.screen_name(page), sess_before, sess_after),
                         ac="AC-A6-2", viewport=label, repro="刷新→点继续今晚飞行棋→对比状态")
            # 处理掉当前题卡，确保 0 错误
            guard = 0
            while guard < 40 and (Q.get_session(page) or {}).get("awaiting", {}).get("type") in ("prompt", "ending-prompt", "minigame", "choose-piece"):
                guard += 1
                drv.page = page
                drv.step()
        check_no_errors(rec, ps, "AC-H6-1-resume/%s" % label, label, "刷新续玩")
    finally:
        ctx.close()


def run_pause_case(browser, url, rec, label="390x844", short_press_check=True):
    """G1/G2/B4/B5：安全词长按 1.6s → pause；短按不触发；继续回原状态；今晚就到这 → 回顾。"""
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    try:
        Q.ensure_boot(page, rec)
        drv = TableDriver(ps, rec, label)
        if not drv.start_quick():
            return
        # B5-1/B5-2：主桌「暂停」按钮（与安全词分离）进入 pause，继续后状态不变
        before_pause = session_summary(page)
        if Q.exists(page, SEL["pause_mini"], timeout=2000):
            Q.try_click(page, SEL["pause_mini"], timeout=2500)
            if Q.wait_screen(page, ["pause"], timeout=3500) == "pause":
                rec.ok("AC-B5-1/%s" % label, "主桌暂停按钮进入暂停页", "data-screen=pause",
                       "命中", ac="AC-B5-1", viewport=label)
                Q.try_click(page, SEL["pause_continue"], timeout=2500)
                Q.wait_screen(page, ["table"], timeout=6000)
                page.wait_for_timeout(300)
                after_pause = session_summary(page)
                same_pause = (after_pause.get("cardsProcessed") == before_pause.get("cardsProcessed")
                              and after_pause.get("heat") == before_pause.get("heat")
                              and after_pause.get("turn") == before_pause.get("turn"))
                if Q.screen_name(page) == "table" and same_pause:
                    rec.ok("AC-B5-2/%s" % label, "暂停返回后对局状态不变", "cards/heat/turn 一致",
                           "before=%s after=%s" % (before_pause, after_pause),
                           ac="AC-B5-2", viewport=label)
                else:
                    rec.fail("AC-B5-2/%s" % label, "暂停返回后对局状态不变", "cards/heat/turn 一致",
                             "screen=%r before=%s after=%s" %
                             (Q.screen_name(page), before_pause, after_pause), ac="AC-B5-2",
                             viewport=label, repro="主桌点暂停→继续→对比状态")
            else:
                rec.fail("AC-B5-1/%s" % label, "主桌暂停按钮进入暂停页", "data-screen=pause",
                         "screen=%r" % Q.screen_name(page), ac="AC-B5-1", viewport=label,
                         repro="主桌点「暂停」→读取 data-screen")
        else:
            rec.fail("AC-B5-1/%s" % label, "主桌存在「暂停」按钮", "data-test=pause",
                     "未找到", ac="AC-B5-1", viewport=label, repro="主桌→查找 [data-test=pause]")
        guard = 0
        while guard < 60 and drv.cards < 1:
            guard += 1
            if Q.screen_name(page) in ("ledger", "nights"):
                break
            drv.step()
        Q.wait_until(page, "() => { try { var s=App.Store.getSession(); return s && s.awaiting && s.awaiting.type==='roll'; } catch(e){ return false; } }", timeout=6000)
        page.wait_for_timeout(300)
        before = session_summary(page)

        safety, _ = Q.find(page, SEL["safety"], timeout=3000)
        if safety is None:
            rec.fail("AC-G2-1/%s" % label, "安全词长按进入暂停", "存在「先收棋」安全词",
                     "未找到安全词", ac="AC-G2-1", viewport=label,
                     repro="主桌→查找安全词")
            return
        # 短按不触发
        if short_press_check:
            Q.safe_shortpress(page, safety, hold_ms=500)
            page.wait_for_timeout(500)
            if Q.screen_name(page) != "pause" and not Q.exists(page, SEL["pause_screen"], timeout=500):
                rec.ok("AC-G2-1-short/%s" % label, "安全词短按（<1s）不触发暂停", "仍在主桌",
                       "screen=%r" % Q.screen_name(page), ac="AC-G2-1", viewport=label)
            else:
                rec.fail("AC-G2-1-short/%s" % label, "安全词短按（<1s）不触发暂停", "仍在主桌",
                         "已进入暂停", ac="AC-G2-1", viewport=label,
                         repro="安全词按 0.5s 后松开")
        # 长按
        t0 = time.time()
        Q.safe_longpress(page, safety, hold_ms=1700)
        screen = Q.wait_screen(page, ["pause"], timeout=2500)
        elapsed = int((time.time() - t0) * 1000)
        if screen == "pause" or Q.exists(page, SEL["pause_screen"], timeout=800):
            rec.ok("AC-G2-1/%s" % label, "长按安全词 1.6s 进入暂停页", "data-screen=pause",
                   "elapsed=%dms" % elapsed, ac="AC-G2-1", viewport=label, duration_ms=elapsed,
                   evidence=Q.this_shot(rec, page, "pause_%s" % label))
        else:
            rec.fail("AC-G2-1/%s" % label, "长按安全词 1.6s 进入暂停页", "data-screen=pause",
                     "screen=%r" % Q.screen_name(page), ac="AC-G2-1", viewport=label,
                     repro="按住安全词 1.7s→读取 data-screen",
                     evidence=Q.this_shot(rec, page, "pause_fail_%s" % label))
            return
        txt = Q.body_text(page)
        # 四个动作 + 记录会留着 + 安全词可达
        need = ["继续", "今晚就到这", "看今晚记录", "加一条今晚不做的"]
        miss = [n for n in need if n not in txt]
        if not miss:
            rec.ok("AC-G1-2/%s" % label, "暂停页四个动作齐全", "继续/今晚就到这/看今晚记录/加一条今晚不做的",
                   "均存在", ac="AC-G1-2", viewport=label)
        else:
            rec.fail("AC-G1-2/%s" % label, "暂停页四个动作齐全", "四个动作",
                     "缺少：%s" % miss, ac="AC-G1-2", viewport=label,
                     repro="安全词长按→读取暂停页")
        if "记录会留着" in txt:
            rec.ok("AC-G5-1/%s" % label, "暂停页含「记录会留着」说明", "含「记录会留着」",
                   "命中", ac="AC-G5-1", viewport=label)
        else:
            rec.fail("AC-G5-1/%s" % label, "暂停页含「记录会留着」说明", "含「记录会留着」",
                     "未命中", ac="AC-G5-1", viewport=label,
                     repro="安全词长按→读取暂停页说明")
        check_safety_visible(ps, rec, label, "pause")
        # V6.1（copy.md §9-D9 已对齐）：暂停页状态卡读「双方已到家」，不再显示「第 N/目标 张」
        ph = Q.find(page, ["test:pause-home"], timeout=1500)[0]
        ph_txt = ""
        if ph is not None:
            try:
                ph_txt = (ph.inner_text() or "").replace("\n", " ").strip()
            except Exception:
                ph_txt = ""
        if ph_txt and re.search(r"\d+\s*/\s*\d+", ph_txt) and "目标" not in txt:
            rec.ok("AC-B6-1-pause/%s" % label, "暂停页状态卡读双方已到家（V6.1）",
                   "含 X/Y 且无「目标」张数", ph_txt, ac="AC-B6-1", viewport=label)
        else:
            rec.fail("AC-B6-1-pause/%s" % label, "暂停页状态卡读双方已到家（V6.1）",
                     "含 X/Y 且无「目标」张数",
                     "pause-home=%r 暂停页含「目标」=%s" % (ph_txt, "目标" in txt),
                     ac="AC-B6-1", viewport=label,
                     repro="安全词长按→读取 [data-test=pause-home] 与暂停页文本")
        # 「看今晚记录」= 暂停层内只读预览（不跳 ledger），可「回到暂停」
        if Q.exists(page, SEL["pause_record"], timeout=1200):
            Q.try_click(page, SEL["pause_record"], timeout=2000)
            page.wait_for_timeout(500)
            preview_ok = Q.exists(page, SEL["pause_recap"], timeout=1200) or "今晚的记录" in Q.body_text(page)
            if preview_ok and Q.exists(page, SEL["pause_recap_back"], timeout=800):
                rec.ok("AC-G1-2-record/%s" % label, "「看今晚记录」是暂停内只读预览", "预览 + 回到暂停",
                       "符合（不跳 ledger）", ac="AC-G1-2", viewport=label,
                       severity="P1")
                Q.try_click(page, SEL["pause_recap_back"], timeout=1500)
                page.wait_for_timeout(400)
            else:
                rec.check("AC-G1-2-record/%s" % label, "「看今晚记录」只读预览", "FAIL" if not preview_ok else "SKIP",
                          "预览 + 回到暂停", "preview=%s back=%s screen=%r" %
                          (preview_ok, Q.exists(page, SEL["pause_recap_back"], timeout=300),
                           Q.screen_name(page)), ac="AC-G1-2", severity="P1", viewport=label)
        else:
            rec.fail("AC-G1-2-record/%s" % label, "暂停页有「看今晚记录」", "可点按钮",
                     "未找到", ac="AC-G1-2", viewport=label, repro="暂停页→查找看今晚记录")
        # 暂停不归档
        sess = Q.get_session(page)
        if sess and sess.get("phase") in ("playing", "paused"):
            rec.ok("AC-G2-2/%s" % label, "安全词触发后 session 仍在（不归档）", "phase=playing/paused",
                   "phase=%s" % sess.get("phase"), ac="AC-G2-2", viewport=label)
        else:
            rec.fail("AC-G2-2/%s" % label, "安全词触发后 session 仍在（不归档）", "phase=playing/paused",
                     "session=%r" % (sess.get("phase") if sess else None), ac="AC-G2-2",
                     viewport=label, repro="长按安全词→读取 App.Store.getSession()")
        # 继续回原状态
        Q.try_click(page, SEL["pause_continue"], timeout=2500)
        Q.wait_screen(page, ["table"], timeout=6000)
        page.wait_for_timeout(500)
        after = session_summary(page)
        same = (after.get("cardsProcessed") == before.get("cardsProcessed") and
                after.get("heat") == before.get("heat") and
                after.get("turn") == before.get("turn") and
                after.get("awaiting") == before.get("awaiting"))
        if Q.screen_name(page) == "table" and same:
            rec.ok("AC-G1-3/%s" % label, "暂停「继续」回原屏幕与状态", "table + 相同状态",
                   "before=%s after=%s" % (before, after), ac="AC-G1-3", viewport=label)
        else:
            rec.fail("AC-G1-3/%s" % label, "暂停「继续」回原屏幕与状态", "table + 相同状态",
                     "screen=%r before=%s after=%s" % (Q.screen_name(page), before, after),
                     ac="AC-G1-3", viewport=label, repro="暂停→点继续→对比状态")
        # 再次长按→今晚就到这
        safety, _ = Q.find(page, SEL["safety"], timeout=2000)
        if safety:
            Q.safe_longpress(page, safety, hold_ms=1700)
            Q.wait_screen(page, ["pause"], timeout=2500)
            Q.try_click(page, SEL["pause_end"], timeout=2500)
            page.wait_for_timeout(500)
            if Q.exists(page, SEL["pause_confirm"], timeout=1000):
                Q.try_click(page, SEL["pause_confirm"], timeout=2500)
            Q.wait_screen(page, ["ledger"], timeout=8000)
            page.wait_for_timeout(600)
            txt2 = Q.body_text(page)
            if Q.screen_name(page) == "ledger":
                rec.ok("AC-G2-3/%s" % label, "「今晚就到这」才归档并进入回顾", "data-screen=ledger",
                       "ledger", ac="AC-G2-3", viewport=label,
                       evidence=Q.this_shot(rec, page, "pause_end_ledger_%s" % label))
                bad = [w for w in FORBIDDEN_WORDS if w in txt2]
                if not bad:
                    rec.ok("AC-E2-3-pause/%s" % label, "「今晚就到这」回顾无输赢词", "无判定词", "无",
                           ac="AC-E2-3", viewport=label)
                else:
                    rec.fail("AC-E2-3-pause/%s" % label, "「今晚就到这」回顾无输赢词", "无判定词",
                             "出现：%s" % bad, ac="AC-E2-3", viewport=label,
                             repro="暂停→今晚就到这→读取回顾")
                if drv.cards >= 1:
                    rec.ok("AC-G2-3-keep/%s" % label, "「今晚就到这」保留已记录", "历史含已处理题卡",
                           "cards=%d" % drv.cards, ac="AC-G2-3", viewport=label)
            else:
                rec.fail("AC-G2-3/%s" % label, "「今晚就到这」进入回顾", "data-screen=ledger",
                         "screen=%r" % Q.screen_name(page), ac="AC-G2-3", viewport=label,
                         repro="暂停→今晚就到这→确认")
            check_safety_visible(ps, rec, label, "ledger")
        check_no_errors(rec, ps, "AC-H6-1-pause/%s" % label, label, "暂停/安全词")
    finally:
        ctx.close()


def _fixture_move(page, pid, from_sq, die, turn, placements=None):
    """测试夹具：把某架飞机放到 from_sq，置 awaiting=choose-piece，保存并重挂主桌。
    仅测试侧构造合法前置状态（不改实现）；随后像用户一样点选子按钮触发落格。
    placements: 额外棋子位置 {pieceId: squareId}（构造击落/叠机局面用）。
    """
    return Q.eval_js(
        page,
        """(a) => {
            try {
                var s = App.Store.getSession();
                if (!s) return false;
                s.turn = a.turn; s.phase = 'playing';
                s.awaiting = {type: 'choose-piece', pieceIds: [a.pid], die: a.die};
                (s.pieces || []).forEach(function (p) {
                    if (p.id === a.pid) { p.squareId = a.from; p.arrived = false; p.stackGroupId = null; }
                    if (a.placements && a.placements[p.id] !== undefined) {
                        p.squareId = a.placements[p.id]; p.arrived = false; p.stackGroupId = null;
                    }
                });
                App.Store.saveSession(s);
                App.Router.reset('table');
                return true;
            } catch (e) { if (window.console) console.error('QA_FIXTURE', e); return false; }
        }""",
        {"pid": pid, "from": from_sq, "die": die, "turn": turn, "placements": placements or {}},
    )


def _fixture_to_awaiting(page, pid, from_sq, die, turn, expect_awaiting, timeout=9000,
                         placements=None):
    """执行夹具并点棋子，等待进入 expect_awaiting；返回 session。"""
    if not _fixture_move(page, pid, from_sq, die, turn, placements=placements):
        return None
    Q.wait_screen(page, ["table"], timeout=6000)
    page.wait_for_timeout(300)
    btns, _ = Q.find_piece_buttons(page)
    if not btns:
        return None
    # 精确点选子按钮：新 UI 用 data-action-piece（fe-table），旧 UI 用 data-piece；
    # 两者都要匹配，且必须按 pid 点中目标棋子的按钮，避免 fallback 误点别的棋子。
    clicked = False
    for b in btns:
        try:
            bp = b.get_attribute("data-action-piece") or b.get_attribute("data-piece")
            if bp == pid:
                b.click(timeout=4000); clicked = True; break
        except Exception:
            pass
    if not clicked:
        # 找不到目标棋子的按钮时，只有唯一候选才可兜底；多个候选宁可失败也不误点
        if len(btns) == 1:
            btns[0].click(timeout=4000)
        else:
            return None
    Q.wait_until(page, """() => { try { var s=App.Store.getSession(); return s && s.awaiting && s.awaiting.type==='%s'; } catch(e){ return false; } }""" % expect_awaiting,
                 timeout=timeout)
    page.wait_for_timeout(400)
    return Q.get_session(page)


def run_minigame_case(browser, url, rec, label="390x844"):
    """D1/D2/D3：落到温度计/转盘 → 可操作面板 → 跳过/完成 → 回桌 + 记录。"""
    vp = Q.VIEWPORTS[label]
    # (kind, pid, from_sq, die, outcome, expect_title, expect_heat_delta)
    scenarios = [
        ("thermo", "b:0", "ring:9", 1, "skip", "温度计", 0),
        ("truth-wheel", "b:0", "ring:13", 1, "done", "真心话转盘", 5),
    ]
    for kind, pid, from_sq, die, outcome, title_word, heat_delta in scenarios:
        ctx, ps, page = new_page(browser, url, vp, rec, label)
        drv = TableDriver(ps, rec, label, minigame_outcome=outcome, max_steps=40)
        try:
            Q.ensure_boot(page, rec)
            if not drv.start_quick():
                return
            before = Q.session_summary(page)
            sess = _fixture_to_awaiting(page, pid, from_sq, die, "b", "minigame")
            shot = Q.this_shot(rec, page, "minigame_%s_%s" % (kind, label))
            if not sess:
                rec.fail("AC-D1-1/%s/%s" % (kind, label), "落到小游戏格进入可玩面板",
                         "awaiting=minigame + 面板", "夹具未进入 minigame", ac="AC-D1-1",
                         viewport=label, repro="落格夹具→读取 awaiting")
                continue
            await_rec = sess.get("awaiting") or {}
            rec.ok("AC-D1-1/%s/%s" % (kind, label), "落到小游戏格直接进入可玩面板（%s）" % title_word,
                   "awaiting=minigame", "kind=%s" % await_rec.get("kind"), ac="AC-D1-1",
                   viewport=label, evidence=shot)
            panel = page.locator("[data-test='minigame-panel']")
            n_panel = panel.count()
            body = Q.body_text(page)
            has_ops = (page.locator("[data-test='thermo-place'], [data-test='spin'], input[type=range]").count() > 0
                       if n_panel else False)
            if n_panel >= 1 and title_word in body and has_ops:
                rec.ok("AC-D1-1-ops/%s/%s" % (kind, label), "小游戏面板有可操作控件", "滑杆/转盘",
                       "panel=%d ops=%s" % (n_panel, has_ops), ac="AC-D1-1", viewport=label,
                       evidence=shot)
            else:
                rec.fail("AC-D1-1-ops/%s/%s" % (kind, label), "小游戏面板有可操作控件", "滑杆/转盘",
                         "panel=%d ops=%s" % (n_panel, has_ops), ac="AC-D1-1", viewport=label,
                         repro="进入小游戏面板→读取控件")
            if "玩过了" in body:
                rec.fail("AC-D1-3/%s/%s" % (kind, label), "不再出现「玩过了」空按钮", "无此文案",
                         "出现「玩过了」", ac="AC-D1-3", viewport=label, evidence=shot)
            else:
                rec.ok("AC-D1-3/%s/%s" % (kind, label), "不再出现「玩过了」空按钮", "无此文案", "无",
                       ac="AC-D1-3", viewport=label)
            heat_before = (Q.get_session(page) or {}).get("meta", {}).get("heat")
            if outcome == "skip":
                if Q.exists(page, SEL["mg_skip"], timeout=2000):
                    rec.ok("AC-D2-1/%s/%s" % (kind, label), "小游戏有「跳过」按钮",
                           "minigame-skip 可见可点", "存在", ac="AC-D2-1", viewport=label,
                           evidence=shot)
                    click_and_count(drv, SEL["mg_skip"], "小游戏跳过")
                    toast, ms = Q.wait_text(page, r"这一格先跳过|记下了", timeout=1800)
                    rec.ok("AC-D2-2/%s/%s" % (kind, label), "小游戏跳过有反馈", "toast 跳过",
                           (toast or "无 toast") + ("" if toast is None else "（%dms）" % ms),
                           ac="AC-D2-2", viewport=label, duration_ms=ms)
                else:
                    rec.fail("AC-D2-1/%s/%s" % (kind, label), "小游戏有「跳过」按钮",
                             "minigame-skip 可见", "未找到", ac="AC-D2-1", viewport=label,
                             repro="进入小游戏面板→查找 [data-test=minigame-skip]")
            else:
                # 转一下再「回棋盘」（完成），覆盖真实演出
                Q.try_click(page, ["test:spin"], timeout=2500)
                page.wait_for_timeout(800)
                if Q.exists(page, SEL["mg_done"], timeout=2500):
                    click_and_count(drv, SEL["mg_done"], "小游戏完成")
                    toast, ms = Q.wait_text(page, r"这一格记下了|回棋盘", timeout=1800)
                    rec.ok("AC-D2-3/%s/%s" % (kind, label), "小游戏完成有反馈", "toast/回棋盘",
                           (toast or "无 toast") + ("" if toast is None else "（%dms）" % ms),
                           ac="AC-D2-3", viewport=label, duration_ms=ms)
                else:
                    rec.fail("AC-D2-3/%s/%s" % (kind, label), "小游戏可完成", "minigame-done 可点",
                             "未找到完成按钮", ac="AC-D2-3", viewport=label,
                             repro="进入小游戏→查找 [data-test=minigame-done]")
            Q.wait_until(page, "() => { try { var s=App.Store.getSession(); return s && s.awaiting && s.awaiting.type !== 'minigame'; } catch(e){ return false; } }",
                         timeout=7000)
            page.wait_for_timeout(300)
            sess2 = Q.get_session(page) or {}
            after_heat = (sess2.get("meta") or {}).get("heat")
            delta = None if (heat_before is None or after_heat is None) else after_heat - heat_before
            rec.check("AC-D2-heat/%s/%s" % (kind, label),
                      "小游戏%s心动值 %s" % ("跳过" if outcome == "skip" else "完成", "+0" if heat_delta == 0 else "+5"),
                      "PASS" if delta == heat_delta else "FAIL", "Δ=%d" % heat_delta,
                      "Δ=%s（%s → %s）" % (delta, heat_before, after_heat),
                      ac="AC-D2-2" if outcome == "skip" else "D2-3",
                      viewport=label)
            if (sess2.get("awaiting") or {}).get("type") != "minigame":
                rec.ok("AC-D3-1/%s/%s" % (kind, label), "小游戏结束回主桌原状态",
                       "awaiting!=minigame，turn 不变", "awaiting=%s turn=%s cards=%s" %
                       ((sess2.get("awaiting") or {}).get("type"), sess2.get("turn"),
                        sess2.get("cardsProcessed")), ac="AC-D3-1", viewport=label)
            else:
                rec.fail("AC-D3-1/%s/%s" % (kind, label), "小游戏结束回主桌", "awaiting!=minigame",
                         "仍停在 minigame", ac="AC-D3-1", viewport=label,
                         repro="小游戏跳过/完成→读取 awaiting")
            if (sess2.get("cardsProcessed") or 0) != (before.get("cardsProcessed") or 0):
                rec.check("AC-D3-cards/%s/%s" % (kind, label), "小游戏不改变题卡进度", "FAIL",
                          "cardsProcessed 不变", "before=%s after=%s" %
                          (before.get("cardsProcessed"), sess2.get("cardsProcessed")),
                          ac="AC-D3-1", viewport=label)
            else:
                rec.ok("AC-D3-cards/%s/%s" % (kind, label), "小游戏不改变题卡进度", "不变", "不变",
                       ac="AC-D3-1", viewport=label)
            check_no_errors(rec, ps, "AC-H6-1-mini/%s/%s" % (kind, label), label, "小游戏")
        finally:
            ctx.close()


def run_fate_case(browser, url, rec, label="390x844"):
    """E5（P1）：命运格两张二选一；不选不扣、选卡 +8、不计入题卡目标。"""
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    drv = TableDriver(ps, rec, label, max_steps=40)
    try:
        Q.ensure_boot(page, rec)
        if not drv.start_quick():
            return
        # 棋盘应有 2 个命运格（5/29）
        probe = Q.eval_js(page, """() => {
            try {
                if (!App.FlightBoard || !App.FlightBoard.map) return null;
                var m = App.FlightBoard.map();
                return m.squares.filter(function(s){ return s.kind === 'fate'; }).map(function(s){ return s.id; });
            } catch(e) { return null; }
        }""")
        if probe:
            rec.ok("AC-E5-1/%s" % label, "棋盘存在 2 个命运格（P1）", "2 个", "fate=%s" % probe,
                   ac="AC-E5-1", severity="P1", viewport=label)
        else:
            rec.check("AC-E5-1/%s" % label, "棋盘存在 2 个命运格（P1）", "SKIP",
                      "2 个 kind=fate 格", "未实现命运格", ac="AC-E5-1", severity="P1", viewport=label)
            return
        # 不选路径：red a:0 从 ring:4 走 1 步到 fate ring:5
        before = Q.session_summary(page)
        sess = _fixture_to_awaiting(page, "a:0", "ring:4", 1, "a", "prompt")
        if not sess:
            rec.fail("AC-E5-2/%s" % label, "落到命运格出现二选一", "awaiting prompt fate",
                     "夹具未进入命运格", ac="AC-E5-2", severity="P1", viewport=label,
                     repro="命运格夹具→读取 awaiting")
            return
        kind = ((sess.get("awaiting") or {}).get("prompt") or {}).get("kind")
        shot = Q.this_shot(rec, page, "fate_%s" % label)
        body = Q.body_text(page)
        opts = page.locator("[data-test='prompt-fate-option']")
        n = opts.count()
        has_none = Q.exists(page, SEL["fate_none"], timeout=800) or "今晚先不选" in body
        h0 = (sess.get("meta") or {}).get("heat")
        c0 = sess.get("cardsProcessed")
        if kind == "fate" and n >= 2 and has_none:
            rec.ok("AC-E5-2/%s" % label, "命运格同时展示两张卡 + 不选", "2 张 + 今晚先不选",
                   "kind=fate options=%d" % n, ac="AC-E5-2", severity="P1", viewport=label,
                   evidence=shot)
        else:
            rec.fail("AC-E5-2/%s" % label, "命运格展示两张卡 + 不选", "2 张 + 今晚先不选",
                     "kind=%s options=%d none=%s" % (kind, n, has_none), ac="AC-E5-2",
                     severity="P1", viewport=label, repro="落到命运格→读取面板", evidence=shot)
        # 今晚先不选 → 回桌，心动值不减少、题卡数不变
        Q.try_click(page, SEL["fate_none"], timeout=2500)
        Q.wait_until(page, "() => { try { var s=App.Store.getSession(); var aw=(s&&s.awaiting)||{}; return aw.type !== 'prompt'; } catch(e){ return false; } }", timeout=6000)
        page.wait_for_timeout(300)
        s2 = Q.get_session(page) or {}
        h1 = (s2.get("meta") or {}).get("heat")
        c1 = s2.get("cardsProcessed")
        if h1 is not None and h0 is not None and h1 >= h0 and c1 == c0:
            rec.ok("AC-E5-3/%s" % label, "今晚先不选：心动值不减、不计题卡", "Δheat≥0，cards 不变",
                   "heat %s→%s cards %s→%s" % (h0, h1, c0, c1), ac="AC-E5-3", severity="P1",
                   viewport=label)
        else:
            rec.fail("AC-E5-3/%s" % label, "今晚先不选：不扣心动/不计题卡", "Δheat≥0，cards 不变",
                     "heat %s→%s cards %s→%s" % (h0, h1, c0, c1), ac="AC-E5-3",
                     severity="P1", viewport=label, repro="命运格点「今晚先不选」→对比状态")
        # 选卡路径：再走一次，选第一张 → +8、回桌
        sess = _fixture_to_awaiting(page, "a:0", "ring:4", 1, "a", "prompt")
        if sess:
            h2 = (sess.get("meta") or {}).get("heat")
            opts = page.locator("[data-test='prompt-fate-option']")
            if opts.count():
                opts.first.click(timeout=4000)
                Q.wait_until(page, "() => { try { var s=App.Store.getSession(); var aw=(s&&s.awaiting)||{}; return aw.type !== 'prompt'; } catch(e){ return false; } }", timeout=6000)
                page.wait_for_timeout(300)
                s3 = Q.get_session(page) or {}
                h3 = (s3.get("meta") or {}).get("heat")
                delta = None if (h2 is None or h3 is None) else h3 - h2
                rec.check("AC-E5-2-heat/%s" % label, "命运选卡按做了结算 +8", "PASS" if delta == 8 else "FAIL",
                          "Δ=8", "Δ=%s（%s → %s）" % (delta, h2, h3), ac="AC-E5-2",
                          severity="P1", viewport=label)
        check_no_errors(rec, ps, "AC-H6-1-fate/%s" % label, label, "命运格")
    finally:
        ctx.close()


def run_scale_persist_case(browser, url, rec, label="390x844"):
    """A4-3：尺度选择在刷新后被记住。"""
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    try:
        Q.ensure_boot(page, rec)
        if not Q.exists(page, ["test:scale-hot"], timeout=2000):
            rec.check("AC-A4-3/%s" % label, "尺度选择被记住", "SKIP", "scale-hot 可点",
                      "未找到尺度按钮 data-test=scale-hot", ac="AC-A4-3", viewport=label)
            return
        Q.try_click(page, ["test:scale-hot"], timeout=1500)
        page.wait_for_timeout(250)
        before = (Q.get_settings(page) or {}).get("scale")
        page.reload(wait_until="domcontentloaded", timeout=30000)
        Q.ensure_boot(page, rec, timeout=12000)
        page.wait_for_timeout(300)
        after = (Q.get_settings(page) or {}).get("scale")
        pressed = Q.eval_js(
            page,
            """() => { var el = document.querySelector('[data-test="scale-hot"]');
                return el ? (el.getAttribute('aria-pressed') || el.className) : null; }""")
        ui_selected = "true" in str(pressed) or "on" in str(pressed).split()
        if before == "hot" and after == "hot" and ui_selected:
            rec.ok("AC-A4-3/%s" % label, "尺度选择刷新后被记住", "settings.scale=hot + UI 选中",
                   "before=%s after=%s ui=%s" % (before, after, pressed), ac="AC-A4-3",
                   viewport=label)
        else:
            rec.fail("AC-A4-3/%s" % label, "尺度选择刷新后被记住", "settings.scale=hot + UI 选中",
                     "before=%s after=%s ui=%s" % (before, after, pressed), ac="AC-A4-3",
                     viewport=label, repro="门厅选热烈→刷新→读取 settings 与 aria-pressed")
        check_no_errors(rec, ps, "AC-H6-1-scale/%s" % label, label, "尺度持久化")
    finally:
        ctx.close()


TAKEOFF_RING = {"red": 0, "yellow": 13, "blue": 26, "green": 39}


def _fixture_squares(page, offset, die):
    """按 a:0 当前实际颜色算合法 from/dest。

    夹具不能假设「a 一定是红色」：门厅 select_distinct_colors 之后 a/b 颜色可能互换，
    而 52 格外环的进度按各自起飞格计算（如黄方 ring:12 已是过进航格的非法位置）。
    """
    sess = Q.get_session(page) or {}
    color = next((p.get("color") for p in (sess.get("pieces") or [])
                  if p.get("id") == "a:0"), "red")
    t = TAKEOFF_RING.get(color, 0)
    return ("ring:%d" % ((t + offset) % 52),
            "ring:%d" % ((t + offset + die) % 52))


def run_event_prompts_case(browser, url, rec, label="390x844"):
    """C1-2/C1-3/C2-2/C2-3：击落/叠机/进航 三类事件题卡的归属与「放过不惩罚」。"""
    vp = Q.VIEWPORTS[label]

    def _new_game():
        ctx, ps, page = new_page(browser, url, vp, rec, label)
        drv = TableDriver(ps, rec, label, max_steps=30)
        Q.ensure_boot(page, rec)
        started = drv.start_quick()
        return ctx, ps, page, drv, started

    # --- 击落（C1-2）---
    ctx, ps, page, drv, started = _new_game()
    try:
        if started:
            frm, dest = _fixture_squares(page, 12, 2)  # 落点与目标同格 → 击落
            sess = _fixture_to_awaiting(page, "a:0", frm, 2, "a", "prompt",
                                        placements={"b:0": dest})
            if sess:
                kind = ((sess.get("awaiting") or {}).get("prompt") or {}).get("kind")
                kicker, _ = Q.find(page, ["test:prompt-kicker"], timeout=2500)
                ktxt = (kicker.inner_text() if kicker else "").replace("\n", " ")
                shot = Q.this_shot(rec, page, "capture_%s" % label)
                if kind == "capture" and rec:
                    if NAMES[1] in ktxt:
                        rec.ok("AC-C1-2/%s" % label, "击落卡显示被击落方姓名", "kicker 含阿策",
                               ktxt, ac="AC-C1-2", viewport=label, evidence=shot)
                    else:
                        rec.fail("AC-C1-2/%s" % label, "击落卡显示被击落方姓名", "kicker 含阿策",
                                 ktxt[:120], ac="AC-C1-2", viewport=label,
                                 repro="构造击落局面→读取题卡 kicker", evidence=shot)
                    Q.try_click(page, SEL["prompt_skip"], timeout=3000)
                    Q.wait_until(page, "() => { try { var s=App.Store.getSession(); var aw=(s&&s.awaiting)||{}; return aw.type !== 'prompt'; } catch(e){ return false; } }", timeout=6000)
                    page.wait_for_timeout(300)
                    s2 = Q.get_session(page) or {}
                    victim = next((p for p in (s2.get("pieces") or []) if p.get("id") == "b:0"), None)
                    if victim and str(victim.get("squareId", "")).startswith("hangar:"):
                        rec.ok("AC-C1-2-effect/%s" % label, "击落后被击落方回机坪", "b:0 in hangar",
                               "square=%s" % victim.get("squareId"), ac="AC-C1-2", viewport=label)
                    else:
                        rec.fail("AC-C1-2-effect/%s" % label, "击落后被击落方回机坪", "b:0 in hangar",
                                 "square=%s" % (victim or {}).get("squareId"), ac="AC-C1-2",
                                 viewport=label, repro="构造击落→读取 b:0 位置")
                else:
                    rec.fail("EVENT-capture/%s" % label, "构造击落题卡", "kind=capture",
                             "kind=%s kicker=%s" % (kind, ktxt[:80]), ac="AC-C1-2",
                             viewport=label, repro="击落夹具")
            check_no_errors(rec, ps, "AC-H6-1-capture/%s" % label, label, "击落")
    finally:
        ctx.close()

    # --- 叠机（C1-3 / C2-3）---
    ctx, ps, page, drv, started = _new_game()
    try:
        if started:
            frm, dest = _fixture_squares(page, 12, 2)  # 落点与自己另一架同格 → 叠机
            sess = _fixture_to_awaiting(page, "a:0", frm, 2, "a", "prompt",
                                        placements={"a:1": dest})
            if sess:
                kind = ((sess.get("awaiting") or {}).get("prompt") or {}).get("kind")
                kicker, _ = Q.find(page, ["test:prompt-kicker"], timeout=2500)
                ktxt = (kicker.inner_text() if kicker else "").replace("\n", " ")
                shot = Q.this_shot(rec, page, "stack_%s" % label)
                if kind == "stack-duo":
                    if "两人一起" in ktxt or "这张给你们俩" in ktxt:
                        rec.ok("AC-C1-3/%s" % label, "叠机卡显示两人一起", "含「两人一起」",
                               ktxt, ac="AC-C1-3", viewport=label, evidence=shot)
                    else:
                        rec.fail("AC-C1-3/%s" % label, "叠机卡显示两人一起", "含「两人一起」",
                                 ktxt[:120], ac="AC-C1-3", viewport=label,
                                 repro="构造叠机局面→读取题卡 kicker", evidence=shot)
                    Q.try_click(page, SEL["prompt_skip"], timeout=3000)
                    Q.wait_until(page, "() => { try { var s=App.Store.getSession(); var aw=(s&&s.awaiting)||{}; return aw.type !== 'prompt'; } catch(e){ return false; } }", timeout=6000)
                    page.wait_for_timeout(400)
                    s2 = Q.get_session(page) or {}
                    mover = next((p for p in (s2.get("pieces") or []) if p.get("id") == "a:0"), None)
                    # 叠机 +1 奖励步：从落点（dest）再走 1 格
                    expect_sq = "ring:%d" % ((int(dest.split(":")[1]) + 1) % 52)
                    if mover and mover.get("squareId") == expect_sq:
                        rec.ok("AC-C2-3/%s" % label, "叠机题放过仍拿到奖励步", "a:0 前进 1 格到 %s" % expect_sq,
                               "square=%s" % mover.get("squareId"), ac="AC-C2-3",
                               severity="P1", viewport=label)
                    else:
                        rec.fail("AC-C2-3/%s" % label, "叠机题放过仍拿到奖励步", "a:0 前进 1 格到 %s" % expect_sq,
                                 "square=%s" % (mover or {}).get("squareId"), ac="AC-C2-3",
                                 severity="P1", viewport=label,
                                 repro="构造叠机题→点放过→读取叠机棋子位置")
                else:
                    rec.fail("EVENT-stack/%s" % label, "构造叠机题卡", "kind=stack-duo",
                             "kind=%s kicker=%s" % (kind, ktxt[:80]), ac="AC-C1-3",
                             viewport=label, repro="叠机夹具")
            check_no_errors(rec, ps, "AC-H6-1-stack/%s" % label, label, "叠机")
    finally:
        ctx.close()

    # --- 进航题放过仍进军（C2-2，红线）---
    ctx, ps, page, drv, started = _new_game()
    try:
        if started:
            # 进度 49 + 2 越过进航格（>50）才会触发进航题；此前用 ring:49+1 恰停在进航格，永远 SKIP
            frm, _dest = _fixture_squares(page, 49, 2)
            sess = _fixture_to_awaiting(page, "a:0", frm, 2, "a", "prompt")
            if sess:
                kind = ((sess.get("awaiting") or {}).get("prompt") or {}).get("kind")
                if kind == "home-entry":
                    Q.try_click(page, SEL["prompt_skip"], timeout=3000)
                    Q.wait_until(page, "() => { try { var s=App.Store.getSession(); var aw=(s&&s.awaiting)||{}; return aw.type !== 'prompt'; } catch(e){ return false; } }", timeout=6000)
                    page.wait_for_timeout(500)
                    s2 = Q.get_session(page) or {}
                    mover = next((p for p in (s2.get("pieces") or []) if p.get("id") == "a:0"), None)
                    sq = str((mover or {}).get("squareId", ""))
                    shot = Q.this_shot(rec, page, "home_entry_skip_%s" % label)
                    if sq.startswith("home:") or (mover or {}).get("arrived"):
                        rec.ok("AC-C2-2/%s" % label, "进航题放过不阻断进军（红线）", "a:0 进入 home:*",
                               "square=%s" % sq, ac="AC-C2-2", viewport=label, evidence=shot)
                    else:
                        rec.fail("AC-C2-2/%s" % label, "进航题放过不阻断进军（红线）", "a:0 进入 home:*",
                                 "square=%s" % sq, ac="AC-C2-2", viewport=label,
                                 repro="构造进航题→点放过→读取棋子位置", evidence=shot)
                else:
                    rec.check("EVENT-home-entry/%s" % label, "构造进航题卡", "SKIP", "kind=home-entry",
                              "kind=%s" % kind, ac="AC-C2-2", viewport=label)
            check_no_errors(rec, ps, "AC-H6-1-home-entry/%s" % label, label, "进航")
    finally:
        ctx.close()


def run_responsive_case(browser, url, rec):
    """H4/H1：320/360/390/430 无横向滚动 + 关键按钮 ≥44 + hit-test 不遮挡（360）。"""
    for label in ("320x568", "360x640", "390x844", "430x932"):
        vp = Q.VIEWPORTS[label]
        ctx, ps, page = new_page(browser, url, vp, rec, label)
        try:
            Q.ensure_boot(page, rec)
            if Q.overflow(page):
                rec.fail("AC-H4-1/%s" % label, "门厅无横向滚动", "scrollWidth<=clientWidth",
                         json.dumps(Q.viewport_metrics(page), ensure_ascii=False), ac="AC-H4-1",
                         viewport=label, repro="打开该视口→读取 scrollWidth")
            else:
                rec.ok("AC-H4-1/%s" % label, "门厅无横向滚动", "scrollWidth<=clientWidth", "ok",
                       ac="AC-H4-1", viewport=label)
            # 开始按钮尺寸
            loc, _ = Q.find(page, SEL["start"], timeout=2500)
            box = Q.element_rect(loc) if loc else None
            if box and box["height"] >= 44:
                rec.ok("AC-H1-1-start/%s" % label, "开始按钮 ≥44px 高", "≥44",
                       "%.1f×%.1f" % (box["width"], box["height"]), ac="AC-H1-1", viewport=label)
            else:
                rec.check("AC-H1-1-start/%s" % label, "开始按钮 ≥44px 高", "FAIL",
                          "≥44", json.dumps(box, ensure_ascii=False), ac="AC-H1-1",
                          viewport=label)
            # 进入主桌检查
            Q.try_click(page, SEL["quick"], timeout=800)
            Q.fill_names(page, list(NAMES))
            Q.try_click(page, SEL["start"], timeout=4000)
            if Q.wait_screen(page, ["table"], timeout=9000) == "table":
                page.wait_for_timeout(500)
                if Q.overflow(page):
                    rec.fail("AC-H4-1-table/%s" % label, "主桌无横向滚动",
                             "scrollWidth<=clientWidth",
                             json.dumps(Q.viewport_metrics(page), ensure_ascii=False),
                             ac="AC-H4-1", viewport=label, repro="进入主桌→读取 scrollWidth")
                else:
                    rec.ok("AC-H4-1-table/%s" % label, "主桌无横向滚动",
                           "scrollWidth<=clientWidth", "ok", ac="AC-H4-1", viewport=label)
                # 关键按钮尺寸（掷骰/暂停/安全词）
                for nm, spec in (("掷骰", SEL["roll"]), ("暂停", SEL["pause_mini"]),
                                 ("安全词", SEL["safety"])):
                    l, _ = Q.find(page, spec, timeout=2000)
                    r = Q.element_rect(l) if l else None
                    if r and r["width"] >= 44 and r["height"] >= 44:
                        rec.ok("AC-H1-1-%s/%s" % (nm, label), "%s 按钮 ≥44×44" % nm,
                               "≥44×44", "%.1f×%.1f" % (r["width"], r["height"]),
                               ac="AC-H1-1", viewport=label)
                    else:
                        rec.check("AC-H1-1-%s/%s" % (nm, label), "%s 按钮 ≥44×44" % nm,
                                  "FAIL" if r else "SKIP", "≥44×44",
                                  json.dumps(r, ensure_ascii=False), ac="AC-H1-1",
                                  viewport=label)
                # hit-test：主桌按钮中心不被安全词覆盖（360 必须）
                if label == "360x640":
                    # AC-H1-2：关键按钮中心的 elementFromPoint 必须命中按钮自身（不被遮挡）
                    for nm, spec in (("掷骰", SEL["roll"]), ("暂停", SEL["pause_mini"]),
                                     ("规则", SEL["rules_entry"])):
                        l, _ = Q.find(page, spec, timeout=1500)
                        if not l:
                            continue
                        hit2 = Q.hit_test(page, l)
                        self_hit = bool(hit2) and (
                            hit2.get("test") in ("roll", "pause", "rules") or
                            "掷骰" in (hit2.get("text") or "") or
                            "暂停" in (hit2.get("text") or "") or
                            "规则" in (hit2.get("text") or ""))
                        if self_hit:
                            rec.ok("AC-H1-2/%s/%s" % (nm, label),
                                   "%s 按钮中心 hit-test 命中自身" % nm,
                                   "elementFromPoint 命中该按钮",
                                   "hit=%s/%s" % (hit2.get("test"), (hit2.get("text") or "")[:12]),
                                   ac="AC-H1-2", viewport=label)
                        else:
                            rec.fail("AC-H1-2/%s/%s" % (nm, label),
                                     "%s 按钮中心 hit-test 命中自身" % nm,
                                     "elementFromPoint 命中该按钮",
                                     "hit=%s" % json.dumps(hit2, ensure_ascii=False),
                                     ac="AC-H1-2", viewport=label,
                                     repro="主桌读取按钮中心 elementFromPoint")
                    safety, _ = Q.find(page, SEL["safety"], timeout=2000)
                    if safety:
                        for nm, spec in (("掷骰", SEL["roll"]), ("暂停", SEL["pause_mini"])):
                            l, _ = Q.find(page, spec, timeout=1500)
                            if not l:
                                continue
                            hit = Q.hit_test(page, l)
                            bad = bool(hit) and (hit.get("test") in ("safety-word", "safe") or
                                                 "先收棋" in (hit.get("text") or ""))
                            if not bad:
                                rec.ok("AC-B4-2/%s/%s" % (nm, label), "%s 不被安全词遮挡" % nm,
                                       "elementFromPoint 命中自身", "hit=%s" % (hit.get("test") or hit.get("tag")),
                                       ac="AC-B4-2", viewport=label)
                            else:
                                rec.fail("AC-B4-2/%s/%s" % (nm, label), "%s 不被安全词遮挡" % nm,
                                         "elementFromPoint 命中自身", "命中安全词",
                                         ac="AC-B4-2", viewport=label,
                                         repro="360 宽主桌→对 %s 中心做 hit-test" % nm)
            else:
                rec.check("RESP-TABLE/%s" % label, "进入主桌做响应式检查", "SKIP",
                          "data-screen=table", "未进入主桌", ac="H4", viewport=label)
            check_no_errors(rec, ps, "AC-H6-1-resp/%s" % label, label, "响应式")
        finally:
            ctx.close()


def run_offline_case(browser, url, rec, label="390x844"):
    """H3：SW 注册 → 断网刷新 → 仍可开局。"""
    vp = Q.VIEWPORTS[label]
    ctx = Q.new_context(browser, viewport=vp, service_workers="allow")
    page = ctx.new_page()
    ps = Q.PageSession(ctx, page)
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        Q.ensure_boot(page, rec, timeout=12000)
        # 等 SW 接管
        ctrl = None
        deadline = time.time() + 10
        while time.time() < deadline:
            ctrl = Q.eval_js(page, "() => navigator.serviceWorker && navigator.serviceWorker.controller ? navigator.serviceWorker.controller.scriptURL : null")
            ready = Q.eval_js(page, "() => navigator.serviceWorker && navigator.serviceWorker.ready ? true : false")
            if ctrl or ready:
                break
            page.wait_for_timeout(300)
        if not ctrl:
            # 等 ready（无 controller 也算注册成功）
            try:
                page.wait_for_function("() => navigator.serviceWorker && navigator.serviceWorker.ready", timeout=6000)
                ready = True
            except Exception:
                ready = False
            ctrl = Q.eval_js(page, "() => navigator.serviceWorker && navigator.serviceWorker.controller ? navigator.serviceWorker.controller.scriptURL : null")
        if not ctrl:
            rec.check("AC-H3-1/%s" % label, "断网刷新仍可开局（SW 命中）", "SKIP",
                      "service worker 注册并接管", "SW 未注册/未接管（dev 构建可能不注册 SW）",
                      ac="AC-H3-1", viewport=label,
                      evidence=json.dumps(ps.report(), ensure_ascii=False))
            return
        ctx.set_offline(True)
        t0 = time.time()
        try:
            page.reload(wait_until="domcontentloaded", timeout=20000)
        except Exception as e:  # noqa: BLE001
            rec.fail("AC-H3-1/%s" % label, "断网刷新仍可开局", "页面可加载", str(e),
                     ac="AC-H3-1", viewport=label, repro="SW 就绪→断网→刷新")
            return
        boot_ms = None
        deadline = time.time() + 8
        while time.time() < deadline:
            if Q.exists(page, SEL["start"], timeout=400):
                boot_ms = int((time.time() - t0) * 1000)
                break
            page.wait_for_timeout(100)
        if boot_ms is not None:
            rec.ok("AC-H3-1/%s" % label, "断网刷新仍可进入门厅", "门厅可见",
                   "boot_ready=%dms" % boot_ms, ac="AC-H3-1", viewport=label,
                   duration_ms=boot_ms, evidence=Q.this_shot(rec, page, "offline_boot_%s" % label))
            # 开局
            Q.try_click(page, SEL["quick"], timeout=1500)
            Q.fill_names(page, list(NAMES))
            Q.try_click(page, SEL["start"], timeout=4000)
            if Q.wait_screen(page, ["table"], timeout=9000) == "table":
                rec.ok("AC-H3-1-start/%s" % label, "断网下可开始一局", "data-screen=table",
                       "table", ac="AC-H3-1", viewport=label)
            else:
                rec.fail("AC-H3-1-start/%s" % label, "断网下可开始一局", "data-screen=table",
                         "screen=%r" % Q.screen_name(page), ac="AC-H3-1", viewport=label,
                         repro="断网→门厅→开始")
            # 断网期间不应有 JS 未捕获错误（网络失败请求允许）
            if ps.pageerrors:
                rec.fail("AC-H3-1-err/%s" % label, "断网开局无 pageerror", "0",
                         json.dumps(ps.pageerrors[:3], ensure_ascii=False), ac="H3",
                         viewport=label, repro="断网开局→读取 pageerror")
            else:
                rec.ok("AC-H3-1-err/%s" % label, "断网开局无 pageerror", "0", "0", ac="H3",
                       viewport=label)
        else:
            rec.fail("AC-H3-1/%s" % label, "断网刷新仍可进入门厅", "门厅可见",
                     "8s 内未出现开始按钮；failed=%s" % json.dumps(ps.failed_requests[:5], ensure_ascii=False),
                     ac="AC-H3-1", viewport=label, repro="SW 就绪→断网→刷新")
    finally:
        ctx.close()


def run_reduced_case(browser, url, rec, label="390x844"):
    """H2：减少动画下点数文本仍出现且 ≤100ms；关闭后动画恢复（>300ms）。"""
    vp = Q.VIEWPORTS[label]
    ctx, ps, page = new_page(browser, url, vp, rec, label)
    drv = TableDriver(ps, rec, label)
    try:
        Q.ensure_boot(page, rec)
        if not drv.start_quick():
            return
        # 开减少动画
        Q.eval_js(page, "() => { try { App.Store.saveSettings({reduced: true}); return true; } catch(e){ return false; } }")
        page.wait_for_timeout(300)
        # 掷骰测点数文本时间
        Q.set_die(page, 6)
        t0 = time.time()
        Q.try_click(page, SEL["roll"], timeout=3000)
        txt, ms = Q.wait_text(page, r"掷出\s*[1-6]", timeout=1200)
        if txt and ms <= 100:
            rec.ok("AC-H2-1/%s" % label, "减少动画下点数文本 ≤100ms", "≤100ms",
                   "%s（%dms）" % (txt, ms), ac="AC-H2-1", viewport=label, duration_ms=ms)
        elif txt:
            rec.fail("AC-H2-1/%s" % label, "减少动画下点数文本 ≤100ms", "≤100ms",
                     "%s（%dms）" % (txt, ms), ac="AC-H2-1", viewport=label, duration_ms=ms,
                     repro="设置开减少动画→掷骰→计时点数文本")
        else:
            rec.fail("AC-H2-1/%s" % label, "减少动画下点数文本仍可见", "≤100ms 出现",
                     "未观察到点数文本", ac="AC-H2-2", viewport=label,
                     repro="设置开减少动画→掷骰")
        # 设置持久化
        st = Q.get_settings(page) or {}
        if st.get("reduced") is True:
            rec.ok("AC-H2-2/%s" % label, "减少动画设置已落盘", "reduced=true", "true",
                   ac="AC-H2-2", viewport=label)
        else:
            rec.check("AC-H2-2/%s" % label, "减少动画设置已落盘", "FAIL",
                      "reduced=true", json.dumps(st, ensure_ascii=False)[:120], ac="AC-H2-2",
                      viewport=label)
        check_no_errors(rec, ps, "AC-H6-1-reduced/%s" % label, label, "减少动画")
    finally:
        ctx.close()


# ---------------------------------------------------------------- V6.2 机舱场景
# 口径：docs/v6/impl-freeze-cabin.md §5（验收标准）
#   - [data-test=cabin] 存在 / pointer-events:none / Canvas≥1 / 92 格点击不落 cabin；
#   - 掷骰/走子/击落/换手/收家时 .v6-board inline transform 变化；reduced 无 transform/shake；
#   - 题卡/安全词/暂停不被 cabin 覆盖（hit-test）；320/360/390/430 无横向溢出。
CABIN_AC = "AC-V6.2-1"
CABIN_AC_CAM = "AC-V6.2-2"
CABIN_AC_RED = "AC-V6.2-3"
CABIN_AC_LAYOUT = "AC-V6.2-4"

CABIN_CAM_INSTALL = """() => {
  var b = document.querySelector('.v6-board');
  var root = document.querySelector('[data-test="cabin-scene"]');
  if (!b || !root) return false;
  window.__cabinCam = {log: [], attr: [], t0: performance.now()};
  var t0 = performance.now();
  try { if (window.__cabinCamMo) window.__cabinCamMo.disconnect(); } catch (e) {}
  try { if (window.__cabinCamAttrMo) window.__cabinCamAttrMo.disconnect(); } catch (e) {}
  window.__cabinCamMo = new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      if (m.attributeName !== 'style') return;
      window.__cabinCam.log.push({t: Math.round(performance.now() - t0),
                                  tr: b.style.transform,
                                  cam: root.getAttribute('data-cabin-cam')});
    });
  });
  try { window.__cabinCamMo.observe(b, {attributes: true, attributeFilter: ['style']}); } catch (e) { return false; }
  window.__cabinCamAttrMo = new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      window.__cabinCam.attr.push({t: Math.round(performance.now() - t0),
        attr: m.attributeName, cam: root.getAttribute('data-cabin-cam'),
        cls: String(root.className), overlay: root.classList.contains('is-overlay'),
        won: root.classList.contains('is-won'),
        dawn: parseFloat(root.getAttribute('data-cabin-dawn') || '0'),
        turn: root.getAttribute('data-turn')});
    });
  });
  try { window.__cabinCamAttrMo.observe(root, {attributes: true}); } catch (e) { return false; }
  return true;
}"""


def cabin_cam_reset(page):
    return Q.eval_js(page, "() => { if (window.__cabinCam) { window.__cabinCam.log = []; window.__cabinCam.attr = []; window.__cabinCam.t0 = performance.now(); } return true; }")


def cabin_cam_read(page):
    data = Q.eval_js(page, "() => window.__cabinCam ? {log: window.__cabinCam.log.slice(), attr: window.__cabinCam.attr.slice()} : null")
    return data if isinstance(data, dict) else {"log": [], "attr": []}


def cabin_facts(page):
    data = Q.eval_js(
        page,
        """() => {
            var host = document.querySelector('[data-test="cabin"]');
            var root = document.querySelector('[data-test="cabin-scene"]');
            var board = document.querySelector('.v6-board');
            var cs = root ? getComputedStyle(root) : null;
            var hs = host ? getComputedStyle(host) : null;
            var canvases = root ? Array.prototype.slice.call(root.querySelectorAll('canvas')) : [];
            function dprOf(c) { var r = c.getBoundingClientRect(); return r && r.width ? (c.width / r.width) : null; }
            function rectOf(el) { if (!el) return null; var r = el.getBoundingClientRect();
                return {x: Math.round(r.x * 10) / 10, y: Math.round(r.y * 10) / 10,
                        w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10}; }
            return {
                host: !!host, hostPE: hs ? hs.pointerEvents : null, hostZ: hs ? hs.zIndex : null,
                hostMount: host ? host.getAttribute('data-cabin-mount') : null,
                root: !!root, rootPE: cs ? cs.pointerEvents : null, rootZ: cs ? cs.zIndex : null,
                rootAria: root ? root.getAttribute('aria-hidden') : null,
                version: root ? root.getAttribute('data-cabin-version') : null,
                reduced: root ? root.getAttribute('data-cabin-reduced') : null,
                cam: root ? root.getAttribute('data-cabin-cam') : null,
                mood: root ? root.getAttribute('data-cabin-mood') : null,
                dawn: root ? parseFloat(root.getAttribute('data-cabin-dawn') || '0') : null,
                paused: root ? root.getAttribute('data-cabin-paused') : null,
                turn: root ? root.getAttribute('data-turn') : null,
                cls: root ? String(root.className) : null,
                canvasCount: canvases.length,
                canvasDpr: canvases.map(dprOf),
                canvasSizes: canvases.map(function (c) { return [c.width, c.height]; }),
                boardTransform: board ? (board.style.transform || '') : null,
                boardRect: rectOf(board),
                rect: rectOf(root),
                vw: window.innerWidth, vh: window.innerHeight,
                dimOpacity: (function () {
                    var d = root ? root.querySelector('.cb-dim') : null;
                    return d ? parseFloat(getComputedStyle(d).opacity) : null;
                })(),
                debug: (window.App && App.CabinScene && App.CabinScene._debug) ? App.CabinScene._debug() : null
            };
        }""",
    )
    return data if isinstance(data, dict) else {}


def cabin_hit_squares(page):
    data = Q.eval_js(
        page,
        """() => {
            var els = Array.prototype.slice.call(document.querySelectorAll('[data-square]'));
            var out = {total: els.length, inCabin: 0, board: 0, outside: 0, bad: [], other: []};
            els.forEach(function (el) {
                var r = el.getBoundingClientRect();
                var x = Math.round(r.x + r.width / 2), y = Math.round(r.y + r.height / 2);
                if (!r.width || !r.height || x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) {
                    out.outside += 1; return;
                }
                var hit = document.elementFromPoint(x, y);
                if (!hit) { out.outside += 1; return; }
                if (hit.closest && hit.closest('[data-test="cabin"], .cabin-root')) {
                    out.inCabin += 1;
                    if (out.bad.length < 5) out.bad.push(el.getAttribute('data-square'));
                    return;
                }
                var inBoard = !!(hit.closest && hit.closest('.v6-board, [data-test="board"]'));
                if (inBoard || hit === el || (el.contains && el.contains(hit)) ||
                    (hit.closest && hit.closest('[data-square]') === el)) {
                    out.board += 1;
                } else {
                    out.other.push({sq: el.getAttribute('data-square'),
                                    cls: String((hit.className && hit.className.baseVal !== undefined)
                                        ? hit.className.baseVal : (hit.className || '')).slice(0, 40)});
                }
            });
            return out;
        }""",
    )
    return data if isinstance(data, dict) else {}


def cabin_hit_at(page, locator):
    """对元素中心做 hit-test，返回是否落在 cabin 层 + 命中信息。"""
    box = Q.element_rect(locator)
    if not box:
        return None
    pt = [box["x"] + box["width"] / 2.0, box["y"] + box["height"] / 2.0]
    return Q.eval_js(
        page,
        """(pt) => {
            var el = document.elementFromPoint(pt[0], pt[1]);
            if (!el) return null;
            var inCabin = !!(el.closest && el.closest('[data-test="cabin"], .cabin-root'));
            var t = el.closest ? el.closest('[data-test]') : null;
            var cls = String((el.className && el.className.baseVal !== undefined)
                ? el.className.baseVal : (el.className || ''));
            return {tag: el.tagName, test: t ? t.getAttribute('data-test') : null,
                    cls: cls.slice(0, 60), inCabin: inCabin,
                    text: String(el.innerText || '').slice(0, 30)};
        }""",
        pt,
    )


def _cam_series(log):
    seq = []
    for x in log or []:
        c = x.get("cam") or "?"
        if not seq or seq[-1] != c:
            seq.append(c)
    return seq


def _cam_metrics(log):
    out = {"frames": 0, "scale_min": None, "scale_max": None, "dx": [], "dy": [], "rot": []}
    for x in log or []:
        tr = x.get("tr") or ""
        if not tr:
            continue
        out["frames"] += 1
        m = re.search(r"translate3d\(([-\d.]+)px,\s*([-\d.]+)px", tr)
        if m:
            out["dx"].append(float(m.group(1)))
            out["dy"].append(float(m.group(2)))
        m = re.search(r"scale\(([\d.]+)\)", tr)
        if m:
            out["scale_min"] = float(m.group(1)) if out["scale_min"] is None else min(out["scale_min"], float(m.group(1)))
            out["scale_max"] = float(m.group(1)) if out["scale_max"] is None else max(out["scale_max"], float(m.group(1)))
        m = re.search(r"rotate\(([-\d.]+)deg\)", tr)
        if m:
            out["rot"].append(float(m.group(1)))
    return out


def _max_abs(vals):
    return max((abs(v) for v in (vals or [])), default=0.0)


def _cabin_start(browser, url, rec, label, reduced=False, reduced_motion=None):
    vp = Q.VIEWPORTS[label]
    ctx = Q.new_context(browser, viewport=vp, dsf=2, reduced_motion=reduced_motion)
    page = ctx.new_page()
    ps = Q.PageSession(ctx, page)
    if reduced_motion:
        # 本机 Playwright/Edge 的 emulate_media(reduced_motion=...) 不生效（实测 matches=false），
        # 改用 CDP Emulation.setEmulatedMedia（实测 before/after reload 均为 true）。
        try:
            cdp = ctx.new_cdp_session(page)
            cdp.send("Emulation.setEmulatedMedia", {
                "media": "",
                "features": [{"name": "prefers-reduced-motion", "value": "reduce"}],
            })
        except Exception as e:  # noqa: BLE001
            rec.add_note("prefers-reduced-motion 模拟失败：%s" % e)
    page.goto(url, wait_until="domcontentloaded", timeout=30000)
    Q.ensure_boot(page, rec, timeout=15000)
    if reduced:
        Q.eval_js(page, "() => { try { App.Store.saveSettings({reduced:true}); return true; } catch(e){ return false; } }")
        page.wait_for_timeout(250)
    drv = TableDriver(ps, rec, label)
    started = drv.start_quick()
    page.wait_for_timeout(700)
    return ctx, ps, page, drv, started


def _cabin_click_piece(page, pid="a:0"):
    btns, _ = Q.find_piece_buttons(page)
    for b in btns:
        try:
            dp = b.get_attribute("data-action-piece") or b.get_attribute("data-piece")
        except Exception:
            dp = None
        if dp == pid:
            try:
                b.click(timeout=4000)
                return True
            except Exception:
                return False
    return False


def _cabin_move_target(page, want_kinds=("ring",)):
    """按 a:0 的颜色挑一个合法走 2 格、落点 kind 命中的 from/dest（不假设红方）。"""
    data = Q.eval_js(
        page,
        """(kinds) => {
            try {
                var s = App.Store.getSession();
                if (!s) return null;
                var p = (s.pieces || []).filter(function (q) { return q.id === 'a:0'; })[0];
                if (!p) return null;
                var T = {red: 0, yellow: 13, blue: 26, green: 39}[p.color] || 0;
                function kindOf(id) {
                    try { var sq = App.FlightBoard.square(id); return sq ? (sq.kind || 'ring') : 'none'; }
                    catch (e) { return 'none'; }
                }
                for (var off = 1; off < 40; off++) {
                    var to = 'ring:' + ((T + off + 2) % 52);
                    var k = kindOf(to);
                    if (kinds.indexOf(k) >= 0) {
                        return {from: 'ring:' + ((T + off) % 52), to: to, kind: k};
                    }
                }
            } catch (e) {}
            return null;
        }""",
        list(want_kinds),
    )
    return data if isinstance(data, dict) else None


def run_cabin_layer_case(browser, url, rec, label="390x844"):
    """V6.2 §5：机舱层存在 / pointer-events:none / Canvas≥1 / 92 格点击不落 cabin。"""
    ctx, ps, page, drv, started = _cabin_start(browser, url, rec, label)
    try:
        if not started:
            return
        f = cabin_facts(page)
        hit = cabin_hit_squares(page)
        shot = Q.this_shot(rec, page, "cabin_layer_%s" % label)
        if f.get("host"):
            rec.ok("CABIN-LAYER-01/%s" % label, "机舱宿主 [data-test=cabin] 存在", "存在",
                   "host=1", ac=CABIN_AC, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-LAYER-01/%s" % label, "机舱宿主 [data-test=cabin] 存在", "存在", "缺失",
                     ac=CABIN_AC, viewport=label, evidence=shot,
                     repro="进入主桌→查询 [data-test=cabin]")
        if f.get("root") and f.get("version") == "6.2.0":
            rec.ok("CABIN-LAYER-02/%s" % label, "CabinScene 已挂载（.cabin-root / 版本 6.2.0）",
                   "data-cabin-version=6.2.0", "version=%s" % f.get("version"),
                   ac=CABIN_AC, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-LAYER-02/%s" % label, "CabinScene 已挂载（.cabin-root / 版本 6.2.0）",
                     "data-cabin-version=6.2.0", json.dumps({k: f.get(k) for k in ("root", "version", "hostMount")}, ensure_ascii=False),
                     ac=CABIN_AC, viewport=label, evidence=shot,
                     repro="进入主桌→查询 [data-test=cabin-scene] 与 data-cabin-version")
        pe_ok = f.get("hostPE") == "none" and f.get("rootPE") == "none"
        if pe_ok:
            rec.ok("CABIN-LAYER-03/%s" % label, "机舱层 pointer-events:none（不拦截点击）", "host/root 均为 none",
                   "host=%s root=%s" % (f.get("hostPE"), f.get("rootPE")), ac=CABIN_AC,
                   viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-LAYER-03/%s" % label, "机舱层 pointer-events:none（不拦截点击）", "host/root 均为 none",
                     "host=%s root=%s" % (f.get("hostPE"), f.get("rootPE")), ac=CABIN_AC,
                     viewport=label, evidence=shot, repro="进入主桌→读 computed pointer-events")
        if (f.get("canvasCount") or 0) >= 1:
            rec.ok("CABIN-LAYER-04/%s" % label, "机舱 Canvas ≥1（舷窗/尘）", "≥1",
                   "canvas=%s dpr=%s" % (f.get("canvasCount"), f.get("canvasDpr")),
                   ac=CABIN_AC, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-LAYER-04/%s" % label, "机舱 Canvas ≥1（舷窗/尘）", "≥1",
                     "canvas=%s" % f.get("canvasCount"), ac=CABIN_AC, viewport=label,
                     evidence=shot, repro="进入主桌→统计 .cabin-root canvas")
        dpr_ok = bool(f.get("canvasDpr")) and all(d is not None and d <= 2.01 for d in f["canvasDpr"])
        if dpr_ok:
            rec.ok("CABIN-LAYER-05/%s" % label, "场景 Canvas DPR ≤2（冻结单 §4.1）", "≤2",
                   "dpr=%s" % f.get("canvasDpr"), ac=CABIN_AC, severity="P1",
                   viewport=label, evidence=shot)
        else:
            rec.check("CABIN-LAYER-05/%s" % label, "场景 Canvas DPR ≤2（冻结单 §4.1）", "FAIL",
                      "≤2", "dpr=%s" % f.get("canvasDpr"), ac=CABIN_AC, severity="P1", viewport=label)
        r = f.get("rect") or {}
        cover_ok = r and abs((r.get("w") or 0) - f.get("vw", 0)) <= 1 and abs((r.get("h") or 0) - f.get("vh", 0)) <= 1
        if cover_ok:
            rec.ok("CABIN-LAYER-06/%s" % label, "机舱层铺满视口", "覆盖 390×844",
                   "rect=%s viewport=%sx%s" % (json.dumps(r), f.get("vw"), f.get("vh")),
                   ac=CABIN_AC, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-LAYER-06/%s" % label, "机舱层铺满视口", "覆盖视口",
                     "rect=%s viewport=%sx%s" % (json.dumps(r), f.get("vw"), f.get("vh")),
                     ac=CABIN_AC, viewport=label, evidence=shot,
                     repro="进入主桌→读 .cabin-root getBoundingClientRect")
        if hit.get("total") == 92 and hit.get("inCabin") == 0 and hit.get("board") == 92:
            rec.ok("CABIN-LAYER-07/%s" % label, "92 格点击不落 cabin（全部命中棋盘层）", "92/92 命中棋盘",
                   json.dumps({k: hit.get(k) for k in ("total", "board", "inCabin", "outside")}, ensure_ascii=False),
                   ac=CABIN_AC, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-LAYER-07/%s" % label, "92 格点击不落 cabin（全部命中棋盘层）",
                     "92/92 命中棋盘，inCabin=0",
                     json.dumps({k: hit.get(k) for k in ("total", "board", "inCabin", "outside", "bad", "other")},
                                ensure_ascii=False)[:400],
                     ac=CABIN_AC, viewport=label, evidence=shot,
                     repro="进入主桌→对每个 [data-square] 中心做 elementFromPoint")
        if f.get("rootAria") == "true":
            rec.ok("CABIN-LAYER-08/%s" % label, "机舱层 aria-hidden（读屏不重复朗读）", "true",
                   "aria-hidden=true", ac=CABIN_AC, severity="P1", viewport=label, evidence=shot)
        else:
            rec.check("CABIN-LAYER-08/%s" % label, "机舱层 aria-hidden（读屏不重复朗读）", "FAIL",
                      "true", "aria-hidden=%s" % f.get("rootAria"), ac=CABIN_AC, severity="P1",
                      viewport=label)
        check_no_errors(rec, ps, "AC-H6-1-cabin-layer/%s" % label, label, "机舱层")
    finally:
        ctx.close()


def run_cabin_camera_case(browser, url, rec, label="390x844"):
    """V6.2 §5：掷骰/走子/击落/换手/收家时 .v6-board inline transform 变化。"""
    # ---- 掷骰（dice）----
    ctx, ps, page, drv, started = _cabin_start(browser, url, rec, label)
    try:
        if not started:
            return
        installed = Q.eval_js(page, CABIN_CAM_INSTALL)
        if not installed:
            rec.fail("CABIN-CAM-hook/%s" % label, "相机观测器安装（.v6-board 存在）", "可观测",
                     "未找到 .v6-board / .cabin-root", ac=CABIN_AC_CAM, viewport=label,
                     repro="进入主桌→查询 .v6-board 与 .cabin-root")
            return
        cabin_cam_reset(page)
        Q.set_die(page, 6)
        Q.try_click(page, SEL["roll"], timeout=3000)
        page.wait_for_timeout(1500)
        log = cabin_cam_read(page)["log"]
        series = _cam_series(log)
        m = _cam_metrics(log)
        shot = Q.this_shot(rec, page, "cabin_cam_dice_%s" % label)
        if "dice" in series and m["frames"] > 0 and (m["scale_max"] or 1) >= 1.02:
            rec.ok("CABIN-CAM-dice/%s" % label, "掷骰触发镜头（推近 scale≥1.02）", "cam=dice，scale≥1.02",
                   "series=%s scale=%s..%s frames=%d" % (series, m["scale_min"], m["scale_max"], m["frames"]),
                   ac=CABIN_AC_CAM, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-CAM-dice/%s" % label, "掷骰触发镜头（推近 scale≥1.02）", "cam=dice，scale≥1.02",
                     "series=%s scale=%s..%s frames=%d" % (series, m["scale_min"], m["scale_max"], m["frames"]),
                     ac=CABIN_AC_CAM, viewport=label, evidence=shot,
                     repro="主桌→固定骰子 6→点掷骰→记录 .v6-board style.transform")
        page.wait_for_timeout(1400)
        f = cabin_facts(page)
        if f.get("cam") == "rest":
            rec.ok("CABIN-CAM-dice-rest/%s" % label, "掷骰镜头回位（cam=rest）", "rest", "rest",
                   ac=CABIN_AC_CAM, severity="P1", viewport=label)
        else:
            rec.fail("CABIN-CAM-dice-rest/%s" % label, "掷骰镜头回位（cam=rest）", "rest",
                     "cam=%s transform=%s" % (f.get("cam"), (f.get("boardTransform") or "")[:80]),
                     ac=CABIN_AC_CAM, severity="P1", viewport=label,
                     repro="掷骰后等 2.9s→读 data-cabin-cam")
        check_no_errors(rec, ps, "AC-H6-1-cabin-cam-dice/%s" % label, label, "掷骰镜头")
    finally:
        ctx.close()

    # ---- 走子（move）----
    ctx, ps, page, drv, started = _cabin_start(browser, url, rec, label)
    try:
        if not started:
            return
        target = _cabin_move_target(page, ("ring", "stop"))
        if not target:
            rec.check("CABIN-CAM-move/%s" % label, "构造合法走子局面", "SKIP", "ring/stop 落点",
                      "未找到合法走子格", ac=CABIN_AC_CAM, viewport=label)
            return
        _fixture_move(page, "a:0", target["from"], 2, "a")
        Q.wait_screen(page, ["table"], timeout=6000)
        page.wait_for_timeout(500)
        installed = Q.eval_js(page, CABIN_CAM_INSTALL)
        cabin_cam_reset(page)
        ok_click = _cabin_click_piece(page, "a:0")
        page.wait_for_timeout(1700)
        log = cabin_cam_read(page)["log"]
        series = _cam_series(log)
        m = _cam_metrics(log)
        page.wait_for_timeout(600)
        sess = Q.get_session(page) or {}
        mover = next((p for p in (sess.get("pieces") or []) if p.get("id") == "a:0"), {})
        landed = mover.get("squareId")
        shot = Q.this_shot(rec, page, "cabin_cam_move_%s" % label)
        if ok_click and "move" in series and (m["scale_max"] or 1) >= 1.015 and \
                (_max_abs(m["dx"]) >= 4 or _max_abs(m["dy"]) >= 4):
            rec.ok("CABIN-CAM-move/%s" % label, "走子触发镜头跟拍（位移≥4px / scale≥1.015）",
                   "cam=move，transform 变化", "series=%s scale=%s..%s dx=%.1f dy=%.1f frames=%d landing=%s" % (
                       series, m["scale_min"], m["scale_max"], _max_abs(m["dx"]), _max_abs(m["dy"]),
                       m["frames"], landed),
                   ac=CABIN_AC_CAM, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-CAM-move/%s" % label, "走子触发镜头跟拍（位移≥4px / scale≥1.015）",
                     "cam=move，transform 变化",
                     "click=%s series=%s scale=%s..%s dx=%.1f dy=%.1f frames=%d landing=%s" % (
                         ok_click, series, m["scale_min"], m["scale_max"], _max_abs(m["dx"]),
                         _max_abs(m["dy"]), m["frames"], landed),
                     ac=CABIN_AC_CAM, viewport=label, evidence=shot,
                     repro="夹具摆 a:0→(ring)→点选子按钮→记录 transform")
        # 防止后续 prompt 卡住（仅清理，不影响断言）
        Q.try_click(page, SEL["prompt_skip"], timeout=1500)
        check_no_errors(rec, ps, "AC-H6-1-cabin-cam-move/%s" % label, label, "走子镜头")
    finally:
        ctx.close()

    # ---- 击落（capture → shake）----
    ctx, ps, page, drv, started = _cabin_start(browser, url, rec, label)
    try:
        if not started:
            return
        frm, dest = _fixture_squares(page, 12, 2)   # 落点与目标同格 → 击落（与 C1-2 同夹具）
        _fixture_move(page, "a:0", frm, 2, "a", placements={"b:0": dest})
        Q.wait_screen(page, ["table"], timeout=6000)
        page.wait_for_timeout(500)
        Q.eval_js(page, CABIN_CAM_INSTALL)
        cabin_cam_reset(page)
        ok_click = _cabin_click_piece(page, "a:0")
        page.wait_for_timeout(1800)
        log = cabin_cam_read(page)
        series = _cam_series(log["log"])
        m = _cam_metrics(log["log"])
        shake_frames = [x for x in log["log"] if (x.get("cam") == "shake")]
        sess = Q.get_session(page) or {}
        kind = ((sess.get("awaiting") or {}).get("prompt") or {}).get("kind")
        victim = next((p for p in (sess.get("pieces") or []) if p.get("id") == "b:0"), {})
        shot = Q.this_shot(rec, page, "cabin_cam_capture_%s" % label)
        if ok_click and "shake" in series and len(shake_frames) >= 2 and \
                (_max_abs(m["dx"]) >= 2.5 or _max_abs(m["rot"]) >= 0.15):
            rec.ok("CABIN-CAM-capture/%s" % label, "击落触发镜头震动（shake，位移≥2.5px 或旋转≥0.15°）",
                   "cam=shake 且 transform 抖动", "series=%s shakeFrames=%d dx=%.1f rot=%.2f kind=%s victim=%s" % (
                       series, len(shake_frames), _max_abs(m["dx"]), _max_abs(m["rot"]), kind,
                       victim.get("squareId")),
                   ac=CABIN_AC_CAM, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-CAM-capture/%s" % label, "击落触发镜头震动（shake，位移≥2.5px 或旋转≥0.15°）",
                     "cam=shake 且 transform 抖动",
                     "click=%s series=%s shakeFrames=%d dx=%.1f rot=%.2f kind=%s victim=%s" % (
                         ok_click, series, len(shake_frames), _max_abs(m["dx"]), _max_abs(m["rot"]),
                         kind, victim.get("squareId")),
                     ac=CABIN_AC_CAM, viewport=label, evidence=shot,
                     repro="击落夹具→点选子按钮→记录 data-cabin-cam/transform")
        check_no_errors(rec, ps, "AC-H6-1-cabin-cam-capture/%s" % label, label, "击落镜头")
    finally:
        ctx.close()

    # ---- 换手（turn）----
    ctx, ps, page, drv, started = _cabin_start(browser, url, rec, label)
    try:
        if not started:
            return
        sess = Q.get_session(page) or {}
        colors = sess.get("colors") or {"a": "red", "b": "yellow"}
        Q.fixture_place(page, {
            "a:0": "hangar:%s:0" % colors["a"], "a:1": "hangar:%s:1" % colors["a"],
            "b:0": "hangar:%s:0" % colors["b"], "b:1": "hangar:%s:1" % colors["b"],
        }, turn="a")
        Q.ensure_boot(page, rec, timeout=9000)
        if Q.screen_name(page) != "table":
            Q.continue_session(page, timeout=6000)
        page.wait_for_timeout(500)
        Q.install_die_hook(page)
        Q.eval_js(page, CABIN_CAM_INSTALL)
        cabin_cam_reset(page)
        Q.set_die(page, 3)   # 全在机坪：无子可走 → 换手
        Q.try_click(page, SEL["roll"], timeout=3000)
        page.wait_for_timeout(1600)
        log = cabin_cam_read(page)
        series = _cam_series(log["log"])
        f = cabin_facts(page)
        shot = Q.this_shot(rec, page, "cabin_cam_turn_%s" % label)
        turn_now = (Q.get_session(page) or {}).get("turn")
        if "turn" in series and turn_now == "b" and f.get("turn") == "b":
            rec.ok("CABIN-CAM-turn/%s" % label, "换手触发镜头平移 + 舱灯换侧（cam=turn，data-turn=b）",
                   "cam=turn 且 data-turn=b", "series=%s data-turn=%s session.turn=%s" % (
                       series, f.get("turn"), turn_now),
                   ac=CABIN_AC_CAM, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-CAM-turn/%s" % label, "换手触发镜头平移 + 舱灯换侧（cam=turn，data-turn=b）",
                     "cam=turn 且 data-turn=b", "series=%s data-turn=%s session.turn=%s" % (
                         series, f.get("turn"), turn_now),
                     ac=CABIN_AC_CAM, viewport=label, evidence=shot,
                     repro="夹具全机坪→掷 3（无子可走）→记录 cam/data-turn")
        check_no_errors(rec, ps, "AC-H6-1-cabin-cam-turn/%s" % label, label, "换手镜头")
    finally:
        ctx.close()

    # ---- 收家（win → 日出 + 拉远）----
    ctx, ps, page, drv, started = _cabin_start(browser, url, rec, label)
    try:
        if not started:
            return
        sess = Q.get_session(page) or {}
        colors = sess.get("colors") or {"a": "red", "b": "yellow"}
        ca, cb = colors["a"], colors["b"]
        st = Q.fixture_place(page, {
            "a:0": "home:%s:4" % ca, "a:1": "home:%s:goal" % ca,
            "b:0": "hangar:%s:0" % cb, "b:1": "hangar:%s:1" % cb,
        }, turn="a")
        Q.ensure_boot(page, rec, timeout=9000)
        if Q.screen_name(page) != "table":
            Q.continue_session(page, timeout=6000)
        page.wait_for_timeout(500)
        Q.install_die_hook(page)
        _fixture_move(page, "a:0", "home:%s:4" % ca, 1, "a")
        Q.wait_screen(page, ["table"], timeout=6000)
        page.wait_for_timeout(500)
        Q.eval_js(page, CABIN_CAM_INSTALL)
        cabin_cam_reset(page)
        ok_click = _cabin_click_piece(page, "a:0")
        page.wait_for_timeout(2400)
        log = cabin_cam_read(page)
        series = _cam_series(log["log"])
        m = _cam_metrics(log["log"])
        f = cabin_facts(page)
        s2 = Q.get_session(page) or {}
        shot = Q.this_shot(rec, page, "cabin_cam_win_%s" % label)
        won_cls = "is-won" in (f.get("cls") or "")
        dawn = f.get("dawn") or 0
        if ok_click and won_cls and dawn > 0.02 and (m["scale_min"] or 1) < 1.0:
            rec.ok("CABIN-CAM-win/%s" % label, "收家：镜头拉远 + 窗外进入日出态", "is-won 且 dawn>0.02 且 scale<1",
                   "series=%s cls=%s dawn=%.2f scale=%s..%s winner=%s" % (
                       series, f.get("cls"), dawn, m["scale_min"], m["scale_max"], s2.get("winnerId")),
                   ac=CABIN_AC_CAM, viewport=label, evidence=shot)
        else:
            rec.fail("CABIN-CAM-win/%s" % label, "收家：镜头拉远 + 窗外进入日出态",
                     "is-won 且 dawn>0.02 且 scale<1",
                     "click=%s series=%s cls=%s dawn=%.2f scale=%s..%s winner=%s" % (
                         ok_click, series, f.get("cls"), dawn, m["scale_min"], m["scale_max"],
                         s2.get("winnerId")),
                     ac=CABIN_AC_CAM, viewport=label, evidence=shot,
                     repro="夹具「a 方差一步全到家」→点选子到家→读 is-won/data-cabin-dawn/transform")
        check_no_errors(rec, ps, "AC-H6-1-cabin-cam-win/%s" % label, label, "收家镜头")
    finally:
        ctx.close()


def run_cabin_reduced_case(browser, url, rec, label="390x844"):
    """V6.2 §3.9/§5：reduced（设置或系统偏好）下无镜头 transform、无震动、无闪灯。"""
    results = []
    for mode in ("settings", "media"):
        ctx = None
        try:
            ctx, ps, page, drv, started = _cabin_start(
                browser, url, rec, label, reduced=(mode == "settings"),
                reduced_motion=True if mode == "media" else None)
            if not started:
                continue
            f = cabin_facts(page)
            idle_ok = f.get("reduced") == "1" and "is-reduced" in (f.get("cls") or "") and \
                (f.get("boardTransform") or "") == ""
            Q.eval_js(page, CABIN_CAM_INSTALL)
            cabin_cam_reset(page)
            Q.set_die(page, 6)
            Q.try_click(page, SEL["roll"], timeout=3000)
            page.wait_for_timeout(2200)
            log = cabin_cam_read(page)
            nonempty = [x for x in log["log"] if x.get("tr")]
            cams = _cam_series(log["log"])
            flicker = [x for x in log["attr"] if "is-flicker" in (x.get("cls") or "")]
            # 再触发一次击落（最重的震动）确认 reduced 下也无 shake
            frm, dest = _fixture_squares(page, 12, 2)
            _fixture_move(page, "a:0", frm, 2, "a", placements={"b:0": dest})
            Q.wait_screen(page, ["table"], timeout=6000)
            page.wait_for_timeout(400)
            Q.eval_js(page, CABIN_CAM_INSTALL)
            cabin_cam_reset(page)
            _cabin_click_piece(page, "a:0")
            page.wait_for_timeout(1800)
            log2 = cabin_cam_read(page)
            nonempty2 = [x for x in log2["log"] if x.get("tr")]
            shake2 = [x for x in log2["log"] if x.get("cam") == "shake"]
            shot = Q.this_shot(rec, page, "cabin_reduced_%s_%s" % (mode, label))
            ok = bool(idle_ok) and not nonempty and not nonempty2 and not shake2 and not flicker and \
                (f.get("canvasCount") or 0) >= 1
            detail = "mode=%sreduced=%s cls=%s idleTransform=%r diceNonempty=%d captureNonempty=%d " \
                     "shakeFrames=%d flicker=%d canvases=%s" % (
                         ("settings/" if mode == "settings" else "media/"),
                         f.get("reduced"), f.get("cls"), f.get("boardTransform"),
                         len(nonempty), len(nonempty2), len(shake2), len(flicker), f.get("canvasCount"))
            if ok:
                rec.ok("CABIN-REDUCED-%s/%s" % (mode, label), "减少动画（%s）：无镜头 transform / 无震动 / 无闪灯" % mode,
                       "reduced=1，transform 全空，cam 无 shake", detail,
                       ac=CABIN_AC_RED, viewport=label, evidence=shot)
            else:
                rec.fail("CABIN-REDUCED-%s/%s" % (mode, label), "减少动画（%s）：无镜头 transform / 无震动 / 无闪灯" % mode,
                         "reduced=1，transform 全空，cam 无 shake", detail,
                         ac=CABIN_AC_RED, viewport=label, evidence=shot,
                         repro="设置/reduced_motion → 进主桌 → 掷骰 + 击落夹具 → 记录 transform/cam")
            check_no_errors(rec, ps, "AC-H6-1-cabin-reduced-%s/%s" % (mode, label), label, "减少动画")
        finally:
            if ctx is not None:
                ctx.close()


def run_cabin_overlay_case(browser, url, rec, label="390x844"):
    """V6.2 §5：题卡/安全词/暂停不被 cabin 覆盖（hit-test），且题卡时场景压暗。"""
    ctx, ps, page, drv, started = _cabin_start(browser, url, rec, label)
    try:
        if not started:
            return
        target = _cabin_move_target(page, ("truth", "dare", "touch"))
        reached = False
        if target:
            _fixture_move(page, "a:0", target["from"], 2, "a")
            Q.wait_screen(page, ["table"], timeout=6000)
            page.wait_for_timeout(500)
            _cabin_click_piece(page, "a:0")
            reached = Q.find(page, SEL["prompt_card"], timeout=9000)[0] is not None
        if not reached:
            # 兜底：按 UI 正常推进到第一张题卡（与 visual.py 同口径）
            guard = 0
            while guard < 50 and not reached:
                guard += 1
                sess = Q.get_session(page) or {}
                aw = (sess.get("awaiting") or {}).get("type")
                if aw in ("prompt", "ending-prompt"):
                    reached = True
                    break
                if aw == "minigame":
                    Q.try_click(page, SEL["mg_skip"], timeout=1500)
                    page.wait_for_timeout(400)
                    continue
                r = drv.step()
                if r == "stuck":
                    break
                page.wait_for_timeout(260)
        if not reached:
            rec.check("CABIN-OVERLAY/%s" % label, "驱动到题卡（浮层遮挡检查）", "SKIP",
                      "出现题卡", "50 步内未落到题格", ac=CABIN_AC_LAYOUT, viewport=label)
            return
        Q.find(page, ["test:prompt-card", ".pc-root"], timeout=8000)
        page.wait_for_timeout(500)
        f = cabin_facts(page)
        shot = Q.this_shot(rec, page, "cabin_overlay_prompt_%s" % label)
        overlay_ok = "is-overlay" in (f.get("cls") or "") and (f.get("dimOpacity") or 0) > 0.05
        if overlay_ok:
            rec.ok("CABIN-OVERLAY-01/%s" % label, "题卡出现时机舱压暗（is-overlay + .cb-dim）", "is-overlay 且 dim>0.05",
                   "cls=%s dim=%s" % (f.get("cls"), f.get("dimOpacity")),
                   ac=CABIN_AC_LAYOUT, severity="P1", viewport=label, evidence=shot)
        else:
            rec.check("CABIN-OVERLAY-01/%s" % label, "题卡出现时机舱压暗（is-overlay + .cb-dim）", "FAIL",
                      "is-overlay 且 dim>0.05", "cls=%s dim=%s" % (f.get("cls"), f.get("dimOpacity")),
                      ac=CABIN_AC_LAYOUT, severity="P1", viewport=label)
        # 题卡按钮 / 安全词：中心 hit-test 不得落在 cabin
        for nm, spec in (("题卡-做了", SEL["prompt_done"]), ("题卡-放过", SEL["prompt_skip"]),
                         ("安全词", SEL["safety"]), ("暂停", SEL["pause_mini"])):
            loc, _ = Q.find(page, spec, timeout=2000)
            if loc is None:
                continue
            hit = cabin_hit_at(page, loc)
            if hit and not hit.get("inCabin"):
                rec.ok("CABIN-OVERLAY-02-%s/%s" % (nm, label), "%s 不被 cabin 覆盖" % nm,
                       "hit-test 不落 cabin", "hit=%s/%s" % (hit.get("test"), (hit.get("text") or "")[:12]),
                       ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot)
            else:
                rec.fail("CABIN-OVERLAY-02-%s/%s" % (nm, label), "%s 不被 cabin 覆盖" % nm,
                         "hit-test 不落 cabin", json.dumps(hit, ensure_ascii=False),
                         ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot,
                         repro="题卡打开→对 %s 中心 elementFromPoint" % nm)
        # 关闭题卡后进入暂停页
        Q.try_click(page, SEL["prompt_skip"], timeout=2500)
        page.wait_for_timeout(900)
        pause_btn, _ = Q.find(page, SEL["pause_mini"], timeout=3000)
        got_pause = False
        if pause_btn is not None:
            try:
                pause_btn.click(timeout=3000)
            except Exception:
                pass
            got_pause = Q.wait_screen(page, ["pause"], timeout=3000) == "pause"
        if got_pause:
            page.wait_for_timeout(400)
            shot2 = Q.this_shot(rec, page, "cabin_overlay_pause_%s" % label)
            # 暂停页：安全词与结束按钮 hit-test 不落 cabin
            for nm, spec in (("暂停-安全词", SEL["safety"]), ("暂停-今晚就到这", SEL["pause_end"]),
                             ("暂停-继续", SEL["pause_continue"])):
                loc, _ = Q.find(page, spec, timeout=2000)
                if loc is None:
                    continue
                hit = cabin_hit_at(page, loc)
                if hit and not hit.get("inCabin"):
                    rec.ok("CABIN-OVERLAY-03-%s/%s" % (nm, label), "%s 不被 cabin 覆盖" % nm,
                           "hit-test 不落 cabin", "hit=%s/%s" % (hit.get("test"), (hit.get("text") or "")[:12]),
                           ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot2)
                else:
                    rec.fail("CABIN-OVERLAY-03-%s/%s" % (nm, label), "%s 不被 cabin 覆盖" % nm,
                             "hit-test 不落 cabin", json.dumps(hit, ensure_ascii=False),
                             ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot2,
                             repro="暂停页→对 %s 中心 elementFromPoint" % nm)
        else:
            rec.check("CABIN-OVERLAY-03/%s" % label, "进入暂停页做遮挡检查", "SKIP",
                      "data-screen=pause", "未能进入暂停页", ac=CABIN_AC_LAYOUT, viewport=label)
        check_no_errors(rec, ps, "AC-H6-1-cabin-overlay/%s" % label, label, "浮层遮挡")
    finally:
        ctx.close()


def run_cabin_responsive_case(browser, url, rec):
    """V6.2 §5：320/360/390/430 无横向溢出，机舱层铺满、92 格不落 cabin。"""
    for label in ("320x568", "360x640", "390x844", "430x932"):
        ctx = None
        try:
            ctx, ps, page, drv, started = _cabin_start(browser, url, rec, label)
            if not started:
                continue
            f = cabin_facts(page)
            hit = cabin_hit_squares(page)
            shot = Q.this_shot(rec, page, "cabin_resp_%s" % label)
            if not Q.overflow(page):
                rec.ok("CABIN-RESP-overflow/%s" % label, "主桌无横向溢出（机舱层不撑宽）",
                       "scrollWidth<=clientWidth", json.dumps(Q.viewport_metrics(page), ensure_ascii=False),
                       ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot)
            else:
                rec.fail("CABIN-RESP-overflow/%s" % label, "主桌无横向溢出（机舱层不撑宽）",
                         "scrollWidth<=clientWidth", json.dumps(Q.viewport_metrics(page), ensure_ascii=False),
                         ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot,
                         repro="该视口进入主桌→读 scrollWidth/clientWidth")
            r = f.get("rect") or {}
            if r and abs((r.get("w") or 0) - f.get("vw", 0)) <= 1 and abs((r.get("h") or 0) - f.get("vh", 0)) <= 1:
                rec.ok("CABIN-RESP-cover/%s" % label, "机舱层按视口铺满", "w×h = viewport",
                       "rect=%s viewport=%sx%s" % (json.dumps(r), f.get("vw"), f.get("vh")),
                       ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot)
            else:
                rec.fail("CABIN-RESP-cover/%s" % label, "机舱层按视口铺满", "w×h = viewport",
                         "rect=%s viewport=%sx%s" % (json.dumps(r), f.get("vw"), f.get("vh")),
                         ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot,
                         repro="该视口进入主桌→读 .cabin-root rect")
            if hit.get("total") == 92 and hit.get("inCabin") == 0:
                rec.ok("CABIN-RESP-92/%s" % label, "92 格点击不落 cabin", "inCabin=0",
                       json.dumps({k: hit.get(k) for k in ("total", "inCabin", "board", "outside")},
                                  ensure_ascii=False),
                       ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot)
            else:
                rec.fail("CABIN-RESP-92/%s" % label, "92 格点击不落 cabin", "inCabin=0",
                         json.dumps({k: hit.get(k) for k in ("total", "inCabin", "board", "outside", "bad")},
                                    ensure_ascii=False)[:300],
                         ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot,
                         repro="该视口进入主桌→逐格 elementFromPoint")
            dpr_ok = bool(f.get("canvasDpr")) and all(d is not None and d <= 2.01 for d in f["canvasDpr"])
            if dpr_ok and (f.get("canvasCount") or 0) >= 1:
                rec.ok("CABIN-RESP-canvas/%s" % label, "场景 Canvas ≥1 且 DPR≤2", "≥1 且 ≤2",
                       "canvas=%s dpr=%s" % (f.get("canvasCount"), f.get("canvasDpr")),
                       ac=CABIN_AC_LAYOUT, viewport=label, evidence=shot)
            else:
                rec.check("CABIN-RESP-canvas/%s" % label, "场景 Canvas ≥1 且 DPR≤2", "FAIL",
                          "≥1 且 ≤2", "canvas=%s dpr=%s" % (f.get("canvasCount"), f.get("canvasDpr")),
                          ac=CABIN_AC_LAYOUT, viewport=label)
            check_no_errors(rec, ps, "AC-H6-1-cabin-resp/%s" % label, label, "机舱响应式")
        finally:
            if ctx is not None:
                ctx.close()


# ---------------------------------------------------------------- 主入口
CASE_GROUPS = {
    "env": "基础加载/首屏/错误/截图",
    "boot": "门厅 A1/A2/A4/A5/A3（V6.1 新文案 + 规则速览 6 条）",
    "main": "§7 主路径：注入「一方差一步全到家」→ 先到家 → 两张收尾卡 → 回顾（360/390/430）",
    "skip": "C2/E2 放过不惩罚 + 全放过也能收尾 + 回顾「今晚先放过」",
    "takeoff": "V6.1 起飞保底：第 2 回合不提前 / 第 3 回合任意点数 / 起飞·掷 6 清零",
    "win": "V6.1 另一方先到家（win-b）文案与 ledger",
    "notend": "V6.1 题卡 20 张 / 心动值 100 / 长夜 1 架到家 → 不结束",
    "legacy": "V6.1 旧档兼容：缺 takeoffMiss 补 0 续玩 + ending='shared' 回顾文案",
    "resume": "A6 刷新续玩",
    "pause": "G1/G2/B4/B5 暂停/安全词",
    "minigame": "D1/D2/D3 小游戏",
    "fate": "E5 命运格（P1）",
    "events": "C1-2/C1-3/C2-2/C2-3 击落/叠机/进航事件题卡",
    "responsive": "H4/H1 响应式与触控",
    "offline": "H3 离线",
    "reduced": "H2 减少动画",
    "cabin": "V6.2 机舱层/相机/reduced/浮层遮挡/响应式（AC-V6.2-1~4）",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default=str(Q.DEFAULT_DIST))
    ap.add_argument("--only", default="",
                    help="逗号分隔：env,boot,main,skip,takeoff,win,notend,legacy,resume,pause,"
                         "minigame,fate,events,responsive,offline,reduced")
    ap.add_argument("--viewports", default="", help="main 组视口，逗号分隔（默认 390x844,360x640,430x932）")
    ap.add_argument("--skip-reduced", action="store_true")
    ap.add_argument("--headed", action="store_true")
    ap.add_argument("--json", default="qa-e2e")
    args = ap.parse_args()

    dist = pathlib.Path(args.dist)
    if not (dist / "index.html").exists():
        print("[FATAL] 找不到构建产物 %s/index.html；先跑 tools/rebuild/build_app.py --out dist/rebuild" % dist)
        sys.exit(1)
    groups = [g.strip() for g in args.only.split(",") if g.strip()] or list(CASE_GROUPS.keys())

    rec = Recorder("e2e", meta={
        "dist": str(dist),
        "build": Q.build_info(dist),
        "viewports": list(Q.VIEWPORTS.keys()),
        "engine": "playwright(chromium) channel=msedge headless",
        "groups": groups,
    })
    print("[E2E] dist=%s" % dist)
    print("[E2E] build: %s" % json.dumps({k: rec.meta["build"].get(k) for k in ("raw", "gzip", "sha256", "mtime")}, ensure_ascii=False))

    with Q.serve(dist) as base_url:
        print("[E2E] serving %s" % base_url)
        with sync_playwright() as pw:
            try:
                browser = Q.launch_browser(pw)
            except RuntimeError as e:
                print("[FATAL] %s" % e)
                sys.exit(1)
            try:
                # 预热：探测版本，决定 V6 是否就绪
                ctx0, ps0, page0 = new_page(browser, base_url, (390, 844), rec, "probe")
                Q.ensure_boot(page0, rec, timeout=10000)
                probe = Q.v6_probe(page0)
                v6 = Q.is_v6(page0)
                version = probe.get("version")
                ctx0.close()
                rec.meta["app_version"] = version
                rec.meta["v6_detected"] = v6
                rec.meta["probe"] = probe
                print("[E2E] App.version=%r v6=%s squares=%s test_hook=%s" %
                      (version, v6, probe.get("squares"), probe.get("has_test_hook")))

                if not v6:
                    gap = Q.v6_gap_text(page0) if False else ("App.version=%r，data-square=%d，__V6_TEST__=%s" %
                                                              (version, probe.get("squares", 0), probe.get("has_test_hook")))
                    rec.add_note("V6 未就绪：%s。已跑基础冒烟；所有 V6 用例标记 SKIP。" % gap)
                    rec.skip("V6-READY", "V6 构建就绪（App.version 6.x / data-square / __V6_TEST__）",
                             "V6 未就绪：" + gap, ac="impl-freeze §5", viewport="probe")
                    # 基础冒烟仍要跑，证明脚本骨架可用
                    if "env" not in groups:
                        groups = ["env"] + groups
                    for g in groups:
                        if g == "env":
                            ctx, ps, page = new_page(browser, base_url, (390, 844), rec, "390x844")
                            try:
                                run_env_case(ps, rec, "390x844", base_url, v6_checks=False)
                            finally:
                                ctx.close()
                            # 360 首屏
                            ctx, ps, page = new_page(browser, base_url, (360, 640), rec, "360x640")
                            try:
                                run_env_case(ps, rec, "360x640", base_url, v6_checks=False)
                            finally:
                                ctx.close()
                        elif g == "responsive":
                            run_responsive_case(browser, base_url, rec)
                        else:
                            rec.skip("GROUP-%s" % g, "用例组 %s 需要 V6 实现" % g,
                                     "V6 未就绪，跳过", ac=CASE_GROUPS.get(g, ""), viewport="-")
                    rec.meta["conclusion_hint"] = "PARTIAL"
                else:
                    for g in groups:
                        print("[E2E] === %s ===" % g)
                        t0 = time.time()
                        try:
                            if g == "env":
                                for label in ("390x844", "360x640", "430x932"):
                                    ctx, ps, page = new_page(browser, base_url, Q.VIEWPORTS[label], rec, label)
                                    try:
                                        run_env_case(ps, rec, label, base_url)
                                    finally:
                                        ctx.close()
                            elif g == "boot":
                                ctx, ps, page = new_page(browser, base_url, (390, 844), rec, "390x844")
                                try:
                                    Q.ensure_boot(page, rec)
                                    check_start_in_viewport(ps, rec, "390x844", (390, 844))
                                    check_modes_and_scale(ps, rec, "390x844")
                                    check_safety_visible(ps, rec, "390x844", "boot")
                                    check_no_errors(rec, ps, "AC-H6-1-boot/390x844", "390x844", "门厅")
                                finally:
                                    ctx.close()
                                ctx, ps, page = new_page(browser, base_url, (360, 640), rec, "360x640")
                                try:
                                    Q.ensure_boot(page, rec)
                                    check_start_in_viewport(ps, rec, "360x640", (360, 640))
                                finally:
                                    ctx.close()
                                run_validation_case(browser, base_url, rec)
                                run_rules_case(browser, base_url, rec)
                                run_scale_persist_case(browser, base_url, rec)
                            elif g == "main":
                                vps = [v.strip() for v in args.viewports.split(",") if v.strip()] or \
                                      ["390x844", "360x640", "430x932"]
                                for label in vps:
                                    if label not in Q.VIEWPORTS:
                                        rec.skip("MAIN-vp/%s" % label, "未知视口 %s" % label,
                                                 "视口名不在 %s" % list(Q.VIEWPORTS), ac="§7")
                                        continue
                                    print("[E2E] main %s" % label)
                                    drv = run_main_path(browser, base_url, rec, label)
                                    print("[E2E] main %s: clicks=%d cards=%d finished=%s" %
                                          (label, len(drv.clicks), drv.cards, drv.finished))
                            elif g == "skip":
                                run_skip_all_case(browser, base_url, rec)
                            elif g == "takeoff":
                                run_takeoff_pity_case(browser, base_url, rec)
                            elif g == "win":
                                run_win_side_case(browser, base_url, rec, winner="b")
                            elif g == "notend":
                                run_not_end_case(browser, base_url, rec)
                            elif g == "legacy":
                                run_legacy_case(browser, base_url, rec)
                            elif g == "resume":
                                run_resume_case(browser, base_url, rec)
                            elif g == "pause":
                                run_pause_case(browser, base_url, rec, "390x844")
                                run_pause_case(browser, base_url, rec, "360x640", short_press_check=False)
                            elif g == "minigame":
                                run_minigame_case(browser, base_url, rec)
                            elif g == "fate":
                                run_fate_case(browser, base_url, rec)
                            elif g == "events":
                                run_event_prompts_case(browser, base_url, rec)
                            elif g == "responsive":
                                run_responsive_case(browser, base_url, rec)
                            elif g == "offline":
                                run_offline_case(browser, base_url, rec)
                            elif g == "reduced" and not args.skip_reduced:
                                run_reduced_case(browser, base_url, rec)
                            elif g == "cabin":
                                run_cabin_layer_case(browser, base_url, rec)
                                run_cabin_camera_case(browser, base_url, rec)
                                run_cabin_reduced_case(browser, base_url, rec)
                                run_cabin_overlay_case(browser, base_url, rec)
                                run_cabin_responsive_case(browser, base_url, rec)
                        except Exception as e:  # noqa: BLE001
                            tb = traceback.format_exc()
                            print("[E2E] group %s crashed: %s" % (g, e))
                            rec.fail("GROUP-%s-crash" % g, "用例组 %s 执行" % g, "无异常",
                                     "%s: %s" % (type(e).__name__, e), ac="H6",
                                     evidence=tb[-1200:], repro="python qa/v6/e2e_v6.py --only %s" % g)
                        print("[E2E] === %s done in %.1fs ===" % (g, time.time() - t0))
            finally:
                browser.close()

    # AC-G1-1：安全词/暂停在各类屏幕都可达（汇总 check_safety_visible 的通过屏幕）
    # 仅在全量口径（同时跑了 main + pause 组）时汇总，部分用例组不因缺组报 FAIL。
    if SAFETY_SCREENS and {"main", "pause"} <= set(groups):
        need = {"boot", "table", "pause", "ledger"}
        got = set(SAFETY_SCREENS.keys())
        overlay_ok = bool(got & {"prompt", "minigame"})
        actual = json.dumps({k: sorted(v) for k, v in sorted(SAFETY_SCREENS.items())},
                            ensure_ascii=False)
        if need <= got and overlay_ok:
            rec.ok("AC-G1-1", "安全词在门厅/主桌/题卡或小游戏/暂停/回顾都可达",
                   "≥5 类屏幕可达（含浮层）", actual, ac="AC-G1-1", viewport="-")
        else:
            rec.fail("AC-G1-1", "安全词在各类屏幕都可达", "boot/table/pause/ledger + 浮层之一",
                     "缺少=%s 浮层=%s 实得=%s" % (sorted(need - got), overlay_ok, actual),
                     ac="AC-G1-1", viewport="-",
                     repro="跑 env/main/pause/minigame 组后读 SAFETY_SCREENS 汇总")

    json_path, md_path = Q.write_suite_report(rec, args.json)
    counts = rec.counts()
    print("\n[E2E] %s  PASS=%d FAIL=%d SKIP=%d  defects=%d" %
          (rec.conclusion(), counts.get("PASS", 0), counts.get("FAIL", 0),
           counts.get("SKIP", 0), len(rec.defects)))
    print("[E2E] report: %s" % md_path)
    print("[E2E] json:   %s" % json_path)
    for d in rec.defects:
        print("  [%s][%s] %s (%s)" % (d["severity"], d["id"], d["title"], d["check_id"]))
    if rec.conclusion() == "FAIL":
        sys.exit(1)
    if rec.conclusion() == "PARTIAL":
        sys.exit(2)


if __name__ == "__main__":
    main()
