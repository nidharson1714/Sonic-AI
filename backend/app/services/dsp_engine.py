import numpy as np
from scipy.io import wavfile
import os

SR = 44100  # sample rate

def _sine(freq, dur, vol=0.5):
    t = np.linspace(0, dur, int(SR * dur), False)
    return np.sin(freq * 2 * np.pi * t) * vol

def _square(freq, dur, vol=0.3):
    t = np.linspace(0, dur, int(SR * dur), False)
    return np.sign(np.sin(freq * 2 * np.pi * t)) * vol

def _saw(freq, dur, vol=0.3, harmonics=8):
    t = np.linspace(0, dur, int(SR * dur), False)
    wave = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        wave += ((-1) ** (k + 1)) / k * np.sin(2 * np.pi * freq * k * t)
    return wave * vol * (2 / np.pi)

def _chord(root, ratios, wtype, dur, vol=0.25):
    n = int(SR * dur)
    wave = np.zeros(n)
    for r in ratios:
        f = root * r
        seg = _sine(f, dur, vol) if wtype == "sine" else (_saw(f, dur, vol) if wtype == "saw" else _square(f, dur, vol))
        wave += seg[:n]
    return wave

def _fade(wave, fade_sec=1.5):
    fade_len = int(SR * fade_sec)
    fade_in = np.linspace(0, 1, min(fade_len, len(wave) // 4))
    fade_out = np.linspace(1, 0, fade_len)
    wave[:len(fade_in)] *= fade_in
    wave[-fade_len:] *= fade_out
    return wave

def _normalize(wave):
    peak = np.max(np.abs(wave))
    return wave / peak if peak > 0 else wave

# Genre presets: list of (root_freq, chord_ratios, wtype, segment_sec, vol)
GENRE_PRESETS = {
    "Lo-Fi": [
        (110.0, [1.0], "square", 4, 0.25),           # bass
        (220.0, [1.0, 1.2599, 1.4983], "sine", 4, 0.2),  # Cmaj7-ish pad
        (165.0, [1.0, 1.1892], "sine", 4, 0.15),     # melody hint
    ],
    "Cinematic": [
        (65.4,  [1.0], "sine", 5, 0.3),              # deep bass
        (130.8, [1.0, 1.1892, 1.4983], "sine", 5, 0.2),  # minor pad
        (261.6, [1.0, 1.2599], "sine", 5, 0.15),     # high strings
    ],
    "Electronic": [
        (130.8, [1.0], "square", 3, 0.3),            # bass
        (261.6, [1.0, 1.2599, 1.4983], "saw", 3, 0.2),   # lead
        (523.2, [1.0], "saw", 3, 0.1),               # high synth
    ],
    "Ambient": [
        (82.4,  [1.0, 1.4983], "sine", 6, 0.2),      # slow pad
        (164.8, [1.0, 1.2599, 1.4983, 1.7818], "sine", 6, 0.15),
        (329.6, [1.0], "sine", 6, 0.1),
    ],
    "Jazz": [
        (110.0, [1.0], "saw", 4, 0.25),              # warm bass
        (220.0, [1.0, 1.2599, 1.4983, 1.6818], "sine", 4, 0.2),  # maj7
        (440.0, [1.0, 1.1225], "sine", 4, 0.12),     # piano hint
    ],
    "Pop": [
        (130.8, [1.0], "square", 3, 0.28),           # bass
        (261.6, [1.0, 1.2599, 1.4983], "sine", 3, 0.2),
        (523.2, [1.0, 1.1892], "saw", 3, 0.15),
    ],
}

def generate_track_dsp(prompt: str, genre: str, output_path: str, duration: int = 20):
    """
    Generate a layered DSP audio track for the given genre.
    Saves a normalized 16-bit WAV to output_path.
    """
    preset = GENRE_PRESETS.get(genre, GENRE_PRESETS["Electronic"])
    total_samples = int(SR * duration)
    track = np.zeros(total_samples)

    for (root, ratios, wtype, seg_sec, vol) in preset:
        pos = 0
        while pos < total_samples:
            remaining = (total_samples - pos) / SR
            t_len = min(seg_sec, remaining)
            if t_len < 0.1:
                break
            seg = _chord(root, ratios, wtype, t_len, vol)
            end = pos + len(seg)
            track[pos:end] += seg
            pos = end

    track = _normalize(track)
    track = _fade(track, fade_sec=min(2.0, duration * 0.1))

    # Gentle saturation (warmth)
    track = np.tanh(track * 1.5) / np.tanh(1.5)

    track = np.int16(_normalize(track) * 32767)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    wavfile.write(output_path, SR, track)
    return output_path
