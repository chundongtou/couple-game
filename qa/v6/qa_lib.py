# -*- coding: utf-8 -*-
"""今晚飞行棋 V6 · QA 公共库（Playwright + Edge / 静态服务 / 断言证据 / 报告）。

被 qa/v6/e2e_v6.py、perf_budget.py、visual.py、run_all.py 复用。
约定：
- 构建产物目录默认 dist/rebuild（可用 --dist 覆盖）；报告写 reports/v6/（gitignore）；
- 截图写 qa/v6/shots/<suite>/（gitignore）；
- 每个检查项都有 id / 状态 / 期望 / 实际 / 证据，失败自动登记缺陷（Q-xx）；
- 所有断言都可重复执行：不依赖固定端口（自动挑空闲端口），不写 __pycache__ 以外文件。
"""
from __future__ import annotations

import contextlib
import functools
import gzip
import hashlib
import http.server
import json
import os
import pathlib
import re
import socket
import sys
import threading
import time
import traceback
from datetime import datetime

# ---------------------------------------------------------------- 路径
ROOT = pathlib.Path(__file__).resolve().parents[2]      # couple-game/
QA_DIR = ROOT / "qa"
V6_DIR = QA_DIR / "v6"
DEFAULT_DIST = ROOT / "dist" / "rebuild"
REPORTS = ROOT / "reports" / "v6"
SHOTS = V6_DIR / "shots"

VIEWPORTS = {
    "320x568": (320, 568),
    "360x640": (360, 640),
    "390x844": (390, 844),
    "430x932": (430, 932),
}

# 性能预算（Lead 2026-11-16 裁决：ADR-012 取代 AR 旧 PB 表；性能主口径 = gzip 静态服务）
# 旧预算 PB-1=220KB / PB-2=58KB 已由 ADR-012 取代（见 .devteam/knowledge/decisions.md 与 impl-freeze §5）。
PB = {
    "PB-1": ("index.html 原始体积（ADR-012）", "≤ 520 KB", "raw"),
    "PB-2": ("index.html gzip（ADR-012）", "≤ 140 KB", "gzip"),
    "PB-3": ("首屏总 gzip（index+cards+manifest，ADR-012）", "≤ 180 KB", "first_screen_gzip"),
    "PB-4": ("门厅 DCL（slow4G+4xCPU，gzip 主口径）", "≤ 3500 ms 硬门槛（目标 ≤2500；AR 旧 1500）", "dcl"),
    "PB-5": ("门厅 FCP（slow4G+4xCPU，gzip 主口径）", "≤ 600 ms", "fcp"),
    "PB-6": ("主桌可掷骰（从点开始起）", "≤ 800 ms", "table_ready"),
    "PB-7": ("主桌 JS heap", "≤ 6 MB", "heap"),
    "PB-12": ("断网冷启动门厅（SW 命中）", "≤ 1500 ms 且可开局", "offline_boot"),
    "PB-13": ("首屏必需网络请求数", "≤ 2", "requests"),
}

# 性能阈值（字节/毫秒）；ADR-012 后的 P0 硬门槛
PB_LIMITS = {
    "PB-1": 520 * 1024,
    "PB-2": 140 * 1024,
    "PB-3": 180 * 1024,
    "PB-4": 3500,
    "PB-4raw": 3500,
    "PB-5": 600,
    "PB-6": 800,
    "PB-7": 6 * 1024 * 1024,
    "PB-12": 1500,
    "PB-13": 2,
}


# ---------------------------------------------------------------- 环境信息
def now_str() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def python_info() -> str:
    return sys.version.split()[0]


def build_info(dist: pathlib.Path | str | None = None) -> dict:
    dist = pathlib.Path(dist or DEFAULT_DIST)
    info = {
        "dist": str(dist),
        "exists": dist.exists(),
        "python": python_info(),
        "gzip": None,
        "raw": None,
        "sha256": None,
        "files": {},
    }
    index = dist / "index.html"
    if index.exists():
        raw = index.read_bytes()
        info["raw"] = len(raw)
        info["gzip"] = len(gzip.compress(raw, 9))
        info["sha256"] = hashlib.sha256(raw).hexdigest()[:12]
        info["mtime"] = datetime.fromtimestamp(index.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")
        for rel in ("index.html", "sw.js", "manifest.webmanifest"):
            p = dist / rel
            if p.exists():
                b = p.read_bytes()
                info["files"][rel] = {"raw": len(b), "gzip": len(gzip.compress(b, 9))}
        assets = dist / "assets"
        if assets.exists():
            for p in sorted(assets.glob("*")):
                if p.is_file():
                    info["files"]["assets/" + p.name] = {"raw": p.stat().st_size}
    return info


# ---------------------------------------------------------------- 静态服务
_EXTRA_TYPES = {
    ".webmanifest": "application/manifest+json",
    ".json": "application/json",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".css": "text/css",
}


class _NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *args):  # 静默
        pass


_functools = functools


@contextlib.contextmanager
def serve(directory: pathlib.Path | str | None = None, port: int = 0):
    directory = str(directory or DEFAULT_DIST)
    handler = _functools.partial(_NoCacheHandler, directory=directory)
    handler.extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map)
    handler.extensions_map.update(_EXTRA_TYPES)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    actual = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    try:
        yield "http://127.0.0.1:%d/" % actual
    finally:
        httpd.shutdown()
        httpd.server_close()


_GZIP_EXTS = {".html", ".htm", ".js", ".mjs", ".css", ".json", ".webmanifest",
              ".svg", ".txt", ".md", ".xml"}


class _GzipNoCacheHandler(_NoCacheHandler):
    """按 GitHub Pages 口径：文本资源在客户端支持时用 gzip 传输（主性能口径）。"""

    def do_GET(self):
        try:
            p = self.translate_path(self.path)
            ext = os.path.splitext(p)[1].lower()
            accept = self.headers.get("Accept-Encoding", "") or ""
            if os.path.isfile(p) and ext in _GZIP_EXTS and "gzip" in accept.lower():
                raw = pathlib.Path(p).read_bytes()
                body = gzip.compress(raw, 6)
                self.send_response(200)
                self.send_header("Content-Type", self.guess_type(p) or "application/octet-stream")
                self.send_header("Content-Encoding", "gzip")
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Vary", "Accept-Encoding")
                self.end_headers()
                self.wfile.write(body)
                return
        except (BrokenPipeError, ConnectionResetError):
            return
        except Exception:
            pass
        super().do_GET()


@contextlib.contextmanager
def serve_gzip(directory: pathlib.Path | str | None = None, port: int = 0):
    """gzip 静态服务（GitHub Pages 实际口径，性能主口径）。"""
    directory = str(directory or DEFAULT_DIST)
    handler = _functools.partial(_GzipNoCacheHandler, directory=directory)
    handler.extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map)
    handler.extensions_map.update(_EXTRA_TYPES)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    actual = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    try:
        yield "http://127.0.0.1:%d/" % actual
    finally:
        httpd.shutdown()
        httpd.server_close()


