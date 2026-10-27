#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""V3 开发服务：构建到 dist/rebuild 并起禁缓存静态服务。

用法：python tools/rebuild/dev_app.py --port 8877
"""
import argparse
import functools
import http.server
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "dist" / "rebuild"


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
    ".js": "text/javascript",
    ".json": "application/json",
})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8877)
    ap.add_argument("--bind", default="127.0.0.1")
    ap.add_argument("--no-build", action="store_true")
    ap.add_argument("--out", default="dist/rebuild")
    args = ap.parse_args()
    if not args.no_build:
        subprocess.run([sys.executable, str(ROOT / "tools" / "rebuild" / "build_app.py"), "--out", args.out], check=True)
    handler = functools.partial(NoCacheHandler, directory=str(ROOT / args.out))
    try:
        httpd = http.server.ThreadingHTTPServer((args.bind, args.port), handler)
    except OSError as e:
        print("[ERROR] 端口 %d 启动失败：%s" % (args.port, e), file=sys.stderr)
        sys.exit(2)
    print("[DEV] http://127.0.0.1:%d  (dir=%s)" % (args.port, ROOT / args.out))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
