/* ==========================================================================
 * V8 · 真 3D 主桌 · 导演（事件 → 镜头链）
 * 镜头链：overview → roll → focus → fly（飞机固定、棋盘旋转+平移）→ land
 *        → cell45（格子升起）→ bear（小熊探头）→ return
 * 对外：play(events) 永不 reject；阶段写 host[data-3d-phase]。
 * reduced：全部瞬时完成，不转镜头、不显示速度线，停在静态俯瞰。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import {
  DIE_SIZE, TILE_BOTTOM, STAGE_RISE, STAGE_AZIM, PLANE_Y, OVERVIEW_FILL,
  DIE_HOME_POS, DEG, TAU, clamp, lerp, easeInOut, easeOut, smoothstep, shortestDelta
} from './constants.js';
import {
  isMotionEvent, motionOrigin, motionDest, poseForSquare, interpPose, localOfSquare
} from './mapping.js';

const DIE_HOME = new THREE.Vector3(DIE_HOME_POS.x, DIE_HOME_POS.y, DIE_HOME_POS.z);

/* ------------------------------------------------------------------------- */
/* 音效：WebAudio 极简合成（仅在 setSound(true) 且用户手势后可用；失败静默） */
/* ------------------------------------------------------------------------- */
class Sfx {
  constructor() {
    this.on = false;
    this.ctx = null;
    this.master = null;
  }
  setOn(on) {
    this.on = !!on;
    if (this.on) this._ensure();
  }
  _ensure() {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      if (!this.ctx) {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.14;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended' && this.ctx.resume) this.ctx.resume().catch(() => {});
    } catch (e) {
      this.ctx = null;
    }
    return this.ctx;
  }
  _tone(freq, freq2, dur, type, gain, delay) {
    const ctx = this.ctx;
    const t0 = ctx.currentTime + (delay || 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (freq2 && freq2 !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq2), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  _noise(dur, gain) {
    const ctx = this.ctx;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = gain;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start();
  }
  _can() { return this.on && this.ctx; }
  dice() { if (!this._can()) return; try { this._noise(0.18, 0.16); this._tone(220, 90, 0.14, 'triangle', 0.1); } catch (e) { /* noop */ } }
  /* V9.3：骰子每次弹到棋盘上的木质轻撞（speed 0..1 控制音量/音高） */
  diceLand(speed) { if (!this._can()) return; try { const k = clamp(Number(speed) || 0, 0, 1); const g = 0.05 + 0.11 * k; this._noise(0.05, g); this._tone(190 - 40 * k, 90, 0.085, 'triangle', g * 0.9); } catch (e) { /* noop */ } }
  whoosh() { if (!this._can()) return; try { this._noise(0.22, 0.1); } catch (e) { /* noop */ } }
  tick() { if (!this._can()) return; try { this._tone(520, 420, 0.05, 'sine', 0.025); } catch (e) { /* noop */ } }
  land() { if (!this._can()) return; try { this._tone(150, 70, 0.18, 'sine', 0.16); this._noise(0.08, 0.08); } catch (e) { /* noop */ } }
  bear() { if (!this._can()) return; try { this._tone(660, 660, 0.12, 'sine', 0.08); this._tone(990, 990, 0.16, 'sine', 0.06, 0.1); } catch (e) { /* noop */ } }
  capture() { if (!this._can()) return; try { this._noise(0.24, 0.18); this._tone(300, 60, 0.22, 'sawtooth', 0.08); } catch (e) { /* noop */ } }
  win() { if (!this._can()) return; try { [523, 659, 784, 1046].forEach((f, i) => this._tone(f, f, 0.3, 'sine', 0.07, i * 0.11)); } catch (e) { /* noop */ } }
}

/* ------------------------------------------------------------------------- */
export class Director {
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.host = opts.host || scene.host;
    this.reduced = !!opts.reduced;
    this.stageAim = opts.stageAim || { nx: 0, ny: 0.15 };
    this.phase = 'boot';
    this.busy = false;
    this.holding = false;
    this.cellCtx = null;
    this.lastState = null;
    this.lastView = null;
    this._queue = Promise.resolve();
    this._instantNext = false;
    this._skipRequested = false;
    this._skipUntilIdle = false;
    this._fitPending = false;
    this._movingPieceId = null;
    this._lastSquare = null;
    this.targetSquare = null;
    this.sfx = new Sfx();
    this.sfx.setOn(!!opts.sound);
    this.scene.lockProbeId = null;
    this.scene.applyPose({ theta: 0, tx: 0, tz: 0 });
    this.scene.rig.snap(this._overview());
    this._setPhase('idle');
  }

  setState(state, view) {
    this.lastState = state || this.lastState;
    this.lastView = view || this.lastView;
  }

  setSound(on) { this.sfx.setOn(on); }

  setReduced(flag) {
    const next = !!flag;
    if (next === this.reduced) return;
    this.reduced = next;
    this.scene.setReduced(next);
    if (next) {
      this._instantNext = true;
      this.scene.flushAnims();
      this.scene.setFlyMode(false);
      if (!this.busy) {
        this.holding = false;
        this.cellCtx = null;
        this.scene.setStageVisible(false);
        this.scene.setDim(1);
        this.scene.setTargetGlow(null);
        this.scene.setStreaks(false);
        this.scene.applyPose({ theta: 0, tx: 0, tz: 0 });
        this.scene.rig.snap(this._overview());
        this._setPhase('idle');
        this._instantNext = false;
      }
    } else {
      this._instantNext = false;
      this.scene.rig.snap(this.scene.rig.snapshotTarget());
    }
  }

  play(events, opts) {
    const ev = Array.isArray(events) ? events.filter(Boolean) : [];
    const run = () => this._run(ev, opts || {})
      .catch((err) => {
        console.warn('[board3d] play error:', err && err.message ? err.message : err);
        this.holding = false;
        this._setPhase('idle');
      })
      .finally(() => {
        this.busy = false;
        this._instantNext = false;
        this._skipRequested = false;
        if (this.phase === 'idle' && !this.holding) this._skipUntilIdle = false;
        /* 题卡打开/关闭会改变 boardwrap 高度：链结束后按最新 host 纵横比重算一次俯瞰 */
        if (!this.holding && this.phase === 'idle') {
          try { this.handleResize(); } catch (e) { /* noop */ }
        }
      });
    this.busy = true;
    this._queue = this._queue.then(run, run);
    return this._queue;
  }

  skip() {
    this._skipRequested = true;
    this._skipUntilIdle = true;
    this.scene.flushAnims();
    this._instantNext = true;
    if (!this.busy) {
      if (this.holding || this.phase !== 'idle') this.returnToOverview().catch(() => {});
      else {
        this._instantNext = false;
        this._skipUntilIdle = false;
        this._skipRequested = false;
      }
    }
  }

  /* ------------------------------ 内部 ------------------------------ */
  _setPhase(name) {
    this.phase = name;
    if (this.host) this.host.setAttribute('data-3d-phase', name);
    this.scene.markPhase(name);
  }

  /* 统一的动画入口：skip / reduced 时直接落终态 */
  _anim(ms, fn) {
    if (this._instantNext || this._skipUntilIdle || this.reduced) {
      try { fn(1); } catch (e) { console.warn('[board3d] anim instant', e); }
      this.scene.requestRender();
      return Promise.resolve();
    }
    return this.scene.runAnim(ms, fn);
  }

  _animateCamera(ms, target, centerFn) {
    if (this._instantNext || this._skipUntilIdle || this.reduced) {
      this.scene.rig.snap(target);
      return Promise.resolve();
    }
    return this.scene.rig.animate(ms, target, centerFn);
  }

  _playerOf(id) {
    const s = String(id || '');
    return s.charAt(0) === 'b' ? 'b' : 'a';
  }

  _colorFor(id) {
    const st = this.lastState;
    if (st && Array.isArray(st.pieces)) {
      const p = st.pieces.find((x) => x.id === id);
      if (p && p.color) return p.color;
    }
    const pid = this._playerOf(id);
    if (st && st.colors && st.colors[pid]) return st.colors[pid];
    return pid === 'b' ? 'yellow' : 'red';
  }

  _squareOf(id) {
    const st = this.lastState;
    if (st && Array.isArray(st.pieces)) {
      const p = st.pieces.find((x) => x.id === id);
      if (p) return p.squareId;
    }
    return null;
  }

  /* overview：棋盘占宽 86–88%，并用投影包围盒把棋盘在 host 里上下居中
   * （V8-V-01：之前上下留白靠固定 ny，320/390/430 三种纵横比下重心会偏） */
  _overview() {
    const radius = this.scene.rig.distForCover(3.70, OVERVIEW_FILL, 42);
    const t = {
      center: new THREE.Vector3(0, 0.05, 0.24),
      nx: 0, ny: 0,
      radius, elev: 58, azim: 0, fov: 42
    };
    t.ny = this._centerBias(t);
    return t;
  }

  /* 以 ny=0 试算棋盘投影包围盒的上下缘，返回让"上下留白相等"的 ny。
   * 只做投影测量，不渲染；测完把相机状态原样还回去（含 lock 状态）。 */
  _centerBias(t) {
    const rig = this.scene.rig;
    const cam = this.scene.camera;
    const b = this.scene.boardGroup;
    const V = cam.position.constructor;
    const save = rig.snapshotTarget();
    const saveLock = rig.lockState;
    let lo = 1e9, hi = -1e9;
    try {
      rig.lockState = null;
      rig.snap({ center: t.center.clone(), nx: t.nx, ny: 0, radius: t.radius, elev: t.elev, azim: t.azim, fov: t.fov });
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU;
        const p = b.localToWorld(new V(Math.cos(a) * 3.30, 0.035, Math.sin(a) * 3.30)).project(cam);
        if (p.y < lo) lo = p.y;
        if (p.y > hi) hi = p.y;
      }
    } catch (e) {
      lo = 0; hi = 0;
    } finally {
      rig.snap(save);
      rig.lockState = saveLock;
    }
    if (!isFinite(lo) || !isFinite(hi)) return 0;
    return +clamp(-(lo + hi) / 2, -0.12, 0.12).toFixed(4);
  }

