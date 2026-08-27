# Brawl Stars compositions

Remotion compositions for the Brawl Stars project, living inside `project_brawlstars`.
They are rendered from the `remotion-composer` root by passing this folder's path
as the entry file.

## Attack scenes (composite the effect parts into a gameplay-style attack)

From `remotion-composer/`:

```bash
npx remotion render ../project_brawlstars/compositions/AttackSceneComposition.tsx GaleAttackScene out/frame-%03d.png --sequence
npx remotion render ../project_brawlstars/compositions/AttackSceneComposition.tsx GaleSuperScene out/GaleSuper.mp4 --codec=h264
```

Compositions:
| id | what | frames | fps | size |
|----|------|--------|-----|------|
| `GaleAttackScene` | snowball fan: muzzle + 6 shards + hit | 70 | 30 | 540x540 |
| `GaleSuperScene` | icy tornado: ~90 bolt/nut particles swirling | 160 | 30 | 540x540 |
| `AshAttackScene` | dust/trash clouds lobbed + impact | 70 | 30 | 540x540 |
| `KitSuperScene` | yarn burst + ground carpet | 110 | 30 | 540x540 |

PNG sequences (transparent) are generated under `project_brawlstars/scenes/<brawler>/...`;
`public/brawl/scenes` symlinks to that folder.

## Effect-part previews

`ScEffectPreviewComposition.tsx` — 3x2 grid of individual parts per brawler
(`GaleEffectPreview`, `AshEffectPreview`, `KitEffectPreview`). Used to inspect each
extracted `.sc` part.

## Notes

- Part frames + manifests live in `project_brawlstars/commonassets/brawler_effects/<brawler>/`
  (`public://brawl/effects` symlinks there).
- The parts are decoded by `tools/sc_converter/sc6_parser.py` (an SC6 flatbuffer
  decoder; the export string-reference indexing was fixed to match sc-editor).
- `tools/sc_converter/reference_renderer/` drives sc-editor's Java renderer for
  ground-truth stills when needed.