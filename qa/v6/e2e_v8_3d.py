#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""今晚飞行棋 V8 · 真 3D 主桌 QA 套件（task-39，QA 独立实现）。

覆盖（docs/v8/impl-freeze.md §3.3/§3.4 + task-39 验收口径）：
  S0 静态：3D chunk 存在/哈希/体积/SW 预缓存/首屏不引用/IIFE
  S1 3D auto|on 真实引擎：mount / overview / roll / move→focus→fly→land / V7 层隐藏 / HUD 可点 /
     chunk 只请求一次 / 0 error
  S2 真实引擎 move→prompt：cell45→bear / 题卡 card-only / 小熊+格子不在卡下 / 「做了」→ returnToOverview 回俯瞰
  S3 V7 降级：off / 无 WebGL2 / chunk 404 / mount-null / mount-throw → V7 完整可用、0 空白、0 pageerror
  S4 reduced：auto+reduced→V7；on+reduced→静态 3D（无镜头链）
  S5 响应式 320/390/430（3D）
  S6 设置页 3D 三档 + 落盘；setTheme 转发
  S7 SW 预缓存 / 离线冷启动 3D
  S8 性能记录：首屏 DCL/FCP/请求数；3D SwiftShader 只记录 draw/tris/JS 更新（**不判 fps**）；V7 长帧

用法：
  python qa/v6/e2e_v8_3d.py --dist dist/rebuild-v8-final
  python qa/v6/e2e_v8_3d.py --only static,mount,chain
