#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""V17 构建：把 v17/features/*.js 拼进 index.html 的注入区。

用法:
  python tools/build.py                                  # 构建全部 feature 到 dist/
  python tools/build.py --only 10-moqi --out dist/moqi   # 只构建自己的片段（互不干扰）
  python tools/build.py --inplace                        # Lead 集成专用：写回根 index.html

output dist/ 可直接静态部署（index.html + manifest.webmanifest + sw.js + icons/）。
"""
import argparse
import gzip
import pathlib
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
FEAT = ROOT / "v17" / "features"
START_MARK = "/* V17_INJECT_START */"
END_MARK = "/* V17_INJECT_END */"
STATIC_ASSETS = ["manifest.webmanifest", "sw.js"]
ASSET_DIRS = ["icons"]


def read_text(path):
    with open(path, "r", encoding="utf-8", newline="") as f:
        return f.read()


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(text)


def collect_features(only):
    files = sorted(FEAT.glob("*.js"))
    if only:
        files = [f for f in files if any(f.name.startswith(p) or p in f.name for p in only)]
    return files


def check_syntax(path, code):
    """用 node --check 做语法体检；node 不存在时跳过。"""
    try:
        fd, tmp = tempfile.mkstemp(suffix=".js")
        with open(fd, "w", encoding="utf-8") as f:
            f.write(code)
        r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
        if r.returncode != 0:
            print("[ERROR] 语法错误 %s\n%s" % (path.name, r.stderr.strip()), file=sys.stderr)
            return False
        return True
    except FileNotFoundError:
        return True
    finally:
        try:
            import os
            os.unlink(tmp)
        except Exception:
            pass


def build_bundle(files, strict=True):
    parts = []
    ok = True
    for f in files:
        code = read_text(f).replace("\r\n", "\n").strip()
        if not code:
            continue
        if "</script" in code.lower():
            print("[ERROR] %s 出现 </script> 字面量，会截断内联脚本，请改写成 '<'+'/script>'" % f.name, file=sys.stderr)
            ok = False
            continue
        if not check_syntax(f, code):
            ok = False
            continue
        parts.append(
            "/* ===== V17 FEATURE: %s (%d bytes) ===== */\n%s\n"
            % (f.name, len(code.encode("utf-8")), code)
        )
    if not ok and strict:
        sys.exit(2)
    return "\n".join(parts)


def inject(html, bundle):
    if START_MARK not in html or END_MARK not in html:
        print("[ERROR] index.html 缺少 V17 注入区标记 %s / %s" % (START_MARK, END_MARK), file=sys.stderr)
        sys.exit(2)
    i = html.index(START_MARK) + len(START_MARK)
    j = html.index(END_MARK)
    if i > j:
        print("[ERROR] 注入区标记顺序错误", file=sys.stderr)
        sys.exit(2)
    crlf = "\r\n" in html
    nl = "\r\n" if crlf else "\n"
    if crlf:
        bundle = bundle.replace("\n", "\r\n")
    return html[:i] + nl + bundle + nl + html[j:]


def copy_assets(outdir):
    copied = []
    for name in STATIC_ASSETS:
        src = ROOT / name
        if src.exists():
            outdir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, outdir / name)
            copied.append(name)
    for d in ASSET_DIRS:
        src = ROOT / d
        if src.is_dir():
            dst = outdir / d
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            copied.append(d + "/")
    return copied


def main():
    ap = argparse.ArgumentParser(description="V17 构建")
    ap.add_argument("--only", nargs="*", default=None, help="只包含文件名匹配这些前缀的 feature，例如 --only 10-moqi")
    ap.add_argument("--out", default="dist", help="输出目录（默认 dist/）")
    ap.add_argument("--inplace", action="store_true", help="写回根 index.html（仅 Lead 集成时用）")
    args = ap.parse_args()

    files = collect_features(args.only)
    bundle = build_bundle(files)
    html = read_text(INDEX)
    out = inject(html, bundle)

    if args.inplace:
        write_text(INDEX, out)
        print("[OK] wrote %s (features: %s)" % (INDEX.name, ", ".join(f.name for f in files) or "(空)"))
        return

    outdir = ROOT / args.out
    outdir.mkdir(parents=True, exist_ok=True)
    write_text(outdir / "index.html", out)
    copied = copy_assets(outdir)
    raw_kb = len(out.encode("utf-8")) / 1024
    gz_kb = len(gzip.compress(out.encode("utf-8"), 9)) / 1024
    print("[OK] built -> %s" % outdir)
    print("     features : %s" % (", ".join("%s(%d)" % (f.name, f.stat().st_size) for f in files) or "(none)"))
    print("     index.html: %.0f KB (gzip %.0f KB)" % (raw_kb, gz_kb))
    print("     assets   : %s" % (", ".join(copied) or "(none)"))


if __name__ == "__main__":
    main()
