# V9「午夜机舱 · 电影写实」质感升级冻结单（P1 全量）

> 用户拍板：视觉 **C 电影写实**；音效 **真实拟音 + 环境音乐都要**；素材 **自制采样 + CC0**；镜头 **双指 + 按钮缩放**；**直接 P1 完整视觉重做**。
> 目标：把 V8 的“功能完整但像原型”升级为“暗光里的电影级小桌棋”：PBR 材质、电影光、真实拟音、可控镜头。V8 功能/规则/降级全部保留。

## 1. 视觉方向 C：午夜机舱 · 电影写实

**一句话**：像在一架夜航客舱里，小桌板上摆着一副黄铜/胡桃木/绒布的实体棋；暖阅读灯、舷窗外云海、轻微景深与胶片颗粒。

### 1.1 色板（替换现有粉彩/霓虹）
| 角色 | 色值 | 用途 |
|---|---|---|
| 墨黑 | `#07080D` | 背景/舱壁最深 |
| 深海蓝 | `#0C1722` | 舱壁/窗 |
| 胡桃木 | `#3A2519` | 桌板/托盘 |
| 黄铜 | `#B08A57` | 边圈/按钮/高光 |
| 暖琥珀 | `#E0A45E` | 阅读灯/关键强调 |
| 象牙纸 | `#F1E4CE` | 内容卡 |
| 酒红 | `#732A35` | 危险/热情强调（少量） |
| 苔绿/雾蓝 | `#4E6B62` / `#5F7A8C` | 冷色平衡 |

- 禁止大面积粉彩/高饱和渐变；颜色只做小面积珐琅/灯光/强调。
- 所有材质走低饱和、暖冷对比。

### 1.2 字体
- 标题/数字：`Noto Serif SC` / `Songti SC`（现有字体栈，不引外链）——衬线、字重 600/700，字距略紧。
- 正文/按钮：`Noto Sans SC` / 系统无衬线——字重 400/500。
- 格面不再印大号中文；改成**雕刻图标 + 小号标签**（图例可查）；标签 ≤9px 视觉，高 DPI 下清晰。
- 去掉 emoji/系统符号；图标统一线性/雕刻风。

### 1.3 3D 材质/光照
- `MeshStandardMaterial`（PBR）：胡桃木 roughness≈0.55/metalness≈0.05；黄铜 metalness≈0.85/roughness≈0.32；绒布 roughness≈0.95；纸张 roughness≈0.8；玻璃/窗用透明+反射。
- 环境光照：`PMREMGenerator` + 程序化 RoomEnvironment（three addons）；无外链 HDR。
- Tone mapping：`ACESFilmicToneMapping`，exposure≈1.0；`SRGBColorSpace`。
- 灯光：暖色 key（阅读灯，约 3200K）、冷色 rim（舷窗）、低强度 fill；PCFSoft 阴影；接触阴影/暗角。
- 后处理：优先 CSS/轻量；Bloom/DOF 只在高画质档（`quality=high`），低端自动关；不引重后处理链。
- 程序化纹理：木纹、绒布、纸、拉丝黄铜、珐琅；AO 烘焙到 CanvasTexture；可选法线/粗糙度贴图。

### 1.4 棋盘/棋子/环境
- 棋盘：圆形胡桃木+黄铜包边，格块有厚度/倒角；格面深色石/珐琅底，图标雕刻，细色彩边；中心终点立体黄铜星徽。
- 棋子：折纸飞机保留，但纸材质+折痕+黄铜配重；阴影/接触阴影。
- 小熊：绒布/毛毡质感（法线/粗糙度贴图），机长帽/围巾；不要塑料高光。
- 机舱：舱壁、舷窗（云海/星轨）、遮光板、阅读灯、桌面绒布/木纹、灰尘粒子、暗角/胶片颗粒；镜头轻微景深（CSS 叠层或 DOF 高档）。
- 镜头：FOV 36–40，overview 机位略低，idle 微漂移；45° 舞台保留。

### 1.5 UI
- 主桌 HUD/按钮：墨黑半透明玻璃 + 黄铜细线；按钮有内阴影/纸感；去掉厚重渐变/过多描边。
- 内容卡：暖纸 + 细黄铜线 + 衬线标题；星级/来源更小、更克制。
- 门厅/设置/回顾：同一套 token/字体/间距；减少大圆角/贴纸感。
- 可读性/安全词/边界文案不变；不新增露骨内容。

## 2. 音效：真实拟音 + 环境音乐

### 2.1 现状
`core/audio.js` 是纯 WebAudio 振荡器/带通噪声，直接接 destination；无采样、无总线、无环境底噪、无混响 → 电子玩具感。

