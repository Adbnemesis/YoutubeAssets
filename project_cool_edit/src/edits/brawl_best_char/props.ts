import { staticFile } from "remotion";
import editAnalysis from "../../../../analysis/best_character/edit_analysis.json";

export interface BrawlerContender {
  id: string;
  name: string;
  questionText: string;
  image: string;
  accentColor: string;
  startFrame: number;
  endFrame: number;
}

export interface WinnerBrawler {
  id: string;
  name: string;
  announcementText: string;
  image: string;
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

// Default props pre-configured with exact analyzed timings from best_character.mp4
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
      accentColor: "#9333ea",
      startFrame: 64,
      endFrame: 96,
    },
    {
      id: "edgar",
      name: "Edgar",
      questionText: "EDGAR?",
      image: staticFile("images/edgar/edgar_panel_1.png"),
      accentColor: "#dc2626",
      startFrame: 96,
      endFrame: 127,
    },
    {
      id: "crow",
      name: "Crow",
      questionText: "CROW?",
      image: staticFile("images/crow/crow_panel_1.png"),
      accentColor: "#2563eb",
      startFrame: 127,
      endFrame: 159,
    },
    {
      id: "kit",
      name: "Kit",
      questionText: "KIT?",
      image: staticFile("images/kenji/kenji_panel_4.png"),
      accentColor: "#fbbf24",
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
    accentColor: "#f59e0b",
    startFrame: 313,
    endFrame: 377,
  },
};
