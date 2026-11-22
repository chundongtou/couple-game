using UnityEngine;

/// <summary>Procedural audio director: no external assets, works in WebGL and mobile.
/// Replace clip generation with FMOD/Wwise banks later without changing call sites.</summary>
public class FullAudio : MonoBehaviour
{
    AudioSource source;
    AudioSource ambientSource;
    AudioClip click, roll, card, win, fail, ambient;
    bool ambientStarted;

    public void Build()
    {
        source = gameObject.AddComponent<AudioSource>();
        source.playOnAwake = false;
        source.spatialBlend = 0f;
        source.volume = 0.55f;

        ambientSource = gameObject.AddComponent<AudioSource>();
        ambientSource.playOnAwake = false;
        ambientSource.loop = true;
        ambientSource.spatialBlend = 0f;
        ambientSource.volume = 0.10f;

        click = MakeTone("ui_click", 0.07f, 880f, 0.35f, true);
        roll = MakeNoise("dice_roll", 0.38f, 0.25f);
        card = MakeTone("card", 0.32f, 1320f, 0.30f, false);
        win = MakeChord("win", 0.80f, new[] { 523.25f, 659.25f, 783.99f });
        fail = MakeTone("fail", 0.30f, 220f, 0.30f, false);
        ambient = MakeAmbient(3.0f);
    }

    AudioClip MakeAmbient(float dur)
    {
        int rate = 22050;
        int n = Mathf.CeilToInt(dur * rate);
        var data = new float[n];
        var rng = new System.Random(31);
        float low = 0f;
        for (int i = 0; i < n; i++)
        {
            float white = (float)rng.NextDouble() * 2f - 1f;
            low = low * 0.995f + white * 0.005f;
            float t = i / (float)rate;
            float hum = Mathf.Sin(2f * Mathf.PI * 55f * t) * 0.015f;
            float fade = Mathf.Min(1f, Mathf.Min(t * 4f, (dur - t) * 4f));
            data[i] = (low * 0.45f + hum) * Mathf.Max(0f, fade);
        }
        var clip = AudioClip.Create("ambient", n, 1, rate, false);
        clip.SetData(data, 0);
        return clip;
    }

    AudioClip MakeTone(string name, float dur, float freq, float amp, bool square)
    {
        int rate = 44100;
        int n = Mathf.CeilToInt(dur * rate);
        var data = new float[n];
        for (int i = 0; i < n; i++)
        {
            float t = i / (float)rate;
            float env = Mathf.Exp(-t * 8f);
            float v = Mathf.Sin(2f * Mathf.PI * freq * t);
            if (square) v = Mathf.Sign(v) * 0.35f;
            data[i] = v * env * amp;
        }
        var clip = AudioClip.Create(name, n, 1, rate, false);
        clip.SetData(data, 0);
        return clip;
    }

    AudioClip MakeNoise(string name, float dur, float amp)
    {
        int rate = 44100;
        int n = Mathf.CeilToInt(dur * rate);
        var data = new float[n];
        var rng = new System.Random(17);
        for (int i = 0; i < n; i++)
        {
            float t = i / (float)rate;
            float env = Mathf.Exp(-t * 6f);
            data[i] = ((float)rng.NextDouble() * 2f - 1f) * env * amp;
        }
        var clip = AudioClip.Create(name, n, 1, rate, false);
        clip.SetData(data, 0);
        return clip;
    }

    AudioClip MakeChord(string name, float dur, float[] freqs)
    {
        int rate = 44100;
        int n = Mathf.CeilToInt(dur * rate);
        var data = new float[n];
        for (int i = 0; i < n; i++)
        {
            float t = i / (float)rate;
            float env = Mathf.Exp(-t * 2.2f);
            float v = 0f;
            foreach (var f in freqs) v += Mathf.Sin(2f * Mathf.PI * f * t) / freqs.Length;
            data[i] = v * env * 0.42f;
        }
        var clip = AudioClip.Create(name, n, 1, rate, false);
        clip.SetData(data, 0);
        return clip;
    }

    void Play(AudioClip c)
    {
        if (source != null && c != null) source.PlayOneShot(c);
    }

    public void PlayClick() => Play(click);
    public void PlayRoll() => Play(roll);
    public void PlayCard() => Play(card);
    public void PlayWin() => Play(win);
    public void PlayFail() => Play(fail);

    public void PlayAmbient()
    {
        if (ambientStarted || ambientSource == null || ambient == null) return;
        ambientStarted = true;
        ambientSource.clip = ambient;
        ambientSource.Play();
    }

    public void SetVolume(float value)
    {
        float v = Mathf.Clamp01(value);
        if (source != null) source.volume = v;
        if (ambientSource != null) ambientSource.volume = v * 0.18f;
    }
}
