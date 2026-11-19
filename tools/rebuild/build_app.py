# -*- coding: utf-8 -*-
"""今晚飞行棋 V6 构建：把 app/ 源码内联成单文件 index.html，并按内容哈希生成 sw.js / assets/。

用法（python 用 DSH 运行时自带的解释器，见 docs/v6/impl-freeze.md §5）：
  python tools/rebuild/build_app.py                    # 开发构建 → dist/rebuild/
  python tools/rebuild/build_app.py --out dist/x       # 指定输出目录
  python tools/rebuild/build_app.py --release          # 写仓库根（部署用）：index.html + assets/ + sw.js + manifest + icons
  python tools/rebuild/build_app.py --release --out dist/release-test
  python tools/rebuild/build_app.py --check            # 构建 + 发布门校验（任一失败退出 1）
  python tools/rebuild/build_app.py --board=3d         # 额外把 3D 棋盘 assets/board.js 拷进产物（默认不拷）
  python tools/rebuild/build_app.py --check --strict   # 最终集成用：缺模块视为错误
  python tools/rebuild/build_app.py --no-minify        # 调试用：不做 esbuild 压缩（默认开）
  python tools/rebuild/build_app.py --out dist/rebuild-v8 --check   # V8：带 3D 懒加载 chunk 的发布门
  python tools/rebuild/build_app.py --no-3d            # 不构建 3D chunk（V7 口径/调试用；生产默认开）

压缩：默认用 app/render/node_modules 里已有的 esbuild 对**最终拼接结果**做 minify
（js: target=es2018；css: loader=css；charset=utf8 保证中文不转义），源码模块与
node --check 流程不变；esbuild 缺失/失败时告警并降级为未压缩，不会让构建挂掉。

V8 3D 懒加载（docs/v8/impl-freeze.md §3.1，本脚本 build_3d_chunk()）：
  · 入口 app/src/view/board3d/entry.js 单独 esbuild bundle（three 走本地
    app/render/node_modules/three/build/three.module.min.js，tree-shake）；
  · 产出 assets/board3d.<内容哈希>.js（IIFE，target=es2018，charset=utf8）；
  · index 只注入 window.__BOARD3D_URL（内联 1 行，无 <script src>，不阻塞首屏）；
  · 该 chunk 进 sw.js PRECACHE（离线可用），但不计入首屏 gzip 预算；
  · 目标 ≤180KB gzip（V9 PBR 场景实测 ~166.5KB；--budget-3d 可覆盖，仅报告/告警，不判 RED）；
  · entry 未就绪（并行开发期）→ [WARN] 跳过，index 不注入 URL，--check 不判 RED。
  · --with-3d 默认开（生产）；--no-3d 关闭。

V9 音频（docs/v9/impl-freeze.md §2 / app/assets/audio/INTEGRATION.md，本脚本接入）：
  · app/assets/audio/*.wav（16 个，≈819KB）原样拷到产物 assets/audio/（名字稳定，不改名/不加哈希，
    因为 core/audio.js 的 FILES 表写死文件名）；16 条全部进 sw.js PRECACHE（离线可播）；
  · src/core/audio.js 从内联 JS_MODULES **拆出**成独立 IIFE chunk assets/audio.<内容哈希>.js（esbuild
    minify），index 里写 <script src="assets/audio.<hash>.js" defer>：defer 在 DOMContentLoaded（App boot）
    之前执行，而 App.Bus 已由内联 bundle 在解析期定义，所以 App.Audio 一定在 boot 前就绪；
  · 该 chunk 计入首屏 gzip（index+cards+audio+manifest ≤180KB）并进 sw.js PRECACHE；
  · --check 校验：16 个 wav 在产物（RIFF/WAVE 头非空）+ 数量 ==16 + 16 条 PRECACHE + audio chunk 哈希/落盘。

V6 口径（docs/v6/architecture.md §3）：
  · 首屏 = 一个内联 index.html（CSS + core + engine + view + ui + 启动全部内联）；
  · 题库拆到 assets/cards.<内容哈希>.js（外链 + defer，不在首屏内联 192KB）；
  · 3D 棋盘 assets/board.js（511KB）默认**不进产物**，--board=3d 才拷；
  · sw.js 由 sw.template.js 生成：CACHE = "couple-flight-v6-" + index.html 的 sha256 前 8 位，
    PRECACHE 与磁盘一致、不含 board.js；
  · 体积统计一律对**落盘文件**统计（旧版统计的是内存里的 html 字符串，口径偏小）；
  · 首屏预算按 **ADR-012**：index.html ≤520KB raw / ≤140KB gzip，首屏总 gzip（index+cards+manifest）
    ≤180KB；`--budget` / `--budget-raw` / `--budget-total` 可临时覆盖（每次覆盖都会打印提示）。
"""
import argparse
import gzip
import hashlib
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
APP = ROOT / "app"
TEMPLATE = APP / "index.template.html"
SW_TEMPLATE = ROOT / "sw.template.js"
MANIFEST = ROOT / "manifest.webmanifest"
ICONS = ROOT / "icons"
BOARD_SRC = ROOT / "assets" / "board.js"
# V8：3D 主桌懒加载子包（独立 chunk；three 本地 vendor，构建时 tree-shake）
BOARD3D_ENTRY = APP / "src" / "view" / "board3d" / "entry.js"
BOARD3D_THREE = APP / "render" / "node_modules" / "three" / "build" / "three.module.min.js"
BOARD3D_PREFIX = "assets/board3d"        # 产物名：assets/board3d.<hash>.js
BOARD3D_URL_VAR = "__BOARD3D_URL"        # index 内联：window.__BOARD3D_URL = "<chunk>"
# V9：PBR 场景（PMREM/程序化纹理/PBR 材质）实测 ~166.5KB gzip；impl-freeze §4 验收上限 ≤200KB，
# 任务卡 V9 按 ≤180KB 验收。该值只影响 --check 的报告/告警（不判 RED），--budget-3d 可覆盖。
BOARD3D_GZIP_TARGET = 180 * 1024

# V9 音频：源 assets/audio/*.wav（16 个）→ 产物 assets/audio/（同名）；core/audio.js 拆成独立 defer chunk。
AUDIO_SRC = APP / "assets" / "audio"
AUDIO_MODULE = "src/core/audio.js"
AUDIO_PREFIX = "assets/audio"            # 产物名：assets/audio.<内容哈希>.js
AUDIO_WAV_REL = "assets/audio"           # 产物目录：assets/audio/*.wav
# 顺序 = app/assets/audio/INTEGRATION.md §2 的预缓存口径；名字必须与 audio.js 的 FILES 表一致。
AUDIO_WAVS = (
    "sfx-dice-shake.wav",
    "sfx-dice-land.wav",
    "sfx-hop.wav",
    "sfx-takeoff.wav",
    "sfx-fly.wav",
    "sfx-capture.wav",
    "sfx-stack.wav",
    "sfx-bear.wav",
    "sfx-card.wav",
    "sfx-stamp.wav",
    "sfx-chime.wav",
    "sfx-win.wav",
    "sfx-ui-tap.wav",
    "sfx-ui-select.wav",
    "amb-calm.wav",
    "amb-win.wav",
)

CACHE_PREFIX = "couple-flight-v6-"
CARDS_PREFIX = "assets/cards"          # 产物名：assets/cards.<hash>.js
INDEX_GZIP_BUDGET = 140 * 1024          # 首屏 index.html gzip 硬门槛（ADR-012；原 arch §4 PB-2=58KB 已被取代）
INDEX_RAW_BUDGET = 520 * 1024           # 首屏 index.html raw 硬门槛（ADR-012；原 arch §4 PB-1=220KB 已被取代）
FIRST_SCREEN_GZIP_BUDGET = 180 * 1024   # 首屏总 gzip = index + cards + manifest（ADR-012）
# --release 是否默认走「外部 JS」（assets/app.<hash>.js + defer，首屏 HTML 只剩 CSS+骨架）。
# 结论（Lead 拍板 2026-11-16，gzip 服务 + slow4G + 4×CPU，各 3 次取中位）：
#   加静态骨架后 inline 已 FCP 404~412ms / DCL 1.33~1.36s（达 PB-4/PB-5）；
#   external 反而 FCP 无收益、DCL +133~268ms（多一次 app.js 往返）→ 保持 inline 默认。
# 需要对比件时用 --external-js 显式构建；--inline-js 可强制内联。
RELEASE_EXTERNAL_JS_DEFAULT = False
PWA_ICONS = (                          # 进 PRECACHE 的图标（og-image 111KB 不参与离线缓存）
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/icon-maskable-512.png",
    "icons/apple-touch-icon.png",
)

