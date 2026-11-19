/* ==========================================================================
 * V8 · 真 3D 主桌 · 相机（导演镜头）
 * 关键手法（P0 已验证）：把 [look 中心 + NDC 目标 + 距离/俯仰/方位] 解算成相机位姿；
 * focus/fly 时锁相机，让棋盘旋转+平移，飞机钉在屏幕中心。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import { DEG, clamp, lerp, easeInOut } from './constants.js';

export class CameraRig {
  constructor(camera, opts = {}) {
    this.camera = camera;
    this.runAnim = opts.runAnim || ((ms, fn) => { fn(1); return Promise.resolve(); });
    this.aspect = 1;
    this.lockState = null;
    this.shakeUntil = 0;
    this.shakeAmp = 0;
    this.state = {
      center: new THREE.Vector3(0, 0.05, 0.24),
      nx: 0, ny: 0,
      radius: 12, elev: 58, azim: 0, fov: 42
    };
    this._right = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._proj = new THREE.Vector3();
    this._look = new THREE.Vector3();
  }

  setAspect(a) {
    this.aspect = Math.max(0.2, a || 1);
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  camPosFrom(look, radius, elevDeg, azimDeg) {
    const e = elevDeg * DEG, a = azimDeg * DEG;
    return new THREE.Vector3(
      look.x + radius * Math.cos(e) * Math.sin(a),
      look.y + radius * Math.sin(e),
      look.z + radius * Math.cos(e) * Math.cos(a)
    );
  }

  apply() {
    const cam = this.camera;
    if (this.lockState) {
      cam.position.copy(this.lockState.pos);
      cam.quaternion.copy(this.lockState.quat);
      if (cam.fov !== this.lockState.fov) { cam.fov = this.lockState.fov; cam.updateProjectionMatrix(); }
      this._applyShake();
      cam.updateMatrixWorld(true);
      return;
    }
    const cs = this.state;
    if (cam.fov !== cs.fov) { cam.fov = cs.fov; cam.updateProjectionMatrix(); }
    const look = this._look.copy(cs.center);
    for (let i = 0; i < 3; i++) {
      cam.position.copy(this.camPosFrom(look, cs.radius, cs.elev, cs.azim));
      cam.lookAt(look);
      cam.updateMatrixWorld(true);
      if (cs.nx === 0 && cs.ny === 0) break;
      this._proj.copy(cs.center).project(cam);
      const d = cam.position.distanceTo(cs.center);
      const halfH = d * Math.tan((cs.fov * DEG) / 2);
      const halfW = halfH * this.aspect;
      this._right.setFromMatrixColumn(cam.matrixWorld, 0);
      this._up.setFromMatrixColumn(cam.matrixWorld, 1);
      look.addScaledVector(this._right, (this._proj.x - cs.nx) * halfW);
      look.addScaledVector(this._up, (this._proj.y - cs.ny) * halfH);
    }
    cam.position.copy(this.camPosFrom(look, cs.radius, cs.elev, cs.azim));
    cam.lookAt(look);
    this._applyShake();
    cam.updateMatrixWorld(true);
  }

  _applyShake() {
    if (!this.shakeAmp) return;
    if (performance.now() > this.shakeUntil) { this.shakeAmp = 0; return; }
    const a = this.shakeAmp;
    this.camera.position.x += (Math.random() - 0.5) * a;
    this.camera.position.y += (Math.random() - 0.5) * a;
    this.camera.position.z += (Math.random() - 0.5) * a;
  }

  shake(ms, amp) {
    this.shakeUntil = performance.now() + Math.max(1, ms);
    this.shakeAmp = amp;
  }

  lock() {
    this.lockState = {
      pos: this.camera.position.clone(),
      quat: this.camera.quaternion.clone(),
      fov: this.camera.fov
    };
  }

  unlock() { this.lockState = null; }
  get locked() { return !!this.lockState; }

  snapshotTarget() {
    return {
      center: this.state.center.clone(),
      nx: this.state.nx, ny: this.state.ny,
      radius: this.state.radius, elev: this.state.elev,
      azim: this.state.azim, fov: this.state.fov
    };
  }

  snap(target) {
    const cs = this.state;
    cs.center.copy(target.center);
    cs.nx = target.nx; cs.ny = target.ny;
    cs.radius = target.radius; cs.elev = target.elev;
    cs.azim = target.azim; cs.fov = target.fov;
    this.lockState = null;
    this.apply();
  }

  animate(ms, target, centerFn) {
    const from = this.snapshotTarget();
    this.lockState = null;
    return this.runAnim(ms, (k) => {
      const e = easeInOut(clamp(k, 0, 1));
      const cs = this.state;
      cs.center.copy(centerFn ? centerFn(e) : target.center);
      cs.nx = lerp(from.nx, target.nx, e);
      cs.ny = lerp(from.ny, target.ny, e);
      cs.radius = lerp(from.radius, target.radius, e);
      cs.elev = lerp(from.elev, target.elev, e);
      cs.azim = lerp(from.azim, target.azim, e);
      cs.fov = lerp(from.fov, target.fov, e);
      this.apply();
    });
  }

  distForCover(radiusWorld, fill, fovDeg) {
    const vfov = fovDeg * DEG;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.aspect);
    return radiusWorld / Math.tan(hfov / 2) / clamp(fill, 0.1, 1);
  }

  /* 调试/证据：把世界点投到 NDC */
  ndcOf(vec3) {
    const v = vec3.clone().project(this.camera);
    return { x: +v.x.toFixed(5), y: +v.y.toFixed(5) };
  }
}