  /* 宿主尺寸变化（table boardwrap 在 mount 后才定高 / 题卡开合会改高度）→ 按当前纵横比重算 overview 距离并回正 */
  handleResize() {
    const fitPhases = { idle: 1, win: 1, boot: 1 };
    if (this.busy || this.holding || !fitPhases[this.phase]) { this._fitPending = true; return; }
    this._fitPending = false;
    this.scene.applyPose({ theta: 0, tx: 0, tz: 0 });
    this.scene.rig.snap(this._overview());
  }
  _focus() {
    return { center: new THREE.Vector3(0, PLANE_Y, 0), nx: 0, ny: 0, radius: 3.05, elev: 33, azim: 0, fov: 42 };
  }
  _roll() {
    /* V9.3：摇骰取景对准新落点（棋盘中心附近）＋手从右下入画。
     * 窄屏（390/430 的 boardwrap 纵横比≈0.63–0.66）按 host 纵横比自适应拉远，
     * 保证「手—骰子—两次弹跳」都在框内；320 的宿主更扁，保持 1× 距离。 */
    const aspect = this.scene.rig.aspect || 1;
    const fit = clamp(0.657 / Math.max(0.35, aspect), 1, 1.32);
    return {
      center: new THREE.Vector3(0.76, 0.29, 0.64),
      nx: 0, ny: 0, radius: 3.95 * fit, elev: 50, azim: 7, fov: 42
    };
  }
  _land() {
    return { center: new THREE.Vector3(0, 0.12, 0), nx: 0, ny: 0.02, radius: 4.05, elev: 46, azim: 0, fov: 42 };
  }
  _stage() {
    return {
      center: new THREE.Vector3(0, TILE_BOTTOM + STAGE_RISE + 0.34, 0),
      nx: this.stageAim.nx, ny: this.stageAim.ny,
      radius: this.scene.rig.distForCover(0.40, 0.52, 42),
      elev: 45, azim: STAGE_AZIM, fov: 42
    };
  }