# 顺序重要：基础工具 → 引擎 → 视图 → UI → 启动（docs/v6/impl-freeze.md §4）
# 缺文件允许 WARN 跳过（并行开发期）；--strict 时缺文件视为错误。
JS_MODULES = [
    "src/core/util.js",
    "src/core/bus.js",
    "src/core/store.js",
    # V9：src/core/audio.js 不再内联 —— 拆成独立 assets/audio.<hash>.js（defer），见 build_audio_chunk()。
    #     顺序上它依赖 App.Bus（bus.js），外置后由 defer 在 DOMContentLoaded 前执行，仍在 boot 之前。
    "src/core/motion.js",
    "src/core/safe.js",
    "src/core/ui.js",
    "src/ui/themes.js",          # V7：主题表/App.Themes（core 之后、boot/table 之前）
    "src/ui/bear.js",            # V7：向导小熊（themes 之后、CellStage/table 之前）
    "src/engine/flight-rules.js",
    "src/engine/flight-board.js",
    "src/engine/flight-meta.js",
    "src/engine/flight-draw.js",
    "src/engine/archive.js",
    "src/engine/minigames.js",
    "src/engine/flight-engine.js",
    "src/view/board.js",
    "src/view/cabin.js",
    "src/view/cinema.js",        # V7：镜头链 App.Cinema（cabin 之后）
    "src/ui/router.js",
    "src/ui/overlay/prompt-card.js",
    "src/ui/overlay/cell-stage.js",  # V7：45° 格子舞台 App.CellStage（prompt-card 之后，作旧卡 fallback 的替代）
    "src/ui/overlay/minigame.js",
    "src/ui/share.js",
    "src/ui/screens/boot.js",
    "src/ui/screens/table.js",
    "src/ui/screens/pause.js",
    "src/ui/screens/ledger.js",
    "src/ui/screens/nights.js",
    "src/ui/screens/settings.js",
    "src/ui/screens/minigame.js",
    "src/ui/pwa.js",
    "src/app.js",
]
DATA_MODULES = [
    "src/data/cards.js",
]
CSS_FILES = [
    "src/styles/base.css",
]
# --split-screens（arch §4.3 ② 的备用杠杆，默认关闭）：
# 首屏 gzip 顶到 58KB 预算时，把这几个「不是第一屏」的屏拆成 assets/screens.<hash>.js（defer 加载，
# 在 DOMContentLoaded 之前执行完，路由无需改动）。
SCREENS_MODULES = [
    "src/ui/screens/ledger.js",
    "src/ui/screens/nights.js",
    "src/ui/screens/settings.js",
    "src/ui/screens/minigame.js",
]
REQUIRED_JS = {"src/core/util.js", "src/app.js"}
REQUIRED_DATA = {"src/data/cards.js"}


# --------------------------------------------------------------------------- 小工具
def read_text(path):
    """读文本并统一成 LF（跨 checkout / autocrlf 也得到同一个哈希）。"""
    with open(path, "r", encoding="utf-8", newline="") as f:
        return f.read().replace("\r\n", "\n")


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="")


def sha8_text(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:8]


def sha8_bytes(data):
    return hashlib.sha256(data).hexdigest()[:8]


def sha8_file(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]


def gz_len(data):
    return len(gzip.compress(data, 9))


def kb(n):
    return n / 1024.0


def die(msg, code=2):
    print("[ERROR] %s" % msg, file=sys.stderr)
    sys.exit(code)


def same_path(a, b):
    try:
        return a.resolve() == b.resolve()
    except OSError:
        return False


def is_local_ref(ref):
    return not re.match(r"^(?:[a-z][a-z0-9+.\-]*:|#|//)", ref, re.I)


def rel_of(precache_entry):
    return precache_entry[2:] if precache_entry.startswith("./") else precache_entry


# --------------------------------------------------------------------------- 源码打包
def syntax_check(path, rel):
    """用 node --check 兜住语法错误（别让一个手滑的逗号变成整包白屏）。"""
    try:
        r = subprocess.run(
            ["node", "--check", str(path)],
            capture_output=True, text=True, encoding="utf-8", errors="replace",
        )
    except FileNotFoundError:
        return
    if r.returncode != 0:
        die("语法错误 %s\n%s" % (rel, (r.stderr or r.stdout or "").strip()))


def bundle(files, label, required, strict):
    chunks, missing = [], []
    for rel in files:
        p = APP / rel
        if not p.exists():
            missing.append(rel)
            continue
        code = read_text(p).strip()
        if not code:
            continue
        if label in ("js", "data"):
            syntax_check(p, rel)
        chunks.append("/* ===== %s ===== */\n%s\n" % (rel, code))
    if missing and (required or strict):
        die("缺少%s文件（--strict）: %s" % (label, ", ".join(missing)))
    if missing:
        print("[WARN] 跳过未完成的模块: %s" % ", ".join(missing))
    return "\n".join(chunks), missing


# --------------------------------------------------------------------------- 产物清单
def cards_ref(html):
    m = re.search(r'<script\b[^>]*\bsrc="(assets/cards[^"]*\.js)"', html)
    return m.group(1) if m else ""


def script_refs(html):
    """index.html 里所有外链脚本（相对路径，含题库/拆分屏），= 离线冷启动必需的资源。"""
    refs = []
    for ref in re.findall(r'<script\b[^>]*\bsrc="([^"]+)"', html, re.I):
        if is_local_ref(ref) and ref not in refs:
            refs.append(ref)
    return refs


def expected_precache(out, html, extra=(), audio=()):
    """PRECACHE 的唯一真相来源：'./' + index + manifest + index 引用的每个外链脚本 + 额外懒加载 chunk
    + V9 的 16 个音频 wav + PWA 图标。

    extra：不进首屏 <script src>、但必须离线可用的独立 chunk（V8 的 assets/board3d.<hash>.js）。
    audio：V9 音频 wav 文件名（assets/audio/ 下同名；audio.js 懒加载，必须离线可播）。
    """
    items = ["./", "./index.html", "./manifest.webmanifest"]
    for ref in script_refs(html):
        if "board" in ref.lower():
            continue                       # 3D 棋盘不进预缓存（可选特性，运行时 cache-first）
        items.append("./" + ref)
    for ref in extra:
        entry = "./" + ref
        if ref and entry not in items:
            items.append(entry)
    for name in audio:
        items.append("./" + AUDIO_WAV_REL + "/" + name)
    for rel in PWA_ICONS:
        if (out / rel).is_file():
            items.append("./" + rel)
    return items


def first_screen_gzip(out, html):
    """首屏总 gzip = index.html + index 引用的外链脚本（题库/拆分屏，不含可选 board.js）+ manifest。"""
    total = 0
    for rel in ["index.html"] + script_refs(html) + ["manifest.webmanifest"]:
        if "board" in rel.lower():
            continue
        p = out / rel
        if p.is_file():
            total += gz_len(p.read_bytes())
    return total


def render_sw(build_hash, precache):
    if not SW_TEMPLATE.exists():
        die("缺少 sw 模板: %s" % SW_TEMPLATE)
    tpl = read_text(SW_TEMPLATE)
    for token in ("__CACHE_NAME__", "__BUILD_HASH__", "__PRECACHE__"):
        if token not in tpl:
            die("sw 模板缺少占位符 %s" % token)
    text = (
        tpl.replace("__CACHE_NAME__", CACHE_PREFIX + build_hash)
        .replace("__BUILD_HASH__", build_hash)
        .replace("__PRECACHE__", json.dumps(precache, ensure_ascii=False, indent=2))
    )
    left = re.findall(r"__[A-Z_]+__", text)
    if left:
        die("sw 模板仍有未替换占位符: %s" % ", ".join(sorted(set(left))))
    return text


