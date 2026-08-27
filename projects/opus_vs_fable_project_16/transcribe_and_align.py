import json
import re
import difflib
from pathlib import Path
import sys

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")
sys.path.append(str(ROOT))

from tools.analysis.transcriber import Transcriber

def clean_text(text):
    text = text.lower()
    text = text.replace("hasn't", "has not")
    text = text.replace("it's", "it is")
    text = text.replace("doesn't", "does not")
    text = text.replace("isn't", "is not")
    text = text.replace("don't", "do not")
    text = text.replace("let's", "let us")
    return re.sub(r'[^a-z0-9]', '', text)

def parse_sentences(script_path):
    content = script_path.read_text(encoding="utf-8")
    paragraphs = content.splitlines()
    sentences = []
    for p in paragraphs:
        p = p.strip()
        if not p or p.startswith("["):
            continue
        # Preserve full line as single timestamp unit (do not split on interior periods)
        sentences.append(p)
    return sentences

def format_timestamp(seconds):
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"[{mins:02d}:{secs:02d}]"

def main():
    project_dir = ROOT / "projects" / "opus_vs_fable_project_16"
    audio_path = project_dir / "voiceover.mp3"
    if not audio_path.exists():
        audio_path = project_dir / "voiceover.wav"
    script_path = project_dir / "script_opus_vs_fable.txt"
    transcript_path = project_dir / "project_16_transcript"
    transcript_json_path = project_dir / "voiceover_transcript.json"

    sentences = parse_sentences(script_path)
    print(f"Parsed {len(sentences)} sentences from script.")

    if transcript_json_path.exists():
        print("Using cached transcription JSON...")
        with open(transcript_json_path, "r", encoding="utf-8") as f:
            transcript_data = json.load(f)
    else:
        print("Transcribing audio file...")
        t = Transcriber()
        result = t.execute({
            "input_path": str(audio_path),
            "model_size": "base",
            "output_dir": str(project_dir)
        })
        if not result.success:
            print("Transcription failed:", result.error)
            sys.exit(1)
        transcript_data = result.data
        with open(transcript_json_path, "w", encoding="utf-8") as f:
            json.dump(transcript_data, f, indent=2)
        print("Transcription successful and cached.")

    transcript_words = []
    transcript_word_times = []
    
    for seg in transcript_data.get("segments", []):
        words = seg.get("words", [])
        if not words:
            seg_words = seg.get("text", "").split()
            seg_start = seg.get("start", 0.0)
            seg_end = seg.get("end", 0.0)
            if len(seg_words) > 0:
                duration = seg_end - seg_start
                step = duration / len(seg_words)
                for idx, w in enumerate(seg_words):
                    words.append({
                        "word": w,
                        "start": seg_start + idx * step,
                        "end": seg_start + (idx + 1) * step
                    })
        
        for w in words:
            if "start" in w and "end" in w:
                w_cleaned = clean_text(w["word"])
                if w_cleaned:
                    transcript_words.append(w_cleaned)
                    transcript_word_times.append({
                        "start": w["start"],
                        "end": w["end"],
                        "raw": w["word"]
                    })

    script_words = []
    word_to_sentence = []
    for i, sentence in enumerate(sentences):
        words_in_sent = sentence.split()
        for w in words_in_sent:
            clean_w = clean_text(w)
            if clean_w:
                script_words.append(clean_w)
                word_to_sentence.append(i)

    matcher = difflib.SequenceMatcher(None, script_words, transcript_words)
    matching_blocks = matcher.get_matching_blocks()
    
    script_to_transcript_map = {}
    for block in matching_blocks:
        for offset in range(block.size):
            script_idx = block.a + offset
            transcript_idx = block.b + offset
            script_to_transcript_map[script_idx] = transcript_idx
            
    last_known = 0
    for script_idx in range(len(script_words)):
        if script_idx in script_to_transcript_map:
            last_known = script_to_transcript_map[script_idx]
        else:
            next_s = None
            next_t = None
            for future_idx in range(script_idx + 1, len(script_words)):
                if future_idx in script_to_transcript_map:
                    next_s = future_idx
                    next_t = script_to_transcript_map[future_idx]
                    break
            if next_t is not None:
                gap_s = next_s - (script_idx - 1)
                gap_t = next_t - last_known
                step = gap_t / gap_s
                interpolated = int(last_known + step)
                script_to_transcript_map[script_idx] = min(max(interpolated, 0), len(transcript_words) - 1)
            else:
                script_to_transcript_map[script_idx] = min(last_known + 1, len(transcript_words) - 1)

    sentence_times = {}
    for script_idx, sent_idx in enumerate(word_to_sentence):
        t_idx = script_to_transcript_map[script_idx]
        times = transcript_word_times[t_idx]
        if sent_idx not in sentence_times:
            sentence_times[sent_idx] = []
        sentence_times[sent_idx].append(times)

    aligned_results = []
    for i, sentence in enumerate(sentences):
        times_list = sentence_times.get(i, [])
        if times_list:
            start_time = min(t["start"] for t in times_list)
            end_time = max(t["end"] for t in times_list)
        else:
            start_time = aligned_results[-1]["end_time"] if aligned_results else 0.0
            end_time = start_time + 1.0
            
        aligned_results.append({
            "index": i,
            "sentence": sentence,
            "start_time": start_time,
            "end_time": end_time
        })

    for i in range(len(aligned_results)):
        if i > 0:
            if aligned_results[i]["start_time"] < aligned_results[i-1]["end_time"]:
                aligned_results[i]["start_time"] = aligned_results[i-1]["end_time"]
        if aligned_results[i]["end_time"] <= aligned_results[i]["start_time"]:
            aligned_results[i]["end_time"] = aligned_results[i]["start_time"] + 0.5

    with open(transcript_path, "w", encoding="utf-8") as f:
        for res in aligned_results:
            timestamp = format_timestamp(res["start_time"])
            f.write(f"{timestamp} {res['sentence']}\n")

    print(f"Robust timestamped transcript saved to {transcript_path}")

if __name__ == "__main__":
    main()
