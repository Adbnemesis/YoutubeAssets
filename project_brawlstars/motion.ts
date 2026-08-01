import { interpolate, spring, Easing } from "remotion";

export interface SpringOpts {
  damping?: number;
  stiffness?: number;
  mass?: number;
}

/** Default pop-in spring with overshoot — matches reference "punchy" text. */
export const popIn = (
  frame: number,
  fps: number,
  delayFrames = 0,
  opts: SpringOpts = {}
): number => {
  const { damping = 11, stiffness = 210, mass = 0.9 } = opts;
  return spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping, stiffness, mass },
  });
};

/** Soft spring used for camera settle. */
export const softSpring = (frame: number, fps: number): number =>
  spring({ frame, fps, config: { damping: 14, stiffness: 90, mass: 1 } });

/** Word emphasis: continuous gentle pulse on top of a spring. */
export const pulseScale = (frame: number, base = 1, amp = 0.03, freq = 0.06): number =>
  base + Math.sin(frame * freq) * amp;

/** Ease-out back for snappy UI entries. */
export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Opacity helper with clamp. */
export const fadeRange = (
  frame: number,
  [inStart, inEnd, outStart, outEnd]: [number, number, number, number]
): number =>
  interpolate(frame, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Smooth step 0->1 between two frames with easing. */
export const smoothStep = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number = Easing.inOut(Easing.cubic)
): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
