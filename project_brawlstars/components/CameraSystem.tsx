import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { CameraConfig } from "../types";
import { punchZoom, pushZoom, shakeVector } from "../beatGrid";

export interface CameraSystemProps {
  camera: CameraConfig;
  /** Optional slow push-in window (build-up before a drop) */
  push?: { from: number; to: number; max?: number };
  /** Zoom-out envelope: e.g. tier list shown zoomed during the intro,
   *  then pulling out to full view on the transition beat. */
  zoomOut?: { from: number; to: number; fromScale: number; toScale?: number; origin?: string };
  children?: React.ReactNode;
}

/**
 * Global camera rig — applies zoom envelopes, punch-in crash zooms,
 * slow pushes and decaying shake to everything inside.
 * All events are driven by the beat grid.
 */
export const CameraSystem: React.FC<CameraSystemProps> = ({
  camera,
  push,
  zoomOut,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let scale = camera.baseScale ?? 1;
  let shakeX = 0;
  let shakeY = 0;
  let origin = zoomOut?.origin ?? "50% 50%";

  if (push) {
    scale *= pushZoom(frame, push.from, push.to, push.max ?? 1.06);
  }

  // Intro camera path — interpolate scale + transform-origin through keyframes.
  // The whole list zooms toward each brawler card one by one, then pans right.
  if (camera.introPath && camera.introPath.length > 1) {
    const path = [...camera.introPath].sort((a, b) => a.frame - b.frame);
    const last = path[path.length - 1];
    const first = path[0];
    let active = last;
    if (frame <= first.frame) {
      active = first;
    } else if (frame < last.frame) {
      for (let i = 0; i < path.length - 1; i++) {
        if (frame >= path[i].frame && frame < path[i + 1].frame) {
          const a = path[i];
          const b = path[i + 1];
          const t = interpolate(frame, [a.frame, b.frame], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          });
          active = {
            frame,
            scale: a.scale + (b.scale - a.scale) * t,
            originX: a.originX + (b.originX - a.originX) * t,
            originY: a.originY + (b.originY - a.originY) * t,
          };
          break;
        }
      }
    }
    scale *= active.scale;
    origin = `${active.originX}% ${active.originY}%`;
  }

  if (zoomOut) {
    const to = zoomOut.toScale ?? 1;
    const s = interpolate(frame, [zoomOut.from, zoomOut.to], [zoomOut.fromScale, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    scale *= s;
  }

  for (const ev of camera.events) {
    const rel = frame - ev.frame;
    if (rel < 0) continue;
    const intensity = ev.intensity ?? 1;
    if (ev.type === "punch") {
      scale *= punchZoom(frame, fps, ev.frame, intensity);
    } else if (ev.type === "push") {
      scale *= pushZoom(frame, ev.frame, ev.frame + 90, 1 + 0.06 * intensity);
    } else if (ev.type === "shake" || ev.type === "shakeBig") {
      const v = shakeVector(
        frame,
        ev.frame,
        ev.type === "shakeBig" ? 14 : 10,
        10 * intensity * (ev.type === "shakeBig" ? 1.6 : 1)
      );
      shakeX += v.x;
      shakeY += v.y;
    }
  }

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
        transformOrigin: origin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
