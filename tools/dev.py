#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一键「构建 + 本地静态服务（禁用缓存）」，用于自测 / 手机同局域网访问。

用法:
  python tools/dev.py                              # 构建全部 feature 到 dist/，端口 8787
  python tools/dev.py --only 10-moqi --port 8802   # 只构建自己的片段
  python tools/dev.py --no-build --port 8801       # 不重新构建，直接服务已完成集成的 dist/
"""
import argparse
import functools
import http.server
import pathlib
import socket
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *args):
        pass


NoCacheHandler.extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map)
NoCacheHandler.extensions_map.update({'.webmanifest': 'application/manifest+json', '.json': 'application/json', '.js': 'text/javascript', '.png': 'image/png'})


def lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8787)
    ap.add_argument("--only", nargs="*", default=None)
    ap.add_argument("--out", default="dist")
    ap.add_argument("--no-build", action="store_true")
    ap.add_argument("--bind", default="0.0.0.0")
    args = ap.parse_args()

    outdir = ROOT / args.out
    if not args.no_build:
        cmd = [sys.executable, str(ROOT / "tools" / "build.py"), "--out", args.out]
        if args.only:
            cmd += ["--only"] + args.only
        subprocess.run(cmd, check=True)
    elif not (outdir / "index.html").exists():
        print("[ERROR] %s 里没有 index.html，先跑一次构建" % outdir, file=sys.stderr)
        sys.exit(2)

    handler = functools.partial(NoCacheHandler, directory=str(outdir))
    try:
        httpd = http.server.ThreadingHTTPServer((args.bind, args.port), handler)
    except OSError as e:
        print("[ERROR] 端口 %d 启动失败：%s（换一个 --port）" % (args.port, e), file=sys.stderr)
        sys.exit(2)
    print("[DEV] 服务目录: %s" % outdir)
    print("[DEV] 本机访问: http://127.0.0.1:%d" % args.port)
    print("[DEV] 手机访问: http://%s:%d （需同一 WiFi，手机浏览器打开）" % (lan_ip(), args.port))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
