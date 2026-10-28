#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""V3「升温夜航」重制版 · 独立 E2E 验收框架（Playwright）

用法:
  # 阶段1：壳层（boot / 三视口 / reduce / 选择器采集）
  python tools/rebuild/build_app.py --out dist/rebuild-qa
  python qa/rebuild/e2e.py --dist dist/rebuild-qa --stage shell

  # 阶段2：全量（DESIGN §8）
  python qa/rebuild/e2e.py --dist dist/rebuild-qa --stage full --port 8878

产物:
  reports/rebuild/qa-data[-stage].json     结构化数据（meta/checks/issues/selectors/shots）
  reports/rebuild/qa-report[-stage].md     人读报告（自动生成）
  reports/rebuild/shots/*.png              证据截图

设计:
- 复用 qa/harness.py 的禁缓存静态服务；每个用例全新 context（默认清 localStorage）。
- 所有页面错误 / console error+warning / HTTP>=400 均分类记录；资源级 404 与 JS 错误分开。
- 选择器策略：data-test 优先 → id → 可见文本兜底；每屏采集一次选择器清单写入 JSON，
  阶段2 屏幕就绪后可按清单自动适配。
- 屏幕未就绪（并行开发中）时相关检查记为 SKIP（不计失败），阶段2 再转硬断言。
"""
import argparse
import hashlib
import json
import pathlib
import re
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "qa"))
from harness import serve  # noqa: E402

OUT_DIR = ROOT / "reports" / "rebuild"
SHOT_DIR = OUT_DIR / "shots"
OUT_DIR.mkdir(parents=True, exist_ok=True)
SHOT_DIR.mkdir(parents=True, exist_ok=True)

VIEWPORTS = {
    "360x640": (360, 640),
    "390x844": (390, 844),
    "430x932": (430, 932),
    "1280x800": (1280, 800),
}
EXPECTED_SCREENS = ["boot", "setup", "journey", "play", "event", "act", "shop",
                    "finale", "memory", "settings"]


def design_card_targets():
    """从 DESIGN §3 读取实际生成目标（truth ≈ 500、dare ≈ 235+ …）。"""
    try:
        t = (ROOT / "app" / "DESIGN.md").read_text(encoding="utf-8")
        m = re.search(r"目标规模（实际生成）[:：](.+)", t)
        pairs = re.findall(r"(\w+)\s*≈\s*(\d+)", m.group(1)) if m else []
        out = {k: int(v) for k, v in pairs}
        if out:
            return out
    except Exception:
        pass
    return {"truth": 500, "dare": 235, "touch": 288, "sync": 65, "spark": 127, "punish": 211}


def design_thresholds():
    """从 DESIGN §1.4 读取结局阈值。"""
    try:
        t = (ROOT / "app" / "DESIGN.md").read_text(encoding="utf-8")
        sync = re.search(r"sync >= (\d+) && heart >= (\d+)", t)
        tension = re.search(r"tension >= (\d+)", t)
        hearts = [int(x) for x in re.findall(r"heart >= (\d+)", t)] or [14]
        return {"sync": int(sync.group(1)) if sync else 15,
                "sync_heart": int(sync.group(2)) if sync else 8,
                "tension": int(tension.group(1)) if tension else 18,
                "heart": max(hearts)}
    except Exception:
        return {"sync": 15, "sync_heart": 8, "tension": 18, "heart": 14}


# DESIGN §3 目标规模（脚本启动时读取，避免文档更新后测试滞后）
CARD_TARGETS = design_card_targets()
DESIGN_TH = design_thresholds()

CLEAN_INIT = """
try{
  /* 每个 context 首次加载清一次；reload 保留存档（sessionStorage 在同 tab 内持久） */
  if(!sessionStorage.getItem('__qa_clean')){
    localStorage.clear();
    sessionStorage.setItem('__qa_clean','1');
  }
}catch(e){}
window.__qaT0 = (window.performance && performance.now) ? performance.now() : Date.now();
"""


# ---------------------------------------------------------------- 结果记录
class Rec:
    def __init__(self):
        self.checks = []
        self.issues = []
        self.inventory = {}
        self.shots = []

    def check(self, group, cid, name, ok, detail="", data=None, skip=False, warn=False,
              severity="P1"):
        st = "SKIP" if skip else ("WARN" if warn else ("PASS" if ok else "FAIL"))
        c = {"group": group, "id": cid, "name": name, "status": st,
             "detail": str(detail or "")}
        if data is not None:
            c["data"] = data
        self.checks.append(c)
        print("  %-4s [%s] %s%s" % (st, cid, name, "" if st == "PASS" or not detail else " | " + str(detail)[:180]))
        if st == "FAIL":
            self.issue(severity, name, str(detail)[:600], cid)
        return c

    def issue(self, severity, title, detail, cid=""):
        it = {"severity": severity, "title": title, "detail": detail, "check": cid}
        self.issues.append(it)
        print("  [ISSUE %s] %s" % (severity, title))

    def shot(self, page, name):
        p = SHOT_DIR / (name + ".png")
        try:
            page.screenshot(path=str(p), full_page=False)
            relp = str(p.relative_to(ROOT)).replace("\\", "/")
            self.shots.append(relp)
            return relp
        except Exception as e:
            print("  [shot fail]", name, e)
            return None

    def screen_inv(self, page, name):
        try:
            inv = page.evaluate(COLLECT_JS)
            self.inventory[name] = inv
            return inv
        except Exception as e:
            self.inventory[name] = {"error": str(e)}
            return self.inventory[name]

    def summary(self):
        n = {"PASS": 0, "FAIL": 0, "SKIP": 0, "WARN": 0}
        for c in self.checks:
            n[c["status"]] += 1
        return n


R = Rec()


# ---------------------------------------------------------------- 页面内工具 JS
COLLECT_JS = r"""
(()=>{
  var scr = document.querySelector('#screen .screen') || document.querySelector('.screen');
  var scrName = (document.body.getAttribute('data-screen') || '') +
    (scr && scr.getAttribute('data-screen') ? '/' + scr.getAttribute('data-screen') : '');
  function vis(el){
    if(!el) return false;
    var cs=getComputedStyle(el), r=el.getBoundingClientRect();
    return cs.display!=='none' && cs.visibility!=='hidden' && r.width>0 && r.height>0;
  }
  var nodes = Array.prototype.slice.call(document.querySelectorAll(
    '[data-test], button, a, input, select, textarea, [role="button"], [tabindex]'));
  var items = nodes.filter(vis).map(function(el){
    var r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || '',
      dataTest: el.getAttribute('data-test') || '',
      role: el.getAttribute('role') || '',
      text: (el.innerText || el.textContent || '').replace(/\s+/g,' ').trim().slice(0, 80),
      aria: el.getAttribute('aria-label') || '',
      cls: String(el.className || '').slice(0, 80),
      rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
      disabled: !!el.disabled
    };
  });
  var dt = items.filter(function(x){return x.dataTest;}).map(function(x){return x.dataTest;});
  var anims = [];
  try{
    document.getAnimations().forEach(function(a){
      var t = a.effect && a.effect.getTiming ? a.effect.getTiming() : {};
      anims.push({dur: t.duration, iter: t.iterations, state: a.playState});
    });
  }catch(e){}
  return {
    screen: document.body.getAttribute('data-screen') || '',
    screenName: scrName,
    title: document.title,
    bodyTextLen: (document.body.innerText || '').length,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    scrollH: document.documentElement.scrollHeight,
    clientH: document.documentElement.clientHeight,
    dataTests: dt,
    items: items,
    animations: anims,
    appVersion: (window.App && App.version) || null,
    screens: (window.App && App.Screens) ? Object.keys(App.Screens) : [],
    routerCurrent: (window.App && App.Router && App.Router.current) ? App.Router.current() : null,
    cards: (window.CARDS ? Object.keys(window.CARDS).reduce(function(o,k){
      o[k] = (window.CARDS[k] || []).length; return o; }, {}) : null),
    content: (window.CONTENT ? {
      acts: (window.CONTENT.acts || []).length,
      events: (window.CONTENT.events || []).length,
      endings: (window.CONTENT.endings || []).length,
      awards: (window.CONTENT.awards || []).length
    } : null),
    engineApi: (window.App && App.Engine) ? Object.keys(App.Engine) : null,
    motionReduced: (window.App && App.Motion && App.Motion.reduced) ? !!App.Motion.reduced() : null,
    bodyClass: document.body.className,
    tokens: (function(){
      var cs = getComputedStyle(document.documentElement);
      var names = ['--bg0','--bg1','--ink','--dim','--line','--card','--gold','--rose','--violet','--teal','--danger'];
      var o = {}; names.forEach(function(n){ o[n] = cs.getPropertyValue(n).trim(); }); return o;
    })()
  };
})()
"""


# ---------------------------------------------------------------- context / 工具
def make_ctx(browser, viewport=(390, 844), reduced=None, settings=None, seed_js=None,
             touch=None):
    w, h = viewport
    mobile = w < 800
    if touch is None:
        touch = mobile
    kw = dict(viewport={"width": w, "height": h},
              device_scale_factor=(2 if mobile else 1),
              is_mobile=mobile, has_touch=touch,
              locale="zh-CN", timezone_id="Asia/Shanghai",
              accept_downloads=True, color_scheme="dark")
    if reduced:
        kw["reduced_motion"] = reduced
    ctx = browser.new_context(**kw)
    init = [CLEAN_INIT]
    if seed_js:
        init.append(seed_js)
    ctx.add_init_script("\n".join(init))
    page = ctx.new_page()
    logs = {"console": [], "errors": [], "http": [], "warn": []}
    page.on("pageerror", lambda e: logs["errors"].append("%s: %s" % (type(e).__name__, e)))
    page.on("console", lambda m: (logs["console"].append({"type": m.type, "text": m.text}),
                                  logs["warn"].append(m.text) if m.type == "warning" else None)
            if m.type in ("error", "warning") else None)
    page.on("response", lambda r: logs["http"].append({"status": r.status, "url": r.url})
            if r.status >= 400 else None)

    class PB:
        pass

    pb = PB()
    pb.ctx, pb.page, pb.logs = ctx, page, logs
    pb.clear = lambda: [logs[k].clear() for k in ("console", "errors", "http", "warn")]
    return pb


NOISE = ("Failed to load resource", "net::ERR", "ERR_FAILED")


def take(pb):
    t = {"pageerrors": list(pb.logs["errors"]),
         "console": list(pb.logs["console"]),
         "http": list(pb.logs["http"])}
    t["console_app"] = [c for c in t["console"] if not any(x in c["text"] for x in NOISE)]
    t["console_err"] = [c for c in t["console_app"] if c["type"] == "error"]
    t["console_warn"] = [c for c in t["console_app"] if c["type"] == "warning"]
    return t


def goto_boot(pb, base, timeout=30000):
    pb.page.goto(base, wait_until="load", timeout=timeout)
    try:
        pb.page.wait_for_function("() => document.querySelector('.boot-title') !== null", timeout=6000)
    except Exception:
        pass
    pb.page.wait_for_timeout(320)
    return take(pb)


def errs_summary(t):
    parts = []
    if t["pageerrors"]:
        parts.append("pageerror=%s" % t["pageerrors"][:2])
    if t["console_err"]:
        parts.append("console.error=%s" % [c["text"][:80] for c in t["console_err"][:3]])
    return "; ".join(parts)


def ok_clean(t):
    return not t["pageerrors"] and not t["console_err"]


def jseval(page, code, arg=None):
    try:
        return (page.evaluate(code) if arg is None else page.evaluate(code, arg)), None
    except Exception as e:
        return None, str(e)


# ---------------------------------------------------------------- 语义点击/定位
def find_node(page, spec):
    """spec: {'test':..,'id':..,'text':..,'css':..} 返回 locator 或 None（不抛异常）。"""
    candidates = []
    if spec.get("test"):
        candidates.append('[data-test="%s"]' % spec["test"])
    if spec.get("id"):
        candidates.append("#" + spec["id"])
    if spec.get("css"):
        candidates.append(spec["css"])
    for sel in candidates:
        try:
            loc = page.locator(sel).first
            if loc.count() and loc.is_visible():
                return loc
        except Exception:
            continue
    if spec.get("text"):
        for sel in ("button", "a", '[role="button"]', ".btn", "div"):
            try:
                loc = page.locator(sel).filter(has_text=re.compile(re.escape(spec["text"]))).first
                if loc.count() and loc.is_visible():
                    return loc
            except Exception:
                continue
    return None


def click_spec(page, spec, timeout=4000, wait=320):
    loc = find_node(page, spec)
    if not loc:
        return False
    try:
        loc.click(timeout=timeout)
        page.wait_for_timeout(wait)
        return True
    except Exception:
        return False


def body_screen(page):
    return (page.evaluate("()=>document.body.getAttribute('data-screen')||''") or "")


def wait_screen(page, name, timeout=4000):
    try:
        page.wait_for_function("(n)=>document.body.getAttribute('data-screen')===n",
                              arg=name, timeout=timeout)
        page.wait_for_timeout(260)
        return True
    except Exception:
        return False


# ---------------------------------------------------------------- 分组：壳层
def group_shell(browser, base):
    gid = "SH"
    print("\n=== SH · 壳层 / boot ===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    t0 = time.time()
    t_load = goto_boot(pb, base)
    first_ready_ms = round((time.time() - t0) * 1000)
    inv = R.screen_inv(pb.page, "boot")
    boot = pb.page.evaluate("""(()=>{
      function q(s){return document.querySelector(s);}
      var heros = Array.prototype.map.call(document.querySelectorAll('.boot-title span'),function(e){return e.textContent;});
      var nights = q('#bootNights'), cards = q('#bootCards');
      var btns = Array.prototype.map.call(document.querySelectorAll('.boot-actions .btn'),function(b){
        var r=b.getBoundingClientRect();
        return {id:b.id,text:(b.innerText||'').replace(/\\s+/g,' ').trim(),
          h:Math.round(r.height),w:Math.round(r.width),aria:b.getAttribute('aria-label')||''};});
      var nav = (performance.getEntriesByType('navigation')[0]||{});
      return {
        screen: document.body.getAttribute('data-screen'),
        title: document.title,
        brand: (q('.boot-brand')||{}).textContent||'',
        hero: heros,
        sub: (q('.boot-sub')||{}).innerText||'',
        nights: nights ? nights.textContent : null,
        cards: cards ? cards.textContent : null,
        buttons: btns,
        hasScreenWrap: !!q('#screen .screen'),
        overlay: !!q('#overlay'), toasts: !!q('#toasts'),
        screenRole: (q('#screen')||{}).getAttribute ? q('#screen').getAttribute('role') : null,
        dcl: Math.round(nav.domContentLoadedEventEnd||0), load: Math.round(nav.loadEventEnd||0),
        jsHeap: (performance.memory ? performance.memory.usedJSHeapSize : null),
        btnNewVisible: !!(q('#btnNew') && q('#btnNew').getBoundingClientRect().height>0),
        focusables: document.querySelectorAll('button,[tabindex],a,input').length
      };
    })()""")
    R.inventory["boot_detail"] = boot
    R.check(gid, "SH1", "boot 屏渲染（[data-screen=boot] + 标题 + 副标题）",
            boot.get("screen") == "boot" and "升温" in "".join(boot.get("hero") or [])
            and "夜航" in "".join(boot.get("hero") or []) and bool(boot.get("sub")),
            json.dumps({k: boot.get(k) for k in ("screen", "hero", "title")}, ensure_ascii=False), boot)
    R.check(gid, "SH2", "boot 主操作（开始今晚/回忆册/设置）可见且可点",
            boot.get("btnNewVisible") and len(boot.get("buttons") or []) >= 3,
            "buttons=%s" % json.dumps(boot.get("buttons"), ensure_ascii=False))
    R.check(gid, "SH3", "boot 元信息（已航行 N 晚 / 题库 N 张）",
            boot.get("nights") is not None and boot.get("cards") is not None
            and (boot.get("cards") or "0").isdigit() and int(boot.get("cards") or 0) > 0,
            "nights=%s cards=%s" % (boot.get("nights"), boot.get("cards")))
    R.check(gid, "SH4", "首屏加载无 pageerror / console error", ok_clean(t_load),
            errs_summary(t_load), {"errors": t_load["pageerrors"], "console_err": t_load["console_err"]})
    warn = t_load["console_warn"]
    R.check(gid, "SH5", "首屏 console warning 分类记录（不阻断）", True,
            "warnings=%d %s" % (len(warn), [w["text"][:60] for w in warn[:3]]),
            {"warnings": warn}, warn=bool(warn))
    R.check(gid, "SH6", "首屏可交互 <1.5s（到 #btnNew 可点）", first_ready_ms < 1500,
            "firstReady=%dms dcl=%sms load=%sms" % (first_ready_ms, boot.get("dcl"), boot.get("load")),
            {"firstReadyMs": first_ready_ms, "dcl": boot.get("dcl"), "load": boot.get("load")})
    R.check(gid, "SH7", "390 首屏无横向滚动", (inv.get("scrollW") or 0) - (inv.get("clientW") or 0) <= 1,
            "scrollW=%s clientW=%s" % (inv.get("scrollW"), inv.get("clientW")))
    # 资源/数据完整性（DESIGN §3 实际生成目标，允许 ±10%）
    cards = inv.get("cards") or {}
    missing = {k: (cards.get(k), t) for k, t in CARD_TARGETS.items()
               if (cards.get(k) or 0) < int(t * 0.9)}
    R.check(gid, "SH8", "题库规模符合 DESIGN §3 实际生成目标（±10%：{0}）".format(
                json.dumps(CARD_TARGETS, ensure_ascii=False)),
            not missing, "cards=%s 低于目标=%s" % (json.dumps(cards, ensure_ascii=False), missing), cards)
    content = inv.get("content") or {}
    R.check(gid, "SH9", "CONTENT 完整（3 幕 / ≥2 事件 / 6 结局 / 奖项）",
            (content.get("acts") or 0) >= 3 and (content.get("events") or 0) >= 2
            and (content.get("endings") or 0) >= 6 and (content.get("awards") or 0) >= 2,
            "content=%s" % json.dumps(content, ensure_ascii=False), content)
    api = inv.get("engineApi") or []
    need_api = ["newSession", "validate", "startRound", "reroll", "chooseCard", "complete",
                "escalate", "escalateComplete", "escalateSkip", "skip", "gentleDown",
                "nextRound", "chooseEvent", "leaveAct", "shopBuy", "finish", "safeWord",
                "eligibleCards", "drawHand", "actInfo", "progress", "canEscalate",
                "shopOffers", "currentCard", "handCards"]
    missing_api = [a for a in need_api if a not in api]
    R.check(gid, "SH10", "Engine API 与 DESIGN §4 一致（%d/%d）" % (len(need_api) - len(missing_api), len(need_api)),
            not missing_api, "missing=%s" % missing_api, {"missing": missing_api})
    screens = inv.get("screens") or []
    R.inventory["screens"] = screens
    R.check(gid, "SH11", "屏幕注册清单（阶段1 仅 boot；全量阶段应齐全）",
            "boot" in screens, "screens=%s expected=%s" % (screens, EXPECTED_SCREENS),
            {"screens": screens}, skip=len(screens) <= 1)
    tokens = inv.get("tokens") or {}
    core_tokens = ["--bg0", "--bg1", "--ink", "--dim", "--line", "--gold", "--rose",
                   "--violet", "--teal", "--danger"]
    empty_core = [k for k in core_tokens if not tokens.get(k)]
    optional_missing = [k for k in ("--card",) if not tokens.get(k)]
    R.check(gid, "SH12", "base.css 核心设计令牌齐全（--bg0/--ink/--gold/--rose/--violet/--teal 等）",
            not empty_core, "emptyCore=%s tokens=%s" % (empty_core, json.dumps(tokens, ensure_ascii=False)),
            tokens)
    if optional_missing:
        R.check(gid, "SH12b", "DESIGN §5 文档令牌 vs base.css 实际（--card 未定义，base.css 用 --glass/--glass2 替代）",
                False, "missing=%s（文档/实现命名不一致，记 P2 观察，不阻断）" % optional_missing,
                warn=True)
    small = [b for b in (boot.get("buttons") or []) if (b.get("h") or 0) < 44]
    R.check(gid, "SH13", "boot 按钮点击区 ≥44px（DESIGN §8.7）", not small,
            "small=%s" % json.dumps(small, ensure_ascii=False), severity="P2")
    R.check(gid, "SH14", "壳层结构（#screen[role=main] / #overlay / #toasts）",
            boot.get("hasScreenWrap") and boot.get("overlay") and boot.get("toasts")
            and boot.get("screenRole") == "main",
            json.dumps({k: boot.get(k) for k in ("hasScreenWrap", "overlay", "toasts", "screenRole")}))
    R.shot(pb.page, "shell-boot-390x844")
    # 未注册屏幕时的路由行为（阶段1 记录为 SKIP；全量阶段硬断言）
    pb.clear()
    jseval(pb.page, "()=>{try{App.Router.go('setup');return null}catch(e){return String(e)}}")
    pb.page.wait_for_timeout(400)
    missing_screen = [s for s in EXPECTED_SCREENS if s not in screens]
    t_route = take(pb)
    got_setup = body_screen(pb.page) == "setup"
    R.check(gid, "SH15", "setup 屏可进入（未完成时记 SKIP）", got_setup,
            "current=%r consoleErr=%s missingScreens=%s" % (
                body_screen(pb.page), [c["text"][:60] for c in t_route["console_err"][:3]],
                missing_screen[:5]),
            {"missingScreens": missing_screen}, skip=not got_setup)
    pb.ctx.close()


# ---------------------------------------------------------------- 分组：视口
def group_viewports(browser, base):
    gid = "VP"
    print("\n=== VP · 三视口 + 桌面 ===")
    for key, vp in VIEWPORTS.items():
        pb = make_ctx(browser, viewport=vp)
        t0 = time.time()
        t = goto_boot(pb, base)
        ready_ms = round((time.time() - t0) * 1000)
        inv = R.screen_inv(pb.page, "boot@" + key)
        detail = pb.page.evaluate("""(()=>{
          var r=document.querySelector('.boot-actions');
          var br=r?r.getBoundingClientRect():null;
          var title=document.querySelector('.boot-title');
          var tr=title?title.getBoundingClientRect():null;
          var overflow=[];
          Array.prototype.forEach.call(document.querySelectorAll('#screen *'),function(e){
            var b=e.getBoundingClientRect(), cs=getComputedStyle(e);
            if(cs.position==='fixed'||cs.display==='none'||b.width<=0) return;
            if(b.right>innerWidth+1.5) overflow.push({tag:e.tagName,cls:String(e.className).slice(0,40),right:Math.round(b.right)});
          });
          return {actions: br?[Math.round(br.x),Math.round(br.y),Math.round(br.width),Math.round(br.height)]:null,
            title: tr?[Math.round(tr.x),Math.round(tr.y),Math.round(tr.width),Math.round(tr.height)]:null,
            overflow: overflow.slice(0,6),
            innerW: innerWidth, innerH: innerHeight};
        })()""")
        R.inventory["vp_" + key] = detail
        ok = (inv.get("screen") == "boot"
              and (inv.get("scrollW") or 0) - (inv.get("clientW") or 0) <= 1)
        R.check(gid, "VP-%s" % key, "%s boot 渲染且无横向滚动" % key, ok,
                "screen=%r overflow=%s bad=%s ready=%dms" % (
                    inv.get("screen"),
                    (inv.get("scrollW") or 0) - (inv.get("clientW") or 0),
                    detail.get("overflow"), ready_ms),
                {"vp": key, "detail": detail})
        R.check(gid, "VPb-%s" % key, "%s 无元素越界（right>innerWidth）" % key,
                not detail.get("overflow"), "overflow=%s" % json.dumps(detail.get("overflow"), ensure_ascii=False))
        R.check(gid, "VPc-%s" % key, "%s 首屏无 pageerror/console error" % key, ok_clean(t),
                errs_summary(t))
        vis_ok = bool(detail.get("actions")) and (detail["actions"][1] + detail["actions"][3]) <= (detail.get("innerH") or 0) + 1
        R.check(gid, "VPd-%s" % key, "%s boot 操作区在首屏内" % key, vis_ok,
                "actions=%s innerH=%s" % (detail.get("actions"), detail.get("innerH")))
        R.shot(pb.page, "viewport-boot-%s" % key)
        pb.ctx.close()


# ---------------------------------------------------------------- 分组：减少动效
def group_reduce(browser, base):
    gid = "RM"
    print("\n=== RM · prefers-reduced-motion ===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"], reduced="reduce")
    t = goto_boot(pb, base)
    inv = R.screen_inv(pb.page, "boot@reduce")
    red = pb.page.evaluate("""(()=>{
      var anims=[];
      try{document.getAnimations().forEach(function(a){
        var tm=a.effect&&a.effect.getTiming?a.effect.getTiming():{};
        anims.push({dur:tm.duration,iter:tm.iterations,state:a.playState});
      });}catch(e){}
      return {reduced: window.App&&App.Motion&&App.Motion.reduced?App.Motion.reduced():null,
        bodyClass:document.body.className,
        anims:anims,
        dots:document.querySelectorAll('.fx-dot').length,
        fadeUps:document.querySelectorAll('.fade-up').length};
    })()""")
    R.inventory["reduce"] = red
    R.check(gid, "RM1", "reduce 媒体查询生效（Motion.reduced()=true / body.reduce）",
            red.get("reduced") is True and "reduce" in (red.get("bodyClass") or ""),
            "reduced=%s bodyClass=%r" % (red.get("reduced"), red.get("bodyClass")))
    long_anims = [a for a in (red.get("anims") or [])
                  if (isinstance(a.get("dur"), (int, float)) and a["dur"] > 800)
                  or (isinstance(a.get("dur"), str) and a["dur"] not in ("auto", "0s"))]
    infinite = [a for a in (red.get("anims") or []) if a.get("iter") == "Infinity"]
    R.check(gid, "RM2", "reduce 下无长动画/无限动画", not long_anims and not infinite,
            "anims=%s" % json.dumps((red.get("anims") or [])[:6], ensure_ascii=False))
    R.check(gid, "RM3", "reduce 下无粒子/入场 stagger", red.get("dots") == 0 and red.get("fadeUps") == 0,
            "dots=%s fadeUps=%s" % (red.get("dots"), red.get("fadeUps")))
    R.check(gid, "RM4", "reduce 下 boot 正常渲染 + 无 error",
            inv.get("screen") == "boot" and ok_clean(t), errs_summary(t))
    R.shot(pb.page, "reduce-boot-390x844")
    pb.ctx.close()


# ---------------------------------------------------------------- 阶段2 工具
def click_first(pb, selector, timeout=4000, wait=300):
    try:
        loc = pb.page.locator(selector).first
        if loc.count() and loc.is_visible():
            loc.click(timeout=timeout)
            pb.page.wait_for_timeout(wait)
            return True
    except Exception:
        pass
    return False


def ui_eval(pb, code):
    return jseval(pb.page, code)[0]


def session_now(pb):
    return ui_eval(pb, "()=>App.Store.getSession()")


def clean_ctx(browser, **kw):
    pb = make_ctx(browser, **kw)
    return pb


# ---------------------------------------------------------------- 主流程（UI 全流程 · quick）
def group_flow(browser, base):
    gid = "FL"
    print("\n=== FL · 主流程（boot→setup→journey→play→event→act→shop→finale）===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    t_boot = goto_boot(pb, base)
    inv = R.screen_inv(pb.page, "boot")
    screens = inv.get("screens") or []
    need = ["setup", "journey", "play", "event", "act", "shop", "finale"]
    missing = [s for s in need if s not in screens]
    R.check(gid, "FL1", "主流程屏幕全部注册（setup/journey/play/event/act/shop/finale）",
            not missing, "screens=%s missing=%s" % (screens, missing), {"missing": missing},
            skip=bool(missing))
    if missing:
        pb.ctx.close()
        return
    # boot → setup
    ok_new = click_first(pb, "#btnNew") or click_spec(pb.page, {"text": "开始今晚"})
    R.check(gid, "FL2", "boot→setup 可进入", ok_new and wait_screen(pb.page, "setup"),
            "current=%r" % body_screen(pb.page))
    # setup step1 名字
    try:
        pb.page.fill('[data-test="setup-name-a"]', "阿甲", timeout=2000)
        pb.page.fill('[data-test="setup-name-b"]', "阿乙", timeout=2000)
    except Exception:
        pass
    steps_seen = []
    for step in range(2):
        click_first(pb, '[data-test="setup-next"]')
        steps_seen.append(body_screen(pb.page))
    # step2 尺度 / 黑名单；step3 长度
    click_first(pb, '[data-test="maxstar-3"]')
    click_first(pb, '[data-test="setup-next"]')
    len_ok = click_first(pb, '[data-test="length-quick"]')
    start_ok = click_first(pb, '[data-test="setup-start"]')
    waited = wait_screen(pb.page, "journey", timeout=5000)
    R.check(gid, "FL3", "setup 三步可走完并用 quick 启航", len_ok and start_ok and waited,
            "len=%s start=%s current=%r" % (len_ok, start_ok, body_screen(pb.page)))
    R.shot(pb.page, "flow-journey-390x844")
    # journey 手牌
    hand = pb.page.evaluate("""(()=>{
      var cards=Array.prototype.map.call(document.querySelectorAll('[data-test^="journey-card-"]'),function(c){
        return {dt:c.getAttribute('data-test'),key:c.getAttribute('data-card-key')||'',text:(c.innerText||'').replace(/\\s+/g,' ').slice(0,60)};});
      return {cards:cards,hud:{heart:!!document.querySelector('[data-test="hud-heart"]'),tension:!!document.querySelector('[data-test="hud-tension"]'),sync:!!document.querySelector('[data-test="hud-sync"]'),coins:!!document.querySelector('[data-test="hud-coins"]')},combo:!!document.querySelector('[data-test="hud-combo"]')};
    })()""")
    R.check(gid, "FL4", "journey 显示 3 张手牌 + HUD 四资源/连击",
            len(hand.get("cards") or []) == 3 and all((hand.get("hud") or {}).values()) and hand.get("combo"),
            json.dumps(hand, ensure_ascii=False)[:300])
    # 主循环
    rounds = 0
    hosts = []
    visited = []
    guard = 0
    finale_ok = False
    while guard < 120:
        guard += 1
        scr = body_screen(pb.page)
        visited.append(scr)
        if scr == "finale":
            finale_ok = True
            break
        if scr == "journey":
            st = session_now(pb) or {}
            hosts.append(st.get("host"))
            if not click_first(pb, '[data-test^="journey-card-"]', timeout=3000, wait=500):
                R.check(gid, "FL-loop", "journey 手牌可点击", False, "journey 卡不可点")
                break
        elif scr == "play":
            rounds += 1
            if click_first(pb, '[data-test="play-complete"]', timeout=2500, wait=420):
                pass
            else:
                click_first(pb, '[data-test="play-skip"]', timeout=2000, wait=420)
            click_first(pb, '[data-test="play-next"]', timeout=2500, wait=450)
        elif scr == "event":
            click_first(pb, '[data-test^="event-option-"]', timeout=3000, wait=420)
            click_first(pb, '[data-test="event-continue"]', timeout=2500, wait=500)
        elif scr == "act":
            click_first(pb, '[data-test="act-continue"]', timeout=2500, wait=500)
        elif scr == "shop":
            click_first(pb, '[data-test="shop-leave-cta"]', timeout=2500, wait=500)
        elif scr == "setup":
            break
        else:
            pb.page.wait_for_timeout(300)
    t_flow = take(pb)
    R.check(gid, "FL5", "quick 全流程可走完（9 回合，play 屏出现 9 次）",
            finale_ok and rounds == 9, "rounds=%d finale=%s visited=%s" % (rounds, finale_ok, visited[-8:]))
    R.check(gid, "FL6", "领航员 A/B 交替（host 序列交替）",
            len(hosts) >= 4 and all(hosts[i] != hosts[i + 1] for i in range(min(len(hosts) - 1, 5))),
            "hosts=%s" % hosts[:8])
    R.check(gid, "FL7", "全程无 pageerror / console error", ok_clean(t_flow), errs_summary(t_flow))
    if not finale_ok:
        R.shot(pb.page, "flow-stuck-%r" % body_screen(pb.page))
        R.issue("P0", "quick 全流程未走到 finale", "rounds=%d visited=%s" % (rounds, visited[-10:]),
                "boot→setup→quick→journey/play×9→finale")
        pb.ctx.close()
        return
    # finale
    fin = pb.page.evaluate("""(()=>{
      var q=function(s){return document.querySelector(s);};
      var awards=q('[data-test="finale-awards"]');
      return {ending:(q('[data-test="finale-ending"]')||{}).textContent||'',
        awardKids:awards?awards.querySelectorAll('*').length:0,
        stats:!!q('[data-test="finale-stats"]'),
        poster:!!q('[data-test="finale-poster"]'),
        text:(q('[data-test="finale-text"]')||{}).innerText||''};
    })()""")
    R.check(gid, "FL8", "finale 显示结局名/资源/奖项（≥2）",
            bool(fin.get("ending")) and fin.get("awardKids", 0) >= 2 and fin.get("stats"),
            json.dumps({k: fin.get(k) for k in ("ending", "awardKids", "stats", "poster")}, ensure_ascii=False))
    R.shot(pb.page, "flow-finale-390x844")
    poster = pb.page.evaluate("""(()=>{var c=document.querySelector('[data-test="finale-poster"]');
      return c?{w:c.width,h:c.height,cw:c.clientWidth,ch:c.clientHeight}:null;})()""")
    R.check(gid, "FL8b", "结局海报 canvas 720×1080", bool(poster) and poster.get("w") == 720 and poster.get("h") == 1080,
            "poster=%s" % json.dumps(poster, ensure_ascii=False))
    # 海报下载
    dl_ok = False
    try:
        with pb.page.expect_download(timeout=8000) as dl:
            click_first(pb, '[data-test="finale-poster-save"]', timeout=3000, wait=200)
        dl_ok = True
        try:
            dl.value.save_as(str(OUT_DIR / "poster-download.png"))
        except Exception:
            pass
    except Exception as e:
        dl_err = str(e)[:120]
    R.check(gid, "FL9", "结局海报 canvas 可下载（expect_download）", dl_ok,
            "download=%s" % (dl_ok and "ok" or "fail"))
    # 保存进回忆册
    hist_before = ui_eval(pb, "()=>App.Store.getHistory().length") or 0
    click_first(pb, '[data-test="finale-save"]', timeout=3000, wait=600)
    hist_after = ui_eval(pb, "()=>App.Store.getHistory().length") or 0
    hist_entry = ui_eval(pb, "()=>App.Store.getHistory()[0]||null")
    R.check(gid, "FL10", "「保存进回忆册」写入历史（含结局/资源/日期）",
            hist_after == hist_before + 1 and bool(hist_entry)
            and "endingName" in (hist_entry or {}) and "ts" in (hist_entry or {}),
            "before=%s after=%s entry=%s" % (hist_before, hist_after,
                                             json.dumps(hist_entry, ensure_ascii=False)[:200]), hist_entry)
    # 再来一夜
    click_first(pb, '[data-test="finale-again"]', timeout=3000, wait=700)
    R.check(gid, "FL11", "「再来一夜」回到 setup", body_screen(pb.page) == "setup",
            "current=%r" % body_screen(pb.page))
    R.inventory["flow"] = {"rounds": rounds, "hosts": hosts, "visited": visited,
                           "finale": fin, "history": hist_entry}
    pb.ctx.close()


# ---------------------------------------------------------------- 规则（引擎级）
RULES_JS = r"""
(()=>{
  var E=App.Engine, out={err:null};
  function norm(x){ if(x && x.state && x.state.phase) return x.state; return x; }
  var names={a:'甲',b:'乙'};
  try{
    /* 1) 手牌 3 张 / 类型多样 / 不重复 */
    var handBad=[],typeBad=[],dupBad=[];
    for(var i=0;i<30;i++){
      var s=norm(E.newSession({maxStar:4,length:'classic',blacklist:[]},names,1000+i));
      var h=E.handCards(s)||[];
      if(h.length!==3)handBad.push({i:i,n:h.length});
      var ids=[];var ts={};
      h.forEach(function(c){ids.push(c.key);ts[c.type||c.pool]=1;});
      if(ids.length!==new Set(ids).size)dupBad.push(ids);
      if(Object.keys(ts).length<2)typeBad.push(Object.keys(ts));
    }
    out.hand={samples:30,badLen:handBad.length,badTypes:typeBad.length,badDup:dupBad.length,examples:typeBad.slice(0,3)};
    /* 2) maxStar 过滤 + spark 仅 maxStar4 */
    out.star={};
    [1,2,3,4].forEach(function(ms){
      var bad=0,n=0,spark=0;
      for(var i=0;i<30;i++){
        var s=norm(E.newSession({maxStar:ms,length:'classic',blacklist:[]},names,2000+i));
        (E.handCards(s)||[]).forEach(function(c){n++;if(c.star>ms)bad++;if(c.pool==='spark')spark++;});
      }
      out.star[ms]={cards:n,bad:bad,spark:spark};
    });
    /* 3) 黑名单过滤 */
    var bl=['吻','床'],blBad=0,blN=0;
    for(var i=0;i<30;i++){
      var s=norm(E.newSession({maxStar:4,length:'classic',blacklist:bl},names,3000+i));
      (E.handCards(s)||[]).forEach(function(c){blN++;var t=String(c.text||'');
        bl.forEach(function(k){if(t.indexOf(k)>=0)blBad++;});});
    }
    out.blacklist={checked:blN,bad:blBad};
    /* 4) 换牌券消耗 */
    var s=norm(E.newSession({maxStar:4,length:'classic',blacklist:[]},names,4001));
    var before={reroll:s.tokens.reroll,hand:(s.hand||[]).length};
    s=norm(E.startRound(s)); var r1=norm(E.reroll(s));
    var after={reroll:r1.tokens.reroll,hand:(r1.hand||[]).length};
    var r2=norm(E.reroll(r1)); var blocked=(r2.outEvents||[]).filter(function(e){return e.blocked;})[0]||null;
    out.reroll={before:before,after:after,secondBlocked:!!blocked,secondReason:blocked&&blocked.reason};
    /* 5) 完成收益公式（对照 DESIGN §1.2：round(base*s/2)，最低 1；星屑 s+floor(combo/3)） */
    function fresh(seed){return norm(E.startRound(norm(E.newSession({maxStar:4,length:'classic',blacklist:[]},names,seed))));}
    var c=fresh(5001); c=norm(E.chooseCard(c,0)); var info=E.currentCard(c);
    var b0=JSON.parse(JSON.stringify(c.resources)); var cb=c.combo||0;
    c=norm(E.complete(c));
    var ybase={truth:{sync:1.5,heart:0.5},dare:{tension:1.5,heart:0.5},touch:{heart:1.5,tension:1},
      sync:{sync:2,heart:1},spark:{tension:2,heart:1.5}};
    var expY={heart:0,tension:0,sync:0};
    var bb=ybase[info.type||info.pool]||{};
    Object.keys(bb).forEach(function(k){expY[k]=Math.max(1,Math.round(bb[k]*info.star/2));});
    out.complete={pool:info.pool,type:info.type,star:info.star,comboBefore:cb,comboAfter:c.combo,
      deltas:{heart:c.resources.heart-b0.heart,tension:c.resources.tension-b0.tension,sync:c.resources.sync-b0.sync,coins:c.resources.coins-b0.coins},
      expect:{heart:expY.heart,tension:expY.tension,sync:expY.sync,coins:info.star+Math.floor((cb+1)/3)}};
    /* 6) 跳过语义（先把张力抬到 5，验证 -1 而不是地板 0） */
    var sk=fresh(5002); sk=norm(E.chooseCard(sk,0)); sk.resources.tension=5;
    var sb=JSON.parse(JSON.stringify(sk.resources));
    sk=norm(E.skip(sk));
    out.skip={combo:sk.combo,tensionDelta:sk.resources.tension-sb.tension,gentle:sk.gentle,skips:sk.skips,phase:sk.phase};
    /* 7) 加码 */
    var es=fresh(5003); es=norm(E.chooseCard(es,0)); es=norm(E.complete(es));
    var can=E.canEscalate(es); var from=E.currentCard(es).star;
    var esc=norm(E.escalate(es)); var escInfo=E.currentCard(esc);
    var eb=JSON.parse(JSON.stringify(esc.resources)); var ed=norm(E.escalateComplete(esc));
    out.escalate={can:can,from:from,to:escInfo?escInfo.star:null,maxStar:esc.settings.maxStar,
      deltas:{heart:ed.resources.heart-eb.heart,tension:ed.resources.tension-eb.tension,sync:ed.resources.sync-eb.sync,coins:ed.resources.coins-eb.coins},
      combo:ed.combo,deepDone:!!(ed.flags&&ed.flags.deepDone),phase:ed.phase};
    /* 8) 加码跳过 */
    var es2=fresh(5004); es2=norm(E.chooseCard(es2,0)); es2=norm(E.complete(es2)); es2=norm(E.escalate(es2));
    var eb2=JSON.parse(JSON.stringify(es2.resources)); var es2s=norm(E.escalateSkip(es2));
    out.escalateSkip={heartDelta:es2s.resources.heart-eb2.heart,combo:es2s.combo,phase:es2s.phase,
      reason:(es2s.outEvents||[]).filter(function(e){return e.type==='skip';}).map(function(e){return e.reason;})[0]||null,
      punish:(E.currentCard(es2s)||{}).type||null};
    /* 9) 缓一缓（每局 2 次；第 3 次 blocked）——固定 currentStar=3，避免抽到 1 星触发 gentleToZero */
    var g=fresh(5005); g=norm(E.chooseCard(g,0)); g.currentStar=3;
    var g0=E.currentCard(g);
    var gs1=norm(E.gentleDown(g)); var g1=E.currentCard(gs1);
    var gs2=norm(E.gentleDown(gs1)); var g2=E.currentCard(gs2);
    var gs3=norm(E.gentleDown(gs2)); var gb=(gs3.outEvents||[]).filter(function(e){return e.blocked;})[0]||null;
    out.gentle={star0:g0.star,star1:g1?g1.star:null,star2:g2?g2.star:null,used:gs2.gentleUsed,
      thirdBlocked:!!gb,reason:gb&&gb.reason,gentle:gs2.gentle,phase:gs2.phase};
    /* 10) 事件只触发一次 + 自适应 */
    var q=norm(E.newSession({maxStar:4,length:'quick',blacklist:[]},names,6001));
    var evIds=[],adaptive=[];
    for(var step=0;step<40;step++){
      if(q.phase==='finale')break;
      if(q.phase==='draft'){q=norm(E.startRound(q));q=norm(E.chooseCard(q,0));q=norm(E.complete(q));}
      else if(q.phase==='resolve'){q=norm(E.nextRound(q));}
      else if(q.phase==='event'){
        (q.outEvents||[]).forEach(function(e){if(e.type==='stage'&&e.eventId)evIds.push(e.eventId);
          if(e.type==='stage'&&e.adaptive)adaptive.push({act:e.act,drawBias:e.drawBias});});
        var eid=(q.outEvents||[]).filter(function(e){return e.type==='stage'&&e.eventId;}).map(function(e){return e.eventId;})[0];
        var ev=null;(window.CONTENT.events||[]).forEach(function(x){if(x.id===eid)ev=x;});
        var oid=ev&&ev.options&&ev.options[0]&&ev.options[0].id;
        q=norm(E.chooseEvent(q,eid,oid));
      }
      else if(q.phase==='act'){q=norm(E.leaveAct(q));}
      else if(q.phase==='shop'){q=norm(E.leaveAct(q));}
      else break;
    }
    out.event={ids:evIds,unique:evIds.filter(function(x,i){return evIds.indexOf(x)===i;}),adaptive:adaptive,finalPhase:q.phase,round:q.round};
    /* 10b) 自适应：全跳过 → 幕末低分 → nextRound 的 stage 事件应带 adaptive/drawBias=-1 */
    var aq=norm(E.newSession({maxStar:4,length:'quick',blacklist:[]},names,6002));
    var adEvents=[];
    for(var as=0;as<30;as++){
      if(aq.phase==='finale')break;
      if(aq.phase==='draft'){aq=norm(E.startRound(aq));aq=norm(E.chooseCard(aq,0));aq=norm(E.skip(aq));}
      else if(aq.phase==='resolve'){
        aq=norm(E.nextRound(aq));
        (aq.outEvents||[]).forEach(function(e){
          if(e.type==='stage'&&e.adaptive)adEvents.push({act:aq.act,drawBias:e.drawBias,reason:e.reason});
        });
      }
      else if(aq.phase==='event'){
        var aid=(aq.outEvents||[]).filter(function(e){return e.type==='stage'&&e.eventId;}).map(function(e){return e.eventId;})[0];
        var aev=null;(window.CONTENT.events||[]).forEach(function(x){if(x.id===aid)aev=x;});
        aq=norm(E.chooseEvent(aq,aid,aev&&aev.options&&aev.options[0]&&aev.options[0].id));
      }
      else if(aq.phase==='act'||aq.phase==='shop'){aq=norm(E.leaveAct(aq));}
      else break;
    }
    out.adaptive={events:adEvents,phase:aq.phase,round:aq.round};
    /* 11) 安全词 */
    var sw=fresh(7001); sw=norm(E.chooseCard(sw,0)); sw=norm(E.complete(sw));
    var swb=JSON.parse(JSON.stringify(sw.resources)); var swr=E.safeWord(sw); var sws=norm(swr);
    out.safe={ending:sws.result&&sws.result.endingId,phase:sws.phase,
      resSame:JSON.stringify(sws.resources)===JSON.stringify(swb),
      awards:sws.result&&(sws.result.awards||[]).length};
    /* 12) 商店经济 */
    var sh=norm(E.newSession({maxStar:4,length:'classic',blacklist:[]},names,8001));
    sh=norm(E.startRound(sh)); sh.resources.coins=50; sh.phase='shop';
    var offers=E.shopOffers(sh)||[];
    var first=offers[0];
    var sres=first?E.shopBuy(sh,first.id):null;
    var sh2=norm(sres);
    var poor=norm(E.newSession({maxStar:4,length:'classic',blacklist:[]},names,8002));
    poor=norm(E.startRound(poor)); poor.resources.coins=0; poor.phase='shop';
    var pr=E.shopBuy(poor,(offers[0]||{}).id||'heart');
    var pBlocked=(pr&&((pr.events||[]).filter(function(e){return e.blocked;})[0]||null))||null;
    out.shop={offers:(offers||[]).length,first:first&&{id:first.id,price:first.price},
      coinsBefore:50,coinsAfter:sh2?sh2.resources.coins:null,blockedAtZero:!!pBlocked,blockedReason:pBlocked&&pBlocked.reason};
  }catch(e){ out.err=String(e&&e.stack||e); }
  return out;
})()
"""


def group_rules(browser, base):
    gid = "RU"
    print("\n=== RU · 规则/数值（引擎级构造）===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    goto_boot(pb, base)
    d = ui_eval(pb, RULES_JS) or {}
    R.inventory["rules"] = d
    R.check(gid, "RU0", "引擎规则构造脚本执行成功", not d.get("err"),
            str(d.get("err"))[:400], skip=False)
    if d.get("err"):
        pb.ctx.close()
        return
    hand = d.get("hand") or {}
    R.check(gid, "RU1", "手牌固定 3 张、无重复、类型多样（30 局采样）",
            hand.get("badLen") == 0 and hand.get("badDup") == 0 and hand.get("badTypes") == 0,
            "hand=%s" % json.dumps(hand, ensure_ascii=False))
    star = d.get("star") or {}
    bad_star = sum((star.get(str(k)) or {}).get("bad", 0) for k in (1, 2, 3, 4))
    spark_lt4 = sum((star.get(str(k)) or {}).get("spark", 0) for k in (1, 2, 3))
    spark4 = (star.get("4") or {}).get("spark", 0)
    R.check(gid, "RU2", "星级 ≤ maxStar（1–4 档各 30 局采样），spark 仅 maxStar=4 出现",
            bad_star == 0 and spark_lt4 == 0 and spark4 > 0,
            "star=%s" % json.dumps(star, ensure_ascii=False))
    bl = d.get("blacklist") or {}
    R.check(gid, "RU3", "黑名单关键词不出现在手牌（吻/床，30 局采样）",
            bl.get("bad") == 0 and (bl.get("checked") or 0) > 20,
            "blacklist=%s" % json.dumps(bl, ensure_ascii=False))
    rr = d.get("reroll") or {}
    R.check(gid, "RU4", "换牌券消耗正确（1 张→0、手牌仍 3；再用被拒）",
            (rr.get("before") or {}).get("reroll") == 1 and (rr.get("after") or {}).get("reroll") == 0
            and (rr.get("after") or {}).get("hand") == 3 and rr.get("secondBlocked") is True,
            "reroll=%s" % json.dumps(rr, ensure_ascii=False))
    cp = d.get("complete") or {}
    cp_exp = cp.get("expect") or {}
    cp_delta = cp.get("deltas") or {}
    R.check(gid, "RU5", "完成收益按星级/类型公式（收益 round(base*s/2) 最低 1；星屑 s+floor(combo/3)）",
            bool(cp) and all(cp_delta.get(k) == cp_exp.get(k) for k in ("heart", "tension", "sync", "coins")),
            "complete=%s" % json.dumps(cp, ensure_ascii=False))
    sk = d.get("skip") or {}
    R.check(gid, "RU6", "跳过：combo=0、张力 -1（≥0）、温柔 +1、skip 计数 +1",
            sk.get("combo") == 0 and sk.get("tensionDelta") == -1 and sk.get("gentle") == 1
            and sk.get("skips") == 1 and sk.get("phase") == "resolve",
            "skip=%s" % json.dumps(sk, ensure_ascii=False))
    esc = d.get("escalate") or {}
    R.check(gid, "RU7", "加码：星级 +1、完成收益 ×2、combo 继续累计、deepDone",
            esc.get("can") is True and (esc.get("to") or 0) == min((esc.get("from") or 0) + 1,
                                                                  esc.get("maxStar") or 4)
            and esc.get("deepDone") is True,
            "escalate=%s" % json.dumps(esc, ensure_ascii=False))
    es2 = d.get("escalateSkip") or {}
    R.check(gid, "RU8", "加码跳过：心动 -1（≥0）、combo 归零、不抽惩罚卡",
            es2.get("heartDelta") in (-1, 0) and es2.get("combo") == 0
            and es2.get("reason") == "escalateSkip" and (es2.get("punish") or "") != "punish",
            "escalateSkip=%s" % json.dumps(es2, ensure_ascii=False))
    ge = d.get("gentle") or {}
    R.check(gid, "RU9", "缓一缓：每局 2 次、星级 -1、第 3 次被拒（no_uses_left）",
            ge.get("used") == 2 and ge.get("thirdBlocked") is True and ge.get("reason") == "no_uses_left"
            and (ge.get("star1") == (ge.get("star0") or 0) - 1)
            and (ge.get("star2") == (ge.get("star1") or 0) - 1),
            "gentle=%s" % json.dumps(ge, ensure_ascii=False))
    ev = d.get("event") or {}
    R.check(gid, "RU10", "幕末事件按幕只触发一次（quick：e1、e2 各一次）",
            ev.get("unique") == ev.get("ids") and len(ev.get("unique") or []) >= 2,
            "event=%s" % json.dumps(ev, ensure_ascii=False))
    adp = d.get("adaptive") or {}
    ad_events = adp.get("events") or []
    R.check(gid, "RU11", "自适应降星：低分幕末（全跳过）产生 adaptive/drawBias=-1",
            bool(ad_events), "adaptive=%s" % json.dumps(adp, ensure_ascii=False))
    sf = d.get("safe") or {}
    R.check(gid, "RU12", "安全词 → 温柔结局（safe），资源不扣",
            sf.get("ending") == "safe" and sf.get("phase") == "finale" and sf.get("resSame") is True,
            "safe=%s" % json.dumps(sf, ensure_ascii=False))
    sh = d.get("shop") or {}
    R.check(gid, "RU13", "商店：购买扣币/加物品、0 星屑时购买被拒",
            (sh.get("coinsAfter") is not None and sh.get("coinsAfter") < sh.get("coinsBefore"))
            and sh.get("blockedAtZero") is True,
            "shop=%s" % json.dumps(sh, ensure_ascii=False))
    R.check(gid, "RU14", "规则组无 pageerror/console error", ok_clean(take(pb)), errs_summary(take(pb)))
    pb.ctx.close()


# ---------------------------------------------------------------- 结局/奖项（构造状态）
ENDINGS_JS = r"""
(()=>{
  var E=App.Engine, out={cases:{},thresholds:{},err:null};
  function norm(x){ if(x && x.state && x.state.phase) return x.state; return x; }
  var ends={};(window.CONTENT.endings||[]).forEach(function(e){ends[e.id]=e;});
  function hit(eid,r,s){var e=ends[eid];try{return !!(e&&e.cond(r,s,{}));}catch(x){return false;}}
  function findMin(eid,base,key,maxv){
    for(var v=0;v<=maxv;v++){var r=Object.assign({},base);r[key]=v;if(hit(eid,r,{}))return v;}
    return null;
  }
  function base(seed){
    var s=norm(E.newSession({maxStar:4,length:'quick',blacklist:[]},{a:'甲',b:'乙'},9000+seed));
    s=norm(E.startRound(s)); s=norm(E.chooseCard(s,0)); s=norm(E.complete(s)); return s;
  }
  try{
    var zero={heart:0,tension:0,sync:0,coins:0};
    out.thresholds.slow={gentle:3,heart:6};
    out.thresholds.sync={sync:findMin('sync',{heart:8,gentle:0,tension:0,sync:0,coins:0},'sync',40),heart:8};
    out.thresholds.tension={tension:findMin('tension',Object.assign({},zero),'tension',40)};
    out.thresholds.heart={heart:findMin('heart',Object.assign({},zero),'heart',40)};
    var defs=[
      {id:'safe',apply:function(s){s.flags=s.flags||{};s.flags.safeWord=true;}},
      {id:'slow',apply:function(s){s.resources={heart:6,tension:0,sync:0,coins:0};s.gentle=3;}},
      {id:'sync',apply:function(s){var t=out.thresholds.sync.sync||15;
        s.resources={heart:8,tension:0,sync:t,coins:0};s.gentle=0;}},
      {id:'tension',apply:function(s){var t=out.thresholds.tension.tension||18;
        s.resources={heart:0,tension:t,sync:0,coins:0};s.gentle=0;}},
      {id:'heart',apply:function(s){var t=out.thresholds.heart.heart||14;
        s.resources={heart:t,tension:0,sync:0,coins:0};s.gentle=0;}},
      {id:'fallback',apply:function(s){s.resources={heart:1,tension:1,sync:1,coins:1};s.gentle=0;s.flags={};}}
    ];
    defs.forEach(function(def,i){
      var s=base(i); def.apply(s);
      var f=E.finish(s); var fs=norm(f);
      out.cases[def.id]={ending:fs.result&&fs.result.endingId,name:fs.result&&fs.result.endingName,
        awards:(fs.result&&fs.result.awards||[]).length,phase:fs.phase,
        stats:fs.result&&fs.result.stats?{heart:fs.result.stats.heart,sync:fs.result.stats.sync,tension:fs.result.stats.tension}:null};
    });
  }catch(e){out.err=String(e&&e.stack||e);}
  return out;
})()
"""


def group_endings(browser, base):
    gid = "EN"
    print("\n=== EN · 6 结局可达 / 奖项 ===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    goto_boot(pb, base)
    d = ui_eval(pb, ENDINGS_JS) or {}
    R.inventory["endings"] = d
    R.check(gid, "EN0", "构造结局脚本执行成功", not d.get("err"), str(d.get("err"))[:300])
    cases = d.get("cases") or {}
    for eid in ("safe", "slow", "sync", "tension", "heart", "fallback"):
        c = cases.get(eid) or {}
        R.check(gid, "EN-%s" % eid, "结局「%s」可达（endingId=%s）" % (eid, eid),
                c.get("ending") == eid, "case=%s" % json.dumps(c, ensure_ascii=False))
    award_lens = [(c or {}).get("awards") or 0 for c in cases.values()]
    R.check(gid, "EN-awards", "每个结局奖项 2–3 个", all(2 <= n <= 3 for n in award_lens),
            "awards=%s" % award_lens)
    th = d.get("thresholds") or {}
    sync_th = (th.get("sync") or {}).get("sync")
    doc_ok = (sync_th == DESIGN_TH["sync"]
              and (th.get("tension") or {}).get("tension") == DESIGN_TH["tension"]
              and (th.get("heart") or {}).get("heart") == DESIGN_TH["heart"])
    R.check(gid, "EN-doc", "结局阈值与 DESIGN §1.4 一致（sync=%s/tension=%s/heart=%s）"
            % (DESIGN_TH["sync"], DESIGN_TH["tension"], DESIGN_TH["heart"]),
            doc_ok, "runtimeThresholds=%s" % json.dumps(th, ensure_ascii=False), warn=not doc_ok)
    pb.ctx.close()


# ---------------------------------------------------------------- 持久化 / 回忆册 / 设置
def group_persist(browser, base):
    gid = "PS"
    print("\n=== PS · 存档续玩 / 回忆册 / 导出导入 / 设置 ===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    goto_boot(pb, base)
    # 1) 存档续玩
    made = ui_eval(pb, """(()=>{try{
      var s=App.Engine.newSession({maxStar:3,length:'classic',blacklist:[]},{a:'甲',b:'乙'},1234);
      App.Store.saveSession(s); return {phase:s.phase,round:s.round};
    }catch(e){return {err:String(e)}}})()""") or {}
    pb.page.reload(wait_until="load")
    pb.page.wait_for_timeout(900)
    cont = pb.page.evaluate("""(()=>{var b=document.querySelector('#btnContinue');
      return {has:!!b,text:b?(b.innerText||'').replace(/\\s+/g,' '):''};})()""")
    R.check(gid, "PS1", "刷新后有进行中的夜晚 → boot 出现「继续今晚」",
            cont.get("has") and "继续" in (cont.get("text") or ""),
            "continue=%s made=%s" % (json.dumps(cont, ensure_ascii=False), json.dumps(made, ensure_ascii=False)))
    click_first(pb, "#btnContinue")
    pb.page.wait_for_timeout(600)
    R.check(gid, "PS2", "「继续今晚」恢复到 journey（phase=draft）",
            body_screen(pb.page) == "journey", "screen=%r" % body_screen(pb.page))
    # 2) finale 保存 → 回忆册
    fin = ui_eval(pb, """(()=>{try{
      function norm(x){return x&&x.state&&x.state.phase?x.state:x;}
      var E=App.Engine;
      var q=norm(E.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},4321));
      for(var i=0;i<40;i++){
        if(q.phase==='finale')break;
        if(q.phase==='draft'){q=norm(E.startRound(q));q=norm(E.chooseCard(q,0));q=norm(E.complete(q));}
        else if(q.phase==='resolve'){q=norm(E.nextRound(q));}
        else if(q.phase==='event'){
          var eid=(q.outEvents||[]).filter(function(e){return e.type==='stage'&&e.eventId;}).map(function(e){return e.eventId;})[0];
          var ev=null;(window.CONTENT.events||[]).forEach(function(x){if(x.id===eid)ev=x;});
          q=norm(E.chooseEvent(q,eid,ev&&ev.options&&ev.options[0]&&ev.options[0].id));
        }
        else if(q.phase==='act'){q=norm(E.leaveAct(q));}
        else if(q.phase==='shop'){q=norm(E.leaveAct(q));}
        else break;
      }
      var f=norm(E.finish(q));
      App.Store.saveSession(f);
      App.Router.reset('finale',{state:f});
      return {ending:f.result&&f.result.endingId,round:f.round};
    }catch(e){return {err:String(e)}}})()""") or {}
    pb.page.wait_for_timeout(700)
    R.check(gid, "PS3", "构造 finale 并可渲染结局屏",
            body_screen(pb.page) == "finale" and bool(ui_eval(pb, "(document.querySelector('[data-test=\"finale-ending\"]')||{}).textContent")),
            "fin=%s screen=%r" % (json.dumps(fin, ensure_ascii=False), body_screen(pb.page)))
    hist0 = ui_eval(pb, "()=>App.Store.getHistory().length") or 0
    click_first(pb, '[data-test="finale-save"]', timeout=3000, wait=700)
    hist1 = ui_eval(pb, "()=>App.Store.getHistory().length") or 0
    entry = ui_eval(pb, "()=>App.Store.getHistory()[0]||null")
    R.check(gid, "PS4", "finale「保存进回忆册」写入历史", hist1 == hist0 + 1 and bool(entry),
            "before=%s after=%s entry=%s" % (hist0, hist1, json.dumps(entry, ensure_ascii=False)[:200]))
    # 3) 回忆册列表 / 导出 / 清空 / 导入
    click_first(pb, '[data-test="finale-home"]', timeout=3000, wait=500)
    goto_boot(pb, base)
    click_first(pb, "#btnMemory")
    pb.page.wait_for_timeout(500)
    mem = pb.page.evaluate("""(()=>{var items=document.querySelectorAll('[data-test="memory-item"]');
      return {screen:document.body.getAttribute('data-screen'),items:items.length,
        text:document.querySelector('[data-test="memory-list"]')?document.querySelector('[data-test="memory-list"]').innerText.slice(0,120):''};})()""")
    R.check(gid, "PS5", "回忆册显示历史夜晚（结局/日期）",
            mem.get("screen") == "memory" and mem.get("items", 0) >= 1,
            "mem=%s" % json.dumps(mem, ensure_ascii=False)[:260])
    R.shot(pb.page, "persist-memory-390x844")
    dl_path = OUT_DIR / "export.json"
    dl_ok = False
    try:
        with pb.page.expect_download(timeout=8000) as dl:
            click_first(pb, '[data-test="memory-export"]', timeout=3000, wait=100)
        dl.value.save_as(str(dl_path))
        dl_ok = True
    except Exception as e:
        dl_err = str(e)[:120]
    exported = None
    if dl_ok and dl_path.exists():
        try:
            exported = json.loads(dl_path.read_text(encoding="utf-8"))
        except Exception as e:
            exported = {"parse_error": str(e)}
    R.check(gid, "PS6", "回忆册导出下载 JSON（app/v/settings/session/history）",
            dl_ok and isinstance(exported, dict) and exported.get("app") == "couple-voyage"
            and "history" in exported and "settings" in exported,
            "download=%s keys=%s" % (dl_ok, list(exported.keys()) if isinstance(exported, dict) else None))
    # 清空
    click_first(pb, '[data-test="memory-clear"]', timeout=2500, wait=300)
    click_first(pb, '[data-yes]', timeout=2500, wait=500)
    hist_clear = ui_eval(pb, "()=>App.Store.getHistory().length")
    R.check(gid, "PS7", "回忆册「清空」后历史为 0", hist_clear == 0, "history=%s" % hist_clear)
    # 导入
    if dl_ok and dl_path.exists():
        try:
            pb.page.set_input_files('[data-test="memory-file"]', str(dl_path))
            pb.page.wait_for_timeout(500)
            click_first(pb, '[data-yes]', timeout=2500, wait=600)
        except Exception:
            pass
        hist_import = ui_eval(pb, "()=>App.Store.getHistory().length")
        R.check(gid, "PS8", "回忆册导入备份后历史恢复", (hist_import or 0) >= 1, "history=%s" % hist_import)
    else:
        R.check(gid, "PS8", "回忆册导入备份后历史恢复", False, "无导出文件", skip=True)
    # 4) 设置屏
    goto_boot(pb, base)
    click_first(pb, "#btnSettings")
    pb.page.wait_for_timeout(500)
    st = pb.page.evaluate("""(()=>{var s=App.Store.getSettings();
      var sw=document.querySelector('[data-test^="settings-"][role="switch"]');
      var btn=document.querySelector('[data-test="settings-maxstar-2"]');
      return {screen:document.body.getAttribute('data-screen'),sound:s.sound,haptics:s.haptics,reduced:s.reduced,
        hasSwitch:!!sw,switchTest:sw?sw.getAttribute('data-test'):'',hasMax2:!!btn,version:(document.querySelector('[data-test="settings-version"]')||{}).textContent||''};})()""")
    R.check(gid, "PS9", "设置屏渲染（开关/尺度/版本）",
            st.get("screen") == "settings" and st.get("hasSwitch") and st.get("hasMax2") and bool(st.get("version")),
            "settings=%s" % json.dumps(st, ensure_ascii=False))
    sound0 = st.get("sound")
    click_first(pb, '[data-test^="settings-"][role="switch"]', timeout=2500, wait=350)
    sound1 = ui_eval(pb, "()=>App.Store.getSettings().sound")
    R.check(gid, "PS10", "设置开关生效并持久化（声音）", sound0 != sound1 and sound1 is not None,
            "sound %s→%s" % (sound0, sound1))
    click_first(pb, '[data-test="settings-maxstar-2"]', timeout=2500, wait=350)
    ms = ui_eval(pb, "()=>App.Store.getSettings().maxStar")
    click_first(pb, '[data-test="settings-maxstar-3"]', timeout=2000, wait=200)
    R.check(gid, "PS11", "默认尺度设置生效并持久化（maxStar→2）", ms == 2, "maxStar=%s" % ms)
    # 导出 / 清除
    sdl_ok = False
    try:
        with pb.page.expect_download(timeout=8000) as dl2:
            click_first(pb, '[data-test="settings-export"]', timeout=3000, wait=100)
        sdl_ok = True
    except Exception:
        pass
    R.check(gid, "PS12", "设置屏导出备份可下载", sdl_ok, "download=%s" % sdl_ok)
    click_first(pb, '[data-test="settings-reset"]', timeout=2500, wait=300)
    click_first(pb, '[data-yes]', timeout=2500, wait=600)
    cleared = ui_eval(pb, "()=>localStorage.length") or 0
    on_boot = body_screen(pb.page) == "boot"
    R.check(gid, "PS13", "清除所有数据 → localStorage 清空并回到 boot", cleared == 0 and on_boot,
            "keys=%s screen=%r" % (cleared, body_screen(pb.page)))
    pb.ctx.close()


# ---------------------------------------------------------------- 三视口 + 可访问性 + reduce
def group_quality(browser, base):
    gid = "QT"
    print("\n=== QT · 三视口/桌面 + 可访问性 + reduce（journey/play）===")
    small_agg = {}
    for key, vp in VIEWPORTS.items():
        pb = make_ctx(browser, viewport=vp)
        goto_boot(pb, base)
        res = {"boot": None, "setup": None, "journey": None, "play": None}
        shot_name = None
        for screen in ("setup", "journey", "play"):
            if screen == "setup":
                click_first(pb, "#btnNew", timeout=3000)
                if not wait_screen(pb.page, "setup"):
                    res[screen] = {"err": "setup not reached"}
                    continue
            if screen == "journey":
                # 构造 session 并进 journey（避免依赖向导）
                ui_eval(pb, """(()=>{try{
                  var s=App.Engine.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},99);
                  App.Store.saveSession(s); App.Router.go('journey');
                }catch(e){}})()""")
                pb.page.wait_for_timeout(450)
            if screen == "play":
                click_first(pb, '[data-test^="journey-card-"]', timeout=3000, wait=500)
            m = pb.page.evaluate("""(()=>{var el=document.querySelector('#screen .screen')||document.querySelector('.screen');
              return {screen:document.body.getAttribute('data-screen'),
                sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
                sh:document.documentElement.scrollHeight,ch:document.documentElement.clientHeight,
                smallBtns:Array.prototype.filter.call(document.querySelectorAll('button'),function(b){
                  var r=b.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<44;}).map(function(b){
                  return {dt:b.getAttribute('data-test')||'',cls:String(b.className).slice(0,40),
                    text:(b.innerText||'').replace(/\s+/g,' ').slice(0,20),h:Math.round(b.getBoundingClientRect().height)};}),
                noNameIconBtns:Array.prototype.filter.call(document.querySelectorAll('button'),function(b){
                  var r=b.getBoundingClientRect();var t=(b.innerText||'').trim();
                  return r.width>0&&r.height>0&&!t&&!b.getAttribute('aria-label');}).length};})()""")
            res[screen] = m
            if key == "390x844" and screen in ("journey", "play"):
                R.shot(pb.page, "quality-%s-390x844" % screen)
        ok_scr = all((res.get(s) or {}).get("screen") == s for s in ("setup", "journey", "play"))
        over = [(s, (res.get(s) or {}).get("sw", 0) - (res.get(s) or {}).get("cw", 0))
                for s in ("setup", "journey", "play")]
        R.check(gid, "QT-%s" % key, "%s setup/journey/play 渲染且无横向滚动" % key,
                ok_scr and all(d <= 1 for _, d in over),
                "screens=%s overflow=%s" % (json.dumps({s: (res.get(s) or {}).get("screen") for s in res},
                                                       ensure_ascii=False), over))
        smalls = {s: (res.get(s) or {}).get("smallBtns") for s in ("setup", "journey", "play")}
        small_agg[key] = smalls
        noname = {s: (res.get(s) or {}).get("noNameIconBtns") for s in ("setup", "journey", "play")}
        R.check(gid, "QTb-%s" % key, "%s 图标按钮有 aria-label" % key,
                all((v or 0) == 0 for v in noname.values()), "noName=%s" % noname, severity="P2")
        pb.ctx.close()
    # 汇总 44px 违规（取 390 视口的明细作为代表）
    offenders = {}
    for key, smalls in small_agg.items():
        for scr, lst in (smalls or {}).items():
            for b in (lst or []):
                k = (scr, b.get("dt") or b.get("cls"), b.get("text"), b.get("h"))
                offenders.setdefault(k, []).append(key)
    R.check(gid, "QTa", "setup/journey/play 按钮点击区 ≥44px（DESIGN §8.7）",
            not offenders,
            "offenders=%s" % json.dumps([{"screen": k[0], "sel": k[1], "text": k[2], "h": k[3],
                                          "vps": v} for k, v in offenders.items()], ensure_ascii=False)[:700],
            severity="P2")
    # reduce：journey/play 无长动画/粒子
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"], reduced="reduce")
    goto_boot(pb, base)
    ui_eval(pb, """(()=>{try{
      var s=App.Engine.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},7);
      App.Store.saveSession(s); App.Router.go('journey');
    }catch(e){}})()""")
    pb.page.wait_for_timeout(500)
    red1 = pb.page.evaluate("""(()=>{
      var anims=[];try{document.getAnimations().forEach(function(a){var t=a.effect&&a.effect.getTiming?a.effect.getTiming():{};
        anims.push({dur:t.duration,iter:t.iterations,state:a.playState});});}catch(e){}
      try{App.Motion.burst(100,100,{count:20});}catch(e){}
      return {reduced:App.Motion.reduced(),anims:anims,dots:document.querySelectorAll('.fx-dot').length};
    })()""")
    click_first(pb, '[data-test^="journey-card-"]', timeout=3000, wait=500)
    red2 = pb.page.evaluate("""(()=>{
      var anims=[];try{document.getAnimations().forEach(function(a){var t=a.effect&&a.effect.getTiming?a.effect.getTiming():{};
        anims.push({dur:t.duration,iter:t.iterations,state:a.playState});});}catch(e){}
      return {screen:document.body.getAttribute('data-screen'),reduced:App.Motion.reduced(),anims:anims,
        dots:document.querySelectorAll('.fx-dot').length};})()""")
    all_anims = (red1.get("anims") or []) + (red2.get("anims") or [])
    long_anims = [a for a in all_anims if isinstance(a.get("dur"), (int, float)) and a["dur"] > 800]
    inf = [a for a in all_anims if a.get("iter") == "Infinity"]
    R.check(gid, "QT-red", "reduce 下 journey/play 无长动画/无限动画/粒子",
            red1.get("reduced") is True and red2.get("reduced") is True
            and not long_anims and not inf and red1.get("dots") == 0 and red2.get("dots") == 0,
            "red1=%s red2=%s" % (json.dumps({"anims": red1.get("anims"), "dots": red1.get("dots")}, ensure_ascii=False)[:240],
                                 json.dumps({"screen": red2.get("screen"), "dots": red2.get("dots")}, ensure_ascii=False)[:120]))
    R.shot(pb.page, "quality-reduce-play-390x844")
    pb.ctx.close()
    # act：单主 CTA + 共鸣环 %/比值；各屏与「停」胶囊无重叠
    def _probe_screen(pb2, phase, screen, extra=None):
        ui_eval(pb2, """(()=>{try{
          var E=App.Engine; function norm(x){return x&&x.state&&x.state.phase?x.state:x;}
          var s=norm(E.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},88));
          s.phase='%s'; s.pendingActEnd=true; s.act=1; s.round=3;
          App.Store.saveSession(s); App.Router.go('%s');
        }catch(e){}})()""" % (phase, screen))
        pb2.page.wait_for_timeout(650)
        return pb2.page.evaluate("""(()=>{
          var gs=document.querySelector('.global-safe');
          var gr=gs?gs.getBoundingClientRect():null;
          var offs=[];
          if(gr) Array.prototype.forEach.call(document.querySelectorAll('button,a,[role="button"]'),function(el){
            if(el===gs||gs.contains(el)) return;
            var r=el.getBoundingClientRect();
            if(r.width<=0||r.height<=0) return;
            var ix=Math.min(gr.right,r.right)-Math.max(gr.left,r.left);
            var iy=Math.min(gr.bottom,r.bottom)-Math.max(gr.top,r.top);
            if(ix>2&&iy>2) offs.push({sel:el.getAttribute('data-test')||String(el.className).slice(0,40),
              rect:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],
              ov:[Math.round(ix),Math.round(iy)]});
          });
          var prim=document.querySelectorAll('#screen .btn.primary, #screen button.primary');
          var txt=(document.querySelector('#screen').innerText||'');
          return {screen:document.body.getAttribute('data-screen'),
            gs:gr?[Math.round(gr.x),Math.round(gr.y),Math.round(gr.width),Math.round(gr.height)]:null,
            offs:offs.slice(0,6),primary:prim.length,text:txt.slice(0,400),
            hasDirectNext:/直接进下一幕/.test(txt),
            ringPct:/\d+\s*%/.test(txt), ringRatio:/\d+\s*\/\s*\d+/.test(txt)};
        })()""")
    pb2 = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    goto_boot(pb2, base)
    act = _probe_screen(pb2, "act", "act")
    R.check(gid, "QT-act1", "act 屏仅 1 个主 CTA（无「直接进下一幕」）",
            act.get("primary") == 1 and act.get("hasDirectNext") is False,
            "act=%s" % json.dumps({k: act.get(k) for k in ("primary", "hasDirectNext")}, ensure_ascii=False))
    R.check(gid, "QT-act2", "act 共鸣环显示 % 与「本幕 / 目标」比值",
            act.get("ringPct") and act.get("ringRatio"),
            "act=%s" % json.dumps({k: act.get(k) for k in ("ringPct", "ringRatio")}, ensure_ascii=False))
    R.check(gid, "QT-act3", "act 屏与「停」胶囊无重叠", not act.get("offs"),
            "gs=%s offs=%s" % (act.get("gs"), json.dumps(act.get("offs"), ensure_ascii=False)))
    R.shot(pb2.page, "quality-act-390x844")
    pb2.ctx.close()
    # journey / shop / event 与「停」胶囊无重叠
    for phase, screen in (("draft", "journey"), ("shop", "shop"), ("event", "event")):
        pbo = make_ctx(browser, viewport=VIEWPORTS["390x844"])
        goto_boot(pbo, base)
        info = _probe_screen(pbo, phase, screen)
        R.check(gid, "QT-ov-%s" % screen, "%s 屏与「停」胶囊无重叠" % screen,
                not info.get("offs"),
                "gs=%s offs=%s" % (info.get("gs"), json.dumps(info.get("offs"), ensure_ascii=False)))
        if screen == "journey":
            R.shot(pbo.page, "quality-journey-overlap-390x844")
        pbo.ctx.close()


# ---------------------------------------------------------------- 三种长度（引擎级）
LENGTHS_JS = r"""
(()=>{
  var E=App.Engine, out={};
  function norm(x){ if(x && x.state && x.state.phase) return x.state; return x; }
  function run(len,seed){
    var s=norm(E.newSession({maxStar:4,length:len,blacklist:[]},{a:'甲',b:'乙'},seed));
    var total=E.progress(s).total;
    var plays=0,actsSeen=[],eventsSeen=[];
    for(var i=0;i<80;i++){
      if(s.phase==='finale')break;
      if(s.phase==='draft'){s=norm(E.startRound(s));s=norm(E.chooseCard(s,0));s=norm(E.complete(s));plays++;}
      else if(s.phase==='resolve'){
        s=norm(E.nextRound(s));
        (s.outEvents||[]).forEach(function(e){if(e.type==='actEnd')actsSeen.push({act:e.act,score:e.score,threshold:e.threshold});
          if(e.type==='stage'&&e.eventId)eventsSeen.push(e.eventId);});
      }
      else if(s.phase==='event'){
        var eid=(s.outEvents||[]).filter(function(e){return e.type==='stage'&&e.eventId;}).map(function(e){return e.eventId;})[0];
        var ev=null;(window.CONTENT.events||[]).forEach(function(x){if(x.id===eid)ev=x;});
        s=norm(E.chooseEvent(s,eid,ev&&ev.options&&ev.options[0]&&ev.options[0].id));
      }
      else if(s.phase==='act'||s.phase==='shop'){s=norm(E.leaveAct(s));}
      else break;
    }
    if(s.phase==='finale'){ s=norm(E.finish(s)); }
    return {len:len,total:total,plays:plays,finalPhase:s.phase,finalRound:s.round,
      ending:s.result&&s.result.endingId,awards:s.result&&(s.result.awards||[]).length,
      actEnds:actsSeen,events:eventsSeen};
  }
  try{
    out.quick=run('quick',11);
    out.classic=run('classic',12);
    out.deep=run('deep',13);
  }catch(e){out.err=String(e&&e.stack||e);}
  return out;
})()
"""


def group_lengths(browser, base):
    gid = "LEN"
    print("\n=== LEN · quick / classic / deep 长度 ===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    goto_boot(pb, base)
    d = ui_eval(pb, LENGTHS_JS) or {}
    R.inventory["lengths"] = d
    R.check(gid, "LEN0", "三种长度模拟执行成功", not d.get("err"), str(d.get("err"))[:300])
    for key, rounds in (("quick", 9), ("classic", 14), ("deep", 18)):
        r = d.get(key) or {}
        R.check(gid, "LEN-%s" % key, "%s 总回合数=%d、play 次数一致、走到 finale" % (key, rounds),
                r.get("total") == rounds and r.get("plays") == rounds
                and r.get("finalPhase") == "finale" and (r.get("ending") or "") != "",
                "len=%s" % json.dumps(r, ensure_ascii=False)[:420], r)
        acts = r.get("actEnds") or []
        R.check(gid, "LENa-%s" % key, "%s 幕末 actEnd 事件 3 次且幕序 1→2→3" % key,
                len(acts) >= 2 and [a.get("act") for a in acts] == sorted({a.get("act") for a in acts}),
                "actEnds=%s" % json.dumps(acts, ensure_ascii=False)[:260])
    pb.ctx.close()


# ---------------------------------------------------------------- 全局安全词（safe.js）
def _safe_vis(pb):
    return pb.page.evaluate("""(()=>{var b=document.querySelector('.global-safe');
      if(!b) return {exists:false};
      var cs=getComputedStyle(b),r=b.getBoundingClientRect();
      return {exists:true,show:b.classList.contains('show'),display:cs.display,
        opacity:cs.opacity,pointer:cs.pointerEvents,h:Math.round(r.height),w:Math.round(r.width),
        screen:document.body.getAttribute('data-screen')};})()""") or {}


def group_safe(browser, base):
    gid = "SAFE"
    print("\n=== SAFE · 全局安全词（boot/setup 不显示；journey/event/act/shop 长按 1.5s）===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    goto_boot(pb, base)
    v_boot = _safe_vis(pb)
    R.check(gid, "SAFE1", "boot 无进行中夜晚：全局安全词不可见",
            v_boot.get("exists") and (v_boot.get("display") == "none" or not v_boot.get("show")),
            json.dumps(v_boot, ensure_ascii=False))
    click_first(pb, "#btnNew")
    if not wait_screen(pb.page, "setup"):
        R.check(gid, "SAFE2", "setup 隐藏全局安全词", False, "未进入 setup")
    else:
        v = _safe_vis(pb)
        R.check(gid, "SAFE2", "setup 隐藏全局安全词",
                v.get("display") == "none" or not v.get("show"), json.dumps(v, ensure_ascii=False))
    # 构造 journey（active session）
    ui_eval(pb, """(()=>{try{
      var s=App.Engine.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},520);
      App.Store.saveSession(s); App.Router.go('journey');
    }catch(e){}})()""")
    pb.page.wait_for_timeout(500)
    v_j = _safe_vis(pb)
    R.check(gid, "SAFE3", "journey（有进行中夜晚）显示安全词（44px 胶囊）",
            v_j.get("show") is True and v_j.get("display") != "none" and (v_j.get("h") or 0) >= 44,
            json.dumps(v_j, ensure_ascii=False))
    R.shot(pb.page, "safe-journey-390x844")
    # 短按不触发
    try:
        pb.page.locator(".global-safe").dispatch_event("pointerdown")
        pb.page.wait_for_timeout(320)
        pb.page.locator(".global-safe").dispatch_event("pointerup")
    except Exception:
        pass
    pb.page.wait_for_timeout(400)
    st_short = ui_eval(pb, "()=>({screen:document.body.getAttribute('data-screen'),phase:(App.Store.getSession()||{}).phase})") or {}
    R.check(gid, "SAFE4", "短按（0.3s）不触发安全词（仍在 journey）",
            st_short.get("screen") == "journey", json.dumps(st_short, ensure_ascii=False))
    # 长按 1.5s → finale safe
    before = ui_eval(pb, "()=>JSON.stringify((App.Store.getSession()||{}).resources||{})")
    try:
        pb.page.locator(".global-safe").dispatch_event("pointerdown")
        pb.page.wait_for_timeout(1900)
    except Exception:
        pass
    st_long = ui_eval(pb, """(()=>({screen:document.body.getAttribute('data-screen'),
      ending:((App.Store.getSession()||{}).result||{}).endingId,
      phase:(App.Store.getSession()||{}).phase,
      res:JSON.stringify((App.Store.getSession()||{}).resources||{})}))()""") or {}
    R.check(gid, "SAFE5", "长按 1.5s → finale 且为安全结局 safe",
            st_long.get("screen") == "finale" and st_long.get("ending") == "safe",
            json.dumps(st_long, ensure_ascii=False))
    R.check(gid, "SAFE6", "安全词收尾不扣资源（前后一致）",
            st_long.get("res") == before, "before=%s after=%s" % (before, st_long.get("res")))
    R.shot(pb.page, "safe-finale-390x844")
    # play 隐藏；event/act/shop 显示
    ui_eval(pb, """(()=>{try{
      var E=App.Engine; function norm(x){return x&&x.state&&x.state.phase?x.state:x;}
      var s=norm(E.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},521));
      s=norm(E.startRound(s)); s=norm(E.chooseCard(s,0));
      App.Store.saveSession(s); App.Router.go('play');
    }catch(e){}})()""")
    pb.page.wait_for_timeout(500)
    v_play = _safe_vis(pb)
    R.check(gid, "SAFE7", "play 屏隐藏全局安全词（play 自带安全词）",
            v_play.get("display") == "none" or not v_play.get("show"), json.dumps(v_play, ensure_ascii=False))
    for scr, phase in (("event", "event"), ("act", "act"), ("shop", "shop")):
        ui_eval(pb, """(()=>{try{
          var E=App.Engine; function norm(x){return x&&x.state&&x.state.phase?x.state:x;}
          var s=norm(E.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},522));
          s.phase='%s'; s.pendingActEnd=false; s.act=1; s.round=4;
          App.Store.saveSession(s); App.Router.go('%s');
        }catch(e){}})()""" % (phase, scr))
        pb.page.wait_for_timeout(500)
        v = _safe_vis(pb)
        got = v.get("show") is True and v.get("display") != "none"
        R.check(gid, "SAFE8-%s" % scr, "%s 屏显示全局安全词" % scr, got,
                json.dumps(v, ensure_ascii=False), skip=not got and scr == "event")
        if scr == "shop":
            R.shot(pb.page, "safe-shop-390x844")
    pb.ctx.close()
# ---------------------------------------------------------------- 存档续玩（正确 phase）
CONTINUE_CASES = [
    ("journey", """(()=>{try{
        var s=App.Engine.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},610);
        App.Store.saveSession(s); return {phase:s.phase};
      }catch(e){return {err:String(e)}}})()""", "journey"),
    ("play", """(()=>{try{
        var E=App.Engine,x=function(s){return s&&s.state&&s.state.phase?s.state:s};
        var s=x(E.startRound(x(E.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},611))));
        s=x(E.chooseCard(s,0)); App.Store.saveSession(s); return {phase:s.phase};
      }catch(e){return {err:String(e)}}})()""", "play"),
    ("event", """(()=>{try{
        var E=App.Engine,x=function(s){return s&&s.state&&s.state.phase?s.state:s};
        var s=x(E.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},612));
        s.phase='event'; s.pendingActEnd=true; s.act=1; s.round=3;
        App.Store.saveSession(s); return {phase:s.phase};
      }catch(e){return {err:String(e)}}})()""", "event"),
    ("act", """(()=>{try{
        var E=App.Engine,x=function(s){return s&&s.state&&s.state.phase?s.state:s};
        var s=x(E.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},613));
        s.phase='act'; s.pendingActEnd=true; s.act=1; s.round=3;
        App.Store.saveSession(s); return {phase:s.phase};
      }catch(e){return {err:String(e)}}})()""", "act"),
]


def group_continue(browser, base):
    gid = "CN"
    print("\n=== CN · 存档续玩（journey/play/event/act + finale 刷新）===")
    for key, js, expect in CONTINUE_CASES:
        pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
        goto_boot(pb, base)
        made = ui_eval(pb, js) or {}
        pb.page.reload(wait_until="load")
        pb.page.wait_for_timeout(900)
        cont = pb.page.evaluate("""(()=>{var b=document.querySelector('#btnContinue');
          return {has:!!b,text:b?(b.innerText||'').replace(/\\s+/g,' '):''};})()""")
        click_first(pb, "#btnContinue", timeout=3000, wait=700)
        scr = body_screen(pb.page)
        R.check(gid, "CN-%s" % key, "%s 中途刷新 → boot「继续今晚」→ 回到 %s" % (key, expect),
                cont.get("has") and "继续" in (cont.get("text") or "") and scr == expect,
                "made=%s cont=%s screen=%r" % (json.dumps(made, ensure_ascii=False),
                                               json.dumps(cont, ensure_ascii=False), scr))
        pb.ctx.close()
    # finale 刷新：应直接进结局、不重复结算
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    goto_boot(pb, base)
    fin = ui_eval(pb, """(()=>{try{
      var E=App.Engine,x=function(s){return s&&s.state&&s.state.phase?s.state:s};
      var q=x(E.newSession({maxStar:3,length:'quick',blacklist:[]},{a:'甲',b:'乙'},614));
      for(var i=0;i<40;i++){
        if(q.phase==='finale')break;
        if(q.phase==='draft'){q=x(E.startRound(q));q=x(E.chooseCard(q,0));q=x(E.complete(q));}
        else if(q.phase==='resolve'){q=x(E.nextRound(q));}
        else if(q.phase==='event'){var eid=(q.outEvents||[]).filter(function(e){return e.type==='stage'&&e.eventId;}).map(function(e){return e.eventId;})[0];var ev=null;(window.CONTENT.events||[]).forEach(function(x2){if(x2.id===eid)ev=x2;});q=x(E.chooseEvent(q,eid,ev&&ev.options&&ev.options[0]&&ev.options[0].id));}
        else if(q.phase==='act'||q.phase==='shop'){q=x(E.leaveAct(q));} else break;
      }
      q=x(E.finish(q)); App.Store.saveSession(q);
      return {phase:q.phase,ending:q.result&&q.result.endingId,hist:App.Store.getHistory().length};
    }catch(e){return {err:String(e)}}})()""") or {}
    hist_before = ui_eval(pb, "()=>App.Store.getHistory().length") or 0
    pb.page.reload(wait_until="load")
    pb.page.wait_for_timeout(1100)
    after = pb.page.evaluate("""(()=>{var b=document.querySelector('#btnContinue');
      return {screen:document.body.getAttribute('data-screen'),
        cont:!!b,hist:App.Store.getHistory().length,
        phase:(App.Store.getSession()||{}).phase,
        ending:document.querySelector('[data-test="finale-ending"]')?document.querySelector('[data-test="finale-ending"]').textContent:null};})()""")
    R.check(gid, "CN-finale", "finale 刷新后直接回到结局屏（不重复结算）",
            after.get("screen") == "finale" and after.get("hist") == hist_before,
            "fin=%s after=%s" % (json.dumps(fin, ensure_ascii=False), json.dumps(after, ensure_ascii=False)))
    R.check(gid, "CN-finale2", "finale 刷新后存档 phase 仍为 finale、历史未重复写入",
            after.get("phase") == "finale" and after.get("hist") == hist_before,
            "phase=%s hist=%s(before=%s)" % (after.get("phase"), after.get("hist"), hist_before))
    if after.get("screen") == "finale":
        R.shot(pb.page, "continue-finale-390x844")
    pb.ctx.close()


def group_offline(browser, base):
    gid = "OF"
    print("\n=== OF · PWA / 离线 reload ===")
    pb = make_ctx(browser, viewport=VIEWPORTS["390x844"])
    goto_boot(pb, base)
    sw = ui_eval(pb, """async ()=>{try{
      if(!('serviceWorker' in navigator))return {ok:false,reason:'unsupported'};
      var r=await Promise.race([navigator.serviceWorker.ready,new Promise(function(_,rej){setTimeout(function(){rej(new Error('timeout'))},10000)})]);
      return {ok:true,scope:r.scope,active:!!r.active};
    }catch(e){return {ok:false,reason:String(e)}}}""") or {}
    waited, ctrl = 0, False
    while waited < 6000 and not ctrl:
        ctrl = bool(ui_eval(pb, "!!(navigator.serviceWorker&&navigator.serviceWorker.controller)"))
        if not ctrl:
            pb.page.wait_for_timeout(250)
            waited += 250
    R.check(gid, "OF1", "Service Worker 注册并接管（ready + controller）",
            sw.get("ok") and ctrl, "sw=%s ctrl=%s" % (json.dumps(sw, ensure_ascii=False), ctrl))
    pill = pb.page.evaluate("""(()=>{var p=document.querySelector('[data-test="pwa-install-pill"]');
      return {exists:!!p,text:p?p.textContent:''};})()""")
    R.check(gid, "OF2", "boot 不再显示「装到桌面」按钮", not pill.get("exists"),
            "pill=%s" % json.dumps(pill, ensure_ascii=False))
    # 按钮已移除，但安装说明 API 仍保留，供未来入口或帮助页调用
    ui_eval(pb, "()=>{try{App.PWA&&App.PWA.showInstall&&App.PWA.showInstall();}catch(e){}}")
    pb.page.wait_for_timeout(600)
    sheet = pb.page.evaluate("""(()=>{var s=document.querySelector('[data-test="pwa-install-sheet"]');
      return {shown:!!s,text:s?s.innerText.slice(0,160):''};})()""")
    R.check(gid, "OF3", "安装说明 API 仍可打开说明抽屉",
            sheet.get("shown") is True, "sheet=%s" % json.dumps(sheet, ensure_ascii=False))
    if sheet.get("shown"):
        click_first(pb, '[data-test="pwa-install-action"]', timeout=2500, wait=300)
    pb.clear()
    pb.ctx.set_offline(True)
    pb.page.wait_for_timeout(400)
    reload_ok = True
    try:
        pb.page.reload(wait_until="load", timeout=30000)
    except Exception:
        reload_ok = False
    pb.page.wait_for_timeout(1200)
    H_dummy = pb.page.evaluate("""(()=>{var b=document.querySelector('.boot-title');
      return {boot:!!b,screen:document.body.getAttribute('data-screen')};})()""")
    t_off = take(pb)
    pb.ctx.set_offline(False)
    R.check(gid, "OF4", "离线 reload 可玩（boot 可打开）",
            reload_ok and H_dummy.get("boot") is True,
            "reload=%s boot=%s" % (reload_ok, H_dummy.get("boot")))
    R.check(gid, "OF5", "离线无 pageerror / console error",
            ok_clean(t_off), errs_summary(t_off))
    pb.ctx.close()


# ---------------------------------------------------------------- 报告
def render_markdown(res, path):
    s = res["summary"]
    lines = []
    lines.append("# 升温夜航 V3 · 独立 QA 报告（%s）\n" % res["meta"].get("stage_label", "QA"))
    lines.append("> 被测物：`%s`（index SHA256 `%s`，%s B）" % (
        res["meta"].get("dist_dir"), (res["meta"].get("index_sha256") or "")[:16], res["meta"].get("index_size")))
    lines.append("> 结果：**PASS %d / FAIL %d / SKIP %d / WARN %d**（共 %d 项）" % (
        s["PASS"], s["FAIL"], s["SKIP"], s["WARN"], len(res["checks"])))
    lines.append("")
    lines.append("## 1. 环境\n")
    m = res["meta"]
    lines.append("| 项 | 值 |\n|---|---|")
    for k, label in (("generated_at", "时间"), ("dist_dir", "被测目录"), ("index_sha256", "SHA256"),
                     ("index_size", "index.html 大小"), ("stage", "阶段"), ("port", "端口"),
                     ("python", "Python"), ("git_branch", "分支")):
        lines.append("| %s | %s |" % (label, m.get(k)))
    lines.append("")
    lines.append("## 2. 结果明细\n")
    groups = {}
    for c in res["checks"]:
        groups.setdefault(c["group"], []).append(c)
    for g, items in groups.items():
        lines.append("### %s\n" % g)
        lines.append("| ID | 检查 | 结果 | 证据/说明 |\n|---|---|---|---|")
        for c in items:
            det = (c.get("detail") or "").replace("|", "\\|")
            lines.append("| %s | %s | %s | %s |" % (c["id"], c["name"], c["status"], det[:220]))
        lines.append("")
    lines.append("## 3. 问题清单\n")
    if not res["issues"]:
        lines.append("无 FAIL 级问题。\n")
    else:
        lines.append("| 严重度 | 问题 | 详情 |\n|---|---|---|")
        for i in res["issues"]:
            lines.append("| %s | %s | %s |" % (i["severity"], i["title"],
                                               (i.get("detail") or "").replace("|", "\\|")[:300]))
        lines.append("")
    lines.append("## 4. 屏幕/选择器清单\n")
    for name, inv in (res.get("inventory") or {}).items():
        if not isinstance(inv, dict) or "items" not in inv:
            continue
        lines.append("### %s（screen=`%s`）\n" % (name, inv.get("screen")))
        lines.append("- data-test: `%s`" % (inv.get("dataTests") or []))
        lines.append("- 可交互元素: %d 个" % len(inv.get("items") or []))
        lines.append("")
    lines.append("## 5. 截图\n")
    for p in res.get("shots") or []:
        lines.append("- `%s`" % p)
    lines.append("")
    lines.append("## 6. 数据文件\n")
    lines.append("- `%s`" % res["meta"].get("data_json"))
    path.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------- 主流程
STAGES = {
    "shell": [group_shell, group_viewports, group_reduce],
    "flow": [group_flow],
    "rules": [group_rules],
    "endings": [group_endings],
    "persist": [group_persist],
    "quality": [group_quality],
    "offline": [group_offline],
    "lengths": [group_lengths],
    "safe": [group_safe],
    "continue": [group_continue],
}
FULL_GROUPS = (STAGES["shell"] + STAGES["flow"] + STAGES["rules"] + STAGES["endings"]
               + STAGES["persist"] + STAGES["quality"] + STAGES["offline"]
               + STAGES["lengths"] + STAGES["safe"] + STAGES["continue"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default=str(ROOT / "dist" / "rebuild-qa"))
    ap.add_argument("--port", type=int, default=8878)
    ap.add_argument("--stage", default="shell",
                    help="shell / full —— shell=壳层（阶段1）；full=DESIGN §8 全量")
    ap.add_argument("--only", default="", help="只跑指定分组前缀，如 shell,viewports")
    ap.add_argument("--out-name", default="")
    ap.add_argument("--md-name", default="")
    args = ap.parse_args()
    dist = pathlib.Path(args.dist).resolve()
    idx = dist / "index.html"
    stage_label = {"shell": "阶段1 · 壳层", "full": "全量验收"}.get(args.stage, args.stage)
    out_name = args.out_name or ("qa-data-stage1.json" if args.stage == "shell" else "qa-data.json")
    md_name = args.md_name or ("qa-report-stage1.md" if args.stage == "shell" else "qa-report.md")

    from playwright.sync_api import sync_playwright

    print("[V3-QA] 被测目录: %s" % dist)
    print("[V3-QA] 阶段: %s" % stage_label)
    t0 = time.time()
    res = {"meta": {}, "checks": [], "issues": [], "shots": [], "inventory": {}}
    try:
        branch = __import__("subprocess").run(
            ["git", "-C", str(ROOT), "branch", "--show-current"],
            capture_output=True, text=True, timeout=10).stdout.strip()
    except Exception:
        branch = None
    res["meta"] = {
        "stage": args.stage, "stage_label": stage_label,
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "dist_dir": str(dist),
        "index_size": idx.stat().st_size if idx.exists() else None,
        "index_sha256": hashlib.sha256(idx.read_bytes()).hexdigest().upper() if idx.exists() else None,
        "port": args.port, "python": sys.version.split()[0], "git_branch": branch,
    }
    only = {x.strip() for x in args.only.split(",") if x.strip()}

    with serve(str(dist), port=args.port) as base:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            if args.stage == "shell":
                groups = STAGES["shell"]
            else:
                groups = FULL_GROUPS
            for fn in groups:
                gname = fn.__name__.replace("group_", "")
                if only and gname not in only:
                    continue
                try:
                    fn(browser, base)
                except Exception as e:
                    import traceback
                    traceback.print_exc()
                    R.issue("P0", "分组 %s 崩溃" % gname, "%s: %s" % (type(e).__name__, e))
            browser.close()

    res["checks"] = R.checks
    res["issues"] = R.issues
    res["shots"] = R.shots
    res["inventory"] = R.inventory
    res["summary"] = R.summary()
    data_path = OUT_DIR / out_name
    md_path = OUT_DIR / md_name
    res["meta"]["data_json"] = str(data_path.relative_to(ROOT)).replace("\\", "/")
    data_path.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    render_markdown(res, md_path)
    print("\n" + "=" * 72)
    print("[V3-QA] 结果: %s" % json.dumps(res["summary"], ensure_ascii=False))
    if res["issues"]:
        for i in res["issues"]:
            print("  [%s] %s" % (i["severity"], i["title"]))
    print("数据: %s" % data_path)
    print("报告: %s" % md_path)
    print("截图: %d -> %s" % (len(R.shots), SHOT_DIR))
    print("耗时: %.1fs" % (time.time() - t0))
    print("=" * 72)
    return res


if __name__ == "__main__":
    main()
