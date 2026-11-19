/* ===== V6 ui/screens/boot.js：门厅（视觉 A · 午夜星轨 / 暖光纸感）=====
   文案口径：docs/v6/copy.md §1；交互口径：spec §4 A1–A6；视觉基准：mocks/a/boot.png。
   360×640 首屏：主按钮「摆上棋盘」（sticky 底部）始终完整在视口内。 */
(function () {
  var App = window.App;
  var U = App.util;

  var COLORS = [
    { id: "red", name: "红" },
    { id: "yellow", name: "黄" },
    { id: "blue", name: "蓝" },
    { id: "green", name: "绿" }
  ];
  /* V6.1（impl-freeze-v6.1 §3.1）：结束条件改为「一方把本局全部飞机送进终点」，不再按题卡数/心动值结束。
     模式卡因此只讲「先送完几架 · 多久 · 每人几架」，不再显示「目标 4/8 张题卡」。
     cards/heat 仅保留为数据兼容（开局仍可传给引擎，引擎已不再据此判定结束），UI 不引用。 */
  var MODES = [
    { id: "quick", name: "快局", cards: 4, heat: 40, planes: 2, line: "先送完 2 架飞机 · 约 15–25 分钟 · 每人 2 架" },
    { id: "long", name: "长夜", cards: 8, heat: 80, planes: 4, line: "先送完 4 架飞机 · 约 30–50 分钟 · 每人 4 架" }
  ];
  var SCALES = [
    { id: "gentle", name: "温柔", star: "★1", desc: "灯只留一盏，慢一点。" },
    { id: "warm", name: "暧昧", star: "★1–2", desc: "可以靠近一点，话可以停在嘴边。" },
    { id: "hot", name: "热烈", star: "★1–3", desc: "不绕弯，想说的直接说。" },
    { id: "open", name: "不设限", star: "★1–4", desc: "边界你们自己画，线以内交给今晚。" }
  ];
  var CHIPS = ["束缚", "露出", "道具", "喝酒", "蒙眼", "角色"];
  var MAX_NAME = 12;
  /* V7（impl-freeze §2.1）：门厅「今晚的桌面」三选一。主题表以 App.Themes 为准；
     App.Themes 缺失时用这份兜底，保证门厅不白屏。 */
  var THEME_FALLBACK = [
    { id: "cloud", name: "云海机舱", hint: "云海 · 暖灯", desc: "舷窗外是一片云海，桌板上亮着一盏阅读灯。", swatch: "linear-gradient(135deg,#0C1E2E 0%,#2E6A8C 44%,#8FC7E8 68%,#F2C98A 100%)" },
    { id: "star", name: "星轨夜航", hint: "星空 · 流星", desc: "深紫夜空，星图环和流星就在舷窗外。", swatch: "linear-gradient(135deg,#08060F 0%,#241540 44%,#8E7BD8 68%,#F3C077 100%)" },
    { id: "paper", name: "纸雕童话", hint: "纸页 · 台灯", desc: "纸片一层层叠起来，像一本会飞的书。", swatch: "linear-gradient(135deg,#140F0B 0%,#33241A 44%,#D8A46A 70%,#FBF3E4 100%)" }
  ];
  function themeList() {
    try {
      if (App.Themes && App.Themes.list && App.Themes.list.length) return App.Themes.list;
    } catch (e) {}
    return THEME_FALLBACK;
  }
  function currentThemeId() {
    try {
      if (App.Themes && App.Themes.get) return App.Themes.get().id;
    } catch (e) {}
    var s = App.Store.getSettings();
    return s && (s.theme === "star" || s.theme === "paper") ? s.theme : "cloud";
  }
  function themeMeta(id) {
    var list = themeList();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  }

  function modeById(id) {
    for (var i = 0; i < MODES.length; i++) if (MODES[i].id === id) return MODES[i];
    return MODES[0];
  }
  function scaleById(id) {
    for (var i = 0; i < SCALES.length; i++) if (SCALES[i].id === id) return SCALES[i];
    return SCALES[1];
  }
  function freeColor(taken) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id !== taken) return COLORS[i].id;
    return taken === "red" ? "yellow" : "red";
  }
  function flightHistory() {
    try { return App.Store.getHistory().filter(function (x) { return x && x.kind === "flight"; }); } catch (e) { return []; }
  }

  App.Screens = App.Screens || {};
  App.Screens.boot = {
    enterless: true, /* 门厅不做位移入场：保证首屏按钮 rect 在动画期间也稳定 */
    mount: function (root, params) {
      params = params || {};
      var settings = App.Store.getSettings();
      var hasSession = App.Store.hasSession();
      if (params.resumeFlight && hasSession) { App.Router.reset("table"); return; }

      var history = flightHistory();
      var lastNight = history.length ? history[0] : null;
      var picked = {
        a: (settings.colors && settings.colors.a) || "red",
        b: (settings.colors && settings.colors.b) || "yellow"
      };
      if (picked.a === picked.b) picked.b = freeColor(picked.a);
      var scale = settings.scale || "warm";
      var themeId = currentThemeId();
      var mode = modeById(settings.mode || (settings.lastPlaneCount === 4 ? "long" : "quick"));
      var boundaries = (settings.blacklist || []).slice();
      var names = {
        a: String((settings.names && settings.names.a) || "").trim(),
        b: String((settings.names && settings.names.b) || "").trim()
      };
      var unsubRules = null;

      function nightNo() { return history.length + 1; }

      function colorSwatches(pid) {
        return COLORS.map(function (c) {
          var on = picked[pid] === c.id;
          return '<button type="button" class="swatch ' + c.id + (on ? " on" : "") + '" ' +
            'data-color="' + pid + ":" + c.id + '" data-test="color-' + pid + "-" + c.id + '" ' +
            'aria-label="' + (pid === "a" ? "第一位" : "第二位") + "的飞机换成" + c.name + '色" ' +
            'aria-pressed="' + (on ? "true" : "false") + '"></button>';
        }).join("");
      }

      function chip(name, idx) {
        var on = boundaries.indexOf(name) >= 0;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" data-bound="' + U.escape(name) + '" data-test="bound-' + idx + '">' + U.escape(name) + "</button>";
      }

      function modeCard(m) {
        var on = mode.id === m.id;
        return '<button type="button" class="mode-card' + (on ? " on" : "") + '" data-mode="' + m.id + '" data-test="mode-' + m.id + '" aria-pressed="' + (on ? "true" : "false") + '">' +
          (on ? '<span class="on-tag">今晚选这个</span>' : "") +
          "<b>" + m.name + "</b><span>" + m.line + "</span></button>";
      }

      function scaleCard(s) {
        var on = scale === s.id;
        return '<button type="button" class="scale-card' + (on ? " on" : "") + '" data-scale="' + s.id + '" data-test="scale-' + s.id + '" aria-pressed="' + (on ? "true" : "false") + '">' +
          "<b>" + s.name + '</b><em>可抽 ' + s.star + "</em><span>" + s.desc + "</span></button>";
      }

      /* V7：今晚的桌面（三选一）。样式随 ui/themes.js 注入（.v7-theme-*），base.css 不动。 */
      function themeCard(t) {
        var on = themeId === t.id;
        return '<button type="button" class="v7-theme-card v9t' + (on ? " on" : "") + '" data-theme-pick="' + U.escape(t.id) + '" data-test="theme-' + U.escape(t.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' +
          '<span class="v7-tv" aria-hidden="true" style="background:' + U.escape(t.swatch || "") + '"></span>' +
          "<b>" + U.escape(t.name) + "</b>" +
          "<em>" + U.escape(t.hint || "") + "</em></button>";
      }

      var metaPills = "";
      if (lastNight) {
        var ld = new Date(lastNight.ts || Date.now());
        metaPills += '<span class="pill" data-test="last-night"><i aria-hidden="true"></i>上次 · ' + (ld.getMonth() + 1) + " 月 " + ld.getDate() + " 日</span>";
      }
      metaPills += '<span class="pill rose"><i aria-hidden="true"></i>第 ' + nightNo() + " 夜</span>";

      root.innerHTML =
        '<div class="page boot" data-test="boot">' +
          '<div class="kicker"><span class="spark"></span><span>TONIGHT</span><span class="rule"></span></div>' +
          '<h1 class="boot-h1"><span class="l1">今晚</span><span class="l2">飞行棋</span></h1>' +
          '<p class="boot-sub">两个人，一部手机，一盘桌上的棋。<br>灯调暗一点，<b>慢慢来。</b></p>' +
          '<div class="boot-meta">' + metaPills + "</div>" +
          (hasSession
            ? '<button class="resume mt-16" data-go="resume" data-test="continue-flight" type="button">' +
              '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6.2 18 12l-9 5.8Z"/></svg></span>' +
              '<span class="tx"><b>继续今晚飞行棋</b><small>上次停下的地方还在</small></span>' +
              '<span class="arw" aria-hidden="true"></span></button>'
            : "") +
          '<div class="sect">' +
            '<div class="sect-label">今晚玩多久</div>' +
            '<div class="mode-grid" data-test="modes">' + MODES.map(modeCard).join("") + "</div>" +
            '<div class="sect-note" data-test="mode-summary">' + mode.line + "</div>" +
          "</div>" +
          '<div class="sect">' +
            '<div class="sect-label">今晚怎么称呼</div>' +
            '<div class="who-list">' +
              '<div class="who-row"><label class="nm"><small>你</small>' +
                '<input class="field" data-name="a" data-test="name-a" maxlength="' + MAX_NAME + '" placeholder="你" value="' + U.escape(names.a) + '" autocomplete="off" /></label>' +
                '<div class="swatches" data-test="colors-a">' + colorSwatches("a") + "</div></div>" +
              '<div class="who-row"><label class="nm"><small>对方</small>' +
                '<input class="field" data-name="b" data-test="name-b" maxlength="' + MAX_NAME + '" placeholder="对方" value="' + U.escape(names.b) + '" autocomplete="off" /></label>' +
                '<div class="swatches" data-test="colors-b">' + colorSwatches("b") + "</div></div>" +
            "</div>" +
            '<div class="inline-err" data-test="boot-error" aria-live="polite"></div>' +
          "</div>" +
          '<div class="sect">' +
            '<div class="sect-label">灯拨到哪一档</div>' +
            '<div class="scale-grid" data-test="scales">' + SCALES.map(scaleCard).join("") + "</div>" +
            '<div class="sect-note" data-test="scale-desc">四档只决定题卡尺度的上限，不预告题目。</div>' +
          "</div>" +
          '<div class="sect">' +
            '<div class="sect-label">今晚不做的</div>' +
            '<div class="sect-note">写在这儿的，整晚都不会出现。划掉就作数。</div>' +
            '<div class="chips mt-10" data-test="bounds">' + CHIPS.map(chip).join("") + "</div>" +
            '<div class="bound-row">' +
              '<input class="field" data-test="bound-custom" maxlength="40" placeholder="再写一条：一个词、一句话，或一个不想被问的方向" autocomplete="off" />' +
              '<button class="btn soft sm" data-act="add-bound" data-test="bound-add" type="button">加上</button>' +
            "</div>" +
          "</div>" +
          /* V7（impl-freeze §2.1）：今晚的桌面 —— 放在摆上棋盘之前，是开局前最后一个视觉选择；
             不塞进「名字/尺度」之间，360×640 首屏的原有顺序（玩法→称呼→灯档）保持不变。 */
          '<div class="sect">' +
            '<div class="sect-label">今晚的桌面</div>' +
            '<div class="v7-theme-grid" data-test="themes">' + themeList().map(themeCard).join("") + "</div>" +
            '<div class="sect-note" data-test="theme-desc">' + U.escape(themeDesc()) + "</div>" +
          "</div>" +
          '<div class="boot-links">' +
            '<button class="lbtn" data-go="rules" data-test="rules-open" type="button">规则速览</button><span class="dot"></span>' +
            '<button class="lbtn" data-go="nights" data-test="go-nights" type="button">以前的夜</button><span class="dot"></span>' +
            '<button class="lbtn" data-go="minigame" data-test="go-minigames" type="button">小游戏</button><span class="dot"></span>' +
            '<button class="lbtn" data-go="settings" data-test="go-settings" type="button">设置</button>' +
          "</div>" +
          '<div class="tiny dim center mt-12">长按「先收棋」可以随时停。做过的都留着。</div>' +
          '<div class="boot-cta">' +
            '<button class="btn primary wide lg" data-go="start" data-test="start" aria-label="开始" type="button">摆上棋盘<span class="arw" aria-hidden="true"></span></button>' +
            '<div class="cta-hint">掷骰 · 走格 · 翻开一张题卡</div>' +
          "</div>" +
        "</div>";

      var errEl = root.querySelector("[data-test=boot-error]");
      var scaleDesc = root.querySelector("[data-test=scale-desc]");

      function clearErrors() {
        errEl.textContent = "";
        U.qsa(".field", root).forEach(function (f) { f.classList.remove("err"); f.removeAttribute("aria-invalid"); });
      }
      function showError(msg, field) {
        errEl.textContent = msg;
        if (field) {
          field.classList.add("err");
          field.setAttribute("aria-invalid", "true");
          try { field.focus({ preventScroll: true }); } catch (e) {}
        }
        App.UI.toast(msg, { kind: "rose" });
      }
      function paintMode() {
        U.qsa("[data-mode]", root).forEach(function (el) {
          var on = el.getAttribute("data-mode") === mode.id;
          el.classList.toggle("on", on);
          el.setAttribute("aria-pressed", on ? "true" : "false");
          var tag = el.querySelector(".on-tag");
          if (on && !tag) {
            tag = document.createElement("span");
            tag.className = "on-tag";
            tag.textContent = "今晚选这个";
            el.appendChild(tag);
          } else if (!on && tag) tag.parentNode.removeChild(tag);
        });
        var sum = root.querySelector("[data-test=mode-summary]");
        if (sum) sum.textContent = mode.line;
      }
      function paintColors() {
        U.qsa("[data-color]", root).forEach(function (el) {
          var parts = el.getAttribute("data-color").split(":");
          var on = picked[parts[0]] === parts[1];
          el.classList.toggle("on", on);
          el.setAttribute("aria-pressed", on ? "true" : "false");
        });
      }
      function paintScales() {
        U.qsa("[data-scale]", root).forEach(function (el) {
          var on = el.getAttribute("data-scale") === scale;
          el.classList.toggle("on", on);
          el.setAttribute("aria-pressed", on ? "true" : "false");
        });
        var s = scaleById(scale);
        if (scaleDesc) scaleDesc.textContent = s.name + " · 可抽 " + s.star + " 的题 · 四档只决定上限，不预告题目。";
      }
      function themeDesc() {
        var t = themeMeta(themeId);
        return t.name + "：" + (t.desc || "") + "只改画面，题目和规则不变。";
      }
      function paintTheme() {
        U.qsa("[data-theme-pick]", root).forEach(function (el) {
          var on = el.getAttribute("data-theme-pick") === themeId;
          el.classList.toggle("on", on);
          el.setAttribute("aria-pressed", on ? "true" : "false");
        });
        var d = root.querySelector("[data-test=theme-desc]");
        if (d) d.textContent = themeDesc();
      }
      function paintBounds() {
        var box = root.querySelector("[data-test=bounds]");
        if (!box) return;
        var extra = boundaries.filter(function (b) { return CHIPS.indexOf(b) < 0; });
        box.innerHTML = CHIPS.concat(extra).map(function (name, i) {
          var on = boundaries.indexOf(name) >= 0;
          return '<button type="button" class="chip' + (on ? " on" : "") + '" data-bound="' + U.escape(name) + '" data-test="bound-' + i + '">' + U.escape(name) + "</button>";
        }).join("");
      }

      U.delegate(root, "[data-mode]", "click", function (e, el) {
        mode = modeById(el.getAttribute("data-mode"));
        if (App.Audio) App.Audio.play("select");
        paintMode();
      });
      U.delegate(root, "[data-color]", "click", function (e, el) {
        var parts = el.getAttribute("data-color").split(":");
        var pid = parts[0], cid = parts[1];
        if (picked[pid === "a" ? "b" : "a"] === cid) {
          picked[pid === "a" ? "b" : "a"] = freeColor(cid);
          if (errEl && !errEl.textContent) {
            errEl.textContent = "两个人的飞机不能同色";
            setTimeout(function () { if (errEl.textContent === "两个人的飞机不能同色") errEl.textContent = ""; }, 2200);
          }
        }
        picked[pid] = cid;
        if (App.Audio) App.Audio.play("select");
        paintColors();
      });
      U.delegate(root, "[data-scale]", "click", function (e, el) {
        scale = el.getAttribute("data-scale");
        /* AC-A4-3：尺度选择立即落盘，刷新后仍选中上次档位（下次开局也用它） */
        App.Store.saveSettings({ scale: scale });
        if (App.Audio) App.Audio.play("select");
        paintScales();
      });
      /* V7（impl-freeze §2.1）：今晚的桌面 —— 点一下立即换、立即落盘，刷新记住。
         主题只改视觉，不动棋盘拓扑与题卡；开局仍走原来的 start()。 */
      U.delegate(root, "[data-theme-pick]", "click", function (e, el) {
        var id = el.getAttribute("data-theme-pick");
        if (!id || id === themeId) return;
        themeId = id;
        try {
          if (App.Themes && App.Themes.set) App.Themes.set(themeId, root);
          else App.Store.saveSettings({ theme: themeId });
        } catch (err) {
          try { App.Store.saveSettings({ theme: themeId }); } catch (e2) {}
        }
        if (App.Audio) App.Audio.play("select");
        paintTheme();
        App.UI.haptic("select");
      });
      U.delegate(root, "[data-bound]", "click", function (e, el) {
        var name = el.getAttribute("data-bound");
        var i = boundaries.indexOf(name);
        if (i >= 0) boundaries.splice(i, 1); else {
          if (boundaries.length >= 20) { App.UI.toast("边界已经够多了"); return; }
          boundaries.push(name);
        }
        if (App.Audio) App.Audio.play("tick");
        paintBounds();
        if (i >= 0) App.UI.toast("划掉了");
        else App.UI.toast("加上了，从下一张起生效");
      });
      function addCustom() {
        var input = root.querySelector("[data-test=bound-custom]");
        var text = input ? String(input.value || "").trim() : "";
        if (!text) { if (input) input.classList.add("err"); return; }
        input.classList.remove("err");
        if (boundaries.indexOf(text) >= 0) { App.UI.toast("这条已经在里面了"); return; }
        if (boundaries.length >= 20) { App.UI.toast("边界已经够多了"); return; }
        boundaries.push(text);
        input.value = "";
        paintBounds();
        App.UI.toast("加上了，从下一张起生效");
      }
      U.delegate(root, "[data-act=add-bound]", "click", addCustom);
      var custom = root.querySelector("[data-test=bound-custom]");
      if (custom) custom.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); addCustom(); }
      });

      function showRules() {
        App.UI.rulesSheet();
      }
      function onRulesSeen() {
        App.Store.saveSettings({ rulesSeen: true });
      }
      unsubRules = App.Bus.on("rules-seen", onRulesSeen);

      U.delegate(root, "[data-go]", "click", function (e, el) {
        var go = el.getAttribute("data-go");
        if (go === "start") { start(); return; }
        if (go === "resume") {
          if (App.Audio) App.Audio.play("select");
          App.Router.reset("table", { resume: true });
          return;
        }
        if (go === "rules") { showRules(); return; }
        if (App.Audio) App.Audio.play("tap");
        if (go === "minigame") App.Router.go("minigame", {});
        else if (go === "nights") App.Router.go("nights", {});
        else if (go === "settings") App.Router.go("settings", {});
      });

      function start() {
        clearErrors();
        var nameA = String(root.querySelector("[data-test=name-a]").value || "").trim();
        var nameB = String(root.querySelector("[data-test=name-b]").value || "").trim();
        if (!nameA || !nameB) {
          var empty = !nameA ? root.querySelector("[data-test=name-a]") : root.querySelector("[data-test=name-b]");
          showError("先给两个人各起一个名字", empty);
          return;
        }
        if (nameA === nameB) { showError("两个名字不能一样", root.querySelector("[data-test=name-b]")); return; }
        if (picked.a === picked.b) { picked.b = freeColor(picked.a); paintColors(); }

        var made = App.Flight.newGame({
          names: { a: nameA, b: nameB },
          colors: { a: picked.a, b: picked.b },
          scale: scale,
          boundaries: boundaries.slice(),
          planeCount: mode.planes,
          mode: mode.id,
          /* V6.1：结束只看「一方全部飞机到家」；targetCards/targetHeat 仅历史兼容，引擎不再据此判定结束 */
          targetCards: mode.cards,
          targetHeat: mode.heat
        });
        if (!made || !made.ok) {
          var msg = (made && made.error && made.error.message) || "还没法开局";
          showError(msg, null);
          return;
        }
        App.Store.saveSettings({
          names: { a: nameA, b: nameB },
          colors: { a: picked.a, b: picked.b },
          scale: scale,
          mode: mode.id,
          lastPlaneCount: mode.planes,
          theme: themeId,
          blacklist: boundaries.slice()
        });
        var saved = App.Store.saveSession(made.state);
        if (!saved || saved.ok === false) { showError("这台手机没能记下这局", null); return; }
        if (App.Audio) App.Audio.play("select");
        App.UI.haptic("select");
        App.Router.reset("table", { fresh: true });
      }

      paintScales();
      paintTheme();
      /* 进门的这一刻就把上次选的桌面套上（table mount 会再 apply 一次，幂等） */
      try { if (App.Themes && App.Themes.apply) App.Themes.apply(root, themeId); } catch (e) {}
      /* 首次进入（无历史且未看过）：自动弹一次玩法速览（AC-A5） */
      var firstRun = !settings.rulesSeen && history.length === 0;
      if (firstRun) setTimeout(function () { if (App.UI && App.UI.rulesSheet) App.UI.rulesSheet(); }, 340);

      return function cleanup() {
        if (unsubRules) { unsubRules(); unsubRules = null; }
      };
    }
  };
})();
