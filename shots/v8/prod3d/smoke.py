# -*- coding: utf-8 -*-
"""V8 prod3d · 冒烟：真实引擎 + App.Board3D 生产模块加载/挂载。"""
import json
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8777/app/dev/board3d-prod-demo.html"
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True,
                                args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    page = browser.new_page(viewport={"width": 430, "height": 932}, locale="zh-CN",
                            device_scale_factor=2)
    page.on("console", lambda m: errors.append(("console", m.type, m.text)) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: errors.append(("pageerror", str(e))))
    page.goto(URL, wait_until="load")
    try:
        page.wait_for_function("() => document.body.getAttribute('data-ready') === '1'", timeout=25000)
    except Exception as e:
        print("READY TIMEOUT", e)
    info = page.evaluate("""() => {
      const d = window.__demo ? window.__demo.info() : null;
      const dbg = window.App && window.App.Board3D ? window.App.Board3D._debug() : null;
      const stage = document.querySelector('[data-test="stage"]');
      const canvas = stage ? stage.querySelector('canvas') : null;
      const s = canvas ? getComputedStyle(canvas) : null;
      return {
        hasApp: typeof window.App,
        hasBoard3D: !!(window.App && window.App.Board3D),
        version: window.App && window.App.Board3D ? window.App.Board3D.version : null,
        three: window.App && window.App.Board3D ? window.App.Board3D.threeRevision : null,
        demo: d, debug: dbg,
        canvas: canvas ? { w: canvas.width, h: canvas.height, pe: s.pointerEvents, disp: s.display } : null,
        stageRect: stage ? stage.getBoundingClientRect().toJSON() : null,
        bodyReady: document.body.getAttribute('data-ready'),
        loadingOpacity: getComputedStyle(document.querySelector('#loading')).opacity,
        fallback: stage ? stage.getAttribute('data-3d-fallback') : null,
        awaitType: window.__demo && window.__demo.state() ? window.__demo.state().awaiting.type : null
      };
    }""")
    print(json.dumps({"info": info, "errors": errors}, ensure_ascii=False, indent=2))
    page.screenshot(path="shots/v8/prod3d/smoke-430.png")
    browser.close()
