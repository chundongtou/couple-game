# -*- coding: utf-8 -*-
"""V8.2 prod3d2 · 3D 视觉自测台（不改仓库源码：复用 app/dev/board3d-prod-demo.html 的模块加载）。

用法:
  python harness.py --out shots/v82-prod3d2/v82 --tag after [--themes cloud,star,paper]

做的事：把 demo 页 body 换成指定尺寸的 host（默认按真实 table 的 366x552），用真实
App.Board3D 挂载（stageAim 与 table.js 同口径 nx=-0.6/ny=0.14），然后：
  overview（3 个主题）/ fly / cell45+bear（含 320/390/430 三种 host 尺寸）
每个状态截 host 元素图 + 抓几何量（棋盘占宽、上下留白、舞台格与小熊投影盒、是否压字）。
"""
import argparse
import json
import os
import subprocess
import time
from playwright.sync_api import sync_playwright

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PORT = 8793
BASE = "http://127.0.0.1:%d/couple-game/app/dev/board3d-prod-demo.html" % PORT

GEOM_JS = r"""
() => {
  const inst = window.App.Board3D._current();
  const sc = inst && inst.scene;
  const host = window.__host;
  if (!sc || !host) return null;
  const V = sc.camera.position.constructor;
  const W = sc.viewport.w, H = sc.viewport.h;
  const proj = (p) => { const q = p.clone().project(sc.camera); return { x: (q.x + 1) / 2 * W, y: (1 - q.y) / 2 * H }; };
  const box = (pts) => {
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    return { x0: +Math.min(...xs).toFixed(1), x1: +Math.max(...xs).toFixed(1),
             y0: +Math.min(...ys).toFixed(1), y1: +Math.max(...ys).toFixed(1) };
  };
  const b = sc.boardGroup;
  const ringPts = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    ringPts.push(proj(b.localToWorld(new V(Math.cos(a) * 3.30, 0.035, Math.sin(a) * 3.30))));
  }
  const board = box(ringPts);
  const out = {
    viewport: [W, H], phase: host.getAttribute('data-3d-phase'),
    board,
    boardFracW: +((board.x1 - board.x0) / W).toFixed(4),
    gapTop: +(board.y0).toFixed(1), gapBot: +(H - board.y1).toFixed(1),
    cardLeftPx: +(0.40 * W).toFixed(1)
  };
  /* 舞台格 + 小熊 + 格面字（局部→世界→投影） */
  if (sc.stageGroup && sc.stageGroup.visible) {
    const r = 24 * Math.PI / 180, hw = 0.21;
    const plate = [[-hw, -hw], [hw, -hw], [hw, hw], [-hw, hw]].map(([dx, dz]) => {
      const x = dx * Math.cos(r) + dz * Math.sin(r), z = -dx * Math.sin(r) + dz * Math.cos(r);
      return proj(sc.stageGroup.localToWorld(new V(x, 0.075, z)));
    });
    out.plate = box(plate);
    const gpts = [];
    for (const [dx, dz] of [[-0.07, -0.075], [0.07, -0.075], [0.07, 0.075], [-0.07, 0.075]]) {
      const x = 0.0336 + dx, z = 0.084 + dz;
      const rx = x * Math.cos(r) + z * Math.sin(r), rz = -x * Math.sin(r) + z * Math.cos(r);
      gpts.push(proj(sc.stageGroup.localToWorld(new V(rx, 0.076, rz))));
    }
    out.glyph = box(gpts);
    if (sc.bear && sc.bear.group) {
      const bb = [];
      for (const x of [-0.17, 0.17]) for (const y of [0.0, 0.52]) for (const z of [-0.17, 0.17]) {
        bb.push(proj(sc.bear.group.localToWorld(new V(x, y, z))));
      }
      out.bear = box(bb);
    }
    out.overlap = {};
    if (out.bear && out.glyph) {
      const ox = Math.max(0, Math.min(out.bear.x1, out.glyph.x1) - Math.max(out.bear.x0, out.glyph.x0));
      const oy = Math.max(0, Math.min(out.bear.y1, out.glyph.y1) - Math.max(out.bear.y0, out.glyph.y0));
      out.overlap.glyph = { px: +ox.toFixed(1), py: +oy.toFixed(1) };
    }
    if (out.bear) out.margins = {
      plateLeft: +out.plate.x0.toFixed(1),
      plateToCard: +(out.cardLeftPx - out.plate.x1).toFixed(1),
      bearLeft: +out.bear.x0.toFixed(1),
      bearToCard: +(out.cardLeftPx - out.bear.x1).toFixed(1)
    };
  }
  const dbg = window.App.Board3D._debug();
  out.perf = { fps: dbg.fps, drawCalls: dbg.drawCalls, triangles: dbg.triangles, quality: dbg.quality };
  out.lock = dbg.probe && dbg.probe.lock;
  out.flyMode = !!sc.flyMode;
  return out;
}
"""

