/* ===== 主桌 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var INK = { red: "#d64545", yellow: "#e6b325", blue: "#3a78d8", green: "#2fa36a" };

  var CSS = [
    ".table-root{position:absolute;inset:0;background:#140e0b;overflow:hidden}",
    ".table-canvas{position:absolute;inset:0}",
    ".table-canvas canvas{width:100%;height:100%;display:block}",
    ".table-hud{position:absolute;left:0;right:0;top:0;z-index:5;pointer-events:none;",
    "padding:calc(10px + var(--safe-t)) 12px 0;display:flex;justify-content:space-between;gap:8px}",
    ".turn-pill{pointer-events:auto;display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;",
    "background:rgba(20,12,8,.72);color:#fff8ee;border:1px solid rgba(255,255,255,.12)}",
    ".turn-dot{width:12px;height:12px;border-radius:50%}",
    ".hud-btn{pointer-events:auto}",
    ".table-actions{position:absolute;left:12px;right:12px;bottom:calc(18px + var(--safe-b));z-index:6;",
    "display:flex;flex-direction:column;gap:8px}",
    ".piece-choices{display:flex;flex-wrap:wrap;gap:8px}",
    ".table-root .prompt-dock{z-index:8}"
  ].join("");

  App.Screens = App.Screens || {};
  App.Screens.table = {
    mount: function (root) {
      var state = App.Store.getSession();
      if (!state) { App.Router.reset("boot"); return; }
      App.UI.injectStyle("table", CSS);
      var settings = App.Store.getSettings();
      root.innerHTML =
        '<div class="table-root" data-test="table">' +
          '<div class="table-canvas" data-board></div>' +
          '<div class="table-hud">' +
            '<div class="turn-pill" data-test="turn-pill"><i class="turn-dot"></i><span data-turn-name></span></div>' +
            '<button class="btn sm soft hud-btn" data-go="boot">离开</button>' +
          "</div>" +
          '<div class="table-actions" data-actions></div>' +
          '<div data-card></div>' +
        "</div>";
      var boardEl = root.querySelector("[data-board]");
      var actions = root.querySelector("[data-actions]");
      var cardHost = root.querySelector("[data-card]");
      var busy = false;
      if (App.BoardView && App.BoardView.mount) {
        App.BoardView.mount(boardEl, { reduced: !!settings.reduced, sound: settings.sound !== false });
        App.BoardView.setReduced(!!settings.reduced);
        if (App.BoardView.setSound) App.BoardView.setSound(settings.sound !== false);
        App.BoardView.setState(App.Flight.view(state, { reduced: !!settings.reduced }));
      } else {
        App.UI.toast("棋盘脚本还没载入");
      }

      function paintTurn() {
        var color = state.colors[state.turn];
        var dot = root.querySelector(".turn-dot");
        var name = root.querySelector("[data-turn-name]");
        if (dot) dot.style.background = INK[color] || "#fff";
        if (name) name.textContent = (state.names[state.turn] || "") + " 的回合";
        root.querySelector(".turn-pill").style.boxShadow = "0 0 0 1px " + (INK[color] || "#fff");
      }

      async function commit(ret) {
        if (!ret || !ret.ok) {
          App.UI.toast((ret && ret.error && ret.error.message) || "这步没有走成");
          busy = false;
          renderActions();
          return;
        }
        state = ret.state;
        if (state.phase === "playing") App.Store.saveSession(state);
        busy = true;
        renderActions();
        try {
          if (App.BoardView && App.BoardView.play) await App.BoardView.play(ret.events || []);
          if (App.BoardView && App.BoardView.setState) App.BoardView.setState(App.Flight.view(state, { reduced: App.Store.getSettings().reduced }));
        } catch (e) {
          if (window.console) console.error("[table]", e);
        }
        busy = false;
        if (state.phase === "ended" || state.phase === "safe-ended") {
          var entry = App.Store.makeHistoryEntry(state);
          App.Store.addHistory(entry);
          App.Store.clearSession();
          App.Router.reset("ledger", { id: entry.id });
          return;
        }
        renderActions();
      }

      function renderActions() {
        paintTurn();
        cardHost.innerHTML = "";
        actions.innerHTML = "";
        actions.style.display = "";
        if (busy) return;
        var wait = state.awaiting || {};
        if (wait.type === "prompt" || wait.type === "ending-prompt") {
          actions.style.display = "none";
          App.PromptCard.open(cardHost, wait.prompt, state, {
            done: function () { commit(App.Flight.resolvePrompt(state, "done")); },
            skipped: function () { commit(App.Flight.resolvePrompt(state, "skipped")); }
          });
          return;
        }
        if (wait.type === "minigame") {
          actions.innerHTML =
            '<p class="small" style="color:#fff8ee;text-align:center">落到了' +
            (wait.kind === "thermo" ? "温度计" : (wait.kind === "truth-wheel" ? "真心话转盘" : "大冒险转盘")) +
            '</p><button class="btn primary wide" data-act="mini-done" data-test="mini-done">玩过了，继续走棋</button>';
          return;
        }
        if (wait.type === "choose-piece") {
          var html = '<div class="piece-choices">';
          (wait.pieceIds || []).forEach(function (id) {
            var piece = state.pieces.filter(function (p) { return p.id === id; })[0];
            var label = (piece ? ({ red: "红", yellow: "黄", blue: "蓝", green: "绿" })[piece.color] : "") + " " + id;
            html += '<button class="btn soft" data-piece="' + id + '">' + label + "</button>";
          });
          html += "</div>";
          actions.innerHTML = html;
          return;
        }
        if (wait.type === "roll") {
          actions.innerHTML = '<button class="btn primary wide" data-act="roll" data-test="roll">掷骰</button>';
        }
      }

      actions.addEventListener("click", function (e) {
        var roll = e.target.closest("[data-act=roll]");
        var piece = e.target.closest("[data-piece]");
        var mini = e.target.closest("[data-act=mini-done]");
        if (roll) commit(App.Flight.roll(state));
        else if (piece) commit(App.Flight.move(state, piece.getAttribute("data-piece")));
        else if (mini) commit(App.Flight.resolveMinigame(state, {}));
      });
      U.delegate(root, "[data-go]", "click", function (e, el) { App.Router.reset(el.getAttribute("data-go")); });

      var off = App.Bus.on("settings", function (s) {
        if (App.BoardView) {
          App.BoardView.setReduced(!!s.reduced);
          if (App.BoardView.setSound) App.BoardView.setSound(s.sound !== false);
        }
      });
      renderActions();
      return function () {
        if (off) off();
        if (App.BoardView && App.BoardView.unmount) App.BoardView.unmount();
      };
    }
  };
})();