def free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


# ---------------------------------------------------------------- Playwright 会话
def launch_browser(pw):
    """Edge channel 优先（与任务卡一致）；失败时给出明确错误。"""
    try:
        return pw.chromium.launch(channel="msedge", headless=True)
    except Exception as e:  # noqa: BLE001
        raise RuntimeError("无法启动 Edge(channel=msedge)：%s" % e) from e


def new_context(browser, viewport=(390, 844), dsf=2, service_workers="allow",
                cache_disabled=False, offline=False, reduced_motion=None,
                init_script=None, timezone="Asia/Shanghai"):
    ctx = browser.new_context(
        viewport={"width": viewport[0], "height": viewport[1]},
        device_scale_factor=dsf,
        is_mobile=True,
        has_touch=True,
        locale="zh-CN",
        timezone_id=timezone,
        color_scheme="dark",
        service_workers=service_workers,
    )
    if offline:
        ctx.set_offline(True)
    if cache_disabled:
        ctx.add_init_script("try{sessionStorage.setItem('__qa','1')}catch(e){}")
    if reduced_motion is not None:
        try:
            ctx.emulate_media(reduced_motion="reduce" if reduced_motion else "no-preference")
        except Exception:
            pass
    if init_script:
        ctx.add_init_script(init_script)
    return ctx


class PageSession:
    """一个页面 + 它下面所有错误/请求证据的收集器。"""

    def __init__(self, context, page):
        self.context = context
        self.page = page
        self.console_errors = []
        self.console_warnings = []
        self.pageerrors = []
        self.failed_requests = []
        self.bad_responses = []
        self.requests = []
        page.on("console", self._on_console)
        page.on("pageerror", self._on_pageerror)
        page.on("requestfailed", self._on_requestfailed)
        page.on("response", self._on_response)
        page.on("request", self._on_request)

    def _on_console(self, msg):
        try:
            if msg.type == "error":
                self.console_errors.append(msg.text)
            elif msg.type == "warning":
                self.console_warnings.append(msg.text)
        except Exception:
            pass

    def _on_pageerror(self, err):
        self.pageerrors.append("%s: %s" % (type(err).__name__, err))

    def _on_requestfailed(self, req):
        self.failed_requests.append({"url": req.url, "failure": req.failure})

    def _on_response(self, resp):
        try:
            if resp.status >= 400:
                self.bad_responses.append({"url": resp.url, "status": resp.status})
        except Exception:
            pass

    def _on_request(self, req):
        self.requests.append(req.url)

    def clear(self):
        self.console_errors.clear()
        self.console_warnings.clear()
        self.pageerrors.clear()
        self.failed_requests.clear()
        self.bad_responses.clear()
        self.requests.clear()

    def js_errors(self):
        return list(self.pageerrors)

    def report(self):
        return {
            "pageerrors": list(self.pageerrors),
            "console_errors": list(self.console_errors),
            "console_warnings": list(self.console_warnings)[:20],
            "failed_requests": list(self.failed_requests)[:20],
            "bad_responses": list(self.bad_responses)[:20],
        }


# ---------------------------------------------------------------- DOM 定位
def _resolve(page, spec):
    """spec 支持：
    - 'css'                       普通 CSS（如 [data-test="roll"]）
    - 'test:roll'                 [data-test="roll"]
    - 'text:掷骰' / 'text:/掷出\\s*[1-6]/'   文本
    - 'role:button:/摆上棋盘|开始/'         角色 + 正则
    """
    if callable(spec):
        return spec(page)
    s = str(spec)
    if s.startswith("test:"):
        return page.locator('[data-test="%s"]' % s[5:])
    if s.startswith("text:"):
        v = s[5:]
        return page.get_by_text(_pattern(v))
    if s.startswith("role:"):
        body = s[5:]
        role, _, name = body.partition(":")
        return page.get_by_role(role.strip(), name=_pattern(name.strip()))
    if s.startswith("aria:"):
        return page.get_by_label(_pattern(s[5:]))
    return page.locator(s)


def _pattern(v):
    if len(v) >= 2 and v.startswith("/") and v.rfind("/") > 0:
        end = v.rfind("/")
        flags = v[end + 1:]
        fl = 0
        if "i" in flags:
            fl |= re.IGNORECASE
        if "s" in flags:
            fl |= re.DOTALL
        return re.compile(v[1:end], fl)
    return re.compile(re.escape(v)) if v else re.compile("")


def find(page, candidates, timeout=2000, visible=True):
    """返回 (locator, 命中的候选) 或 (None, None)。候选按顺序尝试。"""
    deadline = time.time() + timeout / 1000.0
    last_err = None
    while True:
        for c in candidates:
            try:
                loc = _resolve(page, c).first
                if loc.count() > 0:
                    if not visible or loc.is_visible():
                        return loc, c
            except Exception as e:  # noqa: BLE001
                last_err = e
        if time.time() >= deadline:
            return None, last_err
        page.wait_for_timeout(60)


def exists(page, candidates, timeout=600):
    loc, _ = find(page, candidates, timeout=timeout)
    return loc is not None


def click(page, candidates, timeout=6000, force=False, desc=""):
    loc, hit = find(page, candidates, timeout=timeout)
    if loc is None:
        raise AssertionError("找不到可点击控件：%s（候选=%s）" % (desc or "", candidates))
    try:
        loc.scroll_into_view_if_needed(timeout=1500)
    except Exception:
        pass
    loc.click(timeout=timeout, force=force)
    return hit


def try_click(page, candidates, timeout=800):
    loc, hit = find(page, candidates, timeout=timeout)
    if loc is None:
        return None
    try:
        loc.click(timeout=timeout)
        return hit
    except Exception:
        return None


# ---------------------------------------------------------------- 页面状态
def body_text(page) -> str:
    try:
        return page.evaluate("() => document.body ? document.body.innerText : ''") or ""
    except Exception:
        return ""


def body_html_len(page) -> int:
    try:
        return page.evaluate("() => document.body ? document.body.innerHTML.length : 0")
    except Exception:
        return 0


def screen_name(page):
    try:
        return page.evaluate(
            """() => {
                var b = document.body.getAttribute('data-screen');
                if (b) return b;
                var el = document.querySelector('[data-screen]');
                return el ? el.getAttribute('data-screen') : null;
            }"""
        )
    except Exception:
        return None


def wait_screen(page, names, timeout=8000):
    names = [names] if isinstance(names, str) else list(names)
    deadline = time.time() + timeout / 1000.0
    while time.time() < deadline:
        cur = screen_name(page)
        if cur in names:
            return cur
        page.wait_for_timeout(80)
    return screen_name(page)