  /* 瞬时（reduced）：只落终态，不做镜头链 */
  async _runReduced(events) {
    this.scene.setFlyMode(false);
    this.scene.setDieVisible(true);
    const dice = events.find((e) => e.type === 'dice');
    if (dice) this.scene.placeDie(dice.die);
    const motions = events.filter(isMotionEvent);
    for (const ev of motions) {
      const id = ev.pieceId;
      const dest = motionDest(ev);
      if (id && dest) this.scene.setPlaneToSquare(id, dest);
    }
    if (!motions.length) {
      const target = this._squareOf(this._movingPieceId);
      if (target) this.scene.setPlaneToSquare(this._movingPieceId, target);
    }
    this._setPhase('idle');
  }

  async _run(events, opts) {
    if (this.reduced) return this._runReduced(events);
    if (this.holding) await this.returnToOverview();

    const diceEv = events.find((e) => e.type === 'dice');
    const motionEvs = events.filter(isMotionEvent);
    const promptEv = events.find((e) => e.type === 'prompt' && e.prompt);
    const minigameEv = events.find((e) => e.type === 'minigame');
    const captureEv = events.find((e) => e.type === 'capture');
    const stackEv = events.find((e) => e.type === 'stack');
    const winEv = events.find((e) => e.type === 'win');
    const ledgerEv = events.find((e) => e.type === 'ledger');
    const safeEv = events.find((e) => e.type === 'safe');

    if (diceEv) {
      await this._phaseRoll(diceEv);
      if (!motionEvs.length && !promptEv && !minigameEv && !winEv) {
        await this.returnToOverview();
        return;
      }
    }

    if (!motionEvs.length) {
      const prompt = promptEv && promptEv.prompt;
      if (winEv || (prompt && prompt.kind === 'ending')) {
        await this._phaseWin();
        return;
      }
      if (ledgerEv || safeEv) { await this.returnToOverview(); return; }
      /* 只有 heat/streak/turn 等状态事件：保持俯瞰 */
      this._setPhase('idle');
      return;
    }

    const first = motionEvs[0];
    const pieceId = first.pieceId || (captureEv && captureEv.attackerId);
    if (!pieceId) return;
    /* V9.3：骰子落点在棋盘中心附近；镜头链会让棋盘旋转/平移，骰子不随盘转 →
     * 进入 focus/fly/land/cell45 时把骰子（和接触影）收起来，回俯瞰再出现。 */
    this.scene.setDieVisible(false);
    this._movingPieceId = pieceId;
    this.scene.ensurePlane(pieceId, this._colorFor(pieceId), this._playerOf(pieceId));
    this.targetSquare = motionDest(motionEvs[motionEvs.length - 1]);
    const origin = this._originFor(first, pieceId);
    await this._phaseFocus(pieceId, origin);
    this._setPhase('fly');
    this.scene.fixPlane(pieceId);
    this.scene.setFlyMode(true);          /* 飞行中隐去格面中文（旋转斜置的字不做主视觉） */
    this.scene.lockProbeId = pieceId;
    this.scene.lockStats.reset();
    this.scene.setStreaks(true);
    this.sfx.whoosh();
    let at = origin;
    for (const ev of motionEvs) {
      at = await this._animateMotion(ev, at, pieceId);
    }
    this._lastSquare = at;
    this.scene.setStreaks(false);
    await this._phaseLand(pieceId, at);
    if (captureEv) await this._phaseCapture(captureEv, at);
    if (stackEv) {
      this.scene.setTargetGlow(at, 0.8);
      await this._phaseStack(stackEv);
    }

    const prompt = promptEv && promptEv.prompt;
    const isEnding = !!(prompt && prompt.kind === 'ending');
    if (isEnding || (winEv && !prompt)) {
      await this._phaseWin();
      return;
    }
    if (promptEv || minigameEv) {
      await this._phaseCell(pieceId, at);
      if (this._instantNext || this.reduced) await this.returnToOverview(pieceId, at);
      return;
    }
    await this.returnToOverview(pieceId, at);
  }

