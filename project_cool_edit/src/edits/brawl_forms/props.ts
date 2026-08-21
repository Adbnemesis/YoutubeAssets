import { staticFile } from "remotion";

export const phonkPrototypeProps = {
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "", auraColor: "#facc15", startTime: 0, endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#fef08a" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#fde047" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#ca8a04" },
      ]
    },
    {
      iconSrc: "", auraColor: "#ef4444", startTime: 3.60, endTime: 5.95,
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#7f1d1d" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#991b1b" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#b91c1c" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#ef4444" },
      ]
    },
    {
      iconSrc: "", auraColor: "#3b82f6", startTime: 5.95, endTime: 8.33,
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#1e3a8a" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#1e40af" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#2563eb" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#3b82f6" },
      ]
    },
    {
      iconSrc: "", auraColor: "#a855f7", startTime: 8.33, endTime: 11.083,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#581c87" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#7e22ce" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#9333ea" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#a855f7" },
      ]
    },
  ],
  dropClips: [
    { src: "brawler_gifs/edgar_win.webm", isSilhouette: true, silhouetteColor: "#ef4444" },
    { src: "brawler_gifs/edgar_win.webm", isSilhouette: false, videoStartFrame: 12 },
    { src: "images/edgar/edgar_panel_9.png", isSilhouette: false },
    { src: "images/edgar/edgar_panel_10.png", isSilhouette: false },
    { src: "images/edgar/edgar_panel_11.png", isSilhouette: false },

    { src: "brawler_gifs/mortis_win.webm", isSilhouette: true, silhouetteColor: "#8b5cf6" },
    { src: "brawler_gifs/mortis_win.webm", isSilhouette: false, videoStartFrame: 15 },
    { src: "images/mortis/mortis_panel_8.png", isSilhouette: false },
    { src: "images/mortis/mortis_panel_9.png", isSilhouette: false },
    { src: "images/mortis/mortis_panel_10.png", isSilhouette: false },

    { src: "brawler_gifs/kenji_win.webm", isSilhouette: true, silhouetteColor: "#eab308" },
    { src: "brawler_gifs/kenji_win.webm", isSilhouette: false, videoStartFrame: 18 },
    { src: "images/kenji/kenji_panel_8.png", isSilhouette: false },
    { src: "images/kenji/kenji_panel_9.png", isSilhouette: false },
    { src: "images/kenji/kenji_panel_10.png", isSilhouette: false },

    { src: "images/edgar/edgar_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const mangaPhonkProps = {
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "images/pin_default_thumbs_down.png", auraColor: "#facc15", startTime: 0, endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#fef08a", imageSrc: "images/edgar/edgar_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#fde047", imageSrc: "images/mortis/mortis_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308", imageSrc: "images/kenji/kenji_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#ca8a04", imageSrc: "images/edgar/edgar_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/edgar/angry.png", auraColor: "#ef4444", startTime: 3.60, endTime: 5.95, sfxSrc: "brawler_voices/edgar/attack.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#7f1d1d", imageSrc: "images/edgar/edgar_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#991b1b", imageSrc: "images/edgar/edgar_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#b91c1c", imageSrc: "images/edgar/edgar_panel_6.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#ef4444", imageSrc: "images/edgar/edgar_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/mortis/mortis_happy_pin.png", auraColor: "#8b5cf6", startTime: 5.95, endTime: 8.33, sfxSrc: "brawler_voices/mortis/attack.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#4c1d95", imageSrc: "images/mortis/mortis_panel_3.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#5b21b6", imageSrc: "images/mortis/mortis_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#6d28d9", imageSrc: "images/mortis/mortis_panel_5.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#7c3aed", imageSrc: "images/mortis/mortis_panel_6.png" },
      ]
    },
    {
      iconSrc: "expressions/kenji/angry.png", auraColor: "#3b82f6", startTime: 8.33, endTime: 11.083, sfxSrc: "brawler_voices/kenji/attack.ogg",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#1e3a8a", imageSrc: "images/kenji/kenji_panel_3.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#1e40af", imageSrc: "images/kenji/kenji_panel_4.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#2563eb", imageSrc: "images/kenji/kenji_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#3b82f6", imageSrc: "images/kenji/kenji_panel_6.png" },
      ]
    },
  ],
  dropClips: [
    { src: "brawler_gifs/edgar_win.webm", isSilhouette: true, silhouetteColor: "#ef4444" },
    { src: "brawler_gifs/edgar_win.webm", isSilhouette: false, videoStartFrame: 12 },
    { src: "images/edgar/edgar_panel_9.png", isSilhouette: false },
    { src: "images/edgar/edgar_panel_10.png", isSilhouette: false },
    { src: "images/edgar/edgar_panel_11.png", isSilhouette: false },

    { src: "brawler_gifs/mortis_win.webm", isSilhouette: true, silhouetteColor: "#8b5cf6" },
    { src: "brawler_gifs/mortis_win.webm", isSilhouette: false, videoStartFrame: 15 },
    { src: "images/mortis/mortis_panel_8.png", isSilhouette: false },
    { src: "images/mortis/mortis_panel_9.png", isSilhouette: false },
    { src: "images/mortis/mortis_panel_10.png", isSilhouette: false },

    { src: "brawler_gifs/kenji_win.webm", isSilhouette: true, silhouetteColor: "#eab308" },
    { src: "brawler_gifs/kenji_win.webm", isSilhouette: false, videoStartFrame: 18 },
    { src: "images/kenji/kenji_panel_8.png", isSilhouette: false },
    { src: "images/kenji/kenji_panel_9.png", isSilhouette: false },
    { src: "images/kenji/kenji_panel_10.png", isSilhouette: false },

    { src: "images/edgar/edgar_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const midnightTrioProps = {
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "images/spray_crossx.png", auraColor: "#facc15", startTime: 0, endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#fef08a", imageSrc: "images/crow/crow_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#fde047", imageSrc: "images/leon/leon_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308", imageSrc: "images/tara/tara_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#ca8a04", imageSrc: "images/crow/crow_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/crow/crow_happy_pin.png", auraColor: "#22c55e", startTime: 3.60, endTime: 5.95, sfxSrc: "brawler_voices/crow/attack.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#14532d", imageSrc: "images/crow/crow_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#166534", imageSrc: "images/crow/crow_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#15803d", imageSrc: "images/crow/crow_panel_6.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#22c55e", imageSrc: "images/crow/crow_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/leon/leon_angry_pin.png", auraColor: "#06b6d4", startTime: 5.95, endTime: 8.33, sfxSrc: "brawler_voices/leon/leon_ulti_vo_01.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#164e63", imageSrc: "images/leon/leon_panel_3.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#155e75", imageSrc: "images/leon/leon_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#0e7490", imageSrc: "images/leon/leon_panel_5.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#06b6d4", imageSrc: "images/leon/leon_panel_6.png" },
      ]
    },
    {
      iconSrc: "expressions/tara/tara_clap_pin.png", auraColor: "#a855f7", startTime: 8.33, endTime: 11.083, sfxSrc: "brawler_voices/tara/tara_kill_vo_04.ogg",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#3b0764", imageSrc: "images/tara/tara_panel_3.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#581c87", imageSrc: "images/tara/tara_panel_4.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#6b21a8", imageSrc: "images/tara/tara_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#a855f7", imageSrc: "images/tara/tara_panel_6.png" },
      ]
    },
  ],
  dropClips: [
    { src: "brawler_gifs/crow_win.webm", isSilhouette: true, silhouetteColor: "#22c55e" },
    { src: "brawler_gifs/crow_win.webm", isSilhouette: false, videoStartFrame: 12 },
    { src: "images/crow/crow_panel_10.png", isSilhouette: false },
    { src: "images/crow/crow_panel_11.png", isSilhouette: false },
    { src: "images/crow/crow_panel_12.png", isSilhouette: false },

    { src: "brawler_gifs/leon_win.webm", isSilhouette: true, silhouetteColor: "#06b6d4" },
    { src: "brawler_gifs/leon_win.webm", isSilhouette: false, videoStartFrame: 15 },
    { src: "images/leon/leon_panel_10.png", isSilhouette: false },
    { src: "images/leon/leon_panel_11.png", isSilhouette: false },
    { src: "images/leon/leon_panel_12.png", isSilhouette: false },

    { src: "brawler_gifs/tara_win.webm", isSilhouette: true, silhouetteColor: "#a855f7" },
    { src: "brawler_gifs/tara_win.webm", isSilhouette: false, videoStartFrame: 18 },
    { src: "images/tara/tara_panel_10.png", isSilhouette: false },
    { src: "images/tara/tara_panel_11.png", isSilhouette: false },
    { src: "images/tara/tara_panel_12.png", isSilhouette: false },

    { src: "images/tara/tara_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const superheroTrioProps = {
  titleText: "SUPERHERO TRIO",
  titleColor: "#ef4444",
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "images/icon_skins_maxforce.png", auraColor: "#ef4444", startTime: 0, endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#fef08a", imageSrc: "images/surge/surge_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#fde047", imageSrc: "images/max/max_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308", imageSrc: "images/meg/meg_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#ca8a04", imageSrc: "images/surge/surge_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/surge/surge_paladin_sad_pin.png", auraColor: "#ef4444", startTime: 3.60, endTime: 5.95, sfxSrc: "brawler_voices/surge/surge_atk_vo_04.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#991b1b", imageSrc: "images/surge/surge_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#b91c1c", imageSrc: "images/surge/surge_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#dc2626", imageSrc: "images/surge/surge_panel_6.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#ef4444", imageSrc: "images/surge/surge_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/max/max_angry_pin.png", auraColor: "#eab308", startTime: 5.95, endTime: 8.33, sfxSrc: "brawler_voices/max/max_lead_vo_02.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#854d0e", imageSrc: "images/max/max_panel_3.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#a16207", imageSrc: "images/max/max_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#ca8a04", imageSrc: "images/max/max_panel_5.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#eab308", imageSrc: "images/max/max_panel_6.png" },
      ]
    },
    {
      iconSrc: "expressions/meg/meg_thanks_pin.png", auraColor: "#a855f7", startTime: 8.33, endTime: 11.083, sfxSrc: "brawler_voices/meg/meg_lead_vo_01.ogg",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#581c87", imageSrc: "images/meg/meg_panel_3.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#7e22ce", imageSrc: "images/meg/meg_panel_4.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#9333ea", imageSrc: "images/meg/meg_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#a855f7", imageSrc: "images/meg/meg_panel_6.png" },
      ]
    },
  ],
  dropClips: [
    // SURGE
    { src: "brawler_gifs/surge_win.gif", isSilhouette: true, silhouetteColor: "#ef4444" },
    { src: "brawler_gifs/surge_win.gif", isSilhouette: false },
    { src: "images/surge/surge_panel_8.png", isSilhouette: false },
    { src: "images/surge/surge_panel_9.png", isSilhouette: false },
    { src: "images/surge/surge_panel_10.png", isSilhouette: false },

    // MAX
    { src: "brawler_gifs/max_win.gif", isSilhouette: true, silhouetteColor: "#eab308" },
    { src: "brawler_gifs/max_win.gif", isSilhouette: false },
    { src: "images/max/max_panel_8.png", isSilhouette: false },
    { src: "images/max/max_panel_9.png", isSilhouette: false },
    { src: "images/max/max_panel_10.png", isSilhouette: false },

    // MEG
    { src: "brawler_gifs/meg_win.gif", isSilhouette: true, silhouetteColor: "#a855f7" },
    { src: "brawler_gifs/meg_win.gif", isSilhouette: false },
    { src: "images/meg/meg_panel_8.png", isSilhouette: false },
    { src: "images/meg/meg_panel_9.png", isSilhouette: false },
    { src: "images/meg/meg_panel_10.png", isSilhouette: false },

    // Final Impact
    { src: "images/surge/surge_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const bibiEdgarFrankProps = {
  titleText: "THE BADDEST TRIO",
  titleColor: "#ec4899",
  titleAccentColor: "#a855f7",
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "images/spray_crossx.png", auraColor: "#facc15", startTime: 0, endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#fef08a", imageSrc: "images/bibi/bibi_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#fde047", imageSrc: "images/edgar/edgar_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308", imageSrc: "images/frank/frank_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#ca8a04", imageSrc: "images/bibi/bibi_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/bibi/angry.png", auraColor: "#ec4899", startTime: 3.60, endTime: 5.95, sfxSrc: "brawler_voices/bibi/attack.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#831843", imageSrc: "images/bibi/bibi_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#9d174d", imageSrc: "images/bibi/bibi_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#be185d", imageSrc: "images/bibi/bibi_panel_6.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#ec4899", imageSrc: "images/bibi/bibi_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/edgar/angry.png", auraColor: "#ef4444", startTime: 5.95, endTime: 8.33, sfxSrc: "brawler_voices/edgar/attack.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#7f1d1d", imageSrc: "images/edgar/edgar_panel_3.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#991b1b", imageSrc: "images/edgar/edgar_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#b91c1c", imageSrc: "images/edgar/edgar_panel_5.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#ef4444", imageSrc: "images/edgar/edgar_panel_6.png" },
      ]
    },
    {
      iconSrc: "expressions/frank/angry.png", auraColor: "#a855f7", startTime: 8.33, endTime: 11.083, sfxSrc: "brawler_voices/frank/attack.ogg",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#4c1d95", imageSrc: "images/frank/frank_panel_3.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#5b21b6", imageSrc: "images/frank/frank_panel_4.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#6d28d9", imageSrc: "images/frank/frank_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#a855f7", imageSrc: "images/frank/frank_panel_6.png" },
      ]
    },
  ],
  dropClips: [
    // BIBI
    { src: "brawler_gifs/bibi_win.gif", isSilhouette: true, silhouetteColor: "#ec4899" },
    { src: "brawler_gifs/bibi_win.gif", isSilhouette: false },
    { src: "images/bibi/bibi_panel_8.png", isSilhouette: false },
    { src: "images/bibi/bibi_panel_9.png", isSilhouette: false },
    { src: "images/bibi/bibi_panel_10.png", isSilhouette: false },

    // EDGAR
    { src: "brawler_gifs/edgar_win.gif", isSilhouette: true, silhouetteColor: "#ef4444" },
    { src: "brawler_gifs/edgar_win.gif", isSilhouette: false },
    { src: "images/edgar/edgar_panel_8.png", isSilhouette: false },
    { src: "images/edgar/edgar_panel_9.png", isSilhouette: false },
    { src: "images/edgar/edgar_panel_10.png", isSilhouette: false },

    // FRANK
    { src: "brawler_gifs/frank_win.gif", isSilhouette: true, silhouetteColor: "#a855f7" },
    { src: "brawler_gifs/frank_win.gif", isSilhouette: false },
    { src: "images/frank/frank_panel_8.png", isSilhouette: false },
    { src: "images/frank/frank_panel_9.png", isSilhouette: false },
    { src: "images/frank/frank_panel_10.png", isSilhouette: false },

    // Final Impact
    { src: "images/bibi/bibi_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const kenjiKazeNoriProps = {
  titleText: "THE SUSHI FAMILY",
  titleColor: "#0ea5e9",
  titleAccentColor: "#22c55e",
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "images/spray_feudaljapan_sushi.png",
      auraColor: "#f59e0b",
      startTime: 0,
      endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#fef08a", imageSrc: "images/kenji/kenji_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#fde047", imageSrc: "images/kaze/kaze_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308", imageSrc: "images/nori/nori_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#ca8a04", imageSrc: "images/kenji/kenji_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/kenji/normal.png",
      auraColor: "#0ea5e9",
      startTime: 3.60,
      endTime: 5.95,
      sfxSrc: "brawler_voices/kenji/attack.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#0369a1", imageSrc: "images/kenji/kenji_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#0284c7", imageSrc: "images/kenji/kenji_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#0ea5e9", imageSrc: "images/kenji/kenji_panel_6.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#38bdf8", imageSrc: "images/kenji/kenji_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/kaze/emoji_kaze_geisha_happy.png",
      auraColor: "#ec4899",
      startTime: 5.95,
      endTime: 8.33,
      sfxSrc: "brawler_voices/kaze/kaze_kill_vo_06.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#831843", imageSrc: "images/kaze/kaze_panel_3.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#9d174d", imageSrc: "images/kaze/kaze_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#be185d", imageSrc: "images/kaze/kaze_panel_5.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#ec4899", imageSrc: "images/kaze/kaze_panel_6.png" },
      ]
    },
    {
      iconSrc: "expressions/nori/emoji_nori.png",
      auraColor: "#22c55e",
      startTime: 8.33,
      endTime: 11.083,
      sfxSrc: "brawler_voices/nori/BS_Nori_Dies_005-001.wav",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#14532d", imageSrc: "images/nori/nori_panel_3.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#15803d", imageSrc: "images/nori/nori_panel_4.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#16a34a", imageSrc: "images/nori/nori_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#22c55e", imageSrc: "images/nori/nori_panel_6.png" },
      ]
    },
  ],
  dropClips: [
    // KENJI
    { src: "brawler_gifs/kenji_win.gif", isSilhouette: true, silhouetteColor: "#0ea5e9" },
    { src: "brawler_gifs/kenji_win.gif", isSilhouette: false },
    { src: "images/kenji/kenji_panel_8.png", isSilhouette: false },
    { src: "images/kenji/kenji_panel_9.png", isSilhouette: false },
    { src: "images/kenji/kenji_panel_10.png", isSilhouette: false },

    // KAZE
    { src: "brawler_gifs/kaze_win.gif", isSilhouette: true, silhouetteColor: "#ec4899" },
    { src: "brawler_gifs/kaze_win.gif", isSilhouette: false },
    { src: "images/kaze/kaze_panel_8.png", isSilhouette: false },
    { src: "images/kaze/kaze_panel_9.png", isSilhouette: false },
    { src: "images/kaze/kaze_panel_10.png", isSilhouette: false },

    // NORI
    { src: "brawler_gifs/nori_default_happy_182.png", isSilhouette: true, silhouetteColor: "#22c55e" },
    { src: "brawler_gifs/nori_default_happy_182.png", isSilhouette: false },
    { src: "images/nori/nori_panel_8.png", isSilhouette: false },
    { src: "images/nori/nori_panel_9.png", isSilhouette: false },
    { src: "images/nori/nori_panel_10.png", isSilhouette: false },

    // Final Impact
    { src: "images/nori/nori_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const tankTitansProps = {
  titleText: "THE TANK TITANS",
  titleColor: "#a855f7",
  titleAccentColor: "#06b6d4",
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "expressions/frank/special.png",
      auraColor: "#f59e0b",
      startTime: 0,
      endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#fef08a", imageSrc: "images/frank/frank_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#fde047", imageSrc: "images/hank/hank_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308", imageSrc: "images/meg/meg_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#ca8a04", imageSrc: "images/frank/frank_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/frank/normal.png",
      auraColor: "#a855f7",
      startTime: 3.60,
      endTime: 5.95,
      sfxSrc: "brawler_voices/frank/attack.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#581c87", imageSrc: "images/frank/frank_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#7e22ce", imageSrc: "images/frank/frank_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#9333ea", imageSrc: "images/frank/frank_panel_6.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#a855f7", imageSrc: "images/frank/frank_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/hank/angry.png",
      auraColor: "#06b6d4",
      startTime: 5.95,
      endTime: 8.33,
      sfxSrc: "brawler_voices/hank/attack.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#164e63", imageSrc: "images/hank/hank_panel_3.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#0e7490", imageSrc: "images/hank/hank_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#0891b2", imageSrc: "images/hank/hank_panel_5.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#06b6d4", imageSrc: "images/hank/hank_panel_6.png" },
      ]
    },
    {
      iconSrc: "images/meg/meg_panel_1.png",
      auraColor: "#ec4899",
      startTime: 8.33,
      endTime: 11.083,
      sfxSrc: "brawler_voices/meg/meg_start_vo_02.ogg",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#831843", imageSrc: "images/meg/meg_panel_3.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#9d174d", imageSrc: "images/meg/meg_panel_4.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#be185d", imageSrc: "images/meg/meg_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#ec4899", imageSrc: "images/meg/meg_panel_6.png" },
      ]
    },
  ],
  dropClips: [
    // FRANK (10 FPS continuous)
    { src: "brawler_gifs/frank_win.gif", isSilhouette: true, silhouetteColor: "#a855f7" },
    { src: "brawler_gifs/frank_win.gif", isSilhouette: false },
    { src: "images/frank/frank_panel_8.png", isSilhouette: false },
    { src: "images/frank/frank_panel_9.png", isSilhouette: false },
    { src: "images/frank/frank_panel_10.png", isSilhouette: false },

    // HANK
    { src: "brawler_gifs/hank_win.gif", isSilhouette: true, silhouetteColor: "#06b6d4" },
    { src: "brawler_gifs/hank_win.gif", isSilhouette: false },
    { src: "images/hank/hank_panel_8.png", isSilhouette: false },
    { src: "images/hank/hank_panel_9.png", isSilhouette: false },
    { src: "images/hank/hank_panel_10.png", isSilhouette: false },

    // MEG
    { src: "brawler_gifs/meg_win.gif", isSilhouette: true, silhouetteColor: "#ec4899" },
    { src: "brawler_gifs/meg_win.gif", isSilhouette: false },
    { src: "images/meg/meg_panel_8.png", isSilhouette: false },
    { src: "images/meg/meg_panel_9.png", isSilhouette: false },
    { src: "images/meg/meg_panel_10.png", isSilhouette: false },

    // Final Impact
    { src: "images/frank/frank_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const shadowRealmProps = {
  titleText: "THE SHADOW REALM",
  titleColor: "#a855f7",
  titleAccentColor: "#3b82f6",
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "expressions/mortis/special.png",
      auraColor: "#8b5cf6",
      startTime: 0,
      endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#c084fc", imageSrc: "images/mortis/mortis_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#60a5fa", imageSrc: "images/crow/crow_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#4ade80", imageSrc: "images/leon/leon_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#a855f7", imageSrc: "images/mortis/mortis_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/mortis/mortis_happy_pin.png",
      auraColor: "#8b5cf6",
      startTime: 3.60,
      endTime: 5.95,
      sfxSrc: "brawler_voices/mortis/super.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#581c87", imageSrc: "images/mortis/mortis_panel_3.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#7e22ce", imageSrc: "images/mortis/mortis_panel_4.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#9333ea", imageSrc: "images/mortis/mortis_panel_5.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#a855f7", imageSrc: "images/mortis/mortis_panel_6.png" },
      ]
    },
    {
      iconSrc: "expressions/crow/special.png",
      auraColor: "#3b82f6",
      startTime: 5.95,
      endTime: 8.33,
      sfxSrc: "brawler_voices/crow/super.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#1e3a8a", imageSrc: "images/crow/crow_panel_3.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#1d4ed8", imageSrc: "images/crow/crow_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#2563eb", imageSrc: "images/crow/crow_panel_5.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#3b82f6", imageSrc: "images/crow/crow_panel_6.png" },
      ]
    },
    {
      iconSrc: "expressions/leon/happy.png",
      auraColor: "#22c55e",
      startTime: 8.33,
      endTime: 11.083,
      sfxSrc: "brawler_voices/leon/leon_ulti_vo_01.ogg",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#14532d", imageSrc: "images/leon/leon_panel_3.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#15803d", imageSrc: "images/leon/leon_panel_4.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#16a34a", imageSrc: "images/leon/leon_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#22c55e", imageSrc: "images/leon/leon_panel_6.png" },
      ]
    },
  ],
  dropClips: [
    // MORTIS
    { src: "brawler_gifs/mortis_win.gif", isSilhouette: true, silhouetteColor: "#8b5cf6" },
    { src: "brawler_gifs/mortis_win.gif", isSilhouette: false },
    { src: "images/mortis/mortis_panel_8.png", isSilhouette: false },
    { src: "images/mortis/mortis_panel_9.png", isSilhouette: false },
    { src: "images/mortis/mortis_panel_10.png", isSilhouette: false },

    // CROW
    { src: "brawler_gifs/crow_win.gif", isSilhouette: true, silhouetteColor: "#3b82f6" },
    { src: "brawler_gifs/crow_win.gif", isSilhouette: false },
    { src: "images/crow/crow_panel_8.png", isSilhouette: false },
    { src: "images/crow/crow_panel_9.png", isSilhouette: false },
    { src: "images/crow/crow_panel_10.png", isSilhouette: false },

    // LEON
    { src: "brawler_gifs/leon_win.gif", isSilhouette: true, silhouetteColor: "#22c55e" },
    { src: "brawler_gifs/leon_win.gif", isSilhouette: false },
    { src: "images/leon/leon_panel_8.png", isSilhouette: false },
    { src: "images/leon/leon_panel_9.png", isSilhouette: false },
    { src: "images/leon/leon_panel_10.png", isSilhouette: false },

    // Final Impact
    { src: "images/crow/crow_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const rangerRanchFormsProps = {
  titleText: "RANGER RANCH",
  titleColor: "#3b82f6",
  titleAccentColor: "#f59e0b",
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "images/spray_bp_angels_vs_demons.png",
      auraColor: "#f59e0b",
      startTime: 0,
      endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#93c5fd", imageSrc: "images/colt/colt_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#c084fc", imageSrc: "images/shelly/shelly_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#86efac", imageSrc: "images/spike/spike_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#3b82f6", imageSrc: "images/colt/colt_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/colt/happy.png",
      auraColor: "#3b82f6",
      startTime: 3.60,
      endTime: 5.95,
      sfxSrc: "brawler_voices/colt/colt_kill_04.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#1e3a8a", imageSrc: "images/colt/colt_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#1d4ed8", imageSrc: "images/colt/colt_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#2563eb", imageSrc: "images/colt/colt_panel_6.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#3b82f6", imageSrc: "images/colt/colt_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/shelly/special.png",
      auraColor: "#a855f7",
      startTime: 5.95,
      endTime: 8.33,
      sfxSrc: "brawler_voices/shelly/super.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#581c87", imageSrc: "images/shelly/shelly_panel_4.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#7e22ce", imageSrc: "images/shelly/shelly_panel_5.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#9333ea", imageSrc: "images/shelly/shelly_panel_6.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#a855f7", imageSrc: "images/shelly/shelly_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/spike/happy.png",
      auraColor: "#22c55e",
      startTime: 8.33,
      endTime: 11.083,
      sfxSrc: "sound_effects/spike_super_explosion.mp3",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#14532d", imageSrc: "images/spike/spike_panel_4.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#15803d", imageSrc: "images/spike/spike_panel_5.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#16a34a", imageSrc: "images/spike/spike_panel_6.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#22c55e", imageSrc: "images/spike/spike_panel_7.png" },
      ]
    },
  ],
  dropClips: [
    // COLT
    { src: "brawler_gifs/colt_win.gif", isSilhouette: true, silhouetteColor: "#3b82f6" },
    { src: "brawler_gifs/colt_win.gif", isSilhouette: false },
    { src: "images/colt/colt_panel_8.png", isSilhouette: false },
    { src: "images/colt/colt_panel_9.png", isSilhouette: false },
    { src: "images/colt/colt_panel_10.png", isSilhouette: false },

    // SHELLY
    { src: "brawler_gifs/shelly_win.gif", isSilhouette: true, silhouetteColor: "#a855f7" },
    { src: "brawler_gifs/shelly_win.gif", isSilhouette: false },
    { src: "images/shelly/shelly_panel_8.png", isSilhouette: false },
    { src: "images/shelly/shelly_panel_9.png", isSilhouette: false },
    { src: "images/shelly/shelly_panel_10.png", isSilhouette: false },

    // SPIKE
    { src: "brawler_gifs/spike_win.gif", isSilhouette: true, silhouetteColor: "#22c55e" },
    { src: "brawler_gifs/spike_win.gif", isSilhouette: false },
    { src: "images/spike/spike_panel_8.png", isSilhouette: false },
    { src: "images/spike/spike_panel_9.png", isSilhouette: false },
    { src: "images/spike/spike_panel_10.png", isSilhouette: false },

    // Final Impact
    { src: "images/shelly/shelly_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};

export const shamanTribeFormsProps = {
  titleText: "SHAMAN TRIBE",
  titleColor: "#22c55e",
  titleAccentColor: "#ef4444",
  audioSrc: staticFile("audio/extracted_audio.wav"),
  introForms: [
    {
      iconSrc: "images/spray_bp_angels_vs_demons.png",
      auraColor: "#eab308",
      startTime: 0,
      endTime: 3.60,
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.1, color: "#86efac", imageSrc: "images/leon/leon_panel_1.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#fca5a5", imageSrc: "images/nita/nita_panel_1.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#fde047", imageSrc: "images/bo/bo_panel_1.png" },
        { quadrant: 4, startOffsetSeconds: 2.22, color: "#22c55e", imageSrc: "images/leon/leon_panel_2.png" },
      ]
    },
    {
      iconSrc: "expressions/leon/happy.png",
      auraColor: "#22c55e",
      startTime: 3.60,
      endTime: 5.95,
      sfxSrc: "brawler_voices/leon/leon_ulti_vo_01.ogg",
      panels: [
        { quadrant: 4, startOffsetSeconds: 0.1, color: "#14532d", imageSrc: "images/leon/leon_panel_4.png" },
        { quadrant: 1, startOffsetSeconds: 0.8, color: "#15803d", imageSrc: "images/leon/leon_panel_5.png" },
        { quadrant: 3, startOffsetSeconds: 1.45, color: "#16a34a", imageSrc: "images/leon/leon_panel_6.png" },
        { quadrant: 2, startOffsetSeconds: 1.85, color: "#22c55e", imageSrc: "images/leon/leon_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/nita/happy.png",
      auraColor: "#ef4444",
      startTime: 5.95,
      endTime: 8.33,
      sfxSrc: "brawler_voices/nita/nita_ulti_vo_01.ogg",
      panels: [
        { quadrant: 2, startOffsetSeconds: 0.05, color: "#7f1d1d", imageSrc: "images/nita/nita_panel_4.png" },
        { quadrant: 3, startOffsetSeconds: 0.85, color: "#991b1b", imageSrc: "images/nita/nita_panel_5.png" },
        { quadrant: 1, startOffsetSeconds: 1.45, color: "#dc2626", imageSrc: "images/nita/nita_panel_6.png" },
        { quadrant: 4, startOffsetSeconds: 1.85, color: "#ef4444", imageSrc: "images/nita/nita_panel_7.png" },
      ]
    },
    {
      iconSrc: "expressions/bo/special.png",
      auraColor: "#eab308",
      startTime: 8.33,
      endTime: 11.083,
      sfxSrc: "brawler_voices/bo/bo_ulti_vo_01.ogg",
      panels: [
        { quadrant: 1, startOffsetSeconds: 0.07, color: "#713f12", imageSrc: "images/bo/bo_panel_4.png" },
        { quadrant: 4, startOffsetSeconds: 0.87, color: "#854d0e", imageSrc: "images/bo/bo_panel_5.png" },
        { quadrant: 2, startOffsetSeconds: 1.45, color: "#ca8a04", imageSrc: "images/bo/bo_panel_6.png" },
        { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308", imageSrc: "images/bo/bo_panel_7.png" },
      ]
    },
  ],
  dropClips: [
    // LEON
    { src: "brawler_gifs/leon_win.gif", isSilhouette: true, silhouetteColor: "#22c55e" },
    { src: "brawler_gifs/leon_win.gif", isSilhouette: false },
    { src: "images/leon/leon_panel_8.png", isSilhouette: false },
    { src: "images/leon/leon_panel_9.png", isSilhouette: false },
    { src: "images/leon/leon_panel_10.png", isSilhouette: false },

    // NITA
    { src: "brawler_gifs/nita_win.gif", isSilhouette: true, silhouetteColor: "#ef4444" },
    { src: "brawler_gifs/nita_win.gif", isSilhouette: false },
    { src: "images/nita/nita_panel_8.png", isSilhouette: false },
    { src: "images/nita/nita_panel_9.png", isSilhouette: false },
    { src: "images/nita/nita_panel_10.png", isSilhouette: false },

    // BO
    { src: "brawler_gifs/bo_win.gif", isSilhouette: true, silhouetteColor: "#eab308" },
    { src: "brawler_gifs/bo_win.gif", isSilhouette: false },
    { src: "images/bo/bo_panel_8.png", isSilhouette: false },
    { src: "images/bo/bo_panel_9.png", isSilhouette: false },
    { src: "images/bo/bo_panel_10.png", isSilhouette: false },

    // Final Impact
    { src: "images/bo/bo_panel_13.png", isSilhouette: false },
  ],
  dropCuts: [
    10.700, 11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600,
    15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
  ]
};
