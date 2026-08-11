import { staticFile } from "remotion";

export interface BrawlerCardProps {
  id: string;
  name: string;
  text: string;
  image: string;
  secondaryPose: string;
  voiceLine?: string;
  accentColor: string;
  introImageStartFrame: number;
  textCardStartFrame: number;
  secondaryPoseStartFrame: number;
  endFrame: number;
}

export interface MonsterTrioEditProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  audioTrack: string;
  watermarkText: string;
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
  watermarkText: "BRAWL TRIO",
  brawlers: [
    {
      id: "mortis",
      name: "Mortis",
      text: "MORTIS",
      image: staticFile("images/mortis/mortis_panel_1.png"),
      secondaryPose: staticFile("images/mortis/mortis_panel_4.png"),
      voiceLine: staticFile("brawler_voices/mortis/super.ogg"),
      accentColor: "#a855f7",
      introImageStartFrame: 0,
      textCardStartFrame: 44,
      secondaryPoseStartFrame: 76,
      endFrame: 139,
    },
    {
      id: "edgar",
      name: "Edgar",
      text: "EDGAR",
      image: staticFile("images/edgar/edgar_panel_1.png"),
      secondaryPose: staticFile("images/edgar/edgar_panel_4.png"),
      voiceLine: staticFile("brawler_voices/edgar/super.ogg"),
      accentColor: "#ef4444",
      introImageStartFrame: 139,
      textCardStartFrame: 171,
      secondaryPoseStartFrame: 204,
      endFrame: 267,
    },
    {
      id: "crow",
      name: "Crow",
      text: "CROW",
      image: staticFile("images/crow/crow_panel_1.png"),
      secondaryPose: staticFile("images/crow/crow_panel_4.png"),
      voiceLine: staticFile("brawler_voices/crow/super.ogg"),
      accentColor: "#3b82f6",
      introImageStartFrame: 267,
      textCardStartFrame: 299,
      secondaryPoseStartFrame: 332,
      endFrame: 395,
    },
  ],
  climax: {
    titleText: "MONSTER TRIO 👑",
    accentColor: "#fbbf24",
    rapidPanels: [
      staticFile("images/mortis/mortis_panel_1.png"),
      staticFile("images/edgar/edgar_panel_1.png"),
      staticFile("images/crow/crow_panel_1.png"),
      staticFile("images/mortis/mortis_panel_4.png"),
      staticFile("images/edgar/edgar_panel_4.png"),
      staticFile("images/crow/crow_panel_4.png"),
      staticFile("images/mortis/mortis_panel_1.png"),
    ],
    victoryStance: staticFile("images/mortis/mortis_panel_1.png"),
    voiceLines: [
      staticFile("brawler_voices/mortis/attack.ogg"),
      staticFile("brawler_voices/edgar/attack.ogg"),
    ],
    startFrame: 395, // 6.58s matching reference video optical flow
    endFrame: 525,   // 8.82s
  },
};
