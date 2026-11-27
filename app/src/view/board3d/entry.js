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
 *   V9 缩放（docs/v9/impl-freeze.md §3）：
 *   App.Board3D.canZoom() / setZoom(v) / zoomBy(f) / resetZoom() / zoomInfo()
 *       仅 overview/idle（且不在 play/holding）可用；镜头链中返回 false。
 *       换局（重新 mount）重置为 1×；题卡/镜头链结束后自动恢复用户缩放。
 *
 * 本模块只创建 canvas（pointer-events:none）与场景；不建 HUD/题卡/按钮/主题条。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import { VERSION, THEMES } from './constants.js';
import { BoardScene } from './scene.js';
import { Director } from './director.js';

const HOST_ATTRS = ['data-3d-phase', 'data-3d-ready', 'data-3d-reduced', 'data-3d-theme', 'data-3d-mode', 'data-3d-fallback', 'data-3d-zoom', 'data-3d-zoom-value', 'data-3d-zoom-lock'];
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
    this._refitTimer = 0;
    this._zoomPumpUntil = 0;
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
      quality: this.opts.quality || undefined,
      shadows: this.opts.shadows !== false,
      adapt: this.opts.adapt !== false
    });
    if (this.scene.rig) this.scene.rig.setZoomReduced(this.reduced);
    this.scene.onReady = () => this._onReady();
    if (this.scene.ready) this._onReady();

    this.director = new Director(this.scene, {
      host: host,
      reduced: this.reduced,
      sound: !!this.opts.sound,
      stageAim: this.opts.stageAim || { nx: 0, ny: 0.15 }
    });
    this._hookZoomPhase();
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
    this._syncZoomHost();

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
    /* V9：reduced 下缩放即时到位（无动画），再补一帧把新距离画出来 */
    if (this.scene && this.scene.rig) {
      this.scene.rig.setZoomReduced(this.reduced);
      this._syncZoomHost();
      if (this.reduced) { try { this.scene.renderNow(); } catch (e) { /* noop */ } }
    }
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

  /* ---------------------- V9 镜头缩放（docs/v9/impl-freeze.md §3） ----------------------
   * 锁定口径：只有 overview/idle（且不在 play/holding）允许改缩放；focus/fly/land/
   * cell45/bear/题卡/加载一律拒绝（返回 false）。用户缩放值保留在相机里，回 idle 后
   * 由 CameraRig 平滑恢复；新一局 mount 出新实例 = 1×。
   *
   * director.js 不在 fe-zoom 写作用域（V9 由 fe-cinematic 继续改镜头链），所以这里用
   * 一段薄 hook 监听导演的阶段切换：不改变导演行为，只把「是否允许缩放 + 视觉是否先归 1×」
   * 同步给相机。若将来 director 自己暴露阶段回调，可无损替换这 20 行。 */
  _hookZoomPhase() {
    const d = this.director;
    if (!d || d.__zoomHooked) return;
    d.__zoomHooked = true;
    const orig = d._setPhase.bind(d);
    d._setPhase = (name) => {
      orig(name);
      this._onPhase(name);
    };
    this._onPhase(d.phase);
  }

  _onPhase(name) {
    const active = name === 'idle' || name === 'boot';
    if (this.scene && this.scene.rig) this.scene.rig.setZoomActive(active);
    if (this.host) this.host.setAttribute('data-3d-zoom-lock', active ? '0' : '1');
    this._syncZoomHost();
    if (active) this._zoomPump();   /* 回 idle：把恢复用户缩放的阻尼帧也推起来 */
  }

  /* 测试/调试用宿主属性：data-3d-zoom = 用户目标倍数，data-3d-zoom-value = 当前阻尼值 */
  _syncZoomHost() {
    const rig = this.scene && this.scene.rig;
    if (!rig || !this.host || typeof rig.zoomInfo !== 'function') return;
    const info = rig.zoomInfo();
    this.host.setAttribute('data-3d-zoom', Number(info.target).toFixed(2));
    this.host.setAttribute('data-3d-zoom-value', Number(info.value).toFixed(2));
  }

  canZoom() {
    const d = this.director;
    if (!this.ready || !this.scene || !d) return false;
    if (this._busy || d.busy || d.holding) return false;
    return d.phase === 'idle' || d.phase === 'boot';
  }

  zoomInfo() {
    const rig = this.scene && this.scene.rig;
    if (!rig || typeof rig.zoomInfo !== 'function') return null;
    const info = rig.zoomInfo();
    info.can = this.canZoom();
    return info;
  }

  setZoom(v) {
    if (!this.canZoom() || !this.scene || !this.scene.rig) return false;
    const t = this.scene.rig.setZoom(v);
    this._zoomChanged();
    return t;
  }

  zoomBy(f) {
    if (!this.canZoom() || !this.scene || !this.scene.rig) return false;
    const t = this.scene.rig.zoomBy(f);
    this._zoomChanged();
    return t;
  }

  resetZoom() {
    if (!this.canZoom() || !this.scene || !this.scene.rig) return false;
    const t = this.scene.rig.resetZoom();
    this._zoomChanged();
    return t;
  }

  _zoomChanged() {
    this._syncZoomHost();
    if (this.reduced) { try { this.scene.renderNow(); } catch (e) { /* noop */ } }
    this._zoomPump();
    /* 缩放后按 host 尺寸 refit：重算 overview 距离/居中（纵横比变化或缩放后都按当前
     * host 宽高取景，防止窗口尺寸/题卡开合把棋盘裁出框）。捏合期间高频触发 → 防抖，
     * 且只在 idle（canZoom）才动镜头，绝不打断镜头链。 */
    if (this._refitTimer) clearTimeout(this._refitTimer);
    this._refitTimer = setTimeout(() => {
      this._refitTimer = 0;
      this._syncZoomHost();
      if (!this.canZoom()) return;
      try { this.director.handleResize(); } catch (e) { /* noop */ }
      this._syncZoomHost();
      if (this.reduced) { try { this.scene.renderNow(); } catch (e2) { /* noop */ } }
    }, 160);
  }

  /* 阻尼需要连续帧推进。V8 场景是常驻 rAF 循环，requestRender 是 no-op；
   * 这里再补 700ms 的 requestRender 泵，万一将来场景改成按需渲染，缩放也不会“跳一下”。 */
  _zoomPump() {
    if (this.reduced || !this.scene) return;
    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    if (now < this._zoomPumpUntil) return;
    this._zoomPumpUntil = now + 700;
    const tick = () => {
      if (!this.scene) return;
      try { this.scene.requestRender(); } catch (e) { /* noop */ }
      const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      if (t < this._zoomPumpUntil) requestAnimationFrame(tick);
      else this._zoomPumpUntil = 0;
    };
    try { requestAnimationFrame(tick); } catch (e) { this._zoomPumpUntil = 0; }
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
    if (this._refitTimer) { clearTimeout(this._refitTimer); this._refitTimer = 0; }
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
    const rig = this.scene && this.scene.rig;
    const z = rig && typeof rig.zoomInfo === 'function' ? rig.zoomInfo() : { value: 1, target: 1, min: 0.8, max: 1.5, active: true, instant: false, radiusFactor: 1 };
    z.can = this.canZoom();
    return {
      version: VERSION,
      ready: !!this.ready,
      mounted: true,
      phase: d.phase || (s.phase || 'boot'),
      zoom: z,
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

function fillLegendPanel() {
  if (typeof document === 'undefined') return;
  const panel = document.querySelector('[data-test="board3d-legend-panel"]');
  if (!panel || panel.querySelector('[data-test="board3d-legend-row"]')) return;
  panel.insertAdjacentHTML('beforeend', Board3D.legendRows());
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
    fillLegendPanel();
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
  /* V9.8：3D 图例数据搬到 chunk 里（首屏省 ~0.2 KB gzip），表头按「内容格 / 走法格 / 其它」分组。 */
  legendRows() {
    const rows = [
      ['真', '真心话', '抽一张真心话'],
      ['敢', '大冒险', '抽一张大冒险'],
      ['触', '靠近', '抽一张靠近的题'],
      ['缘', '命运', '两张挑一张'],
      ['温', '温度计', '小游戏·温度计'],
      ['轮', '转盘', '小游戏·转盘'],
      ['起', '起飞', '掷6起飞，两次保底'],
      ['飞', '飞点', '向前 12 格'],
      ['停', '禁跳', '这一格不跳'],
      ['归', '进航', '进自己的航线'],
      ['·', '普通格', '不抽题，走过去']
    ];
    const head = { 0: '<div class="v6-l3h2" style="margin:4px 0 1px;font-size:9.5px;color:#F3C077">内容格</div>', 6: '<div class="v6-l3h2" style="margin:4px 0 1px;font-size:9.5px;color:#F3C077">走法格</div>', 10: '<div class="v6-l3h2" style="margin:4px 0 1px;font-size:9.5px;color:#F3C077">其它</div>' };
    const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    return rows.map((r, i) => (head[i] || '') + '<div class="v6-l3r" data-test="board3d-legend-row"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + ' · ' + esc(r[2]) + '</span></div>').join('');
  },
  get mounted() { return !!current; },
  get threeRevision() { return THREE.REVISION; },
  mount,
  setState(state, view) { return current ? current.setState(state, view) : false; },
  play(events, opts) { return current ? current.play(events, opts) : Promise.resolve(); },
  setTheme(id) { return current ? current.setTheme(id) : false; },
  setReduced(flag) { return current ? current.setReduced(flag) : false; },
  setSound(flag) { return current ? current.setSound(flag) : false; },
  skip() { return current ? current.skip() : false; },
  /* V9 缩放：镜头链中恒定返回 false（锁定），overview/idle 返回新的 zoom 倍数 */
  canZoom() { return current ? current.canZoom() : false; },
  setZoom(v) { return current ? current.setZoom(v) : false; },
  zoomBy(f) { return current ? current.zoomBy(f) : false; },
  resetZoom() { return current ? current.resetZoom() : false; },
  zoomInfo() { return current ? current.zoomInfo() : null; },
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
