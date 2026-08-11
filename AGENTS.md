# OpenMontage

**MANDATORY: Read `AGENT_GUIDE.md` before responding to ANY user message.**

Do not act on the user's request until you have read AGENT_GUIDE.md.
It contains routing rules that determine your first action based on what the user asked.
Skipping it WILL cause you to take the wrong action.

There are no instructions in this file. All instructions are in AGENT_GUIDE.md.

---

## CRITICAL VIDEO ANALYSIS SOURCE OF TRUTH RULE

THE VIDEO ANALYSIS DATA IS THE SOURCE OF TRUTH.

Never guess timing.

Never say:
"around 3 seconds"
"roughly on the beat"
"approximately 10 frames later"

If analysis says frame 193:
USE FRAME 193.

If analysis says a beat occurs at frame 193:
SYNCHRONIZE THE ANIMATION TO FRAME 193.

If analysis says a transition starts at frame 193:
START THE TRANSITION AT FRAME 193.

Always prefer analyzed frame numbers over visual estimation.
