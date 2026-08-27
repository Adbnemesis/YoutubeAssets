import json
import os
import re
import difflib
from pathlib import Path

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")

def clean_text(text):
    text = text.lower()
    text = text.replace("alibaba", "ali baba")
    text = text.replace("hasn't", "has not")
    text = text.replace("it's", "it is")
    text = text.replace("doesn't", "does not")
    text = text.replace("isn't", "is not")
    text = text.replace("don't", "do not")
    text = text.replace("let's", "let us")
    text = text.replace("qwen3.8", "qwen three point eight")
    text = text.replace("qn3.8", "qwen three point eight")
    text = text.replace("k3", "k three")
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
    project_dir = ROOT / "projects" / "qwen_vs_kimi_project_12"
    script_path = project_dir / "script_qwen_vs_kimi.txt"
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
    
    # Check segment-level word lists
    for seg in transcript_data.get("segments", []):
        words = seg.get("words", [])
        if not words:
            # Fallback if Whisper did not output word timestamps per segment
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
        2:  ("projects/common_assets/sfx/chime.mp3", 0.5),        # Kimi K3 chime
        3:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # MoE pop
        4:  ("projects/common_assets/sfx/riser.mp3", 0.3),        # Beat Qwen riser
        5:  ("projects/common_assets/sfx/clock-ticking.mp3", 0.4),# 3 mins stopwatch
        7:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # 2.8T parameters
        8:  ("projects/common_assets/sfx/pop.mp3", 0.4),          # 2.4T parameters
        9:  ("projects/common_assets/sfx/anime-wow.mp3", 0.4),    # Why size matter comedic
        11: ("projects/common_assets/sfx/error.mp3", 0.5),        # Expensive error
        13: ("projects/common_assets/sfx/chime.mp3", 0.4),        # MoE secret chime
        16: ("projects/common_assets/sfx/pop.mp3", 0.4),          # 16 experts active
        18: ("projects/common_assets/sfx/notification.mp3", 0.4), # Secret weapons notification
        19: ("projects/common_assets/sfx/pop.mp3", 0.4),          # 2.5x efficiency boost
        20: ("projects/common_assets/sfx/anime-wow.mp3", 0.4),    # Massive leap comedic
        23: ("projects/common_assets/sfx/pop.mp3", 0.4),          # Podium rank #2
        24: ("projects/common_assets/sfx/notification.mp3", 0.4), # 1M context window
        25: ("projects/common_assets/sfx/clock-ticking.mp3", 0.4),# Read in 1 second
        26: ("projects/common_assets/sfx/whoosh.mp3", 0.4),       # Pricing war transition
        28: ("projects/common_assets/sfx/pop.mp3", 0.4),          # 90% discount pop
        29: ("projects/common_assets/sfx/pop.mp3", 0.4),          # $3.00 price tag pop
        31: ("projects/common_assets/sfx/riser.mp3", 0.4),        # Crown decision riser
        32: ("projects/common_assets/sfx/chime.mp3", 0.4),        # Kimi coding champion
        33: ("projects/common_assets/sfx/chime.mp3", 0.4),        # Qwen multimodal champion
        35: ("projects/common_assets/sfx/ping.mp3", 0.5)          # Subscribe end screen
    }
    
    # =========================================================================
    # ANIMATION MAPPING
    # =========================================================================
    animation_mapping = {
        0:  "zoom-in",
        1:  "pan-left",
        5:  "zoom-out",
        7:  "zoom-in",
        10: "ken-burns",
        15: "pan-left",
        16: "zoom-in",
        19: "zoom-in",
        22: "ken-burns",
        24: "zoom-out",
        27: "pan-right",
        28: "zoom-in",
        32: "zoom-in",
        33: "zoom-in"
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
            "text": "QWEN 3.8 MAX vs KIMI K3",
            "subtitle": "Jungle AI Battle",
            "accentColor": "#F5820D",
            "position": "center"
        },
        # OVL_02: The Duel
        {
            "type": "section_title",
            "in_seconds": aligned_results[5]["start_time"],
            "out_seconds": aligned_results[5]["end_time"],
            "text": "THE DUEL",
            "subtitle": "3-Minute Breakdown",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_03: Kimi Size
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[7]["start_time"],
            "out_seconds": aligned_results[7]["end_time"],
            "text": "2.8 Trillion",
            "subtitle": "Parameters",
            "accentColor": "#2D5FBF",
            "position": "bottom-right"
        },
        # OVL_04: Qwen Size
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[8]["start_time"],
            "out_seconds": aligned_results[8]["end_time"],
            "text": "2.4 Trillion",
            "subtitle": "Parameters",
            "accentColor": "#EC4899",
            "position": "bottom-right"
        },
        # OVL_05: MoE Secret
        {
            "type": "section_title",
            "in_seconds": aligned_results[13]["start_time"],
            "out_seconds": aligned_results[13]["end_time"],
            "text": "THE SECRET",
            "subtitle": "Mixture-of-Experts",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_06: Active Experts
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[16]["start_time"],
            "out_seconds": aligned_results[16]["end_time"],
            "text": "16 / 896",
            "subtitle": "Active Experts",
            "accentColor": "#10B981",
            "position": "bottom-right"
        },
        # OVL_07: Innovation
        {
            "type": "section_title",
            "in_seconds": aligned_results[18]["start_time"],
            "out_seconds": aligned_results[18]["end_time"],
            "text": "INNOVATION",
            "subtitle": "KDA & AttnRes",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_08: Efficiency
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[19]["start_time"],
            "out_seconds": aligned_results[19]["end_time"],
            "text": "2.5x",
            "subtitle": "Efficiency Boost",
            "accentColor": "#F59E0B",
            "position": "center"
        },
        # OVL_09: Alibaba Play
        {
            "type": "section_title",
            "in_seconds": aligned_results[21]["start_time"],
            "out_seconds": aligned_results[21]["end_time"],
            "text": "ALIBABA'S PLAY",
            "subtitle": "Qwen 3.8 Max",
            "accentColor": "#EC4899",
            "position": "top-left"
        },
        # OVL_10: Rank
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[23]["start_time"],
            "out_seconds": aligned_results[23]["end_time"],
            "text": "#2 Rank",
            "subtitle": "Below Claude 5 Fable",
            "accentColor": "#F5820D",
            "position": "bottom-right"
        },
        # OVL_11: Context
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[24]["start_time"],
            "out_seconds": aligned_results[24]["end_time"],
            "text": "1M Tokens",
            "subtitle": "Context Window",
            "accentColor": "#2D5FBF",
            "position": "bottom-right"
        },
        # OVL_12: Pricing War
        {
            "type": "section_title",
            "in_seconds": aligned_results[26]["start_time"],
            "out_seconds": aligned_results[26]["end_time"],
            "text": "THE PRICING WAR",
            "subtitle": "Cost Breakdown",
            "accentColor": "#F5820D",
            "position": "top-left"
        },
        # OVL_13: Discount
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[28]["start_time"],
            "out_seconds": aligned_results[28]["end_time"],
            "text": "90% OFF",
            "subtitle": "$0.30 per 1M (Cache Hit)",
            "accentColor": "#10B981",
            "position": "center"
        },
        # OVL_14: Standard Price
        {
            "type": "stat_reveal",
            "in_seconds": aligned_results[29]["start_time"],
            "out_seconds": aligned_results[29]["end_time"],
            "text": "$3.00",
            "subtitle": "Standard Price (Cache Miss)",
            "accentColor": "#EF4444",
            "position": "bottom-right"
        },
        # OVL_15: Kimi Champion
        {
            "type": "section_title",
            "in_seconds": aligned_results[32]["start_time"],
            "out_seconds": aligned_results[32]["end_time"],
            "text": "KIMI K3",
            "subtitle": "Coding Champion",
            "accentColor": "#2D5FBF",
            "position": "top-left"
        },
        # OVL_16: Qwen Champion
        {
            "type": "section_title",
            "in_seconds": aligned_results[33]["start_time"],
            "out_seconds": aligned_results[33]["end_time"],
            "text": "QWEN 3.8 MAX",
            "subtitle": "Multimodal Champion",
            "accentColor": "#EC4899",
            "position": "top-left"
        },
        # Stickers & engagement overlays
        # Scene 1: Multi-overlay for the translator monkeys analogy
        {
            "type": "sticker",
            "in_seconds": aligned_results[1]["start_time"],
            "out_seconds": (aligned_results[1]["start_time"] + aligned_results[1]["end_time"]) / 2,
            "stickerSrc": "projects/common_assets/stickers/question_mark.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 240,
                "height": 240
            }
        },
        {
            "type": "sticker",
            "in_seconds": (aligned_results[1]["start_time"] + aligned_results[1]["end_time"]) / 2,
            "out_seconds": aligned_results[1]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/lightbulb.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "right": 120,
                "width": 240,
                "height": 240
            }
        },
        # Scene 11: Expensive warning
        {
            "type": "sticker",
            "in_seconds": aligned_results[11]["start_time"],
            "out_seconds": aligned_results[11]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/warning.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 100,
                "right": 100,
                "width": 200,
                "height": 200
            }
        },
        # Scene 20: Massive efficiency leap
        {
            "type": "sticker",
            "in_seconds": aligned_results[20]["start_time"],
            "out_seconds": aligned_results[20]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/up_arrow.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 220,
                "height": 220
            }
        },
        # Scene 23: Multi-overlay for Alibaba's proprietary preview terms
        {
            "type": "sticker",
            "in_seconds": aligned_results[22]["start_time"],
            "out_seconds": (aligned_results[22]["start_time"] + aligned_results[22]["end_time"]) / 2,
            "stickerSrc": "projects/common_assets/stickers/warning.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 240,
                "height": 240
            }
        },
        {
            "type": "sticker",
            "in_seconds": (aligned_results[22]["start_time"] + aligned_results[22]["end_time"]) / 2,
            "out_seconds": aligned_results[22]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/lightbulb.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "right": 120,
                "width": 240,
                "height": 240
            }
        },
        # Scene 28: 90% discount pricing drop
        {
            "type": "sticker",
            "in_seconds": aligned_results[28]["start_time"],
            "out_seconds": aligned_results[28]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/red_down_arrow.svg",
            "stickerStyle": {
                "position": "absolute",
                "top": 100,
                "left": 100,
                "width": 200,
                "height": 200
            }
        },
        # Scene 29: New question cost
        {
            "type": "sticker",
            "in_seconds": aligned_results[29]["start_time"],
            "out_seconds": aligned_results[29]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/gold_coin.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "left": 120,
                "width": 220,
                "height": 220
            }
        },
        # Scene 32: Kimi Coding win
        {
            "type": "sticker",
            "in_seconds": aligned_results[32]["start_time"],
            "out_seconds": aligned_results[32]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/green_checkmark.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "right": 120,
                "width": 220,
                "height": 220
            }
        },
        # Scene 33: Qwen Multimodal win
        {
            "type": "sticker",
            "in_seconds": aligned_results[33]["start_time"],
            "out_seconds": aligned_results[33]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/green_checkmark.svg",
            "stickerStyle": {
                "position": "absolute",
                "bottom": 120,
                "right": 120,
                "width": 220,
                "height": 220
            }
        },
        # Scene 35: Closing question mark
        {
            "type": "sticker",
            "in_seconds": aligned_results[35]["start_time"],
            "out_seconds": aligned_results[35]["end_time"],
            "stickerSrc": "projects/common_assets/stickers/question_mark.svg",
            "stickerStyle": {
                "position": "absolute",
                "top": 120,
                "right": 120,
                "width": 240,
                "height": 240
            }
        }
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
                
        # Fallback if minor offset
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
            
        source_path = f"projects/qwen_vs_kimi_project_12/images/{matched_image_file}" if matched_image_file else ""
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
        
    # Build props
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
                "src": "projects/qwen_vs_kimi_project_12/voiceover.wav",
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
