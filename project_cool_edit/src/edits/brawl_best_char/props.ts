import { staticFile } from "remotion";

export interface BrawlerContender {
  id: string;
  name: string;
  questionText: string;
  image: string;
  secondaryImage?: string; // Optional 2nd image cut for the 2nd last dummy winner at F263
  voiceLine?: string; // Character voice line (STRICT RULE: Only for 2nd last dummy winner at F222)
  accentColor: string;
  startFrame: number;
  endFrame: number;
}

export interface WinnerBrawler {
  id: string;
  name: string;
  announcementText: string;
  image: string;
  winnerPanels: string[]; // Exactly 7 images displayed at ~9 frame equal intervals
  voiceLines?: string[]; // Voice lines played during winner reveal sequence
  accentColor: string;
  startFrame: number;
  endFrame: number;
}

export interface BestCharTheme {
  fontFamily?: string;       // Custom font family for edit theme
  bgGradient?: string;       // Custom background gradient or color for edit theme
  headerGradient?: string;   // Custom text fill or gradient
  textShadow?: string;       // Custom text glow / drop shadow
  textStroke?: string;       // Custom stroke width & color
  sunburstColors?: string;   // Custom conic-gradient sunburst beam colors
  centerGlowColor?: string;  // Custom central radial glow color
}

export interface BestCharEditProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  audioTrack: string;
  theme?: BestCharTheme;
  intro: {
    headerText: string;
    subText: string;
    startFrame: number;
    endFrame: number;
    bgImages?: string[];     // Dynamic 4-image collage background for the intro
  };
  contenders: BrawlerContender[];
  winner: WinnerBrawler;
}

export const defaultBestCharProps: BestCharEditProps = {
  fps: 30,
  durationInFrames: 377,
  width: 720,
  height: 1280,
  audioTrack: staticFile("audio/best_character_audio.wav"),
  theme: {
    fontFamily: "'Outfit', 'Impact', sans-serif",
    bgGradient: "radial-gradient(circle at center, #1e1b4b 0%, #04050a 100%)",
    textShadow: "0 0 30px #7c3aed, 0 0 60px #ec4899, 0 0 90px #000000",
  },
  intro: {
    headerText: "THE BEST BRAWLER",
    subText: "WHO IS THE #1?",
    startFrame: 0,
    endFrame: 64,
    bgImages: [
      staticFile("images/mortis/mortis_panel_1.png"),
      staticFile("images/edgar/edgar_panel_1.png"),
      staticFile("images/crow/crow_panel_1.png"),
      staticFile("images/kenji/kenji_panel_15.png"),
    ]
  },
  contenders: [
    {
      id: "mortis",
      name: "Mortis",
      questionText: "MORTIS?",
      image: staticFile("images/mortis/mortis_panel_1.png"),
      accentColor: "#a855f7",
      startFrame: 64,
      endFrame: 96,
    },
    {
      id: "edgar",
      name: "Edgar",
      questionText: "EDGAR?",
      image: staticFile("images/edgar/edgar_panel_1.png"),
      accentColor: "#ef4444",
      startFrame: 96,
      endFrame: 127,
    },
    {
      id: "rt",
      name: "R-T",
      questionText: "R-T?",
      image: staticFile("images/rt/rt_panel_1.png"),
      accentColor: "#38bdf8",
      startFrame: 127,
      endFrame: 159,
    },
    {
      id: "tara",
      name: "Tara",
      questionText: "TARA?",
      image: staticFile("images/tara/tara_panel_1.png"),
      accentColor: "#ec4899",
      startFrame: 159,
      endFrame: 189,
    },
    {
      id: "crow",
      name: "Crow",
      questionText: "CROW?",
      image: staticFile("images/crow/crow_panel_1.png"),
      accentColor: "#3b82f6",
      startFrame: 189,
      endFrame: 222,
    },
    {
      id: "leon",
      name: "Leon",
      questionText: "LEON?",
      image: staticFile("images/leon/leon_panel_1.png"),
      secondaryImage: staticFile("images/leon/leon_panel_4.png"),
      voiceLine: staticFile("brawler_voices/leon/leon_ulti_vo_01.ogg"), // 2nd Last Dummy Winner Voice Line at F222
      accentColor: "#10b981",
      startFrame: 222,
      endFrame: 313,
    },
  ],
  winner: {
    id: "kenji",
    name: "Kenji",
    announcementText: "OFC IT'S KENJI 👑",
    image: staticFile("images/kenji/kenji_panel_15.png"),
    winnerPanels: [
      staticFile("images/kenji/kenji_panel_1.png"),
      staticFile("images/kenji/kenji_panel_4.png"),
      staticFile("images/kenji/kenji_panel_6.png"),
      staticFile("images/kenji/kenji_panel_8.png"),
      staticFile("images/kenji/kenji_panel_11.png"),
      staticFile("images/kenji/kenji_panel_13.png"),
      staticFile("images/kenji/kenji_panel_15.png"),
    ],
    voiceLines: [
      staticFile("brawler_voices/kenji/super.ogg"),
      staticFile("brawler_voices/kenji/attack.ogg"),
    ],
    accentColor: "#f59e0b",
    startFrame: 313,
    endFrame: 377,
  },
};

