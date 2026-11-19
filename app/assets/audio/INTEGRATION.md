# 接入单（build9）：音频 assets / PWA / 体积

> owner：fe-audio9（产出）→ build9（接入）。audio9 **没有改构建脚本**；以下为实测数据与可执行步骤。
> 实测环境：2026-11-19，当前 V9 共享工作树；`build_app.py --out dist/audio9-check`。
> V9.1 更新：新增 `mus-calm.wav`（17 个运行时 WAV，总计 **1,435,376 B ≈ 1,401.7 KiB**），
> 代码侧 `audio.js` 新增 music 床/独立 `musicLevel`/`renderMix`；构建脚本与 PWA 清单仍由 build9 接入。

## 1. 要落盘的文件

- 源：`app/assets/audio/*.wav`（17 个，**只拷 wav**；同目录的 `MANIFEST.json`/`LICENSES.md`/`GENERATOR.md`/`README.md`/`gen_music.py`/本文件是开发文档/脚本，不必进产物；若随包也不影响运行，但不要进 PRECACHE）。
- 产物：`<out>/assets/audio/` 下保持同名（**不要改名/加内容哈希**；`audio.js` 的 `FILES` 表写死了 17 个名字）。
- 合计 **1,435,376 B ≈ 1,401.7 KiB**：SFX 14 个 287,706 B（预算 300KB 的 93.7%）；环境 2 个 551,338 B（预算 600KB 的 89.7%）；music 1 个 596,332 B（预算 600KB 的 97.1%）。

## 2. PWA 预缓存

在 `build_app.py` 的 `expected_precache()` 里追加 17 条相对路径（与 `sw.template.js` 现有口径一致，`./` 前缀）：

```
./assets/audio/sfx-dice-shake.wav
./assets/audio/sfx-dice-land.wav
./assets/audio/sfx-hop.wav
./assets/audio/sfx-takeoff.wav
./assets/audio/sfx-fly.wav
./assets/audio/sfx-capture.wav
./assets/audio/sfx-stack.wav
./assets/audio/sfx-bear.wav
./assets/audio/sfx-card.wav
./assets/audio/sfx-stamp.wav
./assets/audio/sfx-chime.wav
./assets/audio/sfx-win.wav
./assets/audio/sfx-ui-tap.wav
./assets/audio/sfx-ui-select.wav
./assets/audio/amb-calm.wav
./assets/audio/amb-win.wav
./assets/audio/mus-calm.wav
```

- 预缓存 +1,401.7 KiB；install 用 `Promise.allSettled`，单个 404 不阻塞安装。
- 若想压首装体积：最低只预缓存 14 个 SFX（+281 KB），ambience/music 走现有 cache-first 运行时缓存（首次进主桌联网拉一次，之后离线可用）。**不要**为了省字节把 SFX 也排除——离线局里静音会破坏体验。
- **music 也是主桌必听项**：若选择预缓存 ambience，建议把 `mus-calm.wav` 一并加入；两者合计 +928.9 KiB。
- 文件服务 MIME 不影响 `decodeAudioData`（内部读 arrayBuffer）；建议仍给 `audio/wav`。
- `sw.js` 的 CACHE 版本来自 index 内容哈希，发版自动失效；WAV 名字稳定即可。

## 3. 首屏体积

V9.0 实测（HEAD → V9.0，保留作对照）：

| 指标 | 旧 audio.js（HEAD） | V9.0 audio.js | 差值 |
|---|---:|---:|---:|
| index gzip | 143,255 B（139.86 KB） | 147,889 B（144.42 KB） | **+4,634 B** |
| first-screen gzip（index+cards+manifest） | 173.0 KB | 177.5 KB | +4.5 KB |
| audio.js raw / minified / minified gzip | 5,930 / 3,356 / 1,361 B | 26,966 / 14,937 / 5,804 B | +11.6K min / +4.44K gz |

V9.1 music 增量（待 build9 复测）：

- `audio.js` 当前 raw **37,775 B** / gzip(-9) **10,789 B**，较 V9.0 raw +10,809 B、gzip +2,370 B；
  构建内联/minify 后的实际增量以 build9 的 `--check` 为准。
- music 仍**不预加载、不进首屏**：只有 `startAmbience()` / `startMusic()` 时懒加载 `mus-calm.wav`；
  `index.html` 不新增 audio 请求，首屏预算影响只来自 JS 代码体积。

- ADR-012 的 index 门禁 140 KB（143,360 B）：**当前 147,889 B，超 4,529 B**。`--check` 会在 budget 项 FAIL；这是预期，需要 build9/lead 定预算处理方案：
  1. **推荐**：把 `src/core/audio.js` 从内联 bundle 拆成独立 defer 脚本 `assets/audio.<hash>.js`（纯 IIFE、无依赖，esbuild 单独 minify 即可）。
     - 体积：index gzip −5,811 B（回到 ~142.1 KB，仍受其它 V9 增量影响）；新增一个 ~5.8KB gzip 的静态请求 + 1 条 PRECACHE。
     - 顺序：`<script defer src="assets/audio.<hash>.js">` 必须在 app 的 defer bundle 之前（或在内联 app bundle 已在解析尾执行之后）。defer 在 `DOMContentLoaded` 前执行，而 `app.js` 的 `boot()` 挂在 `DOMContentLoaded`，所以 `App.Audio` 一定已定义；`App.Bus` 由内联 bundle 在解析期定义。
     - `sw.js` PRECACHE 增加该 chunk（离线可用）。
  2. 用现有 `--split-screens` / `--external-js` 杠杆，把其它首屏 JS 挪到 defer（build9 既有能力）。
  3. 抬 index 预算到 ~148KB（first-screen 177.5/180 仍达标）；需 lead 拍板，与 ADR-012 冲突。