  _originFor(firstEvent, pieceId) {
    const fromEvent = motionOrigin(firstEvent);
    if (fromEvent) return fromEvent;
    const sq = this._squareOf(pieceId);
    if (sq) return sq;
    const p = firstEvent.path && firstEvent.path[0];
    return p || 'ring:0';
  }

  async _phaseRoll(diceEv) {
    this._setPhase('roll');
    const die = clamp(Number(diceEv.die) || 1, 1, 6);
    if (this.reduced) { this.scene.placeDie(die); return; }
    this.scene.setDieVisible(true);
    this.sfx.whoosh();
    /* 相机推近与「手进入」并行：roll 段总时长 = max(560, toss 2400) ≈ 2.4s ≤ 2.5s */
    const camTask = this._animateCamera(560, this._roll());
    const tossTask = this.scene.tossDie(die, this._instantNext || this._skipUntilIdle, {
      onRelease: () => this.sfx.dice(),
      onImpact: (t, speed) => this.sfx.diceLand(speed),
      onSettle: () => this.sfx.tick()
    });
    await Promise.all([camTask, tossTask]);
  }

  async _phaseFocus(pieceId, origin) {
    this._setPhase('focus');
    const targetPose = poseForSquare(origin);
    const target = this._focus();
    this.scene.setPlaneToSquare(pieceId, origin);
    this.scene.setTargetGlow(origin, 0.5);
    if (this.scene.reduced) {
      this.scene.applyPose(targetPose);
      this.scene.rig.snap(target);
      return;
    }
    const fromPose = this.scene.boardPose();
    const camFrom = this.scene.rig.snapshotTarget();
    await this._animateCamera(950, target, (e) => {
      const pose = interpPose(fromPose, targetPose, e);
      this.scene.applyPose(pose);
      const pm = this.scene.planes.get(pieceId);
      if (!pm) return target.center.clone();
      const w = pm.local.clone();
      this.scene.boardGroup.localToWorld(w);
      return w;
    });
    this.scene.applyPose(targetPose);
    const pm = this.scene.planes.get(pieceId);
    if (pm) {
      this.scene.rig.state.center.copy(pm.group.position);
      this.scene.rig.apply();
    }
  }

