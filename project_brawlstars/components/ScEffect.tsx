import React from "react";
import { Img, staticFile, useCurrentFrame, delayRender, continueRender } from "remotion";

/**
 * Play a Supercell `.sc` effect part exported by `tools/sc_converter/extract_effects.py`.
 *
 * The extractor writes, for a brawler `gale` and an export like `gale_006_atk_projectile`:
 *   commonassets/brawler_effects/gale/gale_006_atk_projectile/frame_%04d.png
 *   commonassets/brawler_effects/gale/gale_006_atk_projectile/manifest.json
 *
 * All frames are on a shared "union canvas" so they composite into one aligned
 * animation. `manifest.anchor` is the point of the effect that should sit at the
 * requested screen position.
 *
 * Props
 * -----
 * - `brawler`:  lower-case brawler id, e.g. `"gale"`
 * - `part`:     export name, e.g. `"gale_006_atk_hit"`
 * - `x`, `y`:   screen position of the effect's anchor (the effect's origin)
 * - `start`:    composition frame at which the effect begins playing
 * - `speed`:    frames of composition time per SC frame (default 1)
 * - `loop`:     loop the animation
 * - `scale`:    extra visual scale multiplier (on top of the extractor's own scale)
 * - `opacity`:  layer opacity
 * - `flip`:     mirror horizontally (for attacks aimed the other way)
 * - `rotate`:   extra rotation (deg) around the anchor
 * - `hidden`:   force invisible (shown state)
 */
export interface ScEffectProps {
  brawler: string;
  part: string;
  x: number;
  y: number;
  start?: number;
  speed?: number;
  loop?: boolean;
  scale?: number;
  opacity?: number;
  flip?: boolean;
  rotate?: number;
  hidden?: boolean;
  blendMode?: React.CSSProperties["mixBlendMode"];
  playbackRate?: number;
  /** CSS filter string, e.g. 'brightness(1.5) saturate(1.2)' */
  filter?: string;
}

interface ScEffectManifest {
  name: string;
  frameCount: number;
  canvas: { width: number; height: number };
  anchor: { x: number; y: number };
  scale: number;
}

export const SC_EFFECT_ROOT = "brawl/effects";

export const ScEffect: React.FC<ScEffectProps> = ({
  brawler,
  part,
  x,
  y,
  start = 0,
  speed = 1,
  loop = false,
  scale = 1,
  opacity = 1,
  flip = false,
  rotate = 0,
  hidden = false,
  blendMode,
  playbackRate = 1,
  filter,
}) => {
  return (
    <ScEffectPlayer
      manifestSrc={`${SC_EFFECT_ROOT}/${brawler}/${part}/manifest.json`}
      frameSrc={(i) =>
        `${SC_EFFECT_ROOT}/${brawler}/${part}/frame_${String(i).padStart(4, "0")}.png`
      }
      x={x}
      y={y}
      start={start}
      speed={speed}
      loop={loop}
      scale={scale}
      opacity={opacity}
      flip={flip}
      rotate={rotate}
      hidden={hidden}
      blendMode={blendMode}
      playbackRate={playbackRate}
      filter={filter}
    />
  );
};

/**
 * Lower-level player: takes resolve paths for the manifest + frame images. Splitting
 * this out keeps `ScEffect` (the per-brawler named API) separate from the resolver
 * so alternate storage layouts can slot in without touching VFX code.
 */
export const ScEffectPlayer: React.FC<{
  manifestSrc: string;
  frameSrc: (frameIndex: number) => string;
  x: number;
  y: number;
  start?: number;
  speed?: number;
  loop?: boolean;
  scale?: number;
  opacity?: number;
  flip?: boolean;
  rotate?: number;
  hidden?: boolean;
  blendMode?: React.CSSProperties["mixBlendMode"];
  playbackRate?: number;
  filter?: string;
}> = ({
  manifestSrc,
  frameSrc,
  x,
  y,
  start = 0,
  speed = 1,
  loop = false,
  scale = 1,
  opacity = 1,
  flip = false,
  rotate = 0,
  hidden = false,
  blendMode,
  playbackRate = 1,
  filter,
}) => {
  const frame = useCurrentFrame();
  const [manifest, setManifest] = React.useState<ScEffectManifest | null>(null);
  const [handle] = React.useState(() => delayRender());

  React.useEffect(() => {
    let alive = true;
    fetch(staticFile(manifestSrc))
      .then((r) => r.json())
      .then((json) => {
        if (alive) {
          setManifest(json);
          continueRender(handle);
        }
      })
      .catch((e) => {
        console.error("Failed to load manifest:", manifestSrc, e);
        if (alive) {
          setManifest(null);
          continueRender(handle);
        }
      });
    return () => {
      alive = false;
    };
  }, [manifestSrc, handle]);

  if (hidden || !manifest || !manifest.frameCount) return null;

  const total = manifest.frameCount;
  const elapsed = Math.max(0, Math.floor((frame - start) / speed * playbackRate));
  
  if (!loop && elapsed >= total) return null;

  const idx = loop ? elapsed % total : Math.min(elapsed, total - 1);

  // `scale` is expressed in native SC pixels (the extractor upscales by
  // manifest.scale); divide back out so scale=1 shows the sprite at game size.
  const uni = manifest.scale || 1;
  const cw = (manifest.canvas.width * scale) / uni;
  const ch = (manifest.canvas.height * scale) / uni;
  const ax = (manifest.anchor.x * scale) / uni;
  const ay = (manifest.anchor.y * scale) / uni;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotate}deg)`,
        opacity,
        pointerEvents: "none",
        zIndex: 100,
        mixBlendMode: blendMode,
        filter: filter,
      }}
    >
      <Img
        src={staticFile(frameSrc(idx))}
        width={cw}
        height={ch}

        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(-${ax}px, -${ay}px) ${flip ? "scaleX(-1)" : ""}`,
          transformOrigin: "0 0",
        }}
      />
    </div>
  );
};
