# 📉 NEMI EXPLAINS — RETENTION POST-MORTEM & GROWTH PLAYBOOK (AUG 2026)

> **Source:** Instagram Graph API insights for all 5 published reels (fetched 2026-08-22).
> **Status:** ACTIVE DOCTRINE. Wherever self-assessed scorecards conflict with this data, this document wins.

---

## 1. Field Data — Every Published Reel

| # | Reel | Date | Length | Views | Reach | Avg Watch | APV | Saves/Reach | Shares/Reach | Comments |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | CAPTCHA micro-tremors | 08-17 | 22.79s | 160 | 132 | **5.76s** | **25.3%** | 0.76% | 0.76% | 0 |
| 2 | google.com journey | 08-18 | 19.72s | 173 | 137 | **4.80s** | **24.3%** | 2.92% | 0.73% | 0 |
| 3 | Two Sum O(N²) trap | 08-19 | 24.47s | 246 | 198 | **3.49s** | **14.3%** | 0.51% | 0.00% | 0 |
| 4 | ChatGPT transformer | 08-20 | 25.61s | 117 | 108 | **3.33s** | **13.0%** | 0.93% | 0.00% | 0 |
| 5 | Dining Philosophers | 08-21 | ~22s* | 154 | 128 | **3.97s** | **~18%*** | 0.78% | 0.00% | 0 |

(\* analyzer hardcoded 20.0s — BUG: always store real durations, never guess.)

**Account:** 6 followers · ~740 lifetime reach · 0.8% follow conversion · views flat/declining (160→173→246→117→154). Each reel dies inside its first algorithmic test batch (~110–200 accounts) — the signature of below-threshold retention.

---

## 2. Diagnosis (Ranked by Leverage)

1. **HOOK FAILURE (primary).** Avg watch 3.3–5.8s on 20–26s videos = the majority swipes inside 0–3s. Internal hook self-scores (9.8–10/10) measured intent, not behavior. The first frame as executed opens with scene-setting/title-card energy, not the anomaly itself. Fix lives in `06_HOOK_SYSTEM.md` §5–6.
2. **NICHE MISMATCH.** Everyday mysteries (CAPTCHA 25.3%, google.com 24.3%) retain ~**1.8× better** than developer-niche topics (Two Sum 14.3%, ChatGPT 13.0%). The audience voted. Editorial mix shifts toward Everyday Tech Mysteries until further data says otherwise.
3. **PAYOFF PLACED WHERE NOBODY IS.** Saveable/shareable takeaway cards sit at 16–25s — exactly where 75–87% of viewers are already gone. Saves/shares happen AT the payoff; ours is structurally unreachable. Fix in `07_STORYTELLING_SYSTEM.md` §6.
4. **EDIT ENERGY TOO LOW.** Gentle StageWrapper crossfades + atmospheric synthwave read as a slideshow. Feeds reward punch. Fix in `07_STORYTELLING_SYSTEM.md` §6.
5. **ZERO ENGAGEMENT MANUFACTURING.** 0 comments across 5 reels; Commandment #8 (pin a debate question) executed 0/5 times. 0 follow triggers (no episode numbering, no pinned reels).
6. **DURATION DOC DRIFT.** Docs contradicted each other (18–24 vs 23.5–25.8 vs 24–25.8). Resolved: **19–22s target, 24.0s hard cap.** NOTE: length is NOT the primary problem — hook is. Do not shrink below 18s; the brand needs room for a real story. Just stop creeping past 24s (the two longest reels were the two worst).

---

## 3. Doctrine Changes (Where They Live)

| Change | Document |
|---|---|
| Frame-0 Reality Rules (money shot first, ≤8-word contradiction overlay, no title cards, 3 hook variants) | `06_HOOK_SYSTEM.md` §5–6 |
| Edit Energy Overhaul (beat-synced punch cuts, punch-in accents, payoff by 55–60%, loop seam, BGM energy floor) | `07_STORYTELLING_SYSTEM.md` §6 |
| Duration unified: 19–22s target, 24s cap | `12_QUALITY_CONTROL.md`, `20_CURRENT_BEST_PRACTICES.md` |
| Field baseline + interim targets + post-mortem protocol | `13_ANALYTICS_SYSTEM.md` §0 |
| Self-scorecards demoted to advisory; retention data is the only verdict | this file |

