# 21. Instagram Tech Carousel Design & Visual Specification

This document establishes the official design guidelines, visual identity, typography, layout architecture, and storytelling framework for `@nemi.explains` Instagram tech carousels, derived directly from our master reference system.

---

## 1. Core Philosophy: Clean Aesthetic Anime & Manga Storytelling

Unlike futuristic cyber/neon sci-fi cards, our carousels follow a **minimalist, warm, manga-inspired aesthetic**:
- **Zero Clutter:** No neon laser grids, no heavy sci-fi borders, no glowing cyber HUDs.
- **Organic & Human:** Warm cream pages, clean charcoal typography, playful handwritten accents, and expressive anime character storytelling.
- **Hook & Contrast:** A dark charcoal matte cover with high-impact title $\to$ transitioning into clean, breathable off-white/cream content slides.

---

## 2. Color Palette System

| Surface | Color Hex | Usage |
| :--- | :--- | :--- |
| **Cover Background** | `#2C2F36` / `#262930` | Deep matte slate/charcoal (Slide 1 only) |
| **Content Slide Background** | `#FAF8F5` / `#F8F6F2` | Warm off-white/cream page for maximum readability |
| **Cover Title** | `#FFFFFF` | All-caps bold with subtle black drop-shadow |
| **Cover Tagline/Tag** | `#FFFFFF` | Cursive handwritten accent (`programming basics:`) |
| **Primary Text (Content)** | `#2D3748` / `#1E293B` | Deep readable charcoal for body paragraphs |
| **Emphasized Keywords** | `#0F172A` (Bold) / `#E11D48` | Bold text in dark charcoal or playful accent color |
| **Diagram Borders** | `#1E293B` (2.5px solid) | Crisp clean black borders with white interior |
| **Accent Red** | `#EF4444` / `#DC2626` | Crosses, errors, warnings |
| **Accent Green/Cyan** | `#10B981` / `#0284C7` | Success, matched items, highlights |

---

## 3. Typography Hierarchy

1. **Cover Tagline (Handwritten Accent):**
   - Font: `'Patrick Hand', 'Caveat', 'Comic Neue', cursive`
   - Weight: `600`
   - Example: `programming basics:`, `algorithm secrets:`, `system design:`
2. **Cover Main Headline:**
   - Font: `'Inter', 'Outfit', 'Plus Jakarta Sans', sans-serif`
   - Weight: `900 (Black)`
   - Text Transform: `UPPERCASE`
   - Example: `WHAT IS SYSCALL?`, `HOW GPS FINDS YOU?`
3. **Content Section Headers:**
   - Font: `'Patrick Hand', 'Comfortaa', 'Quicksand', sans-serif`
   - Weight: `800`
   - Example: `user mode`, `kernel mode`, `how it works`
4. **Content Body Text:**
   - Font: `'Comfortaa', 'Nunito', 'Plus Jakarta Sans', 'Inter', sans-serif`
   - Size: `26px – 32px` (on 1080x1350 canvas)
   - Line Height: `1.5`
   - Weight: `500 – 600`
   - Letter Spacing: `-0.3px`

---

## 4. Layout Architecture (4:5 Aspect Ratio: 1080 × 1350 px)

### Slide 1: Hook Cover (Dark Matte)
- **Top:** Handwritten topic tag (`programming basics:`) in white cursive.
- **Center-Top:** Massive bold all-caps title (`WHAT IS SYSCALL?`).
- **Center-Bottom:** Illustrated Anime Girl character with Nemi Mascot (or topic mascot like Linux Penguin) sitting on her shoulder.
- **Bottom:** Minimalist pagination indicator dots.

### Slides 2 – 5: Content & Deep Dive (Warm Cream)
- **Top Paragraph:** Conversational setup posing the mystery or misconception.
- **Center Visual Stage:** 
  - Clean box diagram (e.g. `hello.c` $\to$ keyboard/monitor).
  - Side-by-side anime meme comparison (e.g. funny anime student vs badass manga gigachad).
  - Simple 1-2-3 numbered points with generous line-spacing.
- **Bottom Paragraph:** Punchy revelation or explanation of the core concept.
- **Bottom:** Clean pagination dots.

### Slide 6: Summary & Action
- **Top:** Key takeaway or cheat sheet recap.
- **Center:** Final visual summary card.
- **Bottom:** Friendly call to action (*"Save this for your next interview 📌 Follow @nemi.explains"*).

---

## 5. Storytelling & Scripting Rules for Carousels

1. **Conversational First-Person Tone:** Talk directly to the reader (*"Your program has no access to hardware resources... You might think 'that can't be right.'"*).
2. **One Core Idea Per Slide:** Never overcrowd a slide. 2–3 sentences max + 1 clear visual per slide.
3. **Humor & Anime Meme Culture:** Use relatable anime character reaction tropes (e.g. nervous anime student for low privilege vs gigachad manga for kernel mode).
4. **Zero Fluff:** Get straight to the technical insight in plain English.
