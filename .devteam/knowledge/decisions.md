# 决策记录（ADR）

## ADR-001 先 Hybrid POC，后 Full Unity
- 日期：2026-11-22
- 背景：用户选择 Unity 6 LTS + URP WebGL，但 Full Unity 迁移 UI/规则/音频工作量大。
- 决策：先做 Unity 3D POC（桌板/骰子/CC0 右手），JS 继续负责规则/UI/音频；POC 通过后迁移。
- 理由：最快验证真人手资产、WebGL 性能和视觉方向，失败可回退 three.js/V7。
- 影响：上线版本保留现有 JS 路径，Unity 作为可选层。

## ADR-002 Unity 6 安装走手动离线安装
- 日期：2026-11-22
- 背景：Unity 下载被地区 CDN 重定向到 `download.unitychina.cn`，Unity 6 返回 404；CLI/Hub 无法下载。
- 决策：通过本地代理下载官方安装包，`RunAsInvoker` 静默安装到 `D:\Unity\6000.0.85f2`，WebGL 模块同法安装。
- 影响：Unity Hub 不识别该自定义路径；直接用 `Unity.exe` 构建。Smart App Control 必须关闭。

## ADR-003 WebGL 构建面向 GitHub Pages
- 日期：2026-11-22
- 背景：GitHub Pages 不能自定义 `Content-Encoding`，Unity 的 `.br/.gz` 构建会报仍被压缩。
- 决策：上线构建禁用压缩（或启用 decompression fallback），静态文件直接可 fetch。
- 影响：包体更大，但 Pages 可直接托管；本地预览服务器不再是必需。
