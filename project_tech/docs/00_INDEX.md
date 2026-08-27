# 📚 NEMI EXPLAINS — DOCUMENTATION INDEX & SOURCE-OF-TRUTH ORDER

> **PURPOSE:** One entry point for all `project_tech/docs/` documents, plus an explicit
> precedence order so contradictory statements never have to be guessed at again.
> **Last audited:** 2026-08-22

---

## 1. Which Document Wins? (Precedence Order)

When two documents disagree, the **lowest number in this list wins**:

1. **`26_RETENTION_POSTMORTEM_AND_PLAYBOOK.md`** — field data verdicts. Overrides everything.
2. **`13_ANALYTICS_SYSTEM.md` §0** — measured baselines and interim targets.
3. **`06_HOOK_SYSTEM.md` §5–6** and **`07_STORYTELLING_SYSTEM.md` §6** — mandatory execution
   rules amended from field data.
4. **Per-reel case studies (`docs/reels/<slug>/V*.md`)** — as-built records of what actually
   shipped (they document real parameters used by the latest reels).
5. **`20_CURRENT_BEST_PRACTICES.md` / `25_MASTER_STYLE_REFERENCE.md`** — craft reference.
6. All remaining system docs (01–05, 08–12, 14–24).

### Known Historical Contradictions (do NOT re-litigate; these are resolved)

| Topic | Canonical value | Superseded values |
|---|---|---|
| BGM pre-gain | Dynamic story arc envelope `0.25–0.42` (as-built in reel scripts) | Static `0.50–0.55` (doc 08/12); flat `0.23` (doc 21) |
| Sidechain ducking | `threshold=0.08 : ratio=2.5 : attack=35ms : release=160ms` | `threshold=0.06 : ratio=10 : attack=15ms : release=300ms` |
| Cream canvas hex | `#FAF8F5` (comps use this) | `#F8F6F0`, `#FBFBF9` (older docs) |
| Duration | **19–22s target, 24.0s hard cap** | 18–24 / 23.5–25.8 variants |
| Layout doctrine | Full-canvas distribution w/ Nemi mid-screen OR docked — follow the per-reel case study | Fixed "captions 1140px only" layouts |

---

## 2. Reading Order for a New Reel

1. `00_PROJECT_NORTH_STAR.md` — why the brand exists
2. `04_CONTENT_PILLARS.md` (+ interim override) — what to make next
3. `24_CONTENT_IDEA_MATRIX.md` — topic pick
4. `24_NEW_REEL_CHECKLIST.md` — step-by-step production procedure
5. `06_HOOK_SYSTEM.md`, `07_STORYTELLING_SYSTEM.md` — Frame-0 & edit-energy law
6. `02_VISUAL_SYSTEM.md`, `03_NEMI_CHARACTER_BIBLE.md`, `25_MASTER_STYLE_REFERENCE.md` — look
7. `08_AUDIO_SYSTEM.md`, `10_CHATTERBOX_VOICE_SYSTEM.md` — sound
8. `09_REMOTION_ARCHITECTURE.md`, `11_CONTENT_SCHEMA.md` — engineering
9. `12_QUALITY_CONTROL.md` — gate before render
10. `26_RETENTION_POSTMORTEM_AND_PLAYBOOK.md` — publish protocol & T+48h decision tree

---

## 3. Document Map

### Core System
| Doc | Contents |
|---|---|
| `00_PROJECT_NORTH_STAR.md` | Mission, moats, audience, monetization phases |
| `00_NEMI_EXPLAINS_MASTER_GUIDE.md` | Consolidated master spec (retention blueprint, safe zones, catalog) |
| `MASTER_BLUEPRINT.md` | ⚠️ DEPRECATED (V01 archive, kept for history) |
| `NEMI_MASTER_OPERATING_SYSTEM.md` | ⚠️ SUPERSEDED (consolidated into master guide) |
| `01_BRAND_BIBLE.md` … `05_REEL_FORMATS.md` | Brand, visuals, character, pillars, formats |
| `06_HOOK_SYSTEM.md` … `12_QUALITY_CONTROL.md` | Hooks, storytelling, audio, Remotion, TTS, schema, QC |
| `13_ANALYTICS_SYSTEM.md` … `16_REFERENCE_ANALYSIS.md` | Analytics, sponsorship, automation, benchmark audit |
| `17_VERSION_HISTORY.md` … `19_KNOWN_FAILURES.md` | History, creative decisions, regression list |
| `20_CURRENT_BEST_PRACTICES.md` … `26_RETENTION_POSTMORTEM_AND_PLAYBOOK.md` | Laws, frozen core, lessons, archetypes, idea matrix, checklist, style, post-mortem playbook |

### Per-Reel Case Studies
`docs/reels/captcha_01/`, `garbage_collection/`, `google_com/`, `floating_point*/`,
`qr_06/`, `shazam_07/`, `gps_10/`

---

## 4. Maintenance Rules (added 2026-08-22)

1. New doctrine changes go into the canonical doc AND get a one-line pointer here.
2. When a value changes, update *every* doc that states it — or mark the old doc superseded.
3. Every rendered reel gets a case study under `docs/reels/<slug>/`.
4. Real durations/metrics are recorded per reel — never hardcoded, never guessed.
