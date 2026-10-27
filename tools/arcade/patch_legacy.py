# -*- coding: utf-8 -*-
"""生成「经典游戏厅」：把 V17 旧版单文件包装成只装 3 个经典玩法的独立窗口。

- 数据/代码来源：git 提交 98f56c4 的 index.html（旧版 V17 完整单文件）
- 不修改根 index.html（新版 升温夜航），输出 arcade/index.html
- 去掉旧版 PWA 注册/manifest，避免在 /arcade/ 下 404；注入游戏厅首页与返回钩子

用法：python tools/arcade/patch_legacy.py
"""
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "arcade" / "index.html"
CACHE = ROOT / "arcade" / "_legacy-v17.html"
LEGACY_COMMIT = "98f56c4"

SEED = (
    "<script>try{localStorage.setItem('couple-onboarded','1');"
    "localStorage.setItem('couple-night',JSON.stringify({d:new Date().toDateString()}));}catch(e){}</script>"
)

CSS = """
/* ===== 经典游戏厅（包装层，不影响旧版内部样式） ===== */
body.arcade-home { overflow: hidden !important; }
#arcadeHome{position:fixed;inset:0;z-index:100000;display:none;overflow-y:auto;-webkit-overflow-scrolling:touch;
  background:
    radial-gradient(900px 520px at 82% -10%, rgba(154,124,255,.30), transparent 60%),
    radial-gradient(760px 480px at 10% 108%, rgba(255,95,158,.24), transparent 60%),
    linear-gradient(180deg,#0b0617,#070411 55%,#0a0614);
  color:#f7f1ff;padding:calc(26px + env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom));
  font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,sans-serif;}
#arcadeHome.on{display:block;}
#arcadeHome::before{content:"";position:fixed;left:50%;top:6%;width:340px;height:340px;transform:translateX(-50%);
  border-radius:50%;background:radial-gradient(circle,rgba(243,200,121,.18),transparent 68%);filter:blur(20px);pointer-events:none;}
.arcade-inner{position:relative;z-index:1;max-width:520px;margin:0 auto;min-height:100%;display:flex;flex-direction:column;}
.arcade-brand{font-size:10.5px;letter-spacing:.34em;color:#7d7194;font-weight:700;}
.arcade-title{font-size:clamp(34px,9.4vw,44px);line-height:1.12;font-weight:800;letter-spacing:.03em;margin-top:18px;
  background:linear-gradient(100deg,#fff 0%,#f3c879 42%,#ff5f9e 78%,#9a7cff 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;}
.arcade-sub{margin-top:14px;font-size:13.5px;line-height:1.85;color:#b3a6c9;letter-spacing:.03em;}
.arcade-grid{margin-top:30px;display:flex;flex-direction:column;gap:12px;}
.arcade-card{display:flex;align-items:center;gap:14px;width:100%;min-height:92px;padding:16px 18px;text-align:left;
  border-radius:22px;border:1px solid rgba(255,255,255,.12);
  background:linear-gradient(160deg,rgba(255,255,255,.085),rgba(255,255,255,.03));
  color:#f7f1ff;cursor:pointer;transition:transform .16s ease,border-color .2s,box-shadow .2s;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
.arcade-card:active{transform:scale(.975);}
.arcade-card:hover{border-color:rgba(243,200,121,.45);box-shadow:0 12px 34px rgba(0,0,0,.4);}
.arcade-card .ic{width:52px;height:52px;flex:0 0 auto;border-radius:16px;display:flex;align-items:center;justify-content:center;
  font-size:26px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);}
.arcade-card .tx{flex:1;min-width:0;}
.arcade-card .tx b{display:block;font-size:16.5px;letter-spacing:.04em;}
.arcade-card .tx span{display:block;margin-top:4px;font-size:11.5px;line-height:1.6;color:#a79cc2;}
.arcade-card .go{color:#f3c879;font-size:18px;flex:0 0 auto;opacity:.8;}
.arcade-foot{margin-top:auto;padding-top:34px;display:flex;flex-direction:column;gap:12px;align-items:flex-start;}
.arcade-link{display:inline-flex;align-items:center;min-height:44px;padding:0 4px;color:#f3c879;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:.04em;}
.arcade-new{display:inline-block;margin-left:6px;padding:2px 6px;border-radius:6px;background:linear-gradient(135deg,#ff5f9e,#9a7cff);color:#fff;font-size:8.5px;letter-spacing:.12em;vertical-align:2px;}
.arcade-note{font-size:10.5px;line-height:1.8;color:#6f6689;letter-spacing:.04em;}
@media (max-width:340px){.arcade-card{min-height:84px;padding:14px}.arcade-title{font-size:31px}}
"""

