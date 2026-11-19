# V9.1 音频素材目录（audio9）

`app/assets/audio/` 是 V9「真实拟音 + 环境音乐」的全部运行时音频，**无外链、无运行时生成**。

## 运行时会加载的文件（17 个 WAV，共 1,435,376 B ≈ 1,401.7 KiB）

| 文件 | 用途 | 字节 | 秒 |
|---|---|---:|---:|
| `sfx-dice-shake.wav` | 掷骰滚动（3 变体由播放率/声像随机化） | 27,386 | 0.62 |
| `sfx-dice-land.wav` | 骰子落定 | 17,684 | 0.40 |
| `sfx-hop.wav` | 走一格 / 轻放棋子 | 7,982 | 0.18 |
| `sfx-takeoff.wav` | 起飞 | 22,976 | 0.52 |
| `sfx-fly.wav` | 飞行 | 24,740 | 0.56 |
| `sfx-capture.wav` | 击落 | 20,330 | 0.46 |
| `sfx-stack.wav` | 叠机 | 14,156 | 0.32 |
| `sfx-bear.wav` | 小熊 | 19,448 | 0.44 |
| `sfx-card.wav` | 题卡滑出 + 落卡 | 15,920 | 0.36 |
| `sfx-stamp.wav` | 盖章 / 确认 | 12,392 | 0.28 |
| `sfx-chime.wav` | 钟片 / 提示 | 35,324 | 0.80 |
| `sfx-win.wav` | 收尾和弦 | 57,374 | 1.30 |
| `sfx-ui-tap.wav` | UI 轻触 | 5,336 | 0.12 |
| `sfx-ui-select.wav` | UI 选择 | 6,658 | 0.15 |
| `amb-calm.wav` | 主桌环境（8.00 s 无缝循环） | 352,844 | 8.00 |
| `amb-win.wav` | win / ending 环境（4.50 s 无缝循环） | 198,494 | 4.50 |
| `mus-calm.wav` | 主桌舒缓纯音乐（13.52 s 无缝循环） | 596,332 | 13.52 |

- 规格：22.05 kHz / mono / 16-bit PCM WAV（浏览器 `decodeAudioData` 直接解码，跨 Safari/Chrome/Firefox/Edge）。
- 预算：SFX **287,706 B / 307,200 B（93.7%）**；环境 **551,338 B / 614,400 B（89.7%）**；music **596,332 B / 614,400 B（97.1%，新增 ≤600KB 达标）**。
- 峰值：全部 ≤ **-1.5 dBFS**；music 峰值为 **-2.5 dBFS**（16-bit 不可能削波）。峰值/RMS/近似 LUFS/DC/sha256 见 `MANIFEST.json`。
- 响度：玩法 SFX 有效 **-24.3～-20.5 LUFS**（目标 -18～-24）；UI 轻触 -24.5；环境有效 **-33～-34 LUFS**（更轻）。
  music 床 `musicLevel=0.095`（经 music 总线 0.85 + master 0.85，按旧 manifest 口径 effective ≈ **-38.65 LUFS**）；
  离线真实链路实测 music RMS **约 -28.6 dBFS** vs ambience **约 -27.4 dBFS**（低约 **1.18 dB**，见 `shots/v9.1-audio/demo-report.json`），不抢 SFX。
- 无缝：环境两条为整数周期构造；music 为 3 周期稳态 + wrap 瞬态 + 循环卷积混响，相邻稳态周期逐样本误差 **1.9e-12**，循环边界阶跃 **-45.5 dBFS**（远低于正常采样步长，`MANIFEST.json.loopProof`）。
- 许可：CC0 1.0（Kenney 四个包）+ 自制（numpy 物理合成 / 加法合成）；music 100% 自制；逐文件构成与来源见 `LICENSES.md`。

## 文档 / 生成脚本（不参与运行时）

| 文件 | 内容 |
|---|---|
| `MANIFEST.json` | 逐文件体积/时长/采样率/峰值/RMS/LUFS/DC/sha256/响度补偿/CC0 层/自制层/循环证明 |
| `LICENSES.md` | CC0 包来源/作者/许可 + 逐文件构成 + 加工方式 |
| `GENERATOR.md` | 生成算法、参数、随机种子、复现命令、修改建议 |
| `INTEGRATION.md` | 给 build9 的接入单：拷贝、PWA 预缓存、体积影响、脚本顺序、验证命令 |
| `gen_music.py` | `mus-calm.wav` 的可复现生成脚本（numpy 加法合成 + 证据图；不参与运行时） |

## 接入代码

- 引擎：`app/src/core/audio.js`（保持 `App.Audio.play(name)`，新增 `startAmbience/stopAmbience/setScene/startMusic/stopMusic/setMusicLevel` 等）。
- 自测页：`app/dev/audio-demo.html`（逐条试听 / 总线 / 波形 / music 单独与混音 / 循环接缝 / 许可 / 路由联动 / 页面隐藏）。
- 证据：`shots/v9.1-audio/`（music 波形、循环接缝、试听页截图、`music-report.json`、`demo-report.json`）；V9.0 旧证据若保留见 `shots/audio9/`。

## 维护约定

1. **不要改文件名**；`audio.js` 的 `FILES` 表写死了 17 个名字。要换文件请同步改表。
2. 新增/替换素材后重跑生成/核验脚本，更新 `MANIFEST.json` 的 sha256、体积与 loopProof。
3. 不把 WAV 内联进 `index.html`，也不要 `<link rel=preload as=audio>`（首屏预算）；由 audio.js 在首次手势后懒加载。
4. 不引外链音频；所有素材必须能离线（SW 预缓存 + cache-first）。
5. music 为 **13.52 s / 71 BPM / 4 小节**：16 s 的 22.05 kHz mono WAV 为 705,600 B，超 600 KiB 预算；按任务允许的 12–16 s 回退档取 13.52 s（596,332 B），仍保持 4 小节与无缝。若后续改用 OGG/FLAC 压缩，可再上 16–24 s。
