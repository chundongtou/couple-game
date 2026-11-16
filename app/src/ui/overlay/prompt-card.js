/* ===== 桌边题卡：棋盘留在画面里 ===== */
(function () {
  var App = (window.App = window.App || {});

  var KIND = {
    "cell-truth": "真心话",
    "cell-dare": "大冒险",
    "cell-touch": "靠近",
    "capture": "击落",
    "stack-duo": "叠机",
    "home-entry": "进终点",
    "ending": "今晚最后一张"
  };

  var CSS = [
    ".prompt-dock{position:absolute;left:10px;right:10px;bottom:calc(10px + var(--safe-b));z-index:30;",
    "max-height:46%;overflow:auto;border-radius:22px;padding:14px 14px 12px;",
    "background:linear-gradient(180deg,#fff8ee,#f3e2c8);color:#2a1a12;",
    "box-shadow:0 16px 40px rgba(0,0,0,.35);transform-origin:50% 100%;",
    "animation:cardIn .32s cubic-bezier(.2,.8,.2,1);}",
    "@keyframes cardIn{from{opacity:0;transform:translateY(18px) rotateX(12deg)}to{opacity:1;transform:none}}",
    ".prompt-kicker{font-size:12px;letter-spacing:.14em;color:#8a5a32;font-weight:700}",
    ".prompt-text{font-family:var(--font);font-size:20px;line-height:1.45;margin:8px 0 12px}",
    ".prompt-actions{display:flex;gap:8px}",
    ".prompt-actions .btn{flex:1}",
    ".prompt-dock .btn.primary{background:#2a1a12;color:#fff8ee}",
    ".prompt-dock .btn.ghost{color:#6a4630;border-color:rgba(80,40,20,.25)}"
  ].join("");

  function whoLine(prompt, state) {
    if (!prompt) return "";
    if (prompt.kind === "stack-duo" || prompt.targetId === "both") return "两人一起";
    if (prompt.kind === "capture" || prompt.kind === "ending") {
      var id = prompt.actorId;
      var name = state && state.names ? state.names[id] : "";
      return (name || "对方") + " 来做";
    }
    return "这张给走到的人";
  }

  App.PromptCard = {
    open: function (host, prompt, state, handlers) {
      if (!host || !prompt) return function () {};
      App.UI.injectStyle("prompt-card", CSS);
      host.innerHTML = "";
      var dock = document.createElement("div");
      dock.className = "prompt-dock";
      dock.setAttribute("data-test", "prompt-card");
      var stars = App.UI.stars(prompt.card && prompt.card.star || 1);
      dock.innerHTML =
        '<div class="prompt-kicker">' + (KIND[prompt.kind] || "题目") + " · " + whoLine(prompt, state) + "</div>" +
        '<div class="prompt-text">' + App.util.escape(prompt.card && prompt.card.text || "") + "</div>" +
        '<div class="small" style="color:#8a5a32;margin-bottom:10px">' + stars + "</div>" +
        '<div class="prompt-actions">' +
          '<button class="btn primary" data-act="done" data-test="prompt-done">做了</button>' +
          '<button class="btn ghost" data-act="skipped" data-test="prompt-skip">放过</button>' +
        "</div>";
      host.appendChild(dock);
      if (App.Audio) App.Audio.play("flip");
      dock.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-act]");
        if (!btn) return;
        handlers[btn.getAttribute("data-act")]();
      });
      return function () { host.innerHTML = ""; };
    }
  };
})();
