import json
import os
import re
from pathlib import Path

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")

def clean_word(w):
    return "".join(c for c in w.lower() if c.isalnum())

def main():
    script_path = ROOT / "projects" / "dartmouth_summer_project_7" / "script_dartmouth_summer_ai.txt"
    transcript_path = ROOT / "projects" / "dartmouth_summer_project_7" / "voiceover_transcript.json"
    images_dir = ROOT / "projects" / "dartmouth_summer_project_7" / "images"
    
    # 1. Read script sentences
    with open(script_path, "r", encoding="utf-8") as f:
        sentences = [line.strip() for line in f if line.strip()]
        
    # 2. Read Whisper transcript
    with open(transcript_path, "r", encoding="utf-8") as f:
        transcript_data = json.load(f)
        
    # Build tx_words from segments words
    tx_words = []
    for seg in transcript_data.get("segments", []):
        for w in seg.get("words", []):
            if "start" in w and "end" in w:
                tx_words.append({
                    "word": w["word"],
                    "start": w["start"],
                    "end": w["end"]
                })
                
    total_audio_duration = tx_words[-1]["end"] if tx_words else 0.0
            
    # 3. Align sentences to word timestamps using the robust self-correcting loop
    raw_cuts = []
    tx_ptr = 0
    
    for i, sentence in enumerate(sentences):
        line_words = [clean_word(w) for w in sentence.split() if clean_word(w)]
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
            # Fallback: if not found, use current pointer time
            if tx_ptr < len(tx_words):
                start_time = tx_words[tx_ptr]["start"]
            elif len(tx_words) > 0:
                start_time = tx_words[-1]["end"]
            else:
                start_time = 0.0
                
        # Estimate end time of this segment
        end_time = start_time + len(line_words) * 0.3
        
        raw_cuts.append({
            "index": i,
            "sentence": sentence,
            "start_time": start_time,
            "end_time": end_time
        })

    # 4. Make cuts contiguous
    cuts = []
    animations = ["zoom-in", "zoom-out", "ken-burns", "parallax", "pan-left", "pan-right"]
    anim_idx = 0
    
    image_files = os.listdir(images_dir)
    parsed_images = []
    for f in image_files:
        match = re.match(r'^\[(\d{2})-(\d{2})\]', f)
        if match:
            m = int(match.group(1))
            s = int(match.group(2))
            total_seconds = m * 60 + s
            parsed_images.append((total_seconds, f))
            
    def get_closest_image(target_seconds):
        if not parsed_images:
            return None
        closest = min(parsed_images, key=lambda x: abs(x[0] - target_seconds))
        return closest[1]

    # SFX Mapping: (0-based index of raw_cuts) -> (sfx_src, volume)
    sfx_mapping = {
        1: ("projects/common_assets/sfx/click-soft.mp3", 0.35),       # "They write code..."
        5: ("projects/common_assets/sfx/whoosh-short.mp3", 0.4),     # "The year was nineteen fifty-six."
        9: ("projects/common_assets/sfx/impact-bass-1.mp3", 0.4),    # "Do you want to see..."
        13: ("projects/common_assets/sfx/chime.mp3", 0.4),            # "He wrote a proposal..."
        16: ("projects/common_assets/sfx/impact-bass-2.mp3", 0.45),   # "Those words were artificial intelligence."
        17: ("projects/common_assets/sfx/whoosh-short.mp3", 0.4),     # "It was a clever marketing..."
        18: ("projects/common_assets/sfx/glitch-1.mp3", 0.35),        # "Many of his colleagues..."
        23: ("projects/common_assets/sfx/riser.mp3", 0.35),           # "They believed they could solve..."
        31: ("projects/common_assets/sfx/whoosh-cinematic.mp3", 0.4), # "We spent millions..."
        32: ("projects/common_assets/sfx/error.mp3", 0.35),           # "Computers could solve... recognize a cat."
        37: ("projects/common_assets/sfx/ping.mp3", 0.4),            # "Simon told his students..."
        39: ("projects/common_assets/sfx/cash-register.mp3", 0.4),    # "Funding flowed..."
        42: ("projects/common_assets/sfx/glitch-1.mp3", 0.35),        # "But by the late... cracks began to show."
        46: ("projects/common_assets/sfx/anime-wow.mp3", 0.4),        # "Translation software famously... vodka is good."
        49: ("projects/common_assets/sfx/error.mp3", 0.35),           # "The government cut off..."
        51: ("projects/common_assets/sfx/impact-bass-1.mp3", 0.4),    # "Their overconfidence... AI Winter"
        57: ("projects/common_assets/sfx/notification.mp3", 0.35),    # "The neural networks on your phone..."
        61: ("projects/common_assets/sfx/sparkle.mp3", 0.45)          # "You will participate..."
    }

    num_cuts = len(raw_cuts)
    for idx, rc in enumerate(raw_cuts):
        in_sec = rc["start_time"]
        if idx == 0:
            in_sec = 0.0
            
        # out_sec is the start of next cut, or total duration for the final cut
        if idx < num_cuts - 1:
            out_sec = raw_cuts[idx+1]["start_time"]
        else:
            out_sec = max(rc["end_time"], total_audio_duration)
            
        # Safety checks to ensure non-decreasing and valid durations
        if idx > 0 and in_sec < cuts[-1]["out_seconds"]:
            in_sec = cuts[-1]["out_seconds"]
            
        if out_sec <= in_sec:
            out_sec = in_sec + 0.1
            
        # Get matching image
        matched_image_file = get_closest_image(in_sec)
        source_path = f"projects/dartmouth_summer_project_7/images/{matched_image_file}" if matched_image_file else ""
        
        # Enforce rule: Apply animations ONLY if duration is >= 4.0 seconds
        duration = out_sec - in_sec
        if duration >= 4.0:
            anim = animations[anim_idx % len(animations)]
            anim_idx += 1
        else:
            anim = "none"
            
        cut_data = {
            "id": f"scene_{rc['index']}",
            "source": source_path,
            "in_seconds": round(in_sec, 3),
            "out_seconds": round(out_sec, 3),
            "animation": anim,
            "text": rc["sentence"]
        }
        
        # Add SFX if defined for this scene
        if rc["index"] in sfx_mapping:
            sfx_src, sfx_vol = sfx_mapping[rc["index"]]
            cut_data["sfx"] = {
                "src": sfx_src,
                "volume": sfx_vol
            }
            
        cuts.append(cut_data)
        
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
                "src": "projects/dartmouth_summer_project_7/voiceover.wav",
                "volume": 1.0
            }
        }
    }
    
    # Save props JSON
    output_props_path = ROOT / "projects" / "dartmouth_summer_project_7" / "project_7_props.json"
    with open(output_props_path, "w", encoding="utf-8") as f:
        json.dump(props, f, indent=2)
        
    print(f"Props JSON successfully written to {output_props_path}")
    print(f"Total cuts created: {len(cuts)}")
    print(f"Cuts with animation (duration >= 4s): {len([c for c in cuts if c['animation'] != 'none'])}")
    print(f"Cuts with sound effects: {len([c for c in cuts if 'sfx' in c])}")

if __name__ == "__main__":
    main()
