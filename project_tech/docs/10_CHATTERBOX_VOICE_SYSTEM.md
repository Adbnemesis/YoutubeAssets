# NEMI EXPLAINS — CHATTERBOX NEURAL VOICE SYSTEM

## 1. Voice Engine & Performance Architecture
* **TTS Engine:** Chatterbox Neural Expressive TTS (`chatterbox.tts`)
* **Hardware Acceleration:** Apple Silicon MPS (`torch.backends.mps`)
* **Sample Rate:** `24,000 Hz`
* **Configuration:** `tech_voice_profile.json`

---

## 2. Speaker Orchestration & Non-Overlapping Dialogue Rules

| Character | Role | Spoken Limit | Execution Format | Overlap Rule |
|:---|:---|:---:|:---|:---|
| **Narrator** | System Explanation | 4–7 Paragraphs | Long-form Performance Blocks | `NARRATOR ACTIVE → NEMI CANNOT SPEAK` |
| **Nemi** | Mascot / Audience Avatar | 2–3 Punchy Lines | Short Reaction Clips (≤ 3 words) | `NEMI ACTIVE → NARRATOR CANNOT SPEAK` |

### Natural Sentence Ending & QA Rule
* Spoken start times are calculated strictly sequentially: `start_time[i] = end_time[i-1] + gap_ms`.
* No narrator sentence is ever truncated or interrupted to make room for mascot dialogue.
* The pre-render validator `validate_v11_audio.py` asserts `overlap == 0.00ms` and `duration in [19.0s, 25.0s]`.

---

## 3. Dynamic Sidechain Audio Mastering
* **Voice Track:** Normalized to `-16.0 LUFS` using `pyloudnorm`.
* **Dynamic BGM Ducking:**
  `[1:a]volume=0.23[bgm_pre];[bgm_pre][0:a]sidechaincompress=threshold=0.06:ratio=10:attack=15:release=300[bgm_ducked]`
* **Final Master Loudness:** `-15.47 LUFS` | True Peak `-3.89 dBTP`.
