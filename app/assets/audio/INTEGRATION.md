# 接入单（build9）：音频 assets / PWA / 体积

> owner：fe-audio9（产出）→ build9（接入）。audio9 **没有改构建脚本**；以下为实测数据与可执行步骤。
> 实测环境：2026-11-19，当前 V9 共享工作树；`build_app.py --out dist/audio9-check`。

## 1. 要落盘的文件

- 源：`app/assets/audio/*.wav`（16 个，**只拷 wav**；同目录的 `MANIFEST.json`/`LICENSES.md`/`GENERATOR.md`/`README.md`/本文件是开发文档，不必进产物；若随包也不影响运行，但不要进 PRECACHE）。
- 产物：`<out>/assets/audio/` 下保持同名（**不要改名/加内容哈希**；`audio.js` 的 `FILES` 表写死了 16 个名字）。
- 合计 **839,044 B ≈ 819.4 KB**：SFX 14 个 287,706 B（预算 300KB 的 93.7%）；环境 2 个 551,338 B（预算 600KB 的 89.7%）。

## 2. PWA 预缓存

在 `build_app.py` 的 `expected_precache()` 里追加 16 条相对路径（与 `sw.template.js` 现有口径一致，`./` 前缀）：

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
```

- 预缓存 +819.4 KB；install 用 `Promise.allSettled`，单个 404 不阻塞安装。
- 若想压首装体积：最低只预缓存 14 个 SFX（+281 KB），ambience 走现有 cache-first 运行时缓存（首次进主桌联网拉一次，之后离线可用）。**不要**为了省字节把 SFX 也排除——离线局里静音会破坏体验。
- 文件服务 MIME 不影响 `decodeAudioData`（内部读 arrayBuffer）；建议仍给 `audio/wav`。
- `sw.js` 的 CACHE 版本来自 index 内容哈希，发版自动失效；WAV 名字稳定即可。

## 3. 首屏体积（实测）

| 指标 | 旧 audio.js（HEAD） | 本次 audio.js | 差值 |
|---|---:|---:|---:|
| index gzip | 143,255 B（139.86 KB） | 147,889 B（144.42 KB） | **+4,634 B** |
| first-screen gzip（index+cards+manifest） | 173.0 KB | 177.5 KB | +4.5 KB |
| audio.js raw / minified / minified gzip | 5,930 / 3,356 / 1,361 B | 26,966 / 14,937 / 5,804 B | +11.6K min / +4.44K gz |

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
- 路由联动：`audio.js` 订阅 `App.Bus.on('route')`：`table` → `startAmbience()`；离开 → `stopAmbience()` 且场景复位 `calm`。**不需要改 table.js**（写作用域禁止）。win/ending token 播放时自动 `setScene('win'|'ending')`。
- 页面隐藏：`visibilitychange` → `AudioContext.suspend()`；恢复时仅当声音开关为开才 resume（含一次快速切换补救 resume）。
- 声音开关：`App.Audio.setEnabled(false)` 走 master 静音并停环境源，重新打开恢复环境意图；不影响 `reduced` 设置。
- 缺资源回退：任一层 404/解码失败 → 该 token 走 WebAudio 合成回退（console 一条 warn），**不会静默、不会报错崩页**。所以先上代码后上 assets 也能过渡。
- 兼容性：`AudioContext`/`decodeAudioData`/`StereoPanner`/`OfflineAudioContext` 均在 Safari 14.1+/Chrome/Firefox/Edge 可用；无 WebAudio 时 `play()` 返回 false 静默降级。

## 5. 验证命令（接入后）

```
py tools/rebuild/build_app.py --out dist/rebuild-v9 --check      # 关注 budget / precache 条目
# 产物冒烟（audio9 已有脚本，可直接复用）：
node shots/audio9/smoke_built.mjs <repo>/dist/rebuild-v9 <outDir>
```

`smoke_built.mjs` 断言：生产 index 内联 audio.js、base=`assets/audio/`、手势前 0 wav 请求、
手势后 14 件解码、`route=table` 自动起环境且非合成回退、amb-calm/win 懒加载、16 个 wav 全 200、
27 个 token 可播、压力测试峰值 <1.0、0 console error。音频 404 或 base 错会直接 FAIL。

## 6. 已知项

- `MANIFEST.json` 里 `playbackGainDb` 与 `audio.js` 的 layer `g` 必须同步；改响度时两边一起改。
- 若 build9 给静态资源加 hash 或改路径，需要同步改 `audio.js` 的 `FILES` 与 base（或改用构建期注入）。
- 真机人耳试听（iOS Safari 静音键、安卓外放低频）未做，属 QA/lead 真机验证项。
