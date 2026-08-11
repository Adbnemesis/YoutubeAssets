import os
import numpy as np
import librosa
from typing import Dict, Any, List
from project_video_analyze.src.utils.ffmpeg_utils import extract_audio

class LibrosaAudioAnalyzer:
    def __init__(self, video_path: str, fps: float, temp_dir: str):
        self.video_path = video_path
        self.fps = fps
        self.temp_dir = temp_dir

    def run(self) -> Dict[str, Any]:
        """
        Executes full Librosa audio analysis: BPM, beat frames, onsets, energy, spectral flux, silence.
        """
        wav_path = os.path.join(self.temp_dir, "extracted_audio.wav")
        try:
            extract_audio(self.video_path, wav_path)
        except Exception as e:
            print(f"[Warning] Audio extraction failed (video may be silent): {e}")
            return {
                "bpm": 0.0,
                "hasAudio": False,
                "beats": [],
                "strongBeats": [],
                "onsets": [],
                "energyProfile": [],
                "silenceIntervals": []
            }

        # Load audio into Librosa
        y, sr = librosa.load(wav_path, sr=22050, mono=True)
        duration = len(y) / float(sr)

        if len(y) == 0 or duration == 0:
            return {
                "bpm": 0.0,
                "hasAudio": False,
                "beats": [],
                "strongBeats": [],
                "onsets": [],
                "energyProfile": [],
                "silenceIntervals": []
            }

        # 1. Tempo & Beat Tracking
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        bpm = float(tempo[0]) if isinstance(tempo, np.ndarray) else float(tempo)
        beat_times = librosa.frames_to_time(beat_frames, sr=sr)

        # 2. Onset Detection
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)
        onset_times = librosa.frames_to_time(onset_frames, sr=sr)

        # 3. RMS Energy & Normalize
        hop_length = 512
        rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]
        max_rms = np.max(rms) if np.max(rms) > 0 else 1.0
        normalized_rms = rms / max_rms

        # 4. Spectral Centroid
        cent = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=hop_length)[0]
        max_cent = np.max(cent) if np.max(cent) > 0 else 1.0

        # Construct Beats List with strength & type classification
        beats_list = []
        strong_beats = []

        max_onset_env = np.max(onset_env) if np.max(onset_env) > 0 else 1.0

        for t in beat_times:
            frame_num = int(round(t * self.fps))
            # Sample onset strength near this time
            sample_idx = int(round(t * sr / hop_length))
            if sample_idx < len(onset_env):
                strength = float(onset_env[sample_idx] / max_onset_env)
            else:
                strength = 0.5

            is_strong = strength > 0.65
            b_type = "strong_beat" if is_strong else "beat"

            item = {
                "time": round(float(t), 6),
                "frame": frame_num,
                "type": b_type,
                "strength": round(float(strength), 4)
            }
            beats_list.append(item)
            if is_strong:
                strong_beats.append(item)

        # Construct Onsets List
        onsets_list = []
        for t in onset_times:
            frame_num = int(round(t * self.fps))
            sample_idx = int(round(t * sr / hop_length))
            st = float(onset_env[sample_idx] / max_onset_env) if sample_idx < len(onset_env) else 0.5

            onsets_list.append({
                "time": round(float(t), 6),
                "frame": frame_num,
                "type": "onset",
                "strength": round(st, 4)
            })

        # Detect Silence Intervals
        non_silent_intervals = librosa.effects.split(y, top_db=35)
        silence_intervals = []
        last_end = 0.0

        for start, end in non_silent_intervals:
            start_t = start / float(sr)
            end_t = end / float(sr)
            if start_t - last_end > 0.2: # Silence > 200ms
                silence_intervals.append({
                    "startFrame": int(round(last_end * self.fps)),
                    "endFrame": int(round(start_t * self.fps)),
                    "startTime": round(last_end, 6),
                    "endTime": round(start_t, 6)
                })
            last_end = end_t

        if duration - last_end > 0.2:
            silence_intervals.append({
                "startFrame": int(round(last_end * self.fps)),
                "endFrame": int(round(duration * self.fps)),
                "startTime": round(last_end, 6),
                "endTime": round(duration, 6)
            })

        # Clean up temporary WAV file
        if os.path.exists(wav_path):
            try:
                os.remove(wav_path)
            except Exception:
                pass

        return {
            "bpm": round(bpm, 2),
            "hasAudio": True,
            "beats": beats_list,
            "strongBeats": strong_beats,
            "onsets": onsets_list,
            "silenceIntervals": silence_intervals
        }
