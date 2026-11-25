/*!
 * V10 Media Engine — 卡片下面的"当前展示"面板
 * 三种来源同一接口：
 *   schematic 程序化动态分镜（俯视位置示意 + 运镜 + 时间码）
 *   clip      真视频 URL
 *   local     用户本地绑定，存 IndexedDB，不联网
 */
(function (global) {
  "use strict";
  var TAU = Math.PI * 2, D2R = Math.PI / 180;

  /* 俯视坐标：0..1；rot 0 = 头朝上(-y)，90 = 头朝右(+x)，180 = 头朝下，270 = 头朝左
   * 身体从头部向 rot+180 方向延伸 len。
   */
  var POSES = {
    face:     { a: { x: .42, y: .52, rot: 90, len: .40, w: .135 }, b: { x: .58, y: .52, rot: 270, len: .40, w: .135 }, axis: "x" },
    straddle: { a: { x: .50, y: .58, rot: 90, len: .44, w: .140 }, b: { x: .50, y: .46, rot: 270, len: .30, w: .125 }, axis: "y" },
    behind:   { a: { x: .47, y: .46, rot: 0, len: .40, w: .135 }, b: { x: .47, y: .58, rot: 0, len: .40, w: .135 }, axis: "y" },
    ontop:    { a: { x: .50, y: .60, rot: 90, len: .44, w: .140 }, b: { x: .50, y: .54, rot: 270, len: .34, w: .130 }, axis: "y" },
    spoon:    { a: { x: .44, y: .58, rot: 90, len: .42, w: .135 }, b: { x: .44, y: .44, rot: 90, len: .42, w: .135 }, axis: "x" },
    kneel:    { a: { x: .50, y: .46, rot: 180, len: .40, w: .135 }, b: { x: .50, y: .66, rot: 0, len: .34, w: .125 }, axis: "y" },
    wall:     { a: { x: .44, y: .52, rot: 0, len: .42, w: .135 }, b: { x: .58, y: .52, rot: 180, len: .38, w: .135 }, axis: "y" },
    stand:    { a: { x: .42, y: .52, rot: 0, len: .44, w: .135 }, b: { x: .58, y: .52, rot: 180, len: .44, w: .135 }, axis: "x" },
    rest:     { a: { x: .44, y: .50, rot: 90, len: .44, w: .135 }, b: { x: .56, y: .56, rot: 270, len: .38, w: .130 }, axis: "x" }
  };

  var RULES = [
    [/口|含|舔|吞|深喉|嘴|脸/, "kneel"],
    [/跪|趴/, "kneel"],
    [/墙|玄关|门|抵/, "wall"],
    [/后|顶|背对|背后|撞/, "behind"],
    [/骑|跨坐|坐上去|在上|坐好/, "straddle"],
    [/侧|贴着|抱|贴/, "spoon"],
    [/压|身下|躺/, "ontop"],
    [/站|壁咚/, "stand"],
    [/坐|面对面|看着|说|说话/, "face"]
  ];
  var NAMES = Object.keys(POSES);
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function pickPose(text) {
    var t = String(text || "");
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(t)) return RULES[i][1];
    return NAMES[hash(t) % NAMES.length];
  }

  function shotsFor(card) {
    card = card || {};
    var text = [card.text, card.setup, card.line, card.escalate, card.escalateText].filter(Boolean).join(" ");
    var base = pickPose(text);
    return [
      { pose: base, cap: "起手", zoom: 1.00, dx: 0, dy: 0, dur: 2000 },
      { pose: base, cap: "加压", zoom: 1.16, dx: 0.04, dy: -0.03, dur: 2000 },
      { pose: base, cap: "收束", zoom: 1.10, dx: -0.04, dy: 0.02, dur: 2000 }
    ];
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  /* 俯视身体：头 + 肩宽躯干 + 两条手臂 */
  function body(ctx, b, colMain, colDark, s, cx, cy, wob) {
    var w = b.w * s, len = b.len * s;
    var x = b.x * s + cx, y = b.y * s + cy;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(b.rot * D2R + wob);

    ctx.save();
    ctx.filter = "blur(" + Math.max(3, s * 0.012) + "px)";
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(0, len * 0.30, w * 0.68, len * 0.62, 0, 0, TAU);
    ctx.fill();
    ctx.restore();

    /* 腿（先画，躯干压住根部） */
    ctx.strokeStyle = colMain;
    ctx.lineCap = "round";
    ctx.lineWidth = w * 0.30;
    [-1, 1].forEach(function (sg) {
      ctx.beginPath();
      ctx.moveTo(sg * w * 0.32, len * 0.82);
      ctx.quadraticCurveTo(sg * w * 0.46, len * 1.06, sg * w * 0.56, len * 1.26);
      ctx.stroke();
    });
    ctx.fillStyle = colDark;
    [-1, 1].forEach(function (sg) {
      ctx.beginPath();
      ctx.ellipse(sg * w * 0.56, len * 1.26, w * 0.17, w * 0.13, 0, 0, TAU);
      ctx.fill();
    });

    /* 躯干 */
    var g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    g.addColorStop(0, colDark);
    g.addColorStop(0.42, colMain);
    g.addColorStop(1, colDark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-w * 0.62, len * 0.92);
    ctx.quadraticCurveTo(-w * 0.62, len * 0.10, -w * 0.50, 0);
    ctx.quadraticCurveTo(0, -w * 0.30, w * 0.50, 0);
    ctx.quadraticCurveTo(w * 0.62, len * 0.10, w * 0.62, len * 0.92);
    ctx.quadraticCurveTo(0, len * 1.04, -w * 0.62, len * 0.92);
    ctx.closePath();
    ctx.fill();

    /* 手臂 */
    ctx.strokeStyle = colMain;
    ctx.lineCap = "round";
    ctx.lineWidth = w * 0.26;
    [-1, 1].forEach(function (sg) {
      ctx.beginPath();
      ctx.moveTo(sg * w * 0.52, len * 0.16);
      ctx.quadraticCurveTo(sg * w * 0.96, len * 0.42, sg * w * 0.70, len * 0.84);
      ctx.stroke();
    });

    /* 头 */
    ctx.fillStyle = colMain;
    ctx.beginPath();
    ctx.ellipse(0, -w * 0.32, w * 0.30, w * 0.35, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.30)";
    ctx.beginPath();
    ctx.ellipse(0, -w * 0.36, w * 0.34, w * 0.20, 0, Math.PI, TAU);
    ctx.fill();

    ctx.restore();
  }

  function mount(canvas, card, opts) {
    opts = opts || {};
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var W = 1, H = 1;
    var shots = shotsFor(card);
    var idx = 0, shotT = 0, running = true, raf = 0, last = performance.now(), elapsed = 0;
    var videoEl = null, mode = "schematic", grain = makeNoise();

    function makeNoise() {
      var c = document.createElement("canvas"); c.width = c.height = 128;
      var g = c.getContext("2d"), img = g.createImageData(128, 128);
      for (var i = 0; i < img.data.length; i += 4) { var v = 90 + Math.random() * 165; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      g.putImageData(img, 0, 0); return c;
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawShot(shot, prog, time, alpha) {
      var p = POSES[shot.pose] || POSES.face;

      /* 按两具身体的实际范围自动取景，保证不被裁切 */
      var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
      [p.a, p.b].forEach(function (b) {
        var lw = b.w * 0.75, lh = b.len * 1.30 + b.w * 0.5;
        [[-lw, -b.w * 0.6], [lw, -b.w * 0.6], [-lw, lh], [lw, lh]].forEach(function (c) {
          var r = b.rot * D2R, s = Math.sin(r), co = Math.cos(r);
          var x = c[0] * co - c[1] * s + b.x;
          var y = c[0] * s + c[1] * co + b.y;
          minX = Math.min(minX, x); maxX = Math.max(maxX, x);
          minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        });
      });
      var bw = maxX - minX, bh = maxY - minY;
      var pad = 1.22 / (shot.zoom + prog * 0.05);
      /* 竖排的姿势整场转 90°，让身体轴对齐画幅长边，画面才吃得满 */
      var gro = p.axis === "y" ? -Math.PI / 2 : 0;
      var s = gro
        ? Math.min(W / (bh * pad), H / (bw * pad))
        : Math.min(W / (bw * pad), H / (bh * pad));
      var ccx = (minX + maxX) / 2, ccy = (minY + maxY) / 2;
      var cx = W / 2 - ccx * s + shot.dx * W;
      var cy = H / 2 - ccy * s + shot.dy * H;

      ctx.save();
      ctx.globalAlpha = alpha == null ? 1 : alpha;
      if (gro) { ctx.translate(W / 2, H / 2); ctx.rotate(gro); ctx.translate(-W / 2, -H / 2); }

      /* 床垫 */
      ctx.fillStyle = "rgba(96,58,42,0.26)";
      roundRect(ctx, cx + s * 0.06, cy + s * 0.04, s * 0.88, s * 0.92, s * 0.05);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,196,140,0.10)"; ctx.lineWidth = 1; ctx.stroke();

      /* 枕头 */
      ctx.fillStyle = "rgba(214,160,120,0.13)";
      roundRect(ctx, cx + s * 0.10, cy + s * 0.07, s * 0.80, s * 0.12, s * 0.04);
      ctx.fill();

      /* 节奏轴 */
      var ax = p.axis;
      var mx = (p.a.x + p.b.x) / 2 * s + cx, my = (p.a.y + p.b.y) / 2 * s + cy;
      var amp = (0.075 + 0.03 * Math.sin(time * 2.4)) * s;
      ctx.save();
      ctx.globalAlpha *= 0.5;
      ctx.strokeStyle = "rgba(255,214,160,0.9)";
      ctx.lineWidth = Math.max(1.1, s * 0.005);
      ctx.setLineDash([s * 0.016, s * 0.014]);
      ctx.lineDashOffset = -time * s * 0.022;
      ctx.beginPath();
      if (ax === "y") { ctx.moveTo(mx - amp, my); ctx.lineTo(mx + amp, my); }
      else { ctx.moveTo(mx, my - amp); ctx.lineTo(mx, my + amp); }
      ctx.stroke();
      ctx.restore();

      body(ctx, p.b, "#9c4f56", "#5a2429", s * 0.96, cx, cy, Math.sin(time * 0.8 + 1.7) * 0.014);
      body(ctx, p.a, "#eeb684", "#8a5528", s, cx, cy, Math.sin(time * 0.8) * 0.014);

      if (opts.debug) {
        ctx.save();
        ctx.strokeStyle = "rgba(110,255,110,0.9)"; ctx.lineWidth = 1;
        ctx.strokeRect(cx, cy, s, s);
        ctx.fillStyle = "#9f9"; ctx.font = "11px monospace";
        ctx.fillText("W=" + W + " H=" + H + " s=" + s.toFixed(0) + " zoom=" + shot.zoom + " pose=" + shot.pose, 8, H - 4);
        ctx.restore();
      }
      ctx.restore();
    }

    function progressOnly(prog) {
      var barW = W * 0.9, bx = W * 0.05, by = H - H * 0.06, hh = Math.max(2, H * 0.008);
      if (prog < 0.02) return;
      ctx.save();
      ctx.fillStyle = "rgba(224,164,94,0.85)";
      roundRect(ctx, bx, by, barW * prog, hh, hh / 2); ctx.fill();
      ctx.restore();
    }

    function chrome(shot, prog, time) {
      var passed = shots.slice(0, idx).reduce(function (a, b) { return a + b.dur; }, 0) + prog * shot.dur;
      var sec = Math.floor(passed / 1000), mm = String(Math.floor(sec / 60)).padStart(2, "0"), ss = String(sec % 60).padStart(2, "0");
      var fs = Math.max(9, H * 0.038);

      ctx.save();
      ctx.font = "600 " + fs + "px ui-monospace,SFMono-Regular,Menlo,monospace";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = 0.55 + 0.45 * Math.sin(time * 3.2);
      ctx.fillStyle = "#e2685f";
      ctx.beginPath(); ctx.arc(W * 0.045, H * 0.10, Math.max(2.2, H * 0.013), 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,214,160,0.82)";
      ctx.fillText("当前展示  " + mm + ":" + ss, W * 0.075, H * 0.10);
      ctx.restore();

      ctx.save();
      ctx.font = "700 " + Math.max(10, H * 0.052) + "px ui-serif,Georgia,'Songti SC',serif";
      ctx.fillStyle = "rgba(255,232,206,0.90)";
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText(shot.cap, W * 0.955, H * 0.10);
      ctx.restore();

      var barW = W * 0.91, bx = W * 0.045, by = H - H * 0.085, hh = Math.max(2, H * 0.009);
      ctx.save();
      for (var i = 0; i < shots.length; i++) {
        var segW = barW / shots.length - 3;
        var sx = bx + i * (barW / shots.length);
        ctx.fillStyle = "rgba(255,214,160,0.15)";
        roundRect(ctx, sx, by, segW, hh, hh / 2); ctx.fill();
        var fill = i < idx ? 1 : i === idx ? prog : 0;
        if (fill > 0) { ctx.fillStyle = "rgba(224,164,94,0.95)"; roundRect(ctx, sx, by, segW * fill, hh, hh / 2); ctx.fill(); }
      }
      ctx.restore();
    }

    function drawVideo() {
      if (!videoEl) return;
      var vw = videoEl.videoWidth || 16, vh = videoEl.videoHeight || 9;
      var sc = Math.max(W / vw, H / vh), dw = vw * sc, dh = vh * sc;
      ctx.drawImage(videoEl, (W - dw) / 2, (H - dh) / 2, dw, dh);
      var vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.8);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.min(64, now - last); last = now; elapsed += dt;
      shotT += dt;
      if (shotT >= shots[idx].dur) { shotT = 0; idx = (idx + 1) % shots.length; }
      var shot = shots[idx], prog = shotT / shot.dur;

      if (mode === "video") { drawVideo(); }
      else {
        var g = ctx.createLinearGradient(0, 0, W * 0.3, H);
        g.addColorStop(0, "#241713"); g.addColorStop(0.5, "#170e0c"); g.addColorStop(1, "#0a0606");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        var lg = ctx.createRadialGradient(W * 0.82, -H * 0.12, 0, W * 0.82, -H * 0.12, H * 1.3);
        lg.addColorStop(0, "rgba(255,186,112,0.24)"); lg.addColorStop(0.4, "rgba(196,110,62,0.07)"); lg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);

        var fadeIn = Math.min(1, prog / 0.16);
        var prev = idx === 0 ? shots.length - 1 : idx - 1;
        if (fadeIn < 1) drawShot(shots[prev], 1, elapsed / 1000, 1 - fadeIn);
        drawShot(shot, prog, elapsed / 1000, fadeIn);
        if (opts.chrome !== false) chrome(shot, prog, elapsed / 1000); else progressOnly(prog);

        ctx.save(); ctx.globalAlpha = 0.05; ctx.globalCompositeOperation = "overlay";
        var ox = (elapsed * 0.04) % 128, oy = (elapsed * 0.05) % 128;
        for (var gx = -1; gx <= Math.ceil(W / 128); gx++)
          for (var gy = -1; gy <= Math.ceil(H / 128); gy++)
            ctx.drawImage(grain, gx * 128 - ox, gy * 128 - oy);
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    }

    function setVideo(url) {
      if (!videoEl) {
        videoEl = document.createElement("video");
        videoEl.muted = true; videoEl.loop = true; videoEl.playsInline = true;
        videoEl.setAttribute("playsinline", "");
        videoEl.style.cssText = "position:fixed;left:-4px;top:-4px;width:2px;height:2px;opacity:0.01;pointer-events:none";
        document.body.appendChild(videoEl);
      }
      videoEl.src = url;
      videoEl.play().catch(function () { });
      mode = "video";
      return true;
    }
    function clearVideo() {
      mode = "schematic";
      if (videoEl) { videoEl.pause(); videoEl.removeAttribute("src"); videoEl.load(); }
    }

    resize();
    raf = requestAnimationFrame(frame);
    var ro = null;
    if (global.ResizeObserver) { ro = new ResizeObserver(resize); ro.observe(canvas); }
    else global.addEventListener("resize", resize);

    return {
      setCard: function (c) { shots = shotsFor(c); idx = 0; shotT = 0; },
      setVideo: setVideo, clearVideo: clearVideo, getMode: function () { return mode; },
      play: function () { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } if (videoEl) videoEl.play().catch(function () { }); },
      pause: function () { running = false; cancelAnimationFrame(raf); if (videoEl) videoEl.pause(); },
      destroy: function () { running = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); clearVideo(); }
    };
  }

  var DB = "v10-media", STORE = "clips";
  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(STORE); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function run(mode, fn) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(STORE, mode), s = t.objectStore(STORE), out = fn(s);
        t.oncomplete = function () { res(out && out.result); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  function bindLocal(file, key) { return run("readwrite", function (s) { s.put(file, key); }).then(function () { return key; }); }
  function getLocal(key) { return run("readonly", function (s) { return s.get(key); }).then(function (b) { return b ? URL.createObjectURL(b) : null; }); }

  global.V10Media = { mount: mount, shotsFor: shotsFor, pickPose: pickPose, POSES: POSES, bindLocal: bindLocal, getLocal: getLocal };
})(typeof window !== "undefined" ? window : this);
