import os
import numpy as np
import librosa
import aubio
from typing import Dict, Any, List
from project_video_analyze.src.utils.ffmpeg_utils import extract_audio

class LibrosaAudioAnalyzer:
    def __init__(self, video_path: str, fps: float, temp_dir: str):
        self.video_path = video_path
        self.fps = fps
        self.temp_dir = temp_dir

    def run(self) -> Dict[str, Any]:
        """
        Executes multi-engine audio analysis (Librosa + Aubio + RMS energy flux):
        reconciles beats, onsets, transients, silences into unified audio events.
        """
        wav_path = os.path.join(self.temp_dir, "extracted_audio.wav")
        try:
            extract_audio(self.video_path, wav_path)
        except Exception as e:
            print(f"[Warning] Audio extraction failed (video may be silent): {e}")
            return self._empty_response()

        # Load audio for Librosa
        try:
            y, sr = librosa.load(wav_path, sr=22050, mono=True)
        except Exception as e:
            print(f"[Warning] Could not load audio with Librosa: {e}")
            return self._empty_response()

        duration = len(y) / float(sr)
        if len(y) == 0 or duration == 0:
            return self._empty_response()

        # --- 1. Librosa Detection ---
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        librosa_bpm = float(tempo[0]) if isinstance(tempo, np.ndarray) else float(tempo)
        librosa_beat_times = librosa.frames_to_time(beat_frames, sr=sr)

        hop_length = 512
        onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop_length)
        max_onset_env = float(np.max(onset_env)) if len(onset_env) > 0 and np.max(onset_env) > 0 else 1.0
        librosa_onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr, hop_length=hop_length)
        librosa_onset_times = librosa.frames_to_time(librosa_onset_frames, sr=sr, hop_length=hop_length)

        rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]
        max_rms = float(np.max(rms)) if len(rms) > 0 and np.max(rms) > 0 else 1.0
        normalized_rms = rms / max_rms

        # --- 2. Aubio Detection ---
        aubio_beats = []
        aubio_onsets = []
        aubio_bpm = 0.0

        try:
            # Aubio Tempo Detector
            win_s = 1024
            hop_s = 512
            s = aubio.source(wav_path, sr, hop_s)
            samplerate = s.samplerate
            o_tempo = aubio.tempo("default", win_s, hop_s, samplerate)
            
            read_samples = 0
            while True:
                samples, read = s()
                is_beat = o_tempo(samples)
                if is_beat:
                    beat_sec = float(o_tempo.get_last_s())
                    aubio_beats.append(beat_sec)
                read_samples += read
                if read < hop_s:
                    break
            
            aubio_bpm = float(o_tempo.get_bpm())

            # Aubio Onset Detector
            s2 = aubio.source(wav_path, sr, hop_s)
            o_onset = aubio.onset("default", win_s, hop_s, samplerate)
            while True:
                samples, read = s2()
                if o_onset(samples):
                    onset_sec = float(o_onset.get_last_s())
                    aubio_onsets.append(onset_sec)
                if read < hop_s:
                    break
        except Exception as e:
            print(f"[Warning] Aubio analysis fallback: {e}")

        final_bpm = round((librosa_bpm + aubio_bpm) / 2.0, 2) if aubio_bpm > 0 else round(librosa_bpm, 2)

        # --- 3. Unified Reconciled Audio Event Pipeline ---
        # Map frame indices to detected events across Librosa, Aubio, RMS energy flux
        frame_events_map: Dict[int, List[Dict[str, Any]]] = {}

        # Process Librosa Beats
        for t in librosa_beat_times:
            frame_num = int(round(t * self.fps))
            sample_idx = int(round(t * sr / hop_length))
            st = float(onset_env[sample_idx] / max_onset_env) if sample_idx < len(onset_env) else 0.5
            rms_val = float(normalized_rms[sample_idx]) if sample_idx < len(normalized_rms) else 0.5

            if frame_num not in frame_events_map:
                frame_events_map[frame_num] = []

            frame_events_map[frame_num].append({
                "source": "librosa",
                "time": float(t),
                "strength": st,
                "rms": rms_val,
                "is_beat": True
            })

        # Process Aubio Beats
        for t in aubio_beats:
            frame_num = int(round(t * self.fps))
            if frame_num not in frame_events_map:
                frame_events_map[frame_num] = []

            frame_events_map[frame_num].append({
                "source": "aubio",
                "time": float(t),
                "strength": 0.7,
                "rms": 0.5,
                "is_beat": True
            })

        # Process Librosa Onsets
        for t in librosa_onset_times:
            frame_num = int(round(t * self.fps))
            sample_idx = int(round(t * sr / hop_length))
            st = float(onset_env[sample_idx] / max_onset_env) if sample_idx < len(onset_env) else 0.5
            if frame_num not in frame_events_map:
                frame_events_map[frame_num] = []
            frame_events_map[frame_num].append({
                "source": "librosa",
                "time": float(t),
                "strength": st,
                "rms": float(normalized_rms[sample_idx]) if sample_idx < len(normalized_rms) else 0.5,
                "is_onset": True
            })

        # Process Aubio Onsets
        for t in aubio_onsets:
            frame_num = int(round(t * self.fps))
            if frame_num not in frame_events_map:
                frame_events_map[frame_num] = []
            frame_events_map[frame_num].append({
                "source": "aubio",
                "time": float(t),
                "strength": 0.65,
                "rms": 0.5,
                "is_onset": True
            })

        # Reconcile into unified audio events
        unified_audio_events = []
        legacy_beats = []
        legacy_strong_beats = []
        legacy_onsets = []

        for f_num in sorted(frame_events_map.keys()):
            evs = frame_events_map[f_num]
            sources = sorted(list(set([e["source"] for e in evs])))
            
            has_librosa = "librosa" in sources
            has_aubio = "aubio" in sources
            
            avg_time = float(np.mean([e["time"] for e in evs]))
            max_st = float(np.max([e.get("strength", 0.5) for e in evs]))
            max_rms = float(np.max([e.get("rms", 0.5) for e in evs]))

            is_beat = any(e.get("is_beat", False) for e in evs)
            is_onset = any(e.get("is_onset", False) for e in evs)

            if max_rms > 0.8:
                sources.append("rms")
                sources = sorted(list(set(sources)))

            # Event Classification & Confidence Rating
            if is_beat:
                confidence = 0.95 if (has_librosa and has_aubio) else 0.82
                e_type = "strong_beat" if (max_st > 0.65 or max_rms > 0.75) else "beat"
            elif is_onset:
                confidence = 0.90 if (has_librosa and has_aubio) else 0.78
                e_type = "strong_onset" if max_st > 0.70 else "onset"
            else:
                confidence = 0.70
                e_type = "transient"

            event_obj = {
                "frame": f_num,
                "time": round(avg_time, 6),
                "type": e_type,
                "strength": round(max_st, 4),
                "confidence": round(confidence, 4),
                "sources": sources
            }
            unified_audio_events.append(event_obj)

            if "beat" in e_type:
                legacy_beats.append(event_obj)
                if e_type == "strong_beat":
                    legacy_strong_beats.append(event_obj)
            elif "onset" in e_type:
                legacy_onsets.append(event_obj)

        # Detect Silence Intervals
        silence_intervals = []
        try:
            non_silent_intervals = librosa.effects.split(y, top_db=35)
            last_end = 0.0
            for start, end in non_silent_intervals:
                start_t = start / float(sr)
                end_t = end / float(sr)
                if start_t - last_end > 0.2:
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
        except Exception as e:
            print(f"[Warning] Silence detection fallback: {e}")

        # Keep temporary audio file if needed, or remove
        if os.path.exists(wav_path):
            try:
                os.remove(wav_path)
            except Exception:
                pass

        return {
            "bpm": final_bpm,
            "hasAudio": True,
            "beats": legacy_beats,
            "strongBeats": legacy_strong_beats,
            "onsets": legacy_onsets,
            "audioEvents": unified_audio_events,
            "silenceIntervals": silence_intervals
        }

    def _empty_response(self) -> Dict[str, Any]:
        return {
            "bpm": 0.0,
            "hasAudio": False,
            "beats": [],
            "strongBeats": [],
            "onsets": [],
            "audioEvents": [],
            "silenceIntervals": []
        }
