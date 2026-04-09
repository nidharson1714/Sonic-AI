import numpy as np
from scipy.io import wavfile
import os

def generate_sine_wave(freq, duration, sample_rate=44100, volume=0.5):
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    return np.sin(freq * 2 * np.pi * t) * volume

def generate_square_wave(freq, duration, sample_rate=44100, volume=0.5):
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    return np.sign(np.sin(freq * 2 * np.pi * t)) * volume

def build_chord(root_freq, intervals, w_type, duration, sample_rate=44100):
    wave = np.zeros(int(sample_rate * duration))
    ratios = intervals
    for r in ratios:
        if w_type == "pad":
            wave += generate_sine_wave(root_freq * r, duration, sample_rate, volume=0.2)
        elif w_type == "bass":
            wave += generate_square_wave(root_freq * r, duration, sample_rate, volume=0.3)
    return wave

def generate_track_dsp(prompt: str, genre: str, output_path: str, duration: int = 15):
    """
    Generate audio based on a genre using basic DSP math.
    Saves the wav file to output_path.
    """
    sample_rate = 44100
    track_wave = np.zeros(int(sample_rate * duration))
    
    # We create basic chords depending on genre fallback
    # Just a proof-of-concept audio generation for the platform fallback
    if genre == "Lo-Fi":
        for i in range(0, duration, 5):
            t_len = min(5, duration - i)
            bass = build_chord(110.0, [1.0], "bass", t_len)
            pad = build_chord(220.0, [1.0, 1.25, 1.5], "pad", t_len)
            track_wave[i*sample_rate:(i+t_len)*sample_rate] = bass + pad
    elif genre == "Cinematic":
        for i in range(0, duration, 5):
            t_len = min(5, duration - i)
            bass = build_chord(65.4, [1.0], "bass", t_len)
            pad = build_chord(130.8, [1.0, 1.25, 1.5], "pad", t_len)
            track_wave[i*sample_rate:(i+t_len)*sample_rate] = bass + pad
    else:
        for i in range(0, duration, 3):
            t_len = min(3, duration - i)
            bass = build_chord(130.8, [1.0], "bass", t_len)
            pad = build_chord(261.6, [1.0, 1.25, 1.5], "pad", t_len)
            track_wave[i*sample_rate:(i+t_len)*sample_rate] = bass + pad
            
    # Normalize and fade out slightly
    if np.max(np.abs(track_wave)) > 0:
        track_wave = track_wave / np.max(np.abs(track_wave))
    
    # Quick fade out
    fade_len = int(sample_rate * 1.0) # 1 sec fade
    fade = np.linspace(1.0, 0.0, fade_len)
    track_wave[-fade_len:] = track_wave[-fade_len:] * fade
    
    # float -> 16-bit integer
    track_wave = np.int16(track_wave * 32767)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    wavfile.write(output_path, sample_rate, track_wave)
    return output_path
