#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""V9.1 music bed generator (self-made, numpy additive synthesis).

Output: 22.05 kHz / mono / PCM16 WAV, D major, 71 BPM, 4 bars, seamless loop.
The loop is built as the steady-state middle period of a 3-period render:
  - pad/string layers are exactly periodic (frequencies quantised to k/T,
    envelopes periodic by construction);
  - piano/bell transients are written with modulo wrap, so tails cross the
    loop point exactly as they would during looped playback;
  - reverb is linear convolution with a 2.8 s IR (< T), and the middle two
    periods are compared sample by sample as the periodicity proof.

Usage:
  python gen_music.py --out <audio-dir> --shots <shots-dir>
"""
import argparse
import hashlib
import json
import math
import os
import struct
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SR = 22050
BPM_TARGET = 71.0
BEATS = 16                 # 4 bars * 4 beats
BEAT_N = int(round(60.0 / BPM_TARGET * SR))   # 18634 samples
N = BEAT_N * BEATS         # 298144 samples
T = N / float(SR)          # 13.5218 s
BAR_N = BEAT_N * 4
BAR_S = BAR_N / float(SR)
SEED = 20261119
rng = np.random.default_rng(SEED)

# D major, four-bar loop: Dmaj9 | Bm7 | Gmaj9 | A7sus4
CHORDS = [
    dict(name="Dmaj9",  root=38, pad=[38, 45, 50, 54, 57, 61, 64], bass=38),
    dict(name="Bm7",    root=47, pad=[47, 54, 57, 59, 62],          bass=47),
    dict(name="Gmaj9",  root=43, pad=[43, 50, 54, 57, 59, 62],      bass=43),
    dict(name="A7sus4", root=45, pad=[45, 52, 55, 62, 64],          bass=45),
]
# (beat, midi, velocity, decay tau)
PIANO = [
    (0.00, 50, 0.52, 2.6), (0.75, 69, 0.40, 1.35), (2.00, 66, 0.33, 1.15), (3.00, 64, 0.27, 1.00),
    (4.00, 47, 0.44, 2.4), (4.75, 74, 0.38, 1.20), (6.00, 66, 0.31, 1.10), (7.00, 69, 0.28, 1.00),
    (8.00, 43, 0.44, 2.4), (8.75, 74, 0.36, 1.20), (10.00, 71, 0.29, 1.10), (11.00, 67, 0.26, 1.00),
    (12.00, 45, 0.45, 2.4), (12.75, 64, 0.32, 1.10), (14.00, 74, 0.35, 1.20), (15.00, 73, 0.29, 1.60),
    # very soft inner voices and high "glass" sparkle
    (1.50, 57, 0.20, 1.8), (5.50, 62, 0.18, 1.7), (9.50, 59, 0.18, 1.7), (13.00, 55, 0.18, 1.7),
    (3.50, 81, 0.11, 2.6), (9.50, 86, 0.09, 2.4), (13.50, 88, 0.08, 2.2),
]
# string/cello line, one low note per bar (midi)
STRINGS = [38, 35, 43, 45]


def midi_hz(m):
    return 440.0 * (2.0 ** ((m - 69) / 12.0))


def qfreq(f):
    """Quantise to an integer number of cycles per loop: exactly periodic."""
    return max(1.0, round(float(f) * T)) / T


def smoothstep(u):
    u = np.clip(u, 0.0, 1.0)
    return u * u * (3.0 - 2.0 * u)


def chord_env(t_mod, bar_idx, xfade_s):
    """Periodic crossfade envelope for chord `bar_idx`.

    At each bar boundary the old chord is 1 -> 0.5 -> 0 over +/-xfade and the
    new chord is 0 -> 0.5 -> 1; the two sum to 1 (equal-gain crossfade).
    """
    x = (t_mod - bar_idx * BAR_S) % T
    X = xfade_s if xfade_s > 0 else 1e-6
    env = np.zeros_like(x)
    m = (x >= T - X) & (x < T)
    env[m] = 0.5 * smoothstep((x[m] - (T - X)) / X)
    m = x < X
    env[m] = 0.5 + 0.5 * smoothstep(x[m] / X)
    m = (x >= X) & (x < BAR_S - X)
    env[m] = 1.0
    m = (x >= BAR_S - X) & (x < BAR_S)
    env[m] = 1.0 - 0.5 * smoothstep((x[m] - (BAR_S - X)) / X)
    m = (x >= BAR_S) & (x < BAR_S + X)
    env[m] = 0.5 - 0.5 * smoothstep((x[m] - BAR_S) / X)
    return env


def additive(t, f0, harmonics, phases, amps):
    y = np.zeros_like(t)
    fq = qfreq(f0)
    for h, (ph, a) in enumerate(zip(phases, amps), start=1):
        y += a * np.sin(2.0 * np.pi * (fq * h) * t + ph)
    return y


def build_pad(t, t_mod):
    """Soft string/organ pad; all components exactly periodic over T."""
    y = np.zeros_like(t)
    for b, ch in enumerate(CHORDS):
        env = chord_env(t_mod, b, 0.30)
        for j, midi in enumerate(ch["pad"]):
            f = midi_hz(midi)
            # two detuned layers for a gentle chorus; both quantised and periodic
            for det, lev in ((0.0, 1.0), (0.0012, 0.55)):
                ph = rng.uniform(0, 2 * np.pi, 5)
                amps = np.array([1.0, 0.34, 0.16, 0.075, 0.035]) * lev
                y += env * 0.030 * additive(t, f * (1.0 + det), 5, ph, amps)
    return y


def build_strings(t, t_mod):
    """Low bowed line with slow vibrato, one note per bar."""
    y = np.zeros_like(t)
    for b, midi in enumerate(STRINGS):
        env = chord_env(t_mod, b, 0.55)
        f = qfreq(midi_hz(midi))
        fv = qfreq(4.6)
        beta = 0.22
        phv = rng.uniform(0, 2 * np.pi)
        ph = rng.uniform(0, 2 * np.pi, 4)
        tim = np.zeros_like(t)
        for h, (p, amp) in enumerate(zip(ph, [1.0, 0.50, 0.24, 0.11]), start=1):
            tim += amp * np.sin(2.0 * np.pi * f * h * t + beta * np.sin(2.0 * np.pi * fv * t + phv) + p)
        y += env * 0.042 * tim
    return y


def piano_note(f0, vel, tau, seed):
    """Additive piano-ish note with soft attack and inharmonic partials."""
    eps = 2e-4
    L = int(min(tau * math.log(1.0 / eps) * SR, N * 0.96))
    L = max(L, int(0.35 * SR))
    t = np.arange(L, dtype=np.float64) / SR
    atk = 1.0 - np.exp(-t / 0.0075)
    env = vel * atk * np.exp(-t / tau)
    fade = int(0.030 * SR)
    if L > fade * 2:
        u = np.linspace(0, 1, fade)
        env[-fade:] *= 0.5 + 0.5 * np.cos(np.pi * u)
    prng = np.random.default_rng(seed)
    y = np.zeros(L, dtype=np.float64)
    for h in range(1, 9):
        fh = f0 * h * math.sqrt(1.0 + 0.00030 * h * h)
        amp = 1.0 / (h ** 1.35)
        ph = prng.uniform(0, 2 * np.pi)
        dec = np.exp(-t * (0.28 + 0.20 * h) / tau)
        y += amp * dec * np.sin(2.0 * np.pi * fh * t + ph)
    # felt thump (low, slightly inharmonic)
    y += 0.20 * np.exp(-t / 0.16) * np.sin(2.0 * np.pi * f0 * 0.5 * t + 0.7)
    y *= env
    # very subtle hammer noise, deterministic and local to the attack
    hammer = prng.standard_normal(L) * np.exp(-t / 0.018)
    # one-pole lowpass to keep it felt-like
    alpha = 0.12
    hp = np.empty(L)
    z = 0.0
    for i in range(L):
        z += alpha * (hammer[i] - z)
        hp[i] = z
    y += 0.010 * hp
    return y


def add_wrapped(dry, sig, start):
    """Add a transient at `start` and its two periodic repeats, wrapping tails."""
    total = dry.size
    for k in range(3):
        idx = (start + k * N + np.arange(sig.size)) % total
        # split at the wraparound to avoid a slow np.add.at over the whole array
        if idx.size == 0:
            continue
        cuts = np.where(np.diff(idx) != 1)[0] + 1
        for part in np.split(np.arange(idx.size), cuts):
            if part.size:
                dry[idx[part]] += sig[part]


def build_transients():
    dry = np.zeros(3 * N, dtype=np.float64)
    for i, (beat, midi, vel, tau) in enumerate(PIANO):
        start = int(round(beat * BEAT_N))
        sig = piano_note(midi_hz(midi), vel, tau, SEED + 1000 + i)
        add_wrapped(dry, sig, start)
    return dry


def make_ir():
    """Dark 2.8 s reverb IR with a few early reflections."""
    n = int(2.8 * SR)
    t = np.arange(n, dtype=np.float64) / SR
    noise = rng.standard_normal(n)
    # one-pole lowpass + gentle highpass to make it dark and non-boomy
    z = 0.0
    alpha = 0.22
    lp = np.empty(n)
    for i in range(n):
        z += alpha * (noise[i] - z)
        lp[i] = z
    pre = int(0.018 * SR)
    env = np.exp(-t / 0.95) * (1.0 - np.exp(-t / 0.020))
    ir = lp * env
    ir[:pre] *= 0.0
    # early reflections
    for ms, g in ((23, 0.55), (41, -0.38), (67, 0.30), (101, -0.22), (137, 0.16)):
        idx = int(ms / 1000.0 * SR)
        if idx < n:
            ir[idx] += g * (1.0 - idx / n)
    ir = ir / math.sqrt(float(np.sum(ir * ir)) + 1e-18)
    return ir


def fft_conv(x, h):
    n = x.size + h.size - 1
    nfft = 1
    while nfft < n:
        nfft <<= 1
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(h, nfft), nfft)
    return y[:n]


def spectral_tilt(x, low_hz=26.0, high_hz=9000.0):
    """Zero-phase gentle high-pass/low-pass; circular, keeps periodicity."""
    n = x.size
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1.0 / SR)
    g = np.ones_like(f)
    g *= 1.0 / (1.0 + (low_hz / np.maximum(f, 1e-9)) ** 4)
    g *= 1.0 / (1.0 + (f / high_hz) ** 4)
    return np.fft.irfft(X * g, n)


def biquad(x, b, a):
    y = np.empty_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for i in range(x.size):
        v = x[i]
        out = b[0] * v + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2
        y[i] = out
        x2, x1 = x1, v
        y2, y1 = y1, out
    return y


def approx_lufs(x, fs=SR):
    """ITU-R BS.1770-like K-weighting + gated integrated loudness (mono)."""
    G = 3.999843853973347
    Q = 0.7071752369554196
    f0 = 1681.974450955533
    K = math.tan(math.pi * f0 / fs)
    Vh = 10.0 ** (G / 20.0)
    Vb = Vh ** 0.4996667741545416
    a0 = 1.0 + K / Q + K * K
    b = [(Vh + Vb * K / Q + K * K) / a0, 2.0 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0]
    a = [1.0, 2.0 * (K * K - 1.0) / a0, (1.0 - K / Q + K * K) / a0]
    y = biquad(x, b, a)
    f0 = 38.13547087602444
    Q = 0.5003270373238773
    K = math.tan(math.pi * f0 / fs)
    a0 = 1.0 + K / Q + K * K
    b = [1.0, -2.0, 1.0]
    a = [1.0, 2.0 * (K * K - 1.0) / a0, (1.0 - K / Q + K * K) / a0]
    y = biquad(y, b, a)
    block = int(0.4 * fs)
    hop = int(0.1 * fs)
    if y.size < block:
        return -70.0
    ms = []
    for s in range(0, y.size - block + 1, hop):
        seg = y[s:s + block]
        ms.append(float(np.mean(seg * seg)))
    ms = np.asarray(ms, dtype=np.float64)
    lufs = -0.691 + 10.0 * np.log10(ms + 1e-20)
    keep = lufs > -70.0
    if not np.any(keep):
        return -70.0
    rel = -0.691 + 10.0 * np.log10(np.mean(ms[keep]) + 1e-20) - 10.0
    keep2 = keep & (lufs > rel)
    if not np.any(keep2):
        keep2 = keep
    return float(-0.691 + 10.0 * np.log10(np.mean(ms[keep2]) + 1e-20))


def dbfs(x):
    return 20.0 * math.log10(float(np.max(np.abs(x))) + 1e-20)


def rms_dbfs(x):
    return 20.0 * math.log10(float(np.sqrt(np.mean(x * x))) + 1e-20)


def font(size, bold=False):
    paths = [
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()


def draw_wave(path, y, title, subtitle, peak_db, rms_db, lufs):
    W, H = 1600, 560
    img = Image.new("RGB", (W, H), (7, 8, 13))
    d = ImageDraw.Draw(img)
    for gy in range(0, H, 40):
        d.line([(0, gy), (W, gy)], fill=(16, 24, 33))
    for gx in range(0, W, 100):
        d.line([(gx, 110), (gx, 470)], fill=(16, 24, 33))
    d.text((40, 24), title, font=font(28, True), fill=(224, 164, 94))
    d.text((40, 64), subtitle, font=font(15), fill=(155, 148, 138))
    x0, x1, yc, amp = 40, W - 40, 300, 165
    columns = 1400
    n = y.size
    step = n / float(columns)
    d.line([(x0, yc), (x1, yc)], fill=(70, 55, 38))
    for c in range(columns):
        a = int(c * step)
        b = min(n, int((c + 1) * step) + 1)
        seg = y[a:b]
        if seg.size == 0:
            continue
        lo = float(np.min(seg))
        hi = float(np.max(seg))
        x = x0 + (x1 - x0) * c / (columns - 1)
        d.line([(x, yc - hi * amp), (x, yc - lo * amp)], fill=(224, 164, 94), width=1)
    d.line([(x0, 480), (x1, 480)], fill=(70, 55, 38))
    labels = [
        ("peak  %6.2f dBFS" % peak_db, (224, 164, 94)),
        ("rms   %6.2f dBFS" % rms_db, (176, 138, 87)),
        ("LUFS  %6.2f (approx)" % lufs, (155, 148, 138)),
        ("loop  %.4f s / %d samples" % (T, N), (155, 148, 138)),
    ]
    for i, (txt, col) in enumerate(labels):
        d.text((40 + i * 380, 500), txt, font=font(16), fill=col)
    img.save(path)
    return path


def draw_seam(path, loop, sr):
    W, H = 1400, 460
    img = Image.new("RGB", (W, H), (7, 8, 13))
    d = ImageDraw.Draw(img)
    d.text((40, 22), "Loop seam zoom — last 100 ms → first 100 ms", font=font(24, True), fill=(224, 164, 94))
    d.text((40, 58), "periodic steady-state: y[T-1] and y[0] are adjacent samples; no fade-out/fade-in",
           font=font(14), fill=(155, 148, 138))
    n = int(0.100 * sr)
    tail = loop[-n:]
    head = loop[:n]
    y = np.concatenate([tail, head])
    x0, x1, yc, amp = 50, W - 50, 260, 150
    d.line([(x0, yc), (x1, yc)], fill=(70, 55, 38))
    d.line([(x0 + (x1 - x0) / 2, 105), (x0 + (x1 - x0) / 2, 410)], fill=(115, 42, 53), width=2)
    d.text((x0 + (x1 - x0) / 2 + 8, 108), "t = T  ↔  t = 0", font=font(13), fill=(224, 164, 94))
    xs = np.linspace(x0, x1, y.size)
    pts = [(float(x), yc - float(v) * amp) for x, v in zip(xs, y)]
    d.line(pts, fill=(224, 164, 94), width=2)
    d.text((x0, 420), "last 100 ms", font=font(13), fill=(155, 148, 138))
    d.text((x1 - 110, 420), "first 100 ms", font=font(13), fill=(155, 148, 138))
    img.save(path)
    return path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--shots", required=True)
    ap.add_argument("--report", default="")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    os.makedirs(args.shots, exist_ok=True)

    t = np.arange(3 * N, dtype=np.float64) / SR
    t_mod = t % T
    print("[music] pad ...")
    dry = build_pad(t, t_mod) + build_strings(t, t_mod)
    print("[music] transients ...")
    dry += build_transients()
    print("[music] reverb ...")
    ir = make_ir()
    wet = fft_conv(dry, ir)[:3 * N]
    # normalise reverb RMS in the steady middle period, then mix
    dry_seg = dry[N:2 * N]
    wet_seg = wet[N:2 * N]
    wet_gain = 0.34 * float(np.sqrt(np.mean(dry_seg * dry_seg)) / (np.sqrt(np.mean(wet_seg * wet_seg)) + 1e-20))
    wet *= wet_gain
    mix = 0.76 * dry + wet
    loop = spectral_tilt(mix[N:2 * N].copy())
    loop -= float(np.mean(loop))
    # peak normalise to -2.5 dBFS
    peak = float(np.max(np.abs(loop)))
    target = 10.0 ** (-2.5 / 20.0)
    loop *= target / (peak + 1e-20)
    # deterministic TPDF dither at 16-bit level (periodic seed, keeps loop proof)
    dither = (rng.random(N) - rng.random(N)) / 32768.0
    loop_d = np.clip(loop + dither, -1.0, 1.0)
    pcm = np.round(loop_d * 32767.0).astype("<i2")
    peak_db = dbfs(loop_d)
    rms_db = rms_dbfs(loop_d)
    lufs = approx_lufs(loop_d)

    # periodicity proof (float, before quantisation)
    proof = float(np.max(np.abs(mix[N:2 * N] - mix[2 * N:3 * N])))
    steady_graph = [float(np.max(np.abs(mix[N:2 * N]))), float(np.max(np.abs(mix[2 * N:3 * N])))]
    d1 = np.abs(np.diff(loop_d))
    d2 = np.abs(np.diff(loop_d, 2))
    seam_second = float(max(abs(loop_d[1] - 2 * loop_d[0] + loop_d[-1]),
                            abs(loop_d[0] - 2 * loop_d[-1] + loop_d[-2])))
    seam_step = float(abs(loop_d[0] - loop_d[-1]))
    # looped playback check: high-pass the 2-loop signal and look for a click at the seam
    twice = np.concatenate([loop_d, loop_d])
    hp = np.diff(twice)
    local = np.abs(hp[N - 8:N + 8])
    p999 = float(np.percentile(np.abs(hp), 99.9))
    seam_click = float(np.max(np.abs(loop_d[0] - loop_d[-1])))
    seam = dict(
        proofMaxErr=proof, steadyPeakAbs=steady_graph, samplesPerLoop=int(N),
        boundaryStep=seam_step, boundaryStepDbfs=20.0 * math.log10(seam_step + 1e-20),
        boundarySecondDiff=seam_second, secondDiffP999=float(np.percentile(d2, 99.9)),
        seamMaxDiffLocal=float(np.max(local)), diffP999=p999,
        verdict="EXACT" if proof < 1e-10 else "CHECK",
    )

    out_wav = os.path.join(args.out, "mus-calm.wav")
    with wave.open(out_wav, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    raw = open(out_wav, "rb").read()
    sha = hashlib.sha256(raw).hexdigest()
    size = len(raw)
    duration = N / float(SR)

    draw_wave(os.path.join(args.shots, "music-waveform.png"), loop_d,
              "V9.1 music bed · mus-calm.wav",
              "D major · 71 BPM · 4 bars · 13.52 s seamless · 22.05 kHz mono · self-made additive synthesis",
              peak_db, rms_db, lufs)
    draw_seam(os.path.join(args.shots, "music-loop-seam.png"), loop_d, SR)

    meta = dict(
        file="mus-calm.wav", kind="music", purpose="主桌舒缓环境音乐（无缝循环）",
        bytes=size, durationSec=round(duration, 6), samplesPerLoop=int(N),
        sampleRate=SR, channels=1, bitDepth=16, format="WAV / PCM 16-bit",
        bpm=round(60.0 * SR / BEAT_N, 4), key="D major", bars=4, beats=16,
        progression=[c["name"] for c in CHORDS],
        peakDbfs=round(peak_db, 4), rmsDbfs=round(rms_db, 4), approxLufs=round(lufs, 4),
        dc=float(np.mean(loop_d)), sha256=sha,
        generatedBy="numpy 2.3.5 additive synthesis (self-made); 3-period steady-state + wrapped transients + 2.8 s convolution reverb",
        license="self-made (numpy additive synthesis), no third-party samples, no external links",
        loopProof=seam,
        mix=dict(dry=0.76, reverb=0.34, reverbIrSec=2.8, targetPeakDbfs=-2.5),
    )
    with open(os.path.join(args.shots, "music-report.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    if args.report:
        with open(args.report, "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
    # also drop a compact asset manifest next to the wav? README/MANIFEST are maintained separately.
    print(json.dumps({k: meta[k] for k in ("file", "bytes", "durationSec", "peakDbfs", "rmsDbfs",
                                          "approxLufs", "sha256")}, ensure_ascii=False))
    print("loopProof", json.dumps(seam, ensure_ascii=False))
    print("out", out_wav)


if __name__ == "__main__":
    main()
