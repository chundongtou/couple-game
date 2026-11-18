#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""今晚飞行棋 V6 · 性能预算（对照 docs/v6/architecture.md §4.1 · PB-1~PB-13）。

V6.2（2026-11-18）新增机舱运行时采样（冻结单 §5）：
- 主桌空闲帧率 / 长帧（>25ms）≤5%；连续 20 次走子长帧；4×CPU 参考值；
- reduced 下粒子/相机停止（.cb-dust 两帧一致 + board transform 为空）；
- 页面隐藏暂停（data-cabin-paused=1、scene rAF 停、帧数不增）与恢复后继续。

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
V7_AC_PERF = "AC-V7-9"


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


# ---------------------------------------------------------------- V6.2 机舱运行时性能
# 口径：docs/v6/impl-freeze-cabin.md §5
#   - 主桌空闲帧率 / 长帧（>25ms）≤5%；20 次连续走子同样看长帧；
#   - reduced 下粒子/相机停止（静态 canvas + 无 transform）；
#   - 页面隐藏暂停（data-cabin-paused=1、scene rAF 停、帧数不再增长），恢复后继续。
CABIN_FRAME_JS = """() => {
  var P = window.__qaPerf = window.__qaPerf || {};
  P.frames = 0; P.long = 0; P.dts = []; P.t0 = 0; P.active = false;
  P.start = function () {
    P.frames = 0; P.long = 0; P.dts = []; P.t0 = performance.now(); P.active = true;
    var last = performance.now();
    function tick(ts) {
      if (!P.active) return;
      var dt = ts - last; last = ts;
      P.frames += 1;
      if (P.dts.length < 6000) P.dts.push(dt);
      if (dt > 25) P.long += 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  P.stop = function () {
    P.active = false;
    var el = performance.now() - P.t0;
    var arr = P.dts.slice().sort(function (a, b) { return a - b; });
    return {
      frames: P.frames, long: P.long, elapsed: el,
      fps: P.frames / Math.max(1, el) * 1000,
      longRatio: P.frames ? (P.long / P.frames) : 0,
      p95: arr.length ? arr[Math.min(arr.length - 1, Math.floor(arr.length * 0.95))] : null,
      max: arr.length ? arr[arr.length - 1] : null
    };
  };
  return true;
}"""

CABIN_REDUCED_JS = """() => {
  try { App.Store.saveSettings({reduced: true}); return true; } catch (e) { return false; }
}"""

CABIN_HIDE_JS = """() => {
  try {
    var flag = {v: true};
    window.__qaHidden = flag;
    Object.defineProperty(document, 'hidden', {configurable: true, get: function () { return flag.v; }});
    Object.defineProperty(document, 'visibilityState', {configurable: true, get: function () { return flag.v ? 'hidden' : 'visible'; }});
    document.dispatchEvent(new Event('visibilitychange'));
    return {ok: true, hidden: !!document.hidden};
  } catch (e) { return {ok: false, error: String(e)}; }
}"""

CABIN_SHOW_JS = """() => {
  try {
    if (!window.__qaHidden) return {ok: false};
    window.__qaHidden.v = false;
    document.dispatchEvent(new Event('visibilitychange'));
    return {ok: true, hidden: !!document.hidden};
  } catch (e) { return {ok: false, error: String(e)}; }
}"""

# ---------------------------------------------------------------- V7 电影镜头运行时
# 口径：docs/v7/impl-freeze.md §5/§6（20 回合长帧 >25ms ≤5%；页面隐藏暂停；reduced 静态）。
V7_FRAME_JS = """() => {
  var P = window.__qaPerf = window.__qaPerf || {};
  P.frames = 0; P.long = 0; P.dts = []; P.t0 = 0; P.active = false;
  P.states = {}; P.stateSeq = []; P.povFrames = 0; P.transformFrames = 0;
  P.start = function () {
    P.frames = 0; P.long = 0; P.dts = []; P.t0 = performance.now(); P.active = true;
    P.states = {}; P.stateSeq = []; P.povFrames = 0; P.transformFrames = 0;
    var last = performance.now();
    function tick(ts) {
      if (!P.active) return;
      var dt = ts - last; last = ts;
      P.frames += 1;
      if (P.dts.length < 8000) P.dts.push(dt);
      if (dt > 25) P.long += 1;
      var host = document.querySelector('.v6-table');
      var s = host ? host.getAttribute('data-cinema-state') : null;
      if (s) {
        P.states[s] = (P.states[s] || 0) + 1;
        if (!P.stateSeq.length || P.stateSeq[P.stateSeq.length - 1] !== s) {
          if (P.stateSeq.length < 400) P.stateSeq.push(s);
        }
        if (s === 'pov') P.povFrames += 1;
      }
      var b = document.querySelector('.v6-board');
      if (b && b.style.transform) P.transformFrames += 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  P.stop = function () {
    P.active = false;
    var el = performance.now() - P.t0;
    var arr = P.dts.slice().sort(function (a, b) { return a - b; });
    return {
      frames: P.frames, long: P.long, elapsed: el,
      fps: P.frames / Math.max(1, el) * 1000,
      longRatio: P.frames ? (P.long / P.frames) : 0,
      p95: arr.length ? arr[Math.min(arr.length - 1, Math.floor(arr.length * 0.95))] : null,
      max: arr.length ? arr[arr.length - 1] : null,
      states: P.states, stateSeq: P.stateSeq.slice(),
      povFrames: P.povFrames, transformFrames: P.transformFrames
    };
  };
  return true;
}"""

V7_REDUCED_SEED_JS = """() => {
  try { App.Store.saveSettings({reduced: true}); return true; } catch (e) { return false; }
}"""

V7_HIDE_JS = CABIN_HIDE_JS
V7_SHOW_JS = CABIN_SHOW_JS


def _perf_start_table(browser, url, mode="quick", throttle=None):
    """打开主桌（quick/long），可选 CPU 降频；返回 (ctx, ps, page)。"""
    ctx = Q.new_context(browser, viewport=VIEWPORT, dsf=2, service_workers="block")
    page = ctx.new_page()
    ps = Q.PageSession(ctx, page)
    if throttle:
        cdp = ctx.new_cdp_session(page)
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": throttle})
    page.goto(url, wait_until="domcontentloaded", timeout=30000)
    Q.ensure_boot(page, None, timeout=15000)
    Q.try_click(page, Q.LONG_MODE if mode == "long" else Q.QUICK_MODE, timeout=1500)
    Q.fill_names(page, ("阿岚", "阿策"))
    Q.select_distinct_colors(page)
    Q.click(page, Q.BOOT_START, timeout=8000, desc="摆上棋盘")
    Q.wait_table(page, timeout=9000)
    page.wait_for_timeout(900)
    return ctx, ps, page


