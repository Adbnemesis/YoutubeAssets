# Reference renderer (sc-editor)

The Python extractors in `../` (`extract_effects.py`, `extract_effects_v6.py`) decode the
SC6 flatbuffer and rasterize with `sc5_parser`. Byte-for-byte checks (see
`DumpColorBanks.java`) prove the **decoded data** (matrices, color transforms, frame
elements) matches the official decoder in
[sc-editor](https://github.com/danila-schelkov/sc-editor) exactly. The software
rasterizer, however, does not composite the way the game's OpenGL pipeline does, so
colors/geometry of some exports come out wrong (e.g. Gale's projectile rendered
grey/red instead of the reference's mint/teal).

For ground-truth frames, drive sc-editor's own renderer with `BatchRender.java`.

## What was done

1. Installed `openjdk@17` + `flatbuffers` via Homebrew, plus the KTX-Software CLI
   tools (`ktx`, `ktx2ktx2`) extracted from the `-Darwin-arm64.pkg` release.
2. Cloned and built the three `dev.donutquine` deps from source
   (`sc-file` v1.0.4/1.0.3, `supercell-swf` v1.2.0, `supercell-texture` v1.0.1),
   installed into `~/.m2`.
3. Built `sc-editor` (`./mvnw -DreleaseVersion=1.0.0 compile assembly:single`).
   Use the **non-assembly** jar + `target/libs/*` on the classpath — the
   assembly jar hits an `ArrayUtils.concat` class-conflict bug.
4. `BatchRender.java` loads one `.sc`, then renders every requested export to
   aligned `frame_%04d.png` frames in a single JVM.

## Rendering a brawler

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:<ktx-tools-dir>:$PATH"
export SC_EDITOR_JAR=<path>/sc-editor/target/sc-editor-1.0.0.jar
export SC_EDITOR_LIBS=<path>/sc-editor/target/libs/*

python3 render_frames.py \
  ../commonassets/brawler_effects/effects_brawler_gale.sc \
  /tmp/ref_frames 4 \
  gale_006_atk_projectile gale_006_atk_hit gale_006_atk_muzzle_01
```

Then generate a `manifest.json` per export (frame count, canvas size, center
anchor, scale = pixel_scale) and copy the frames into
`commonassets/brawler_effects/<brawler>/<export>/`. The Remotion
`ScEffectPreviewComposition` auto-fits each part into its grid cell.

## Known limitations

- The reference renderer's **video export path renders black frames** — only the
  single-frame PNG path works (`BatchRender` uses it).
- A few kit clips (`kit_def_oc_ulti_projectile`, `..._projectile_red`) only
  render frame 0; later frames crash with `IndexOutOfBoundsException` inside
  sc-editor's own `MovieClip` renderer.
- The colors are sc-editor's raw effect output (mint/green/yellow tones). The
  game composites these over the bright arena with additional layering, so raw
  frames may read darker than in-game.