export const bestLegendaryProps: BestCharEditProps = {
  fps: 30,
  durationInFrames: 377,
  width: 720,
  height: 1280,
  audioTrack: staticFile("audio/best_character_audio.wav"),
  theme: {
    fontFamily: "'Outfit', 'Impact', sans-serif",
    bgGradient: "radial-gradient(circle at center, #3b0764 0%, #030208 100%)", // Rich Legendary Violet Theme
    textShadow: "0 0 35px #f59e0b, 0 0 70px #ef4444, 0 0 100px #000000",
    textStroke: "4px #000000",
    sunburstColors: "conic-gradient(from 0deg, rgba(245, 158, 11, 0.3) 0deg 15deg, transparent 15deg 30deg, rgba(239, 68, 68, 0.3) 30deg 45deg, transparent 45deg 60deg)",
    centerGlowColor: "radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(239, 68, 68, 0.35) 45%, transparent 75%)",
  },
  intro: {
    headerText: "THE BEST LEGENDARY",
    subText: "WHO IS THE #1?",
    startFrame: 0,
    endFrame: 64,
    bgImages: [
      staticFile("images/surge/surge_panel_13.png"),
      staticFile("images/spike/spike_panel_1.png"),
      staticFile("images/sandy/sandy_panel_1.png"),
      staticFile("images/meg/meg_panel_1.png"),
    ],
  },
  contenders: [
    {
      id: "meg",
      name: "Meg",
      questionText: "MEG?",
      image: staticFile("images/meg/meg_panel_1.png"),
      accentColor: "#ec4899",
      startFrame: 64,
      endFrame: 96,
    },
    {
      id: "spike",
      name: "Spike",
      questionText: "SPIKE?",
      image: staticFile("images/spike/spike_panel_1.png"),
      accentColor: "#22c55e",
      startFrame: 96,
      endFrame: 127,
    },
    {
      id: "sandy",
      name: "Sandy",
      questionText: "SANDY?",
      image: staticFile("images/sandy/sandy_panel_1.png"),
      accentColor: "#a855f7",
      startFrame: 127,
      endFrame: 159,
    },
    {
      id: "kenji",
      name: "Kenji",
      questionText: "KENJI?",
      image: staticFile("images/kenji/kenji_panel_1.png"),
      accentColor: "#f59e0b",
      startFrame: 159,
      endFrame: 189,
    },
    {
      id: "leon",
      name: "Leon",
      questionText: "LEON?",
      image: staticFile("images/leon/leon_panel_1.png"),
      accentColor: "#06b6d4",
      startFrame: 189,
      endFrame: 222,
    },
    {
      id: "crow",
      name: "Crow",
      questionText: "CROW?",
      image: staticFile("images/crow/crow_panel_1.png"),
      secondaryImage: staticFile("images/crow/crow_panel_4.png"),
      voiceLine: staticFile("brawler_voices/crow/attack.ogg"),
      accentColor: "#3b82f6",
      startFrame: 222,
      endFrame: 313,
    },
  ],
  winner: {
    id: "surge",
    name: "Surge",
    announcementText: "OFC IT'S SURGE 👑",
    image: staticFile("images/surge/surge_panel_13.png"),
    winnerPanels: [
      staticFile("images/surge/surge_panel_1.png"),
      staticFile("images/surge/surge_panel_3.png"),
      staticFile("images/surge/surge_panel_5.png"),
      staticFile("images/surge/surge_panel_7.png"),
      staticFile("images/surge/surge_panel_9.png"),
      staticFile("images/surge/surge_panel_11.png"),
      staticFile("images/surge/surge_panel_13.png"),
    ],
    voiceLines: [
      staticFile("brawler_voices/surge_atk_vo_04.ogg"),
      staticFile("brawler_voices/surge_hurt_vo_05.ogg"),
    ],
    accentColor: "#ef4444",
    startFrame: 313,
    endFrame: 377,
  },
};

