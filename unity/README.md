# Unity 6 LTS + URP WebGL — Hybrid POC

目标：先验证「Unity 只画 3D 主桌（手/骰子/棋盘/机舱/物理/镜头/后处理），现有 JS 引擎继续管规则/UI/音频」。

> 本目录是 Unity 工程的 **Assets 增量**，不是完整 Unity 项目。需要你在 Unity Hub 建一个 **3D (URP)** 项目，然后把本目录 `Assets/` 合并进去。

## 1. 环境

- Unity Hub + **Unity 6 LTS**（6000.x）
- 安装 **WebGL Build Support**（Build Profiles → WebGL）
- 3D (URP) 模板
- 包（Package Manager）：
  - Universal RP（URP 模板自带）
  - `com.unity.cloud.gltfast`（GLB 导入/运行时加载）
  - `com.unity.inputsystem`
  - `com.unity.cinemachine`（可选，POC 可先不用）
- 目标：WebGL 2.0 / IL2CPP / Brotli；iOS Safari 需实测内存。

## 2. POC 范围

**只验证**：

1. CC0 真人右手（`Assets/Art/Hand/hand.glb`）+ 深色袖口/前臂
2. 刚体骰子（Rigidbody）在木板/边缘上 2–3 次弹跳，落点 `(0.63,0.63)` 附近
3. 手指 IK/动画捏住骰子 → 手腕上挑抛出 → 手退出
4. URP 基础光照/后处理 + 2K 渲染
5. JS ↔ Unity 桥：`ready` / `roll(value)` / `rollComplete(top)` / `setQuality`
6. 加载失败/不支持 WebGL2 → 回退现有 three.js/V7 主桌

**不做**：规则/题卡/UI/存档重写；Full Unity 迁移留到 POC 通过后。

## 3. 目录

```
unity/
  Assets/
    Art/Hand/hand.glb + LICENSE.md
    Scripts/           # POC C#（待导入）
    WebGLTemplates/    # 可选
  README.md
```

## 4. 接入步骤（POC）

1. Unity Hub → New Project → **3D (URP)** → 命名 `CoupleFlightPoc`
2. 关闭 Unity，把本目录 `Assets/Art/Hand` 复制到项目 `Assets/Art/Hand`
3. 打开项目；Package Manager 安装 `com.unity.cloud.gltfast`
4. 新建空场景 `Assets/Scenes/TablePoc.unity`
5. 创建空 GameObject `PocBootstrap`，挂 `PocBootstrap.cs`（后续加入）
6. Play 验证手/骰子/物理；Build Settings → WebGL → Build
7. 把 `Build/` 产物放到主站 `app/assets/unity/`，由 JS bridge 加载
8. POC 通过再决定 Full Unity（UI/规则迁移）

## 5. 验收

- 手近看是真人手（指甲/关节/皮肤），不是胶囊
- 骰子有真实碰撞/弹跳/旋转，最终顶面=传入 value
- 2K 画面 30/60fps（目标机型）
- WebGL 首包/冷启动/内存记录；iOS 不崩
- 桥接事件不丢/不重复；Unity 挂掉回退现有主桌

## 6. 体积/性能预期

- POC 包：15–30MB（手 9MB + URP + 场景）
- Full Unity 目标：40–80MB；4K 材质按需 Addressables
- WebGL 内存：iOS 需 <~1GB 峰值；手 185k tris 对单帧可接受，但需 LOD/贴图压缩

## 7. 许可

- `Assets/Art/Hand/hand.glb`：CC0 1.0，见 `LICENSE.md`
- URP/Unity 包按 Unity 许可
- 其他外部资产必须记录来源/许可，禁止不明来源