def wait_text(page, pattern, timeout=3000, require_visible=False):
    """轮询 body.innerText 直到匹配；返回 (匹配到的文本, 耗时ms) 或 (None, 耗时ms)。"""
    rx = re.compile(pattern) if isinstance(pattern, str) else pattern
    t0 = time.time()
    deadline = t0 + timeout / 1000.0
    while time.time() < deadline:
        txt = body_text(page)
        m = rx.search(txt)
        if m:
            return m.group(0), int((time.time() - t0) * 1000)
        page.wait_for_timeout(50)
    return None, int((time.time() - t0) * 1000)


def app_version(page) -> str:
    try:
        return page.evaluate("() => (window.App && App.version) || ''") or ""
    except Exception:
        return ""


def v6_probe(page) -> dict:
    try:
        return page.evaluate(
            """() => ({
                version: (window.App && App.version) || '',
                has_test_hook: !!(window.__V6_TEST__),
                has_force_die: !!(window.__V6_TEST__ && typeof window.__V6_TEST__.forceDie === 'function'),
                squares: document.querySelectorAll('[data-square]').length,
                pieces: document.querySelectorAll('[data-piece]').length,
                screens: Array.prototype.map.call(document.querySelectorAll('[data-screen]'),
                          function(e){ return e.getAttribute('data-screen'); }),
                body_screen: document.body ? document.body.getAttribute('data-screen') : null,
                has_boardview: !!(window.App && App.BoardView),
                has_flight: !!(window.App && App.Flight),
                has_store: !!(window.App && App.Store)
            })"""
        )
    except Exception:
        return {"version": "", "has_test_hook": False, "has_force_die": False, "squares": 0,
                "pieces": 0, "screens": [], "body_screen": None, "has_boardview": False,
                "has_flight": False, "has_store": False}


def is_v6(page) -> bool:
    p = v6_probe(page)
    return bool(p.get("version", "").startswith("6") or p.get("has_test_hook") or p.get("squares", 0) > 0)


def v6_gap_text(page) -> str:
    p = v6_probe(page)
    return ("实现未就绪：App.version=%r，data-square=%d，__V6_TEST__=%s，body[data-screen]=%r"
            % (p.get("version"), p.get("squares", 0), p.get("has_test_hook"), p.get("body_screen")))


def get_session(page):
    try:
        return page.evaluate(
            "() => { try { return (window.App && App.Store && App.Store.getSession()) ? App.Store.getSession() : null; } catch(e) { return null; } }"
        )
    except Exception:
        return None


def get_settings(page):
    try:
        return page.evaluate(
            "() => { try { return (window.App && App.Store && App.Store.getSettings()) ? App.Store.getSettings() : null; } catch(e) { return null; } }"
        )
    except Exception:
        return None


def session_summary(page):
    """返回一局的最小状态摘要（读 Store，缺失字段为 None）。V6.1 起额外给到家/保底/胜者。"""
    s = get_session(page) or {}
    meta = s.get("meta") or {}
    aw = s.get("awaiting") or {}
    return {
        "phase": s.get("phase"),
        "mode": s.get("mode"),
        "turn": s.get("turn"),
        "planeCount": s.get("planeCount"),
        "cardsProcessed": s.get("cardsProcessed"),
        "targetCards": s.get("targetCards"),
        "targetHeat": s.get("targetHeat"),
        "heat": meta.get("heat"),
        "streak": meta.get("streak"),
        "bestStreak": meta.get("streakBest"),
        "awaiting": aw.get("type"),
        "prompt_kind": (aw.get("prompt") or {}).get("kind"),
        "prompt_actor": (aw.get("prompt") or {}).get("actorId") or (aw.get("prompt") or {}).get("actor"),
        "endingIndex": s.get("endingIndex"),
        "winnerId": s.get("winnerId"),
        "takeoffMiss": s.get("takeoffMiss"),
        "planesHome": None if not s else _planes_home_of(s),
        "log_len": len(s.get("log") or []),
    }


def _planes_home_of(s):
    out = {"a": 0, "b": 0}
    for p in (s.get("pieces") or []):
        pid = p.get("playerId")
        if pid in out and p.get("arrived"):
            out[pid] += 1
    return out


def eval_js(page, js, arg=None):
    try:
        if arg is None:
            return page.evaluate(js)
        return page.evaluate(js, arg)
    except Exception:
        return None


def viewport_metrics(page):
    """返回 scrollWidth/clientWidth 是否横向溢出。"""
    try:
        return page.evaluate(
            """() => {
                var de = document.documentElement, b = document.body;
                return {
                    html_scroll: de.scrollWidth, html_client: de.clientWidth,
                    body_scroll: b ? b.scrollWidth : 0, body_client: b ? b.clientWidth : 0,
                    inner_width: window.innerWidth,
                    scroll_y: window.scrollY || 0
                };
            }"""
        )
    except Exception:
        return {}


def overflow(page):
    m = viewport_metrics(page) or {}
    hs = m.get("html_scroll", 0)
    hc = m.get("html_client", 0) or m.get("inner_width", 0)
    return hs > (hc + 1)


def element_rect(loc):
    try:
        box = loc.bounding_box()
        return box
    except Exception:
        return None


def hit_test(page, loc):
    box = element_rect(loc)
    if not box:
        return None
    x = box["x"] + box["width"] / 2.0
    y = box["y"] + box["height"] / 2.0
    return page.evaluate(
        """(pt) => {
            var el = document.elementFromPoint(pt[0], pt[1]);
            if (!el) return null;
            return {
                tag: el.tagName,
                test: el.getAttribute('data-test'),
                cls: (el.className && String(el.className)) || '',
                text: (el.innerText || '').slice(0, 40)
            };
        }""",
        [x, y],
    )


def point_in_viewport(box, viewport):
    if not box:
        return False
    x0, y0 = box["x"], box["y"]
    x1, y1 = x0 + box["width"], y0 + box["height"]
    return x0 >= -0.5 and y0 >= -0.5 and x1 <= viewport[0] + 0.5 and y1 <= viewport[1] + 0.5


def text_font_size(page, locator):
    try:
        return page.evaluate(
            """(el) => {
                if (!el) return null;
                var cs = getComputedStyle(el);
                return {size: parseFloat(cs.fontSize), lineHeight: cs.lineHeight, color: cs.color};
            }""",
            locator.element_handle(),
        )
    except Exception:
        return None


# ---------------------------------------------------------------- 测试钩子
def install_die_hook(page):
    """安装骰子注入：
    1) 优先 window.__V6_TEST__.forceDie(n)（任务卡约定的 FE 钩子）；
    2) 否则兜底 monkey-patch App.Flight.roll(state, dieOpt) 注入点数（仅测试侧，不改实现）。
    返回 {'mode': 'v6_test'|'patch'|'none', ...}
    """
    return page.evaluate(
        """() => {
            var out = {mode: 'none'};
            var T = window.__V6_TEST__;
            if (T && typeof T.forceDie === 'function') {
                out.mode = 'v6_test';
                return out;
            }
            if (!(window.App && App.Flight && typeof App.Flight.roll === 'function')) return out;
            var orig = App.Flight.roll.bind(App.Flight);
            if (!App.Flight.__qaOrigRoll) App.Flight.__qaOrigRoll = orig;
            App.Flight.roll = function(state, dieOpt) {
                if ((dieOpt === undefined || dieOpt === null || dieOpt === '') &&
                    window.__QA_FORCE_DIE__ != null) {
                    dieOpt = window.__QA_FORCE_DIE__;
                }
                return App.Flight.__qaOrigRoll(state, dieOpt);
            };
            out.mode = 'patch';
            return out;
        }"""
    )


