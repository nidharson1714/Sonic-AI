"""
Music theory learning plans for each genre.
This is the core educational layer of SonicAI — the "Learn" step.
"""

LEARNING_PLANS = {
    "Lo-Fi": {
        "genre": "Lo-Fi",
        "scale": "Minor Pentatonic / Dorian Mode",
        "chords": "Major 7ths and Minor 9ths — e.g. Cmaj7 → Am9 → Fmaj7 → G7",
        "tempo": "70–90 BPM with slight swing (groove quantization)",
        "key": "C minor or F major (warm, nostalgic keys)",
        "instruments": "Detuned Rhodes piano, vinyl crackle layer, saturated bass, soft brush drums",
        "sound_design": "Low-pass filter on leads, slight tape saturation, reverb on snare",
        "tip": "Add slight swing to hi-hats and detune your piano ±10 cents for that vintage feel.",
        "theory_note": "Lo-Fi leans on jazz harmony — major 7ths add warmth without tension.",
    },
    "Cinematic": {
        "genre": "Cinematic",
        "scale": "Natural Minor / Phrygian for tension",
        "chords": "Minor chords with added 6ths or 9ths, suspended 2nds and 4ths",
        "tempo": "60–80 BPM, often rubato (free rhythm following emotion)",
        "key": "D minor or E minor (dramatic, dark keys)",
        "instruments": "Orchestral strings, brass stabs, deep sub bass, choir pads",
        "sound_design": "Long reverb tails, swell automation on strings, low-end rumble",
        "tip": "Hold the root note in the bass while shifting chords above — creates powerful tension.",
        "theory_note": "Cinematic music uses pedal tones and modal interchange to build emotional arcs.",
    },
    "Electronic": {
        "genre": "Electronic",
        "scale": "Minor scale / Chromatic for leads",
        "chords": "Power chords, minor triads, four-on-the-floor rhythm",
        "tempo": "120–140 BPM, strict grid quantization",
        "key": "A minor or F# minor (energetic, driving keys)",
        "instruments": "Saw wave synths, square bass, tight electronic kick/snare, white noise sweeps",
        "sound_design": "Hard sidechain compression, filter sweeps, distorted 808 bass",
        "tip": "Build energy with a 16-bar intro, 8-bar breakdown, then a hard drop.",
        "theory_note": "Electronic music is rhythm-first — the groove and sidechain define the feel.",
    },
    "Ambient": {
        "genre": "Ambient",
        "scale": "Lydian Mode / Whole Tone for dreamlike quality",
        "chords": "Suspended chords (sus2, sus4), open 5ths, add9 chords",
        "tempo": "60–80 BPM or no fixed tempo (textural, evolving)",
        "key": "E major or G major (open, airy keys)",
        "instruments": "Slow sine pads, granular textures, field recordings, soft piano",
        "sound_design": "Heavy reverb (hall/plate), long attack/release on all envelopes, shimmer",
        "tip": "Let notes breathe — silence and space are as important as the notes themselves.",
        "theory_note": "Ambient avoids resolution — chords float without needing to resolve to tonic.",
    },
    "Jazz": {
        "genre": "Jazz",
        "scale": "Mixolydian / Bebop Scale",
        "chords": "ii–V–I progressions, dominant 7ths, altered chords (7#9, 7b13)",
        "tempo": "100–160 BPM with swing feel (triplet subdivision)",
        "key": "Bb major or G major (classic jazz keys for horns)",
        "instruments": "Upright bass, jazz piano (Rhodes or acoustic), ride cymbal, muted trumpet",
        "sound_design": "Warm low-pass on bass, slight room reverb, no heavy compression",
        "tip": "The ii–V–I is the backbone of jazz — master it in all 12 keys.",
        "theory_note": "Jazz harmony is built on tension and resolution — every chord wants to move somewhere.",
    },
    "Pop": {
        "genre": "Pop",
        "scale": "Major Scale / Major Pentatonic",
        "chords": "I–V–vi–IV (the most common pop progression in history)",
        "tempo": "100–130 BPM, straight 4/4 grid",
        "key": "C major or G major (bright, accessible keys)",
        "instruments": "Layered synths, punchy kick, clap on 2 and 4, melodic bass",
        "sound_design": "Heavy compression for loudness, bright high-end EQ, vocal-style lead synth",
        "tip": "Hook first — write the chorus melody before anything else.",
        "theory_note": "Pop music prioritizes memorability — repetition and contrast between verse and chorus.",
    },
}

def get_learning_plan(genre: str) -> dict:
    return LEARNING_PLANS.get(genre, LEARNING_PLANS["Electronic"])

def get_all_genres() -> list:
    return list(LEARNING_PLANS.keys())
