import json
from pathlib import Path
import sys

# Ensure OpenMontage root is in python path
ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")
sys.path.append(str(ROOT))

from tools.analysis.transcriber import Transcriber

def clean_word(w):
    return "".join(c for c in w.lower() if c.isalnum())

def format_timestamp(seconds):
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"[{mins:02d}:{secs:02d}]"

def main():
    project_dir = ROOT / "projects" / "dartmouth_summer_project_7"
    audio_path = project_dir / "voiceover.wav"
    script_path = project_dir / "script_dartmouth_summer_ai.txt"
    transcript_path = project_dir / "project_7_transcript"
    
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
        
    print("Transcription successful.")
    
    # Load transcribing output data
    data = result.data
    tx_words = data.get("word_timestamps", [])
    if not tx_words:
        # Fallback to segment starts if word timestamps are missing
        print("Word timestamps not found, using segments...")
        tx_segments = data.get("segments", [])
        for seg in tx_segments:
            seg_words = seg.get("text", "").split()
            seg_start = seg.get("start", 0.0)
            seg_end = seg.get("end", 0.0)
            # Estimate word start times linearly
            if len(seg_words) > 0:
                duration = seg_end - seg_start
                step = duration / len(seg_words)
                for idx, w in enumerate(seg_words):
                    tx_words.append({
                        "word": w,
                        "start": seg_start + idx * step,
                        "end": seg_start + (idx + 1) * step
                    })
                    
    # Read the script lines
    script_lines = [line.strip() for line in script_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    
    aligned_lines = []
    tx_ptr = 0
    
    for line in script_lines:
        line_words = [clean_word(w) for w in line.split() if clean_word(w)]
        if not line_words:
            continue
            
        # Try to find a match in tx_words starting from tx_ptr
        match_idx = -1
        first_word = line_words[0]
        
        # Scan forward for a match of the first word
        for idx in range(tx_ptr, len(tx_words)):
            tx_clean = clean_word(tx_words[idx]["word"])
            if tx_clean == first_word:
                # Verify if subsequent words also match to be sure it's a good alignment
                sub_match = True
                check_len = min(len(line_words), 3) # check up to 3 words
                for offset in range(1, check_len):
                    if idx + offset >= len(tx_words):
                        sub_match = False
                        break
                    if clean_word(tx_words[idx + offset]["word"]) != line_words[offset]:
                        sub_match = False
                        break
                if sub_match:
                    match_idx = idx
                    break
        
        if match_idx != -1:
            start_time = tx_words[match_idx]["start"]
            tx_ptr = match_idx + len(line_words)
        else:
            # Fallback: if not found, use current pointer time or 0.0
            if tx_ptr < len(tx_words):
                start_time = tx_words[tx_ptr]["start"]
            elif len(tx_words) > 0:
                start_time = tx_words[-1]["end"]
            else:
                start_time = 0.0
                
        timestamp = format_timestamp(start_time)
        aligned_lines.append(f"{timestamp} {line}")
        
    # Save the aligned transcript
    with open(transcript_path, "w", encoding="utf-8") as f:
        for line in aligned_lines:
            f.write(line + "\n")
            
    print(f"Timestamped transcript saved to {transcript_path}")

if __name__ == "__main__":
    main()