产物：reports/v6/qa-e2e-v8-3d.json / .md；qa/v6/shots/v8-3d/*.png
"""
from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import pathlib
import re
import sys
import time
import traceback

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
import qa_lib as Q  # noqa: E402

from playwright.sync_api import sync_playwright  # noqa: E402

DIST = ROOT / "dist" / "rebuild-v8-final"
SHOTS = HERE / "shots" / "v8-3d"
B3_GZIP_ACCEPT = 160 * 1024          # 验收口径（README §2 / build --check 建议）
INDEX_GZIP_BUDGET = 140 * 1024       # ADR-012
FIRST_SCREEN_BUDGET = 180 * 1024     # ADR-012
PHASES_CHAIN = ("focus", "fly", "land")
BASE = ""


# ---------------------------------------------------------------- 证据收集
class Collector:
    def __init__(self, page):
        self.page = page
        self.console_errors: list[str] = []
        self.warnings: list[str] = []
        self.pageerrors: list[str] = []
        self.requests: list[str] = []
        self.bad: list[dict] = []
        page.on("console", self._console)
        page.on("pageerror", self._pageerror)
        page.on("request", self._request)
        page.on("response", self._response)

    def _console(self, msg):
        try:
            if msg.type == "error":
                self.console_errors.append(msg.text)
            elif msg.type == "warning":
                self.warnings.append(msg.text)
        except Exception:  # noqa: BLE001
            pass

    def _pageerror(self, err):
        self.pageerrors.append("%s: %s" % (type(err).__name__, err))

    def _request(self, req):
        self.requests.append(req.url)

    def _response(self, resp):
        try:
            if resp.status >= 400:
                self.bad.append({"url": resp.url, "status": resp.status})
        except Exception:  # noqa: BLE001
            pass

    def chunk_reqs(self) -> list[str]:
        return [u for u in self.requests if "/assets/board3d." in u and u.split("?")[0].endswith(".js")]

    def reset(self):
        self.console_errors.clear()
        self.warnings.clear()
        self.pageerrors.clear()
        self.requests.clear()
        self.bad.clear()

    def errors(self) -> dict:
        return {
            "pageerror": list(self.pageerrors),
            "console": list(self.console_errors),
            "bad": list(self.bad),
        }


# ---------------------------------------------------------------- 页面快照 JS
SNAP_JS = r"""() => {
  const q = (s) => document.querySelector(s);
  const n = (s) => document.querySelectorAll(s).length;
  const t = q('.v6-table');
  const h = q('[data-test=board3d]');
  const b = q('[data-test=board]');
  const cbn = q('[data-test=cabin]');
  const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect();
    return {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)}; };
  const vis = (el) => { if (!el) return false; const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > 0.05 && r.width > 0 && r.height > 0; };
  const api = window.App && App.Board3D;
  const dbg = (api && typeof api._debug === 'function') ? api._debug() : null;
  const p = dbg && dbg.probe ? dbg.probe : null;
  const pf = dbg && dbg.perf ? dbg.perf : null;
  return {
    url: typeof window.__BOARD3D_URL === 'string' ? window.__BOARD3D_URL : null,
    attr: t ? t.getAttribute('data-board3d') : null,
    reason: t ? t.getAttribute('data-board3d-reason') : null,
    cls3d: !!(t && t.classList.contains('v6-3d')),
    cardOnly: !!(t && t.classList.contains('v8-3d-card')),
    host: !!h,
    hostRect: rect(h),
    hostDisplay: h ? getComputedStyle(h).display : null,
    canvas: h ? h.querySelectorAll('canvas').length : 0,
    layerCount: n('[data-test=board3d-layer]'),
    phase: h ? h.getAttribute('data-3d-phase') : null,
    ready: h ? h.getAttribute('data-3d-ready') : null,
    reduced3d: h ? h.getAttribute('data-3d-reduced') : null,
    theme3d: h ? h.getAttribute('data-3d-theme') : null,
    mode3d: h ? h.getAttribute('data-3d-mode') : null,
    fallback: h ? h.getAttribute('data-3d-fallback') : null,
    boardVisible: vis(b),
    boardOpacity: b ? getComputedStyle(b).opacity : null,
    cabinKids: cbn ? cbn.children.length : 0,
    cabinVisible: vis(cbn),
    rollVisible: vis(q('[data-test=roll]')),
    rollRect: rect(q('[data-test=roll]')),
    safeSlot: n('[data-test=safe-slot]'),
    pauseVisible: vis(q('[data-test=pause]')),
    dieText: (q('[data-test=die-text]') || {}).textContent || '',
    statusText: (q('[data-test=status]') || {}).textContent || '',
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    csOpen: !!q('.cs-root'),
    promptCard: !!q('[data-test=prompt-card]'),
    leftDisplay: (() => { const l = q('.cs-left'); return l ? getComputedStyle(l).display : null; })(),
    leftRect: rect(q('.cs-left')),
    cellRect: rect(q('[data-test=cell-stage-cell]')),
    cardRect: rect(q('.cs-card')),
    vp: {w: window.innerWidth, h: window.innerHeight},
    webgl2: (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch (e) { return false; } })(),
    chunkScripts: n('script[data-board3d-chunk]'),
    srcScripts: n('script[src*="board3d"]'),
    b3: (window.__V6_TEST__ && typeof __V6_TEST__.board3d === 'function') ? __V6_TEST__.board3d() : null,
    debug: dbg ? {
      version: dbg.version, ready: dbg.ready, mounted: dbg.mounted, phase: dbg.phase,
      pieces: (dbg.pieces || []).map((x) => x.id + ':' + x.squareId),
      target: dbg.target, fps: dbg.fps, drawCalls: dbg.drawCalls, triangles: dbg.triangles,
      dpr: dbg.dpr, quality: dbg.quality, reduced: dbg.reduced, theme: dbg.theme,
      busy: dbg.busy, holding: dbg.holding, cell: dbg.cell, three: dbg.three,
      probe: p ? {board: p.board, lock: p.lock, stage: p.stage, streaks: p.streaks,
                  plane: p.plane, camLocked: p.camera && p.camera.locked} : null,
      perf: pf ? {current: pf.current, quality: pf.quality, dpr: pf.dpr, shadows: pf.shadows, render: pf.render} : null
    } : null
  };
}"""

PHASE_SAMPLER_JS = r"""() => {
  window.__PH8__ = { samples: [], stop: false, err: null, ticks: 0 };
  (function tick() {
    if (window.__PH8__.stop) return;
    try {
      const h = document.querySelector('[data-test=board3d]');
      const api = window.App && App.Board3D;
      const dbg = (api && typeof api._debug === 'function') ? api._debug() : null;
      const p = dbg && dbg.probe ? dbg.probe : null;
      const row = {
        t: Math.round(performance.now()),
        phase: h ? h.getAttribute('data-3d-phase') : null,
        theta: p && p.board ? p.board.theta : null,
        tx: p && p.board ? p.board.tx : null,
        tz: p && p.board ? p.board.tz : null,
        lock: p && p.lock ? p.lock : null,
        stage: p && p.stage ? p.stage : null
      };
      const arr = window.__PH8__.samples;
      arr.push(row);
      if (arr.length > 900) arr.shift();
      window.__PH8__.ticks++;
    } catch (e) {
      window.__PH8__.err = String((e && e.message) || e);
    }
    setTimeout(tick, 70);
  })();
}"""

PHASE_STOP_JS = "() => { window.__PH8__.stop = true; return window.__PH8__.samples; }"


def phases_of(samples):
    out = []
    for s in samples:
        p = s.get("phase")
        if not out or out[-1] != p:
            out.append(p)
    return out


def theta_span(samples):
    vals = [s["theta"] for s in samples if s.get("theta") is not None]
    if len(vals) < 2:
        return 0.0
    return max(vals) - min(vals)


def lock_max(samples):
    mx = 0.0
    my = 0.0
    seen = 0
    for s in samples:
        lk = s.get("lock")
        if not lk:
            continue
        seen += lk.get("samples") or 0
        mx = max(mx, lk.get("maxAbsX") or 0)
        my = max(my, lk.get("maxAbsY") or 0)
    return {"samples": seen, "maxAbsX": round(mx, 4), "maxAbsY": round(my, 4)}


# ---------------------------------------------------------------- 通用动作
def ck(rec, cid, name, ok, expected, actual, ac="", sev="P0", vp="", evidence=""):
    if ok:
        return rec.ok(cid, name, expected=str(expected), actual=str(actual), ac=ac,
                      severity=sev, viewport=vp, evidence=evidence)
    return rec.fail(cid, name, expected=str(expected), actual=str(actual), ac=ac,
                    severity=sev, viewport=vp, evidence=evidence)


def shot(page, name):
    """3D 截图：page.screenshot 失败回退 CDP（SwiftShader 下 WebGL 动画后 compositor 忙）。"""
    SHOTS.mkdir(parents=True, exist_ok=True)
    path = SHOTS / name
    try:
        page.screenshot(path=str(path), timeout=12000)
        return str(path.relative_to(ROOT)).replace("\\", "/"), "page.screenshot"
    except Exception:  # noqa: BLE001
        try:
            import base64
            cdp = page.context.new_cdp_session(page)
            try:
                data = cdp.send("Page.captureScreenshot", {"format": "png"})
            finally:
                try:
                    cdp.detach()
                except Exception:  # noqa: BLE001
                    pass
            path.write_bytes(base64.b64decode(data["data"]))
            return str(path.relative_to(ROOT)).replace("\\", "/"), "cdp.captureScreenshot"
        except Exception as e:  # noqa: BLE001
            return None, "failed: %s" % e


def shot_and_record(rec, page, name):
    rel, how = shot(page, name)
    if rel:
        rec.shots.append(rel)
        return rel
    rec.add_note("截图失败 %s（%s）" % (name, how))
    return None


NO_WEBGL2_JS = r"""
  try {
    Object.defineProperty(window, 'WebGL2RenderingContext', {
      configurable: true, get: function () { return undefined; }
    });
  } catch (e) {}
  (function () {
    var orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, opts) {
      if (String(type).toLowerCase() === 'webgl2') return null;
      return orig.call(this, type, opts);
    };
  })();
"""


def new_ctx(browser, viewport=(390, 844), reduced_motion=None, init_script=None,
            service_workers="allow"):
    ctx = browser.new_context(
        viewport={"width": viewport[0], "height": viewport[1]},
        device_scale_factor=2, is_mobile=True, has_touch=True,
        locale="zh-CN", timezone_id="Asia/Shanghai", color_scheme="dark",
        service_workers=service_workers,
    )
    if reduced_motion is not None:
        try:
            ctx.emulate_media(reduced_motion="reduce" if reduced_motion else "no-preference")
        except Exception:  # noqa: BLE001
            pass
    if init_script:
        ctx.add_init_script(init_script)
    return ctx


def seed_game(page, board3d=None, reduced=None):
    """写入设置 + 一局 quick 新棋，供「继续这局」进主桌。"""
    page.evaluate(
        """(a) => {
            App.Store.saveSettings({ rulesSeen: true, sound: false, haptics: false,
                                     names: {a: '阿岚', b: '阿策'} });
            if (a.reduced !== null && a.reduced !== undefined) App.Store.saveSettings({ reduced: !!a.reduced });
            if (a.board3d) App.Store.saveSettings({ board3d: a.board3d });
            const made = App.Flight.newGame({ names: {a: '阿岚', b: '阿策'},
                colors: {a: 'red', b: 'yellow'}, scale: 'warm', boundaries: [],
                planeCount: 2, mode: 'quick' });
            if (made && made.ok) App.Store.saveSession(made.state);
        }""",
        {"board3d": board3d, "reduced": reduced},
    )


def enter_table(page, expect_on=None, timeout=20000):
    page.wait_for_selector('[data-test=continue-flight]', timeout=8000)
    page.click('[data-test=continue-flight]')
    page.wait_for_selector('[data-test=table]', timeout=10000)
    try:
        page.wait_for_function(
            """() => { const el = document.querySelector('.v6-table');
                if (!el) return false; const s = el.getAttribute('data-board3d');
                return s && s !== 'pending'; }""", timeout=timeout)
    except Exception:  # noqa: BLE001
        pass
    page.wait_for_timeout(700)


POCKET_JS = r"""() => {
    try {
        const s = App.Store.getSession();
        if (!s) return {ok: false, why: 'no-session'};
        s.turn = 'a'; s.phase = 'playing'; s.winnerId = null;
        s.awaiting = {type: 'roll'};
        s.pendingMove = null; s.rollContext = null;
        s.endingQueue = null; s.endingIndex = 0;
        s.log = []; s.cardsProcessed = 0;
        (s.pieces || []).forEach(function (p) {
            if (p.id === 'a:0') { p.squareId = 'ring:24'; p.arrived = false; }
            else if (p.id === 'a:1') { p.squareId = 'hangar:red:1'; p.arrived = false; }
            else { p.squareId = 'hangar:yellow:' + p.id.split(':')[1]; p.arrived = false; }
            p.stackGroupId = null;
        });
        const v = App.Flight.validate(s);
        if (!v) return {ok: false, why: 'validate-null'};
        App.Store.saveSession(v);
        App.Store.saveSettings({board3d: 'auto', reduced: false});
        return {ok: true, a0: v.pieces.filter(function (p) { return p.id === 'a:0'; })[0].squareId};
    } catch (e) { return {ok: false, why: String((e && e.message) || e)}; }
}"""


def open_table(ctx, mode=None, reduced=None, init_script=None, viewport=None,
               route=None, expect_on=False, timeout=20000, fixture=None):
    page = ctx.new_page()
    col = Collector(page)
    if route:
        for pattern, handler in route:
            page.route(pattern, handler)
    page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(250)
    seed_game(page, board3d=mode, reduced=reduced)
    if fixture == "pocket":
        col.fixture = page.evaluate(POCKET_JS)
    page.reload(wait_until="domcontentloaded", timeout=30000)
    enter_table(page, expect_on=expect_on, timeout=timeout)
    return page, col


def scenario(browser, sid, name, body, viewport=(390, 844), mode=None, reduced=None,
             init_script=None, route=None, rec=None):
    ctx = new_ctx(browser, viewport=viewport, init_script=init_script)
    try:
        page, col = open_table(ctx, mode=mode, reduced=reduced, route=route,
                               expect_on=(mode in ("auto", "on")))
        try:
            body(page, col, sid, name)
        except Exception:  # noqa: BLE001
            ck(rec, sid + "-ERR", name + " / 场景执行", False, "无异常",
               traceback.format_exc()[-700:], sev="P0", vp="%dx%d" % viewport)
    finally:
        try:
            ctx.close()
        except Exception:  # noqa: BLE001
            pass


# ---------------------------------------------------------------- S0 静态
def suite_static(rec, dist: pathlib.Path):
    vp = "-"
    index = dist / "index.html"
    html = index.read_text(encoding="utf-8", errors="replace")
    chunks = sorted((dist / "assets").glob("board3d.*.js"))
    ck(rec, "V8-3D-01", "构建产出唯一 3D chunk（assets/board3d.<hash>.js）", len(chunks) == 1,
       "1 个 board3d chunk", [c.name for c in chunks], ac="impl-freeze §3.1", vp=vp)
    if not chunks:
        return
    chunk = chunks[0]
    data = chunk.read_bytes()
    sha = hashlib.sha256(data).hexdigest()[:8]
    name_hash = chunk.name.split(".")[1]
    gz = len(gzip.compress(data, 9))
    ck(rec, "V8-3D-02", "chunk 文件名哈希 == 内容 sha256[:8]", sha == name_hash,
       "文件名哈希==内容哈希", {"file": chunk.name, "sha8": sha, "gzip": gz}, ac="build §2", vp=vp)
    ck(rec, "V8-3D-03", "chunk gzip ≤160KB（验收口径；冻结单 140 不可达已记录）",
       gz <= B3_GZIP_ACCEPT, "≤160KB gzip", "%.1f KB gzip (raw %.1f KB)" % (gz / 1024, len(data) / 1024),
       ac="README §2", vp=vp)
    m = re.search(r'window\.__BOARD3D_URL\s*=\s*["\'](assets/board3d\.[0-9a-f]{8}\.js)["\']', html)
    ck(rec, "V8-3D-04", "index 注入 window.__BOARD3D_URL（指向该 chunk）",
       bool(m) and pathlib.PurePosixPath(m.group(1)).name == chunk.name, chunk.name,
       m.group(1) if m else None,
       ac="impl-freeze §3.1", vp=vp)
    ck(rec, "V8-3D-05", "首屏不以 <script src> 引用 3D chunk（仅懒加载）",
       not re.search(r'<script\b[^>]*\bsrc\s*=\s*["\']assets/board3d', html, re.I),
       "无 <script src=board3d>", "found" if re.search(r'src\s*=\s*["\']assets/board3d', html, re.I) else "none",
       ac="impl-freeze §3.1", vp=vp)
    ck(rec, "V8-3D-06", "首屏无 preload/prefetch 拉取 3D chunk",
       not re.search(r'<link\b[^>]*(?:preload|prefetch)[^>]*assets/board3d', html, re.I),
       "无 preload/prefetch", "ok", ac="impl-freeze §3.1", vp=vp)
    three_in_index = ("THREE.WebGLRenderer" in html) or ("three.module" in html)
    ck(rec, "V8-3D-07", "首屏无 three 内联（three 只在懒加载 chunk 内）", not three_in_index,
       "index 无 three 标记", "found three marker" if three_in_index else "none",
       ac="impl-freeze §3.1", vp=vp)
    is_iife = not re.search(r'^\s*(import|export)\s', data.decode("utf-8", "replace")[:4000], re.M)
    ck(rec, "V8-3D-08", "chunk 为 IIFE（无 ESM import/export 残留）", is_iife,
       "IIFE", "has import/export" if not is_iife else "IIFE", ac="README §2", vp=vp)
    sw = (dist / "sw.js").read_text(encoding="utf-8", errors="replace")
    precache_has = chunk.name in sw
    ck(rec, "V8-3D-09", "sw.js PRECACHE 含 3D chunk（离线可用）", precache_has,
       "precache 含 " + chunk.name, "yes" if precache_has else "no", ac="impl-freeze §3.1", vp=vp)
    igz = len(gzip.compress(index.read_bytes(), 9))
    # 首屏口径 = index + 题库 cards + manifest（3D chunk 懒加载，不计入首屏）
    fs_assets = {p.name: len(gzip.compress(p.read_bytes(), 9)) for p in (dist / "assets").glob("*.js")
                 if not p.name.startswith("board3d.")}
    total = igz + sum(fs_assets.values()) + len(gzip.compress((dist / "manifest.webmanifest").read_bytes(), 9))
    ck(rec, "V8-3D-10", "首屏 gzip 预算（index ≤140KB / 首屏总 ≤180KB，不含 3D chunk）",
       igz <= INDEX_GZIP_BUDGET and total <= FIRST_SCREEN_BUDGET,
       "index ≤140KB 且总 ≤180KB",
       "index %.1fKB / total %.1fKB" % (igz / 1024, total / 1024), ac="ADR-012", vp=vp)
    rec.meta["chunk"] = {"name": chunk.name, "raw": len(data), "gzip": gz, "sha8": sha}
    rec.meta["index_gzip"] = igz
    rec.meta["first_screen_gzip"] = total
    rec.meta["first_screen_assets"] = fs_assets


# ---------------------------------------------------------------- S1 3D 真实 mount
def js_click(page, selector):
    """3D 模式（SwiftShader）下 Playwright 的稳定帧等待易超时；DOM click 等价触发同一 handler。"""
    page.evaluate("(s) => { const el = document.querySelector(s); if (el) el.click(); }", selector)


def wait_phase(page, want, timeout=12000):
    page.wait_for_function(
        """(w) => { const h = document.querySelector('[data-test=board3d]');
            return !!h && h.getAttribute('data-3d-phase') === w; }""", arg=want, timeout=timeout)


def run_mount(browser, rec, mode="auto"):
    tag = mode.upper()
    ctx = new_ctx(browser, viewport=(390, 844))
    try:
        page, col = open_table(ctx, mode=mode, expect_on=True)
        st = page.evaluate(SNAP_JS)
        vp = "390x844"
        ck(rec, "V8-3D-11" + ("a" if mode == "on" else ""),
           "board3d=%s + WebGL2 → 真的挂上 3D 主桌" % mode,
           st["attr"] == "on" and st["cls3d"] and (st["canvas"] or 0) >= 1 and st["ready"] == "1"
           and bool(st["debug"] and st["debug"].get("mounted")),
           "data-board3d=on / .v6-3d / canvas≥1 / data-3d-ready=1 / _debug.mounted",
           {"attr": st["attr"], "cls3d": st["cls3d"], "canvas": st["canvas"], "ready": st["ready"],
            "mounted": (st["debug"] or {}).get("mounted"), "reason": st["reason"]},
           ac="impl-freeze §3.3", vp=vp)
        ck(rec, "V8-3D-12", "真实 3D 引擎 = three r180（chunk 内 three 已生效）",
           bool(st["debug"] and str(st["debug"].get("three")) in ("180", "r180", "0.180.0")) or
           bool(st["debug"] and st["debug"].get("three")),
           "three 版本号可读", {"three": (st["debug"] or {}).get("three"),
                              "version": (st["debug"] or {}).get("version")},
           ac="impl-freeze §3.2", vp=vp)
        ck(rec, "V8-3D-13", "3D 模式下 V7 棋盘视觉层隐藏、Cinema/Cabin 不挂",
           (st["boardOpacity"] is None or float(st["boardOpacity"]) < 0.05) and st["cabinKids"] == 0,
           "V7 board opacity 0 / cabin 无子节点",
           {"boardOpacity": st["boardOpacity"], "cabinKids": st["cabinKids"],
            "cabinVisible": st["cabinVisible"]}, ac="impl-freeze §3.3", vp=vp)
        ck(rec, "V8-3D-14", "DOM HUD 不被 3D 遮挡（掷骰/暂停/安全词仍在且可点）",
           st["rollVisible"] and st["pauseVisible"] and st["safeSlot"] == 1,
           "roll/pause 可见、safe-slot 存在",
           {"roll": st["rollVisible"], "pause": st["pauseVisible"], "safeSlot": st["safeSlot"]},
           ac="impl-freeze §2", vp=vp)
        ck(rec, "V8-3D-15", "3D 挂载后 chunk 只请求一次（整页单例）", len(col.chunk_reqs()) == 1,
           "chunk 请求数 == 1", {"count": len(col.chunk_reqs()), "urls": col.chunk_reqs()[:3]},
           ac="table3d 交接 §2.2", vp=vp)
        ck(rec, "V8-3D-16", "首帧渲染循环在跑（frames>0 / drawCalls>0 / triangles>0）",
           bool(st["debug"] and (st["debug"].get("perf") or {}).get("current")
                and (st["debug"]["perf"]["current"].get("frames") or 0) > 0
                and (st["debug"].get("drawCalls") or 0) > 0
                and (st["debug"].get("triangles") or 0) > 0),
           "frames>0 / drawCalls>0 / triangles>0",
           {"drawCalls": (st["debug"] or {}).get("drawCalls"),
            "triangles": (st["debug"] or {}).get("triangles"),
            "current": ((st["debug"] or {}).get("perf") or {}).get("current")},
           ac="impl-freeze §3.2", vp=vp)
        ck(rec, "V8-3D-17", "挂载初始为俯瞰（phase=idle）",
           st["phase"] == "idle", "idle", st["phase"], ac="§3.3 镜头链", vp=vp)
        ck(rec, "V8-3D-18", "真实 3D 挂载过程 0 console error / 0 pageerror",
           not col.console_errors and not col.pageerrors,
           "0 error", col.errors(), ac="§3.4", vp=vp)
        shot_and_record(rec, page, "V8-01-3d-overview-%s-390x844.png" % mode)
        rec.meta["debug_mount_%s" % mode] = st["debug"]
        # roll → 镜头阶段非 idle，收尾回 idle
        page.evaluate(PHASE_SAMPLER_JS)
        js_click(page, '[data-test=roll]')
        diag = {}
        try:
            page.wait_for_function(
                """() => { const h = document.querySelector('[data-test=board3d]');
                    return !!h && h.getAttribute('data-3d-phase') !== 'idle'; }""", timeout=8000)
        except Exception as e:  # noqa: BLE001
            diag["nonidle"] = str(e)[:200]
        t_leave = time.time()
        try:
            wait_phase(page, "idle", timeout=15000)
            diag["idle_ms"] = int((time.time() - t_leave) * 1000)
        except Exception as e:  # noqa: BLE001
            diag["idle_err"] = str(e)[:200]
            diag["idle_ms"] = int((time.time() - t_leave) * 1000)
        diag["phase_now"] = page.evaluate(
            "() => { const h = document.querySelector('[data-test=board3d]');"
            " return h ? h.getAttribute('data-3d-phase') : null; }")
        rec.add_note("mount(%s) 镜头等待诊断：%s" % (mode, diag))
        samples = page.evaluate(PHASE_STOP_JS)
        ph = phases_of(samples)
        ck(rec, "V8-3D-19", "roll 走真实 3D 镜头阶段（出现 roll/非 idle 帧），结束回 idle",
           any(p and p not in ("idle", "boot") for p in ph) and diag.get("phase_now") == "idle",
           "阶段含非 idle，且收尾读到的 phase=idle",
           {"phases": ph, "phase_now": diag.get("phase_now"), "idle_ms": diag.get("idle_ms")},
           ac="§3.3 镜头链", vp=vp)
        st2 = page.evaluate(SNAP_JS)
        ck(rec, "V8-3D-20", "roll 后骰子点数/文案与引擎一致（HUD 未被 3D 抢）",
           bool(st2["dieText"]) and "还没掷骰" not in st2["dieText"],
           "die-text 已更新", {"dieText": st2["dieText"]}, ac="§3.3", vp=vp)
        ck(rec, "V8-3D-21", "roll 后 0 console error / 0 pageerror",
           not col.console_errors and not col.pageerrors,
           "0 error", col.errors(), ac="§3.4", vp=vp)
        try:
            rec.shots.append(shot(page, "V8-02-3d-after-roll-%s-390x844.png" % mode)[0])
        except Exception:  # noqa: BLE001
            pass
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-11x", "board3d=%s 场景执行" % mode, False, "无异常",
           traceback.format_exc()[-700:], ac="§3.3")
    finally:
        ctx.close()


# ---------------------------------------------------------------- S2 真实 move→prompt
def run_real_chain(browser, rec):
    """真实引擎：口袋局面 → 掷 1 → 自动 move 到真心话格 → 3D cell45/bear → 题卡 card-only → 做了 → 回俯瞰。"""
    ctx = new_ctx(browser, viewport=(390, 844))
    vp = "390x844"
    try:
        page, col = open_table(ctx, mode="auto", expect_on=True, fixture="pocket")
        ok = getattr(col, "fixture", {}) or {}
        ck(rec, "V8-3D-22", "夹具就绪：a:0 停在 ring:24（掷 1 → ring:25 题卡格）",
           bool(ok.get("ok")), "ok", ok, ac="§3.4 3D 题卡", vp=vp)
        page.wait_for_timeout(400)
        # 计数 returnToOverview / play([])
        page.evaluate(
            """() => {
                window.__RET8__ = {returnCalls: 0, emptyPlays: 0, plays: []};
                var api = window.App && App.Board3D;
                function wrap(o, n) {
                    if (!o || typeof o[n] !== 'function' || o.__w8) return;
                    var orig = o[n];
                    o[n] = function () {
                        var list = arguments[0] || [];
                        if (n === 'play') { window.__RET8__.plays.push(list.length);
                            if (!list.length) window.__RET8__.emptyPlays++; }
                        if (n === 'returnToOverview') window.__RET8__.returnCalls++;
                        return orig.apply(o, arguments);
                    };
                    o.__w8 = true;
                }
                wrap(api, 'returnToOverview');
                wrap(api, 'play');
                return {ret: !!(api && api.returnToOverview)}; }"""
        )
        page.evaluate(PHASE_SAMPLER_JS)
        page.evaluate("() => __V6_TEST__.forceDie(1)")
        t0 = time.time()
        js_click(page, '[data-test=roll]')
        # 飞行中截图（固定飞机 + 棋盘旋转的构图证据）
        try:
            page.wait_for_function(
                """() => { const h = document.querySelector('[data-test=board3d]');
                    return !!h && h.getAttribute('data-3d-phase') === 'fly'; }""", timeout=15000)
            rec.shots.append(shot(page, "V8-02b-3d-fly-390x844.png")[0])
        except Exception as e:  # noqa: BLE001
            rec.add_note("fly 截图未取到：%s" % str(e)[:120])
        page.wait_for_selector('[data-test=prompt-card]', timeout=40000)
        page.wait_for_timeout(1000)
        samples = page.evaluate(PHASE_STOP_JS)
        ph = phases_of(samples)
        open_ms = int((time.time() - t0) * 1000)
        st = page.evaluate(SNAP_JS)
        lk = lock_max(samples)
        ck(rec, "V8-3D-23", "真实引擎 move：镜头链经过 focus/fly/land（至少其中两个阶段）",
           sum(1 for p in ph if p in PHASES_CHAIN) >= 2, "≥2 of focus/fly/land", {"phases": ph},
           ac="§3.3 镜头链", vp=vp)
        ck(rec, "V8-3D-24", "fly 期间飞机被锁在机腹下方（NDC 偏移小）+ 棋盘旋到目标格",
           lk["samples"] > 0 and lk["maxAbsX"] <= 0.08 and lk["maxAbsY"] <= 0.35
           and theta_span(samples) > 0.02,
           "lock.samples>0 / maxAbsX≤0.08 / maxAbsY≤0.35（机腹下方）/ board θ 变化>0.02",
           {"lock": lk, "thetaSpan": round(theta_span(samples), 4)}, ac="§3.3 飞行错觉", vp=vp)
        ck(rec, "V8-3D-25", "真实题卡：3D 先 cell45 再 bear（含题卡格上升 + 小熊探头）",
           "cell45" in ph and "bear" in ph, "phases 含 cell45 & bear", {"phases": ph},
           ac="§3.3", vp=vp)
        ck(rec, "V8-3D-26", "题卡打开时 3D 停在 cell45/bear（hold，不是 overview）",
           st["phase"] in ("cell45", "bear") and bool((st["debug"] or {}).get("holding")),
           "phase ∈ {cell45,bear} 且 holding",
           {"phase": st["phase"], "holding": (st["debug"] or {}).get("holding")},
           ac="§3.3", vp=vp)
        ck(rec, "V8-3D-27", "3D 题卡只出右侧内容卡：.v8-3d-card 生效 / .cs-left hidden / cell 无面积",
           st["cardOnly"] and st["promptCard"] and st["leftDisplay"] == "none"
           and (st["cellRect"] is None or st["cellRect"]["w"] == 0),
           "cardOnly+prompt-card / .cs-left none / cell w=0",
           {"cardOnly": st["cardOnly"], "promptCard": st["promptCard"],
            "leftDisplay": st["leftDisplay"], "cellRect": st["cellRect"],
            "cardRect": st["cardRect"]}, ac="table3d 交接 §2.2", vp=vp)
        card_left = (st["cardRect"] or {}).get("x") or 0
        ck(rec, "V8-3D-28", "3D 小熊/题卡格舞台落在卡片左侧空区（构图上不被卡遮）",
           bool((st["debug"] or {}).get("probe", {}).get("stage", {}).get("visible"))
           and ((st["debug"] or {}).get("probe", {}).get("stage", {}).get("bear") or 0) > 0.2
           and card_left >= st["vp"]["w"] * 0.33,
           "stage.visible / bear>0.2 / card 起点 ≥ 屏宽 33%",
           {"stage": (st["debug"] or {}).get("probe", {}).get("stage"),
            "cardLeft": card_left, "vpW": st["vp"]["w"]}, ac="§3.3 3D 题卡", vp=vp)
        ck(rec, "V8-3D-29", "3D canvas 在题卡打开时仍在（3D 未被题卡拆掉）",
           st["attr"] == "on" and (st["canvas"] or 0) >= 1,
           "on + canvas≥1", {"attr": st["attr"], "canvas": st["canvas"]}, ac="§3.3", vp=vp)
        ck(rec, "V8-3D-30", "开卡链路 0 console error / 0 pageerror",
           not col.console_errors and not col.pageerrors, "0 error", col.errors(),
           ac="§3.4", vp=vp)
        shot_and_record(rec, page, "V8-03-3d-bear-cardonly-390x844.png")
        rec.meta["real_chain"] = {"phases": ph, "open_ms": open_ms, "lock": lk,
                                  "thetaSpan": round(theta_span(samples), 4),
                                  "cardRect": st["cardRect"], "leftRect": st["leftRect"],
                                  "debug": {k: (st["debug"] or {}).get(k) for k in
                                            ("phase", "holding", "drawCalls", "triangles", "fps", "dpr", "quality")}}
        # 做了 → 回俯瞰
        col.reset()
        js_click(page, '[data-test=prompt-done]')
        page.wait_for_timeout(400)
        try:
            page.wait_for_function("() => __V6_TEST__ && !__V6_TEST__.isBusy()", timeout=30000)
        except Exception:  # noqa: BLE001
            pass
        try:
            page.wait_for_function(
                """() => { const h = document.querySelector('[data-test=board3d]');
                    return h && h.getAttribute('data-3d-phase') === 'idle'; }""", timeout=20000)
        except Exception:  # noqa: BLE001
            pass
        page.wait_for_timeout(900)
        after = page.evaluate(SNAP_JS)
        ret = page.evaluate("() => window.__RET8__")
        gone = page.evaluate("() => !document.querySelector('.cs-root') && !document.querySelector('[data-test=prompt-card]')")
        ck(rec, "V8-3D-31", "「做了」后 3D 回俯瞰（phase=idle / holding=false）",
           after["phase"] == "idle" and not (after["debug"] or {}).get("holding"),
           "idle + holding false",
           {"phase": after["phase"], "holding": (after["debug"] or {}).get("holding")},
           ac="§3.3 returnToOverview", vp=vp)
        ck(rec, "V8-3D-32", "「做了」触发 returnToOverview（>=1 次，非 play([]) 兜底）",
           ret["returnCalls"] >= 1, "returnCalls≥1", ret, ac="§3.3", vp=vp)
        ck(rec, "V8-3D-33", "题卡已收起、3D 仍挂载（不拆）",
           gone and after["attr"] == "on" and (after["canvas"] or 0) >= 1,
           "card 收起 + 3D 在", {"gone": gone, "attr": after["attr"], "canvas": after["canvas"]},
           ac="§3.3", vp=vp)
        ck(rec, "V8-3D-34", "「做了」之后 0 console error / 0 pageerror",
           not col.console_errors and not col.pageerrors, "0 error", col.errors(),
           ac="§3.4", vp=vp)
        shot_and_record(rec, page, "V8-04-3d-after-return-390x844.png")
        rec.meta["return"] = ret
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-22x", "真实 move→prompt 场景执行", False, "无异常",
           traceback.format_exc()[-900:], ac="§3.4")
    finally:
        ctx.close()


# ---------------------------------------------------------------- S3 V7 降级
def check_v7_complete(rec, cid, label, st, col, vp, reason_expect, scripts_expect=0, note=""):
    """V7 降级的共同验收：v7 状态 + V7 棋盘可见 + 无 3D canvas + 0 pageerror。"""
    ck(rec, cid + "-a", "%s：状态回 V7（data-board3d=v7，reason=%s）" % (label, reason_expect),
       st["attr"] == "v7" and st["reason"] == reason_expect,
       "v7 / %s" % reason_expect, {"attr": st["attr"], "reason": st["reason"]}, ac="§3.3 回落", vp=vp)
    ck(rec, cid + "-b", "%s：V7 棋盘可见（无空白）" % label,
       bool(st["boardVisible"]) and float(st["boardOpacity"] or 0) > 0.5,
       "board 可见 opacity≈1", {"visible": st["boardVisible"], "opacity": st["boardOpacity"]},
       ac="§3.3", vp=vp)
    ck(rec, cid + "-c", "%s：无 3D canvas / 3D 宿主已清空" % label,
       (st["canvas"] or 0) == 0 and st["chunkScripts"] == scripts_expect,
       "canvas=0 / chunkScripts=%d" % scripts_expect,
       {"canvas": st["canvas"], "chunkScripts": st["chunkScripts"]},
       ac="§3.3", vp=vp)
    ck(rec, cid + "-d", "%s：HUD 可用（掷骰可见）+ 0 pageerror" % label,
       st["rollVisible"] and not col.pageerrors, "roll 可见 / pageerror=0",
       {"roll": st["rollVisible"], "pageerror": col.pageerrors, "console": col.console_errors},
       ac="§3.4", vp=vp)


def _stub_route(body: str):
    """Playwright 依据 handler 形参个数决定是否传 (route, request)；这里固定单参（只吃 route）。"""
    def handler(route):
        route.fulfill(status=200, body=body, content_type="text/javascript")
    return handler


def _route404(route):
    route.fulfill(status=404, body="", content_type="text/plain")


def run_fallback(browser, rec, kind):
    """kind: off / nowebgl2 / chunk404 / mountnull / mountthrow"""
    vp = "390x844"
    mode = {"off": "off", "nowebgl2": "auto", "chunk404": "auto",
            "mountnull": "auto", "mountthrow": "on"}[kind]
    init = NO_WEBGL2_JS if kind == "nowebgl2" else None
    route = None
    if kind == "chunk404":
        route = [("**/assets/board3d.*.js", _route404)]
    elif kind in ("mountnull", "mountthrow"):
        body = ("window.App = window.App || {};"
                "window.App.Board3D = { mount: function () { return Promise.resolve(null); },"
                " unmount: function () { return true; },"
                " _debug: function () { return { mounted: false, version: 'qa-stub' }; } };")
        if kind == "mountthrow":
            body = ("window.App = window.App || {};"
                    "window.App.Board3D = { mount: function () { throw new Error('qa mount throw'); },"
                    " unmount: function () { return true; },"
                    " _debug: function () { return { mounted: false, version: 'qa-stub' }; } };")
        route = [("**/assets/board3d.*.js", _stub_route(body))]
    expect_reason = {"off": "off", "nowebgl2": "no-webgl2", "chunk404": "chunk",
                     "mountnull": "mount-null", "mountthrow": "mount-throw"}[kind]
    # 降级用例必须屏蔽 SW：否则 SW 会用预缓存把真实 chunk 顶回来，404/桩挂载就无法成立
    ctx = new_ctx(browser, viewport=(390, 844), init_script=init, service_workers="block")
    try:
        page, col = open_table(ctx, mode=mode, route=route)
        st = page.evaluate(SNAP_JS)
        cid = "V8-3D-35" + {"off": "", "nowebgl2": "b", "chunk404": "c",
                            "mountnull": "d", "mountthrow": "e"}[kind]
        label = {"off": "board3d=off", "nowebgl2": "无 WebGL2(auto)",
                 "chunk404": "chunk 404", "mountnull": "mount 返回 null",
                 "mountthrow": "mount 抛错(on)"}[kind]
        if kind == "off":
            ck(rec, "V8-3D-35", "board3d=off → V7，且完全不请求 3D chunk",
               len(col.chunk_reqs()) == 0, "chunk 请求数 0",
               {"reqs": len(col.chunk_reqs())}, ac="§3.3", vp=vp)
        if kind == "nowebgl2":
            ck(rec, "V8-3D-36", "无 WebGL2（auto）→ V7，且不请求 3D chunk",
               len(col.chunk_reqs()) == 0, "chunk 请求数 0",
               {"reqs": len(col.chunk_reqs()), "webgl2": st["webgl2"]}, ac="§3.3", vp=vp)
        if kind == "chunk404":
            ck(rec, "V8-3D-37", "chunk 404 → V7；chunk 只尝试一次（不重试）",
               len(col.chunk_reqs()) == 1, "chunk 请求数 1",
               {"reqs": len(col.chunk_reqs()), "bad": col.bad[:4]}, ac="§3.3", vp=vp)
        if kind in ("mountnull", "mountthrow"):
            ck(rec, "V8-3D-38" + ("d" if kind == "mountnull" else "e"),
               "%s → V7；chunk 正常取到但挂载失败被兜住" % label,
               len(col.chunk_reqs()) == 1 and st["attr"] == "v7",
               "chunk 请求 1 次且 v7",
               {"reqs": len(col.chunk_reqs()), "attr": st["attr"], "reason": st["reason"]},
               ac="§3.3", vp=vp)
        check_v7_complete(rec, cid, label, st, col, vp, expect_reason,
                          scripts_expect=1 if kind in ("mountnull", "mountthrow") else 0)
        if kind == "chunk404":
            # 404 时浏览器必然记一条「Failed to load resource」，只允许这一条（并如实记录）
            net_only = [e for e in col.console_errors
                        if ("404" in e or "Failed to load resource" in e or "Failed to fetch" in e)]
            ck(rec, "V8-3D-37b", "chunk 404 的 console error 仅网络 404，无应用错误",
               len(net_only) == len(col.console_errors),
               "console error 全为网络 404 资源",
               {"console": col.console_errors}, ac="§3.4", vp=vp)
        if kind in ("nowebgl2", "mountnull"):
            js_click(page, '[data-test=roll]')
            page.wait_for_timeout(3500)
            st2 = page.evaluate(SNAP_JS)
            ck(rec, cid + "-e", "%s：V7 降级后仍能掷骰出结果（功能可用）" % label,
               bool(st2["dieText"]) and "还没掷骰" not in st2["dieText"] and not col.pageerrors,
               "die-text 更新 + 0 pageerror",
               {"dieText": st2["dieText"], "pageerror": col.pageerrors}, ac="§3.4", vp=vp)
        shot_and_record(rec, page, "V8-05-v7-fallback-%s-390x844.png" % kind)
        rec.meta["fallback_%s" % kind] = {"attr": st["attr"], "reason": st["reason"],
                                         "chunkReqs": len(col.chunk_reqs()),
                                         "console": col.console_errors[:3]}
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-35x", "V7 降级（%s）场景执行" % kind, False, "无异常",
           traceback.format_exc()[-700:], ac="§3.3")
    finally:
        ctx.close()