def prune_stale(out, board, keep=()):
    """删掉上一次构建留下的陈旧产物（默认产物里不允许再有 assets/board.js）。

    keep 里是产物相对路径（如 assets/cards.<hash>.js / assets/board3d.<hash>.js）；
    本函数按 basename 比对，避免把「本次刚写/待写」的同哈希产物误删再重写。
    """
    removed = []
    keep_names = {rel_of(k).rsplit("/", 1)[-1] for k in keep}
    assets = out / "assets"
    if not assets.is_dir():
        return removed
    out_is_root = same_path(out, ROOT)
    for p in sorted(assets.iterdir()):
        if not p.is_file():
            continue
        name = p.name
        drop = False
        if re.match(r"^(?:cards|screens|app|board3d|audio)\.[0-9a-f]{8}\.js$", name) and name not in keep_names:
            drop = True                                    # 旧哈希的题库 / 拆分屏 / 外部 app 包 / 3D chunk / 音频 chunk
        elif name == "cards.js" and not out_is_root and name not in keep_names:
            drop = True                                    # V5 旧口径（dev 产物里）
        elif name == "board.js" and not out_is_root and board != "3d":
            drop = True                                    # 511KB 3D 棋盘，默认不随包
        if drop:
            removed.append("assets/" + name)
            try:
                p.unlink()
            except OSError as e:
                print("[WARN] 删除陈旧产物失败 %s: %s" % (name, e), file=sys.stderr)
    return removed


# --------------------------------------------------------------------------- esbuild（压缩）
# 用仓库里已有的 esbuild（app/render/node_modules，0.25.12）做 minify：
# 只压缩「最终拼接结果」，源码模块与 node --check 流程完全不变；--no-minify 可关掉用于调试。
# charset=utf8 必须显式给，否则 esbuild 默认把中文转成 \uXXXX，体积反而变大。
ESBUILD_CANDIDATES = (
    ROOT / "app" / "render" / "node_modules" / "@esbuild" / "win32-x64" / "esbuild.exe",
    ROOT / "app" / "render" / "node_modules" / "esbuild" / "bin" / "esbuild",
    ROOT / "app3d" / "node_modules" / "@esbuild" / "win32-x64" / "esbuild.exe",
)
ESBUILD_TARGET = "es2018"


def find_esbuild():
    for p in ESBUILD_CANDIDATES:
        if p.is_file():
            return p
    return None


def esbuild_label(exe):
    try:
        v = json.loads((exe.parent / "package.json").read_text(encoding="utf-8")).get("version")
        if v:
            return "esbuild %s" % v
    except (OSError, ValueError):
        pass
    return exe.name


def esbuild_minify(code, loader, exe):
    """返回压缩后的代码；失败返回 None（调用方降级为未压缩，不让构建挂掉）。"""
    cmd = [str(exe), "--minify", "--charset=utf8", "--loader=" + loader]
    if loader == "js":
        cmd.append("--target=" + ESBUILD_TARGET)
    try:
        r = subprocess.run(cmd, input=code.encode("utf-8"), capture_output=True)
    except OSError as e:
        print("[WARN] esbuild 调用失败，跳过压缩: %s" % e, file=sys.stderr)
        return None
    if r.returncode != 0:
        print("[WARN] esbuild minify 失败(%s)，跳过压缩: %s" % (
            loader, (r.stderr or b"").decode("utf-8", "replace").strip()[:400]), file=sys.stderr)
        return None
    out = r.stdout.decode("utf-8")
    return out if out.strip() else None


# --------------------------------------------------------------------------- V8 3D 懒加载 chunk
def build_3d_chunk(minify=True, entry=None):
    """把 board3d/entry.js 打成独立 IIFE chunk（three 从本地 vendor bundle + tree-shake）。

    返回 dict(name/text/raw/gzip/min)；entry 未就绪 / esbuild 缺失 / 打包失败 → [WARN] 并返回 None
    （并行开发期不阻塞构建；--check 对「entry 存在却没 chunk」判 RED，对「entry 缺失」只报告 missing）。
    调用方负责落盘；文件名哈希 = 最终内容 sha256 前 8 位（--check 重算比对）。
    """
    entry = pathlib.Path(entry) if entry else BOARD3D_ENTRY
    try:
        rel_entry = entry.resolve().relative_to(ROOT)
    except ValueError:
        rel_entry = entry
    if not entry.is_file():
        print("[WARN] --with-3d 但 3D 入口未就绪：%s（并行开发期跳过，index 不注入 window.%s）"
              % (rel_entry, BOARD3D_URL_VAR), file=sys.stderr)
        return None
    exe = find_esbuild()
    if exe is None:
        print("[WARN] --with-3d 但没找到 esbuild（app/render/node_modules），本次跳过 3D chunk",
              file=sys.stderr)
        return None
    if not BOARD3D_THREE.is_file():
        print("[WARN] --with-3d 但 three vendor 缺失：%s（entry 里 import 会解析失败），本次跳过 3D chunk"
              % BOARD3D_THREE.relative_to(ROOT), file=sys.stderr)
        return None

    fd, tmp_name = tempfile.mkstemp(prefix="board3d-", suffix=".js")
    os.close(fd)
    tmp = pathlib.Path(tmp_name)
    # bundle + IIFE + es2018 + utf8：three 走 entry 里的相对 import（本地 three.module.min.js）
    cmd = [str(exe), str(entry), "--bundle", "--format=iife",
           "--target=" + ESBUILD_TARGET, "--charset=utf8",
           "--tree-shaking=true", "--log-level=warning",
           "--outfile=" + str(tmp)]
    if minify:
        cmd.insert(2, "--minify")
    try:
        r = subprocess.run(cmd, capture_output=True)
        if r.returncode != 0:
            msg = (r.stderr or b"").decode("utf-8", "replace").strip()
            print("[WARN] 3D chunk 打包失败，本次跳过：%s" % msg[:800], file=sys.stderr)
            return None
        code = tmp.read_text(encoding="utf-8").strip()
    except OSError as e:
        print("[WARN] 3D chunk 打包异常，本次跳过：%s" % e, file=sys.stderr)
        return None
    finally:
        try:
            tmp.unlink()
        except OSError:
            pass
    if not code:
        print("[WARN] 3D chunk 为空，本次跳过", file=sys.stderr)
        return None
    text = "/*! v8-board3d min:%d */\n%s\n" % (1 if minify else 0, code)
    data = text.encode("utf-8")
    return {
        "name": "%s.%s.js" % (BOARD3D_PREFIX, sha8_bytes(data)),
        "text": text,
        "raw": len(data),
        "gzip": gz_len(data),
        "min": bool(minify),
    }


# --------------------------------------------------------------------------- V9 音频 chunk（外置 defer）
def build_audio_chunk(minify=True, esbuild=None):
    """V9：把 core/audio.js 打成独立 IIFE chunk（无 import/无依赖，直接 minify）。

    文件名哈希 = 最终内容（含 /*! 标记）的 sha256 前 8 位，--check 重算比对。
    源码已经是 IIFE（window.App.Audio），所以不需要 --bundle；esbuild 缺失时降级为未压缩。
    返回 dict(name/text/raw/gzip/min)；源码缺失/为空 → 返回 None（--check 会判 RED）。
    """
    src = APP / AUDIO_MODULE
    if not src.is_file():
        print("[WARN] 音频模块缺失：%s，index 将不引用 assets/audio.<hash>.js" % AUDIO_MODULE,
              file=sys.stderr)
        return None
    code = read_text(src).strip()
    if not code:
        print("[WARN] 音频模块为空：%s" % AUDIO_MODULE, file=sys.stderr)
        return None
    syntax_check(src, AUDIO_MODULE)
    min_audio = False
    if minify and esbuild is not None:
        m = esbuild_minify(code, "js", esbuild)
        if m:
            code, min_audio = m, True
    text = "/*! v9-audio min:%d */\n%s\n" % (1 if min_audio else 0, code)
    data = text.encode("utf-8")
    return {
        "name": "%s.%s.js" % (AUDIO_PREFIX, sha8_bytes(data)),
        "text": text,
        "raw": len(data),
        "gzip": gz_len(data),
        "min": bool(min_audio),
    }