def set_die(page, n):
    page.evaluate(
        """(n) => {
            window.__QA_FORCE_DIE__ = n;
            var T = window.__V6_TEST__;
            if (T && typeof T.forceDie === 'function') T.forceDie(n);
        }""",
        n,
    )


def plan_die(page, target_kinds=None, prefer_prompt=True):
    """用引擎纯函数挑选下一掷：返回 {die, pieceId, kind, reason}。
    只读 App.Flight.legalMoves / App.FlightBoard，不推进状态。
    """
    target_kinds = target_kinds or [
        "truth", "dare", "touch", "fate", "home-entry", "minigame-thermo", "minigame-wheel",
        "thermo", "wheel",
    ]
    return page.evaluate(
        """(targets) => {
            var state = null;
            try { state = App.Store.getSession(); } catch (e) { return {error: 'no-session'}; }
            if (!state) return {error: 'no-session'};
            if (!(App.Flight && App.Flight.legalMoves && App.FlightBoard)) return {error: 'no-engine'};
            var map = App.FlightBoard.map ? App.FlightBoard.map() : null;
            function squareKind(id) {
                if (!id) return 'none';
                if (id === 'goal') return 'goal';
                var sq = App.FlightBoard.square ? App.FlightBoard.square(id) : null;
                if (!sq) return 'none';
                return sq.kind || 'ring';
            }
            function destInfo(state, pid, die) {
                var r = App.Flight.legalMoves(state, die);
                if (!r || !r.moves || !r.moves[pid]) return null;
                var mv = r.moves[pid];
                var path = mv.path || [];
                var dest = path.length ? path[path.length - 1] : null;
                var kind = squareKind(dest);
                var info = {dest: dest, kind: kind, path: path};
                // 进航题：落点 == 该颜色的 home entry
                var p = null;
                for (var i = 0; i < state.pieces.length; i++) if (state.pieces[i].id === pid) p = state.pieces[i];
                if (p && map && map.homeEntryOf && map.homeEntryOf[p.color] === dest) {
                    info.kind = 'home-entry';
                }
                // 叠机/击落：落点有其他颜色棋子
                var others = [];
                for (var j = 0; j < state.pieces.length; j++) {
                    var q = state.pieces[j];
                    if (q.id !== pid && !q.arrived && q.squareId === dest) others.push(q);
                }
                if (others.length) {
                    info.kind = (p && others.some(function(o){ return o.color === p.color; })) ? 'stack' : 'capture';
                    info.others = others.map(function(o){ return o.id; });
                }
                return info;
            }
            var priority = ['truth', 'dare', 'touch', 'home-entry', 'fate', 'thermo', 'wheel',
                            'capture', 'stack', 'ring', 'home', 'goal', 'hangar'];
            var best = null;
            for (var die = 1; die <= 6; die++) {
                var r = App.Flight.legalMoves(state, die);
                if (!r || !r.pieceIds || !r.pieceIds.length) continue;
                for (var k = 0; k < r.pieceIds.length; k++) {
                    var pid = r.pieceIds[k];
                    var info = destInfo(state, pid, die);
                    if (!info) continue;
                    var rank = priority.indexOf(info.kind);
                    if (rank < 0) rank = 50;
                    // 若目标集合给出，只优先目标内的
                    var wanted = targets.indexOf(info.kind) >= 0 ||
                                 (info.kind === 'capture' && targets.indexOf('capture') >= 0) ||
                                 (info.kind === 'stack' && targets.indexOf('stack') >= 0);
                    var score = (wanted ? 0 : 100) + rank;
                    // 不在目标里时，优先避开会额外打断主路径的格子（命运/小游戏/棋类事件）
                    if (!wanted && (info.kind === 'fate' || info.kind === 'thermo' ||
                                    info.kind === 'wheel' || info.kind === 'capture' ||
                                    info.kind === 'stack')) {
                        score += 60;
                    }
                    if (!best || score < best.score) {
                        best = {die: die, pieceId: pid, kind: info.kind, dest: info.dest,
                                score: score, wanted: wanted};
                    }
                }
            }
            if (best) return best;
            // 没有任何合法走子：返回默认点数（引擎会判无子可走）
            return {die: 6, pieceId: null, kind: 'none', noMove: true};
        }""",
        target_kinds,
    )


def plan_piece_for_die(page, die):
    """给定本次骰子点数，返回每架可走子的落点信息（用于按计划点选文字按钮）。
    返回 {pieces: [{pieceId, kind, dest}], die}。
    """
    return page.evaluate(
        """(die) => {
            var state = null;
            try { state = App.Store.getSession(); } catch (e) { return {error: 'no-session'}; }
            if (!state || !App.Flight || !App.Flight.legalMoves) return {error: 'no-engine'};
            var r = App.Flight.legalMoves(state, die);
            if (!r || !r.pieceIds) return {error: 'no-moves', pieces: []};
            var out = [];
            for (var i = 0; i < (r.pieceIds || []).length; i++) {
                var pid = r.pieceIds[i];
                var mv = (r.moves || {})[pid] || {};
                var path = mv.path || [];
                var dest = path.length ? path[path.length - 1] : null;
                var sq = dest && App.FlightBoard ? App.FlightBoard.square(dest) : null;
                var map = App.FlightBoard && App.FlightBoard.map ? App.FlightBoard.map() : null;
                var p = null;
                (state.pieces || []).forEach(function (q) { if (q.id === pid) p = q; });
                var kind = sq ? sq.kind : 'none';
                if (p && map && map.homeEntryOf && map.homeEntryOf[p.color] === dest) kind = 'home-entry';
                out.push({pieceId: pid, dest: dest, kind: kind});
            }
            return {die: die, pieces: out};
        }""",
        die,
    )


def force_prompt_kind(page, kind):
    """P1 钩子：若 FE 提供 __V6_TEST__.forcePromptKind 则使用；否则返回 False。"""
    return bool(
        page.evaluate(
            """(kind) => {
                var T = window.__V6_TEST__;
                if (T && typeof T.forcePromptKind === 'function') { T.forcePromptKind(kind); return true; }
                return false;
            }""",
            kind,
        )
    )


# ---------------------------------------------------------------- V6.1 局面夹具
# 说明：V6.1 结束条件 = 一方全部飞机到家（spec §7 允许测试侧注入局面）。
# 夹具只写 localStorage 里的合法 session（经 App.Flight.validate 校验），不改实现代码；
# 注入后按 §7 刷新页面 → 点「继续今晚飞行棋」，点击计数从「继续」开始。
SESSION_KEY = "couple2.session"
HISTORY_KEY = "couple2.history"
COLORS_ZH = {"red": "红", "yellow": "黄", "blue": "蓝", "green": "绿"}


