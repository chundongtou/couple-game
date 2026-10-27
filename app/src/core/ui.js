/* ===== V3 core/ui.js：通用 UI 组件（toast / sheet / confirm / 资源图标 / 触感） ===== */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util;
  var M = App.Motion;
  var toastQueue = [];
  var toastBusy = false;
  var styles = {};

  var RES = {
    heart: { icon: "♥", label: "心动", cls: "res-heart" },
    tension: { icon: "✦", label: "张力", cls: "res-tension" },
    sync: { icon: "⌁", label: "默契", cls: "res-sync" },
    coins: { icon: "◈", label: "星屑", cls: "res-coins" }
  };
  var ICONS = {
    heart: "♥", tension: "✦", sync: "⌁", coin: "◈", star: "★", starEmpty: "☆",
    back: "←", close: "✕", arrow: "→", lock: "⌑", sound: "♪", mute: "♪̸",
    menu: "☰", edit: "✎", check: "✓", warn: "!", spark: "✧", moon: "☾"
  };

  function settings() { try { return App.Store.getSettings(); } catch (e) { return {}; } }

  function injectStyle(id, css) {
    if (styles[id]) return;
    var el = document.createElement("style");
    el.id = "style-" + id;
    el.textContent = css;
    document.head.appendChild(el);
    styles[id] = true;
  }

  function toast(msg, opts) {
    opts = opts || {};
    toastQueue.push({ msg: msg, kind: opts.kind || "default", dur: opts.dur || 1900 });
    if (toastQueue.length > 3) toastQueue.shift();
    if (!toastBusy) nextToast();
  }

  function nextToast() {
    var t = toastQueue.shift();
    if (!t) { toastBusy = false; return; }
    toastBusy = true;
    var host = document.getElementById("toasts");
    var el = document.createElement("div");
    el.className = "toast " + t.kind;
    el.textContent = t.msg;
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("on"); });
    setTimeout(function () {
      el.classList.remove("on");
      setTimeout(function () { el.remove(); nextToast(); }, 260);
    }, t.dur);
  }

  var userTapped = false;
  try {
    document.addEventListener("pointerdown", function () { userTapped = true; }, true);
  } catch (e) {}

  function vibrate(pattern) {
    if (!userTapped) return;   /* Chrome 会在无用户手势时拒绝 vibrate 并打 console error */
    var s = settings();
    if (s.haptics === false) return;
    try { if (navigator.vibrate) navigator.vibrate(pattern || 12); } catch (e) {}
  }

  function haptic(kind) {
    if (kind === "success") vibrate([14, 30, 18]);
    else if (kind === "warn") vibrate([24, 40, 24]);
    else if (kind === "heavy") vibrate(38);
    else vibrate(10);
  }

  function sheet(opts) {
    opts = opts || {};
    var overlay = document.getElementById("overlay");
    var mask = document.createElement("div");
    mask.className = "sheet-mask";
    var panel = document.createElement("div");
    panel.className = "sheet " + (opts.cls || "");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    if (opts.label) panel.setAttribute("aria-label", opts.label);
    var head = "";
    if (opts.title) {
      head += '<div class="sheet-head"><div class="sheet-title">' + U.escape(opts.title) + "</div>" +
        (opts.subtitle ? '<div class="sheet-sub">' + U.escape(opts.subtitle) + "</div>" : "") +
        (opts.dismissible === false ? "" : '<button class="icon-btn sheet-x" data-close aria-label="关闭">' + ICONS.close + "</button>") +
        "</div>";
    }
    panel.innerHTML = head + '<div class="sheet-body">' + (opts.html || "") + "</div>";
    mask.appendChild(panel);
    overlay.appendChild(mask);
    requestAnimationFrame(function () {
      mask.classList.add("on");
      panel.classList.add("on");
    });
    var closed = false;
    function close(val) {
      if (closed) return;
      closed = true;
      mask.classList.remove("on");
      panel.classList.remove("on");
      setTimeout(function () { mask.remove(); }, 320);
      if (opts.onClose) opts.onClose(val);
    }
    if (opts.dismissible !== false) {
      mask.addEventListener("click", function (e) { if (e.target === mask) close(); });
      panel.addEventListener("click", function (e) {
        var t = e.target.closest("[data-close]");
        if (t) close();
      });
    }
    if (opts.onMount) opts.onMount(panel, close);
    return { close: close, panel: panel, mask: mask };
  }

  function confirm(opts) {
    opts = typeof opts === "string" ? { text: opts } : (opts || {});
    return new Promise(function (resolve) {
      var answered = false;
      var s = sheet({
        title: opts.title || "确认",
        html: '<p class="sheet-text">' + U.escape(opts.text || "") + "</p>" +
          '<div class="sheet-actions">' +
          '<button class="btn ghost" data-no>' + U.escape(opts.cancel || "取消") + "</button>" +
          '<button class="btn primary" data-yes>' + U.escape(opts.ok || "确定") + "</button></div>",
        dismissible: true,
        onClose: function () { if (!answered) { answered = true; resolve(false); } },
        onMount: function (panel) {
          panel.querySelector("[data-no]").addEventListener("click", function () { answered = true; s.close(); resolve(false); });
          panel.querySelector("[data-yes]").addEventListener("click", function () { answered = true; s.close(); resolve(true); });
        }
      });
    });
  }

  function resRow(res, opts) {
    opts = opts || {};
    var keys = opts.keys || ["heart", "tension", "sync", "coins"];
    return keys.map(function (k) {
      var meta = RES[k];
      return '<span class="res ' + meta.cls + '" title="' + meta.label + '"><i>' + meta.icon + "</i>" +
        '<b data-res="' + k + '">' + U.round(res[k] || 0) + "</b></span>";
    }).join("");
  }

  function stars(n, max) {
    max = max || 5;
    var out = "";
    for (var i = 1; i <= max; i++) out += i <= n ? ICONS.star : ICONS.starEmpty;
    return out;
  }

  function syncSettings() {
    var s = settings();
    App.Audio.setEnabled(s.sound !== false);
    M.syncBodyClass();
  }

  function autoGrow() {}

  App.UI = {
    RES: RES,
    ICONS: ICONS,
    injectStyle: injectStyle,
    toast: toast,
    sheet: sheet,
    confirm: confirm,
    vibrate: vibrate,
    haptic: haptic,
    resRow: resRow,
    stars: stars,
    icon: function (name) { return ICONS[name] || ""; },
    resMeta: function (k) { return RES[k] || { icon: "", label: k, cls: "" }; },
    syncSettings: syncSettings,
    overlay: function () { return document.getElementById("overlay"); },
    screenRoot: function () { return document.getElementById("screen"); },
    autoGrow: autoGrow
  };
})();