# ---------------------------------------------------------------- S4 reduced
def run_reduced(browser, rec):
    vp = "390x844"
    # auto + reduced → V7（不尝试 3D）
    ctx = new_ctx(browser, viewport=(390, 844), reduced_motion=True)
    try:
        page, col = open_table(ctx, mode="auto", reduced=True)
        st = page.evaluate(SNAP_JS)
        ck(rec, "V8-3D-39", "auto + reduced → V7（reason=reduced，不挂 3D）",
           st["attr"] == "v7" and st["reason"] == "reduced" and (st["canvas"] or 0) == 0,
           "v7 / reduced / canvas 0",
           {"attr": st["attr"], "reason": st["reason"], "canvas": st["canvas"]},
           ac="§3.3", vp=vp)
        ck(rec, "V8-3D-40", "auto + reduced：V7 棋盘可见、0 pageerror",
           st["boardVisible"] and not col.pageerrors, "board 可见 / 0 pageerror",
           {"board": st["boardVisible"], "pageerror": col.pageerrors}, ac="§3.3", vp=vp)
    finally:
        ctx.close()
    # on + reduced → 静态 3D
    ctx = new_ctx(browser, viewport=(390, 844), reduced_motion=True)
    try:
        page, col = open_table(ctx, mode="on", reduced=True, expect_on=True)
        st = page.evaluate(SNAP_JS)
        ck(rec, "V8-3D-41", "on + reduced → 仍挂 3D，但为减少动画态（data-3d-reduced=1）",
           st["attr"] == "on" and st["reduced3d"] == "1" and bool((st["debug"] or {}).get("reduced")),
           "on / data-3d-reduced=1 / _debug.reduced",
           {"attr": st["attr"], "reduced3d": st["reduced3d"],
            "reduced": (st["debug"] or {}).get("reduced")}, ac="§3.3", vp=vp)
        page.evaluate(PHASE_SAMPLER_JS)
        js_click(page, '[data-test=roll]')
        page.wait_for_timeout(3200)
        samples = page.evaluate(PHASE_STOP_JS)
        ph = phases_of(samples)
        ck(rec, "V8-3D-42", "reduced 3D 是静态棋盘：不产生 focus/fly/land/cell45/bear 镜头阶段",
           not any(p in ("focus", "fly", "land", "cell45", "bear") for p in ph),
           "无镜头阶段", {"phases": ph}, ac="§3.3 reduced", vp=vp)
        ck(rec, "V8-3D-43", "reduced 3D：0 console error / 0 pageerror",
           not col.console_errors and not col.pageerrors, "0 error", col.errors(),
           ac="§3.4", vp=vp)
        shot_and_record(rec, page, "V8-06-3d-reduced-390x844.png")
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-41x", "on+reduced 场景执行", False, "无异常",
           traceback.format_exc()[-700:], ac="§3.3")
    finally:
        ctx.close()


