/* 棋盘印刷：每格有底色和能读的短字或图标。
 * 短字只来自今晚飞行棋自己的玩法，不借用别人的贴纸文案。
 * 坐标仍由 layout.js 放置，这里不重算跳和飞。
 */
import * as THREE from "three";

const FILL = {
  red: "#c4474e",
  yellow: "#d7a02a",
  blue: "#3c6fd0",
  green: "#2f9a68"
};
const DEEP = {
  red: "#8d2430",
  yellow: "#8a5a10",
  blue: "#1d3f86",
  green: "#146444"
};

const TRUTH = { 2: 1, 16: 1, 28: 1, 42: 1 };
const DARE = { 4: 1, 18: 1, 30: 1, 44: 1 };
const TOUCH = { 8: 1, 21: 1, 34: 1, 47: 1 };
const THERMO = { 10: 1, 36: 1 };
const WHEEL = { 14: "真话", 40: "冒险" };
const TAKEOFF = { 0: 1, 13: 1, 26: 1, 39: 1 };
const FLY = { 20: 1, 33: 1, 46: 1, 7: 1 };
const ENTRY = { 50: 1, 11: 1, 24: 1, 37: 1 };
const STOP = { 48: 1, 9: 1, 22: 1, 35: 1 };

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function drawHeart(g, x, y, s) {
  g.beginPath();
  g.moveTo(x, y + s * 0.3);
  g.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.2, y - s, x, y - s * 0.25);
  g.bezierCurveTo(x + s * 0.2, y - s, x + s, y - s * 0.4, x, y + s * 0.3);
  g.fill();
}

function drawMoon(g, x, y, s) {
  g.beginPath();
  g.arc(x, y, s, 0.4, Math.PI * 1.7);
  g.arc(x + s * 0.35, y - s * 0.1, s * 0.72, Math.PI * 1.2, 0.2, true);
  g.fill();
}

function drawStar(g, x, y, s) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? s * 0.42 : s;
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fill();
}

function drawPlane(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.ellipse(0, 0, s * 1.15, s * 0.38, 0, 0, Math.PI * 2);
  g.fill();
  g.fillRect(-s * 0.15, -s * 0.85, s * 0.3, s * 1.7);
  g.fillRect(-s * 0.85, -s * 0.12, s * 0.45, s * 0.22);
  g.restore();
}

function drawArrow(g, x, y, s) {
  g.beginPath();
  g.moveTo(x, y - s);
  g.lineTo(x + s * 0.72, y + s * 0.15);
  g.lineTo(x + s * 0.22, y + s * 0.15);
  g.lineTo(x + s * 0.22, y + s);
  g.lineTo(x - s * 0.22, y + s);
  g.lineTo(x - s * 0.22, y + s * 0.15);
  g.lineTo(x - s * 0.72, y + s * 0.15);
  g.closePath();
  g.fill();
}

function drawWheel(g, x, y, s) {
  g.beginPath();
  g.arc(x, y, s, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(20,10,8,0.55)";
  g.lineWidth = s * 0.12;
  g.stroke();
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * s * 0.82, y + Math.sin(a) * s * 0.82);
  }
  g.stroke();
}

function drawThermo(g, x, y, s) {
  g.fillRect(x - s * 0.18, y - s, s * 0.36, s * 1.45);
  g.beginPath();
  g.arc(x, y + s * 0.62, s * 0.42, 0, Math.PI * 2);
  g.fill();
}

function glyph(g, kind, x, y) {
  if (kind === "heart") drawHeart(g, x, y, 28);
  else if (kind === "moon") drawMoon(g, x, y, 26);
  else if (kind === "star") drawStar(g, x, y, 28);
  else if (kind === "plane") drawPlane(g, x, y, 22);
  else if (kind === "arrow") drawArrow(g, x, y, 26);
  else if (kind === "wheel") drawWheel(g, x, y, 26);
  else if (kind === "thermo") drawThermo(g, x, y, 22);
  else drawStar(g, x, y, 24);
}

function finishTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function ringMark(n) {
  const color = ["red", "yellow", "blue", "green"][n % 4];
  if (TAKEOFF[n]) return { color: color, title: "起飞", glyph: "plane", hot: true };
  if (FLY[n]) return { color: color, title: "飞", glyph: "plane", hot: true };
  if (ENTRY[n]) return { color: color, title: "进", glyph: "arrow", hot: true };
  if (STOP[n]) return { color: color, title: "停", glyph: "moon", hot: false };
  if (TRUTH[n]) return { color: color, title: "真心", glyph: "heart", hot: true };
  if (DARE[n]) return { color: color, title: "冒险", glyph: "star", hot: true };
  if (TOUCH[n]) return { color: color, title: "靠近", glyph: "heart", hot: true };
  if (THERMO[n]) return { color: color, title: "温度", glyph: "thermo", hot: true };
  if (WHEEL[n]) return { color: color, title: WHEEL[n], glyph: "wheel", hot: true };
  const moods = [
    { title: "跳", glyph: "arrow" },
    { title: "月", glyph: "moon" },
    { title: "星", glyph: "star" },
    { title: "心", glyph: "heart" }
  ];
  const mood = moods[n % moods.length];
  return { color: color, title: mood.title, glyph: mood.glyph, hot: false };
}

