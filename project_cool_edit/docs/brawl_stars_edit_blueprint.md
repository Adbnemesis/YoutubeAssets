# Brawl Stars Edit Blueprint

This document details the exact timing, structure, and visual effects required to replicate the `cool_edit.mp4` reference video using Brawl Stars assets. 

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

This section follows a strict pattern: A central icon appears, followed by 4 images popping into a grid on the beat, followed by a transition to the next "Form".

#### The 4-Image Grid Reveal Sequence
Each form transitions by presenting a central Icon, and then rapidly pulling in 4 separate panels from the four edges of the screen to form a complete 2x2 grid.

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

### Phase 3: The Phonk Drop & Rapid Montage (10.70s - 21.92s)

> [!IMPORTANT]
> The vocal shouts "Vai jogando..." and the heavy bass drops. Every timestamp below is a major bass hit or snare. You MUST apply a **Camera Shake**, **Scale Bump (Pump effect)**, or a **Hard Scene Cut** at every single one of these timestamps.

**Key Drop Timestamps (in seconds):**
- **10.69s** (THE DROP: Hardest camera shake, flash to white, cut to most epic gameplay clip)
- **11.13s** (Snare hit -> Cut or Pump)
- **11.28s** (Kick -> Cut or Pump)
- **11.56s** (Kick -> Cut or Pump)
- **11.87s** (Snare hit -> Cut or Pump)
- **12.15s** (Kick -> Cut or Pump)
- **12.43s** (Kick -> Cut or Pump)
- **13.02s** (Snare hit -> Cut or Pump)
- **13.45s**
- **13.61s**
- **13.89s**
- **14.19s**
- **14.47s**
- **14.76s**
- **15.36s**
- **15.78s**
- **15.94s**
- **16.21s**
- **16.52s**
- **16.79s**
- **17.08s**
- **17.68s**
- **18.11s**
- **18.55s**
- **18.85s**
- **19.13s**
- **19.42s**
- **20.00s**
- **20.44s**
- **20.59s**
- **20.87s**
- **21.17s**
- **21.45s**
- **21.74s** (Final Beat)

*Note: For the best results during the drop, alternate between scene cuts and scale bumps (zooming in 110% and bouncing back to 100% instantly) to maintain visual momentum without making it impossible to see what's happening.*

## Location of Assets
- Extracted Audio: `[project_cool_edit/assets/audio/extracted_audio.wav](file:///Users/talus/Downloads/youtube_ai/OpenMontage/project_cool_edit/assets/audio/extracted_audio.wav)`
- Raw JSON Beat Data: `[project_cool_edit/data/beats.json](file:///Users/talus/Downloads/youtube_ai/OpenMontage/project_cool_edit/data/beats.json)`
