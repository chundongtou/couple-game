# V9 音频素材目录（audio9）

`app/assets/audio/` 是 V9「真实拟音 + 环境音乐」的全部运行时音频，**无外链、无运行时生成**。

## 运行时会加载的文件（16 个 WAV，共 839,044 B ≈ 819.4 KB）

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

- 规格：22.05 kHz / mono / 16-bit PCM WAV（浏览器 `decodeAudioData` 直接解码，跨 Safari/Chrome/Firefox/Edge）。
- 预算：SFX **287,706 B / 307,200 B（93.7%）**；环境 **551,338 B / 614,400 B（89.7%）**。
- 峰值：全部 ≤ **-1.5 dBFS**（16-bit 不可能削波）；峰值/RMS/近似 LUFS/DC/sha256 见 `MANIFEST.json`。
- 响度：玩法 SFX 有效 **-24.3～-20.5 LUFS**（目标 -18～-24）；UI 轻触 -24.5；环境有效 **-33～-34 LUFS**（更轻）。
- 无缝：两条环境为整数周期构造，`copies=2` 逐样本证明误差 **1.3e-12**（`MANIFEST.json.loopProof`）。
- 许可：CC0 1.0（Kenney 四个包）+ 自制（numpy 物理合成）；逐文件构成与来源见 `LICENSES.md`。

## 文档（不参与运行时）

| 文件 | 内容 |
|---|---|
| `MANIFEST.json` | 逐文件体积/时长/采样率/峰值/RMS/LUFS/DC/sha256/响度补偿/CC0 层/自制层/循环证明 |
| `LICENSES.md` | CC0 包来源/作者/许可 + 逐文件构成 + 加工方式 |
| `GENERATOR.md` | 生成算法、参数、随机种子、复现命令、修改建议 |
| `INTEGRATION.md` | 给 build9 的接入单：拷贝、PWA 预缓存、体积影响、脚本顺序、验证命令 |

## 接入代码

- 引擎：`app/src/core/audio.js`（保持 `App.Audio.play(name)`，新增 `startAmbience/stopAmbience/setScene` 等）。
- 自测页：`app/dev/audio-demo.html`（逐条试听 / 总线 / 波形 / 压力测试 / 许可清单 / 路由联动 / 页面隐藏）。
- 证据：`shots/audio9/out/`（截图 2 张、波形图、环境频谱图、响度预算图、`verify.json`、`report.json`）。

## 维护约定

1. **不要改文件名**；`audio.js` 的 `FILES` 表写死了 16 个名字。要换文件请同步改表。
2. 新增/替换素材后重跑生成核验脚本，更新 `MANIFEST.json` 的 sha256 与体积。
3. 不把 WAV 内联进 `index.html`，也不要 `<link rel=preload as=audio>`（首屏预算）；由 audio.js 在首次手势后懒加载。
4. 不引外链音频；所有素材必须能离线（SW 预缓存 + cache-first）。
