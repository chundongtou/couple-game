/* ===== V9.1 core/audio.js：真实拟音 + 环境音乐 + 舒缓纯音乐
 * 口径：docs/v9/impl-freeze.md §2 + V9.1「环境音可以放一些舒缓的纯音乐」。
 * 对外保留 App.Audio.play(name) 等旧 API（见文件底部 API），新增 music 床：
 *   startMusic()/stopMusic()/music()/setMusicLevel()；startAmbience() 会同时起 ambience+music。
 *
 * 结构：采样优先 → 失败时合成回退（构建未接入 assets 也不崩）
 *   voice → 子总线(sfx/music) → master → compressor → soft-limiter → destination
 *   三条子总线 sfx/ambience/music 各有 reverb send（程序化 IR，无外部资源）。
 *   环境：amb-calm / amb-win 无缝 WAV；win/ending 用场景参数变体。
 *   音乐：mus-calm.wav（13.52s / 71BPM / D 大调 / 4 小节无缝）；music 床经独立
 *   musicLevel 增益（默认 0.095，低于 ambience）进 music 总线；win 更亮、ending 降速低通。
 * 资源：assets/audio/*.wav（22.05kHz mono），base 默认按页面路径推导：
 *   生产 index.html 在根 → assets/audio/；app/dev/*.html → ../assets/audio/
 *   可用 window.__AUDIO_BASE__、html[data-audio-base]、?audio= 覆盖。
 * token 表（旧 token 全部保留，映射到采样层）：
 *   tap select flip tick chime coin soft warn error reveal combo act ending
 *   diceShake diceLand hop takeoff fly capture stack heatUp milestone cardIn stamp win safe
 */