export function cellTexture(mark, badge) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = mark.hot ? DEEP[mark.color] : FILL[mark.color];
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = "rgba(255,244,220,0.14)";
  g.fillRect(0, 0, 256, 18);
  roundRect(g, 14, 14, 228, 228, 28);
  g.strokeStyle = mark.hot ? "#f3e2b0" : "rgba(255,248,236,0.72)";
  g.lineWidth = mark.hot ? 10 : 6;
  g.stroke();
  g.fillStyle = "#fff8ee";
  glyph(g, mark.glyph, 128, 92);
  g.fillStyle = "#fff8ee";
  g.font = "700 78px 'Noto Sans CJK SC', 'Noto Sans SC', sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(mark.title, 128, 188);
  if (badge) {
    g.font = "700 28px sans-serif";
    g.textAlign = "left";
    g.fillStyle = "rgba(255,248,236,0.8)";
    g.fillText(String(badge), 22, 42);
  }
  return finishTexture(c);
}

export function homeTexture(color, step) {
  return cellTexture({ color: color, title: String(step + 1), glyph: "arrow", hot: false }, "");
}

export function goalTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(256, 240, 40, 256, 256, 260);
  grd.addColorStop(0, "#f6e2a8");
  grd.addColorStop(1, "#c48a3a");
  g.fillStyle = grd;
  g.beginPath();
  g.arc(256, 256, 250, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#6a3a16";
  g.lineWidth = 18;
  g.stroke();
  g.fillStyle = "#6a3a16";
  drawStar(g, 256, 190, 70);
  g.fillStyle = "#3a2010";
  g.font = "700 92px 'Noto Sans CJK SC', 'Noto Sans SC', sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("终点", 256, 330);
  return finishTexture(c);
}

export function hangarTexture(color, name) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = DEEP[color];
  roundRect(g, 8, 8, 496, 496, 48);
  g.fill();
  g.strokeStyle = "#f3e2b0";
  g.lineWidth = 14;
  g.stroke();
  g.strokeStyle = "rgba(255,248,236,0.35)";
  g.lineWidth = 4;
  roundRect(g, 28, 28, 456, 456, 36);
  g.stroke();
  g.fillStyle = "#fff8ee";
  g.font = "700 210px 'Noto Sans CJK SC', 'Noto Sans SC', sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(name, 256, 210);
  g.font = "700 78px 'Noto Sans CJK SC', 'Noto Sans SC', sans-serif";
  g.fillText("机坪", 256, 360);
  g.strokeStyle = "rgba(255,248,236,0.55)";
  g.lineWidth = 8;
  for (let i = 0; i < 4; i++) {
    const x = 150 + (i % 2) * 212;
    const y = 430 + Math.floor(i / 2) * 8;
    g.beginPath();
    g.ellipse(x, y, 54, 22, 0, 0, Math.PI * 2);
    g.stroke();
  }
  return finishTexture(c);
}

export function medalTexture(title) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  g.clearRect(0, 0, 512, 512);
  g.fillStyle = "#1a120c";
  g.beginPath();
  g.arc(256, 256, 230, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#f3e2b0";
  g.lineWidth = 16;
  g.stroke();
  g.strokeStyle = "rgba(243,226,176,0.45)";
  g.lineWidth = 6;
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    g.moveTo(256, 256);
    g.lineTo(256 + Math.cos(a) * 190, 256 + Math.sin(a) * 190);
  }
  g.stroke();
  g.fillStyle = "#f6e7c4";
  g.beginPath();
  g.arc(256, 256, 78, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#2a160e";
  g.textAlign = "center";
  g.textBaseline = "middle";
  const lines = String(title).split("\n");
  g.font = "700 " + (lines.length > 1 ? 46 : 54) + "px 'Noto Sans CJK SC', 'Noto Sans SC', sans-serif";
  lines.forEach(function (line, i) {
    g.fillText(line, 256, 256 + (i - (lines.length - 1) / 2) * 52);
  });
  return finishTexture(c);
}

export function feltNightTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#14362c";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = i % 2 ? "rgba(243,214,150,0.08)" : "rgba(0,0,0,0.18)";
    g.lineWidth = 2;
    g.beginPath();
    g.arc(256, 256, 20 + i * 12, 0, Math.PI * 2);
    g.stroke();
  }
  g.fillStyle = "rgba(243,214,150,0.35)";
  for (let i = 0; i < 48; i++) {
    const a = i * 0.7;
    const r = 40 + (i * 17) % 200;
    g.beginPath();
    g.arc(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, 2.2, 0, Math.PI * 2);
    g.fill();
  }
  return finishTexture(c);
}
