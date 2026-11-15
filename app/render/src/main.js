/* 今晚飞行棋 · 桌上立体棋盘
 * 正式点数只来自事件里的 die，不用 Math.random。
 * three@0.180.0。程序化几何，不接 /3d/，不依赖 app3d 运行时。
 */
import * as THREE from "three";
import { COLORS, squareXZ, hangarCenter } from "./layout.js";
import { ringMark, cellTexture, homeTexture, goalTexture, hangarTexture, feltNightTexture } from "./print.js";

const BOARD_Y = 0.46;
const PIECE_Y = 0.62;

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function paintPips(n) {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = "#f7f1e6";
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "#d9cbb6";
  g.lineWidth = 6;
  g.strokeRect(4, 4, 120, 120);
  const spots = {
    1: [[64, 64]],
    2: [[36, 36], [92, 92]],
    3: [[32, 32], [64, 64], [96, 96]],
    4: [[36, 36], [96, 36], [36, 96], [96, 96]],
    5: [[36, 36], [96, 36], [64, 64], [36, 96], [96, 96]],
    6: [[36, 32], [96, 32], [36, 64], [96, 64], [36, 96], [96, 96]]
  };
  g.fillStyle = "#1b140f";
  (spots[n] || spots[1]).forEach(function (p) {
    g.beginPath();
    g.arc(p[0], p[1], 11, 0, Math.PI * 2);
    g.fill();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function woodTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#6a4128";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 46; i++) {
    const y = (i * 37) % 512;
    g.strokeStyle = i % 2 ? "rgba(40,18,8,0.28)" : "rgba(214,160,96,0.16)";
    g.lineWidth = 2 + (i % 3);
    g.beginPath();
    g.moveTo(0, y);
    g.bezierCurveTo(140, y + 8, 300, y - 10, 512, y + 4);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.2, 2.2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function feltTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#1c6a45";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1800; i++) {
    const x = (i * 47) % 256;
    const y = (i * 91) % 256;
    g.fillStyle = i % 2 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.05)";
    g.fillRect(x, y, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function crossShape() {
  const o = 9.85;
  const a = 2.28;
  const s = new THREE.Shape();
  s.moveTo(-a, -o);
  s.lineTo(a, -o);
  s.lineTo(a, -a);
  s.lineTo(o, -a);
  s.lineTo(o, a);
  s.lineTo(a, a);
  s.lineTo(a, o);
  s.lineTo(-a, o);
  s.lineTo(-a, a);
  s.lineTo(-o, a);
  s.lineTo(-o, -a);
  s.lineTo(-a, -a);
  s.closePath();
  return s;
}

function makePlane(hex) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: hex, metalness: 0.42, roughness: 0.28 });
  const trim = new THREE.MeshStandardMaterial({ color: 0xf4efe4, metalness: 0.55, roughness: 0.22 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x1c2430, metalness: 0.2, roughness: 0.15 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 22, 16), bodyMat);
  body.scale.set(2.05, 0.58, 0.7);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.3, 14), bodyMat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = 0.34;
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.86), bodyMat);
  wing.position.set(0.02, -0.01, 0);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.9), trim);
  stripe.position.set(0.02, 0.02, 0);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.34), bodyMat);
  tail.position.set(-0.28, 0.02, 0);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.035), bodyMat);
  fin.position.set(-0.28, 0.14, 0);
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), glass);
  canopy.scale.set(1.3, 0.8, 0.9);
  canopy.position.set(0.1, 0.09, 0);
  [body, nose, wing, stripe, tail, fin, canopy].forEach(function (m) {
    m.castShadow = true;
    g.add(m);
  });
  return g;
}

