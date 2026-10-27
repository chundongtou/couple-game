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

BG0 = (7, 4, 17)
BG1 = (20, 13, 43)
GOLD = (243, 200, 121)
ROSE = (255, 95, 158)
VIOLET = (154, 124, 255)
TEAL = (79, 214, 200)


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
    add_glow(img, w * 0.78, h * 0.22, w * 0.34, VIOLET, 70)
    add_glow(img, w * 0.2, h * 0.8, w * 0.34, ROSE, 55)
    rnd = random.Random(20261027 + w)
    d = ImageDraw.Draw(img)
    for _ in range(26):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h)
        r = rnd.uniform(0.6, max(1.2, w * 0.004))
        a = rnd.randint(70, 190)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, a))
    # 月牙（遮罩法：大圆减去偏移圆，真正透明缺口）
    scale = 1 - safe
    cx, cy = w * 0.5, h * 0.46
    R = w * 0.235 * scale
    off = R * 0.62
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((cx - R, cy - R, cx + R, cy + R), fill=255)
    md.ellipse((cx - R + off * 1.25, cy - R - R * 0.12, cx + R + off * 1.25, cy + R - R * 0.12), fill=0)
    gold = Image.new("RGBA", (w, h), GOLD + (255,))
    clear = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    img.alpha_composite(Image.composite(gold, clear, mask))
    # 海面波线
    wave = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wave)
    for k, col in ((0, GOLD), (1, ROSE)):
        pts = []
        base_y = h * (0.68 + k * 0.055) + h * 0.04 * (1 - scale)
        for i in range(0, w * 2 + 1):
            x = i / 2
            y = base_y + math.sin(x / (w * 0.085) + k * 1.8) * h * 0.018
            pts.append((x, y))
        wd.line(pts, fill=col + (170 if k == 0 else 130,), width=max(2, int(w * 0.012)))
    wave = wave.filter(ImageFilter.GaussianBlur(max(0, w * 0.001)))
    img.alpha_composite(wave)
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
    add_glow(img, w * 0.8, h * 0.2, 380, VIOLET, 80)
    add_glow(img, w * 0.15, h * 0.9, 340, ROSE, 60)
    rnd = random.Random(7)
    d = ImageDraw.Draw(img)
    for _ in range(90):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h)
        r = rnd.uniform(0.8, 2.0)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, rnd.randint(50, 170)))
    # 月牙（遮罩法）
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    cx, cy, R = 900, 265, 130
    md.ellipse((cx - R, cy - R, cx + R, cy + R), fill=255)
    md.ellipse((cx - R + 78, cy - R - 16, cx + R + 78, cy + R - 16), fill=0)
    gold = Image.new("RGBA", (w, h), GOLD + (255,))
    clear = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    img.alpha_composite(Image.composite(gold, clear, mask))
    # 文案
    d = ImageDraw.Draw(img)
    f1 = font(92, bold=True)
    f2 = font(38)
    d.text((94, 196), "升温夜航", font=f1, fill=(247, 241, 255))
    d.text((98, 318), "双人叙事卡牌 · 三幕夜航 · 六种结局", font=f2, fill=(180, 166, 201))
    d.text((98, 392), "COUPLE  VOYAGE", font=font(24, bold=True), fill=GOLD)
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
