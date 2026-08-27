import { RankingVideoConfig } from "../../types";
import { beatToFrame } from "../../beatGrid";
import { FIGHT_TURNS_MBGC } from "../../abilities";

const FPS = 30;

/**
 * Short #2 — "Who is the best brawler in Brawl Stars?" (Melodie / Bibi / Gale / Crow)
 *
 * Winner: MELODIE 🔥
 *
 * Beat-locked to the MEASURED beats of ranking_tier_list.mp3 (BGM at 8.499s):
 *   B1-B6   intro words — EVERYONE starts at S
 *   B7      RED wipe → tier grid reveal (3.04s), cards shown at S
 *   B8      S→D DROP — all 4 slam down on the beat (3.54s, fast ~16f drop)
 *   B11     GREEN slam — dislike pins + pops land (5.0s, the "all trash" beat)
 *   B13     Bibi recovers D→B (splash)
 *   B14-B24 CLEAN fight — one brawler attacks per beat (music-volume drop)
 *   B18     Crow recovers D→A (glitch) · B19 Melodie D→S (hearts, slot 3)
 *   B21     Bibi reaches S (final candidate)
 *   B27     WINNER reveal — the GOLD drop (12.64s, different phonk)
 *   B28-B36 spin (color per beat) · B37 climax → cyan outro → fade (18.6s)
 *
 * Fight story (every KO follows a defeat, exactly one attacker per beat):
 *   Bibi beats Gale (Gale fights back, falls) → Melodie & Crow trade, Melodie
 *   wins → Bibi's last stand, Melodie takes the title.
 *
 * The winner lands RIGHTMOST in S (slot 3) — not first from the left.
 */