export const bestRangedProps: BestCharEditProps = {
  fps: 30,
  durationInFrames: 377,
  width: 720,
  height: 1280,
  audioTrack: staticFile("audio/best_character_audio.wav"),
  theme: {
    fontFamily: "'Outfit', 'Impact', sans-serif",
    bgGradient: "radial-gradient(circle at center, #4c0519 0%, #030206 100%)", // Mystic Magenta / Rose theme
    textShadow: "0 0 35px #ec4899, 0 0 70px #f43f5e, 0 0 100px #000000",
    textStroke: "4px #000000",
    sunburstColors: "conic-gradient(from 0deg, rgba(236, 72, 153, 0.3) 0deg 15deg, transparent 15deg 30deg, rgba(244, 63, 94, 0.3) 30deg 45deg, transparent 45deg 60deg)",
    centerGlowColor: "radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(244, 63, 94, 0.35) 45%, transparent 75%)",
  },
  intro: {
    headerText: "THE BEST RANGED",
    subText: "WHO IS THE #1?",
    startFrame: 0,
    endFrame: 64,
    bgImages: [
      staticFile("images/tara/tara_panel_15.png"),
      staticFile("images/edgar/edgar_panel_1.png"),
      staticFile("images/max/max_panel_1.png"),
      staticFile("images/surge/surge_panel_1.png"),
    ],
  },
  contenders: [
    {
      id: "leon",
      name: "Leon",
      questionText: "LEON?",
      image: staticFile("images/leon/leon_panel_1.png"),
      accentColor: "#06b6d4",
      startFrame: 64,
      endFrame: 96,
    },
    {
      id: "meg",
      name: "Meg",
      questionText: "MEG?",
      image: staticFile("images/meg/meg_panel_1.png"),
      accentColor: "#ec4899",
      startFrame: 96,
      endFrame: 127,
    },
    {
      id: "surge",
      name: "Surge",
      questionText: "SURGE?",
      image: staticFile("images/surge/surge_panel_1.png"),
      accentColor: "#ef4444",
      startFrame: 127,
      endFrame: 159,
    },
    {
      id: "crow",
      name: "Crow",
      questionText: "CROW?",
      image: staticFile("images/crow/crow_panel_1.png"),
      accentColor: "#3b82f6",
      startFrame: 159,
      endFrame: 189,
    },
    {
      id: "max",
      name: "Max",
      questionText: "MAX?",
      image: staticFile("images/max/max_panel_1.png"),
      accentColor: "#eab308",
      startFrame: 189,
      endFrame: 222,
    },
    {
      id: "edgar",
      name: "Edgar",
      questionText: "EDGAR?",
      image: staticFile("images/edgar/edgar_panel_1.png"),
      // 2ND LAST DUMMY WINNER: Edgar at F222 -> F313
      // Enters at F222 with voice line + pose cut at F263!
      secondaryImage: staticFile("images/edgar/edgar_panel_4.png"),
      voiceLine: staticFile("brawler_voices/edgar/attack.ogg"),
      accentColor: "#ef4444",
      startFrame: 222,
      endFrame: 313,
    },
  ],
  winner: {
    id: "tara",
    name: "Tara",
    announcementText: "OFC IT'S TARA 👑",
    image: staticFile("images/tara/tara_panel_15.png"),
    winnerPanels: [
      staticFile("images/tara/tara_panel_1.png"),
      staticFile("images/tara/tara_panel_3.png"),
      staticFile("images/tara/tara_panel_5.png"),
      staticFile("images/tara/tara_panel_7.png"),
      staticFile("images/tara/tara_panel_9.png"),
      staticFile("images/tara/tara_panel_12.png"),
      staticFile("images/tara/tara_panel_15.png"),
    ],
    voiceLines: [
      staticFile("brawler_voices/tara/tara_kill_vo_04.ogg"),
    ],
    accentColor: "#ec4899",
    startFrame: 313,
    endFrame: 377,
  },
};

