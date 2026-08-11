import os
from typing import Dict, Any, List
from project_video_analyze.src.utils.ffmpeg_utils import extract_audio

class FasterWhisperSpeechAligner:
    def __init__(self, video_path: str, fps: float, temp_dir: str):
        self.video_path = video_path
        self.fps = fps
        self.temp_dir = temp_dir

    def run(self) -> Dict[str, Any]:
        """
        Executes local Faster-Whisper / Whisper alignment to extract word-level & sentence-level timestamps.
        """
        wav_path = os.path.join(self.temp_dir, "speech_audio.wav")
        try:
            extract_audio(self.video_path, wav_path, sample_rate=16000)
        except Exception as e:
            print(f"[Warning] Audio extraction for speech alignment failed: {e}")
            return {"transcript": "", "segments": [], "words": []}

        segments_out = []
        words_out = []
        full_transcript = []

        try:
            from faster_whisper import WhisperModel
            # Load tiny or base model locally
            model = WhisperModel("base", device="cpu", compute_type="int8")
            segments, info = model.transcribe(wav_path, word_timestamps=True)

            for segment in segments:
                seg_text = segment.text.strip()
                full_transcript.append(seg_text)
                
                start_frame = int(round(segment.start * self.fps))
                end_frame = int(round(segment.end * self.fps))
                
                seg_item = {
                    "text": seg_text,
                    "startTime": round(segment.start, 4),
                    "endTime": round(segment.end, 4),
                    "startFrame": start_frame,
                    "endFrame": end_frame
                }
                segments_out.append(seg_item)

                if segment.words:
                    for word in segment.words:
                        w_text = word.word.strip()
                        if not w_text:
                            continue
                        w_start = word.start
                        w_end = word.end
                        w_start_frame = int(round(w_start * self.fps))
                        w_end_frame = int(round(w_end * self.fps))
                        w_prob = round(float(word.probability), 2)

                        words_out.append({
                            "text": w_text,
                            "start": round(w_start, 4),
                            "end": round(w_end, 4),
                            "startFrame": w_start_frame,
                            "endFrame": w_end_frame,
                            "confidence": w_prob
                        })

        except Exception as e:
            print(f"[Notice] Speech recognition (Faster-Whisper) did not find speech or failed: {e}")

        # Clean up temp WAV
        if os.path.exists(wav_path):
            try:
                os.remove(wav_path)
            except Exception:
                pass

        return {
            "transcript": " ".join(full_transcript),
            "segments": segments_out,
            "words": words_out
        }