def copy_audio_assets(out):
    """V9：把 16 个 wav 原样拷到 <out>/assets/audio/（名字稳定，不加哈希）。

    返回 dict(copied/missing/dir/total)。缺源文件时删掉产物里的同名旧文件，避免「假绿」；
    清单外的陈旧 wav 也清掉，保证同一份源码重复构建的产物一致。
    """
    dst_dir = out / AUDIO_WAV_REL
    dst_dir.mkdir(parents=True, exist_ok=True)
    copied, missing = [], []
    for name in AUDIO_WAVS:
        src = AUDIO_SRC / name
        dst = dst_dir / name
        if not src.is_file():
            missing.append(name)
            try:
                if dst.exists():
                    dst.unlink()
            except OSError as e:
                print("[WARN] 清理缺失音频的旧产物失败 %s: %s" % (name, e), file=sys.stderr)
            continue
        shutil.copy2(src, dst)
        copied.append(name)
    for p in sorted(dst_dir.glob("*.wav")):
        if p.name not in AUDIO_WAVS:
            try:
                p.unlink()
            except OSError as e:
                print("[WARN] 删除清单外音频失败 %s: %s" % (p.name, e), file=sys.stderr)
    total = sum((dst_dir / n).stat().st_size for n in copied)
    return {"copied": copied, "missing": missing, "dir": AUDIO_WAV_REL, "total": total}


# --------------------------------------------------------------------------- 模块清单守卫
def dedupe_modules(mods):
    """按路径去重（保持首次出现的顺序），防止有人把同一模块写两遍打进包里。"""
    seen, kept, dropped = set(), [], []
    for m in mods:
        key = m.strip()
        if key in seen:
            dropped.append(key)
            continue
        seen.add(key)
        kept.append(key)
    return kept, dropped


def assert_module_order(mods):
    """闸门：flight-meta 必须排在 flight-engine 之前（引擎在结算点写 meta，后者依赖前者）。"""
    try:
        i_meta = mods.index("src/engine/flight-meta.js")
        i_engine = mods.index("src/engine/flight-engine.js")
    except ValueError:
        return
    if i_meta > i_engine:
        die("JS_MODULES 顺序错误：src/engine/flight-meta.js 必须在 src/engine/flight-engine.js 之前")


# V7 依赖顺序闸门：先定义后使用（模块靠加载时赋值的 App.* 互相引用）。
# 任一侧文件缺失（并行开发期）时跳过，交给 bundle() 的 WARN/--strict 处理。
V7_ORDER_RULES = (
    ("src/ui/themes.js", "src/ui/bear.js"),
    ("src/ui/themes.js", "src/ui/screens/boot.js"),
    ("src/ui/themes.js", "src/ui/screens/table.js"),
    ("src/ui/bear.js", "src/ui/overlay/cell-stage.js"),
    ("src/ui/bear.js", "src/ui/screens/table.js"),
    ("src/view/cinema.js", "src/ui/screens/table.js"),
    ("src/ui/overlay/prompt-card.js", "src/ui/overlay/cell-stage.js"),
    ("src/ui/overlay/cell-stage.js", "src/ui/screens/table.js"),
)


def assert_v7_order(mods):
    for first, later in V7_ORDER_RULES:
        if first not in mods or later not in mods:
            continue
        if mods.index(first) > mods.index(later):
            die("JS_MODULES 顺序错误：%s 必须在 %s 之前（V7 依赖）" % (first, later))


