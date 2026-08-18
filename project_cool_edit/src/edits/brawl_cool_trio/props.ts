import { staticFile } from "remotion";

// Kenji (blue), Edgar (red), Mortis (purple)
export const trioPhonkProps = {
  audioSrc: staticFile("audio/sample_audio.wav"),
  title: "BRAWL TRIO",
  cards: [
    // ============ PHASE 1: Trio Intro Card (0.00 – 2.80) ============
    {
      startTime: 0.0,
      endTime: 2.15,
      layout: "trio",
      effects: ["heavy_glitch", "rgb_shift"],
      images: [
        { src: "images/kenji/kenji_panel_1.png", auraColor: "#3b82f6" },
        { src: "images/edgar/edgar_panel_1.png", auraColor: "#ef4444" },
        { src: "images/mortis/mortis_panel_1.png", auraColor: "#8b5cf6" },
      ],
    },
    {
      startTime: 2.15,
      endTime: 2.42,
      layout: "trio",
      effects: ["glitch"],
      images: [
        { src: "images/kenji/kenji_panel_2.png", auraColor: "#3b82f6" },
        { src: "images/edgar/edgar_panel_2.png", auraColor: "#ef4444" },
        { src: "images/mortis/mortis_panel_2.png", auraColor: "#8b5cf6" },
      ],
    },
    {
      startTime: 2.42,
      endTime: 2.82,
      layout: "trio",
      effects: ["flash", "rgb_shift"],
      images: [
        { src: "images/kenji/kenji_panel_3.png", auraColor: "#3b82f6" },
        { src: "images/edgar/edgar_panel_3.png", auraColor: "#ef4444" },
        { src: "images/mortis/mortis_panel_3.png", auraColor: "#8b5cf6" },
      ],
    },

    // ============ PHASE 2: Character Pair Rush (2.80 – 6.90) ============
    {
      startTime: 2.82,
      endTime: 3.27,
      layout: "pair",
      images: [
        { src: "images/edgar/edgar_panel_4.png", auraColor: "#ef4444" },
        { src: "images/kenji/kenji_panel_4.png", auraColor: "#3b82f6" },
      ],
    },
    {
      startTime: 3.27,
      endTime: 3.80,
      layout: "pair",
      images: [
        { src: "images/mortis/mortis_panel_4.png", auraColor: "#8b5cf6" },
        { src: "images/edgar/edgar_panel_5.png", auraColor: "#ef4444" },
      ],
    },
    {
      startTime: 3.80,
      endTime: 4.20,
      layout: "pair",
      images: [
        { src: "images/kenji/kenji_panel_5.png", auraColor: "#3b82f6" },
        { src: "images/mortis/mortis_panel_5.png", auraColor: "#8b5cf6" },
      ],
    },
    {
      startTime: 4.20,
      endTime: 4.40,
      layout: "pair",
      images: [
        { src: "images/edgar/edgar_panel_6.png", auraColor: "#ef4444" },
        { src: "images/kenji/kenji_panel_6.png", auraColor: "#3b82f6" },
      ],
    },
    {
      startTime: 4.40,
      endTime: 4.68,
      layout: "pair",
      images: [
        { src: "images/edgar/edgar_panel_7.png", auraColor: "#ef4444" },
        { src: "images/edgar/edgar_panel_8.png", auraColor: "#ef4444" },
      ],
    },
    {
      startTime: 4.68,
      endTime: 5.12,
      layout: "pair",
      images: [
        { src: "images/mortis/mortis_panel_6.png", auraColor: "#8b5cf6" },
        { src: "images/kenji/kenji_panel_7.png", auraColor: "#3b82f6" },
      ],
    },
    {
      startTime: 5.12,
      endTime: 5.52,
      layout: "pair",
      images: [
        { src: "images/kenji/kenji_panel_8.png", auraColor: "#3b82f6" },
        { src: "images/edgar/edgar_panel_9.png", auraColor: "#ef4444" },
      ],
    },
    {
      startTime: 5.52,
      endTime: 6.10,
      layout: "pair",
      images: [
        { src: "images/edgar/edgar_panel_10.png", auraColor: "#ef4444" },
        { src: "images/mortis/mortis_panel_7.png", auraColor: "#8b5cf6" },
      ],
    },
    {
      startTime: 6.10,
      endTime: 6.38,
      layout: "pair",
      images: [
        { src: "images/mortis/mortis_panel_8.png", auraColor: "#8b5cf6" },
        { src: "images/kenji/kenji_panel_9.png", auraColor: "#3b82f6" },
      ],
    },
    {
      startTime: 6.38,
      endTime: 6.88,
      layout: "trio",
      images: [
        { src: "images/kenji/kenji_panel_10.png", auraColor: "#3b82f6" },
        { src: "images/edgar/edgar_panel_11.png", auraColor: "#ef4444" },
        { src: "images/mortis/mortis_panel_9.png", auraColor: "#8b5cf6" },
      ],
    },

    // ============ BLUE BREATHER (6.88 – 7.40) ============
    {
      startTime: 6.88,
      endTime: 7.40,
      layout: "trio",
      tint: "rgba(30, 58, 138, 0.45)",
      effects: ["dark_fade", "rgb_shift"],
      images: [
        { src: "images/kenji/kenji_panel_11.png", auraColor: "#3b82f6" },
        { src: "images/edgar/edgar_panel_12.png", auraColor: "#3b82f6" },
        { src: "images/mortis/mortis_panel_10.png", auraColor: "#3b82f6" },
      ],
    },

    // ============ EDGAR SECTION (~7.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 7.40,
      endTime: 7.90,
      layout: "single",
      backgroundImage: "images/kenji/kenji_panel_11.png",
      effects: ["rgb_shift", "flash"],
      images: [
        { src: "brawler_gifs/edgar_win.webm", isSilhouette: true, silhouetteColor: "#ef4444", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 7.90,
      endTime: 8.27,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "brawler_gifs/edgar_win.webm", auraColor: "#ef4444", videoStartFrame: 15 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 8.27,
      endTime: 8.62,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/edgar/edgar_panel_1.png", auraColor: "#ef4444" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 8.62,
      endTime: 8.97,
      layout: "single",
      effects: ["dark_fade", "rgb_shift"],
      images: [{ src: "images/edgar/edgar_panel_4.png", auraColor: "#ef4444" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 8.97,
      endTime: 9.30,
      layout: "single",
      effects: ["glitch", "rgb_shift"],
      images: [{ src: "images/edgar/edgar_panel_7.png", auraColor: "#ef4444" }],
    },

    // ============ MORTIS SECTION (~9.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 9.30,
      endTime: 9.80,
      layout: "single",
      backgroundImage: "images/edgar/edgar_panel_4.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/mortis_win.webm", isSilhouette: true, silhouetteColor: "#8b5cf6", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 9.80,
      endTime: 10.23,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "brawler_gifs/mortis_win.webm", auraColor: "#8b5cf6", videoStartFrame: 15 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 10.23,
      endTime: 10.59,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/mortis/mortis_panel_3.png", auraColor: "#8b5cf6" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 10.59,
      endTime: 11.16,
      layout: "single",
      effects: ["dark_fade"],
      images: [{ src: "images/mortis/mortis_panel_6.png", auraColor: "#8b5cf6" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 11.16,
      endTime: 11.74,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "images/mortis/mortis_panel_9.png", auraColor: "#8b5cf6" }],
    },

    // ============ KENJI SECTION (~11.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 11.74,
      endTime: 12.24,
      layout: "single",
      backgroundImage: "images/mortis/mortis_panel_3.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/kenji_win.webm", isSilhouette: true, silhouetteColor: "#3b82f6", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 12.24,
      endTime: 12.88,
      layout: "single",
      effects: ["glitch", "rgb_shift"],
      images: [{ src: "brawler_gifs/kenji_win.webm", auraColor: "#3b82f6", videoStartFrame: 15 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 12.88,
      endTime: 13.46,
      layout: "single",
      effects: ["sustained_rgb_shift"],
      images: [{ src: "images/kenji/kenji_panel_2.png", auraColor: "#3b82f6" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 13.46,
      endTime: 14.04,
      layout: "single",
      effects: ["rgb_shift"],
      images: [{ src: "images/kenji/kenji_panel_5.png", auraColor: "#3b82f6" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 14.04,
      endTime: 14.48,
      layout: "single",
      effects: ["flash", "heavy_glitch"],
      images: [{ src: "images/kenji/kenji_panel_8.png", auraColor: "#3b82f6" }],
    },
  ],
};

// Tara / Leon / Crow trio
export const taraLeonCrowProps = {
  audioSrc: staticFile("audio/tara_leon_crow_audio.wav"),
  title: "BRAWL TRIO",
  cards: [
    // ============ PHASE 1: Trio Intro Card (0.00 – 2.80) ============
    {
      startTime: 0.0,
      endTime: 2.15,
      layout: "trio",
      effects: ["heavy_glitch", "rgb_shift"],
      images: [
        { src: "images/tara/tara_panel_1.png", auraColor: "#a855f7" },
        { src: "images/leon/leon_panel_1.png", auraColor: "#22c55e" },
        { src: "images/crow/crow_panel_1.png", auraColor: "#3b82f6" },
      ],
    },
    {
      startTime: 2.15,
      endTime: 2.42,
      layout: "trio",
      effects: ["glitch"],
      images: [
        { src: "images/tara/tara_panel_2.png", auraColor: "#a855f7" },
        { src: "images/leon/leon_panel_2.png", auraColor: "#22c55e" },
        { src: "images/crow/crow_panel_2.png", auraColor: "#3b82f6" },
      ],
    },
    {
      startTime: 2.42,
      endTime: 2.82,
      layout: "trio",
      effects: ["flash", "rgb_shift"],
      images: [
        { src: "images/tara/tara_panel_3.png", auraColor: "#a855f7" },
        { src: "images/leon/leon_panel_3.png", auraColor: "#22c55e" },
        { src: "images/crow/crow_panel_3.png", auraColor: "#3b82f6" },
      ],
    },

    // ============ PHASE 2: Character Pair Rush (2.80 – 6.90) ============
    {
      startTime: 2.82,
      endTime: 3.27,
      layout: "pair",
      images: [
        { src: "images/leon/leon_panel_4.png", auraColor: "#22c55e" },
        { src: "images/tara/tara_panel_4.png", auraColor: "#a855f7" },
      ],
    },
    {
      startTime: 3.27,
      endTime: 3.80,
      layout: "pair",
      images: [
        { src: "images/crow/crow_panel_4.png", auraColor: "#3b82f6" },
        { src: "images/leon/leon_panel_5.png", auraColor: "#22c55e" },
      ],
    },
    {
      startTime: 3.80,
      endTime: 4.20,
      layout: "pair",
      images: [
        { src: "images/tara/tara_panel_5.png", auraColor: "#a855f7" },
        { src: "images/crow/crow_panel_5.png", auraColor: "#3b82f6" },
      ],
    },
    {
      startTime: 4.20,
      endTime: 4.40,
      layout: "pair",
      images: [
        { src: "images/leon/leon_panel_6.png", auraColor: "#22c55e" },
        { src: "images/tara/tara_panel_6.png", auraColor: "#a855f7" },
      ],
    },
    {
      startTime: 4.40,
      endTime: 4.68,
      layout: "pair",
      images: [
        { src: "images/leon/leon_panel_7.png", auraColor: "#22c55e" },
        { src: "images/leon/leon_panel_8.png", auraColor: "#22c55e" },
      ],
    },
    {
      startTime: 4.68,
      endTime: 5.12,
      layout: "pair",
      images: [
        { src: "images/crow/crow_panel_6.png", auraColor: "#3b82f6" },
        { src: "images/tara/tara_panel_7.png", auraColor: "#a855f7" },
      ],
    },
    {
      startTime: 5.12,
      endTime: 5.52,
      layout: "pair",
      images: [
        { src: "images/tara/tara_panel_8.png", auraColor: "#a855f7" },
        { src: "images/leon/leon_panel_9.png", auraColor: "#22c55e" },
      ],
    },
    {
      startTime: 5.52,
      endTime: 6.10,
      layout: "pair",
      images: [
        { src: "images/leon/leon_panel_10.png", auraColor: "#22c55e" },
        { src: "images/crow/crow_panel_7.png", auraColor: "#3b82f6" },
      ],
    },
    {
      startTime: 6.10,
      endTime: 6.38,
      layout: "pair",
      images: [
        { src: "images/crow/crow_panel_8.png", auraColor: "#3b82f6" },
        { src: "images/tara/tara_panel_9.png", auraColor: "#a855f7" },
      ],
    },
    {
      startTime: 6.38,
      endTime: 6.88,
      layout: "trio",
      images: [
        { src: "images/tara/tara_panel_10.png", auraColor: "#a855f7" },
        { src: "images/leon/leon_panel_11.png", auraColor: "#22c55e" },
        { src: "images/crow/crow_panel_9.png", auraColor: "#3b82f6" },
      ],
    },

    // ============ BLUE BREATHER (6.88 – 7.40) ============
    {
      startTime: 6.88,
      endTime: 7.40,
      layout: "trio",
      tint: "rgba(30, 58, 138, 0.45)",
      effects: ["dark_fade", "rgb_shift"],
      images: [
        { src: "images/tara/tara_panel_11.png", auraColor: "#3b82f6" },
        { src: "images/leon/leon_panel_12.png", auraColor: "#3b82f6" },
        { src: "images/crow/crow_panel_10.png", auraColor: "#3b82f6" },
      ],
    },

    // ============ TARA SECTION (~7.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 7.40,
      endTime: 7.90,
      layout: "single",
      backgroundImage: "images/tara/tara_panel_11.png",
      effects: ["rgb_shift", "flash"],
      images: [
        { src: "brawler_gifs/tara_win.webm", isSilhouette: true, silhouetteColor: "#a855f7", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 7.90,
      endTime: 8.27,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "brawler_gifs/tara_win.webm", auraColor: "#a855f7", videoStartFrame: 15 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 8.27,
      endTime: 8.62,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/tara/tara_panel_1.png", auraColor: "#a855f7" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 8.62,
      endTime: 8.97,
      layout: "single",
      effects: ["dark_fade", "rgb_shift"],
      images: [{ src: "images/tara/tara_panel_4.png", auraColor: "#a855f7" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 8.97,
      endTime: 9.30,
      layout: "single",
      effects: ["glitch", "rgb_shift"],
      images: [{ src: "images/tara/tara_panel_7.png", auraColor: "#a855f7" }],
    },

    // ============ LEON SECTION (~9.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 9.30,
      endTime: 9.80,
      layout: "single",
      backgroundImage: "images/tara/tara_panel_4.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/leon_win.webm", isSilhouette: true, silhouetteColor: "#22c55e", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 9.80,
      endTime: 10.23,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "brawler_gifs/leon_win.webm", auraColor: "#22c55e", videoStartFrame: 15 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 10.23,
      endTime: 10.59,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/leon/leon_panel_3.png", auraColor: "#22c55e" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 10.59,
      endTime: 11.16,
      layout: "single",
      effects: ["dark_fade"],
      images: [{ src: "images/leon/leon_panel_6.png", auraColor: "#22c55e" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 11.16,
      endTime: 11.74,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "images/leon/leon_panel_9.png", auraColor: "#22c55e" }],
    },

    // ============ CROW SECTION (~11.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 11.74,
      endTime: 12.24,
      layout: "single",
      backgroundImage: "images/leon/leon_panel_3.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/crow_win.webm", isSilhouette: true, silhouetteColor: "#3b82f6", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 12.24,
      endTime: 12.88,
      layout: "single",
      effects: ["glitch", "rgb_shift"],
      images: [{ src: "brawler_gifs/crow_win.webm", auraColor: "#3b82f6", videoStartFrame: 15 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 12.88,
      endTime: 13.46,
      layout: "single",
      effects: ["sustained_rgb_shift"],
      images: [{ src: "images/crow/crow_panel_2.png", auraColor: "#3b82f6" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 13.46,
      endTime: 14.04,
      layout: "single",
      effects: ["rgb_shift"],
      images: [{ src: "images/crow/crow_panel_5.png", auraColor: "#3b82f6" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 14.04,
      endTime: 14.48,
      layout: "single",
      effects: ["flash", "heavy_glitch"],
      images: [{ src: "images/crow/crow_panel_8.png", auraColor: "#3b82f6" }],
    },
  ],
};

// Bibi / Edgar / Frank trio
export const bibiEdgarFrankTrioProps = {
  audioSrc: staticFile("audio/bibi_edgar_frank_audio.wav"),
  title: "BRAWL TRIO",
  cards: [
    // ============ PHASE 1: Trio Intro Card (0.00 – 2.80) ============
    {
      startTime: 0.0,
      endTime: 2.15,
      layout: "trio",
      effects: ["heavy_glitch", "rgb_shift"],
      images: [
        { src: "images/bibi/bibi_panel_1.png", auraColor: "#ec4899" },
        { src: "images/edgar/edgar_panel_1.png", auraColor: "#ef4444" },
        { src: "images/frank/frank_panel_1.png", auraColor: "#a855f7" },
      ],
    },
    {
      startTime: 2.15,
      endTime: 2.42,
      layout: "trio",
      effects: ["glitch"],
      images: [
        { src: "images/bibi/bibi_panel_2.png", auraColor: "#ec4899" },
        { src: "images/edgar/edgar_panel_2.png", auraColor: "#ef4444" },
        { src: "images/frank/frank_panel_2.png", auraColor: "#a855f7" },
      ],
    },
    {
      startTime: 2.42,
      endTime: 2.82,
      layout: "trio",
      effects: ["flash", "rgb_shift"],
      images: [
        { src: "images/bibi/bibi_panel_3.png", auraColor: "#ec4899" },
        { src: "images/edgar/edgar_panel_3.png", auraColor: "#ef4444" },
        { src: "images/frank/frank_panel_3.png", auraColor: "#a855f7" },
      ],
    },

    // ============ PHASE 2: Character Pair Rush (2.80 – 6.90) ============
    {
      startTime: 2.82,
      endTime: 3.27,
      layout: "pair",
      images: [
        { src: "images/edgar/edgar_panel_4.png", auraColor: "#ef4444" },
        { src: "images/bibi/bibi_panel_4.png", auraColor: "#ec4899" },
      ],
    },
    {
      startTime: 3.27,
      endTime: 3.80,
      layout: "pair",
      images: [
        { src: "images/frank/frank_panel_4.png", auraColor: "#a855f7" },
        { src: "images/edgar/edgar_panel_5.png", auraColor: "#ef4444" },
      ],
    },
    {
      startTime: 3.80,
      endTime: 4.20,
      layout: "pair",
      images: [
        { src: "images/bibi/bibi_panel_5.png", auraColor: "#ec4899" },
        { src: "images/frank/frank_panel_5.png", auraColor: "#a855f7" },
      ],
    },
    {
      startTime: 4.20,
      endTime: 4.40,
      layout: "pair",
      images: [
        { src: "images/edgar/edgar_panel_6.png", auraColor: "#ef4444" },
        { src: "images/bibi/bibi_panel_6.png", auraColor: "#ec4899" },
      ],
    },
    {
      startTime: 4.40,
      endTime: 4.68,
      layout: "pair",
      images: [
        { src: "images/edgar/edgar_panel_7.png", auraColor: "#ef4444" },
        { src: "images/edgar/edgar_panel_8.png", auraColor: "#ef4444" },
      ],
    },
    {
      startTime: 4.68,
      endTime: 5.12,
      layout: "pair",
      images: [
        { src: "images/frank/frank_panel_6.png", auraColor: "#a855f7" },
        { src: "images/bibi/bibi_panel_7.png", auraColor: "#ec4899" },
      ],
    },
    {
      startTime: 5.12,
      endTime: 5.52,
      layout: "pair",
      images: [
        { src: "images/bibi/bibi_panel_8.png", auraColor: "#ec4899" },
        { src: "images/edgar/edgar_panel_9.png", auraColor: "#ef4444" },
      ],
    },
    {
      startTime: 5.52,
      endTime: 6.10,
      layout: "pair",
      images: [
        { src: "images/edgar/edgar_panel_10.png", auraColor: "#ef4444" },
        { src: "images/frank/frank_panel_7.png", auraColor: "#a855f7" },
      ],
    },
    {
      startTime: 6.10,
      endTime: 6.38,
      layout: "pair",
      images: [
        { src: "images/frank/frank_panel_8.png", auraColor: "#a855f7" },
        { src: "images/bibi/bibi_panel_9.png", auraColor: "#ec4899" },
      ],
    },
    {
      startTime: 6.38,
      endTime: 6.88,
      layout: "trio",
      images: [
        { src: "images/bibi/bibi_panel_10.png", auraColor: "#ec4899" },
        { src: "images/edgar/edgar_panel_11.png", auraColor: "#ef4444" },
        { src: "images/frank/frank_panel_9.png", auraColor: "#a855f7" },
      ],
    },

    // ============ BLUE BREATHER (6.88 – 7.40) ============
    {
      startTime: 6.88,
      endTime: 7.40,
      layout: "trio",
      tint: "rgba(30, 58, 138, 0.45)",
      effects: ["dark_fade", "rgb_shift"],
      images: [
        { src: "images/bibi/bibi_panel_11.png", auraColor: "#3b82f6" },
        { src: "images/edgar/edgar_panel_12.png", auraColor: "#3b82f6" },
        { src: "images/frank/frank_panel_10.png", auraColor: "#3b82f6" },
      ],
    },

    // ============ BIBI SECTION (~7.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 7.40,
      endTime: 7.90,
      layout: "single",
      backgroundImage: "images/bibi/bibi_panel_11.png",
      effects: ["rgb_shift", "flash"],
      images: [
        { src: "brawler_gifs/bibi_win.gif", isSilhouette: true, silhouetteColor: "#ec4899", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 7.90,
      endTime: 8.27,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "brawler_gifs/bibi_win.gif", auraColor: "#ec4899", videoStartFrame: 12 }], // 0.5s * 24fps = 12
    },
    // Image 1: Action Clip 1
    {
      startTime: 8.27,
      endTime: 8.62,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/bibi/bibi_panel_1.png", auraColor: "#ec4899" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 8.62,
      endTime: 8.97,
      layout: "single",
      effects: ["dark_fade", "rgb_shift"],
      images: [{ src: "images/bibi/bibi_panel_4.png", auraColor: "#ec4899" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 8.97,
      endTime: 9.30,
      layout: "single",
      effects: ["glitch", "rgb_shift"],
      images: [{ src: "images/bibi/bibi_panel_7.png", auraColor: "#ec4899" }],
    },

    // ============ EDGAR SECTION (~9.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 9.30,
      endTime: 9.80,
      layout: "single",
      backgroundImage: "images/bibi/bibi_panel_4.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/edgar_win.gif", isSilhouette: true, silhouetteColor: "#ef4444", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 9.80,
      endTime: 10.23,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "brawler_gifs/edgar_win.gif", auraColor: "#ef4444", videoStartFrame: 12 }], // 0.5s * 24fps = 12
    },
    // Image 1: Action Clip 1
    {
      startTime: 10.23,
      endTime: 10.59,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/edgar/edgar_panel_3.png", auraColor: "#ef4444" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 10.59,
      endTime: 11.16,
      layout: "single",
      effects: ["dark_fade"],
      images: [{ src: "images/edgar/edgar_panel_6.png", auraColor: "#ef4444" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 11.16,
      endTime: 11.74,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "images/edgar/edgar_panel_9.png", auraColor: "#ef4444" }],
    },

    // ============ FRANK SECTION (~11.5s VO) ============
    // 1) Silhouette Phase
    {
      startTime: 11.74,
      endTime: 12.24,
      layout: "single",
      backgroundImage: "images/edgar/edgar_panel_3.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/frank_win.gif", isSilhouette: true, silhouetteColor: "#a855f7", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase
    {
      startTime: 12.24,
      endTime: 12.88,
      layout: "single",
      effects: ["glitch", "rgb_shift"],
      images: [{ src: "brawler_gifs/frank_win.gif", auraColor: "#a855f7", videoStartFrame: 5 }], // 0.5s * 10fps = 5
    },
    // Image 1: Action Clip 1
    {
      startTime: 12.88,
      endTime: 13.46,
      layout: "single",
      effects: ["sustained_rgb_shift"],
      images: [{ src: "images/frank/frank_panel_2.png", auraColor: "#a855f7" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 13.46,
      endTime: 14.04,
      layout: "single",
      effects: ["rgb_shift"],
      images: [{ src: "images/frank/frank_panel_5.png", auraColor: "#a855f7" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 14.04,
      endTime: 14.48,
      layout: "single",
      effects: ["flash", "heavy_glitch"],
      images: [{ src: "images/frank/frank_panel_8.png", auraColor: "#a855f7" }],
    },
  ],
};

// ==========================================
// MAX / LEON / SURGE SPEED TRIO PROPS
// ==========================================
export const maxLeonSurgeTrioProps: BrawlCoolTrioProps = {
  audioTrack: staticFile("audio/max_leon_surge_audio.wav"),
  cards: [
    // 0.00 - 0.40: Trio intro card
    {
      startTime: 0.00,
      endTime: 0.40,
      layout: "trio",
      effects: ["flash", "heavy_glitch", "rgb_shift"],
      images: [
        { src: "images/max/max_panel_1.png", auraColor: "#eab308" },
        { src: "images/leon/leon_panel_1.png", auraColor: "#22c55e" },
        { src: "images/surge/surge_panel_1.png", auraColor: "#f97316" },
      ],
    },
    // 0.40 - 0.77: Pair card
    {
      startTime: 0.40,
      endTime: 0.77,
      layout: "pair",
      effects: ["glitch", "rgb_shift"],
      images: [
        { src: "images/max/max_panel_2.png", auraColor: "#eab308" },
        { src: "images/leon/leon_panel_2.png", auraColor: "#22c55e" },
      ],
    },
    // 0.77 - 1.15: Surge center card
    {
      startTime: 0.77,
      endTime: 1.15,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/surge/surge_panel_2.png", auraColor: "#f97316" }],
    },
    // 1.15 - 1.54: Max punch
    {
      startTime: 1.15,
      endTime: 1.54,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "images/max/max_panel_3.png", auraColor: "#eab308" }],
    },
    // 1.54 - 1.93: Leon stealth
    {
      startTime: 1.54,
      endTime: 1.93,
      layout: "single",
      effects: ["rgb_shift"],
      images: [{ src: "images/leon/leon_panel_3.png", auraColor: "#22c55e" }],
    },
    // 1.93 - 2.30: Surge upgrade
    {
      startTime: 1.93,
      endTime: 2.30,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "images/surge/surge_panel_3.png", auraColor: "#f97316" }],
    },
    // 2.30 - 2.80: Trio dynamic
    {
      startTime: 2.30,
      endTime: 2.80,
      layout: "trio",
      effects: ["flash", "heavy_glitch"],
      images: [
        { src: "images/max/max_panel_4.png", auraColor: "#eab308" },
        { src: "images/leon/leon_panel_4.png", auraColor: "#22c55e" },
        { src: "images/surge/surge_panel_4.png", auraColor: "#f97316" },
      ],
    },
    // 2.80 - 3.20: Blue phase intro
    {
      startTime: 2.80,
      endTime: 3.20,
      layout: "single",
      effects: ["sustained_rgb_shift"],
      images: [{ src: "images/max/max_panel_5.png", auraColor: "#eab308" }],
    },
    // 3.20 - 3.60: Pair
    {
      startTime: 3.20,
      endTime: 3.60,
      layout: "pair",
      effects: ["glitch"],
      images: [
        { src: "images/leon/leon_panel_5.png", auraColor: "#22c55e" },
        { src: "images/surge/surge_panel_5.png", auraColor: "#f97316" },
      ],
    },
    // 3.60 - 4.00
    {
      startTime: 3.60,
      endTime: 4.00,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/max/max_panel_6.png", auraColor: "#eab308" }],
    },
    // 4.00 - 4.40
    {
      startTime: 4.00,
      endTime: 4.40,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "images/leon/leon_panel_6.png", auraColor: "#22c55e" }],
    },
    // 4.40 - 4.80
    {
      startTime: 4.40,
      endTime: 4.80,
      layout: "single",
      effects: ["rgb_shift"],
      images: [{ src: "images/surge/surge_panel_6.png", auraColor: "#f97316" }],
    },
    // 4.80 - 5.20
    {
      startTime: 4.80,
      endTime: 5.20,
      layout: "pair",
      effects: ["glitch"],
      images: [
        { src: "images/max/max_panel_7.png", auraColor: "#eab308" },
        { src: "images/leon/leon_panel_7.png", auraColor: "#22c55e" },
      ],
    },
    // 5.20 - 5.60
    {
      startTime: 5.20,
      endTime: 5.60,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/surge/surge_panel_7.png", auraColor: "#f97316" }],
    },
    // 5.60 - 6.00
    {
      startTime: 5.60,
      endTime: 6.00,
      layout: "single",
      effects: ["dark_fade"],
      images: [{ src: "images/max/max_panel_8.png", auraColor: "#eab308" }],
    },
    // 6.00 - 6.50
    {
      startTime: 6.00,
      endTime: 6.50,
      layout: "pair",
      effects: ["glitch"],
      images: [
        { src: "images/leon/leon_panel_8.png", auraColor: "#22c55e" },
        { src: "images/surge/surge_panel_8.png", auraColor: "#f97316" },
      ],
    },
    // 6.50 - 7.00
    {
      startTime: 6.50,
      endTime: 7.00,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/max/max_panel_9.png", auraColor: "#eab308" }],
    },
    // 7.00 - 7.40: Pre-drop riser
    {
      startTime: 7.00,
      endTime: 7.40,
      layout: "trio",
      effects: ["flash", "heavy_glitch", "rgb_shift"],
      images: [
        { src: "images/max/max_panel_1.png", auraColor: "#eab308" },
        { src: "images/leon/leon_panel_1.png", auraColor: "#22c55e" },
        { src: "images/surge/surge_panel_1.png", auraColor: "#f97316" },
      ],
    },

    // ============ MAX SECTION (~7.5s VO) ============
    // 1) Silhouette Phase (0.50s)
    {
      startTime: 7.40,
      endTime: 7.90,
      layout: "single",
      backgroundImage: "images/surge/surge_panel_1.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/max_win.gif", isSilhouette: true, silhouetteColor: "#eab308", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase (Continuous frame 12)
    {
      startTime: 7.90,
      endTime: 8.27,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "brawler_gifs/max_win.gif", auraColor: "#eab308", videoStartFrame: 12 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 8.27,
      endTime: 8.62,
      layout: "single",
      effects: ["sustained_rgb_shift"],
      images: [{ src: "images/max/max_panel_1.png", auraColor: "#eab308" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 8.62,
      endTime: 8.97,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "images/max/max_panel_4.png", auraColor: "#eab308" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 8.97,
      endTime: 9.30,
      layout: "single",
      effects: ["flash"],
      images: [{ src: "images/max/max_panel_7.png", auraColor: "#eab308" }],
    },

    // ============ LEON SECTION (~9.5s VO) ============
    // 1) Silhouette Phase (0.50s)
    {
      startTime: 9.30,
      endTime: 9.80,
      layout: "single",
      backgroundImage: "images/max/max_panel_4.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/leon_win.gif", isSilhouette: true, silhouetteColor: "#22c55e", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase (Continuous frame 12)
    {
      startTime: 9.80,
      endTime: 10.23,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "brawler_gifs/leon_win.gif", auraColor: "#22c55e", videoStartFrame: 12 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 10.23,
      endTime: 10.59,
      layout: "single",
      effects: ["heavy_glitch"],
      images: [{ src: "images/leon/leon_panel_3.png", auraColor: "#22c55e" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 10.59,
      endTime: 11.16,
      layout: "single",
      effects: ["dark_fade"],
      images: [{ src: "images/leon/leon_panel_6.png", auraColor: "#22c55e" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 11.16,
      endTime: 11.74,
      layout: "single",
      effects: ["glitch"],
      images: [{ src: "images/leon/leon_panel_9.png", auraColor: "#22c55e" }],
    },

    // ============ SURGE SECTION (~11.5s VO) ============
    // 1) Silhouette Phase (0.50s)
    {
      startTime: 11.74,
      endTime: 12.24,
      layout: "single",
      backgroundImage: "images/leon/leon_panel_3.png",
      effects: ["glitch"],
      images: [
        { src: "brawler_gifs/surge_win.gif", isSilhouette: true, silhouetteColor: "#f97316", videoStartFrame: 0 },
      ],
    },
    // 1b) Reveal Phase (Continuous frame 12)
    {
      startTime: 12.24,
      endTime: 12.88,
      layout: "single",
      effects: ["glitch", "rgb_shift"],
      images: [{ src: "brawler_gifs/surge_win.gif", auraColor: "#f97316", videoStartFrame: 12 }],
    },
    // Image 1: Action Clip 1
    {
      startTime: 12.88,
      endTime: 13.46,
      layout: "single",
      effects: ["sustained_rgb_shift"],
      images: [{ src: "images/surge/surge_panel_2.png", auraColor: "#f97316" }],
    },
    // Image 2: Action Clip 2
    {
      startTime: 13.46,
      endTime: 14.04,
      layout: "single",
      effects: ["rgb_shift"],
      images: [{ src: "images/surge/surge_panel_5.png", auraColor: "#f97316" }],
    },
    // Image 3: Action Clip 3
    {
      startTime: 14.04,
      endTime: 14.48,
      layout: "single",
      effects: ["flash", "heavy_glitch"],
      images: [{ src: "images/surge/surge_panel_8.png", auraColor: "#f97316" }],
    },
  ],
};
