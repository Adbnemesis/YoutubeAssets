import { staticFile } from "remotion";

export type EntranceDirection = "rise" | "slideLeft" | "slideRight";

export interface BrawlerCardProps {
  id: string;
  name: string;
  text: string;
  image: string;
  secondaryPoseGif: {
    base: string;
    frameCount: number;
    gifFps?: number;
  };
  backgroundImage: string;
  backgroundBoost?: number;
  entrance?: EntranceDirection;
  voiceLine?: string;
  accentColor: string;
  introImageStartFrame: number;
  textCardStartFrame: number;
  secondaryPoseStartFrame: number;
  endFrame: number;
}

export interface ClimaxPanel {
  image: string;
  backgroundImage: string;
  backgroundBoost?: number;
  accentColor: string;
}

export interface MonsterTrioEditProps {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  audioTrack: string;
  brawlers: BrawlerCardProps[];
  climax: {
    accentColor: string;
    backgroundImage: string;
    rapidPanels: ClimaxPanel[];
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
  brawlers: [
    {
      id: "mortis",
      name: "Mortis",
      text: "MORTIS",
      image: staticFile("images/mortis/mortis_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/mortis", frameCount: 76 },
      backgroundImage: staticFile("brawl_backgrounds/BrawlStars_OdditiesShop_BG_01.png"),
      backgroundBoost: 1.5,
      entrance: "rise",
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
      secondaryPoseGif: { base: "brawler_gif_frames/edgar", frameCount: 121 },
      backgroundImage: staticFile("brawl_backgrounds/background_graffiti.png"),
      backgroundBoost: 1.1,
      entrance: "slideLeft",
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
      secondaryPoseGif: { base: "brawler_gif_frames/crow", frameCount: 117 },
      backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
      backgroundBoost: 1.35,
      entrance: "slideRight",
      voiceLine: staticFile("brawler_voices/crow/super.ogg"),
      accentColor: "#3b82f6",
      introImageStartFrame: 267,
      textCardStartFrame: 299,
      secondaryPoseStartFrame: 332,
      endFrame: 395,
    },
  ],
  climax: {
    accentColor: "#fbbf24",
    backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
    rapidPanels: [
      {
        image: staticFile("images/mortis/mortis_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/BrawlStars_OdditiesShop_BG_01.png"),
        backgroundBoost: 1.5,
        accentColor: "#a855f7",
      },
      {
        image: staticFile("images/edgar/edgar_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_graffiti.png"),
        backgroundBoost: 1.1,
        accentColor: "#ef4444",
      },
      {
        image: staticFile("images/crow/crow_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
        backgroundBoost: 1.35,
        accentColor: "#3b82f6",
      },
      {
        image: staticFile("images/mortis/mortis_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/BrawlStars_OdditiesShop_BG_01.png"),
        backgroundBoost: 1.5,
        accentColor: "#a855f7",
      },
      {
        image: staticFile("images/edgar/edgar_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_graffiti.png"),
        backgroundBoost: 1.1,
        accentColor: "#ef4444",
      },
      {
        image: staticFile("images/crow/crow_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
        backgroundBoost: 1.35,
        accentColor: "#3b82f6",
      },
      {
        image: staticFile("images/mortis/mortis_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
        backgroundBoost: 1.2,
        accentColor: "#fbbf24",
      },
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

// Kenji / Leon / Tara trio
export const defaultKenjiLeonTaraProps: MonsterTrioEditProps = {
  fps: 60,
  durationInFrames: 525,
  width: 1080,
  height: 1080,
  audioTrack: staticFile("audio/monster_trio_audio.wav"),
  brawlers: [
    {
      id: "kenji",
      name: "Kenji",
      text: "KENJI",
      image: staticFile("images/kenji/kenji_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/kenji", frameCount: 360 },
      backgroundImage: staticFile("brawl_backgrounds/background_feudaljapan1.png"),
      backgroundBoost: 1.25,
      entrance: "rise",
      voiceLine: staticFile("brawler_voices/kenji/super.ogg"),
      accentColor: "#ec4899",
      introImageStartFrame: 0,
      textCardStartFrame: 44,
      secondaryPoseStartFrame: 76,
      endFrame: 139,
    },
    {
      id: "leon",
      name: "Leon",
      text: "LEON",
      image: staticFile("images/leon/leon_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/leon", frameCount: 74 },
      backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
      backgroundBoost: 1.35,
      entrance: "slideLeft",
      voiceLine: staticFile("brawler_voices/leon/leon_ulti_vo_01.ogg"),
      accentColor: "#22c55e",
      introImageStartFrame: 139,
      textCardStartFrame: 171,
      secondaryPoseStartFrame: 204,
      endFrame: 267,
    },
    {
      id: "tara",
      name: "Tara",
      text: "TARA",
      image: staticFile("images/tara/tara_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/tara", frameCount: 64 },
      backgroundImage: staticFile("brawl_backgrounds/background_angel1.png"),
      backgroundBoost: 1.3,
      entrance: "slideRight",
      voiceLine: staticFile("brawler_voices/tara/tara_kill_vo_04.ogg"),
      accentColor: "#d946ef",
      introImageStartFrame: 267,
      textCardStartFrame: 299,
      secondaryPoseStartFrame: 332,
      endFrame: 395,
    },
  ],
  climax: {
    accentColor: "#fbbf24",
    backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
    rapidPanels: [
      {
        image: staticFile("images/kenji/kenji_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_feudaljapan1.png"),
        backgroundBoost: 1.25,
        accentColor: "#ec4899",
      },
      {
        image: staticFile("images/leon/leon_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
        backgroundBoost: 1.35,
        accentColor: "#22c55e",
      },
      {
        image: staticFile("images/tara/tara_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_angel1.png"),
        backgroundBoost: 1.3,
        accentColor: "#d946ef",
      },
      {
        image: staticFile("images/kenji/kenji_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_feudaljapan1.png"),
        backgroundBoost: 1.25,
        accentColor: "#ec4899",
      },
      {
        image: staticFile("images/leon/leon_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
        backgroundBoost: 1.35,
        accentColor: "#22c55e",
      },
      {
        image: staticFile("images/tara/tara_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_angel1.png"),
        backgroundBoost: 1.3,
        accentColor: "#d946ef",
      },
      {
        image: staticFile("images/tara/tara_panel_5.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
        backgroundBoost: 1.2,
        accentColor: "#fbbf24",
      },
    ],
    victoryStance: staticFile("images/tara/tara_panel_5.png"),
    voiceLines: [
      staticFile("brawler_voices/kenji/attack.ogg"),
      staticFile("brawler_voices/tara/tara_kill_vo_04.ogg"),
    ],
    startFrame: 395, // 6.58s
    endFrame: 525,   // 8.82s
  },
};

// Bibi / Frank / Hank trio
export const defaultBibiFrankHankProps: MonsterTrioEditProps = {
  fps: 60,
  durationInFrames: 525,
  width: 1080,
  height: 1080,
  audioTrack: staticFile("audio/monster_trio_audio.wav"),
  brawlers: [
    {
      id: "bibi",
      name: "Bibi",
      text: "BIBI",
      image: staticFile("images/bibi/bibi_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/bibi", frameCount: 153 },
      backgroundImage: staticFile("brawl_backgrounds/background_graffiti.png"),
      backgroundBoost: 1.25,
      entrance: "rise",
      voiceLine: staticFile("brawler_voices/bibi/super.ogg"),
      accentColor: "#ec4899",
      introImageStartFrame: 0,
      textCardStartFrame: 44,
      secondaryPoseStartFrame: 76,
      endFrame: 139,
    },
    {
      id: "frank",
      name: "Frank",
      text: "FRANK",
      image: staticFile("images/frank/frank_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/frank", frameCount: 12, gifFps: 10 },
      backgroundImage: staticFile("brawl_backgrounds/BrawlStars_OdditiesShop_BG_01.png"),
      backgroundBoost: 1.4,
      entrance: "slideLeft",
      voiceLine: staticFile("brawler_voices/frank/super.ogg"),
      accentColor: "#a855f7",
      introImageStartFrame: 139,
      textCardStartFrame: 171,
      secondaryPoseStartFrame: 204,
      endFrame: 267,
    },
    {
      id: "hank",
      name: "Hank",
      text: "HANK",
      image: staticFile("images/hank/hank_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/hank", frameCount: 249 },
      backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
      backgroundBoost: 1.35,
      entrance: "slideRight",
      voiceLine: staticFile("brawler_voices/hank/super.ogg"),
      accentColor: "#06b6d4",
      introImageStartFrame: 267,
      textCardStartFrame: 299,
      secondaryPoseStartFrame: 332,
      endFrame: 395,
    },
  ],
  climax: {
    accentColor: "#fbbf24",
    backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
    rapidPanels: [
      {
        image: staticFile("images/bibi/bibi_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_graffiti.png"),
        backgroundBoost: 1.25,
        accentColor: "#ec4899",
      },
      {
        image: staticFile("images/frank/frank_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/BrawlStars_OdditiesShop_BG_01.png"),
        backgroundBoost: 1.4,
        accentColor: "#a855f7",
      },
      {
        image: staticFile("images/hank/hank_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
        backgroundBoost: 1.35,
        accentColor: "#06b6d4",
      },
      {
        image: staticFile("images/bibi/bibi_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_graffiti.png"),
        backgroundBoost: 1.25,
        accentColor: "#ec4899",
      },
      {
        image: staticFile("images/frank/frank_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/BrawlStars_OdditiesShop_BG_01.png"),
        backgroundBoost: 1.4,
        accentColor: "#a855f7",
      },
      {
        image: staticFile("images/hank/hank_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
        backgroundBoost: 1.35,
        accentColor: "#06b6d4",
      },
      {
        image: staticFile("images/hank/hank_panel_5.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
        backgroundBoost: 1.2,
        accentColor: "#fbbf24",
      },
    ],
    victoryStance: staticFile("images/hank/hank_panel_5.png"),
    voiceLines: [
      staticFile("brawler_voices/bibi/attack.ogg"),
      staticFile("brawler_voices/frank/attack.ogg"),
      staticFile("brawler_voices/hank/attack.ogg"),
    ],
    startFrame: 395,
    endFrame: 525,
  },
};

// Sushi Family (Kenji, Kaze, Nori)
export const defaultSushiFamilyProps: MonsterTrioEditProps = {
  fps: 60,
  durationInFrames: 525,
  width: 1080,
  height: 1080,
  audioTrack: staticFile("audio/monster_trio_audio.wav"),
  brawlers: [
    {
      id: "kenji",
      name: "Kenji",
      text: "KENJI",
      image: staticFile("images/kenji/kenji_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/kenji", frameCount: 360, gifFps: 24 },
      backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
      backgroundBoost: 1.3,
      entrance: "rise",
      voiceLine: staticFile("brawler_voices/kenji/super.ogg"),
      accentColor: "#0ea5e9",
      introImageStartFrame: 0,
      textCardStartFrame: 44,
      secondaryPoseStartFrame: 76,
      endFrame: 139,
    },
    {
      id: "kaze",
      name: "Kaze",
      text: "KAZE",
      image: staticFile("images/kaze/kaze_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/kaze", frameCount: 500, gifFps: 24 },
      backgroundImage: staticFile("brawl_backgrounds/background_kaze.png"),
      backgroundBoost: 1.35,
      entrance: "slideLeft",
      voiceLine: staticFile("brawler_voices/kaze/kaze_kill_vo_06.ogg"),
      accentColor: "#ec4899",
      introImageStartFrame: 139,
      textCardStartFrame: 171,
      secondaryPoseStartFrame: 204,
      endFrame: 267,
    },
    {
      id: "nori",
      name: "Nori",
      text: "NORI",
      image: staticFile("images/nori/nori_panel_1.png"),
      secondaryPoseGif: { base: "brawler_gif_frames/nori", frameCount: 1, gifFps: 24 },
      backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
      backgroundBoost: 1.25,
      entrance: "slideRight",
      voiceLine: staticFile("brawler_voices/nori/BS_Nori_Dies_005-001.wav"),
      accentColor: "#22c55e",
      introImageStartFrame: 267,
      textCardStartFrame: 299,
      secondaryPoseStartFrame: 332,
      endFrame: 395,
    },
  ],
  climax: {
    accentColor: "#fbbf24",
    backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
    rapidPanels: [
      {
        image: staticFile("images/kenji/kenji_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
        backgroundBoost: 1.3,
        accentColor: "#0ea5e9",
      },
      {
        image: staticFile("images/kaze/kaze_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_kaze.png"),
        backgroundBoost: 1.35,
        accentColor: "#ec4899",
      },
      {
        image: staticFile("images/nori/nori_panel_1.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
        backgroundBoost: 1.25,
        accentColor: "#22c55e",
      },
      {
        image: staticFile("images/kenji/kenji_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_windstock_1.png"),
        backgroundBoost: 1.3,
        accentColor: "#0ea5e9",
      },
      {
        image: staticFile("images/kaze/kaze_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_kaze.png"),
        backgroundBoost: 1.35,
        accentColor: "#ec4899",
      },
      {
        image: staticFile("images/nori/nori_panel_4.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
        backgroundBoost: 1.25,
        accentColor: "#22c55e",
      },
      {
        image: staticFile("images/kenji/kenji_panel_5.png"),
        backgroundImage: staticFile("brawl_backgrounds/background_anime.png"),
        backgroundBoost: 1.2,
        accentColor: "#fbbf24",
      },
    ],
    victoryStance: staticFile("images/kenji/kenji_panel_5.png"),
    voiceLines: [
      staticFile("brawler_voices/kenji/attack.ogg"),
      staticFile("brawler_voices/kaze/kaze_kill_vo_06.ogg"),
    ],
    startFrame: 395,
    endFrame: 525,
  },
};
