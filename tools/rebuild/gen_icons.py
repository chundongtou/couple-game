# -*- coding: utf-8 -*-
"""升温夜航 PWA 图标 / 分享图生成（Pillow，可重跑，无外部资源）。

产物：icons/icon-192.png / icon-512.png / icon-maskable-512.png /
      apple-touch-icon.png / og-image.png
"""
import math
import pathlib
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "icons"
OUT.mkdir(parents=True, exist_ok=True)

BG0 = (246, 239, 228)
BG1 = (232, 211, 154)
GOLD = (224, 177, 90)
ROSE = (196, 92, 74)
VIOLET = (110, 122, 79)
TEAL = (110, 122, 79)
INK = (42, 36, 28)


def gradient(size, stops=((0, 0), (0, 0), BG0, BG1)):
    w, h = size
    img = Image.new("RGB", (1, h))
    top, bot = stops[2], stops[3]
    for y in range(h):
        t = y / max(1, h - 1)
        t = t ** 0.9
        c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        img.putpixel((0, y), c)
    return img.resize((w, h))


def add_glow(img, cx, cy, radius, color, alpha=90):
    w, h = img.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for r, a in ((radius, alpha), (radius * 0.66, alpha * 0.7), (radius * 0.34, alpha * 0.9)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color + (int(a),))
    layer = layer.filter(ImageFilter.GaussianBlur(max(2, radius // 6)))
    img.alpha_composite(layer)


def draw_scene(size, safe=0):
    w, h = size
    img = gradient((w, h)).convert("RGBA")
    d = ImageDraw.Draw(img)
    m = int(w * (0.16 + safe * 0.08))
    d.rounded_rectangle((m, m, w - m, h - m), radius=int(w * 0.06), fill=(255, 253, 248, 255), outline=(226, 212, 192, 255), width=max(2, w // 80))
    tape_w, tape_h = int(w * 0.28), int(h * 0.07)
    d.rectangle((w * 0.36, m - tape_h * 0.45, w * 0.36 + tape_w, m + tape_h * 0.45), fill=GOLD + (230,))
    d.rounded_rectangle((m + w * 0.08, h * 0.34, w - m - w * 0.12, h * 0.62), radius=int(w * 0.03), fill=(255, 253, 248, 255), outline=ROSE + (255,), width=max(3, w // 70))
    d.ellipse((w * 0.62, h * 0.58, w * 0.86, h * 0.82), outline=ROSE + (255,), width=max(4, w // 50))
    return img


def rounded(img, radius_ratio=0.22):
    w, h = img.size
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w, h), radius=int(w * radius_ratio), fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(img, (0, 0), m)
    return out


def font(size, bold=False):
    cands = [
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
        "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf",
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for p in cands:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


def save(img, name):
    img.save(OUT / name, "PNG", optimize=True)
    print(name, img.size, (OUT / name).stat().st_size // 1024, "KB")


def og_image():
    w, h = 1200, 630
    img = gradient((w, h)).convert("RGBA")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((70, 70, 1130, 560), radius=28, fill=(255, 253, 248, 255), outline=(226, 212, 192, 255), width=4)
    d.rectangle((120, 48, 280, 92), fill=GOLD + (255,))
    f1 = font(84, bold=True)
    f2 = font(32)
    d.text((120, 180), "今晚这一页", font=f1, fill=INK)
    d.text((124, 300), "两人一本手帐 · 三页贴纸 · 封底海报", font=f2, fill=(107, 94, 78, 255))
    d.ellipse((900, 250, 1060, 410), outline=ROSE + (255,), width=8)
    save(img, "og-image.png")


def main():
    base = draw_scene((512, 512))
    save(rounded(base), "icon-512.png")
    save(rounded(base), "icon-192.png") if False else None
    save(rounded(base.resize((192, 192), Image.LANCZOS)), "icon-192.png")
    mask = draw_scene((512, 512), safe=0.22)
    save(mask, "icon-maskable-512.png")
    apple = draw_scene((180, 180), safe=0.1)
    save(rounded(apple, 0.0), "apple-touch-icon.png")
    og_image()


if __name__ == "__main__":
    main()