# --------------------------------------------------------------------------- 构建
def build(out, release, board, strict, split_screens=False,
          budget_gz=INDEX_GZIP_BUDGET, budget_raw=INDEX_RAW_BUDGET,
          budget_total=FIRST_SCREEN_GZIP_BUDGET, minify=True, external_js=False,
          with_3d=True, budget_3d=BOARD3D_GZIP_TARGET):
    if not TEMPLATE.exists():
        die("缺少模板: %s" % TEMPLATE)
    template = read_text(TEMPLATE)

    if board == "3d" and not BOARD_SRC.exists():
        die("--board=3d 但 %s 不存在" % BOARD_SRC)

    modules, deduped_js = dedupe_modules(JS_MODULES)
    screens_mods, deduped_screens = dedupe_modules(SCREENS_MODULES)
    if deduped_js or deduped_screens:
        print("[WARN] JS_MODULES 有重复项，已去重（顺序不变）: %s"
              % ", ".join(deduped_js + deduped_screens))
    assert_module_order(modules)
    assert_v7_order(modules)
    if split_screens:
        modules = [m for m in modules if m not in screens_mods]
    css, missing_css = bundle(CSS_FILES, "css", required=True, strict=strict)
    js, missing_js = bundle(modules, "js", required=False, strict=False)
    data, missing_data = bundle(DATA_MODULES, "data", required=False, strict=False)
    screens = ""
    if split_screens:
        screens, missing_screens = bundle(screens_mods, "js", required=False, strict=False)
        missing_js = [m for m in missing_js if m not in screens_mods] + missing_screens

    for rel in sorted(REQUIRED_JS):
        if not (APP / rel).exists():
            die("缺少必需 JS: %s" % rel)
    for rel in sorted(REQUIRED_DATA):
        if not (APP / rel).exists():
            die("缺少必需数据: %s" % rel)
    if strict and (missing_js or missing_data):
        die("--strict: 缺少模块 %s" % ", ".join(missing_js + missing_data))

    # ---- minify（默认开；--no-minify 关）----
    esbuild = find_esbuild()
    min_js = min_css = min_screens = False
    if minify and esbuild is None:
        print("[WARN] 没找到 esbuild（app/render/node_modules），本次不压缩", file=sys.stderr)
    elif minify:
        m = esbuild_minify(css, "css", esbuild)
        if m:
            css, min_css = m, True
        m = esbuild_minify(js, "js", esbuild)
        if m:
            js, min_js = m, True
        if screens.strip():
            m = esbuild_minify(screens, "js", esbuild)
            if m:
                screens, min_screens = m, True

    # 统一的包标记（/*! 保留注释）：--check 用它确认 JS 真的进了包、以及压没压过
    inlined = len(modules) - len(missing_js)
    js = "/*! v6-bundle:%s modules:%d min:%d */\n%s" % (
        sha8_text(js), inlined, 1 if min_js else 0, js)

    # ---- V8 3D 懒加载 chunk（独立文件，不进首屏；entry 缺失 → WARN 跳过）----
    three_d = build_3d_chunk(minify=minify) if with_3d else None
    three_d_tag = ""
    if three_d:
        # 只注入 URL（1 行内联，无 <script src>）：不阻塞首屏，由 table 侧按需动态 import/script 加载
        three_d_tag = '<script>window.%s="%s";</script>\n' % (BOARD3D_URL_VAR, three_d["name"])

    # ---- V9 音频 chunk（core/audio.js 外置，defer；App.Bus 由内联包在解析期先定义）----
    audio_chunk = build_audio_chunk(minify=minify, esbuild=esbuild)
    audio_tag = ""
    if audio_chunk:
        audio_tag = '<script src="%s" defer></script>' % audio_chunk["name"]
    else:
        print("[WARN] 音频 chunk 未产出：index 不会引用 assets/audio.<hash>.js，App.Audio 缺失（--check 将 RED）",
              file=sys.stderr)

    # ---- 外部 JS 模式（--external-js）：整包写成 assets/app.<内容哈希>.js ----
    # 首屏 HTML 里只剩 CSS + 骨架 → 文档一到就能首绘；JS 走 defer，DOMContentLoaded 前执行完，启动顺序不变。
    app_name = ""
    app_tag = ""
    if external_js:
        app_name = "assets/app.%s.js" % sha8_text(js)
        app_tag = '<script src="%s" defer></script>' % app_name
    js_block = app_tag if external_js else "<script>\n%s\n</script>" % js

    if "</script>" in css or "</script>" in js or "</script>" in data or "</script>" in screens:
        print("[WARN] 内联/外链内容包含 </script> 字面量，请检查是否截断脚本", file=sys.stderr)

    # 题库外链（带内容哈希，body 底部 + defer，不阻塞首屏解析；head 里 preload 让下载与文档下载并行）
    cards_name = ""
    cards_tag = ""
    cards_preload = ""
    if data.strip():
        cards_name = "%s.%s.js" % (CARDS_PREFIX, sha8_text(data))
        cards_tag = '<script src="%s" defer></script>' % cards_name
        cards_preload = '<link rel="preload" as="script" href="%s">' % cards_name
    else:
        print("[WARN] 题库为空，首屏将走 FlightDraw 内置 FALLBACK_CARDS", file=sys.stderr)

    # 拆分屏（可选）：同样是 body 底部 + defer，DOMContentLoaded 前执行完，路由无需改
    screens_name = ""
    screens_tag = ""
    if screens.strip():
        screens_name = "assets/screens.%s.js" % sha8_text(screens)
        screens_tag = '<script src="%s" defer></script>' % screens_name
    elif split_screens:
        print("[WARN] --split-screens 但拆分屏文件都不存在，忽略", file=sys.stderr)

    html = (
        template.replace("<!--APP_CSS-->", css)
        .replace("<!--APP_JS-->", three_d_tag + js_block)
        .replace("<!--APP_PRELOAD-->", cards_preload)
        .replace("<!--APP_SPLIT-->", audio_tag + screens_tag)   # V9：音频 defer 在最前（DOMContentLoaded 前执行）
        .replace("<!--APP_CARDS-->", cards_tag)
    )
    for token in ("<!--APP_CSS-->", "<!--APP_JS-->", "<!--APP_PRELOAD-->",
                  "<!--APP_SPLIT-->", "<!--APP_CARDS-->"):
        if token in html:
            die("模板占位符 %s 未被替换" % token)

    out = pathlib.Path(out)
    out.mkdir(parents=True, exist_ok=True)
    keep = {cards_name, screens_name, app_name, three_d["name"] if three_d else "",
            audio_chunk["name"] if audio_chunk else ""} - {""}
    removed = prune_stale(out, board, keep=keep)

    if three_d:
        write_text(out / three_d["name"], three_d["text"])
    if audio_chunk:
        write_text(out / audio_chunk["name"], audio_chunk["text"])
    if cards_name:
        write_text(out / cards_name, data)
    if screens_name:
        write_text(out / screens_name, screens)
    if app_name:
        write_text(out / app_name, js)
    write_text(out / "index.html", html)

    # V9 音频 wav：原样拷进 assets/audio/（16 个，名字与 audio.js 的 FILES 一致）
    audio_copy = copy_audio_assets(out)

    # 静态资源：manifest / icons（--release 写仓库根时源与目标是同一文件，跳过复制）
    assets = []
    if MANIFEST.exists():
        dst = out / "manifest.webmanifest"
        if same_path(MANIFEST, dst):
            assets.append("manifest.webmanifest(in-place)")
        else:
            shutil.copy2(MANIFEST, dst)
            assets.append("manifest.webmanifest")
    icon_count = 0
    if ICONS.is_dir():
        dst = out / "icons"
        if same_path(ICONS, dst):
            icon_count = len([p for p in ICONS.glob("*.png")])
            assets.append("icons/(in-place)")
        else:
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(ICONS, dst)
            icon_count = len([p for p in dst.glob("*.png")])
            assets.append("icons/ (%d)" % icon_count)
    if board == "3d":
        dst = out / "assets" / "board.js"
        if same_path(BOARD_SRC, dst):
            assets.append("assets/board.js(in-place)")
        else:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(BOARD_SRC, dst)
            assets.append("assets/board.js")

    # sw.js：CACHE 版本 = 落盘 index.html 的 sha256 前 8 位
    index_path = out / "index.html"
    build_hash = sha8_file(index_path)
    precache = expected_precache(out, html, extra=[three_d["name"]] if three_d else [],
                                 audio=AUDIO_WAVS)
    write_text(out / "sw.js", render_sw(build_hash, precache))

    # ---- 摘要（一律对落盘文件统计）----
    html_bytes = index_path.read_bytes()
    js_total = len(modules) - len(missing_js)
    print("[OK] %s -> %s" % ("release" if release else "dev", out))
    print("     modules: %d/%d js, %d/%d data, %d css; missing(%d): %s" % (
        js_total, len(modules),
        len(DATA_MODULES) - len(missing_data), len(DATA_MODULES),
        len(CSS_FILES), len(missing_js + missing_data),
        ", ".join(missing_js + missing_data) or "none"))
    print("     board: %s (%s)" % (
        board, "已随包 assets/board.js" if board == "3d" else "未复制 assets/board.js"))
    if with_3d:
        if three_d:
            print("     board3d: %s (%.1f KB raw / %.1f KB gzip, minify=%s, IIFE/es2018, 目标 ≤%.0f KB gzip)"
                  % (three_d["name"], kb(three_d["raw"]), kb(three_d["gzip"]),
                     "on" if three_d["min"] else "off", kb(budget_3d)))
            if three_d["gzip"] > budget_3d:
                print("     [WARN] 3D chunk gzip 超目标，tree-shake 建议见 --check 输出")
        else:
            print("     board3d: 跳过（entry 未就绪或无 esbuild），index 不注入 window.%s" % BOARD3D_URL_VAR)
    else:
        print("     board3d: --no-3d（不构建 3D chunk）")
    if audio_chunk:
        print("     audio: %s (%.1f KB raw / %.1f KB gzip, minify=%s, defer)"
              % (audio_chunk["name"], kb(audio_chunk["raw"]), kb(audio_chunk["gzip"]),
                 "on" if audio_chunk["min"] else "off"))
    else:
        print("     audio: 缺失（%s 未就绪）" % AUDIO_MODULE)
    print("     audio assets: %d/%d wav %.1f KB -> %s/" % (
        len(audio_copy["copied"]), len(AUDIO_WAVS), kb(audio_copy["total"]), AUDIO_WAV_REL))
    if audio_copy["missing"]:
        print("     [WARN] 缺少音频源文件: %s" % ", ".join(audio_copy["missing"]))
    if min_js or min_css:
        print("     minify: on (%s, %s, charset=utf8) js=%s css=%s" % (
            esbuild_label(esbuild), ESBUILD_TARGET if min_js else "-",
            "on" if min_js else "off", "on" if min_css else "off"))
    else:
        print("     minify: off（--no-minify 或没找到 esbuild）")
    if screens_name:
        print("     split: %d 屏 -> %s" % (len(SCREENS_MODULES), screens_name))
    print("     js: %s" % (
        "external %s (%.1f KB)" % (app_name, kb(len(js.encode("utf-8")))) if app_name
        else "inline (%.1f KB)" % kb(len(js.encode("utf-8")))))
    print("     cards: %s" % (cards_name or "-"))
    print("     sw: %s%s (precache %d 项%s)" % (
        CACHE_PREFIX, build_hash, len(precache),
        "; 清理陈旧: " + ", ".join(removed) if removed else ""))
    assets.append("%s/ (%d wav)" % (AUDIO_WAV_REL, len(audio_copy["copied"])))
    print("     static: %s" % (", ".join(assets) or "-"))
    print("     index gzip %.1f KB / %.0f KB (ADR-012)" % (kb(gz_len(html_bytes)), kb(budget_gz)))
    if budget_gz != INDEX_GZIP_BUDGET:
        print("     ^ ADR-012 契约值 %.0f KB 被 --budget 覆盖" % kb(INDEX_GZIP_BUDGET))
    print("     first-screen gzip %.1f KB / %.0f KB (ADR-012: index+外链脚本(cards/audio)+manifest)"
          % (kb(first_screen_gzip(out, html)), kb(budget_total)))
    print_stats(out)
    return out


def print_stats(out):
    rows = []

    def add(path, label, gz=True):
        if not path.is_file():
            return
        data = path.read_bytes()
        rows.append((label, len(data), gz_len(data) if gz else None))

    add(out / "index.html", "index.html")
    assets_dir = out / "assets"
    if assets_dir.is_dir():
        for p in sorted(assets_dir.glob("*.js")):
            add(p, "assets/" + p.name, gz=True)
    add(out / "sw.js", "sw.js")
    add(out / "manifest.webmanifest", "manifest.webmanifest")
    audio_dir = out / AUDIO_WAV_REL
    if audio_dir.is_dir():
        wavs = sorted(p for p in audio_dir.glob("*.wav"))
        if wavs:
            rows.append(("assets/audio/ (%d wav)" % len(wavs), sum(p.stat().st_size for p in wavs), None))
    icons_dir = out / "icons"
    if icons_dir.is_dir():
        pngs = sorted(icons_dir.glob("*.png"))
        if pngs:
            rows.append(("icons/ (%d png)" % len(pngs), sum(p.stat().st_size for p in pngs), None))
    if not rows:
        return
    print("[STAT] 落盘体积（raw / gzip，均为实测）")
    width = max(len(r[0]) for r in rows) + 2
    raw_total = gz_total = 0
    for label, raw, gz in rows:
        raw_total += raw
        if gz is not None:
            gz_total += gz
        no_gz = "(wav，不计 gzip)" if "wav" in label else "(png，不计 gzip)"
        print("[STAT]   %s%s %8.1f KB%s" % (
            label.ljust(width), "", kb(raw),
            ("   gzip %6.1f KB" % kb(gz)) if gz is not None else "   " + no_gz))
    print("[STAT]   %s%s %8.1f KB%s" % (
        "TOTAL".ljust(width), "", kb(raw_total),
        ("   gzip %6.1f KB" % kb(gz_total)) if gz_total else ""))


