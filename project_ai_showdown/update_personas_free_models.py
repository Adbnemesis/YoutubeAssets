#!/usr/bin/env python3
"""
Dynamic Free Model Assigner for personas.json
Queries OpenRouter's live API to discover all currently active 100% free models,
ranks them by Benchmark Intelligence Tier, and dynamically maps them to personas.json
at runtime whenever any episode generator is executed.
"""

import os
import json
import re
import urllib.request

# Benchmark Intelligence Priority List for known free model patterns
BENCHMARK_INTELLIGENCE_WEIGHTS = {
    "nemotron-3-ultra-550b": 98,
    "deepseek-r1": 96,
    "llama-3.1-405b": 95,
    "nemotron-3-super-120b": 94,
    "ling-3.0-flash": 90,
    "qwen-2.5-72b": 88,
    "gemma-4-31b": 86,
    "gemma-4-26b": 82,
    "llama-3.3-70b": 80,
    "nemotron-3-nano-omni-30b": 78,
    "laguna-s": 75,
    "north-mini-code": 72,
    "gpt-oss-20b": 70,
    "laguna-xs": 68,
    "openrouter/free": 50
}

def get_benchmark_score(model_id: str) -> int:
    m_lower = model_id.lower()
    
    # 1. Check direct match in known table
    for key, score in BENCHMARK_INTELLIGENCE_WEIGHTS.items():
        if key in m_lower:
            return score
            
    # 2. Dynamic heuristic for newly rotated models
    score = 50
    if "r1" in m_lower or "reasoning" in m_lower:
        score += 25
    if "deepseek" in m_lower or "claude" in m_lower or "gpt-4" in m_lower:
        score += 20
    if "llama" in m_lower or "qwen" in m_lower or "gemma" in m_lower or "nemotron" in m_lower:
        score += 15
        
    # Parameter size bonus extraction (e.g. 405b, 70b, 32b, 14b, 8b)
    param_match = re.search(r'(\d+)\s*b', m_lower)
    if param_match:
        size = int(param_match.group(1))
        if size >= 100:
            score += 30
        elif size >= 70:
            score += 20
        elif size >= 30:
            score += 15
        elif size >= 14:
            score += 10
            
    return score

def fetch_live_free_models():
    url = "https://openrouter.ai/api/v1/models"
    req = urllib.request.Request(url, headers={"User-Agent": "OpenMontage/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            models = data.get("data", [])
            
        free_models = []
        for m in models:
            m_id = m.get("id", "")
            p = m.get("pricing", {})
            pr = float(p.get("prompt", 1))
            co = float(p.get("completion", 1))
            
            if ":free" in m_id.lower() or (pr == 0 and co == 0):
                if "lyria" in m_id.lower(): # Skip audio models
                    continue
                score = get_benchmark_score(m_id)
                free_models.append({"id": m_id, "name": m.get("name", m_id), "benchmark_score": score})
                
        # Sort by benchmark score descending
        free_models.sort(key=lambda x: x["benchmark_score"], reverse=True)
        return [m["id"] for m in free_models]
    except Exception as e:
        print(f"⚠️ Error fetching live OpenRouter models: {e}")
        return ["openrouter/free"]

def update_personas_json():
    personas_path = os.path.join(os.path.dirname(__file__), "personas.json")
    if not os.path.exists(personas_path):
        print("❌ personas.json not found!")
        return

    with open(personas_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    live_free_models = fetch_live_free_models()
    print(f"🔄 OpenRouter Sync: Found {len(live_free_models)} live free models.")

    for persona in data.get("personas", []):
        rank = persona.get("rank", 99)
        idx = (rank - 1) % len(live_free_models) if live_free_models else 0
        primary_model = live_free_models[idx] if live_free_models else "openrouter/free"
        
        models_list = [primary_model]
        if "openrouter/free" not in models_list:
            models_list.append("openrouter/free")
            
        persona["model"] = models_list
        print(f"  • Rank #{rank} [{persona['name']}]: {models_list} (Score: {get_benchmark_score(primary_model)})")

    with open(personas_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print("✅ personas.json updated live with active free models!\n")

if __name__ == "__main__":
    update_personas_json()
