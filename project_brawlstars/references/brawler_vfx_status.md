# Brawler VFX Effects Status

This document details the exact effects used for each Brawler's Attack and Super, and their current rendering status in `preview_vfx.html` / `AttackSceneComposition.tsx`.

> Flight-time fix: moving projectiles now **loop their short clip for the whole flight** instead of vanishing after their few frames (e.g. Gale's 6-frame snowball, Nani's 2-frame orb). This is why the earlier Gale preview dropped a bolt mid-flight.

| Brawler | Ability | Mechanic | Main SC Parts Used | Render Status |
|---|---|---|---|---|
| **Gale** | Attack | Fan of **6** snowballs flying in parallel, all staying visible to impact. | `gale_006_atk_projectile` ×6 (looped), `gale_006_atk_trail_twinkle`, `gale_006_atk_muzzle_01/02`, `gale_006_atk_hit`, `gale_006_atk_reached` | ✅ Fixed (all 6 bolts now persist) |
| **Gale** | Super | Massive, wide, high-speed gust of wind/ghosts (no landing-wall part). | `gale_006_ulti_projectile` ×7 (looped), `gale_006_ulti_trail_nuts_01`, `gale_006_ulti_trail_bolts_01` | ✅ Good |
| **Ash** | Attack | Rapid sequential ground shockwave of dust. | `ash_008_atk_cloud_01`, `ash_008_atk_impact01` | ✅ Perfect |
| **Ash** | Super | Lobbed projectile exploding into a rat-cloud burst (no `ulti_rat_*` parts exist; uses the real landing-explosion parts). | `ash_008_ulti_projectile`, `ulti_reached_explode01`, `ulti_reached_cloud_01/02` | ✅ Perfect |
| **Kit** | Attack | Friendly attach: thrown yarn-ball lob that lands & explodes. | `kit_def_oc_ulti_projectile` (looped), `kit_def_oc_ulti_explode` | ✅ Fixed |
| **Kit** | Super (friendly/ally) | Yarn-ball lob that attaches to an ally, bursts into a ground carpet. | `kit_def_oc_ulti_projectile`, `kit_def_oc_ulti_explode`, `kit_def_oc_ulti_ground`, `kit_def_oc_ulti_wool`, `kit_def_oc_ulti_grass_01/02` | ✅ Fixed (2 Super modes) |
| **Kit** | Super (enemy) | **Red** attach that deals damage — electric trails + red ground/grass. | `kit_def_oc_ulti_projectile_red`, `kit_def_oc_ulti_trail_elec_red_01/02/03`, `kit_def_oc_ulti_explode`, `kit_def_oc_ulti_ground_red`, `kit_def_oc_ulti_grass_red_01/02` | ✅ Fixed (2 Super modes) |
| **Mortis** | Attack | Instant dash strike with slash and wind area. | `mortis_def_oc_atk_slash`, `mortis_def_oc_atk_area` | ✅ Perfect |
| **Mortis** | Super | Swarm of 5 layered bats flying rapidly. | `mortis_009_ulti_projectile`, `mortis_009_ulti_reached` | ✅ Perfect |
| **Hank** | Attack | Expanding water balloon playing pre-rendered animation. | `hank_004_atk_graffiti` | ✅ Perfect |
| **Hank** | Super | Hexagonal spread of 6 torpedoes firing outward. | `hank_004_ulti_projectile` | ✅ Perfect |
| **Willow** | Attack | Lobbed lantern projectile forming a poison puddle. | `willow_004_atk_muzzle`, `willow_004_atk_pond` | ✅ Perfect |
| **Willow** | Super | Straight mind-control tadpole projectile. | `willow_004_ulti_mindcontrol`, `willow_004_ulti_reached` | ✅ Perfect |
| **Nani** | Attack | 3 light orbs curving in a diamond to converge, sparkle trails + impact sphere. | `nani_007_atk_projectile` ×3 (looped), `nani_007_atk_twinkle_01`, `nani_007_atk_reached_sphear`, `nani_007_atk_hit` | ✅ Fixed (orbs no longer vanish; scaled hit) |
| **Nani** | Super | Player-steered Peep loops in and detonates with a full explosion column + floor + impact. | `nani_007_ulti_projectile_trail_1/2` (looped), `nani_007_ulti_explode_sphere_blue`, `nani_007_ulti_explode_huge_impact`, `nani_007_ulti_explode_huge_floor`, `nani_007_ulti_explode_huge` | ✅ Fixed (scaled to fit canvas) |

### Short #3 (Gale / Mortis / Hank / Willow) — game-accurate supers

| Brawler | Ability | Mechanic | Main SC Parts Used | Render Status |
|---|---|---|---|---|
| **Gale** | Super (Gale Force) | Wide 5-chunk snow WALL sweeps forward and knocks the target backward (`push`). | `gale_006_ulti_projectile` ×5, `ulti_trail_nuts_01`, `ulti_trail_bolts_01` | ✅ |
| **Willow** | Super (Mind Control) | Spirit line flies out, latches on, target **dragged toward Willow** (`control`). | `willow_004_ulti_mindcontrol`, `willow_004_ulti_reached` | ✅ |
| **Mortis** | Attack | Dash streak across + slash arc + ground shockwave. | `mortis_009_atk_dash`, `mortis_def_oc_atk_slash`, `mortis_def_oc_atk_area` | ✅ |
| **Hank** | Attack | Expanding water balloon grows mid-flight then pops | `hank_004_atk_graffiti`, `hank_004_ulti_atk_impact`, `hank_004_ulti_hit_impact` | ✅ |
| **Willow** | Attack | Arced lantern lob → splash + poison pond | `willow_004_atk_muzzle`, `trail_particle`, `atk_splash`, `atk_pond` | ✅ |

## Shorts

| Short | Brawlers | Winner | Fight VFX | Status |
|---|---|---|---|---|
| `shorts/project_brawlstars_short_2_v2` | Melodie / Bibi / Gale / Crow | Melodie | Bibi/Gale/Crow/Melodie (mix of .sc + SVG) | ✅ rendered |
| `shorts/project_brawlstars_short_3` | Gale / Mortis / Hank / Willow | **Gale** 🔥 | **Attack VFX**: Gale `GaleScAttack`, Mortis `MortisScDash`, Hank `HankScAttack`, Willow `WillowScAttack` | ✅ rendered |

Fight #3 (short_3) uses ONLY real .sc attack VFX and mirrors the reference
combat flow with the BGM ducked to zero during the brawl.

## Selection UI

The scene dropdown is now populated per-brawler, so **Kit** exposes **3 scenes** (Attack / Super *Friendly* / Super *Enemy*). `<select id="sceneSelect">` is rebuilt from `SCENES[currentBrawler]` keys via `populateScenes()`.

## Nani sizing

- `nani_007_atk_hit` / `ulti_explode_huge` canvases are huge (1798px / 1456×2840). They are now drawn with **anchor-aware scaling** (`manifest.anchor` + `/manifest.scale`) and explicit low `scale` values so they fit the 540×540 preview instead of overflowing.

> [!NOTE]
> All complex trajectories (Parabolic arcs via `arc: X` and Bezier Curves via `cx, cy`) work in both `preview_vfx.html` and `AttackSceneComposition.tsx`.