# --------------------------------------------------------------------------- 发布门
def run_check(out, board, budget_gz=INDEX_GZIP_BUDGET, budget_raw=INDEX_RAW_BUDGET,
              budget_total=FIRST_SCREEN_GZIP_BUDGET, with_3d=True, budget_3d=BOARD3D_GZIP_TARGET):
    out = pathlib.Path(out)
    passed, failed = [], []

    def expect(name, cond, detail=""):
        (passed if cond else failed).append((name, detail if not cond else ""))

    index = out / "index.html"
    expect("index.html 已产出", index.is_file())
    if not index.is_file():
        return report(passed, failed)

    index_bytes = index.read_bytes()
    html = index_bytes.decode("utf-8", "replace")

    # 1) 模板占位符 / JS 包（inline 在 index 里，external 在 assets/app.<hash>.js 里）
    expect("模板占位符全部替换", "<!--APP_" not in html)
    app_ref = re.search(r'<script[^>]*\bsrc="(assets/app\.[0-9a-f]{8}\.js)"', html)
    app_rel = app_ref.group(1) if app_ref else ""
    mode = "external" if app_rel else "inline"
    bundle_text = ""
    if app_rel and (out / app_rel).is_file():
        bundle_text = (out / app_rel).read_text(encoding="utf-8")
    elif not app_rel:
        bundle_text = html
    m_bundle = re.search(r"/\*! v6-bundle:([0-9a-f]{8}) modules:(\d+) min:([01]) \*/", bundle_text)
    expect("JS 包已产出（v6-bundle 标记，mode=%s）" % mode, bool(m_bundle), "未找到 v6-bundle 标记")
    expect("app.js 已入包（window.App 已定义）", "window.App" in bundle_text)
    if app_rel:
        expect("external：app 包已落盘", (out / app_rel).is_file(), app_rel)
        expect("external：index 不再内联 app 包", "v6-bundle:" not in html)
    else:
        expect("inline：index 内无 assets/app.*.js 引用",
               not re.search(r"assets/app\.[0-9a-f]{8}\.js", html))
    if m_bundle:
        print("[CHECK]       bundle: mode=%s %s modules, minify=%s" % (
            mode, m_bundle.group(2), "on" if m_bundle.group(3) == "1" else "off"))

    # 2) head 内无 <script src>（首屏不阻塞）、无外链样式表
    m = re.search(r"<head\b[^>]*>(.*?)</head>", html, re.S | re.I)
    head = m.group(1) if m else ""
    body = html[m.end():] if m else html
    head_scripts = re.findall(r"<script\b[^>]*\bsrc\s*=\s*[\"']([^\"']+)[\"']", head, re.I)
    expect("head 内无 <script src>（不阻塞首屏）", not head_scripts, ", ".join(head_scripts))
    blocking = [
        t for t in re.findall(r"<script\b[^>]*>", body, re.I)
        if re.search(r"\bsrc\s*=", t, re.I) and not re.search(r"\b(?:defer|async)\b", t, re.I)
    ]
    expect("body 内外链脚本均 defer/async", not blocking, " ".join(blocking))
    expect("无外链 stylesheet（CSS 已内联）",
           not re.search(r"<link\b[^>]*rel\s*=\s*[\"']stylesheet", html, re.I))
    ref_cards = cards_ref(html)
    if ref_cards:
        preloads = re.findall(r"<link\b[^>]*\brel\s*=\s*[\"']preload[\"'][^>]*>", html, re.I)
        expect("题库已 preload（与文档并行下载）",
               any(('href="%s"' % ref_cards) in t for t in preloads), ref_cards)

    # 3) index 引用的本地资源都存在
    refs = re.findall(r"<(?:script|link)\b[^>]*?\b(?:src|href)\s*=\s*[\"']([^\"']+)[\"']", html, re.I)
    local_refs = [r for r in refs if is_local_ref(r)]
    missing_refs = [r for r in local_refs if not (out / r.split("?")[0].split("#")[0]).is_file()]
    expect("index 引用的本地资源都存在", not missing_refs, ", ".join(missing_refs))

    # 4) 文件名哈希 == 内容哈希
    bad_hash = []
    for ref in local_refs:
        mh = re.match(r"^(?:.*/)?[^/]+\.([0-9a-f]{8})\.js$", ref)
        if not mh:
            continue
        p = out / ref
        if p.is_file() and sha8_file(p) != mh.group(1):
            bad_hash.append(ref)
    expect("assets 文件名哈希与内容一致", not bad_hash, ", ".join(bad_hash))

    # 5) V6 3D 棋盘 assets/board.js（511KB 可选件）：默认不随包、不引用
    board_refs = [r for r in local_refs if re.search(r"(?:^|/)assets/board\.js$", r)]
    if board == "3d":
        expect("--board=3d：assets/board.js 已随包", (out / "assets" / "board.js").is_file())
    else:
        expect("产物不含/不引用 assets/board.js（V6 511KB 棋盘）",
               not board_refs and not (out / "assets" / "board.js").exists(),
               ", ".join(board_refs) or "assets/board.js 存在")

    # 5b) V8 3D 主桌懒加载 chunk：index 只注入 URL；chunk 独立哈希；不阻塞首屏；首屏无 three
    m_3d = re.search(r'window\.%s\s*=\s*["\'](assets/board3d\.[0-9a-f]{8}\.js)["\']' % BOARD3D_URL_VAR, html)
    three_rel = m_3d.group(1) if m_3d else ""
    three_path = out / three_rel if three_rel else None
    entry_ready = BOARD3D_ENTRY.is_file()
    if with_3d and entry_ready:
        expect("3D：index 注入 window.%s = %s" % (BOARD3D_URL_VAR, "assets/board3d.<hash>.js"),
               bool(three_rel), "未找到 __BOARD3D_URL（entry 存在，说明 chunk 构建失败）")
    elif with_3d and not three_rel:
        print("[CHECK] WARN 3D chunk missing：%s 未就绪（并行开发期，本项不判 RED）"
              % BOARD3D_ENTRY.relative_to(ROOT))

    # 懒加载形态 + 首屏纯净：无论 chunk 是否产出都必须成立
    expect("3D：首屏不以 <script src> 引用 3D chunk（仅懒加载）",
           not re.search(r'<script\b[^>]*\bsrc\s*=\s*["\']assets/board3d', html, re.I))
    expect("3D：首屏无 preload/prefetch 强制拉取 3D chunk",
           not re.search(r'<link\b[^>]*(?:preload|prefetch)[^>]*assets/board3d', html, re.I))
    # 首屏（index / 外部 app 包）不得内联 three
    three_markers = [m for m in ("gl_Position", "three.module.min.js", "three.core.min.js",
                                 "THREE.WebGLRenderer")
                     if m in bundle_text]
    expect("首屏无 three 内联（index/bundle 无 three 标记）", not three_markers,
           ", ".join(three_markers))

    if three_rel:
        expect("3D：chunk 已落盘 %s" % three_rel, three_path.is_file())
        if three_path.is_file():
            chunk_bytes = three_path.read_bytes()
            chunk_text = chunk_bytes.decode("utf-8", "replace")
            want_hash = re.search(r"\.([0-9a-f]{8})\.js$", three_rel).group(1)
            expect("3D：chunk 文件名哈希 == 内容哈希", sha8_file(three_path) == want_hash,
                   "name=%s content=%s" % (want_hash, sha8_file(three_path)))
            expect("3D：chunk 为 IIFE（无 ESM import/export 残留）",
                   not re.search(r'(?:^|[;}])\s*(?:import|export)\s*[\{\(\'"]', chunk_text)
                   and 'from"./three.core' not in chunk_text)
            expect("3D：three 已打进 chunk（WebGL 着色器/上下文标记）",
                   "gl_Position" in chunk_text or "webgl2" in chunk_text)
            i_3d = html.find(BOARD3D_URL_VAR)
            i_boot = html.find("v6-bundle:") if "v6-bundle:" in html else html.find("assets/app.")
            expect("3D：__BOARD3D_URL 在启动脚本之前注入", i_3d >= 0 and (i_boot < 0 or i_3d < i_boot))
            gz3d = gz_len(chunk_bytes)
            if gz3d <= budget_3d:
                print("[CHECK] PASS  3D chunk gzip %.1f KB ≤ %.0f KB（V9 目标%s）" % (
                    kb(gz3d), kb(budget_3d),
                    "" if budget_3d == BOARD3D_GZIP_TARGET else "，--budget-3d 覆盖"))
            else:
                print("[CHECK] WARN  3D chunk gzip %.1f KB > %.0f KB 目标（仅告警，不判 RED）"
                      % (kb(gz3d), kb(budget_3d)))
                # 实测口径（V8 首版，同一份 board3d 源码 + build_3d_chunk）：
                #   · namespace + three.module.min.js         = 156.2 KB gzip（当前）
                #   · 仅把 import 路径改成 unmin three.module.js = 151.7 KB gzip（esbuild 多摇掉 ~4.5 KB）
                #   · 具名 import（连 THREE.xxx 一起改写）不省：仍 156.2 KB；
                #     three r180 的 WebGLRenderer 单类 floor ≈ 132 KB gzip（min）/ 118 KB（unmin）
                #   · 场景侧多出 ~24–34 KB gzip；ExtrudeGeometry 边际最大（实测 ≈ +8.8 KB），
                #     其余 Sprite/Points/PointLight/Fog/阴影 边际 <1 KB
                min_three = []
                try:
                    for p in sorted(BOARD3D_ENTRY.parent.glob("*.js")):
                        if "three.module.min.js" in read_text(p):
                            min_three.append(p.name)
                except OSError:
                    min_three = []
                if min_three:
                    print("[CHECK]   · 低风险杠杆：把 %d 个文件的 import 路径从 three.module.min.js 换成"
                          " three.module.js（unmin，esbuild 自己压）→ 实测省 ~4.5 KB gzip"
                          % len(min_three))
                for tip in (
                    "  · V9 验收线是 ≤180 KB gzip（PBR 场景实测 ~166.5 KB）；超出先查场景侧新增",
                    "  · ExtrudeGeometry 边际最大（≈8.8 KB gzip），Sprite/Points/PointLight/Fog/阴影 均 <1 KB",
                    "  · 这是懒加载 chunk（不进首屏、失败回落 V7）：确需更大体积请 lead 拍板",
                    "  · 临时对齐口径：--budget-3d <KB>（仅影响本行输出，不判 RED）",
                ):
                    print("[CHECK] %s" % tip)
            print("[CHECK]       chunk: %s raw %.1f KB / gzip %.1f KB" % (
                three_rel, kb(len(chunk_bytes)), kb(gz3d)))

    # 5c) V9 音频：core/audio.js 独立 defer chunk；16 个 wav 随包 + 懒加载（不进首屏）
    m_audio = re.search(r'<script\b[^>]*\bsrc\s*=\s*["\'](assets/audio\.[0-9a-f]{8}\.js)["\'][^>]*>',
                        html)
    audio_rel = m_audio.group(1) if m_audio else ""
    audio_tag = m_audio.group(0) if m_audio else ""
    expect("音频：index 以 defer 引用 assets/audio.<hash>.js",
           bool(audio_rel) and bool(re.search(r"\bdefer\b", audio_tag, re.I)),
           audio_tag or "未找到 audio chunk 引用")
    expect("音频：index 不再内联 audio.js（已拆成独立 chunk）",
           "sfx-dice-shake.wav" not in bundle_text and "ambCalm" not in bundle_text,
           "内联包仍含音频采样表")
    expect("音频：首屏无 wav preload/prefetch（首次手势后才懒加载）",
           not re.search(r'<link\b[^>]*(?:preload|prefetch)[^>]*\.wav', html, re.I))
    if audio_rel:
        audio_path = out / audio_rel
        expect("音频：chunk 已落盘 %s" % audio_rel, audio_path.is_file())
        if audio_path.is_file():
            audio_bytes = audio_path.read_bytes()
            audio_text = audio_bytes.decode("utf-8", "replace")
            want = re.search(r"\.([0-9a-f]{8})\.js$", audio_rel).group(1)
            expect("音频：chunk 文件名哈希 == 内容哈希", sha8_file(audio_path) == want,
                   "name=%s content=%s" % (want, sha8_file(audio_path)))
            expect("音频：chunk 是 App.Audio 独立实现（window.App + 采样文件表 + WebAudio）",
                   "window.App" in audio_text and "sfx-dice-shake.wav" in audio_text
                   and "AudioContext" in audio_text,
                   "缺 window.App / 采样表 / AudioContext")
            print("[CHECK]       audio: %s raw %.1f KB / gzip %.1f KB" % (
                audio_rel, kb(len(audio_bytes)), kb(gz_len(audio_bytes))))
    audio_dir = out / AUDIO_WAV_REL
    wavs = sorted(p.name for p in audio_dir.glob("*.wav")) if audio_dir.is_dir() else []
    missing_wav = [n for n in AUDIO_WAVS if not (audio_dir / n).is_file()]
    empty_wav = [n for n in AUDIO_WAVS
                 if (audio_dir / n).is_file() and (audio_dir / n).stat().st_size == 0]
    bad_wav = []
    for name in AUDIO_WAVS:
        p = audio_dir / name
        if p.is_file():
            head = p.read_bytes()[:12]
            if len(head) < 12 or head[:4] != b"RIFF" or head[8:12] != b"WAVE":
                bad_wav.append(name)
    expect("音频：16 个 wav 都在产物 assets/audio/", not missing_wav, ", ".join(missing_wav))
    expect("音频：产物 wav 数量 == 16（无缺失/多余）",
           len(wavs) == len(AUDIO_WAVS) and set(wavs) == set(AUDIO_WAVS),
           "disk=%d %s" % (len(wavs), ",".join(wavs)))
    expect("音频：wav 非空且为 RIFF/WAVE", not empty_wav and not bad_wav,
           ", ".join(empty_wav + bad_wav))
    sfx_bytes = sum((audio_dir / n).stat().st_size for n in AUDIO_WAVS
                    if n.startswith("sfx-") and (audio_dir / n).is_file())
    amb_bytes = sum((audio_dir / n).stat().st_size for n in AUDIO_WAVS
                    if n.startswith("amb-") and (audio_dir / n).is_file())
    print("[CHECK]       audio assets: %d wav %.1f KB（SFX %.1f KB / ambience %.1f KB）" % (
        len([n for n in AUDIO_WAVS if (audio_dir / n).is_file()]),
        kb(sfx_bytes + amb_bytes), kb(sfx_bytes), kb(amb_bytes)))

    # 6) sw.js：CACHE 哈希 / PRECACHE 与磁盘一致 / 不含 V6 board.js、含 V8 3D chunk
    sw_path = out / "sw.js"
    expect("sw.js 已产出", sw_path.is_file())
    if sw_path.is_file():
        sw = sw_path.read_text(encoding="utf-8")
        want = CACHE_PREFIX + sha8_file(index)
        m_cache = re.search(r"var CACHE = '([^']*)'", sw)
        expect("sw CACHE == %s" % want,
               bool(m_cache) and m_cache.group(1) == want,
               m_cache.group(1) if m_cache else "未找到 CACHE")
        m_build = re.search(r"var BUILD = '([^']*)'", sw)
        expect("sw BUILD == index 哈希", bool(m_build) and m_build.group(1) == sha8_file(index))
        precache = None
        m_pc = re.search(r"var PRECACHE = (\[.*?\]);", sw, re.S)
        if m_pc:
            try:
                precache = json.loads(m_pc.group(1))
            except ValueError as e:
                precache = None
                expect("sw PRECACHE 可解析", False, str(e))
        expect("sw PRECACHE 可解析", isinstance(precache, list))
        if isinstance(precache, list):
            absent = [e for e in precache if e != "./" and not (out / rel_of(e)).is_file()]
            expect("sw PRECACHE 条目都在磁盘上", not absent, ", ".join(absent))
            expected = expected_precache(out, html, extra=[three_rel] if three_rel else [],
                                         audio=AUDIO_WAVS)
            expect("sw PRECACHE 与产物清单一致",
                   sorted(precache) == sorted(expected) and len(set(precache)) == len(precache),
                   "disk=%s" % sorted(precache))
            expect("sw PRECACHE 不含 V6 assets/board.js",
                   not [e for e in precache if re.search(r"(?:^|/)assets/board\.js$", e)])
            if three_rel:
                expect("3D：sw PRECACHE 含 3D chunk（离线可用）",
                       ("./" + three_rel) in precache, "PRECACHE 缺 ./" + three_rel)
            ref = cards_ref(html)
            expect("sw PRECACHE 含首屏题库", ("./" + ref) in precache if ref else True)
            expect("音频：sw PRECACHE 含 audio chunk（离线可用）",
                   ("./" + audio_rel) in precache if audio_rel else False,
                   "PRECACHE 缺 ./%s" % (audio_rel or "assets/audio.<hash>.js"))
            miss_audio = [e for e in ("./" + AUDIO_WAV_REL + "/" + n for n in AUDIO_WAVS)
                          if e not in precache]
            expect("音频：sw PRECACHE 含 16 个 wav（离线可播）", not miss_audio,
                   ", ".join(miss_audio))
            pre_bytes = sum((out / rel_of(e)).stat().st_size for e in precache
                            if e != "./" and (out / rel_of(e)).is_file())
            print("[CHECK]       sw PRECACHE: %d 项，落盘 %.1f KB（含 %d wav）" % (
                len(precache), kb(pre_bytes), len(AUDIO_WAVS)))

    # 7) manifest
    man_path = out / "manifest.webmanifest"
    expect("manifest.webmanifest 已产出", man_path.is_file())
    man = {}
    if man_path.is_file():
        try:
            man = json.loads(man_path.read_text(encoding="utf-8"))
            ok_json = isinstance(man, dict)
        except ValueError as e:
            ok_json = False
            expect("manifest 是合法 JSON", False, str(e))
        expect("manifest 是合法 JSON", ok_json)
        if ok_json:
            expect("manifest start_url/scope 未变",
                   man.get("start_url") == "./" and man.get("scope") == "./")
            miss_icons = [i.get("src") for i in man.get("icons", []) if not (out / i.get("src", "")).is_file()]
            expect("manifest 图标文件都存在", not miss_icons, ", ".join([x for x in miss_icons if x]))

    # 8) 首屏体积预算（ADR-012：index ≤520KB raw / ≤140KB gzip，首屏总 gzip ≤180KB）
    gz = gz_len(index_bytes)
    raw = len(index_bytes)
    expect("首屏 index.html gzip %.1f KB ≤ %.0f KB (ADR-012%s)" % (
        kb(gz), kb(budget_gz),
        "" if budget_gz == INDEX_GZIP_BUDGET else "，--budget 覆盖"),
           gz <= budget_gz)
    expect("首屏 index.html raw %.1f KB ≤ %.0f KB (ADR-012%s)" % (
        kb(raw), kb(budget_raw),
        "" if budget_raw == INDEX_RAW_BUDGET else "，--budget-raw 覆盖"),
           raw <= budget_raw)
    total = first_screen_gzip(out, html)
    expect("首屏总 gzip %.1f KB ≤ %.0f KB (ADR-012：index+cards/audio+manifest%s)" % (
        kb(total), kb(budget_total),
        "" if budget_total == FIRST_SCREEN_GZIP_BUDGET else "，--budget-total 覆盖"),
           total <= budget_total)

    return report(passed, failed)


