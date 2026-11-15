/* ===== 温度计 / 真心话转盘 / 大冒险转盘，以及小游戏门厅 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  function settings() { return App.Store.getSettings(); }

  function load() {
    var s = App.Store.getStandalone();
    return s && s.kind === "standalone" ? s : null;
  }
  function save(state) { App.Store.saveStandalone(state); }

  function shell(title, body) {
    return '<div class="page" data-test="minigame">' +
      '<div class="topbar"><button class="back" data-go="boot">←</button><div class="tb-title">' + title + "</div></div>" +
      body + "</div>";
  }

  function hall() {
    return shell("小游戏",
      '<p class="muted mt-12">温度计、真心话转盘、大冒险转盘可以单独玩。飞行棋只有桌上这一盘。</p>' +
      '<div class="actions mt-16">' +
        '<button class="btn primary wide" data-game="thermo" data-test="play-thermo">温度计</button>' +
        '<button class="btn soft wide" data-game="truth" data-test="play-truth">真心话转盘</button>' +
        '<button class="btn soft wide" data-game="dare" data-test="play-dare">大冒险转盘</button>' +
        '<button class="btn ghost wide" data-go="boot">回飞行棋</button>' +
      "</div>");
  }

  function thermoView(state) {
    var t = state.thermo || {};
    var labels = t.labels || [];
    if (!t.a) {
      return shell("温度计",
        '<p class="muted mt-12">' + U.escape(state.names.a) + " 先把自己的位置和猜的对方标出来。</p>" +
        slider("place", "我在这", labels) + slider("guess", "我猜对方", labels) +
        '<button class="btn primary wide mt-16" data-act="lock-a">标好了</button>');
    }
    if (!t.passing) {
      return shell("温度计", '<p class="muted mt-16">把手机递给 ' + U.escape(state.names.b) + "。</p>" +
        '<button class="btn primary wide mt-16" data-act="pass">递过去</button>');
    }
    if (!t.b) {
      return shell("温度计",
        '<p class="muted mt-12">' + U.escape(state.names.b) + " 的位置和猜测。</p>" +
        slider("place", "我在这", labels) + slider("guess", "我猜对方", labels) +
        '<button class="btn primary wide mt-16" data-act="lock-b">标好了</button>');
    }
    if (!t.revealed) {
      return shell("温度计", '<button class="btn primary wide mt-16" data-act="reveal">揭晓</button>');
    }
    return shell("温度计",
      '<h1 class="title-xl mt-12">猜近了 ' + Math.round((t.closeness || 0) * 100) + "</h1>" +
      '<p class="muted mt-12">这一页只记你们标过。没有要扣的。</p>' +
      '<button class="btn primary wide mt-16" data-act="again">再量一次</button>');
  }

  function slider(key, label, labels) {
    var max = Math.max(0, labels.length - 1);
    return '<label class="small dim mt-12" style="display:block">' + label + "</label>" +
      '<input data-slider="' + key + '" type="range" min="0" max="' + max + '" value="0" style="width:100%" />' +
      '<div class="tiny" data-label="' + key + '">' + U.escape(labels[0] || "") + "</div>";
  }

  function wheelView(state) {
    var w = state.wheel || { slots: [] };
    var title = state.game === "truth" ? "真心话转盘" : "大冒险转盘";
    var card = w.spun ? w.slots[w.index] : null;
    var slots = (w.slots || []).map(function (c, i) {
      return '<li class="' + (w.index === i ? "gold" : "dim") + '">' + U.escape(c.text) + "</li>";
    }).join("");
    return shell(title,
      '<ul class="mt-12">' + slots + "</ul>" +
      (card ? '<div class="glass pad-16 mt-12">' + U.escape(card.text) + "</div>" : "") +
      '<div class="actions mt-16">' +
        (w.spun ? "" : '<button class="btn primary wide" data-act="spin" data-test="spin">转</button>') +
        '<button class="btn soft wide" data-act="hand" data-test="hand">交给对方说</button>' +
        '<button class="btn ghost wide" data-act="reroll">换一组</button>' +
        '<button class="btn ghost wide" data-act="again">重开</button>' +
      "</div>" +
      (state.prompt && state.prompt.who ? '<p class="small dim mt-12">这张交给' + (state.prompt.who === "other" ? "对方" : "自己") + "</p>" : ""));
  }

  App.Screens = App.Screens || {};
  App.Screens.minigame = {
    mount: function (root, params) {
      params = params || {};
      var game = params.game || null;
      if (params.hall || !game) {
        root.innerHTML = hall();
        U.delegate(root, "[data-game]", "click", function (e, el) {
          App.Router.go("minigame", { game: el.getAttribute("data-game") });
        });
        U.delegate(root, "[data-go]", "click", function () { App.Router.reset("boot"); });
        return;
      }
      var existing = load();
      var state = existing && existing.game === game ? existing : null;
      if (!state) {
        var made = App.Minigames.newStandalone(game, settings());
        if (!made.ok) { App.UI.toast("没能打开"); App.Router.reset("boot"); return; }
        state = made.state;
        save(state);
      }

      function draw() {
        root.innerHTML = game === "thermo" ? thermoView(state) : wheelView(state);
        U.qsa("[data-slider]", root).forEach(function (input) {
          input.addEventListener("input", function () {
            var labels = (state.thermo && state.thermo.labels) || [];
            var lab = root.querySelector('[data-label="' + input.getAttribute("data-slider") + '"]');
            if (lab) lab.textContent = labels[Number(input.value)] || "";
          });
        });
      }
      function readSlider(key) {
        var el = root.querySelector('[data-slider="' + key + '"]');
        return el ? Number(el.value) : 0;
      }
      function apply(ret) {
        if (!ret || !ret.ok) { App.UI.toast((ret && ret.error && ret.error.message) || "还不能这样做"); return; }
        state = ret.state;
        save(state);
        draw();
      }
      draw();
      U.delegate(root, "[data-go]", "click", function () { App.Router.reset("boot"); });
      root.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-act]");
        if (!btn) return;
        var act = btn.getAttribute("data-act");
        if (act === "lock-a") apply(App.Minigames.thermoSet(state, "a", readSlider("place"), readSlider("guess")));
        if (act === "pass") apply(App.Minigames.thermoPass(state));
        if (act === "lock-b") apply(App.Minigames.thermoSet(state, "b", readSlider("place"), readSlider("guess")));
        if (act === "reveal") apply(App.Minigames.thermoReveal(state));
        if (act === "spin") apply(App.Minigames.spinWheel(state));
        if (act === "hand") apply(App.Minigames.handTruth(state, "other"));
        if (act === "reroll") apply(App.Minigames.rerollWheel(state));
        if (act === "again") {
          var made = App.Minigames.newStandalone(game, settings());
          if (made.ok) { state = made.state; save(state); draw(); }
        }
      });
    }
  };
})();