SETUP_JS = r"""
(args) => {
  window.App.Board3D.unmount();
  document.body.innerHTML = '';
  const h = document.createElement('div');
  h.id = 'host';
  h.setAttribute('aria-hidden', 'true');
  h.style.cssText = 'position:relative;width:' + args.w + 'px;height:' + args.h + 'px;overflow:hidden;background:#05080d';
  document.body.style.cssText = 'margin:0;padding:0;background:#05080d;overflow:hidden';
  document.body.appendChild(h);
  window.__host = h;
  return true;
}
"""

MOUNT_JS = r"""
async (args) => {
  const st = window.__demo.state();
  const view = window.App.Flight.view(st, { reduced: false });
  const inst = await window.App.Board3D.mount(window.__host, {
    reduced: false, theme: args.theme, state: st, view,
    mode: 'quick', sound: false, adapt: false, shadows: true,
    stageAim: { nx: -0.6, ny: 0.14 }
  });
  window.__inst = inst;
  await new Promise((r) => setTimeout(r, 260));
  return !!inst;
}
"""

PLAY_JS = r"""
(args) => {
  const st = JSON.parse(JSON.stringify(window.__demo.state()));
  const p = st.pieces.find((x) => x.id === 'a:0');
  if (p) { p.squareId = args.from; p.arrived = false; }
  window.App.Board3D.setState(st, window.App.Flight.view(st, { reduced: false }));
  const evs = [{ type: 'move', pieceId: 'a:0', path: args.path }];
  if (args.prompt) evs.push({ type: 'prompt', prompt: { kind: 'cell', type: 'dare' } });
  window.__phaseLog = [];
  window.__p = window.App.Board3D.play(evs);
  return true;
}
"""


