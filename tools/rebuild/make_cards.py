# -*- coding: utf-8 -*-
"""从旧题库 raw.json 生成新游戏的卡牌数据 app/src/data/cards.js。

只做"搬运+归类+打星"：不新写露骨内容，全部文本来自旧版现有题库。
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
RAW = ROOT / "app" / "data" / "raw.json"
OUT_JS = ROOT / "app" / "src" / "data" / "cards.js"
OUT_META = ROOT / "app" / "data" / "cards-meta.json"

STRICT = re.compile(
    r"做爱|插入|口交|口爆|自慰|高潮|呻吟|射精|射了|射在|乳房|乳头|肉棒|套弄|抽插|顶到|弄到|"
    r"后入|骑乘|SM|3P|多人|69|下体|私处|穴|骚|浪叫|舔|含住|吮吸|骑上|坐到底|脱光|全裸|裸体|"
    r"束缚|绑住|支配|调教|露出|弄到快|互口|锁在|捆|前戏|情趣|内衣|玩弄|顶到|插|胸|乳|臀|大腿内侧"
)
HARD = re.compile(
    r"做爱|插入|进入|口交|口爆|自慰|高潮|呻吟|射精|射了|射在|乳房|乳|穴|骚|浪叫|后入|骑乘|"
    r"SM|3P|多人|69|玩具|束缚|绑住|按倒|下体|私处|内裤|胸|臀|大腿内侧|求饶|失控|支配|脱光|全裸|裸体|"
    r"用手帮|用手指|用嘴|嘴唇|舌头|坐到底|坐上去|骑上|跨坐|压住|按在|扣住|伸进|摸进|挑逗|撩拨|夹住|夹紧|"
    r"含住|舔|吮吸|吮|咬住"
)
ACTION = re.compile(
    r"亲|吻|抱|搂|摸|揉|舔|含|吮|咬|蹭|按|压|扣|推倒|骑|坐|脱|撩|挑逗|触碰|依偎|贴|抚|捏|蹭|"
    r"手腕|腰|腿|耳|颈|肩|背|脸|额头|头发|手指"
)
EXPLICITISH = re.compile(r"床|浴|镜子|墙|沙发|地板|玄关|厨房|阳台|车内|电梯|内衣|衣服|扣子|拉链|坐到底|坐上去")
SYNC = re.compile(r"互相|一起|十指|对视|配合|同时|双人|共同|轮流|默契|拥抱|牵手|合作|合唱|背靠背|两个人")
INTENSITY = re.compile(r"最想|最疯狂|幻想|羞耻|敏感|支配|命令|必须|不许|挑战|秘密|刺激|敢不敢|大胆|极限|求饶")
LIGHT = re.compile(r"喜欢|第一次|约会|礼物|夸|优点|记得|名字|可爱|开心|愿望|旅行|电影|歌|好吃|早餐|照片|生日|动物|颜色|童年|工作|朋友")
DURATION = re.compile(r"\d+\s*(秒|分钟)|全程|一直|持续")
TAG_RULES = [
    ("蒙眼", re.compile(r"蒙眼|闭上眼睛|遮住眼")),
    ("束缚", re.compile(r"绑|束缚|手铐|领带|绳子|按住|捆")),
    ("道具", re.compile(r"玩具|道具|冰|羽毛|蜡|领带|眼罩")),
    ("露出", re.compile(r"窗|阳台|门|户外|公共|镜子|浴室|厨房|沙发|地板|墙")),
    ("角色", re.compile(r"角色|扮演|主人|宠物|秘书|老板|护士|老师|制服")),
    ("喝酒", re.compile(r"酒|杯|干杯|醉")),
    ("亲密", re.compile(r"亲|吻|抱|搂|摸|舔|含|咬|蹭|贴")),
    ("地点", re.compile(r"床|浴|厨房|沙发|阳台|窗|墙|镜子|车|电梯|地板|户外|公园|泳池|温泉|楼道|楼梯|门口")),
    ("私密", re.compile(r"私处|敏感|身体|内裤|禁区")),
]

TRUTH_SOURCES = [
    ("GAMEDATA.truths", ["GAMEDATA", "truths"]),
    ("DRUNK_TRUTHS", ["DRUNK_TRUTHS"]),
    ("RANK_POOL.truths", ["RANK_POOL", "truths"]),
    ("V14_TRUTHS", ["V14_TRUTHS"]),
    ("GAMEDATA.extra.truths", ["GAMEDATA", "extra", "truths"]),
    ("GAMEDATA.extra5.truths", ["GAMEDATA", "extra5", "truths"]),
    ("flightM.truth", ["GAMEDATA", "flightM", "truth"]),
    ("flightF.truth", ["GAMEDATA", "flightF", "truth"]),
    ("flightD.truth", ["GAMEDATA", "flightD", "truth"]),
]
DARE_SOURCES = [
    ("GAMEDATA.dare", ["GAMEDATA", "dare"]),
    ("RANK_POOL.dare", ["RANK_POOL", "dare"]),
    ("V14_DARE", ["V14_DARE"]),
    ("GAMEDATA.extra.dare", ["GAMEDATA", "extra", "dare"]),
    ("GAMEDATA.extra5.dare", ["GAMEDATA", "extra5", "dare"]),
    ("flightM.dare", ["GAMEDATA", "flightM", "dare"]),
    ("flightF.dare", ["GAMEDATA", "flightF", "dare"]),
]
TOUCH_SOURCES = [
    ("KISS_POOL", ["KISS_POOL"]),
    ("HOTEL.a1", ["HOTEL", "a1"]),
    ("HOTEL.a2", ["HOTEL", "a2"]),
    ("HOTEL.a3", ["HOTEL", "a3"]),
    ("HOTEL.a4", ["HOTEL", "a4"]),
    ("PAIR_PARTS", ["PAIR_PARTS"]),
    ("BLIND_NIGHT", ["BLIND_NIGHT"]),
]
SYNC_SOURCES = [
    ("V11_GENTLE_ALT", ["V11_GENTLE_ALT"]),
    ("V11_WIND_DOWN", ["V11_WIND_DOWN"]),
    ("flightD.dare", ["GAMEDATA", "flightD", "dare"]),
    ("flightD.truth", ["GAMEDATA", "flightD", "truth"]),
]
SPARK_SOURCES = [
    ("V12_SPICY.truths", ["V12_SPICY", "truths"]),
    ("V12_SPICY.dare", ["V12_SPICY", "dare"]),
    ("V14_TOYS", ["V14_TOYS"]),
    ("V14_BOND", ["V14_BOND"]),
    ("V14_SHOW", ["V14_SHOW"]),
]
PUNISH_SOURCES = [
    ("GAMEDATA.punish", ["GAMEDATA", "punish"]),
    ("V14_PUNISH", ["V14_PUNISH"]),
    ("V12_SPICY.punish", ["V12_SPICY", "punish"]),
]


def dig(obj, path):
    cur = obj
    for p in path:
        if not isinstance(cur, dict):
            return []
        cur = cur.get(p)
    return cur if isinstance(cur, list) else []


def clean(t):
    t = str(t or "").strip()
    return re.sub(r"\s+", " ", t)


def norm(t):
    return re.sub(r"[\s\W_]+", "", t.lower())[:120]


def source_boost(src):
    if src.startswith("V14_") or src.startswith("V12_SPICY"):
        return 1
    if src.startswith("GAMEDATA.extra5"):
        return 2
    if src.startswith("GAMEDATA.extra"):
        return 1
    return 0


def score(text, src, kind, old_lv=1):
    s = 1
    hard = bool(HARD.search(text))
    act = bool(ACTION.search(text))
    soft_ctx = bool(EXPLICITISH.search(text))
    if hard:
        s += 2
    elif act:
        s += 1
    if hard and act:
        s += 1
    if INTENSITY.search(text):
        s += 1
    if DURATION.search(text):
        s += 1
    if soft_ctx and (hard or act):
        s += 1
    s += source_boost(src)
    if kind == "spark":
        s += 1
    if LIGHT.search(text) and not hard and not act and not DURATION.search(text):
        s -= 1
    s = max(s, int(old_lv or 1))
    return max(1, min(5, s))


def tags_of(text):
    return [name for name, rx in TAG_RULES if rx.search(text)]


def split_pair(text):
    for sep in ("｜", "|"):
        if sep in text:
            return [x.strip() for x in text.split(sep) if x.strip()]
    return [text]


def main():
    raw = json.loads(RAW.read_text(encoding="utf-8"))
    old_scores = {}
    scores_path = ROOT / "app" / "data" / "scores.json"
    if scores_path.exists():
        old_scores = json.loads(scores_path.read_text(encoding="utf-8"))
    kinds = ("truth", "dare", "touch", "sync", "spark", "punish")
    ID_PREFIX = {"truth": "tr", "dare": "da", "touch": "to", "sync": "sy", "spark": "sp", "punish": "pu"}
    pools = {k: [] for k in kinds}
    gseen = set()
    counter = {k: 0 for k in kinds}
    skipped = 0

    def add(kind, text, src):
        nonlocal skipped
        text = clean(text)
        if len(text) < 4 or len(text) > 120 or "<" in text or ">" in text:
            skipped += 1
            return
        n = norm(text)
        if not n or n in gseen:
            return
        gseen.add(n)
        counter[kind] += 1
        old = old_scores.get(text) or {}
        star = score(text, src, kind, old.get("lv", 1))
        # 尺度门禁：严格露骨词一律 ≥4 星（maxStar=1/2 不会抽到）；spark 全池 ≥4
        if STRICT.search(text):
            star = max(star, 4)
        if kind == "spark":
            star = max(star, 4)
        pools[kind].append({
            "id": "%s%d" % (ID_PREFIX[kind], counter[kind]),
            "text": text,
            "star": star,
            "tags": tags_of(text),
            "src": src,
        })

    # 1) 协作池优先（避免被 truth/dare 去重抢走）
    for src, path in SYNC_SOURCES:
        for t in dig(raw, path):
            if isinstance(t, str):
                for part in split_pair(t):
                    add("sync", part, src)
    # 2) 真心话
    for src, path in TRUTH_SOURCES:
        for t in dig(raw, path):
            if isinstance(t, str):
                add("truth", t, src)
    # 3) 触碰源
    for src, path in TOUCH_SOURCES:
        for t in dig(raw, path):
            if not isinstance(t, str):
                continue
            for part in split_pair(t):
                add("touch", part, src)
    # 4) 大冒险源：强触碰 → touch，其余 dare
    for src, path in DARE_SOURCES:
        for t in dig(raw, path):
            if not isinstance(t, str):
                continue
            for part in split_pair(t):
                oldt = (old_scores.get(part) or {}).get("type", "")
                if oldt == "touch" or (ACTION.search(part) and (HARD.search(part) or EXPLICITISH.search(part))):
                    add("touch", part, src)
                elif SYNC.search(part) and not STRICT.search(part):
                    add("sync", part, src)
                else:
                    add("dare", part, src)
    # 5) 高星特殊 / 惩罚
    for src, path in SPARK_SOURCES:
        for t in dig(raw, path):
            if isinstance(t, str):
                add("spark", t, src)
    for src, path in PUNISH_SOURCES:
        for t in dig(raw, path):
            if isinstance(t, str):
                add("punish", t, src)

    data = {k: sorted(pools[k], key=lambda c: (c["star"], c["id"])) for k in kinds}
    for k in data:
        for i, c in enumerate(data[k]):
            c["id"] = "%s%d" % (ID_PREFIX[k], i + 1)

    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    parts = ["/* 自动生成：tools/rebuild/make_cards.py —— 不要手改 */\nwindow.CARDS = {\n"]
    for k in kinds:
        parts.append("  %s: [\n" % k)
        for c in data[k]:
            parts.append("    " + json.dumps(c, ensure_ascii=False) + ",\n")
        parts.append("  ],\n")
    parts.append("};\n")
    OUT_JS.write_text("".join(parts), encoding="utf-8")

    dist = {k: {} for k in data}
    for k, cards in data.items():
        for c in cards:
            dist[k][str(c["star"])] = dist[k].get(str(c["star"]), 0) + 1
    meta = {
        "total": sum(len(v) for v in data.values()),
        "byType": {k: len(v) for k, v in data.items()},
        "byStar": {k: dict(sorted(v.items())) for k, v in dist.items()},
        "skipped": skipped,
    }
    OUT_META.write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    print("cards.js:", OUT_JS, OUT_JS.stat().st_size, "bytes")
    print(json.dumps(meta, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
