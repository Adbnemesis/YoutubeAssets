# OpenMontage

**MANDATORY: Read `AGENT_GUIDE.md` before responding to ANY user message.**

Do not act on the user's request until you have read AGENT_GUIDE.md.
It contains routing rules that determine your first action based on what the user asked.
Skipping it WILL cause you to take the wrong action.

There are no instructions in this file. All instructions are in AGENT_GUIDE.md.

---

## 🛑 MANDATORY ANTIGRAVITY VIDEO EDITING & FORENSIC RULES

1. **`edit_analysis.json` is the temporal source of truth.**
2. **Always use exact frame numbers when available.**
3. **Never guess timing from visual inspection if analyzed data exists.**
4. **Never say "around 3 seconds" when the analyzer provides frame 193.**
5. **Audio beats, cuts, transitions, visual events, and speech must share the same frame-based timeline.**
6. **Use the analyzer to determine WHEN.**
7. **Use visual analysis / VLM to determine WHAT.**
8. **Use Remotion to determine HOW.**
9. **Before finalizing a recreation, render it and run the reference-vs-output comparison (`compare.py`).**
10. **Fix timing mismatches based on the comparison report.**
11. **Never hallucinate events or semantic labels.**
12. **Every uncertain event must have a confidence value.**
13. **Prefer deterministic measurements over AI guesses.**
14. **The goal is not to make a similar edit.**
15. **The goal is to reproduce the reference edit's timing, rhythm, transitions, motion, and synchronization as accurately as possible.**
