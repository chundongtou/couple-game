# -*- coding: utf-8 -*-
"""V3 重制版构建：把 app/ 源码内联成单文件。

用法：
  python tools/rebuild/build_app.py                 # 开发构建到 dist/rebuild/
  python tools/rebuild/build_app.py --out dist/x    # 指定输出目录
  python tools/rebuild/build_app.py --release       # 生成 repo 根 index.html（部署用）
  python tools/rebuild/build_app.py --release --skip-assets
"""
import argparse
import gzip
import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
APP = ROOT / "app"
TEMPLATE = APP / "index.template.html"

# 顺序重要：基础工具 → 数据/引擎/内容 → UI → 启动
JS_MODULES = [
    "src/core/util.js",
    "src/core/bus.js",
    "src/core/store.js",
    "src/core/audio.js",
    "src/core/motion.js",
    "src/core/safe.js",
    "src/core/ui.js",
    "src/engine/balance.js",
    "src/engine/engine.js",
    "src/ui/router.js",
    "src/ui/screens/boot.js",
    "src/ui/screens/setup.js",
    "src/ui/screens/journey.js",
    "src/ui/screens/play.js",
    "src/ui/screens/event.js",
    "src/ui/screens/act.js",
    "src/ui/screens/shop.js",
    "src/ui/screens/finale.js",
    "src/ui/screens/memory.js",
    "src/ui/screens/settings.js",
    "src/ui/pwa.js",
    "src/app.js",
]
DATA_MODULES = [
    "src/data/cards.js",
    "src/content/content.js",
]
CSS_FILES = [
    "src/styles/base.css",
]
REQUIRED_JS = {"src/core/util.js", "src/app.js"}
REQUIRED_DATA = {"src/data/cards.js"}


def read(path):
    with open(path, "r", encoding="utf-8", newline="") as f:
        return f.read()


def bundle(files, missing_ok, label):
    chunks = []
    missing = []
    for rel in files:
        p = APP / rel
        if not p.exists():
            missing.append(rel)
            continue
        code = read(p).replace("\r\n", "\n").strip()
        if not code:
            continue
        if label == "js":
            try:
                r = subprocess.run(
                    ["node", "--check", str(p)],
                    capture_output=True, text=True, encoding="utf-8", errors="replace"
                )
                if r.returncode != 0:
                    print("[ERROR] 语法错误 %s\n%s" % (rel, (r.stderr or r.stdout or "").strip()), file=sys.stderr)
                    sys.exit(2)
            except FileNotFoundError:
                pass
        chunks.append("/* ===== %s ===== */\n%s\n" % (rel, code))
    if missing and not missing_ok:
        print("[ERROR] 缺少必需文件: %s" % ", ".join(missing), file=sys.stderr)
        sys.exit(2)
    if missing:
        print("[WARN] 跳过未完成的模块: %s" % ", ".join(missing))
    return "\n".join(chunks), missing


def build(outdir=None, release=False):
    template = read(TEMPLATE)
    css, _ = bundle(CSS_FILES, False, "css")
    data, missing_data = bundle(DATA_MODULES, True, "data")
    js, missing_js = bundle(JS_MODULES, True, "js")
    # 必需模块必须在
    for req in REQUIRED_JS:
        if (APP / req).exists() is False:
            print("[ERROR] 缺少必需 JS: %s" % req, file=sys.stderr)
            sys.exit(2)
    html = template.replace("<!--APP_CSS-->", css).replace("<!--APP_DATA-->", data).replace("<!--APP_JS-->", js)
    if "</script>" in css or "</script>" in data or "</script>" in js:
        # 只警告：数据里若出现会截断内联脚本
        print("[WARN] 内联内容中包含 </script> 字面量，请检查", file=sys.stderr)
    out = outdir or (ROOT if release else ROOT / "dist" / "rebuild")
    out = pathlib.Path(out)
    out.mkdir(parents=True, exist_ok=True)
    target = out / "index.html"
    target.write_text(html, encoding="utf-8", newline="")
    # 静态资源（--release 直接写仓库根时，源/目标可能是同一文件，跳过复制）
    assets = []
    for name in ("manifest.webmanifest", "sw.js"):
        src = ROOT / name
        dst = out / name
        if not src.exists():
            continue
        try:
            same = src.resolve() == dst.resolve()
        except Exception:
            same = False
        if same:
            assets.append(name + "(in-place)")
            continue
        shutil.copy2(src, dst)
        assets.append(name)
    icons_src = ROOT / "icons"
    if icons_src.is_dir():
        dst = out / "icons"
        try:
            same = icons_src.resolve() == dst.resolve()
        except Exception:
            same = False
        if same:
            assets.append("icons/(in-place)")
        else:
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(icons_src, dst)
            assets.append("icons/")
    raw_kb = len(html.encode("utf-8")) / 1024
    gz_kb = len(gzip.compress(html.encode("utf-8"), 9)) / 1024
    print("[OK] %s -> %s" % ("release" if release else "dev", target))
    print("     modules: %d js, %d data, %d css; missing: %s" % (
        len(JS_MODULES) - len(missing_js), len(DATA_MODULES) - len(missing_data), len(CSS_FILES),
        ", ".join(missing_js + missing_data) or "none"))
    print("     size: %.0f KB (gzip %.0f KB) assets: %s" % (raw_kb, gz_kb, ", ".join(assets) or "-"))
    return target


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=None)
    ap.add_argument("--release", action="store_true")
    args = ap.parse_args()
    build(args.out, args.release)


if __name__ == "__main__":
    main()
