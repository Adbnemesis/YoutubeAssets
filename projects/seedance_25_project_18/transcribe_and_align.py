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
        if not p:
            continue
        p_text = re.sub(r'^\[\w+\]\s*', '', p)
        if not p_text:
            continue
        sentences.append(p_text)
    return sentences

def format_timestamp(seconds):
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"[{mins:02d}:{secs:02d}]"

def main():
    project_dir = ROOT / "projects" / "seedance_25_project_18"
    audio_path = project_dir / "voiceover.mp3"
    if not audio_path.exists():
        audio_path = project_dir / "voiceover.wav"
    script_path = project_dir / "script_seedance_25.txt"
    transcript_path = project_dir / "project_18_transcript"
    transcript_json_path = project_dir / "voiceover_transcript.json"

    sentences = parse_sentences(script_path)
    print(f"Parsed {len(sentences)} sentences from script.")

    if transcript_json_path.exists():
        print("Using cached transcription JSON...")
        with open(transcript_json_path, "r", encoding="utf-8") as f:
            transcript_data = json.load(f)
    else:
        print("Transcribing audio file with whisper...")
        import whisper
        model = whisper.load_model("base")
        transcript_data = model.transcribe(str(audio_path), word_timestamps=True)
        with open(transcript_json_path, "w", encoding="utf-8") as f:
            json.dump(transcript_data, f, indent=2)

    words = transcript_data.get("words", [])
    if not words and "segments" in transcript_data:
        words = []
        for seg in transcript_data["segments"]:
            if "words" in seg:
                words.extend(seg["words"])

    print(f"Loaded {len(words)} word timestamps.")

    word_idx = 0
    aligned_lines = []
    
    for s_idx, sentence in enumerate(sentences):
        target_words = sentence.split()
        if not target_words:
            continue
            
        clean_target = [clean_text(w) for w in target_words if clean_text(w)]
        if not clean_target:
            continue

        best_match_idx = word_idx
        found_start_time = None

        if word_idx < len(words):
            first_target = clean_target[0]
            for search_idx in range(word_idx, min(word_idx + 15, len(words))):
                cand_clean = clean_text(words[search_idx]["word"])
                if cand_clean == first_target or difflib.SequenceMatcher(None, cand_clean, first_target).ratio() > 0.8:
                    found_start_time = words[search_idx]["start"]
                    best_match_idx = search_idx
                    break
            
            if found_start_time is None:
                found_start_time = words[word_idx]["start"]
                best_match_idx = word_idx
        else:
            found_start_time = words[-1]["end"] if words else 0.0

        timestamp_str = format_timestamp(found_start_time)
        aligned_lines.append(f"{timestamp_str} {sentence}")

        consumed = 0
        search_pos = best_match_idx
        for tw in clean_target:
            while search_pos < len(words):
                cw = clean_text(words[search_pos]["word"])
                search_pos += 1
                if cw == tw or (cw and tw and difflib.SequenceMatcher(None, cw, tw).ratio() > 0.7):
                    consumed += 1
                    break
        
        word_idx = max(word_idx + 1, best_match_idx + max(1, consumed))

    formatted_transcript = "\n".join(aligned_lines)
    transcript_path.write_text(formatted_transcript, encoding="utf-8")
    print(f"✅ Successfully written timestamped transcript to {transcript_path}")
    print("\nTranscript Preview:")
    print(formatted_transcript[:500])

if __name__ == "__main__":
    main()