- 不要 `<link rel="preload" as="audio">`、不要内联 WAV；音频只在首次手势后由 `audio.js` 懒加载（实测：手势前 0 个 wav 请求、0 个解码）。

## 4. 运行路径 / 兼容

- base 推导：`location.pathname` 含 `/dev/` → `../assets/audio/`；否则 `assets/audio/`（相对文档 URL，GitHub Pages 子路径 `/couple-game/` 同样正确）。可用 `window.__AUDIO_BASE__`、`html[data-audio-base]`、`?audio=` 覆盖；`App.Audio.setBase()` 也可。
- 首次手势：`audio.js` 自己在 `pointerdown/touchstart/keydown` 上解锁并后台解码；`app.js` 既有的 `App.Audio.unlock()` 不冲突。
- 路由联动：`audio.js` 订阅 `App.Bus.on('route')`：`table` → `startAmbience()`（同时起 ambience + music）；离开 → `stopAmbience()`（同时停两者）且场景复位 `calm`。**不需要改 table.js**（写作用域禁止）。win/ending token 播放时自动 `setScene('win'|'ending')`，music 用同一素材做更亮/降速低通变体。
- music 床：`startMusic()/stopMusic()/music()/setMusicLevel()`；`startAmbience()` 默认带起 music。`musicLevel=0.095` 为源级增益，经 music 总线 0.85；离线真实链路 music RMS 比 ambience 低约 1.18 dB，music-only render peak ≈ -16.5 dBFS，不抢 SFX。`stopAmbience`/页面隐藏/声音开关/离开主桌都会同步停 music。
- 页面隐藏：`visibilitychange` → `AudioContext.suspend()`；恢复时仅当声音开关为开才 resume（含一次快速切换补救 resume），ambience/music 按 wanted 恢复。
- 声音开关：`App.Audio.setEnabled(false)` 走 master 静音并停环境/音乐源，重新打开恢复“想开”的意图；不影响 `reduced` 设置。
- 缺资源回退：任一层 404/解码失败 → 该 token 走 WebAudio 合成回退（console 一条 warn）；music 失败时用 8 s 合成 Dmaj9 铺底回退，**不会静默、不会报错崩页**。所以先上代码后上 assets 也能过渡。
- 兼容性：`AudioContext`/`decodeAudioData`/`StereoPanner`/`OfflineAudioContext` 均在 Safari 14.1+/Chrome/Firefox/Edge 可用；music 用标准 22.05 kHz PCM16 WAV，无新解码器依赖；无 WebAudio 时 `play()` 返回 false 静默降级。

## 5. 验证命令（接入后）

```
py tools/rebuild/build_app.py --out dist/rebuild-v9 --check      # 关注 budget / precache 条目
# 产物冒烟（audio9 已有脚本，可直接复用）：
node shots/audio9/smoke_built.mjs <repo>/dist/rebuild-v9 <outDir>
```

`smoke_built.mjs` 断言：生产 index 内联 audio.js、base=`assets/audio/`、手势前 0 wav 请求、
手势后 14 件解码、`route=table` 自动起环境且非合成回退、amb-calm/win 懒加载、**17 个 wav 全 200**、
27 个 token 可播、压力测试峰值 <1.0、0 console error。音频 404 或 base 错会直接 FAIL。

V9.1 需同步更新 smoke：断言多一条 `mus-calm.wav` 200、`startAmbience()` 后 music duration≈13.52、
`startMusic/stopMusic`、`musicLevel=0.095`、music-only/mix 离线渲染峰值 <1.0。当前工作树未带
`shots/audio9/smoke_built.mjs`；dev 页的实测报告见 `shots/v9.1-audio/demo-report.json`（Edge/Playwright）。

## 6. 已知项

- `MANIFEST.json` 里 `playbackGainDb` 与 `audio.js` 的 layer `g` 必须同步；music 不走 layer `g`，用 `musicLevel`/`MUSIC.scenes`，改响度时同步 MANIFEST 的 `bedLevel`。
- music 时长 **13.52 s / 71 BPM / 4 小节**：16 s 的 22.05 kHz mono WAV 为 705,600 B，超 600 KiB 预算；按任务允许的 12–16 s 回退档取 13.52 s（596,332 B）。后续若改 OGG/FLAC 可再拉长到 16–24 s，但需重新验证 Safari 解码与无缝。
- music 的“有效 LUFS”按旧 manifest 口径为 -38.65；但 ambience 的双声部/声像/0.55 增益不在旧公式内，**实际离线 RMS 对比**为 music 约 -28.6 vs ambience 约 -27.4 dBFS（低 1.18 dB，见 demo-report）。做混音评审时以 RMS/人耳 A/B 为准。
- 若 build9 给静态资源加 hash 或改路径，需要同步改 `audio.js` 的 `FILES` 与 base（或改用构建期注入）。
- 真机人耳试听（iOS Safari 静音键、安卓外放低频）未做，属 QA/lead 真机验证项；本轮只在 Edge headless + OfflineAudioContext 验证，无爆音/削波有数值证据，音色主观评价待真机。