(function () {
  var App = (window.App = window.App || {});

  var FILES = {
    tap: "sfx-ui-tap.wav", select: "sfx-ui-select.wav",
    diceShake: "sfx-dice-shake.wav", diceLand: "sfx-dice-land.wav",
    hop: "sfx-hop.wav", takeoff: "sfx-takeoff.wav", fly: "sfx-fly.wav",
    capture: "sfx-capture.wav", stack: "sfx-stack.wav", bear: "sfx-bear.wav",
    card: "sfx-card.wav", stamp: "sfx-stamp.wav", chime: "sfx-chime.wav",
    win: "sfx-win.wav", ambCalm: "amb-calm.wav", ambWin: "amb-win.wav",
    musCalm: "mus-calm.wav"
  };

  /* 层字段：f 文件键 / g 增益dB / r 基准播放率 / d 延迟s / p 声像 / lp 低通(0=无)
     bus: sfx|music / rev reverb send 0..1 / j 额外音高抖动 / v 额外音量抖动dB */
  var LAYERS = {
    tap:      [{ f: "tap", g: 4.2, r: 1, bus: "sfx", j: 0.02, v: 0.8 }],
    select:   [{ f: "select", g: 4.2, r: 1, bus: "sfx", j: 0.02, v: 0.8 }],
    flip:     [{ f: "card", g: -2, r: 1.12, bus: "sfx", lp: 5200 }],
    tick:     [{ f: "tap", g: -5, r: 1.4, bus: "sfx", j: 0.03, v: 0.6 }],
    chime:    [{ f: "chime", g: 1, bus: "sfx", rev: 0.3 }],
    coin:     [{ f: "chime", g: -3, r: 1.32, bus: "sfx", rev: 0.25 }],
    soft:     [{ f: "bear", g: -4, r: 0.92, bus: "sfx", lp: 3000 }],
    warn:     [{ f: "capture", g: -7, r: 0.78, bus: "sfx", lp: 420, rev: 0.1 }],
    error:    [{ f: "capture", g: -8, r: 0.62, bus: "sfx", lp: 300 }],
    reveal:   [{ f: "card", g: -1, rev: 0.2 }, { f: "chime", g: -9, d: 0.06, r: 1.05, rev: 0.3 }],
    combo:    [{ f: "select", g: -3, r: 1.08 }, { f: "chime", g: -8, d: 0.07, r: 1.18, rev: 0.3 }],
    act:      [{ f: "win", g: -3, r: 0.9, bus: "music", lp: 1200, rev: 0.4 }],
    ending:   [{ f: "win", g: -0.5, r: 0.94, bus: "music", rev: 0.35 },
               { f: "chime", g: -11, d: 0.1, r: 0.92, bus: "music", rev: 0.45 }],
    heatUp:   [{ f: "chime", g: -6, r: 1.12, bus: "sfx", rev: 0.3 },
               { f: "chime", g: -12, d: 0.09, r: 1.5, bus: "sfx", rev: 0.35 }],
    diceShake: [{ f: "diceShake", g: 2.6, bus: "sfx", j: 0.04, v: 1.2, rev: 0.12 }],
    diceLand:  [{ f: "diceLand", g: 1, bus: "sfx", j: 0.03, v: 1.0, rev: 0.15 }],
    hop:       [{ f: "hop", g: 2, bus: "sfx", j: 0.06, v: 1.2, rev: 0.12 }],
    takeoff:   [{ f: "takeoff", g: 1, bus: "sfx", j: 0.03, v: 1.0, rev: 0.22 }],
    fly:       [{ f: "fly", g: 1, bus: "sfx", j: 0.04, v: 1.0, rev: 0.25 }],
    capture:   [{ f: "capture", g: 1.5, bus: "sfx", j: 0.03, v: 1.2, rev: 0.18 }],
    stack:     [{ f: "stack", g: 1, bus: "sfx", j: 0.05, v: 1.2, rev: 0.15 }],
    bear:      [{ f: "bear", g: 2.1, bus: "sfx", j: 0.05, v: 1.0, rev: 0.15 }],
    cardIn:    [{ f: "card", g: 1, bus: "sfx", j: 0.04, v: 1.0, rev: 0.16 }],
    stamp:     [{ f: "stamp", g: 1.5, bus: "sfx", j: 0.02, v: 1.0, rev: 0.2 }],
    milestone: [{ f: "win", g: 0, r: 1.18, bus: "music", rev: 0.35 }],
    win:       [{ f: "win", g: 1, bus: "music", rev: 0.35 }],
    safe:      [{ f: "chime", g: -1, r: 0.8, lp: 2200, bus: "music", rev: 0.4 }]
  };
  var TOKENS = Object.keys(LAYERS);

  var VOL = { master: 0.85, sfx: 0.95, ambience: 0.20, music: 0.85, musicLevel: 0.095 };
  var SCENES = {
    calm:   { file: "ambCalm", level: 1.0, lp: 4200, rate: 1.0 },
    win:    { file: "ambWin", level: 0.92, lp: 7200, rate: 1.0 },
    ending: { file: "ambWin", level: 0.78, lp: 1500, rate: 0.94 }
  };
  /* 音乐床：单条 13.52s 循环，win/ending 用同一素材做“变体”（更亮/降速低通），
     不额外增加素材体积。musicLevel 是床级增益，低于 ambience；music 总线 0.85
     仍保留给 win/ending/milestone 等旧 stinger，避免破坏既有响度。 */
  var MUSIC = {
    file: "musCalm", fade: 2.8,
    scenes: {
      calm:   { level: 1.0,  lp: 5200, rate: 1.0 },
      win:    { level: 1.12, lp: 9200, rate: 1.0 },
      ending: { level: 0.86, lp: 1500, rate: 0.94 }
    }
  };

  var ctx = null, chain = null, enabled = true, supported = !!(window.AudioContext || window.webkitAudioContext);
  var buffers = {}, failed = {}, loading = {}, loadWarned = false, preloaded = false;
  var active = 0, MAX_ACTIVE = 20;
  var amb = { wanted: false, scene: "calm", nodes: null, pending: false };
  var mus = { wanted: false, nodes: null, pending: false };
  var listeners = {};

  function noop() {}
  function now() { return ctx ? ctx.currentTime : 0; }
  function db(v) { return Math.pow(10, v / 20); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rnd(a) { return (Math.random() * 2 - 1) * a; }
  function emit(name, data) {
    var arr = listeners[name];
    if (!arr) return;
    for (var i = 0; i < arr.length; i++) { try { arr[i](data); } catch (e) {} }
  }

  function basePath() {
    if (typeof window.__AUDIO_BASE__ === "string") return window.__AUDIO_BASE__;
    var q = /[?&]audio=([^&]+)/.exec(location.search || "");
    if (q) { try { return decodeURIComponent(q[1]); } catch (e) {} }
    var el = document.documentElement && document.documentElement.getAttribute("data-audio-base");
    if (el) return el;
    try {
      if (App.Audio && App.Audio._base) return App.Audio._base;
    } catch (e) {}
    return /\/dev\//.test(location.pathname || "") ? "../assets/audio/" : "assets/audio/";
  }

  /* ---------- 音频图 ---------- */
  function softClipCurve(n) {
    var c = new Float32Array(n), k = 1.35;
    for (var i = 0; i < n; i++) {
      var x = (i * 2) / (n - 1) - 1;
      c[i] = Math.tanh(k * x) / Math.tanh(k) * 0.985;
    }
    return c;
  }

  function impulse(ac) {
    var len = Math.floor(ac.sampleRate * 1.1), ch = 2;
    var b = ac.createBuffer(ch, len, ac.sampleRate);
    for (var c = 0; c < ch; c++) {
      var d = b.getChannelData(c);
      for (var i = 0; i < len; i++) {
        var env = Math.pow(1 - i / len, 3.1);
        d[i] = (Math.random() * 2 - 1) * env * (i < 48 ? i / 48 : 1);
      }
    }
    return b;
  }

  function makeChain(ac, dest) {
    var master = ac.createGain(); master.gain.value = VOL.master;
    var comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 6; comp.ratio.value = 8;
    comp.attack.value = 0.004; comp.release.value = 0.22;
    var limiter = ac.createWaveShaper();
    limiter.curve = softClipCurve(2048); limiter.oversample = "4x";
    var out = ac.createGain(); out.gain.value = 0.92;
    master.connect(comp); comp.connect(limiter); limiter.connect(out); out.connect(dest);

    var reverb = ac.createConvolver();
    try { reverb.buffer = impulse(ac); } catch (e) {}
    var revRet = ac.createGain(); revRet.gain.value = 0.7;
    reverb.connect(revRet); revRet.connect(master);

    function bus(level, send) {
      var g = ac.createGain(); g.gain.value = level;
      var s = ac.createGain(); s.gain.value = send;
      g.connect(master); g.connect(s); s.connect(reverb);
      return g;
    }
    return {
      ac: ac, master: master, reverb: reverb,
      sfx: bus(VOL.sfx, 0.15), ambience: bus(VOL.ambience, 0.07), music: bus(VOL.music, 0.26),
      duck: ac.createGain()
    };
  }

  function ensure() {
    if (ctx) return ctx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      chain = makeChain(ctx, ctx.destination);
      chain.master.gain.value = enabled ? VOL.master : 0.0001;
      chain.duck.gain.value = 1;
      chain.duck.connect(chain.ambience);
      /* 环境源 → duck → ambience 总线 */
    } catch (e) { ctx = null; }
    return ctx;
  }

  function resume() {
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        var p = ctx.resume();
        if (p && p.then) p.then(function () { emit("state", ctx && ctx.state); }, noop);
      } catch (e) {}
    }
  }

  /* ---------- 采样加载 ---------- */
  function emitLoadError(file, err) {
    failed[file] = String((err && err.message) || err);
    emit("error", { file: file, error: failed[file] });
    if (!loadWarned) {
      loadWarned = true;
      if (window.console) console.warn("[audio] 采样不可用，使用合成回退（assets/audio/ 未随构建产出？）", failed[file]);
    }
  }

  function load(file) {
    var name = FILES[file] || file;
    if (buffers[file]) return Promise.resolve(buffers[file]);
    if (loading[file]) return loading[file];
    var c = ensure();
    if (!c) return Promise.reject(new Error("no-audio-context"));
    loading[file] = fetch(basePath() + name)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.arrayBuffer();
      })
      .then(function (ab) {
        return new Promise(function (res, rej) {
          try { c.decodeAudioData(ab, res, rej); } catch (e) { rej(e); }
        });
      })
      .then(function (b) {
        buffers[file] = b;
        emit("load", { file: file, duration: b.duration, sampleRate: b.sampleRate });
        return b;
      })["catch"](function (e) { emitLoadError(file, e); throw e; });
    return loading[file];
  }

  function loadQuiet(file) { return load(file)["catch"](noop); }

  /* ---------- 采样播放 ---------- */
  function startVoice(c, ch, buf, layer, at) {
    var src = c.createBufferSource();
    src.buffer = buf;
    var jit = layer.j == null ? 0.035 : layer.j;
    var rate = clamp((layer.r || 1) * (1 + rnd(jit)), 0.4, 2.5);
    src.playbackRate.value = rate;
    var g = c.createGain();
    var vj = layer.v == null ? 1.0 : layer.v;
    g.gain.value = db((layer.g || 0) + rnd(vj));
    var pan = layer.p == null ? 0 : layer.p;
    var p = c.createStereoPanner ? c.createStereoPanner() : null;
    if (p) p.pan.value = clamp(pan + rnd(layer.pj == null ? 0.18 : layer.pj), -1, 1);
    var tail = p || g;
    src.connect(g);
    if (p) { g.connect(p); }
    var f = null;
    if (layer.lp) {
      f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = layer.lp; f.Q.value = 0.7;
      tail.connect(f); tail = f;
    }
    tail.connect(layer.bus === "music" ? ch.music : ch.sfx);
    if (layer.rev) {
      var s = c.createGain(); s.gain.value = layer.rev;
      tail.connect(s); s.connect(ch.reverb);
    }
    var t0 = at + (layer.d || 0);
    try { src.start(t0); } catch (e) { return; }
    active++;
    src.onended = function () { active--; try { src.disconnect(); g.disconnect(); if (p) p.disconnect(); if (f) f.disconnect(); } catch (e) {} };
  }

  /* ---------- 合成回退（资源未就绪/404 时保证仍有声音） ---------- */
  function synthVoice(name, at) {
    var c = ensure(); if (!c) return;
    var ch = chain;
    function osc(freq, dur, type, vol, slide, delay) {
      var t0 = at + (delay || 0);
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(freq, t0);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + Math.min(0.02, dur / 3));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(ch.sfx); o.start(t0); o.stop(t0 + dur + 0.02);
      active++;
      o.onended = function () { active--; try { o.disconnect(); g.disconnect(); } catch (e) {} };
    }
    function noise(dur, vol, freq, q, delay) {
      var len = Math.max(1, Math.floor(c.sampleRate * dur));
      var b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      var s = c.createBufferSource(); s.buffer = b;
      var f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq || 1200; f.Q.value = q || 0.8;
      var g = c.createGain(); g.gain.value = vol || 0.08;
      s.connect(f); f.connect(g); g.connect(ch.sfx); s.start(at + (delay || 0));
      active++;
      s.onended = function () { active--; try { s.disconnect(); f.disconnect(); g.disconnect(); } catch (e) {} };
    }
    var n = name;
    if (n === "diceShake") { for (var i = 0; i < 6; i++) noise(0.05, 0.035, 2200 + (i % 3) * 400, 1.4, i * 0.06); }
    else if (n === "diceLand") { osc(150, 0.12, "sine", 0.10, 90); noise(0.12, 0.05, 600, 0.7, 0.01); }
    else if (n === "hop") osc(700, 0.06, "triangle", 0.045, 900);
    else if (n === "takeoff" || n === "fly") { osc(300, 0.28, "sine", 0.06, 900); noise(0.25, 0.03, 1600, 0.8, 0.04); }
    else if (n === "capture") { osc(200, 0.24, "sine", 0.09, 80); noise(0.2, 0.06, 700, 0.7); }
    else if (n === "stack") { osc(523, 0.1, "triangle", 0.05); osc(784, 0.14, "triangle", 0.04, 0, 0.07); }
    else if (n === "bear" || n === "soft") { noise(0.28, 0.05, 900, 0.5); osc(420, 0.16, "sine", 0.03, 470); }
    else if (n === "card" || n === "cardIn" || n === "flip") { noise(0.18, 0.05, 1700, 0.9); osc(523, 0.1, "sine", 0.03, 0, 0.02); }
    else if (n === "stamp") { osc(120, 0.14, "sine", 0.09, 70); noise(0.13, 0.06, 500, 0.6); }
    else if (n === "chime" || n === "coin" || n === "safe") { osc(880, 0.3, "sine", 0.06); osc(1320, 0.36, "sine", 0.04, 0, 0.08); }
    else if (n === "win" || n === "ending" || n === "milestone" || n === "act") {
      osc(392, 0.3, "sine", 0.06); osc(523, 0.3, "sine", 0.055, 0, 0.1); osc(659, 0.42, "sine", 0.05, 0, 0.2); osc(784, 0.5, "sine", 0.04, 0, 0.32);
    }
    else if (n === "warn") osc(220, 0.18, "triangle", 0.05, 150);
    else if (n === "error") osc(170, 0.2, "triangle", 0.045, 110);
    else if (n === "reveal" || n === "combo") { osc(660, 0.14, "triangle", 0.045); osc(990, 0.2, "triangle", 0.04, 0, 0.07); }
    else osc(520, 0.06, "sine", 0.05);
  }

  /* ---------- 环境 ---------- */
  function spawnAmbience(buf, sc) {
    var c = ctx, t = now();
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    var lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = sc.lp; lp.Q.value = 0.5;
    g.connect(lp); lp.connect(chain.duck);
    var srcs = [];
    function voice(pan, delayMs) {
      var s = c.createBufferSource(); s.buffer = buf; s.loop = true;
      s.playbackRate.value = sc.rate;
      var p = c.createStereoPanner ? c.createStereoPanner() : null;
      var gg = c.createGain(); gg.gain.value = 0.55;
      var tail = gg;
      s.connect(gg);
      if (delayMs) {
        var d = c.createDelay(0.1); d.delayTime.value = delayMs / 1000;
        gg.connect(d); tail = d;
      }
      if (p) { p.pan.value = pan; tail.connect(p); tail = p; }
      tail.connect(g);
      try { s.start(t); } catch (e) {}
      srcs.push(s);
    }
    voice(-0.35, 0);
    voice(0.35, 13);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, sc.level), t + 2.4);
    amb.nodes = { g: g, lp: lp, srcs: srcs, buf: buf, sc: sc };
    amb.pending = false;
    emit("ambience", ambienceState());
  }

  function synthAmbience(sc) {
    var c = ctx;
    var dur = 4, n = Math.floor(c.sampleRate * dur);
    var b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    var twoPi = Math.PI * 2;
    for (var i = 0; i < n; i++) {
      var t = i / c.sampleRate;
      var s = Math.sin(twoPi * 55 * t) * 0.05 + Math.sin(twoPi * 110 * t) * 0.03
            + Math.sin(twoPi * 220 * t) * 0.014 + Math.sin(twoPi * 330 * t) * 0.006;
      s += (Math.random() * 2 - 1) * 0.012 * (0.7 + 0.3 * Math.sin(twoPi * 0.125 * t));
      s += (Math.sin(twoPi * 146.75 * t) + 0.5 * Math.sin(twoPi * 220 * t)) * 0.004;
      d[i] = s;
    }
    /* 无缝：把尾部 f 样本交叉淡入头部，生成长度 n-f 的循环（接缝处连续） */
    var f = Math.floor(c.sampleRate * 0.04), m = n - f;
    var b2 = c.createBuffer(1, m, c.sampleRate), out = b2.getChannelData(0);
    for (var k = 0; k < m; k++) out[k] = d[k];
    for (var j = 0; j < f; j++) {
      var w = j / f;
      out[j] = d[j] * w + d[m + j] * (1 - w);
    }
    try { sfxLoop(b2, sc, true); } catch (e) {}
  }

  function sfxLoop(buf, sc, synthesized) {
    var c = ctx, t = now();
    var g = c.createGain(); g.gain.setValueAtTime(0.0001, t);
    var lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = sc.lp;
    g.connect(lp); lp.connect(chain.duck);
    var s = c.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = sc.rate;
    s.connect(g);
    try { s.start(t); } catch (e) {}
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, sc.level), t + 2.4);
    amb.nodes = { g: g, lp: lp, srcs: [s], buf: buf, sc: sc, synthesized: !!synthesized };
    amb.pending = false;
    emit("ambience", ambienceState());
  }

  function fadeOutNodes(nodes, ms) {
    if (!ctx || !nodes) return;
    var t = now(), f = (ms || 500) / 1000;
    try {
      nodes.g.gain.cancelScheduledValues(t);
      nodes.g.gain.setValueAtTime(Math.max(0.0001, nodes.g.gain.value), t);
      nodes.g.gain.exponentialRampToValueAtTime(0.0001, t + f);
    } catch (e) {}
    setTimeout(function () {
      try {
        for (var i = 0; i < nodes.srcs.length; i++) nodes.srcs[i].stop();
      } catch (e) {}
      try { nodes.g.disconnect(); nodes.lp.disconnect(); } catch (e) {}
    }, f * 1000 + 60);
  }

  function startAmbience(opts) {
    amb.wanted = true;
    mus.wanted = true;
    if (opts && opts.scene) amb.scene = SCENES[opts.scene] ? opts.scene : "calm";
    if (!enabled || document.hidden) return;
    var c = ensure(); if (!c) return;
    resume();
    startMusic();
    if (amb.nodes) { applyScene(); return; }
    if (amb.pending) return;
    var sc = SCENES[amb.scene] || SCENES.calm;
    if (buffers[sc.file]) { spawnAmbience(buffers[sc.file], sc); return; }
    amb.pending = true;
    load(sc.file).then(function (b) {
      if (!amb.wanted || amb.nodes) { amb.pending = false; return; }
      spawnAmbience(b, SCENES[amb.scene] || SCENES.calm);
    })["catch"](function () {
      amb.pending = false;
      if (!amb.wanted || amb.nodes) return;
      try { synthAmbience(SCENES[amb.scene] || SCENES.calm); } catch (e) { amb.pending = false; }
    });
  }

  function stopAmbience(ms) {
    amb.wanted = false;
    var nodes = amb.nodes;
    amb.nodes = null;
    if (nodes) fadeOutNodes(nodes, ms == null ? 600 : ms);
    stopMusic(ms);
    emit("ambience", ambienceState());
  }

  function applyScene() {
    applyMusicScene();
    if (!amb.nodes) return;
    var sc = SCENES[amb.scene] || SCENES.calm;
    var t = now();
    try {
      amb.nodes.lp.frequency.cancelScheduledValues(t);
      amb.nodes.lp.frequency.setTargetAtTime(sc.lp, t, 0.25);
      var lv = Math.max(0.0002, sc.level);
      amb.nodes.g.gain.cancelScheduledValues(t);
      amb.nodes.g.gain.setTargetAtTime(lv, t, 0.35);
    } catch (e) {}
  }

  function setScene(name) {
    if (!name || !SCENES[name]) return;
    var changed = name !== amb.scene;
    amb.scene = name;
    applyMusicScene();
    if (!amb.nodes) return;
    if (!changed) { applyScene(); return; }
    var old = amb.nodes;
    amb.nodes = null;
    fadeOutNodes(old, 700);
    setTimeout(function () {
      if (amb.wanted && !amb.nodes && enabled && !document.hidden) startAmbience();
    }, 240);
  }

  function duck(amount) {
    if (!ctx || !chain || !amb.nodes) return;
    var t = now();
    try {
      chain.duck.gain.cancelScheduledValues(t);
      chain.duck.gain.setTargetAtTime(amount, t, 0.04);
      chain.duck.gain.setTargetAtTime(1, t + 0.16, 0.22);
    } catch (e) {}
  }

  function ambienceState() {
    return {
      wanted: amb.wanted, scene: amb.scene, playing: !!amb.nodes,
      synthesized: !!(amb.nodes && amb.nodes.synthesized)
    };
  }

  /* ---------- 舒缓纯音乐床 ---------- */
  function musicScene() {
    var sc = MUSIC.scenes[amb.scene] || MUSIC.scenes.calm;
    return { level: Math.max(0.0002, VOL.musicLevel * sc.level), lp: sc.lp, rate: sc.rate };
  }

  function spawnMusic(buf, synthesized) {
    var c = ctx, t = now();
    var sc = musicScene();
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    var lp = c.createBiquadFilter(); lp.type = "lowpass";
    lp.frequency.value = sc.lp; lp.Q.value = 0.55;
    g.connect(lp); lp.connect(chain.music);
    var s = c.createBufferSource();
    s.buffer = buf; s.loop = true; s.playbackRate.value = sc.rate;
    s.connect(g);
    try { s.start(t); } catch (e) { return; }
    try { g.gain.exponentialRampToValueAtTime(Math.max(0.0002, sc.level), t + MUSIC.fade); } catch (e) {}
    mus.nodes = { g: g, lp: lp, srcs: [s], buf: buf, synthesized: !!synthesized };
    emit("music", musicState());
  }

  /* 资源 404/解码失败时的合成回退：8s 纯音铺底（整数周期，循环无缝）。 */
  function synthMusic() {
    var c = ctx; if (!c) return;
    var dur = 8, n = Math.floor(c.sampleRate * dur);
    var b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    var twoPi = Math.PI * 2;
    var tones = [146.83, 220.0, 293.66, 369.99, 440.0, 554.37, 659.25];
    var fr = [];
    for (var i = 0; i < tones.length; i++) fr.push(Math.round(tones[i] * dur) / dur);
    for (var j = 0; j < n; j++) {
      var t = j / c.sampleRate, s = 0;
      for (var k = 0; k < fr.length; k++) {
        var amp = k < 4 ? 0.020 : 0.010;
        s += Math.sin(twoPi * fr[k] * t + k * 0.73) * amp;
        s += Math.sin(twoPi * fr[k] * 2 * t + k * 1.31) * amp * 0.24;
      }
      var lfo = 0.72 + 0.28 * Math.sin(twoPi * (4 / dur) * t);
      d[j] = s * lfo;
    }
    spawnMusic(b, true);
  }

  function startMusic() {
    mus.wanted = true;
    if (!enabled || document.hidden) return;
    var c = ensure(); if (!c) return;
    resume();
    if (mus.nodes) { applyMusicScene(); return; }
    if (mus.pending) return;
    if (buffers[MUSIC.file]) { spawnMusic(buffers[MUSIC.file]); return; }
    mus.pending = true;
    load(MUSIC.file).then(function (b) {
      mus.pending = false;
      if (!mus.wanted || mus.nodes || !enabled || document.hidden) return;
      spawnMusic(b);
    })["catch"](function () {
      mus.pending = false;
      if (!mus.wanted || mus.nodes || !enabled || document.hidden) return;
      try { synthMusic(); } catch (e) { emit("music", musicState()); }
    });
  }

  function stopMusic(ms) {
    mus.wanted = false;
    var nodes = mus.nodes;
    mus.nodes = null;
    if (nodes) fadeOutNodes(nodes, ms == null ? 600 : ms);
    emit("music", musicState());
  }

  function applyMusicScene() {
    if (!mus.nodes) return;
    var sc = musicScene(), t = now();
    try {
      mus.nodes.lp.frequency.cancelScheduledValues(t);
      mus.nodes.lp.frequency.setTargetAtTime(sc.lp, t, 0.30);
      mus.nodes.g.gain.cancelScheduledValues(t);
      mus.nodes.g.gain.setTargetAtTime(Math.max(0.0002, sc.level), t, 0.35);
      var s = mus.nodes.srcs[0];
      s.playbackRate.cancelScheduledValues(t);
      s.playbackRate.setTargetAtTime(sc.rate, t, 0.40);
    } catch (e) {}
  }

  function musicState() {
    var sc = MUSIC.scenes[amb.scene] || MUSIC.scenes.calm;
    return {
      wanted: mus.wanted, playing: !!mus.nodes, pending: mus.pending,
      scene: amb.scene, file: MUSIC.file, loop: true,
      level: VOL.musicLevel * sc.level, rate: sc.rate, lp: sc.lp,
      synthesized: !!(mus.nodes && mus.nodes.synthesized),
      duration: mus.nodes && mus.nodes.buf ? mus.nodes.buf.duration : 0
    };
  }

  function setMusicLevel(v) {
    VOL.musicLevel = clamp(Number(v) || 0, 0, 2);
    applyMusicScene();
    return VOL.musicLevel;
  }

  /* ---------- 对外 ---------- */
  function play(name) {
    if (!enabled) return false;
    var layers = LAYERS[name];
    if (!layers) return false;
    var c = ensure(); if (!c) return false;
    resume();
    var at = c.currentTime + 0.004;
    var played = 0;
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      if (layer.bus !== "music" && active > MAX_ACTIVE) continue;
      var buf = buffers[layer.f];
      if (buf) { startVoice(c, chain, buf, layer, at); played++; }
      else loadQuiet(layer.f);
    }
    if (!played) synthVoice(name, at);
    if (name === "win" || name === "milestone") setScene("win");
    else if (name === "ending") setScene("ending");
    else if (name === "safe") setScene("calm");
    if (amb.nodes) duck(0.72);
    return true;
  }

  function unlock() {
    var c = ensure();
    if (!c) return;
    resume();
    if (!preloaded) { preloaded = true; setTimeout(function () { preload(); }, 40); }
    if (amb.wanted && !amb.nodes && !amb.pending) startAmbience();
    if (mus.wanted && !mus.nodes && !mus.pending) startMusic();
    emit("state", c.state);
  }

  function preload() {
    var order = ["tap", "select", "diceShake", "diceLand", "cardIn", "stamp", "chime",
                 "hop", "takeoff", "fly", "capture", "stack", "bear", "win"];
    var p = Promise.resolve();
    for (var i = 0; i < order.length; i++) {
      (function (name) {
        p = p.then(function () {
          var layers = LAYERS[name] || [], fs = [], seen = {};
          for (var k = 0; k < layers.length; k++) {
            var f = layers[k].f;
            if (!seen[f] && !buffers[f]) { seen[f] = 1; fs.push(loadQuiet(f)); }
          }
          return Promise.all(fs);
        });
      })(order[i]);
    }
    return p.then(function () { return publicState(); });
  }

  function setEnabled(on) {
    enabled = !!on;
    if (!ctx) return;   /* 未解锁前只记状态：不提前创建 AudioContext（避免自动播放警告） */
    var t = now();
    try {
      chain.master.gain.cancelScheduledValues(t);
      chain.master.gain.setTargetAtTime(enabled ? VOL.master : 0.0001, t, 0.05);
    } catch (e) {}
    if (enabled) {
      resume();
      if (amb.wanted && !amb.nodes) startAmbience();
      if (mus.wanted && !mus.nodes) startMusic();
    } else {
      /* 关声音：停掉环境/音乐源但保留“想开”的意图，重新打开时恢复 */
      if (amb.nodes) {
        var nodes = amb.nodes;
        amb.nodes = null;
        fadeOutNodes(nodes, 300);
      }
      if (mus.nodes) {
        var m = mus.nodes;
        mus.nodes = null;
        fadeOutNodes(m, 300);
      }
      emit("music", musicState());
    }
  }

  function setVolumes(v) {
    if (!v) return;
    for (var k in v) {
      if (v.hasOwnProperty(k) && VOL.hasOwnProperty(k)) VOL[k] = clamp(Number(v[k]) || 0, 0, 2);
    }
    if (!chain) return;
    var t = now();
    try {
      chain.master.gain.setTargetAtTime(enabled ? VOL.master : 0.0001, t, 0.06);
      chain.sfx.gain.setTargetAtTime(VOL.sfx, t, 0.06);
      chain.ambience.gain.setTargetAtTime(VOL.ambience, t, 0.06);
      chain.music.gain.setTargetAtTime(VOL.music, t, 0.06);
      applyMusicScene();
    } catch (e) {}
  }

  function publicState() {
    return {
      base: basePath(), enabled: enabled, supported: supported,
      ctxState: ctx ? ctx.state : "none",
      sampleRate: ctx ? ctx.sampleRate : 0,
      loaded: Object.keys(buffers),
      failed: Object.keys(failed),
      active: active,
      ambience: ambienceState(),
      music: musicState(),
      volumes: { master: VOL.master, sfx: VOL.sfx, ambience: VOL.ambience, music: VOL.music, musicLevel: VOL.musicLevel },
      files: FILES
    };
  }

  /* ---------- QA：离线渲染（试听页/自测用） ---------- */
  function render(tokens, seconds, wantPeaks) {
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC || !ctx) return Promise.reject(new Error("offline-unavailable"));
    var dur = clamp(Number(seconds) || 2, 0.2, 8);
    var oc = new OAC(2, Math.ceil(dur * 48000), 48000);
    var ch = makeChain(oc, oc.destination);
    ch.duck.gain.value = 1;
    var list = [].concat(tokens || []);
    var at = 0.02;
    for (var i = 0; i < list.length; i++) {
      var layers = LAYERS[list[i]] || [];
      for (var k = 0; k < layers.length; k++) {
        var buf = buffers[layers[k].f];
        if (buf) startVoice(oc, ch, buf, layers[k], at);
      }
      at += 0.01;
    }
    return oc.startRendering().then(function (rendered) {
      var peak = 0, sum = 0, n = rendered.length * rendered.numberOfChannels;
      var buckets = 600, pk = [];
      for (var b = 0; b < buckets; b++) pk.push(0);
      for (var c = 0; c < rendered.numberOfChannels; c++) {
        var d = rendered.getChannelData(c);
        for (var j = 0; j < d.length; j++) {
          var a = d[j] < 0 ? -d[j] : d[j];
          if (a > peak) peak = a;
          sum += d[j] * d[j];
          var bi = Math.floor(j / d.length * buckets);
          if (a > pk[bi]) pk[bi] = a;
        }
      }
      active = 0;
      return {
        tokens: list, seconds: dur, peak: peak,
        peakDbfs: 20 * Math.log10(peak + 1e-12),
        rmsDbfs: 20 * Math.log10(Math.sqrt(sum / n) + 1e-12),
        clipped: peak >= 1.0,
        peaks: wantPeaks ? pk : null
      };
    });
  }

  /* ---------- QA：music 混音离线渲染（试听页/自测用） ----------
     opts = { seconds, music:true, ambience:false, scene:'calm', sfx:[], seam:true }
     走与实机相同的 makeChain（compressor + 软限幅），music 走 music 总线。 */
  function renderMix(opts) {
    opts = opts || {};
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC || !ctx) return Promise.reject(new Error("offline-unavailable"));
    var withMusic = opts.music !== false;
    if (withMusic && !buffers[MUSIC.file]) return Promise.reject(new Error("music-not-loaded"));
    var dur = clamp(Number(opts.seconds) || 14, 1, 30);
    var sceneName = opts.scene && SCENES[opts.scene] ? opts.scene : "calm";
    var msc = MUSIC.scenes[sceneName] || MUSIC.scenes.calm;
    var oc = new OAC(2, Math.ceil(dur * 48000), 48000);
    var ch = makeChain(oc, oc.destination);
    ch.duck.gain.value = 1;
    try { ch.duck.connect(ch.ambience); } catch (e) {}   /* makeChain 未接；ensure() 才接 */
    var musicBuf = buffers[MUSIC.file];
    if (withMusic) {
      var mg = oc.createGain();
      mg.gain.value = VOL.musicLevel * msc.level;
      var mlp = oc.createBiquadFilter();
      mlp.type = "lowpass"; mlp.frequency.value = msc.lp; mlp.Q.value = 0.55;
      var msrc = oc.createBufferSource();
      msrc.buffer = musicBuf; msrc.loop = true; msrc.playbackRate.value = msc.rate;
      msrc.connect(mg); mg.connect(mlp); mlp.connect(ch.music);
      try { msrc.start(0); } catch (e) {}
    }
    if (opts.ambience) {
      var asc = SCENES[sceneName] || SCENES.calm;
      var abuf = buffers[asc.file] || buffers.ambCalm;
      if (abuf) {
        var ag = oc.createGain(); ag.gain.value = asc.level;
        var alp = oc.createBiquadFilter();
        alp.type = "lowpass"; alp.frequency.value = asc.lp; alp.Q.value = 0.5;
        ag.connect(alp); alp.connect(ch.duck);
        var addAmb = function (pan, delayMs) {
          var s = oc.createBufferSource();
          s.buffer = abuf; s.loop = true; s.playbackRate.value = asc.rate;
          var gg = oc.createGain(); gg.gain.value = 0.55;
          var tail = gg; s.connect(gg);
          if (delayMs) {
            var dl = oc.createDelay(0.1); dl.delayTime.value = delayMs / 1000;
            gg.connect(dl); tail = dl;
          }
          var p = oc.createStereoPanner ? oc.createStereoPanner() : null;
          if (p) { p.pan.value = pan; tail.connect(p); tail = p; }
          tail.connect(ag);
          try { s.start(0); } catch (e) {}
        };
        addAmb(-0.35, 0);
        addAmb(0.35, 13);
      }
    }
    var list = [].concat(opts.sfx || []);
    var together = !!opts.sfxTogether;
    var at = 0.40;
    for (var i = 0; i < list.length; i++) {
      var layers = LAYERS[list[i]] || [];
      for (var k = 0; k < layers.length; k++) {
        var b = buffers[layers[k].f];
        if (b) startVoice(oc, ch, b, layers[k], at);
      }
      if (!together) at += 0.90;
    }
    return oc.startRendering().then(function (rendered) {
      var peak = 0, sum = 0, n = rendered.length * rendered.numberOfChannels;
      var buckets = 700, pk = [];
      for (var x = 0; x < buckets; x++) pk.push(0);
      var d0 = rendered.getChannelData(0);
      for (var c = 0; c < rendered.numberOfChannels; c++) {
        var d = rendered.getChannelData(c);
        for (var j = 0; j < d.length; j++) {
          var a = d[j] < 0 ? -d[j] : d[j];
          if (a > peak) peak = a;
          sum += d[j] * d[j];
          var bi = Math.floor(j / d.length * buckets);
          if (a > pk[bi]) pk[bi] = a;
        }
      }
      var seam = null;
      if (withMusic && opts.seam !== false && dur > musicBuf.duration) {
        var li = Math.round(musicBuf.duration * 48000);
        if (li > 32 && li < d0.length - 32) {
          var jump = 0, second = 0;
          for (var q = li - 24; q <= li + 24; q++) {
            var jm = d0[q] < 0 ? -d0[q] : d0[q];
            var prev = d0[q - 1] < 0 ? -d0[q - 1] : d0[q - 1];
            if (Math.abs(jm - prev) > jump) jump = Math.abs(jm - prev);
            if (q > 0 && q < d0.length - 1) {
              var sd = Math.abs(d0[q + 1] - 2 * d0[q] + d0[q - 1]);
              if (sd > second) second = sd;
            }
          }
          var arr = [];
          for (var r = 2; r < d0.length - 2; r += 7) {
            arr.push(Math.abs(d0[r + 1] - 2 * d0[r] + d0[r - 1]));
          }
          arr.sort(function (a, b) { return a - b; });
          var p999 = arr.length ? arr[Math.min(arr.length - 1, Math.floor(arr.length * 0.999))] : 0;
          seam = {
            atSec: musicBuf.duration, jump: jump,
            jumpDbfs: 20 * Math.log10(jump + 1e-12),
            second: second, secondP999: p999,
            verdict: second <= Math.max(p999 * 1.5, 1e-4) ? "PASS" : "CHECK"
          };
        }
      }
      active = 0;
      return {
        tokens: list, seconds: dur, peak: peak,
        peakDbfs: 20 * Math.log10(peak + 1e-12),
        rmsDbfs: 20 * Math.log10(Math.sqrt(sum / n) + 1e-12),
        clipped: peak >= 1.0,
        peaks: pk,
        music: withMusic, ambience: !!opts.ambience, scene: sceneName,
        loopSec: withMusic ? musicBuf.duration : 0, seam: seam
      };
    });
  }

  /* ---------- 首次手势 / 可见性 / 路由 ---------- */
  var armed = false;
  function arm() {
    armed = true;
    unlock();
  }
  try {
    document.addEventListener("pointerdown", arm, true);
    document.addEventListener("touchstart", arm, true);
    document.addEventListener("keydown", arm, true);
  } catch (e) {}

  var visTimer = 0;
  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    clearTimeout(visTimer);
    if (document.hidden) {
      visTimer = setTimeout(function () {
        if (document.hidden) { try { ctx.suspend(); } catch (e) {} }
      }, 60);
    } else if (enabled) {
      resume();
      /* 快速切换可见性时 resume/suspend 可能交错，稍后补一次 resume */
      visTimer = setTimeout(function () {
        if (!document.hidden && enabled && ctx && ctx.state === "suspended") resume();
      }, 160);
      if (amb.wanted && !amb.nodes && !amb.pending) startAmbience();
      if (mus.wanted && !mus.nodes && !mus.pending) startMusic();
    }
    emit("state", ctx.state);
  });

  function route(name) {
    if (name === "table") {
      if (!amb.wanted) amb.scene = "calm";   /* 新一晚回到 calm；同一局保持 win/ending */
      startAmbience();
    } else { amb.scene = "calm"; stopAmbience(500); }
  }
  if (App.Bus && App.Bus.on) {
    App.Bus.on("route", function (e) { if (e && e.name) route(e.name); });
  }

  App.Audio = {
    version: "9.1.0",
    tokens: TOKENS,
    files: FILES,
    _base: null,
    base: basePath,
    setBase: function (p) { this._base = p || null; },
    play: play,
    unlock: unlock,
    setEnabled: setEnabled,
    enabled: function () { return enabled; },
    startAmbience: startAmbience,
    stopAmbience: stopAmbience,
    setScene: setScene,
    scene: function () { return amb.scene; },
    ambience: ambienceState,
    startMusic: startMusic,
    stopMusic: stopMusic,
    music: musicState,
    setMusicLevel: setMusicLevel,
    setVolumes: setVolumes,
    preload: preload,
    state: publicState,
    debug: publicState,
    render: render,
    renderMix: renderMix,
    on: function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); },
    off: function (name, fn) {
      if (!listeners[name]) return;
      listeners[name] = listeners[name].filter(function (f) { return f !== fn; });
    }
  };
})();
