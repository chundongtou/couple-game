# V9.1 音频 · music 层交接单（audio9b / FE-Audio）

- 任务：`task-50`「V9.1 环境音乐：舒缓纯音乐循环」
- 状态：**完成**（1 项规格回退：循环 13.52 s，见 §7；其余 DoD 全部有证据）
- 写作用域：`app/src/core/audio.js`、`app/assets/audio/**`、`app/dev/audio-demo.html`
- 未 commit（按约束）；构建/PWA 未改（build9 接入单见 `INTEGRATION.md`）

## 1. 交付物

| 产物 | 说明 |
|---|---|
| `app/assets/audio/mus-calm.wav` | 新增 1 条舒缓纯音乐循环（22.05 kHz / mono / PCM16 / 13.52 s / 596,332 B） |
| `app/assets/audio/gen_music.py` | 可复现生成脚本（numpy 加法合成 + 循环证明 + 证据图；不参与运行时） |
| `app/src/core/audio.js` | music 床、`startMusic/stopMusic/music/setMusicLevel`、场景变体、`renderMix` QA；旧 27 token API 不变 |
| `app/dev/audio-demo.html` | 试听页新增 music 单独/混音/场景/循环接缝/波形与压力测试 |
| `app/assets/audio/{README,LICENSES,MANIFEST,GENERATOR,INTEGRATION}.md/json` | 体积/峰值/许可/生成算法/接入单 |
| `shots/v9.1-audio/*` | 波形、接缝、试听页截图、浏览器报告、fallback 报告 |

## 2. 新 WAV 清单

| 文件 | 字节 | 时长 | 格式 | 峰值 | RMS | 近似 LUFS | sha256 |
|---|---:|---:|---|---:|---:|---:|---|
| `mus-calm.wav` | 596,332 | 13.52127 s | 22.05 kHz / mono / PCM16 | **-2.50 dBFS** | -14.58 dBFS | -15.39 | `abe14c9591b7cb766c9accb18c66a3f41237115fcc0ee0c762c40259f0e285c7` |

- 调性/速度：**D 大调 / 71 BPM / 4 小节（Dmaj9 → Bm7 → Gmaj9 → A7sus4）**；无鼓、无人声。
- 体积预算：**596,332 B / 614,400 B（600 KiB 的 97.1%）**；若按十进制 600,000 B 计也低 3,668 B。新增运行时音频 582.4 KiB，满足 ≤600KB（文档/生成脚本不进产物、不计入音频预算）。
- 峰值/RMS/LUFS/循环误差逐项在 `app/assets/audio/MANIFEST.json` 与 `shots/v9.1-audio/music-report.json`。

## 3. 循环误差（无缝）

- 3 周期稳态构造，相邻两个稳态周期逐样本最大误差：**1.9e-12**（浮点精度级）。
- 循环边界阶跃：**-45.54 dBFS**（`boundaryStep=0.00528`），低于正常采样步长（`diffP999=0.1310`，约 -17.6 dBFS）。
- 边界二阶差分：0.00374，远低于全曲 99.9 分位 0.0785。
- 浏览器 48 kHz 离线双循环实测（`renderMix`）：**seam PASS**，多轮 jump **-47.4～-48.1 dBFS**，seam 二阶差 0.00104～0.00110 vs 全曲 p99.9 0.00388。
- 证据图：`music-waveform.png`、`music-loop-seam.png`；数值：`music-report.json`、`demo-report.json`。

## 4. music 总线 / 集成

```
music bed → musicLevel(0.095 × 场景系数) → lowpass(场景) → music 总线(0.85)
          → master(0.85) → compressor → 4× soft-limiter → destination
```

- **场景**：`calm` = lp 5200 Hz / rate 1.0 / 0.095；`win` = lp 9200 Hz / rate 1.0 / 1.12×；`ending` = lp 1500 Hz / rate 0.94 / 0.86×。
  win/ending 使用同一素材做更亮/降速低通变体（win 专用素材为可选项，未新增第二文件，避免超预算）。
- **生命周期**：`startAmbience()` 同时淡入 ambience + music；`stopAmbience()` 同时淡出两者；`route=table` 启动、离开停止并复位 calm；`win/ending` token 自动切场景；页面隐藏 suspend、恢复按 wanted 续播；声音开关停/恢复 music；`startMusic()/stopMusic()` 可独立控制。
- **音量**：music 床 0.095（低于 ambience 总线 0.20 的源级口径），实测（同一 master/compressor/limiter 链路）：
  - music-only：peak **-16.3～-16.5 dBFS**，RMS **-28.6～-28.8 dBFS**；
  - ambience-only：RMS **约 -27.4 dBFS** → music 比 ambience **低约 1.18 dB**；
  - ambience + music + win stinger：peak **约 -5.0 dBFS**，RMS **约 -23.1 dBFS**，no-clip；
  - 27 token 齐发 + music + ambience：最差一轮 peak **-0.88 dBFS**，no-clip。
  - 旧 manifest 的 effective LUFS 口径给出 music -38.65；ambience 的双声部/0.55/声像不在旧公式内，评审以真实链路 RMS + 人耳 A/B 为准（见 `MANIFEST.json` 的 `effectiveLufsNote`）。
