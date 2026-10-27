/* ===== V3 core/bus.js：极简事件总线 ===== */
(function () {
  var App = (window.App = window.App || {});
  var map = {};
  App.Bus = {
    on: function (name, fn) {
      (map[name] = map[name] || []).push(fn);
      return function () { App.Bus.off(name, fn); };
    },
    off: function (name, fn) {
      if (!map[name]) return;
      map[name] = map[name].filter(function (f) { return f !== fn; });
    },
    emit: function (name, payload) {
      (map[name] || []).slice().forEach(function (fn) {
        try { fn(payload); } catch (e) { if (window.console) console.error("[bus]", name, e); }
      });
    },
    clear: function (name) { if (name) delete map[name]; else map = {}; }
  };
})();