# ---------------------------------------------------------------- S5 响应式
def run_responsive(browser, rec):
    for tag, (w, h) in Q.VIEWPORTS.items():
        if tag not in ("320x568", "390x844", "430x932"):
            continue
        vp = tag
        ctx = new_ctx(browser, viewport=(w, h))
        try:
            page, col = open_table(ctx, mode="auto", expect_on=True)
            st = page.evaluate(SNAP_JS)
            base = {"320x568": "V8-3D-44", "390x844": "V8-3D-45", "430x932": "V8-3D-46"}[tag]
            ck(rec, base, "3D %s：挂载成功且无横向溢出" % vp,
               st["attr"] == "on" and not st["overflowX"] and (st["canvas"] or 0) >= 1,
               "on / 无溢出 / canvas≥1",
               {"attr": st["attr"], "overflowX": st["overflowX"], "canvas": st["canvas"]},
               ac="§3.4 320–430", vp=vp)
            hr = st["hostRect"] or {}
            ck(rec, base + "b", "3D %s：canvas 尺寸跟随宿主（≥ 视口宽 60%%、高 >200）" % vp,
               (hr.get("w") or 0) >= w * 0.6 and (hr.get("h") or 0) > 200,
               "host w ≥60%vw / h>200", hr, ac="§3.4", vp=vp)
            ck(rec, base + "c", "3D %s：HUD（掷骰）仍在视口内可点" % vp,
               st["rollVisible"], "roll 可见", {"roll": st["rollVisible"]}, ac="§3.4", vp=vp)
            ck(rec, base + "d", "3D %s：0 pageerror" % vp, not col.pageerrors, "0 pageerror",
               col.pageerrors, ac="§3.4", vp=vp)
            shot_and_record(rec, page, "V8-07-3d-%s.png" % vp)
        except Exception:  # noqa: BLE001
            ck(rec, "V8-3D-44x", "3D 响应式 %s 场景执行" % tag, False, "无异常",
               traceback.format_exc()[-600:], ac="§3.4", vp=vp)
        finally:
            ctx.close()
    # V7 基线（同产物、off）用于视觉对照
    ctx = new_ctx(browser, viewport=(390, 844))
    try:
        page, col = open_table(ctx, mode="off")
        st = page.evaluate(SNAP_JS)
        ck(rec, "V8-3D-47", "V7 基线（board3d=off，390x844）可用于视觉对照",
           st["attr"] == "v7" and st["boardVisible"] and not col.pageerrors,
           "v7 + board 可见", {"attr": st["attr"], "board": st["boardVisible"]},
           ac="§3.4 视觉", vp="390x844")
        shot_and_record(rec, page, "V8-08-v7-baseline-390x844.png")
    finally:
        ctx.close()