def start_server():
    p = subprocess.Popen(
        [PY, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
        cwd=REPO, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    time.sleep(1.2)
    return p


PY = r"C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"


def wait_phase(pg, want, timeout=12.0):
    t0 = time.time()
    while time.time() - t0 < timeout:
        ph = pg.evaluate("() => window.__host.getAttribute('data-3d-phase')")
        if ph in (want if isinstance(want, (list, tuple)) else [want]):
            return ph
        time.sleep(0.05)
    return None


def shot(pg, out_dir, name, res, extra_wait=0.0):
    if extra_wait:
        pg.wait_for_timeout(int(extra_wait * 1000))
    path = os.path.join(out_dir, name + ".png")
    pg.locator("#host").screenshot(path=path)
    try:
        res[name] = pg.evaluate(GEOM_JS)
    except Exception as e:  # noqa: BLE001
        res[name] = {"error": str(e)[:200]}
    return path


def run(size, out_dir, tag, themes):
    name, w, h = size
    res = {"size": name, "viewport": [w, h]}
    errs = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="msedge", headless=True)
        ctx = b.new_context(viewport={"width": max(w, 430), "height": max(h, 700)},
                            device_scale_factor=2, locale="zh-CN")
        pg = ctx.new_page()
        pg.on("console", lambda m: errs.append((m.type, m.text[:200])) if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: errs.append(("pageerror", str(e)[:200])))
        pg.goto(BASE + "?sound=0&adapt=0", wait_until="load")
        pg.wait_for_function("() => document.body && document.body.getAttribute('data-ready') === '1'", timeout=30000)
        pg.wait_for_timeout(400)
        pg.evaluate(SETUP_JS, {"w": w, "h": h})
        mounted = pg.evaluate(MOUNT_JS, {"theme": themes[0]})
        res["mounted"] = mounted
        pg.wait_for_timeout(500)

        shot(pg, out_dir, "%s-%s-overview" % (tag, name), res)
        for th in themes[1:]:
            pg.evaluate("(t) => window.App.Board3D.setTheme(t)", th)
            pg.wait_for_timeout(700)
            shot(pg, out_dir, "%s-%s-overview-%s" % (tag, name, th), res)
            pg.evaluate("(t) => window.App.Board3D.setTheme(t)", themes[0])
            pg.wait_for_timeout(500)

        # fly：move ring:23 -> ring:25，飞行中截图（并采样 lock 证据）
        pg.evaluate(PLAY_JS, {"from": "ring:23", "path": ["ring:24", "ring:25"], "prompt": False})
        ph = wait_phase(pg, "fly", 12)
        res["flyPhase"] = ph
        if ph:
            pg.wait_for_timeout(260)
            shot(pg, out_dir, "%s-%s-fly" % (tag, name), res)
        pg.wait_for_function("() => window.__host.getAttribute('data-3d-phase') === 'idle'", timeout=30000)
        pg.wait_for_timeout(200)

        # cell45 + bear：带 prompt 的 move → 舞台升起 + 小熊探头
        pg.evaluate(PLAY_JS, {"from": "ring:23", "path": ["ring:24", "ring:25"], "prompt": True})
        ph = wait_phase(pg, ["cell45", "bear"], 20)
        res["cellPhase"] = ph
        shot(pg, out_dir, "%s-%s-cell45" % (tag, name), res, extra_wait=0.55)
        ph2 = wait_phase(pg, "bear", 10)
        res["bearPhase"] = ph2
        shot(pg, out_dir, "%s-%s-bear" % (tag, name), res, extra_wait=1.1)
        # 小熊区域放大图（便于人眼确认不压字）
        try:
            bb = res.get("%s-%s-bear" % (tag, name), {}).get("plate")
            if bb:
                pad = 26
                pg.screenshot(path=os.path.join(out_dir, "%s-%s-bear-zoom.png" % (tag, name)), clip={
                    "x": max(0, bb["x0"] - pad), "y": max(0, bb["y0"] - pad),
                    "width": bb["x1"] - bb["x0"] + pad * 2, "height": bb["y1"] - bb["y0"] + pad * 2.6
                })
        except Exception as e:  # noqa: BLE001
            res["zoomError"] = str(e)[:120]
        pg.evaluate("() => window.App.Board3D.returnToOverview()")
        pg.wait_for_timeout(1200)

        res["errors"] = errs
        b.close()
    with open(os.path.join(out_dir, "%s-%s.json" % (tag, name)), "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=1)
    return res


SIZES = {
    "390x844": (366, 552),
    "320x568": (296, 303),
    "430x932": (406, 640),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="shots/v82-prod3d2/v82")
    ap.add_argument("--tag", default="after")
    ap.add_argument("--sizes", default="390x844,320x568,430x932")
    ap.add_argument("--themes", default="cloud,star,paper")
    args = ap.parse_args()
    out_dir = os.path.join(REPO, args.out)
    os.makedirs(out_dir, exist_ok=True)
    srv = start_server()
    try:
        summary = {}
        for s in args.sizes.split(","):
            w, h = SIZES[s]
            summary[s] = run((s, w, h), out_dir, args.tag, args.themes.split(","))
    finally:
        srv.terminate()
    print(json.dumps({k: {kk: v.get(kk) for kk in ("boardFracW", "gapTop", "gapBot", "errors")}
                      for k, v in summary.items()}, ensure_ascii=False, indent=1))
    print("OK ->", out_dir)


if __name__ == "__main__":
    main()
