import librosa
import json
import sys

def analyze_audio(audio_path, output_json):
    print(f"Loading audio from {audio_path}...")
    y, sr = librosa.load(audio_path, sr=None)
    
    print("Extracting beats and onsets...")
    # Get tempo and beat frames
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)
    
    # Get onset times (more sensitive to all hits)
    onset_frames = librosa.onset.onset_detect(y=y, sr=sr)
    onset_times = librosa.frames_to_time(onset_frames, sr=sr)
    
    data = {
        "tempo": float(tempo[0]) if isinstance(tempo, (list, tuple)) or type(tempo).__name__ == 'ndarray' else float(tempo),
        "duration": float(librosa.get_duration(y=y, sr=sr)),
        "beats": [float(t) for t in beat_times],
        "onsets": [float(t) for t in onset_times]
    }
    
    with open(output_json, 'w') as f:
        json.dump(data, f, indent=4)
        
    print(f"Analysis complete. Found {len(beat_times)} beats and {len(onset_times)} onsets.")
    print(f"Saved to {output_json}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python analyze_beats.py <audio.wav> <output.json>")
        sys.exit(1)
    analyze_audio(sys.argv[1], sys.argv[2])
