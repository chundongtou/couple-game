/* ===== V3 ui/screens/memory.js：回忆册 · 历史夜晚列表 / 详情 / 导出 / 导入 / 清空 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;

  App.UI.injectStyle("memory", [
    ".memory { padding-top: calc(30px + var(--safe-t)); }",
    ".mem-head { margin-top: 6px; }",
    ".mem-head h1 { font-size: 30px; font-weight: 800; letter-spacing: .06em; line-height: 1.2; }",
    ".mem-head .sub { margin-top: 8px; color: var(--dim); font-size: 12.5px; line-height: 1.8; letter-spacing: .03em; }",
    ".mem-head .sub b { color: var(--gold); font-weight: 700; }",
    ".mem-tools { margin-top: 18px; display: flex; gap: 8px; }",
    ".mem-tools .btn { flex: 1; min-height: 44px; font-size: 13px; padding: 0 10px; letter-spacing: .04em; }",
    ".mem-list { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; }",
    ".mem-item { position: relative; display: flex; align-items: stretch; gap: 4px; border-radius: var(--r-md);",
    "  background: linear-gradient(150deg, rgba(255,255,255,.07), rgba(255,255,255,.025));",
    "  border: 1px solid var(--line); overflow: hidden; }",
    ".mem-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;",
    "  background: linear-gradient(180deg, var(--gold), transparent); opacity: .7; }",
    ".mem-open { flex: 1; display: block; text-align: left; padding: 14px 8px 13px 16px; color: var(--ink); min-width: 0; }",
    ".mem-open:active { background: rgba(255,255,255,.03); }",
    ".mem-r1 { display: flex; align-items: baseline; gap: 10px; justify-content: space-between; }",
    ".mem-ending { font-size: 16.5px; font-weight: 800; letter-spacing: .03em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }",
    ".mem-date { flex: 0 0 auto; font-size: 10.5px; color: var(--dim2); letter-spacing: .05em; }",
    ".mem-r2 { margin-top: 7px; display: flex; align-items: center; gap: 12px; font-size: 11px; color: var(--dim); flex-wrap: wrap; }",
    ".mem-res { display: inline-flex; align-items: center; gap: 4px; font-variant-numeric: tabular-nums; }",
    ".mem-res i { font-style: normal; font-size: 11.5px; }",
    ".mem-res.heart i { color: var(--heart); } .mem-res.tension i { color: var(--tension); } .mem-res.sync i { color: var(--sync); }",
    ".mem-res b { color: var(--ink); font-weight: 700; }",
    ".mem-dot { width: 2px; height: 2px; border-radius: 50%; background: var(--dim2); }",
    ".mem-awards { margin-top: 7px; font-size: 11px; color: var(--gold); letter-spacing: .02em; line-height: 1.6; }",
    ".mem-note { margin-top: 7px; font-size: 11px; color: var(--dim2); line-height: 1.65; overflow: hidden; text-overflow: ellipsis;",
    "  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }",
    ".mem-note.empty { color: var(--dim2); opacity: .55; font-style: normal; }",
    ".mem-del { flex: 0 0 auto; align-self: center; margin-right: 10px; width: 40px; height: 40px; font-size: 14px; color: var(--dim2); }",
    ".mem-del:hover { color: var(--danger); border-color: rgba(255,95,109,.4); }",
    ".mem-empty { margin-top: 30px; padding: 34px 22px; text-align: center; }",
    ".mem-empty .ic { font-size: 34px; opacity: .85; }",
    ".mem-empty h2 { margin-top: 14px; font-size: 18px; font-weight: 700; letter-spacing: .04em; }",
    ".mem-empty p { margin-top: 8px; color: var(--dim); font-size: 12.5px; line-height: 1.9; }",
    ".mem-detail { display: flex; flex-direction: column; gap: 12px; }",
    ".mem-detail .rows { display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: 12.5px; color: var(--dim); }",
    ".mem-detail .rows b { color: var(--ink); font-weight: 700; }",
    ".mem-detail .aw { display: flex; flex-wrap: wrap; gap: 8px; }",
    ".mem-detail .aw span { font-size: 12px; color: var(--gold); border: 1px solid rgba(243,200,121,.28);",
    "  border-radius: 999px; padding: 5px 11px; background: rgba(243,200,121,.06); }",
    ".mem-detail .nt { font-size: 12.5px; color: var(--dim); line-height: 1.8; padding: 12px 14px; border-radius: var(--r-sm);",
    "  background: rgba(255,255,255,.04); border: 1px solid var(--line); }",
    ".mem-detail .nt.empty { color: var(--dim2); opacity: .7; }",
    ".mem-foot { margin-top: 24px; text-align: center; font-size: 10.5px; color: var(--dim2); letter-spacing: .06em; line-height: 1.9; }",
    ".mem-toast-space { height: 6px; }"
  ].join("\n"));

  var current = null;

  function ymd(ts) {
    var d = new Date(ts || Date.now());
    return d.getFullYear() + "-" + U.pad2(d.getMonth() + 1) + "-" + U.pad2(d.getDate());
  }

  function downloadJSON(obj, filename) {
    try {
      var blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { a.remove(); } catch (e) {}
        try { URL.revokeObjectURL(url); } catch (e) {}
      }, 1500);
      return true;
    } catch (e) { return false; }
  }

  function fmtEntryDate(it) {
    return U.fmtDate(it.ts) + " " + U.fmtTime(it.ts);
  }

  function awardText(it) {
    var arr = it.awards instanceof Array ? it.awards : [];
    return arr.length ? "🏅 " + arr.join(" · ") : "";
  }

  function itemHtml(it) {
    var date = fmtEntryDate(it);
    var note = String(it.note || "").trim();
    var flight = it.kind === "flight-wish";
    var meta = flight
      ? '<span class="mem-res heart"><i>👑</i><b>心愿券</b></span><span class="mem-dot"></span><span>飞行棋</span>'
      : '<span class="mem-res heart"><i>♥</i><b>' + U.round(it.heart) + "</b></span>" +
        '<span class="mem-res tension"><i>✦</i><b>' + U.round(it.tension) + "</b></span>" +
        '<span class="mem-res sync"><i>⌁</i><b>' + U.round(it.sync) + "</b></span>" +
        '<span class="mem-dot"></span>' +
        "<span>" + U.round(it.rounds) + " 回合</span>" +
        '<span class="mem-dot"></span>' +
        "<span>完成 " + U.round(it.completes) + " · 跳过 " + U.round(it.skips) + "</span>";
    return '<div class="mem-item" data-test="memory-item" data-id="' + U.escape(it.id) + '">' +
      '<button class="mem-open" data-open="' + U.escape(it.id) + '" aria-label="查看 ' + U.escape(it.endingName || "这一晚") + '">' +
        '<div class="mem-r1">' +
          '<span class="mem-ending">' + U.escape(it.endingName || "一段夜航") + "</span>" +
          '<span class="mem-date">' + U.escape(date) + "</span>" +
        "</div>" +
        '<div class="mem-r2">' + meta + "</div>" +
        (awardText(it) ? '<div class="mem-awards">' + U.escape(awardText(it)) + "</div>" : "") +
        '<div class="mem-note' + (note ? "" : " empty") + '">' + U.escape(note || "还没有备注，留给下次想起时再写") + "</div>" +
      "</button>" +
      '<button class="icon-btn mem-del" data-del="' + U.escape(it.id) + '" aria-label="删除这一晚">✕</button>' +
    "</div>";
  }

  function emptyHtml() {
    return '<div class="mem-empty glass">' +
      '<div class="ic">☾</div>' +
      "<h2>还没有回忆</h2>" +
      "<p>走完一夜，结局会自动出现在这里。<br>也可以从以前的备份导入。</p>" +
      '<button class="btn primary wide mt-20" data-test="memory-start">开始今晚</button>' +
    "</div>";
  }

  function renderList(inst) {
    var list = App.Store.getHistory();
    inst.history = list;
    var listEl = inst.root.querySelector('[data-test="memory-list"]');
    if (!listEl) return;
    if (!list.length) {
      listEl.innerHTML = emptyHtml();
      var start = inst.root.querySelector('[data-test="memory-start"]');
      if (start) start.addEventListener("click", function () {
        try { App.Audio.play("tap"); } catch (e) {}
        App.Router.go("setup");
      });
      return;
    }
    listEl.innerHTML = list.map(itemHtml).join("");
    var countEl = inst.root.querySelector("[data-mem-count]");
    if (countEl) countEl.textContent = String(list.length);
  }

  function deleteEntry(inst, id) {
    var it = null;
    for (var i = 0; i < (inst.history || []).length; i++) if (inst.history[i] && inst.history[i].id === id) it = inst.history[i];
    App.UI.confirm({
      title: "删除这一晚？",
      text: (it && it.endingName ? "「" + it.endingName + "」" : "这一晚") + "会从这台手机的回忆册里移除，无法撤销。",
      ok: "删除",
      cancel: "留着"
    }).then(function (yes) {
      if (!yes) return;
      App.Store.removeHistory(id);
      renderList(inst);
      App.UI.toast("已删除这一晚");
    });
  }

  function openDetail(inst, id) {
    var list = inst.history || [];
    var it = null;
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) it = list[i];
    if (!it) return;
    var names = it.names || {};
    var note = String(it.note || "").trim();
    var aws = it.awards instanceof Array ? it.awards : [];
    var rows;
    if (it.kind === "flight-wish") {
      rows = '<div class="rows">' +
        "<span>日期 <b>" + U.escape(fmtEntryDate(it)) + "</b></span>" +
        "<span>玩法 <b>飞行棋</b></span>" +
        (it.winner ? "<span>赢家 <b>" + U.escape(it.winner) + "</b></span>" : "") +
        "</div>";
    } else {
      rows = '<div class="rows">' +
          "<span>日期 <b>" + U.escape(fmtEntryDate(it)) + "</b></span>" +
          "<span>回合 <b>" + U.round(it.rounds) + "</b></span>" +
          "<span>完成 <b>" + U.round(it.completes) + "</b></span>" +
          "<span>跳过 <b>" + U.round(it.skips) + "</b></span>" +
          "<span>最高连击 <b>" + U.round(it.maxCombo) + "</b></span>" +
          "<span>最高星级 <b>★" + U.round(it.maxStar) + "</b></span>" +
        "</div>" +
        '<div class="rows">' +
          "<span>♥ 心动 <b>" + U.round(it.heart) + "</b></span>" +
          "<span>✦ 张力 <b>" + U.round(it.tension) + "</b></span>" +
          "<span>⌁ 默契 <b>" + U.round(it.sync) + "</b></span>" +
        "</div>";
    }
    var html =
      '<div class="mem-detail">' +
        rows +
        (aws.length ? '<div class="aw">' + aws.map(function (a) { return "<span>" + U.escape(String(a)) + "</span>"; }).join("") + "</div>" : "") +
        '<div class="nt' + (note ? "" : " empty") + '">' + U.escape(note || "还没有备注。给这一晚留一句话，下次回来会看到。") + "</div>" +
      "</div>";
    inst.sheet = App.UI.sheet({
      title: it.endingName || "一段夜航",
      subtitle: (names.a || "他") + " ❤ " + (names.b || "她") + " · " + U.fmtDate(it.ts),
      html: html,
      onClose: function () { inst.sheet = null; }
    });
  }

  function exportAll(inst) {
    var data = App.Store.exportAll();
    var name = "升温夜航备份-" + ymd(new Date()) + ".json";
    if (downloadJSON(data, name)) {
      App.UI.toast("已导出全部数据（" + (data.history || []).length + " 晚）", { kind: "gold" });
      try { App.Audio.play("coin"); } catch (e) {}
    } else {
      App.UI.toast("导出失败，可能是浏览器限制", { kind: "rose" });
    }
  }

  function importFile(inst, file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var obj = null;
      try { obj = JSON.parse(String(reader.result || "")); } catch (e) { obj = null; }
      if (!obj) { App.UI.toast("文件解析失败：不是有效的备份", { kind: "rose" }); return; }
      var r = App.Store.importAll(obj);
      if (r && r.ok) {
        renderList(inst);
        App.UI.toast(r.msg || "已恢复", { kind: "gold" });
        try { App.Audio.play("chime"); } catch (e) {}
      } else {
        App.UI.toast((r && r.msg) || "导入失败", { kind: "rose" });
      }
    };
    reader.onerror = function () { App.UI.toast("读取文件失败", { kind: "rose" }); };
    reader.readAsText(file);
  }

  function bind(inst) {
    var root = inst.root;
    var listEl = root.querySelector('[data-test="memory-list"]');
    if (listEl) {
      listEl.addEventListener("click", function (e) {
        var del = e.target.closest("[data-del]");
        if (del) {
          e.preventDefault();
          e.stopPropagation();
          deleteEntry(inst, del.getAttribute("data-del"));
          return;
        }
        var open = e.target.closest("[data-open]");
        if (open) openDetail(inst, open.getAttribute("data-open"));
      });
    }
    var exp = root.querySelector('[data-test="memory-export"]');
    if (exp) exp.addEventListener("click", function () { try { App.Audio.play("tap"); } catch (e) {} exportAll(inst); });
    var imp = root.querySelector('[data-test="memory-import"]');
    var fileEl = root.querySelector('[data-test="memory-file"]');
    if (imp && fileEl) {
      imp.addEventListener("click", function () { try { App.Audio.play("tap"); } catch (e) {} fileEl.click(); });
      fileEl.addEventListener("change", function () {
        var f = fileEl.files && fileEl.files[0];
        importFile(inst, f);
        try { fileEl.value = ""; } catch (e) {}
      });
    }
    var clear = root.querySelector('[data-test="memory-clear"]');
    if (clear) clear.addEventListener("click", function () {
      try { App.Audio.play("tap"); } catch (e) {}
      App.UI.confirm({
        title: "清空回忆册？",
        text: "所有历史夜晚会从这台手机删除，无法撤销。导出备份可以留住它们。",
        ok: "全部清空",
        cancel: "再想想"
      }).then(function (yes) {
        if (!yes) return;
        App.Store.clearHistory();
        renderList(inst);
        App.UI.toast("回忆册已清空");
      });
    });
    var back = root.querySelector("[data-back]");
    if (back) back.addEventListener("click", function () { App.Router.back(); });
  }

  function mount(root, params) {
    var inst = { root: root, history: [], sheet: null };
    current = inst;
    var style = "";
    root.innerHTML =
      '<div class="page memory" data-v3="memory">' +
        '<div class="topbar">' +
          '<button class="back" data-back aria-label="返回">←</button>' +
          '<div class="tb-title">回忆册</div>' +
          '<div class="tb-right"></div>' +
        "</div>" +
        '<header class="mem-head">' +
          '<h1 class="grad-text">回忆册</h1>' +
          '<p class="sub">已经航行 <b data-mem-count>0</b> 晚 · 数据只保存在这台手机上<br>每一晚的结局、资源和奖项，都会留在这里。</p>' +
        "</header>" +
        '<div class="mem-tools">' +
          '<button class="btn soft" data-test="memory-export">导出全部</button>' +
          '<button class="btn soft" data-test="memory-import">导入备份</button>' +
          '<button class="btn ghost" data-test="memory-clear">清空</button>' +
        "</div>" +
        '<input type="file" class="sr-only" data-test="memory-file" accept="application/json,.json" aria-label="选择备份文件">' +
        '<section class="mem-list" data-test="memory-list"></section>' +
        '<div class="mem-toast-space"></div>' +
        '<footer class="mem-foot">回忆册不会上传 · 换手机可用「导出全部」再「导入备份」</footer>' +
      "</div>";
    renderList(inst);
    bind(inst);
    var page = root.querySelector(".memory");
    if (page && !M.reduced()) {
      page.classList.add("fade-up");
      requestAnimationFrame(function () { M.enter(page, { y: 14, dur: 320 }); });
    }
    return function () {
      if (inst.sheet && inst.sheet.close) { try { inst.sheet.close(); } catch (e) {} inst.sheet = null; }
      if (current === inst) current = null;
    };
  }

  function unmount() {
    if (current) {
      if (current.sheet && current.sheet.close) { try { current.sheet.close(); } catch (e) {} }
      current = null;
    }
  }

  App.Screens = App.Screens || {};
  App.Screens.memory = { mount: mount, unmount: unmount };
})();
