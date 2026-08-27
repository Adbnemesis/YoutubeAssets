import React from "react";
import { AbsoluteFill, Composition, registerRoot, staticFile } from "remotion";
import { ScEffect, SC_EFFECT_ROOT } from "../components/ScEffect";

const CANVAS_W = 1080;
const CANVAS_H = 1920;

const CELL_W = 330;
const CELL_H = 380;

interface Slot {
  brawler: string;
  part: string;
  label: string;
  x: number;
  y: number;
}

const GALE_SLOTS: Slot[] = [
  { brawler: "gale", part: "gale_006_atk_projectile", label: "atk_projectile", x: 180, y: 300 },
  { brawler: "gale", part: "gale_006_atk_muzzle_01", label: "atk_muzzle_01", x: 540, y: 300 },
  { brawler: "gale", part: "gale_006_atk_hit", label: "atk_hit", x: 900, y: 300 },
  { brawler: "gale", part: "gale_006_ulti_trail_bolts_02", label: "ulti_trail_bolts", x: 180, y: 700 },
  { brawler: "gale", part: "gale_006_ulti_trail_nuts_02", label: "ulti_trail_nuts", x: 540, y: 700 },
  { brawler: "gale", part: "gale_006_ulti_reached_01", label: "ulti_reached", x: 900, y: 700 },
];

const ASH_SLOTS: Slot[] = [
  { brawler: "ash", part: "ash_008_atk_cloud_01", label: "atk_cloud_01", x: 180, y: 300 },
  { brawler: "ash", part: "ash_008_atk_cloud_02", label: "atk_cloud_02", x: 540, y: 300 },
  { brawler: "ash", part: "ash_008_atk_impact01", label: "atk_impact01", x: 900, y: 300 },
  { brawler: "ash", part: "ash_008_ulti_projectile", label: "ulti_projectile", x: 180, y: 700 },
  { brawler: "ash", part: "ulti_reached_cloud_02", label: "ulti_reached_cloud", x: 540, y: 700 },
  { brawler: "ash", part: "ash_008_ulti_trail_wifi", label: "ulti_trail_wifi", x: 900, y: 700 },
];

const KIT_SLOTS: Slot[] = [
  { brawler: "kit", part: "kit_def_oc_ulti_projectile", label: "ulti_projectile", x: 180, y: 300 },
  { brawler: "kit", part: "kit_def_oc_ulti_explode", label: "ulti_explode", x: 540, y: 300 },
  { brawler: "kit", part: "kit_def_oc_ulti_wool", label: "ulti_wool", x: 900, y: 300 },
  { brawler: "kit", part: "kit_def_oc_ulti_ground", label: "ulti_ground", x: 180, y: 700 },
  { brawler: "kit", part: "kit_def_oc_ulti_grass_01", label: "ulti_grass_01", x: 540, y: 700 },
  { brawler: "kit", part: "kit_def_oc_ulti_grass_02", label: "ulti_grass_02", x: 900, y: 700 },
];

interface Manifest {
  frameCount: number;
  canvas: { width: number; height: number };
  scale: number;
}

/**
 * Auto-fit an effect into a fixed grid cell. The reference renderer outputs
 * frames on a canvas sized to the effect's full motion bounds, so effects vary
 * wildly in size; this reads the manifest and scales each one to fit its cell.
 */
const FitSlot: React.FC<{ slot: Slot }> = ({ slot }) => {
  const [manifest, setManifest] = React.useState<Manifest | null>(null);
  React.useEffect(() => {
    let alive = true;
    fetch(staticFile(`${SC_EFFECT_ROOT}/${slot.brawler}/${slot.part}/manifest.json`))
      .then((r) => r.json())
      .then((json) => {
        if (alive) setManifest(json);
      })
      .catch(() => {
        if (alive) setManifest(null);
      });
    return () => {
      alive = false;
    };
  }, [slot.brawler, slot.part]);

  let scale = 1;
  if (manifest) {
    const uni = manifest.scale || 1;
    const gw = manifest.canvas.width / uni;
    const gh = manifest.canvas.height / uni;
    scale = Math.min((CELL_W - 40) / Math.max(1, gw), (CELL_H - 40) / Math.max(1, gh));
    scale = Math.max(0.15, Math.min(6, scale));
  }

  return (
    <ScEffect
      brawler={slot.brawler}
      part={slot.part}
      x={slot.x}
      y={slot.y}
      scale={scale}
      loop
      speed={1}
    />
  );
};

const Label: React.FC<{ text: string; x: number; y: number }> = ({ text, x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translateX(-50%)",
      color: "#111",
      background: "rgba(255,255,255,0.85)",
      border: "1px solid rgba(0,0,0,0.25)",
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 18,
      fontFamily: "Arial, sans-serif",
      whiteSpace: "nowrap",
      zIndex: 50,
    }}
  >
    {text}
  </div>
);

const EffectsScene: React.FC<{ slots: Slot[] }> = ({ slots }) => {
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #e8f4ff 0%, #d7ecff 30%, #b9d9b0 100%)",
      }}
    >
      {slots.map((s) => (
        <React.Fragment key={s.part}>
          <Label text={`${s.brawler}: ${s.label}`} x={s.x} y={s.y - 200} />
          <FitSlot slot={s} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

const GalePreview: React.FC = () => <EffectsScene slots={GALE_SLOTS} />;
const AshPreview: React.FC = () => <EffectsScene slots={ASH_SLOTS} />;
const KitPreview: React.FC = () => <EffectsScene slots={KIT_SLOTS} />;

export const ScEffectPreviewRoot: React.FC = () => (
  <>
    <Composition
      id="GaleEffectPreview"
      component={GalePreview}
      durationInFrames={120}
      fps={30}
      width={CANVAS_W}
      height={CANVAS_H}
    />
    <Composition
      id="AshEffectPreview"
      component={AshPreview}
      durationInFrames={120}
      fps={30}
      width={CANVAS_W}
      height={CANVAS_H}
    />
    <Composition
      id="KitEffectPreview"
      component={KitPreview}
      durationInFrames={120}
      fps={30}
      width={CANVAS_W}
      height={CANVAS_H}
    />
  </>
);

registerRoot(ScEffectPreviewRoot);