### 2.2 目标
- **采样化 SFX**（优先自制 + CC0）：
  - 掷骰：木质骰子撞击/滚动/落定（3 个变体）
  - 走子/落子：木头/纸轻放
  - 题卡：纸张滑出/翻面/盖章
  - 起飞/飞行：空气 whoosh + 低频
  - 击落：木撞 + 低频
  - 小熊：软绒/布料吱声
  - 收尾：温暖钟片/和弦
  - UI：木/纸轻触，不用方波
- **环境音乐/底噪**：机舱低频嗡鸣 + 远处云/雨 + 极轻 pad；热度/收尾变化；循环无缝。
- **总线**：master → compressor/limiter → destination；SFX/ambience/music 三条子总线；StereoPanner；随机 pitch/音量；页面隐藏暂停。
- 音量：SFX -18～-24 LUFS，ambient 更低；不削波；声音开关/减少动画不影响音频开关。
- 素材：自制 WAV/OGG（Python/numpy 物理拟音）+ CC0 包（Kenney/OpenGameArt，需记录 license/source）；音频懒加载，PWA 预缓存。
- 体积预算：核心 SFX ≤300KB，ambient/music ≤600KB（压缩后），不进首屏。

### 2.3 集成
- 保持 `App.Audio.play(name)` API；新增 `App.Audio.startAmbience()/stopAmbience()/setScene()`；首次手势解锁；主桌挂载启动 ambient，离开停止；win/ending 切换氛围。
- 音效与动画/震动同步（骰子落定、卡片、飞行、收尾）。

## 3. 镜头缩放

- 3D overview/idle 可缩放：**双指捏合 + 右下角 +/− 按钮 + 双击复位**；桌面滚轮。
- 范围 0.8×–1.5×（或半径 0.7–1.4），平滑阻尼；缩放后按 host 宽度 refit，避免裁切。
- 飞行/focus/fly/land/cell45/bear/题卡打开时**锁定**，结束后恢复用户缩放；换局重置。
- 手势层只覆盖棋盘区域，不挡 HUD/题卡/安全词；`touch-action:none`。
- reduced：禁用缩放动画，仅即时。

## 4. 性能/构建

- 首屏预算不变（index ≤140KB gzip，首屏 ≤180KB）；3D chunk ≤200KB gzip（PBR/环境新增，懒加载）；音频独立 assets，PWA 预缓存。
- 画质档：high/medium/low；低端关闭 Bloom/DOF/阴影降级/DPR≤1.5；reduced 静态。
- 3D draw calls ≤90、triangles ≤20k；粒子/后处理按档位。
- 保留 V7 2.5D 降级；WebGL2 不可用/失败回 V7。

## 5. 验收

- 视觉：overview/fly/cell45/bear 390/320/430 截图；与 V8 对比“材质/光照/字体/UI”明显升级；无廉价粉彩/大字；0 布局溢出。
- 音频：8+ SFX + ambient；无爆音/削波；首次手势后可播；静音开关生效；页面隐藏暂停；CC0 素材 license 记录。
- 缩放：双指/按钮/滚轮/双击；0.8–1.5；镜头链中锁定；题卡/HUD 不被挡；无 console error。
- 功能回归：V8 3D/降级/V6.1 规则/题卡/回顾全绿；性能预算。
- QA 报告 + 真机/浏览器待验证项明确。

## 6. Owner / 写作用域
| owner | 作用域 |
|---|---|
| fe-cinematic | `app/src/view/board3d/**`（材质/光照/环境/棋盘/棋子/小熊/后处理） |
| fe-ui9 | `app/src/styles/base.css`、`app/src/ui/screens/{boot,table,settings,ledger}.js` 的样式/结构（不改流程）、`app/src/ui/overlay/*` 样式 |
| fe-audio9 | `app/src/core/audio.js`、`app/assets/audio/**`（新）、`app/dev/audio-demo.html` |
| fe-zoom | `app/src/view/board3d/camera.js`、`scene.js`（相机接口）、`app/src/ui/screens/table.js`（手势层/按钮） |
| build9 | `tools/rebuild/build_app.py`（音频 assets/PWA/3D chunk 预算） |
| qa9 | `qa/v6/**`（V9 组） |
| doc9 | README/DESIGN/spec/release-notes |
| lead | 构建/发布/线上冒烟/`.devteam/` |

**禁止**：改引擎规则/题库；新增露骨文案；首屏塞 three/音频；缩放挡 HUD；git commit（Lead 统一）。