def _perf_drive_moves(page, target, budget_s=120):
    """连续走子驱动：只点 UI（骰子/选子/放过），用引擎事件计走子次数。"""
    if not Q.install_event_recorder(page):
        return 0
    Q.recorded_events(page, clear=True)
    guard = 0
    deadline = time.time() + budget_s
    while time.time() < deadline:
        guard += 1
        if guard > 400:
            break
        events = Q.recorded_events(page)
        moves = len([e for e in events if e.get("type") in ("move", "takeoff", "jump", "fly")])
        if moves >= target:
            return moves
        sess = Q.get_session(page) or {}
        if sess.get("phase") in ("ended", "safe-ended"):
            return moves
        aw = sess.get("awaiting") or {}
        typ = aw.get("type")
        if typ in ("prompt", "ending-prompt"):
            Q.try_click(page, ["test:prompt-skip", "role:button:/^放过$/", "text:/^放过$/"], timeout=1200)
            page.wait_for_timeout(180)
            continue
        if typ == "minigame":
            Q.try_click(page, ["test:minigame-skip", "role:button:/这次先跳过/"], timeout=1200)
            page.wait_for_timeout(180)
            continue
        if typ == "choose-piece":
            pids = aw.get("pieceIds") or []
            clicked = False
            btns, _ = Q.find_piece_buttons(page)
            for b in btns:
                try:
                    dp = b.get_attribute("data-action-piece") or b.get_attribute("data-piece")
                except Exception:
                    dp = None
                if dp and (not pids or dp in pids):
                    try:
                        b.click(timeout=3000)
                        clicked = True
                        break
                    except Exception:
                        pass
            if not clicked and btns:
                try:
                    btns[0].click(timeout=3000)
                except Exception:
                    pass
            page.wait_for_timeout(160)
            continue
        if typ in ("roll", None):
            plan = Q.plan_die(page, target_kinds=["ring", "home", "goal", "hangar", "stop"])
            die = plan.get("die") if isinstance(plan, dict) else None
            Q.set_die(page, die if die else 3)
            Q.try_click(page, ["test:roll", "role:button:/^掷骰$/", "text:/^掷骰$/"], timeout=2500)
            page.wait_for_timeout(220)
            continue
        page.wait_for_timeout(160)
    events = Q.recorded_events(page)
    return len([e for e in events if e.get("type") in ("move", "takeoff", "jump", "fly")])


def _cabin_debug(page):
    data = Q.eval_js(page, "() => (window.App && App.CabinScene && App.CabinScene._debug) ? App.CabinScene._debug() : null")
    return data if isinstance(data, dict) else {}


def _dust_data_url(page):
    return Q.eval_js(page, """() => {
        var c = document.querySelector('.cabin-root .cb-dust');
        try { return c ? c.toDataURL() : null; } catch (e) { return null; }
    }""")