def color_zh(color_id) -> str:
    return COLORS_ZH.get(str(color_id or ""), str(color_id or ""))


def install_event_recorder(page):
    """测试侧记录引擎事件（不改实现）：包一层 App.Flight.roll/move/resolvePrompt，
    把返回的 events 追加进 window.__QA_EVENTS__，用于断言 win / dice.pity / turn 顺序。"""
    return page.evaluate(
        """() => {
            if (window.__QA_EVENTS__ && window.__QA_EVENTS__.installed) return true;
            if (!(window.App && App.Flight)) return false;
            var store = {installed: true, events: []};
            window.__QA_EVENTS__ = store;
            ['roll', 'move', 'resolvePrompt', 'resolveMinigame'].forEach(function (name) {
                var orig = App.Flight[name];
                if (typeof orig !== 'function' || orig.__qaWrapped) return;
                var wrapped = function () {
                    var out = orig.apply(App.Flight, arguments);
                    try {
                        if (out && out.ok && out.events) {
                            out.events.forEach(function (e) {
                                store.events.push({fn: name, type: e && e.type, ev: e});
                            });
                        }
                    } catch (err) {}
                    return out;
                };
                wrapped.__qaWrapped = true;
                App.Flight[name] = wrapped;
            });
            return true;
        }"""
    )


def recorded_events(page, clear=False):
    out = page.evaluate(
        "() => { try { return (window.__QA_EVENTS__ && window.__QA_EVENTS__.events) || []; } catch (e) { return []; } }"
    )
    if clear:
        page.evaluate("() => { try { if (window.__QA_EVENTS__) window.__QA_EVENTS__.events = []; } catch (e) {} }")
    return out or []


