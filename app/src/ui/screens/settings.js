/* ===== V6 ui/screens/settings.js：设置 =====
   口径：spec G4（声音/震动/减少动画 · 尺度与边界「下次开局生效」· 数据导出/导入/清除 · 版本号）
   文案：copy.md §0.4 / §7.3。 */
(function () {
  var App = window.App;
  var U = App.util;

  var SCALES = [
    { id: "gentle", name: "温柔" },
    { id: "warm", name: "暧昧" },
    { id: "hot", name: "热烈" },
    { id: "open", name: "不设限" }
  ];
  var CHIPS = ["束缚", "露出", "道具", "喝酒", "蒙眼", "角色"];
  /* V8：3D 主桌三档。auto=能跑 WebGL2 就用（减少动画时静态 3D）；off=始终 V7；on=强制尝试，失败自动回 V7。
     默认 auto；只改「主桌画面」，规则/题卡/尺度/边界/存档一概不变。 */
  var BOARD3D = [
    { id: "auto", name: "自动", hint: "能跑 WebGL2 就用 3D；开了「减少动画」则是静态 3D" },
    { id: "off", name: "V7", hint: "始终用原来的 V7 主桌" },
    { id: "on", name: "3D", hint: "强制尝试 3D；开不了会自动回 V7" }
  ];
  var BOARD3D_DEFAULT = "auto";      /* V8：与 table.js 一致，默认 auto */
  function board3dOf(s) {
    var v = s && s.board3d;
    return (v === "off" || v === "on" || v === "auto") ? v : BOARD3D_DEFAULT;
  }

  /* V8.2：设备自检（只读）。口径同 table.js：WebGL2 是硬条件；auto/on/off 三档；减少动画只影响镜头。
     不写 settings、不触发挂载。上次 mount 按 __V6_TEST__.board3d() → .v6-table[data-board3d] → __BOARD3D_LAST__ 读。 */
  var WEBGL2 = null;
  function webgl2Ok() {
    if (WEBGL2 === null) {
      try {
        var gl = window.WebGL2RenderingContext ? document.createElement("canvas").getContext("webgl2") : null;
        WEBGL2 = !!gl;
        try { var l = gl && gl.getExtension("WEBGL_lose_context"); if (l) l.loseContext(); } catch (e) {}
      } catch (e) { WEBGL2 = false; }
    }
    return WEBGL2;
  }
  function sysReduced() {
    try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
    catch (e) { return false; }
  }
  function lastMount() {
    var st = null, attr = null, reason = "", last = null;
    try { if (window.__V6_TEST__ && window.__V6_TEST__.board3d) st = window.__V6_TEST__.board3d(); } catch (e) {}
    try {
      var el = document.querySelector(".v6-table[data-board3d]");
      if (el) { attr = el.getAttribute("data-board3d"); reason = el.getAttribute("data-board3d-reason") || ""; }
    } catch (e) {}
    try { last = window.__BOARD3D_LAST__; } catch (e) {}
    if (st && st.mode) return st.ready ? { s: "on", r: "" } : (st.pending ? { s: "pending", r: "" } : { s: "v7", r: st.reason || reason });
    if (attr) return { s: attr, r: reason };
    if (last) return { s: last.s || "idle", r: last.r || "" };
    return { s: "idle", r: "" };
  }
  /* 只给「回落类」原因一句短语；off / no-webgl2 已经写在主文案里 */
  function reasonWord(r) {
    return r === "chunk" ? "3D 资源没拿到" : r === "api" ? "3D 模块没接上" : "3D 没起来";
  }
  function board3dStatus(s, mode) {
    var gl = webgl2Ok(), red = !!s.reduced || sysReduced(), m = lastMount();
    var mw = mode === "off" ? "已关（用 V7）" : (mode === "on" ? "强制 3D" : "自动");
    var main = !gl ? "当前浏览器未开启 WebGL2，会使用 V7"
      : mode === "off" ? "当前设备：3D 可用 · 已关（用 V7）"
      : m.s === "on" ? "当前设备：3D 可用 · " + (mode === "on" ? "强制 3D" : "自动") + "（正在用 3D）"
      : "当前设备：3D 可用 · " + mw;
    var last = m.s === "on" ? "用上了 3D" : m.s === "pending" ? "3D 还在载入"
      : m.s === "v7" ? "用了 V7" + (m.r && m.r !== "off" && m.r !== "no-webgl2" ? "（" + reasonWord(m.r) + "）" : "")
      : "还没进过主桌";
    return {
      text: main + " · WebGL2 " + (gl ? "可用" : "不可用") + " · 减少动画：" + (red ? "开（静态）" : "关") +
        " · 上次进主桌：" + last,
      gl: gl, red: red, mode: mode, mount: m.s, reason: m.r
    };
  }

  function sw(key, label, hint, on) {
    return '<div class="switch"><span class="lb">' + U.escape(label) +
      (hint ? "<em>" + U.escape(hint) + "</em>" : "") + "</span>" +
      '<button class="toggle' + (on ? " on" : "") + '" data-toggle="' + key + '" data-test="toggle-' + key + '" type="button" aria-pressed="' + (on ? "true" : "false") + '">' +
      (on ? "开" : "关") + "</button></div>";
  }

  App.Screens = App.Screens || {};
  App.Screens.settings = {
    mount: function (root) {
      /* V7：设置页也一样用当前主题（直接进来时也能套上；apply 幂等且不写盘） */
      try { if (App.Themes && App.Themes.apply) App.Themes.apply(root); } catch (e) {}
      function paint() {
        var s = App.Store.getSettings();
        var hist = 0;
        try { hist = App.Store.getHistory().length; } catch (e) {}
        var scale = s.scale || "warm";
        var bounds = (s.blacklist || []).slice();
        var theme = (App.Themes && App.Themes.get) ? App.Themes.get() : { id: "cloud", name: "云海机舱", desc: "" };
        var themeList = (App.Themes && App.Themes.list && App.Themes.list.length) ? App.Themes.list : [
          { id: "cloud", name: "云海机舱" }, { id: "star", name: "星轨夜航" }, { id: "paper", name: "纸雕童话" }
        ];
        var themeChips = themeList.map(function (t) {
          return '<button class="chip' + (t.id === theme.id ? " on" : "") + '" data-theme-pick="' + U.escape(t.id) + '" data-test="settings-theme-' + U.escape(t.id) + '" type="button">' + U.escape(t.name) + "</button>";
        }).join("");
        var scaleChips = SCALES.map(function (sc) {
          return '<button class="chip' + (sc.id === scale ? " on" : "") + '" data-scale="' + sc.id + '" data-test="settings-scale-' + sc.id + '" type="button">' + sc.name + "</button>";
        }).join("");
        var boundChips = CHIPS.concat(bounds.filter(function (b) { return CHIPS.indexOf(b) < 0; })).map(function (b, i) {
          var on = bounds.indexOf(b) >= 0;
          return '<button class="chip' + (on ? " on" : "") + '" data-bound="' + U.escape(b) + '" data-test="settings-bound-' + i + '" type="button">' + U.escape(b) + "</button>";
        }).join("");
        var b3 = board3dOf(s);
        var b3Chips = BOARD3D.map(function (m) {
          var on = m.id === b3;
          return '<button class="chip' + (on ? " on" : "") + '" data-board3d="' + m.id + '" data-test="settings-board3d-' + m.id + '" aria-pressed="' + (on ? "true" : "false") + '" type="button">' + m.name + "</button>";
        }).join("");
        var b3Note = (BOARD3D.filter(function (m) { return m.id === b3; })[0] || BOARD3D[0]).hint +
          "。3D 只换主桌画面，题目、规则、边界都不变。";
        var b3st = board3dStatus(s, b3);   /* V8.2：设备自检（只读） */

        root.innerHTML =
          '<div class="page" data-test="settings">' +
            App.UI.topbar("设置") +
            '<div class="set-group"><div class="glabel">今晚的手感</div>' +
              '<div class="glass set-card" data-test="settings-toggles">' +
                sw("sound", "声音", "关掉后所有提示都不响", s.sound !== false) +
                sw("haptics", "震动", "轻按时给一点反馈", s.haptics !== false) +
                sw("reduced", "减少动画", "关键反馈还在，动画更短", !!s.reduced) +
              "</div>" +
            "</div>" +
            '<div class="set-group"><div class="glabel">今晚的桌面</div>' +
              '<div class="glass set-card" style="padding:12px 14px 14px">' +
                '<div class="small dim">换桌面改的是画面：背景、棋盘外圈、格位光晕、粒子、小熊的衣服。</div>' +
                '<div class="chips mt-8" data-test="settings-themes">' + themeChips + "</div>" +
                /* V8：3D 主桌（Beta）—— 只换主桌画面；进主桌时按开关/能力决定，失败自动回 V7 */
                '<div style="padding:12px 0 2px;margin-top:12px;border-top:1px solid var(--line)" data-test="settings-board3d-wrap">' +
                  '<div class="small">3D 主桌 · <b class="gold">设备自检</b><b class="gold"> · 下次进主桌生效</b></div>' +
                  '<div class="chips mt-8" data-test="settings-board3d">' + b3Chips + "</div>" +
                  /* V8.2：设备自检（能不能跑 3D / 为什么这次没进 3D），一行读完 */
                  '<div class="small mt-8" data-test="settings-board3d-status"' +
                    ' data-webgl2="' + (b3st.gl ? "1" : "0") + '" data-reduced="' + (b3st.red ? "1" : "0") + '"' +
                    ' data-board3d-set="' + b3 + '" data-board3d-mount="' + b3st.mount + '"' +
                    (b3st.reason ? ' data-board3d-reason="' + U.escape(b3st.reason) + '"' : "") + ">" +
                    U.escape(b3st.text) + "</div>" +
                  '<div class="small dim mt-8" data-test="settings-board3d-desc">' + U.escape(b3Note) + "</div>" +
                  '<div class="small dim mt-8" data-test="settings-board3d-beta">默认「自动」：设备能跑 WebGL2 就用 3D，跑不动或没开启就自动回 V7；想固定一种画面可以手动切。</div>' +
                "</div>" +
              "</div>" +
              '<div class="set-note" data-test="settings-theme-desc">' + U.escape(theme.name + (theme.desc ? " · " + theme.desc : "")) + " 题目、规则、你们的边界都不变。</div>" +
            "</div>" +
            '<div class="set-group"><div class="glabel">尺度与边界</div>' +
              '<div class="glass set-card">' +
                '<div style="padding:12px 0 4px">' +
                  '<div class="small dim">灯拨到哪一档 · <b class="gold">下次开局生效</b></div>' +
                  '<div class="chips mt-8" data-test="settings-scales">' + scaleChips + "</div>" +
                "</div>" +
                '<div style="padding:10px 0 14px;border-top:1px solid var(--line)">' +
                  '<div class="small dim">今晚不做的 · 开局与暂停里都能改</div>' +
                  '<div class="chips mt-8" data-test="settings-bounds">' + boundChips + "</div>" +
                  '<div class="bound-row">' +
                    '<input class="field" data-test="settings-bound-custom" maxlength="40" placeholder="再写一条：一个词、一句话，或一个不想被问的方向" autocomplete="off" />' +
                    '<button class="btn soft sm" data-act="bound-add" data-test="settings-bound-add" type="button">加上</button>' +
                  "</div>" +
                "</div>" +
              "</div>" +
              '<div class="set-note">尺度和边界改的是「下一局」；这一局怎么走完，还是按开局时定下的来。</div>' +
            "</div>" +
            '<div class="set-group"><div class="glabel">数据</div>' +
              '<div class="actions">' +
                '<button class="btn soft wide" data-act="install" data-test="pwa" type="button">装到主屏幕</button>' +
                '<button class="btn soft wide" data-act="export" data-test="export" type="button">导出以前的夜（' + hist + " 条）</button>" +
                '<label class="btn ghost wide" data-test="import" style="position:relative">导入' +
                  '<input type="file" accept="application/json" data-file hidden style="position:absolute;inset:0;opacity:0" /></label>' +
                '<button class="btn ghost wide" data-act="clear" data-test="clear" type="button">清除这台手机上的棋</button>' +
              "</div>" +
              '<div class="set-note">数据只在这台手机里，不上传。导出的 JSON 可以自己留着。</div>' +
            "</div>" +
            '<div class="set-group"><div class="glabel">关于</div>' +
              '<div class="glass set-card">' +
                '<div class="switch"><span class="lb">玩法速览<em>六条规则，随时再看</em></span>' +
                  '<button class="btn soft sm" data-act="rules" data-test="rules-open" type="button">翻开</button></div>' +
                '<div class="switch"><span class="lb">版本<em>今晚飞行棋 V6</em></span>' +
                  '<span class="small dim" data-test="version">' + U.escape(App.version || "6.0.0") + "</span></div>" +
              "</div>" +
            "</div>" +
            '<div class="ver-line">今晚飞行棋 V6 · 午夜星轨 · 暖光纸感<br>这一页只在本机生效</div>' +
          "</div>";
      }

      /* 事件只绑一次（root 常驻，delegate 对新 DOM 生效） */
      U.delegate(root, "[data-toggle]", "click", function (e, el) {
        var key = el.getAttribute("data-toggle");
        var cur = App.Store.getSettings();
        var patch = {};
        patch[key] = !cur[key];
        App.Store.saveSettings(patch);
        App.UI.syncSettings();
        App.UI.haptic("select");
        paint();
        App.UI.toast(key === "reduced" ? (patch[key] ? "动画更短了" : "动画回来了") : (patch[key] ? "打开了" : "关掉了"), { dur: 1300 });
      });
      U.delegate(root, "[data-scale]", "click", function (e, el) {
        App.Store.saveSettings({ scale: el.getAttribute("data-scale") });
        App.UI.haptic("select");
        paint();
      });
      /* V7（impl-freeze §2.1）：今晚的桌面 —— 立即换、立即落盘，回门厅/开局都还是这个桌面 */
      U.delegate(root, "[data-theme-pick]", "click", function (e, el) {
        var id = el.getAttribute("data-theme-pick");
        if (!id) return;
        try {
          if (App.Themes && App.Themes.set) App.Themes.set(id, root);
          else App.Store.saveSettings({ theme: id });
        } catch (err) {
          try { App.Store.saveSettings({ theme: id }); } catch (e2) {}
        }
        App.UI.haptic("select");
        paint();
        App.UI.toast("桌面换了", { dur: 1200 });
      });
      /* V8：3D 主桌（Beta）三档 —— 立即落盘，下次进主桌生效；只换主桌画面，不动棋局 */
      U.delegate(root, "[data-board3d]", "click", function (e, el) {
        var id = el.getAttribute("data-board3d");
        if (id !== "auto" && id !== "off" && id !== "on") return;
        App.Store.saveSettings({ board3d: id });
        App.UI.haptic("select");
        paint();
        App.UI.toast(id === "off" ? "主桌用 V7" : (id === "on" ? "主桌试试 3D" : "主桌自动选"), { dur: 1300 });
      });
      U.delegate(root, "[data-bound]", "click", function (e, el) {
        var name = el.getAttribute("data-bound");
        var bounds = (App.Store.getSettings().blacklist || []).slice();
        var i = bounds.indexOf(name);
        if (i >= 0) bounds.splice(i, 1); else bounds.push(name);
        App.Store.saveSettings({ blacklist: bounds });
        paint();
      });
      U.delegate(root, "[data-act=bound-add]", "click", function () {
        var input = root.querySelector("[data-test=settings-bound-custom]");
        var text = input ? String(input.value || "").trim() : "";
        if (!text) { if (input) input.classList.add("err"); return; }
        var bounds = (App.Store.getSettings().blacklist || []).slice();
        if (bounds.indexOf(text) < 0) bounds.push(text);
        App.Store.saveSettings({ blacklist: bounds });
        App.UI.toast("加上了，从下一张起生效");
        paint();
      });
      U.delegate(root, "[data-go]", "click", function () { App.Router.back(); });
      U.delegate(root, "[data-act=rules]", "click", function () { App.UI.rulesSheet(); });
      U.delegate(root, "[data-act=install]", "click", function () {
        if (App.PWA && App.PWA.showInstall) App.PWA.showInstall();
      });
      U.delegate(root, "[data-act=export]", "click", function () {
        var blob = new Blob([JSON.stringify(App.Store.exportAll(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "tonight-flight.json";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        App.UI.toast("导出了，在这台手机上");
      });
      U.delegate(root, "[data-act=clear]", "click", function () {
        App.UI.confirm({ title: "清除", text: "这台手机上的棋局和以前的夜会清掉。已经导出的文件还在。", ok: "清除" }).then(function (yes) {
          if (!yes) return;
          App.Store.resetAll();
          App.UI.syncSettings();
          App.UI.toast("清掉了");
          paint();
        });
      });
      root.addEventListener("change", function (e) {
        var input = e.target.closest ? e.target.closest("[data-file]") : null;
        if (!input || !input.files || !input.files[0]) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var res = App.Store.importAll(JSON.parse(String(reader.result || "")));
            App.UI.toast(res.ok ? "已恢复" : (res.msg || "文件读不出来"), { kind: res.ok ? "gold" : "rose" });
          } catch (err) { App.UI.toast("文件读不出来", { kind: "rose" }); }
          paint();
        };
        reader.readAsText(input.files[0]);
      });

      paint();
    }
  };
})();
