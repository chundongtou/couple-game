# -*- coding: utf-8 -*-
"""V3 壳层冒烟：boot 渲染、无 console error、视觉截图。"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "qa"))
from harness import serve  # noqa: E402

DIST = ROOT / "dist" / "rebuild"
OUT = ROOT / "reports" / "rebuild"
OUT.mkdir(parents=True, exist_ok=True)


def main():
    from playwright.sync_api import sync_playwright

    errs = []
    cons = []
    with serve(DIST, port=8872) as base:
        with sync_playwright() as p:
            b = p.chromium.launch(headless=True)
            ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2,
                                is_mobile=True, has_touch=True, locale="zh-CN")
            pg = ctx.new_page()
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.on("console", lambda m: cons.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
            pg.goto(base, wait_until="load", timeout=30000)
            pg.wait_for_timeout(1200)
            out = {
                "title": pg.title(),
                "boot": pg.evaluate("!!document.querySelector('.boot-title')"),
                "cards": pg.evaluate("window.CARDS ? Object.keys(window.CARDS).map(function(k){return k+':'+window.CARDS[k].length}) : null"),
                "screens": pg.evaluate("Object.keys(App.Screens||{})"),
                "errors": errs,
                "console": cons,
            }
            pg.screenshot(path=str(OUT / "boot-390.png"), full_page=False)
            print(json.dumps(out, ensure_ascii=False, indent=1))
            b.close()
    fail = (not out["boot"]) or out["errors"] or [c for c in out["console"] if c.startswith("error:")]
    print("SHELL", "PASS" if not fail else "FAIL")
    sys.exit(0 if not fail else 1)


if __name__ == "__main__":
    main()
