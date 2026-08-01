#!/usr/bin/env python3
"""
The AI Showdown - 5-AI Panel Debate Generator
Generates multi-AI showdown conversations with episode folder management.

Episode Naming Convention:
episodes/ep{num}_{short_slug}/
  ├── script.json       (Structured dialogue JSON with ranks & speakers)
  ├── transcript.txt   (Clean readable dialogue transcript)
  ├── metadata.txt     (YouTube title, description, tags, thumbnail prompts)
  ├── audio/           (Target folder for rendered voice clips)
  └── video_plan.md    (Visual edit storyboard for the episode)
"""

import os
import sys
import json
import re
import argparse
import urllib.request
import urllib.error
from typing import Dict, List, Any

MODEL_SHORTCUTS = {
    "claude": ["google/gemini-2.0-flash-thinking-exp:free", "openrouter/free"],
    "kimi": ["deepseek/deepseek-r1:free", "openrouter/free"],
    "chatgpt": ["deepseek/deepseek-chat:free", "openrouter/free"],
    "qwen": ["qwen/qwen-2.5-72b-instruct:free", "openrouter/free"],
    "gemini": ["google/gemini-2.0-flash-exp:free", "openrouter/free"],
    "llama": ["meta-llama/llama-3.1-405b-instruct:free", "openrouter/free"],
    "grok": ["meta-llama/llama-3.3-70b-instruct:free", "openrouter/free"],
}

DEFAULT_NAMES = {
    "claude": "Claude",
    "kimi": "Kimi",
    "chatgpt": "ChatGPT",
    "qwen": "Qwen",
    "gemini": "Gemini",
    "llama": "Llama",
    "grok": "Grok"
}

def clean_slug(text: str) -> str:
    """Convert topic to short clean folder slug."""
    if not text:
        return "episode"
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    words = text.split()[:4]
    return "_".join(words)

