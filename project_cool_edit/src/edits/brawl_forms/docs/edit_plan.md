# Brawl Stars Edit Plan & Asset Checklist

Since you prefer keeping everything centralized, we will use the main `project_cool_edit/assets/` folder for all your resources!

## 🛑 TEMPLATE FREEZE RULE
> [!IMPORTANT]
> The original prototype components (`MasterPhonkTemplate.tsx`, `DynamicPhonkClip.tsx`, `DynamicGridReveal.tsx`) are **STRICTLY FROZEN TEMPLATES**. They must act as the base foundation for all future edits. Do NOT modify these files. If a new edit requires changes (like the Manga-style static image drops), you must duplicate the template and create a new component (e.g., `MangaPhonkTemplate.tsx`).

## 💡 The Concept: "Toxic Assassins Trio" (Edgar, Mortis, Kenji)
Since you already have a ton of great audio (Edgar punch, Mortis attack, Kenji slashes) and expressions in your assets, this is the perfect first edit.
* **Form 1:** The 'Toxic' Pin / Thumbs Down 
* **Form 2:** Edgar (Red Aura)
* **Form 3:** Mortis (Purple/Dark Aura)
* **Form 4:** Kenji (Blue/Yellow Aura)

## 📥 Your Asset Checklist
Please place these into their respective folders in `project_cool_edit/assets/`.

### 1. Images (`assets/images/`)
* **4 Central Icons:** e.g., `icon_thumbs_down.png`, `icon_edgar.png`, `icon_mortis.png`, `icon_kenji.png` (Transparent PNGs are best).
* **16 Grid Panels:** 4 images for each of the 4 forms (square-ish ratio). 
  * Name them clearly: `form1_panel1.png`, `form1_panel2.png`, etc.
  * You can use the brawler expressions you already have (like `assets/expressions/edgar/angry.png`) or grab some fan-art!

### 2. Gameplay Clips
* **Don't worry about fetching new gameplay clips!** 
* I noticed you already have some great animated scenes in your workspace (e.g., `project_brawlstars/scenes/gale/gale_attack_scene.mp4`, `ash_attack_scene.mp4`, etc.). 
* If you want, we can literally just grab those existing MP4s and splice them into the fast-paced drop!
* **Alternatively**, if you want it to strictly be Edgar/Mortis/Kenji gameplay, you just need to find **4 to 8 short vertical clips** (MP4) of them and add them to `assets/video/`.
* The reference edit for this project lives in `src/edits/brawl_forms/reference/cool_edit.mp4`.

### 3. Audio (`assets/sound_effects/` or `assets/brawler_voices/`)
* You already have an amazing library here! We will definitely use `edgar_punch_impact.mp3`, `kenji_atk_sfx_02.mp3`, and `mortis_ulti_01.ogg` during the fast-paced gameplay drops to make the hits feel impactful.

---
**Once you have the 4 icons and 16 panels dropped into `assets/images/`, just let me know and I'll wire them up into the Remotion code immediately!**