def report(passed, failed):
    for name, _ in passed:
        print("[CHECK] PASS  %s" % name)
    for name, detail in failed:
        print("[CHECK] FAIL  %s%s" % (name, ("  ← " + detail) if detail else ""))
    print("[CHECK] %d passed, %d failed -> %s" % (
        len(passed), len(failed), "GREEN" if not failed else "RED"))
    return 0 if not failed else 1


# --------------------------------------------------------------------------- entry
def main():
    ap = argparse.ArgumentParser(description="今晚飞行棋 V6/V8 构建 / 发布门")
    ap.add_argument("--out", default=None, help="输出目录（默认 dist/rebuild；--release 时默认仓库根）")
    ap.add_argument("--release", action="store_true", help="写仓库根（部署用）")
    ap.add_argument("--check", action="store_true", help="构建后跑发布门校验，失败退出 1")
    ap.add_argument("--board", choices=("svg", "none", "3d"), default="svg",
                    help="svg/none=不复制 assets/board.js（默认）；3d=把 511KB 棋盘一起拷进产物")
    ap.add_argument("--strict", action="store_true", help="缺模块视为错误（最终集成用）")
    ap.add_argument("--split-screens", action="store_true",
                    help="把 ledger/nights/settings/minigame 拆成 assets/screens.<hash>.js（首屏 gzip 顶到预算时的备用杠杆，arch §4.3 ②）")
    ap.add_argument("--budget", type=float, default=None,
                    help="首屏 index gzip 预算 KB（默认 ADR-012 的 140；临时覆盖用）")
    ap.add_argument("--budget-raw", type=float, default=None,
                    help="首屏 index raw 预算 KB（默认 ADR-012 的 520；临时覆盖用）")
    ap.add_argument("--budget-total", type=float, default=None,
                    help="首屏总 gzip 预算 KB（index+cards/audio+manifest，默认 ADR-012 的 180；临时覆盖用）")
    ap.add_argument("--budget-3d", type=float, default=None,
                    help="3D chunk gzip 目标 KB（默认 180（V9 PBR）；仅报告/告警，不判 RED）")
    ap.add_argument("--no-minify", action="store_true",
                    help="关闭 esbuild 压缩（调试用；默认对 dev/release 都开）")
    ap.add_argument("--external-js", action="store_true",
                    help="把整包 JS 写成 assets/app.<hash>.js（首屏 HTML 只剩 CSS+骨架，首绘更早）")
    ap.add_argument("--inline-js", action="store_true",
                    help="强制内联 JS（覆盖 --release 的默认 external）")
    ap.add_argument("--no-3d", dest="with_3d", action="store_false",
                    help="不构建 V8 3D 懒加载 chunk / 不注入 __BOARD3D_URL")
    ap.add_argument("--with-3d", dest="with_3d", action="store_true",
                    help="构建 V8 3D 懒加载 chunk（默认开启，生产口径）")
    ap.set_defaults(with_3d=True)
    ap.add_argument("--skip-assets", action="store_true", help="已废弃，保留仅为兼容旧脚本")
    args = ap.parse_args()

    if args.skip_assets:
        print("[WARN] --skip-assets 已废弃：V6 默认就不复制 assets/board.js（用 --board=3d 显式开启）")

    budget_gz = int(args.budget * 1024) if args.budget else INDEX_GZIP_BUDGET
    budget_raw = int(args.budget_raw * 1024) if args.budget_raw else INDEX_RAW_BUDGET
    budget_total = int(args.budget_total * 1024) if args.budget_total else FIRST_SCREEN_GZIP_BUDGET
    budget_3d = int(args.budget_3d * 1024) if args.budget_3d else BOARD3D_GZIP_TARGET
    if args.external_js and args.inline_js:
        die("--external-js 与 --inline-js 不能同时用")
    external_js = args.external_js or (args.release and RELEASE_EXTERNAL_JS_DEFAULT)
    if args.inline_js:
        external_js = False

    if args.out:
        out = pathlib.Path(args.out)
    elif args.release:
        out = ROOT
    else:
        out = ROOT / "dist" / "rebuild"

    build(out, args.release, args.board, args.strict, args.split_screens,
          budget_gz, budget_raw, budget_total, minify=not args.no_minify, external_js=external_js,
          with_3d=args.with_3d, budget_3d=budget_3d)
    if args.check:
        sys.exit(run_check(out, args.board, budget_gz, budget_raw, budget_total,
                           with_3d=args.with_3d, budget_3d=budget_3d))


if __name__ == "__main__":
    main()