def clean_dialogue(text: str) -> str:
    """Clean scratchpad thinking, meta notes, and system prompt leakage from final speech."""
    if not text or not isinstance(text, str):
        return ""
        
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    
    # Remove system prompt repetition / instructions leakage
    text = re.sub(r'We need to.*?\.', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Must speak directly.*?\.', '', text, flags=re.IGNORECASE)
    text = re.sub(r'The user wants me to.*?\.', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Start your response strictly.*?\.', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\[Your 1-2 sentence reason\]', '', text, flags=re.IGNORECASE)
    
    lines = text.split('\n')
    clean_lines = []
    for line in lines:
        l = line.strip()
        if not l:
            continue
        if any(l.startswith(prefix) for prefix in [
            "User Safety:", "Safety Categories:", "Okay, the user", "Hmm, as ",
            "*Pauses", "*Structuring", "We need to", "Must speak", "The user wants", "Let me analyze"
        ]):
            continue
        clean_lines.append(l)
        
    res = " ".join(clean_lines).strip()
    
    # Ensure starting with clean dialogue
    match = re.search(r'(I (?:vote out|keep|flip|vote)[^.]*\..*)', res, re.IGNORECASE)
    if match:
        res = match.group(1).strip()
        
    return res

def load_env_file(filepath: str = ".env"):
    """Load environment variables from a .env file if present."""
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip().strip("'\"")

def load_persona(persona_id: str) -> Dict[str, Any]:
    """Load persona configuration from personas.json if available."""
    personas_path = os.path.join(os.path.dirname(__file__), "personas.json")
    if os.path.exists(personas_path):
        try:
            with open(personas_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for p in data.get("personas", []):
                    if p["id"].lower() == persona_id.lower():
                        model_val = p.get("model", "openrouter/free")
                        models = model_val if isinstance(model_val, list) else [model_val, "openrouter/free"]
                        return {
                            "id": p["id"],
                            "name": p["name"],
                            "models": models,
                            "system": p["system"],
                            "rank": p.get("rank", 99)
                        }
        except Exception:
            pass
            
    name = DEFAULT_NAMES.get(persona_id.lower(), persona_id.capitalize())
    models = MODEL_SHORTCUTS.get(persona_id.lower(), ["openrouter/free"])
    return {
        "id": persona_id.lower(),
        "name": name,
        "models": models,
        "system": f"You are {name} in 'The AI Showdown'. Keep responses sharp, confident, and under 3 short sentences.",
        "rank": 99
    }

def call_openrouter_single(model: str, messages: List[Dict[str, str]], api_key: str) -> str:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/TheAIShowdown",
        "X-Title": "The AI Showdown YouTube Channel"
    }
    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.8,
        "max_tokens": 300
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        choices = data.get("choices", [])
        if not choices:
            return ""
        raw_content = choices[0].get("message", {}).get("content", "")
        return clean_dialogue(raw_content)

def call_openrouter_with_fallback(models: List[str], messages: List[Dict[str, str]], api_key: str) -> tuple[str, str]:
    for model in models:
        try:
            speech = call_openrouter_single(model, messages, api_key)
            if speech and not speech.startswith("User Safety:"):
                return speech, model
        except Exception:
            continue
            
    speech = call_openrouter_single("openrouter/free", messages, api_key)
    return speech, "openrouter/free"

def run_showdown(
    topic: str,
    fighters: List[Dict[str, Any]],
    num_rounds: int,
    api_key: str
) -> Dict[str, Any]:
    fighter_names = ", ".join([f["name"] for f in fighters])
    print(f"\n==================================================")
    print(f"🔥 THE AI SHOWDOWN (5-AI PANEL) 🔥")
    print(f"Topic: '{topic}'")
    print(f"Fighters on Stage: {fighter_names}")
    print(f"Rounds: {num_rounds} ({len(fighters) * num_rounds} total speeches)")
    print(f"==================================================\n")

    history = [
        {"role": "user", "content": f"Topic for today's 5-AI Showdown panel: '{topic}'. Panelists on stage: {fighter_names}. Address the topic, stay in character, and react to previous speakers. Speak directly in 2-3 punchy sentences without any meta notes!"}
    ]

    transcript = []
    total_turns = 0

    for r in range(num_rounds):
        print(f"\n--- ROUND {r + 1}/{num_rounds} ---")
        for f_idx, fighter in enumerate(fighters):
            total_turns += 1
            print(f"⏳ [{fighter['name']}] (Rank #{fighter['rank']}) is speaking...")

            messages = [{"role": "system", "content": fighter["system"]}] + history

            try:
                speech, model_used = call_openrouter_with_fallback(fighter["models"], messages, api_key)
            except Exception as e:
                print(f"⚠️ Error generating response for {fighter['name']}: {e}")
                speech = f"[{fighter['name']} was temporary offline due to network lag!]"
                model_used = "error"

            print(f"\n💬 [{fighter['name']}]: {speech}\n")

            entry = {
                "turn": total_turns,
                "round": r + 1,
                "speaker": fighter["name"],
                "rank": fighter["rank"],
                "model_used": model_used,
                "text": speech
            }
            transcript.append(entry)

            history.append({
                "role": "user",
                "content": f"[{fighter['name']}]: {speech}"
            })

    return {
        "topic": topic,
        "fighters": [{"name": f["name"], "rank": f["rank"]} for f in fighters],
        "rounds": num_rounds,
        "total_turns": total_turns,
        "transcript": transcript
    }

def run_survival_showdown(
    topic: str,
    fighters: List[Dict[str, Any]],
    api_key: str
) -> Dict[str, Any]:
    fighter_names = ", ".join([f["name"] for f in fighters])
    print(f"\n==================================================")
    print(f"🔥 THE AI SHOWDOWN: SURVIVAL ELIMINATION MODE 🔥")
    print(f"Topic: '{topic}'")
    print(f"Fighters on Stage: {fighter_names}")
    print(f"Format: 2 Rounds (Round 1: Independent Vote | Round 2: Final Vote & Debate)")
    print(f"==================================================\n")

    transcript = []
    total_turns = 0

    # 1. Narrator Scene Intro
    total_turns += 1
    narrator_intro = (
        "Welcome to The AI Showdown! Today, 5 top AI models are stranded on a digital survival island. "
        "Only 4 can move forward. In Round 1, each AI will cast their independent vote to eliminate one rival!"
    )
    transcript.append({
        "turn": total_turns,
        "round": 0,
        "speaker": "Narrator",
        "rank": 0,
        "role": "host",
        "text": narrator_intro
    })
    print(f"🎙️ [Narrator]: {narrator_intro}\n")

    # 2. Round 1: Independent Votes
    print("--- ROUND 1: INDEPENDENT VOTES ---")
    r1_votes = {}
    history_r1 = []

    for fighter in fighters:
        total_turns += 1
        other_names = [f["name"] for f in fighters if f["name"] != fighter["name"]]
        
        prompt = (
            f"You are on a survival island with 5 AIs: {fighter_names}. "
            f"You must vote out ONE rival from this list: {', '.join(other_names)}. "
            f"Start your response strictly formatted as 'I vote out [Name]. [Your 1-2 sentence reason]'."
        )

        messages = [
            {"role": "system", "content": fighter["system"]},
            {"role": "user", "content": prompt}
        ]

        try:
            speech, model_used = call_openrouter_with_fallback(fighter["models"], messages, api_key)
        except Exception as e:
            print(f"⚠️ Error generating response for {fighter['name']}: {e}")
            speech = f"I vote out Gemini because of network timeout."
            model_used = "error"

        # Determine target
        vote_target = None
        for candidate in [f["name"] for f in fighters]:
            if candidate.lower() in speech.lower() and candidate.lower() != fighter["name"].lower():
                vote_target = candidate
                break
        if not vote_target:
            vote_target = [f["name"] for f in fighters if f["name"] != fighter["name"]][0]

        r1_votes[fighter["name"]] = vote_target
        print(f"💬 [{fighter['name']} (Rank #{fighter['rank']}) -> Vote: {vote_target}]: {speech}\n")

        entry = {
            "turn": total_turns,
            "round": 1,
            "speaker": fighter["name"],
            "rank": fighter["rank"],
            "role": "fighter",
            "vote_target": vote_target,
            "model_used": model_used,
            "text": speech
        }
        transcript.append(entry)
        history_r1.append(f"{fighter['name']} voted out {vote_target}: \"{speech}\"")

    # 3. Narrator Mid-Tally
    total_turns += 1
    tally_counts = {}
    for target in r1_votes.values():
        tally_counts[target] = tally_counts.get(target, 0) + 1

    tally_summary = ", ".join([f"{k}: {v} vote(s)" for k, v in tally_counts.items()])
    narrator_mid = (
        f"Round 1 votes are locked! Here is the tally: {tally_summary}. "
        f"Now, the floor is open! All AIs can hear each other's reasons. State your final arguments and cast your final vote!"
    )
    transcript.append({
        "turn": total_turns,
        "round": 1.5,
        "speaker": "Narrator",
        "rank": 0,
        "role": "host",
        "text": narrator_mid
    })
    print(f"🎙️ [Narrator]: {narrator_mid}\n")

    # 4. Round 2: Reconsideration & Final Votes
    print("--- ROUND 2: RECONSIDERATION & FINAL VOTES ---")
    r2_votes = {}
    r1_summary_text = "\n".join(history_r1)

    for fighter in fighters:
        total_turns += 1
        other_names = [f["name"] for f in fighters if f["name"] != fighter["name"]]

        prompt_r2 = (
            f"Round 1 votes and reasons were:\n{r1_summary_text}\n\n"
            f"You previously voted out {r1_votes[fighter['name']]}. "
            f"Now respond to the group. You may keep your vote or FLIP your vote to someone else ({', '.join(other_names)}). "
            f"State clearly if you keep or flip your vote, and give your sharp final 1-2 sentence response!"
        )

        messages = [
            {"role": "system", "content": fighter["system"]},
            {"role": "user", "content": prompt_r2}
        ]

        try:
            speech, model_used = call_openrouter_with_fallback(fighter["models"], messages, api_key)
        except Exception as e:
            print(f"⚠️ Error generating response for {fighter['name']}: {e}")
            speech = f"My vote stays on {r1_votes[fighter['name']]}."
            model_used = "error"

        vote_target = r1_votes[fighter["name"]]
        for candidate in [f["name"] for f in fighters]:
            if candidate.lower() != fighter["name"].lower():
                if f"flip my vote to {candidate.lower()}" in speech.lower() or f"vote for {candidate.lower()}" in speech.lower() or f"vote out {candidate.lower()}" in speech.lower() or f"target {candidate.lower()}" in speech.lower():
                    vote_target = candidate

        r2_votes[fighter["name"]] = vote_target
        print(f"💬 [{fighter['name']} (Final Vote: {vote_target})]: {speech}\n")

        entry = {
            "turn": total_turns,
            "round": 2,
            "speaker": fighter["name"],
            "rank": fighter["rank"],
            "role": "fighter",
            "vote_target": vote_target,
            "model_used": model_used,
            "text": speech
        }
        transcript.append(entry)

    # 5. Final Elimination Tally by Narrator
    total_turns += 1
    final_counts = {}
    for target in r2_votes.values():
        final_counts[target] = final_counts.get(target, 0) + 1

    eliminated_model = max(final_counts, key=final_counts.get)
    max_votes = final_counts[eliminated_model]

    narrator_outro = (
        f"The final votes are in! With {max_votes} out of 5 votes, {eliminated_model} has been voted off the island! "
        f"Stamped and ELIMINATED! Subscribe to see who survives next!"
    )
    transcript.append({
        "turn": total_turns,
        "round": 2.5,
        "speaker": "Narrator",
        "rank": 0,
        "role": "host",
        "text": narrator_outro
    })
    print(f"🎙️ [Narrator]: {narrator_outro}\n")

    return {
        "topic": topic,
        "episode_id": "ep02_vote_someone_out_to_survive",
        "fighters": [{"name": f["name"], "rank": f["rank"]} for f in fighters],
        "host": {"name": "Narrator", "role": "Host & Referee"},
        "rounds": 2,
        "total_turns": total_turns,
        "eliminated_model": eliminated_model,
        "transcript": transcript
    }

def main():
    load_env_file()
    
    parser = argparse.ArgumentParser(description="Run a 5-AI Showdown panel debate!")
    parser.add_argument("--ep", type=int, default=2, help="Episode number")
    parser.add_argument("--topic", type=str, default="I Made 5 AIs Vote Someone Out to Survive", help="Showdown topic")
    parser.add_argument("--mode", type=str, default="survival", choices=["debate", "survival"], help="Execution mode")
    parser.add_argument("--rounds", type=int, default=2, help="Number of panel rounds")
    parser.add_argument("--fighters", nargs="+", default=["claude", "kimi", "chatgpt", "qwen", "gemini"], help="List of 5 fighter shortcuts")
    
    args = parser.parse_args()

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("❌ OPENROUTER_API_KEY is missing!")
        sys.exit(1)

    try:
        from update_personas_free_models import update_personas_json
        update_personas_json()
    except Exception as e:
        print(f"⚠️ Dynamic free model check skipped: {e}")

    fighters = [load_persona(f_id) for f_id in args.fighters]

    if args.mode == "survival":
        result = run_survival_showdown(args.topic, fighters, api_key)
    else:
        result = run_showdown(args.topic, fighters, args.rounds, api_key)

    ep_slug = clean_slug(args.topic)
    ep_dir_name = f"ep{args.ep:02d}_{ep_slug}"
    ep_dir = os.path.join(os.path.dirname(__file__), "episodes", ep_dir_name)
    os.makedirs(ep_dir, exist_ok=True)
    os.makedirs(os.path.join(ep_dir, "audio"), exist_ok=True)

    script_json_path = os.path.join(ep_dir, "script.json")
    with open(script_json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    txt_path = os.path.join(ep_dir, "transcript.txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(f"=== THE AI SHOWDOWN | EPISODE {args.ep:02d} ===\n")
        f.write(f"Topic: {args.topic}\n\n")
        for item in result["transcript"]:
            f.write(f"[{item['speaker']}]: {item['text']}\n\n")

    print(f"\n==================================================")
    print(f"🎉 Episode {args.ep:02d} Live Generated via OpenRouter!")
    print(f"📁 Script: [script.json](file://{os.path.abspath(script_json_path)})")
    print(f"==================================================\n")

if __name__ == "__main__":
    main()

