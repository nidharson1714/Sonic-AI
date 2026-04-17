import numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter
import os
import random
import glob
import hashlib

SR = 44100  # sample rate

# ── Dataset path (relative to project root) ──────────────────────────────
DATASET_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "music_dataset")
DATASET_DIR = os.path.normpath(DATASET_DIR)

# ── Genre → instrument layers ────────────────────────────────────────────
# Each layer: (instrument_folder, volume, role)
# role is just descriptive; volume controls how loud that layer is in the mix
GENRE_PRESETS = {
    "Lo-Fi": [
        ("Piano", 0.70, "chords"),
        ("Acoustic_Guitar", 0.50, "rhythm"),
        ("Bass_Guitar", 0.45, "bass"),
        ("Hi_Hats", 0.30, "percussion"),
        ("Shakers", 0.25, "texture"),
    ],
    "Cinematic": [
        ("Violin", 0.65, "lead"),
        ("Piano", 0.50, "harmony"),
        ("Trumpet", 0.35, "accent"),
        ("Cymbals", 0.25, "percussion"),
        ("Horn", 0.40, "brass"),
        ("flute", 0.30, "melody"),
    ],
    "Electronic": [
        ("Keyboard", 0.60, "synth"),
        ("Electro_Guitar", 0.45, "lead"),
        ("Bass_Guitar", 0.55, "bass"),
        ("Drum_set", 0.40, "drums"),
        ("Hi_Hats", 0.30, "hats"),
        ("Cymbals", 0.20, "crash"),
    ],
    "Ambient": [
        ("Piano", 0.55, "pad"),
        ("Violin", 0.45, "strings"),
        ("flute", 0.40, "melody"),
        ("Harmonium", 0.35, "drone"),
        ("vibraphone", 0.35, "bells"),
        ("Shakers", 0.20, "texture"),
    ],
    "Jazz": [
        ("Saxophone", 0.65, "lead"),
        ("Piano", 0.50, "comping"),
        ("Bass_Guitar", 0.45, "bass"),
        ("Drum_set", 0.35, "drums"),
        ("Trumpet", 0.30, "brass"),
        ("Hi_Hats", 0.25, "hats"),
    ],
    "Pop": [
        ("Acoustic_Guitar", 0.55, "rhythm"),
        ("Piano", 0.45, "chords"),
        ("Bass_Guitar", 0.50, "bass"),
        ("Drum_set", 0.40, "drums"),
        ("Keyboard", 0.30, "synth"),
        ("Tambourine", 0.25, "percussion"),
    ],
}


def _load_sample(path):
    """Load a WAV file and return as float64 mono array normalized to [-1, 1]."""
    try:
        sr, data = wavfile.read(path)
        data = data.astype(np.float64)
        # Convert to mono if stereo
        if data.ndim > 1:
            data = data.mean(axis=1)
        # Normalize to [-1, 1]
        peak = np.max(np.abs(data))
        if peak > 0:
            data = data / peak
        # Resample if needed (simple nearest-neighbor for speed)
        if sr != SR:
            ratio = SR / sr
            new_len = int(len(data) * ratio)
            indices = np.linspace(0, len(data) - 1, new_len).astype(int)
            data = data[indices]
        return data
    except Exception:
        return None


def _get_samples(instrument_folder, count, seed):
    """Get `count` random sample paths from an instrument folder."""
    folder = os.path.join(DATASET_DIR, instrument_folder)
    if not os.path.isdir(folder):
        return []
    files = glob.glob(os.path.join(folder, "*.wav"))
    if not files:
        return []
    rng = random.Random(seed + instrument_folder)
    rng.shuffle(files)
    return files[:count]


def _crossfade(a, b, fade_samples):
    """Crossfade between two arrays."""
    fade = min(fade_samples, len(a), len(b))
    if fade <= 0:
        return np.concatenate([a, b])
    fade_out = np.linspace(1, 0, fade)
    fade_in = np.linspace(0, 1, fade)
    result = np.concatenate([a[:-fade], a[-fade:] * fade_out + b[:fade] * fade_in, b[fade:]])
    return result


def _build_layer(instrument_folder, duration, volume, seed):
    """Build a single instrument layer by chaining random samples to fill duration."""
    total_samples = int(SR * duration)
    samples_needed = max(10, (total_samples // (SR * 1)) + 5)  # estimate ~1sec per clip + extras
    paths = _get_samples(instrument_folder, samples_needed, seed)
    if not paths:
        return np.zeros(total_samples)

    layer = np.array([], dtype=np.float64)
    fade_len = int(SR * 0.05)  # 50ms crossfade between clips
    rng = random.Random(seed + instrument_folder + "_order")

    # Keep looping through samples until we have enough audio
    idx = 0
    while len(layer) < total_samples:
        path = paths[idx % len(paths)]
        clip = _load_sample(path)
        if clip is None or len(clip) < 100:
            idx += 1
            continue
        if len(layer) == 0:
            layer = clip
        else:
            layer = _crossfade(layer, clip, fade_len)
        idx += 1
        if idx > len(paths) * 3:  # safety: don't infinite loop
            break

    # Trim or pad to exact duration
    if len(layer) >= total_samples:
        layer = layer[:total_samples]
    else:
        layer = np.pad(layer, (0, total_samples - len(layer)))

    return layer * volume


def _simple_reverb(signal, decay=0.3, delay_ms=40):
    """Apply a simple comb-filter reverb for spatial depth."""
    delay_samples = int(SR * delay_ms / 1000)
    b = np.zeros(delay_samples + 1)
    b[0] = 1.0
    b[-1] = decay
    a = [1.0]
    return lfilter(b, a, signal)


def _fade(wave, fade_sec=1.5):
    """Apply fade in/out to avoid clicks."""
    fade_len = int(SR * fade_sec)
    fade_in = np.linspace(0, 1, min(fade_len, len(wave) // 4))
    fade_out = np.linspace(1, 0, min(fade_len, len(wave)))
    wave[:len(fade_in)] *= fade_in
    wave[-len(fade_out):] *= fade_out
    return wave


def _normalize(wave):
    peak = np.max(np.abs(wave))
    return wave / peak if peak > 0 else wave


def generate_track_dsp(prompt: str, genre: str, output_path: str, duration: int = 20):
    """
    Generate a layered music track using real instrument samples from music_dataset.
    Saves a normalized 16-bit WAV to output_path.
    """
    # Create a deterministic seed from the prompt so same prompt = same track
    seed = hashlib.md5(prompt.encode()).hexdigest()[:8]

    preset = GENRE_PRESETS.get(genre, GENRE_PRESETS["Electronic"])
    total_samples = int(SR * duration)
    track = np.zeros(total_samples)

    # Build each instrument layer and mix them
    for (instrument, volume, role) in preset:
        layer_seed = seed + role
        layer = _build_layer(instrument, duration, volume, layer_seed)
        track += layer[:total_samples]

    # Apply light reverb for spatial depth
    track = _simple_reverb(track, decay=0.25, delay_ms=35)

    # Normalize
    track = _normalize(track)

    # Fade in/out
    track = _fade(track, fade_sec=min(2.0, duration * 0.1))

    # Hard saturation for loudness + warmth
    track = np.tanh(track * 3.0) / np.tanh(3.0)

    # Final normalize at 95% headroom and convert to 16-bit
    track = np.int16(_normalize(track) * 0.95 * 32767)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    wavfile.write(output_path, SR, track)
    return output_path
