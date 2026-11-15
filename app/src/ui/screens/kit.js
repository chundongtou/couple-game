/* ===== 房间里的四种玩法，夜里和游戏门共用 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var OUT = { done: "做了", hold: "停在这里", pass: "先放下", deeper: "又往下问", reveal: "对过温度" };

  function tone(star, cap) {
    if (cap <= 1) return "轻声";
    if (star <= 2) return "靠近";
    if (star === 3) return "发烫";
    if (star === 4) return "直接";
    return "不收";
  }
  function esc(s) { return U.escape(s || ""); }
  function reduced() { return App.Motion && App.Motion.reduced && App.Motion.reduced(); }
  function labels(cap) { return App.Balance.THERMO_LABELS[cap] || App.Balance.THERMO_LABELS[1]; }
  function labelAt(cap, i) {
    var list = labels(cap);
    return list[Math.max(0, Math.min(list.length - 1, i))] || "";
  }

  function scene(room, title, sub) {
    var prop = {
      living: '<i class="sofa"></i><i class="glasscup"></i><i class="bulb"></i>',
      kitchen: '<i class="counter"></i><i class="bulb"></i>',
      balcony: '<i class="rail"></i><i class="rainbit"></i>',
      bathroom: '<i class="tub"></i><i class="bulb"></i>',
      bedroom: '<i class="bedshape"></i><i class="bulb"></i>'
    }[room] || "";
    return '<div class="scene scene-' + room + '"><div class="illu">' + prop + '</div><div class="cap"><b>' + esc(title) + '</b><span class="small muted">' + esc(sub) + "</span></div></div>";
  }

  function promptBlock(state, card, extra) {
    var cap = App.Engine.capOf(state);
    return '<article class="prompt" data-test="prompt"><p class="prompt-text">' + esc(card.text) + "</p>" +
      '<div class="prompt-meta">' + esc(tone(card.star || 1, cap)) + (extra ? " · " + esc(extra) : "") + "</div></article>";
  }

  function last(state) {
    var log = state.log || [];
    return log.length ? log[log.length - 1] : null;
  }

  function wheelHtml(state) {
    return '<div class="wheel-wrap"><div class="pointer"></div><div class="rotor" data-rotor>' +
      '<button class="hub" data-act="spin" data-test="spin" type="button">转</button></div></div>';
  }

  function top(title, leaveLabel) {
    return '<div class="topbar"><button class="back" data-act="leave" aria-label="' + esc(leaveLabel || "回到平面图") + '">←</button>' +
      '<div class="tb-title">' + esc(title) + '</div><div class="tb-right"></div></div>';
  }

  function livingHtml(state) {
    var cap = App.Engine.capOf(state);
    var sub = App.Night.line("living", cap);
    var html = top("客厅") + scene("living", "客厅", sub);
    if (!state.prompt) {
      var prev = last(state);
      if (prev && prev.room === "living") {
        html += '<p class="small dim">刚才：' + esc(OUT[prev.outcome] || "") + "</p>";
      }
      html += '<p class="title-md">谁先把这句话递出去</p><div class="choice-row mt-12">' +
        '<button class="btn soft" data-test="who-ask" data-act="offer" data-who="a" data-role="ask">' + esc(state.names.a) + " 先问</button>" +
        '<button class="btn soft" data-test="who-listen" data-act="offer" data-who="b" data-role="listen">' + esc(state.names.b) + " 先听</button>" +
        "</div>";
      return html;
    }
    var who = state.prompt.who === "b" ? state.names.b : state.names.a;
    var role = state.prompt.role === "listen" ? "先听" : "先问";
    html += promptBlock(state, state.prompt.card, who + role);
    html += '<div class="actions">' +
      '<button class="btn primary wide" data-test="hold" data-act="settle" data-how="hold">就停在这</button>' +
      '<button class="btn soft wide" data-test="deeper" data-act="deeper">再往下问</button>' +
      '<button class="btn ghost wide" data-test="pass" data-act="settle" data-how="pass">先放下</button></div>';
    return html;
  }

  function wheelScreen(state, kind) {
    var room = kind === "dare" ? "kitchen" : "bathroom";
    var title = kind === "dare" ? "厨房" : "浴室";
    var cap = App.Engine.capOf(state);
    var html = top(title) + scene(room, title, App.Night.line(room, cap));
    var spun = state.wheel && state.wheel.spun && state.prompt;
    if (!spun) {
      html += '<p class="center small dim">' + (kind === "dare" ? "停在哪一件，就做到哪一件。" : "停下之后，自己说，或者递到对方手里。") + "</p>";
      html += wheelHtml(state);
      var left = kind === "dare" ? state.dareRerolls : state.truthRerolls;
      html += '<p class="center tiny dim">重抽还剩 ' + (left || 0) + " 次</p>";
      return html;
    }
    html += promptBlock(state, state.prompt.card, kind === "dare" ? "厨房" : "浴室");
    if (kind === "truth" && !state.prompt.hand) {
      html += '<div class="choice-row mt-12">' +
        '<button class="btn primary" data-test="hand-self" data-act="hand" data-who="self">我来说</button>' +
        '<button class="btn soft" data-test="hand-other" data-act="hand" data-who="other">交给对方</button></div>';
    } else {
      var whoLine = "";
      if (kind === "truth") whoLine = state.prompt.hand === "other" ? "交给对方说" : "自己说";
      if (whoLine) html += '<p class="small dim mt-8">' + whoLine + "</p>";
      var left2 = kind === "dare" ? state.dareRerolls : state.truthRerolls;
      html += '<div class="actions">' +
        '<button class="btn primary wide" data-test="did" data-act="settle" data-how="done">' + (kind === "dare" ? "做到了" : "说了") + "</button>" +
        '<button class="btn soft wide" data-test="reroll" data-act="reroll"' + (left2 ? "" : " disabled") + ">再转一次</button>" +
        '<button class="btn ghost wide" data-test="pass" data-act="settle" data-how="pass">先放下</button></div>';
    }
    return html;
  }

  function thermoHtml(state) {
    var cap = App.Engine.capOf(state);
    var t = state.thermo || { max: 6, a: null, b: null };
    var html = top("阳台") + scene("balcony", "阳台", App.Night.line("balcony", cap));
    if (t.revealed) {
      html += '<article class="prompt" data-test="thermo-result"><p class="prompt-text">你们把温度摊开了。</p>' +
        '<p class="muted mt-8">' + esc(state.names.a) + " 放在「" + esc(labelAt(cap, t.a.place)) + "」，猜的是「" + esc(labelAt(cap, t.a.guess)) + "」。</p>" +
        '<p class="muted">' + esc(state.names.b) + " 放在「" + esc(labelAt(cap, t.b.place)) + "」，猜的是「" + esc(labelAt(cap, t.b.guess)) + "」。</p>" +
        '<p class="prompt-meta">接近 ' + Math.round((t.closeness || 0) * 100) + " · 夜里 +" + (t.delta || 0) + "</p></article>" +
        '<p class="small dim mt-12">' + ((t.closeness || 0) >= 0.75 ? "猜得很近。热度跟着上来了。" : "没贴准也没关系。温度本身已经放在桌上。") + "</p>" +
        '<div class="actions"><button class="btn soft wide" data-test="thermo-again" data-act="thermo-reset">再量一次</button></div>';
      return html;
    }
    if (!t.a) {
      html += sliders("a", state.names.a, cap, t.max, "盖住，递给 " + state.names.b);
      return html;
    }
    if (!t.passing) {
      html += '<div class="prompt pass-card" data-test="pass-phone"><p class="title-md">把手机递给 ' + esc(state.names.b) + '</p><p class="muted">刚才的刻度已经盖住了。</p>' +
        '<button class="btn primary" data-test="got-phone" data-act="thermo-pass">我拿到了</button></div>';
      return html;
    }
    if (!t.b) {
      html += sliders("b", state.names.b, cap, t.max, "揭开");
      return html;
    }
    html += '<button class="btn primary wide" data-test="thermo-reveal" data-act="thermo-reveal">揭开两边的温度</button>';
    return html;
  }

  function sliders(who, name, cap, max, submit) {
    return '<div data-test="thermo-' + who + '"><p class="title-md">' + esc(name) + "，先别给对方看</p>" +
      '<p class="small dim mt-12">你把今晚放在</p><p class="scale-label" data-place-label>' + esc(labelAt(cap, Math.round(max / 2))) + "</p>" +
      '<input data-place type="range" min="0" max="' + max + '" value="' + Math.round(max / 2) + '" aria-label="自己的温度">' +
      '<p class="small dim mt-12">你猜对方会放在</p><p class="scale-label" data-guess-label>' + esc(labelAt(cap, Math.round(max / 2))) + "</p>" +
      '<input data-guess type="range" min="0" max="' + max + '" value="' + Math.round(max / 2) + '" aria-label="猜对方的温度">' +
      '<button class="btn primary wide mt-16" data-test="thermo-lock-' + who + '" data-act="thermo-lock" data-who="' + who + '">' + esc(submit) + "</button></div>";
  }

  function bedroomHtml(state) {
    var cap = App.Engine.capOf(state);
    var html = top("卧室") + scene("bedroom", "卧室", App.Night.line("bedroom", cap));
    if (!state.bedroomMode) {
      html += '<p class="small dim">门没有锁。</p><div class="choice-row mt-12">' +
        '<button class="btn soft" data-test="bed-talk" data-act="bed" data-mode="talk">说话</button>' +
        '<button class="btn primary" data-test="bed-act" data-act="bed" data-mode="act">做事</button></div>';
      return html;
    }
    if (!state.prompt) {
      html += '<button class="btn primary wide" data-test="bed-draw" data-act="bed-draw">' + (state.bedroomMode === "act" ? "抽一件更近的事" : "抽一句更近的话") + "</button>";
      return html;
    }
    html += promptBlock(state, state.prompt.card, state.bedroomMode === "act" ? "做事" : "说话");
    html += '<div class="actions">' +
      '<button class="btn primary wide" data-test="did" data-act="settle" data-how="done">就这样</button>' +
      '<button class="btn soft wide" data-test="deeper" data-act="deeper">再近一点</button>' +
      '<button class="btn ghost wide" data-test="pass" data-act="settle" data-how="pass">先放下</button></div>';
    return html;
  }

  function strollHtml(state) {
    var tiles = App.Balance.STROLL_TILES;
    var pos = state.stroll ? state.stroll.pos : 0;
    var html = top(state.mode === "standalone" ? "走一走" : "公寓里走") +
      '<p class="small dim">一枚「我们」。不是比赛，走到哪间，就做那一间的事。</p>' +
      '<div class="stroll mt-12" data-test="stroll-board">' +
      tiles.map(function (tile, i) {
        return '<div class="tile' + (i === pos ? " on" : "") + '" data-test="tile-' + tile.id + '"><b>' + esc(tile.name) + "</b>" + esc(App.Balance.ROOM_META[tile.room].name) + "</div>";
      }).join("") + "</div>";
    var pending = state.stroll && state.stroll.pending;
    if (!pending) {
      html += '<button class="btn primary wide mt-16" data-test="stroll-roll" data-act="stroll-roll">一起走</button>';
      return html;
    }
    html += '<p class="small gold mt-12">走了 ' + state.stroll.lastDie + " 步 · " + esc(pending.tile.name) + "</p>";
    html += promptBlock(state, pending.card, App.Balance.ROOM_META[pending.tile.room].name);
    html += '<div class="actions"><button class="btn primary wide" data-test="did" data-act="stroll-settle" data-how="done">做了</button>' +
      '<button class="btn ghost wide" data-test="pass" data-act="stroll-settle" data-how="pass">先放下</button></div>';
    return html;
  }

  function body(state) {
    if (state.phase === "stroll") return strollHtml(state);
    if (state.room === "living") return livingHtml(state);
    if (state.room === "kitchen") return wheelScreen(state, "dare");
    if (state.room === "bathroom") return wheelScreen(state, "truth");
    if (state.room === "balcony") return thermoHtml(state);
    if (state.room === "bedroom") return bedroomHtml(state);
    return "<p>这间房还没准备好。</p>";
  }

  function prepare(state, api) {
    if (!state || state.phase === "stroll" || state.phase === "done") return state;
    var next = null;
    if (state.room === "kitchen" && (!state.wheel || state.wheel.kind !== "dare")) next = App.Engine.dealWheel(state, "dare");
    else if (state.room === "bathroom" && (!state.wheel || state.wheel.kind !== "truth")) next = App.Engine.dealWheel(state, "truth");
    else if (state.room === "balcony" && !state.thermo) next = App.Engine.thermoBegin(state);
    if (!next) return state;
    api.save(next.state);
    return next.state;
  }

  App.Kit = {
    open: function (root, api) {
      var timer = null;
      function get() { return api.get(); }
      function commit(ret, opts) {
        opts = opts || {};
        var s = ret && ret.state ? ret.state : ret;
        api.save(s);
        if (api.night) App.Night.paint(s);
        if (opts.spin) {
          var rotor = root.querySelector("[data-rotor]");
          var idx = s.wheel && s.wheel.index || 0;
          if (rotor) {
            var deg = 1440 - idx * 60;
            rotor.style.transition = reduced() ? "none" : "transform 1s cubic-bezier(.15,.8,.2,1)";
            rotor.style.transform = "rotate(" + deg + "deg)";
          }
          clearTimeout(timer);
          timer = setTimeout(render, reduced() ? 30 : 1000);
          return;
        }
        render();
      }
      function render() {
        var state = prepare(get(), api);
        if (!state) { api.onLeave(); return; }
        var heat = '<div class="tiny dim mb-8" data-test="room-heat" data-heat="' + (state.heat || 0) + '">' +
          esc(App.Balance.stageLabel(state.heat || 0)) + " · " + (state.heat || 0) +
          (state.mode === "standalone" ? " · 游戏门" : "") + "</div>";
        var paste = "";
        if (!api.night && state.mode === "standalone" && ((state.log && state.log.length) || (state.thermo && state.thermo.revealed))) {
          paste = '<button class="btn soft wide mt-12" data-test="paste-tonight" data-act="paste">带回今晚</button>';
        }
        root.innerHTML = '<div class="page">' + heat + body(state) + paste + "</div>";
        root.querySelectorAll("[data-place],[data-guess]").forEach(function (input) {
          input.addEventListener("input", function () {
            var cap = App.Engine.capOf(get());
            var slot = input.hasAttribute("data-place") ? "[data-place-label]" : "[data-guess-label]";
            var lab = root.querySelector(slot);
            if (lab) lab.textContent = labelAt(cap, parseInt(input.value, 10) || 0);
          });
        });
      }
      function bind() {
        U.delegate(root, "[data-act]", "click", function (e, el) {
          if (el.disabled) return;
          var act = el.getAttribute("data-act");
          var state = get();
          if (!state) return;
          if (act === "leave") { api.onLeave(); return; }
          if (act === "offer") {
            commit(App.Engine.livingOffer(state, { who: el.getAttribute("data-who"), role: el.getAttribute("data-role") }));
            return;
          }
          if (act === "deeper") { commit(App.Engine.pushDeeper(state)); return; }
          if (act === "settle") { commit(App.Engine.settlePrompt(state, el.getAttribute("data-how"))); return; }
          if (act === "spin") { commit(App.Engine.spinWheel(state), { spin: true }); return; }
          if (act === "reroll") {
            var r = App.Engine.rerollWheel(state);
            if (r.events[0] && r.events[0].type === "blocked") App.UI.toast("重抽用完了");
            commit(r);
            return;
          }
          if (act === "hand") { commit(App.Engine.handTruth(state, el.getAttribute("data-who"))); return; }
          if (act === "thermo-lock") {
            var who = el.getAttribute("data-who");
            var place = parseInt((root.querySelector("[data-place]") || {}).value, 10) || 0;
            var guess = parseInt((root.querySelector("[data-guess]") || {}).value, 10) || 0;
            var locked = App.Engine.thermoSet(state, who, place, guess);
            if (who === "b") commit(App.Engine.thermoReveal(locked.state));
            else commit(locked);
            return;
          }
          if (act === "thermo-pass") { commit(App.Engine.thermoPass(state)); return; }
          if (act === "thermo-reveal") { commit(App.Engine.thermoReveal(state)); return; }
          if (act === "thermo-reset") { commit(App.Engine.thermoBegin(state)); return; }
          if (act === "bed") {
            var mode = App.Engine.bedroomMode(state, el.getAttribute("data-mode"));
            commit(App.Engine.bedroomDraw(mode.state));
            return;
          }
          if (act === "bed-draw") { commit(App.Engine.bedroomDraw(state)); return; }
          if (act === "stroll-roll") { commit(App.Engine.strollRoll(state)); return; }
          if (act === "stroll-settle") { commit(App.Engine.strollSettle(state, el.getAttribute("data-how"))); return; }
          if (act === "paste" && api.onPaste) api.onPaste(App.Engine.standalonePack(state));
        });
      }
      render();
      bind();
      return function () { clearTimeout(timer); };
    }
  };
})();
