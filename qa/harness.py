#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""QA 工具库：本地「禁缓存」静态服务 + Playwright 移动端页面 + 控制台收集 + 截图。

被 qa/test_*.py 复用，也可直接跑基线冒烟：
  python qa/harness.py --smoke            # 对 dist/ 跑基线冒烟，输出 reports/baseline-smoke.json

约定：
- 构建产物目录默认 dist/（python tools/build.py 生成）
- 截图输出 reports/screenshots/
- 页面视口默认 390x844（iPhone 12），is_mobile=True, has_touch=True, locale=zh-CN
"""
import argparse
import contextlib
import functools
import http.server
import json
import pathlib
import sys
import threading
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
REPORTS = ROOT / "reports"
SHOTS = REPORTS / "screenshots"


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *args):
        pass


NoCacheHandler.extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map)
NoCacheHandler.extensions_map.update({
    ".webmanifest": "application/manifest+json",
    ".json": "application/json",
    ".js": "text/javascript",
    ".png": "image/png",
})


@contextlib.contextmanager
def serve(directory=None, port=8801):
    directory = str(directory or DIST)
    handler = functools.partial(NoCacheHandler, directory=directory)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    try:
        yield "http://127.0.0.1:%d/" % port
    finally:
        httpd.shutdown()
        httpd.server_close()


class PageBundle:
    """一个移动端页面 + 它的 console/pageerror 收集器。"""

    def __init__(self, context, page, logs):
        self.context = context
        self.page = page
        self.logs = logs

    def errors(self):
        return list(self.logs["errors"])

    def console_errors(self):
        return [c for c in self.logs["console"] if c["type"] in ("error", "warning")]

    def clear_logs(self):
        self.logs["errors"].clear()
        self.logs["console"].clear()

    @contextlib.contextmanager
    def step(self, name):
        """记录某一步新增的 error，有错就打印出来。"""
        before = len(self.logs["errors"])
        yield
        new = self.logs["errors"][before:]
        if new:
            print("  [JS ERROR] %s: %s" % (name, new[:3]))


def new_bundle(browser, viewport=(390, 844), theme_emulate=None, seed=True):
    ctx = browser.new_context(
        viewport={"width": viewport[0], "height": viewport[1]},
        device_scale_factor=3,
        is_mobile=True,
        has_touch=True,
        locale="zh-CN",
        timezone_id="Asia/Shanghai",
        color_scheme="dark",
    )
    if seed:
        # 关掉开场「夜间开场 / 新手引导」自动弹窗，避免挡住自动化点击。
        # 需要测试这两个弹窗时传 seed=False。
        ctx.add_init_script(
            """try{
                localStorage.setItem('couple-onboarded','1');
                if(!localStorage.getItem('couple-night'))localStorage.setItem('couple-night',JSON.stringify({d:new Date().toDateString()}));
            }catch(e){}"""
        )
    page = ctx.new_page()
    logs = {"console": [], "errors": []}

    def on_console(msg):
        if msg.type in ("error", "warning"):
            logs["console"].append({"type": msg.type, "text": msg.text})

    page.on("console", on_console)
    page.on("pageerror", lambda e: logs["errors"].append("%s: %s" % (type(e).__name__, e)))
    return PageBundle(ctx, page, logs)


def shot(pb, name):
    """截图到 reports/screenshots/<name>.png"""
    SHOTS.mkdir(parents=True, exist_ok=True)
    path = SHOTS / (name + ".png")
    try:
        pb.page.screenshot(path=str(path), full_page=False)
        return str(path)
    except Exception as e:
        print("  [SHOT FAIL]", name, e)
        return None


def dismiss_overlays(pb):
    """关掉开场弹窗/夜终引导等遮罩，避免挡住点击。"""
    try:
        pb.page.evaluate("try{closeModal()}catch(e){}")
        pb.page.evaluate(
            "try{['#mcMask','#onboardMask'].forEach(function(s){var e=document.querySelector(s);if(e)e.remove();});}catch(e){}"
        )
    except Exception:
        pass


def wait_ms(pb, ms):
    pb.page.wait_for_timeout(ms)


def get_game_ids(pb):
    return pb.page.evaluate("GAMES.map(function(g){return g.id;})")


def start_game(pb, gid):
    pb.page.evaluate("(id)=>{ try{startGame(id); return null }catch(e){ return String(e) } }", gid)


def smoke(port=8801, viewport=(390, 844), out_json=None):
    """基线冒烟：首页 + 逐个游戏入口 + 控制台错误。"""
    from playwright.sync_api import sync_playwright

    out_json = out_json or (REPORTS / "baseline-smoke.json")
    result = {"viewport": list(viewport), "games": {}, "home_errors": [], "console": [], "shots": []}
    with serve(port=port) as base:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            pb = new_bundle(browser, viewport=viewport)
            pb.page.goto(base, wait_until="load", timeout=30000)
            wait_ms(pb, 1200)
            dismiss_overlays(pb)
            wait_ms(pb, 300)
            result["shots"].append(shot(pb, "baseline/home"))
            result["home_errors"] = pb.errors()
            result["console"] = pb.console_errors()
            ids = get_game_ids(pb)
            print("[SMOKE] %d games: %s" % (len(ids), ", ".join(ids)))
            for gid in ids:
                pb.clear_logs()
                err = pb.page.evaluate(
                    "(id)=>{ try{startGame(id); return null }catch(e){ return String(e && e.stack || e) } }", gid
                )
                wait_ms(pb, 450)
                info = pb.page.evaluate(
                    """(id)=>{
                        var c=document.getElementById('gContent');
                        return {id:id, kids:c?c.children.length:-1,
                                htmlLen:c?c.innerHTML.length:-1,
                                title:(document.getElementById('gTitle')||{}).textContent||'',
                                pageActive:(document.getElementById('gamePage')||{}).className||'',
                                err:null};
                    }""",
                    gid,
                )
                info["startErr"] = err
                info["errors"] = pb.errors()
                info["console"] = pb.console_errors()
                result["games"][gid] = info
                flag = "OK " if (info["kids"] > 0 and not err and not info["errors"]) else "!! "
                print("  %s %-10s kids=%-3s title=%s %s" % (flag, gid, info["kids"], info["title"], (info["errors"] or [""])[:1]))
                pb.page.evaluate("try{goHome()}catch(e){}")
                dismiss_overlays(pb)
                wait_ms(pb, 150)
            # 关键弹窗
            for label, js in [
                ("report", "showPartyReport()"),
                ("shop", "showShop()"),
                ("help", "showHelp()"),
                ("ach", "v12AchWallHtml && (function(){try{showPartyReport()}catch(e){}; try{closeModal()}catch(e){}; try{openModal(v12AchWallHtml())}catch(e){}})()"),
            ]:
                pb.clear_logs()
                pb.page.evaluate("try{%s}catch(e){}" % js)
                wait_ms(pb, 600)
                modal = pb.page.evaluate("(function(){var m=document.getElementById('modalBox');return m?m.innerHTML.length:-1})()")
                result.setdefault("modals", {})[label] = {"len": modal, "errors": pb.errors()}
                print("  modal %-6s len=%-6s %s" % (label, modal, (pb.errors() or [""])[:1]))
                dismiss_overlays(pb)
            browser.close()
    REPORTS.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    total = len(result["games"])
    bad = [k for k, v in result["games"].items() if v["kids"] <= 0 or v["startErr"] or v["errors"]]
    print("\n[SMOKE] %d/%d rendered, %d problematic -> %s" % (total - len(bad), total, len(bad), out_json))
    if bad:
        print("[SMOKE] problematic:", ", ".join(bad))
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--smoke", action="store_true")
    ap.add_argument("--port", type=int, default=8801)
    args = ap.parse_args()
    if args.smoke:
        smoke(port=args.port)
    else:
        ap.print_help()


if __name__ == "__main__":
    main()
