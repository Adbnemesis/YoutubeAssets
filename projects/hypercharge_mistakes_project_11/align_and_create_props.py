import json
import os
import re
import difflib
from pathlib import Path

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")

def clean_text(text):
    text = text.lower()
    text = text.replace("11", "eleven")
    text = text.replace("6600", "six thousand six hundred")
    text = text.replace("15%", "fifteen percent")
    text = text.replace("15", "fifteen")
    text = text.replace("7764", "seven thousand seven hundred sixty four")
    text = text.replace("20%", "twenty percent")
    text = text.replace("26%", "twenty six percent")
    text = text.replace("40%", "forty percent")
    text = text.replace("5000", "five thousand")
    text = text.replace("5", "five")
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
    project_dir = ROOT / "projects" / "hypercharge_mistakes_project_11"
    script_path = project_dir / "script_hypercharge_mistakes.txt"
    transcript_json = project_dir / "voiceover_transcript.json"
    images_dir = project_dir / "images"
    
    # 1. Parse sentences from the raw script file
    sentences = parse_sentences(script_path)
    print(f"Parsed {len(sentences)} sentences from script.")
    
    # 2. Read Whisper transcript
    with open(transcript_json, "r", encoding="utf-8") as f:
        transcript_data = json.load(f)
        
    transcript_words = []
    transcript_word_times = []
    captions = []
    for seg in transcript_data.get("segments", []):
        for w in seg.get("words", []):
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
    # SFX MAPPING (22 SFX across 35 scenes, 0-indexed)
    # =========================================================================
    sfx_mapping = {
        0:  ("projects/common_assets/sfx/whoosh.mp3", 0.5),       # Intro whoosh
        1:  ("projects/common_assets/sfx/error.mp3", 0.6),        # Respawn death
        2:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # Question bubble
        3:  ("projects/common_assets/sfx/riser.mp3", 0.3),        # Mistake #1 buildup
        6:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # 6600 HP stat
        7:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # 15% shield stat
        8:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # 7764 HP stat
        9:  ("projects/common_assets/sfx/anime-wow.mp3", 0.5),    # Comedic Piper shot
        11: ("projects/common_assets/sfx/error.mp3", 0.4),        # Purple target failure
        12: ("projects/common_assets/sfx/notification.mp3", 0.4), # Mistake #2 card
        13: ("projects/common_assets/sfx/error.mp3", 0.4),        # Tactical failure
        16: ("projects/common_assets/sfx/whoosh.mp3", 0.5),       # Speed boost whoosh
        18: ("projects/common_assets/sfx/chime.mp3", 0.5),        # "Strike" realization
        19: ("projects/common_assets/sfx/pop.mp3", 0.5),          # Hidden mechanic reveal
        20: ("projects/common_assets/sfx/riser.mp3", 0.3),        # Charge lock tension
        23: ("projects/common_assets/sfx/error.mp3", 0.5),        # Locked meter
        25: ("projects/common_assets/sfx/chime.mp3", 0.4),        # Pro tip realization
        27: ("projects/common_assets/sfx/whoosh.mp3", 0.4),       # Counter-play transition
        29: ("projects/common_assets/sfx/clock-ticking.mp3", 0.4),# 5 seconds countdown
        31: ("projects/common_assets/sfx/anime-wow.mp3", 0.5),    # 5000-coin comedic
        32: ("projects/common_assets/sfx/chime.mp3", 0.4),        # Conclusion realization
        34: ("projects/common_assets/sfx/ping.mp3", 0.5),         # Subscribe end screen
    }
    
    # =========================================================================
    # ANIMATION MAPPING (per scene, 0-indexed)
    # =========================================================================
    animation_mapping = {
        0:  "zoom-in",
        3:  "ken-burns",
        14: "zoom-out",
        16: "zoom-in",
        17: "ken-burns",
        21: "ken-burns",
        22: "zoom-in",
        24: "zoom-out",
        26: "pan-right",
        30: "pan-left",
        32: "ken-burns",
        33: "zoom-in",
        34: "zoom-out",
    }
    
    # =========================================================================
    # OVERLAYS (section_title + stat_reveal)
    # =========================================================================
    overlays = [
        # OVL_01: Mistake #1
        {
            "type": "section_title",
            "in_seconds": aligned_results[3]["start_time"],
            "out_seconds": aligned_results[3]["end_time"],
            "text": "MISTAKE #1",
            "subtitle": "The Invincibility Myth",
            "accentColor": "#EF4444",
            "position": "top-left"
        },
        # OVL_02: 6,600 HP
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[6]["start_time"],
            "out_seconds": aligned_results[6]["end_time"],
            "text": "6,600 HP",
            "subtitle": "Edgar Base Health",
            "accentColor": "#7C3AED",
            "position": "bottom-right"
        },
        # OVL_03: +15%
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[7]["start_time"],
            "out_seconds": aligned_results[7]["end_time"],
            "text": "+15%",
            "subtitle": "Shield Bonus",
            "accentColor": "#10B981",
            "position": "bottom-right"
        },
        # OVL_04: 7,764 HP
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[8]["start_time"],
            "out_seconds": aligned_results[8]["end_time"],
            "text": "7,764 HP",
            "subtitle": "Effective Health",
            "accentColor": "#F59E0B",
            "position": "bottom-right"
        },
        # OVL_05: Mistake #2
        {
            "type": "section_title",
            "in_seconds": aligned_results[12]["start_time"],
            "out_seconds": aligned_results[12]["end_time"],
            "text": "MISTAKE #2",
            "subtitle": "Tunnel Vision",
            "accentColor": "#EF4444",
            "position": "top-left"
        },
        # OVL_06: 20-26% Speed Boost
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[16]["start_time"],
            "out_seconds": aligned_results[16]["end_time"],
            "text": "20\u201326%",
            "subtitle": "Speed Boost",
            "accentColor": "#06B6D4",
            "position": "center"
        },
        # OVL_07: THE FIX
        {
            "type": "section_title",
            "in_seconds": aligned_results[17]["start_time"],
            "out_seconds": aligned_results[17]["end_time"],
            "text": "THE FIX",
            "subtitle": "Use Speed First",
            "accentColor": "#10B981",
            "position": "top-left"
        },
        # OVL_08: Mistake #3
        {
            "type": "section_title",
            "in_seconds": aligned_results[19]["start_time"],
            "out_seconds": aligned_results[19]["end_time"],
            "text": "MISTAKE #3",
            "subtitle": "Hidden Mechanic",
            "accentColor": "#EF4444",
            "position": "top-left"
        },
        # OVL_09: CHARGE LOCK
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[20]["start_time"],
            "out_seconds": aligned_results[20]["end_time"],
            "text": "CHARGE LOCK",
            "subtitle": "Hidden Mechanic",
            "accentColor": "#EF4444",
            "position": "center"
        },
        # OVL_10: 40%
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[21]["start_time"],
            "out_seconds": aligned_results[21]["end_time"],
            "text": "40%",
            "subtitle": "Super Charge Rate",
            "accentColor": "#F59E0B",
            "position": "bottom-right"
        },
        # OVL_11: 0%
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[24]["start_time"],
            "out_seconds": aligned_results[24]["end_time"],
            "text": "0%",
            "subtitle": "Progress While Active",
            "accentColor": "#EF4444",
            "position": "center"
        },
        # OVL_12: PRO TIP
        {
            "type": "section_title",
            "in_seconds": aligned_results[25]["start_time"],
            "out_seconds": aligned_results[25]["end_time"],
            "text": "PRO TIP",
            "subtitle": "Charge First, Activate Second",
            "accentColor": "#10B981",
            "position": "top-left"
        },
        # OVL_13: COUNTER-PLAY
        {
            "type": "section_title",
            "in_seconds": aligned_results[27]["start_time"],
            "out_seconds": aligned_results[27]["end_time"],
            "text": "COUNTER-PLAY",
            "subtitle": "vs Hypercharge",
            "accentColor": "#06B6D4",
            "position": "top-left"
        },
        # OVL_14: 5s
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[29]["start_time"],
            "out_seconds": aligned_results[29]["end_time"],
            "text": "5s",
            "subtitle": "Hypercharge Duration",
            "accentColor": "#F59E0B",
            "position": "bottom-right"
        },
        # OVL_15: 5,000 coins
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[31]["start_time"],
            "out_seconds": aligned_results[31]["end_time"],
            "text": "5,000",
            "subtitle": "Wasted Enemy Investment",
            "accentColor": "#EC4899",
            "position": "center"
        },
        # OVL_16: SUBSCRIBE
        {
            "type": "section_title",
            "in_seconds": aligned_results[34]["start_time"],
            "out_seconds": aligned_results[34]["end_time"],
            "text": "SUBSCRIBE",
            "subtitle": "More Hidden Mechanics",
            "accentColor": "#7C3AED",
            "position": "top-left"
        },
    ]
    
    # Round overlay times
    for ovl in overlays:
        ovl["in_seconds"] = round(ovl["in_seconds"], 3)
        ovl["out_seconds"] = round(ovl["out_seconds"], 3)
    
    # =========================================================================
    # BUILD CUTS
    # =========================================================================
    image_files = os.listdir(images_dir)
    
    cuts = []
    for i, res in enumerate(aligned_results):
        start_time = res["start_time"]
        end_time = res["end_time"]
        
        # Map image by timestamp
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
            print(f"Warning: No image found for scene {i} at {img_prefix}: {res['sentence'][:40]}...")
            
        source_path = f"projects/hypercharge_mistakes_project_11/images/{matched_image_file}" if matched_image_file else ""
        
        # Animation
        anim = animation_mapping.get(i, "none")
            
        cut_data = {
            "id": f"scene_{i}",
            "text": res["sentence"],
            "in_seconds": round(start_time, 3),
            "out_seconds": round(end_time, 3),
            "source": source_path,
            "animation": anim
        }
        
        # SFX
        if i in sfx_mapping:
            sfx_src, sfx_vol = sfx_mapping[i]
            cut_data["sfx"] = {
                "src": sfx_src,
                "volume": sfx_vol,
                "startOffsetSeconds": 0.0
            }
            
        cuts.append(cut_data)
        
    # Build props
    props = {
        "theme": "flat-motion-graphics",
        "themeConfig": {
            "backgroundColor": "#FFFFFF",
            "primaryColor": "#7C3AED",
            "accentColor": "#EC4899",
            "surfaceColor": "#F9FAFB",
            "textColor": "#000000",
            "captionHighlightColor": "#7C3AED",
            "captionBackgroundColor": "rgba(255, 255, 255, 0.85)",
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
        "overlays": overlays,
        "captions": captions,
        "audio": {
            "narration": {
                "src": "projects/hypercharge_mistakes_project_11/voiceover.mp3",
                "volume": 1.0
            }
        }
    }
    
    # Save proposed_props.json
    output_props_path = project_dir / "proposed_props.json"
    with open(output_props_path, "w", encoding="utf-8") as f:
        json.dump(props, f, indent=2)
        
    print(f"Props JSON written to {output_props_path}")
    print(f"Total cuts: {len(cuts)}")
    print(f"Cuts with SFX: {len([c for c in cuts if 'sfx' in c])}")
    print(f"Cuts with animation: {len([c for c in cuts if c['animation'] != 'none'])}")
    print(f"Total overlays: {len(overlays)}")

if __name__ == "__main__":
    main()
