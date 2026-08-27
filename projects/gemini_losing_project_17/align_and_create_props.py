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

def select_sfx(text, index):
    t = text.lower()
    if "cry" in t or "lose" in t or "hallucinate" in t:
        return "projects/common_assets/sfx/bruh.mp3"
    elif "reason" in t or "breakdown" in t or "science" in t:
        return "projects/common_assets/sfx/riser.mp3"
    elif "expert" in t or "desk" in t or "code" in t:
        return "projects/common_assets/sfx/click.mp3"
    elif "claude" in t or "best" in t or "clean" in t or "working" in t:
        return "projects/common_assets/sfx/chime.mp3"
    elif "furious" in t or "fail" in t or "todo" in t:
        return "projects/common_assets/sfx/fahhh.mp3"
    elif "subscribe" in t or "banana" in t:
        return "projects/common_assets/sfx/pop.mp3"
    elif index % 3 == 0:
        return "projects/common_assets/sfx/whoosh.mp3"
    elif index % 5 == 0:
        return "projects/common_assets/sfx/ping.mp3"
    return None

def select_animation(text, index):
    t = text.lower()
    if "breakdown" in t or "cry" in t or "lose" in t:
        return "ken-burns"
    elif "reason" in t or "science" in t:
        return "zoom-in"
    elif "claude" in t or "gemini" in t:
        return "pan-left" if index % 2 == 0 else "pan-right"
    elif "desk" in t or "code" in t:
        return "parallax"
    elif index % 4 == 0:
        return "zoom-in"
    elif index % 4 == 1:
        return "pan-right"
    elif index % 4 == 2:
        return "zoom-out"
    else:
        return "pan-left"

def main():
    project_dir = ROOT / "projects" / "gemini_losing_project_17"
    transcript_path = project_dir / "project_17_transcript"
    audio_path = project_dir / "voiceover.mp3"
    images_dir = project_dir / "images"
    
    audio_dur = get_audio_duration(audio_path)
    parsed_lines = parse_transcript_lines(transcript_path)
    
    print(f"Loaded {len(parsed_lines)} transcript entries. Audio duration: {audio_dur:.2f}s")
    
    image_files = sorted([f for f in os.listdir(images_dir) if f.endswith(".jpg") or f.endswith(".png")])
    print(f"Found {len(image_files)} image files.")
    
    cuts = []
    
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
        source_path = f"projects/gemini_losing_project_17/images/{matched_image}" if matched_image else ""
        
        anim = select_animation(line_text, i)
        sfx_path = select_sfx(line_text, i)
        
        cut_data = {
            "id": f"scene_{i}",
            "text": line_text,
            "in_seconds": round(st, 3),
            "out_seconds": round(et, 3),
            "source": source_path,
            "animation": anim
        }
        if sfx_path:
            cut_data["sfx"] = {
                "src": sfx_path,
                "volume": 0.45,
                "startOffsetSeconds": 0.0
            }
            
        cuts.append(cut_data)

    overlays = [
        {
            "type": "hero_title",
            "text": "WHY GEMINI KEEPS LOSING",
            "subtitle": "MoE Routing & Alignment Breakdown",
            "in_seconds": cuts[0]["in_seconds"],
            "out_seconds": cuts[0]["out_seconds"]
        },
        {
            "type": "section_title",
            "text": "REASON 1: MoE ROUTING",
            "subtitle": "Expert Routing Breakdown",
            "in_seconds": cuts[12]["in_seconds"],
            "out_seconds": cuts[12]["out_seconds"]
        },
        {
            "type": "section_title",
            "text": "REASON 2: ALIGNMENT & REWARDS",
            "subtitle": "RLHF vs Constitutional AI",
            "in_seconds": cuts[28]["in_seconds"],
            "out_seconds": cuts[28]["out_seconds"]
        },
        {
            "type": "section_title",
            "text": "REASON 3: NEEDLE IN A HAYSTACK",
            "subtitle": "Context Window vs Attention Retrieval",
            "in_seconds": cuts[40]["in_seconds"],
            "out_seconds": cuts[40]["out_seconds"]
        },
        {
            "type": "section_title",
            "text": "REASON 4: BENCHMARK OVERFITTING",
            "subtitle": "Paper Scores vs Real World Coding",
            "in_seconds": cuts[50]["in_seconds"],
            "out_seconds": cuts[50]["out_seconds"]
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
        "captions": [],
        "audio": {
            "narration": {
                "src": "projects/gemini_losing_project_17/voiceover.mp3",
                "volume": 1.0
            },
            "music": {
                "src": "projects/common_assets/bgm/monkeys_spinning_monkeys.mp3",
                "volume": 0.25,
                "loop": True,
                "fadeInSeconds": 1.5,
                "fadeOutSeconds": 3.0
            }
        }
    }

    props_path = project_dir / "proposed_props.json"
    with open(props_path, "w", encoding="utf-8") as f:
        json.dump(props, f, indent=2)
        
    print(f"✅ Generated proposed_props.json with {len(cuts)} dynamic scenes and custom sound effects.")

if __name__ == "__main__":
    main()