def measure_cabin_runtime(browser, url):
    """V6.2 主桌运行时性能：空闲帧率 / 20 次走子 / reduced 静态 / 页面隐藏暂停。"""
    out = {"idle": None, "moves": None, "reduced": None, "hidden": None, "throttle_ref": None}

    # ---- 空闲帧率（无 CPU 降频，主桌稳定后 3s）----
    ctx, ps, page = _perf_start_table(browser, url, mode="quick")
    try:
        page.evaluate(CABIN_FRAME_JS)
        page.wait_for_timeout(600)
        page.evaluate("() => { window.__qaPerf.start(); return true; }")
        page.wait_for_timeout(3000)
        out["idle"] = page.evaluate("() => window.__qaPerf.stop()")
        out["idle"]["canvas"] = _dust_data_url(page)
        out["idle"]["errors"] = {"pageerrors": ps.pageerrors[:3], "console_errors": ps.console_errors[:3]}
    finally:
        ctx.close()

    # ---- 20 次连续走子（长夜，避免 20 步内结束；帧采样跨多次开局累加）----
    moves_done = 0
    frames = 0
    long_frames = 0
    elapsed = 0.0
    games = 0
    move_meta = []
    while moves_done < 20 and games < 3:
        games += 1
        ctx, ps, page = _perf_start_table(browser, url, mode="long")
        try:
            page.evaluate(CABIN_FRAME_JS)
            page.wait_for_timeout(300)
            page.evaluate("() => { window.__qaPerf.start(); return true; }")
            got = _perf_drive_moves(page, 20 - moves_done, budget_s=110)
            st = page.evaluate("() => window.__qaPerf.stop()")
            moves_done += got
            frames += st.get("frames") or 0
            long_frames += st.get("long") or 0
            elapsed += st.get("elapsed") or 0
            move_meta.append({"game": games, "moves": got, "fps": round(st.get("fps") or 0, 1),
                              "longRatio": round(st.get("longRatio") or 0, 4),
                              "errors": {"pageerrors": ps.pageerrors[:2], "console_errors": ps.console_errors[:2]}})
        finally:
            ctx.close()
    out["moves"] = {"moves": moves_done, "frames": frames, "long": long_frames,
                    "elapsed_ms": round(elapsed, 1),
                    "fps": frames / max(0.001, elapsed / 1000.0),
                    "longRatio": (long_frames / frames) if frames else None,
                    "games": move_meta}

    # ---- reduced：粒子/相机停止（静态 canvas + 无 transform）----
    ctx, ps, page = _perf_start_table(browser, url, mode="quick")
    try:
        Q.eval_js(page, CABIN_REDUCED_JS)
        page.wait_for_timeout(600)
        dbg0 = _cabin_debug(page)
        page.evaluate(CABIN_FRAME_JS)
        page.evaluate("() => { window.__qaPerf.start(); return true; }")
        page.wait_for_timeout(800)
        shot0 = _dust_data_url(page)
        page.wait_for_timeout(800)
        shot1 = _dust_data_url(page)
        st = page.evaluate("() => window.__qaPerf.stop()")
        dbg1 = _cabin_debug(page)
        out["reduced"] = {
            "reduced": dbg1.get("reduced"), "transform": dbg1.get("camTransform"),
            "canvasStatic": bool(shot0 and shot1 and shot0 == shot1),
            "sceneFramesDelta": (dbg1.get("sceneFrames") or 0) - (dbg0.get("sceneFrames") or 0),
            "rafFrames": st.get("frames"), "fps": round(st.get("fps") or 0, 1),
            "errors": {"pageerrors": ps.pageerrors[:2], "console_errors": ps.console_errors[:2]},
        }
    finally:
        ctx.close()

    # ---- 页面隐藏暂停 / 恢复 ----
    ctx, ps, page = _perf_start_table(browser, url, mode="quick")
    try:
        page.wait_for_timeout(500)
        dbg_a = _cabin_debug(page)
        hide = Q.eval_js(page, CABIN_HIDE_JS) or {}
        page.wait_for_timeout(500)
        paused_attr = Q.eval_js(page, "() => { var r=document.querySelector('.cabin-root'); return r ? r.getAttribute('data-cabin-paused') : null; }")
        dbg_b = _cabin_debug(page)
        pause_shot0 = _dust_data_url(page)
        page.wait_for_timeout(800)
        pause_shot1 = _dust_data_url(page)
        dbg_c = _cabin_debug(page)
        show = Q.eval_js(page, CABIN_SHOW_JS) or {}
        page.wait_for_timeout(900)
        dbg_d = _cabin_debug(page)
        out["hidden"] = {
            "hide": hide, "show": show, "pausedAttr": paused_attr,
            "hidden": dbg_b.get("hidden"),
            "sceneFramesBefore": dbg_a.get("sceneFrames"),
            "sceneFramesAtHide": dbg_b.get("sceneFrames"),
            "sceneFramesAfterWait": dbg_c.get("sceneFrames"),
            "sceneFramesAfterShow": dbg_d.get("sceneFrames"),
            "sceneRafAtHide": dbg_b.get("sceneRaf"),
            "sceneRafAfterShow": dbg_d.get("sceneRaf"),
            "camTransformAtHide": dbg_b.get("camTransform"),
            "canvasStaticWhileHidden": bool(pause_shot0 and pause_shot1 and pause_shot0 == pause_shot1),
            "errors": {"pageerrors": ps.pageerrors[:2], "console_errors": ps.console_errors[:2]},
        }
    finally:
        ctx.close()

    # ---- 参考：4× CPU 降频下的空闲帧率（仅报告，不作为硬门槛）----
    try:
        ctx, ps, page = _perf_start_table(browser, url, mode="quick", throttle=4)
        try:
            page.evaluate(CABIN_FRAME_JS)
            page.wait_for_timeout(600)
            page.evaluate("() => { window.__qaPerf.start(); return true; }")
            page.wait_for_timeout(2500)
            ref = page.evaluate("() => window.__qaPerf.stop()")
            ref["throttle"] = 4
            out["throttle_ref"] = ref
        finally:
            ctx.close()
    except Exception as e:  # noqa: BLE001
        out["throttle_ref"] = {"error": str(e)}
    return out


def _v7_cinema_debug(page):
    data = Q.eval_js(page, "() => (window.App && App.Cinema && App.Cinema._debug) ? App.Cinema._debug() : null")
    return data if isinstance(data, dict) else {}


