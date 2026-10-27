/* ===== V3 core/motion.js：动效工具（尊重减少动效） ===== */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util;
  var forcedReduced = null;

  function reduced() {
    if (typeof forcedReduced === "boolean") return forcedReduced;
    try {
      if (App.Store && App.Store.getSettings().reduced) return true;
    } catch (e) {}
    try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }

  function setStyle(el, obj) {
    Object.keys(obj).forEach(function (k) { el.style[k] = obj[k]; });
  }

  function anim(el, from, to, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!el) return resolve();
      if (reduced() || opts.instant) {
        setStyle(el, to);
        return resolve();
      }
      setStyle(el, from);
      el.style.transition = "none";
      void el.offsetWidth;
      el.style.transition = (opts.prop || "all") + " " + (opts.dur || 320) + "ms " + (opts.ease || "cubic-bezier(.2,.8,.2,1)") + (opts.delay ? " " + opts.delay + "ms" : "");
      requestAnimationFrame(function () {
        setStyle(el, to);
        var done = false;
        function fin() { if (done) return; done = true; el.removeEventListener("transitionend", fin); resolve(); }
        el.addEventListener("transitionend", fin);
        setTimeout(fin, (opts.dur || 320) + (opts.delay || 0) + 80);
      });
    });
  }

  var Motion = (App.Motion = {
    reduced: reduced,
    setReduced: function (v) { forcedReduced = v; document.body.classList.toggle("reduce", reduced()); },
    syncBodyClass: function () { document.body.classList.toggle("reduce", reduced()); },
    anim: anim,
    enter: function (el, opts) {
      opts = opts || {};
      return anim(el,
        { opacity: 0, transform: "translateY(" + (opts.y === undefined ? 16 : opts.y) + "px) scale(" + (opts.scale === undefined ? 0.985 : opts.scale) + ")" },
        { opacity: 1, transform: "none" },
        opts);
    },
    leave: function (el, opts) {
      opts = opts || {};
      return anim(el,
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "translateY(" + (opts.y === undefined ? -10 : opts.y) + "px) scale(0.99)" },
        opts);
    },
    stagger: function (els, step, opts) {
      step = step || 55;
      els = Array.prototype.slice.call(els || []);
      return Promise.all(els.map(function (el, i) {
        return Motion.enter(el, Object.assign({ delay: i * step }, opts || {}));
      }));
    },
    shake: function (el) {
      if (!el) return;
      if (reduced()) { el.classList.add("shake-once"); setTimeout(function () { el.classList.remove("shake-once"); }, 320); return; }
      el.classList.remove("shake-once");
      void el.offsetWidth;
      el.classList.add("shake-once");
      setTimeout(function () { el.classList.remove("shake-once"); }, 460);
    },
    pulse: function (el, cls) {
      if (!el) return;
      cls = cls || "pulse-once";
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      setTimeout(function () { el.classList.remove(cls); }, 700);
    },
    floatText: function (anchor, text, cls) {
      if (!anchor) return;
      var rect = anchor.getBoundingClientRect();
      var d = document.createElement("div");
      d.className = "float-text " + (cls || "");
      d.textContent = text;
      d.style.left = rect.left + rect.width / 2 + "px";
      d.style.top = rect.top + "px";
      document.getElementById("overlay").appendChild(d);
      if (reduced()) {
        setTimeout(function () { d.remove(); }, 500);
        return;
      }
      requestAnimationFrame(function () {
        d.style.transform = "translate(-50%,-150%) scale(1.05)";
        d.style.opacity = "0";
      });
      setTimeout(function () { d.remove(); }, 900);
    },
    burst: function (x, y, opts) {
      opts = opts || {};
      if (reduced()) return;
      var n = opts.count || 18;
      var colors = opts.colors || ["#ff5f9e", "#f2c879", "#8b6cff", "#4fd6c8", "#ffffff"];
      var host = document.getElementById("overlay");
      for (var i = 0; i < n; i++) {
        var s = document.createElement("i");
        s.className = "fx-dot";
        var a = Math.random() * Math.PI * 2;
        var dist = 30 + Math.random() * (opts.radius || 130);
        s.style.left = x + "px";
        s.style.top = y + "px";
        s.style.background = colors[Math.floor(Math.random() * colors.length)];
        s.style.width = s.style.height = (2 + Math.random() * 5).toFixed(1) + "px";
        host.appendChild(s);
        (function (el, ang, dd) {
          requestAnimationFrame(function () {
            el.style.transform = "translate(" + Math.cos(ang) * dd + "px," + (Math.sin(ang) * dd + 40) + "px) scale(.2)";
            el.style.opacity = "0";
          });
          setTimeout(function () { el.remove(); }, 900);
        })(s, a, dist);
      }
    },
    count: function (el, to, opts) {
      opts = opts || {};
      if (!el) return Promise.resolve();
      var from = opts.from !== undefined ? opts.from : (parseInt(el.textContent, 10) || 0);
      to = parseInt(to, 10) || 0;
      if (reduced() || from === to) { el.textContent = String(to); return Promise.resolve(); }
      var dur = opts.dur || 480;
      var t0 = null;
      return new Promise(function (resolve) {
        function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / dur);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(from + (to - from) * e));
          if (p < 1) requestAnimationFrame(step); else resolve();
        }
        requestAnimationFrame(step);
      });
    },
    typewriter: function (el, text, speed) {
      if (!el) return Promise.resolve();
      if (reduced() || speed <= 0) { el.textContent = text; return Promise.resolve(); }
      return new Promise(function (resolve) {
        var i = 0;
        el.textContent = "";
        var tv = setInterval(function () {
          i += 1;
          el.textContent = text.slice(0, i);
          if (i >= text.length) { clearInterval(tv); resolve(); }
        }, speed || 28);
      });
    }
  });
})();