def fixture_place(page, placements, turn="a", cards_processed=None, heat=None,
                  takeoff_miss=None, reload=True, settle_ms=900):
    """通用局面夹具：按 placements {pieceId: squareId} 摆棋子，写成合法 session 后刷新。

    - squareId 支持 `{a}` / `{b}` 占位符（替换成该玩家颜色），如 `home:{a}:4`；
    - 以 `:goal` 结尾的格子自动置 arrived=true；
    - turn 指定行动方；cards_processed / heat 用于验证「题卡数/心动值不触发结束」；
    - 返回 valid session（dict）或 None（失败时调用方 FAIL 并给复现步骤）。
    """
    payload = {
        "placements": placements,
        "turn": turn,
        "cardsProcessed": cards_processed,
        "heat": heat,
        "takeoffMiss": takeoff_miss,
    }
    res = page.evaluate(
        """(a) => {
            try {
                var s = App.Store.getSession();
                if (!s) return {ok: false, error: 'no-session'};
                var colors = s.colors || {a: 'red', b: 'yellow'};
                var map = {'{a}': colors.a || 'red', '{b}': colors.b || 'yellow'};
                s.turn = a.turn === 'b' ? 'b' : 'a';
                s.phase = 'playing';
                s.awaiting = {type: 'roll'};
                s.winnerId = null;
                s.endingQueue = null;
                s.endingIndex = 0;
                s.pendingMove = null;
                s.rollContext = null;
                if (a.takeoffMiss) s.takeoffMiss = {a: Number(a.takeoffMiss.a) || 0, b: Number(a.takeoffMiss.b) || 0};
                if (a.cardsProcessed !== null && a.cardsProcessed !== undefined) s.cardsProcessed = Number(a.cardsProcessed);
                if (a.heat !== null && a.heat !== undefined) { s.meta = s.meta || {}; s.meta.heat = Number(a.heat); }
                (s.pieces || []).forEach(function (p) {
                    var sq = a.placements[p.id];
                    if (sq === null || sq === undefined) return;
                    sq = String(sq).replace('{a}', map['{a}']).replace('{b}', map['{b}']);
                    p.squareId = sq;
                    p.arrived = sq.indexOf(':goal') >= 0;
                    p.stackGroupId = null;
                });
                var valid = App.Flight.validate(s);
                if (!valid) return {ok: false, error: 'validate-null'};
                localStorage.setItem('couple2.session', JSON.stringify(valid));
                return {ok: true, state: valid};
            } catch (e) {
                if (window.console) console.error('QA_FIXTURE', e);
                return {ok: false, error: String((e && e.message) || e)};
            }
        }""",
        payload,
    )
    if not isinstance(res, dict) or not res.get("ok"):
        return None
    if reload:
        page.reload(wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(settle_ms)
    return res.get("state")


def fixture_near_home(page, pid="a", steps=(3, 4), cards_processed=None, heat=None,
                      takeoff_miss=None, reload=True, settle_ms=900):
    """夹具：pid 一方只剩最后 len(steps) 架未到家（停在 home:*:<step>），其余已到家；
    对方全部留机坪。默认 steps=(3,4)：掷 1 时两架都能走；
    steps=(4,) 时唯一一架走 1 即到家（用于「一方全部到家 → 收尾」）。
    返回 (state, pending_piece_ids) 或 (None, [])。
    """
    sess = get_session(page) or {}
    total = int(sess.get("planeCount") or 2)
    steps = tuple(steps) if steps else (4,)
    if len(steps) > total:
        steps = steps[-total:]
    other = "b" if pid == "a" else "a"
    placements = {}
    start = total - len(steps)
    for i in range(total):
        if i < start:
            placements["%s:%d" % (pid, i)] = "home:{%s}:goal" % pid
        else:
            placements["%s:%d" % (pid, i)] = "home:{%s}:%d" % (pid, steps[i - start])
    for i in range(total):
        placements["%s:%d" % (other, i)] = "hangar:{%s}:%d" % (other, i)
    state = fixture_place(page, placements, turn=pid, cards_processed=cards_processed,
                          heat=heat, takeoff_miss=takeoff_miss, reload=reload,
                          settle_ms=settle_ms)
    pending = ["%s:%d" % (pid, i) for i in range(start, total)]
    return state, pending


def continue_session(page, timeout=8000):
    """刷新后从门厅点「继续今晚飞行棋」回主桌；返回是否回到 data-screen=table。"""
    loc, _ = find(page, ["test:continue-flight", "test:continue",
                         "role:button:/继续今晚飞行棋/", "text:/继续今晚飞行棋/"], timeout=timeout)
    if loc is not None:
        try:
            loc.click(timeout=6000)
        except Exception:
            return False
    return wait_screen(page, ["table"], timeout=timeout) == "table"


def put_history(page, entries):
    """写入历史（旧档兼容用例用）：entries 为 list[dict]。返回写入条数或 None。"""
    return page.evaluate(
        """(list) => {
            try {
                localStorage.setItem('couple2.history', JSON.stringify(list));
                return list.length;
            } catch (e) { return null; }
        }""",
        entries,
    )


def old_ledger_entry(ending="shared", names=("阿岚", "阿策")):
    """构造旧档回顾条目（V6.0 合作收尾 / shared：无 winnerId、stats.planesHome 为旧总数）。"""
    return {
        "id": "qa-old-" + str(ending),
        "ts": 1763300000000,
        "kind": "flight",
        "title": "今晚飞行棋",
        "names": {"a": names[0], "b": names[1]},
        "endingName": "今晚一起走完",
        "note": "",
        "safe": False,
        "ledger": {
            "v": 2,
            "date": "2026-11-16",
            "startedAt": 1763297000000,
            "endedAt": 1763300000000,
            "durationMs": 3000000,
            "names": {"a": names[0], "b": names[1]},
            "colors": {"a": "red", "b": "yellow"},
            "scale": "warm",
            "mode": "quick",
            "planeCount": 2,
            "ending": ending,
            "stats": {
                "cardsDone": 3,
                "cardsSkipped": 1,
                "heat": 24,
                "bestStreak": 2,
                "minigames": 0,
                "planesHome": 2,
            },
            "prompts": [
                {"kind": "cell-truth", "outcome": "done", "actorId": "a",
                 "card": {"id": "old-1", "text": "旧档里的一张卡。", "star": 2}},
            ],
            "minigames": [],
        },
    }


def drop_takeoff_miss(page):
    """旧档兼容夹具：删掉 localStorage 里的 takeoffMiss（模拟 V6.0 存档）。返回删除前的键列表。"""
    return page.evaluate(
        """() => {
            try {
                var raw = localStorage.getItem('couple2.session');
                if (!raw) return null;
                var s = JSON.parse(raw);
                var had = Object.keys(s || {});
                delete s.takeoffMiss;
                delete s.winnerId;
                localStorage.setItem('couple2.session', JSON.stringify(s));
                return had;
            } catch (e) { return null; }
        }"""
    )


# ---------------------------------------------------------------- 交互原语
def safe_longpress(page, locator, hold_ms=1700, box=None):
    box = box or element_rect(locator)
    if not box:
        raise AssertionError("安全词元素没有可点击区域")
    cx = box["x"] + box["width"] / 2.0
    cy = box["y"] + box["height"] / 2.0
    page.mouse.move(cx, cy)
    page.mouse.down()
    page.wait_for_timeout(hold_ms)
    page.mouse.up()


def safe_shortpress(page, locator, hold_ms=600):
    safe_longpress(page, locator, hold_ms=hold_ms)


def wait_until(page, predicate_js, timeout=4000, interval=80, arg=None):
    """轮询 page.evaluate(predicate_js)；返回结果或 None。"""
    deadline = time.time() + timeout / 1000.0
    while time.time() < deadline:
        try:
            r = page.evaluate(predicate_js, arg) if arg is not None else page.evaluate(predicate_js)
            if r:
                return r
        except Exception:
            pass
        page.wait_for_timeout(interval)
    return None


def click_and_time(page, selector, watch_js, timeout_ms=3000):
    """页内真实点击 + 页内计时：返回 {ok, click_to_ms, text} 或 {ok: False, error}。

    为什么不用 Playwright 的 click 计时：playwright 的 click 会等元素「稳定」（棋盘动画期间
    按钮每帧轻微位移，实测会额外等 1s+），那是测试框架开销，不是产品延迟。这里在页面里点
    真实按钮（同一个 click 事件/处理器），用 performance.now() 量「点击 → DOM 文本出现」。
    """
    return page.evaluate(
        """(a) => new Promise(function (resolve) {
            var btn = document.querySelector(a.sel);
            if (!btn) { resolve({ok: false, error: 'no-element'}); return; }
            var watch = null;
            try { watch = new Function('return (' + a.watch + ')'); }
            catch (e) { resolve({ok: false, error: 'bad-watch'}); return; }
            var t0 = performance.now();
            var done = false;
            function check() {
                if (done) return;
                var hit = null;
                try { hit = watch(); } catch (e) { hit = null; }
                if (hit) {
                    done = true;
                    clearInterval(iv);
                    resolve({ok: true, click_to_ms: Math.round(performance.now() - t0),
                             text: String(hit)});
                    return;
                }
                if (performance.now() - t0 > a.timeout) {
                    done = true;
                    clearInterval(iv);
                    resolve({ok: false, error: 'timeout',
                             click_to_ms: Math.round(performance.now() - t0)});
                }
            }
            var iv = setInterval(check, 16);
            btn.click();
            check();
        })""",
        {"sel": selector, "watch": watch_js, "timeout": timeout_ms},
    )


# ---------------------------------------------------------------- 记录器 / 报告
class Recorder:
    def __init__(self, suite: str, meta: dict | None = None):
        self.suite = suite
        self.meta = meta or {}
        self.checks = []
        self.defects = []
        self.shots = []
        self.notes = []
        self.t0 = time.time()
        self._defect_n = 0

    # -- 检查
    def check(self, cid, name, status, expected="", actual="", ac="", evidence="",
              severity="P0", viewport="", duration_ms=None, detail=""):
        row = {
            "id": cid, "name": name, "status": status, "ac": ac,
            "severity": severity, "viewport": viewport,
            "expected": expected, "actual": actual,
            "evidence": evidence, "detail": detail,
            "duration_ms": duration_ms, "suite": self.suite,
            "time": now_str(),
        }
        self.checks.append(row)
        return row

    def ok(self, cid, name, expected="", actual="", ac="", evidence="", severity="P0",
           viewport="", duration_ms=None, detail=""):
        return self.check(cid, name, "PASS", expected, actual, ac, evidence, severity,
                          viewport, duration_ms, detail)

    def fail(self, cid, name, expected="", actual="", ac="", evidence="", severity="P0",
             viewport="", duration_ms=None, detail="", defect=True, repro="", owner="FE"):
        row = self.check(cid, name, "FAIL", expected, actual, ac, evidence, severity,
                         viewport, duration_ms, detail)
        if defect:
            self.defect(cid, name, expected, actual, severity=severity, repro=repro,
                        evidence=evidence, viewport=viewport, owner=owner)
        return row

    def skip(self, cid, name, reason, ac="", severity="P0", viewport="", evidence=""):
        return self.check(cid, name, "SKIP", expected=reason, actual="未执行",
                          ac=ac, evidence=evidence, severity=severity, viewport=viewport,
                          detail=reason)

    # -- 缺陷
    def defect(self, check_id, title, expected, actual, severity="P0", repro="",
               evidence="", viewport="", owner="FE", note=""):
        self._defect_n += 1
        d = {
            "id": "Q-%02d" % self._defect_n,
            "check_id": check_id,
            "title": title,
            "severity": severity,
            "expected": expected,
            "actual": actual,
            "repro": repro,
            "evidence": evidence,
            "viewport": viewport,
            "owner": owner,
            "note": note,
            "suite": self.suite,
            "time": now_str(),
        }
        self.defects.append(d)
        return d

    # -- 截图
    def shot(self, page, name, full_page=False):
        suite_dir = SHOTS / self.suite
        suite_dir.mkdir(parents=True, exist_ok=True)
        path = suite_dir / (name + ".png")
        try:
            page.screenshot(path=str(path), full_page=full_page, timeout=8000)
            rel = str(path.relative_to(ROOT)).replace("\\", "/")
            self.shots.append(rel)
            return rel
        except Exception as e:  # noqa: BLE001
            self.notes.append("截图失败 %s: %s" % (name, e))
            return None

    def add_note(self, text):
        self.notes.append(text)

    # -- 统计
    def counts(self):
        out = {"PASS": 0, "FAIL": 0, "SKIP": 0}
        for c in self.checks:
            out[c["status"]] = out.get(c["status"], 0) + 1
        return out

    def p0(self):
        return [c for c in self.checks if c.get("severity") == "P0"]

    def conclusion(self):
        """P0 FAIL → FAIL；P1 FAIL / 任意 SKIP → PARTIAL；否则 PASS。"""
        p0_fail = [c for c in self.checks if c["status"] == "FAIL" and c.get("severity") == "P0"]
        p1_fail = [c for c in self.checks if c["status"] == "FAIL" and c.get("severity") != "P0"]
        skips = [c for c in self.checks if c["status"] == "SKIP"]
        if p0_fail:
            return "FAIL"
        if p1_fail or skips:
            return "PARTIAL"
        return "PASS" if self.checks else "PARTIAL"

    def ensure_defects(self):
        """任何 FAIL 检查都必须有一条可复现缺陷，避免「有失败无缺陷编号」。"""
        known = {d.get("check_id") for d in self.defects}
        for c in self.checks:
            if c["status"] != "FAIL" or c["id"] in known:
                continue
            self.defect(
                c["id"], c["name"],
                c.get("expected") or "见用例",
                c.get("actual") or "见用例",
                severity=c.get("severity", "P0"),
                repro="见用例 %s（%s）" % (c["id"], c.get("name", "")),
                evidence=c.get("evidence") or "",
                viewport=c.get("viewport") or "",
                owner="FE",
            )
        return self.defects

    def to_json(self):
        return {
            "suite": self.suite,
            "meta": self.meta,
            "generated_at": now_str(),
            "duration_ms": int((time.time() - self.t0) * 1000),
            "counts": self.counts(),
            "conclusion": self.conclusion(),
            "checks": self.checks,
            "defects": self.defects,
            "shots": self.shots,
            "notes": self.notes,
        }


def _md_escape(s) -> str:
    return str(s).replace("|", "\\|").replace("\n", " ")


def write_suite_report(rec: Recorder, name: str, extra_md: list | None = None,
                       conclusion_override: str | None = None):
    """写 reports/v6/<name>.json + .md（单独跑各脚本时使用）。"""
    REPORTS.mkdir(parents=True, exist_ok=True)
    rec.ensure_defects()
    data = rec.to_json()
    if conclusion_override:
        data["conclusion"] = conclusion_override
    json_path = REPORTS / (name + ".json")
    json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    counts = data["counts"]
    lines = []
    lines.append("# QA · %s · %s" % (rec.suite, data["conclusion"]))
    lines.append("")
    lines.append("- 生成时间：%s" % data["generated_at"])
    lines.append("- 耗时：%.1fs" % (data["duration_ms"] / 1000.0))
    lines.append("- 环境：%s" % json.dumps(rec.meta, ensure_ascii=False))
    lines.append("- 用例：PASS %d / FAIL %d / SKIP %d" % (counts.get("PASS", 0), counts.get("FAIL", 0), counts.get("SKIP", 0)))
    lines.append("")
    if extra_md:
        lines.extend(extra_md)
        lines.append("")
    lines.append("## 用例明细")
    lines.append("")
    lines.append("| 用例 | AC | 视口 | 状态 | 期望 | 实际 | 证据 |")
    lines.append("|---|---|---|---|---|---|---|")
    for c in rec.checks:
        lines.append("| %s %s | %s | %s | **%s** | %s | %s | %s |" % (
            c["id"], _md_escape(c["name"]), _md_escape(c.get("ac", "")),
            _md_escape(c.get("viewport", "")), c["status"],
            _md_escape(c.get("expected", "")), _md_escape(c.get("actual", "")),
            _md_escape(c.get("evidence", ""))))
    lines.append("")
    lines.append("## 缺陷")
    lines.append("")
    if not rec.defects:
        lines.append("无。")
    else:
        for d in rec.defects:
            lines.append("### %s [%s] %s" % (d["id"], d["severity"], d["title"]))
            lines.append("")
            lines.append("- 用例：%s · 视口：%s · owner：%s" % (d["check_id"], d.get("viewport") or "-", d["owner"]))
            lines.append("- 期望：%s" % d["expected"])
            lines.append("- 实际：%s" % d["actual"])
            lines.append("- 复现步骤：%s" % (d["repro"] or "见用例"))
            lines.append("- 证据：%s" % (d["evidence"] or "-"))
            lines.append("")
    lines.append("## 截图")
    lines.append("")
    if rec.shots:
        for s in rec.shots:
            lines.append("- `%s`" % s)
    else:
        lines.append("（无）")
    lines.append("")
    if rec.notes:
        lines.append("## 备注")
        lines.append("")
        for n in rec.notes:
            lines.append("- %s" % n)
        lines.append("")
    md_path = REPORTS / (name + ".md")
    md_path.write_text("\n".join(lines), encoding="utf-8")
    return json_path, md_path


def merge_results(rec: Recorder, extra: dict):
    """把内置/外部检查合并进 Recorder（供 run_all 汇总）。"""
    for c in extra.get("checks", []):
        rec.checks.append(c)
    for d in extra.get("defects", []):
        rec.defects.append(d)
    for s in extra.get("shots", []):
        if s not in rec.shots:
            rec.shots.append(s)
    for n in extra.get("notes", []):
        rec.notes.append("[%s] %s" % (extra.get("suite", "?"), n))
    for k, v in (extra.get("meta") or {}).items():
        rec.meta.setdefault(k, v)


# ---------------------------------------------------------------- 场景辅助（boot / 开局）
def this_shot(rec: Recorder, page, name):
    """在用例里顺手截图并返回相对路径（证据用）。"""
    try:
        return rec.shot(page, name)
    except Exception:
        return None


BOOT_START = ["test:start", "role:button:/摆上棋盘|开始今晚|开始/", "text:/摆上棋盘|开始今晚/"]
QUICK_MODE = ["test:mode-quick", "test:quick", "role:radio:/快局/", "role:button:/快局/",
              "text:/快局/"]
LONG_MODE = ["test:mode-long", "test:long", "role:radio:/长夜/", "role:button:/长夜/",
             "text:/长夜/"]
RULES_DISMISS = ["test:rules-ok", "test:rules-know", "role:button:/知道了|开始吧|跳过|下一步/",
                 "text:/知道了/"]
CONTINUE = ["test:continue", "role:button:/继续今晚飞行棋|继续/", "text:/继续今晚飞行棋/"]


def ensure_boot(page, rec: Recorder | None = None, dismiss_rules=True, timeout=12000) -> dict:
    """等待门厅出现；若首次引导/规则速览遮挡则按 A5 处理。
    返回 {screen, text, version, v6, rules_text}
    """
    info = {"screen": None, "text": "", "version": "", "v6": False, "rules_text": ""}
    deadline = time.time() + timeout / 1000.0
    while time.time() < deadline:
        if screen_name(page) == "boot" or exists(page, BOOT_START, timeout=200):
            break
        page.wait_for_timeout(120)
    info["screen"] = screen_name(page)
    txt = body_text(page)
    if dismiss_rules and ("玩法速览" in txt or "规则速览" in txt):
        info["rules_text"] = txt
        try_click(page, RULES_DISMISS, timeout=2500)
        page.wait_for_timeout(300)
        info["rules_text"] = txt
        txt = body_text(page)
    info["text"] = txt
    info["version"] = app_version(page)
    info["v6"] = is_v6(page)
    return info


def choose_quick_and_start(page, names=("阿岚", "阿策")):
    """门厅：选快局、填名字、点开始。
    返回 (names, start_selector)。抛错表示门厅控件缺失。
    """
    # 快局（若默认已选则不强制）
    loc, hit = find(page, QUICK_MODE, timeout=1500)
    if loc is not None:
        try_click(page, QUICK_MODE, timeout=1500)
        page.wait_for_timeout(150)

    # 填名字
    fill_names(page, names)

    # 确保颜色不同（若提供了可选色块，选前两个不同色；同色互斥由实现保证）
    select_distinct_colors(page)

    # 开始
    start_hit = click(page, BOOT_START, timeout=6000, desc="开始/摆上棋盘")
    return list(names), start_hit


def fill_names(page, names):
    """名字输入框优先 data-test，再 data-name，再按顺序前两个 input。"""
    inputs = []
    for spec in ("test:name-a", "test:name-b", "input[name='a']", "input[name='b']",
                 "input[data-name='a']", "input[data-name='b']"):
        loc, _ = find(page, [spec], timeout=400)
        if loc is not None and loc not in inputs:
            inputs.append(loc)
    if len(inputs) < 2:
        try:
            all_inputs = page.locator("input[type='text'], input:not([type])")
            n = all_inputs.count()
            inputs = [all_inputs.nth(i) for i in range(min(2, n))]
        except Exception:
            pass
    for loc, name in zip(inputs[:2], names):
        try:
            loc.scroll_into_view_if_needed(timeout=1000)
            loc.fill("")
            loc.fill(str(name))
        except Exception:
            try:
                loc.evaluate("(el, v) => { el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true})); }", str(name))
            except Exception:
                pass
    page.wait_for_timeout(100)


def select_distinct_colors(page):
    """门厅颜色默认已互斥；仅在存在按玩家分组的色块时各点第一个，避免误改同一人。"""
    try:
        a = page.locator("[data-test='colors-a'] [data-color], [data-test='colors-a'] button")
        b = page.locator("[data-test='colors-b'] [data-color], [data-test='colors-b'] button")
        if a.count() and b.count():
            a.first.click(timeout=500)
            b.first.click(timeout=500)
    except Exception:
        pass


def wait_table(page, timeout=8000):
    return wait_screen(page, "table", timeout=timeout)


def read_status(page):
    """从 DOM 读状态条（V6.1 口径）：双方已到家（status-home-a/b）+「第 N 张」+ 心动值/连击/回合。

    返回：
      {cards, target(恒 None：V6.1 无目标张数), heat, streak, turn,
       home: {a: {text, n, total, color}, b: {...}}, cards_text, home_text,
       has_status, text}
    DOM 缺少状态条节点时对应字段为 None，调用方应 SKIP/FAIL（不要臆造）。
    """
    return page.evaluate(
        """() => {
            function txt(sel) {
                var el = document.querySelector(sel);
                return el ? (el.innerText || '').replace(/\\s+/g, ' ').trim() : '';
            }
            function pair(s) {
                var m = /(\\d+)\\s*\\/\\s*(\\d+)/.exec(s || '');
                return m ? {n: Number(m[1]), total: Number(m[2])} : {n: null, total: null};
            }
            function head(s) { return String(s || '').replace(/\\s*\\d+\\s*\\/\\s*\\d+\\s*$/, '').trim(); }
            var body = document.body ? document.body.innerText : '';
            var cardsText = txt('[data-test="status-cards"]');
            var homeA = txt('[data-test="status-home-a"]');
            var homeB = txt('[data-test="status-home-b"]');
            var heatText = txt('[data-test="status-heat"]');
            var streakText = txt('[data-test="status-streak"]');
            var turnText = txt('[data-test="turn-name"]');
            var mc = /第\\s*(\\d+)\\s*张/.exec(cardsText) || /第\\s*(\\d+)\\s*张/.exec(body);
            var mh = /心动值\\s*(\\d+)/.exec(heatText) || /心动值\\s*(\\d+)/.exec(body);
            var ms = /连击\\s*(\\d+)/.exec(streakText) || /连击\\s*(\\d+)/.exec(body);
            var mt = /([^\\n]{1,12}?)\\s*的回合/.exec(turnText || body);
            var pa = pair(homeA), pb = pair(homeB);
            return {
                cards: mc ? Number(mc[1]) : null,
                target: null,
                heat: mh ? Number(mh[1]) : null,
                streak: ms ? Number(ms[1]) : null,
                turn: mt ? mt[1].trim() : null,
                home: {
                    a: {text: homeA, n: pa.n, total: pa.total, color: head(homeA)},
                    b: {text: homeB, n: pb.n, total: pb.total, color: head(homeB)}
                },
                cards_text: cardsText,
                home_text: (homeA && homeB) ? (homeA + ' · ' + homeB) : '',
                heat_text: heatText,
                streak_text: streakText,
                has_status: !!document.querySelector('[data-test="status"]'),
                has_pity: !!document.querySelector('[data-test="takeoff-pity"]'),
                has_winner: !!document.querySelector('[data-test="winner-text"]'),
                text: body.slice(0, 4000)
            };
        }"""
    )


def find_piece_buttons(page):
    """返回可走子文字按钮的 locator 列表（优先 data-action-piece，其次 data-test=piece-choice）。"""
    for spec in ("[data-action-piece]", "[data-test='piece-choice']", "[data-piece-choice]",
                 "[data-test^='piece-']", ".piece-choices button", ".piece-choice"):
        try:
            loc = page.locator(spec)
            n = loc.count()
            if n:
                return [loc.nth(i) for i in range(n)], spec
        except Exception:
            continue
    return [], None
