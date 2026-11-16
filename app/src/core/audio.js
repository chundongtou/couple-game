/* ===== V6 core/audio.js：WebAudio 合成音效（零资源）
   名字口径：docs/v6/impl-freeze.md §3.5。其他模块只调 App.Audio.play(name)。
   旧 token：tap select flip tick chime coin soft warn error reveal combo act ending
   新 token：diceShake diceLand hop takeoff fly capture stack heatUp milestone cardIn stamp win safe */
(function () {
  var App = (window.App = window.App || {});
  var ctx = null;
  var enabled = true;

  function ensure() {
    if (ctx) return ctx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch (e) { ctx = null; }
    return ctx;
  }

  function tone(freq, dur, type, vol, delay, slideTo) {
    if (!enabled) return;
    var c = ensure();
    if (!c) return;
    if (c.state === "suspended") { try { c.resume(); } catch (e) {} }
    try {
      var t0 = c.currentTime + (delay || 0);
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol || 0.12), t0 + Math.min(0.02, dur / 3));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) {}
  }

  function noise(dur, vol, delay, freq, q) {
    if (!enabled) return;
    var c = ensure();
    if (!c) return;
    try {
      var len = Math.max(1, Math.floor(c.sampleRate * dur));
      var buf = c.createBuffer(1, len, c.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      var src = c.createBufferSource();
      src.buffer = buf;
      var f = c.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = freq || 1200;
      f.Q.value = q || 0.8;
      var g = c.createGain();
      g.gain.value = vol || 0.08;
      src.connect(f); f.connect(g); g.connect(c.destination);
      src.start(c.currentTime + (delay || 0));
    } catch (e) {}
  }

  var SFX = {
    /* —— 旧 token（保持可用） —— */
    tap: function () { tone(520, 0.06, "sine", 0.05); },
    select: function () { tone(660, 0.08, "triangle", 0.07); },
    flip: function () { noise(0.16, 0.06, 0, 1800); tone(420, 0.1, "sine", 0.04); },
    tick: function () { tone(1200, 0.03, "square", 0.025); },
    chime: function () { tone(880, 0.18, "sine", 0.08); tone(1320, 0.22, "sine", 0.06, 0.1); },
    coin: function () { tone(1400, 0.06, "triangle", 0.06); tone(1860, 0.1, "triangle", 0.05, 0.05); },
    soft: function () { tone(240, 0.35, "sine", 0.07); },
    warn: function () { tone(200, 0.22, "sawtooth", 0.06); },
    error: function () { tone(160, 0.2, "square", 0.05); },
    reveal: function () {
      tone(523, 0.16, "sine", 0.07);
      tone(659, 0.16, "sine", 0.06, 0.09);
      tone(784, 0.28, "sine", 0.06, 0.18);
    },
    combo: function () {
      tone(660, 0.08, "triangle", 0.06);
      tone(880, 0.08, "triangle", 0.06, 0.06);
      tone(1100, 0.14, "triangle", 0.06, 0.12);
    },
    act: function () {
      tone(196, 0.6, "sine", 0.09);
      tone(294, 0.5, "sine", 0.05, 0.06);
      noise(0.5, 0.03, 0, 500);
    },
    ending: function () {
      tone(392, 0.4, "sine", 0.08);
      tone(494, 0.4, "sine", 0.06, 0.12);
      tone(587, 0.7, "sine", 0.07, 0.24);
    },

    /* —— V6 新 token —— */
    diceShake: function () {
      for (var i = 0; i < 7; i++) noise(0.05, 0.032, i * 0.055, 2200 + (i % 3) * 400, 1.4);
      tone(180, 0.05, "triangle", 0.03, 0);
    },
    diceLand: function () {
      tone(150, 0.12, "sine", 0.1, 0, 90);
      noise(0.12, 0.05, 0.01, 600, 0.7);
      tone(320, 0.06, "triangle", 0.04, 0.04);
    },
    hop: function () { tone(700, 0.05, "triangle", 0.045, 0, 900); },
    takeoff: function () {
      tone(300, 0.24, "sine", 0.07, 0, 900);
      noise(0.2, 0.03, 0.04, 1600);
    },
    fly: function () {
      tone(420, 0.36, "sine", 0.06, 0, 1100);
      tone(660, 0.3, "triangle", 0.04, 0.1, 1320);
      noise(0.3, 0.028, 0.06, 2000);
    },
    capture: function () {
      tone(320, 0.16, "sawtooth", 0.055, 0, 120);
      noise(0.22, 0.05, 0.02, 900, 0.7);
      tone(200, 0.22, "sine", 0.05, 0.06, 90);
    },
    stack: function () {
      tone(523, 0.12, "triangle", 0.06);
      tone(784, 0.16, "triangle", 0.05, 0.07);
    },
    heatUp: function () {
      tone(523, 0.14, "sine", 0.07);
      tone(659, 0.14, "sine", 0.06, 0.08);
      tone(784, 0.24, "sine", 0.06, 0.16);
    },
    milestone: function () {
      tone(659, 0.1, "triangle", 0.06);
      tone(784, 0.1, "triangle", 0.06, 0.07);
      tone(988, 0.1, "triangle", 0.06, 0.14);
      tone(1319, 0.24, "sine", 0.05, 0.21);
    },
    cardIn: function () {
      noise(0.18, 0.05, 0, 1600);
      tone(523, 0.1, "sine", 0.04, 0.02);
    },
    stamp: function () {
      tone(120, 0.14, "sine", 0.1, 0, 70);
      noise(0.14, 0.06, 0, 500, 0.6);
    },
    win: function () {
      tone(392, 0.22, "sine", 0.07);
      tone(523, 0.22, "sine", 0.07, 0.12);
      tone(659, 0.22, "sine", 0.07, 0.24);
      tone(784, 0.5, "sine", 0.06, 0.36);
      noise(0.3, 0.02, 0.36, 1800);
    },
    safe: function () {
      tone(246, 0.28, "sine", 0.07);
      tone(196, 0.34, "sine", 0.06, 0.14);
    }
  };

  App.Audio = {
    tokens: Object.keys(SFX),
    setEnabled: function (on) { enabled = !!on; },
    enabled: function () { return enabled; },
    unlock: function () {
      var c = ensure();
      if (c && c.state === "suspended") { try { c.resume(); } catch (e) {} }
    },
    play: function (name) {
      var fn = SFX[name];
      if (fn) { try { fn(); } catch (e) {} }
    }
  };
})();
