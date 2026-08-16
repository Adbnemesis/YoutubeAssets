# Brawl Stars Phonk Edit (project_cool_edit)

This project contains the complete, self-contained Remotion setup for generating dynamic "Brawl Stars Phonk" edit videos. It has been fully isolated from the parent `remotion-composer` workspace so it can be cloned, installed, and run entirely on its own.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
- `npm` (comes with Node.js)

### Installation
To set up the project on a new device, simply clone the repository, navigate to this directory, and install the dependencies:

```bash
cd project_cool_edit
npm install
```

### Running the Studio (Preview)
To open the interactive Remotion Studio where you can preview the animation, tweak timings, and view changes in real-time, run:

```bash
npm start
```
This will launch a local server (typically at `http://localhost:3000`).

### Rendering the Video
To render a video, use the Remotion CLI with the mandatory output naming convention:

```bash
npx remotion render <CompositionId> out/<TemplateName>_<BrawlersOrTheme>_YYYY-MM-DD.mp4
```

### 🏷️ Output File Naming Convention (Mandatory)
All rendered video files in the `out/` directory MUST include the **Template Name**, **Brawlers / Theme**, and the **Date (`YYYY-MM-DD`)** to ensure version tracking and clear differentiation between renders.

**Standard Format:**
`out/<TemplateName>_<BrawlersOrTheme>_YYYY-MM-DD.mp4`

**Examples:**
- `out/BrawlMonsterTrio_SushiFamily_2026-08-16.mp4`
- `out/BrawlForms_BestFamily_2026-08-16.mp4`
- `out/BrawlCoolTrio_BibiEdgarFrank_2026-08-16.mp4`
- `out/BrawlBestChar_TaraEdgarCrow_2026-08-16.mp4`

## 📂 Project Structure

- **`src/`**: Contains all React and Remotion code.
  - `index.tsx`: The main entrypoint that registers the root composition.
  - `Root.tsx`: Aggregates every edit type's compositions into the Remotion root.
  - `edits/`: One folder per **edit type** (each can have its own templates & compositions).
    - `edits/brawl_forms/`: The "cool_edit.mp4" style phonk edit family (`PhonkPrototype`, `MangaPhonkEdit`, `MidnightTrio`).
      - `templates/`: The modular components (`MasterPhonkTemplate`, `DynamicGridReveal`, `DynamicPhonkClip`, etc.) that make up the edit.
      - `props.ts`: The default props (timings, colors, asset paths) for each composition in this edit type.
      - `index.tsx`: Registers this edit type's `<Composition>`s.
      - `docs/`: Blueprint + plan docs specific to this edit type.
      - `reference/`: The reference video (`cool_edit.mp4`) this edit replicates.
      - `data/`: Beat/timing data (`beats.json`) for this edit.
  - `legacy/`: Old prototype components no longer used by any composition.
- **`public/`**: The public dir is remapped to `assets/` in `remotion.config.ts`, so all asset paths in the code are relative to `assets/`. **`assets/` is shared across every edit type**.
- **`assets/`**: The shared asset pool (brawler sheets, extracted panels, emotes, VO, SFX, audio). Used by every edit type.
- **`docs/`**: Index of per-edit-type documentation.
- **`out/`**: The destination folder where the rendered `.mp4` files are saved.

## ➕ Adding a New Edit Type

1. Create `src/edits/<edit-name>/` with its own `templates/`, `props.ts`, `index.tsx`, `docs/`, `reference/`, and `data/` (copy the pattern from `src/edits/brawl_forms/`).
2. Register the new edit's compositions in `src/Root.tsx`.
3. Document it in `docs/README.md`.
4. All assets resolve relative to the shared `assets/` folder — no duplication needed.

## 🛠️ Modifying the Edit
If you want to change the timing of the drops, the colors, or the slide offset gaps, you can do so in each edit type's `props.ts` (see `src/edits/brawl_forms/props.ts` for the phonk edit family).

The slide-in animations (Left, Top, Bottom, Right) for the 4-panel grid are handled inside `src/edits/brawl_forms/templates/DynamicGridReveal.tsx`.
