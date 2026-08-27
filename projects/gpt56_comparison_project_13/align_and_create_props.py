import json
import os
import re
import difflib
from pathlib import Path

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")

def clean_text(text):
    text = text.lower()
    text = text.replace("hasn't", "has not")
    text = text.replace("it's", "it is")
    text = text.replace("doesn't", "does not")
    text = text.replace("isn't", "is not")
    text = text.replace("don't", "do not")
    text = text.replace("let's", "let us")
    text = text.replace("gpt-5.6", "gpt five point six")
    text = text.replace("gpt 5.6", "gpt five point six")
    text = text.replace("gpt5.6", "gpt five point six")
    return re.sub(r'[^a-z0-9]', '', text)

def parse_sentences(script_path):
    with open(script_path, "r", encoding="utf-8") as f:
        content = f.read()
    paragraphs = content.splitlines()
    sentences = []
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        sents = re.split(r'(?<=[.!?])\s+', p)
        for s in sents:
            if s.strip():
                sentences.append(s.strip())
    return sentences

def main():
    project_dir = ROOT / "projects" / "gpt56_comparison_project_13"
    script_path = project_dir / "script_gpt56_comparison.txt"
    transcript_json = project_dir / "voiceover_transcript.json"
    images_dir = project_dir / "images"
    
    # 1. Parse sentences
    sentences = parse_sentences(script_path)
    print(f"Parsed {len(sentences)} sentences from script.")
    
    # 2. Read Whisper transcript
    with open(transcript_json, "r", encoding="utf-8") as f:
        transcript_data = json.load(f)
        
    transcript_words = []
    transcript_word_times = []
    captions = []
    
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
                captions.append({
                    "word": w["word"].strip(),
                    "startMs": int(w["start"] * 1000),
                    "endMs": int(w["end"] * 1000)
                })
                
    # 3. Flatten script words
    script_words = []
    word_to_sentence = []
    for i, sentence in enumerate(sentences):
        words_in_sent = sentence.split()
        for w in words_in_sent:
            clean_w = clean_text(w)
            if clean_w:
                script_words.append(clean_w)
                word_to_sentence.append(i)
                
    # 4. LCS Match
    matcher = difflib.SequenceMatcher(None, script_words, transcript_words)
    matching_blocks = matcher.get_matching_blocks()
    
    script_to_transcript_map = {}
    for block in matching_blocks:
        for offset in range(block.size):
            script_idx = block.a + offset
            transcript_idx = block.b + offset
            script_to_transcript_map[script_idx] = transcript_idx
            
    # Interpolate missing mappings
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
                
    # 5. Extract start and end times for each sentence
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
        
    # Ensure strictly non-overlapping and chronological
    for i in range(len(aligned_results)):
        if i > 0:
            if aligned_results[i]["start_time"] < aligned_results[i-1]["end_time"]:
                aligned_results[i]["start_time"] = aligned_results[i-1]["end_time"]
        if aligned_results[i]["end_time"] <= aligned_results[i]["start_time"]:
            aligned_results[i]["end_time"] = aligned_results[i]["start_time"] + 0.5

    # =========================================================================
    # SFX MAPPING
    # =========================================================================
    sfx_mapping = {
        0:  ("projects/common_assets/sfx/whoosh.mp3", 0.5),       # Intro whoosh
        3:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # Three helpers pop
        4:  ("projects/common_assets/sfx/notification.mp3", 0.4), # Shared memory size
        5:  ("projects/common_assets/sfx/whoosh.mp3", 0.4),       # Meet Luna
        6:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # Chimpanzee on skateboard
        7:  ("projects/common_assets/sfx/chime.mp3", 0.4),        # Works for pennies
        9:  ("projects/common_assets/sfx/error.mp3", 0.5),        # Coding puzzle fail
        10: ("projects/common_assets/sfx/error.mp3", 0.5),        # Drop the ball
        11: ("projects/common_assets/sfx/whoosh.mp3", 0.4),       # Meet Terra
        12: ("projects/common_assets/sfx/pop.mp3", 0.4),          # Reliable assistant
        14: ("projects/common_assets/sfx/chime.mp3", 0.4),        # Solid reasoning middle ground
        15: ("projects/common_assets/sfx/whoosh.mp3", 0.4),       # Meet Sol
        16: ("projects/common_assets/sfx/chime.mp3", 0.5),        # Throne of books
        17: ("projects/common_assets/sfx/pop.mp3", 0.4),          # Expensive/Slow pop
        18: ("projects/common_assets/sfx/notification.mp3", 0.4), # Audit code/database
        19: ("projects/common_assets/sfx/riser.mp3", 0.4),        # Why not use Sol riser
        20: ("projects/common_assets/sfx/error.mp3", 0.5),        # Run out of bananas
        21: ("projects/common_assets/sfx/pop.mp3", 0.4),          # Why not use Luna
        22: ("projects/common_assets/sfx/error.mp3", 0.5),        # Not smart enough
        23: ("projects/common_assets/sfx/chime.mp3", 0.4),        # Match the job
        24: ("projects/common_assets/sfx/notification.mp3", 0.4), # What are you building
        25: ("projects/common_assets/sfx/pop.mp3", 0.4),          # Pick helper/Save bananas
        26: ("projects/common_assets/sfx/ping.mp3", 0.5)          # Subscribe chime
    }

    # =========================================================================
    # ANIMATION MAPPING
    # =========================================================================
    animation_mapping = {
        0:  "zoom-in",
        1:  "pan-left",
        3:  "zoom-out",
        5:  "zoom-in",
        6:  "pan-right",
        8:  "zoom-out",
        11: "zoom-in",
        13: "pan-left",
        15: "zoom-in",
        16: "ken-burns",
        18: "zoom-in",
        23: "zoom-out",
        24: "pan-right",
        25: "zoom-in"
    }

    # =========================================================================
    # OVERLAYS
    # =========================================================================
    overlays = [
        # OVL_01: Hero Title
        {
            "type": "hero_title",
            "in_seconds": aligned_results[0]["start_time"],
            "out_seconds": aligned_results[0]["end_time"],
            "text": "GPT-5.6: SOL, TERRA, LUNA",
            "subtitle": "OpenAI's New Tier Family",
            "accentColor": "#F5820D",
            "position": "center"
        },
        # OVL_02: Three Tiers
        {
            "type": "section_title",
            "in_seconds": aligned_results[3]["start_time"],
            "out_seconds": aligned_results[3]["end_time"],
            "text": "GPT-5.6 FAMILY",
            "subtitle": "Three Tiers",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_03: Shared memory
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[4]["start_time"],
            "out_seconds": aligned_results[4]["end_time"],
            "text": "1M Context",
            "subtitle": "Shared Memory Window",
            "accentColor": "#2D5FBF",
            "position": "bottom-right"
        },
        # OVL_04: Luna Racer
        {
            "type": "section_title",
            "in_seconds": aligned_results[5]["start_time"],
            "out_seconds": aligned_results[5]["end_time"],
            "text": "MEET LUNA",
            "subtitle": "The Speed Racer",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_05: Lowest Cost
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[7]["start_time"],
            "out_seconds": aligned_results[7]["end_time"],
            "text": "Lowest Cost",
            "subtitle": "90% Cheaper than Sol",
            "accentColor": "#10B981",
            "position": "bottom-right"
        },
        # OVL_06: Meet Terra
        {
            "type": "section_title",
            "in_seconds": aligned_results[11]["start_time"],
            "out_seconds": aligned_results[11]["end_time"],
            "text": "MEET TERRA",
            "subtitle": "The Balanced Worker",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_07: Balanced stat
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[14]["start_time"],
            "out_seconds": aligned_results[14]["end_time"],
            "text": "Balanced",
            "subtitle": "Medium Cost & Brainpower",
            "accentColor": "#2D5FBF",
            "position": "bottom-right"
        },
        # OVL_08: Meet Sol
        {
            "type": "section_title",
            "in_seconds": aligned_results[15]["start_time"],
            "out_seconds": aligned_results[15]["end_time"],
            "text": "MEET SOL",
            "subtitle": "The Grand Chieftain",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_09: Sol flagship
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[17]["start_time"],
            "out_seconds": aligned_results[17]["end_time"],
            "text": "Highest Reasoning",
            "subtitle": "Flagship Model",
            "accentColor": "#EC4899",
            "position": "bottom-right"
        },
        # OVL_10: Match Tier
        {
            "type": "section_title",
            "in_seconds": aligned_results[23]["start_time"],
            "out_seconds": aligned_results[23]["end_time"],
            "text": "MATCH TIER",
            "subtitle": "Maximize Banana Value",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_11: Subscribe
        {
            "type": "hero_title",
            "in_seconds": aligned_results[26]["start_time"],
            "out_seconds": aligned_results[26]["end_time"],
            "text": "SUBSCRIBE",
            "subtitle": "For More Simple Tech Breakdowns",
            "accentColor": "#F5820D",
            "position": "center"
        },
        
        # --- STICKERS ---
        # Scene 6: Skateboard coin
        {
            "type": "sticker",
            "in_seconds": aligned_results[6]["start_time"],
            "out_seconds": aligned_results[6]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/gold_coin.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 220,
                "height": 220
            }
        },
        # Scene 7: Fire speed (added)
        {
            "type": "sticker",
            "in_seconds": aligned_results[7]["start_time"],
            "out_seconds": aligned_results[7]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/fire.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 200,
                "height": 200
            }
        },
        # Scene 9: Warning puzzle
        {
            "type": "sticker",
            "in_seconds": aligned_results[9]["start_time"],
            "out_seconds": aligned_results[9]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/warning.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 100,
                "right": 100,
                "width": 200,
                "height": 200
            }
        },
        # Scene 12: Checkmark
        {
            "type": "sticker",
            "in_seconds": aligned_results[12]["start_time"],
            "out_seconds": aligned_results[12]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/green_checkmark.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 220,
                "height": 220
            }
        },
        # Scene 17: Clock slow delay (added)
        {
            "type": "sticker",
            "in_seconds": aligned_results[17]["start_time"],
            "out_seconds": (aligned_results[17]["start_time"] + aligned_results[17]["end_time"]) / 2,
            "stickerSrc": "projects/common_assets/stickers/clock.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 200,
                "height": 200
            }
        },
        # Scene 18: Lock detail (added)
        {
            "type": "sticker",
            "in_seconds": aligned_results[18]["start_time"],
            "out_seconds": (aligned_results[18]["start_time"] + aligned_results[18]["end_time"]) / 2,
            "stickerSrc": "projects/common_assets/stickers/lock.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 200,
                "height": 200
            }
        },
        # Scene 18: Database detail (added)
        {
            "type": "sticker",
            "in_seconds": (aligned_results[18]["start_time"] + aligned_results[18]["end_time"]) / 2,
            "out_seconds": aligned_results[18]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/database.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "right": 120,
                "width": 200,
                "height": 200
            }
        },
        # Scene 20: Banana broke
        {
            "type": "sticker",
            "in_seconds": aligned_results[20]["start_time"],
            "out_seconds": aligned_results[20]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/red_down_arrow.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 220,
                "height": 220
            }
        },
        # Scene 25: Thumbs up awesome (added)
        {
            "type": "sticker",
            "in_seconds": aligned_results[25]["start_time"],
            "out_seconds": aligned_results[25]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/thumbs_up.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "right": 120,
                "width": 200,
                "height": 200
            }
        }
    ]

    # Round overlay times
    for ovl in overlays:
        ovl["in_seconds"] = round(ovl["in_seconds"], 3)
        ovl["out_seconds"] = round(ovl["out_seconds"], 3)
        
    # Build cuts
    image_files = os.listdir(images_dir)
    cuts = []
    
    for i, res in enumerate(aligned_results):
        start_time = res["start_time"]
        end_time = res["end_time"]
        
        mins = int(start_time // 60)
        secs = int(start_time % 60)
        img_prefix = f"[{mins:02d}-{secs:02d}]"
        
        matched_image_file = None
        for f in image_files:
            if f.startswith(img_prefix) and f.endswith(".jpg"):
                matched_image_file = f
                break
                
        if not matched_image_file:
            for offset in [-1, 1, -2, 2]:
                check_time = start_time + offset
                if check_time >= 0:
                    check_mins = int(check_time // 60)
                    check_secs = int(check_time % 60)
                    check_prefix = f"[{check_mins:02d}-{check_secs:02d}]"
                    for f in image_files:
                        if f.startswith(check_prefix) and f.endswith(".jpg"):
                            matched_image_file = f
                            break
                if matched_image_file:
                    break
                    
        if not matched_image_file:
            print(f"Warning: No image found for scene {i} at {img_prefix}")
            
        source_path = f"projects/gpt56_comparison_project_13/images/{matched_image_file}" if matched_image_file else ""
        anim = animation_mapping.get(i, "none")
        
        cut_data = {
            "id": f"scene_{i}",
            "text": res["sentence"],
            "in_seconds": round(start_time, 3),
            "out_seconds": round(end_time, 3),
            "source": source_path,
            "animation": anim
        }
        
        if i in sfx_mapping:
            sfx_src, sfx_vol = sfx_mapping[i]
            cut_data["sfx"] = {
                "src": sfx_src,
                "volume": sfx_vol,
                "startOffsetSeconds": 0.0
            }
            
        cuts.append(cut_data)
        
    props = {
        "theme": "flat-motion-graphics",
        "themeConfig": {
            "backgroundColor": "#FFFFFF",
            "primaryColor": "#F5820D",
            "accentColor": "#2D5FBF",
            "surfaceColor": "#F9FAFB",
            "textColor": "#000000",
            "captionHighlightColor": "#F5820D",
            "captionBackgroundColor": "rgba(255, 255, 255, 0.85)",
            "chartColors": [
                "#F5820D",
                "#2D5FBF",
                "#3A9E3A",
                "#F5C518",
                "#D94040",
                "#8B5CF6"
            ]
        },
        "cuts": cuts,
        "overlays": overlays,
        "captions": captions,
        "audio": {
            "narration": {
                "src": "projects/gpt56_comparison_project_13/voiceover.wav",
                "volume": 1.0
            }
        }
    }
    
    output_props_path = project_dir / "proposed_props.json"
    with open(output_props_path, "w", encoding="utf-8") as f:
        json.dump(props, f, indent=2)
        
    print(f"Props JSON written to {output_props_path}")

if __name__ == "__main__":
    main()
