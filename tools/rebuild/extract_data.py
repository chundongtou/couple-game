# -*- coding: utf-8 -*-
"""从旧版（dist/v18，V17 内容基线）提取题库数据到 app/data/raw.json。

做法：用 Playwright 打开真实旧应用（它是单文件自包含），读取全局变量里的题库/池子。
只读提取，不修改任何旧文件。
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "qa"))
from harness import serve  # noqa: E402

DIST = ROOT / "dist" / "v18"
OUT = ROOT / "app" / "data" / "raw.json"
PORT = 8870

# 想要完整导出的全局题库/池子
WANT = [
    "GAMEDATA",
    "GENTLE_KW", "HOT_KW", "LOCAL_KW",
    "DRUNK_TRUTHS", "DRUNK_POOL", "DRUNK_EGGS",
    "RANK_POOL",
    "V12_SPICY",
    "V14_TRUTHS", "V14_DARE", "V14_PUNISH", "V14_TOYS", "V14_BOND", "V14_SHOW",
    "KISS_POOL",
    "TOUCH_PARTS", "TOUCH_ACTS", "TOUCH_DURS", "PAIR_PARTS",
    "HOTEL", "BLIND_NIGHT",
    "EVO_ADDONS", "V11_GENTLE_ALT", "V11_WIND_DOWN",
    "V12_ACH",
]


def main():
    from playwright.sync_api import sync_playwright

    result = {}
    inventory = {}
    if not DIST.exists():
        raise SystemExit("missing dist: %s" % DIST)
    with serve(DIST, port=PORT) as base:
        with sync_playwright() as p:
            b = p.chromium.launch(headless=True)
            ctx = b.new_context(viewport={"width": 390, "height": 844})
            ctx.add_init_script(
                """try{localStorage.setItem('couple-onboarded','1');
                localStorage.setItem('couple-night',JSON.stringify({d:new Date().toDateString()}));}catch(e){}"""
            )
            pg = ctx.new_page()
            pg.goto(base, wait_until="load", timeout=60000)
            pg.wait_for_timeout(1500)
            result = pg.evaluate(
                "(keys)=>{var o={};for(var i=0;i<keys.length;i++){var k=keys[i];try{o[k]=(typeof window[k]!=='undefined')?window[k]:null;}catch(e){o[k]=null;}}return o;}",
                WANT,
            )
            inventory = pg.evaluate(
                """()=>{var out={};
                Object.keys(window).forEach(function(k){
                  if(!/^[A-Z][A-Za-z0-9_]*$/.test(k))return;
                  var v=window[k];
                  if(Array.isArray(v))out[k]={kind:'array',n:v.length};
                  else if(v&&typeof v==='object'&&v.constructor===Object)out[k]={kind:'object',keys:Object.keys(v).length};
                });return out;}"""
            )
            b.close()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    (OUT.parent / "inventory.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=1), encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")
    for k in WANT:
        v = result.get(k)
        if isinstance(v, list):
            print("  %-16s list[%d]" % (k, len(v)))
        elif isinstance(v, dict):
            print("  %-16s object{%s}" % (k, ", ".join("%s:%s" % (kk, len(vv) if isinstance(vv, list) else type(vv).__name__) for kk, vv in v.items())))
        else:
            print("  %-16s %s" % (k, type(v).__name__))


if __name__ == "__main__":
    main()
