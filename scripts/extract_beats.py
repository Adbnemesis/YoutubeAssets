import librosa
import json

audio_path = 'project_cool_edit/assets/audio/extracted_audio.wav'
y, sr = librosa.load(audio_path, sr=None)

# Run onset detection
onset_env = librosa.onset.onset_strength(y=y, sr=sr)
onsets = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr, units='time')

# Get rhythmic beats
tempo, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr, units='time')

data = {
    'onsets': onsets.tolist(),
    'beats': beats.tolist(),
    'tempo': float(tempo)
}

with open('project_cool_edit/data/beats.json', 'w') as f:
    json.dump(data, f, indent=4)

print(f"Detected {len(onsets)} onsets and {len(beats)} beats.")
