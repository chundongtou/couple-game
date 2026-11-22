# 工作台状态

- 项目：couple-game
- 当前阶段：5 交付完成（V10 Unity 6 URP Hybrid POC 已上线）
- 目标：Unity 6 URP Hybrid POC 作为可选 3D 体验上线，保留现有 three.js/V7。
- 交付物：
  - 线上页面：https://chundongtou.github.io/couple-game/unity-poc/
  - 源码：`couple-game/unity/`
  - WebGL 构建：`couple-game/unity-poc/`（未压缩，GitHub Pages 可直接托管）
  - 桥接：`UnityBridge.cs` + `UnityBridge.jslib`，JS 点 1–6 掷骰并收到 `unity-roll-complete`
- 不做的事：
  - 本轮不迁移全部规则/UI/音频到 Unity（Full Unity 后续）
  - 不替换现有 JS 主游戏；Unity 是独立可选页面

## 验收证据
- 线上 URL 返回 200
- 线上 ego 浏览器实际加载：`window.__unityInstance` 存在，HUD 显示“Unity 已就绪”
- 点击点数 4 → `unity-roll-complete` 回 `结果 4`
- 截图：`shots/unity-live-final.png`

## 任务板快照
- [完成] Unity 6 + WebGL 模块 + license
- [完成] URP 工程 + CC0 右手 prefab + 骰子/桌板
- [完成] UnityBridge 端到端
- [完成] GitHub Pages 部署（无压缩，避免 header 依赖）
- [后续] Full Unity 迁移（UI/规则/音频）
- [后续] 真机 iOS 内存/性能验证

## 阻塞
- 无

## 下一步
- 把 `/unity-poc/` 入口接到主游戏设置页（可选）
- Full Unity 分阶段迁移
