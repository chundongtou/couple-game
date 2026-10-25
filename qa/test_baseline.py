#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""D1 · V16 基线 QA 审计（Playwright 自动化）

用法:
  python qa/test_baseline.py               # 全量（约 2-4 分钟）
  python qa/test_baseline.py --only s2     # 只跑某组（s1..s7，可逗号分隔）
  python qa/test_baseline.py --port 8808   # 换端口

产物:
  reports/baseline-audit-data.json       # 结构化原始数据（报告引用的证据）
  reports/screenshots/baseline/*.png     # 证据截图

测试分组:
  S0 首屏加载（网络 404 / console warning / pageerror，区分应用级与资源级）
  S1 首页（4 主角入口 / 全部玩法展开 / 设置条 / CTA）
  S2 29 个 GAMES 入口逐个 startGame + 29 个 ? 规则弹窗
  S3 关键弹窗流程（战报/夜终仪式/海报/商店/帮助/难度/主题/本局记录/成就墙/地图/剧本/开场三步）
  S4 三视口（390x844 / 360x640 / 1280x800）
  S5 三主题（dark/light/sketch）
  S6 数据持久化（完成一次任务 → 刷新 → couple-* 仍在）
  S7 首次打开的两个自动弹窗（夜间开场 / 新手引导）

纪律: 每个分组用全新 browser context（干净 localStorage）；除 S7 外默认 seed=True（抑制开场弹窗）。
"""
import argparse
import json
import pathlib
import subprocess
import sys
import time

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))
import harness as H  # noqa: E402

BASE_SHOTS = H.SHOTS / "baseline"
for _sub in ("", "games", "modals", "themes", "viewport", "persist", "firstrun"):
    (BASE_SHOTS / _sub).mkdir(parents=True, exist_ok=True)
OUT_JSON = H.REPORTS / "baseline-audit-data.json"

SEED_JS = (
    "try{localStorage.setItem('couple-onboarded','1');"
    "if(!localStorage.getItem('couple-night'))"
    "localStorage.setItem('couple-night',JSON.stringify({d:new Date().toDateString()}));}catch(e){}"
)


# ---------------------------------------------------------------- 基础设施
class Rec:
    """收集 checks / issues / observations。"""

    def __init__(self):
        self.checks = []
        self.issues = []
        self.observations = []

    def check(self, sid, name, ok, detail="", data=None):
        c = {"sid": sid, "name": name, "ok": bool(ok), "detail": str(detail or "")}
        if data is not None:
            c["data"] = data
        self.checks.append(c)
        tag = "PASS" if ok else "FAIL"
        line = "  %s %-46s" % (tag, name)
        if (not ok) and detail:
            line += " | " + str(detail)[:220]
        print(line)
        return c

    def issue(self, severity, title, symptom, repro, shot=None, suggestion="交 Lead 决策", sid=""):
        it = {
            "sid": sid,
            "severity": severity,
            "title": title,
            "symptom": symptom,
            "repro": repro,
            "shot": shot,
            "suggestion": suggestion,
        }
        self.issues.append(it)
        print("  [ISSUE %s] %s" % (severity, title))
        return it

    def obs(self, text, severity="P2", data=None, sid=""):
        o = {"sid": sid, "severity": severity, "text": text}
        if data is not None:
            o["data"] = data
        self.observations.append(o)
        print("  [OBS %s] %s" % (severity, text))
        return o


R = Rec()
SHOTS_TAKEN = []


def shot(pb, name):
    p = H.shot(pb, "baseline/" + name)
    if p:
        SHOTS_TAKEN.append(p)
    return p


def rel_shot(p):
    """绝对路径 -> 相对仓库根的 posix 路径（报告里用）。"""
    if not p:
        return None
    try:
        return str(pathlib.Path(p).resolve().relative_to(ROOT)).replace("\\", "/")
    except Exception:
        return str(p)


def open_pb(browser, base, viewport=(390, 844), mobile=None, seed=True,
            init_scripts=None, settle=900, dismiss=True):
    """全新 context（干净 localStorage）+ console/pageerror/http 收集。"""
    if mobile is None:
        mobile = viewport[0] < 800
    ctx = browser.new_context(
        viewport={"width": viewport[0], "height": viewport[1]},
        device_scale_factor=3 if mobile else 1,
        is_mobile=mobile,
        has_touch=mobile,
        locale="zh-CN",
        timezone_id="Asia/Shanghai",
        color_scheme="dark",
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
    pb.page.goto(base, wait_until="load", timeout=30000)
    if settle:
        pb.page.wait_for_timeout(settle)
    if dismiss:
        H.dismiss_overlays(pb)
        pb.page.wait_for_timeout(120)
    return pb


def clear(pb):
    for k in ("console", "errors", "http", "failed"):
        pb.logs[k].clear()


NOISE = ("Failed to load resource", "net::ERR", "ERR_FAILED", "Failed to load")


def take(pb):
    t = {
        "pageerrors": list(pb.logs["errors"]),
        "console": list(pb.logs["console"]),
        "http": list(pb.logs["http"]),
        "failed": list(pb.logs["failed"]),
    }
    t["console_app"] = [c for c in t["console"] if not any(x in c["text"] for x in NOISE)]
    t["console_res"] = [c for c in t["console"] if any(x in c["text"] for x in NOISE)]
    return t


STATE_JS = """()=>{
  var act=function(id){var e=document.getElementById(id);return !!(e&&(' '+e.className+' ').indexOf(' active ')>=0)};
  var c=document.getElementById('gContent');
  var mm=document.getElementById('modalMask');
  return {home:act('homePage'),game:act('gamePage'),run:act('runPage'),script:act('scriptPage'),
    gKids:c?c.children.length:-1,gLen:c?c.innerText.length:-1,
    gTitle:(document.getElementById('gTitle')||{}).textContent||'',
    bodyLen:(document.body.innerText||'').length,
    docW:document.documentElement.scrollWidth,docH:document.documentElement.scrollHeight,
    innerW:innerWidth,innerH:innerHeight,
    modalShown:!!(mm&&(' '+mm.className+' ').indexOf(' show ')>=0)};
}"""

MODAL_JS = """()=>{
  var m=document.getElementById('modalMask'),b=document.getElementById('modalBox');
  return {shown:!!(m&&(' '+m.className+' ').indexOf(' show ')>=0),
    len:b?b.innerHTML.length:-1,
    text:b?(b.innerText||'').replace(/\\s+/g,' ').slice(0,500):'',
    h3:(b&&b.querySelector('h3'))?b.querySelector('h3').textContent:''};
}"""

LS_DUMP_JS = """()=>{
  var o={};
  for(var i=0;i<localStorage.length;i++){
    var k=localStorage.key(i);
    if(k&&k.indexOf('couple-')===0){
      try{o[k]=JSON.parse(localStorage.getItem(k));}catch(e){o[k]=localStorage.getItem(k);}
    }
  }
  return o;
}"""

OVERFLOW_JS = """()=>{
  var bad=[];
  var all=document.querySelectorAll('body *');
  for(var i=0;i<all.length;i++){
    var e=all[i];
    var st=getComputedStyle(e);
    if(st.display==='none'||st.visibility==='hidden'||st.position==='fixed')continue;
    var r=e.getBoundingClientRect();
    if(r.width>0&&r.right>innerWidth+1.5){
      bad.push({tag:e.tagName,cls:String(e.className||'').slice(0,60),right:Math.round(r.right)});
      if(bad.length>=12)break;
    }
  }
  return {overflow:document.documentElement.scrollWidth-innerWidth,bad:bad};
}"""


def js(pb, code, arg=None):
    """执行 JS 并返回 (结果, 异常文本)。"""
    try:
        if arg is None:
            return pb.page.evaluate(code), None
        return pb.page.evaluate(code, arg), None
    except Exception as e:
        return None, str(e)


def modal(pb):
    m, _ = js(pb, MODAL_JS)
    return m or {"shown": False, "len": -1, "text": "", "h3": ""}


def state(pb):
    s, _ = js(pb, STATE_JS)
    return s or {}


def close_modal(pb):
    js(pb, "try{closeModal()}catch(e){}")
    pb.page.wait_for_timeout(80)


def go_home(pb):
    js(pb, "try{closeModal()}catch(e){};try{goHome()}catch(e){}")
    pb.page.wait_for_timeout(220)
    H.dismiss_overlays(pb)
    pb.page.wait_for_timeout(100)


def click_modal_btn(pb, text):
    """在弹窗内点击含指定文案的按钮，返回是否点中。"""
    try:
        pb.page.click("#modalBox button:has-text('%s')" % text, timeout=2500)
        pb.page.wait_for_timeout(260)
        return True
    except Exception:
        return False


def click_modal_text(pb, text):
    """弹窗内点击：优先 button，其次 .m-item（难度档位等 div 可点项）。"""
    for sel in ("#modalBox button:has-text('%s')" % text,
                "#modalBox .m-item:has-text('%s')" % text,
                "#modalBox .script-book-card button:has-text('%s')" % text):
        try:
            pb.page.click(sel, timeout=1500)
            pb.page.wait_for_timeout(280)
            return True
        except Exception:
            continue
    return False


def open_and_check_modal(pb, sid, name, js_code, must_contain=None, shot_name=None,
                         severity="P1", repro=None, keep=False):
    """打开一个弹窗并做基础断言；失败自动记 issue。keep=True 则保留弹窗供后续点击。"""
    clear(pb)
    err, ex = js(pb, "()=>{try{%s}catch(e){return 'EXC:'+e.message}return null}" % js_code)
    pb.page.wait_for_timeout(300)
    m = modal(pb)
    t = take(pb)
    ok = bool(m["shown"]) and m["len"] > 20 and not t["pageerrors"] and not err
    detail = ""
    if err:
        detail = "调用异常: %s" % str(err)[:160]
    elif not m["shown"]:
        detail = "弹窗未出现(.shown=false) 调用返回=%r" % (ex,)
    elif m["len"] <= 20:
        detail = "弹窗内容为空 len=%s" % m["len"]
    elif t["pageerrors"]:
        detail = "pageerror: %s" % t["pageerrors"][:2]
    if must_contain and ok and must_contain not in m["text"]:
        ok = False
        detail = "弹窗文案缺少「%s」; 实际=%s" % (must_contain, m["text"][:120])
    R.check(sid, name, ok, detail, {"h3": m["h3"], "len": m["len"]})
    sp = None
    if shot_name:
        sp = rel_shot(shot(pb, shot_name))
    if not ok:
        R.issue(severity, "%s无反应/异常" % name,
                detail,
                repro or ("页面内执行 %s" % js_code),
                shot=sp, suggestion="修（关键入口）",
                sid=sid)
    if not keep:
        close_modal(pb)
    return ok, m, t


# ---------------------------------------------------------------- S0 首屏加载
def s0_load(browser, base, res):
    """首屏加载：pageerror / console error+warning / HTTP>=400（区分应用级与资源级）。"""
    sid = "S0"
    print("\n=== S0 首屏加载网络/控制台 ===")
    pb = open_pb(browser, base, settle=1500, dismiss=False)
    t = take(pb)
    perf = js(pb, """()=>{
      var n=performance.getEntriesByType('navigation')[0]||{};
      var r=performance.getEntriesByType('resource')||[];
      return {domContentLoaded:Math.round(n.domContentLoadedEventEnd||0),
        loadEvent:Math.round(n.loadEventEnd||0),
        resources:r.length,
        resourceUrls:r.map(function(x){return x.name.split('/').pop();}).slice(0,30)};
    }""")[0] or {}
    R.check(sid, "首屏加载无 pageerror", not t["pageerrors"],
            "pageerrors=%s" % t["pageerrors"][:3], {"pageerrors": t["pageerrors"]})
    R.check(sid, "首屏加载无应用级 console error/warning", not t["console_app"],
            "console_app=%s" % t["console_app"][:4], {"console_app": t["console_app"]})
    res["load"] = {"pageerrors": t["pageerrors"], "console": t["console"],
                   "console_app": t["console_app"], "console_res": t["console_res"],
                   "http_4xx": t["http"], "failed": t["failed"], "perf": perf}
    res["s0_console"] = t
    if t["console_app"]:
        R.issue("P0", "首屏加载出现应用级 JS 错误",
                json.dumps(t["console_app"][:4], ensure_ascii=False),
                "全新 context 打开首页", sid=sid)
    if t["console_res"] or t["http"]:
        R.obs("首屏资源请求 404/失败（V16 基线缺少 PWA 资源，属 V17 功能 C 待补）: http=%s console_res=%s" % (
            json.dumps(t["http"][:8], ensure_ascii=False), json.dumps(t["console_res"][:4], ensure_ascii=False)),
            severity="P2", data={"http": t["http"], "console_res": t["console_res"]}, sid=sid)
    pb.context.close()


# ---------------------------------------------------------------- S1 首页
def s1_home(browser, base, res):
    sid = "S1"
    print("\n=== S1 首页 / 4 主角入口 / 全部玩法 / 设置条 ===")
    pb = open_pb(browser, base)
    t_load = take(pb)
    st = state(pb)
    grid_n = js(pb, "document.getElementById('gameGrid').children.length")[0]
    R.check(sid, "首页渲染（homePage.active & 非白屏）",
            st.get("home") and st.get("bodyLen", 0) > 200 and (grid_n or 0) >= 15
            and js(pb, "(document.getElementById('v12Cta')||{}).textContent||''")[0],
            "state=%s gridKids=%s" % (json.dumps({k: st.get(k) for k in ("home", "bodyLen", "docW", "innerW")},
                                                 ensure_ascii=False), grid_n))
    home = js(pb, """()=>{
      var out={};
      out.gridKids=document.getElementById('gameGrid').children.length;
      out.visibleGames=GAMES.filter(function(g){return !g.hidden;}).length;
      out.allGames=GAMES.length;
      out.tiles=Array.prototype.map.call(document.querySelectorAll('.v12-tile'),function(e){
        return {text:e.innerText.replace(/\\s+/g,' ').trim(),onclick:e.getAttribute('onclick')||''};});
      out.setBarKids=document.getElementById('setBar').children.length;
      out.setBarText=document.getElementById('setBar').innerText.replace(/\\s+/g,' ').trim();
      out.setBarItems=Array.prototype.map.call(document.querySelectorAll('#setBar .tb-item'),function(e){
        return e.innerText.replace(/\\s+/g,' ').trim();});
      var sb=document.getElementById('setBar');
      out.setBarScrollW=sb?sb.scrollWidth:0;
      out.setBarClientW=sb?sb.clientWidth:0;
      out.setBarOverflowX=sb?getComputedStyle(sb).overflowX:'';
      out.cta=(document.getElementById('v12Cta')||{}).textContent||'';
      out.names=(document.getElementById('cpNames')||{}).innerText||'';
      out.moreBtn=(document.getElementById('v12MoreBtn')||{}).textContent||'';
      out.moreOn=document.getElementById('v12MoreBody')?(' '+document.getElementById('v12MoreBody').className+' ').indexOf(' on ')>=0:false;
      out.shownPush=document.getElementById('v12MoreBody')?getComputedStyle(document.getElementById('v12MoreBody')).display:'';
      out.title=document.title;
      return out;}""")[0] or {}
    res["home"] = home
    R.check(sid, "全部 GAMES 注册数=29", home.get("allGames") == 29,
            "allGames=%s (SPECS 旧文写 26，实际以代码为准)" % home.get("allGames"))
    R.check(sid, "4 个主角入口卡片", len(home.get("tiles") or []) == 4,
            "tiles=%s" % [x.get("text") for x in (home.get("tiles") or [])],
            home.get("tiles"))
    want_tiles = {"v15Intro": "今夜地图", "startGame('night')": "主题之夜",
                  "startGame('flight')": "飞行棋", "v16Intro": "剧本之夜"}
    tile_ok = True
    for x in home.get("tiles") or []:
        if not any(k in x.get("onclick", "") for k in want_tiles):
            tile_ok = False
    R.check(sid, "主角卡绑定 v15Intro/night/flight/v16Intro", tile_ok,
            "onclick=%s" % [x.get("onclick") for x in (home.get("tiles") or [])])
    R.check(sid, "设置条 presence（#setBar 项数>=15）", home.get("setBarKids", 0) >= 15,
            "setBarKids=%s items=%s" % (home.get("setBarKids"), (home.get("setBarItems") or [])[:6]),
            {"setBarKids": home.get("setBarKids"), "setBarItems": home.get("setBarItems")})
    ov = js(pb, OVERFLOW_JS)[0] or {}
    R.check(sid, "390 首屏无横向溢出", ov.get("overflow", 99) <= 1,
            "overflow=%s bad=%s" % (ov.get("overflow"), ov.get("bad")[:4]), ov)
    R.check(sid, "首页加载无 pageerror", not t_load["pageerrors"],
            "pageerrors=%s" % t_load["pageerrors"][:3], {"pageerrors": t_load["pageerrors"]})
    shot1 = rel_shot(shot(pb, "home-390x844"))

    # 全部玩法展开（真实点击）
    clear(pb)
    pb.page.click("#v12MoreBtn")
    pb.page.wait_for_timeout(400)
    more = js(pb, """()=>{var b=document.getElementById('v12MoreBody');
      var cards=document.querySelectorAll('#gameGrid .game-card');
      return {on:b?(' '+b.className+' ').indexOf(' on ')>=0:false,
        display:b?getComputedStyle(b).display:'',
        cards:cards.length,
        btn:(document.getElementById('v12MoreBtn')||{}).textContent||'',
        firstCard:(cards[0]||{}).innerText||''};}""")[0] or {}
    t_more = take(pb)
    R.check(sid, "「全部玩法」展开（.on + 卡片可见）",
            more.get("on") and more.get("display") != "none" and more.get("cards", 0) >= 15,
            "more=%s" % json.dumps(more, ensure_ascii=False)[:260], more)
    R.check(sid, "展开全部玩法后无 pageerror/console error",
            not t_more["pageerrors"] and not t_more["console_app"],
            "errors=%s console=%s" % (t_more["pageerrors"], t_more["console_app"][:3]))
    ov2 = js(pb, OVERFLOW_JS)[0] or {}
    R.check(sid, "展开后无横向溢出", ov2.get("overflow", 99) <= 1,
            "overflow=%s bad=%s" % (ov2.get("overflow"), ov2.get("bad")[:4]), ov2)
    more_shot = rel_shot(shot(pb, "home-more-390x844"))
    pb.page.click("#v12MoreBtn")
    pb.page.wait_for_timeout(250)

    # 4 个主角入口：真实点击
    clear(pb)
    pb.page.click(".v12-tile:nth-child(1)")
    pb.page.wait_for_timeout(450)
    m = modal(pb)
    t = take(pb)
    ok = m["shown"] and "今夜地图" in m["text"]
    R.check(sid, "点击「今夜地图」→ 弹窗", ok,
            "h3=%r text=%r errors=%s" % (m["h3"], m["text"][:80], t["pageerrors"][:2]))
    map_modal_shot = rel_shot(shot(pb, "modals/v15-map-intro-390x844"))
    if not ok:
        R.issue("P1", "主角卡「今夜地图」点击无弹窗", "modal=%s" % json.dumps(m, ensure_ascii=False)[:200],
                "首页点击 .v12-tile:nth-child(1)", shot=map_modal_shot, sid=sid)
    close_modal(pb)

    for idx, nm, expect in ((1, "主题之夜", "game"), (2, "飞行棋", "game")):
        clear(pb)
        pb.page.click(".v12-tile:nth-child(%d)" % (idx + 1))
        pb.page.wait_for_timeout(600)
        s = state(pb)
        t = take(pb)
        ok = s.get("game") and s.get("gKids", 0) > 0 and not t["pageerrors"]
        R.check(sid, "点击「%s」→ 游戏页渲染" % nm, ok,
                "game=%s gKids=%s gTitle=%r errors=%s" % (s.get("game"), s.get("gKids"), s.get("gTitle"), t["pageerrors"][:2]))
        sp = rel_shot(shot(pb, "games/home-tile-%s-390x844" % ("night" if idx == 1 else "flight")))
        if not ok:
            R.issue("P0", "主角卡「%s」无法进入游戏页" % nm,
                    "state=%s errors=%s" % (json.dumps(s, ensure_ascii=False)[:160], t["pageerrors"][:2]),
                    "首页点击 .v12-tile 第 %d 张" % (idx + 1), shot=sp, sid=sid)
        go_home(pb)

    clear(pb)
    pb.page.click(".v12-tile:nth-child(4)")
    pb.page.wait_for_timeout(500)
    m = modal(pb)
    cards = js(pb, "document.querySelectorAll('#modalBox .script-book-card').length")[0]
    t = take(pb)
    ok = m["shown"] and "剧本之夜" in m["text"] and (cards or 0) >= 3
    R.check(sid, "点击「剧本之夜」→ 3 本剧本架", ok,
            "h3=%r cards=%s errors=%s" % (m["h3"], cards, t["pageerrors"][:2]))
    script_shot = rel_shot(shot(pb, "modals/v16-script-shelf-390x844"))
    if not ok:
        R.issue("P1", "主角卡「剧本之夜」弹窗异常", "h3=%r cards=%s" % (m["h3"], cards),
                "首页点击 .v12-tile:nth-child(4)", shot=script_shot, sid=sid)
    close_modal(pb)

    # CTA
    clear(pb)
    pb.page.click("#v12Cta")
    pb.page.wait_for_timeout(500)
    s = state(pb)
    m = modal(pb)
    t = take(pb)
    cta_ok = (m["shown"] and "今夜地图" in m["text"]) or (s.get("game") and s.get("gKids", 0) > 0)
    R.check(sid, "CTA「开始今晚」有响应", cta_ok,
            "modal=%s state=%s" % (m["h3"], json.dumps({k: s.get(k) for k in ("game", "run")})))
    out = {"cta": "modal:" + (m["h3"] or "") if m["shown"] else ("gamePage" if s.get("game") else "none")}
    close_modal(pb)

    # 设置条真实点击：音效胶囊 + 主题胶囊（其余弹窗在 S3 覆盖）
    go_home(pb)
    clear(pb)
    sound0 = js(pb, "SET.sound")[0]
    try:
        pb.page.click("#setBar .tb-item:has-text('音效')", timeout=2500)
    except Exception:
        pass
    pb.page.wait_for_timeout(300)
    sound1 = js(pb, "SET.sound")[0]
    persisted = js(pb, "JSON.parse(localStorage.getItem('couple-set')||'{}').sound")[0]
    R.check(sid, "设置条「音效」点击切换并落库",
            sound0 != sound1 and persisted == sound1 and not take(pb)["pageerrors"],
            "before=%s after=%s persisted=%s" % (sound0, sound1, persisted))
    if sound0 == sound1:
        R.issue("P1", "设置条「🔊 音效」点击无反应", "SET.sound 未变化", "首页点击设置条音效胶囊", sid=sid)

    clear(pb)
    theme0 = js(pb, "SET.theme")[0]
    try:
        pb.page.click("#setBar .tb-item:has-text('🌓')", timeout=2500)
    except Exception:
        pass
    pb.page.wait_for_timeout(350)
    theme1 = js(pb, "SET.theme")[0]
    cls1 = js(pb, "document.body.className")[0] or ""
    R.check(sid, "设置条「主题」点击切换（dark→light/…）",
            theme0 != theme1 and theme1 in cls1,
            "before=%s after=%s class=%r" % (theme0, theme1, cls1))
    if theme0 == theme1:
        R.issue("P1", "设置条「🌓 主题」点击无反应", "SET.theme 未变化", "首页点击设置条主题胶囊", sid=sid)
    js(pb, "try{setOpt('theme','dark');applyTheme();renderSettings();}catch(e){}")
    pb.page.wait_for_timeout(200)
    out["settings"] = {"sound": [sound0, sound1], "theme": [theme0, theme1]}
    res["s1"] = {"load": t_load, "more": more, "moreBtn": more.get("btn"),
                 "cta": out["cta"], "settings": out["settings"],
                 "shots": [shot1, more_shot, map_modal_shot, script_shot]}
    res["s1_console"] = take(pb)
    pb.context.close()


# ---------------------------------------------------------------- S2 29 个 GAMES
def s2_games(browser, base, res):
    sid = "S2"
    print("\n=== S2 29 个 GAMES 入口逐个 startGame ===")
    pb = open_pb(browser, base)
    ids = js(pb, "GAMES.map(function(g){return g.id})")[0] or []
    res["games"] = {"total": len(ids), "items": {}, "rules_fail": []}
    reps = {"wheelhub": "games/wheelhub-390x844", "flight": "games/flight-390x844",
            "night": "games/night-390x844", "escalate": "games/escalate-390x844"}
    bad = []
    for gid in ids:
        clear(pb)
        err, ex = js(pb, "(id)=>{try{startGame(id);return null}catch(e){return String(e&&e.stack||e)}}", gid)
        pb.page.wait_for_timeout(420)
        s = state(pb)
        t = take(pb)
        rec = {
            "game": s.get("game"), "gKids": s.get("gKids"), "gLen": s.get("gLen"),
            "gTitle": s.get("gTitle"), "bodyLen": s.get("bodyLen"),
            "startErr": err, "evalEx": ex,
            "pageerrors": t["pageerrors"], "console_app": t["console_app"],
        }
        ok = bool(s.get("game")) and s.get("gKids", 0) > 0 and not err and not t["pageerrors"]
        rec["ok"] = ok
        rec["shot"] = rel_shot(shot(pb, reps[gid])) if gid in reps else None
        res["games"]["items"][gid] = rec
        if not ok:
            bad.append(gid)
            detail = "game=%s gKids=%s startErr=%s pageerrors=%s" % (
                s.get("game"), s.get("gKids"), err, t["pageerrors"][:2])
            R.check(sid, "startGame(%s) 渲染" % gid, False, detail)
            R.issue("P0" if not s.get("game") else "P1",
                    "startGame(%s) 未正常渲染" % gid, detail,
                    "page.evaluate(\"startGame('%s')\")" % gid, shot=rec["shot"], sid=sid)
        else:
            print("  PASS startGame(%s) gKids=%-3s title=%s" % (gid, s.get("gKids"), s.get("gTitle")))
        H.dismiss_overlays(pb)
        js(pb, "try{goHome()}catch(e){}")
        H.dismiss_overlays(pb)
        pb.page.wait_for_timeout(120)
    R.check(sid, "29/29 个 GAMES 入口渲染", len(bad) == 0, "失败: %s" % bad, {"bad": bad})

    # 29 个 ? 规则弹窗
    rules_bad = []
    for gid in ids:
        clear(pb)
        err, _ = js(pb, "(id)=>{try{showRules(id);return null}catch(e){return String(e)}}", gid)
        pb.page.wait_for_timeout(120)
        m = modal(pb)
        t = take(pb)
        if err or not m["shown"] or m["len"] < 20 or t["pageerrors"]:
            rules_bad.append({"id": gid, "err": err, "shown": m["shown"], "len": m["len"],
                              "pageerrors": t["pageerrors"]})
        close_modal(pb)
    res["games"]["rules_fail"] = rules_bad
    R.check(sid, "29/29 个 ? 规则弹窗", not rules_bad, "失败: %s" % json.dumps(rules_bad[:4], ensure_ascii=False))
    if rules_bad:
        R.issue("P1", "部分玩法「?」规则弹窗无反应",
                json.dumps(rules_bad[:5], ensure_ascii=False),
                "首页玩法卡点击右上角 ? / showRules(gid)", sid=sid)

    # 首页卡片 ? 按钮真实点击（需先展开「全部玩法」）
    clear(pb)
    ok_click = True
    err_note = ""
    try:
        pb.page.click("#v12MoreBtn", timeout=3000)
        pb.page.wait_for_timeout(400)
        pb.page.click("#gameGrid .game-card .g-help", timeout=3000)
        pb.page.wait_for_timeout(350)
    except Exception as e:
        ok_click = False
        err_note = str(e)[:200]
    m = modal(pb)
    t = take(pb)
    R.check(sid, "首页卡片「?」真实点击弹规则", ok_click and m["shown"] and not t["pageerrors"],
            "click=%s shown=%s note=%s pageerrors=%s" % (ok_click, m["shown"], err_note, t["pageerrors"][:2]))
    close_modal(pb)
    res["s2_console"] = take(pb)
    pb.context.close()


# ---------------------------------------------------------------- S3 关键弹窗流程
def s3_modals(browser, base, res):
    sid = "S3"
    print("\n=== S3 关键弹窗流程 ===")
    pb = open_pb(browser, base)
    out = {}
    shots = {}

    # 先造一点本晚数据（真实任务路径在 S6，这里为战报提供数字）
    js(pb, """try{
        logEvent('💋 测试：亲吻对方 10 秒');
        v12TaskDone('💋 测试：亲吻对方 10 秒');
        coinAdd(5); heatUp();
        v12UnlockAch('first'); v12UnlockAch('combo5');
      }catch(e){}""")
    pb.page.wait_for_timeout(300)

    ok, m, t = open_and_check_modal(pb, sid, "本晚战报（showPartyReport）",
                                    "showPartyReport()", "今晚纪念卡",
                                    shot_name="modals/party-report-390x844",
                                    repro="页内执行 showPartyReport()", keep=True)
    out["report"] = {"ok": ok, "text": m["text"][:300]}
    if ok:
        nums = js(pb, """()=>{var P=JSON.parse(localStorage.getItem('couple-party')||'{}');
          return {tasks:P.tasks||0,games:P.games||0,coins:coinGet(),heat:getHeat()};}""")[0] or {}
        R.check(sid, "战报数字与 localStorage 一致",
                str(nums.get("tasks")) in m["text"] and str(nums.get("games")) in m["text"],
                "local=%s" % nums, nums)

    # 夜终仪式（从战报点真实按钮进入）
    clear(pb)
    clicked = click_modal_btn(pb, "夜终仪式")
    m = modal(pb)
    t = take(pb)
    ok = clicked and m["shown"] and "夜终仪式" in m["text"] and not t["pageerrors"]
    R.check(sid, "战报→「夜终仪式」按钮", ok,
            "clicked=%s h3=%r errors=%s" % (clicked, m["h3"], t["pageerrors"][:2]))
    if not ok:
        R.issue("P1", "战报内「夜终仪式」按钮无反应", "clicked=%s h3=%r" % (clicked, m["h3"]),
                "showPartyReport() 后点击弹窗内「🌙 夜终仪式」", sid=sid)
    ach = js(pb, "document.querySelectorAll('#modalBox .ach-chip').length")[0]
    R.check(sid, "成就墙（夜终仪式内 .ach-chip）", (ach or 0) >= 2,
            "ach-chips=%s (v12AchWallHtml 真实入口=夜终仪式/剧本结局，无独立成就弹窗)" % ach,
            {"chips": ach})
    shots["ceremony"] = rel_shot(shot(pb, "modals/night-ceremony-390x844"))

    # 海报（点击仪式里的真实按钮，等 canvas->dataURL）
    clear(pb)
    clicked = click_modal_btn(pb, "生成今晚战报海报")
    pb.page.wait_for_timeout(1200)
    poster = js(pb, """()=>{var img=document.querySelector('#modalBox img');
      return {hasImg:!!img,srcLen:img?(img.getAttribute('src')||'').length:0,
        isPng:!!(img&&(img.getAttribute('src')||'').indexOf('data:image/png')===0),
        poster:(window._v11Poster||'').length,
        h3:(document.querySelector('#modalBox h3')||{}).textContent||''};}""")[0] or {}
    t = take(pb)
    ok = clicked and poster.get("isPng") and poster.get("poster", 0) > 10000 and not t["pageerrors"]
    R.check(sid, "夜终海报生成（canvas→data:image/png）", ok,
            "clicked=%s %s errors=%s" % (clicked, json.dumps(poster, ensure_ascii=False), t["pageerrors"][:2]),
            poster)
    shots["poster"] = rel_shot(shot(pb, "modals/night-poster-390x844"))
    if not ok:
        R.issue("P1", "夜终战报海报无法生成", json.dumps(poster, ensure_ascii=False),
                "showPartyReport→夜终仪式→点击「🎨 生成今晚战报海报」", shot=shots["poster"], sid=sid)
    close_modal(pb)

    # 商店
    ok, m, t = open_and_check_modal(pb, sid, "商店（showShop）", "showShop()", "爱币商店",
                                    shot_name="modals/shop-390x844")
    out["shop"] = {"ok": ok, "black": "黑市" in m["text"]}
    # 帮助
    ok, m, t = open_and_check_modal(pb, sid, "帮助（showHelp）", "showHelp()", "新手指南",
                                    shot_name="modals/help-390x844")
    # 难度
    ok, m, t = open_and_check_modal(pb, sid, "难度弹窗（openDiffModal）", "openDiffModal()", "全局难度",
                                    shot_name="modals/diff-390x844", keep=True)
    if ok:
        clicked = click_modal_text(pb, "Lv2")
        d = js(pb, "({diff:SET.diff, saved:(JSON.parse(localStorage.getItem('couple-set')||'{}').diff)})")[0] or {}
        R.check(sid, "难度切换到 Lv2 并落库", clicked and d.get("diff") == 2 and d.get("saved") == 2,
                "clicked=%s data=%s" % (clicked, d), d)
        if not (clicked and d.get("diff") == 2):
            R.issue("P1", "难度档位点击无反应", "clicked=%s data=%s" % (clicked, d),
                    "openDiffModal()→点击「Lv2 暧昧甜撩」", sid=sid)
        close_modal(pb)

    # 主题切换（三态）
    clear(pb)
    themes = {}
    for _ in range(3):
        js(pb, "try{toggleSet('theme')}catch(e){}")
        pb.page.wait_for_timeout(220)
        themes[js(pb, "SET.theme")[0]] = js(pb, "document.body.className")[0]
    R.check(sid, "主题 toggleSet 三态切换（dark/light/sketch）",
            set(themes.keys()) == {"dark", "light", "sketch"},
            "主题序列=%s" % themes, themes)
    for th in ("dark", "light", "sketch"):
        js(pb, "setOpt('theme','%s');applyTheme()" % th)
        pb.page.wait_for_timeout(250)
        cls = js(pb, "document.body.className")[0] or ""
        bg = js(pb, "getComputedStyle(document.body).backgroundColor")[0]
        R.check(sid, "主题 %s 生效（body class）" % th,
                (th == "dark" and "light" not in cls and "sketch" not in cls) or th in cls,
                "class=%r bg=%s" % (cls, bg))
    out["themes_cycle"] = themes
    # 恢复 dark（后面地图/剧本/记录截图统一用默认主题）
    js(pb, "try{setOpt('theme','dark');applyTheme();renderSettings();}catch(e){}")
    pb.page.wait_for_timeout(250)

    # 本局记录侧栏（先测入口可见性，再直接调用 toggleLog 验证面板本身）
    go_home(pb)
    js(pb, "try{startGame('truth')}catch(e){}")
    pb.page.wait_for_timeout(500)
    js(pb, "try{logEvent('💋 测试记录 A');logEvent('🍷 测试记录 B');}catch(e){}")
    pb.page.wait_for_timeout(200)
    entry = js(pb, """()=>{var el=document.querySelector('.ctrl-log-toggle');
      if(!el)return {found:false};
      var r=el.getBoundingClientRect();
      return {found:true,top:Math.round(r.top*10)/10,bottom:Math.round(r.bottom*10)/10,
        left:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height),
        innerH:innerHeight,innerW:innerWidth,
        visible:(r.top>=0&&r.bottom<=innerHeight&&r.width>0&&r.height>0),
        pos:getComputedStyle(el).position,
        offsetParent:el.offsetParent?(el.offsetParent.id||el.offsetParent.className):null};}""")[0] or {}
    R.check(sid, "「📜 本局记录」入口在视口内可点", bool(entry.get("visible")),
            "rect=%s 视口=%sx%s" % (json.dumps(entry, ensure_ascii=False),
                                    entry.get("innerW"), entry.get("innerH")), entry)
    shot_game_nolog = rel_shot(shot(pb, "modals/gamepage-log-entry-390x844"))
    if not entry.get("visible"):
        R.issue("P1", "游戏页「📜 本局记录」入口渲染在视口外（用户无法点击）",
                "元素 .ctrl-log-toggle 实测 rect=%s（视口 %sx%s），CSS 为 position:absolute;right:8px;top:-26px，"
                "相对 #gamePage 定位后落在顶部视口外；Playwright 真实点击报 element is outside of the viewport。"
                % (json.dumps(entry, ensure_ascii=False), entry.get("innerW"), entry.get("innerH")),
                "startGame('truth') → 找 .ctrl-log-toggle 的 getBoundingClientRect()；或尝试点击该元素",
                shot=shot_game_nolog,
                suggestion="修（P1：核心入口不可达；可把该按钮移入 #ctrlBar 或改用 fixed/bottom 定位）", sid=sid)

    clear(pb)
    js(pb, "try{toggleLog()}catch(e){}")
    pb.page.wait_for_timeout(350)
    log = js(pb, """()=>{var d=document.getElementById('logDrawer');
      return {open:d?(' '+d.className+' ').indexOf(' open ')>=0:false,
        text:d?(d.innerText||'').replace(/\\s+/g,' ').slice(0,200):''};}""")[0] or {}
    t = take(pb)
    ok = log.get("open") and "测试记录" in log.get("text", "") and not t["pageerrors"]
    R.check(sid, "「本局记录」侧栏内容（toggleLog 调用）", ok,
            "open=%s text=%r errors=%s" % (log.get("open"), log.get("text")[:100], t["pageerrors"][:2]))
    shots["log"] = rel_shot(shot(pb, "modals/log-drawer-390x844"))
    if not ok:
        R.issue("P1", "「📜 本局记录」侧栏无内容/异常", json.dumps(log, ensure_ascii=False),
                "游戏页执行 toggleLog()", shot=shots["log"], sid=sid)
    js(pb, "try{toggleLog()}catch(e){}")
    pb.page.wait_for_timeout(150)

    # 念题模式「🔊 重听」按钮可见性（与 .ctrl-log-toggle 同族 CSS：position:absolute;top:-52px）
    clear(pb)
    js(pb, "try{SET.voice=true;renderCtrl();}catch(e){}")
    pb.page.wait_for_timeout(350)
    voice = js(pb, """()=>{var e=document.getElementById('ctrlVoiceBtn');if(!e)return null;
      var r=e.getBoundingClientRect();
      return {top:Math.round(r.top),bottom:Math.round(r.bottom),
        display:getComputedStyle(e).display,
        visible:(r.top>=0&&r.bottom<=innerHeight&&getComputedStyle(e).display!=='none')};}""")[0]
    R.check(sid, "念题模式「🔊 重听」按钮在视口内可点", bool(voice and voice.get("visible")),
            "rect=%s（CSS .ctrl-voice-toggle top:-52px，相对 #gamePage）" % json.dumps(voice, ensure_ascii=False),
            voice)
    out["voice_toggle"] = voice
    if not (voice and voice.get("visible")):
        R.issue("P2", "念题模式「🔊 重听」按钮渲染在视口外（同 log-toggle 定位问题）",
                "开启念题后 #ctrlVoiceBtn 实测 rect=%s，CSS 为 .ctrl-voice-toggle{position:absolute;top:-52px}"
                % json.dumps(voice, ensure_ascii=False),
                "startGame('truth') → SET.voice=true;renderCtrl() → 量 #ctrlVoiceBtn rect",
                suggestion="不修 / 交 Lead 决策（与 P1 本局记录入口同源，可一起改）", sid=sid)
    js(pb, "try{SET.voice=false;renderCtrl();}catch(e){}")
    pb.page.wait_for_timeout(150)

    # 游戏页内的额外弹窗入口
    for label, code, must in (
        ("卡包（showCardPack）", "showCardPack()", None),
        ("身份（showIdentity）", "showIdentity()", None),
        ("秘密（showSecrets）", "showSecrets()", None),
        ("精力（showEnergy）", "showEnergy()", None),
    ):
        ok, m, t = open_and_check_modal(pb, sid, label, code, must)

    # 首页内的额外弹窗入口
    go_home(pb)
    for label, code, must in (
        ("题库管理（showCustom）", "showCustom()", "自定义"),
        ("黑名单（showBlacklist）", "showBlacklist()", None),
        ("整晚导演（showDirector）", "showDirector()", None),
        ("今晚契约（showContract）", "showContract()", None),
    ):
        ok, m, t = open_and_check_modal(pb, sid, label, code, must)
    # 还债：空数据时按设计只 toast（非弹窗）
    clear(pb)
    js(pb, "try{showDebt()}catch(e){}")
    pb.page.wait_for_timeout(250)
    toast = js(pb, "(document.getElementById('toast')||{}).textContent||''")[0] or ""
    R.check(sid, "还债（无欠债时 toast 提示而非空弹窗）", "欠债" in toast or "暂无" in toast,
            "toast=%r" % toast)

    # 今夜地图（v15Intro → 生成地图）
    go_home(pb)
    clear(pb)
    js(pb, "try{v15Intro()}catch(e){}")
    pb.page.wait_for_timeout(300)
    m = modal(pb)
    ok_intro = m["shown"] and "今夜地图" in m["text"]
    clicked = click_modal_btn(pb, "生成今晚地图")
    pb.page.wait_for_timeout(800)
    s = state(pb)
    run = js(pb, """()=>{var b=document.getElementById('runBody');
      return {nodes:document.querySelectorAll('#runBody .run-node').length,
        len:b?(b.innerText||'').length:0,
        title:(document.getElementById('runTitle')||{}).textContent||''};}""")[0] or {}
    t = take(pb)
    ok = ok_intro and clicked and s.get("run") and (run.get("nodes") or 0) > 0 and not t["pageerrors"]
    R.check(sid, "今夜地图：intro 弹窗→生成地图→runPage 渲染", ok,
            "intro=%s clicked=%s run=%s nodes=%s errors=%s" % (
                ok_intro, clicked, s.get("run"), run.get("nodes"), t["pageerrors"][:2]),
            run)
    shots["map"] = rel_shot(shot(pb, "modals/v15-map-run-390x844"))
    if not ok:
        R.issue("P1", "今夜地图无法生成/渲染", json.dumps({"intro": ok_intro, "clicked": clicked, "run": run}, ensure_ascii=False),
                "首页点击「今夜地图」→ 点击「▶ 生成今晚地图」", shot=shots["map"], sid=sid)
    go_home(pb)

    # 剧本之夜（v16Intro → 进入氛围版）
    clear(pb)
    js(pb, "try{v16Intro()}catch(e){}")
    pb.page.wait_for_timeout(350)
    m = modal(pb)
    shelf = js(pb, "document.querySelectorAll('#modalBox .script-book-card').length")[0]
    opened = False
    try:
        pb.page.click("#modalBox .script-book-card:first-child button:first-child", timeout=2500)
        pb.page.wait_for_timeout(700)
        opened = True
    except Exception:
        pass
    s = state(pb)
    script = js(pb, """()=>{var b=document.getElementById('scriptBody');
      return {len:b?(b.innerText||'').length:0,
        title:(document.querySelector('#scriptPage h1')||{}).textContent||'',
        btns:document.querySelectorAll('#scriptBody button').length};}""")[0] or {}
    t = take(pb)
    ok = m["shown"] and (shelf or 0) == 3 and opened and s.get("script") and script.get("len", 0) > 100
    R.check(sid, "剧本之夜：3 本剧本架→进入剧本页渲染", ok,
            "shelf=%s opened=%s script=%s len=%s errors=%s" % (
                shelf, opened, s.get("script"), script.get("len"), t["pageerrors"][:2]), script)
    shots["script"] = rel_shot(shot(pb, "modals/v16-script-play-390x844"))
    if not ok:
        R.issue("P1", "剧本之夜无法进入玩法", json.dumps({"shelf": shelf, "opened": opened, "script": script}, ensure_ascii=False),
                "首页点击「剧本之夜」→ 点第一本「🌙 氛围版」", shot=shots["script"], sid=sid)
    pb.page.evaluate("try{goHome()}catch(e){}")
    pb.page.wait_for_timeout(300)
    H.dismiss_overlays(pb)

    # 夜间开场三步（手动调用：seed=True 时自动弹窗被抑制，这里验证流程本身）
    clear(pb)
    js(pb, "try{localStorage.removeItem('couple-night')}catch(e){}")
    js(pb, "try{showNightIntro()}catch(e){}")
    pb.page.wait_for_timeout(300)
    m1 = modal(pb)
    b1 = click_modal_btn(pb, "用默认")
    m2 = modal(pb)
    b2 = click_modal_btn(pb, "第一次见")
    m3 = modal(pb)
    b3 = click_modal_btn(pb, "今晚不赌")
    pb.page.wait_for_timeout(300)
    night = js(pb, "JSON.parse(localStorage.getItem('couple-night')||'{}')")[0] or {}
    m4 = modal(pb)
    t = take(pb)
    ok = (m1["shown"] and "今晚开场" in m1["text"] and b1 and "第2步" in m2["text"]
          and b2 and "第3步" in m3["text"] and b3 and not m4["shown"]
          and night.get("d") == js(pb, "new Date().toDateString()")[0] and not t["pageerrors"])
    R.check(sid, "夜间开场三步流程（昵称→起点→赌约）", ok,
            "steps=%s%s%s night.d=%s errors=%s" % (m1["shown"], m2["shown"], m3["shown"],
                                                   night.get("d"), t["pageerrors"][:2]))
    shots["night_intro"] = rel_shot(shot(pb, "modals/night-intro-step1-390x844")) if not ok else shots.get("night_intro")

    res["s3"] = out
    res["s3_shots"] = shots
    res["s3_console"] = take(pb)
    pb.context.close()


# ---------------------------------------------------------------- S4 三视口
def s4_viewports(browser, base, res):
    sid = "S4"
    print("\n=== S4 三视口 ===")
    res["viewports"] = {}
    for (w, h) in ((390, 844), (360, 640), (1280, 800)):
        key = "%dx%d" % (w, h)
        print("  -- %s --" % key)
        pb = open_pb(browser, base, viewport=(w, h))
        clear(pb)
        st = state(pb)
        ov = js(pb, OVERFLOW_JS)[0] or {}
        home = js(pb, """()=>{var tiles=document.querySelectorAll('.v12-tile');
          var sb=document.getElementById('setBar');
          var grid=document.getElementById('gameGrid');
          return {tiles:tiles.length,setBarKids:sb?sb.children.length:0,
            gridKids:grid?grid.children.length:0,
            cta:(document.getElementById('v12Cta')||{}).textContent||'',
            docW:document.documentElement.scrollWidth,innerW:innerWidth,
            docH:document.documentElement.scrollHeight,innerH:innerHeight};}""")[0] or {}
        t = take(pb)
        ok_home = st.get("home") and home.get("tiles") == 4 and home.get("setBarKids", 0) >= 15 and not t["pageerrors"]
        R.check(sid, "%s 首页渲染" % key, ok_home,
                "state=%s home=%s errors=%s" % (json.dumps({k: st.get(k) for k in ("home", "bodyLen")}),
                                                json.dumps(home, ensure_ascii=False)[:180], t["pageerrors"][:2]))
        ok_ov = ov.get("overflow", 99) <= 1
        R.check(sid, "%s 首页无横向溢出" % key, ok_ov,
                "overflow=%s bad=%s" % (ov.get("overflow"), ov.get("bad")[:5]), ov)
        shot_home = rel_shot(shot(pb, "viewport/home-%s" % key))
        if not ok_ov:
            R.issue("P2", "%s 首页出现横向溢出" % key,
                    "scrollWidth=%s innerWidth=%s 越界元素=%s" % (
                        home.get("docW"), home.get("innerW"), json.dumps(ov.get("bad")[:6], ensure_ascii=False)),
                    "playwright viewport=%s 打开首页" % key, shot=shot_home, suggestion="修（移动端体验）", sid=sid)

        # 展开全部玩法
        pb.page.click("#v12MoreBtn")
        pb.page.wait_for_timeout(350)
        ov2 = js(pb, OVERFLOW_JS)[0] or {}
        m = js(pb, """()=>{var b=document.getElementById('v12MoreBody');
          return {on:b?(' '+b.className+' ').indexOf(' on ')>=0:false};}""")[0] or {}
        R.check(sid, "%s 展开全部玩法" % key, m.get("on") and ov2.get("overflow", 99) <= 1,
                "on=%s overflow=%s bad=%s" % (m.get("on"), ov2.get("overflow"), ov2.get("bad")[:4]))
        shot_more = rel_shot(shot(pb, "viewport/home-more-%s" % key))

        # 触控目标尺寸（仅移动视口有意义；在「全部玩法」展开状态下量卡片）
        sizes = js(pb, """()=>{
          var q=function(s){var e=document.querySelector(s);if(!e)return null;
            var r=e.getBoundingClientRect();var cs=getComputedStyle(e);
            return {w:Math.round(r.width),h:Math.round(r.height),fs:cs.fontSize};};
          return {cta:q('#v12Cta'),tile:q('.v12-tile'),tb:q('#setBar .tb-item'),
                  card:q('#gameGrid .game-card'),more:q('#v12MoreBtn')};}""")[0] or {}
        if w < 800:
            small = {k: v for k, v in sizes.items()
                     if v and v.get("w", 0) > 0 and v.get("h", 99) < 44}
            R.check(sid, "%s 主要触控目标高度>=44px" % key, not small,
                    "低于44px: %s" % json.dumps(small, ensure_ascii=False), sizes)
            if small:
                R.obs("%s 触控目标高度不足 44px（现有 V12 设置条）: %s" % (
                    key, ", ".join("%s=%spx" % (k, v["h"]) for k, v in small.items())),
                    severity="P2", data=small, sid=sid)
        pb.page.click("#v12MoreBtn")
        pb.page.wait_for_timeout(200)

        # 游戏页
        js(pb, "try{startGame('wheelhub')}catch(e){}")
        pb.page.wait_for_timeout(550)
        ov3 = js(pb, OVERFLOW_JS)[0] or {}
        s2 = state(pb)
        t = take(pb)
        log_toggle = js(pb, """()=>{var e=document.querySelector('.ctrl-log-toggle');
          if(!e)return null;var r=e.getBoundingClientRect();
          return {top:Math.round(r.top*10)/10,bottom:Math.round(r.bottom*10)/10,
            visible:(r.top>=0&&r.bottom<=innerHeight&&r.width>0&&r.height>0)};}""")[0]
        R.check(sid, "%s 游戏页渲染且无横向溢出" % key,
                s2.get("game") and s2.get("gKids", 0) > 0 and ov3.get("overflow", 99) <= 1 and not t["pageerrors"],
                "game=%s gKids=%s overflow=%s errors=%s" % (
                    s2.get("game"), s2.get("gKids"), ov3.get("overflow"), t["pageerrors"][:2]))
        shot_game = rel_shot(shot(pb, "viewport/game-wheelhub-%s" % key))
        res["viewports"][key] = {"home": home, "overflow": ov, "overflow_more": ov2,
                                 "overflow_game": ov3, "sizes": sizes,
                                 "log_toggle": log_toggle,
                                 "shots": {"home": shot_home, "more": shot_more, "game": shot_game}}
        res["s4_console"] = take(pb) if key == "1280x800" else res.get("s4_console", {})
        pb.context.close()


# ---------------------------------------------------------------- S5 三主题
def s5_themes(browser, base, res):
    sid = "S5"
    print("\n=== S5 三主题 ===")
    pb = open_pb(browser, base)
    res["themes"] = {}
    for th in ("dark", "light", "sketch"):
        clear(pb)
        js(pb, "try{setOpt('theme','%s');applyTheme();}catch(e){}" % th)
        pb.page.wait_for_timeout(350)
        info = js(pb, """()=>{var b=document.body;var cs=getComputedStyle(b);
          var ink=getComputedStyle(document.querySelector('.v12-hero .names')||b).color;
          return {cls:b.className,bg:cs.backgroundColor,color:cs.color,ink:ink,
            scrollW:document.documentElement.scrollWidth,innerW:innerWidth,
            saved:(JSON.parse(localStorage.getItem('couple-set')||'{}').theme)||''};}""")[0] or {}
        t = take(pb)
        expect_cls = (th != "dark") and (th in (info.get("cls") or "")) or (th == "dark" and "light" not in (info.get("cls") or "") and "sketch" not in (info.get("cls") or ""))
        R.check(sid, "主题 %s 应用（class/持久化）" % th,
                expect_cls and info.get("saved") == th and not t["pageerrors"],
                "cls=%r saved=%r bg=%s errors=%s" % (info.get("cls"), info.get("saved"), info.get("bg"), t["pageerrors"][:2]),
                info)
        R.check(sid, "主题 %s 无横向溢出" % th, info.get("scrollW", 9999) - info.get("innerW", 0) <= 1,
                "scrollW=%s innerW=%s" % (info.get("scrollW"), info.get("innerW")))
        res["themes"][th] = {"info": info,
                             "shot": rel_shot(shot(pb, "themes/home-%s-390x844" % th))}
        if not expect_cls:
            R.issue("P2", "主题 %s 未正确应用" % th, json.dumps(info, ensure_ascii=False),
                    "页内执行 setOpt('theme','%s');applyTheme()" % th, shot=res["themes"][th]["shot"], sid=sid)

    # light 主题下的游戏页
    js(pb, "try{setOpt('theme','light');applyTheme();startGame('truth')}catch(e){}")
    pb.page.wait_for_timeout(600)
    s = state(pb)
    t = take(pb)
    ov = js(pb, OVERFLOW_JS)[0] or {}
    R.check(sid, "light 主题游戏页渲染", s.get("game") and s.get("gKids", 0) > 0 and ov.get("overflow", 99) <= 1 and not t["pageerrors"],
            "game=%s gKids=%s overflow=%s errors=%s" % (s.get("game"), s.get("gKids"), ov.get("overflow"), t["pageerrors"][:2]))
    res["themes"]["light_game"] = {"shot": rel_shot(shot(pb, "themes/game-light-390x844"))}

    # 主题持久化：刷新后仍生效
    pb.page.reload(wait_until="load")
    pb.page.wait_for_timeout(1000)
    H.dismiss_overlays(pb)
    cls = js(pb, "document.body.className")[0] or ""
    saved = js(pb, "(JSON.parse(localStorage.getItem('couple-set')||'{}').theme)||''")[0]
    R.check(sid, "主题刷新后持久化（light）", "light" in cls and saved == "light",
            "cls=%r saved=%r" % (cls, saved))
    res["themes"]["reload_shot"] = rel_shot(shot(pb, "themes/reload-light-390x844"))
    res["s5_console"] = take(pb)
    pb.context.close()


# ---------------------------------------------------------------- S6 数据持久化
def s6_persistence(browser, base, res):
    sid = "S6"
    print("\n=== S6 数据持久化（完成一局任务→刷新） ===")
    pb = open_pb(browser, base)
    # 真实路径：进入玩法页 → 点底部「✅ 完成」按钮
    js(pb, "try{startGame('truth')}catch(e){}")
    pb.page.wait_for_timeout(600)
    click_ok = True
    try:
        pb.page.click("#ctrlBar button:has-text('完成')", timeout=3000)
    except Exception:
        click_ok = False
    pb.page.wait_for_timeout(1000)  # 等 v12ChainOffer 等异步
    H.dismiss_overlays(pb)
    js(pb, "try{logEvent('💋 持久化测试：完成任务');}catch(e){}")
    js(pb, "try{setOpt('theme','light');applyTheme();}catch(e){}")
    pb.page.wait_for_timeout(300)
    before = js(pb, LS_DUMP_JS)[0] or {}
    ui_before = js(pb, """()=>({heat:(document.getElementById('v12ValHeat')||{}).textContent||'',
      combo:(document.getElementById('v12ValCombo')||{}).textContent||'',
      coins:(document.getElementById('setBar')||{innerText:''}).innerText.indexOf('💰')>=0})""")[0] or {}

    # 刷新
    clear(pb)
    pb.page.reload(wait_until="load")
    pb.page.wait_for_timeout(1200)
    H.dismiss_overlays(pb)
    after = js(pb, LS_DUMP_JS)[0] or {}
    ui_after = js(pb, """()=>({
      heat:(document.getElementById('v12ValHeat')||{}).textContent||'',
      setBar:(document.getElementById('setBar')||{innerText:''}).innerText.replace(/\\s+/g,' ').slice(0,300),
      nightState:(document.getElementById('v12NightState')||{}).textContent||'',
      cls:document.body.className,
      homeActive:!!(document.getElementById('homePage')&&(' '+document.getElementById('homePage').className+' ').indexOf(' active ')>=0)})""")[0] or {}
    t = take(pb)
    res["persistence"] = {"before": before, "after": after, "ui_before": ui_before,
                          "ui_after": ui_after, "click_done": click_ok,
                          "pageerrors": t["pageerrors"], "console_app": t["console_app"]}

    R.check(sid, "点击底部「✅ 完成」有响应（无异常）", click_ok,
            "click 完成按钮失败（可能按钮被遮挡）")
    if not click_ok:
        R.issue("P1", "底部「✅ 完成」按钮无法点击", "Playwright 3s 超时",
                "startGame('truth') 后点击 #ctrlBar 「✅ 完成」", sid=sid)
    p = before.get("couple-party") or {}
    h = before.get("couple-heat") or {}
    c = before.get("couple-coins") or {}
    ts = before.get("couple-tstats") or {}
    R.check(sid, "完成任务后写入本晚战报 couple-party.tasks>=1", (p.get("tasks") or 0) >= 1,
            "party=%s" % json.dumps(p, ensure_ascii=False))
    R.check(sid, "完成任务后热度 couple-heat.v>=1", (h.get("v") or 0) >= 1,
            "heat=%s" % json.dumps(h, ensure_ascii=False))
    R.check(sid, "完成任务后亲密币 couple-coins.v>=5", (c.get("v") or 0) >= 5,
            "coins=%s" % json.dumps(c, ensure_ascii=False))
    R.check(sid, "任务统计 couple-tstats.done>=1", (ts.get("done") or 0) >= 1,
            "tstats=%s" % json.dumps(ts, ensure_ascii=False))

    # 刷新后
    same_keys = [k for k in before if k in after]
    lost = [k for k in before if k not in after]
    changed = [k for k in before if k in after and json.dumps(before[k], sort_keys=True) != json.dumps(after[k], sort_keys=True)]
    R.check(sid, "刷新后 couple-* 键全部保留", not lost,
            "丢失=%s" % lost, {"beforeKeys": sorted(before.keys()), "lost": lost})
    R.check(sid, "刷新后关键数值一致", not changed,
            "变化=%s" % [(k, before[k], after[k]) for k in changed][:5], {"changed": changed[:8]})
    R.check(sid, "刷新后首页 HUD 显示热度>=1", str((after.get("couple-heat") or {}).get("v") or 0) in (ui_after.get("heat") or "")
            and (ui_after.get("heat") or "0") not in ("", "0"),
            "heatUI=%r 期望>=1" % ui_after.get("heat"))
    R.check(sid, "刷新后 couple-game-played 含 truth",
            "truth" in (after.get("couple-game-played") or []),
            "played=%s" % (after.get("couple-game-played") or [])[:8])
    R.check(sid, "刷新后主题 couple-set.theme=light 且 body.light 生效",
            (after.get("couple-set") or {}).get("theme") == "light" and "light" in (ui_after.get("cls") or ""),
            "set=%s cls=%r" % ((after.get("couple-set") or {}).get("theme"), ui_after.get("cls")))
    R.check(sid, "刷新后首页正常渲染且无 pageerror",
            ui_after.get("homeActive") and not t["pageerrors"],
            "home=%s errors=%s" % (ui_after.get("homeActive"), t["pageerrors"][:2]))
    res["persistence"]["shot"] = rel_shot(shot(pb, "persist/after-reload-390x844"))
    if lost or changed or t["pageerrors"]:
        R.issue("P1", "刷新后数据丢失/变化或报错",
                "lost=%s changed=%s errors=%s" % (lost, [(k,) for k in changed][:4], t["pageerrors"][:2]),
                "完成任务→page.reload()→对比 localStorage", shot=res["persistence"]["shot"], sid=sid)
    res["s6_console"] = take(pb)
    pb.context.close()


# ---------------------------------------------------------------- S7 首次打开自动弹窗
def s7_first_run(browser, base, res):
    sid = "S7"
    print("\n=== S7 首次打开自动弹窗 ===")
    res["first_run"] = {}

    # 7.1 完全新用户：夜间开场自动弹（renderHome 后 ~400ms）
    pb = open_pb(browser, base, seed=False, settle=1400, dismiss=False)
    m = modal(pb)
    t = take(pb)
    ok = m["shown"] and "今晚开场" in m["text"]
    R.check(sid, "首次打开自动弹「夜间开场」", ok,
            "shown=%s h3=%r text=%r errors=%s" % (m["shown"], m["h3"], m["text"][:80], t["pageerrors"][:2]))
    s_night = rel_shot(shot(pb, "firstrun/night-intro-390x844"))
    res["first_run"]["night_intro"] = {"h3": m["h3"], "text": m["text"][:160], "shot": s_night}
    if not ok:
        R.issue("P1", "首次打开未自动弹「夜间开场」", json.dumps(m, ensure_ascii=False)[:200],
                "全新 context（无 localStorage）打开页面，等 1.4s", shot=s_night, sid=sid)
    # 走完三步
    b1 = click_modal_btn(pb, "用默认")
    b2 = click_modal_btn(pb, "已经暧昧")
    b3 = click_modal_btn(pb, "今晚不赌")
    pb.page.wait_for_timeout(350)
    m2 = modal(pb)
    night = js(pb, "JSON.parse(localStorage.getItem('couple-night')||'{}')")[0] or {}
    R.check(sid, "夜间开场三步可走完并写 couple-night",
            b1 and b2 and b3 and not m2["shown"] and night.get("d"),
            "clicks=%s%s%s shown=%s night=%s" % (b1, b2, b3, m2["shown"], json.dumps(night)))
    t = take(pb)
    R.check(sid, "夜间开场流程无 JS error", not t["pageerrors"], "errors=%s" % t["pageerrors"][:3])
    cons_night = t
    pb.context.close()

    # 7.2 已开局但未引导：新手引导自动弹（renderHome 后 ~600ms）
    only_night = ("try{localStorage.setItem('couple-night',JSON.stringify({d:new Date().toDateString()}));}catch(e){}"
                  "try{localStorage.removeItem('couple-onboarded');}catch(e){}")
    pb = open_pb(browser, base, seed=False, init_scripts=[only_night], settle=1500, dismiss=False)
    m = modal(pb)
    t = take(pb)
    ok = m["shown"] and ("欢迎来到" in m["text"] or "新手" in m["text"])
    R.check(sid, "已开局未引导时自动弹「新手引导」", ok,
            "shown=%s h3=%r text=%r errors=%s" % (m["shown"], m["h3"], m["text"][:80], t["pageerrors"][:2]))
    s_onb = rel_shot(shot(pb, "firstrun/onboard-390x844"))
    res["first_run"]["onboard"] = {"h3": m["h3"], "text": m["text"][:160], "shot": s_onb,
                                   "night": js(pb, "JSON.parse(localStorage.getItem('couple-night')||'{}')")[0],
                                   "nightStarted": js(pb, "try{nightStarted()}catch(e){return 'ERR:'+e.message}")[0]}
    if not ok:
        R.issue("P1", "已开局未引导时未自动弹「新手引导」", json.dumps(m, ensure_ascii=False)[:200],
                "预置 couple-night=今天、无 couple-onboarded，打开页面等 1.5s", shot=s_onb, sid=sid)
    clicked = click_modal_btn(pb, "开始升温")
    onboarded = js(pb, "localStorage.getItem('couple-onboarded')")[0]
    R.check(sid, "新手引导「开始升温」写入 couple-onboarded=1",
            clicked and onboarded == "1", "clicked=%s onboarded=%r" % (clicked, onboarded))
    res["s7_console"] = take(pb)
    pb.context.close()


# ---------------------------------------------------------------- 汇总
def aggregate_console(res):
    """跨分组汇总 error/warning，区分应用级与资源级。"""
    agg = {"app": [], "resource": [], "http_4xx": [], "failed_requests": []}
    for key, t in res.items():
        if not (key.endswith("_console") and isinstance(t, dict)):
            continue
        for c in t.get("console_app") or []:
            agg["app"].append({"scenario": key, "type": c["type"], "text": c["text"]})
        for c in t.get("console_res") or []:
            agg["resource"].append({"scenario": key, "type": c["type"], "text": c["text"]})
        for h in t.get("http") or []:
            agg["http_4xx"].append(h)
        for f in t.get("failed") or []:
            agg["failed_requests"].append(f)
    dedup = {}
    for c in agg["app"]:
        k = (c["type"], c["text"])
        dedup[k] = dedup.get(k, 0) + 1
    agg["app_dedup"] = [{"type": k[0], "text": k[1], "count": v} for k, v in dedup.items()]
    hd = {}
    for h in agg["http_4xx"]:
        p = h["url"].split("?")[0]
        hd[(h["status"], p)] = hd.get((h["status"], p), 0) + 1
    agg["http_dedup"] = [{"status": k[0], "url": k[1], "count": v} for k, v in hd.items()]
    return agg


def build_meta(res, port, distdir=None):
    distdir = pathlib.Path(distdir) if distdir else H.DIST
    meta = {
        "title": "V16 基线审计原始数据（D1）",
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "branch": None,
        "head": None,
        "dist_dir": str(distdir),
        "dist_index_size": None,
        "dist_index_mtime": None,
        "port": port,
        "viewport_default": [390, 844],
        "python": sys.version.split()[0],
    }
    try:
        meta["branch"] = subprocess.run(["git", "-C", str(ROOT), "branch", "--show-current"],
                                        capture_output=True, text=True, timeout=10).stdout.strip()
        meta["head"] = subprocess.run(["git", "-C", str(ROOT), "rev-parse", "--short", "HEAD"],
                                      capture_output=True, text=True, timeout=10).stdout.strip()
        meta["v16_baseline_commit"] = subprocess.run(
            ["git", "-C", str(ROOT), "rev-parse", "--short", "d1460e9"],
            capture_output=True, text=True, timeout=10).stdout.strip()
    except Exception as e:
        meta["git_error"] = str(e)
    d = distdir / "index.html"
    if d.exists():
        meta["dist_index_size"] = d.stat().st_size
        meta["dist_index_mtime"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(d.stat().st_mtime))
    try:
        from playwright.sync_api import sync_playwright  # noqa: F401
        import playwright
        meta["playwright"] = getattr(playwright, "__version__", "unknown")
    except Exception:
        pass
    return meta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8801)
    ap.add_argument("--dist", default=None, help="要审计的静态目录（默认 dist/；基线请用 qa/_baseline_dist）")
    ap.add_argument("--only", default="", help="s1,s2,... 只跑部分分组")
    args = ap.parse_args()
    only = {x.strip().lower() for x in args.only.split(",") if x.strip()}
    distdir = pathlib.Path(args.dist).resolve() if args.dist else H.DIST
    print("[D1] 审计目录: %s" % distdir)

    from playwright.sync_api import sync_playwright

    t0 = time.time()
    res = {"meta": {}, "checks": [], "issues": [], "observations": [], "shots": []}
    groups = [
        ("s0", s0_load), ("s1", s1_home), ("s2", s2_games), ("s3", s3_modals),
        ("s4", s4_viewports), ("s5", s5_themes), ("s6", s6_persistence),
        ("s7", s7_first_run),
    ]
    port = args.port
    with H.serve(directory=distdir, port=port) as base:
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
                    R.issue("P0", "测试分组 %s 崩溃" % gid,
                            "%s: %s" % (type(e).__name__, e),
                            "python qa/test_baseline.py --only %s" % gid, sid=gid.upper())
            browser.close()

    res["meta"] = build_meta(res, port, distdir)
    res["checks"] = R.checks
    res["issues"] = R.issues
    res["observations"] = R.observations
    res["shots"] = [rel_shot(s) for s in SHOTS_TAKEN]
    res["console_agg"] = aggregate_console(res)
    res["summary"] = {
        "checks": len(R.checks),
        "passed": sum(1 for c in R.checks if c["ok"]),
        "failed": sum(1 for c in R.checks if not c["ok"]),
        "issues_P0": sum(1 for i in R.issues if i["severity"] == "P0"),
        "issues_P1": sum(1 for i in R.issues if i["severity"] == "P1"),
        "issues_P2": sum(1 for i in R.issues if i["severity"] == "P2"),
        "elapsed_sec": round(time.time() - t0, 1),
    }
    H.REPORTS.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")

    print("\n" + "=" * 72)
    print("D1 基线审计汇总: %s" % json.dumps(res["summary"], ensure_ascii=False))
    print("失败 checks: %d / %d" % (res["summary"]["failed"], res["summary"]["checks"]))
    if R.issues:
        print("问题清单:")
        for i in R.issues:
            print("  [%s] %s" % (i["severity"], i["title"]))
    print("数据: %s" % OUT_JSON)
    print("截图: %d 张 -> %s" % (len(SHOTS_TAKEN), BASE_SHOTS))
    print("=" * 72)
    return res


if __name__ == "__main__":
    main()