export const bestBrawlerKazeNoriProps: BestCharEditProps = {
  fps: 30,
  durationInFrames: 377,
  width: 720,
  height: 1280,
  audioTrack: staticFile("audio/best_character_audio.wav"),
  theme: {
    fontFamily: "'Outfit', 'Impact', sans-serif",
    bgGradient: "radial-gradient(circle at center, #064e3b 0%, #022c22 45%, #050508 100%)",
    textShadow: "0 0 35px #22c55e, 0 0 70px #10b981, 0 0 100px #000000",
    textStroke: "4px #000000",
    sunburstColors: "conic-gradient(from 0deg, rgba(34, 197, 94, 0.35) 0deg 15deg, transparent 15deg 30deg, rgba(236, 72, 153, 0.35) 30deg 45deg, transparent 45deg 60deg)",
    centerGlowColor: "radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, rgba(236, 72, 153, 0.35) 45%, transparent 75%)",
  },
  intro: {
    headerText: "THE BEST BRAWLER",
    subText: "WHO IS THE #1?",
    startFrame: 0,
    endFrame: 64,
    bgImages: [
      staticFile("images/kaze/kaze_panel_1.png"),
      staticFile("images/bibi/bibi_panel_1.png"),
      staticFile("images/mortis/mortis_panel_1.png"),
      staticFile("images/nori/nori_panel_1.png"),
    ]
  },
  contenders: [
    {
      id: "kaze",
      name: "Kaze",
      questionText: "KAZE?",
      image: staticFile("images/kaze/kaze_panel_1.png"),
      accentColor: "#ec4899",
      startFrame: 64,
      endFrame: 96,
    },
    {
      id: "bibi",
      name: "Bibi",
      questionText: "BIBI?",
      image: staticFile("images/bibi/bibi_panel_1.png"),
      accentColor: "#f43f5e",
      startFrame: 96,
      endFrame: 127,
    },
    {
      id: "hank",
      name: "Hank",
      questionText: "HANK?",
      image: staticFile("images/hank/hank_panel_1.png"),
      accentColor: "#06b6d4",
      startFrame: 127,
      endFrame: 159,
    },
    {
      id: "frank",
      name: "Frank",
      questionText: "FRANK?",
      image: staticFile("images/frank/frank_panel_1.png"),
      accentColor: "#a855f7",
      startFrame: 159,
      endFrame: 189,
    },
    {
      id: "max",
      name: "Max",
      questionText: "MAX?",
      image: staticFile("images/max/max_panel_1.png"),
      accentColor: "#eab308",
      startFrame: 189,
      endFrame: 222,
    },
    {
      id: "mortis",
      name: "Mortis",
      questionText: "MORTIS?",
      image: staticFile("images/mortis/mortis_panel_1.png"),
      secondaryImage: staticFile("images/mortis/mortis_panel_3.png"),
      voiceLine: staticFile("brawler_voices/mortis/super.ogg"),
      accentColor: "#8b5cf6",
      startFrame: 222,
      endFrame: 313,
    },
  ],
  winner: {
    id: "nori",
    name: "Nori",
    announcementText: "OFC IT'S NORI 👑",
    image: staticFile("images/nori/nori_panel_1.png"),
    winnerPanels: [
      staticFile("images/nori/nori_panel_1.png"),
      staticFile("images/nori/nori_panel_3.png"),
      staticFile("images/nori/nori_panel_4.png"),
      staticFile("images/nori/nori_panel_5.png"),
      staticFile("images/nori/nori_panel_6.png"),
      staticFile("images/nori/nori_panel_8.png"),
      staticFile("images/nori/nori_panel_13.png"),
    ],
    voiceLines: [
      staticFile("brawler_voices/nori/BS_Nori_Dies_005-001.wav"),
      staticFile("brawler_voices/nori/BS_Nori_Dies_006-001.wav"),
    ],
    accentColor: "#22c55e",
    startFrame: 313,
    endFrame: 377,
  },
};
