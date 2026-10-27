/* ===== V3 core/util.js：基础工具 ===== */
(function () {
  var App = (window.App = window.App || {});
  var U = (App.util = {});

  U.qs = function (sel, root) { return (root || document).querySelector(sel); };
  U.qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  U.el = function (tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "style" && typeof v === "object") { Object.keys(v).forEach(function (s) { el.style[s] = v[s]; }); }
        else if (k.indexOf("on") === 0 && typeof v === "function") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c === null || c === undefined || c === false) return;
        el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
      });
    }
    return el;
  };
  U.escape = function (s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  U.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  U.round = function (v) { return Math.round(Number(v) || 0); };
  U.pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
  U.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };
  U.now = function () { return Date.now(); };
  U.fmtDate = function (ts) {
    var d = new Date(ts || Date.now());
    var wd = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()];
    return (d.getMonth() + 1) + "月" + d.getDate() + "日 · " + wd;
  };
  U.fmtTime = function (ts) {
    var d = new Date(ts || Date.now());
    return U.pad2(d.getHours()) + ":" + U.pad2(d.getMinutes());
  };
  U.mulberry32 = function (seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  U.shuffle = function (arr, rng) {
    var a = arr.slice();
    var r = rng || Math.random;
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  U.pick = function (arr, rng) { return arr[Math.floor((rng || Math.random)() * arr.length)]; };
  U.storage = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    remove: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  U.on = function (el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); };
  U.delegate = function (root, sel, ev, fn) {
    U.on(root, ev, function (e) {
      var t = e.target;
      while (t && t !== root) {
        if (t.matches && t.matches(sel)) { fn(e, t); return; }
        t = t.parentNode;
      }
    });
  };
  U.wait = function (ms) { return new Promise(function (res) { setTimeout(res, ms || 0); }); };
  U.raf = function (fn) { return requestAnimationFrame(fn); };
  U.debounce = function (fn, ms) {
    var t = null;
    return function () {
      var self = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms || 120);
    };
  };
  U.throttle = function (fn, ms) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= (ms || 100)) { last = now; fn.apply(this, arguments); }
    };
  };
  U.copy = function (obj) { return JSON.parse(JSON.stringify(obj)); };
  U.objKeys = function (o) { return Object.keys(o || {}); };
})();
