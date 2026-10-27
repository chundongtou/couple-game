# -*- coding: utf-8 -*-
"""检查提取出来的题库结构/样例，辅助设计新卡牌体系。"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
d = json.loads((ROOT / "app" / "data" / "raw.json").read_text(encoding="utf-8"))


def show(name, v, n=3):
    print("\n===", name, "===")
    if isinstance(v, dict):
        for k, vv in v.items():
            if isinstance(vv, list):
                print("  %s: list[%d] sample: %s" % (k, len(vv), [str(x)[:40] for x in vv[:2]]))
            elif isinstance(vv, dict):
                print("  %s: dict keys=%s" % (k, list(vv.keys())[:8]))
                for k2, v2 in list(vv.items())[:2]:
                    print("     %s -> %s: %s" % (k2, type(v2).__name__, (str(v2)[:120])))
            else:
                print("  %s: %s" % (k, type(vv).__name__))
    elif isinstance(v, list):
        print("  list[%d] sample: %s" % (len(v), [str(x)[:60] for x in v[:n]]))
        if v and isinstance(v[0], dict):
            print("  first item keys:", list(v[0].keys()))


show("GAMEDATA", d["GAMEDATA"])
show("GAMEDATA.extra", d["GAMEDATA"].get("extra"))
show("GAMEDATA.extra5", d["GAMEDATA"].get("extra5"))
show("HOTEL", d["HOTEL"])
show("V11_GENTLE_ALT", d["V11_GENTLE_ALT"])
show("V11_WIND_DOWN", d["V11_WIND_DOWN"])
show("BLIND_NIGHT", d["BLIND_NIGHT"])
show("EVO_ADDONS", d["EVO_ADDONS"])
show("V12_ACH", d["V12_ACH"])
show("TOUCH sample", {"parts": d["TOUCH_PARTS"], "acts": d["TOUCH_ACTS"], "durs": d["TOUCH_DURS"]})
show("PAIR_PARTS", d["PAIR_PARTS"])
show("KISS_POOL", d["KISS_POOL"])
