import { staticFile } from "remotion";

// Kenji (blue), Edgar (red), Mortis (purple)
// Per-brawler VO pattern (from ~7s): SILHOUETTE (solid color, slides up 0.5s)
//   -> REVEAL (color gif, videoStartFrame = 0.5s * 30fps = 15) -> 4 quick clips of the same brawler
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
      images: [{ src: "brawler_gifs/edgar_win.webm", auraColor: "#ef4444", videoStartFrame: 15 }], // 0.5s * 30fps = 15
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
      backgroundImage: "images/edgar/edgar_panel_4.png", // Matches Edgar's background at this time
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
      backgroundImage: "images/mortis/mortis_panel_3.png", // Matches Mortis's background at this time
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
