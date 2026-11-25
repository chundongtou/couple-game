# -*- coding: utf-8 -*-
"""V8 prod3d · 环境探针：headless Edge 下 P0 原型 WebGL2/three 是否可用。"""
import json
import sys
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8777/app/dev/board3d-demo.html"
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True,
                                args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    page = browser.new_page(viewport={"width": 430, "height": 932}, locale="zh-CN")
    page.on("console", lambda m: errors.append(("console", m.type, m.text)) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: errors.append(("pageerror", str(e))))
    page.goto(URL, wait_until="load")
    page.wait_for_function("() => window.__board3d && window.__board3d.ready === true", timeout=20000)
    info = page.evaluate("""() => {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2');
      return {
        webgl2: !!gl,
        renderer: gl ? gl.getParameter(gl.RENDERER) : null,
        version: window.__board3d.version,
        phase: window.__board3d.phase(),
        perf: window.__board3d.perf(),
        probe: window.__board3d.probe(),
      };
    }""")
    print(json.dumps({"info": info, "errors": errors}, ensure_ascii=False, indent=2))
    browser.close()
