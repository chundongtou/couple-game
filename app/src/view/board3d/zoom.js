/* ==========================================================================
 * V9 · 真 3D 主桌 · 镜头缩放（纯状态机：不依赖 three / DOM）
 *
 * 语义：zoom = 用户缩放倍数，1 = 默认俯瞰；>1 拉近，<1 拉远。
 *   范围 0.8×–1.5×（docs/v9/impl-freeze.md §3）。
 * 相机距离倍率（相对 overview 基准距离，见 camera.js 的 apply）：
 *   zoom ≤ 1：1/zoom              （0.8 → 1.25，整盘缩小）
 *   zoom > 1：1 - 0.6*(zoom-1)    （1.5 → 0.70，越拉越近）
 *   即倍率始终落在 [0.7, 1.4] 内 —— 冻结单给的是「0.8×–1.5×」或「半径 0.7–1.4」两种
 *   等价口径，这里两端同时满足，且 1× 一定等于基准取景（不改变默认构图）。
 * 阻尼：一阶低通（tau≈110ms），按 apply 的真实帧间隔推进；reduced/instant 瞬时到位。
 * 锁定：active=false 时视觉目标先回 1×（镜头链期间不叠加用户缩放，防止镜头链被拽抖），
 *       target 保留；回 idle 后平滑恢复用户缩放。换局（重新 mount）由新实例重置为 1×。
 * ========================================================================== */

export const ZOOM_MIN = 0.8;
export const ZOOM_MAX = 1.5;
export const RADIUS_MIN = 0.7;
export const RADIUS_MAX = 1.4;
export const ZOOM_TAU = 110;

export function clampZoom(v) {
  const n = Number(v);
  if (!isFinite(n)) return 1;
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, n));
}

/* 相机距离倍率：>1 表示相机更远（画面更小） */
export function radiusFactor(zoom) {
  const z = clampZoom(zoom);
  const f = z <= 1 ? 1 / z : 1 - 0.6 * (z - 1);
  return Math.min(RADIUS_MAX, Math.max(RADIUS_MIN, f));
}

export class ZoomState {
  constructor(opts = {}) {
    this.min = opts.min || ZOOM_MIN;
    this.max = opts.max || ZOOM_MAX;
    this.tau = opts.tau || ZOOM_TAU;
    this.target = 1;      /* 用户想要的倍数（夹取后） */
    this.value = 1;       /* 当前渲染用的倍数（阻尼后） */
    this.active = true;   /* false = 镜头链中，视觉先回 1× */
    this.instant = false; /* true = reduced：无动画 */
  }

  set(v) {
    const n = Number(v);
    if (isFinite(n)) this.target = Math.min(this.max, Math.max(this.min, n));
    if (this.instant) this.value = this.target;
    return this.target;
  }

  by(f) {
    const k = Number(f);
    return this.set(this.target * (isFinite(k) && k > 0 ? k : 1));
  }

  reset() { return this.set(1); }

  setActive(on) {
    const next = !!on;
    if (next === this.active) return this.active;
    this.active = next;
    if (this.instant) this.value = this.want();
    return this.active;
  }

  setInstant(on) {
    this.instant = !!on;
    if (this.instant) this.value = this.want();
    return this.instant;
  }

  want() { return this.active ? this.target : 1; }

  /* 推进阻尼；dt 单位 ms。返回本帧应使用的倍数 */
  step(dt) {
    const want = this.want();
    if (this.instant || !(dt > 0)) { this.value = want; return this.value; }
    const k = 1 - Math.exp(-dt / this.tau);
    const next = this.value + (want - this.value) * k;
    this.value = Math.abs(want - next) < 0.0008 ? want : next;
    return this.value;
  }

  info() {
    return {
      value: +this.value.toFixed(3),
      target: +this.target.toFixed(3),
      min: this.min,
      max: this.max,
      active: this.active,
      instant: this.instant,
      radiusFactor: +radiusFactor(this.value).toFixed(3)
    };
  }
}
