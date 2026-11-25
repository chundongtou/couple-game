/* ==========================================================================
 * V8 · 真 3D 主桌 · 生产入口（ESM，构建时由 esbuild bundle 成 IIFE chunk）
 *   import * as THREE from '../../../render/node_modules/three/build/three.module.js'
 *   挂载：window.App.Board3D
 *
 * API（冻结单 §3.2）：
 *   App.Board3D.mount(host, {reduced, theme, state, view, mode, sound, stageAim})
 *        -> Promise<inst|null>（不阻塞；WebGL2 不可用/初始化失败返回 null）
 *   App.Board3D.setState(state, view)   同步飞机/骰子/热度/当前玩家
 *   App.Board3D.play(events, opts)     事件驱动镜头链，返回 Promise（永不 reject）
 *   App.Board3D.setTheme(id) / setReduced(flag) / setSound(flag)
 *   App.Board3D.skip() / unmount() / _debug()
 *
 * 本模块只创建 canvas（pointer-events:none）与场景；不建 HUD/题卡/按钮/主题条。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import { VERSION, THEMES } from './constants.js';
import { BoardScene } from './scene.js';
import { Director } from './director.js';

const HOST_ATTRS = ['data-3d-phase', 'data-3d-ready', 'data-3d-reduced', 'data-3d-theme', 'data-3d-mode', 'data-3d-fallback'];
let current = null;

function globalRoot() {
  if (typeof window !== 'undefined') return window;
  if (typeof globalThis !== 'undefined') return globalThis;
  return null;
}

function pickTheme(id) {
  if (id && THEMES[id]) return id;
  try {
    const app = globalRoot() && globalRoot().App;
    const t = app && app.Themes && app.Themes.get ? app.Themes.get() : null;
    if (t && THEMES[t]) return t;
  } catch (e) { /* noop */ }
  return 'cloud';
}

function webgl2Available() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch (e) {
    return false;
  }
}

class Board3DInstance {
  constructor(host, opts) {
    this.host = host;
    this.opts = opts || {};
    this.reduced = !!this.opts.reduced;
    this.theme = pickTheme(this.opts.theme);
    this.mode = this.opts.mode === 'long' ? 'long' : 'quick';
    this.state = null;
    this.view = null;
    this.pending = null;
    this._busy = false;
    this._dieValue = 1;
    this.scene = null;
    this.director = null;
    this.layer = null;
    this.canvas = null;
    this.ready = false;
    this._hostPositionSet = false;
    this._hostOldPosition = '';
  }