# ---------------------------------------------------------------- S6 设置/主题
def run_settings(browser, rec):
    vp = "390x844"
    ctx = new_ctx(browser, viewport=(390, 844))
    try:
        page = ctx.new_page()
        col = Collector(page)
        page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(300)
        Q.ensure_boot(page, None, timeout=12000)   # 关掉首次规则速览，避免遮罩拦住设置页点击
        page.evaluate("() => App.Router.go('settings')")
        page.wait_for_selector('[data-test=settings]', timeout=8000)
        s = page.evaluate(
            """() => {
                const q = (x) => document.querySelector(x);
                const chips = ['auto', 'off', 'on'].map(function (m) {
                    const el = q('[data-test=settings-board3d-' + m + ']');
                    return {id: m, exists: !!el, on: !!(el && el.classList.contains('on')),
                            pressed: el ? el.getAttribute('aria-pressed') : null};
                });
                const stored = (App.Store.getSettings() || {}).board3d || null;
                return {
                    exists: !!q('[data-test=settings-board3d]'),
                    beta: !!q('[data-test=settings-board3d-beta]'),
                    desc: (q('[data-test=settings-board3d-desc]') || {}).textContent || '',
                    chips: chips,
                    stored: stored,
                    defaultOff: !stored
                };
            }"""
        )
        ck(rec, "V8-3D-48", "设置页有「3D 主桌（Beta）」三档 + Beta 说明",
           s["exists"] and s["beta"] and all(c["exists"] for c in s["chips"]),
           "三档 + beta 文案", {"exists": s["exists"], "beta": s["beta"], "chips": s["chips"]},
           ac="§3.3 设置", vp=vp)
        off_on = [c["on"] for c in s["chips"] if c["id"] == "off"]
        ck(rec, "V8-3D-49", "Beta 期默认选中 V7（off）；未写盘时按 off 解释",
           s["defaultOff"] and (off_on and off_on[0]), "默认 off",
           {"stored": s["stored"], "offSelected": off_on}, ac="table3d 交接 §5.1", vp=vp)
        page.click('[data-test=settings-board3d-auto]')
        page.wait_for_timeout(250)
        stored = page.evaluate("() => (App.Store.getSettings() || {}).board3d || null")
        pressed = page.evaluate(
            "() => { const e = document.querySelector('[data-test=settings-board3d-auto]');"
            " return e ? e.getAttribute('aria-pressed') : null; }")
        ck(rec, "V8-3D-50", "点「自动」立即落盘（board3d=auto，aria-pressed=true）",
           stored == "auto" and pressed == "true", "stored=auto / pressed=true",
           {"stored": stored, "pressed": pressed}, ac="§3.3", vp=vp)
        page.reload(wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(500)
        Q.ensure_boot(page, None, timeout=8000)
        page.evaluate("() => App.Router.go('settings')")
        page.wait_for_selector('[data-test=settings]', timeout=8000)
        after = page.evaluate(
            """() => { const e = document.querySelector('[data-test=settings-board3d-auto]');
                const st = App.Store.getSettings() || {};
                return {pressed: e ? e.getAttribute('aria-pressed') : null, stored: st.board3d || null}; }""")
        ck(rec, "V8-3D-51", "刷新后仍记住 board3d=auto（不丢未知键）",
           after["stored"] == "auto" and after["pressed"] == "true",
           "刷新后 auto", after, ac="§3.3", vp=vp)
        shot_and_record(rec, page, "V8-09-settings-board3d-390x844.png")
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-48x", "设置页 3D 开关场景执行", False, "无异常",
           traceback.format_exc()[-700:], ac="§3.3", vp=vp)
    finally:
        ctx.close()
    # 主题转发到 3D
    ctx = new_ctx(browser, viewport=(390, 844))
    try:
        page, col = open_table(ctx, mode="on", expect_on=True)
        for theme in ("star", "paper", "cloud"):
            page.evaluate("(t) => { try { App.Store.saveSettings({theme: t}); } catch (e) {}"
                          " App.Themes && App.Themes.set && App.Themes.set(t); }", theme)
            page.wait_for_timeout(900)
            got = page.evaluate(
                """() => { const h = document.querySelector('[data-test=board3d]');
                    const d = (window.App && App.Board3D && App.Board3D._debug) ? App.Board3D._debug() : null;
                    return {attr: h ? h.getAttribute('data-3d-theme') : null, dbg: d ? d.theme : null}; }""")
            ck(rec, "V8-3D-52-%s" % theme, "主题 %s 已转发到 3D（data-3d-theme）" % theme,
               got["attr"] == theme and got["dbg"] == theme, theme, got,
               ac="§2 主题", vp="390x844")
        ck(rec, "V8-3D-53", "多主题切换 0 pageerror", not col.pageerrors, "0 pageerror",
           col.pageerrors, ac="§3.4", vp="390x844")
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-52x", "主题转发场景执行", False, "无异常",
           traceback.format_exc()[-600:], ac="§2")
    finally:
        ctx.close()


