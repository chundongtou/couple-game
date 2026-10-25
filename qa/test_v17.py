#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""D2 · V17 扩展包验收（默契大考验 A / 回忆册 B / PWA C / 回归 D / 横切 E）

用法:
  python qa/test_v17.py                      # 全量（约 5-8 分钟）
  python qa/test_v17.py --only a,b           # 只跑部分分组 (a,b,c,d,e)
  python qa/test_v17.py --dist dist          # 指定被测静态目录（默认 qa/_v17_build）

被测物: 默认 qa/_v17_build（= python tools/build.py --out qa/_v17_build 产物），
        main() 会与 dist/index.html 做 SHA256 对比并写入报告数据，证明测的就是集成产物。

产物:
  reports/v17-qa-data.json                   # 结构化数据（报告引用）
  reports/v17-smoke.json                     # 29 个旧玩法回归冒烟（D 组输出）
  reports/screenshots/v17/**/*.png           # 证据截图

纪律: 每个分组全新 browser context；默认 seed（couple-onboarded/couple-night）抑制开场弹窗。
"""
import argparse
import hashlib
import json
import pathlib
import re
import struct
import sys
import time

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))
import harness as H  # noqa: E402

SHOTS = H.SHOTS / "v17"
for _sub in ("", "moqi", "memory", "pwa", "theme", "viewport", "regression", "misc"):
    (SHOTS / _sub).mkdir(parents=True, exist_ok=True)
TMP = HERE / "_v17_tmp"
TMP.mkdir(exist_ok=True)
REPORTS = H.REPORTS
OUT_JSON = REPORTS / "v17-qa-data.json"
SMOKE_JSON = REPORTS / "v17-smoke.json"
BUILD = HERE / "_v17_build"
BASELINE_JSON = REPORTS / "baseline-audit-data.json"
SEED_JS = (
    "try{localStorage.setItem('couple-onboarded','1');"
    "if(!localStorage.getItem('couple-night'))"
    "localStorage.setItem('couple-night',JSON.stringify({d:new Date().toDateString()}));}catch(e){}"
)

DEFAULT_NAMES = ("他", "她")


# ---------------------------------------------------------------- 基础设施
class Rec:
    def __init__(self):
        self.checks = []
        self.issues = []
        self.observations = []
        self.evidence = {}

    def check(self, gid, cid, name, ok, detail="", data=None):
        c = {"group": gid, "id": cid, "name": name, "ok": bool(ok), "detail": str(detail or "")}
        if data is not None:
            c["data"] = data
        self.checks.append(c)
        print("  %s [%s] %s%s" % ("PASS" if ok else "FAIL", cid, name,
                                  "" if ok or not detail else " | " + str(detail)[:200]))
        return c

    def issue(self, severity, title, detail, repro, shot=None, suggestion="", gid=""):
        it = {"group": gid, "severity": severity, "title": title, "detail": detail,
              "repro": repro, "shot": shot, "suggestion": suggestion}
        self.issues.append(it)
        print("  [ISSUE %s] %s" % (severity, title))
        return it

    def note(self, text, data=None):
        o = {"text": text}
        if data is not None:
            o["data"] = data
        self.observations.append(o)

    def ev(self, key, value):
        self.evidence[key] = value


R = Rec()
SHOTS_TAKEN = []
SEEN = {"A": set(), "B": set(), "C": set()}


def see(pb, gid):
    """收集当前页面的 data-t 选择器（用于 SPEC 选择器清单核对）。"""
    try:
        sels = js(pb, "()=>Array.prototype.map.call(document.querySelectorAll('[data-t]'),function(e){return e.getAttribute('data-t')})")[0] or []
        SEEN[gid].update(sels)
    except Exception:
        pass


def rel(p):
    if not p:
        return None
    try:
        return str(pathlib.Path(p).resolve().relative_to(ROOT)).replace("\\", "/")
    except Exception:
        return str(p)


def shot(pb, name):
    p = H.shot(pb, "v17/" + name)
    if p:
        SHOTS_TAKEN.append(p)
    return rel(p)


def open_pb(browser, base, viewport=(390, 844), mobile=None, seed=True, settle=1100,
            dismiss=True, init_scripts=None):
    if mobile is None:
        mobile = viewport[0] < 800
    ctx = browser.new_context(
        viewport={"width": viewport[0], "height": viewport[1]},
        device_scale_factor=3 if mobile else 1,
        is_mobile=mobile, has_touch=mobile,
        locale="zh-CN", timezone_id="Asia/Shanghai", color_scheme="dark",
        accept_downloads=True,
    )
    if seed:
        ctx.add_init_script(SEED_JS)
    for s in (init_scripts or []):
        ctx.add_init_script(s)
    page = ctx.new_page()
    logs = {"console": [], "errors": [], "http": [], "failed": []}
    page.on("console", lambda m: logs["console"].append({"type": m.type, "text": m.text})
            if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: logs["errors"].append("%s: %s" % (type(e).__name__, e)))
    page.on("response", lambda r: logs["http"].append({"status": r.status, "url": r.url})
            if r.status >= 400 else None)
    page.on("requestfailed", lambda r: logs["failed"].append(
        {"url": r.url, "failure": str(r.failure)}))
    pb = H.PageBundle(ctx, page, logs)
    pb.page.goto(base, wait_until="load", timeout=40000)
    if settle:
        pb.page.wait_for_timeout(settle)
    if dismiss:
        H.dismiss_overlays(pb)
        pb.page.wait_for_timeout(150)
    return pb


NOISE = ("Failed to load resource", "net::ERR", "ERR_FAILED", "Failed to load",
         "net::ERR_INTERNET_DISCONNECTED", "net::ERR_NETWORK_CHANGED")


def clear(pb):
    for k in ("console", "errors", "http", "failed"):
        pb.logs[k].clear()


def take(pb):
    t = {"pageerrors": list(pb.logs["errors"]), "console": list(pb.logs["console"]),
         "http": list(pb.logs["http"]), "failed": list(pb.logs["failed"])}
    t["console_app"] = [c for c in t["console"] if not any(x in c["text"] for x in NOISE)]
    t["console_res"] = [c for c in t["console"] if any(x in c["text"] for x in NOISE)]
    return t


STATE_JS = """()=>{
  var act=function(id){var e=document.getElementById(id);return !!(e&&(' '+e.className+' ').indexOf(' active ')>=0)};
  var mm=document.getElementById('modalMask');
  var sheet=document.getElementById('v17MemSheet');
  return {home:act('homePage'),game:act('gamePage'),
    tiles:document.querySelectorAll('.v12-tiles .v12-tile').length,
    modalShown:!!(mm&&(' '+mm.className+' ').indexOf(' show ')>=0),
    sheetOn:!!(sheet&&(' '+sheet.className+' ').indexOf(' on ')>=0),
    docW:document.documentElement.scrollWidth,innerW:innerWidth,
    bodyOverflow:document.body.style.overflow,
    gKids:(document.getElementById('gContent')||{children:[]}).children.length,
    gTitle:(document.getElementById('gTitle')||{}).textContent||''};
}"""


def js(pb, code, arg=None):
    try:
        return (pb.page.evaluate(code) if arg is None else pb.page.evaluate(code, arg)), None
    except Exception as e:
        return None, str(e)


def state(pb):
    return js(pb, STATE_JS)[0] or {}


def modal(pb):
    return js(pb, """()=>{var m=document.getElementById('modalMask'),b=document.getElementById('modalBox');
      return {shown:!!(m&&(' '+m.className+' ').indexOf(' show ')>=0),
        text:b?(b.innerText||'').replace(/\\s+/g,' ').slice(0,600):'',
        h3:(b&&b.querySelector('h3'))?b.querySelector('h3').textContent:''};}""")[0] or {}


def close_modal(pb):
    js(pb, "try{closeModal()}catch(e){}")
    pb.page.wait_for_timeout(80)


def text_of(pb, sel):
    return js(pb, "(document.querySelector(%r)||{}).innerText||''" % sel)[0] or ""


def go_home(pb):
    js(pb, "try{closeModal()}catch(e){};try{v17MoqiStop&&v17MoqiStop()}catch(e){};try{goHome()}catch(e){}")
    pb.page.wait_for_timeout(280)
    H.dismiss_overlays(pb)


def ok_no_err(pb, t=None):
    t = t or take(pb)
    return not t["pageerrors"] and not t["console_app"], t


def click(pb, sel, timeout=4000):
    try:
        pb.page.click(sel, timeout=timeout)
        pb.page.wait_for_timeout(180)
        return True
    except Exception:
        return False


def click_text(pb, text, scope="#gContent"):
    for sel in ("%s button:has-text('%s')" % (scope, text), "*:has-text('%s')" % text):
        try:
            pb.page.click(sel, timeout=1500)
            pb.page.wait_for_timeout(200)
            return True
        except Exception:
            continue
    return False


def ls_get(pb, key):
    return js(pb, "JSON.parse(localStorage.getItem(%r)||'null')" % key)[0]


def ls_raw(pb, key):
    return js(pb, "localStorage.getItem(%r)" % key)[0]


def ls_keys(pb):
    return js(pb, """()=>{var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k)o.push(k);}return o;}""")[0] or []


def set_ls(pb, key, value):
    js(pb, "localStorage.setItem(%r, %r)" % (key, value))


def wait_sw_ready(pb, timeout=15000):
    return js(pb, """async (timeout)=>{
      if(!('serviceWorker' in navigator)) return {ok:false, reason:'unsupported'};
      try{
        var reg = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise(function(_,rej){setTimeout(function(){rej(new Error('timeout'))}, timeout)})
        ]);
        return {ok:true, scope:reg.scope, active:!!reg.active,
          state:reg.active?reg.active.state:'', controller:!!navigator.serviceWorker.controller};
      }catch(e){ return {ok:false, reason:String(e)} }
    }""", timeout)[0] or {}


def wait_controller(pb, timeout=6000):
    waited = 0
    while waited < timeout:
        c = js(pb, "!!(navigator.serviceWorker&&navigator.serviceWorker.controller)")[0]
        if c:
            return True
        pb.page.wait_for_timeout(250)
        waited += 250
    return False


def png_size(path):
    try:
        p = pathlib.Path(path)
        if not p.exists():
            return None
        data = p.read_bytes()
        if data[:8] != b"\x89PNG\r\n\x1a\n":
            return None
        w, h = struct.unpack(">II", data[16:24])
        return {"w": w, "h": h, "bytes": len(data)}
    except Exception:
        return None


def sha256(path):
    try:
        return hashlib.sha256(pathlib.Path(path).read_bytes()).hexdigest().upper()
    except Exception:
        return None


def strip_comments(txt):
    """粗略去掉 JS/CSS 注释（用于 ES5 语法静态扫描，避免注释里的 ?. 误报）。"""
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.S)
    txt = re.sub(r"//[^\n]*", "", txt)
    return txt


_DIALOG_BOXES = {}


def new_dialog(pb):
    """注册一次性 dialog 处理器；用 accept/dismiss 控制。返回 box（含 handler）。

    每次注册前会移除同一 page 上未触发的旧 handler，避免串场。
    """
    old = _DIALOG_BOXES.pop(id(pb), None)
    if old:
        try:
            pb.page.remove_listener("dialog", old["handler"])
        except Exception:
            pass
    box = {"events": [], "handler": None}

    def handler(d):
        box["events"].append({"type": d.type, "message": d.message})
        if box.get("action") == "dismiss":
            d.dismiss()
        else:
            d.accept(box.get("text"))

    box["handler"] = handler
    _DIALOG_BOXES[id(pb)] = box
    pb.page.once("dialog", handler)
    return box


def drop_dialog(pb, box):
    try:
        pb.page.remove_listener("dialog", box.get("handler"))
    except Exception:
        pass
    _DIALOG_BOXES.pop(id(pb), None)


# ================================================================ A · 默契大考验
def _moqi_entry(pb):
    """从大厅打开 moqi 入口页；返回是否成功。"""
    go_home(pb)
    if not click(pb, '[data-t="moqi-hero-card"]', 4000):
        js(pb, "try{startGame('moqi')}catch(e){}")
        pb.page.wait_for_timeout(400)
    pb.page.wait_for_timeout(300)
    return bool(js(pb, "!!document.querySelector('[data-t=\"moqi-entry\"]')")[0])


def _enter_heart(pb, total):
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(350)
    if not click(pb, '[data-t="moqi-mode-heart"]'):
        return False
    if not click(pb, '[data-t="moqi-rounds-%d"]' % total):
        return False
    return click(pb, '[data-t="moqi-start"]')


def _enter_guess(pb, dur=60, desc="him"):
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(350)
    if not click(pb, '[data-t="moqi-mode-guess"]'):
        return False
    if not click(pb, '[data-t="guess-dur-%d"]' % dur):
        return False
    if not click(pb, '[data-t="guess-desc-%s"]' % desc):
        return False
    return click(pb, '[data-t="moqi-start"]')


def play_heart(pb, total, hits_pattern, collect=None):
    """完整走完一局心有灵犀；hits_pattern(i) -> bool 是否命中。返回统计。"""
    if not _enter_heart(pb, total):
        return {"error": "无法进入心有灵犀 setup"}
    see(pb, "A")
    info = {"total": total, "hits": 0, "turns": [], "turn_full": [], "verdicts": [], "pct": None}
    for i in range(total):
        play = js(pb, """()=>{var w=document.querySelector('[data-t="moqi-heart-play"]');
          var t=document.querySelector('[data-t="moqi-heart-guess"]');
          if(w){var b=w.querySelector('.mq-turn');return {phase:'answer',who:(b&&b.querySelector('b'))?b.querySelector('b').textContent:'',full:b?b.innerText:''};}
          if(t){var b2=t.querySelector('.mq-turn');return {phase:'guess',who:(b2&&b2.querySelector('b'))?b2.querySelector('b').textContent:'',full:b2?b2.innerText:''};}
          return {phase:'other'};}""")[0] or {}
        if play.get("phase") != "answer":
            info["error"] = "第 %d 题不是作答阶段: %s" % (i + 1, play)
            return info
        info["turns"].append(play.get("who"))
        info["turn_full"].append((play.get("full") or "").replace("\n", " "))
        see(pb, "A")
        ans = i % 4
        if not click(pb, '[data-t="moqi-opt-%d"]' % ans):
            info["error"] = "第 %d 题作答点击失败" % (i + 1)
            return info
        see(pb, "A")
        expect_hit = bool(hits_pattern(i))
        guess = ans if expect_hit else (ans + 1) % 4
        if not click(pb, '[data-t="moqi-opt-%d"]' % guess):
            info["error"] = "第 %d 题猜选点击失败" % (i + 1)
            return info
        see(pb, "A")
        rv = js(pb, """()=>{var e=document.querySelector('[data-t="moqi-heart-reveal"]');
          return e?e.innerText.replace(/\\s+/g,' '):'';}""")[0] or ""
        hit = "心有灵犀" in rv and "差一点点" not in rv
        if hit != expect_hit:
            info["error"] = "第 %d 题判定异常: expect_hit=%s reveal=%r" % (i + 1, expect_hit, rv)
            return info
        if hit:
            info["hits"] += 1
            info["verdicts"].append("hit")
        else:
            info["verdicts"].append("miss")
        if not click(pb, '[data-t="moqi-next"]'):
            info["error"] = "第 %d 题 next 点击失败" % (i + 1)
            return info
    see(pb, "A")
    res = js(pb, """()=>{var r=document.querySelector('[data-t="moqi-result"]');
      if(!r)return {shown:false};
      var pct=(r.querySelector('.mq-pct')||{}).textContent||'';
      var sub=(r.querySelector('.mq-sub2')||{}).innerText||'';
      return {shown:true,pct:pct,sub:sub.replace(/\\s+/g,' '),
        text:r.innerText.replace(/\\s+/g,' ').slice(0,500)};}""")[0] or {}
    info["result"] = res
    if res.get("shown"):
        m = re.search(r"(\d+)%", res.get("pct") or "")
        info["pct"] = int(m.group(1)) if m else None
    return info


def group_a(browser, base, res):
    gid = "A"
    print("\n=== A · 默契大考验 ===")
    pb = open_pb(browser, base)
    a = {}
    t_load = take(pb)
    see(pb, "A")

    # A1 注册：GAMES 30 项含 moqi；首页第 5 张主角卡
    ids = js(pb, "GAMES.map(function(g){return g.id})")[0] or []
    home_tiles = js(pb, """()=>Array.prototype.map.call(document.querySelectorAll('.v12-tiles .v12-tile'),function(e){
      return {t:(e.getAttribute('data-t')||''),txt:(e.innerText||'').replace(/\\s+/g,' ').trim(),
        oc:(e.getAttribute('onclick')||'')};})""")[0] or []
    moqi_tile = [x for x in home_tiles if x.get("t") == "moqi-hero-card"]
    a["games_total"] = len(ids)
    a["hero_tiles"] = home_tiles
    R.check(gid, "A1", "GAMES 注册 moqi（共 30 项）", "moqi" in ids and len(ids) == 30,
            "GAMES=%d ids=%s" % (len(ids), ids[-3:]), {"total": len(ids), "has_moqi": "moqi" in ids})
    R.check(gid, "A1b", "首页第 5 张主角卡 = 默契大考验", len(moqi_tile) == 1,
            "tiles=%s" % [x.get("txt") for x in home_tiles], home_tiles)
    R.check(gid, "A1c", "首页共 6 张主角卡（4 原有 + 默契 + 回忆册）", len(home_tiles) == 6,
            "tiles=%d %s" % (len(home_tiles), [x.get("t") for x in home_tiles]))
    R.ev("home_tiles", home_tiles)

    # A2 主页卡点击进入入口页
    clear(pb)
    entered = _moqi_entry(pb)
    st = state(pb)
    t = take(pb)
    R.check(gid, "A2", "点击主角卡进入默契入口页（#gContent data-t=moqi-entry）",
            entered and st.get("game") and not t["pageerrors"],
            "entered=%s game=%s errors=%s" % (entered, st.get("game"), t["pageerrors"][:2]))
    shot(pb, "moqi/entry-390x844")
    see(pb, "A")
    entry = js(pb, """()=>{var e=document.querySelector('[data-t="moqi-entry"]');
      return {modes:Array.prototype.map.call(document.querySelectorAll('[data-t^="moqi-mode-"]'),function(x){return x.getAttribute('data-t')}),
        archive:Array.prototype.map.call(document.querySelectorAll('.mq-arc'),function(x){return x.innerText.replace(/\\s+/g,' ')}),
        rules:!!document.querySelector('.mq-rules')};}""")[0] or {}
    R.check(gid, "A2b", "入口页含 2 个玩法卡 + 默契档案 4 格 + 规则折叠",
            (entry.get("modes") or []) == ["moqi-mode-heart", "moqi-mode-guess"]
            and len(entry.get("archive") or []) == 4 and entry.get("rules") is True,
            "entry=%s" % json.dumps(entry, ensure_ascii=False)[:240], entry)
    # A2c 首次进入 setup 的默认题数 = 8
    click(pb, '[data-t="moqi-mode-heart"]')
    pb.page.wait_for_timeout(250)
    see(pb, "A")
    first_on = js(pb, """()=>{var xs=document.querySelectorAll('[data-t^="moqi-rounds-"]');
      return Array.prototype.filter.call(xs,function(x){return (' '+x.className+' ').indexOf(' on ')>=0})
        .map(function(x){return x.getAttribute('data-t')});}""")[0] or []
    R.check(gid, "A2c", "心有灵犀 setup 首次进入默认 8 题", first_on == ["moqi-rounds-8"],
            "on=%s" % first_on)
    click(pb, '[data-t="moqi-back"]')
    pb.page.wait_for_timeout(200)

    # A3 从「全部玩法」网格进入（GAMES 卡片）
    go_home(pb)
    click(pb, "#v12MoreBtn")
    pb.page.wait_for_timeout(300)
    grid_ok = click(pb, '[data-t="moqi-grid-card"]')
    pb.page.wait_for_timeout(350)
    st = state(pb)
    R.check(gid, "A3", "「全部玩法」网格 moqi 卡片可进入", grid_ok and st.get("game"),
            "click=%s game=%s gTitle=%r" % (grid_ok, st.get("game"), st.get("gTitle")))
    entry2 = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-entry\"]')")[0])
    R.check(gid, "A3b", "网格入口同样落到 moqi 入口页", entry2)

    # A4 帮助弹窗显示 RULES.moqi
    clear(pb)
    js(pb, "try{showRules('moqi')}catch(e){}")
    pb.page.wait_for_timeout(250)
    m = modal(pb)
    rules = js(pb, "RULES.moqi")[0] or ""
    R.check(gid, "A4", "? 帮助弹窗显示 RULES.moqi", m.get("shown") and "心有灵犀" in (m.get("text") or "")
            and "你说我猜" in (m.get("text") or ""),
            "h3=%r rules_len=%d modal=%r" % (m.get("h3"), len(rules), (m.get("text") or "")[:80]))
    shot(pb, "moqi/help-390x844")
    close_modal(pb)

    # A5 心有灵犀 5 题：完整对局 + 角色交替 + 计分
    coin0 = js(pb, "coinGet()")[0]
    heat0 = js(pb, "getHeat()")[0]
    party0 = ls_get(pb, "couple-party") or {}
    info5 = play_heart(pb, 5, lambda i: i % 2 == 0)  # 3 hits / 5
    coin1 = js(pb, "coinGet()")[0]
    heat1 = js(pb, "getHeat()")[0]
    party1 = ls_get(pb, "couple-party") or {}
    moqi_store = ls_get(pb, "couple-moqi") or {}
    a["heart5"] = info5
    exp_pct = round(3 / 5 * 100)
    R.check(gid, "A5", "心有灵犀 5 题完整对局（命中 3/5，60%）",
            not info5.get("error") and info5.get("hits") == 3 and info5.get("pct") == exp_pct
            and "3 / 5" in (info5.get("result", {}).get("sub") or ""),
            json.dumps(info5.get("result"), ensure_ascii=False)[:220], info5.get("result"))
    if info5.get("error"):
        R.issue("P0", "心有灵犀 5 题对局中断", info5["error"], "startGame('moqi')→心有灵犀→5题→逐步点击选项", gid=gid)
    R.check(gid, "A5b", "两人角色交替正确且题干显示双方姓名（第1题他答她猜、第2题她答他猜）",
            (info5.get("turns") or [])[:2] == [DEFAULT_NAMES[0], DEFAULT_NAMES[1]]
            and all(n in (info5.get("turn_full") or [""])[0] for n in DEFAULT_NAMES),
            "turns=%s turn0=%r" % ((info5.get("turns") or [])[:4], (info5.get("turn_full") or [""])[0][:80]))
    R.check(gid, "A5c", "结算亲密币 +命中数（+3）", (coin1 - coin0) == 3, "coin %s→%s" % (coin0, coin1))
    R.check(gid, "A5d", "热度 +1 且本晚战报 tasks 增加", (heat1 - heat0) == 1
            and (party1.get("tasks") or 0) > (party0.get("tasks") or 0),
            "heat %s→%s party.tasks %s→%s" % (heat0, heat1, party0.get("tasks"), party1.get("tasks")))
    R.check(gid, "A5e", "结算写入 couple-moqi（heart.last=60, plays=1, rounds=5, hits=3）",
            (moqi_store.get("heart") or {}).get("last") == exp_pct
            and moqi_store.get("plays") == 1
            and (moqi_store.get("heart") or {}).get("rounds") == 5
            and (moqi_store.get("heart") or {}).get("hits") == 3,
            "couple-moqi=%s" % json.dumps(moqi_store, ensure_ascii=False)[:260])
    # A5f 结算写入「本局记录」
    slog = js(pb, "()=>(window._sessionLog||[]).map(function(e){return String(e.x);})")[0] or []
    R.check(gid, "A5f", "结算写入本局记录（📜 侧栏 _sessionLog 含心有灵犀条目）",
            any("心有灵犀" in x for x in slog), "log=%s" % json.dumps(slog[:3], ensure_ascii=False))
    shot(pb, "moqi/heart-result-5-390x844")

    # A6 8 题全中：100% → 灵魂伴侣
    go_home(pb)
    coin0 = js(pb, "coinGet()")[0]
    info8 = play_heart(pb, 8, lambda i: True)
    coin1 = js(pb, "coinGet()")[0]
    a["heart8"] = info8
    res_text = (info8.get("result") or {}).get("text") or ""
    R.check(gid, "A6", "心有灵犀 8 题全中：100% + 🔥 灵魂伴侣 + 亲密币 +8",
            not info8.get("error") and info8.get("hits") == 8 and info8.get("pct") == 100
            and "灵魂伴侣" in res_text and (coin1 - coin0) == 8,
            "result=%r coinΔ=%s" % (res_text[:140], coin1 - coin0))
    shot(pb, "moqi/heart-result-8-390x844")
    see(pb, "A")

    # A6b 结算页按钮「再来一轮」可开新一轮
    replay_ok = click(pb, '[data-t="moqi-replay"]')
    pb.page.wait_for_timeout(450)
    new_play = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-heart-play\"]')")[0])
    R.check(gid, "A6b", "心有灵犀结算「🔁 再来一轮」开启新一轮", replay_ok and new_play,
            "click=%s new_play=%s" % (replay_ok, new_play))
    js(pb, "try{panelReset()}catch(e){}")
    pb.page.wait_for_timeout(300)

    # A7 10 题全错：0% → 还需要多聊聊
    go_home(pb)
    coin0 = js(pb, "coinGet()")[0]
    info10 = play_heart(pb, 10, lambda i: False)
    coin1 = js(pb, "coinGet()")[0]
    a["heart10"] = info10
    res_text = (info10.get("result") or {}).get("text") or ""
    R.check(gid, "A7", "心有灵犀 10 题全错：0% + 🌱 还需要多聊聊 + 亲密币 +0",
            not info10.get("error") and info10.get("hits") == 0 and info10.get("pct") == 0
            and "还需要多聊聊" in res_text and (coin1 - coin0) == 0,
            "result=%r coinΔ=%s" % (res_text[:140], coin1 - coin0))
    best = (ls_get(pb, "couple-moqi") or {}).get("heart", {}).get("best")
    R.check(gid, "A7b", "档案最高默契度保留历史最佳（100%）", best == 100, "heart.best=%s" % best)
    # A7c 入口页「默契档案」展示历史最佳/累计局数
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(350)
    arcs = js(pb, """()=>Array.prototype.map.call(document.querySelectorAll('.mq-arc'),function(e){
      return e.innerText.replace(/\\s+/g,' ').trim();})""")[0] or []
    a["archive_after_3_plays"] = arcs
    R.check(gid, "A7c", "入口页默契档案：最高默契度 100%、累计 3 局",
            len(arcs) == 4 and "100%" in arcs[0] and "3 局" in arcs[2],
            "archive=%s" % json.dumps(arcs, ensure_ascii=False))
    see(pb, "A")

    # A7d 段位边界：80%（61-80 → 💞 心有灵犀）与 40%（0-40 → 🌱 还需要多聊聊）
    go_home(pb)
    coin0 = js(pb, "coinGet()")[0]
    info80 = play_heart(pb, 5, lambda i: i < 4)
    coin1 = js(pb, "coinGet()")[0]
    t80 = (info80.get("result") or {}).get("text") or ""
    R.check(gid, "A7d", "心有灵犀 80% → 💞 心有灵犀段位（亲密币 +4）",
            not info80.get("error") and info80.get("pct") == 80 and "心有灵犀" in t80
            and (coin1 - coin0) == 4, "result=%r coinΔ=%s" % (t80[:140], coin1 - coin0))
    shot(pb, "moqi/heart-result-80-390x844")
    go_home(pb)
    coin0 = js(pb, "coinGet()")[0]
    info40 = play_heart(pb, 5, lambda i: i < 2)
    coin1 = js(pb, "coinGet()")[0]
    t40 = (info40.get("result") or {}).get("text") or ""
    R.check(gid, "A7e", "心有灵犀 40% → 🌱 还需要多聊聊段位（亲密币 +2）",
            not info40.get("error") and info40.get("pct") == 40 and "还需要多聊聊" in t40
            and (coin1 - coin0) == 2, "result=%r coinΔ=%s" % (t40[:140], coin1 - coin0))
    go_home(pb)
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(300)

    # A8 题数按钮 5/8/10 可选、点击选中态正确（记忆上次选择属预期）
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(300)
    click(pb, '[data-t="moqi-mode-heart"]')
    pb.page.wait_for_timeout(200)
    seg = js(pb, """()=>{var xs=document.querySelectorAll('[data-t^="moqi-rounds-"]');
      var on=function(){return Array.prototype.filter.call(xs,function(x){return (' '+x.className+' ').indexOf(' on ')>=0})
        .map(function(x){return x.getAttribute('data-t')});};
      return {ids:Array.prototype.map.call(xs,function(x){return x.getAttribute('data-t')}),on0:on()};}""")[0] or {}
    click(pb, '[data-t="moqi-rounds-5"]')
    on5 = js(pb, """()=>Array.prototype.filter.call(document.querySelectorAll('[data-t^="moqi-rounds-"]'),
      function(x){return (' '+x.className+' ').indexOf(' on ')>=0}).map(function(x){return x.getAttribute('data-t')})""")[0]
    click(pb, '[data-t="moqi-rounds-10"]')
    on10 = js(pb, """()=>Array.prototype.filter.call(document.querySelectorAll('[data-t^="moqi-rounds-"]'),
      function(x){return (' '+x.className+' ').indexOf(' on ')>=0}).map(function(x){return x.getAttribute('data-t')})""")[0]
    R.check(gid, "A8", "心有灵犀 setup：5/8/10 题可选且点击选中态正确",
            (seg.get("ids") or []) == ["moqi-rounds-5", "moqi-rounds-8", "moqi-rounds-10"]
            and on5 == ["moqi-rounds-5"] and on10 == ["moqi-rounds-10"],
            "ids=%s on5=%s on10=%s on0=%s" % (seg.get("ids"), on5, on10, seg.get("on0")))
    shot(pb, "moqi/heart-setup-390x844")

    # A9 面板「重置本局」→ 入口页（RESET_MAP.moqi 生效），无残留
    click(pb, '[data-t="moqi-start"]')
    pb.page.wait_for_timeout(300)
    playing = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-heart-play\"]')")[0])
    js(pb, "try{panelReset()}catch(e){}")
    pb.page.wait_for_timeout(300)
    reset_entry = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-entry\"]')")[0])
    R.check(gid, "A9", "面板重置本局 → 回到入口页（RESET_MAP.moqi）",
            playing and reset_entry, "playing=%s reset_entry=%s" % (playing, reset_entry))

    # A9b 你说我猜进行中面板重置 → 入口页 + 计时器清理
    _enter_guess(pb, 60, "him")
    pb.page.wait_for_timeout(350)
    js(pb, "try{panelReset()}catch(e){}")
    pb.page.wait_for_timeout(350)
    g_reset_entry = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-entry\"]')")[0])
    g_stopped = js(pb, "()=>({m:_v17Moqi===null, timer:window._v17Moqi?!!window._v17Moqi.timer:null})")[0] or {}
    R.check(gid, "A9b", "你说我猜进行中「重置本局」→ 入口页且计时器清理",
            g_reset_entry and g_stopped.get("m") is True,
            "entry=%s stopped=%s" % (g_reset_entry, g_stopped))

    # A10 你说我猜 setup：默认 60 秒 + 描述人可选
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(300)
    click(pb, '[data-t="moqi-mode-guess"]')
    pb.page.wait_for_timeout(200)
    gset = js(pb, """()=>{var d=document.querySelectorAll('[data-t^="guess-dur-"]');
      var w=document.querySelectorAll('[data-t^="guess-desc-"]');
      var on=function(xs){return Array.prototype.filter.call(xs,function(x){return (' '+x.className+' ').indexOf(' on ')>=0}).map(function(x){return x.getAttribute('data-t')});};
      return {durs:Array.prototype.map.call(d,function(x){return x.getAttribute('data-t')}),
        onDur:on(d),desc:Array.prototype.map.call(w,function(x){return x.getAttribute('data-t')}),onDesc:on(w)};}""")[0] or {}
    R.check(gid, "A10", "你说我猜 setup：60/90/120 秒可选、默认 60、描述人可选",
            (gset.get("durs") or []) == ["guess-dur-60", "guess-dur-90", "guess-dur-120"]
            and (gset.get("onDur") or []) == ["guess-dur-60"]
            and len(gset.get("desc") or []) == 2,
            "setup=%s" % json.dumps(gset, ensure_ascii=False))
    shot(pb, "moqi/guess-setup-390x844")
    # 90 秒 + 她描述 生效
    click(pb, '[data-t="guess-dur-90"]')
    click(pb, '[data-t="guess-desc-her"]')
    click(pb, '[data-t="moqi-start"]')
    pb.page.wait_for_timeout(400)
    gstate = js(pb, "()=>({total:_v17Moqi?_v17Moqi.total:null,desc:_v17Moqi?_v17Moqi.describer:null})")[0] or {}
    R.check(gid, "A10b", "时长/描述人选择生效（90s / 她描述）",
            gstate.get("total") == 90 and gstate.get("desc") == "her", "state=%s" % gstate)
    word = text_of(pb, '[data-t="guess-word"]')
    timer0 = text_of(pb, '[data-t="guess-timer"]')
    R.check(gid, "A10c", "进行中：词卡大字显示 + 倒计时显示",
            bool(word) and word != "准备…" and timer0.isdigit() and int(timer0) <= 90,
            "word=%r timer=%r" % (word, timer0))
    shot(pb, "moqi/guess-play-390x844")
    see(pb, "A")

    # A11 你说我猜：猜对/跳过计数 + 提前结束 confirm + 结算 + 币上限
    coin0 = js(pb, "coinGet()")[0]
    for _ in range(13):
        js(pb, "try{v17MoqiGuessHit()}catch(e){}")
    for _ in range(2):
        js(pb, "try{v17MoqiGuessSkip()}catch(e){}")
    pb.page.wait_for_timeout(250)
    tally = js(pb, "()=>({hits:_v17Moqi?_v17Moqi.hits:null,skips:_v17Moqi?_v17Moqi.skips:null})")[0] or {}
    R.check(gid, "A11", "猜对/跳过计数正确（13 / 2）",
            tally.get("hits") == 13 and tally.get("skips") == 2, "tally=%s" % tally)
    dlg = new_dialog(pb)
    click(pb, '[data-t="guess-end"]')
    pb.page.wait_for_timeout(700)
    R.check(gid, "A11b", "「换人/结束」弹原生 confirm 可确认",
            any(x["type"] == "confirm" for x in dlg["events"]), "dialogs=%s" % dlg["events"])
    gres = js(pb, """()=>{var r=document.querySelector('[data-t="guess-result"]');
      if(!r)return {shown:false};
      var g=function(t){var e=r.querySelector('[data-t="'+t+'"]');return e?e.textContent:null;};
      return {shown:true,hits:g('guess-result-hits'),skips:g('guess-result-skips'),
        used:g('guess-result-used'),text:r.innerText.replace(/\\s+/g,' ').slice(0,400)};}""")[0] or {}
    coin1 = js(pb, "coinGet()")[0]
    gm = ls_get(pb, "couple-moqi") or {}
    a["guess_result"] = gres
    R.check(gid, "A11c", "结算页：猜对 13 / 跳过 2 / 用时>0",
            gres.get("shown") and gres.get("hits") == "13" and gres.get("skips") == "2"
            and str(gres.get("used")).isdigit() and int(gres.get("used") or 0) > 0,
            "result=%s" % json.dumps(gres, ensure_ascii=False)[:200], gres)
    R.check(gid, "A11d", "结算亲密币 +min(13,12)=+12", (coin1 - coin0) == 12,
            "coin %s→%s" % (coin0, coin1))
    R.check(gid, "A11e", "结算写入 couple-moqi.guess（last=13, duration=90, describer=her）",
            (gm.get("guess") or {}).get("last") == 13
            and (gm.get("guess") or {}).get("duration") == 90
            and (gm.get("guess") or {}).get("describer") == "her",
            "guess=%s" % json.dumps(gm.get("guess"), ensure_ascii=False))
    shot(pb, "moqi/guess-result-390x844")
    see(pb, "A")
    # A11f 结算页「🏠 返回大厅」可用
    home_bt = click(pb, '[data-t="moqi-home"]')
    pb.page.wait_for_timeout(450)
    R.check(gid, "A11f", "你说我猜结算「🏠 返回大厅」回到首页",
            home_bt and bool(state(pb).get("home")), "click=%s home=%s" % (home_bt, state(pb).get("home")))
    # A11g 结算页「🔁 换人再来」开启新一轮并交换描述人
    _enter_guess(pb, 60, "him")
    pb.page.wait_for_timeout(300)
    js(pb, "try{v17MoqiGuessHit()}catch(e){}")
    dlg_r = new_dialog(pb)
    click(pb, '[data-t="guess-end"]')
    pb.page.wait_for_timeout(800)
    replay2 = click(pb, '[data-t="moqi-replay"]')
    pb.page.wait_for_timeout(450)
    gs2 = js(pb, "()=>({mode:_v17Moqi?_v17Moqi.mode:null,desc:_v17Moqi?_v17Moqi.describer:null})")[0] or {}
    R.check(gid, "A11g", "你说我猜结算「🔁 换人再来」开启新一轮并交换描述人（him→her）",
            replay2 and gs2.get("mode") == "guess" and gs2.get("desc") == "her",
            "click=%s state=%s" % (replay2, gs2))
    js(pb, "try{v17MoqiStop()}catch(e){};try{goHome()}catch(e){}")
    pb.page.wait_for_timeout(350)

    # A11h 你说我猜评级分段：8 个 → 💞 心有灵犀；5 个 → 🌤️ 渐入佳境
    tier_cases = []
    for hits_n, want in ((8, "心有灵犀"), (5, "渐入佳境")):
        go_home(pb)
        coin0 = js(pb, "coinGet()")[0]
        _enter_guess(pb, 60, "him")
        pb.page.wait_for_timeout(300)
        js(pb, "for(var i=0;i<%d;i++){try{v17MoqiGuessHit()}catch(e){}}" % hits_n)
        pb.page.wait_for_timeout(150)
        dlg_t = new_dialog(pb)
        click(pb, '[data-t="guess-end"]')
        pb.page.wait_for_timeout(800)
        txt_t = text_of(pb, '[data-t="guess-result"]')
        coin1 = js(pb, "coinGet()")[0]
        ok_t = want in txt_t and (coin1 - coin0) == hits_n
        tier_cases.append({"hits": hits_n, "want": want, "ok": ok_t, "coinΔ": coin1 - coin0})
        R.check(gid, "A11h-%d" % hits_n, "你说我猜 %d 个 → %s（亲密币 +%d）" % (hits_n, want, hits_n),
                ok_t, "coinΔ=%s text=%r" % (coin1 - coin0, txt_t[:120]))
    js(pb, "try{v17MoqiStop()}catch(e){};try{goHome()}catch(e){}")
    pb.page.wait_for_timeout(300)

    # A12 计时结束自动结算（加速 leftMs 后等待 tick）
    go_home(pb)
    ok = _enter_guess(pb, 60, "him")
    pb.page.wait_for_timeout(300)
    js(pb, "try{_v17Moqi.leftMs=900}catch(e){}")
    pb.page.wait_for_timeout(1600)
    auto = js(pb, """()=>{var r=document.querySelector('[data-t="guess-result"]');
      return {shown:!!r, ended:_v17Moqi?_v17Moqi.ended:null, timer:_v17Moqi?_v17Moqi.timer:null,
        text:r?r.innerText.replace(/\\s+/g,' ').slice(0,200):''};}""")[0] or {}
    gm2 = ls_get(pb, "couple-moqi") or {}
    R.check(gid, "A12", "倒计时归零自动结算（无点击）",
            ok and auto.get("shown") and auto.get("ended") is True,
            "entered=%s %s" % (ok, json.dumps(auto, ensure_ascii=False)))
    R.check(gid, "A12b", "自动结算后计时器已清理、档档案 plays+1",
            auto.get("timer") is None and (gm2.get("plays") or 0) >= 3,
            "timer=%s plays=%s" % (auto.get("timer"), gm2.get("plays")))

    # A13 回大厅 / 重置 的计时器清理
    go_home(pb)
    _enter_guess(pb, 60, "him")
    pb.page.wait_for_timeout(300)
    js(pb, "try{v17MoqiStop()}catch(e){};try{goHome()}catch(e){}")
    pb.page.wait_for_timeout(400)
    st = state(pb)
    stopped = js(pb, "()=>({m:_v17Moqi===null})")[0] or {}
    R.check(gid, "A13", "你说我猜中途回大厅：计时器清理、无残留状态",
            st.get("home") and stopped.get("m") is True and not take(pb)["pageerrors"],
            "home=%s stopped=%s" % (st.get("home"), stopped))
    # 再进入不残留上一次状态
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(300)
    fresh = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-entry\"]')")[0])
    R.check(gid, "A13b", "再进入 moqi 不残留上一局状态（回到入口页）", fresh)

    # A13c 切到其它玩法时计时器清理
    _enter_guess(pb, 60, "him")
    pb.page.wait_for_timeout(300)
    js(pb, "try{startGame('dare')}catch(e){}")
    pb.page.wait_for_timeout(450)
    cut = js(pb, "()=>({m:_v17Moqi===null, game:curGame, gKids:(document.getElementById('gContent')||{children:[]}).children.length})")[0] or {}
    R.check(gid, "A13c", "你说我猜进行中切到其它玩法：计时器清理、目标玩法正常",
            cut.get("m") is True and cut.get("game") == "dare" and (cut.get("gKids") or 0) > 0,
            "state=%s" % json.dumps(cut, ensure_ascii=False))
    go_home(pb)
    # A13d 你说我猜进行中面板「重置本局」
    _enter_guess(pb, 60, "him")
    pb.page.wait_for_timeout(300)
    js(pb, "try{panelReset()}catch(e){}")
    pb.page.wait_for_timeout(350)
    d_reset = js(pb, """()=>({m:_v17Moqi===null,
      entry:!!document.querySelector('[data-t="moqi-entry"]')})""")[0] or {}
    R.check(gid, "A13d", "你说我猜进行中「重置本局」→ 入口页且计时器清理",
            d_reset.get("m") is True and d_reset.get("entry") is True,
            "state=%s" % json.dumps(d_reset, ensure_ascii=False))

    # A14 切后台暂停计时
    _enter_guess(pb, 60, "him")
    pb.page.wait_for_timeout(300)
    pause = js(pb, """()=>{try{
      Object.defineProperty(document,'hidden',{configurable:true,get:function(){return true;}});
      document.dispatchEvent(new Event('visibilitychange'));
      var t1=document.querySelector('[data-t="guess-timer"]');
      return {paused:_v17Moqi?_v17Moqi.paused:null, timer:t1?t1.textContent:null,
        toast:(document.getElementById('toast')||{}).textContent||''};
    }catch(e){return {err:String(e)}}}""")[0] or {}
    pb.page.wait_for_timeout(900)
    t2 = text_of(pb, '[data-t="guess-timer"]')
    resume = js(pb, """()=>{try{
      Object.defineProperty(document,'hidden',{configurable:true,get:function(){return false;}});
      document.dispatchEvent(new Event('visibilitychange'));
      return {paused:_v17Moqi?_v17Moqi.paused:null};}catch(e){return {err:String(e)}}}""")[0] or {}
    R.check(gid, "A14", "切后台暂停计时（paused=true、toast、秒数不变）",
            pause.get("paused") is True and pause.get("timer") == t2 and "暂停" in (pause.get("toast") or ""),
            "pause=%s t2=%r" % (json.dumps(pause, ensure_ascii=False), t2))
    R.check(gid, "A14b", "回到前台恢复计时（paused=false）", resume.get("paused") is False,
            "resume=%s" % resume)

    # A15 词库：≥80 词且前 80 个不重复
    words = js(pb, """()=>{var out=[];for(var i=0;i<80;i++){
        var el=document.getElementById('mqWord'); if(!el)break;
        out.push(el.textContent);
        try{v17MoqiGuessHit();}catch(e){break;}
      }return out;}""")[0] or []
    uniq = len(set(words))
    R.check(gid, "A15", "词库前 80 个词不重复出现", len(words) >= 80 and uniq == len(words),
            "collected=%d unique=%d sample=%s" % (len(words), uniq, words[:5]))
    R.check(gid, "A15b", "词长 2–7 字（抽查 80 个）",
            all(2 <= len(w) <= 7 for w in words), "lens=%s" % sorted(set(len(w) for w in words)))
    dlg2 = new_dialog(pb)
    click(pb, '[data-t="guess-end"]')
    pb.page.wait_for_timeout(700)
    R.check(gid, "A15c", "80 词跑完后提前结束正常结算",
            bool(js(pb, "!!document.querySelector('[data-t=\"guess-result\"]')")[0]),
            "dialogs=%d" % len(dlg2["events"]))
    see(pb, "A")

    # A15d 刷新页面后默契档案仍显示（couple-moqi 持久化）
    store_b = ls_get(pb, "couple-moqi") or {}
    pb.page.reload(wait_until="load", timeout=30000)
    pb.page.wait_for_timeout(1300)
    H.dismiss_overlays(pb)
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(450)
    store_a = ls_get(pb, "couple-moqi") or {}
    arcs_reload = js(pb, """()=>Array.prototype.map.call(document.querySelectorAll('.mq-arc b'),
      function(e){return e.textContent;})""")[0] or []
    best_reload = (store_b.get("heart") or {}).get("best", 0)
    R.check(gid, "A15d", "刷新页面后默契档案仍显示（heart.best=%s%% 且数据未变）" % best_reload,
            store_a == store_b and ("%s%%" % best_reload) in (arcs_reload[0] if arcs_reload else ""),
            "before=%s after=%s archive=%s" % (json.dumps(store_b, ensure_ascii=False)[:150],
                                               json.dumps(store_a, ensure_ascii=False)[:150], arcs_reload))

    # A16 坏存档容错
    set_ls(pb, "couple-moqi", "{bad json")
    go_home(pb)
    js(pb, "try{startGame('moqi')}catch(e){}")
    pb.page.wait_for_timeout(400)
    bad_ok = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-entry\"]')")[0])
    defaults = js(pb, """()=>{var xs=document.querySelectorAll('.mq-arc b');
      return Array.prototype.map.call(xs,function(x){return x.textContent;});}""")[0] or []
    t = take(pb)
    R.check(gid, "A16", "couple-moqi 坏 JSON 时不崩、档案回退默认 0",
            bad_ok and not t["pageerrors"] and (defaults[:1] == ["0%"]),
            "entry=%s defaults=%s errors=%s" % (bad_ok, defaults, t["pageerrors"][:2]))
    # 修复存档
    set_ls(pb, "couple-moqi", '{"v":1,"plays":0,"heart":{"best":0,"last":0,"plays":0,"rounds":0,"hits":0},"guess":{"best":0,"last":0,"plays":0,"describer":"him","duration":60},"lastAt":""}')

    # A17 SPEC 要求的 data-t 选择器覆盖（跨整组收集）
    required = ["moqi-hero-card", "moqi-mode-heart", "moqi-mode-guess", "moqi-start",
                "moqi-opt-0", "moqi-opt-1", "moqi-opt-2", "moqi-opt-3", "moqi-next",
                "moqi-result", "moqi-replay", "moqi-home",
                "guess-word", "guess-hit", "guess-skip", "guess-timer", "guess-result"]
    missing = [s for s in required if s not in SEEN["A"]]
    a["selectors_required"] = required
    a["selectors_seen"] = sorted(SEEN["A"])
    R.check(gid, "A17", "SPEC 要求的 17 个 moqi data-t 选择器全部出现（%d/17）" % (len(required) - len(missing)),
            not missing, "missing=%s seen=%s" % (missing, sorted(SEEN["A"])[:12]),
            {"missing": missing})
    R.ev("moqi_required_selectors", required)

    # A18 三主题下 moqi 可用（在 E 组统一截图；此处仅 light 下入口/对局可读）
    js(pb, "try{setOpt('theme','light');applyTheme();}catch(e){}")
    pb.page.wait_for_timeout(250)
    _enter_heart(pb, 5)
    light_ok = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-heart-play\"]')")[0])
    ov = js(pb, "document.documentElement.scrollWidth-innerWidth")[0]
    R.check(gid, "A18", "light 主题下心有灵犀对局可渲染且无横向溢出",
            light_ok and (ov or 0) <= 1, "play=%s overflow=%s" % (light_ok, ov))
    shot(pb, "theme/moqi-heart-light-390x844")
    js(pb, "try{setOpt('theme','dark');applyTheme();}catch(e){}")
    go_home(pb)

    res["A"] = a
    res["A_console"] = take(pb)
    pb.context.close()


# ================================================================ B · 回忆册/备份
def _create_party_data(pb):
    js(pb, """try{
      logEvent('💋 测试：亲吻一下');
      v12TaskDone('💋 测试：亲吻一下');
      coinAdd(5); heatUp();
      var M=JSON.parse(localStorage.getItem('couple-moqi')||'null')||{};
      if(!M.heart){M.heart={best:60,last:60,plays:1,rounds:5,hits:3};}
      M.lastAt=(function(){var d=new Date();var p=function(n){return (n<10?'0':'')+n;};
        return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());})();
      M.plays=(M.plays||1); localStorage.setItem('couple-moqi',JSON.stringify(M));
    }catch(e){}""")
    pb.page.wait_for_timeout(200)


def _open_mem(pb, tab=None):
    if not js(pb, "!!document.getElementById('v17MemSheet')")[0]:
        js(pb, "try{v17MemOpen()}catch(e){}")
    else:
        js(pb, "try{v17MemOpen()}catch(e){}")
    pb.page.wait_for_timeout(350)
    on = js(pb, "!!(document.getElementById('v17MemSheet')||{}).className && document.getElementById('v17MemSheet').className.indexOf('on')>=0")[0]
    if tab == "backup" and on:
        click(pb, '[data-t="mem-tab-backup"]')
        pb.page.wait_for_timeout(250)
    return bool(on)


def group_b(browser, base, res):
    gid = "B"
    print("\n=== B · 回忆册 + 数据备份 ===")
    pb = open_pb(browser, base)
    b = {}
    see(pb, "B")

    # B1 首页第 6 张卡 mem-tile → 打开抽屉
    home_tiles = js(pb, """()=>Array.prototype.map.call(document.querySelectorAll('.v12-tiles .v12-tile'),function(e){
      return {t:e.getAttribute('data-t')||'',txt:(e.innerText||'').replace(/\\s+/g,' ').trim()};})""")[0] or []
    mem_tile = [x for x in home_tiles if x.get("t") == "mem-tile"]
    R.check(gid, "B1", "首页第 6 张主角卡 = 回忆册（data-t=mem-tile）", len(mem_tile) == 1
            and home_tiles[-1].get("t") == "mem-tile",
            "tiles=%s" % [x.get("t") for x in home_tiles])
    clear(pb)
    opened = click(pb, '[data-t="mem-tile"]')
    pb.page.wait_for_timeout(400)
    st = state(pb)
    R.check(gid, "B1b", "点击回忆册卡打开全屏抽屉（.on + body 滚动锁）",
            opened and st.get("sheetOn") and st.get("bodyOverflow") == "hidden",
            "click=%s sheetOn=%s bodyOverflow=%r" % (opened, st.get("sheetOn"), st.get("bodyOverflow")))
    R.check(gid, "B1c", "抽屉无 pageerror/console error", not ok_no_err(pb)[1]["pageerrors"],
            "errors=%s console=%s" % (take(pb)["pageerrors"][:2], take(pb)["console_app"][:2]))
    shot(pb, "memory/sheet-empty-390x844")
    see(pb, "B")
    stats = js(pb, """()=>{var e=document.querySelector('[data-t="mem-stats"]');
      return {cells:document.querySelectorAll('[data-t="mem-stats"] .v17mem-stat').length,
        text:e?e.innerText.replace(/\\s+/g,' '):''};}""")[0] or {}
    tabs = js(pb, "()=>['mem-tab-timeline','mem-tab-backup'].map(function(t){return !!document.querySelector('[data-t=\"'+t+'\"]')})")[0]
    R.check(gid, "B2", "统计条 4 格 + 两个 tab + 关闭按钮",
            stats.get("cells") == 4 and tabs == [True, True]
            and bool(js(pb, "!!document.querySelector('[data-t=\"mem-close\"]')")[0]),
            "stats=%s tabs=%s" % (json.dumps(stats, ensure_ascii=False), tabs), stats)
    R.check(gid, "B2b", "空状态文案（尚无记录）",
            "还没有记录" in text_of(pb, '[data-t="mem-timeline"]'),
            "timeline=%r" % text_of(pb, '[data-t="mem-timeline"]')[:80])

    # B2c tab 切换
    click(pb, '[data-t="mem-tab-backup"]')
    pb.page.wait_for_timeout(250)
    see(pb, "B")
    backup_panel = bool(js(pb, "!!document.querySelector('[data-t=\"mem-backup\"]')")[0])
    overview = text_of(pb, '[data-t="mem-backup-overview"]')
    click(pb, '[data-t="mem-tab-timeline"]')
    pb.page.wait_for_timeout(250)
    timeline_panel = bool(js(pb, "!!document.querySelector('[data-t=\"mem-timeline\"]')")[0])
    R.check(gid, "B2c", "Tab 切换：数据备份 ↔ 时间线", backup_panel and timeline_panel and "已保存" in overview,
            "backup=%s timeline=%s overview=%r" % (backup_panel, timeline_panel, overview))
    shot(pb, "memory/backup-empty-390x844")
    see(pb, "B")

    # B2d Escape / 关闭按钮
    js(pb, "try{v17MemClose()}catch(e){}")
    pb.page.wait_for_timeout(250)
    closed = not state(pb).get("sheetOn")
    R.check(gid, "B2d", "关闭抽屉后解除滚动锁（overflow 恢复）",
            closed and state(pb).get("bodyOverflow") == "",
            "closed=%s overflow=%r" % (closed, state(pb).get("bodyOverflow")))

    # B3 自动记录：本晚战报 → 时间线出现今天一条，不重复，数字一致
    _create_party_data(pb)
    js(pb, "try{showPartyReport()}catch(e){}")
    pb.page.wait_for_timeout(400)
    close_modal(pb)
    mem_after = ls_get(pb, "couple-memories") or {}
    lst = mem_after.get("list") or []
    party = ls_get(pb, "couple-party") or {}
    b["memories_after_report"] = mem_after
    R.check(gid, "B3", "打开本晚战报后自动写入今天一条回忆",
            len(lst) == 1 and lst[0].get("date") == js(pb, "(function(){var d=new Date();var p=function(n){return (n<10?'0':'')+n;};return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());})()")[0],
            "list=%s" % json.dumps(lst, ensure_ascii=False)[:260], lst)
    R.check(gid, "B3b", "回忆数字与战报一致（tasks/heat/kisses/games）",
            len(lst) == 1 and lst[0].get("tasks") == (party.get("tasks") or 0)
            and lst[0].get("heat") == js(pb, "getHeat()")[0]
            and lst[0].get("kisses") == (party.get("kisses") or 0)
            and lst[0].get("games") == (party.get("games") or 0),
            "mem=%s party=%s" % (json.dumps(lst[0] if lst else {}, ensure_ascii=False),
                                 json.dumps(party, ensure_ascii=False)))
    R.check(gid, "B3c", "跨功能：couple-moqi 当日默契度写入回忆 (moqi=60)",
            len(lst) == 1 and lst[0].get("moqi") == 60, "moqi_field=%s" % (lst[0].get("moqi") if lst else None))
    # 再次打开不重复
    js(pb, "try{showPartyReport()}catch(e){}")
    pb.page.wait_for_timeout(400)
    close_modal(pb)
    lst2 = (ls_get(pb, "couple-memories") or {}).get("list") or []
    R.check(gid, "B3d", "再次打开本晚战报：同日 upsert 不重复新增", len(lst2) == 1,
            "list_len=%d" % len(lst2))
    _open_mem(pb)
    item_txt = text_of(pb, '[data-t="mem-item"]')
    item_count = js(pb, "()=>document.querySelectorAll('[data-t=\"mem-item\"]').length")[0]
    R.check(gid, "B3e", "抽屉时间线显示今天一条（含数字）",
            item_count == 1 and "任务" in item_txt,
            "items=%s text=%r" % (item_count, item_txt[:100]))
    R.check(gid, "B3f", "时间线条目含「今晚」徽章", "今晚" in item_txt, "item=%r" % item_txt[:120])
    stats1 = text_of(pb, '[data-t="mem-stats"]')
    R.check(gid, "B3g", "统计条随数据变化（出现 1 晚 / 累计任务 N）",
            "1 晚" in stats1 and "累计任务" in stats1,
            "stats=%r" % stats1[:100])
    shot(pb, "memory/timeline-1-390x844")
    see(pb, "B")

    # B4 详情 / 改备注 / 删除 / 取消删除
    click(pb, '[data-t="mem-item"] .v17mem-item-head')
    pb.page.wait_for_timeout(250)
    detail = text_of(pb, '[data-t="mem-detail"]')
    has_detail = bool(js(pb, "!!document.querySelector('[data-t=\"mem-detail\"]')")[0])
    R.check(gid, "B4", "点击条目展开详情（亲吻/喝酒/默契度/游戏明细 + 改备注/删除）",
            has_detail and "改备注" in detail and "删除" in detail and "默契度" in detail,
            "detail=%r" % detail[:160])
    dlg = new_dialog(pb)
    dlg["text"] = "今晚笑到肚子疼 😂"
    click(pb, '[data-t="mem-note"]')
    pb.page.wait_for_timeout(450)
    note_ui = text_of(pb, '[data-t="mem-item"]')
    note_store = ((ls_get(pb, "couple-memories") or {}).get("list") or [{}])[0].get("note")
    R.check(gid, "B4b", "改备注（原生 prompt）保存成功并落库（≤40字）",
            any(x["type"] == "prompt" for x in dlg["events"]) and note_store == "今晚笑到肚子疼 😂"
            and "今晚笑到肚子疼" in note_ui,
            "dialogs=%s note=%r" % (dlg["events"], note_store))
    # 取消删除：数据保留
    dlg2 = new_dialog(pb)
    dlg2["action"] = "dismiss"
    click(pb, '[data-t="mem-del"]')
    pb.page.wait_for_timeout(350)
    kept = len((ls_get(pb, "couple-memories") or {}).get("list") or [])
    R.check(gid, "B4c", "删除弹 confirm，取消后数据保留",
            any(x["type"] == "confirm" for x in dlg2["events"]) and kept == 1,
            "dialogs=%s kept=%d" % (dlg2["events"], kept))
    # 确认删除
    dlg3 = new_dialog(pb)
    click(pb, '[data-t="mem-del"]')
    pb.page.wait_for_timeout(450)
    after_del = (ls_get(pb, "couple-memories") or {}).get("list") or []
    stats_after = text_of(pb, '[data-t="mem-stats"]')
    R.check(gid, "B4d", "确认删除后记录消失、统计条更新为 0 晚",
            len(after_del) == 0 and "0 晚" in stats_after and "还没有记录" in text_of(pb, '[data-t="mem-timeline"]'),
            "list=%s stats=%r" % (after_del, stats_after[:80]))
    R.check(gid, "B4e", "删除也没有 pageerror", not take(pb)["pageerrors"], "errors=%s" % take(pb)["pageerrors"][:2])
    see(pb, "B")

    # B5 多日记录按日期倒序（今天在前、旧记录在后）
    today = js(pb, """(function(){var d=new Date();var p=function(n){return (n<10?'0':'')+n;};
      return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());})()""")[0]
    yest = js(pb, """(function(){var d=new Date();d.setDate(d.getDate()-1);var p=function(n){return (n<10?'0':'')+n;};
      return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());})()""")[0]
    two = {"v": 1, "list": [
        {"ts": 1000, "date": yest, "heat": 3, "tasks": 2, "games": 1, "kisses": 0, "drinks": 0,
         "punished": 0, "moqi": 0, "note": ""},
        {"ts": 2000, "date": today, "heat": 9, "tasks": 5, "games": 2, "kisses": 1, "drinks": 0,
         "punished": 0, "moqi": 0, "note": ""}]}
    set_ls(pb, "couple-memories", json.dumps(two, ensure_ascii=False))
    js(pb, "try{v17MemOpen()}catch(e){}")
    pb.page.wait_for_timeout(400)
    dates = js(pb, """()=>Array.prototype.map.call(document.querySelectorAll('[data-t="mem-item"]'),
      function(e){return {d:e.getAttribute('data-date'),txt:(e.innerText||'').replace(/\\s+/g,' ').slice(0,40)};})""")[0] or []
    R.check(gid, "B5", "多条回忆按日期倒序（今天在前）；今天条目带「今晚」",
            [x.get("d") for x in dates] == [today, yest] and "今晚" in (dates[0].get("txt") if dates else ""),
            "dates=%s" % json.dumps(dates, ensure_ascii=False)[:240])
    set_ls(pb, "couple-memories", json.dumps({"v": 1, "list": []}, ensure_ascii=False))

    # 为后续备份准备数据（重新生成一条回忆 + 多个 couple-* 键）
    _create_party_data(pb)
    js(pb, "try{showPartyReport()}catch(e){}")
    pb.page.wait_for_timeout(350)
    close_modal(pb)
    _open_mem(pb)

    # B6 导出备份
    click(pb, '[data-t="mem-tab-backup"]')
    pb.page.wait_for_timeout(300)
    overview = text_of(pb, '[data-t="mem-backup-overview"]')
    clear(pb)
    dl_path = TMP / "backup.json"
    got = {"ok": False, "suggested": None, "path": None}
    try:
        with pb.page.expect_download(timeout=10000) as dl_info:
            pb.page.click('[data-t="mem-export"]', timeout=4000)
        dl = dl_info.value
        dl.save_as(str(dl_path))
        got = {"ok": True, "suggested": dl.suggested_filename, "path": str(dl_path)}
    except Exception as e:
        got["err"] = str(e)[:200]
    b["export"] = got
    parsed = None
    if got["ok"] and dl_path.exists():
        try:
            parsed = json.loads(dl_path.read_text(encoding="utf-8"))
        except Exception as e:
            parsed = {"parse_error": str(e)}
    date_str = js(pb, """;(function(){var d=new Date();var p=function(n){return (n<10?'0':'')+n;};
      return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());})()""")[0]
    R.check(gid, "B6", "导出备份触发下载且文件名含日期（.json）",
            got["ok"] and ".json" in (got.get("suggested") or "") and (date_str or "") in (got.get("suggested") or ""),
            "download=%s" % json.dumps(got, ensure_ascii=False))
    data_map = (parsed or {}).get("data") if isinstance(parsed, dict) else None
    R.check(gid, "B6b", "备份 JSON 合法且含 app/v/exportedAt/data",
            isinstance(parsed, dict) and parsed.get("app") == "couple-game" and parsed.get("v") == 17
            and isinstance(parsed.get("exportedAt"), str) and isinstance(data_map, dict),
            "keys=%s" % (list(parsed.keys()) if isinstance(parsed, dict) else parsed))
    couple_keys = [k for k in (data_map or {}) if k.startswith("couple-")]
    R.check(gid, "B6c", "备份含 ≥5 个 couple-* 键（实际 %d）" % len(couple_keys), len(couple_keys) >= 5,
            "keys=%s" % couple_keys[:12], {"count": len(couple_keys), "keys": couple_keys})
    R.check(gid, "B6d", "数据备份页显示「已保存 N 项数据」",
            "已保存" in overview and "项数据" in overview, "overview=%r" % overview[:100])
    shot(pb, "memory/backup-export-390x844")

    # B7 导入回滚：改坏值 → 导入备份 → 确认 → reload → 恢复原值
    heat_before = ls_get(pb, "couple-heat")
    coins_before = ls_get(pb, "couple-coins")
    set_ls(pb, "couple-heat", json.dumps({"d": "2000-01-01", "v": 99}))
    js(pb, "localStorage.removeItem('couple-coins')")
    js(pb, "try{v17MemOpen()}catch(e){}")
    click(pb, '[data-t="mem-tab-backup"]')
    pb.page.wait_for_timeout(300)
    dlg = new_dialog(pb)
    clear(pb)
    try:
        pb.page.set_input_files('[data-t="mem-file"]', str(dl_path))
    except Exception as e:
        b["import_setfile_err"] = str(e)[:200]
    pb.page.wait_for_timeout(900)
    confirm_seen = any(x["type"] == "confirm" for x in dlg["events"])
    pb.page.wait_for_timeout(2200)  # 等 700ms 后的 location.reload
    H.dismiss_overlays(pb)
    pb.page.wait_for_timeout(600)
    heat_after = ls_get(pb, "couple-heat")
    coins_after = ls_get(pb, "couple-coins")
    b["import"] = {"confirm": confirm_seen, "heat_before": heat_before, "heat_after": heat_after,
                   "coins_before": coins_before, "coins_after": coins_after,
                   "dialogs": dlg["events"]}
    R.check(gid, "B7", "导入备份：弹 confirm 确认后自动刷新",
            confirm_seen and not take(pb)["pageerrors"],
            "confirm=%s dialogs=%s errors=%s" % (confirm_seen, dlg["events"], take(pb)["pageerrors"][:2]))
    R.check(gid, "B7b", "导入后恢复被改的键（couple-heat 99→原值、couple-coins 恢复）",
            heat_after == heat_before and coins_after == coins_before,
            "heat %s→%s coins %s→%s" % (heat_before, heat_after, coins_before, coins_after))
    R.check(gid, "B7c", "刷新后页面正常渲染", bool(state(pb).get("home")))

    # B8 坏文件容错
    bad_file = TMP / "bad.json"
    bad_file.write_text("{oops not json", encoding="utf-8")
    js(pb, "try{v17MemOpen()}catch(e){}")
    click(pb, '[data-t="mem-tab-backup"]')
    pb.page.wait_for_timeout(250)
    heat_keep = ls_get(pb, "couple-heat")
    clear(pb)
    dlg = new_dialog(pb)
    try:
        pb.page.set_input_files('[data-t="mem-file"]', str(bad_file))
    except Exception:
        pass
    pb.page.wait_for_timeout(900)
    toast_txt = text_of(pb, "#toast")
    heat_after_bad = ls_get(pb, "couple-heat")
    R.check(gid, "B8", "导入坏文件：toast「备份文件格式不对」且不破坏现有数据",
            "格式不对" in toast_txt and heat_after_bad == heat_keep and not any(
                x["type"] == "confirm" for x in dlg["events"]),
            "toast=%r heat_keep=%s" % (toast_txt, heat_after_bad))

    # B8b 非法键名忽略 + 裸键值对象兼容
    dirty = {"data": {"couple-heat": json.dumps({"d": js(pb, "new Date().toDateString()")[0], "v": 42}),
                      "evil-key": "should-not-write", "couple-bad key": "x"},
             "exportedAt": "2026-10-24T10:00:00.000Z"}
    dirty_file = TMP / "dirty.json"
    dirty_file.write_text(json.dumps(dirty), encoding="utf-8")
    dlg = new_dialog(pb)
    try:
        pb.page.set_input_files('[data-t="mem-file"]', str(dirty_file))
    except Exception:
        pass
    pb.page.wait_for_timeout(1000)
    pb.page.wait_for_timeout(2000)
    H.dismiss_overlays(pb)
    pb.page.wait_for_timeout(400)
    heat42 = ls_get(pb, "couple-heat")
    evil = js(pb, "localStorage.getItem('evil-key')")[0]
    badkey = js(pb, "localStorage.getItem('couple-bad key')")[0]
    R.check(gid, "B8b", "导入忽略非法键名（evil-key / 含空格键），只写合法 couple-*",
            heat42 == {"d": js(pb, "new Date().toDateString()")[0], "v": 42} and evil is None and badkey is None,
            "heat=%s evil=%r badkey=%r" % (json.dumps(heat42, ensure_ascii=False), evil, badkey))
    # 裸键值对象（无外层包装）
    bare_file = TMP / "bare.json"
    bare_file.write_text(json.dumps({"couple-heat": json.dumps({"d": js(pb, "new Date().toDateString()")[0], "v": 7})}), encoding="utf-8")
    js(pb, "try{v17MemOpen()}catch(e){}")
    click(pb, '[data-t="mem-tab-backup"]')
    pb.page.wait_for_timeout(250)
    dlg = new_dialog(pb)
    try:
        pb.page.set_input_files('[data-t="mem-file"]', str(bare_file))
    except Exception:
        pass
    pb.page.wait_for_timeout(1000)
    pb.page.wait_for_timeout(2000)
    H.dismiss_overlays(pb)
    heat7 = ls_get(pb, "couple-heat")
    R.check(gid, "B8c", "兼容裸键值对象导入（无 app/data 包装）",
            (heat7 or {}).get("v") == 7, "heat=%s" % json.dumps(heat7, ensure_ascii=False))

    # B9 坏 couple-memories JSON：不崩、空状态
    set_ls(pb, "couple-memories", "{bad memories")
    clear(pb)
    js(pb, "try{v17MemOpen()}catch(e){}")
    pb.page.wait_for_timeout(350)
    empty_ok = "还没有记录" in text_of(pb, '[data-t="mem-timeline"]')
    R.check(gid, "B9", "couple-memories 为坏 JSON 时不崩、显示空状态",
            empty_ok and not take(pb)["pageerrors"],
            "empty=%s errors=%s" % (empty_ok, take(pb)["pageerrors"][:2]))
    # B9b 上限 200
    entries = []
    for i in range(205):
        entries.append({"ts": 1600000000000 + i * 1000, "date": "2020-01-%02d" % ((i % 28) + 1),
                        "heat": i % 50, "tasks": i, "games": 1, "kisses": 0, "drinks": 0,
                        "punished": 0, "moqi": 0, "note": ""})
    set_ls(pb, "couple-memories", json.dumps({"v": 1, "list": entries}))
    js(pb, "try{v17MemOpen()}catch(e){}")
    pb.page.wait_for_timeout(350)
    stats_txt = text_of(pb, '[data-t="mem-stats"]')
    R.check(gid, "B9b", "回忆册上限 200 条（写入 205 → 显示 200 晚）",
            "200 晚" in stats_txt, "stats=%r" % stats_txt[:120])
    # 恢复干净存档
    set_ls(pb, "couple-memories", json.dumps({"v": 1, "list": []}))

    # B10 无痕模式提示 + 导出仍可用
    js(pb, "try{SET.incognito=true;v17MemOpen()}catch(e){}")
    pb.page.wait_for_timeout(350)
    incog = bool(js(pb, "!!document.querySelector('[data-t=\"mem-incognito\"]')")[0])
    click(pb, '[data-t="mem-tab-backup"]')
    pb.page.wait_for_timeout(250)
    dlg_ok = {"ok": False}
    try:
        with pb.page.expect_download(timeout=8000) as dl2:
            pb.page.click('[data-t="mem-export"]', timeout=3000)
        dlg_ok["ok"] = True
    except Exception as e:
        dlg_ok["err"] = str(e)[:120]
    R.check(gid, "B10", "无痕模式：抽屉显示提示且导出仍可用",
            incog and dlg_ok["ok"] and "无痕" in text_of(pb, '[data-t="mem-sheet"]'),
            "incognito_tip=%s export=%s" % (incog, dlg_ok))
    shot(pb, "memory/incognito-390x844")
    js(pb, "try{SET.incognito=false;v17MemClose()}catch(e){}")
    pb.page.wait_for_timeout(250)

    # B11 三主题抽屉无横向溢出（截图）
    for th in ("dark", "light", "sketch"):
        js(pb, "try{setOpt('theme','%s');applyTheme();v17MemOpen();}catch(e){}" % th)
        pb.page.wait_for_timeout(350)
        body_ov = js(pb, """()=>{var b=document.querySelector('#v17MemSheet .v17mem-body');
          return b?b.scrollWidth-b.clientWidth:-999;}""")[0]
        R.check(gid, "B11-%s" % th, "%s 主题回忆册无横向溢出" % th, (body_ov or 0) <= 1,
                "body scrollW-clientW=%s" % body_ov)
        shot(pb, "theme/memory-%s-390x844" % th)
        js(pb, "try{v17MemClose()}catch(e){}")
        pb.page.wait_for_timeout(200)
    js(pb, "try{setOpt('theme','dark');applyTheme();}catch(e){}")

    # B12 SPEC 要求的 data-t 选择器覆盖
    required = ["mem-tile", "mem-sheet", "mem-tab-timeline", "mem-tab-backup", "mem-export",
                "mem-import", "mem-file", "mem-item", "mem-stats", "mem-close"]
    missing = [s for s in required if s not in SEEN["B"]]
    b["selectors_required"] = required
    b["selectors_seen"] = sorted(SEEN["B"])
    R.check(gid, "B12", "SPEC 要求的 10 个回忆册 data-t 选择器全部出现（%d/10）" % (len(required) - len(missing)),
            not missing, "missing=%s" % missing, {"missing": missing})

    res["B"] = b
    res["B_console"] = take(pb)
    pb.context.close()


# ================================================================ C · PWA
def group_c(browser, base, res):
    gid = "C"
    print("\n=== C · PWA 离线安装 ===")
    pb = open_pb(browser, base, settle=1500)
    c = {}
    clear(pb)
    see(pb, "C")

    # C1 manifest / icons / meta
    manifest_req = pb.page.request.get(base + "manifest.webmanifest")
    man = {"status": manifest_req.status, "content_type": manifest_req.headers.get("content-type", "")}
    try:
        man["json"] = json.loads(manifest_req.text())
    except Exception as e:
        man["json"] = {"parse_error": str(e)}
    manj = man["json"]
    expected_icons = {"icons/icon-192.png": 192, "icons/icon-512.png": 512,
                      "icons/icon-maskable-512.png": 512}
    icon_ok = True
    icon_checks = {}
    for src, size in expected_icons.items():
        r = pb.page.request.get(base + src)
        p = BUILD / src
        dim = png_size(p)
        icon_checks[src] = {"status": r.status, "dim": dim}
        if r.status != 200 or not dim or dim.get("w") != size or dim.get("h") != size:
            icon_ok = False
    meta = js(pb, """()=>{var tc=document.querySelector('meta[name="theme-color"]');
      var ml=document.querySelector('link[rel="manifest"]');
      return {theme_color:tc?tc.content:null, manifest:ml?ml.getAttribute('href'):null,
        apple:!!document.querySelector('link[rel="apple-touch-icon"]'),
        og:!!document.querySelector('meta[property="og:image"]')};}""")[0] or {}
    c["manifest"] = man
    R.check(gid, "C1", "manifest.webmanifest 200 + application/manifest+json + JSON 合法",
            man["status"] == 200 and "manifest" in man["content_type"] and isinstance(manj, dict)
            and not manj.get("parse_error"),
            "status=%s ct=%s keys=%s" % (man["status"], man["content_type"],
                                         list(manj.keys()) if isinstance(manj, dict) else None))
    R.check(gid, "C1b", "manifest 字段符合 SPECS（name/short_name/start_url/scope/display/图标）",
            manj.get("name") == "情侣升温游戏 · 今晚升温" and manj.get("short_name") == "情侣升温"
            and manj.get("start_url") == "./" and manj.get("scope") == "./"
            and manj.get("display") == "standalone" and manj.get("orientation") == "portrait"
            and len(manj.get("icons") or []) == 3,
            "manifest=%s" % json.dumps({k: manj.get(k) for k in
                                        ("name", "short_name", "start_url", "scope", "display", "orientation")},
                                       ensure_ascii=False))
    R.check(gid, "C1c", "icons 192/512/maskable 均 200 且尺寸正确",
            icon_ok, json.dumps(icon_checks, ensure_ascii=False))
    R.check(gid, "C1d", "theme-color meta = #6c2bd9；manifest/apple-touch-icon/og:image 均声明",
            meta.get("theme_color") == "#6c2bd9" and meta.get("manifest") == "manifest.webmanifest"
            and meta.get("apple") and meta.get("og"), "meta=%s" % json.dumps(meta, ensure_ascii=False))
    # C7 og / touch icon 尺寸
    og = png_size(BUILD / "icons/og-image.png")
    touch = png_size(BUILD / "icons/apple-touch-icon.png")
    R.check(gid, "C7", "og-image 1200x630 + apple-touch-icon 180x180",
            og and og["w"] == 1200 and og["h"] == 630 and touch and touch["w"] == 180 and touch["h"] == 180,
            "og=%s touch=%s" % (og, touch))
    c["assets"] = {"og": og, "touch": touch, "icons": icon_checks}

    # C2 sw.js 静态检查
    sw_txt = (BUILD / "sw.js").read_text(encoding="utf-8")
    precache_ok = all(x in sw_txt for x in ("./index.html", "./manifest.webmanifest",
                                           "./icons/icon-192.png", "./icons/icon-512.png"))
    R.check(gid, "C2", "sw.js：CACHE=v17-1、预缓存 index/manifest/图标、network-first 导航",
            "couple-game-v17-1" in sw_txt and precache_ok
            and "networkFirst" in sw_txt and "'install'" in sw_txt and "'fetch'" in sw_txt,
            "cache_v17=%s precache=%s" % ("couple-game-v17-1" in sw_txt, precache_ok))

    # C3 SW 注册成功
    clear(pb)
    sw = wait_sw_ready(pb, 15000)
    ctrl = wait_controller(pb, 6000)
    reg = js(pb, """async()=>{try{var r=await navigator.serviceWorker.getRegistration();
      return r?{scope:r.scope, installing:!!r.installing, waiting:!!r.waiting, active:!!r.active}:null;
    }catch(e){return {err:String(e)}}}""")[0]
    R.check(gid, "C3", "SW 注册成功（serviceWorker.ready 有值、scope 正确）",
            sw.get("ok") and (reg or {}).get("active"), "ready=%s reg=%s" % (sw, reg))
    R.check(gid, "C3b", "页面被 SW 接管（controller 非空）", ctrl,
            "controller=%s" % js(pb, "!!(navigator.serviceWorker&&navigator.serviceWorker.controller)")[0])
    cache_keys = js(pb, """async()=>{try{var ks=await caches.keys();var c=await caches.open('couple-game-v17-1');
      var rs=await c.keys();return {keys:ks,count:rs.length,urls:rs.map(function(r){return r.url})};
      }catch(e){return {err:String(e)}}}""")[0] or {}
    R.check(gid, "C3c", "Cache Storage 生成 couple-game-v17-1 且预缓存 ≥3 项",
            (cache_keys.get("keys") or []).count("couple-game-v17-1") == 1
            and (cache_keys.get("count") or 0) >= 3,
            "cache=%s" % json.dumps({k: cache_keys.get(k) for k in ("keys", "count")}, ensure_ascii=False))
    c["sw"] = {"ready": sw, "registration": reg, "cache": {k: cache_keys.get(k) for k in ("keys", "count", "err")}}
    shot(pb, "pwa/home-sw-ready-390x844")

    # C4 离线 reload 仍可玩
    clear(pb)
    pb.context.set_offline(True)
    pb.page.wait_for_timeout(400)
    offline_toast = text_of(pb, "#toast")
    reload_ok = True
    try:
        pb.page.reload(wait_until="load", timeout=30000)
    except Exception as e:
        reload_ok = False
        c["offline_reload_err"] = str(e)[:300]
    pb.page.wait_for_timeout(1500)
    H.dismiss_overlays(pb)
    st = state(pb)
    t_off = take(pb)
    tiles = st.get("tiles")
    play_ok = False
    if st.get("home"):
        js(pb, "try{startGame('truth')}catch(e){}")
        pb.page.wait_for_timeout(600)
        s2 = state(pb)
        play_ok = bool(s2.get("game")) and (s2.get("gKids") or 0) > 0
    c["offline"] = {"reload_ok": reload_ok, "home": st.get("home"), "tiles": tiles,
                    "play_ok": play_ok, "toast": offline_toast,
                    "pageerrors": t_off["pageerrors"], "console_app": t_off["console_app"]}
    R.check(gid, "C4", "离线（set_offline）后 reload 仍进入首页", reload_ok and st.get("home"),
            "reload_ok=%s home=%s tiles=%s" % (reload_ok, st.get("home"), tiles), c["offline"])
    R.check(gid, "C4b", "离线状态首页 6 张主角卡完整", tiles == 6, "tiles=%s" % tiles)
    R.check(gid, "C4c", "离线状态仍能开一局（startGame('truth') 渲染）", play_ok,
            "play_ok=%s state=%s" % (play_ok, json.dumps({k: state(pb).get(k) for k in ("game", "gKids")})))
    R.check(gid, "C4d", "离线无 JS error（资源级网络错误已过滤）",
            not t_off["pageerrors"] and not t_off["console_app"],
            "app_errors=%s console=%s" % (t_off["pageerrors"][:2], t_off["console_app"][:3]))
    shot(pb, "pwa/offline-home-390x844")
    # 恢复联网
    go_home(pb)
    clear(pb)
    pb.context.set_offline(False)
    pb.page.wait_for_timeout(800)
    online_toast = text_of(pb, "#toast")
    pb.page.reload(wait_until="load", timeout=30000)
    pb.page.wait_for_timeout(1200)
    H.dismiss_overlays(pb)
    R.check(gid, "C4e", "恢复联网后 reload 正常（在线提示 toast）",
            bool(state(pb).get("home")) and ("恢复" in online_toast or not online_toast),
            "home=%s online_toast=%r" % (state(pb).get("home"), online_toast))

    # C5 安装胶囊 + 安装方法弹窗
    go_home(pb)
    clear(pb)
    pill = js(pb, """()=>{var e=document.querySelector('[data-t="pwa-install-pill"]');
      return {exists:!!e, text:e?e.textContent:null, count:document.querySelectorAll('[data-t="pwa-install-pill"]').length};}""")[0] or {}
    R.check(gid, "C5", "设置条出现「📲 装到桌面」胶囊（且只有一个）",
            pill.get("exists") and pill.get("count") == 1 and "装到桌面" in (pill.get("text") or ""),
            "pill=%s" % json.dumps(pill, ensure_ascii=False))
    # 幂等：重新渲染设置条后仍只有一个
    js(pb, "try{renderSettings();renderSettings();}catch(e){}")
    pb.page.wait_for_timeout(300)
    cnt = js(pb, "document.querySelectorAll('[data-t=\"pwa-install-pill\"]').length")[0]
    R.check(gid, "C5b", "安装胶囊幂等（renderSettings 重复渲染后仍 1 个）", cnt == 1, "count=%s" % cnt)
    pb.page.locator('[data-t="pwa-install-pill"]').scroll_into_view_if_needed()
    pb.page.wait_for_timeout(200)
    clicked = click(pb, '[data-t="pwa-install-pill"]', 5000)
    pb.page.wait_for_timeout(500)
    m = modal(pb)
    steps = js(pb, "()=>document.querySelectorAll('[data-t=\"pwa-install-modal\"] li').length")[0]
    c["install_modal"] = {"clicked": clicked, "shown": m.get("shown"), "text": m.get("text")[:200],
                          "steps": steps}
    R.check(gid, "C5c", "点击胶囊打开安装方法弹窗（headless 无 beforeinstallprompt 走说明弹窗）",
            clicked and m.get("shown") and (steps or 0) >= 3 and "装" in (m.get("text") or ""),
            json.dumps(c["install_modal"], ensure_ascii=False)[:260])
    see(pb, "C")
    shot(pb, "pwa/install-modal-390x844")
    clear(pb)
    act = click(pb, '[data-t="pwa-install-action"]', 4000)
    pb.page.wait_for_timeout(400)
    R.check(gid, "C5d", "弹窗「知道了」按钮可关闭且无 error",
            act and not modal(pb).get("shown") and not take(pb)["pageerrors"] and not take(pb)["console_app"],
            "clicked=%s shown=%s" % (act, modal(pb).get("shown")))
    pill_first = js(pb, """()=>{var sb=document.getElementById('setBar');
      var pill=sb?sb.querySelector('[data-t="pwa-install-pill"]'):null;
      if(!pill||!sb)return null;sb.scrollLeft=0;var r=pill.getBoundingClientRect();
      return {first:sb.firstElementChild===pill,left:Math.round(r.left),right:Math.round(r.right),
        innerW:innerWidth,width:Math.round(r.width),text:pill.textContent,
        visible:(r.left>=0&&r.right<=innerWidth&&r.width>0)};}""")[0] or {}
    R.check(gid, "C5f", "安装胶囊置于设置条首位、首屏无需横滑可见",
            pill_first.get("first") and pill_first.get("visible"),
            "pill=%s" % json.dumps(pill_first, ensure_ascii=False), pill_first)
    R.check(gid, "C5e", "v17PwaState() 可读（协议/standalone/deferred/controller）",
            isinstance(js(pb, "()=>v17PwaState()")[0], dict),
            "state=%s" % json.dumps(js(pb, "()=>v17PwaState()")[0], ensure_ascii=False))
    c["pwa_state"] = js(pb, "()=>v17PwaState()")[0]

    # C6 file:// 无报错（静默跳过 SW）
    file_url = (BUILD / "index.html").resolve().as_uri()
    pb2 = open_pb(browser, file_url, settle=1500)
    stf = state(pb2)
    tf = take(pb2)
    fstate = js(pb2, "()=>{try{return v17PwaState()}catch(e){return {err:String(e)}}}")[0] or {}
    pillf = js(pb2, "()=>{var e=document.querySelector('[data-t=\"pwa-install-pill\"]');return e?e.textContent:null}")[0]
    has_reg = js(pb2, "async()=>{try{if(!('serviceWorker' in navigator))return 'unsupported';var r=await navigator.serviceWorker.getRegistration();return r?'registered':'none'}catch(e){return 'ERR:'+e}}")[0]
    c["file"] = {"home": stf.get("home"), "tiles": stf.get("tiles"), "state": fstate,
                 "pill": pillf, "sw": has_reg, "pageerrors": tf["pageerrors"],
                 "console_app": tf["console_app"], "console_res": tf["console_res"][:3]}
    R.check(gid, "C6", "file:// 打开：首页正常渲染、无 pageerror",
            stf.get("home") and not tf["pageerrors"],
            "home=%s tiles=%s errors=%s" % (stf.get("home"), stf.get("tiles"), tf["pageerrors"][:2]))
    R.check(gid, "C6b", "file:// 下 SW 静默跳过（protocol=file:、无注册、无未捕获异常）",
            fstate.get("protocol") == "file:" and fstate.get("hasRegistration") is False
            and fstate.get("hasController") is False and not tf["pageerrors"],
            "state=%s probe_getRegistration=%r errors=%s（file:// 下 getRegistration 抛 SecurityError 是浏览器行为/探针限制，"
            "应用已在 registerSW 先判 protocol 静默跳过）" % (
                json.dumps(fstate, ensure_ascii=False), has_reg, tf["pageerrors"][:2]))
    R.check(gid, "C6c", "file:// 下安装胶囊仍存在且点击可弹说明（无报错）",
            bool(pillf) and (not tf["console_app"] or all(
                any(x in c["text"] for x in NOISE) for c in tf["console_app"])),
            "pill=%r console_app=%s" % (pillf, tf["console_app"][:2]))
    shot(pb2, "pwa/file-protocol-390x844")
    res["C_console_file"] = tf
    pb2.context.close()

    # C8 SPEC 要求的 data-t 选择器覆盖
    required = ["pwa-install-pill", "pwa-install-modal", "pwa-install-action"]
    missing = [s for s in required if s not in SEEN["C"]]
    c["selectors_required"] = required
    c["selectors_seen"] = sorted(SEEN["C"])
    R.check(gid, "C8", "SPEC 要求的 3 个 PWA data-t 选择器全部出现（%d/3）" % (len(required) - len(missing)),
            not missing, "missing=%s" % missing, {"missing": missing})

    res["C"] = c
    res["C_console"] = take(pb)
    pb.context.close()


# ================================================================ D · 回归
def group_d(browser, base, res):
    gid = "D"
    print("\n=== D · 29 个旧玩法回归 + 冒烟 ===")
    pb = open_pb(browser, base)
    ids = js(pb, "GAMES.map(function(g){return g.id})")[0] or []
    old_ids = [i for i in ids if i != "moqi"]
    R.check(gid, "D1", "GAMES 共 30 项且原 29 个 id 全部保留",
            len(ids) == 30 and len(old_ids) == 29,
            "total=%d old=%d ids=%s" % (len(ids), len(old_ids), ids[-4:]))

    baseline = {}
    try:
        bd = json.loads(BASELINE_JSON.read_text(encoding="utf-8"))
        baseline = (bd.get("games") or {}).get("items") or {}
    except Exception:
        baseline = {}

    smoke = {"generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
             "tested_build": str(BUILD), "build_sha256": sha256(BUILD / "index.html"),
             "dist_sha256": sha256(H.DIST / "index.html"),
             "games_total": len(ids), "old_games_total": len(old_ids),
             "baseline_source": "reports/baseline-audit-data.json (V16 d1460e9)",
             "old_games": {}, "problems": [], "console_app": [], "http_4xx": []}
    bad = []
    for gid_ in old_ids:
        clear(pb)
        err, ex = js(pb, "(id)=>{try{startGame(id);return null}catch(e){return String(e&&e.stack||e)}}", gid_)
        pb.page.wait_for_timeout(420)
        st = state(pb)
        t = take(pb)
        rec = {"ok": bool(st.get("game")) and (st.get("gKids") or 0) > 0 and not err and not t["pageerrors"],
               "game": st.get("game"), "gKids": st.get("gKids"), "gTitle": st.get("gTitle"),
               "startErr": err, "pageerrors": t["pageerrors"], "console_app": t["console_app"],
               "http_4xx": t["http"]}
        smoke["old_games"][gid_] = rec
        for h in t["http"]:
            smoke["http_4xx"].append(h)
        for c_ in t["console_app"]:
            smoke["console_app"].append(c_)
        if not rec["ok"]:
            bad.append(gid_)
            R.check(gid, "D2-%s" % gid_, "旧玩法 %s 回归" % gid_, False,
                    "state=%s startErr=%s errors=%s" % (json.dumps({k: st.get(k) for k in ("game", "gKids")}),
                                                        err, t["pageerrors"][:2]))
        H.dismiss_overlays(pb)
        js(pb, "try{v17MoqiStop()}catch(e){};try{goHome()}catch(e){}")
        H.dismiss_overlays(pb)
        pb.page.wait_for_timeout(120)
    R.check(gid, "D2", "29/29 旧玩法渲染、0 新增 pageerror", len(bad) == 0, "失败: %s" % bad,
            {"bad": bad})
    # 与基线对比 kids 是否退化
    regress = []
    for gid_, rec in smoke["old_games"].items():
        b = baseline.get(gid_)
        if b and (rec.get("gKids") or 0) < (b.get("kids") or 0):
            regress.append({"id": gid_, "before": b.get("kids"), "now": rec.get("gKids")})
    R.check(gid, "D2b", "与 V16 基线对比：无玩法渲染内容退化（gKids）", not regress,
            "退化=%s" % regress, {"regress": regress})
    # 旧关键弹窗
    clear(pb)
    modal_bad = []
    for label, code in (("战报", "showPartyReport()"), ("商店", "showShop()"),
                        ("帮助", "showHelp()"), ("难度", "openDiffModal()"),
                        ("夜终仪式", "nightCeremony()")):
        clear(pb)
        js(pb, "try{%s}catch(e){}" % code)
        pb.page.wait_for_timeout(350)
        m = modal(pb)
        t = take(pb)
        if not m.get("shown") or t["pageerrors"] or t["console_app"]:
            modal_bad.append({"label": label, "shown": m.get("shown"),
                              "pageerrors": t["pageerrors"], "console_app": t["console_app"]})
        close_modal(pb)
    R.check(gid, "D3", "旧关键弹窗（战报/商店/帮助/难度/夜终仪式）0 新增 error",
            not modal_bad, json.dumps(modal_bad, ensure_ascii=False)[:300])
    # 存档存量 P1（本局记录入口）在 V17 是否仍存在（预期仍存在，仅记录）
    js(pb, "try{startGame('truth')}catch(e){}")
    pb.page.wait_for_timeout(500)
    logr = js(pb, """()=>{var e=document.querySelector('.ctrl-log-toggle');if(!e)return null;
      var r=e.getBoundingClientRect();return {top:Math.round(r.top),visible:(r.top>=0&&r.bottom<=innerHeight)};}""")[0]
    smoke["known_baseline_p1_log_toggle"] = logr
    shot(pb, "regression/truth-game-390x844")
    js(pb, "try{goHome()}catch(e){}")
    pb.page.wait_for_timeout(250)
    # 截图：首页 + 全部玩法（含 moqi 30 项）
    shot(pb, "regression/home-390x844")
    click(pb, "#v12MoreBtn")
    pb.page.wait_for_timeout(400)
    cnt = js(pb, "document.querySelectorAll('#gameGrid .game-card').length")[0]
    smoke["home_grid_cards"] = cnt
    R.check(gid, "D3b", "首页「全部玩法」网格含 19 张卡（18 旧 + 默契）",
            cnt == 19, "cards=%s" % cnt)
    shot(pb, "regression/home-more-390x844")

    # D5 shellfix 回归（D1 的 P1/P2 修复确认）：本局记录 / 重听 浮标移入 #ctrlBar
    shell = {}
    for (w, h) in ((390, 844), (360, 640), (1280, 800)):
        key = "%dx%d" % (w, h)
        pb2 = open_pb(browser, base, viewport=(w, h))
        js(pb2, "try{startGame('truth')}catch(e){}")
        pb2.page.wait_for_timeout(1000)  # 等页面滑动动画结束（transform 会影响 fixed 子元素测量）
        rect = js(pb2, """()=>{var e=document.querySelector('.ctrl-log-toggle');
          var bar=document.getElementById('ctrlBar');if(!e||!bar)return null;var r=e.getBoundingClientRect();
          var cb=bar.getBoundingClientRect();
          return {inBar:bar.contains(e),top:Math.round(r.top),bottom:Math.round(r.bottom),
            left:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height),
            ctrlBarTop:Math.round(cb.top),innerH:innerHeight,
            visible:(r.top>=0&&r.bottom<=innerHeight&&r.width>0)};}""")[0] or {}
        opened = False
        try:
            pb2.page.click(".ctrl-log-toggle", timeout=3500)
            pb2.page.wait_for_timeout(400)
            opened = bool(js(pb2, "()=>{var d=document.getElementById('logDrawer');return !!(d&&d.className.indexOf('open')>=0);}")[0])
        except Exception:
            opened = False
        vrect = js(pb2, """()=>{try{SET.voice=true;renderCtrl();
          var e=document.getElementById('ctrlVoiceBtn');var bar=document.getElementById('ctrlBar');
          if(!e||!bar)return null;var r=e.getBoundingClientRect();
          return {inBar:bar.contains(e),top:Math.round(r.top),bottom:Math.round(r.bottom),
            visible:(r.top>=0&&r.bottom<=innerHeight&&getComputedStyle(e).display!=='none')};
        }catch(e){return null;}}""")[0] or {}
        shell[key] = {"log": rect, "opened": opened, "voice": vrect}
        R.check(gid, "D5-%s" % key, "%s 本局记录浮标移入 #ctrlBar、可见且点击打开侧栏" % key,
                bool(rect.get("inBar")) and bool(rect.get("visible")) and opened,
                "log=%s opened=%s" % (json.dumps(rect, ensure_ascii=False), opened))
        R.check(gid, "D5b-%s" % key, "%s 念题重听浮标在视口内且位于 #ctrlBar" % key,
                bool(vrect.get("inBar")) and bool(vrect.get("visible")),
                "voice=%s" % json.dumps(vrect, ensure_ascii=False))
        if key == "390x844":
            shot(pb2, "regression/shellfix-log-390x844")
        pb2.context.close()
    R.check(gid, "D5c", "三视口 shellfix 全部通过（D1 P1/P2 已修复）",
            all(v["log"].get("visible") and v["opened"] and v["voice"].get("visible")
                for v in shell.values()),
            json.dumps(shell, ensure_ascii=False)[:400], shell)

    # D6 PWA 安装胶囊置顶（D1 P2 可发现性修复回归）
    pb.page.wait_for_timeout(200)
    pill = js(pb, """()=>{var sb=document.getElementById('setBar');
      var pill=sb?sb.querySelector('[data-t="pwa-install-pill"]'):null;if(!pill||!sb)return null;
      sb.scrollLeft=0;var r=pill.getBoundingClientRect();
      return {first:sb.firstElementChild===pill,
        count:document.querySelectorAll('[data-t="pwa-install-pill"]').length,
        left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),
        innerW:innerWidth,text:pill.textContent,
        visible:(r.left>=0&&r.right<=innerWidth&&r.width>0)};}""")[0] or {}
    R.check(gid, "D6", "「📲 装到桌面」胶囊位于 #setBar 第一位、首屏无需横滑可见",
            bool(pill.get("first")) and pill.get("count") == 1 and bool(pill.get("visible")),
            "pill=%s" % json.dumps(pill, ensure_ascii=False), pill)
    shot(pb, "pwa/pill-first-390x844")

    # D7 集成产物 ES5 静态扫描（D1 P2-5 回归）
    idx_txt = strip_comments((BUILD / "index.html").read_text(encoding="utf-8"))
    bt = chr(96)
    bad_syntax = {}
    for label, pat in (("?.", r"\?\."), ("??", r"\?\?"), ("=>", r"=>"),
                       ("template`", re.escape(bt)), ("let/const", r"\b(let|const)\s")):
        n = len(re.findall(pat, idx_txt))
        if n:
            bad_syntax[label] = n
    R.check(gid, "D7", "集成 index.html 无 ES2020+ 语法（?. / ?? / => / 模板串 / let/const）",
            not bad_syntax, "found=%s" % bad_syntax, {"found": bad_syntax})

    smoke["problems"] = bad
    smoke["ok"] = not bad and not modal_bad and not smoke["console_app"]
    SMOKE_JSON.write_text(json.dumps(smoke, ensure_ascii=False, indent=1), encoding="utf-8")
    R.check(gid, "D4", "输出 reports/v17-smoke.json（29 旧玩法逐项 + 0 新增 error）",
            SMOKE_JSON.exists() and smoke["ok"],
            "ok=%s problems=%s console=%d" % (smoke["ok"], bad, len(smoke["console_app"])))
    res["D"] = {"bad": bad, "modal_bad": modal_bad, "smoke_ok": smoke["ok"],
                "home_grid_cards": cnt, "log_toggle": logr,
                "console_app": smoke["console_app"][:8],
                "http_4xx": smoke["http_4xx"][:8]}
    res["D_console"] = take(pb)
    pb.context.close()


# ================================================================ E · 横切（主题/视口/兼容）
def group_e(browser, base, res):
    gid = "E"
    print("\n=== E · 三主题 / 三视口 / ES5 兼容 ===")
    e = {}
    # E1 三主题：首页 + moqi 对局 + 回忆册
    pb = open_pb(browser, base)
    for th in ("dark", "light", "sketch"):
        js(pb, "try{setOpt('theme','%s');applyTheme();}catch(e){}" % th)
        pb.page.wait_for_timeout(300)
        st = state(pb)
        ov = st.get("docW", 0) - st.get("innerW", 0)
        R.check(gid, "E1-%s" % th, "%s 主题首页渲染无横向溢出" % th,
                st.get("home") and st.get("tiles") == 6 and ov <= 1,
                "home=%s tiles=%s overflow=%s" % (st.get("home"), st.get("tiles"), ov))
        shot(pb, "theme/home-%s-390x844" % th)
    js(pb, "try{setOpt('theme','dark');applyTheme();}catch(e){}")
    pb.page.wait_for_timeout(200)
    # E1b 三主题下 moqi 结果/入口 & 无 console error
    clear(pb)
    for th in ("dark", "light", "sketch"):
        js(pb, "try{setOpt('theme','%s');applyTheme();startGame('moqi');}catch(e){}" % th)
        pb.page.wait_for_timeout(400)
        ok = bool(js(pb, "!!document.querySelector('[data-t=\"moqi-entry\"]')")[0])
        R.check(gid, "E1b-%s" % th, "%s 主题 moqi 入口可渲染" % th, ok)
        if th == "sketch":
            shot(pb, "theme/moqi-entry-sketch-390x844")
    js(pb, "try{setOpt('theme','dark');applyTheme();}catch(e){}")
    R.check(gid, "E1c", "三主题切换过程无 pageerror/console error",
            not take(pb)["pageerrors"] and not take(pb)["console_app"],
            "errors=%s console=%s" % (take(pb)["pageerrors"][:2], take(pb)["console_app"][:2]))
    pb.context.close()

    # E2 三视口：首页 6 tiles + moqi 对局 + 回忆册 无横向溢出
    for (w, h) in ((390, 844), (360, 640), (1280, 800)):
        key = "%dx%d" % (w, h)
        pb = open_pb(browser, base, viewport=(w, h))
        st = state(pb)
        R.check(gid, "E2-%s" % key, "%s 首页 6 张主角卡且无横向溢出" % key,
                st.get("home") and st.get("tiles") == 6
                and st.get("docW", 0) - st.get("innerW", 0) <= 1,
                "tiles=%s overflow=%s" % (st.get("tiles"), st.get("docW", 0) - st.get("innerW", 0)))
        shot(pb, "viewport/home-%s" % key)
        js(pb, "try{startGame('moqi')}catch(e){}")
        pb.page.wait_for_timeout(400)
        click(pb, '[data-t="moqi-mode-heart"]')
        click(pb, '[data-t="moqi-start"]')
        pb.page.wait_for_timeout(400)
        mst = state(pb)
        mov = js(pb, "document.documentElement.scrollWidth-innerWidth")[0]
        R.check(gid, "E2b-%s" % key, "%s 心有灵犀对局渲染且无横向溢出" % key,
                bool(js(pb, "!!document.querySelector('[data-t=\"moqi-heart-play\"]')")[0]) and (mov or 0) <= 1,
                "overflow=%s" % mov)
        shot(pb, "viewport/moqi-heart-%s" % key)
        js(pb, "try{v17MemOpen()}catch(e){}")
        pb.page.wait_for_timeout(400)
        body_ov = js(pb, """()=>{var b=document.querySelector('#v17MemSheet .v17mem-body');
          return b?b.scrollWidth-b.clientWidth:-999;}""")[0]
        R.check(gid, "E2c-%s" % key, "%s 回忆册抽屉无横向溢出" % key, (body_ov or 0) <= 1,
                "body_overflow=%s" % body_ov)
        shot(pb, "viewport/memory-%s" % key)
        pb.context.close()

    # E3 新代码 ES5 兼容静态检查（4 个 feature + 集成产物 index.html，均去注释后扫描）
    feat_dir = ROOT / "v17" / "features"
    bt = chr(96)
    pats = (("?.", r"\?\."), ("??", r"\?\?"), ("=>", r"=>"),
            ("template`", re.escape(bt)), ("let/const", r"\b(let|const)\s"))
    problems = []
    feat_files = sorted(feat_dir.glob("*.js"))
    ev5 = {}
    for f in feat_files:
        txt = strip_comments(f.read_text(encoding="utf-8"))
        hits = {}
        for label, pat in pats:
            n = len(re.findall(pat, txt))
            if n:
                hits[label] = n
        ev5[f.name] = hits
        if hits:
            problems.append("%s: %s" % (f.name, hits))
    idx5 = {}
    idx_txt2 = strip_comments((BUILD / "index.html").read_text(encoding="utf-8"))
    for label, pat in pats:
        n = len(re.findall(pat, idx_txt2))
        if n:
            idx5[label] = n
    if idx5:
        problems.append("index.html: %s" % idx5)
    # 字符串方法抽查（只扫 feature）
    for f in feat_files:
        txt = strip_comments(f.read_text(encoding="utf-8"))
        if re.search(r"\.includes\(|\.startsWith\(|\.endsWith\(|Array\.from\(", txt):
            problems.append("%s: ES6+ 方法" % f.name)
    e["es5_scan"] = {"features": ev5, "index_html": idx5, "problems": problems}
    R.check(gid, "E3", "4 个 feature + 集成 index.html 均无 ES2020+ 语法（去注释扫描）",
            not problems, "; ".join(problems)[:300], e["es5_scan"])
    # 注入后整页无 pageerror（misc）
    pb = open_pb(browser, base, settle=1600)
    t = take(pb)
    R.check(gid, "E3b", "集成产物首页加载 0 pageerror / 0 应用级 console error",
            not t["pageerrors"] and not t["console_app"],
            "errors=%s console=%s" % (t["pageerrors"][:2], t["console_app"][:2]))
    R.check(gid, "E3c", "无 4xx 资源（manifest/sw/icons 全部 200）",
            not t["http"], json.dumps(t["http"][:5], ensure_ascii=False))
    res["E_console"] = take(pb)
    pb.context.close()
    res["E"] = e


# ================================================================ 汇总
def build_meta(tested_dir, port):
    meta = {
        "title": "V17 验收原始数据（D2）",
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "tested_dir": str(tested_dir),
        "dist_dir": str(H.DIST),
        "tested_build_sha256": sha256(tested_dir / "index.html"),
        "dist_sha256": sha256(H.DIST / "index.html"),
        "same_as_dist": sha256(tested_dir / "index.html") == sha256(H.DIST / "index.html"),
        "branch": None, "head": None, "port": port, "python": sys.version.split()[0],
    }
    try:
        import subprocess
        meta["branch"] = subprocess.run(["git", "-C", str(ROOT), "branch", "--show-current"],
                                        capture_output=True, text=True, timeout=10).stdout.strip()
        meta["head"] = subprocess.run(["git", "-C", str(ROOT), "rev-parse", "--short", "HEAD"],
                                      capture_output=True, text=True, timeout=10).stdout.strip()
    except Exception as e:
        meta["git_error"] = str(e)
    return meta


def aggregate_console(res):
    agg = {"app": [], "resource": [], "http_4xx": []}
    for key, t in res.items():
        if not (key.endswith("_console") and isinstance(t, dict)):
            continue
        for c in t.get("console_app") or []:
            agg["app"].append({"scenario": key, "type": c["type"], "text": c["text"]})
        for c in t.get("console_res") or []:
            agg["resource"].append({"scenario": key, "type": c["type"], "text": c["text"]})
        for h in t.get("http") or []:
            agg["http_4xx"].append(h)
    dedup = {}
    for c in agg["app"]:
        k = (c["type"], c["text"])
        dedup[k] = dedup.get(k, 0) + 1
    agg["app_dedup"] = [{"type": k[0], "text": k[1], "count": v} for k, v in dedup.items()]
    return agg


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8801)
    ap.add_argument("--dist", default=str(BUILD))
    ap.add_argument("--only", default="", help="a,b,c,d,e")
    args = ap.parse_args()
    only = {x.strip().lower() for x in args.only.split(",") if x.strip()}
    tested = pathlib.Path(args.dist).resolve()
    print("[D2] 被测目录: %s" % tested)

    from playwright.sync_api import sync_playwright

    t0 = time.time()
    res = {"meta": {}, "checks": [], "issues": [], "observations": [], "shots": [],
           "evidence": {}}
    groups = [("a", group_a), ("b", group_b), ("c", group_c), ("d", group_d), ("e", group_e)]
    with H.serve(directory=tested, port=args.port) as base:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            for gid, fn in groups:
                if only and gid not in only:
                    continue
                try:
                    fn(browser, base, res)
                except Exception as e:
                    import traceback
                    traceback.print_exc()
                    R.issue("P0", "测试分组 %s 崩溃" % gid.upper(), "%s: %s" % (type(e).__name__, e),
                            "python qa/test_v17.py --only %s" % gid, gid=gid.upper())
            browser.close()

    res["meta"] = build_meta(tested, args.port)
    res["checks"] = R.checks
    res["issues"] = R.issues
    res["observations"] = R.observations
    res["evidence"] = R.evidence
    res["shots"] = [rel(s) for s in SHOTS_TAKEN]
    res["console_agg"] = aggregate_console(res)
    res["summary"] = {
        "checks": len(R.checks),
        "passed": sum(1 for c in R.checks if c["ok"]),
        "failed": sum(1 for c in R.checks if not c["ok"]),
        "issues_P0": sum(1 for i in R.issues if i["severity"] == "P0"),
        "issues_P1": sum(1 for i in R.issues if i["severity"] == "P1"),
        "elapsed_sec": round(time.time() - t0, 1),
    }
    OUT_JSON.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    print("\n" + "=" * 74)
    print("D2 汇总: %s" % json.dumps(res["summary"], ensure_ascii=False))
    print("build==dist: %s" % res["meta"].get("same_as_dist"))
    if R.issues:
        for i in R.issues:
            print("  [%s] %s" % (i["severity"], i["title"]))
    print("数据: %s" % OUT_JSON)
    print("冒烟: %s" % SMOKE_JSON)
    print("截图: %d 张 -> %s" % (len(SHOTS_TAKEN), SHOTS))
    print("=" * 74)
    return res


if __name__ == "__main__":
    main()