  async init() {
    const host = this.host;
    const layer = document.createElement('div');
    layer.className = 'board3d-layer';
    layer.setAttribute('data-test', 'board3d-layer');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';
    const computed = window.getComputedStyle ? window.getComputedStyle(host) : null;
    if (computed && computed.position === 'static') {
      this._hostOldPosition = host.style.position || '';
      host.style.position = 'relative';
      this._hostPositionSet = true;
    }
    const canvas = document.createElement('canvas');
    canvas.className = 'board3d-canvas';
    canvas.setAttribute('data-test', 'board3d-canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;';
    layer.appendChild(canvas);
    host.appendChild(layer);
    host.removeAttribute('data-3d-fallback');
    this.layer = layer;
    this.canvas = canvas;

    this.scene = new BoardScene(host, canvas, {
      reduced: this.reduced,
      theme: this.theme,
      shadows: this.opts.shadows !== false,
      adapt: this.opts.adapt !== false
    });
    this.scene.onReady = () => this._onReady();
    if (this.scene.ready) this._onReady();

    this.director = new Director(this.scene, {
      host: host,
      reduced: this.reduced,
      sound: !!this.opts.sound,
      stageAim: this.opts.stageAim || { nx: 0, ny: 0.15 }
    });
    this.scene.onResize = () => {
      if (this.director) this.director.handleResize();
      this._fitNeeded = true;
      /* 题卡开合/布局收尾可能晚于 ResizeObserver：再补一次 fit，避免停在旧纵横比的取景 */
      if (this._fitTimer) clearTimeout(this._fitTimer);
      this._fitTimer = setTimeout(() => {
        this._fitTimer = 0;
        if (this.director) this.director.handleResize();
      }, 450);
    };
    /* 兜底：table 在题卡开合时会改 boardwrap 高度，个别时序下 RO 与 play 收尾交错；
     * 每 350ms 对比 host 尺寸，空闲时补一次 overview fit（只在尺寸变化/挂起时执行）。 */
    this._sizeW = 0;
    this._sizeH = 0;
    this._fitNeeded = false;
    this._sizeTimer = setInterval(() => {
      if (!this.scene || !this.director) return;
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      if (w !== this._sizeW || h !== this._sizeH) {
        this._sizeW = w;
        this._sizeH = h;
        this.scene.resize();
        this._fitNeeded = true;
      }
      const pending = this._fitNeeded || this.director._fitPending;
      if (pending && !this.director.busy && !this.director.holding) {
        this._fitNeeded = false;
        this.director.handleResize();
      }
    }, 350);
    /* mount 时宿主可能还没拿到最终高度（table 的 .v6-board3d 后定型）：下一帧再 resize+fit 一次 */
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        if (!this.scene) return;
        this.scene.resize();
        try { this.director.handleResize(); } catch (e) { /* noop */ }
      });
    }

    host.setAttribute('data-3d-reduced', this.reduced ? '1' : '0');
    host.setAttribute('data-3d-theme', this.theme);
    host.setAttribute('data-3d-mode', this.mode);
    host.setAttribute('data-3d-phase', 'idle');

    if (this.opts.state) {
      this.setState(this.opts.state, this.opts.view);
    } else {
      this._applyDefaultPieces();
    }
    return this;
  }

  _onReady() {
    if (this.ready) return;
    this.ready = true;
    this.host.setAttribute('data-3d-ready', '1');
  }

  _viewFor(state) {
    if (!state) return null;
    try {
      const app = globalRoot() && globalRoot().App;
      if (app && app.Flight && app.Flight.view) return app.Flight.view(state, { reduced: this.reduced });
    } catch (e) { /* noop */ }
    return null;
  }

  _pieces(state) {
    return ((state && state.pieces) || []).map((p) => ({
      id: p.id,
      color: p.color || 'red',
      playerId: p.playerId || String(p.id).charAt(0),
      squareId: p.squareId || 'hangar:red:0',
      arrived: !!p.arrived,
      stackGroupId: p.stackGroupId || null
    }));
  }

  _dieOf(state) {
    if (!state) return this._dieValue || 1;
    if (state.rollContext && state.rollContext.die) return state.rollContext.die;
    const aw = state.awaiting;
    if (aw && aw.type === 'choose-piece' && aw.die) return aw.die;
    const log = state.log || [];
    for (let i = log.length - 1; i >= 0; i--) {
      if (log[i] && log[i].kind === 'roll' && log[i].die) return log[i].die;
    }
    return this._dieValue || 1;
  }

  _applyDefaultPieces() {
    const defaultPieces = [
      { id: 'a:0', color: 'red', playerId: 'a', squareId: 'hangar:red:0' },
      { id: 'a:1', color: 'red', playerId: 'a', squareId: 'hangar:red:1' },
      { id: 'b:0', color: 'yellow', playerId: 'b', squareId: 'hangar:yellow:0' },
      { id: 'b:1', color: 'yellow', playerId: 'b', squareId: 'hangar:yellow:1' }
    ];
    if (this.scene) {
      this.scene.setPieces(this.mode === 'long' ? defaultPieces.concat([
        { id: 'a:2', color: 'red', playerId: 'a', squareId: 'hangar:red:2' },
        { id: 'a:3', color: 'red', playerId: 'a', squareId: 'hangar:red:3' },
        { id: 'b:2', color: 'yellow', playerId: 'b', squareId: 'hangar:yellow:2' },
        { id: 'b:3', color: 'yellow', playerId: 'b', squareId: 'hangar:yellow:3' }
      ]) : defaultPieces, 'a', { a: 'red', b: 'yellow' });
      this.scene.placeDie(1);
    }
  }

  setState(state, view) {
    if (!state) {
      this._applyDefaultPieces();
      return false;
    }
    this.state = state;
    this.view = view || this._viewFor(state);
    if (this.director) this.director.setState(state, view || this.view);
    const pieces = this._pieces(state);
    const turn = state.turn === 'b' ? 'b' : 'a';
    const colors = state.colors || { a: 'red', b: 'yellow' };
    const die = this._dieOf(state);
    this._dieValue = die;
    if (!this.scene) return false;
    const heat = this.view && this.view.meta ? this.view.meta.heat : (state.meta ? state.meta.heat : 0);
    this.scene.applyHeat(heat);
    this.scene.applyTurn(turn, colors);
    this.scene.placeDie(die);
    const hold = this._busy || (this.director && this.director.holding);
    if (hold) {
      this.pending = { pieces: pieces, turn: turn, colors: colors };
    } else {
      this.scene.setPieces(pieces, turn, colors);
      this.pending = null;
    }
    return true;
  }

  _flushPending() {
    if (!this.pending || !this.scene) return;
    if (this.director && this.director.holding) return;
    const p = this.pending;
    this.pending = null;
    this.scene.setPieces(p.pieces, p.turn, p.colors);
  }

  play(events, opts) {
    if (!this.director) return Promise.resolve();
    this._busy = true;
    const done = () => {
      this._busy = false;
      if (!this.director || !this.director.holding) this._flushPending();
    };
    const p = this.director.play(events, opts);
    p.then(done, done);
    return p;
  }

  setTheme(id) {
    this.theme = pickTheme(id);
    if (this.scene) this.scene.applyTheme(this.theme);
    this.host.setAttribute('data-3d-theme', this.theme);
    return true;
  }

  setReduced(flag) {
    this.reduced = !!flag;
    this.host.setAttribute('data-3d-reduced', this.reduced ? '1' : '0');
    if (this.director) this.director.setReduced(this.reduced);
    else if (this.scene) this.scene.setReduced(this.reduced);
    return true;
  }

  setSound(flag) {
    if (this.director) this.director.setSound(!!flag);
    return true;
  }

  skip() {
    if (this.director) this.director.skip();
    return true;
  }

  /* table 在 CellStage 关闭/结算后显式调用；也可不调用——下一次 play() 会自动回俯瞰 */
  returnToOverview() {
    if (!this.director) return Promise.resolve(false);
    const d = this.director;
    return d.returnToOverview().then(() => {
      if (!d.holding) this._flushPending();
      return true;
    }, () => false);
  }

  unmount() {
    if (this._fitTimer) { clearTimeout(this._fitTimer); this._fitTimer = 0; }
    if (this._sizeTimer) { clearInterval(this._sizeTimer); this._sizeTimer = 0; }
    if (this.director) {
      try { this.director.dispose(); } catch (e) { /* noop */ }
      this.director = null;
    }
    if (this.scene) {
      try { this.scene.dispose(); } catch (e) { /* noop */ }
      this.scene = null;
    }
    if (this.layer && this.layer.parentNode) this.layer.parentNode.removeChild(this.layer);
    this.layer = null;
    this.canvas = null;
    if (this._hostPositionSet) {
      this.host.style.position = this._hostOldPosition;
      this._hostPositionSet = false;
    }
    HOST_ATTRS.forEach((a) => this.host.removeAttribute(a));
    return true;
  }

  _debug() {
    const d = this.director ? this.director.debug() : {};
    const s = this.scene ? this.scene.debugSnapshot() : {};
    const cur = s.current || null;
    return {
      version: VERSION,
      ready: !!this.ready,
      mounted: true,
      phase: d.phase || (s.phase || 'boot'),
      pieces: this._pieces(this.state).map((p) => ({
        id: p.id, color: p.color, playerId: p.playerId, squareId: p.squareId, arrived: p.arrived
      })),
      target: d.target != null ? d.target : (this.director ? this.director._lastSquare : null),
      fps: cur ? cur.fps : 0,
      drawCalls: s.render ? s.render.calls : 0,
      triangles: s.render ? s.render.triangles : 0,
      dpr: s.dpr || 0,
      quality: s.quality || 'high',
      reduced: this.reduced,
      theme: this.theme,
      heat: this.scene ? this.scene.heat : 0,
      turn: this.scene ? this.scene.turn : null,
      mode: this.mode,
      busy: !!d.busy,
      holding: !!d.holding,
      cell: d.cell || null,
      probe: s.probe || null,
      perf: s,
      three: THREE.REVISION
    };
  }
}

