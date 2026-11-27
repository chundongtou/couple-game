/* ===== V6 小游戏面板：温度计 / 真心话转盘 / 大冒险转盘 =====
 * 契约：App.MiniGame.open(host, kind, state, handlers) -> close()
 *   kind: 'thermo' | 'truth-wheel' | 'dare-wheel'（兼容 'truth'/'dare'/'wheel'）
 *   handlers: { done(result), skipped() }
 * 冻结单 §3.3：面板内可操作；完成后 handlers.done(result)；有跳过；
 * 禁止出现「玩过了，继续走棋」这类空按钮。
 * 文案：docs/v6/copy.md §4。
 */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util || {};

  function esc(s) {
    if (U && U.escape) return U.escape(s);
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var FALLBACK_NAME = { a: "他", b: "她" };
  var FALLBACK_LABELS = ["还想聊天", "坐近一点", "靠着肩", "牵着手", "想被抱一下", "额头碰额头", "轻声说喜欢"];

  var CSS = `
.mg-root{position:fixed;inset:0;z-index:32;display:flex;align-items:flex-end;justify-content:center;
  background:rgba(7,5,14,.58);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);
  padding:0;pointer-events:auto;font-family:var(--font-body,var(--sans,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif));
  animation:mgFade 200ms var(--ease-out,cubic-bezier(.16,1,.3,1)) both}
@keyframes mgFade{from{opacity:0}to{opacity:1}}
body.reduce .mg-root{animation-duration:80ms!important}
@media (prefers-reduced-motion: reduce){.mg-root{animation-duration:80ms!important}}
.mg-panel{width:100%;max-width:520px;max-height:90vh;overflow-y:auto;overflow-x:hidden;
  border-radius:var(--r-lg,26px) var(--r-lg,26px) 0 0;
  background:linear-gradient(180deg,var(--bg1,#120D24) 0%,var(--bg0,#08060F) 100%);
  border-top:1px solid var(--line,rgba(255,226,196,.13));
  box-shadow:0 -18px 50px rgba(3,2,10,.55);
  padding:14px 16px calc(18px + var(--safe-b,0px));color:var(--ink,#FBF3E7);
  transform-origin:50% 100%;animation:mgUp 260ms var(--ease-out,cubic-bezier(.16,1,.3,1)) both}
@keyframes mgUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
body.reduce .mg-panel{animation-duration:80ms!important}
@media (prefers-reduced-motion: reduce){.mg-panel{animation-duration:80ms!important}}
.mg-head{display:flex;align-items:flex-start;gap:10px}
.mg-head-main{flex:1;min-width:0}
.mg-title{font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));font-size:22px;line-height:1.2;font-weight:700;color:var(--ink,#FBF3E7)}
.mg-sub{margin-top:4px;font-size:11.5px;line-height:1.5;color:var(--dim2,#8E7C9E);letter-spacing:.02em}
.mg-hbtns{display:flex;gap:6px;flex-shrink:0}
.mg-hbtn{min-height:36px;padding:0 10px;border-radius:999px;border:1px solid var(--line,rgba(255,226,196,.13));
  background:rgba(255,236,214,.06);color:var(--dim,#C9B6CE);font-size:11.5px;font-weight:700;letter-spacing:.04em;font-family:inherit}
.mg-hbtn.ghost{background:transparent}
.mg-copy{margin:14px 0 0;font-size:14px;line-height:1.65;color:var(--dim,#C9B6CE)}
.mg-copy b{color:var(--ink,#FBF3E7)}
.mg-slider{display:block;margin-top:14px;padding:12px 13px 10px;border-radius:var(--r-md,18px);
  background:var(--glass,rgba(38,27,58,.42));border:1px solid var(--line,rgba(255,226,196,.13))}
.mg-slider-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.mg-slider-label{font-size:12px;letter-spacing:.1em;color:var(--dim2,#8E7C9E);font-weight:700}
.mg-slider-val{font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));font-size:15px;color:var(--amber,#F3C077)}
.mg-range{width:100%;margin:10px 0 2px;accent-color:var(--rose,#E9887A);height:34px}
.mg-ticks{display:flex;justify-content:space-between;font-size:9.5px;color:var(--dim2,#8E7C9E);letter-spacing:.04em}
.mg-acts{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.mg-btn{width:100%;min-height:48px;border-radius:999px;font-size:15px;font-weight:800;letter-spacing:.12em;font-family:inherit;
  transition:transform var(--t-fast,160ms) var(--ease-out,cubic-bezier(.16,1,.3,1))}
.mg-btn:active{transform:scale(.985)}
.mg-btn.main{background:linear-gradient(180deg,var(--amber,#F3C077),var(--amber-deep,#E2965E));color:#2A140E;
  box-shadow:0 10px 26px rgba(243,192,119,.22)}
.mg-btn.soft{background:rgba(255,236,214,.08);border:1px solid var(--line,rgba(255,226,196,.13));color:var(--ink,#FBF3E7)}
.mg-btn.ghost{background:transparent;border:1px solid var(--line,rgba(255,226,196,.13));color:var(--dim,#C9B6CE);min-height:42px;font-size:13px;letter-spacing:.08em}
.mg-btn[disabled]{opacity:.4}
.mg-cover{margin-top:18px;padding:26px 16px;border-radius:var(--r-md,18px);
  background:radial-gradient(120% 90% at 50% 0%,rgba(243,192,119,.12),rgba(38,27,58,.42));
  border:1px solid var(--line,rgba(255,226,196,.13));text-align:center}
.mg-cover h2{font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));font-size:26px;line-height:1.3;margin:0 0 8px;color:var(--ink,#FBF3E7)}
.mg-cover p{font-size:13px;line-height:1.6;color:var(--dim2,#8E7C9E);margin:0}
.mg-cover .mg-acts{margin-top:18px}
.mg-result{margin-top:16px;padding:16px;border-radius:var(--r-md,18px);
  background:radial-gradient(120% 100% at 30% 0%,rgba(233,136,122,.16),rgba(38,27,58,.42));
  border:1px solid rgba(233,136,122,.26)}
.mg-result-num{font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));
  font-size:42px;line-height:1.1;font-weight:700;color:var(--amber,#F3C077);letter-spacing:.02em}
.mg-result-num small{font-size:18px;color:var(--dim,#C9B6CE);margin-left:4px}
.mg-result-text{margin-top:8px;font-size:13.5px;line-height:1.65;color:var(--dim,#C9B6CE)}
.mg-wheel-wrap{position:relative;width:min(240px,64vw);height:min(240px,64vw);margin:16px auto 6px}
.mg-pointer{position:absolute;left:50%;top:-4px;transform:translateX(-50%);z-index:3;width:0;height:0;
  border-left:9px solid transparent;border-right:9px solid transparent;border-top:18px solid var(--amber,#F3C077)}
.mg-rotor{width:100%;height:100%;border-radius:50%;position:relative;
  box-shadow:inset 0 0 0 10px rgba(255,226,196,.10),inset 0 0 0 1px rgba(255,226,196,.14),0 16px 38px rgba(3,2,10,.5);
  border:1px solid rgba(255,226,196,.2)}
.mg-rotor.spinning{transition:transform 1.25s cubic-bezier(.15,.85,.18,1)}
.mg-hub{position:absolute;left:50%;top:50%;width:66px;height:66px;margin:-33px 0 0 -33px;z-index:2;
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle at 38% 32%,#FFE6BE,var(--amber,#F3C077) 55%,var(--amber-deep,#E2965E));
  color:#2A140E;font-size:16px;font-weight:800;letter-spacing:.1em;font-family:inherit;
  box-shadow:0 6px 18px rgba(2,1,8,.45)}
.mg-list-title{margin-top:10px;font-size:11px;letter-spacing:.16em;color:var(--dim2,#8E7C9E);font-weight:700}
.mg-list{margin-top:8px;display:flex;flex-direction:column;gap:6px}
.mg-slot{display:flex;gap:8px;padding:8px 10px;border-radius:12px;font-size:12px;line-height:1.5;
  background:rgba(255,236,214,.04);border:1px solid transparent;color:var(--dim,#C9B6CE)}
.mg-slot .mg-num{flex:none;width:16px;color:var(--dim2,#8E7C9E);font-variant-numeric:tabular-nums}
.mg-slot .mg-slot-text{min-width:0}
.mg-slot.on{background:rgba(243,192,119,.14);border-color:rgba(243,192,119,.4);color:var(--ink,#FBF3E7)}
.mg-result-title{margin-top:14px;font-size:11px;letter-spacing:.16em;color:var(--dim2,#8E7C9E);font-weight:700}
.mg-card-text{margin-top:6px;font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));
  font-size:18px;line-height:1.55;color:var(--ink,#FBF3E7)}
.mg-note{margin-top:8px;font-size:11.5px;color:var(--dim2,#8E7C9E)}
.mg-empty{margin-top:16px;padding:14px;border-radius:14px;border:1px dashed rgba(255,226,196,.22);
  font-size:12.5px;line-height:1.6;color:var(--dim2,#8E7C9E)}
@media (max-width:360px){.mg-title{font-size:20px}.mg-result-num{font-size:36px}}
`;

  function injectStyle() {
    if (App.UI && App.UI.injectStyle) { App.UI.injectStyle("minigame-v6", CSS); return; }
    if (document.getElementById("style-minigame-v6")) return;
    var el = document.createElement("style");
    el.id = "style-minigame-v6";
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  function nameOf(state, id) {
    if (id === "both") return "你们俩";
    var names = (state && state.names) || {};
    var raw = names[id];
    if (raw !== undefined && raw !== null && String(raw).trim()) return String(raw).trim();
    return FALLBACK_NAME[id] || "你们";
  }

  function normalizeKind(kind) {
    if (kind === "truth") return "truth-wheel";
    if (kind === "dare") return "dare-wheel";
    if (kind === "truth-wheel" || kind === "dare-wheel" || kind === "thermo") return kind;
    return "truth-wheel";
  }

  function thermoLabelsFor(state) {
    var cap = 2;
    try {
      if (App.FlightDraw && App.FlightDraw.SCALE_CAP && App.FlightDraw.SCALE_CAP[state.scale]) cap = App.FlightDraw.SCALE_CAP[state.scale];
      else if (state.maxStarCap) cap = Math.max(1, Math.min(4, Number(state.maxStarCap) || 2));
      else if (state.scale) {
        var map = { gentle: 1, warm: 2, hot: 3, open: 4 };
        cap = map[state.scale] || 2;
      }
    } catch (e) { cap = 2; }
    var table = App.Minigames && App.Minigames.THERMO_LABELS;
    var labels = table && (table[cap] || table[2]);
    if (!labels || !labels.length) labels = FALLBACK_LABELS;
    return { cap: cap, labels: labels.slice() };
  }

  function reduced() {
    try { if (App.Motion && App.Motion.reduced) return !!App.Motion.reduced(); } catch (e) {}
    return document.body.classList.contains("reduce");
  }

  /* V9.11：引擎缺席时不再伪造牌组，直接走「没备好牌」空态（省首屏字节）。 */

  function buildWheelState(state, wheelKind) {
    var seed = (Date.now() % 2147483646) + 1;
    if (App.Minigames && App.Minigames.newStandalone) {
      try {
        var made = App.Minigames.newStandalone(wheelKind, {
          scale: state.scale || "warm",
          names: state.names || { a: "他", b: "她" },
          blacklist: state.boundaries || []
        }, seed);
        if (made && made.ok && made.state && made.state.wheel && made.state.wheel.slots && made.state.wheel.slots.length) {
          return made.state;
        }
      } catch (e) {
        if (window.console) console.error("[minigame] newStandalone", e);
      }
    }
    return null;
  }

  App.MiniGame = {
    open: function (host, kind, state, handlers) {
      handlers = handlers || {};
      if (!host) return function () {};
      injectStyle();
      var old = document.querySelectorAll(".mg-root");
      for (var oi = 0; oi < old.length; oi++) {
        if (old[oi] && old[oi].parentNode) old[oi].parentNode.removeChild(old[oi]);
      }
      state = state || {};
      var kindNorm = normalizeKind(kind);
      var isThermo = kindNorm === "thermo";
      var wheelKind = kindNorm === "truth-wheel" ? "truth" : "dare";
      var wheelTitle = kindNorm === "truth-wheel" ? "真心话转盘" : "大冒险转盘";
      var firstId = state.turn === "b" ? "b" : "a";
      var secondId = firstId === "a" ? "b" : "a";
      var first = nameOf(state, firstId);
      var second = nameOf(state, secondId);
      var labels = isThermo ? thermoLabelsFor(state).labels : [];
      var marks = { a: null, b: null };
      var step = "a"; // a | pass | b | reveal | result
      var wheelState = null;
      var selected = -1;
      var finished = false;
      var timers = [];
      var handNote = false;

      if (!isThermo) {
        wheelState = buildWheelState(state, wheelKind);
      }

      var root = document.createElement("div");
      root.className = "mg-root";
      root.setAttribute("data-test", "minigame-panel");
      root.setAttribute("data-kind", kindNorm);
      host.appendChild(root);

      function later(fn, ms) {
        var id = setTimeout(fn, ms);
        timers.push(id);
        return id;
      }

      function close() {
        for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
        timers = [];
        if (root.parentNode) root.parentNode.removeChild(root);
      }

      function finish(name, result) {
        if (finished) return;
        finished = true;
        if (App.Audio) App.Audio.play(name === "done" ? "chime" : "tap");
        close();
        if (typeof handlers[name] === "function") {
          try { handlers[name](result); } catch (e) { if (window.console) console.error("[minigame]", e); }
        }
      }

      function headHtml() {
        var title = isThermo ? "温度计" : wheelTitle;
        var sub = isThermo ? "这一格是温度计 · 也可以先跳过" : "这一格是转盘 · 也可以先跳过";
        var isDoneStep = (isThermo && step === "result") || (!isThermo && selected >= 0);
        return '<div class="mg-head">' +
          '<div class="mg-head-main"><div class="mg-title" data-test="minigame-title">' + esc(title) + "</div>" +
          '<div class="mg-sub">' + esc(sub) + "</div></div>" +
          '<div class="mg-hbtns">' +
            (isDoneStep ? "" : '<button class="mg-hbtn" type="button" data-act="done" data-test="minigame-done">完成</button>') +
            '<button class="mg-hbtn ghost" type="button" data-act="skip" data-test="minigame-skip">这次先跳过</button>' +
          "</div></div>";
      }

      function sliderHtml(key, label, value) {
        var max = labels.length - 1;
        var val = Number(value) || 0;
        if (val > max) val = max;
        return '<label class="mg-slider">' +
          '<span class="mg-slider-top"><span class="mg-slider-label">' + label + "</span>" +
          '<span class="mg-slider-val" data-val="' + key + '">' + esc(labels[val] || "") + "</span></span>" +
          '<input class="mg-range" type="range" min="0" max="' + max + '" step="1" value="' + val + '"' +
          ' data-slider="' + key + '" data-test="thermo-' + key + '" aria-label="' + label + '">' +
          '<span class="mg-ticks"><span>' + esc(labels[0] || "") + "</span><span>" + esc(labels[max] || "") + "</span></span>" +
          "</label>";
      }

      function thermoHtml() {
        if (step === "a") {
          return '<p class="mg-copy"><b>' + esc(first) + "</b> 先把自己的位置和猜的对方标出来。</p>" +
            sliderHtml("place", "我在这", 0) +
            sliderHtml("guess", "我猜对方", 0) +
            '<div class="mg-acts"><button class="mg-btn main" type="button" data-act="lock-a" data-test="thermo-lock">标好了</button></div>';
        }
        if (step === "pass") {
          return '<div class="mg-cover" data-test="thermo-pass">' +
            "<h2>把手机递给 " + esc(second) + "</h2>" +
            "<p>现在轮到 <b>" + esc(second) + "</b>。刚才标下的先藏起来了。</p>" +
            '<div class="mg-acts"><button class="mg-btn main" type="button" data-act="pass-got" data-test="thermo-got">我拿到了</button></div>' +
            "</div>";
        }
        if (step === "b") {
          return '<p class="mg-copy"><b>' + esc(second) + "</b> 的位置和猜测。</p>" +
            sliderHtml("place", "我在这", 0) +
            sliderHtml("guess", "我猜对方", 0) +
            '<div class="mg-acts"><button class="mg-btn main" type="button" data-act="lock-b" data-test="thermo-lock">标好了</button></div>';
        }
        if (step === "reveal") {
          return '<p class="mg-copy">两个人都标好了。把手机放中间，一起看。</p>' +
            '<div class="mg-acts"><button class="mg-btn main" type="button" data-act="reveal" data-test="thermo-reveal">揭晓</button></div>';
        }
        var t = marks.a && marks.b ? closeness() : { pct: 0, err: 0 };
        return '<div class="mg-result" data-test="thermo-result">' +
          '<div class="mg-result-num" data-test="thermo-closeness">猜近了 ' + t.pct + "<small>%</small></div>" +
          '<p class="mg-result-text">这一页只记你们标过。没有要扣的。</p>' +
          "</div>" +
          '<div class="mg-acts">' +
            '<button class="mg-btn main" type="button" data-act="done" data-test="minigame-done">回棋盘</button>' +
            '<button class="mg-btn ghost" type="button" data-act="again">再量一次</button>' +
          "</div>";
      }

      function closeness() {
        var max = Math.max(1, labels.length - 1);
        var a = marks.a || { place: 0, guess: 0 };
        var b = marks.b || { place: 0, guess: 0 };
        var err = Math.abs(a.guess - b.place) + Math.abs(b.guess - a.place);
        var value = 1 - err / (max * 2);
        value = Math.max(0, Math.min(1, value));
        return { pct: Math.round(value * 100), err: err };
      }

      var WHEEL_TINTS = ["rgba(243,192,119,.30)", "rgba(233,136,122,.28)", "rgba(142,123,216,.30)",
        "rgba(118,186,196,.26)", "rgba(214,150,196,.26)", "rgba(126,186,150,.26)"];
      var WHEEL_INK = ["#E8B87A", "#E9887A", "#A99BE0", "#7FB6C4", "#D49AC4", "#8FC4A2"];

      function wheelBg() {
        return "conic-gradient(" + WHEEL_TINTS.map(function (t, i) {
          return t + " " + (i * 60) + "deg " + (i * 60 + 60) + "deg";
        }).join(",") + ")";
      }

      /* V9.11：盘面 6 个扇区各带编号，和下方「今晚的六张」1–6 一一对应；
       * 转到哪张，对应扇区编号亮成黄铜色。 */
      function rotorHtml(count) {
        var segs = "";
        for (var i = 0; i < count; i++) {
          segs += '<span class="mg-seg' + (selected === i ? " on" : "") + '" data-test="wheel-seg"' +
            ' style="--a:' + (i * 60 + 30) + 'deg">' + (i + 1) + "</span>";
        }
        return '<div class="mg-rotor" data-rotor style="background:' + wheelBg() + '">' + segs + "</div>";
      }

      function wheelHtml() {
        if (!wheelState) {
          return '<div class="mg-empty">这一格的小游戏没备好牌。<br>先跳过，回棋盘继续。</div>' +
            '<div class="mg-acts"><button class="mg-btn ghost" type="button" data-act="skip">这次先跳过</button></div>';
        }
        var wheel = wheelState.wheel || { slots: [], index: null, spun: false };
        var left = (wheelState.rerolls && wheelState.rerolls[wheelKind]) || 0;
        var spun = selected >= 0;
        var list = (wheel.slots || []).map(function (c, i) {
          var ink = WHEEL_INK[i % WHEEL_INK.length];
          return '<li class="mg-slot' + (selected === i ? " on" : "") + '" data-test="wheel-slot">' +
            '<span class="mg-num" style="color:' + ink + '">' + (i + 1) + "</span>" +
            '<span class="mg-slot-text">' + esc(c && c.text ? c.text : "这一张没抽出来") + "</span></li>";
        }).join("");
        var result = "";
        if (spun) {
          var card = wheel.slots[selected];
          result = '<div class="mg-result-title">转盘停在第 ' + (selected + 1) + ' 张</div>' +
            '<p class="mg-card-text" data-test="wheel-result">' + esc(card && card.text ? card.text : "") + "</p>" +
            (handNote
              ? '<p class="mg-note">这张交给对方说。</p>'
              : '<p class="mg-note">回棋盘会记一笔 · 心动值 +5</p>');
        }
        var acts = spun
          ? '<div class="mg-acts">' +
              '<button class="mg-btn main" type="button" data-act="done" data-test="minigame-done">回棋盘</button>' +
              '<button class="mg-btn soft" type="button" data-act="reroll" data-test="wheel-reroll"' + (left <= 0 ? " disabled" : "") +
                ">换一组 · 还有 " + left + " 次</button>" +
              '<button class="mg-btn ghost" type="button" data-act="hand" data-test="wheel-hand">交给对方说</button>' +
            "</div>"
          : '<div class="mg-acts">' +
              '<button class="mg-btn main" type="button" data-act="spin" data-test="spin">转</button>' +
              '<button class="mg-btn ghost" type="button" data-act="reroll" data-test="wheel-reroll"' + (left <= 0 ? " disabled" : "") +
                ">换一组 · 还有 " + left + " 次</button>" +
            "</div>";
        return '<div class="mg-wheel-wrap"><span class="mg-pointer" aria-hidden="true"></span>' +
          rotorHtml((wheel.slots || []).length) + '<div class="mg-hub">转</div></div>' +
          '<div class="mg-list-title">今晚的六张</div>' +
          '<ul class="mg-list" data-test="wheel-slots">' + list + "</ul>" +
          result + acts;
      }

      function panelHtml() {
        return '<div class="mg-panel" role="dialog" aria-modal="true" aria-label="' + (isThermo ? "温度计" : wheelTitle) + '">' +
          headHtml() + (isThermo ? thermoHtml() : wheelHtml()) +
          "</div>";
      }

      function render() {
        root.innerHTML = panelHtml();
        var rotor = root.querySelector("[data-rotor]");
        if (rotor && selected >= 0 && !reduced()) {
          rotor.style.transform = "rotate(" + (360 * 4 - (selected * 60 + 30)) + "deg)";
          rotor.style.transition = "none";
        }
      }

      function readMarks() {
        var place = root.querySelector('[data-slider="place"]');
        var guess = root.querySelector('[data-slider="guess"]');
        return {
          place: place ? Number(place.value) || 0 : 0,
          guess: guess ? Number(guess.value) || 0 : 0
        };
      }

      function spin() {
        if (!wheelState) return;
        var wheel = wheelState.wheel;
        if (!wheel || !wheel.slots || !wheel.slots.length) return;
        var rotor = root.querySelector("[data-rotor]");
        var idx = Math.floor(Math.random() * wheel.slots.length);
        if (App.Minigames && App.Minigames.spinWheel) {
          try {
            var ret = App.Minigames.spinWheel(wheelState);
            if (ret && ret.ok && ret.state && ret.state.wheel) {
              wheelState = ret.state;
              idx = ret.state.wheel.index;
            }
          } catch (e) { if (window.console) console.error("[minigame] spin", e); }
        }
        selected = idx;
        if (App.Audio) App.Audio.play("tick");
        if (rotor && !reduced()) {
          rotor.classList.add("spinning");
          void rotor.offsetWidth;
          rotor.style.transform = "rotate(" + (360 * 4 - (idx * 60 + 30)) + "deg)";
        }
        var wait = reduced() ? 0 : 1250;
        root.querySelectorAll(".mg-btn").forEach(function (b) { b.setAttribute("disabled", "disabled"); });
        later(function () { render(); }, wait);
      }

      function reroll() {
        if (!wheelState) return;
        var left = (wheelState.rerolls && wheelState.rerolls[wheelKind]) || 0;
        if (left <= 0) {
          if (App.UI && App.UI.toast) App.UI.toast("这张就它了");
          return;
        }
        var next = null;
        if (App.Minigames && App.Minigames.rerollWheel) {
          try {
            var ret = App.Minigames.rerollWheel(wheelState);
            if (ret && ret.ok && ret.state && ret.state.wheel) next = ret.state;
          } catch (e) { if (window.console) console.error("[minigame] reroll", e); }
        }
        if (!next) {
          next = buildWheelState(state, wheelKind);
          if (next) {
            next.rerolls = wheelState.rerolls || { truth: 2, dare: 2 };
            next.rerolls[wheelKind] = Math.max(0, left - 1);
          }
        }
        if (!next) return;
        wheelState = next;
        selected = -1;
        handNote = false;
        if (App.Audio) App.Audio.play("tap");
        render();
        var remain = (wheelState.rerolls && wheelState.rerolls[wheelKind]) || 0;
        if (App.UI && App.UI.toast) App.UI.toast("换好了 · 还有 " + remain + " 次");
      }

      render();

      root.addEventListener("input", function (e) {
        var input = e.target;
        if (!input || !input.getAttribute) return;
        var key = input.getAttribute("data-slider");
        if (!key) return;
        var lab = root.querySelector('[data-val="' + key + '"]');
        if (lab) lab.textContent = labels[Number(input.value)] || "";
        if (App.Audio) App.Audio.play("tick");
      });

      root.addEventListener("click", function (e) {
        var btn = e.target && e.target.closest ? e.target.closest("[data-act]") : null;
        if (!btn || btn.hasAttribute("disabled")) return;
        var act = btn.getAttribute("data-act");
        if (act === "skip") { finish("skipped"); return; }
        if (act === "done") {
          if (isThermo && step === "result") {
            var r = closeness();
            finish("done", { kind: "thermo", closeness: r.pct, err: r.err });
          } else if (!isThermo && selected >= 0) {
            var wheel = wheelState && wheelState.wheel;
            finish("done", { kind: kindNorm, card: wheel && wheel.slots ? wheel.slots[selected] : null, index: selected });
          } else {
            finish("done", { kind: kindNorm, direct: true });
          }
          return;
        }
        if (act === "lock-a") {
          marks.a = readMarks();
          step = "pass";
          render();
          if (App.Audio) App.Audio.play("tap");
          return;
        }
        if (act === "pass-got") {
          step = "b";
          render();
          if (App.Audio) App.Audio.play("tap");
          return;
        }
        if (act === "lock-b") {
          marks.b = readMarks();
          step = "reveal";
          render();
          if (App.Audio) App.Audio.play("tap");
          return;
        }
        if (act === "reveal") {
          step = "result";
          render();
          if (App.Audio) App.Audio.play("reveal");
          return;
        }
        if (act === "again") {
          marks = { a: null, b: null };
          step = "a";
          render();
          return;
        }
        if (act === "spin") { spin(); return; }
        if (act === "reroll") { reroll(); return; }
        if (act === "hand") {
          handNote = true;
          render();
          if (App.Audio) App.Audio.play("tap");
        }
      });

      if (reduced() && App.Motion && App.Motion.syncBodyClass) App.Motion.syncBodyClass();
      if (App.Audio) App.Audio.play("tap");

      return close;
    }
  };
})();
