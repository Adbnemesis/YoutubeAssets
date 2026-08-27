# 22. Top 5 Claude Code Skills (`SKILL.md`) Carousel Specification

This document defines the content structure, educational narrative, and visual specification for the **"TOP 5 CLAUDE SKILLS (`SKILL.md`)"** Instagram Carousel.

---

## 1. Topic Context: The Agent Skills (`SKILL.md`) Open Standard

In Claude Code and the broader AI agent ecosystem (Anthropic, open standard at `agentskills.io`):
- A **Skill** is a specialized, version-controlled capability stored in a folder with a `SKILL.md` file.
- **Progressive Disclosure Architecture:**
  - **YAML Frontmatter (`name`, `description`):** Initially loaded into memory as a lightweight trigger index.
  - **Markdown Body:** Step-by-step Standard Operating Procedure (SOP), loaded into active context only when needed.
  - **Supporting Folders (`/scripts`, `/references`):** Executable bash/python scripts executed on-demand.

---

## 2. Slide-by-Slide Content & Storytelling Breakdown

### Slide 1: Hook Cover (Dark Charcoal Matte `#2C2F36`)
- **Tag:** `ai developer tools:` (Handwritten cursive)
- **Title:** `TOP 5 CLAUDE SKILLS` (Bold all-caps white with drop-shadow)
- **Mascot:** Ada Mascot (`explaining`) + Nemi sitting on her shoulder with stylus
- **Subtitle:** *How `SKILL.md` playbooks give AI coding agents persistent superpowers.*

### Slide 2: What is an Agent Skill? (Warm Cream `#FAF8F5`)
- **Header:** `What is a SKILL.md File?`
- **Core Concept:** Progressive disclosure and token efficiency.
- **Diagram:**
  - `1. YAML Frontmatter` $\to$ AI trigger description (Minimal memory footprint)
  - `2. Markdown Body` $\to$ Step-by-step SOP (Loaded only when invoked)
  - `3. /scripts & Assets` $\to$ Reusable execution tools
- **Takeaway:** *Zero context waste. Claude loads the full playbook only when your prompt needs it.*

### Slide 3: Skill #1 — Code Reviewer & Security Audit
- **Header:** `1. Code Reviewer & PR Gatekeeper`
- **What it does:** Automated pre-PR static analysis and security checks.
- **Checklist:**
  - 🔍 Scans diffs for memory leaks & security vulnerabilities
  - ⚡ Enforces team architectural rules and lint standards
  - 📝 Generates structured PR summaries & review notes
- **Takeaway:** *Ensures every PR meets your engineering quality bar automatically.*

### Slide 4: Skill #2 — Browser Testing & Automation (`browser-act`)
- **Header:** `2. Browser Testing (browser-act)`
- **What it does:** Live headless browser automation and visual verification.
- **Workflow Box:**
  - `Launch Browser 🌐` $\to$ `Interact with UI 🖱️` $\to$ `Capture Screenshot 📸` $\to$ `Verify Layout ✅`
- **Takeaway:** *Catches broken UI flows and visual glitches without leaving your terminal.*

### Slide 5: Skill #3 — Frontend Design System Builder
- **Header:** `3. Frontend Design & Component Builder`
- **What it does:** Enforces design tokens, accessibility, and modern micro-animations.
- **Spec Card:**
  - 🎨 Token-driven design system (curated HSL palettes & dark mode)
  - ♿ Full accessibility (ARIA labels & keyboard navigation)
  - ✨ Smooth micro-interactions and responsive layouts
- **Takeaway:** *Turns rough component ideas into production-grade frontend code.*

### Slide 6: Skill #4 — Self-Healing Test-Debug Loop
- **Header:** `4. Self-Healing Test-Debug Loop`
- **What it does:** Automated execution and iteration until test suites pass.
- **3-Step Sequence:**
  - ❌ **Step 1:** Run test suite $\to$ capture error stack trace
  - ⚡ **Step 2:** Surgical diff patching $\to$ fix target lines
  - ✅ **Step 3:** Re-verify $\to$ confirm 100% tests pass
- **Takeaway:** *Eliminates manual copy-pasting of error messages during debugging.*

### Slide 7: Skill #5 & Summary Cheat Sheet
- **Header:** `5. DB & Infra Manager + Quick Template`
- **What it does:** Safe database schema migrations and infrastructure management.
- **Template Code Box:**
  ```markdown
  ---
  name: db-migrator
  description: Safely plans and applies PostgreSQL schema migrations
  ---
  # Step-by-Step SOP:
  1. Inspect current schema in /prisma
  2. Generate migration SQL & dry-run
  3. Run verification tests
  ```
- **Takeaway:** *Save this cheat sheet to build your first Claude Skill! 📌 Follow @nemi.explains*