  async _slideTo(targetPose, ms) {
    const fromPose = this.scene.boardPose();
    if (this.scene.reduced) {
      this.scene.applyPose(targetPose);
      return;
    }
    await this._anim(ms, (k) => {
      const e = easeInOut(clamp(k, 0, 1));
      this.scene.applyPose(interpPose(fromPose, targetPose, e));
    });
    this.scene.applyPose(targetPose);
  }

  async _animateMotion(ev, at, pieceId) {
    if (ev.type === 'move') {
      const path = (ev.path || []).slice();
      for (const sq of path) {
        this.scene.setTargetGlow(sq, 0.5);
        const ms = String(sq).indexOf('home:') === 0 ? 190 : 165;
        await this._slideTo(poseForSquare(sq), ms);
        at = sq;
        this.sfx.tick();
      }
      return at;
    }
    if (ev.type === 'takeoff') {
      const dest = motionDest(ev) || at;
      const pm = this.scene.planes.get(pieceId);
      if (pm) pm.group.scale.setScalar(0.82);
      this.scene.setTargetGlow(dest, 0.55);
      await this._slideTo(poseForSquare(dest), 900);
      if (pm) pm.group.scale.setScalar(1);
      this.sfx.whoosh();
      return dest;
    }
    if (ev.type === 'jump' || ev.type === 'fly') {
      const dest = motionDest(ev) || at;
      this.scene.setTargetGlow(dest, 0.8);
      await this._slideTo(poseForSquare(dest), ev.type === 'jump' ? 540 : 840);
      this.sfx.whoosh();
      return dest;
    }
    return at;
  }

  async _phaseLand(pieceId, square) {
    this._setPhase('land');
    this.scene.setFlyMode(false);         /* 落地：格面中文恢复（正立可读） */
    this.scene.rig.unlock();
    this.scene.lockProbeId = null;
    this.scene.setPlaneToSquare(pieceId, square);
    this.scene.setTargetGlow(square, 0.7);
    this.scene.playRipple(this._instantNext || this._skipUntilIdle);
    this.sfx.land();
    if (this.scene.reduced) {
      this.scene.rig.snap(this._land());
      return;
    }
    await this._animateCamera(460, this._land());
    if (!this._instantNext) this.scene.pulseTargetGlow(380);
  }

