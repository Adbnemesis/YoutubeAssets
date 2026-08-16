# project_cool_edit — Docs Index

Each **edit type** keeps its own documentation, reference video, and beat data inside its folder under `src/edits/<edit-type>/docs/`. This makes it easy to follow the right blueprint depending on which kind of edit you're building.

## Edit Types

### [`brawl_forms`](src/edits/brawl_forms/docs/brawl_stars_edit_blueprint.md) — Brawl Stars Forms Edit (cool_edit.mp4 style)
The original edit family. 4-form grid reveal intro, silhouette + reveal drop, all synced to `extracted_audio.wav` (~103 BPM).

Compositions: `PhonkPrototype`, `MangaPhonkEdit`, `MidnightTrio`

- [Brawl Stars Edit Blueprint](src/edits/brawl_forms/docs/brawl_stars_edit_blueprint.md) — full timing/structure/effects reference.
- [Edit Plan & Asset Checklist](src/edits/brawl_forms/docs/edit_plan.md) — asset checklist and concept notes.
- Reference video: `src/edits/brawl_forms/reference/cool_edit.mp4`
- Beat data: `src/edits/brawl_forms/data/beats.json`

### [`brawl_cool_trio`](src/edits/brawl_cool_trio/docs/blueprint.md) — Brawl Stars Trio Edit (trio_edit.mp4 style)
A fast character-card / glitch edit. Trio intro card, rapid character-pair cuts, then a mood-shifting (blue → green → red) climactic finale.

Composition: `BrawlCoolTrio` (Kenji/Edgar/Mortis, 1080x1080 @60fps, 14.48s)

- [Trio Edit Blueprint](src/edits/brawl_cool_trio/docs/blueprint.md) — full timing/structure/effects reference.
- Reference video: `src/edits/brawl_cool_trio/references/trio_edit.mp4`
- Audio (timing reference): `src/edits/brawl_cool_trio/data/trio_edit.wav`
- Render-ready audio: `assets/audio/sample_audio.wav`

## Conventions
- **Shared assets** live in `assets/` (remapped as the public dir). Every edit type references the same shared asset pool.
- **Per-edit docs** live in `src/edits/<edit-type>/docs/`.
- **Per-edit reference video** lives in `src/edits/<edit-type>/reference/`.
- **Per-edit beat/timing data** lives in `src/edits/<edit-type>/data/`.
- **Render Output Naming**: All renders saved to `out/` MUST follow the format `out/<TemplateName>_<BrawlersOrTheme>_YYYY-MM-DD.mp4` (e.g. `out/BrawlMonsterTrio_SushiFamily_2026-08-16.mp4`).

To add a new edit type, create `src/edits/<edit-type>/` with its own `docs/`, `reference/`, `data/`, `templates/`, `props.ts`, and `index.tsx`, then register it in `src/Root.tsx`.