function faceQuat(die) {
  const map = {
    1: new THREE.Euler(0, 0, 0),
    2: new THREE.Euler(-Math.PI / 2, 0, 0),
    3: new THREE.Euler(0, 0, Math.PI / 2),
    4: new THREE.Euler(0, 0, -Math.PI / 2),
    5: new THREE.Euler(Math.PI / 2, 0, 0),
    6: new THREE.Euler(Math.PI, 0, 0)
  };
  const face = new THREE.Quaternion().setFromEuler(map[die] || map[1]);
  const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ((die * 0.37) % 1) * 0.6);
  return yaw.multiply(face);
}

function tumbleQuat(die, k) {
  const e = new THREE.Euler(
    k * Math.PI * (3 + (die % 3)),
    k * Math.PI * (2 + (die % 2)),
    k * Math.PI * (4 - (die % 3))
  );
  return new THREE.Quaternion().setFromEuler(e);
}

function createBoardView() {
  let renderer;
  let scene;
  let camera;
  let rootEl;
  let raf = 0;
  let reduced = false;
  let soundOn = true;
  let disposed = false;
  const pieces = {};
  const shadows = {};
  const groups = {};
  let dieMesh = null;
  let cup = null;
  let turnLamp = null;
  let playing = false;
  const cam = { theta: 0.0, phi: 0.16, radius: 43, target: new THREE.Vector3(0, 0, 0) };
  const pointers = new Map();

  function dur(ms) { return reduced ? Math.min(90, ms * 0.18) : ms; }

  function blip(name) {
    if (!soundOn) return;
    const audio = window.App && window.App.Audio;
    if (!audio || (audio.enabled && audio.enabled() === false)) return;
    try { audio.play(name); } catch (e) { /* 音效失败不影响走棋 */ }
  }

  function applyCamera() {
    const sp = Math.sin(cam.phi);
    camera.position.set(
      cam.target.x + cam.radius * sp * Math.sin(cam.theta),
      cam.target.y + cam.radius * Math.cos(cam.phi),
      cam.target.z + cam.radius * sp * Math.cos(cam.theta)
    );
    camera.lookAt(cam.target);
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, dur(ms)); });
  }

  function tween(ms, fn) {
    const total = dur(ms);
    if (total <= 16) { fn(1); return Promise.resolve(); }
    return new Promise(function (resolve) {
      const t0 = performance.now();
      function frame(now) {
        if (disposed) return resolve();
        const k = Math.min(1, (now - t0) / total);
        fn(k);
        if (k < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  function posOf(id, lift) {
    const xz = squareXZ(id);
    return new THREE.Vector3(xz[0], (lift || PIECE_Y), xz[1]);
  }

  function formationOffset(id) {
    const gid = groups[id];
    if (!gid) return new THREE.Vector3();
    const mates = Object.keys(groups).filter(function (k) { return groups[k] === gid; }).sort();
    const idx = Math.max(0, mates.indexOf(id));
    const table = [[0, 0, 0], [0.3, 0.16, 0.18], [-0.22, 0.3, -0.1], [0.14, 0.4, -0.2]];
    const o = table[idx] || table[0];
    return new THREE.Vector3(o[0], o[1], o[2]);
  }

  function placeMesh(id, squareId, lift) {
    const mesh = pieces[id];
    if (!mesh) return;
    const p = posOf(squareId, PIECE_Y + (lift || 0)).add(formationOffset(id));
    mesh.position.copy(p);
    mesh.userData.squareId = squareId;
  }

  function updateShadows() {
    Object.keys(pieces).forEach(function (id) {
      const mesh = pieces[id];
      const sh = shadows[id];
      if (!mesh || !sh || !mesh.visible) { if (sh) sh.visible = false; return; }
      sh.visible = true;
      sh.position.set(mesh.position.x, 0.09, mesh.position.z);
      const h = Math.max(0, mesh.position.y - PIECE_Y);
      const s = 0.55 + h * 0.22;
      sh.scale.set(s, s, s);
      sh.material.opacity = Math.max(0.12, 0.38 - h * 0.05);
    });
  }

  function ensurePiece(snapPiece) {
    if (pieces[snapPiece.id]) {
      pieces[snapPiece.id].visible = true;
      return pieces[snapPiece.id];
    }
    const mesh = makePlane(COLORS[snapPiece.color] || 0xffffff);
    mesh.userData.colorName = snapPiece.color;
    scene.add(mesh);
    pieces[snapPiece.id] = mesh;
    const sh = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 20),
      new THREE.MeshBasicMaterial({ color: 0x04140c, transparent: true, opacity: 0.35, depthWrite: false })
    );
    sh.rotation.x = -Math.PI / 2;
    sh.position.y = 0.09;
    scene.add(sh);
    shadows[snapPiece.id] = sh;
    return mesh;
  }

  function hideUnused(ids) {
    Object.keys(pieces).forEach(function (id) {
      if (ids.indexOf(id) < 0) pieces[id].visible = false;
    });
  }

  function setState(snapshot) {
    if (!snapshot) return;
    const ids = [];
    Object.keys(groups).forEach(function (k) { delete groups[k]; });
    (snapshot.pieces || []).forEach(function (p) {
      ids.push(p.id);
      if (p.stackGroupId) groups[p.id] = p.stackGroupId;
      ensurePiece(p);
      placeMesh(p.id, p.squareId, 0);
      const mesh = pieces[p.id];
      mesh.userData.squareId = p.squareId;
    });
    hideUnused(ids);
    if (snapshot.turn && snapshot.colors) setTurn(snapshot.colors[snapshot.turn]);
    updateShadows();
  }

  function setTurn(color) {
    if (!turnLamp || !color) return;
    const hex = COLORS[color] || 0xf0b56a;
    turnLamp.color.setHex(hex);
    turnLamp.intensity = reduced ? 0.35 : 1.15;
    const spot = hangarCenter(color);
    turnLamp.position.set(spot[0], 3.2, spot[1]);
  }

  async function hopAlong(id, squares, height) {
    const mesh = pieces[id];
    if (!mesh || !squares || !squares.length) return;
    const mates = Object.keys(groups).filter(function (k) { return groups[k] && groups[k] === groups[id] && k !== id; });
    for (let i = 0; i < squares.length; i++) {
      const from = mesh.position.clone();
      const target = posOf(squares[i]).add(formationOffset(id));
      const mateFrom = mates.map(function (mid) { return pieces[mid] ? pieces[mid].position.clone() : null; });
      await tween(150, function (k) {
        const e = easeInOut(k);
        const arc = Math.sin(Math.PI * e) * height;
        mesh.position.lerpVectors(from, target, e);
        mesh.position.y += arc;
        mesh.lookAt(target.x, mesh.position.y, target.z);
        mates.forEach(function (mid, idx) {
          const m = pieces[mid];
          if (!m || !mateFrom[idx]) return;
          const mt = posOf(squares[i]).add(formationOffset(mid));
          m.position.lerpVectors(mateFrom[idx], mt, e);
          m.position.y += arc * 0.92;
        });
        updateShadows();
      });
      mesh.userData.squareId = squares[i];
      mates.forEach(function (mid) { if (pieces[mid]) pieces[mid].userData.squareId = squares[i]; });
    }
  }

  async function arcTo(id, toId, peak, viaCenter) {
    const mesh = pieces[id];
    if (!mesh) return;
    const from = mesh.position.clone();
    const target = posOf(toId).add(formationOffset(id));
    const mates = Object.keys(groups).filter(function (k) { return groups[k] && groups[k] === groups[id] && k !== id; });
    const mateFrom = mates.map(function (mid) { return pieces[mid] ? pieces[mid].position.clone() : null; });
    blip(viaCenter ? "act" : "select");
    await tween(viaCenter ? 720 : 320, function (k) {
      const e = easeInOut(k);
      const base = new THREE.Vector3().lerpVectors(from, target, e);
      let y = from.y + (target.y - from.y) * e + Math.sin(Math.PI * e) * peak;
      if (viaCenter) {
        const mid = new THREE.Vector3(0, peak, 0);
        const a = new THREE.Vector3().lerpVectors(from, mid, Math.min(1, e * 2));
        const b = new THREE.Vector3().lerpVectors(mid, target, Math.max(0, e * 2 - 1));
        base.copy(e < 0.5 ? a : b);
        y = base.y;
      }
      mesh.position.set(base.x, y, base.z);
      mesh.lookAt(target.x, y, target.z);
      mates.forEach(function (mid, idx) {
        const m = pieces[mid];
        if (!m || !mateFrom[idx]) return;
        const mt = posOf(toId).add(formationOffset(mid));
        const mb = new THREE.Vector3().lerpVectors(mateFrom[idx], mt, e);
        m.position.set(mb.x + (viaCenter ? 0.25 : 0), y + formationOffset(mid).y * 0.2, mb.z);
      });
      updateShadows();
    });
    mesh.position.copy(target);
    mesh.userData.squareId = toId;
    mates.forEach(function (mid) {
      if (!pieces[mid]) return;
      pieces[mid].position.copy(posOf(toId).add(formationOffset(mid)));
      pieces[mid].userData.squareId = toId;
    });
    updateShadows();
  }

  async function playTakeoff(ev) {
    const mesh = pieces[ev.pieceId];
    if (!mesh) return;
    const path = ev.path || [];
    const dest = path[path.length - 1];
    if (!dest) return;
    blip("soft");
    const start = mesh.position.clone();
    const end = posOf(dest);
    const slide = start.clone().lerp(end, 0.42);
    slide.y = PIECE_Y;
    await tween(280, function (k) {
      mesh.position.lerpVectors(start, slide, easeOut(k));
      updateShadows();
    });
    await tween(460, function (k) {
      const e = easeInOut(k);
      mesh.position.lerpVectors(slide, end, e);
      mesh.position.y += Math.sin(Math.PI * e) * 1.35;
      mesh.lookAt(end.x, mesh.position.y, end.z);
      updateShadows();
    });
    mesh.position.copy(end);
    mesh.userData.squareId = dest;
    updateShadows();
  }

  async function playDice(ev) {
    const die = ev.die;
    if (!dieMesh || !cup) return;
    blip("tick");
    const cupHome = { x: 0.15, y: 2.7, z: 10.5 };
    const rest = new THREE.Vector3(0.2, 0.78, 11.15);
    dieMesh.position.set(0.1, 2.5, 10.6);
    dieMesh.visible = true;
    cup.position.set(cupHome.x, cupHome.y, cupHome.z);
    cup.rotation.set(0, 0, 0);
    cup.visible = true;
    const finalQ = faceQuat(die);
    await tween(reduced ? 80 : 520, function (k) {
      const w = Math.sin(k * Math.PI * 7) * (1 - k) * 0.35;
      cup.rotation.z = w;
      cup.rotation.x = w * 0.4;
      cup.position.y = cupHome.y + Math.sin(k * Math.PI * 6) * 0.08;
      dieMesh.quaternion.copy(tumbleQuat(die, k));
      dieMesh.position.y = 2.15 + Math.sin(k * 12) * 0.05;
    });
    await tween(reduced ? 60 : 380, function (k) {
      const e = easeInOut(k);
      cup.rotation.x = -1.15 * e;
      cup.position.y = cupHome.y + e * 0.35;
      cup.position.z = cupHome.z - e * 0.35;
      dieMesh.position.lerpVectors(new THREE.Vector3(0.1, 2.3, 10.6), rest, e);
      dieMesh.quaternion.copy(tumbleQuat(die, 1 - e * 0.35)).slerp(finalQ, e);
    });
    await tween(reduced ? 40 : 460, function (k) {
      const e = easeOut(k);
      const hop = Math.sin(Math.PI * e) * (0.55 * (1 - e));
      dieMesh.position.set(rest.x + Math.sin(e * die) * 0.18 * (1 - e), rest.y + hop, rest.z + (1 - e) * 0.2);
      dieMesh.quaternion.copy(tumbleQuat(die, 0.25 * (1 - e))).slerp(finalQ, e);
    });
    dieMesh.quaternion.copy(finalQ);
    dieMesh.position.copy(rest);
    cup.visible = false;
    blip("coin");
  }

  async function playCapture(ev) {
    const atk = pieces[ev.attackerId];
    const victims = ev.victimIds || [];
    if (atk) {
      const origin = atk.position.clone();
      await tween(280, function (k) {
        const e = Math.sin(k * Math.PI);
        atk.position.x = origin.x + e * 0.45;
        atk.position.y = origin.y + e * 0.35;
        updateShadows();
      });
      atk.position.copy(origin);
    }
    for (let i = 0; i < victims.length; i++) {
      const mesh = pieces[victims[i]];
      if (!mesh) continue;
      const color = mesh.userData.colorName || "red";
      const slot = "hangar:" + color + ":" + (i % 4);
      const from = mesh.position.clone();
      const to = posOf(slot);
      blip("warn");
      await tween(640, function (k) {
        const e = easeInOut(k);
        const spin = k * Math.PI * 3;
        mesh.position.lerpVectors(from, to, e);
        mesh.position.y += Math.sin(Math.PI * e) * 1.8;
        mesh.rotation.y = spin;
        mesh.rotation.z = Math.sin(spin) * 0.8;
        updateShadows();
      });
      mesh.position.copy(to);
      mesh.rotation.set(0, 0, 0);
      mesh.userData.squareId = slot;
      delete groups[victims[i]];
    }
    updateShadows();
  }

  async function playStack(ev) {
    (ev.pieceIds || []).forEach(function (id) { groups[id] = ev.pieceIds.slice().sort().join("+"); });
    const at = ev.at;
    await Promise.all((ev.pieceIds || []).map(function (id) {
      const mesh = pieces[id];
      if (!mesh) return Promise.resolve();
      const from = mesh.position.clone();
      const to = posOf(at).add(formationOffset(id));
      return tween(280, function (k) {
        mesh.position.lerpVectors(from, to, easeOut(k));
        updateShadows();
      });
    }));
  }

  async function playOne(ev) {
    if (!ev || !ev.type) return;
    if (ev.type === "dice") return playDice(ev);
    if (ev.type === "takeoff") return playTakeoff(ev);
    if (ev.type === "move") {
      const path = ev.path || [];
      const mode = ev.mode || "walk";
      return hopAlong(ev.pieceId, path, mode === "jump" ? 1.05 : (mode === "fly" ? 3.2 : 0.28));
    }
    if (ev.type === "jump") return arcTo(ev.pieceId, ev.to, 1.15, false);
    if (ev.type === "fly") return arcTo(ev.pieceId, ev.to, 4.1, true);
    if (ev.type === "capture") return playCapture(ev);
    if (ev.type === "stack") return playStack(ev);
    if (ev.type === "turn") return setTurn(ev.color);
    if (rootEl) {
      try { rootEl.dispatchEvent(new CustomEvent("board-event", { detail: ev })); } catch (e) {}
    }
    return wait(ev.type === "prompt" ? 40 : 10);
  }

  async function play(events) {
    playing = true;
    const list = events || [];
    for (let i = 0; i < list.length; i++) {
      if (disposed) break;
      await playOne(list[i]);
    }
    playing = false;
  }

  function onPointerDown(e) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (rootEl.setPointerCapture) {
      try { rootEl.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }
  function onPointerMove(e) {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    prev.x = e.clientX;
    prev.y = e.clientY;
    if (pointers.size >= 2) {
      const pts = Array.from(pointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (cam.pinch) {
        const ratio = dist / cam.pinch;
        cam.radius = Math.max(18, Math.min(64, cam.radius / ratio));
      }
      cam.pinch = dist;
      return;
    }
    cam.theta += dx * 0.005;
    cam.phi = Math.max(0.2, Math.min(1.15, cam.phi + dy * 0.004));
    const base = 0.2;
    if (cam.theta > base + 0.9) cam.theta = base + 0.9;
    if (cam.theta < base - 0.9) cam.theta = base - 0.9;
    applyCamera();
  }
  function onPointerUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) cam.pinch = 0;
  }
  function onWheel(e) {
    e.preventDefault();
    cam.radius = Math.max(18, Math.min(64, cam.radius + (e.deltaY > 0 ? 1.4 : -1.4)));
    applyCamera();
  }

  function buildScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x140e0b);
    scene.fog = new THREE.Fog(0x120c09, 70, 120);
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 140);
    applyCamera();

    scene.add(new THREE.AmbientLight(0xfff1df, 0.55));
    const sun = new THREE.DirectionalLight(0xfff4e5, 1.35);
    sun.position.set(8, 16, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 16;
    sun.shadow.camera.bottom = -16;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xc9d7ff, 0.28);
    fill.position.set(-8, 8, -6);
    scene.add(fill);
    turnLamp = new THREE.PointLight(0xe23d3d, 0.9, 14, 2);
    turnLamp.position.set(0, 3, 6);
    scene.add(turnLamp);

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(28, 0.6, 28),
      new THREE.MeshStandardMaterial({ map: woodTexture(), color: 0xffffff, roughness: 0.78, metalness: 0.04 })
    );
    table.position.y = -0.3;
    table.receiveShadow = true;
    scene.add(table);
    const felt = new THREE.Mesh(
      new THREE.CircleGeometry(13.2, 64),
      new THREE.MeshStandardMaterial({ map: feltNightTexture(), color: 0xffffff, roughness: 0.9, metalness: 0.02 })
    );
    felt.rotation.x = -Math.PI / 2;
    felt.position.y = 0.02;
    felt.receiveShadow = true;
    scene.add(felt);

    const boardGeo = new THREE.ExtrudeGeometry(crossShape(), { depth: 0.38, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.06, bevelSegments: 2 });
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x24160f, roughness: 0.55, metalness: 0.08 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.rotation.x = -Math.PI / 2;
    board.position.y = 0.04;
    board.receiveShadow = true;
    board.castShadow = true;
    scene.add(board);

    function addPrint(tex, x, z, w, h, y) {
      const tile = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.58, metalness: 0.06 })
      );
      tile.rotation.x = -Math.PI / 2;
      tile.position.set(x, y, z);
      tile.receiveShadow = true;
      scene.add(tile);
      return tile;
    }
    for (let n = 0; n < 52; n++) {
      const xz = squareXZ("ring:" + n);
      const mark = ringMark(n);
      addPrint(cellTexture(mark, n), xz[0], xz[1], 1.08, 1.08, BOARD_Y + 0.03);
    }
    const hangarName = { red: "红", yellow: "黄", blue: "蓝", green: "绿" };
    ["red", "yellow", "blue", "green"].forEach(function (color) {
      for (let step = 0; step < 5; step++) {
        const xz = squareXZ("home:" + color + ":" + step);
        addPrint(homeTexture(color, step), xz[0], xz[1], 0.96, 0.96, BOARD_Y + 0.045);
      }
      const base = hangarCenter(color);
      const pad = new THREE.Mesh(
        new THREE.BoxGeometry(3.35, 0.16, 3.15),
        new THREE.MeshStandardMaterial({ map: hangarTexture(color, hangarName[color]), roughness: 0.5, metalness: 0.08 })
      );
      pad.position.set(base[0], 0.18, base[1]);
      pad.castShadow = true;
      pad.receiveShadow = true;
      scene.add(pad);
    });
    const goal = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 32),
      new THREE.MeshStandardMaterial({ map: goalTexture(), roughness: 0.42, metalness: 0.2 })
    );
    goal.rotation.x = -Math.PI / 2;
    goal.position.y = BOARD_Y + 0.05;
    goal.receiveShadow = true;
    scene.add(goal);

    const pipMats = [1, 2, 3, 4, 5, 6].map(function (n) {
      return new THREE.MeshStandardMaterial({ map: paintPips(n), roughness: 0.35, metalness: 0.05 });
    });
    /* BoxGeometry 材质顺序：+x -x +y -y +z -z ，对应点数 3 4 1 6 2 5 */
    dieMesh = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.78, 0.78), [
      pipMats[2], pipMats[3], pipMats[0], pipMats[5], pipMats[1], pipMats[4]
    ]);
    dieMesh.castShadow = true;
    dieMesh.position.set(0.2, 0.78, 11.15);
    dieMesh.quaternion.copy(faceQuat(1));
    scene.add(dieMesh);

    cup = new THREE.Group();
    const leather = new THREE.MeshStandardMaterial({ color: 0x6b2e24, roughness: 0.55, metalness: 0.12, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.78, 1.15, 28, 1, true), leather);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.06, 8, 24), leather);
    lip.position.y = 0.52;
    lip.rotation.x = Math.PI / 2;
    cup.add(wall);
    cup.add(lip);
    cup.visible = false;
    scene.add(cup);
  }

  function mount(el, opts) {
    opts = opts || {};
    try {
      rootEl = el;
      reduced = !!opts.reduced;
      soundOn = opts.sound !== false;
      disposed = false;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      el.style.touchAction = "none";
      buildScene();
      const resize = function () {
        const w = el.clientWidth || 360;
        const h = el.clientHeight || 640;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(1, h);
        camera.updateProjectionMatrix();
      };
      resize();
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        el.__boardRo = ro;
      }
      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);
      el.addEventListener("wheel", onWheel, { passive: false });
      const loop = function () {
        if (disposed) return;
        raf = requestAnimationFrame(loop);
        updateShadows();
        renderer.render(scene, camera);
      };
      loop();
    } catch (err) {
      if (window.console) console.error("[board] 挂载失败", err);
      const ui = window.App && window.App.UI;
      if (ui && ui.toast) ui.toast("棋盘没有摆上来");
    }
  }

  function setCamera(partial) {
    partial = partial || {};
    if (typeof partial.theta === "number") cam.theta = partial.theta;
    if (typeof partial.phi === "number") cam.phi = Math.max(0.2, Math.min(1.15, partial.phi));
    if (typeof partial.radius === "number") cam.radius = Math.max(18, Math.min(64, partial.radius));
    if (partial.target && typeof partial.target.x === "number") {
      cam.target.set(partial.target.x, partial.target.y || 0, partial.target.z || 0);
    }
    applyCamera();
  }

  function setReduced(flag) { reduced = !!flag; }
  function setSound(flag) { soundOn = !!flag; }

  function unmount() {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    if (rootEl) {
      rootEl.removeEventListener("pointerdown", onPointerDown);
      rootEl.removeEventListener("pointermove", onPointerMove);
      rootEl.removeEventListener("pointerup", onPointerUp);
      rootEl.removeEventListener("pointercancel", onPointerUp);
      rootEl.removeEventListener("wheel", onWheel);
      if (rootEl.__boardRo) rootEl.__boardRo.disconnect();
    }
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    scene = null;
    renderer = null;
  }

  return {
    mount: mount,
    setState: setState,
    play: play,
    setCamera: setCamera,
    setReduced: setReduced,
    setSound: setSound,
    unmount: unmount
  };
}

const view = createBoardView();
const root = (window.App = window.App || {});
root.BoardView = view;
export default view;
