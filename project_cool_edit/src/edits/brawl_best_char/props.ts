import { staticFile } from "remotion";

export interface BrawlerContender {
  id: string;
  name: string;
  questionText: string;
  image: string;
  secondaryImage?: string; // Optional 2nd image cut (e.g. Leon has 2 images at F263)
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
  accentColor: string;
  startFrame: number;
  endFrame: number;
}

export interface BestCharEditProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  audioTrack: string;
  intro: {
    headerText: string;
    subText: string;
    startFrame: number;
    endFrame: number;
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
  intro: {
    headerText: "THE BEST BRAWLER",
    subText: "WHO IS THE #1?",
    startFrame: 0,
    endFrame: 64,
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
      id: "crow",
      name: "Crow",
      questionText: "CROW?",
      image: staticFile("images/crow/crow_panel_1.png"),
      accentColor: "#3b82f6",
      startFrame: 127,
      endFrame: 159,
    },
    {
      id: "kit",
      name: "Kit",
      questionText: "KIT?",
      image: staticFile("images/kenji/kenji_panel_4.png"),
      accentColor: "#f59e0b",
      startFrame: 159,
      endFrame: 189,
    },
    {
      id: "tara",
      name: "Tara",
      questionText: "TARA?",
      image: staticFile("images/tara/tara_panel_1.png"),
      accentColor: "#ec4899",
      startFrame: 189,
      endFrame: 222,
    },
    {
      id: "leon",
      name: "Leon",
      questionText: "LEON?",
      image: staticFile("images/leon/leon_panel_1.png"),
      secondaryImage: staticFile("images/leon/leon_panel_4.png"), // 2nd image cut at F263 (matching Mikey in reference)
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
    // Exactly 7 images of Kenji used at equal ~9 frame intervals from F313 to F377
    winnerPanels: [
      staticFile("images/kenji/kenji_panel_1.png"),  // Image 1 (F313 -> F322)
      staticFile("images/kenji/kenji_panel_4.png"),  // Image 2 (F322 -> F331)
      staticFile("images/kenji/kenji_panel_6.png"),  // Image 3 (F331 -> F340)
      staticFile("images/kenji/kenji_panel_8.png"),  // Image 4 (F340 -> F349)
      staticFile("images/kenji/kenji_panel_11.png"), // Image 5 (F349 -> F358)
      staticFile("images/kenji/kenji_panel_13.png"), // Image 6 (F358 -> F367)
      staticFile("images/kenji/kenji_panel_15.png"), // Image 7 (F367 -> F377 final victory stance)
    ],
    accentColor: "#f59e0b",
    startFrame: 313,
    endFrame: 377,
  },
};