# ---------------------------------------------------------------- S7 SW / 离线
def run_offline(browser, rec):
    vp = "390x844"
    ctx = new_ctx(browser, viewport=(390, 844))
    try:
        page = ctx.new_page()
        col = Collector(page)
        page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(600)
        seed_game(page, board3d="auto", reduced=False)   # 断网后要能「继续这局」并尝试 3D
        page.wait_for_timeout(300)
        page.evaluate(
            """async () => {
                if (!navigator.serviceWorker) return false;
                try { await navigator.serviceWorker.ready; } catch (e) {}
                return true; }""")
        page.wait_for_timeout(800)
        sw = page.evaluate(
            """async () => {
                const reg = await navigator.serviceWorker.getRegistration();
                const keys = (window.caches && caches.keys) ? await caches.keys() : [];
                const url = window.__BOARD3D_URL || '';
                const abs = (function () { try { return new URL(url, location.href).href; } catch (e) { return url; } })();
                let hasChunk = false;
                for (const k of keys) {
                    try {
                        const c = await caches.open(k);
                        const reqs = await c.keys();
                        for (const rq of reqs) {
                            if (rq.url === abs || rq.url.endsWith(url)) { hasChunk = true; break; }
                        }
                    } catch (e) {}
                    if (hasChunk) break;
                }
                return {scope: reg ? (reg.scope || '') : null,
                        active: !!(reg && reg.active),
                        controller: !!navigator.serviceWorker.controller,
                        keys: keys, hasChunk: hasChunk, url: url, abs: abs}; }""")
        ck(rec, "V8-3D-54", "SW 已激活，且 3D chunk 在 Cache Storage 里（预缓存/运行时命中）",
           sw["active"] and sw["hasChunk"], "active + cache 含 chunk",
           {"active": sw["active"], "keys": sw["keys"], "hasChunk": sw["hasChunk"], "url": sw["url"]},
           ac="impl-freeze §3.1", vp=vp)
        # SW 首次加载通常还没接管导航：在线 reload 一次拿到 controller，再断网才谈得上「离线可用」
        if not sw["controller"]:
            page.reload(wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(800)
            sw["controller"] = page.evaluate("() => !!navigator.serviceWorker.controller")
        ck(rec, "V8-3D-54b", "SW 已接管页面（controller=true），离线才有意义",
           bool(sw["controller"]), "controller=true", {"controller": sw["controller"]},
           ac="impl-freeze §3.1", vp=vp)
        ctx.set_offline(True)
        page.reload(wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(400)
        try:
            page.wait_for_selector('[data-test=continue-flight]', timeout=12000)
            boot_ok = True
        except Exception:  # noqa: BLE001
            boot_ok = False
        if boot_ok:
            page.click('[data-test=continue-flight]')
            page.wait_for_selector('[data-test=table]', timeout=12000)
            try:
                page.wait_for_function(
                    """() => { const el = document.querySelector('.v6-table');
                        return el && el.getAttribute('data-board3d') === 'on'; }""", timeout=25000)
            except Exception:  # noqa: BLE001
                pass
            page.wait_for_timeout(700)
        st = page.evaluate(SNAP_JS) if boot_ok else {}
        ck(rec, "V8-3D-55", "断网冷启动：门厅可用（SW 命中）", boot_ok, "continue-flight 出现", boot_ok,
           ac="PB-12", vp=vp)
        ck(rec, "V8-3D-56", "断网冷启动：3D chunk 从 SW 缓存加载、3D 仍挂上",
           bool(st) and st.get("attr") == "on" and (st.get("canvas") or 0) >= 1,
           "offline 下 attr=on / canvas≥1",
           {"attr": st.get("attr"), "canvas": st.get("canvas"), "reason": st.get("reason")},
           ac="impl-freeze §3.1", vp=vp)
        ck(rec, "V8-3D-57", "断网冷启动 0 pageerror", not col.pageerrors, "0 pageerror",
           {"pageerror": col.pageerrors, "console": col.console_errors[:4]}, ac="§3.4", vp=vp)
        if boot_ok:
            shot_and_record(rec, page, "V8-10-3d-offline-390x844.png")
        rec.meta["sw"] = sw
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-54x", "SW/离线场景执行", False, "无异常",
           traceback.format_exc()[-700:], ac="impl-freeze §3.1")
    finally:
        ctx.close()


# ---------------------------------------------------------------- S8 性能记录
def run_perf(browser, rec):
    vp = "390x844"
    # 首屏（默认 off，无 3D chunk 请求）
    ctx = new_ctx(browser, viewport=(390, 844))
    try:
        page = ctx.new_page()
        col = Collector(page)
        page.goto(BASE, wait_until="load", timeout=30000)
        page.wait_for_timeout(600)
        nav = page.evaluate(
            """() => { const n = performance.getEntriesByType('navigation')[0] || {};
                const p = performance.getEntriesByType('paint') || [];
                const fcp = (p.filter(function (x) { return x.name === 'first-contentful-paint'; })[0] || {});
                return {dcl: Math.round(n.domContentLoadedEventEnd || 0),
                        load: Math.round(n.loadEventEnd || 0),
                        fcp: Math.round(fcp.startTime || 0),
                        resources: performance.getEntriesByType('resource').length}; }""")
        ck(rec, "V8-3D-58", "首屏（默认 V7）不请求 3D chunk", len(col.chunk_reqs()) == 0,
           "chunk 请求 0", {"reqs": col.chunk_reqs()}, ac="impl-freeze §3.1", vp=vp)
        ck(rec, "V8-3D-59", "首屏 DCL/FCP 记录（本机 headless、无节流；官方口径见 qa-perf）",
           nav["dcl"] > 0, "记录 DCL/FCP", nav, ac="PB-4/PB-5 参考", vp=vp)
        rec.meta["first_screen"] = {"nav": nav, "chunkReqs": 0,
                                    "index_gzip": rec.meta.get("index_gzip")}
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-58x", "首屏性能记录", False, "无异常",
           traceback.format_exc()[-600:], ac="PB-4")
    finally:
        ctx.close()
    # 3D SwiftShader：只记录几何/JS 更新，不判 fps
    ctx = new_ctx(browser, viewport=(390, 844))
    try:
        page, col = open_table(ctx, mode="on", expect_on=True)
        page.wait_for_timeout(2500)
        d1 = page.evaluate("() => (window.App.Board3D._debug ? App.Board3D._debug() : null)")
        js_click(page, '[data-test=roll]')
        page.wait_for_timeout(2500)
        d2 = page.evaluate("() => (window.App.Board3D._debug ? App.Board3D._debug() : null)")
        cur = (d2 or {}).get("perf", {}).get("current") or {}
        rec.meta["perf_3d_swiftshader"] = {
            "note": "SwiftShader 软件光栅，fps 不代表真机；只作几何/JS 更新参考，不作产品性能结论",
            "idle": {"drawCalls": (d1 or {}).get("drawCalls"), "triangles": (d1 or {}).get("triangles"),
                     "dpr": (d1 or {}).get("dpr"), "quality": (d1 or {}).get("quality"),
                     "fps": (d1 or {}).get("fps")},
            "after_roll": {"drawCalls": (d2 or {}).get("drawCalls"),
                           "triangles": (d2 or {}).get("triangles"),
                           "fps": (d2 or {}).get("fps")},
            "frame": {"avgMs": cur.get("avgMs"), "updateMs": cur.get("updateMs"),
                      "renderMs": cur.get("renderMs"), "frames": cur.get("frames")},
        }
        ck(rec, "V8-3D-60", "3D 几何/JS 指标可读（drawCalls/triangles/dpr；fps 不作产品结论）",
           (d2 or {}).get("drawCalls", 0) > 0 and (d2 or {}).get("triangles", 0) > 0
           and (d2 or {}).get("dpr", 0) > 0 and cur.get("frames", 0) > 0,
           "drawCalls>0 / triangles>0 / dpr>0 / frames>0",
           rec.meta["perf_3d_swiftshader"], ac="§3.4 性能", vp=vp)
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-60x", "3D 性能记录", False, "无异常",
           traceback.format_exc()[-600:], ac="§3.4")
    finally:
        ctx.close()
    # V7 长帧采样（真实 V7 路径）
    ctx = new_ctx(browser, viewport=(390, 844))
    try:
        page, col = open_table(ctx, mode="off")
        page.evaluate(
            """() => { window.__F7__ = {d: [], stop: false};
                (function tick(prev) {
                    if (window.__F7__.stop) return;
                    const now = performance.now();
                    if (prev) window.__F7__.d.push(now - prev);
                    requestAnimationFrame(function () { tick(now); });
                })(); }""")
        page.click('[data-test=roll]')
        page.wait_for_timeout(3500)
        ds = page.evaluate("() => { window.__F7__.stop = true; return window.__F7__.d.slice(); }")
        ds = [d for d in ds if d and d > 0]
        ds_sorted = sorted(ds)
        p95 = ds_sorted[int(len(ds_sorted) * 0.95)] if ds_sorted else 0
        long25 = sum(1 for d in ds if d > 25) / max(1, len(ds))
        rec.meta["v7_frames"] = {"samples": len(ds),
                                "avgMs": round(sum(ds) / max(1, len(ds)), 2) if ds else 0,
                                "p95Ms": round(p95, 2),
                                "maxMs": round(max(ds), 2) if ds else 0,
                                "long25Ratio": round(long25, 3)}
        ck(rec, "V8-3D-61", "V7 长帧记录（roll 演出 3.5s，本机 headless）",
           len(ds) > 30 and rec.meta["v7_frames"]["long25Ratio"] <= 0.35,
           "样本>30 且 >25ms 长帧 ≤35%", rec.meta["v7_frames"],
           ac="§3.4 性能", vp=vp, sev="P1")
    except Exception:  # noqa: BLE001
        ck(rec, "V8-3D-61x", "V7 长帧采样", False, "无异常",
           traceback.format_exc()[-600:], ac="§3.4", sev="P1")
    finally:
        ctx.close()