export const mbgcSceneConfig: RankingVideoConfig = {
  fps: FPS,
  durationInFrames: 559, // 18.63s — same length as the reference video

  // ── Intro: ONE word at a time, synced to the same kenji voiceover ───────
  titleWords: [
    { text: "WHO", frame: 0, fontSize: 170, color: "#22C55E" },
    { text: "IS", frame: 14, fontSize: 170, color: "#22C55E" },
    { text: "THE", frame: 20, fontSize: 170, color: "#22C55E" },
    { text: "BEST", frame: 24, fontSize: 170, color: "#22C55E" },
    { text: "BRAWLER", frame: 32, fontSize: 140, color: "#22C55E" },
    { text: "IN", frame: 47, fontSize: 170, color: "#22C55E" },
    { text: "BRAWL", frame: 53, fontSize: 150, color: "#FFD60A" },
    { text: "STARS?", frame: 64, fontSize: 145, color: "#FFD60A" },
  ],

  // Roster header at top during intro — all start at S
  roster: [
    { id: "melodie", name: "Melodie", imageSrc: "brawl/portraits/melodie.png", tier: "S", accentColor: "#EC4899" },
    { id: "bibi", name: "Bibi", imageSrc: "brawl/portraits/bibi.png", tier: "S", accentColor: "#F43F5E" },
    { id: "gale", name: "Gale", imageSrc: "brawl/portraits/gale.png", tier: "S", accentColor: "#38BDF8" },
    { id: "crow", name: "Crow", imageSrc: "brawl/portraits/crow.png", tier: "S", accentColor: "#A855F7" },
  ],
  introPin: { emoji: "😎", color: "#FFD60A" },

  // ── Tier list grid — everyone starts at S, all slam to D on B11 ─────────
  tierList: {
    rows: [
      { key: "S", label: "S", color: "#E0245E", textColor: "#FFFFFF" },
      { key: "A", label: "A", color: "#FF9F0A", textColor: "#1F2937" },
      { key: "B", label: "B", color: "#FFD60A", textColor: "#1F2937" },
      { key: "C", label: "C", color: "#30D158", textColor: "#FFFFFF" },
      { key: "D", label: "D", color: "#0A84FF", textColor: "#FFFFFF" },
    ],
    labelStripSrc: "brawl/images/tier_list.png",
    entries: [
      {
        id: "bibi",
        name: "Bibi",
        imageSrc: "brawl/portraits/bibi.png",
        dropFrame: 0,
        initialTier: "S", // the presumed favorite
        moves: [
          // S→D drop: slow dramatic crash like the sample (fires at the reveal
          // beat B7, ~42 frames, cards visibly fall through A/B/C into D).
          { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
          { frame: beatToFrame(13, FPS), tier: "B", fx: "splash" }, // recovers
          { frame: beatToFrame(21, FPS), tier: "S", fx: "domino" }, // final candidate
        ],
        dislikeFrame: beatToFrame(11, FPS), // dislike pins slam at B11
        defeatFrame: beatToFrame(25, FPS), // loses the last stand to Melodie
        accentColor: "#F43F5E",
      },
      {
        id: "gale",
        name: "Gale",
        imageSrc: "brawl/portraits/gale.png",
        dropFrame: 2,
        initialTier: "S",
        moves: [{ frame: beatToFrame(7, FPS), tier: "D", duration: 42 }],
        dislikeFrame: beatToFrame(11, FPS),
        defeatFrame: beatToFrame(17, FPS), // beaten by Bibi despite fighting back
        accentColor: "#38BDF8",
      },
      {
        id: "crow",
        name: "Crow",
        imageSrc: "brawl/portraits/crow.png",
        dropFrame: 4,
        initialTier: "S",
        moves: [
          { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
          { frame: beatToFrame(18, FPS), tier: "A", fx: "glitch" }, // recovers
        ],
        dislikeFrame: beatToFrame(11, FPS),
        defeatFrame: beatToFrame(23, FPS), // loses to Melodie (the runner-up)
        accentColor: "#A855F7",
      },
      {
        id: "melodie",
        name: "Melodie",
        imageSrc: "brawl/portraits/melodie.png",
        dropFrame: 6,
        initialTier: "S",
        moves: [
          { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
          // the underdog climbs straight to S — lands RIGHTMOST (slot 3)
          { frame: beatToFrame(19, FPS), tier: "S", fx: "domino", slot: 3 },
        ],
        dislikeFrame: beatToFrame(11, FPS),
        heartFrame: beatToFrame(19, FPS),
        accentColor: "#EC4899",
      },
    ],
  },

  gridRevealFrame: beatToFrame(7, FPS),
  gridSettleFrame: beatToFrame(7, FPS),
  // The dislike-pin "slam" (green flash + pops + D-row shake) lands on B11.
  slamFrame: beatToFrame(11, FPS),

  // Fight window — starts on the BGM's music-volume drop, ends at the winner drop.
  fight: {
    start: beatToFrame(14, FPS),
    end: beatToFrame(27, FPS),
    turns: FIGHT_TURNS_MBGC,
  },

  // ── Background colors per beat (measured reference structure) ────────────
  colorCycle: [
    // intro — progressive brightening
    { beat: 1, color: "#242008" },
    { beat: 2, color: "#2E2810" },
    { beat: 3, color: "#383018" },
    { beat: 4, color: "#423820" },
    { beat: 5, color: "#4C4428" },
    { beat: 6, color: "#605828" },
    // reveal + slam
    { beat: 7, color: "#12100D" },
    { beat: 8, color: "#151510" },
    { beat: 9, color: "#151510" },
    { beat: 10, color: "#151510" },
    { beat: 11, color: "#0C1A0D" }, // green slam
    { beat: 12, color: "#151510" },
    { beat: 13, color: "#0C1A16" }, // bibi → B (cyan tint)
    // fight — music-volume-drop section
    { beat: 14, color: "#0E1A18" },
    { beat: 15, color: "#182528" },
    { beat: 16, color: "#1D2A2C" },
    { beat: 17, color: "#1D2A2C" },
    { beat: 18, color: "#2A1E18" }, // warm shift (crow → A)
    { beat: 19, color: "#1E1A2C" }, // purple (melodie → S)
    { beat: 20, color: "#20283A" },
    { beat: 21, color: "#2A1E18" }, // bibi → S
    { beat: 22, color: "#1E1A2C" }, // crow falls
    { beat: 23, color: "#20283A" },
    { beat: 24, color: "#1A1D20" }, // bibi falls
    { beat: 25, color: "#20283A" },
    { beat: 26, color: "#1A1D20" }, // build
    // winner showcase — per-beat color switches (reference B27-B38)
    { beat: 27, color: "#7C3AED" }, // purple winner card + gold flash
    { beat: 28, color: "#D97706" }, // gold
    { beat: 29, color: "#DB2777" }, // pink/magenta
    { beat: 30, color: "#0E7490" }, // cyan
    { beat: 31, color: "#9333EA" }, // violet
    { beat: 32, color: "#CA8A04" }, // yellow
    { beat: 33, color: "#67E8F9" }, // cyan-white
    { beat: 34, color: "#0E7490" }, // cyan-blue
    { beat: 35, color: "#DB2777" }, // magenta
    { beat: 36, color: "#D97706" }, // warm
    { beat: 37, color: "#0284C7" }, // cyan (climax flash)
    { beat: 38, color: "#0369A1" }, // outro
    { beat: 39, color: "#0369A1" }, // fade
  ],

  flashes: [
    { frame: beatToFrame(7, FPS), color: "#FF2A2A", maxOpacity: 0.8, duration: 6 },
    { frame: beatToFrame(11, FPS), color: "#22C55E", maxOpacity: 0.9, duration: 8 },
    { frame: beatToFrame(13, FPS), color: "#38BDF8", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(18, FPS), color: "#06B6D4", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(19, FPS), color: "#FFD60A", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(21, FPS), color: "#FFD60A", maxOpacity: 0.55, duration: 4 },
    { frame: beatToFrame(27, FPS), color: "#FFD60A", maxOpacity: 0.9, duration: 6 }, // GOLD winner flash
    { frame: beatToFrame(28, FPS), color: "#FFFFFF", maxOpacity: 0.5, duration: 4 },
    { frame: beatToFrame(31, FPS), color: "#FFFFFF", maxOpacity: 0.5, duration: 4 },
    { frame: beatToFrame(34, FPS), color: "#FFFFFF", maxOpacity: 0.5, duration: 4 },
    { frame: beatToFrame(37, FPS), color: "#FFFFFF", maxOpacity: 0.9, duration: 6 }, // climax flash
    { frame: beatToFrame(38, FPS), color: "#FFFFFF", maxOpacity: 0.6, duration: 5 }, // outro flash
  ],

  transitions: [
    { frame: beatToFrame(7, FPS) }, // red blur wipe into the grid
    { frame: beatToFrame(27, FPS) }, // white wipe into the winner
  ],

  // ── Winner phases — MELODIE 🔥 (reveal on B27, the GOLD drop) ────────────
  winner: {
    phases: [
      {
        type: "title",
        frame: beatToFrame(27, FPS),
        endFrame: beatToFrame(28, FPS),
        backgroundColor: "#7C3AED",
        accentColor: "#FFD60A",
        entryId: "melodie",
        title: "MELODIE",
      },
      {
        type: "spin",
        frame: beatToFrame(28, FPS),
        endFrame: beatToFrame(37, FPS),
        backgroundColor: "#3D1E23",
        accentColor: "#FFD60A",
        entryId: "melodie",
        title: "MELODIE",
        spinSpeed: 9,
      },
      {
        type: "outro",
        frame: beatToFrame(37, FPS),
        endFrame: 559,
        backgroundColor: "#0284C7",
        accentColor: "#FFD60A",
        entryId: "melodie",
        title: "MELODIE",
        subtitle: "IS #1 BRAWLER! 🔥",
      },
    ],
  },

  camera: {
    baseScale: 1,
    introPath: [
      { frame: 0, scale: 1.0, originX: 50, originY: 50 },
      { frame: 8, scale: 1.45, originX: 26, originY: 15 },
      { frame: 28, scale: 1.45, originX: 26, originY: 15 },
      { frame: 54, scale: 1.45, originX: 74, originY: 15 },
      { frame: 74, scale: 1.2, originX: 60, originY: 22 },
      { frame: 82, scale: 1.0, originX: 50, originY: 50 },
      { frame: 92, scale: 1.0, originX: 50, originY: 50 },
    ],
    events: [
      { frame: beatToFrame(7, FPS), type: "punch", intensity: 1 },
      { frame: beatToFrame(10, FPS), type: "shakeBig", intensity: 1 },
      { frame: beatToFrame(13, FPS), type: "punch", intensity: 0.9 },
      { frame: beatToFrame(18, FPS), type: "punch", intensity: 0.9 },
      { frame: beatToFrame(19, FPS), type: "shakeBig", intensity: 1 },
      { frame: beatToFrame(21, FPS), type: "punch", intensity: 0.9 },
      { frame: beatToFrame(27, FPS), type: "punch", intensity: 1.1 },
      { frame: beatToFrame(28, FPS), type: "shake", intensity: 0.6 },
      { frame: beatToFrame(31, FPS), type: "shake", intensity: 0.6 },
      { frame: beatToFrame(34, FPS), type: "shake", intensity: 0.6 },
      { frame: beatToFrame(37, FPS), type: "shakeBig", intensity: 1 },
    ],
  },

  cameraZoomOut: {
    from: beatToFrame(7, FPS),
    to: beatToFrame(7, FPS) + 16,
    fromScale: 1,
    toScale: 1,
  },

  audio: {
    bgmSrc: "brawl/sfx/ranking_tier_list.mp3",
    bgmStartSeconds: 8.499,
    bgmVolume: 1,
    duck: { from: 0, to: 3.1, volume: 0.4 },
    // Fight window (B14-B27 ≈ 6.4-12.6s): BGM ducks on the breakdown,
    // slams back at the winner drop.
    fightDuck: { from: 6.2, to: 12.8, volume: 0.2 },
    voiceSrc: "brawl/sfx/scene01_kenji.wav",
    voiceVolume: 1,
    fadeOutFrames: 26,
    sfx: [
      // reveal (B7) + S→D slow crash (B7→~B10)
      { frame: beatToFrame(7, FPS), src: "brawl/sfx/whoosh.mp3", volume: 0.95 },
      { frame: beatToFrame(7, FPS) + 4, src: "brawl/sfx/riser.mp3", volume: 0.5 },
      // dislike-pin slam on B11 — the "all trash" beat
      { frame: beatToFrame(11, FPS), src: "brawl/sfx/pop.mp3", volume: 0.8 },
      { frame: beatToFrame(11, FPS) + 2, src: "brawl/sfx/pop.mp3", volume: 0.8 },
      { frame: beatToFrame(11, FPS) + 4, src: "brawl/sfx/pop.mp3", volume: 0.8 },
      { frame: beatToFrame(11, FPS) + 6, src: "brawl/sfx/pop.mp3", volume: 0.8 },
      // promotions
      { frame: beatToFrame(13, FPS), src: "brawl/sfx/brawl_super.mp3", volume: 0.7 },
      { frame: beatToFrame(18, FPS), src: "brawl/sfx/brawl_super.mp3", volume: 0.8 },
      { frame: beatToFrame(19, FPS), src: "brawl/sfx/brawl_hypercharge.mp3", volume: 0.95 },
      { frame: beatToFrame(19, FPS) + 4, src: "brawl/sfx/riser.mp3", volume: 0.45 },
      { frame: beatToFrame(21, FPS), src: "brawl/sfx/brawl_super.mp3", volume: 0.8 },
      // fight — ONE brawler per beat, real Brawl Stars game attack sounds
      { frame: beatToFrame(14, FPS), src: "brawl/sfx/bibi_swing_03.mp3", volume: 0.9, brawlerId: "bibi" },
      { frame: beatToFrame(15, FPS), src: "brawl/sfx/gale_atk_01.mp3", volume: 0.9, brawlerId: "gale" },
      { frame: beatToFrame(16, FPS), src: "brawl/sfx/bibi_ulti_02.mp3", volume: 0.95, brawlerId: "bibi" },
      { frame: beatToFrame(16, FPS) + 4, src: "brawl/sfx/bibi_ulti_hit_01.mp3", volume: 0.8, brawlerId: "bibi" },
      { frame: beatToFrame(17, FPS), src: "brawl/sfx/melodie_atk_sfx_01.mp3", volume: 0.9, brawlerId: "melodie" },
      { frame: beatToFrame(20, FPS), src: "brawl/sfx/crow_ulti_01.mp3", volume: 0.95, brawlerId: "crow" },
      { frame: beatToFrame(22, FPS), src: "brawl/sfx/melodie_ulti_sfx_01.mp3", volume: 1, brawlerId: "melodie" },
      { frame: beatToFrame(23, FPS), src: "brawl/sfx/bibi_swing_03.mp3", volume: 0.85, brawlerId: "bibi" },
      { frame: beatToFrame(24, FPS), src: "brawl/sfx/melodie_ulti_sfx_01.mp3", volume: 1, brawlerId: "melodie" }, // finisher
      // winner drop + showcase
      { frame: beatToFrame(27, FPS), src: "brawl/sfx/brawl_match_win.mp3", volume: 0.95 },
      { frame: beatToFrame(36, FPS) - 6, src: "brawl/sfx/riser.mp3", volume: 0.4 },
      { frame: beatToFrame(37, FPS), src: "brawl/sfx/chime.mp3", volume: 0.6 },
      { frame: beatToFrame(38, FPS), src: "brawl/sfx/melodie_ulti_sfx_01.mp3", volume: 0.85 },
    ],
  },
};