- **失败回退**：mus-calm 404/解码失败 → 8 s 合成 Dmaj9 铺底（整数周期循环），实测 `synthesized=true`、无 pageerror（`fallback-report.json`）。
- **不破坏旧 API**：27 个 token、14 SFX、2 ambience、`play/startAmbience/stopAmbience/setScene/setEnabled/setVolumes/preload/render` 签名保持不变；`FILES` 增加 `musCalm` 一项。

## 5. 试听页 / 自测

页面：`app/dev/audio-demo.html`（本地 HTTP 打开，Edge/Playwright headless，430×1000@2x）。

| 测试 | 结果 |
|---|---|
| 首次手势解锁 + music 解码 | AudioContext running；`musCalm` 解码成功；duration 13.52125 s；`loop=true`；0 console error / 0 pageerror |
| 场景变体 | calm level 0.095 / lp 5200 / rate 1；win 0.1064 / 9200 / 1；ending 0.0817 / 1500 / 0.94 |
| `play('win')` | music scene 自动变 win |
| 声音开关 | off 后 music.playing=false；on 后恢复 playing=true |
| `route=table` | ambience=playing、music=playing |
| `music 单独` | ambience=stopped、music=playing |
| 页面隐藏/恢复 | suspended → running；music 恢复 playing |
| `route=ledger` | ambience=stopped、music=stopped、scene=calm |
| music-only 渲染（27.1 s） | peak -16.3～-16.5 dBFS、RMS -28.6～-28.8 dBFS、no clip、seam PASS |
| ambience+music+win 渲染 | peak 约 -5.0 dBFS、RMS 约 -23.1 dBFS、no clip |
| 全量压力 | 27 token + music + ambience，最差一轮 peak -0.88 dBFS、no clip |
| 缺资源回退 | music synthesized=true（8 s 合成铺底），无 pageerror |

截图/报告：

- `shots/v9.1-audio/demo-music.png`（整页，music playing）
- `shots/v9.1-audio/demo-music-section.png`（music 卡片：playing / wav-loop / 0.095 / 13.52 s）
- `shots/v9.1-audio/demo-music-render.png`（music-only 波形 + seam PASS）
- `shots/v9.1-audio/demo-music-mix.png`（混音波形 + no-clip）
- `shots/v9.1-audio/demo-report.json`、`music-report.json`、`fallback-report.json`

## 6. 许可

- `mus-calm.wav`：**100% 自制**（numpy 加法合成），无第三方采样、无外链；生成脚本 `gen_music.py` 随素材目录存档。
- 其余素材许可不变：Kenney CC0 1.0（Casino/Impact/Interface/RPG Audio）+ 自制；逐文件构成见 `LICENSES.md`。
- 本轮没有新增 CC0/第三方文件，也没有改变旧文件的许可记录。

## 7. 偏差 / 未覆盖

1. **时长 13.52 s（任务主档 16–24 s，回退档 12–16 s）**：16 s 的 22.05 kHz mono PCM16 WAV = 705,600 B，超 600 KiB 预算；环境无 ffmpeg/flac/OGG 编码器，且为保证 Safari/Chrome/Firefox 的精确无缝选择 WAV。按任务允许的回退档取 4 小节 13.52 s（596,332 B，97.1%）。若必须 16–24 s，需改用 OGG/FLAC/AAC 并重新验证 Safari 解码与 encoder delay/gapless。
2. **win 无独立素材**：任务标注“win 变体可选”；本轮用同一素材的高低通/速率变体，未新增第二文件（否则 +582 KiB 超预算）。若产品要求更明显的 win 旋律，需要拆预算或压缩格式。
3. **未真机人耳试听**：只在 Edge headless + OfflineAudioContext 做了数值/波形验证；iOS Safari 静音键、安卓外放低频、蓝牙延迟、主观音色未测。
4. **未改构建/PWA**：`build9` 尚未接入第 17 条 WAV；生产 `smoke_built.mjs` 仍需补 `mus-calm.wav` / music 断言。`audio.js` 当前 raw 37,775 B / gzip 10,789 B，minify 后首屏增量待 build9 复测。
5. **未做浏览器矩阵**：Firefox/Safari 未跑；music 用标准 WAV/`decodeAudioData`，理论兼容，但未实测。
6. **未 commit**：按任务约束由 Lead 统一提交。

## 8. 复现

```bash
# 生成 music + 波形图/接缝图/报告
py app/assets/audio/gen_music.py --out app/assets/audio --shots shots/v9.1-audio
# dev 页浏览器自测（需 Edge + Playwright；工作树 tmp/pwlib）
py tmp/audio9b/smoke_music.py
py tmp/audio9b/smoke_fallback.py
```

> 生成脚本的随机种子 `20261119`，BPM/和声/旋律均在 `gen_music.py` 顶部；成品以 `MANIFEST.json` 的 sha256 为准。