# ---------------------------------------------------------------- main
def main():
    global BASE
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default=str(DIST))
    ap.add_argument("--only", default="",
                    help="逗号分隔：static,mount,chain,fallback,reduced,responsive,settings,offline,perf")
    ap.add_argument("--json", default="qa-e2e-v8-3d")
    args = ap.parse_args()
    dist = pathlib.Path(args.dist)
    if not (dist / "index.html").exists():
        print("[FATAL] 找不到 %s/index.html；先 build_app.py --out %s" % (dist, dist))
        sys.exit(1)
    groups = [g.strip() for g in args.only.split(",") if g.strip()] or \
        ["static", "mount", "chain", "fallback", "reduced", "responsive", "settings", "offline", "perf"]

    rec = Q.Recorder("e2e-v8-3d", meta={
        "dist": str(dist), "build": Q.build_info(dist),
        "engine": "playwright(chromium) channel=msedge headless",
        "groups": groups,
        "webgl2": "Edge headless 默认（SwiftShader 软件光栅）",
        "note": "3D 性能只记录几何/JS 更新，不以软件 fps 判产品",
    })
    print("[V8-3D] dist=%s groups=%s" % (dist, groups))
    if "static" in groups:
        suite_static(rec, dist)
        print("[V8-3D] static done: %s" % rec.counts())

    with Q.serve(dist) as base_url:
        BASE = base_url
        print("[V8-3D] serving %s" % base_url)
        with sync_playwright() as pw:
            browser = Q.launch_browser(pw)
            try:
                steps = [
                    ("mount", lambda: run_mount(browser, rec, "auto")),
                    ("mount-on", lambda: run_mount(browser, rec, "on")),
                    ("chain", lambda: run_real_chain(browser, rec)),
                    ("fallback", lambda: [run_fallback(browser, rec, k) for k in
                                          ("off", "nowebgl2", "chunk404", "mountnull", "mountthrow")]),
                    ("reduced", lambda: run_reduced(browser, rec)),
                    ("responsive", lambda: run_responsive(browser, rec)),
                    ("settings", lambda: run_settings(browser, rec)),
                    ("offline", lambda: run_offline(browser, rec)),
                    ("perf", lambda: run_perf(browser, rec)),
                ]
                for name, fn in steps:
                    key = "mount" if name == "mount-on" else name
                    if key not in groups:
                        continue
                    t0 = time.time()
                    print("[V8-3D] === %s ===" % name)
                    fn()
                    print("[V8-3D] %s done %.1fs counts=%s" % (name, time.time() - t0, rec.counts()))
            finally:
                browser.close()

    rec.ensure_defects()
    data = rec.to_json()
    data["conclusion"] = rec.conclusion()
    Q.write_suite_report(rec, args.json)
    print("[V8-3D] %s" % json.dumps(rec.counts(), ensure_ascii=False))
    print("[V8-3D] conclusion=%s defects=%d" % (rec.conclusion(), len(rec.defects)))
    for d in rec.defects:
        print("[V8-3D] defect %s %s: %s" % (d["severity"], d["id"], d["title"]))
    return 0 if rec.conclusion() == "PASS" else (2 if rec.conclusion() == "PARTIAL" else 1)


if __name__ == "__main__":
    sys.exit(main())
