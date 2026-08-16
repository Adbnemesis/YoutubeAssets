# Brawl Stars Edit Blueprint

## 🛑 TEMPLATE FREEZE RULE
> [!IMPORTANT]
> The original prototype components (`MasterPhonkTemplate.tsx`, `DynamicPhonkClip.tsx`, `DynamicGridReveal.tsx`) are **STRICTLY FROZEN TEMPLATES**. They must act as the base foundation for all future edits. Do NOT modify these files. If a new edit requires changes (like Manga-style static image drops), you must duplicate the template and create a new component (e.g., `MangaPhonkTemplate.tsx`).

This document details the exact timing, structure, and visual effects required to replicate the `cool_edit.mp4` reference video (`src/edits/brawl_forms/reference/cool_edit.mp4`) using Brawl Stars assets. 

The audio track (`extracted_audio.wav`) has a tempo of **~103 BPM** and a total duration of **21.92 seconds**.

## Asset Requirements Checklist

To perfectly match the Dragon Ball Z edit structure, you will need the following Brawl Stars assets:

### The "Form" Icons (Central Images)
You need 4 core "icons" (e.g., a Brawler's logo, pin, or face with a transparent background):
- [ ] **Icon 1** (e.g., Shelly Base)
- [ ] **Icon 2** (e.g., Colt Base)
- [ ] **Icon 3** (e.g., Spike Base)
- [ ] **Icon 4** (e.g., Crow Base or Hypercharge logo)

### The 4-Panel Grid Images
For each of the 4 forms, you need 4 high-quality action shots/artworks (16 images total):
- [ ] **Form 1 Set:** 4 images (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
- [ ] **Form 2 Set:** 4 images
- [ ] **Form 3 Set:** 4 images
- [ ] **Form 4 Set:** 4 images

### The Drop Montage Clips
For the rapid-fire beat drop section, you need high-energy, fast-paced gameplay clips:
- [ ] **~25-30 short gameplay clips** (e.g., trick shots, super activations, team wipes, hypercharge animations).

---

## Detailed Timing & Effects Guide

> [!TIP]
> **Pro Tip for Editing:** In your editing software (Premiere/After Effects/Remotion), align your timeline markers to the exact timestamps below. Every "Onset" should have a visual impact (a zoom punch, a screen shake, or a hard cut).

### Phase 1: The Intro & Grid Reveals (0.00s - 10.70s)

This section follows a strict pattern: A central icon appears, followed by 4 images- **Background Overlap:** Keep the glowing background from Phase 2 on the screen while the Phase 3 silhouette slides in over it to create depth.
- **Dynamic Glow:** Use `radial-gradient(circle, ${auraColor}44 0%, #050505 70%)` behind the grid panels so the black background feels alive and pulsing with the brawler's core energy color.
- **Intro Text:** Add a massive, glitchy or spring-loaded "TOXIC ASSASSINS" text element in the first 2 seconds to hook the viewer immediately.

#### The 4-Image Grid Reveal Sequence
Each form transitions by presenting a central Icon, and then rapidly pulling in 4 separate panels from the four edges of the screen to form a complete 2x2 grid. 

> [!IMPORTANT]
> **Panel Impact Shake:** Whenever the 2nd, 3rd, and 4th panels land into their designated quadrants, the entire grid must undergo a **violent screen shake** to give maximum impact to every new image appearing.

**Slide Directions:**
- **Quadrant 1 (Top-Left):** Slides from the **Left Edge** to the Right.
- **Quadrant 2 (Top-Right):** Slides from the **Top Edge** to the Bottom.
- **Quadrant 3 (Bottom-Left):** Slides from the **Bottom Edge** to the Top.
- **Quadrant 4 (Bottom-Right):** Slides from the **Right Edge** to the Left.

#### Form 1 (0.00s - 3.60s)
- **0.00s**: Display **Icon 1** in the center. Background is a solid or gradient color (e.g., Yellow/Gold).
- **0.10s**: **Top-Left Panel** slides in from the Left.
- **1.45s**: **Top-Right Panel** slides in from the Top.
- **1.85s**: **Bottom-Left Panel** slides in from the Bottom.
- **2.22s**: **Bottom-Right Panel** slides in from the Right.

#### Form 2 (3.60s - 5.95s)
- **3.60s**: **Hard Cut/Flash** to **Icon 2**. Background color shifts (e.g., to Red).
- **3.70s** (Offset 0.1s): Bottom-Right Panel appears.
- **4.40s** (Offset 0.8s): Top-Left Panel appears.
- **5.05s** (Offset 1.45s): Bottom-Left Panel appears.
- **5.45s** (Offset 1.85s): Top-Right Panel appears.

#### Form 3 (5.95s - 8.33s)
- **5.95s**: **Hard Cut/Flash** to **Icon 3**. Background color shifts (e.g., to Blue).
- **6.00s** (Offset 0.05s): Top-Right Panel appears.
- **6.80s** (Offset 0.85s): Bottom-Left Panel appears.
- **7.40s** (Offset 1.45s): Top-Left Panel appears.
- **7.80s** (Offset 1.85s): Bottom-Right Panel appears.

#### Form 4 (8.33s - 10.55s)
- **8.33s**: **Hard Cut/Flash** to **Icon 4**. Background color shifts (e.g., to Purple).
- **8.40s** (Offset 0.07s): Top-Left Panel appears.
- **9.20s** (Offset 0.87s): Bottom-Right Panel appears.
- **9.78s** (Offset 1.45s): Top-Right Panel appears.
- **10.18s** (Offset 1.85s): Bottom-Left Panel appears.

### Phase 2: The Build-Up (9.68s - 10.70s)

> [!WARNING]
> This is a crucial transition. The music starts to distort and build up to the drop.

- **9.68s - 10.69s**: Use a rapid spinning or zooming transition. Flash through the 4 forms or spin the grid incredibly fast. Add heavy motion blur and chromatic aberration.

### Phase 3: The Drop (Silhouettes & Revealing)
- **Drop Cuts:** 
  - Precise timing is key! Start the first cut precisely when the beat drops (e.g. `10.700` instead of `11.083`) to overlap with the previous Phase 2 form.
- **Silhouette Mechanic:** 
  - Instead of trying to use `brightness(0) invert(1)`, use `drop-shadow(5000px 0 0 ${color})` and offset the image by `-5000px` to create a perfect solid colored silhouette.
  - Animate the silhouette to spring/slide up from the bottom of the screen.
- **Seamless Video & GIF Reveal (Continuous Playback Rule):** 
  - When cutting from the silhouette sequence to the full-color reveal sequence, the animation MUST continue seamlessly without repeating or restarting from frame 0.
  - `PhonkFormsMasterTemplate` automatically calculates the continuous `videoStartFrame` using `Math.round(elapsedTimeSeconds * gifFps)` based on the brawler's specific GIF FPS (e.g. 24 FPS for standard brawlers, 10 FPS for Frank).
  - **Rule for `props.ts`**: Do NOT hardcode `videoStartFrame: 0` on full-color reveal clips. Omit `videoStartFrame` on reveal clips so the template automatically synchronizes continuous frame progression from the silhouette phase into the full-color reveal.
- **Action Shots:** After the character reveal, quick-cut 3 consecutive panels to match the 3 fast bass kicks.

### Phase 4: Final Impact
- **End Timing:** Stop the video exactly when the final brawler's final action shot completes. For 3 brawlers, this is usually around 19.5 seconds (`~585` frames). Don't let it linger.

*Example Mapping for 3 Characters (15 Beats):*
- 10.70s: Edgar Silhouette (Red)
- 11.08s: Edgar Reveal (WebM)
- 11.45s: Edgar Action 1
- 12.18s: Edgar Action 2
- 12.55s: Edgar Action 3
- 12.92s: Mortis Silhouette (Purple)
- 13.68s: Mortis Reveal (WebM)
- 14.43s: Mortis Action 1
- 15.18s: Mortis Action 2
- 15.57s: Mortis Action 3
- 15.93s: Kenji Silhouette (Green/Yellow)
- ...and so on.

> [!IMPORTANT]
> **Every Beat Must Hit Hard:** You MUST apply a Camera Shake, Scale Bump (Pump effect), or a Hard Scene Cut at every single one of these timestamps.

*Note: For the best results during the drop, alternate between scene cuts and scale bumps (zooming in 110% and bouncing back to 100% instantly) to maintain visual momentum without making it impossible to see what's happening.*

## Location of Assets
- Reference Video: `[project_cool_edit/src/edits/brawl_forms/reference/cool_edit.mp4](file:///Users/talus/Downloads/youtube_ai/OpenMontage/project_cool_edit/src/edits/brawl_forms/reference/cool_edit.mp4)`
- Extracted Audio: `[project_cool_edit/assets/audio/extracted_audio.wav](file:///Users/talus/Downloads/youtube_ai/OpenMontage/project_cool_edit/assets/audio/extracted_audio.wav)`
- Raw JSON Beat Data: `[project_cool_edit/src/edits/brawl_forms/data/beats.json](file:///Users/talus/Downloads/youtube_ai/OpenMontage/project_cool_edit/src/edits/brawl_forms/data/beats.json)`
