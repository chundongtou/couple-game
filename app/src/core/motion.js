/* ===== V6 core/motion.js：动效工具（timeline / spring / reduced 全兼容） =====
   约束：减少动效时任何单次动画 ≤100ms（spec AC-H2-1）；所有时长走 Motion.dur()。 */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util;
  if (!U) return;
  var forcedReduced = null;
  var REDUCED_CAP = 100;

  function reduced() {
    if (typeof forcedReduced === "boolean") return forcedReduced;
    try {
      if (App.Store && App.Store.getSettings().reduced) return true;
    } catch (e) {}
    try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }

  /* 时长夹紧：reduced 时 ≤100ms（关键反馈仍可见，只是不等动画） */
  function dur(ms) {
    var v = Math.max(0, Number(ms) || 0);
    return reduced() ? Math.min(v, REDUCED_CAP) : v;
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
      el.style.transition = (opts.prop || "all") + " " + dur(opts.dur || 320) + "ms " +
        (opts.ease || "var(--ease-out)") + (opts.delay ? " " + opts.delay + "ms" : "");
      requestAnimationFrame(function () {
        setStyle(el, to);
        var done = false;
        function fin() {
          if (done) return;
          done = true;
          el.removeEventListener("transitionend", fin);
          el.style.transition = "";
          resolve();
        }
        el.addEventListener("transitionend", fin);
        setTimeout(fin, dur(opts.dur || 320) + (opts.delay || 0) + 90);
      });
    });
  }

  /* WAAPI 包装：时长同样受 reduced 夹紧；不支持时退回 anim() */
  function waapi(el, frames, opts) {
    opts = opts || {};
    if (!el) return Promise.resolve();
    if (reduced() || opts.instant) {
      var last = frames && frames.length ? frames[frames.length - 1] : null;
      if (last) {
        Object.keys(last).forEach(function (k) {
          if (k === "offset" || k === "easing") return;
          var v = last[k];
          if (k === "transform") el.style.transform = v === "none" ? "" : v;
          else if (k === "opacity") el.style.opacity = String(v);
          else el.style[k] = v;
        });
      }
      return Promise.resolve();
    }
    if (!el.animate) return anim(el, null, {}, { instant: true });
    try {
      var a = el.animate(frames, {
        duration: dur(opts.dur || 320),
        delay: opts.delay || 0,
        easing: opts.ease || "cubic-bezier(.16,1,.3,1)",
        fill: opts.fill || "both",
        iterations: opts.iterations || 1
      });
      return new Promise(function (resolve) {
        a.onfinish = function () { resolve(); };
        a.oncancel = function () { resolve(); };
        setTimeout(function () { try { a.finish(); } catch (e) { resolve(); } }, dur(opts.dur || 320) + (opts.delay || 0) + 120);
      });
    } catch (e) {
      return anim(el, null, {}, { instant: true });
    }
  }

  var Motion = (App.Motion = {
    reduced: reduced,
    dur: dur,
    REDUCED_CAP: REDUCED_CAP,
    setReduced: function (v) { forcedReduced = v; document.body.classList.toggle("reduce", reduced()); },
    syncBodyClass: function () { document.body.classList.toggle("reduce", reduced()); },
    anim: anim,
    waapi: waapi,

    /* 依次执行：项可以是函数（返回 Promise）或 {el,from,to,opts} */
    timeline: function (steps, opts) {
      opts = opts || {};
      var list = (steps || []).slice();
      return list.reduce(function (p, step) {
        return p.then(function () {
          if (typeof step === "function") return step();
          if (step && step.el) return anim(step.el, step.from || {}, step.to || {}, step.opts || {});
          return null;
        });
      }, Promise.resolve()).then(function () {
        if (opts.onDone) opts.onDone();
      });
    },

    /* 弹簧入场：用带过冲的 easing 模拟，reduced 时直接落位 */
    spring: function (el, opts) {
      opts = opts || {};
      if (!el) return Promise.resolve();
      if (reduced()) {
        setStyle(el, { opacity: "1", transform: "none" });
        return Promise.resolve();
      }
      setStyle(el, { opacity: "0", transform: "translateY(" + (opts.y === undefined ? 18 : opts.y) + "px) scale(" + (opts.scale === undefined ? 0.96 : opts.scale) + ")" });
      el.style.transition = "none";
      void el.offsetWidth;
      el.style.transition = "opacity " + dur(opts.dur || 260) + "ms var(--ease-out),transform " +
        dur(opts.dur || 360) + "ms cubic-bezier(.2,1.5,.4,1)";
      requestAnimationFrame(function () {
        setStyle(el, { opacity: "1", transform: "none" });
        setTimeout(function () { el.style.transition = ""; }, dur(opts.dur || 360) + 100);
      });
      return Promise.resolve();
    },

    enter: function (el, opts) {
      opts = opts || {};
      return anim(el, {
        opacity: 0,
        transform: "translateY(" + (opts.y === undefined ? 14 : opts.y) + "px) scale(" + (opts.scale === undefined ? 0.985 : opts.scale) + ")"
      }, { opacity: 1, transform: "none" }, opts);
    },
    leave: function (el, opts) {
      opts = opts || {};
      return anim(el, { opacity: 1, transform: "none" },
        { opacity: 0, transform: "translateY(" + (opts.y === undefined ? -10 : opts.y) + "px) scale(0.99)" }, opts);
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
      el.classList.remove("shake-once");
      void el.offsetWidth;
      el.classList.add("shake-once");
      setTimeout(function () { el.classList.remove("shake-once"); }, 500);
    },
    pulse: function (el, cls) {
      if (!el) return;
      cls = cls || "pulse-once";
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      setTimeout(function () { el.classList.remove(cls); }, 720);
    },
    floatText: function (anchor, text, cls) {
      if (!anchor) return;
      var rect = anchor.getBoundingClientRect();
      var d = document.createElement("div");
      d.className = "float-text " + (cls || "");
      d.textContent = text;
      d.style.left = rect.left + rect.width / 2 + "px";
      d.style.top = rect.top + "px";
      (document.getElementById("overlay") || document.body).appendChild(d);
      if (reduced()) {
        setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 500);
        return;
      }
      requestAnimationFrame(function () {
        d.style.transform = "translate(-50%,-150%) scale(1.05)";
        d.style.opacity = "0";
      });
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 900);
    },
    burst: function (x, y, opts) {
      opts = opts || {};
      if (reduced()) return;
      var n = opts.count || 16;
      var colors = opts.colors || ["#F3C077", "#E9887A", "#8E7BD8", "#FBF3E7"];
      var host = document.getElementById("overlay") || document.body;
      for (var i = 0; i < n; i++) {
        var s = document.createElement("i");
        s.className = "fx-dot";
        var a = Math.random() * Math.PI * 2;
        var dist = 26 + Math.random() * (opts.radius || 110);
        s.style.left = x + "px";
        s.style.top = y + "px";
        s.style.background = colors[Math.floor(Math.random() * colors.length)];
        s.style.width = s.style.height = (2 + Math.random() * 4).toFixed(1) + "px";
        host.appendChild(s);
        (function (el, ang, dd) {
          requestAnimationFrame(function () {
            el.style.transform = "translate(" + Math.cos(ang) * dd + "px," + (Math.sin(ang) * dd + 34) + "px) scale(.2)";
            el.style.opacity = "0";
          });
          setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
        })(s, a, dist);
      }
    },
    count: function (el, to, opts) {
      opts = opts || {};
      if (!el) return Promise.resolve();
      var from = opts.from !== undefined ? opts.from : (parseInt(el.textContent, 10) || 0);
      to = parseInt(to, 10) || 0;
      if (reduced() || from === to) { el.textContent = String(to); return Promise.resolve(); }
      var durMs = dur(opts.dur || 480);
      var t0 = null;
      return new Promise(function (resolve) {
        function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / Math.max(1, durMs));
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(from + (to - from) * e));
          if (p < 1) requestAnimationFrame(step); else resolve();
        }
        requestAnimationFrame(step);
      });
    },
    typewriter: function (el, text, speed) {
      if (!el) return Promise.resolve();
      if (reduced() || !speed || speed <= 0) { el.textContent = text; return Promise.resolve(); }
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
