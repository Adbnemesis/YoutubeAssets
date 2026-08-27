import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")

def get_audio_duration(audio_path):
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(audio_path)]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def parse_transcript_lines(transcript_path):
    content = transcript_path.read_text(encoding="utf-8")
    lines = [l.strip() for l in content.splitlines() if l.strip()]
    
    parsed = []
    for line in lines:
        match = re.match(r'^\[(\d{2}):(\d{2})\]\s*(.*)$', line)
        if match:
            mins, secs, text = match.groups()
            start_sec = int(mins) * 60 + int(secs)
            parsed.append({
                "start_sec": float(start_sec),
                "text": text
            })
    return parsed

def main():
    project_dir = ROOT / "projects" / "opus_vs_fable_project_16"
    audio_path = project_dir / "voiceover.mp3"
    transcript_path = project_dir / "project_16_transcript"
    images_dir = project_dir / "images"
    
    audio_dur = get_audio_duration(audio_path)
    parsed_lines = parse_transcript_lines(transcript_path)
    
    print(f"Loaded {len(parsed_lines)} transcript entries. Audio duration: {audio_dur:.2f}s")
    
    # Get image files sorted
    image_files = sorted([f for f in os.listdir(images_dir) if f.endswith(".jpg") or f.endswith(".png")])
    print(f"Found {len(image_files)} image files.")
    
    cuts = []
    captions = []
    
    for i, item in enumerate(parsed_lines):
        st = item["start_sec"]
        if i < len(parsed_lines) - 1:
            et = parsed_lines[i + 1]["start_sec"]
        else:
            et = audio_dur
            
        if et <= st:
            et = st + 1.5
            
        line_text = item["text"]
        matched_image = image_files[i] if i < len(image_files) else ""
        source_path = f"projects/opus_vs_fable_project_16/images/{matched_image}" if matched_image else ""
        
        # Determine camera animation based on index
        if i % 5 == 0:
            anim = "slow-zoom-in"
        elif i % 5 == 1:
            anim = "character-close-up"
        elif i % 5 == 2:
            anim = "push-wb"
        elif i % 5 == 3:
            anim = "diagram-close-up"
        else:
            anim = "slow-zoom-out"
            
        cut_data = {
            "id": f"scene_{i}",
            "text": line_text,
            "in_seconds": round(st, 3),
            "out_seconds": round(et, 3),
            "source": source_path,
            "animation": anim
        }
        cuts.append(cut_data)
        
        # Word-level caption generation for animated subtitles
        words = line_text.split()
        if words:
            duration = et - st
            step = duration / len(words)
            for w_idx, w in enumerate(words):
                w_start_ms = int((st + w_idx * step) * 1000)
                w_end_ms = int((st + (w_idx + 1) * step) * 1000)
                captions.append({
                    "word": w,
                    "startMs": w_start_ms,
                    "endMs": w_end_ms
                })

    overlays = [
        {
            "type": "hero_title",
            "text": "OPUS 5 vs FABLE 5",
            "subtitle": "Anthropic Model Battle",
            "in_seconds": cuts[0]["in_seconds"],
            "out_seconds": cuts[0]["out_seconds"]
        },
        {
            "type": "section_title",
            "text": "OPTION 1: GORILLA FABLE 5",
            "subtitle": "Multi-Day Deep Reasoning",
            "in_seconds": cuts[3]["in_seconds"],
            "out_seconds": cuts[3]["out_seconds"]
        },
        {
            "type": "section_title",
            "text": "OPTION 2: CHIMP OPUS 5",
            "subtitle": "Daily Software Engineer",
            "in_seconds": cuts[24]["in_seconds"],
            "out_seconds": cuts[24]["out_seconds"]
        },
        {
            "type": "section_title",
            "text": "SECRET DISCOUNTS",
            "subtitle": "Adaptive Thinking & Caching",
            "in_seconds": cuts[52]["in_seconds"],
            "out_seconds": cuts[52]["out_seconds"]
        },
        {
            "type": "section_title",
            "text": "SAVE YOUR BANANAS",
            "subtitle": "Subscribe For More Breakdowns",
            "in_seconds": cuts[-1]["in_seconds"],
            "out_seconds": cuts[-1]["out_seconds"]
        }
    ]

    props = {
        "theme": "flat-motion-graphics",
        "themeConfig": {
            "backgroundColor": "#FFFFFF",
            "primaryColor": "#F5820D",
            "accentColor": "#2D5FBF",
            "surfaceColor": "#F9FAFB",
            "textColor": "#000000",
            "captionHighlightColor": "#F5820D",
            "captionBackgroundColor": "rgba(255, 255, 255, 0.85)"
        },
        "cuts": cuts,
        "overlays": overlays,
        "captions": captions,
        "audio": {
            "narration": {
                "src": "projects/opus_vs_fable_project_16/voiceover.mp3",
                "volume": 1.0
            },
            "music": {
                "src": "projects/common_assets/bgm/monkeys_spinning_monkeys.mp3",
                "volume": 0.22,
                "loop": True,
                "fadeInSeconds": 2.0,
                "fadeOutSeconds": 3.0
            }
        }
    }

    props_path = project_dir / "proposed_props.json"
    with open(props_path, "w", encoding="utf-8") as f:
        json.dump(props, f, indent=2)
        
    print(f"✅ Generated proposed_props.json with {len(cuts)} scenes and {len(captions)} caption words.")

if __name__ == "__main__":
    main()