def _v7_fixture_move(page, pid="a:0", frm="ring:0", die=2, turn="a"):
    """与 E2E 同口径：夹具到 choose-piece（单子可走），之后由调用方点选子按钮。"""
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
                });
                App.Store.saveSession(s);
                App.Router.reset('table');
                return true;
            } catch (e) { if (window.console) console.error('QA_FIXTURE', e); return false; }
        }""",
        {"pid": pid, "from": frm, "die": die, "turn": turn},
    )


def _v7_click_piece(page):
    btns, _ = Q.find_piece_buttons(page)
    if not btns:
        return False
    try:
        btns[0].click(timeout=4000)
        return True
    except Exception:
        return False


def _v7_state_seq(page, ms):
    """页内轮询 data-cinema-state（不受 Python 往返影响），返回去重状态序列。"""
    data = Q.eval_js(
        page,
        """async (ms) => {
            var host = document.querySelector('.v6-table');
            if (!host) return [];
            var out = [], t0 = performance.now(), last = null;
            while (performance.now() - t0 < ms) {
                var s = host.getAttribute('data-cinema-state');
                if (s && s !== last) { out.push(s); last = s; }
                await new Promise(function (r) { setTimeout(r, 50); });
            }
            return out;
        }""",
        ms,
    )
    return data if isinstance(data, list) else []


def measure_v7_runtime(browser, url):
    """V7 主桌运行时：20 回合镜头链长帧 / 页面隐藏暂停 / reduced 静态。"""
    out = {"moves": None, "hidden": None, "reduced": None}

    # ---- 20 次连续走子（长夜；镜头链全程跑，取 rAF 帧间隔与状态序列）----
    moves_done = 0
    frames = 0
    long_frames = 0
    elapsed = 0.0
    games = []
    state_seqs = []
    while moves_done < 20 and len(games) < 2:
        ctx, ps, page = _perf_start_table(browser, url, mode="long")
        try:
            page.evaluate(V7_FRAME_JS)
            page.wait_for_timeout(300)
            page.evaluate("() => { window.__qaPerf.start(); return true; }")
            got = _perf_drive_moves(page, 20 - moves_done, budget_s=115)
            st = page.evaluate("() => window.__qaPerf.stop()") or {}
            moves_done += got
            frames += st.get("frames") or 0
            long_frames += st.get("long") or 0
            elapsed += st.get("elapsed") or 0
            seq = st.get("stateSeq") or []
            state_seqs.append(seq)
            games.append({
                "game": len(games) + 1, "moves": got,
                "fps": round(st.get("fps") or 0, 1),
                "longRatio": round(st.get("longRatio") or 0, 4),
                "states": st.get("states") or {},
                "stateSeq": seq[:120],
                "povFrames": st.get("povFrames"),
                "transformFrames": st.get("transformFrames"),
                "errors": {"pageerrors": ps.pageerrors[:2], "console_errors": ps.console_errors[:2]},
            })
        finally:
            ctx.close()
    merged = {}
    for g in games:
        for k, v in (g.get("states") or {}).items():
            merged[k] = merged.get(k, 0) + v
    flat_seq = []
    for seq in state_seqs:
        for s in seq:
            if not flat_seq or flat_seq[-1] != s:
                flat_seq.append(s)
    out["moves"] = {
        "moves": moves_done, "frames": frames, "long": long_frames,
        "elapsed_ms": round(elapsed, 1),
        "fps": frames / max(0.001, elapsed / 1000.0),
        "longRatio": (long_frames / frames) if frames else None,
        "states": merged, "stateSeq": flat_seq[:160], "games": games,
    }

    # ---- 页面隐藏暂停 / 恢复（镜头链进行中）----
    ctx, ps, page = _perf_start_table(browser, url, mode="quick")
    try:
        Q.install_die_hook(page)
        _v7_fixture_move(page, "a:0", "ring:0", 2, "a")
        Q.wait_screen(page, ["table"], timeout=6000)
        page.wait_for_timeout(400)
        _v7_click_piece(page)
        # 等到 pov（镜头链进行中）
        deadline = time.time() + 4
        st0 = None
        while time.time() < deadline:
            st0 = Q.eval_js(page, "() => { var h=document.querySelector('.v6-table'); return h?h.getAttribute('data-cinema-state'):null; }")
            if st0 in ("pov", "chase", "land", "cell45"):
                break
            page.wait_for_timeout(60)
        hide = Q.eval_js(page, V7_HIDE_JS) or {}
        page.wait_for_timeout(120)
        d1 = _v7_cinema_debug(page)
        s1 = Q.eval_js(page, "() => { var h=document.querySelector('.v6-table'); return h?h.getAttribute('data-cinema-state'):null; }")
        paused_attr = Q.eval_js(page, "() => { var r=document.querySelector('[data-test=cabin-scene]'); return r ? r.getAttribute('data-cabin-paused') : null; }")
        cinema_paused = Q.eval_js(page, "() => { var h=document.querySelector('.v6-table'); return h ? h.getAttribute('data-cinema-paused') : null; }")
        b1 = Q.eval_js(page, "() => { var b=document.querySelector('.v6-board'); return b ? (b.style.transform||'') : null; }")
        chain1 = list((d1.get("chain") or []))
        page.wait_for_timeout(520)
        b_mid = Q.eval_js(page, "() => { var b=document.querySelector('.v6-board'); return b ? (b.style.transform||'') : null; }")
        page.wait_for_timeout(520)
        d2 = _v7_cinema_debug(page)
        s2 = Q.eval_js(page, "() => { var h=document.querySelector('.v6-table'); return h?h.getAttribute('data-cinema-state'):null; }")
        b2 = Q.eval_js(page, "() => { var b=document.querySelector('.v6-board'); return b ? (b.style.transform||'') : null; }")
        chain2 = list((d2.get("chain") or []))
        show = Q.eval_js(page, V7_SHOW_JS) or {}
        # 恢复：等镜头链收束（pending=false）→ 清掉题卡 → 再掷一次确认可继续
        t_resume = time.time()
        dbg_res = {}
        pending_false_ms = None
        while time.time() - t_resume < 6:
            dbg_res = _v7_cinema_debug(page)
            if dbg_res.get("pending") is False:
                pending_false_ms = int((time.time() - t_resume) * 1000)
                break
            page.wait_for_timeout(80)
        Q.try_click(page, ["test:prompt-skip", "test:prompt-done"], timeout=2000)
        page.wait_for_timeout(500)
        # 等到下一次可掷骰：若仍有题卡/小游戏弹层，按用户方式收掉（最多 8s）
        deadline = time.time() + 8
        while time.time() < deadline:
            aw = Q.eval_js(page, "() => { try { var a=(App.Store.getSession()||{}).awaiting||{}; return a.type || null; } catch(e){ return null; } }")
            if aw in (None, "roll"):
                break
            if aw in ("prompt", "ending-prompt"):
                Q.try_click(page, ["test:prompt-skip", "test:prompt-done"], timeout=1500)
            elif aw == "minigame":
                Q.try_click(page, ["test:minigame-skip"], timeout=1200)
            page.wait_for_timeout(300)
        resumed_seq = []
        roll_ok = Q.eval_js(page, "() => { try { var aw=(App.Store.getSession()||{}).awaiting||{}; return aw.type === 'roll'; } catch(e){ return false; } }")
        if roll_ok:
            Q.set_die(page, 6)
            Q.try_click(page, ["test:roll"], timeout=3000)
            resumed_seq = _v7_state_seq(page, 2800)
        out["hidden"] = {
            "hide": hide, "show": show, "pausedAttr": paused_attr,
            "cinemaPaused": cinema_paused,
            "stateAtHide": s1, "stateAfterWait": s2,
            "pendingAtHide": d1.get("pending"), "rafAtHide": d1.get("raf"),
            "animatingAtHide": d1.get("animating"),
            "rafAfterWait": d2.get("raf"), "pendingAfterWait": d2.get("pending"),
            "boardAtHide": b1, "boardMid": b_mid, "boardAfterWait": b2,
            "boardStable": (b1 or "") == (b_mid or "") == (b2 or ""),
            "chainAtHide": chain1, "chainAfterWait": chain2,
            "chainStable": chain1 == chain2,
            "pendingFalseMs": pending_false_ms,
            "awaitingRollAfterShow": roll_ok,
            "resumedSeq": resumed_seq,
            "errors": {"pageerrors": ps.pageerrors[:2], "console_errors": ps.console_errors[:2]},
        }
    finally:
        ctx.close()

    # ---- reduced（产品设置开关）：无 POV/跟拍、无 transform、格子舞台静态 ----
    ctx, ps, page = _perf_start_table(browser, url, mode="quick")
    try:
        Q.eval_js(page, "() => { try { App.Store.saveSettings({reduced:true}); return true; } catch(e) { return false; } }")
        page.wait_for_timeout(500)
        Q.install_die_hook(page)
        _v7_fixture_move(page, "a:0", "ring:0", 2, "a")
        Q.wait_screen(page, ["table"], timeout=6000)
        page.wait_for_timeout(400)
        page.evaluate(V7_FRAME_JS)
        page.evaluate("() => { window.__qaPerf.start(); return true; }")
        _v7_click_piece(page)
        seq = _v7_state_seq(page, 4200)
        st = page.evaluate("() => window.__qaPerf.stop()") or {}
        dbg = _v7_cinema_debug(page)
        cell_reduced = Q.eval_js(page, """() => {
            var r = document.querySelector('[data-test="cell-stage"]');
            if (!r) return null;
            var s = r.querySelector('.cs-stage');
            return { reduced: r.getAttribute('data-reduced'), bear: r.getAttribute('data-bear'),
                     anim: s ? getComputedStyle(s).animationDuration : null };
        }""")
        out["reduced"] = {
            "reduced": dbg.get("reduced"), "hostReduced": Q.eval_js(
                page, "() => { var h=document.querySelector('.v6-table'); return h?h.getAttribute('data-cinema-reduced'):null; }"),
            "transform": dbg.get("boardTransform"),
            "transformFrames": st.get("transformFrames"),
            "stateSeq": seq, "states": st.get("states") or {},
            "povFrames": st.get("povFrames"),
            "cell": cell_reduced,
            "raf": dbg.get("raf"),
            "errors": {"pageerrors": ps.pageerrors[:2], "console_errors": ps.console_errors[:2]},
        }
    finally:
        ctx.close()
    return out


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
                print("[PERF] cabin runtime: idle/moves/reduced/hidden ...")
                cabin = measure_cabin_runtime(browser, gz_url)
                idle = cabin.get("idle") or {}
                mv = cabin.get("moves") or {}
                print("[PERF] cabin idle: fps=%.1f long25=%s%% frames=%s p95=%sms" % (
                    idle.get("fps") or 0, round((idle.get("longRatio") or 0) * 100, 2),
                    idle.get("frames"), idle.get("p95")))
                print("[PERF] cabin 20moves: moves=%s fps=%.1f long25=%s%%" % (
                    mv.get("moves"), mv.get("fps") or 0, round((mv.get("longRatio") or 0) * 100, 2)))
                print("[PERF] cabin reduced=%s hiddenPaused=%s" % (
                    (cabin.get("reduced") or {}).get("reduced"),
                    (cabin.get("hidden") or {}).get("pausedAttr")))
                print("[PERF] v7 cinema runtime: 20 moves / hidden / reduced ...")
                v7 = measure_v7_runtime(browser, gz_url)
                vmv = v7.get("moves") or {}
                print("[PERF] v7 20moves: moves=%s fps=%.1f long25=%s%% states=%s" % (
                    vmv.get("moves"), vmv.get("fps") or 0,
                    round((vmv.get("longRatio") or 0) * 100, 2),
                    json.dumps(vmv.get("states") or {}, ensure_ascii=False)[:200]))
                print("[PERF] v7 hidden=%s reduced=%s" % (
                    json.dumps({k: (v7.get("hidden") or {}).get(k) for k in
                                ("pausedAttr", "stateAtHide", "pendingAtHide", "rafAtHide", "boardStable")},
                               ensure_ascii=False),
                    (v7.get("reduced") or {}).get("reduced")))
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
    # ---------------- V6.2 机舱运行时（P0） ----------------
    idle = cabin.get("idle") or {}
    mv = cabin.get("moves") or {}
    red = cabin.get("reduced") or {}
    hid = cabin.get("hidden") or {}
    thref = cabin.get("throttle_ref") or {}

    idle_fps = idle.get("fps")
    idle_long = idle.get("longRatio")
    if idle_fps is None:
        rec.skip("CABIN-PERF-idle-fps", "CABIN-PERF-01 · 主桌空闲帧率（60fps 目标）",
                 "无法采样（面板/页面异常）", ac="AC-V6.2-5")
        rec.skip("CABIN-PERF-idle-long", "CABIN-PERF-02 · 主桌空闲长帧（>25ms）≤5%",
                 "无法采样（面板/页面异常）", ac="AC-V6.2-5")
    else:
        fps_ok = idle_fps >= 50
        detail = "frames=%s elapsed=%sms fps=%.1f p95=%sms max=%sms" % (
            idle.get("frames"), round(idle.get("elapsed") or 0), idle_fps,
            round(idle.get("p95") or 0, 1), round(idle.get("max") or 0, 1))
        if fps_ok:
            rec.ok("CABIN-PERF-idle-fps", "CABIN-PERF-01 · 主桌空闲帧率（60fps 目标，门槛 ≥50fps）",
                   "≥50fps", "%.1f fps（%s）" % (idle_fps, detail), ac="AC-V6.2-5",
                   evidence="reports/v6/qa-perf.json", detail=detail)
        else:
            rec.fail("CABIN-PERF-idle-fps", "CABIN-PERF-01 · 主桌空闲帧率（60fps 目标，门槛 ≥50fps）",
                     "≥50fps", "%.1f fps（%s）" % (idle_fps, detail), ac="AC-V6.2-5",
                     repro="主桌稳定后空闲 3s→rAF 采样帧间隔", evidence="reports/v6/qa-perf.json",
                     detail=detail, owner="FE-cabin")
        long_ok = (idle_long or 0) <= 0.05
        if long_ok:
            rec.ok("CABIN-PERF-idle-long", "CABIN-PERF-02 · 主桌空闲长帧（>25ms）≤5%",
                   "≤5%", "long=%s/%s（%.2f%%）p95=%sms" % (
                       idle.get("long"), idle.get("frames"), (idle_long or 0) * 100,
                       round(idle.get("p95") or 0, 1)), ac="AC-V6.2-5",
                   evidence="reports/v6/qa-perf.json")
        else:
            rec.fail("CABIN-PERF-idle-long", "CABIN-PERF-02 · 主桌空闲长帧（>25ms）≤5%",
                     "≤5%", "long=%s/%s（%.2f%%）p95=%sms" % (
                         idle.get("long"), idle.get("frames"), (idle_long or 0) * 100,
                         round(idle.get("p95") or 0, 1)), ac="AC-V6.2-5",
                     repro="主桌稳定后空闲 3s→rAF 采样帧间隔", evidence="reports/v6/qa-perf.json",
                     owner="FE-cabin")

    moves_n = mv.get("moves") or 0
    mv_long = mv.get("longRatio")
    if moves_n < 20:
        rec.check("CABIN-PERF-moves", "CABIN-PERF-03 · 20 次连续走子", "SKIP",
                  "20 次连续走子完成", "仅完成 %s 次（3 局内未凑满）" % moves_n, ac="AC-V6.2-5")
    else:
        long_ok = (mv_long or 0) <= 0.05
        detail = "moves=%s frames=%s long=%s fps=%.1f long25=%.2f%% games=%s" % (
            moves_n, mv.get("frames"), mv.get("long"), mv.get("fps") or 0,
            (mv_long or 0) * 100, json.dumps(mv.get("games") or [], ensure_ascii=False)[:400])
        if long_ok:
            rec.ok("CABIN-PERF-moves", "CABIN-PERF-03 · 20 次连续走子长帧（>25ms）≤5%",
                   "20 moves，≤5%", detail, ac="AC-V6.2-5",
                   evidence="reports/v6/qa-perf.json", detail=detail)
        else:
            rec.fail("CABIN-PERF-moves", "CABIN-PERF-03 · 20 次连续走子长帧（>25ms）≤5%",
                     "20 moves，≤5%", detail, ac="AC-V6.2-5",
                     repro="长夜开局→连续 20 次掷骰/选子（含跳过题卡）→rAF 采样",
                     evidence="reports/v6/qa-perf.json", detail=detail, owner="FE-cabin")

    red_ok = red.get("reduced") is True and not (red.get("transform") or "") and \
        red.get("canvasStatic") is True and (red.get("sceneFramesDelta") or 0) == 0
    detail = "reduced=%s transform=%r canvasStatic=%s sceneFramesDelta=%s rafFrames=%s" % (
        red.get("reduced"), red.get("transform"), red.get("canvasStatic"),
        red.get("sceneFramesDelta"), red.get("rafFrames"))
    if red_ok:
        rec.ok("CABIN-PERF-reduced", "CABIN-PERF-04 · reduced 下粒子/相机停止（canvas 静态 + 无 transform）",
               "reduced=1、transform=''、canvas 两帧一致", detail, ac="AC-V6.2-5",
               evidence="reports/v6/qa-perf.json", detail=detail)
    else:
        rec.fail("CABIN-PERF-reduced", "CABIN-PERF-04 · reduced 下粒子/相机停止（canvas 静态 + 无 transform）",
                 "reduced=1、transform=''、canvas 两帧一致", detail, ac="AC-V6.2-5",
                 repro="设置开减少动画→主桌→间隔 800ms 取两次 .cb-dust toDataURL 比对",
                 evidence="reports/v6/qa-perf.json", detail=detail, owner="FE-cabin")

    hidden_paused = hid.get("pausedAttr") == "1" and hid.get("hidden") is True
    frames_frozen = hid.get("sceneFramesAtHide") == hid.get("sceneFramesAfterWait")
    resumed = (hid.get("pausedAttr") == "1" and
               (hid.get("sceneFramesAfterShow") or 0) > (hid.get("sceneFramesAtHide") or 0) and
               hid.get("sceneRafAfterShow") is True)
    hid_ok = hidden_paused and frames_frozen and resumed and hid.get("canvasStaticWhileHidden") is True
    detail = "pausedAttr=%s hidden=%s frames=%s→%s→%s rafAtHide=%s rafAfterShow=%s canvasStatic=%s" % (
        hid.get("pausedAttr"), hid.get("hidden"), hid.get("sceneFramesAtHide"),
        hid.get("sceneFramesAfterWait"), hid.get("sceneFramesAfterShow"),
        hid.get("sceneRafAtHide"), hid.get("sceneRafAfterShow"), hid.get("canvasStaticWhileHidden"))
    if hid_ok:
        rec.ok("CABIN-PERF-hidden", "CABIN-PERF-05 · 页面隐藏暂停 / 恢复后继续（H2/冻结单 §4.1）",
               "data-cabin-paused=1、scene rAF 停、帧数不增；恢复后帧数增长", detail,
               ac="AC-V6.2-6", evidence="reports/v6/qa-perf.json", detail=detail)
    else:
        rec.fail("CABIN-PERF-hidden", "CABIN-PERF-05 · 页面隐藏暂停 / 恢复后继续（H2/冻结单 §4.1）",
                 "data-cabin-paused=1、scene rAF 停、帧数不增；恢复后帧数增长", detail,
                 ac="AC-V6.2-6", repro="主桌→模拟 visibilitychange(hidden)→读 _debug().sceneFrames/属性→恢复",
                 evidence="reports/v6/qa-perf.json", detail=detail, owner="FE-cabin")

    if thref.get("fps") is not None:
        rec.check("CABIN-PERF-throttle-ref", "CABIN-PERF-06 · 4×CPU 空闲帧率（参考，不设门槛）", "PASS",
                  "参考值", "fps=%.1f long25=%.2f%% frames=%s" % (
                      thref.get("fps") or 0, (thref.get("longRatio") or 0) * 100,
                      thref.get("frames")),
                  ac="AC-V6.2-5", severity="P2",
                  detail="仅参考：本机 4×CPU 降频下主桌空闲采样，不参与发布门槛")

    # ---------------- V7 电影镜头运行时（P0，AC-V7-9） ----------------
    vmv = v7.get("moves") or {}
    vhid = v7.get("hidden") or {}
    vred = v7.get("reduced") or {}
    vstates = vmv.get("states") or {}
    vseq = vmv.get("stateSeq") or []
    v_moves = vmv.get("moves") or 0
    v_long = vmv.get("longRatio")
    v_motion = all(k in vstates for k in ("pov", "chase", "land")) or \
        all(k in vseq for k in ("pov", "chase", "land"))
    v_detail = "moves=%s frames=%s long=%s fps=%.1f long25=%.2f%% states=%s" % (
        v_moves, vmv.get("frames"), vmv.get("long"), vmv.get("fps") or 0,
        (v_long or 0) * 100, json.dumps(vstates, ensure_ascii=False)[:240])
    if v_moves < 20:
        rec.check("V7-PERF-01", "V7-PERF-01 · 20 回合连续走子（镜头链全开）", "SKIP",
                  "20 次完成且长帧≤5%", "仅完成 %s 次（2 局内未凑满）" % v_moves,
                  ac=V7_AC_PERF, detail=v_detail)
    else:
        v_ok = (v_long or 0) <= 0.05 and v_motion
        if v_ok:
            rec.ok("V7-PERF-01", "V7-PERF-01 · 20 回合连续走子长帧（>25ms）≤5%（含镜头链）",
                   "20 moves，long25≤5%，pov/chase/land 均出现",
                   v_detail, ac=V7_AC_PERF, evidence="reports/v6/qa-perf.json",
                   detail=v_detail)
        else:
            rec.fail("V7-PERF-01", "V7-PERF-01 · 20 回合连续走子长帧（>25ms）≤5%（含镜头链）",
                     "20 moves，long25≤5%，pov/chase/land 均出现",
                     v_detail + " motion_ok=%s" % v_motion, ac=V7_AC_PERF,
                     repro="长夜开局→连续 20 次掷骰/选子（含题卡跳过）→rAF 采样与 data-cinema-state 序列",
                     evidence="reports/v6/qa-perf.json", detail=v_detail, owner="FE-cinema")
    v_resumed = [s for s in (vhid.get("resumedSeq") or []) if s in
                 ("roll", "pov", "chase", "land", "cell45", "bear", "overview")]
    v_hid_ok = (vhid.get("pausedAttr") == "1"
                and vhid.get("pendingFalseMs") is not None
                and (vhid.get("awaitingRollAfterShow") is True and bool(v_resumed)))
    v_detail_h = "pausedAttr=%s state@hide=%s pending@hide=%s raf@hide=%s pendingFalseMs=%s awaitingRoll=%s resumed=%s" % (
        vhid.get("pausedAttr"), vhid.get("stateAtHide"), vhid.get("pendingAtHide"),
        vhid.get("rafAtHide"), vhid.get("pendingFalseMs"), vhid.get("awaitingRollAfterShow"),
        json.dumps(v_resumed, ensure_ascii=False))
    if v_hid_ok:
        rec.ok("V7-PERF-02", "V7-PERF-02 · 页面隐藏/恢复不悬挂：cabin 暂停、镜头链收束、恢复后可继续",
               "paused=1 + pending 最终 false + 恢复后再次出现镜头状态",
               v_detail_h, ac=V7_AC_PERF, evidence="reports/v6/qa-perf.json",
               detail=v_detail_h)
    else:
        rec.fail("V7-PERF-02", "V7-PERF-02 · 页面隐藏/恢复不悬挂：cabin 暂停、镜头链收束、恢复后可继续",
                 "paused=1 + pending 最终 false + 恢复后再次出现镜头状态",
                 v_detail_h, ac=V7_AC_PERF,
                 repro="走子镜头进行中→模拟 visibilitychange(hidden)→恢复→读 _debug()/重建状态序列",
                 evidence="reports/v6/qa-perf.json", detail=v_detail_h, owner="FE-cinema")
    # P1 修复后口径：隐藏→Cinema 冻结（data-cinema-paused=1 / raf=false / 三次 transform 完全一致 /
    # 状态链长度不变、不启动 land）；恢复后继续。paused 期间 tween 对象保留（animating=true）是预期，
    # 因为恢复后要续播；因此只以 rAF/transform/状态链是否冻结为门槛。
    v_hid_pause = (vhid.get("rafAtHide") is False and vhid.get("cinemaPaused") == "1"
                   and vhid.get("boardStable") is True and vhid.get("chainStable") is True)
    v_detail_hp = "raf@hide=%s animating@hide=%s cinemaPaused=%s paused=%s boardStable=%s chainStable=%s state %s→%s" % (
        vhid.get("rafAtHide"), vhid.get("animatingAtHide"), vhid.get("cinemaPaused"),
        vhid.get("pausedAttr"), vhid.get("boardStable"), vhid.get("chainStable"),
        vhid.get("stateAtHide"), vhid.get("stateAfterWait"))
    if v_hid_pause:
        rec.ok("V7-PERF-02B", "V7-PERF-02B · 页面隐藏期间镜头链显式暂停（rAF 停 / transform 冻结 / 链不推进）",
               "raf=false + data-cinema-paused=1 + 3 次 transform 一致 + 链长不变", v_detail_hp,
               ac=V7_AC_PERF, severity="P1", evidence="reports/v6/qa-perf.json", detail=v_detail_hp)
    else:
        rec.fail("V7-PERF-02B", "V7-PERF-02B · 页面隐藏期间镜头链显式暂停（rAF 停 / transform 冻结 / 链不推进）",
                 "raf=false + data-cinema-paused=1 + 3 次 transform 一致 + 链长不变",
                 v_detail_hp, ac=V7_AC_PERF, severity="P1",
                 repro="走子镜头 pov/chase 中→模拟 visibilitychange(hidden)→读 _debug() 的 raf/animating、host data-cinema-paused、3 次 board transform 与 chain 长度",
                 evidence="reports/v6/qa-perf.json", detail=v_detail_hp, owner="FE-cinema")
    v_red_seq = vred.get("stateSeq") or []
    v_red_ok = (vred.get("reduced") is True and vred.get("hostReduced") == "1"
                and not (vred.get("transform") or "")
                and (vred.get("transformFrames") or 0) == 0
                and "pov" not in v_red_seq and "chase" not in v_red_seq
                and (vred.get("cell") or {}).get("reduced") == "1")
    v_detail_r = "reduced=%s host=%s transform=%r transformFrames=%s seq=%s cell=%s" % (
        vred.get("reduced"), vred.get("hostReduced"), vred.get("transform"),
        vred.get("transformFrames"), json.dumps(v_red_seq, ensure_ascii=False)[:200],
        json.dumps(vred.get("cell"), ensure_ascii=False))
    if v_red_ok:
        rec.ok("V7-PERF-03", "V7-PERF-03 · reduced：无 POV/跟拍、棋盘无 transform、格子舞台 reduced",
               "reduced=1 + transformFrames=0 + 无 pov/chase + cell-stage[data-reduced=1]",
               v_detail_r, ac=V7_AC_PERF, evidence="reports/v6/qa-perf.json",
               detail=v_detail_r)
    else:
        rec.fail("V7-PERF-03", "V7-PERF-03 · reduced：无 POV/跟拍、棋盘无 transform、格子舞台 reduced",
                 "reduced=1 + transformFrames=0 + 无 pov/chase + cell-stage[data-reduced=1]",
                 v_detail_r, ac=V7_AC_PERF,
                 repro="设置开减少动画→走子到题格→读 _debug()/transform 帧/状态序列",
                 evidence="reports/v6/qa-perf.json", detail=v_detail_r, owner="FE-cinema")

    cabin_errors = []
    for key in ("idle", "moves", "reduced", "hidden"):
        block = cabin.get(key) or {}
        errs = block.get("errors") or {}
        cabin_errors.extend(errs.get("pageerrors") or [])
        cabin_errors.extend(errs.get("console_errors") or [])
    if cabin_errors:
        rec.fail("CABIN-PERF-errors", "机舱性能路径 0 pageerror / console.error", "0/0",
                 json.dumps(cabin_errors[:5], ensure_ascii=False), ac="AC-V6.2-5",
                 repro="机舱性能采样路径", owner="FE-cabin")
    else:
        rec.ok("CABIN-PERF-errors", "机舱性能路径 0 pageerror / console.error", "0/0", "0/0",
               ac="AC-V6.2-5")
    rec.meta["cabin_runtime"] = {
        "idle": {k: idle.get(k) for k in ("fps", "longRatio", "frames", "long", "elapsed", "p95", "max")},
        "moves": {k: mv.get(k) for k in ("moves", "frames", "long", "fps", "longRatio", "elapsed_ms", "games")},
        "reduced": red,
        "hidden": hid,
        "throttle_ref": thref,
    }
    rec.meta["v7_runtime"] = {
        "moves": {k: vmv.get(k) for k in ("moves", "frames", "long", "fps", "longRatio",
                                          "elapsed_ms", "states", "stateSeq", "games")},
        "hidden": vhid,
        "reduced": {k: vred.get(k) for k in ("reduced", "hostReduced", "transform",
                                             "transformFrames", "stateSeq", "states", "cell", "raf")},
    }

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
    extra.append("### V6.2 机舱运行时（E2E 冻结单 §5）")
    extra.append("")
    extra.append("| 项 | 实测 | 门槛 | 状态 |")
    extra.append("|---|---|---|---|")
    _idle = cabin.get("idle") or {}
    _mv = cabin.get("moves") or {}
    _red = cabin.get("reduced") or {}
    _hid = cabin.get("hidden") or {}
    _th = cabin.get("throttle_ref") or {}

    def _st(cid):
        return next((c["status"] for c in rec.checks if c["id"] == cid), "-")

    extra.append("| 主桌空闲帧率 | %.1f fps（p95 %s ms / max %s ms） | ≥50 fps | %s |" % (
        _idle.get("fps") or 0, round(_idle.get("p95") or 0, 1), round(_idle.get("max") or 0, 1),
        _st("CABIN-PERF-idle-fps")))
    extra.append("| 空闲长帧 >25ms | %.2f%%（%s/%s） | ≤5%% | %s |" % (
        (_idle.get("longRatio") or 0) * 100, _idle.get("long"), _idle.get("frames"),
        _st("CABIN-PERF-idle-long")))
    extra.append("| 20 次连续走子 | moves=%s fps=%.1f long25=%.2f%% | 20 次，≤5%% | %s |" % (
        _mv.get("moves"), _mv.get("fps") or 0, (_mv.get("longRatio") or 0) * 100,
        _st("CABIN-PERF-moves")))
    extra.append("| reduced 静止 | reduced=%s transform=%r canvasStatic=%s | 停止 | %s |" % (
        _red.get("reduced"), _red.get("transform"), _red.get("canvasStatic"),
        _st("CABIN-PERF-reduced")))
    extra.append("| 页面隐藏暂停 | paused=%s frames %s→%s→%s | 停/恢复 | %s |" % (
        _hid.get("pausedAttr"), _hid.get("sceneFramesAtHide"), _hid.get("sceneFramesAfterWait"),
        _hid.get("sceneFramesAfterShow"), _st("CABIN-PERF-hidden")))
    if _th.get("fps") is not None:
        extra.append("| 4×CPU 参考 | fps=%.1f long25=%.2f%% | 仅参考 | - |" % (
            _th.get("fps") or 0, (_th.get("longRatio") or 0) * 100))
    extra.append("")
    extra.append("### V7 电影镜头运行时（docs/v7/impl-freeze.md §5/§6）")
    extra.append("")
    extra.append("| 项 | 实测 | 门槛 | 状态 |")
    extra.append("|---|---|---|---|")
    extra.append("| 20 回合连续走子（含镜头链） | moves=%s frames=%s long25=%.2f%% fps=%.1f states=%s | 20 次，≤5%% | %s |" % (
        vmv.get("moves"), vmv.get("frames"), (vmv.get("longRatio") or 0) * 100,
        vmv.get("fps") or 0, json.dumps(vmv.get("states") or {}, ensure_ascii=False)[:120],
        _st("V7-PERF-01")))
    extra.append("| 页面隐藏/恢复（镜头链中） | paused=%s state@hide=%s pendingFalseMs=%s awaitingRoll=%s | 不悬挂/可继续 | %s |" % (
        vhid.get("pausedAttr"), vhid.get("stateAtHide"), vhid.get("pendingFalseMs"),
        vhid.get("awaitingRollAfterShow"), _st("V7-PERF-02")))
    extra.append("| 隐藏期显式暂停（P1） | raf@hide=%s animating@hide=%s boardStable=%s | 暂停/冻结 | %s |" % (
        vhid.get("rafAtHide"), vhid.get("animatingAtHide"), vhid.get("boardStable"),
        _st("V7-PERF-02B")))
    extra.append("| reduced（设置） | reduced=%s transformFrames=%s seq=%s cell=%s | 无 POV/跟拍/transform | %s |" % (
        vred.get("reduced"), vred.get("transformFrames"),
        json.dumps(vred.get("stateSeq") or [], ensure_ascii=False)[:80],
        json.dumps(vred.get("cell"), ensure_ascii=False),
        _st("V7-PERF-03")))
    extra.append("")
    extra.append("### 原始采样")
    extra.append("")
    extra.append("```json")
    extra.append(json.dumps({"samples": samples, "offline": offline, "disk": disk,
                             "cabin_runtime": rec.meta.get("cabin_runtime"),
                             "v7_runtime": rec.meta.get("v7_runtime")},
                            ensure_ascii=False, indent=1)[:14000])
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