  async _phaseStack(stackEv) {
    this._setPhase('stack');
    if (!this._instantNext) this.scene.pulseTargetGlow(520);
    const ids = (stackEv && stackEv.pieceIds) || [];
    for (const id of ids) {
      const pm = this.scene.planes.get(id);
      if (pm) pm.group.scale.setScalar(1.14);
    }
    if (this.scene.reduced) return;
    await this._anim(320, (k) => {
      const s = 1 + Math.sin(k * Math.PI) * 0.14;
      for (const id of ids) {
        const pm = this.scene.planes.get(id);
        if (pm) pm.group.scale.setScalar(s);
      }
    });
    for (const id of ids) {
      const pm = this.scene.planes.get(id);
      if (pm) pm.group.scale.setScalar(1);
    }
  }

  async _phaseCapture(captureEv, at) {
    this._setPhase('capture');
    this.scene.rig.shake(320, 0.06);
    this.sfx.capture();
    const victims = (captureEv && captureEv.victimIds) || [];
    for (const id of victims) {
      const color = this._colorFor(id);
      const vp = this.scene.ensurePlane(id, color, this._playerOf(id));
      const startLoc = localOfSquare(at);
      vp.local.set(startLoc.x, startLoc.y, startLoc.z);
      vp.localYaw = startLoc.yaw;
      vp.mode = 'board';
      vp.group.visible = true;
      vp.group.scale.setScalar(1);
      this.scene._applyPlaneLocal(vp);
      this.scene.updatePlaneTransforms();
      const homeSquare = this._squareOf(id) || ('hangar:' + color + ':0');
      const endLoc = localOfSquare(homeSquare);
      if (this.scene.reduced) {
        this.scene.setPlaneToSquare(id, homeSquare);
        continue;
      }
      await this._anim(700, (k) => {
        const e = easeInOut(clamp(k, 0, 1));
        vp.local.set(
          lerp(startLoc.x, endLoc.x, e),
          lerp(startLoc.y, endLoc.y, e) + Math.sin(k * Math.PI) * 0.55,
          lerp(startLoc.z, endLoc.z, e)
        );
        vp.localYaw = startLoc.yaw + e * 5;
        vp.group.scale.setScalar(1 - e * 0.35);
        this.scene._applyPlaneLocal(vp);
        this.scene.updatePlaneTransforms();
      });
      this.scene.hidePlane(id);
    }
  }

  async _phaseCell(pieceId, square) {
    if (this.scene.reduced) {
      await this.returnToOverview(pieceId, square);
      return;
    }
    this._setPhase('cell45');
    this.scene.setDim(0.18);
    this.scene.setStageSquare(square);
    this.scene.stageShadow.position.set(0, 0.004, 0);
    this.scene.stageShadow.material.opacity = 0;
    this.scene.stageShadow.scale.setScalar(1);
    this.scene.setStageRise(0);
    this.scene.setStageVisible(true);
    this.scene.setBearVisible(false);
    this.scene.bear.group.scale.setScalar(0.001);
    this.scene.bear.group.rotation.y = Math.PI + STAGE_AZIM * DEG;
    this.scene.hidePlane(pieceId);
    this.scene.setTargetGlow(null);

    const target = this._stage();
    const camFrom = this.scene.rig.snapshotTarget();
    const camTask = this._animateCamera(900, target, (e) => new THREE.Vector3(
      0,
      lerp(camFrom.center.y, target.center.y, e),
      0
    ));
    const riseTask = this._anim(900, (k) => {
      const e = easeInOut(clamp(k, 0, 1));
      this.scene.setDim(lerp(1, 0.18, smoothstep(0, 0.75, k)));
      this.scene.setStageRise(lerp(0, STAGE_RISE, e));
      this.scene.stageShadow.material.opacity = lerp(0, 0.5, smoothstep(0.2, 1, k));
      this.scene.stageShadow.scale.setScalar(lerp(1, 0.7, e));
    });
    await Promise.all([camTask, riseTask]);
    this.scene.setDim(0.18);
    this.scene.setStageRise(STAGE_RISE);
    this.scene.rig.snap(target);
    this.scene.setBearVisible(true);
    this._setPhase('bear');
    this.sfx.bear();
    const yaw = Math.PI + STAGE_AZIM * DEG;
    await this._anim(560, (k) => {
      const e = k < 0.6 ? easeOut(k / 0.6) * 1.14 : 1.14 - ((k - 0.6) / 0.4) * 0.14;
      this.scene.bear.group.scale.setScalar(clamp(e, 0.001, 1.15));
      this.scene.bear.group.rotation.y = yaw + Math.sin(k * Math.PI * 2) * 0.06;
    });
    this.scene.bear.group.scale.setScalar(1);
    this.scene.bear.group.rotation.y = yaw;
    this.scene.setBearVisible(true);
    this.cellCtx = { pieceId, square };
    this.holding = true;
    this._setPhase('bear');
  }

