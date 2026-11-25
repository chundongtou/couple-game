# -*- coding: utf-8 -*-
"""V8 prod3d · 真实 table 集成验证/截图（390×844）：overview / fly / cell45+bear 持卡 / 回桌。"""
import json
import os
import time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8777/dist/rebuild-v8-prod3d-check/index.html"
OUT = "shots/v8/prod3d/table-real"
os.makedirs(OUT, exist_ok=True)
errs = []
res = {}

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", headless=True)
    pg = b.new_page(viewport={"width": 390, "height": 844}, locale="zh-CN", device_scale_factor=2)
    pg.on("console", lambda m: errs.append((m.type, m.text[:240])) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append(("pageerror", str(e)[:240])))
    pg.goto(BASE, wait_until="load")
    pg.wait_for_timeout(900)
    try:
        pg.wait_for_selector("[data-test=rules-ok]", timeout=2500)
        pg.click("[data-test=rules-ok]")
        pg.wait_for_timeout(300)
    except Exception:
        pass
    # Beta 默认 board3d=off（table3d 口径）；真实联调显式打开发布前要撤的开关
    pg.evaluate("() => { try { window.App.Store.saveSettings({ board3d: 'on' }); } catch (e) {} }")
    pg.click("[data-test=start]")
    pg.wait_for_function("() => document.querySelector('[data-test=table]') && document.querySelector('[data-test=board3d]')", timeout=30000)
    pg.wait_for_function("() => window.App && window.App.Board3D && window.App.Board3D.mounted", timeout=30000)
    pg.wait_for_function("() => { const h=document.querySelector('[data-test=board3d]'); return h && h.getAttribute('data-3d-ready')==='1'; }", timeout=30000)
    pg.wait_for_timeout(2200)

    def measure(tag):
        return pg.evaluate("""() => {
          const host=document.querySelector('[data-test=board3d]');
          const inst=window.App.Board3D._current();
          const sc=inst.scene;
          const r=host?host.getBoundingClientRect():null;
          const canvas=host?host.querySelector('canvas'):null;
          const V=sc.camera.position.constructor;
          const pts=[3.23,-3.23].map(x=>sc.boardGroup.localToWorld(new V(x,0,0)).project(sc.camera));
          const py=[3.23,-3.23].map(z=>sc.boardGroup.localToWorld(new V(0,0,z)).project(sc.camera));
          return {
            host: r?{w:r.width,h:r.height,x:r.x,y:r.y}:null,
            canvas: canvas?{w:canvas.width,h:canvas.height,cssW:canvas.getBoundingClientRect().width,cssH:canvas.getBoundingClientRect().height}:null,
            viewport: sc.viewport, aspect: +sc.rig.aspect.toFixed(3), radius: +sc.rig.state.radius.toFixed(2),
            boardPxW: +((Math.abs(pts[0].x-pts[1].x)*sc.viewport.w/2).toFixed(1)),
            boardFracW: +((Math.abs(pts[0].x-pts[1].x)/2).toFixed(3)),
            boardPxH: +((Math.abs(py[0].y-py[1].y)*sc.viewport.h/2).toFixed(1)),
            phase: document.querySelector('[data-test=board3d]').getAttribute('data-3d-phase'),
            fit: (()=>{const i=window.App.Board3D._current(); return {sizeW:i._sizeW,sizeH:i._sizeH,fitNeeded:!!i._fitNeeded,hasTimer:!!i._sizeTimer,fitTimer:!!i._fitTimer,fitPending:!!(i.director&&i.director._fitPending),busy:!!(i.director&&i.director.busy),holding:!!(i.director&&i.director.holding)};})(),
            b3: window.App.Board3D._debug ? (()=>{const d=window.App.Board3D._debug();return {phase:d.phase,ready:d.ready,holding:d.holding,mounted:d.mounted,drawCalls:d.drawCalls};})() : null,
            board3dStatus: window.__V6_TEST__ ? window.__V6_TEST__.board3d() : null
          };
        }""")

    res["overview"] = measure("overview")
    pg.screenshot(path=OUT + "/R0-overview-390x844.png")

    # 真实引擎：6 起飞 -> 选子 -> 2 落到 truth 格 -> 真实 CellStage
    pg.evaluate("() => window.__V6_TEST__.forceDie(6)")
    pg.click("[data-test=roll]")
    pg.wait_for_selector("[data-test=piece-choice]", timeout=20000)
    pg.click("[data-test=piece-choice]")
    pg.wait_for_function("() => !window.__V6_TEST__.isBusy()", timeout=30000)
    pg.wait_for_timeout(600)
    res["afterTakeoff"] = measure("afterTakeoff")
    pg.evaluate("() => window.__V6_TEST__.forceDie(2)")
    pg.click("[data-test=roll]")
    fly_shot = False
    cell_shot = False
    t0 = time.time()
    while time.time() - t0 < 30:
        ph = pg.evaluate("() => document.querySelector('[data-test=board3d]').getAttribute('data-3d-phase')")
        if ph == "fly" and not fly_shot:
            pg.screenshot(path=OUT + "/R1-fly-390x844.png")
            res["fly"] = measure("fly")
            fly_shot = True
        if ph in ("cell45", "bear") and not cell_shot:
            pg.screenshot(path=OUT + "/R2-cell45-390x844.png")
            res["cell45"] = measure("cell45")
            cell_shot = True
            break
        time.sleep(0.06)
    pg.wait_for_selector("[data-test=prompt-done]", timeout=30000)
    pg.wait_for_timeout(700)
    res["bearHeld"] = measure("bearHeld")
    res["prompt"] = pg.evaluate("""() => ({
      kicker: (document.querySelector('[data-test=prompt-kicker]')||{}).textContent || '',
      actor: (document.querySelector('[data-test=prompt-actor]')||{}).textContent || '',
      text: (document.querySelector('[data-test=prompt-text]')||{}).textContent || '',
      cellStage: !!document.querySelector('[data-test=cell-stage], .cell-stage, .v6-cell-stage')
    })""")
    pg.screenshot(path=OUT + "/R3-bear-hold-card-390x844.png")
    # 持卡 1.2s 后应仍在 bear（相机停住）
    pg.wait_for_timeout(1200)
    res["bearStillHeld"] = measure("bearStillHeld")
    # 做了 -> 回桌
    pg.click("[data-test=prompt-done]")
    pg.wait_for_function("() => !window.__V6_TEST__.isBusy()", timeout=30000)
    pg.wait_for_timeout(2000)
    res["afterDone"] = measure("afterDone")
    res["afterDoneInfo"] = pg.evaluate("() => { const s=window.__V6_TEST__.getState(); return {phase:s.phase, turn:s.turn, cards:s.cardsProcessed, heat:s.meta&&s.meta.heat}; }")
    pg.screenshot(path=OUT + "/R4-after-done-390x844.png")

    # 320×568 + 430×932 overview（同一构建）
    for w, h in ((320, 568), (430, 932)):
        pg2 = b.new_page(viewport={"width": w, "height": h}, locale="zh-CN", device_scale_factor=2)
        pg2.goto(BASE, wait_until="load")
        pg2.wait_for_timeout(700)
        try:
            pg2.wait_for_selector("[data-test=rules-ok]", timeout=2500)
            pg2.click("[data-test=rules-ok]")
        except Exception:
            pass
        pg2.evaluate("() => { try { window.App.Store.saveSettings({ board3d: 'on' }); } catch (e) {} }")
        pg2.click("[data-test=start]")
        pg2.wait_for_function("() => window.App && window.App.Board3D && window.App.Board3D.mounted", timeout=30000)
        pg2.wait_for_timeout(2200)
        m = pg2.evaluate("""() => {
          const host=document.querySelector('[data-test=board3d]');
          const sc=window.App.Board3D._current().scene;
          const V=sc.camera.position.constructor;
          const pts=[3.23,-3.23].map(x=>sc.boardGroup.localToWorld(new V(x,0,0)).project(sc.camera));
          return {host:{w:host.clientWidth,h:host.clientHeight}, boardPxW:+(Math.abs(pts[0].x-pts[1].x)*sc.viewport.w/2).toFixed(1), boardFracW:+(Math.abs(pts[0].x-pts[1].x)/2).toFixed(3), radius:+sc.rig.state.radius.toFixed(2), aspect:+sc.rig.aspect.toFixed(3)};
        }""")
        res[f"overview{w}"] = m
        pg2.screenshot(path=OUT + f"/R5-overview-{w}x{h}.png")
        pg2.close()

    b.close()

res["errors"] = errs
with open(OUT + "/report.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)
print(json.dumps({k: res[k] for k in ("overview", "afterDone", "overview320", "overview430", "errors") if k in res}, ensure_ascii=False, indent=2))