async function mount(host, opts) {
  if (!host || typeof document === 'undefined') return null;
  if (current) {
    try { current.unmount(); } catch (e) { /* noop */ }
    current = null;
  }
  if (!webgl2Available()) {
    try { host.setAttribute('data-3d-fallback', 'no-webgl2'); } catch (e) { /* noop */ }
    return null;
  }
  let inst = null;
  try {
    inst = new Board3DInstance(host, opts || {});
    await inst.init();
    current = inst;
    return inst;
  } catch (err) {
    console.warn('[board3d] mount failed:', err && err.message ? err.message : err);
    try { if (inst) inst.unmount(); } catch (e) { /* noop */ }
    try { host.setAttribute('data-3d-fallback', 'mount-failed'); } catch (e) { /* noop */ }
    return null;
  }
}

const Board3D = {
  version: VERSION,
  get mounted() { return !!current; },
  get threeRevision() { return THREE.REVISION; },
  mount,
  setState(state, view) { return current ? current.setState(state, view) : false; },
  play(events, opts) { return current ? current.play(events, opts) : Promise.resolve(); },
  setTheme(id) { return current ? current.setTheme(id) : false; },
  setReduced(flag) { return current ? current.setReduced(flag) : false; },
  setSound(flag) { return current ? current.setSound(flag) : false; },
  skip() { return current ? current.skip() : false; },
  returnToOverview() { return current ? current.returnToOverview() : Promise.resolve(false); },
  unmount() {
    if (!current) return false;
    try { current.unmount(); } catch (e) { /* noop */ }
    current = null;
    return true;
  },
  _debug() {
    if (!current) return { version: VERSION, ready: false, mounted: false, phase: 'boot', pieces: [], target: null, fps: 0, drawCalls: 0 };
    return current._debug();
  },
  _current() { return current; }
};

const g = globalRoot();
if (g) {
  g.App = g.App || {};
  g.App.Board3D = Board3D;
}

export { Board3D };
export default Board3D;
