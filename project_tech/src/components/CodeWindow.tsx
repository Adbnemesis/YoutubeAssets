import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants/theme";
import { CodeLine } from "../types";

interface CodeWindowProps {
  lines: CodeLine[];
  language: string;
  filename?: string;
  activeLine?: number;
  highlightType?: "bug" | "fix" | "focus" | "normal";
}

export const CodeWindow: React.FC<CodeWindowProps> = ({
  lines,
  language,
  filename = "solution.js",
  activeLine,
  highlightType = "focus",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: THEME.springs.snappy,
  });

  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        width: "920px",
        borderRadius: "24px",
        backgroundColor: THEME.colors.syntax.bg,
        border: `1.5px solid ${THEME.colors.syntax.border}`,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(6, 182, 212, 0.08)",
        overflow: "hidden",
        fontFamily: THEME.typography.fontCode,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FF5F56" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#27C93F" }} />
        </div>
        <div
          style={{
            fontSize: "18px",
            color: THEME.colors.text.secondary,
            letterSpacing: "0.5px",
            fontWeight: 500,
          }}
        >
          {filename}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "8px",
            backgroundColor: "rgba(6, 182, 212, 0.15)",
            color: THEME.colors.brand.cyanGlow,
            border: "1px solid rgba(6, 182, 212, 0.3)",
          }}
        >
          {language.toUpperCase()}
        </div>
      </div>

      {/* Code Body */}
      <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {lines.map((line, idx) => {
          const isHighlighted = line.isHighlighted || line.number === activeLine;
          const lineType = line.highlightType || highlightType;

          let bgHighlight = "transparent";
          let borderHighlight = "transparent";
          if (isHighlighted) {
            if (lineType === "bug") {
              bgHighlight = "rgba(244, 63, 94, 0.18)";
              borderHighlight = THEME.colors.brand.rose;
            } else if (lineType === "fix") {
              bgHighlight = "rgba(16, 185, 129, 0.18)";
              borderHighlight = THEME.colors.brand.emerald;
            } else {
              bgHighlight = "rgba(6, 182, 212, 0.14)";
              borderHighlight = THEME.colors.brand.cyan;
            }
          }

          return (
            <div
              key={line.number || idx}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: bgHighlight,
                borderLeft: `4px solid ${borderHighlight}`,
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  width: "40px",
                  fontSize: "20px",
                  color: isHighlighted ? THEME.colors.text.primary : THEME.colors.text.muted,
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {line.number}
              </span>
              <pre
                style={{
                  margin: 0,
                  fontSize: "24px",
                  lineHeight: "1.4",
                  fontWeight: 500,
                  color: THEME.colors.text.primary,
                  whiteSpace: "pre-wrap",
                  fontFamily: THEME.typography.fontCode,
                }}
              >
                {renderHighlightedCode(line.code)}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function renderHighlightedCode(code: string) {
  // Simple regex token highlighter for maximum zero-dependency speed & reliability
  const tokens = code.split(/(\b(?:const|let|var|function|def|return|if|else|for|while|import|from|class|async|await|print|console\.log)\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\b|==|===|!=|!==|=>|\/\/.*|#.*)/g);

  return tokens.map((token, i) => {
    if (!token) return null;
    if (/^(const|let|var|function|def|return|if|else|for|while|import|from|class|async|await)$/.test(token)) {
      return <span key={i} style={{ color: THEME.colors.text.codeKeyword, fontWeight: 700 }}>{token}</span>;
    }
    if (/^(print|console\.log)$/.test(token)) {
      return <span key={i} style={{ color: THEME.colors.text.codeFn, fontWeight: 700 }}>{token}</span>;
    }
    if (/^(".*"|'.*')$/.test(token)) {
      return <span key={i} style={{ color: THEME.colors.text.codeString }}>{token}</span>;
    }
    if (/^\d+$/.test(token)) {
      return <span key={i} style={{ color: THEME.colors.text.codeNumber }}>{token}</span>;
    }
    if (/^(\/\/.*|#.*)$/.test(token)) {
      return <span key={i} style={{ color: THEME.colors.text.codeComment, fontStyle: "italic" }}>{token}</span>;
    }
    return <span key={i}>{token}</span>;
  });
}