HOME = """
<div id="arcadeHome" role="dialog" aria-label="经典游戏厅">
  <div class="arcade-inner">
    <div class="arcade-brand">CLASSIC ARCADE · 经典游戏厅</div>
    <h1 class="arcade-title">今晚，先玩哪一盘？</h1>
    <p class="arcade-sub">真心话、大冒险、飞行棋，独立在这个窗口里。<br>新版「升温夜航」的进度和数据，不会受影响。</p>
    <div class="arcade-grid">
      <a class="arcade-card" href="thermometer.html" aria-label="打开温度计" style="text-decoration:none">
        <span class="ic" aria-hidden="true">🌡️</span>
        <span class="tx"><b>温度计 <span class="arcade-new">NEW</span></b><span>12 格慢慢升温：掷骰子前进，完成落点的那一格，随时可停</span></span>
        <span class="go" aria-hidden="true">→</span>
      </a>
      <button class="arcade-card" type="button" data-game="truth" aria-label="打开真心话转盘">
        <span class="ic" aria-hidden="true">🎡</span>
        <span class="tx"><b>真心话转盘</b><span>转盘决定谁来回答，答不上来就领一条惩罚</span></span>
        <span class="go" aria-hidden="true">→</span>
      </button>
      <button class="arcade-card" type="button" data-game="dare" aria-label="打开大冒险转盘">
        <span class="ic" aria-hidden="true">🔥</span>
        <span class="tx"><b>大冒险转盘</b><span>转盘决定谁去执行，做完才算过关</span></span>
        <span class="go" aria-hidden="true">→</span>
      </button>
      <button class="arcade-card" type="button" data-game="flight" aria-label="打开飞行棋">
        <span class="ic" aria-hidden="true">✈️</span>
        <span class="tx"><b>飞行棋</b><span>对飞 / 环岛 / 双轨 / 融合，骰子决定今晚的走向</span></span>
        <span class="go" aria-hidden="true">→</span>
      </button>
    </div>
    <div class="arcade-foot">
      <a class="arcade-link" href="../">← 回到「升温夜航」新版</a>
      <div class="arcade-note">这一页只装了 3 个经典玩法 · 旧版数据键 couple-* 与新版 couple2.* 完全隔离</div>
    </div>
  </div>
</div>
"""

JS = """
(function(){
  var overlay = document.getElementById('arcadeHome');
  var wrapped = false;
  function show(){
    try { if (typeof closeModal === 'function') closeModal(); } catch (e) {}
    overlay.classList.add('on');
    document.body.classList.add('arcade-home');
    document.title = '经典游戏厅 · 升温夜航';
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function hide(){
    overlay.classList.remove('on');
    document.body.classList.remove('arcade-home');
  }
  function start(game){
    hide();
    try { if (typeof closeModal === 'function') closeModal(); } catch (e) {}
    try { startGame(game); } catch (e) { show(); }
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function wrapHome(){
    if (wrapped || typeof window.goHome !== 'function') return;
    wrapped = true;
    var orig = window.goHome;
    window.goHome = function(){ var r = orig.apply(this, arguments); show(); return r; };
  }
  window.Arcade = { show: show, start: start };
  Array.prototype.forEach.call(document.querySelectorAll('[data-game]'), function(btn){
    btn.addEventListener('click', function(){ start(btn.getAttribute('data-game')); });
  });
  function boot(){
    wrapHome();
    var m = String(location.search || '').match(/[?&]game=(truth|dare|flight)/);
    if (m) start(m[1]); else show();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 280); });
  } else { setTimeout(boot, 280); }
})();
"""


def load_legacy():
    if CACHE.exists():
        return CACHE.read_text(encoding="utf-8")
    try:
        out = subprocess.run(
            ["git", "show", LEGACY_COMMIT + ":index.html"],
            cwd=str(ROOT), capture_output=True, check=True
        )
        text = out.stdout.decode("utf-8")
        CACHE.write_text(text, encoding="utf-8", newline="")
        return text
    except Exception as e:
        raise SystemExit("无法读取旧版 index.html（%s）：%s" % (LEGACY_COMMIT, e))


def patch(html):
    # 1) 去掉旧版 PWA 片段（避免 /arcade/sw.js 404）
    start = html.find("/* ===== V17 FEATURE: 30-pwa.js")
    end = html.find("/* ===== V17 FEATURE: 40-shellfix.js", start + 1)
    if start >= 0 and end > start:
        html = html[:start] + html[end:]
    # 2) 去掉 manifest / apple-touch / og:image 的相对链接（arcade/ 下不存在）
    for pattern in [
        r'\n<link rel="manifest"[^>]*>',
        r'\n<link rel="apple-touch-icon"[^>]*>',
        r'\n<meta property="og:image"[^>]*>',
        r'\n<meta name="twitter:card"[^>]*>',
    ]:
        html = re.sub(pattern, "", html)
    # 3) 标题 / 主题色 / 预置“已开局/已引导”避免开场弹窗
    html = html.replace("<title>情侣升温游戏</title>", "<title>经典游戏厅 · 升温夜航</title>")
    html = html.replace('<meta name="theme-color" content="#6c2bd9">', '<meta name="theme-color" content="#0a0616">')
    html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">' + SEED, 1)
    # 4) 注入游戏厅层
    inject = '<style id="arcade-css">' + CSS + "</style>\n" + HOME + "\n<script>" + JS + "</script>\n"
    idx = html.rfind("</body>")
    if idx < 0:
        raise SystemExit("找不到 </body>")
    return html[:idx] + inject + html[idx:]


def main():
    src = load_legacy()
    out = patch(src)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(out, encoding="utf-8", newline="")
    print("written:", OUT, len(out.encode("utf-8")), "bytes")


if __name__ == "__main__":
    main()

