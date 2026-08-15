import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrawlerCardProps } from "../props";
import { PhonkBackdrop } from "./PhonkBackdrop";
import { GifFrames } from "./GifFrames";

interface TrioBrawlerCardProps {
  brawler: BrawlerCardProps;
  mode: "image_shake" | "text_card" | "action_pose";
}

const PHONK_FONTS = [
  "Impact",
  "Arial Black",
  "Trebuchet MS",
  "Courier New",
  "Franklin Gothic Medium",
  "sans-serif",
];

const CharacterCenter: React.FC<{ src: string; accentColor: string; heightPct: string }> = ({
  src,
  accentColor,
  heightPct,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={src}
        style={{
          height: heightPct,
          width: "auto",
          objectFit: "contain",
          filter: `drop-shadow(0 0 45px ${accentColor}) drop-shadow(0 0 110px ${accentColor}66)`,
        }}
      />
    </div>
  </div>
);

export const TrioBrawlerCard: React.FC<TrioBrawlerCardProps> = ({ brawler, mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mode 1: Image Shake Entrance (with full background artwork)
  if (mode === "image_shake") {
    const entrance = brawler.entrance ?? "rise";

    // First character (Luffy-style): slams up from the bottom with a violent shake
    if (entrance === "rise") {
      const slideY = interpolate(frame, [0, 13], [100, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      const shaking = frame < 26;
      const shakeX = shaking ? Math.sin(frame * 5.5) * 32 + Math.sin(frame * 11.3) * 7 : 0;
      const shakeY = shaking ? Math.cos(frame * 5.1) * 27 + Math.cos(frame * 9.7) * 5 : 0;
      const shakeRot = shaking ? Math.sin(frame * 7.3) * 1.6 : 0;
      const scale = interpolate(frame, [0, 10, 24], [1.0, 1.16, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      return (
        <AbsoluteFill style={{ transform: `translateY(${slideY}%)` }}>
          <AbsoluteFill
            style={{
              transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale}) rotate(${shakeRot}deg)`,
            }}
          >
            <PhonkBackdrop
              backgroundImage={brawler.backgroundImage}
              accentColor={brawler.accentColor}
              boost={brawler.backgroundBoost ?? 1.35}
            >
              <CharacterCenter src={brawler.image} accentColor={brawler.accentColor} heightPct="82%" />
            </PhonkBackdrop>
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    // Second/third characters — reference overlap: the new character + background
    // GROWS from the bottom-center over the previous character + background (which stays
    // visible around it for ~20f like the reference). Growth is slowed so the overlap
    // transition is clearly visible to the naked eye.
    const growScale = interpolate(frame, [0, 34], [0.55, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const fade = interpolate(frame, [0, 26], [0.4, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Damped vertical shake matching the reference's slam: starts after the grow has
    // visibly begun, slower and longer so the settle into place reads clearly.
    const shakeT = frame - 10;
    const shakeY = shakeT >= 0 ? Math.sin(shakeT * 0.55 + 0.3) * 22 * Math.exp(-shakeT / 18) : 0;
    const shakeRot = shakeT >= 0 ? Math.sin(shakeT * 0.4) * 1.0 * Math.exp(-shakeT / 20) : 0;

    return (
      <AbsoluteFill style={{ opacity: fade }}>
        <AbsoluteFill
          style={{
            transform: `translateY(${shakeY}px) scale(${growScale}) rotate(${shakeRot}deg)`,
            transformOrigin: "center bottom",
          }}
        >
          <PhonkBackdrop
            backgroundImage={brawler.backgroundImage}
            accentColor={brawler.accentColor}
            boost={brawler.backgroundBoost ?? 1.35}
          >
            <CharacterCenter src={brawler.image} accentColor={brawler.accentColor} heightPct="82%" />
          </PhonkBackdrop>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // Mode 2: Text Card Pop (PURE BLACK BACKGROUND + RAPID FONT SHIFTS)
  if (mode === "text_card") {
    const fontIdx = Math.floor(frame / 3) % PHONK_FONTS.length;
    const currentFont = PHONK_FONTS[fontIdx];

    const textSpring = spring({
      frame,
      fps,
      config: { damping: 9, stiffness: 260 },
    });

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000000", // PURE BLACK BACKGROUND AS DISCOVERED
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pure Black Background with Subtle Radial Color Tint */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle, ${brawler.accentColor}33 0%, #000000 70%)`,
          }}
        />

        {/* Rapid Font Cycling Animated Text Pop */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            transform: `scale(${textSpring})`,
            zIndex: 20,
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              letterSpacing: 6,
              textShadow: `0 0 40px ${brawler.accentColor}, 0 0 80px ${brawler.accentColor}, -5px 5px 0 #000`,
              fontFamily: currentFont,
            }}
          >
            {brawler.text}
          </h1>
        </div>
      </AbsoluteFill>
    );
  }

  // Mode 3: Action Pose 2 (with full background artwork + life motion)
  // Smooth "alive" treatment — soft fade-in, slow directional drift, gentle float and
  // slow zoom. No trembling: the sway is a low-frequency float, not a fast oscillation.
  const fadeIn = interpolate(frame, [0, 10], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const driftDirection = brawler.entrance === "slideLeft" ? 1 : -1;
  const driftX = interpolate(frame, [0, 63], [driftDirection * 34, driftDirection * -18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const floatY = Math.sin(frame * 0.07) * 5;
  const slowZoom = interpolate(frame, [0, 63], [1.0, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
      }}
    >
      <PhonkBackdrop
        backgroundImage={brawler.backgroundImage}
        accentColor={brawler.accentColor}
        boost={brawler.backgroundBoost ?? 1.45}
      >
        {/* Character Secondary Pose — animated GIF frames playing at original speed */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${driftX}px, ${floatY}px) scale(${slowZoom})`,
          }}
        >
          <GifFrames
            base={brawler.secondaryPoseGif.base}
            frameCount={brawler.secondaryPoseGif.frameCount}
            gifFps={brawler.secondaryPoseGif.gifFps ?? (100 / 3)}
            style={{
              height: "88%",
              width: "auto",
              objectFit: "contain",
              filter: `drop-shadow(0 0 45px ${brawler.accentColor}) drop-shadow(0 0 110px ${brawler.accentColor}66)`,
            }}
          />
        </div>
      </PhonkBackdrop>
    </AbsoluteFill>
  );
};
