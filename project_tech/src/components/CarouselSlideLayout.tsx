import React from "react";
import { AbsoluteFill } from "remotion";
import { AdaMascot, AdaPose } from "./AdaMascot";
import { NemiMascot, NemiPose } from "./NemiMascot";

export interface CarouselSlideLayoutProps {
  /** Current slide index (1-based, e.g. 1) */
  slideNumber: number;
  /** Total number of slides (e.g. 6) */
  totalSlides: number;
  /** Category badge text (e.g. "DSA & ALGORITHMS", "SYSTEM DESIGN", "AI NEWS") */
  category?: string;
  /** Category theme color */
  categoryColor?: string;
  /** Main slide title (can contain highlighted JSX) */
  title: React.ReactNode;
  /** Optional subtitle or context text */
  subtitle?: React.ReactNode;
  /** Main visual content/diagram rendered inside the content stage */
  children: React.ReactNode;
  /** Mascot to display: "ada", "nemi", "duo", or "none" */
  mascotType?: "ada" | "nemi" | "duo" | "none";
  /** Pose for Ada if active */
  adaPose?: AdaPose;
  /** Pose for Nemi if active */
  nemiPose?: NemiPose;
  /** Speech bubble text for the mascot */
  mascotSpeech?: string;
  /** Mascot dock placement: "bottom-right" | "bottom-left" | "center" */
  mascotPosition?: "bottom-right" | "bottom-left" | "center";
  /** Custom CTA / Footer text (defaults to "SWIPE NEXT 👉" or "SAVE THIS POST 📌") */
  footerCta?: string;
}

export const CarouselSlideLayout: React.FC<CarouselSlideLayoutProps> = ({
  slideNumber,
  totalSlides,
  category = "TECH EXPLAINED",
  categoryColor = "#06B6D4",
  title,
  subtitle,
  children,
  mascotType = "ada",
  adaPose = "explaining",
  nemiPose = "thinking",
  mascotSpeech,
  mascotPosition = "bottom-right",
  footerCta,
}) => {
  const isFirstSlide = slideNumber === 1;
  const isLastSlide = slideNumber === totalSlides;
  const defaultCta = isLastSlide ? "SAVE THIS POST 📌" : "SWIPE NEXT 👉";
  const activeCta = footerCta || defaultCta;

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1350, // Standard 4:5 Instagram Portrait
        backgroundColor: "#060A14",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* 1. AMBIENT CYBER BACKGROUND & NEBULA */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        {/* Top-Left Ambient Light */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 650,
            height: 650,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${categoryColor}33 0%, rgba(0,0,0,0) 70%)`,
            filter: "blur(90px)",
          }}
        />
        {/* Bottom-Right Ambient Light */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 650,
            height: 650,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(90px)",
          }}
        />

        {/* Subtle Cyber Grid */}
        <svg width="1080" height="1350" style={{ position: "absolute", top: 0, left: 0, opacity: 0.12 }}>
          <defs>
            <pattern id="carouselGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38BDF8" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1080" height="1350" fill="url(#carouselGrid)" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 2. TOP HEADER HUD */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 45,
          left: 55,
          right: 55,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 20px",
            borderRadius: 20,
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: `1.5px solid ${categoryColor}`,
            boxShadow: `0 4px 20px ${categoryColor}25`,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: categoryColor,
              boxShadow: `0 0 10px ${categoryColor}`,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: categoryColor,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {category}
          </span>
        </div>

        {/* Brand & Slide Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#94A3B8",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            @nemi.explains
          </span>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1.5px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 16,
              padding: "6px 16px",
              fontSize: 16,
              fontWeight: 900,
              color: "#F8FAFC",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span style={{ color: categoryColor }}>{String(slideNumber).padStart(2, "0")}</span>
            <span style={{ color: "#64748B" }}> / </span>
            <span>{String(totalSlides).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 3. HEADLINE & SUB-HEADLINE */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 55,
          right: 55,
          zIndex: 40,
        }}
      >
        <div
          style={{
            fontSize: isFirstSlide ? 48 : 40,
            fontWeight: 900,
            letterSpacing: "-1px",
            lineHeight: 1.2,
            color: "#F8FAFC",
            textShadow: "0 4px 15px rgba(0,0,0,0.8)",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              lineHeight: 1.4,
              color: "#94A3B8",
              marginTop: 10,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 4. MAIN VISUAL CONTENT STAGE */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: subtitle ? 210 : 180,
          left: 55,
          right: 55,
          bottom: 270,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 5. MASCOT DOCK & SPEECH BUBBLE */}
      {/* ══════════════════════════════════════════════════════════ */}
      {mascotType !== "none" && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            ...(mascotPosition === "bottom-right"
              ? { right: 55 }
              : mascotPosition === "bottom-left"
              ? { left: 55 }
              : { left: 80 }),
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Mascot Speech Bubble */}
          {mascotSpeech && (
            <div
              style={{
                marginBottom: 8,
                backgroundColor: "#FFD166",
                color: "#18181B",
                fontWeight: 900,
                fontSize: 17,
                padding: "8px 18px",
                borderRadius: 18,
                border: "2.5px solid #18181B",
                boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                whiteSpace: "nowrap",
                position: "relative",
              }}
            >
              {mascotSpeech}
              <div
                style={{
                  position: "absolute",
                  bottom: -7,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid #18181B",
                }}
              />
            </div>
          )}

          {/* Render Mascot Type */}
          {mascotType === "ada" && <AdaMascot pose={adaPose} scale={0.78} />}
          {mascotType === "nemi" && <NemiMascot pose={nemiPose} scale={0.78} />}
          {mascotType === "duo" && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <AdaMascot pose={adaPose} scale={0.72} />
              <NemiMascot pose={nemiPose} scale={0.72} />
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 6. BOTTOM FOOTER & SWIPE CTA */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 55,
          right: 55,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 60,
        }}
      >
        {/* Progress Indicator Dots */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {Array.from({ length: totalSlides }).map((_, idx) => {
            const isCurrent = idx + 1 === slideNumber;
            return (
              <div
                key={idx}
                style={{
                  width: isCurrent ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isCurrent ? categoryColor : "rgba(255, 255, 255, 0.25)",
                  boxShadow: isCurrent ? `0 0 10px ${categoryColor}` : "none",
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </div>

        {/* Swipe / Save CTA Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: isLastSlide ? "#10B981" : "rgba(15, 23, 42, 0.95)",
            border: `1.5px solid ${isLastSlide ? "#10B981" : "rgba(255, 255, 255, 0.2)"}`,
            borderRadius: 20,
            padding: "8px 20px",
            fontSize: 14,
            fontWeight: 900,
            color: isLastSlide ? "#0F172A" : "#F8FAFC",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.5px",
            boxShadow: isLastSlide ? "0 4px 20px rgba(16, 185, 129, 0.4)" : "none",
          }}
        >
          {activeCta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
