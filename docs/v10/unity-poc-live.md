# Unity 6 URP Hybrid POC（已上线）

## 线上地址

- POC：https://chundongtou.github.io/couple-game/unity-poc/
- 主游戏：https://chundongtou.github.io/couple-game/

## 交付内容

- Unity 6 LTS `6000.0.85f2` + WebGL Build Support
- URP `17.0.4`，URP/Unlit 材质，未压缩 WebGL（GitHub Pages 可直接托管）
- CC0 真人右手 `unity/Assets/Art/Hand/hand.glb`，Editor 预导入 prefab
- 桌板 + 刚体骰子 + 键盘/按钮掷骰
- `UnityBridge`：
  - JS → `unityInstance.SendMessage("UnityBridge", "Roll", "4")`
  - Unity → `window` 的 `unity-roll-complete` 事件，`detail` 为点数
- HUD 点数按钮 1–6、结果回显、返回主游戏链接

## 验收证据

- 线上 `200`，`Build/WebGL.wasm` 返回 `application/wasm`
- ego 浏览器线上加载：`window.__unityInstance` 存在，HUD 显示“Unity 已就绪”
- 点击 4：`unity-roll-complete` → 页面显示“结果 4”
- 截图：`shots/unity-live-final.png`

## 已知限制

- 当前是 Hybrid POC：Unity 只负责 3D 场景/手/骰子，规则/UI/音频仍在 JS
- 手部是静态 prefab；抓取/抛掷 IK 动画、点数朝向判定为后续
- 未压缩 wasm 约 55MB；iOS 真机内存/首屏时间待测
- Full Unity（UI/规则/音频全部迁移）不在本阶段

## 复现

```bash
# 本地 Unity 路径
D:\Unity\6000.0.85f2\Editor\Unity.exe

# URP 工程
D:\CoupleUnity\PocURP

# 构建（未压缩）
Unity.exe -batchmode -quit -projectPath D:\CoupleUnity\PocURP \
  -executeMethod PocBuild.BuildWebGL -buildTarget WebGL
```

构建产物复制到 `couple-game/unity-poc/`，推到 `main` 后 GitHub Pages 工作流自动部署。
