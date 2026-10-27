# -*- coding: utf-8 -*-
"""用旧版自带的 v12TaskMeta 分类器，给 raw.json 里所有候选文本打/复核星级。

为什么：旧版作者已经调过一套中文关键词强度分类（lv 1-5 + type）。直接复用比重新写正则准得多。
产物：app/data/scores.json  { "<原文>": {"lv": 3, "type": "dare"} }
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "qa"))
from harness import serve  # noqa: E402

RAW = ROOT / "app" / "data" / "raw.json"
OUT = ROOT / "app" / "data" / "scores.json"
DIST = ROOT / "dist" / "v18"
PORT = 8871


def collect_texts(raw):
    texts = set()

    def walk(v):
        if isinstance(v, str):
            t = v.strip()
            if 4 <= len(t) <= 140 and "<" not in t and ">" not in t:
                texts.add(t)
                for sep in ("｜", "|"):
                    if sep in t:
                        for p in t.split(sep):
                            p = p.strip()
                            if 4 <= len(p) <= 140:
                                texts.add(p)
        elif isinstance(v, list):
            for x in v:
                walk(x)
        elif isinstance(v, dict):
            for x in v.values():
                walk(x)

    walk(raw)
    return sorted(texts)


def main():
    from playwright.sync_api import sync_playwright

    raw = json.loads(RAW.read_text(encoding="utf-8"))
    texts = collect_texts(raw)
    print("candidate texts:", len(texts))
    scores = {}
    with serve(DIST, port=PORT) as base:
        with sync_playwright() as p:
            b = p.chromium.launch(headless=True)
            ctx = b.new_context(viewport={"width": 390, "height": 844})
            ctx.add_init_script("try{localStorage.setItem('couple-onboarded','1');}catch(e){}")
            page = ctx.new_page()
            page.goto(base, wait_until="load", timeout=60000)
            page.wait_for_timeout(1200)
            scores = page.evaluate(
                """(texts)=>{
                  var out={};
                  for(var i=0;i<texts.length;i++){
                    try{var m=v12TaskMeta(texts[i]);out[texts[i]]={lv:m.lv,type:m.type};}catch(e){out[texts[i]]={lv:3,type:'other'};}
                  }
                  return out;}""",
                texts,
            )
            b.close()
    OUT.write_text(json.dumps(scores, ensure_ascii=False), encoding="utf-8")
    from collections import Counter

    c = Counter((v["lv"], v["type"]) for v in scores.values())
    print("wrote", OUT, OUT.stat().st_size, "bytes")
    for (lv, tp), n in sorted(c.items()):
        print("  lv%d %-8s %d" % (lv, tp, n))


if __name__ == "__main__":
    main()
