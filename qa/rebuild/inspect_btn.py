# -*- coding: utf-8 -*-
"""检查 boot 主按钮计算样式（排查配色发灰）。"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "qa"))
from harness import serve  # noqa: E402

DIST = ROOT / "dist" / "rebuild"


def main():
    from playwright.sync_api import sync_playwright
    with serve(DIST, port=8880) as base:
        with sync_playwright() as p:
            b = p.chromium.launch(headless=True)
            ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
            pg = ctx.new_page()
            pg.goto(base, wait_until="load")
            pg.wait_for_timeout(900)
            info = pg.evaluate(
                """()=>{var b=document.getElementById('btnNew');var cs=getComputedStyle(b);
                return {bg:cs.backgroundImage,color:cs.color,opacity:cs.opacity,filter:cs.filter,
                        boxShadow:cs.boxShadow,classes:b.className,transform:cs.transform,
                        rect:b.getBoundingClientRect().toJSON()};}"""
            )
            print(json.dumps(info, ensure_ascii=False, indent=1))
            pg.locator("#btnNew").screenshot(path=str(ROOT / "reports" / "rebuild" / "btn-primary.png"))
            b.close()


if __name__ == "__main__":
    main()
