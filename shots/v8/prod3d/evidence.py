# -*- coding: utf-8 -*-
"""V8 prod3d · 生产模块完整证据：主路径/阶段链/三主题/320-430/reduced/事件映射/API/帧率。"""
import json
import os
import time
from playwright.sync_api import sync_playwright

ROOT = "http://127.0.0.1:8777/app/dev/board3d-prod-demo.html"
OUT = "shots/v8/prod3d"
os.makedirs(OUT, exist_ok=True)
REPORT = {"generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "baseUrl": ROOT, "cases": {}, "screenshots": [], "errors": []}
ALL_ERRORS = []

PHASE_JS = "() => { const s = document.querySelector('[data-test=stage]'); return s ? s.getAttribute('data-3d-phase') : null; }"
INFO_JS = "() => window.__demo ? window.__demo.info() : null"
DEBUG_JS = "() => window.App && window.App.Board3D ? window.App.Board3D._debug() : null"


def attach(page, tag):
    def on_console(m):
        if m.type in ("error", "warning"):
            ALL_ERRORS.append([tag, "console", m.type, m.text[:300]])
    def on_pageerror(e):
        ALL_ERRORS.append([tag, "pageerror", str(e)[:300]])
    page.on("console", on_console)
    page.on("pageerror", on_pageerror)


def shot(page, name):
    path = os.path.join(OUT, name)
    page.screenshot(path=path)
    REPORT["screenshots"].append(path)
    return path


def wait_ready(page, timeout=45000):
    page.wait_for_function("() => document.body.getAttribute('data-ready') === '1'", timeout=timeout)
    page.wait_for_timeout(700)


def start_phase_log(page):
    page.evaluate("""() => {
      window.__phaseLog = [];
      const stage = document.querySelector('[data-test=stage]');
      const push = () => {
        const p = stage.getAttribute('data-3d-phase');
        if (window.__phaseLog[window.__phaseLog.length - 1] !== p) window.__phaseLog.push(p);
      };
      push();
      window.__phaseObserver = new MutationObserver(push);
      window.__phaseObserver.observe(stage, { attributes: true, attributeFilter: ['data-3d-phase'] });
    }""")


def phase_log(page):
    return page.evaluate("() => window.__phaseLog || []")


def wait_phase(page, name, timeout=20000):
    page.wait_for_function("(p) => document.querySelector('[data-test=stage]').getAttribute('data-3d-phase') === p",
                           arg=name, timeout=timeout)


def wait_idle_awaiting(page, awaiting=None, timeout=40000):
    if awaiting is None:
        page.wait_for_function("() => window.__demo.info().phase === 'idle'", timeout=timeout)
    else:
        page.wait_for_function("(a) => window.__demo.info().phase === 'idle' && window.__demo.info().awaiting === a",
                               arg=awaiting, timeout=timeout)


def fire(promise_js):
    """在页面里启动一个异步动作，不等待其 Promise。"""
    return f"() => {{ void {promise_js}; return true; }}"


def run_main_flow(page, tag, width, shots_enabled=True):
    tagres = {}
    wait_ready(page)
    start_phase_log(page)
    if shots_enabled:
        shot(page, f"01-overview-{width}.png")
    tagres["overview"] = page.evaluate(DEBUG_JS)

    page.evaluate(fire("window.__demo.roll(6)"))
    wait_phase(page, "roll", timeout=20000)
    if shots_enabled:
        shot(page, f"02-roll-{width}.png")
    wait_idle_awaiting(page, "choose-piece")
    if shots_enabled:
        shot(page, f"03-choose-{width}.png")
    page.click("[data-test=piece-choice]")
    try:
        wait_phase(page, "focus", timeout=15000)
        if shots_enabled:
            shot(page, f"04-focus-{width}.png")
    except Exception:
        pass
    try:
        wait_phase(page, "fly", timeout=15000)
        if shots_enabled:
            shot(page, f"05-fly-{width}.png")
    except Exception:
        pass
    wait_idle_awaiting(page, "roll")
    tagres["afterTakeoff"] = page.evaluate(DEBUG_JS)

    page.evaluate(fire("window.__demo.roll(2)"))
    try:
        wait_phase(page, "cell45", timeout=20000)
        if shots_enabled:
            shot(page, f"06-cell45-{width}.png")
    except Exception:
        pass
    page.wait_for_selector("[data-test=prompt-done]", timeout=25000)
    try:
        wait_phase(page, "bear", timeout=5000)
    except Exception:
        pass
    if shots_enabled:
        shot(page, f"07-bear-prompt-{width}.png")
    tagres["bearPrompt"] = page.evaluate(DEBUG_JS)
    tagres["prompt"] = {
        "kicker": page.eval_on_selector("[data-test=prompt-kicker]", "e => e.textContent"),
        "text": page.eval_on_selector("[data-test=prompt-text]", "e => e.textContent"),
        "actor": page.eval_on_selector("[data-test=prompt-actor]", "e => e.textContent"),
    }
    tagres["phases"] = phase_log(page)
    page.click("[data-test=prompt-done]")
    wait_idle_awaiting(page, "roll")
    tagres["afterDone"] = page.evaluate(DEBUG_JS)
    tagres["afterDoneInfo"] = page.evaluate(INFO_JS)
    if shots_enabled:
        shot(page, f"08-after-done-{width}.png")
    return tagres


def page_prepare(browser, width, height, query="?adapt=0", dsf=2):
    page = browser.new_page(viewport={"width": width, "height": height}, locale="zh-CN", device_scale_factor=dsf)
    attach(page, f"{width}x{height}")
    page.goto(ROOT + query, wait_until="load")
    return page


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True,
                                args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])

    # ---------- 430 主路径 ----------
    page = page_prepare(browser, 430, 932)
    t0 = time.time()
    c430 = run_main_flow(page, "430", 430, True)
    c430["elapsedSec"] = round(time.time() - t0, 1)
    REPORT["cases"]["main430"] = c430

    # skip 动画 + 运行时 reduced 切换 + safe/ledger 事件
    page.evaluate(fire("window.__demo.roll(3)"))
    try:
        wait_phase(page, "roll", timeout=15000)
        page.evaluate("() => window.App.Board3D.skip()")
        skip_t0 = time.time()
        wait_phase(page, "idle", timeout=15000)
        REPORT["cases"]["skipDuringAnim"] = {
            "ok": True,
            "idleAfterSec": round(time.time() - skip_t0, 2),
            "info": page.evaluate(INFO_JS)
        }
    except Exception as e:
        REPORT["cases"]["skipDuringAnim"] = {"ok": False, "error": str(e)[:200]}
    page.evaluate("() => window.__demo.reduced(true)")
    page.wait_for_timeout(600)
    shot(page, "10b-reduced-toggle-430.png")
    reduced_on = page.evaluate("() => { const s=document.querySelector('[data-test=stage]'); return {attr:s.getAttribute('data-3d-reduced'), phase:window.__demo.info().phase, debug:window.App.Board3D._debug().reduced}; }")
    page.evaluate("() => window.__demo.reduced(false)")
    page.wait_for_timeout(600)
    reduced_off = page.evaluate("() => { const s=document.querySelector('[data-test=stage]'); return {attr:s.getAttribute('data-3d-reduced'), phase:window.__demo.info().phase, debug:window.App.Board3D._debug().reduced}; }")
    REPORT["cases"]["reducedToggle"] = {"on": reduced_on, "off": reduced_off}
    safe_res = page.evaluate("async () => { try { await window.App.Board3D.play([{type:'safe'},{type:'ledger'}]); return 'resolved'; } catch (e) { return 'rejected:' + e; } }")
    REPORT["cases"]["safeLedgerEvents"] = {"play": safe_res, "phase": page.evaluate(PHASE_JS)}
    page.evaluate("() => { window.App.Board3D.setSound(true); window.App.Board3D.setSound(false); }")

    # 三主题截图（同一页面）
    for theme in ("star", "paper"):
        page.evaluate("(t) => window.__demo.theme(t)", theme)
        page.wait_for_timeout(500)
        shot(page, f"09-theme-{theme}-430.png")
        REPORT.setdefault("themes", {})[theme] = page.evaluate(DEBUG_JS)
    page.evaluate("() => window.__demo.theme('cloud')")

    # API / DOM 契约
    REPORT["cases"]["contract"] = page.evaluate("""() => {
      const api = window.App.Board3D;
      const inst = window.__board3dInst;
      const stage = document.querySelector('[data-test=stage]');
      const canvas = stage.querySelector('canvas');
      const layer = stage.querySelector('.board3d-layer');
      const hudBtn = document.querySelector('[data-test=demo-roll]');
      const r = hudBtn.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      const cs = getComputedStyle(canvas);
      const ls = getComputedStyle(layer);
      return {
        apiKeys: Object.keys(api).sort(),
        instMethods: inst ? ['setState','play','setTheme','setReduced','setSound','skip','unmount','_debug'].map(k => typeof inst[k]) : null,
        version: api.version,
        three: api.threeRevision,
        mounted: api.mounted,
        canvas: { w: canvas.width, h: canvas.height, pointerEvents: cs.pointerEvents, position: cs.position },
        layer: { pointerEvents: ls.pointerEvents, position: ls.position, zIndex: ls.zIndex },
        stageRect: stage.getBoundingClientRect().toJSON(),
        hitTag: hit ? hit.tagName : null,
        hitTest: (hit && (hit === hudBtn || hudBtn.contains(hit))) ? 'roll-button' : 'NOT-BUTTON',
        attrs: {
          ready: stage.getAttribute('data-3d-ready'),
          phase: stage.getAttribute('data-3d-phase'),
          theme: stage.getAttribute('data-3d-theme'),
          reduced: stage.getAttribute('data-3d-reduced'),
          mode: stage.getAttribute('data-3d-mode')
        },
        playBogus: null
      };
    }""")
    bogus = page.evaluate("async () => { try { await window.App.Board3D.play([{type:'bogus'}]); return 'resolved'; } catch (e) { return 'rejected:' + e; } }")
    empty_play = page.evaluate("async () => { try { await window.App.Board3D.play([]); return 'resolved'; } catch (e) { return 'rejected:' + e; } }")
    REPORT["cases"]["contract"]["playBogus"] = bogus
    REPORT["cases"]["contract"]["playEmpty"] = empty_play
    page.close()

    # ---------- 390 / 320 ----------
    for width, height in ((390, 844), (320, 568)):
        pg = page_prepare(browser, width, height)
        t0 = time.time()
        res = run_main_flow(pg, str(width), width, True)
        res["elapsedSec"] = round(time.time() - t0, 1)
        REPORT["cases"][f"main{width}"] = res
        pg.close()

    # ---------- long 模式（每人 4 架） ----------
    pg = page_prepare(browser, 430, 932, "?mode=long&adapt=0")
    wait_ready(pg)
    shot(pg, "14-long-overview-430.png")
    long_dbg = pg.evaluate(DEBUG_JS)
    REPORT["cases"]["modeLong"] = {
        "planeCount": pg.evaluate("() => window.__demo.state().planeCount"),
        "pieces": len(long_dbg.get("pieces", [])),
        "mode": pg.evaluate("() => window.__demo.state().mode"),
        "debug": {k: long_dbg.get(k) for k in ("phase", "drawCalls", "triangles")}
    }
    pg.close()

    # ---------- reduced ----------
    pg = page_prepare(browser, 430, 932, "?reduced=1&adapt=0", dsf=1)
    wait_ready(pg)
    start_phase_log(pg)
    reduced_info = pg.evaluate(INFO_JS)
    shot(pg, "10-reduced-430.png")
    t0 = time.time()
    pg.evaluate(fire("window.__demo.roll(6)"))
    wait_ready_ph = pg.wait_for_function("() => window.__demo.info().awaiting === 'choose-piece'", timeout=20000)
    if pg.locator("[data-test=piece-choice]").count():
        pg.click("[data-test=piece-choice]")
        pg.wait_for_function("() => window.__demo.info().awaiting === 'roll'", timeout=20000)
    pg.evaluate(fire("window.__demo.roll(2)"))
    try:
        pg.wait_for_selector("[data-test=prompt-done]", timeout=20000)
    except Exception:
        pass
    pg.wait_for_timeout(300)
    shot(pg, "11-reduced-prompt-430.png")
    reduced_phases = phase_log(pg)
    reduced_debug = pg.evaluate(DEBUG_JS)
    REPORT["cases"]["reduced"] = {
        "info": reduced_info,
        "phases": reduced_phases,
        "debug": {k: reduced_debug.get(k) for k in ("phase", "reduced", "drawCalls", "triangles", "dpr", "quality")},
        "attrs": pg.evaluate("() => { const s=document.querySelector('[data-test=stage]'); return {reduced:s.getAttribute('data-3d-reduced'),phase:s.getAttribute('data-3d-phase')}; }"),
        "elapsedSec": round(time.time() - t0, 1),
        "forbiddenPhases": [x for x in reduced_phases if x in ("focus", "fly", "land", "cell45", "bear")]
    }
    pg.close()

    # ---------- 事件映射（合成事件；真实引擎状态 + 注入棋子位置） ----------
    pg = page_prepare(browser, 430, 932)
    wait_ready(pg)
    synth = {}
    # jump
    start_phase_log(pg)
    pg.evaluate("""async (ev) => {
      await window.__demo.injectEvents(ev, [{id:'a:0', squareId:'ring:4'}]);
    }""", [{"type": "jump", "pieceId": "a:0", "from": "ring:4", "to": "ring:8"}])
    synth["jump"] = {"phases": phase_log(pg), "debug": pg.evaluate(DEBUG_JS)}
    # capture（受害者仍在机坪，落点 ring:24）
    pg.evaluate("() => { window.__phaseLog = []; }")
    start_phase_log(pg)
    pg.evaluate("""async (ev) => {
      await window.__demo.injectEvents(ev, [{id:'a:0', squareId:'ring:20'}]);
    }""", [
        {"type": "move", "pieceId": "a:0", "path": ["ring:21", "ring:22", "ring:23", "ring:24"], "mode": "walk"},
        {"type": "capture", "attackerId": "a:0", "victimIds": ["b:0"]}
    ])
    synth["capture"] = {"phases": phase_log(pg), "debug": pg.evaluate(DEBUG_JS)}
    # stack + prompt（不 await，先抓 stack 阶段再等 hold）
    pg.evaluate("() => { window.__phaseLog = []; }")
    start_phase_log(pg)
    pg.evaluate("""(ev) => {
      void window.__demo.injectEvents(ev, [
        {id:'a:0', squareId:'ring:12'},
        {id:'a:1', squareId:'ring:13'}
      ]);
    }""", [
        {"type": "move", "pieceId": "a:0", "path": ["ring:13"], "mode": "walk"},
        {"type": "stack", "pieceIds": ["a:0", "a:1"], "at": "ring:13"},
        {"type": "prompt", "prompt": {"kind": "stack-duo", "actorId": "a", "targetId": "both", "card": {"id": "t", "text": "合成叠机题：验证 stack 事件与 45° 舞台 hold。", "star": 2}}}
    ])
    wait_phase(pg, "stack", timeout=20000)
    shot(pg, "12-stack-430.png")
    try:
        wait_phase(pg, "bear", timeout=20000)
    except Exception:
        pass
    pg.wait_for_timeout(400)
    synth["stack"] = {"phases": phase_log(pg), "debug": pg.evaluate(DEBUG_JS)}
    pg.evaluate("() => window.App.Board3D.skip()")
    pg.wait_for_function("() => document.querySelector('[data-test=stage]').getAttribute('data-3d-phase') === 'idle'", timeout=20000)
    pg.wait_for_timeout(300)
    synth["skipAfterHold"] = {"phase": pg.evaluate(PHASE_JS), "debug": pg.evaluate(DEBUG_JS)}
    REPORT["cases"]["eventMapping"] = synth
    pg.close()

    # ---------- 性能（生产默认 adapt=1，headless SwiftShader，400x? dpr1） ----------
    pg = browser.new_page(viewport={"width": 430, "height": 932}, locale="zh-CN", device_scale_factor=1)
    attach(pg, "perf")
    pg.goto(ROOT, wait_until="load")
    wait_ready(pg)
    renderer = pg.evaluate("""() => {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2');
      const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      return { renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : (gl ? gl.getParameter(gl.RENDERER) : null),
               vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : null,
               dpr: window.devicePixelRatio, ua: navigator.userAgent,
               cores: navigator.hardwareConcurrency };
    }""")
    pg.evaluate("""() => {
      window.__samples = [];
      window.__sampling = true;
      const tick = (now) => {
        if (!window.__sampling) return;
        window.__samples.push(now);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }""")
    t0 = time.time()
    auto_res = pg.evaluate("async () => await window.__demo.auto(10, [6,2,5,6,3,4,6,1,5,2])")
    auto_sec = round(time.time() - t0, 1)
    pg.wait_for_timeout(400)
    samples = pg.evaluate("() => { window.__sampling = false; return window.__samples; }")
    deltas = [round(samples[i] - samples[i - 1], 2) for i in range(1, len(samples))]
    deltas_sorted = sorted(deltas)
    def pct(p):
        if not deltas_sorted:
            return None
        return deltas_sorted[min(len(deltas_sorted) - 1, int(len(deltas_sorted) * p))]
    stats = {
        "frames": len(deltas),
        "avgMs": round(sum(deltas) / len(deltas), 2) if deltas else None,
        "p50Ms": pct(0.5), "p95Ms": pct(0.95), "maxMs": max(deltas) if deltas else None,
        "long25": sum(1 for d in deltas if d > 25),
        "long25Ratio": round(sum(1 for d in deltas if d > 25) / len(deltas), 3) if deltas else None,
        "fps": round(len(deltas) * 1000 / max(1, samples[-1] - samples[0]), 1) if len(samples) > 1 else None
    }
    final_debug = pg.evaluate(DEBUG_JS)
    REPORT["cases"]["perf"] = {
        "env": renderer,
        "auto": auto_res,
        "autoSec": auto_sec,
        "raf": stats,
        "phaseStats": final_debug.get("perf", {}).get("phases", {}),
        "render": final_debug.get("perf", {}).get("render"),
        "quality": final_debug.get("quality"),
        "dpr": final_debug.get("dpr"),
        "caveat": "headless Edge + SwiftShader 软件渲染（非真机 GPU）；render/update ms 与 drawCalls/triangles 可参考，fps/长帧只作相对参考。"
    }
    shot(pg, "13-perf-end-430.png")

    # ---------- unmount / remount ----------
    pg.click("[data-test=demo-new]")
    pg.wait_for_function("() => document.body.getAttribute('data-ready') === '1' && window.App.Board3D.mounted === true", timeout=30000)
    pg.wait_for_timeout(700)
    REPORT["cases"]["remount"] = {
        "mounted": pg.evaluate("() => window.App.Board3D.mounted"),
        "phase": pg.evaluate(PHASE_JS),
        "debug": {k: pg.evaluate(DEBUG_JS).get(k) for k in ("ready", "phase", "drawCalls")}
    }
    pg.close()
    browser.close()

# GPU 探测（不带 SwiftShader 强制参数，看 headless 是否走真 GPU）
gpu_probe = None
try:
    with sync_playwright() as p2:
        b2 = p2.chromium.launch(channel="msedge", headless=True)
        pg2 = b2.new_page()
        pg2.goto("about:blank")
        gpu_probe = pg2.evaluate("""() => {
          const c = document.createElement('canvas');
          const gl = c.getContext('webgl2');
          if (!gl) return { webgl2: false };
          const ext = gl.getExtension('WEBGL_debug_renderer_info');
          return { webgl2: true,
                   renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
                   vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : null };
        }""")
        b2.close()
except Exception as e:
    gpu_probe = {"error": str(e)[:200]}
REPORT["cases"]["perf"]["gpuProbeNoFlags"] = gpu_probe

REPORT["errors"] = ALL_ERRORS
with open(os.path.join(OUT, "report.json"), "w", encoding="utf-8") as f:
    json.dump(REPORT, f, ensure_ascii=False, indent=2)
print(json.dumps({"cases": list(REPORT["cases"].keys()), "errors": ALL_ERRORS[:8], "errorCount": len(ALL_ERRORS)}, ensure_ascii=False))
