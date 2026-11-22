# 工作台状态

- 项目：couple-game
- 当前阶段：5 验收/部署（V10 Unity Hybrid POC）
- 目标：把 Unity 6 URP Hybrid POC 做到可上线，作为可选 3D 体验，保留 three.js/V7 回退。
- 交付物：
  - `couple-game/unity/` 源码（POC 脚本/编辑器工具/桥接）
  - Unity 6 URP WebGL 构建产物 + 静态托管页
  - GitHub Pages 上线 + 端到端验证截图/日志
- 不做的事：
  - 不在本轮把全部规则/UI 迁进 Unity（Full Unity 是后续阶段）
  - 不删除现有 three.js/V7 路径

## 任务板快照
- [进行中] 修 URP shader / bridge complete 回调
- [待办] URP 构图/手部材质验证
- [待办] WebGL 构建改成 GitHub Pages 兼容压缩（禁用压缩或 decompression fallback）
- [待办] 嵌入现有页面（可选开关 + fallback）
- [待办] 部署 Pages + 线上验证

## 阻塞
- 无（Unity 6 + license 已就绪；Smart App Control 已关闭）

## 下一步
- 让 `UnityBridge.Roll` 在 URP 构建中稳定回 `unity-roll-complete`
- 解决 URP 手部 shader 报错
- 构建可被 Pages 直接托管的 WebGL（无自定义 header 依赖）
