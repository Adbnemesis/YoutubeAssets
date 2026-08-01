import { interpolate, Easing } from "remotion";

/**
 * Reference beat grid — measured from ranking_tier_list.mp3 (126 BPM)
 * mapped to composition time (BGM offset 8.4990s, 30fps).
 * beatToFrame(1) == frame 4.5 (~0.15s).
 */
export const BGM_OFFSET_SECONDS = 8.499;
export const BEAT_SECONDS = 60 / 126; // 0.4762s
export const FIRST_BEAT_SECONDS = 0.15;

export const beatSeconds = (beat: number): number =>
  FIRST_BEAT_SECONDS + (beat - 1) * BEAT_SECONDS;

export const beatToFrame = (beat: number, fps = 30): number =>
  Math.round(beatSeconds(beat) * fps);

export const secondsToFrame = (seconds: number, fps = 30): number =>
  Math.round(seconds * fps);

export const frameToSeconds = (frame: number, fps = 30): number =>
  frame / fps;

/** Quick punch-in scale on a beat drop: 1 -> 1.16 -> 1.0 (crash zoom). */
export const punchZoom = (
  frame: number,
  fps: number,
  startFrame: number,
  intensity = 1
): number => {
  const rel = frame - startFrame;
  if (rel < 0) return 1;
  const peak = 1 + 0.16 * intensity;
  if (rel < 3) return interpolate(rel, [0, 2.9], [1, peak], { extrapolateRight: "clamp" });
  return interpolate(rel, [3, 9], [peak, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

/** Decaying camera shake offset, returns a vector {x, y}. */
export const shakeVector = (
  frame: number,
  startFrame: number,
  duration = 12,
  magnitude = 14
): { x: number; y: number } => {
  const rel = frame - startFrame;
  if (rel < 0 || rel >= duration) return { x: 0, y: 0 };
  const decay = 1 - rel / duration;
  const s = magnitude * decay * 0.6;
  return {
    x: Math.sin(rel * 1.7) * s + Math.sin(rel * 4.1) * s * 0.4,
    y: Math.cos(rel * 2.3) * s * 0.7 + Math.sin(rel * 5.7) * s * 0.3,
  };
};

/** Slow push-in used for build-ups (scale slowly from 1 to 1.08). */
export const pushZoom = (
  frame: number,
  startFrame: number,
  endFrame: number,
  max = 1.08
): number =>
  interpolate(frame, [startFrame, endFrame], [1, max], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

/** Flash overlay opacity: spike on the trigger frame then decay. */
export const flashCurve = (
  frame: number,
  startFrame: number,
  peak = 0.85,
  duration = 4
): number => {
  const rel = frame - startFrame;
  if (rel < 0 || rel >= duration) return 0;
  return interpolate(rel, [0, 1, duration - 1], [0, peak, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
