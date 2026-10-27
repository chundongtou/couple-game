/* ===== V3 ui/screens/setup.js：3 步向导（① 名字 ② 尺度与边界 ③ 今晚长度） ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;

  App.UI.injectStyle("setup", [
    '.setup { overflow: visible; }',
    '.setup-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 44px; }',
    '.setup-brand { font-size: 10px; letter-spacing: .32em; color: var(--dim2); font-weight: 700; }',
    '.setup-stepbadge { font-size: 11.5px; letter-spacing: .22em; color: var(--gold); font-variant-numeric: tabular-nums; }',
    '.setup-progress { height: 3px; border-radius: 99px; background: rgba(255,255,255,.10); overflow: hidden; margin: 12px 0 26px; }',
    '.setup-progress i { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--gold), var(--rose)); transition: width .42s var(--ease); }',
    '.setup-body { display: flex; flex-direction: column; }',
    '.setup-step-head { margin-bottom: 20px; }',
    '.setup-step-head .kicker { display: block; margin-bottom: 8px; }',
    '.setup-step-head .title-lg { margin-bottom: 8px; }',
    '.setup-step-head .small { line-height: 1.7; max-width: 330px; }',
    '.setup-namecard { display: flex; flex-direction: column; gap: 14px; }',
    '.setup-field { display: block; }',
    '.setup-field-label { display: flex; align-items: center; gap: 9px; font-size: 12px; letter-spacing: .1em; color: var(--dim2); margin-bottom: 8px; }',
    '.setup-field-label .nk { width: 21px; height: 21px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10.5px; font-weight: 700; color: var(--gold); background: var(--glass); border: 1px solid var(--line2); letter-spacing: 0; }',
    '.setup-input { width: 100%; min-height: 56px; padding: 0 16px; border-radius: var(--r-md); border: 1px solid var(--line2); background: rgba(255,255,255,.045); color: var(--ink); font-size: 19px; font-weight: 700; letter-spacing: .1em; outline: none; transition: border-color .2s var(--ease), box-shadow .2s var(--ease), background .2s var(--ease); }',
    '.setup-input::placeholder { color: var(--dim2); font-weight: 500; letter-spacing: .04em; }',
    '.setup-input:focus { border-color: rgba(243,200,121,.62); background: rgba(255,255,255,.075); box-shadow: 0 0 0 3px rgba(243,200,121,.13), var(--glow-gold); }',
    '.setup-heart { text-align: center; font-size: 13px; letter-spacing: .6em; color: var(--rose); opacity: .75; }',
    '.setup-preview { margin-top: 16px; text-align: center; font-size: 15px; letter-spacing: .06em; color: var(--dim); min-height: 24px; }',
    '.setup-preview b { color: var(--gold); font-weight: 800; }',
    '.setup-note { margin-top: 14px; text-align: center; font-size: 11px; letter-spacing: .06em; color: var(--dim2); line-height: 1.7; }',
    '.ms-card { width: 100%; display: flex; flex-direction: column; align-items: stretch; gap: 4px; text-align: left; padding: 14px 16px; margin-bottom: 9px; border-radius: var(--r-md); border: 1px solid var(--line); background: linear-gradient(160deg, rgba(255,255,255,.055), rgba(255,255,255,.02)); transition: border-color .2s var(--ease), background .2s var(--ease), box-shadow .2s var(--ease), transform .14s var(--ease); }',
    '.ms-card:active { transform: scale(.985); }',
    '.ms-card.on { border-color: rgba(243,200,121,.62); background: linear-gradient(135deg, rgba(243,200,121,.16), rgba(255,95,158,.10)); box-shadow: var(--glow-gold); }',
    '.ms-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }',
    '.ms-n { font-size: 10.5px; letter-spacing: .22em; color: var(--dim2); }',
    '.ms-card.on .ms-n { color: var(--gold); }',
    '.ms-card .stars { font-size: 12px; letter-spacing: .18em; }',
    '.ms-name { font-size: 16px; font-weight: 800; letter-spacing: .08em; }',
    '.ms-sub { font-size: 12px; color: var(--dim); line-height: 1.55; }',
    '.ms-desc { font-size: 11px; color: var(--dim2); line-height: 1.55; display: none; }',
    '.ms-card.on .ms-desc { display: block; }',
    '.setup-subhead { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin: 20px 0 10px; font-size: 12.5px; color: var(--dim); letter-spacing: .05em; }',
    '.setup-subhead .bl-count { font-size: 10.5px; color: var(--dim2); letter-spacing: .04em; }',
    '.setup-chips { display: flex; flex-wrap: wrap; gap: 8px; }',
    '.setup-chip { min-height: 40px; padding: 8px 15px; cursor: pointer; }',
    '.setup-chip .setup-chip-x { margin-left: 2px; padding: 0 2px; color: var(--ink); opacity: .7; cursor: pointer; font-size: 12px; }',
    '.setup-chip .setup-chip-x:active { opacity: 1; }',
    '.setup-custom { display: flex; gap: 8px; margin-top: 10px; }',
    '.setup-custom input { flex: 1; min-width: 0; min-height: 46px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line); background: var(--glass); color: var(--ink); font-size: 13px; outline: none; transition: border-color .2s; }',
    '.setup-custom input::placeholder { color: var(--dim2); }',
    '.setup-custom input:focus { border-color: rgba(243,200,121,.5); }',
    '.setup-custom .btn { flex: 0 0 auto; min-height: 46px; }',
    '.setup-switchrow { display: flex; align-items: center; gap: 14px; margin-top: 18px; padding: 14px 16px; border-radius: var(--r-md); border: 1px solid var(--line); background: var(--glass); }',
    '.setup-switchrow .tx { flex: 1; min-width: 0; }',
    '.setup-switchrow b { display: block; font-size: 14px; letter-spacing: .05em; }',
    '.setup-switchrow .small { display: block; margin-top: 3px; line-height: 1.55; }',
    '.setup-switch { width: 52px; height: 32px; flex: 0 0 auto; border-radius: 999px; border: 1px solid var(--line2); background: rgba(255,255,255,.12); position: relative; transition: background .22s var(--ease), border-color .22s; }',
    '.setup-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; opacity: .75; transition: transform .22s var(--ease), opacity .22s; }',
    '.setup-switch.on { background: linear-gradient(135deg, var(--gold), var(--rose)); border-color: transparent; }',
    '.setup-switch.on::after { transform: translateX(20px); opacity: 1; }',
    '.len-card { width: 100%; display: flex; align-items: center; gap: 14px; text-align: left; padding: 15px 16px; margin-bottom: 10px; border-radius: var(--r-md); border: 1px solid var(--line); background: var(--glass); transition: border-color .2s var(--ease), background .2s var(--ease), box-shadow .2s var(--ease), transform .14s var(--ease); }',
    '.len-card:active { transform: scale(.985); }',
    '.len-card.on { border-color: rgba(243,200,121,.62); background: linear-gradient(135deg, rgba(243,200,121,.14), rgba(255,95,158,.08)); box-shadow: var(--glow-gold); }',
    '.len-radio { width: 18px; height: 18px; flex: 0 0 auto; border-radius: 50%; border: 2px solid var(--line2); position: relative; transition: border-color .2s; }',
    '.len-card.on .len-radio { border-color: var(--gold); }',
    '.len-card.on .len-radio::after { content: ""; position: absolute; inset: 3px; border-radius: 50%; background: var(--gold); }',
    '.len-tx { flex: 1; min-width: 0; }',
    '.len-tx b { display: block; font-size: 15.5px; letter-spacing: .07em; }',
    '.len-tx .len-sub { display: block; margin-top: 2px; font-size: 11.5px; color: var(--dim2); }',
    '.len-badge { flex: 0 0 auto; font-size: 12px; color: var(--gold); font-variant-numeric: tabular-nums; letter-spacing: .04em; }',
    '.setup-summary { margin-top: 18px; }',
    '.setup-summary .sum-line { font-size: 14px; letter-spacing: .04em; margin-top: 6px; }',
    '.setup-summary .sum-line b { color: var(--gold); font-weight: 800; }',
    '.setup-summary .sum-safe { margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--line); font-size: 11.5px; color: var(--dim); line-height: 1.7; }',
    '.setup-body > *, .setup-foot { opacity: 0; animation: setupIn .46s var(--ease-out) forwards; }',
    '@keyframes setupIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }',
    '.setup-foot { position: sticky; bottom: 0; z-index: 20; margin-top: auto; padding: 20px 0 calc(6px + var(--safe-b)); background: linear-gradient(180deg, rgba(7,4,17,0), rgba(7,4,17,.92) 46%); }',
    '.setup-foot .btn .sub { margin-left: 8px; }',
    'body.reduce .setup-body > *, body.reduce .setup-foot { opacity: 1; animation: none; }',
    '@media (max-width: 340px) { .setup-foot { margin-left: -4px; margin-right: -4px; } }'
  ].join("\n"));

  var MAX_NAME = 10;
  var MAX_KW = 16;

  var SCALES = [
    { n: 1, name: "温柔", sub: "留给靠近与心动，一句一句慢慢来", desc: "手牌只出现轻缓的卡，像把灯调暗一点。" },
    { n: 2, name: "暧昧", sub: "有点电流的试探", desc: "点到为止的撩，留一点想象空间。" },
    { n: 3, name: "热烈", sub: "热，但还留着余地", desc: "现在这样的浓度，大多数夜里刚刚好。" },
    { n: 4, name: "不设限", sub: "不提前设限，随时可以停", desc: "把边界交给你们自己，觉得过界就喊停。" }
  ];
  var LENGTHS = [
    { id: "quick", name: "短夜", rounds: 9, sub: "约 20 分钟 · 三幕各 3 回合", badge: "9 回合" },
    { id: "classic", name: "整夜", rounds: 14, sub: "约 40 分钟 · 5 / 5 / 4 回合", badge: "14 回合" },
    { id: "deep", name: "深潜", rounds: 18, sub: "约 60 分钟 · 三幕各 6 回合", badge: "18 回合" }
  ];
  var PRESET_TAGS = [
    { label: "酒", tag: "喝酒" },
    { label: "蒙眼", tag: "蒙眼" },
    { label: "束缚", tag: "束缚" },
    { label: "道具", tag: "道具" },
    { label: "露出", tag: "露出" },
    { label: "角色", tag: "角色" }
  ];

  var S = null;

  function qs(sel) { return U.qs(sel, S.root); }
  function qsa(sel) { return U.qsa(sel, S.root); }

  function scaleMeta(n) {
    for (var i = 0; i < SCALES.length; i++) if (SCALES[i].n === n) return SCALES[i];
    return SCALES[2];
  }
  function lengthMeta(id) {
    for (var i = 0; i < LENGTHS.length; i++) if (LENGTHS[i].id === id) return LENGTHS[i];
    return LENGTHS[1];
  }
  function isPresetTag(tag) {
    for (var i = 0; i < PRESET_TAGS.length; i++) if (PRESET_TAGS[i].tag === tag) return true;
    return false;
  }
  function safeHoldSeconds() {
    try {
      if (App.Balance && App.Balance.DEFAULT_SETTINGS && App.Balance.DEFAULT_SETTINGS.safeHold) return App.Balance.DEFAULT_SETTINGS.safeHold;
    } catch (e) {}
    return 2;
  }
  function nameA() { return (S.names.a || "").trim().slice(0, MAX_NAME) || "他"; }
  function nameB() { return (S.names.b || "").trim().slice(0, MAX_NAME) || "她"; }

  function persist() {
    try {
      App.Store.saveSettings({
        names: { a: nameA(), b: nameB() },
        maxStar: S.maxStar,
        length: S.length,
        blacklist: S.blacklist.slice(),
        gentleOnly: !!S.gentleOnly
      });
    } catch (e) {}
  }

  /* ---------------- 视图 ---------------- */
  function topHtml() {
    return '<div class="setup-top">' +
      '<button class="icon-btn setup-back" data-act="back" id="setupBack" aria-label="返回">←</button>' +
      '<div class="setup-brand">COUPLE VOYAGE · SETUP</div>' +
      '<div class="setup-stepbadge" data-test="setup-step">' + U.pad2(S.step) + " / 03</div>" +
      "</div>" +
      '<div class="setup-progress" role="progressbar" aria-valuemin="1" aria-valuemax="3" aria-valuenow="' + S.step + '"><i style="width:' + (S.step / 3 * 100) + '%"></i></div>';
  }

  function headHtml(kicker, title, sub) {
    return '<div class="setup-step-head">' +
      '<div class="kicker">' + kicker + "</div>" +
      '<h2 class="title-lg">' + title + "</h2>" +
      '<p class="muted small">' + sub + "</p>" +
      "</div>";
  }

  function stepNamesHtml() {
    var preview = "<b>" + U.escape(nameA()) + "</b> ❤ <b>" + U.escape(nameB()) + "</b>";
    return headHtml("STEP 01 · 名字", "今晚，怎么称呼你们？", "写两个只属于今晚的代号。屏幕上会这样叫你们，之后也能在设置里改。") +
      '<div class="glass pad-20 setup-namecard">' +
      '<label class="setup-field"><span class="setup-field-label"><i class="nk">A</i> 领航员 A</span>' +
      '<input class="setup-input" data-test="setup-name-a" type="text" maxlength="' + MAX_NAME + '" autocomplete="off" placeholder="他" aria-label="领航员 A 的称呼" value="' + U.escape(S.names.a || "") + '"></label>' +
      '<div class="setup-heart">✦ ♥ ✦</div>' +
      '<label class="setup-field"><span class="setup-field-label"><i class="nk">B</i> 领航员 B</span>' +
      '<input class="setup-input" data-test="setup-name-b" type="text" maxlength="' + MAX_NAME + '" autocomplete="off" placeholder="她" aria-label="领航员 B 的称呼" value="' + U.escape(S.names.b || "") + '"></label>' +
      "</div>" +
      '<div class="setup-preview" id="setupNamePreview">' + preview + "</div>" +
      '<div class="setup-note">今晚上船的是你们两个人 · 每回合换一个人当领航员</div>';
  }

  function chipsHtml() {
    var preset = PRESET_TAGS.map(function (t) {
      var on = S.blacklist.indexOf(t.tag) >= 0;
      return '<button class="chip setup-chip' + (on ? " on" : "") + '" data-act="tag" data-tag="' + U.escape(t.tag) + '" data-test="blacklist-' + t.label + '" aria-pressed="' + (on ? "true" : "false") + '">' + t.label + "</button>";
    }).join("");
    var custom = S.blacklist.filter(function (tag) { return !isPresetTag(tag); }).map(function (tag) {
      return '<span class="chip setup-chip on" data-act="tag" data-tag="' + U.escape(tag) + '">' + U.escape(tag) +
        '<span class="setup-chip-x" data-act="del-tag" data-tag="' + U.escape(tag) + '" role="button" tabindex="0" aria-label="移除 ' + U.escape(tag) + '">✕</span></span>';
    }).join("");
    return preset + custom;
  }

  function stepScaleHtml() {
    var cards = SCALES.map(function (s) {
      var on = S.maxStar === s.n;
      return '<button class="ms-card' + (on ? " on" : "") + '" data-act="scale" data-n="' + s.n + '" data-test="maxstar-' + s.n + '" role="radio" aria-checked="' + (on ? "true" : "false") + '">' +
        '<div class="ms-top"><span class="ms-n">0' + s.n + "</span><span class=\"stars\">" + App.UI.stars(s.n, 4) + "</span></div>" +
        '<div class="ms-name">' + s.name + "</div>" +
        '<div class="ms-sub">' + s.sub + "</div>" +
        '<div class="ms-desc">' + s.desc + "</div>" +
        "</button>";
    }).join("");
    return headHtml("STEP 02 · 尺度与边界", "把边界先放在桌面上", "你选一个上限，越过它的话题不会出现在手牌里。之后随时可以改。") +
      '<div role="radiogroup" aria-label="尺度上限">' + cards + "</div>" +
      '<div class="setup-subhead"><span>不想抽到的话题 <span class="dim">· 可选</span></span><span class="bl-count" id="setupBlCount">' + (S.blacklist.length ? "已避开 " + S.blacklist.length + " 个" : "") + "</span></div>" +
      '<div class="setup-chips" id="setupChips">' + chipsHtml() + "</div>" +
      '<div class="setup-custom">' +
      '<input id="setupKeyword" data-test="blacklist-input" type="text" maxlength="' + MAX_KW + '" autocomplete="off" placeholder="自定义关键词，如：前任 / 酒精" aria-label="自定义黑名单关键词">' +
      '<button class="btn soft sm" data-act="add-tag" data-test="blacklist-add">添加</button>' +
      "</div>" +
      '<div class="setup-switchrow">' +
      '<div class="tx"><b>柔和模式</b><span class="small muted">只出现 ★≤2、且不含「束缚 / 露出 / 道具 / 喝酒 / 蒙眼」标签的卡。第一次一起玩可以先开。</span></div>' +
      '<button class="setup-switch' + (S.gentleOnly ? " on" : "") + '" data-act="gentle" data-test="setup-gentle" role="switch" aria-checked="' + (S.gentleOnly ? "true" : "false") + '" aria-label="缓和模式"></button>' +
      "</div>";
  }

  function stepLengthHtml() {
    var cards = LENGTHS.map(function (l) {
      var on = S.length === l.id;
      return '<button class="len-card' + (on ? " on" : "") + '" data-act="length" data-id="' + l.id + '" data-test="length-' + l.id + '" role="radio" aria-checked="' + (on ? "true" : "false") + '">' +
        '<span class="len-radio"></span>' +
        '<span class="len-tx"><b>' + l.name + '</b><span class="len-sub">' + l.sub + "</span></span>" +
        '<span class="len-badge">' + l.badge + "</span>" +
        "</button>";
    }).join("");
    var s = scaleMeta(S.maxStar);
    var l = lengthMeta(S.length);
    return headHtml("STEP 03 · 今晚的长度", "海面留给你们多久？", "越长的夜，越有机会走到深一点的地方。中途随时可以停。") +
      '<div role="radiogroup" aria-label="今晚长度">' + cards + "</div>" +
      '<div class="glass pad-16 setup-summary">' +
      '<div class="kicker">今晚的航线</div>' +
      '<div class="sum-line" id="setupSummary"><b>' + U.escape(nameA()) + "</b> ❤ <b>" + U.escape(nameB()) + "</b> · " + s.name + " · " + l.name + " " + l.rounds + " 回合</div>" +
      '<div class="sum-safe">🚩 安全词随时可用：长按「停」' + safeHoldSeconds() + ' 秒，今晚会温柔收尾，不扣任何数据。' + (S.blacklist.length ? "<br>已避开 " + S.blacklist.length + " 个话题关键词。" : "") + "</div>" +
      "</div>";
  }

  function bodyHtml() {
    if (S.step === 1) return stepNamesHtml();
    if (S.step === 2) return stepScaleHtml();
    return stepLengthHtml();
  }

  function footHtml() {
    if (S.step < 3) {
      return '<div class="setup-foot"><button class="btn primary xl wide" data-act="next" data-test="setup-next">下一步<span class="sub">0' + (S.step + 1) + " / 03</span></button></div>";
    }
    return '<div class="setup-foot"><button class="btn primary xl wide" data-act="start" data-test="setup-start" id="setupStart">开始今晚<span class="sub">启航</span></button></div>';
  }

  function render() {
    if (!S) return;
    S.root.innerHTML = '<div class="page setup">' + topHtml() +
      '<div class="setup-body" id="setupBody">' + bodyHtml() + "</div>" +
      footHtml() + "</div>";
    if (!M.reduced()) {
      U.qsa(".setup-body > *", S.root).forEach(function (el, i) {
        el.style.animationDelay = (i * 52) + "ms";
      });
      var foot = U.qs(".setup-foot", S.root);
      if (foot) foot.style.animationDelay = "140ms";
    }
  }

  function updatePreview() {
    var el = qs("#setupNamePreview");
    if (!el) return;
    el.innerHTML = "<b>" + U.escape(nameA()) + "</b> ❤ <b>" + U.escape(nameB()) + "</b>";
  }

  function refreshChips() {
    var box = qs("#setupChips");
    if (box) box.innerHTML = chipsHtml();
    var count = qs("#setupBlCount");
    if (count) count.textContent = S.blacklist.length ? "已避开 " + S.blacklist.length + " 个" : "";
  }

  /* ---------------- 交互 ---------------- */
  function selectScale(n) {
    if (S.maxStar === n) return;
    S.maxStar = n;
    qsa('[data-act="scale"]').forEach(function (el) {
      var on = parseInt(el.getAttribute("data-n"), 10) === n;
      el.classList.toggle("on", on);
      el.setAttribute("aria-checked", on ? "true" : "false");
    });
    persist();
    App.Audio.play("select");
    App.UI.haptic();
  }

  function selectLength(id) {
    if (S.length === id) return;
    S.length = id;
    qsa('[data-act="length"]').forEach(function (el) {
      var on = el.getAttribute("data-id") === id;
      el.classList.toggle("on", on);
      el.setAttribute("aria-checked", on ? "true" : "false");
    });
    var sum = qs("#setupSummary");
    if (sum) {
      var l = lengthMeta(id);
      sum.innerHTML = "<b>" + U.escape(nameA()) + "</b> ❤ <b>" + U.escape(nameB()) + "</b> · " + scaleMeta(S.maxStar).name + " · " + l.name + " " + l.rounds + " 回合";
    }
    persist();
    App.Audio.play("select");
    App.UI.haptic();
  }

  function toggleTag(tag) {
    var i = S.blacklist.indexOf(tag);
    if (i >= 0) S.blacklist.splice(i, 1);
    else S.blacklist.push(tag);
    persist();
    refreshChips();
    App.Audio.play("tap");
    App.UI.haptic();
  }

  function removeTag(tag) {
    var i = S.blacklist.indexOf(tag);
    if (i >= 0) S.blacklist.splice(i, 1);
    persist();
    refreshChips();
    App.Audio.play("tap");
  }

  function addTag() {
    var input = qs("#setupKeyword");
    if (!input) return;
    var v = String(input.value || "").trim().replace(/\s+/g, "");
    if (!v) { App.UI.toast("先输入一个关键词"); return; }
    if (v.length > MAX_KW) v = v.slice(0, MAX_KW);
    if (S.blacklist.indexOf(v) >= 0) { App.UI.toast("已经在清单里了"); input.value = ""; return; }
    S.blacklist.push(v);
    input.value = "";
    persist();
    refreshChips();
    App.Audio.play("select");
    App.UI.haptic();
    App.UI.toast("已避开「" + v + "」");
  }

  function toggleGentle() {
    S.gentleOnly = !S.gentleOnly;
    var btn = qs('[data-act="gentle"]');
    if (btn) {
      btn.classList.toggle("on", S.gentleOnly);
      btn.setAttribute("aria-checked", S.gentleOnly ? "true" : "false");
    }
    persist();
    App.Audio.play("select");
    App.UI.haptic();
  }

  function goStep(n) {
    n = U.clamp(n, 1, 3);
    if (!S || n === S.step) return;
    persist();
    S.step = n;
    render();
    App.Audio.play("flip");
    try { S.root.scrollTop = 0; } catch (e) {}
  }

  function startSession() {
    if (!S || S.busy) return;
    persist();
    var settings = App.Store.getSettings();
    var names = { a: nameA(), b: nameB() };
    if (names.a === names.b) names.b = names.b + "·B";
    var patch = {
      maxStar: S.maxStar,
      length: S.length,
      blacklist: S.blacklist.slice(),
      gentleOnly: !!S.gentleOnly,
      sound: settings.sound !== false,
      haptics: settings.haptics !== false,
      reduced: !!settings.reduced,
      safeHold: safeHoldSeconds()
    };
    var session = null;
    try {
      if (App.Engine && typeof App.Engine.newSession === "function") session = App.Engine.newSession(patch, names);
    } catch (e) { session = null; }
    if (!session) {
      App.UI.toast("航线没有展开，先检查一下题库，再试一次", { kind: "rose" });
      return;
    }
    S.busy = true;
    var btn = qs('[data-test="setup-start"]');
    if (btn) {
      btn.setAttribute("disabled", "");
      btn.innerHTML = "正在启航…";
    }
    try { App.Store.saveSession(session); } catch (e) {}
    App.Audio.play("act");
    App.UI.haptic("success");
    App.Router.go("journey");
  }

  function onBack() {
    if (S && S.step > 1) goStep(S.step - 1);
    else App.Router.back();
  }

  function onClick(e) {
    if (!S) return;
    var t = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!t) return;
    var act = t.getAttribute("data-act");
    if (act === "back") { e.preventDefault(); onBack(); }
    else if (act === "next") { e.preventDefault(); goStep(S.step + 1); }
    else if (act === "start") { e.preventDefault(); startSession(); }
    else if (act === "scale") { e.preventDefault(); selectScale(parseInt(t.getAttribute("data-n"), 10)); }
    else if (act === "length") { e.preventDefault(); selectLength(t.getAttribute("data-id")); }
    else if (act === "tag") { e.preventDefault(); toggleTag(t.getAttribute("data-tag")); }
    else if (act === "del-tag") { e.preventDefault(); e.stopPropagation(); removeTag(t.getAttribute("data-tag")); }
    else if (act === "add-tag") { e.preventDefault(); addTag(); }
    else if (act === "gentle") { e.preventDefault(); toggleGentle(); }
  }

  function onInput(e) {
    if (!S || !e.target) return;
    var t = e.target;
    if (t.getAttribute && t.getAttribute("data-test") === "setup-name-a") { S.names.a = t.value; updatePreview(); }
    else if (t.getAttribute && t.getAttribute("data-test") === "setup-name-b") { S.names.b = t.value; updatePreview(); }
  }

  function onChange(e) {
    if (!S || !e.target) return;
    var t = e.target;
    var dt = t.getAttribute ? t.getAttribute("data-test") : "";
    if (dt === "setup-name-a" || dt === "setup-name-b") persist();
  }

  function onKey(e) {
    if (!S) return;
    if (e.key === "Enter") {
      var t = e.target;
      var dt = t && t.getAttribute ? t.getAttribute("data-test") : "";
      if (dt === "setup-name-a" || dt === "setup-name-b") {
        e.preventDefault();
        goStep(S.step + 1);
        return;
      }
      if (dt === "blacklist-input") { e.preventDefault(); addTag(); return; }
    }
    if (e.key === "Escape") { e.preventDefault(); onBack(); }
  }

  App.Screens = App.Screens || {};
  App.Screens.setup = {
    mount: function (root, params) {
      var settings = App.Store.getSettings();
      S = {
        root: root,
        step: 1,
        names: { a: settings.names.a || "他", b: settings.names.b || "她" },
        maxStar: settings.maxStar || 3,
        length: settings.length || "classic",
        blacklist: (settings.blacklist || []).slice(),
        gentleOnly: !!settings.gentleOnly,
        busy: false
      };
      render();
      root.addEventListener("click", onClick);
      root.addEventListener("input", onInput);
      root.addEventListener("change", onChange);
      root.addEventListener("keydown", onKey);
      if (params && params.step) goStep(U.clamp(parseInt(params.step, 10) || 1, 1, 3));
      return function cleanup() {
        try {
          root.removeEventListener("click", onClick);
          root.removeEventListener("input", onInput);
          root.removeEventListener("change", onChange);
          root.removeEventListener("keydown", onKey);
        } catch (e) {}
        S = null;
      };
    },
    unmount: function () {}
  };
})();
