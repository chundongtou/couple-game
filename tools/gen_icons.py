#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""V17 · 生成「情侣升温游戏」的 PWA 图标与分享卡。

一次性脚本，可重复运行（产物样式确定，不依赖运行时生成）。
用法：python tools/gen_icons.py

产物（提交进仓库，线上直接静态引用）：
  icons/icon-192.png            192x192   普通图标（满幅）
  icons/icon-512.png            512x512   普通图标（满幅）
  icons/icon-maskable-512.png   512x512   maskable（主体收进中央 80% 安全区，底色铺满）
  icons/apple-touch-icon.png    180x180   iOS 主屏图标（不透明底）
  icons/og-image.png            1200x630  微信/社交分享卡

设计：紫→粉对角渐变底（#6c2bd9 → #ff2d95）+ 白色爱心 + 少量柔光点。
字体：只用系统字体（优先 C:\\Windows\\Fonts\\msyh.ttc），绝对不联网下载。
依赖：Pillow（本机 11.x）。
"""
import math
import pathlib
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
ICON_DIR = ROOT / "icons"

PURPLE = (0x6C, 0x2B, 0xD9)   # #6c2bd9
PINK = (0xFF, 0x2D, 0x95)     # #ff2d95
WHITE = (255, 255, 255)
DEEP = (22, 4, 38)            # 深色阴影
HEART_TINT = (255, 232, 246)  # 爱心底部的一点淡粉，避免纯白太平

SS = 4  # 形状/爱心的超采样倍率

# 字体候选：先微软雅黑（Bold 同族更清晰，缺失则用 SPECS 指定的 msyh.ttc），再降级 Arial / 系统默认。
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\msyhbd.ttc",
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\msyh.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\arial.ttf",
    "/System/Library/Fonts/PingFang.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


# --------------------------------------------------------------------------- #
# 基础绘制工具
# --------------------------------------------------------------------------- #
def load_font(size):
    """按候选列表加载字体；全找不到时退回 Pillow 默认位图字体（不联网）。"""
    for path in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def diagonal_gradient(size, c1=PURPLE, c2=PINK, angle_deg=48.0):
    """对角线性渐变：低分辨率逐像素算好后双三次放大，端点颜色精确且平滑。"""
    w, h = size
    gw = 160
    gh = max(2, int(round(gw * h / float(w))))
    low = Image.new("RGB", (gw, gh))
    px = low.load()
    rad = math.radians(angle_deg)
    dx, dy = math.cos(rad), math.sin(rad)
    corners = ((0, 0), (gw - 1, 0), (0, gh - 1), (gw - 1, gh - 1))
    projs = [x * dx + y * dy for x, y in corners]
    lo, hi = min(projs), max(projs)
    span = (hi - lo) or 1.0
    for y in range(gh):
        for x in range(gw):
            t = ((x * dx + y * dy) - lo) / span
            px[x, y] = (
                int(round(c1[0] + (c2[0] - c1[0]) * t)),
                int(round(c1[1] + (c2[1] - c1[1]) * t)),
                int(round(c1[2] + (c2[2] - c1[2]) * t)),
            )
    return low.resize(size, Image.BICUBIC)


def _heart_points(n=1440):
    """经典爱心参数曲线，已翻成屏幕坐标（y 向下）。"""
    pts = []
    for i in range(n):
        t = 2.0 * math.pi * i / n
        x = 16.0 * math.sin(t) ** 3
        y = 13.0 * math.cos(t) - 5.0 * math.cos(2 * t) - 2.0 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((x, -y))
    return pts


HEART_PTS = _heart_points()
HX0 = min(p[0] for p in HEART_PTS)
HX1 = max(p[0] for p in HEART_PTS)
HY0 = min(p[1] for p in HEART_PTS)
HY1 = max(p[1] for p in HEART_PTS)
HCX = (HX0 + HX1) / 2.0
HCY = (HY0 + HY1) / 2.0
H_W = HX1 - HX0
H_H = HY1 - HY0


def heart_mask(size, height, center):
    """返回 L 模式的爱心遮罩（4x 超采样后 LANCZOS 缩回，边缘平滑）。"""
    w, h = size
    scale = height / H_H
    W, H = w * SS, h * SS
    cx, cy = center[0] * SS, center[1] * SS
    mask = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(mask)
    pts = [((x - HCX) * scale * SS + cx, (y - HCY) * scale * SS + cy) for x, y in HEART_PTS]
    draw.polygon(pts, fill=255)
    return mask.resize((w, h), Image.LANCZOS)


def heart_box(size, height, center):
    """爱心的包围盒（像素），用于光点避让。"""
    scale = height / H_H
    hw = H_W * scale / 2.0
    hh = height / 2.0
    return (center[0] - hw, center[1] - hh, center[0] + hw, center[1] + hh)


def vignette(img, strength=64):
    """四角轻微压暗，让中间的爱心更跳。strength=0~255。"""
    w, h = img.size
    grad = Image.radial_gradient("L").resize((w, h), Image.BICUBIC)
    overlay = Image.new("RGB", (w, h), DEEP)
    return Image.composite(overlay, img, grad.point(lambda v: int(v * strength / 255.0)))


def paint_heart(img, mask, shadow=True):
    """在渐变底上画爱心：投影 → 柔光 → 白心（底部带一点淡粉）。"""
    w, h = img.size
    base = img.convert("RGB")
    if shadow:
        sh = mask.filter(ImageFilter.GaussianBlur(max(2.0, w * 0.018)))
        sh = ImageChopsOffset(sh, 0, int(w * 0.012))
        sh = sh.point(lambda v: int(v * 0.42))
        base = Image.composite(Image.new("RGB", (w, h), (40, 6, 48)), base, sh)
    glow = mask.filter(ImageFilter.GaussianBlur(max(2.0, w * 0.030))).point(
        lambda v: int(v * 0.42)
    )
    base = Image.composite(Image.new("RGB", (w, h), WHITE), base, glow)
    fill = Image.new("RGB", (w, h))
    fp = fill.load()
    for y in range(h):
        t = y / float(max(1, h - 1))
        fp_row = (
            int(round(WHITE[0] + (HEART_TINT[0] - WHITE[0]) * t)),
            int(round(WHITE[1] + (HEART_TINT[1] - WHITE[1]) * t)),
            int(round(WHITE[2] + (HEART_TINT[2] - WHITE[2]) * t)),
        )
        for x in range(w):
            fp[x, y] = fp_row
    return Image.composite(fill, base, mask)


def ImageChopsOffset(mask, dx, dy):
    """把 L 遮罩整体平移（Pillow 无直接实现，用 paste 到新画布）。"""
    out = Image.new("L", mask.size, 0)
    out.paste(mask, (int(dx), int(dy)))
    return out


def add_sparkles(img, count=9, seed=7, safe_circle=0.40, avoid_box=None, scale=1.0):
    """少量柔光点（bokeh）：2x 画圆 → 轻微模糊 → 缩回，叠加到图上。"""
    w, h = img.size
    rng = random.Random(seed)
    layer = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    placed = 0
    tries = 0
    while placed < count and tries < 800:
        tries += 1
        nx = rng.uniform(0.055, 0.945)
        ny = rng.uniform(0.055, 0.945)
        # 光点只出现在安全圆内（maskable 不会被裁掉）
        if math.hypot(nx - 0.5, ny - 0.5) > safe_circle:
            continue
        # 避开爱心本体及其柔光边缘
        if avoid_box is not None:
            x0, y0, x1, y1 = avoid_box
            pad_x = (x1 - x0) * 0.06
            pad_y = (y1 - y0) * 0.06
            if x0 - pad_x <= nx * w <= x1 + pad_x and y0 - pad_y <= ny * h <= y1 + pad_y:
                continue
        big = rng.random() < 0.22
        r = (rng.uniform(0.020, 0.032) if big else rng.uniform(0.006, 0.014)) * w * scale
        alpha = int(rng.uniform(26, 54)) if big else int(rng.uniform(70, 150))
        cx, cy = nx * w * 2, ny * h * 2
        rr = max(1.0, r * 2)
        draw.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=(255, 255, 255, alpha))
        placed += 1
    layer = layer.filter(ImageFilter.GaussianBlur(1.6))
    layer = layer.resize((w, h), Image.LANCZOS)
    out = img.convert("RGBA")
    out.alpha_composite(layer)
    return out.convert("RGB")


# --------------------------------------------------------------------------- #
# 图标
# --------------------------------------------------------------------------- #
def build_icon(size, heart_h_ratio=0.50, heart_cy_ratio=0.485, sparkles=9, seed=7):
    img = diagonal_gradient((size, size))
    img = vignette(img, 58)
    height = size * heart_h_ratio
    center = (size * 0.5, size * heart_cy_ratio)
    mask = heart_mask((size, size), height, center)
    img = paint_heart(img, mask)
    box = heart_box((size, size), height, center)
    img = add_sparkles(img, count=sparkles, seed=seed, safe_circle=0.40, avoid_box=box)
    return img


def build_maskable(size=512):
    """maskable：底色铺满，主体收进中央 80% 安全区内；装饰点只在 0.36 半径内。"""
    img = diagonal_gradient((size, size))
    img = vignette(img, 52)
    height = size * 0.40  # 高 40%，配宽约 44%，稳稳落在 80% 安全圆里
    center = (size * 0.5, size * 0.498)
    mask = heart_mask((size, size), height, center)
    img = paint_heart(img, mask)
    box = heart_box((size, size), height, center)
    img = add_sparkles(img, count=7, seed=31, safe_circle=0.355, avoid_box=box, scale=0.9)
    return img


# --------------------------------------------------------------------------- #
# 分享卡 1200x630
# --------------------------------------------------------------------------- #
def _fit_font(draw, text, max_width, start, floor=18):
    size = start
    while size > floor:
        font = load_font(size)
        if draw.textlength(text, font=font) <= max_width:
            return font
        size -= 2
    return load_font(floor)


def _draw_text_layers(img, text, font, center, fill=WHITE, shadow_alpha=185, blur=9):
    """文字带柔和暗投影，保证在任何渐变位置都清晰。"""
    w, h = img.size
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.text((center[0], center[1] + max(2, blur // 2)), text, font=font, fill=(18, 2, 30, shadow_alpha), anchor="mm")
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    out = Image.alpha_composite(img.convert("RGBA"), shadow)
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.text(center, text, font=font, fill=fill + (255,), anchor="mm")
    out = Image.alpha_composite(out, layer)
    return out.convert("RGB")


def _soft_glow(img, center, radius, color=(255, 225, 245), alpha=70):
    w, h = img.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse(
        (center[0] - radius, center[1] - radius * 0.62, center[0] + radius, center[1] + radius * 0.62),
        fill=color + (alpha,),
    )
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.55))
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")


def _rings(img, specs):
    """低透明度圆环，给分享卡一点空间层次。"""
    w, h = img.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for cx, cy, r, alpha, width in specs:
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(255, 255, 255, alpha), width=width)
    layer = layer.filter(ImageFilter.GaussianBlur(1.1))
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")


def build_og():
    W, H = 1200, 630
    img = diagonal_gradient((W, H), PURPLE, PINK, angle_deg=33)
    img = vignette(img, 82)
    img = _soft_glow(img, (840, 120), 360, (255, 205, 240), 46)
    img = _soft_glow(img, (250, 560), 320, (170, 120, 255), 40)
    img = _rings(
        img,
        [
            (1090, 96, 210, 30, 2),
            (1090, 96, 150, 18, 2),
            (120, 575, 190, 24, 2),
            (120, 575, 128, 14, 2),
        ],
    )

    # 爱心（顶部居中）
    heart_h = 248
    heart_c = (W / 2.0, 226.0)
    mask = heart_mask((W, H), heart_h, heart_c)
    img = paint_heart(img, mask)
    box = heart_box((W, H), heart_h, heart_c)
    img = add_sparkles(img, count=13, seed=101, safe_circle=1.4, avoid_box=box, scale=0.62)

    draw = ImageDraw.Draw(img)
    title = "情侣升温游戏 · 今晚升温"
    sub = "24+ 款双人玩法 · 一台手机就够"
    title_font = _fit_font(draw, title, 1040, 70)
    sub_font = _fit_font(draw, sub, 980, 36)
    img = _draw_text_layers(img, title, title_font, (W / 2.0, 424.0), fill=WHITE, shadow_alpha=190, blur=11)
    img = _draw_text_layers(img, sub, sub_font, (W / 2.0, 505.0), fill=(255, 231, 244), shadow_alpha=150, blur=8)
    return img


# --------------------------------------------------------------------------- #
# 入口
# --------------------------------------------------------------------------- #
def _save(img, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    if img.mode != "RGB":
        img = img.convert("RGB")
    img.save(path, "PNG", optimize=True)
    stat = img.convert("RGB")
    extrema = stat.getextrema()
    spread = max(hi - lo for lo, hi in extrema)
    print("[OK] %-34s %4dx%-4d %6.1f KB  通道极差 %d" % (
        str(path.relative_to(ROOT)), img.size[0], img.size[1],
        path.stat().st_size / 1024.0, spread,
    ))
    if spread < 60:
        raise SystemExit("[ERROR] %s 看起来接近纯色块（极差 %d），请检查绘制逻辑" % (path, spread))
    return img


def main():
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    probe = load_font(40)
    try:
        font_name = "/".join(str(p) for p in probe.getname())
    except Exception:
        font_name = "Pillow 默认位图字体"
    print("[GEN] 字体：%s" % font_name)
    _save(build_icon(192, heart_h_ratio=0.505, heart_cy_ratio=0.482, sparkles=7, seed=7), ICON_DIR / "icon-192.png")
    _save(build_icon(512, heart_h_ratio=0.500, heart_cy_ratio=0.485, sparkles=10, seed=11), ICON_DIR / "icon-512.png")
    _save(build_maskable(), ICON_DIR / "icon-maskable-512.png")
    _save(build_icon(180, heart_h_ratio=0.515, heart_cy_ratio=0.485, sparkles=6, seed=19), ICON_DIR / "apple-touch-icon.png")
    _save(build_og(), ICON_DIR / "og-image.png")
    print("[DONE] 图标与分享卡已写入 %s（可直接提交，线上无需 Python）" % ICON_DIR)


if __name__ == "__main__":
    main()
