/*  board.js — 画布棋盘
 *  结构：单条 36 格环道（两家共用，起点各在半圈）+ 左右机坪 + 内侧归航道
 */
(function (w) {
  "use strict";

  var canvas, ctx, W = 0, H = 0, dpr = 1;
  var TRACK = 36;
  var ICON = { truth: "♥", dare: "✦", touch: "♡", wheel: "转" };
  var TINT = {
    truth: ["#3b2431", "#c8798f"],
    dare: ["#3d2b1b", "#e0a45e"],
    touch: ["#33232c", "#d08a9c"],
    wheel: ["#222a36", "#8aa2bd"]
  };

  function mount(c) {
    canvas = c;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!canvas) return;
    var r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rr(c, x, y, wd, ht, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + wd, y, x + wd, y + ht, r);
    c.arcTo(x + wd, y + ht, x, y + ht, r);
    c.arcTo(x, y + ht, x, y, r);
    c.arcTo(x, y, x + wd, y, r);
    c.closePath();
  }

  function layout() {
    var cx = W / 2, cy = H / 2;
    var R = Math.min(W, H) * 0.44;
    var cell = Math.min(W, H) * 0.070;
    return { cx: cx, cy: cy, R: R, cell: cell };
  }

  /* 轨道格：从正上方开始顺时针 */
  function ang(i) { return -Math.PI / 2 + (i / TRACK) * Math.PI * 2; }
  function pos(i, L) {
    var a = ang(i);
    return { x: L.cx + Math.cos(a) * L.R, y: L.cy + Math.sin(a) * L.R, a: a };
  }

  function drawTable(L) {
    var g = ctx.createRadialGradient(L.cx, L.cy * 0.9, 0, L.cx, L.cy, Math.max(W, H) * 0.8);
    g.addColorStop(0, "#241811");
    g.addColorStop(0.5, "#180f0e");
    g.addColorStop(1, "#080606");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* 木纹：只保留极淡的几道 */
    ctx.save();
    ctx.globalAlpha = 0.035;
    ctx.strokeStyle = "#f0c9a0";
    ctx.lineWidth = 1;
    for (var i = 0; i < 9; i++) {
      var y = H * (0.08 + i * 0.11);
      ctx.beginPath();
      ctx.moveTo(-10, y);
      ctx.bezierCurveTo(W * 0.35, y + 14, W * 0.65, y - 12, W + 10, y + 6);
      ctx.stroke();
    }
    ctx.restore();

    /* 灯 */
    var l = ctx.createRadialGradient(W * 0.78, -H * 0.06, 0, W * 0.78, -H * 0.06, H * 1.1);
    l.addColorStop(0, "rgba(255,190,120,0.16)");
    l.addColorStop(0.5, "rgba(190,108,58,0.05)");
    l.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = l;
    ctx.fillRect(0, 0, W, H);

    /* 轨道底带 */
    ctx.save();
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, L.R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(224,164,94,0.07)";
    ctx.lineWidth = L.cell * 1.9;
    ctx.stroke();
    ctx.restore();

    /* 中央圆盘 */
    var cr = Math.min(W, H) * 0.175;
    var cg = ctx.createRadialGradient(L.cx - cr * 0.35, L.cy - cr * 0.4, 2, L.cx, L.cy, cr);
    cg.addColorStop(0, "#4a2f1f");
    cg.addColorStop(0.65, "#2a1914");
    cg.addColorStop(1, "#150d0b");
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, cr, 0, Math.PI * 2);
    ctx.fillStyle = cg;
    ctx.fill();
    ctx.strokeStyle = "rgba(224,164,94,0.20)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(L.cx, L.cy, cr * 0.74, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,214,160,0.08)";
    ctx.stroke();
  }

  function drawCells(st, L) {
    for (var i = 0; i < TRACK; i++) {
      var type = st.track[i];
      var p = pos(i, L);
      var tint = TINT[type] || TINT.truth;
      var s = L.cell;
      var isStartA = i === st.start.a, isStartB = i === st.start.b;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a + Math.PI / 2);

      rr(ctx, -s * 0.44, -s * 0.44, s * 0.88, s * 0.88, s * 0.24);
      var g = ctx.createLinearGradient(0, -s * 0.44, 0, s * 0.44);
      g.addColorStop(0, tint[0]);
      g.addColorStop(1, "#0c0a0a");
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,220,180,0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = tint[1];
      ctx.font = "600 " + Math.round(s * 0.44) + "px ui-serif, Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ICON[type] || "·", 0, s * 0.02);
      ctx.restore();

      /* 起点标记 */
      if (isStartA || isStartB) {
        var col = isStartA ? st.colors.a : st.colors.b;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, L.cell * 0.60, 0, Math.PI * 2);
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.75;
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function planeShape(c, size, color) {
    c.beginPath();
    c.moveTo(0, -size);
    c.lineTo(size * 0.76, size * 0.72);
    c.lineTo(0, size * 0.24);
    c.lineTo(-size * 0.76, size * 0.72);
    c.closePath();
    var g = c.createLinearGradient(0, -size, 0, size);
    g.addColorStop(0, color);
    g.addColorStop(1, "#000000bb");
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.35)";
    c.lineWidth = 0.8;
    c.stroke();
  }

  function drawHangar(st, L) {
    ["a", "b"].forEach(function (player) {
      var side = player === "a" ? -1 : 1;
      var hx = L.cx + side * L.R * 0.68;
      var hy = L.cy;
      var s = L.cell;

      /* 机坪盘 */
      ctx.save();
      ctx.translate(hx, hy);
      rr(ctx, -s * 0.78, -s * 0.78, s * 1.56, s * 1.56, s * 0.3);
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fill();
      ctx.strokeStyle = st.colors[player] + "55";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      /* 待起飞的飞机 */
      var idle = st.p[player].filter(function (pl) { return pl.steps < 0; });
      idle.forEach(function (pl, idx) {
        var offx = (idx % 2 ? 1 : -1) * s * 0.36;
        var offy = (idx > 1 ? 1 : -1) * s * 0.34;
        ctx.save();
        ctx.translate(hx + offx, hy + offy);
        ctx.rotate(side * 0.5);
        ctx.globalAlpha = 0.5;
        planeShape(ctx, s * 0.30, st.colors[player]);
        ctx.restore();
      });
    });
  }

  function drawPlanes(st, L) {
    var buckets = {};
    ["a", "b"].forEach(function (player) {
      st.p[player].forEach(function (pl) {
        if (pl.done || pl.steps < 0) return;
        var x, y, a;
        if (pl.steps >= TRACK) {
          var k = pl.steps - TRACK;
          var ang2 = player === "a" ? Math.PI : 0;
          var rad = L.R * (0.62 - k * 0.13);
          x = L.cx + Math.cos(ang2) * rad;
          y = L.cy + Math.sin(ang2) * rad;
          a = ang2;
        } else {
          var ci = (st.start[player] + pl.steps) % TRACK;
          var p = pos(ci, L);
          x = p.x; y = p.y; a = p.a;
        }
        var key = Math.round(x) + "_" + Math.round(y);
        buckets[key] = (buckets[key] || 0) + 1;
        var off = (buckets[key] - 1) * L.cell * 0.17;
        ctx.save();
        ctx.translate(x + off, y - off);
        ctx.rotate(a + Math.PI / 2);
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 7;
        planeShape(ctx, L.cell * (st.turn === player ? 0.42 : 0.36), st.colors[player]);
        ctx.restore();
      });
    });
  }

  function drawDie(st, L) {
    var s = Math.min(W, H) * 0.072;
    ctx.save();
    ctx.translate(L.cx, L.cy);
    if (st.die) {
      rr(ctx, -s, -s, s * 2, s * 2, s * 0.32);
      var g = ctx.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, "#f7efe2");
      g.addColorStop(1, "#c9b8a2");
      ctx.fillStyle = g;
      ctx.shadowColor = "#000c";
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
      var pips = {
        1: [[0, 0]], 2: [[-0.4, -0.4], [0.4, 0.4]],
        3: [[-0.45, -0.45], [0, 0], [0.45, 0.45]],
        4: [[-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42]],
        5: [[-0.45, -0.45], [0.45, -0.45], [0, 0], [-0.45, 0.45], [0.45, 0.45]],
        6: [[-0.42, -0.45], [0.42, -0.45], [-0.42, 0], [0.42, 0], [-0.42, 0.45], [0.42, 0.45]]
      };
      ctx.fillStyle = "#2a1a12";
      (pips[st.die] || pips[1]).forEach(function (q) {
        ctx.beginPath();
        ctx.arc(q[0] * s, q[1] * s, s * 0.13, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,214,160,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,214,160,0.35)";
      ctx.font = "600 " + Math.round(s * 0.7) + "px ui-serif, Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("掷", 0, 1);
    }
    ctx.restore();
  }

  function render(st) {
    if (!ctx || !st) return;
    var L = layout();
    drawTable(L);
    drawCells(st, L);
    drawHangar(st, L);
    drawPlanes(st, L);
    drawDie(st, L);

    var vg = ctx.createRadialGradient(L.cx, L.cy, Math.min(W, H) * 0.28, L.cx, L.cy, Math.max(W, H) * 0.7);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.6)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  }

  w.Board = { mount: mount, render: render, resize: resize, layout: layout, pos: pos };
})(window);