  async _phaseWin() {
    await this.returnToOverview(this._movingPieceId, this._lastSquare);
    if (this.reduced) {
      this._setPhase('idle');
      return;
    }
    this._setPhase('win');
    this.sfx.win();
    this.scene.setTargetGlow(null);
    this.scene.setDim(1);
    this.scene.requestRender();
  }

  async returnToOverview(pieceId, square) {
    const held = this.cellCtx;
    const piece = pieceId || (held && held.pieceId) || this._movingPieceId;
    const sq = square || (held && held.square) || this._lastSquare || (piece ? this._squareOf(piece) : null);
    this.cellCtx = null;
    this.holding = false;
    this.scene.lockProbeId = null;
    this.scene.setStreaks(false);
    this.scene.setFlyMode(false);
    this.scene.setTargetGlow(null);
    this.scene.setBearVisible(false);
    this.scene.bear.group.scale.setScalar(0.001);
    this.scene.setStageVisible(false);
    this.scene.setStageRise(0);
    this.scene.setDim(1);

    this._setPhase('return');
    this.targetSquare = null;
    const poseFrom = this.scene.boardPose();
    const dTheta = shortestDelta(poseFrom.theta, 0);
    const camFrom = this.scene.rig.snapshotTarget();
    const target = this._overview();
    if (!this.scene.reduced) {
      await this._anim(700, (k) => {
        const e = easeInOut(clamp(k, 0, 1));
        this.scene.applyPose({
          theta: poseFrom.theta + dTheta * e,
          tx: poseFrom.tx * (1 - e),
          tz: poseFrom.tz * (1 - e)
        });
        const cs = this.scene.rig.state;
        cs.center.lerpVectors(camFrom.center, target.center, e);
        cs.nx = lerp(camFrom.nx, target.nx, e);
        cs.ny = lerp(camFrom.ny, target.ny, e);
        cs.radius = lerp(camFrom.radius, target.radius, e);
        cs.elev = lerp(camFrom.elev, target.elev, e);
        cs.azim = lerp(camFrom.azim, target.azim, e);
        cs.fov = lerp(camFrom.fov, target.fov, e);
        this.scene.rig.apply();
      });
    }
    this.scene.applyPose({ theta: 0, tx: 0, tz: 0 });
    if (piece && sq) this.scene.setPlaneToSquare(piece, sq);
    this.scene.setDieVisible(true);
    /* 不要在动画开始前算好的 target 上 snap：题卡收起/布局变化会在这 700ms 里改 host 高度，
     * 结束时应按“当前纵横比”重新计算 overview 距离。 */
    this.scene.rig.snap(this._overview());
    this._setPhase('idle');
    /* 回俯瞰途中 host 高度变了（题卡收起）：用最新纵横比再 fit 一次 */
    if (this._fitPending) {
      this._fitPending = false;
      try { this.handleResize(); } catch (e) { /* noop */ }
    }
  }

  debug() {
    return {
      phase: this.phase,
      busy: this.busy,
      holding: this.holding,
      reduced: this.reduced,
      target: this.targetSquare,
      lastSquare: this._lastSquare,
      cell: this.cellCtx ? { ...this.cellCtx } : null,
      movingPiece: this._movingPieceId,
      die: this.scene && this.scene.dieDebug ? this.scene.dieDebug() : null
    };
  }

  dispose() {
    this._queue = Promise.resolve();
    this.busy = false;
    this.holding = false;
    this.cellCtx = null;
    this.scene = null;
    this.host = null;
  }
}
