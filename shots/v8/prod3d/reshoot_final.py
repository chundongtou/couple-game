# -*- coding: utf-8 -*-
"""V8 prod3d · 最终 demo 截图刷新（430）：overview / cell45 / bear + 无错误。"""
import json
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8777/app/dev/board3d-prod-demo.html?adapt=0"
OUT = "shots/v8/prod3d"
errs = []

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", headless=True, args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 430, "height": 932}, locale="zh-CN", device_scale_factor=2)
    pg.on("console", lambda m: errs.append((m.type, m.text[:200])) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append(("pageerror", str(e)[:200])))
    pg.goto(URL, wait_until="load")
    pg.wait_for_function("() => document.body.getAttribute('data-ready') === '1'", timeout=45000)
    pg.wait_for_timeout(1000)
    pg.screenshot(path=OUT + "/01-overview-430.png")
    pg.evaluate("() => { void window.__demo.roll(6); }")
    pg.wait_for_function("() => window.__demo.info().awaiting === 'choose-piece' && window.__demo.info().phase === 'idle'", timeout=40000)
    pg.click("[data-test=piece-choice]")
    pg.wait_for_function("() => window.__demo.info().awaiting === 'roll' && window.__demo.info().phase === 'idle'", timeout=40000)
    pg.evaluate("() => { void window.__demo.roll(2); }")
    try:
        pg.wait_for_function("() => document.querySelector('[data-test=stage]').getAttribute('data-3d-phase') === 'cell45'", timeout=30000)
        pg.screenshot(path=OUT + "/06-cell45-430.png")
    except Exception:
        pass
    pg.wait_for_selector("[data-test=prompt-done]", timeout=30000)
    pg.wait_for_timeout(500)
    pg.screenshot(path=OUT + "/07-bear-prompt-430.png")
    dbg = pg.evaluate("() => window.App.Board3D._debug()")
    pg.click("[data-test=prompt-done]")
    pg.wait_for_function("() => !window.__demo.info() || window.__demo.info().phase === 'idle'", timeout=30000)
    pg.wait_for_timeout(800)
    pg.screenshot(path=OUT + "/08-after-done-430.png")
    print(json.dumps({"phase": dbg["phase"], "holding": dbg["holding"], "stage": dbg["probe"]["stage"], "lock": dbg["probe"]["lock"], "drawCalls": dbg["drawCalls"], "errors": errs}, ensure_ascii=False))
    b.close()
