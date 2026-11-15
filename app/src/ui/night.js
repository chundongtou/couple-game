/* ===== 公寓夜 · 画面状态（热度、深浅） ===== */
(function () {
  var App = (window.App = window.App || {});

  function stage(heat) {
    try { return App.Balance.stageOf(heat); } catch (e) { return "quiet"; }
  }

  App.Night = {
    paint: function (state) {
      var body = document.body;
      if (!body) return;
      var on = !!(state && state.kind === "apartment" && state.phase && state.phase !== "done" && state.mode !== "standalone");
      body.setAttribute("data-night", on ? "1" : "0");
      var heat = state && state.heat || 0;
      var st = stage(heat);
      var level = st === "burning" ? "3" : st === "charged" ? "2" : st === "warm" ? "1" : "0";
      body.setAttribute("data-heat", on || (state && state.mode === "standalone") ? level : "0");
      var late = state && (state.minutes || 0) >= 23 * 60 + 20;
      body.setAttribute("data-late", late ? "1" : "0");
    },
    line: function (room, cap) {
      var C = (App.CONTENT && App.CONTENT.rooms) || {};
      var pack = C[room] || {};
      return pack[cap] || pack[3] || "";
    },
    intensityLine: function (cap) {
      var I = (App.CONTENT && App.CONTENT.intensities) || {};
      return (I[cap] && I[cap].line) || "";
    }
  };
})();