---

## 4. Next-Reel Queue (Data-Ranked, Everyday Mysteries First)

| Priority | Topic | Archetype | Frame-0 Anomaly | On-Screen Hook (≤8 words) | Status |
|---|---|---|---|---|---|
| 1 | **QR codes survive damage** (Reed–Solomon; UPI angle) | Mystery | A sharpie-scribbled QR code **scanning successfully** ✓ | *"You destroyed this code. It still worked."* | ✅ RENDERED → published as Ep.6 (`qr_06`, `out/NemiExplains_QR_20260822.mp4`) |
| 2 | **Shazam in 0.3 seconds** (spectrogram fingerprints) | Behind The Scenes | Waveform fingerprint constellations locking mid-match | *"This song was ID'd from 0.3 seconds."* | ✅ RENDERED as Ep.7 (`shazam_07`, `out/NemiExplains_Shazam_20260822.mp4`) |
| 3 | **GPS finds you with deaf satellites** (trilateration) | Hidden Journey | Three expanding satellite spheres intersecting on a pin | *"Your phone is silent. Satellites still find you."* | ✅ RENDERED as Ep.10 (`gps_10`, `out/NemiExplains_Gps_20260822.mp4`, -15.93 LUFS) — publish next |
| 3.5 | **Noise cancelling fights noise with noise** (inverse phase) | Mystery | Two waveforms annihilating into a flat zero line | *"Silence is made of sound."* | ✅ RENDERED as Ep.11 (`noise_11`, `out/NemiExplains_Noise_20260822.mp4`, -16.0 LUFS, BGM: Death of a Bluebird per rotation rule) |
| 4 | **Deleted files aren't deleted** (inodes/unlink) | Wrong Assumption | Trash empties → hex data still sitting on disk | *"POV: you just emptied your trash. Nothing got deleted."* | ✅ RENDERED as Ep.12 (`trash_12`, `out/NemiExplains_Trash_20260823.mp4`) — first reel under v3 doctrine: POV hook pattern, full-bleed f0, 2.5s pattern-interrupt, chained suspense, ⚡ SFX-only audio experiment |
| 5 | **Tap-to-pay crosses the world in 1.8s** | Hidden Journey | Card tap ripple → packet racing fiber map | *"Your ₹500 went around the world in 1.8s."* | ⏳ QUEUED |

> NOTE (2026-08-22): Ep.8 (`tokenize_08`) and Ep.9 (`mcp_09`) were produced from the
> 200-topic matrix (AI/systems + dev tools) rather than this queue. Their T+48h metrics must be
> compared against Ep.6/Ep.7 to re-test the everyday-mystery hypothesis before queue item #5 ships.

Ship ONE next. Render 3 hook variants of it before publishing anything else.

---

## 5. Distribution & Engagement Protocol (Every Upload)

- Pin a **debatable question** as your own first comment within 60s of posting; reply to everything for the first 2 hours.
- **No episode numbers anywhere on screen** (removed 2026-08-23 — numbering reads as insider serialization and confuses cold viewers; the watermark stays `@nemi.explains` only). Pin the top-3 reels on profile instead. Give strangers a reason to follow via pinned comments, not counters.
- Cross-post the master MP4 to **YouTube Shorts + TikTok same day** (three lottery tickets, zero extra render cost).
- Daily cadence holds. Test posting 12:30–15:00 IST.

---

## 6. T+48h Checkpoint Decision Tree

Log per reel: views, reach, avg watch, APV, 3s retention graph (IG app screenshot), follows, saves, shares, comments.

- **APV ≥ 40% and views climbing** → scale the topic family; consider a longer cut.
- **Views < 300 and APV < 35%** → hook failed. Pull the retention curve, identify the exact second of collapse, rebuild frames 0–3 before rendering anything new.
- **Saves ≥ 2.5% but APV < 30%** → payoff is landing but too late. Restructure the arc (payoff by 55–60%).
