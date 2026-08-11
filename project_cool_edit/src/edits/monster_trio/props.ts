import { staticFile } from "remotion";

export interface BrawlerCardProps {
  id: string;
  name: string;
  text: string;
  image: string;
  secondaryPose?: string;
  voiceLine?: string;
  accentColor: string;
  startFrame: number;
  endFrame: number;
}

export interface MonsterTrioEditProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  audioTrack: string;
  intro: {
    titleText: string;
    subText: string;
    startFrame: number;
    endFrame: number;
  };
  brawlers: BrawlerCardProps[];
  climax: {
    titleText: string;
    accentColor: string;
    rapidPanels: string[];
    victoryStance: string;
    voiceLines?: string[];
    startFrame: number;
    endFrame: number;
  };
}

export const defaultMonsterTrioProps: MonsterTrioEditProps = {
  fps: 60,
  durationInFrames: 525,
  width: 1080,
  height: 1080,
  audioTrack: staticFile("audio/monster_trio_audio.wav"),
  intro: {
    titleText: "MONSTER TRIO",
    subText: "WHO ARE THE KINGS?",
    startFrame: 0,
    endFrame: 44,
  },
  brawlers: [
    {
      id: "mortis",
      name: "Mortis",
      text: "MORTIS",
      image: staticFile("images/mortis/mortis_panel_1.png"),
      voiceLine: staticFile("brawler_voices/mortis/super.ogg"),
      accentColor: "#a855f7",
      startFrame: 44,
      endFrame: 89,
    },
    {
      id: "edgar",
      name: "Edgar",
      text: "EDGAR",
      image: staticFile("images/edgar/edgar_panel_1.png"),
      secondaryPose: staticFile("images/edgar/edgar_panel_4.png"),
      voiceLine: staticFile("brawler_voices/edgar/super.ogg"),
      accentColor: "#ef4444",
      startFrame: 89,
      endFrame: 139,
    },
    {
      id: "crow",
      name: "Crow",
      text: "CROW",
      image: staticFile("images/crow/crow_panel_1.png"),
      voiceLine: staticFile("brawler_voices/crow/super.ogg"),
      accentColor: "#3b82f6",
      startFrame: 139,
      endFrame: 189,
    },
  ],
  climax: {
    titleText: "BRAWL MONSTER TRIO 👑",
    accentColor: "#f59e0b",
    rapidPanels: [
      staticFile("images/mortis/mortis_panel_1.png"),
      staticFile("images/edgar/edgar_panel_1.png"),
      staticFile("images/crow/crow_panel_1.png"),
      staticFile("images/mortis/mortis_panel_4.png"),
      staticFile("images/edgar/edgar_panel_4.png"),
      staticFile("images/crow/crow_panel_4.png"),
      staticFile("images/kenji/kenji_panel_15.png"),
    ],
    victoryStance: staticFile("images/kenji/kenji_panel_15.png"),
    voiceLines: [
      staticFile("brawler_voices/kenji/super.ogg"),
      staticFile("brawler_voices/kenji/attack.ogg"),
    ],
    startFrame: 225,
    endFrame: 525,
  },
};
