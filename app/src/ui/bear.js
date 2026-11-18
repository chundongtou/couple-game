/* ===== V7 向导小熊 Bear：程序化 SVG · 三套主题服装 · 探头/眨眼/耳朵抖/举牌/点头/放手 =====
 * 契约（docs/v7/impl-freeze.md §2.2 / §4.2）：
 *   App.Bear.render({outfit, mood, glyph, className}) -> HTMLElement
 *     outfit: 'pilot' | 'starlight' | 'paper'（兼容 cloud/star/paper）
 *     mood:   'peek'（默认，探头入场）| 'idle' | 'blink' | 'ear' | 'nod' | 'put' | 'wave' | 'happy'
 *     glyph:  'heart' | 'star' | 'letter' | 'play' | 'arrow'（举牌上的小图案）
 *   返回节点带 data-test="bear"、aria-hidden="true"、data-outfit、data-mood；纯装饰，不承载可读文本。
 *   App.Bear.play(el, mood) 触发一次动作；App.Bear.destroy(el) 清计时器。
 *   App.Bear.html(opts) 返回 HTML 字符串（自测/截图用）。
 * 约束：不引外部素材、不新增文案、不调引擎；App.Motion.reduced / prefers-reduced-motion 下动画收为静态。
 */
(function () {
  var App = (window.App = window.App || {});

  var CSS = `
.cs-bear{position:relative;display:block;width:100%;max-width:200px;margin:0 auto;pointer-events:none;
  -webkit-user-select:none;user-select:none;filter:drop-shadow(0 12px 20px rgba(3,2,10,.42));
  --ease-out:cubic-bezier(.16,1,.3,1);--ease-soft:cubic-bezier(.22,.8,.28,1);}
.cs-bear-svg{display:block;width:100%;height:auto;overflow:visible}
.cs-bear-shadow{fill:rgba(3,2,10,.34)}
.cs-bear-torso{fill:var(--b-fur,#C99A6B)}
.cs-bear-belly{fill:var(--b-belly,#F3DCC2)}
.cs-bear-ear-in{fill:var(--b-ear,#E9B7A0)}
.cs-bear-muzzle{fill:var(--b-muzzle,#F7E7D2)}
.cs-bear-nose{fill:var(--b-nose,#3A2418)}
.cs-bear-line{stroke:var(--b-nose,#3A2418);fill:none;stroke-linecap:round;stroke-width:2.2}
.cs-bear-blush{fill:var(--b-blush,#E9887A);opacity:.32}
.cs-bear-eye-white{fill:#FFF9F0}
.cs-bear-pupil{fill:var(--b-eye,#33221A)}
.cs-bear-spark{fill:#FFF6E6;opacity:.9}
.cs-bear-lid{fill:var(--b-fur,#C99A6B);transform-box:fill-box;transform-origin:center;transform:scaleY(0);animation:csBearBlink 5.4s var(--ease-soft) infinite}
.cs-bear-eye--r .cs-bear-lid{animation-delay:.05s}

/* 身体呼吸（只动躯干，头部/耳朵各自独立动画，互不抢 transform） */
.cs-bear-body{transform-box:view-box;transform-origin:70px 170px;animation:csBearBreath 5.8s ease-in-out infinite}
/* 耳朵抖：左右不同节奏，像不经意的耳朵一动 */
.cs-bear-ear{transform-box:fill-box}
.cs-bear-ear--l{transform-origin:80% 80%;animation:csBearEarL 7.3s ease-in-out infinite}
.cs-bear-ear--r{transform-origin:20% 80%;animation:csBearEarR 8.6s ease-in-out infinite}
/* 举牌：坐着时牌子轻轻晃 */
.cs-bear-sign{transform-box:fill-box;transform-origin:50% 100%;animation:csBearSignSway 6.2s ease-in-out infinite}
.cs-bear-sign-board{fill:var(--b-sign,#F7EAD6);stroke:var(--b-sign-line,#8A5A32);stroke-width:2}
.cs-bear-sign-pin{fill:var(--b-sign-line,#8A5A32)}
.cs-bear-glyph{fill:var(--b-glyph,#C4685E);stroke:none}
.cs-bear-glyph--letter{fill:var(--b-sign-line,#8A5A32)}
.cs-bear-glyph--play{fill:var(--b-glyph,#E2965E)}
.cs-bear-glyph--arrow{fill:none;stroke:var(--b-glyph,#8A5A32);stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}
.cs-bear-glyph{display:none}
.cs-bear[data-glyph="heart"] .cs-bear-glyph--heart,
.cs-bear[data-glyph="star"] .cs-bear-glyph--star,
.cs-bear[data-glyph="letter"] .cs-bear-glyph--letter,
.cs-bear[data-glyph="play"] .cs-bear-glyph--play,
.cs-bear[data-glyph="arrow"] .cs-bear-glyph--arrow{display:inline}

/* 探头入场：从格子后面升起来，牌子随后举起 */
.cs-bear.cs-bear--in{animation:csBearRise .58s var(--ease-out) both}
.cs-bear.cs-bear--in .cs-bear-hold{transform-box:fill-box;transform-origin:50% 100%;animation:csBearSignUp .62s .16s var(--ease-out) both}

/* 动作 */
.cs-bear.is-nod .cs-bear-head{transform-box:view-box;transform-origin:70px 62px;animation:csBearNod .78s var(--ease-soft) both}
.cs-bear.is-put .cs-bear-hold{transform-box:fill-box;transform-origin:50% 100%;animation:csBearPut .82s var(--ease-soft) forwards}
.cs-bear.is-put .cs-bear-head{transform-box:view-box;transform-origin:70px 62px;animation:csBearTilt .82s var(--ease-soft) forwards}
.cs-bear.is-wave .cs-bear-arm--l{transform-box:fill-box;transform-origin:70% 15%;animation:csBearWave .56s var(--ease-soft) 2}
.cs-bear.is-happy .cs-bear-ear{animation:csBearEarHappy .42s var(--ease-soft) 3}
.cs-bear.is-happy .cs-bear-sign{animation:csBearSignHop .42s var(--ease-soft) 3}
.cs-bear.is-blink .cs-bear-lid{animation:csBearBlinkOnce .42s var(--ease-soft) both}
.cs-bear.is-ear .cs-bear-ear--l{animation:csBearEarTwitch .5s var(--ease-soft) 1}
.cs-bear.is-ear .cs-bear-ear--r{animation:csBearEarTwitch .5s .06s var(--ease-soft) 1}

@keyframes csBearRise{from{opacity:0;transform:translateY(44px) scale(.97)}to{opacity:1;transform:none}}
@keyframes csBearSignUp{from{opacity:0;transform:translateY(26px) scale(.94)}to{opacity:1;transform:none}}
@keyframes csBearBreath{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(1.4px) scaleY(1.004)}}
@keyframes csBearBlink{0%,93.5%,100%{transform:scaleY(0)}95.2%,97.4%{transform:scaleY(1)}}
@keyframes csBearBlinkOnce{0%,100%{transform:scaleY(0)}40%,60%{transform:scaleY(1)}}
@keyframes csBearEarL{0%,87%,100%{transform:rotate(0)}89.5%{transform:rotate(-9deg)}92%{transform:rotate(4.5deg)}94.5%{transform:rotate(-3deg)}97%{transform:rotate(0)}}
@keyframes csBearEarR{0%,90%,100%{transform:rotate(0)}92.5%{transform:rotate(8deg)}95%{transform:rotate(-4deg)}97.5%{transform:rotate(0)}}
@keyframes csBearEarHappy{0%,100%{transform:rotate(0)}35%{transform:rotate(-12deg)}70%{transform:rotate(7deg)}}
@keyframes csBearEarTwitch{0%,100%{transform:rotate(0)}35%{transform:rotate(-10deg)}70%{transform:rotate(5deg)}}
@keyframes csBearSignSway{0%,100%{transform:rotate(0)}30%{transform:rotate(1.1deg)}65%{transform:rotate(-1.2deg)}}
@keyframes csBearSignHop{0%,100%{transform:translateY(0) rotate(0)}45%{transform:translateY(-3px) rotate(1.5deg)}}
@keyframes csBearNod{0%,100%{transform:rotate(0) translateY(0)}28%{transform:rotate(2.4deg) translateY(3px)}48%{transform:rotate(3deg) translateY(5px)}72%{transform:rotate(-.8deg) translateY(1px)}}
@keyframes csBearTilt{to{transform:rotate(-3.2deg) translateY(2px)}}
@keyframes csBearPut{0%{transform:none}32%{transform:translateY(-3px) rotate(1deg)}100%{transform:translateY(19px) rotate(-4.5deg);opacity:.74}}
@keyframes csBearWave{0%,100%{transform:rotate(0)}35%{transform:rotate(-24deg)}70%{transform:rotate(-8deg)}}

/* 三套服装：同一只熊，换帽子/披风/纸围巾 */
.cs-bear[data-outfit="pilot"]{
  --b-fur:#C99A6B;--b-belly:#F3DCC2;--b-muzzle:#F7E7D2;--b-ear:#E9B7A0;--b-eye:#33221A;--b-nose:#3A2418;
  --b-blush:#E9887A;--b-accent:#E2965E;--b-accent-2:#C4685E;--b-gold:#F3C077;--b-cap:#2C3E5E;--b-cap-2:#1C2B45;
  --b-sign:#FBF1E1;--b-sign-line:#8A5A32;--b-glyph:#C4685E}
.cs-bear[data-outfit="starlight"]{
  --b-fur:#C3A6C9;--b-belly:#F1E3EC;--b-muzzle:#F4E8F0;--b-ear:#E3C3D9;--b-eye:#2F2036;--b-nose:#3A2438;
  --b-blush:#E9887A;--b-accent:#8E7BD8;--b-accent-2:#6E5AB0;--b-gold:#F3C077;--b-cape:#34215C;--b-cape-line:#8E7BD8;
  --b-sign:#F3ECF6;--b-sign-line:#6E5AB0;--b-glyph:#8E7BD8}
.cs-bear[data-outfit="paper"]{
  --b-fur:#D8B98D;--b-belly:#F5E7D2;--b-muzzle:#F8EEDC;--b-ear:#EDCFAF;--b-eye:#3B2A1C;--b-nose:#4A3421;
  --b-blush:#D98A74;--b-accent:#C9AE86;--b-accent-2:#B99A6E;--b-paper:#D9C3A1;--b-paper-2:#BFA277;--b-paper-line:#7A5B3A;
  --b-sign:#FBF3E2;--b-sign-line:#7A5B3A;--b-glyph:#8A6A46}

/* reduced / 减少动画：保留静态可读画面 */
body.reduce .cs-bear *,body.reduce .cs-bear,
.cs-bear[data-reduced="1"] *,.cs-bear[data-reduced="1"]{animation:none!important}
@media (prefers-reduced-motion:reduce){.cs-bear *,.cs-bear{animation:none!important}}
`;

  function injectStyle() {
    if (App.UI && App.UI.injectStyle) { App.UI.injectStyle("bear-v7", CSS); return; }
    if (document.getElementById("style-bear-v7")) return;
    var el = document.createElement("style");
    el.id = "style-bear-v7";
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  var OUTFITS = ["pilot", "starlight", "paper"];
  var ALIAS = { cloud: "pilot", star: "starlight", paper: "paper", pilot: "pilot", starlight: "starlight" };

  function normalizeOutfit(outfit) {
    var v = String(outfit || "").toLowerCase();
    return ALIAS[v] || "pilot";
  }

  function normalizeGlyph(glyph) {
    var v = String(glyph || "").toLowerCase();
    return ["heart", "star", "letter", "play", "arrow"].indexOf(v) >= 0 ? v : "heart";
  }

  function glyphForKind(kind) {
    var k = String(kind || "");
    if (k === "fate") return "star";
    if (k === "ending") return "letter";
    if (k.indexOf("minigame") === 0 || k === "thermo" || k === "truth-wheel" || k === "dare-wheel") return "play";
    if (k === "jump" || k === "fly" || k === "home-entry") return "arrow";
    return "heart";
  }

  /* ---------------------------------------------------------------- SVG ---- */
  function outfitMarkup(outfit) {
    if (outfit === "starlight") {
      return '' +
        /* 披风（在身体后面，由调用方放在 torso 之前） */
        '<g class="cs-bear-outfit cs-outfit--starlight cs-star-back">' +
          '<path d="M39 100 C27 126 29 156 41 169 L99 169 C111 156 113 126 101 100 Z" fill="var(--b-cape,#34215C)"/>' +
          '<path d="M39 100 C27 126 29 156 41 169" fill="none" stroke="var(--b-cape-line,#8E7BD8)" stroke-width="1.4" opacity=".55"/>' +
          '<path d="M101 100 C113 126 111 156 99 169" fill="none" stroke="var(--b-cape-line,#8E7BD8)" stroke-width="1.4" opacity=".55"/>' +
        "</g>";
    }
    return "";
  }

  function frontOutfitMarkup(outfit) {
    if (outfit === "starlight") {
      return '' +
        '<g class="cs-bear-outfit cs-outfit--starlight">' +
          '<path d="M42 92 Q70 108 98 92 L96 103 Q70 117 44 103 Z" fill="var(--b-accent,#8E7BD8)" opacity=".92"/>' +
          '<polygon points="70,105.5 71.8,109.8 76.4,110.2 72.9,113.2 74,117.8 70,115.2 66,117.8 67.1,113.2 63.6,110.2 68.2,109.8" fill="var(--b-gold,#F3C077)"/>' +
          '<circle cx="56" cy="112" r="1.4" fill="#FFE9BE"/><circle cx="88" cy="110" r="1.1" fill="#FFE9BE"/>' +
          '<circle cx="49" cy="118" r=".9" fill="#FFE9BE"/><circle cx="93" cy="120" r=".8" fill="#FFE9BE"/>' +
        "</g>";
    }
    if (outfit === "paper") {
      return '' +
        '<g class="cs-bear-outfit cs-outfit--paper">' +
          '<path d="M41 92 Q70 109 99 92 L97 103 Q70 118 43 103 Z" fill="var(--b-paper,#D9C3A1)"/>' +
          '<path d="M43 97 Q70 112 97 97" fill="none" stroke="var(--b-paper-2,#BFA277)" stroke-width="2.4"/>' +
          '<path d="M45 102 Q70 116 95 102" fill="none" stroke="var(--b-paper-line,#7A5B3A)" stroke-width="1" stroke-dasharray="3 3" opacity=".55"/>' +
          /* 圆眼镜 */
          '<g fill="rgba(255,255,255,.16)" stroke="var(--b-paper-line,#7A5B3A)" stroke-width="2">' +
            '<circle cx="55" cy="58" r="11"/><circle cx="85" cy="58" r="11"/>' +
            '<path d="M66 58 h8" fill="none"/><path d="M44 55 l-8 -3" fill="none" stroke-width="1.6"/>' +
          "</g>" +
        "</g>";
    }
    /* pilot：机长帽 + 护目镜 + 围巾 */
    return '' +
      '<g class="cs-bear-outfit cs-outfit--pilot">' +
        '<path d="M31 55 Q31 18 70 18 Q109 18 109 55 Q91 45 70 45 Q49 45 31 55 Z" fill="var(--b-cap,#2C3E5E)"/>' +
        '<path d="M31 55 Q70 43 109 55 Q99 63 70 63 Q41 63 31 55 Z" fill="var(--b-cap-2,#1C2B45)"/>' +
        '<circle cx="94" cy="34" r="4.6" fill="var(--b-gold,#F3C077)"/>' +
        '<path d="M94 31 l1 2.4 2.6 .4 -1.9 1.8 .5 2.6 -2.2 -1.3 -2.2 1.3 .5 -2.6 -1.9 -1.8 2.6 -.4 Z" fill="#2A1710" opacity=".55"/>' +
        /* 护目镜架在帽檐上 */
        '<g opacity=".96">' +
          '<path d="M39 47 Q56 42 70 42 Q84 42 101 47" fill="none" stroke="#8B5A2B" stroke-width="2.4"/>' +
          '<circle cx="55" cy="46" r="7.4" fill="#2B1710" stroke="var(--b-gold,#F3C077)" stroke-width="2"/>' +
          '<circle cx="85" cy="46" r="7.4" fill="#2B1710" stroke="var(--b-gold,#F3C077)" stroke-width="2"/>' +
          '<path d="M62 46 h16" stroke="var(--b-gold,#F3C077)" stroke-width="2"/>' +
        "</g>" +
        '<path d="M41 93 Q70 108 99 93 L97 104 Q70 118 43 104 Z" fill="var(--b-accent,#E2965E)"/>' +
        '<path d="M95 100 l11 17 -13 5 -3 -15 Z" fill="var(--b-accent-2,#C4685E)"/>' +
        '<path d="M45 95 Q70 107 95 95" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.4"/>' +
      "</g>";
  }

  function svgMarkup(opts) {
    var outfit = normalizeOutfit(opts.outfit);
    var glyph = normalizeGlyph(opts.glyph);
    var back = outfitMarkup(outfit);
    var front = frontOutfitMarkup(outfit);
    return '' +
      '<svg class="cs-bear-svg" viewBox="0 0 140 180" aria-hidden="true" focusable="false" role="presentation">' +
        '<ellipse class="cs-bear-shadow" cx="70" cy="172" rx="34" ry="5.5"/>' +
        '<g class="cs-bear-body">' +
          back +
          '<ellipse class="cs-bear-torso" cx="70" cy="130" rx="33" ry="40"/>' +
          '<ellipse class="cs-bear-belly" cx="70" cy="137" rx="23" ry="27"/>' +
          /* 耳朵（在头后面） */
          '<g class="cs-bear-ear cs-bear-ear--l"><circle cx="36" cy="29" r="15" fill="var(--b-fur,#C99A6B)"/><circle class="cs-bear-ear-in" cx="36" cy="30" r="8"/></g>' +
          '<g class="cs-bear-ear cs-bear-ear--r"><circle cx="104" cy="29" r="15" fill="var(--b-fur,#C99A6B)"/><circle class="cs-bear-ear-in" cx="104" cy="30" r="8"/></g>' +
          /* 左手臂 */
          '<g class="cs-bear-arm cs-bear-arm--l"><path d="M42 112 Q34 126 43 138" fill="none" stroke="var(--b-fur,#C99A6B)" stroke-width="14" stroke-linecap="round"/></g>' +
          /* 头 */
          '<g class="cs-bear-head">' +
            '<circle cx="70" cy="61" r="38" fill="var(--b-fur,#C99A6B)"/>' +
            '<ellipse class="cs-bear-muzzle" cx="70" cy="77" rx="21" ry="16"/>' +
            '<g class="cs-bear-eyes">' +
              '<g class="cs-bear-eye cs-bear-eye--l">' +
                '<ellipse class="cs-bear-eye-white" cx="55" cy="57" rx="7.2" ry="8.4"/>' +
                '<circle class="cs-bear-pupil" cx="55.6" cy="58" r="4"/>' +
                '<circle class="cs-bear-spark" cx="54" cy="56" r="1.25"/>' +
                '<ellipse class="cs-bear-lid" cx="55" cy="57" rx="7.4" ry="8.6"/>' +
              "</g>" +
              '<g class="cs-bear-eye cs-bear-eye--r">' +
                '<ellipse class="cs-bear-eye-white" cx="85" cy="57" rx="7.2" ry="8.4"/>' +
                '<circle class="cs-bear-pupil" cx="84.4" cy="58" r="4"/>' +
                '<circle class="cs-bear-spark" cx="83" cy="56" r="1.25"/>' +
                '<ellipse class="cs-bear-lid" cx="85" cy="57" rx="7.4" ry="8.6"/>' +
              "</g>" +
            "</g>" +
            '<ellipse class="cs-bear-nose" cx="70" cy="70" rx="6" ry="4.6"/>' +
            '<path class="cs-bear-line" d="M70 74.5 v3.5"/>' +
            '<path class="cs-bear-line" d="M70 78 q-6 5.5 -11 1.2 M70 78 q6 5.5 11 1.2"/>' +
            '<ellipse class="cs-bear-blush" cx="46" cy="75" rx="6.4" ry="3.2"/>' +
            '<ellipse class="cs-bear-blush" cx="94" cy="75" rx="6.4" ry="3.2"/>' +
          "</g>" +
          front +
          /* 举牌：两只手 + 一块小牌子 */
          '<g class="cs-bear-hold">' +
            '<path d="M96 112 Q104 124 95 136" fill="none" stroke="var(--b-fur,#C99A6B)" stroke-width="14" stroke-linecap="round"/>' +
            '<g class="cs-bear-sign">' +
              '<rect class="cs-bear-sign-board" x="35" y="115" width="70" height="32" rx="9"/>' +
              '<path class="cs-bear-sign-pin" d="M35 125 h70" opacity=".12"/>' +
              '<g class="cs-bear-glyph cs-bear-glyph--heart" transform="translate(70 131)"><path d="M0 8 C-9 1 -13.5 -8 -6.6 -12.4 C-2.4 -15 0 -10.6 0 -8.6 C0 -10.6 2.4 -15 6.6 -12.4 C13.5 -8 9 1 0 8 Z"/></g>' +
              '<g class="cs-bear-glyph cs-bear-glyph--star" transform="translate(70 131)"><polygon points="0,-13 3.8,-4.2 13,-4.2 5.6,1.8 8.2,11 0,6 -8.2,11 -5.6,1.8 -13,-4.2 -3.8,-4.2"/></g>' +
              '<g class="cs-bear-glyph cs-bear-glyph--letter" transform="translate(70 131)">' +
                '<rect x="-11" y="-8" width="22" height="16" rx="2.4" fill="none" stroke="var(--b-sign-line,#8A5A32)" stroke-width="2"/>' +
                '<path d="M-11 -6 L0 2 L11 -6" fill="none" stroke="var(--b-sign-line,#8A5A32)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
              "</g>" +
              '<g class="cs-bear-glyph cs-bear-glyph--play" transform="translate(70 131)"><path class="cs-bear-glyph--play" d="M-6 -9 L9 0 L-6 9 Z"/></g>' +
              '<g class="cs-bear-glyph cs-bear-glyph--arrow" transform="translate(70 131)"><path class="cs-bear-glyph--arrow" d="M-10 1 H5 M-1 -6 L6 1 L-1 8"/></g>' +
              '<circle cx="47" cy="142" r="6.2" fill="var(--b-fur,#C99A6B)"/>' +
              '<circle cx="93" cy="142" r="6.2" fill="var(--b-fur,#C99A6B)"/>' +
            "</g>" +
            '<path class="cs-bear-spark" d="M30 96 l1.6 3.6 3.6 1.6 -3.6 1.6 -1.6 3.6 -1.6 -3.6 -3.6 -1.6 3.6 -1.6 Z" opacity=".28"/>' +
            '<path class="cs-bear-spark" d="M112 154 l1.3 3 3 1.3 -3 1.3 -1.3 3 -1.3 -3 -3 -1.3 3 -1.3 Z" opacity=".22"/>' +
          "</g>" +
        "</g>" +
      "</svg>";
  }

  function applyBase(el, opts) {
    el.setAttribute("data-test", "bear");
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("data-outfit", normalizeOutfit(opts.outfit));
    el.setAttribute("data-mood", opts.mood || "peek");
    el.setAttribute("data-glyph", normalizeGlyph(opts.glyph));
    if (opts.reduced) el.setAttribute("data-reduced", "1");
  }

  var ACTION_CLASS = { nod: "is-nod", put: "is-put", wave: "is-wave", happy: "is-happy", blink: "is-blink", ear: "is-ear" };

  function render(opts) {
    opts = opts || {};
    injectStyle();
    var el = document.createElement("div");
    el.className = "cs-bear" + (opts.mood === "idle" ? "" : " cs-bear--in");
    if (opts.className) el.className += " " + opts.className;
    applyBase(el, opts);
    el.innerHTML = svgMarkup(opts);
    return el;
  }

  function html(opts) {
    opts = opts || {};
    var el = render(opts);
    return el.outerHTML;
  }

  function play(el, mood) {
    if (!el || !el.classList) return el;
    mood = String(mood || "idle").toLowerCase();
    el.setAttribute("data-mood", mood);
    if (el.__bearTimer) { clearTimeout(el.__bearTimer); el.__bearTimer = null; }
    if (mood === "peek") {
      el.classList.remove("cs-bear--in");
      void el.offsetWidth;
      el.classList.add("cs-bear--in");
      return el;
    }
    var cls = ACTION_CLASS[mood];
    if (!cls) return el;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    /* put 保持放下后的姿态；其余动作播完回到自然状态 */
    if (mood !== "put") {
      el.__bearTimer = setTimeout(function () {
        el.classList.remove(cls);
        el.__bearTimer = null;
      }, mood === "nod" ? 820 : 1250);
    }
    return el;
  }

  function destroy(el) {
    if (!el) return;
    if (el.__bearTimer) { clearTimeout(el.__bearTimer); el.__bearTimer = null; }
  }

  App.Bear = {
    version: "7.0.0",
    OUTFITS: OUTFITS,
    normalizeOutfit: normalizeOutfit,
    glyphForKind: glyphForKind,
    render: render,
    html: html,
    play: play,
    destroy: destroy,
    CSS: CSS
  };
})();
