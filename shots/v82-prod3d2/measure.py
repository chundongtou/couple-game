# -*- coding: utf-8 -*-
"""V8.2 3D 视觉量化：给定一张 table 截图，测量 3D 区（host）里棋盘占宽/上下留白/背景平坦度。

用法: python measure.py <png> [--host-x 12 --host-y 228 --host-w 366 --host-h 552]
不带坐标时按 390x844 的 table-real 口径（host 12,228,366,552，设备像素比 2）。
输出 JSON：boardFracW / gapTop / gapBot / 背景唯一色数 / 行均值抖动。
"""
import json
import sys
from PIL import Image


def host_rect(w, h, dpr=2.0):
    """table-real 390x844：host 366x552 @ (12,228)。按比例估其它宽度。"""
    scale = w / 390.0
    x = 12 * scale
    hw = 366 * scale
    y = 228 * scale
    hh = 552 * scale
    return x * dpr, y * dpr, hw * dpr, hh * dpr


def analyze(path, rect=None):
    im = Image.open(path).convert("RGB")
    W, H = im.size
    dpr = W / 390.0
    hx, hy, hw, hh = rect or host_rect(W, H, 1.0)
    hx, hy = int(hx), int(hy)
    hw, hh = int(hw), int(hh)
    px = im.load()

    # 1) 找棋盘（非背景）的垂直范围：找每行里"很暗的盘面/彩色格"占比
    #    背景=桌面垫面（蓝/紫/棕），盘面比背景暗且饱和；用亮度差+彩色像素判断
    rows = []
    for y in range(hy, hy + hh):
        n_col = 0
        s = 0
        for x in range(hx, hx + hw, 2):
            r, g, b = px[x, y]
            mx, mn = max(r, g, b), min(r, g, b)
            s += (r + g + b) / 3.0
            if mx - mn > 14 or (r + g + b) / 3.0 > 120:   # 彩色格 / 亮格 / 金色
                n_col += 1
        rows.append((y, s / (hw / 2.0), n_col / (hw / 2.0)))
    # 棋盘 = 连续出现"彩色/亮"像素占比 > 8% 的行段（最长段）
    best = (0, 0)
    cur = None
    for y, mean, frac in rows:
        if frac > 0.06:
            if cur is None:
                cur = [y, y]
            else:
                cur[1] = y
        else:
            if cur and (cur[1] - cur[0]) > (best[1] - best[0]):
                best = (cur[0], cur[1])
            cur = None
    if cur and (cur[1] - cur[0]) > (best[1] - best[0]):
        best = (cur[0], cur[1])
    top, bot = best
    board_h = bot - top + 1

    # 2) 横向：在棋盘行段内找彩色/亮像素的左右边界
    xs = []
    for y in range(top, bot + 1, 2):
        for x in range(hx, hx + hw):
            r, g, b = px[x, y]
            mx, mn = max(r, g, b), min(r, g, b)
            if mx - mn > 14 or (r + g + b) / 3.0 > 120:
                xs.append(x)
    left = min(xs) if xs else hx
    right = max(xs) if xs else hx + hw

    # 3) 背景平坦度：取 host 顶部 6% 与底部 6% 的垫面区域，统计"每行均值"的抖动量
    def band(p0, p1):
        vals = []
        for y in range(int(hy + hh * p0), int(hy + hh * p1)):
            s = 0
            n = 0
            for x in range(hx, hx + hw, 4):
                r, g, b = px[x, y]
                s += (r + g + b) / 3.0
                n += 1
            vals.append(s / n)
        return vals
    tb = band(0.0, 0.06)
    bb = band(0.94, 1.0)
    uniq = len(set(round(v, 1) for v in tb + bb))

    return {
        "file": path,
        "img": [W, H],
        "host": [hx, hy, hw, hh],
        "board": {"top": top, "bottom": bot, "pxH": board_h,
                  "pxW": right - left + 1, "left": left, "right": right,
                  "fracW": round((right - left + 1) / float(hw), 4)},
        "gapTopPx": round((top - hy) / dpr, 1),
        "gapBotPx": round((hy + hh - bot) / dpr, 1),
        "gapTopPct": round((top - hy) / float(hh), 4),
        "gapBotPct": round((hy + hh - bot) / float(hh), 4),
        "bandRowMeansTopFirstLast": [round(tb[0], 1), round(tb[-1], 1)] if tb else None,
        "bandRowMeansBotFirstLast": [round(bb[0], 1), round(bb[-1], 1)] if bb else None,
        "bgLevelsUnique": uniq,
    }


def _arg(name, default=None):
    a = sys.argv
    return type(default)(a[a.index(name) + 1]) if name in a else default


if __name__ == "__main__":
    p = sys.argv[1]
    rect = None
    if "--host-w" in sys.argv:
        rect = (_arg("--host-x", 0), _arg("--host-y", 0),
                _arg("--host-w", 0), _arg("--host-h", 0))
    out = analyze(p, rect)
    print(json.dumps(out, ensure_ascii=False, indent=1))
