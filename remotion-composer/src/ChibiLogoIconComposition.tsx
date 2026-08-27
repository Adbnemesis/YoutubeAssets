import React from "react";
import { AbsoluteFill } from "remotion";

export interface LogoIconProps {
  modelId: "chatgpt" | "grok" | "claude" | "gemini" | "kimi" | "qwen" | "llama";
}

const BRAND_COLORS = {
  chatgpt: "#10A37F",
  grok: "#0F172A",
  claude: "#D97706",
  gemini: "#2563EB",
  kimi: "#06B6D4",
  qwen: "#9333EA",
  llama: "#4F46E5",
};

export const ChibiLogoIconComposition: React.FC<LogoIconProps> = ({ modelId = "chatgpt" }) => {
  const brandColor = BRAND_COLORS[modelId] || BRAND_COLORS["chatgpt"];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justify: "center",
      }}
    >
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          border: `16px solid ${brandColor}`,
          boxShadow: `0 0 40px ${brandColor}AA`,
          display: "flex",
          alignItems: "center",
          justify: "center",
          overflow: "hidden",
        }}
      >
        {modelId === "chatgpt" && (
          <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
            <path d="M28 50 C 28 35 40 28 50 28 C 65 28 72 40 72 50 C 72 65 60 72 50 72 C 35 72 28 60 28 50 Z" stroke="#10A37F" strokeWidth="10" fill="none" />
            <circle cx="50" cy="50" r="12" fill="#10A37F" />
          </svg>
        )}

        {modelId === "grok" && (
          <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
            <line x1="20" y1="80" x2="80" y2="20" stroke="#0F172A" strokeWidth="16" strokeLinecap="round" />
            <circle cx="50" cy="50" r="10" fill="#38BDF8" />
          </svg>
        )}

        {modelId === "claude" && (
          <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
            <g transform="translate(50,50)">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line key={i} x1="0" y1="0" x2="0" y2="-32" stroke="#D97706" strokeWidth="12" strokeLinecap="round" transform={`rotate(${angle})`} />
              ))}
            </g>
          </svg>
        )}

        {modelId === "gemini" && (
          <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
            <path d="M50 10 Q 50 50 90 50 Q 50 50 50 90 Q 50 50 10 50 Q 50 50 50 10 Z" fill="#2563EB" />
          </svg>
        )}

        {modelId === "kimi" && (
          <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="32" fill="#06B6D4" />
            <polygon points="50,25 58,42 75,50 58,58 50,75 42,58 25,50 42,42" fill="#FFFFFF" />
          </svg>
        )}

        {modelId === "qwen" && (
          <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="32" stroke="#9333EA" strokeWidth="12" fill="none" />
            <circle cx="68" cy="68" r="10" fill="#9333EA" />
          </svg>
        )}

        {modelId === "llama" && (
          <svg width="340" height="340" viewBox="0 0 100 100" fill="none">
            <path
              d="M30 50 C 15 35 15 65 30 50 C 45 35 55 65 70 50 C 85 35 85 65 70 50 C 55 35 45 65 30 50 Z"
              stroke="#4F46E5"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
};
