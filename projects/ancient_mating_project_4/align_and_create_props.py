import json
import os
import re
from pathlib import Path

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")

def clean_text(text):
    # Lowercase and keep only alphanumeric chars
    return re.sub(r'[^a-z0-9]', '', text.lower())

def main():
    script_path = ROOT / "projects" / "ancient_mating_project_4" / "script_how_ancient_humans_chose_mates.txt"
    transcript_path = ROOT / "projects" / "ancient_mating_project_4" / "voiceover_transcript.json"
    images_dir = ROOT / "projects" / "ancient_mating_project_4" / "images"
    
    # 1. Read script sentences
    with open(script_path, "r", encoding="utf-8") as f:
        sentences = [line.strip() for line in f if line.strip()]
        
    # 2. Read Whisper transcript
    with open(transcript_path, "r", encoding="utf-8") as f:
        transcript_data = json.load(f)
        
    # Flatten words from segments
    flat_words = []
    for seg in transcript_data.get("segments", []):
        for w in seg.get("words", []):
            if "start" in w and "end" in w:
                flat_words.append({
                    "word": clean_text(w["word"]),
                    "start": w["start"],
                    "end": w["end"]
                })
                
    # 3. Align sentences to word timestamps
    # Since we have the flat word timestamps, let's match sentences one by one sequentially
    cuts = []
    word_idx = 0
    num_flat_words = len(flat_words)
    
    # Animations list to cycle through for long scenes
    animations = ["zoom-in", "zoom-out", "ken-burns", "parallax", "pan-left", "pan-right"]
    anim_idx = 0
    
    image_files = os.listdir(images_dir)
    
    for i, sentence in enumerate(sentences):
        sentence_words = [clean_text(w) for w in sentence.split() if clean_text(w)]
        if not sentence_words:
            continue
            
        # Find start and end times by matching words
        start_time = None
        end_time = None
        
        # Look for the first word in the sentence
        first_word = sentence_words[0]
        # Match sequentially
        matched_words = []
        
        # We search from the current word_idx onward
        temp_idx = word_idx
        best_match_start = None
        
        # Match as many words as possible from sentence_words
        s_w_idx = 0
        while temp_idx < num_flat_words and s_w_idx < len(sentence_words):
            target = sentence_words[s_w_idx]
            # If it matches, or is very close
            if flat_words[temp_idx]["word"] == target or target in flat_words[temp_idx]["word"] or flat_words[temp_idx]["word"] in target:
                if start_time is None:
                    start_time = flat_words[temp_idx]["start"]
                end_time = flat_words[temp_idx]["end"]
                s_w_idx += 1
                word_idx = temp_idx + 1 # advance global index
            temp_idx += 1
            
        # Fallback if matching failed to find start/end
        if start_time is None:
            # use current global word_idx's start or previous cut's end
            if word_idx < num_flat_words:
                start_time = flat_words[word_idx]["start"]
            elif cuts:
                start_time = cuts[-1]["out_seconds"]
            else:
                start_time = 0.0
                
        if end_time is None:
            # estimate based on word count (approx 0.3s per word)
            end_time = start_time + len(sentence_words) * 0.3
            
        # Ensure times are logical
        if cuts and start_time < cuts[-1]["out_seconds"]:
            # avoid overlapping in_seconds
            start_time = cuts[-1]["out_seconds"]
        if end_time <= start_time:
            end_time = start_time + 1.0
            
        # Get matching image source path
        # Convert timestamp to MM-SS format based on start_time
        mins = int(start_time // 60)
        secs = int(start_time % 60)
        img_prefix = f"[{mins:02d}-{secs:02d}]"
        
        # In case the alignment starts slightly off, let's also find the closest matching image
        matched_image_file = None
        # Try exact match first
        for f in image_files:
            if f.startswith(img_prefix):
                matched_image_file = f
                break
        
        # If no exact match (due to small time shifts in alignment), find the closest one
        if not matched_image_file:
            # Try matching within 2 seconds
            for offset in [-1, 1, -2, 2]:
                check_time = start_time + offset
                if check_time >= 0:
                    check_mins = int(check_time // 60)
                    check_secs = int(check_time % 60)
                    check_prefix = f"[{check_mins:02d}-{check_secs:02d}]"
                    for f in image_files:
                        if f.startswith(check_prefix):
                            matched_image_file = f
                            break
                if matched_image_file:
                    break
                    
        # Final fallback — if still not matched, print warning and use a dummy or the index match
        if not matched_image_file:
            print(f"Warning: No image found matching timestamp {img_prefix} for sentence {i}: {sentence[:30]}...")
            # Just grab any file that starts with this index if there's a strict ordering
            # (or we'll fix it manually if needed)
            
        source_path = f"projects/ancient_mating_project_4/images/{matched_image_file}" if matched_image_file else ""
        
        # Determine animation: only if duration is >= 4.0 seconds
        duration = end_time - start_time
        if duration >= 4.0:
            anim = animations[anim_idx % len(animations)]
            anim_idx += 1
        else:
            anim = "none"
            
        cuts.append({
            "id": f"scene_{i}",
            "source": source_path,
            "in_seconds": round(start_time, 3),
            "out_seconds": round(end_time, 3),
            "animation": anim,
            "text": sentence
        })
        
    # Build full props structure
    props = {
        "theme": "flat-motion-graphics",
        "themeConfig": {
            "backgroundColor": "#0F172A",
            "primaryColor": "#7C3AED",
            "accentColor": "#EC4899",
            "surfaceColor": "#1E293B",
            "textColor": "#F8FAFC",
            "captionHighlightColor": "#22D3EE",
            "captionBackgroundColor": "rgba(15, 23, 42, 0.75)",
            "chartColors": [
                "#7C3AED",
                "#EC4899",
                "#06B6D4",
                "#F59E0B",
                "#10B981",
                "#EF4444"
            ]
        },
        "cuts": cuts,
        "captions": [],
        "audio": {
            "narration": {
                "src": "projects/ancient_mating_project_4/voiceover.wav",
                "volume": 1.0
            }
        }
    }
    
    # Save props JSON
    output_props_path = ROOT / "projects" / "ancient_mating_project_4" / "project_4_props.json"
    with open(output_props_path, "w", encoding="utf-8") as f:
        json.dump(props, f, indent=2)
        
    print(f"Props JSON successfully written to {output_props_path}")
    print(f"Total cuts created: {len(cuts)}")
    print(f"Cuts with animation: {len([c for c in cuts if c['animation'] != 'none'])}")

if __name__ == "__main__":
    main()
