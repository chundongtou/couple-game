# -*- coding: utf-8 -*-
"""V8.2 前后对比：把 table-real 截图裁出 3D host，与新截图一起算"空区平坦度"。

用法: python compare_flat.py
输出 shots/v82-prod3d2/v82/flat-report.json
"""
import json
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(REPO, "shots", "v82-prod3d2", "v82")
BEFORE = os.path.join(REPO, "shots", "v8", "prod3d", "table-real", "R0-overview-390x844.png")


def band(crop, y0, y1, x0, x1):
    """统计一条带里的颜色种类 / 行均值标准差 / 最大行间跳变。"""
    px = crop.load()
    cols = {}
    rows = []
    for y in range(y0, y1):
        s = 0.0
        n = 0
        for x in range(x0, x1, 2):
            c = px[x, y]
            cols[c] = cols.get(c, 0) + 1
            s += (c[0] + c[1] + c[2]) / 3.0
            n += 1
        rows.append(s / max(1, n))
    mean = sum(rows) / max(1, len(rows))
    std = (sum((v - mean) ** 2 for v in rows) / max(1, len(rows))) ** 0.5
    steps = [abs(rows[i + 1] - rows[i]) for i in range(len(rows) - 1)]
    return {
        "uniqueColors": len(cols),
        "mean": round(mean, 2),
        "rowStd": round(std, 3),
        "maxRowStep": round(max(steps), 2) if steps else 0.0,
    }


def report(path, rect, label):
    im = Image.open(path).convert("RGB")
    crop = im.crop(rect) if rect else im
    w, h = crop.size
    # 空区：棋盘上方 0–14%、下方 86–100%（棋盘自身占 ~48%，确保取到纯垫面）
    top = band(crop, 0, int(h * 0.14), 0, w)
    bot = band(crop, int(h * 0.86), h, 0, w)
    left = band(crop, int(h * 0.30), int(h * 0.72), 0, int(w * 0.06))
    return {"label": label, "file": os.path.relpath(path, REPO), "crop": rect,
            "size": [w, h], "topBand": top, "bottomBand": bot, "leftBand": left}


def main():
    rep = []
    # before：780x1688 全页 → 裁 host（24,456,732,1104）
    rep.append(report(BEFORE, (24, 456, 756, 1560), "before-flat-blue"))
    p = os.path.join(OUT, "after-390x844-overview.png")
    if os.path.exists(p):
        rep.append(report(p, None, "after-textured-mat"))
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "flat-report.json"), "w", encoding="utf-8") as f:
        json.dump(rep, f, ensure_ascii=False, indent=1)
    print(json.dumps(rep, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
