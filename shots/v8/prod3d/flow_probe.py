# -*- coding: utf-8 -*-
"""V8 prod3d · 主路径探针：roll(6)->choose->move(takeoff)->roll(2)->move(prompt) 阶段链与错误。"""
import json
import time
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8777/app/dev/board3d-prod-demo.html"
logs = []
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True,
                                args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    page = browser.new_page(viewport={"width": 430, "height": 932}, locale="zh-CN", device_scale_factor=1)
    page.on("console", lambda m: (errors.append(("console", m.type, m.text)) if m.type in ("error", "warning") else None))
    page.on("pageerror", lambda e: errors.append(("pageerror", str(e))))
    page.goto(URL, wait_until="load")
    page.wait_for_function("() => document.body.getAttribute('data-ready') === '1'", timeout=25000)
    page.wait_for_timeout(700)

    def phase():
        return page.evaluate("() => document.querySelector('[data-test=stage]').getAttribute('data-3d-phase')")

    def info():
        return page.evaluate("() => window.__demo.info()")

    def log(msg, extra=None):
        row = {"t": round(time.time() - t0, 2), "msg": msg, "phase": phase(), "info": info()}
        if extra:
            row["extra"] = extra
        logs.append(row)

    t0 = time.time()
    log("boot")

    # --- 第一次掷骰 6 ---
    page.evaluate("() => { window.__rollP = window.__demo.roll(6); }")
    seen = []
    deadline = time.time() + 20
    while time.time() < deadline:
        ph = phase()
        if not seen or seen[-1] != ph:
            seen.append(ph)
            logs.append({"t": round(time.time() - t0, 2), "phase": ph, "event": "phase"})
        inf = info()
        if inf["awaiting"] == "choose-piece":
            break
        if inf["awaiting"] == "prompt":
            break
        time.sleep(0.08)
    log("after roll(6)", {"seen": seen})

    # --- 选子 ---
    page.wait_for_selector("[data-test=piece-choice]", timeout=10000)
    page.click("[data-test=piece-choice]")
    time.sleep(0.2)
    seen2 = []
    deadline = time.time() + 25
    while time.time() < deadline:
        ph = phase()
        if not seen2 or seen2[-1] != ph:
            seen2.append(ph)
            logs.append({"t": round(time.time() - t0, 2), "phase": ph, "event": "phase-move1"})
        inf = info()
        if inf["awaiting"] == "roll" and not inf["ended"]:
            break
        time.sleep(0.08)
    log("after move(takeoff)", {"seen": seen2})

    # --- 第二次掷骰 2 ---
    page.evaluate("() => { window.__rollP = window.__demo.roll(2); }")
    seen3 = []
    deadline = time.time() + 25
    while time.time() < deadline:
        ph = phase()
        if not seen3 or seen3[-1] != ph:
            seen3.append(ph)
            logs.append({"t": round(time.time() - t0, 2), "phase": ph, "event": "phase-move2"})
        inf = info()
        if inf["awaiting"] == "prompt":
            break
        time.sleep(0.08)
    log("after roll(2)+move", {"seen": seen3})
    try:
        page.wait_for_selector("[data-test=prompt-done]", timeout=8000)
        log("prompt sheet visible")
    except Exception as e:
        log("prompt sheet MISSING", {"err": str(e)})
    dbg = page.evaluate("() => window.App.Board3D._debug()")
    logs.append({"debug": dbg})
    page.screenshot(path="shots/v8/prod3d/probe-prompt-430.png")

    print(json.dumps({"logs": logs, "errors": errors}, ensure_ascii=False, indent=2))
    browser.close()
