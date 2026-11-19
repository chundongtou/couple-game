# 环境/拟音生成说明（GENERATOR）

本目录 17 个 WAV 中，SFX/环境由一段一次性的 Python 脚本生成；music 由随目录存档的
`gen_music.py` 生成。两者都只依赖 numpy（不参与运行时）。为可复现，参数与流程记在这里；
成品以 `MANIFEST.json` 里的 `sha256` 为准。

## 1. 环境

| 项 | 值 |
|---|---|
| Python | 3.12.14 |
| numpy | 2.3.5 |
| 解码 CC0 ogg | soundfile 0.12.1（libsndfile，仅生成时用，运行时不需要） |
| 输出 | 22.05 kHz / mono / PCM 16-bit / WAV（`wave` 模块写盘） |
| 随机种子 | `numpy.random.default_rng(20261119)` |

### 1.1 SFX 流程

1. CC0 ogg 解码 → 混单声道 → FFT 重采样 22.05 kHz；
2. 按配方裁剪，叠自制层（模态合成 / 时变带通噪声 / 纸拍 / 加法钟）；
3. 目标时长补零 → 2 ms 淡入 + 10 ms 淡出；
4. 软限幅 `c·tanh(x/c), c = -6 dBFS`（压异常尖峰、保留打击瞬态）；
5. 归一到各件目标 RMS，峰值上限 -1.5 dBFS（16-bit 不可能削波）。

模态合成：`Σ aᵢ·sin(2π f₀ rᵢ t + φᵢ)·exp(-t/dᵢ) + 噪声瞬态`；
时变滤波：64 样本一块的一阶高/低通级联，截止频率按块线性插值；
混响：指数衰减噪声 IR 卷积（0.18–0.7 s，各件不同）。

### 1.2 环境无缝循环

整数周期构造，天然无缝（不是交叉淡化）：

- 所有正弦/调幅/调相频率量化到 `k/T`（`T` = 8.0 s / 4.5 s），在 `t = T` 处相位严格回到 `t = 0`；
- 噪声层用 `rfft` 随机相位频谱 + `irfft` 生成长度恰好一个周期的波形；
- 雨点/铃等瞬态按 `(i + k) mod n` 叠加（wrap），整段仍严格周期；
- 合成后再把 `copies=2` 生成一遍，逐样本比较两段：`max|y[n:] − y[:n]| = 1.3e-12`（见 MANIFEST `loopProof`）。

`amb-calm`：55/110/165/220/275/330/440 Hz 嗡鸣 + 空调隆隆/细嘶 + 舷窗外远雨
（900 Hz 以上噪声带，两条整数周期 LFO）+ 云海 160 Hz 气流 + 偶发细雨点 + 极轻 Dm add9 pad。
`amb-win`：D 大调 add9 pad + 1174/1479/1760 Hz 玻璃泛音 + 两下柔铃（587.33 / 880 Hz），雨声更轻。

### 1.3 music（mus-calm.wav）

| 项 | 值 |
|---|---|
| 脚本 | `gen_music.py`（随素材目录，numpy 2.3.5） |
| 输出 | 22.05 kHz / mono / PCM 16-bit / 298,144 samples / 13.52127 s |
| 速度/调性 | 71 BPM / D 大调 / 4 小节 / 16 拍 |
| 和声 | Dmaj9 → Bm7 → Gmaj9 → A7sus4（每小节一个和弦） |
| 织体 | 8 泛音钢琴旋律 + 4 声部铺底 + 慢颤音低音弦乐；无鼓、无人声 |
| 随机种子 | `numpy.random.default_rng(20261119)` |

流程：

1. **三周期稳态**：先生成 `3*T` 信号，取中间周期作为成品。铺底/弦乐频率量化到 `k/T`
   （T = 298144/22050 s），包络在每小节边界做 0.30–0.55 s 等增益交叉淡化，天然周期；
2. **wrap 瞬态**：钢琴/玻璃音按 `(start + k*N) mod 3N` 写入，尾音跨循环点继续，
   与真实 loop 播放完全一致；30 ms 收尾避免任何硬切；
3. **混响**：2.8 s 暗色噪声 IR（18 ms 预延迟 + 23/41/67/101/137 ms 早期反射）线性卷积；
   IR 长度 < T，因此相邻两个稳态周期的混响历史相同；
4. **频谱整形**：零相位 26 Hz 高通 / 9 kHz 低通（circular，不破坏周期性）；
5. **母带**：去 DC → 峰值 -2.5 dBFS → 16-bit TPDF 抖动 → WAV。

循环证明：相邻稳态周期逐样本最大误差 `1.9e-12`；循环边界阶跃 `-45.5 dBFS`，
低于正常采样步长（`shots/v9.1-audio/music-report.json` 与 `MANIFEST.json.loopProof`）。
试听：`shots/v9.1-audio/music-waveform.png`、`music-loop-seam.png`；
浏览器实测：`shots/v9.1-audio/demo-report.json`（music duration 13.52125 s、seam PASS、
music RMS 比 ambience 低 1.18 dB）。

> 时长说明：16 s 的 22.05 kHz mono WAV 为 705,600 B，超 600 KiB 预算；按任务允许的
> 12–16 s 回退档取 4 小节 13.52 s（596,332 B，预算 97.1%）。若后续换 OGG/FLAC 可再拉长。

## 2. 配方（CC0 层 + 自制层）

逐文件构成见 `LICENSES.md` 表末与 `MANIFEST.json` 的 `cc0Layers` / `selfMadeLayers`。

## 3. 复现命令（当时使用）

```
py gen_audio.py --out <repo>/app/assets/audio --report <tmp>/report.json
py verify_audio.py           # 峰值/RMS/近似 LUFS/DC/循环证明 + 证据图
py make_manifest.py          # 由 report/verify 生成 MANIFEST.json + LICENSES.md
# V9.1 music（脚本已随素材目录）
py gen_music.py --out <repo>/app/assets/audio --shots <repo>/shots/v9.1-audio
```

`gen_audio.py` 顶部 `CC` 常量指向解压后的 Kenney 素材目录；四个包可从
`https://kenney.nl/assets/{casino-audio,impact-sounds,interface-sounds,rpg-audio}` 重新下载（CC0）。
`gen_music.py` 无外部依赖（numpy + Pillow 仅用于证据图），不读取任何第三方采样。

## 4. 修改建议

- 换/加音效：优先保持 22.05 kHz mono PCM16 与 ≤300KB 总预算；改完重跑 `verify_audio.py`，
  并把新 `sha256` 写回 `MANIFEST.json`。
- 改环境长度：`make_ambience(T)` 内全部频率按 `k/T` 量化，任意 `T` 都自动无缝；但
  `T` 改变会影响体积（每秒 44.1KB）。
- 改 music：`gen_music.py` 顶部的 `BPM_TARGET` / `CHORDS` / `PIANO` / `STRINGS` 是全部编曲参数；
  改 `BEAT_N` 后 `N` 自动按 16 拍计算，频率量化仍保证无缝。改完重跑脚本并同步 `MANIFEST.json`
  的 sha256/体积/loopProof。
- 任何新文件都必须同步 `app/src/core/audio.js` 的 `FILES` 表与 `LAYERS` 映射（music 走 `musCalm`），
  否则不会播放。
- 响度：先保证峰值 <0 dBFS，再用 `playbackGainDb`（audio.js 里 layer 的 `g`）把“有效 LUFS”
  拉到 -18～-24；ambient 总线 0.20，有效约 -33～-34 LUFS；music 床 `musicLevel=0.095`，
  离线 RMS 比 ambience 低约 1.2 dB。
