# NEMI EXPLAINS — ANALYTICS SYSTEM & RETENTION METRICS

## 0. FIELD REALITY BASELINE (FIRST 5 REELS, AUG 2026)

| Reel | Date | Length | Views | Reach | Avg Watch | APV | Saves/Reach | Shares/Reach | Comments |
|---|---|---|---|---|---|---|---|---|---|
| CAPTCHA | 08-17 | 22.79s | 160 | 132 | 5.76s | 25.3% | 0.76% | 0.76% | 0 |
| google.com | 08-18 | 19.72s | 173 | 137 | 4.80s | 24.3% | 2.92% | 0.73% | 0 |
| Two Sum | 08-19 | 24.47s | 246 | 198 | 3.49s | 14.3% | 0.51% | 0.00% | 0 |
| ChatGPT | 08-20 | 25.61s | 117 | 108 | 3.33s | 13.0% | 0.93% | 0.00% | 0 |
| Dining Philos. | 08-21 | ~22s* | 154 | 128 | 3.97s | ~18%* | 0.78% | 0.00% | 0 |

(\* analyzer guessed 20.0s — BUG: store real durations per reel, never hardcode.)

**Findings:**
1. Every reel died inside its first test batch (~110–200 accounts). Views flat/declining: 160→173→246→117→154.
2. **Everyday mysteries retained ~1.8× better than developer-niche topics** (CAPTCHA 25.3%, google.com 24.3% vs Two Sum 14.3%, ChatGPT 13.0%). Editorial mix shifts toward Everyday Tech Mysteries until data says otherwise.
3. Internal 98/100 self-scores predicted none of this. Self-scores are demoted to advisory; the T+48h post-mortem below is the only quality verdict.
4. Primary failure is the HOOK (majority swipes inside 0–3s), not video length. See `06_HOOK_SYSTEM.md` §5–6 and `26_RETENTION_POSTMORTEM_AND_PLAYBOOK.md`.

### Interim Targets (until APV ≥ 60%)

| Metric | Original Target | Interim Target |
|---|---|---|
| APV | ≥105% | ≥40% |
| 3s retention | ≥78% | ≥55% |
| Shares / reach | ≥4.5% | ≥1.0% |
| Saves / reach | ≥6.0% | ≥2.5% |
| Comments | — | ≥5 per reel |

### T+48h Post-Mortem Protocol (MANDATORY, every reel)

Log: views, reach, avg watch, APV, 3s retention graph (IG app screenshot), follows, saves, shares, comments.
- **APV ≥ 40% & views climbing** → scale the topic family.
- **Views < 300 & APV < 35%** → hook failure: pull retention curve, find the collapse second, rebuild frames 0–3.
- **Saves ≥ 2.5% but APV < 30%** → payoff too late: restructure arc (payoff by 55–60%).

## 1. Primary Algorithmic Signals (Ranked by Importance)
1. **Average Percentage Viewed (APV):** Target $\ge 105\%$ (achieved when audience watches through to the end and loops into Beat 1).
2. **DM Sends / Share Rate:** Target $\ge 4.5\%$ of total reach (the primary catalyst for Instagram/TikTok algorithmic breakout).
3. **Save Rate:** Target $\ge 6.0\%$ of total views (driven by clear, high-density technical payoff summaries).
4. **3-Second Retention Rate:** Target $\ge 78\%$ (driven by motion-rich Hook in Frame 0).

---

## 2. Drop-off Diagnostics & Remediation

| Drop-off Pattern | Root Cause | Remediation Rule |
|:---|:---|:---|
| **Sharp drop at 0.0s – 1.5s** | Static title card or weak hook. | Add immediate cascading motion and high-stakes allocation meter in Frame 0. |
| **Gradual decay at 4.0s – 8.0s** | Monotonous scene or passive lecture. | Insert interactive 2x2 Challenge grid and prompt viewer choice. |
| **Drop at 12.0s – 15.0s** | Overly complex mechanical diagram. | Use laser scanbeam with progressive node illumination. |
| **Drop at 18.0s+** | Premature payoff / long boring outro. | Cut outro down to $\le 1.2$s with Nemi celebration and immediate seamless loop. |
