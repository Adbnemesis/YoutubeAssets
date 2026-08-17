export const THEME = {
  colors: {
    bg: {
      primary: "#070B14",
      secondary: "#0F172A",
      surface: "rgba(17, 24, 39, 0.85)",
      surfaceBorder: "rgba(255, 255, 255, 0.1)",
      cardGlow: "rgba(6, 182, 212, 0.15)",
    },
    brand: {
      cyan: "#06B6D4",
      cyanGlow: "#22D3EE",
      purple: "#8B5CF6",
      purpleGlow: "#A78BFA",
      emerald: "#10B981",
      emeraldGlow: "#34D399",
      rose: "#F43F5E",
      roseGlow: "#FB7185",
      amber: "#F59E0B",
      amberGlow: "#FBBF24",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
      muted: "#64748B",
      accent: "#38BDF8",
      codeKeyword: "#F472B6",
      codeFn: "#60A5FA",
      codeString: "#34D399",
      codeComment: "#64748B",
      codeNumber: "#FBBF24",
    },
    syntax: {
      bg: "#0B0F19",
      lineHighlight: "rgba(244, 63, 94, 0.2)",
      lineHighlightPass: "rgba(16, 185, 129, 0.2)",
      border: "rgba(255, 255, 255, 0.12)",
    }
  },
  typography: {
    fontDisplay: "'JetBrains Mono', 'Fira Code', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    fontCode: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
    fontBody: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  springs: {
    snappy: { damping: 14, stiffness: 220, mass: 0.6 },
    bouncy: { damping: 9, stiffness: 190, mass: 0.8 },
    smooth: { damping: 22, stiffness: 100, mass: 1 },
    pop: { damping: 12, stiffness: 260, mass: 0.4 },
  },
  dimensions: {
    width: 1080,
    height: 1920,
    fps: 30,
  }
};
