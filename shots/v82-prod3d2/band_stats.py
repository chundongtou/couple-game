# -*- coding: utf-8 -*-
"""V8.2 3D 视觉量化（PIL 侧）：给定截图 + 3D host 区域内两块"空区"矩形，量背景质感而非靠肉眼。

用法:
  python band_stats.py <png> --bands "x,y,w,h;x,y,w,h"      # 设备像素
输出 JSON: 每块空区的 uniqueColors / rowMeanStd / colMeanStd / gradientStep。
平坦纯色 → uniqueColors 极小、std ≈ 0；有织纹/暗角 → uniqueColors 大、std > 1。
"""
import json
import sys
from PIL import Image


def band_stats(im, rect):
    x, y, w, h = rect
    px = im.load()
    cols = {}
    row_means = []
    col_sums = [0.0] * w
    for j in range(y, min(y + h, im.size[1])):
        s = 0.0
        for i in range(x, min(x + w, im.size[0])):
            r, g, b = px[i, j]
            c = (r, g, b)
            cols[c] = cols.get(c, 0) + 1
            v = (r + g + b) / 3.0
            s += v
            col_sums[i - x] += v
        row_means.append(s / max(1, w))
    n = len(row_means) or 1
    rm_mean = sum(row_means) / n
    rm_std = (sum((v - rm_mean) ** 2 for v in row_means) / n) ** 0.5
    cm_mean = sum(col_sums) / max(1, w) / n
    cm_std = (sum((v / n - cm_mean) ** 2 for v in col_sums) / max(1, w)) ** 0.5
    steps = [abs(row_means[i + 1] - row_means[i]) for i in range(len(row_means) - 1)]
    return {
        "rect": [x, y, w, h],
        "uniqueColors": len(cols),
        "topColors": [list(k) + [v] for k, v in sorted(cols.items(), key=lambda kv: -kv[1])[:3]],
        "rowMean": round(rm_mean, 2),
        "rowMeanStd": round(rm_std, 3),
        "colMeanStd": round(cm_std, 3),
        "maxRowStep": round(max(steps), 2) if steps else 0.0,
        "meanRowStep": round(sum(steps) / len(steps), 3) if steps else 0.0,
    }


def main():
    path = sys.argv[1]
    im = Image.open(path).convert("RGB")
    bands = []
    if "--bands" in sys.argv:
        for part in sys.argv[sys.argv.index("--bands") + 1].split(";"):
            bands.append(tuple(int(v) for v in part.split(",")))
    out = {"file": path, "img": list(im.size), "bands": [band_stats(im, b) for b in bands]}
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
