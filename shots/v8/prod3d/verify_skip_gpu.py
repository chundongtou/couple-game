# -*- coding: utf-8 -*-
"""V8 prod3d · 定向验证：skip 即时、正常主路径不回归、真 GPU（Intel Arc D3D11）帧率。"""
import json
import time
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8777/app/dev/board3d-prod-demo.html"
OUT = "shots/v8/prod3d"
errors = []

def attach(page, tag):
    page.on("console", lambda m: errors.append([tag, m.type, m.text[:240]]) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: errors.append([tag, "pageerror", str(e)[:240]]))

def wait_ready(pg):
    pg.wait_for_function("() => document.body.getAttribute('data-ready') === '1'", timeout=45000)
    pg.wait_for_timeout(600)

res = {}
with sync_playwright() as p:
    # ---- skip 即时（SwiftShader，慢帧也能快速落终态） ----
    b = p.chromium.launch(channel="msedge", headless=True, args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 430, "height": 932}, locale="zh-CN", device_scale_factor=1)
    attach(pg, "skip")
    pg.goto(URL + "?adapt=0", wait_until="load")
    wait_ready(pg)
    pg.evaluate("() => { void window.__demo.roll(6); }")
    pg.wait_for_function("() => document.querySelector('[data-test=stage]').getAttribute('data-3d-phase') === 'roll'", timeout=20000)
    t0 = time.time()
    pg.evaluate("() => window.App.Board3D.skip()")
    pg.wait_for_function("() => window.__demo.info().phase === 'idle'", timeout=15000)
    skip_ms = round((time.time() - t0) * 1000)
    res["skipRollMs"] = skip_ms
    res["skipInfo"] = pg.evaluate("() => window.__demo.info()")
    # 主路径回归：roll(6) -> choose（skip 后状态可能停在 choose-piece）
    if res["skipInfo"]["awaiting"] == "choose-piece" and pg.locator("[data-test=piece-choice]").count():
        pg.click("[data-test=piece-choice]")
        pg.wait_for_function("() => window.__demo.info().awaiting === 'roll'", timeout=30000)
    res["afterSkipState"] = pg.evaluate("() => window.__demo.info()")
    pg.close()
    b.close()

    # ---- 真 GPU 帧率（不强制 SwiftShader） ----
    b2 = p.chromium.launch(channel="msedge", headless=True)
    pg2 = b2.new_page(viewport={"width": 430, "height": 932}, locale="zh-CN", device_scale_factor=2)
    attach(pg2, "gpu")
    pg2.goto(URL, wait_until="load")
    wait_ready(pg2)
    env = pg2.evaluate("""() => {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2');
      const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      return { renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null,
               dpr: window.devicePixelRatio, cores: navigator.hardwareConcurrency };
    }""")
    pg2.evaluate("""() => {
      window.__samples = []; window.__sampling = true;
      const tick = (now) => { if (!window.__sampling) return; window.__samples.push(now); requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }""")
    t0 = time.time()
    auto_res = pg2.evaluate("async () => await window.__demo.auto(10, [6,2,5,6,3,4,6,1,5,2])")
    auto_sec = round(time.time() - t0, 1)
    samples = pg2.evaluate("() => { window.__sampling = false; return window.__samples; }")
    deltas = [samples[i] - samples[i - 1] for i in range(1, len(samples))]
    sd = sorted(deltas)
    p95 = sd[min(len(sd) - 1, int(len(sd) * 0.95))] if sd else None
    raf = {
        "frames": len(deltas),
        "avgMs": round(sum(deltas) / len(deltas), 2) if deltas else None,
        "p95Ms": round(p95, 2) if p95 else None,
        "maxMs": round(max(deltas), 2) if deltas else None,
        "long25": sum(1 for d in deltas if d > 25),
        "long25Ratio": round(sum(1 for d in deltas if d > 25) / len(deltas), 3) if deltas else None,
        "fps": round(len(deltas) * 1000 / max(1, samples[-1] - samples[0]), 1) if len(samples) > 1 else None
    }
    dbg = pg2.evaluate("() => window.App.Board3D._debug()")
    res["gpu"] = {
        "env": env, "auto": auto_res, "autoSec": auto_sec, "raf": raf,
        "quality": dbg.get("quality"), "dpr": dbg.get("dpr"),
        "render": dbg.get("perf", {}).get("render"),
        "phaseStats": dbg.get("perf", {}).get("phases", {})
    }
    pg2.screenshot(path=OUT + "/15-gpu-perf-430.png")
    pg2.close()
    b2.close()

res["errors"] = errors
with open(OUT + "/verify_skip_gpu.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)
print(json.dumps(res, ensure_ascii=False, indent=2)[:5000])
