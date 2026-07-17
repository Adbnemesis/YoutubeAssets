import json
from pathlib import Path
import unicodedata

ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")
project_dir = ROOT / "projects" / "fifa_90th_minute_project_8"
transcript_path = project_dir / "voiceover_transcript.json"
script_path = project_dir / "script_fifa_90th_minute.txt"

with open(transcript_path, "r", encoding="utf-8") as f:
    data = json.load(f)

tx_words = data.get("word_timestamps", [])

def clean_word(w):
    w = "".join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn')
    w = "".join(c for c in w.lower() if c.isalnum())
    num_map = {
        "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
        "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
        "ten": "10", "sixteen": "16", "seventyeighth": "78", "seventyninth": "79",
        "eightyfifth": "85", "ninetysecond": "92", "eighty": "80", "thirteen": "13",
        "85th": "85", "92nd": "92", "79th": "79", "78th": "78",
        "jared": "geir", "jordan": "jordet", "swan": "swann", "martine": "martinez",
        "latera": "lautaro", "semifinal": "semi-final"
    }
    return num_map.get(w, w)

def lcs_score(words1, words2):
    m = len(words1)
    n = len(words2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if words1[i-1] == words2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

def format_timestamp(seconds):
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"[{mins:02d}:{secs:02d}]"

script_lines = [line.strip() for line in script_path.read_text(encoding="utf-8").splitlines() if line.strip()]

aligned_lines = []
tx_ptr = 0
for i, line in enumerate(script_lines):
    line_words = [clean_word(w) for w in line.split() if clean_word(w)]
    if not line_words:
        continue
    
    best_idx = -1
    best_score = -1
    
    # Allow searching slightly before tx_ptr to recover from off-by-one errors
    search_start = max(0, tx_ptr - 4)
    search_limit = min(tx_ptr + 40, len(tx_words))
    
    for idx in range(search_start, search_limit):
        # Extract a window from the transcript of size len(line_words) + 4
        window_size = len(line_words) + 4
        tx_window = [clean_word(tx_words[k]["word"]) for k in range(idx, min(idx + window_size, len(tx_words)))]
        
        score = lcs_score(line_words, tx_window)
        if score > best_score:
            best_score = score
            best_idx = idx
            
    # Stricter matching threshold (require at least 40% of words to match)
    min_words_to_match = max(2, int(len(line_words) * 0.40))
    
    matched = best_score >= min_words_to_match
    
    start_time = 0.0
    old_tx_ptr = tx_ptr
    if matched:
        start_time = tx_words[best_idx]["start"]
        tx_ptr = best_idx + len(line_words)
    else:
        if tx_ptr < len(tx_words):
            start_time = tx_words[tx_ptr]["start"]
        elif len(tx_words) > 0:
            start_time = tx_words[-1]["end"]
        tx_ptr = min(tx_ptr + len(line_words), len(tx_words))
        
    timestamp = format_timestamp(start_time)
    aligned_lines.append(f"{timestamp} {line}")
    print(f"Line {i+1}: '{line[:35]}...' | tx_ptr: {old_tx_ptr} -> {tx_ptr} | matched: {matched} | score: {best_score}/{len(line_words)} | time: {start_time:.2f}")
