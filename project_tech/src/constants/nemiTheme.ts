export const NEMI_THEME = {
  colors: {
    bg: {
      cream: "#F8F6F0",
      creamDark: "#EFECE6",
      cardCharcoal: "#18181B",
      cardDark: "#111827",
      surfaceGlass: "rgba(24, 24, 27, 0.94)",
      borderMuted: "rgba(0, 0, 0, 0.08)",
      borderCharcoal: "rgba(255, 255, 255, 0.12)",
    },
    brand: {
      yellow: "#FFD166",
      yellowGlow: "#FFE484",
      peach: "#FFCDB2",
      cyan: "#06B6D4",
      cyanGlow: "#22D3EE",
      emerald: "#10B981",
      emeraldGlow: "#34D399",
      coral: "#F43F5E",
      coralGlow: "#FB7185",
      purple: "#8B5CF6",
    },
    mascot: {
      furDark: "#2B2D42",
      furLight: "#3D405B",
      facePeach: "#FFCDB2",
      faceShade: "#E5989B",
      glassesFrame: "#FFD166",
      glassesLens: "rgba(6, 182, 212, 0.25)",
      eyePupil: "#111827",
      blush: "#FFB4A2",
    },
    text: {
      headingDark: "#18181B",
      bodyMuted: "#64748B",
      headingLight: "#F8FAFC",
      codeKeyword: "#F472B6",
      codeFn: "#60A5FA",
      codeString: "#34D399",
      codeNumber: "#FBBF24",
    }
  },
  typography: {
    fontDisplay: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontHeading: "'JetBrains Mono', 'Fira Code', -apple-system, monospace",
    fontCode: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
  },
  springs: {
    snappy: { damping: 14, stiffness: 220, mass: 0.6 },
    bouncy: { damping: 9, stiffness: 190, mass: 0.8 },
    pop: { damping: 10, stiffness: 250, mass: 0.5 },
    float: { damping: 20, stiffness: 80, mass: 1.0 },
  },
  dimensions: {
    width: 1080,
    height: 1920,
    fps: 30,
  }
};
