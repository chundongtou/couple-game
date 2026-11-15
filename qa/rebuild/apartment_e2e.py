#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""今晚在这间公寓 · 浏览器走查。

  python tools/rebuild/build_app.py --out dist/rebuild
  python qa/rebuild/apartment_e2e.py --dist dist/rebuild
"""
import argparse
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "qa"))
from harness import serve  # noqa: E402

EXPLICIT = (
    "口交|插入|高潮|射精|全裸|裸体|自慰|肉棒|抽插|后入|骑乘|乳头|做爱|口爆|被口|口对方"
)


def launch(p):
    return p.chromium.launch(
        channel="chrome",
        headless=True,
        args=["--no-sandbox", "--disable-dev-shm-usage"],
    )


def new_page(browser, width, height):
    ctx = browser.new_context(
        viewport={"width": width, "height": height},
        locale="zh-CN",
        has_touch=True,
        is_mobile=width < 800,
    )
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    return ctx, page, errors


def overflow(page):
    return page.evaluate(
        "() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2"
    )


def run(base, browser):
    fails = []

    def check(cond, msg):
        print(("  ok " if cond else "  FAIL ") + msg)
        if not cond:
            fails.append(msg)

    # ----- 热烈：完整一夜，五间房 + 散步 + 关灯 -----
    ctx, page, errors = new_page(browser, 390, 844)
    page.goto(base, wait_until="domcontentloaded")
    page.wait_for_selector("[data-test=enter-night]")
    check("今晚在这间公寓" in page.title(), "标题是公寓")
    check("升温夜航" not in page.inner_text("body"), "门口不再是夜航")
    page.click("[data-test=enter-night]")
    page.wait_for_selector("[data-test=name-a]")
    page.fill("[data-test=name-a]", "阿岚")
    page.fill("[data-test=name-b]", "小满")
    page.click("[data-test=intensity-3]")
    page.click("[data-test=boundary-束缚]")
    check(page.locator("[data-test=boundary-束缚]").get_attribute("aria-pressed") == "true", "束缚写进纸条")
    page.click("[data-test=start-night]")
    page.wait_for_selector("[data-test=floor]")
    check(page.locator("[data-test=token]").inner_text() == "我们", "门厅有一枚我们")
    check(not overflow(page), "390 宽没有横向滚动")
    heat0 = int(page.locator("[data-test=heat]").get_attribute("data-heat"))
    check(heat0 >= 28, "热烈一进门就有热度 %s" % heat0)

    page.click("[data-test=room-living]")
    page.wait_for_selector("[data-test=who-ask]")
    page.click("[data-test=who-ask]")
    page.wait_for_selector("[data-test=prompt]")
    living = page.locator("[data-test=prompt]").inner_text()
    check("束缚" not in living, "客厅避开边界")
    page.click("[data-test=deeper]")
    page.wait_for_selector("[data-test=prompt]")
    page.click("[data-test=hold]")
    page.wait_for_selector("[data-test=who-ask]")
    page.click("[data-act=leave]")
    page.wait_for_selector("[data-test=floor]")
    check("lit" in (page.locator("[data-test=room-living]").get_attribute("class") or ""), "客厅离开后还亮着")

    page.click("[data-test=room-living]")
    page.wait_for_selector("[data-test=who-listen]")
    page.click("[data-act=leave]")
    page.wait_for_selector("[data-test=floor]")

    page.click("[data-test=room-kitchen]")
    page.wait_for_selector("[data-test=spin]")
    page.click("[data-test=spin]")
    page.wait_for_selector("[data-test=did]", timeout=4000)
    dare = page.locator("[data-test=prompt]").inner_text()
    check("束缚" not in dare, "厨房动作避开束缚")
    check("轻声" not in dare, "热烈厨房不是轻声档")
    page.click("[data-test=did]")
    page.wait_for_selector("[data-test=spin]")
    page.click("[data-act=leave]")

    page.click("[data-test=room-balcony]")
    page.wait_for_selector("[data-test=thermo-lock-a]")
    page.click("[data-test=thermo-lock-a]")
    page.wait_for_selector("[data-test=got-phone]")
    page.click("[data-test=got-phone]")
    page.wait_for_selector("[data-test=thermo-lock-b]")
    page.click("[data-test=thermo-lock-b]")
    page.wait_for_selector("[data-test=thermo-result]")
    check("温度" in page.locator("[data-test=thermo-result]").inner_text(), "阳台揭开温度")
    page.click("[data-act=leave]")

    page.click("[data-test=room-bathroom]")
    page.wait_for_selector("[data-test=spin]")
    page.click("[data-test=spin]")
    page.wait_for_selector("[data-test=hand-self]", timeout=4000)
    page.click("[data-test=hand-other]")
    page.wait_for_selector("[data-test=did]")
    check("交给对方" in page.inner_text("body"), "真话可以交给对方")
    page.click("[data-test=reroll]")
    page.wait_for_selector("[data-test=spin]")
    page.click("[data-act=leave]")

    page.click("[data-test=room-bedroom]")
    page.wait_for_selector("[data-test=bed-act]")
    check("门没有锁" in page.inner_text("body") or "门没锁" in page.inner_text("body") or "卧室" in page.inner_text("body"), "卧室进得去")
    page.click("[data-test=bed-act]")
    page.wait_for_selector("[data-test=prompt]")
    bed = page.locator("[data-test=prompt]").inner_text()
    check("轻声" not in bed, "热烈卧室做事不是轻声")
    page.click("[data-test=did]")
    page.click("[data-act=leave]")
    page.wait_for_selector("[data-test=floor]")
    heat1 = int(page.locator("[data-test=heat]").get_attribute("data-heat"))
    check(heat1 > heat0, "走完几间后更热 %s -> %s" % (heat0, heat1))
    check(heat1 >= 48, "热烈夜里已经发烫 %s" % heat1)

    page.click("[data-test=stroll]")
    page.wait_for_selector("[data-test=stroll-board]")
    page.click("[data-test=stroll-roll]")
    page.wait_for_selector("[data-test=prompt]")
    page.click("[data-test=did]")
    page.click("[data-act=leave]")
    page.wait_for_selector("[data-test=close-night]")
    page.click("[data-test=close-night]")
    page.wait_for_selector("[data-yes]")
    page.click("[data-yes]")
    page.wait_for_selector("[data-test=memory-title]")
    mem = page.inner_text("body")
    check("今晚在这间公寓" in mem, "关灯后有记忆页")
    check("惩罚" not in mem and "丢人" not in mem and "检讨" not in mem, "记忆页不羞辱")
    check("客厅" in mem and "卧室" in mem, "亮过的房间写在这一页")
    shot = ROOT / "reports" / "rebuild" / "shots"
    shot.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(shot / "memory.png"))
    check(not any(errors), "热烈一夜没有页面错误 %s" % errors[:3])
    ctx.close()

    # ----- 安全词 -----
    ctx, page, errors = new_page(browser, 390, 844)
    page.goto(base, wait_until="networkidle")
    page.click("[data-test=enter-night]")
    page.click("[data-test=intensity-4]")
    page.click("[data-test=start-night]")
    page.wait_for_selector("[data-test=room-kitchen]")
    page.click("[data-test=room-kitchen]")
    page.wait_for_selector("[data-test=spin]")
    page.click("[data-test=spin]")
    page.wait_for_selector("[data-test=did]", timeout=4000)
    open_txt = page.locator("[data-test=prompt]").inner_text()
    page.click("[data-test=did]")
    safe = page.locator("[data-test=safety-word]")
    safe.wait_for(state="visible")
    box = safe.bounding_box()
    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    page.mouse.down()
    page.wait_for_timeout(1800)
    page.mouse.up()
    page.wait_for_selector("[data-test=memory-title]", timeout=4000)
    body = page.inner_text("body")
    check("先回去" in body or "灯" in body, "安全词关灯有记忆页")
    check(open_txt.split("\n")[0][:8] in body or "厨房" in body, "已经做过的还在")
    check("惩罚" not in body, "安全词没有惩罚")
    page.screenshot(path=str(shot / "safe.png"))
    check(not any(errors), "安全词路径没有页面错误 %s" % errors[:3])
    ctx.close()

    # ----- 温柔 -----
    ctx, page, errors = new_page(browser, 390, 844)
    page.goto(base, wait_until="domcontentloaded")
    page.click("[data-test=enter-night]")
    page.click("[data-test=intensity-1]")
    page.click("[data-test=start-night]")
    page.wait_for_selector("[data-test=heat]")
    check(int(page.locator("[data-test=heat]").get_attribute("data-heat")) < 22, "温柔开场还轻")
    page.click("[data-test=room-bedroom]")
    page.click("[data-test=bed-talk]")
    page.wait_for_selector("[data-test=prompt]")
    soft = page.locator("[data-test=prompt]").inner_text()
    check("轻声" in soft, "温柔卧室仍是轻声")
    import re
    check(not re.search(EXPLICIT, soft), "温柔句不露骨")
    page.click("[data-act=leave]")
    page.click("[data-test=room-kitchen]")
    page.wait_for_selector("[data-test=spin]")
    page.click("[data-test=spin]")
    page.wait_for_selector("[data-test=prompt]", timeout=4000)
    soft_dare = page.locator("[data-test=prompt]").inner_text()
    check("轻声" in soft_dare and not re.search(EXPLICIT, soft_dare), "温柔厨房也轻")
    ctx.close()

    # ----- 四个游戏门 + 带回今晚 -----
    ctx, page, errors = new_page(browser, 1280, 800)
    page.goto(base + "#door/dare", wait_until="domcontentloaded")
    page.wait_for_selector("[data-test=spin]", timeout=4000)
    page.click("[data-test=spin]")
    page.wait_for_selector("[data-test=did]", timeout=4000)
    page.click("[data-test=did]")
    page.wait_for_selector("[data-test=paste-tonight]")
    page.click("[data-test=paste-tonight]")
    page.wait_for_selector("[data-test=start-night]")
    page.click("[data-test=intensity-4]")
    page.click("[data-test=start-night]")
    page.wait_for_selector("[data-test=floor]")
    check("lit" in (page.locator("[data-test=room-kitchen]").get_attribute("class") or ""), "独立局带回后厨房亮了")
    check(not overflow(page), "1280 宽没有横向滚动")
    page.screenshot(path=str(shot / "plan.png"))

    page.click("[data-test=to-door]")
    page.wait_for_selector("[data-test=game-thermo]")
    for game, marker in (
        ("thermo", "thermo-lock-a"),
        ("truth", "spin"),
        ("stroll", "stroll-roll"),
    ):
        page.click("[data-test=game-%s]" % game)
        page.wait_for_selector("[data-test=%s]" % marker, timeout=4000)
        check(True, "游戏门 %s 打得开" % game)
        page.click("[data-act=leave]")
        page.wait_for_selector("[data-test=game-thermo]")
    page.goto(base + "arcade/", wait_until="domcontentloaded")
    page.wait_for_selector("[data-test=game-truth]", timeout=4000)
    check(page.url.endswith("#door") or "door" in page.url, "旧游戏厅地址进新游戏门")
    page.goto(base + "arcade/thermometer.html", wait_until="domcontentloaded")
    page.wait_for_selector("[data-test=thermo-lock-a]", timeout=4000)
    check("thermo" in page.url, "旧温度计地址进阳台")
    check(not any(errors), "游戏门没有页面错误 %s" % errors[:3])
    ctx.close()

    print("\n%s failed" % len(fails))
    return fails


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default=str(ROOT / "dist" / "rebuild"))
    ap.add_argument("--port", type=int, default=8877)
    args = ap.parse_args()
    import shutil
    dist = pathlib.Path(args.dist)
    arcade = dist / "arcade"
    arcade.mkdir(parents=True, exist_ok=True)
    for name in ("index.html", "thermometer.html", "classic.html"):
        src = ROOT / "arcade" / name
        if src.exists():
            shutil.copy2(src, arcade / name)
    from playwright.sync_api import sync_playwright

    with serve(args.dist, args.port) as base:
        with sync_playwright() as p:
            browser = launch(p)
            try:
                fails = run(base, browser)
            finally:
                browser.close()
    if fails:
        sys.exit(1)


if __name__ == "__main__":
    main()
