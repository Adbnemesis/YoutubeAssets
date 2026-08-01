import { RankingVideoConfig } from "../../types";
import { beatToFrame } from "../../beatGrid";
import { FIGHT_TURNS } from "../../abilities";

const FPS = 30;

/**
 * Full one-to-one recreation of the reference video structure.
 *
 * Reference mapping (measured, real time @59.9fps):
 *  Frame 172 = 2.87s  = B7  -> Transition 1 to tier grid (red blur)
 *  Frame 286 = 4.78s  = B10 -> D-tier slam (dislike pins)
 *  Frame 355 = 5.93s  = B13 -> B-tier promotion (cyan splash)
 *  Frame 488 = 8.15s  = B18 -> A-tier promotion (glitch box)
 *  Frame 541 = 9.03s  = B19 -> S-tier reveal (domino + hearts)
 *  Frame 604 = 10.08s = B21 -> Final candidate to S-tier
 *  Frame 747 = 12.47s = B27 -> Winner reveal (gold) — fight begins
 *  Frame 901 = 15.04s = B32 -> Fight continues, per-beat colors
 *  Frame 1001 = 16.71s = B37 -> Outro card (cyan) + "IS #1 BRAWLER! 🔥"
 *  Frame 1115 = 18.62s = B39 -> Gray fade to black
 */
export const sampleSceneConfig: RankingVideoConfig = {
  fps: FPS,
  durationInFrames: 561, // 18.7s — same length as the reference

  // ── Intro: ONE word at a time, synced to kenji's voiceover ─────────────
  // The reference fits the scene within the dialogue — the camera stays
  // basically still (whole board fitted), words pop on top, and only a gentle
  // rightward pan happens as the final phrase completes. No per-word zooms.
  // Our voiceover: "Who is the best brawler in Brawl Stars?" (NO "epic").
  // Word timings from scene01_kenji.wav: Who .00, is .46, the .68, best .80,
  // brawler 1.06, in 1.56, Brawl 1.76, Stars? 2.14.
  // Reference uses ~160-180 font size (at 720p), so at 1080p use ~240-270.
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

  // Roster header at top during intro (reference: Hank, Ash, Pearl, Rt)
  // Using our 4 brawlers since we have their portraits
  roster: [
    { id: "kenji", name: "Kenji", imageSrc: "brawl/portraits/kenji.png", tier: "S", accentColor: "#22C55E" },
    { id: "edgar", name: "Edgar", imageSrc: "brawl/portraits/edgar.png", tier: "S", accentColor: "#A855F7" },
    { id: "shelly", name: "Shelly", imageSrc: "brawl/portraits/shelly.png", tier: "S", accentColor: "#FF6B6B" },
    { id: "frank", name: "Frank", imageSrc: "brawl/portraits/frank.png", tier: "S", accentColor: "#38BDF8" },
  ],
  introPin: { emoji: "😎", color: "#FFD60A" },

  // ── Tier list grid (4 brawlers, like the reference) ────────────────────
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
        id: "kenji",
        name: "Kenji",
        imageSrc: "brawl/portraits/kenji.png",
        dropFrame: 0,
        initialTier: "S",
        moves: [
          { frame: beatToFrame(7, FPS), tier: "D", duration: 42 }, // sudden drop
          { frame: beatToFrame(13, FPS), tier: "B", fx: "splash" },
          { frame: beatToFrame(19, FPS), tier: "S", fx: "domino" },
        ],
        dislikeFrame: beatToFrame(11, FPS),
        heartFrame: beatToFrame(19, FPS),
        accentColor: "#22C55E",
      },
      {
        id: "edgar",
        name: "Edgar",
        imageSrc: "brawl/portraits/edgar.png",
        dropFrame: 2,
        initialTier: "S",
        moves: [
          { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
          { frame: beatToFrame(18, FPS), tier: "A", fx: "glitch" },
          { frame: beatToFrame(21, FPS), tier: "S", fx: "domino" },
        ],
        dislikeFrame: beatToFrame(11, FPS),
        heartFrame: beatToFrame(21, FPS),
        defeatFrame: beatToFrame(23, FPS), // last eliminated
        accentColor: "#A855F7",
      },
      {
        id: "shelly",
        name: "Shelly",
        imageSrc: "brawl/portraits/shelly.png",
        dropFrame: 4,
        initialTier: "S",
        moves: [{ frame: beatToFrame(7, FPS), tier: "D", duration: 42 }],
        dislikeFrame: beatToFrame(11, FPS),
        defeatFrame: beatToFrame(21, FPS), // eliminated mid-fight
        accentColor: "#FF6B6B",
      },
      {
        id: "frank",
        name: "Frank",
        imageSrc: "brawl/portraits/frank.png",
        dropFrame: 6,
        initialTier: "S",
        moves: [{ frame: beatToFrame(7, FPS), tier: "D", duration: 42 }],
        dislikeFrame: beatToFrame(11, FPS),
        defeatFrame: beatToFrame(19, FPS), // first eliminated
        accentColor: "#38BDF8",
      },
    ],
  },

  gridRevealFrame: beatToFrame(7, FPS),
  gridSettleFrame: beatToFrame(7, FPS),
  slamFrame: beatToFrame(11, FPS), // reference's green-flash slam at 4.9s ≈ B11

  // Fight window — brawler PNG icons battle inside the tier list (6-12s).
  // Each beat a brawler attacks with their actual ability VFX.
  // The last brawler is eliminated at B23(frame 280) — Kenji showcase starts immediately.
  fight: {
    start: beatToFrame(14, FPS),
    end: beatToFrame(24, FPS), // was 27, now showcase starts immediately after defeat
    turns: FIGHT_TURNS,
  },


  // ── Background colors per beat (measured from the reference) ───
  // Intro beats 1-6: progressive brightening to match reference luminance curve (28→61→84)
  // Winner phase: luminance 57→74→57→58→53 as per reference
  colorCycle: [
    { beat: 1, color: "#242008" }, // t=0.48s - luminance ~28
    { beat: 2, color: "#2E2810" }, // t=0.95s - luminance ~37
    { beat: 3, color: "#383018" }, // t=1.43s - luminance ~46
    { beat: 4, color: "#423820" }, // t=1.90s - luminance ~55
    { beat: 5, color: "#4C4428" }, // t=2.38s - luminance ~64
    { beat: 6, color: "#605828" }, // t=2.86s - luminance ~84 peak intro
    { beat: 7, color: "#12100D" }, // grid reveal (warm dark)
    { beat: 10, color: "#151510" }, // D slam
    { beat: 11, color: "#0C1A0D" }, // D slam green tint
    { beat: 13, color: "#0C1A16" }, // B promo (cyan tint)
    // fight dynamics (reference: dim → push brighten → warm → purple → build)
    { beat: 14, color: "#0E1A18" },
    { beat: 16, color: "#182528" },
    { beat: 18, color: "#1D2A2C" },
    { beat: 20, color: "#2A1E18" }, // warm shift
    { beat: 22, color: "#1E1A2C" }, // purple phase
    { beat: 24, color: "#20283A" }, // grey-blue build
    { beat: 26, color: "#1A1D20" },
    // winner showcase — vibrant per-beat colors like the reference
    { beat: 24, color: "#7C3AED" }, // purple winner card (was B27, now starts B24)
    { beat: 25, color: "#D97706" }, // warm orange spin start
    { beat: 26, color: "#B45309" }, // amber
    { beat: 27, color: "#7C3AED" }, // purple title card (reference Frame 747)
    { beat: 28, color: "#D97706" }, // warm orange (reference Frame 901)
    { beat: 29, color: "#B45309" }, // amber
    { beat: 30, color: "#CA8A04" }, // yellow
    { beat: 31, color: "#DB2777" }, // pink
    { beat: 32, color: "#0E7490" }, // cyan
    { beat: 33, color: "#7C3AED" }, // purple
    { beat: 34, color: "#9333EA" }, // violet
    { beat: 35, color: "#C2410C" }, // burnt orange
    { beat: 36, color: "#D97706" }, // orange
    { beat: 37, color: "#0284C7" }, // cyan outro card (reference Frame 1001)
    { beat: 38, color: "#0369A1" }, // deep blue
  ],

  flashes: [
    { frame: beatToFrame(7, FPS), color: "#FF2A2A", maxOpacity: 0.8, duration: 6 },
    { frame: beatToFrame(11, FPS), color: "#22C55E", maxOpacity: 0.9, duration: 8 },
    { frame: beatToFrame(13, FPS), color: "#38BDF8", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(18, FPS), color: "#06B6D4", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(19, FPS), color: "#FFD60A", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(21, FPS), color: "#FFD60A", maxOpacity: 0.55, duration: 4 },
    { frame: beatToFrame(24, FPS), color: "#FFFFFF", maxOpacity: 0.9, duration: 6 }, // winner reveal white flash (B24)
    { frame: beatToFrame(25, FPS), color: "#FFFFFF", maxOpacity: 0.5, duration: 4 },
    { frame: beatToFrame(29, FPS), color: "#FFFFFF", maxOpacity: 0.5, duration: 4 },
    { frame: beatToFrame(37, FPS), color: "#FFFFFF", maxOpacity: 0.6, duration: 5 }, // outro card flash
  ],

  transitions: [
    { frame: beatToFrame(7, FPS) }, // red blur wipe into grid
    { frame: beatToFrame(24, FPS) }, // white wipe into winner
  ],

  // ── Winner phases ───────────────────────────────────────────────────────
  winner: {
    phases: [
      {
        type: "title",
        frame: beatToFrame(24, FPS), // 343 — Kenji wins immediately after last elimination
        endFrame: beatToFrame(25, FPS), // 358 — quick title flash
        backgroundColor: "#7C3AED", // vibrant purple (matches colorCycle beat 27, reference Frame 747)
        accentColor: "#FFD60A",
        entryId: "kenji",
        title: "KENJI",
      },
      {
        type: "spin",
        frame: beatToFrame(25, FPS), // 358 — the winner "edit" starts immediately
        endFrame: beatToFrame(37, FPS), // 519
        backgroundColor: "#3D1E23", // dark pink (will be overridden by colorCycle per beat)
        accentColor: "#FFD60A",
        entryId: "kenji",
        title: "KENJI",
        spinSpeed: 9,
      },
      {
        type: "outro",
        frame: beatToFrame(37, FPS), // 519
        endFrame: 561,
        backgroundColor: "#0284C7", // cyan pastel (reference outro card)
        accentColor: "#FFD60A",
        entryId: "kenji",
        title: "KENJI",
        subtitle: "IS #1 BRAWLER! 🔥",
      },
    ],
  },

  camera: {
    baseScale: 1,
    // Intro: the whole scene is FITTED within the dialogue (like the reference).
    // The reference camera stays basically static at the full tier list, with a
    // gentle push-in during the words and a slight rightward pan as the final
    // phrase completes, then it settles back for the B7 red wipe.
    // Empirical reference intro camera choreography (1.65x zoom left-to-right pan, originY 40% for zero card clipping):
    //  0.0s - 0.8s (f0-f24): Zoomed IN on left brawlers (scale: 1.65, originX: 25%, originY: 40%)
    //  0.8s - 1.8s (f24-f54): Smooth pan to right brawlers (scale: 1.65, originX: 75%, originY: 40%)
    //  1.8s - 2.6s (f54-f78): Smooth zoom OUT to full board (scale: 1.0, originX: 50%, originY: 50%)
    //  2.6s - 2.87s (f78-f86): Settle for red wipe grid reveal
        // Empirical reference intro camera choreography (1.65x zoom left-to-right pan):
    // S-row cards sit near the top (center y≈192 of 1920), so originY≈15%
    // zooms into the card row without clipping the icons at the top.
    introPath: [
      { frame: 0, scale: 1.0, originX: 50, originY: 50 },
      { frame: 8, scale: 1.45, originX: 26, originY: 15 },
      { frame: 28, scale: 1.45, originX: 26, originY: 15 },
      { frame: 54, scale: 1.45, originX: 74, originY: 15 },
      { frame: 74, scale: 1.2, originX: 60, originY: 22 },
      { frame: 82, scale: 1.0, originX: 50, originY: 50 },
      { frame: 90, scale: 1.0, originX: 50, originY: 50 },
    ],
    events: [
      { frame: beatToFrame(7, FPS), type: "punch", intensity: 1 },
      { frame: beatToFrame(10, FPS), type: "shakeBig", intensity: 1 },
      { frame: beatToFrame(13, FPS), type: "punch", intensity: 0.9 },
      { frame: beatToFrame(18, FPS), type: "punch", intensity: 0.9 },
      { frame: beatToFrame(19, FPS), type: "shakeBig", intensity: 1 },
      { frame: beatToFrame(21, FPS), type: "punch", intensity: 0.9 },
      { frame: beatToFrame(24, FPS), type: "punch", intensity: 1.1 }, // winner reveal
      { frame: beatToFrame(25, FPS), type: "shake", intensity: 0.6 },
      { frame: beatToFrame(29, FPS), type: "shake", intensity: 0.6 },
      { frame: beatToFrame(32, FPS), type: "shake", intensity: 0.6 },
      { frame: beatToFrame(37, FPS), type: "shakeBig", intensity: 1 },
    ],
  },

  // Tier list fills the screen during the intro, pulling in slightly,
  // then settling to full view on the B7 transition beat.
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
    // Fight window: BGM drops to ~0.2, slams back at B24 (Kenji wins)
    fightDuck: { from: 6.0, to: 11.8, volume: 0.2 },
    voiceSrc: "brawl/sfx/scene01_kenji.wav",
    voiceVolume: 1,
    fadeOutFrames: 26,
    sfx: [
      { frame: beatToFrame(7, FPS), src: "brawl/sfx/whoosh.mp3", volume: 0.95 },
      { frame: beatToFrame(7, FPS) + 4, src: "brawl/sfx/riser.mp3", volume: 0.5 },
      { frame: beatToFrame(11, FPS), src: "brawl/sfx/pop.mp3", volume: 0.8 },
      { frame: beatToFrame(11, FPS) + 2, src: "brawl/sfx/pop.mp3", volume: 0.8 },
      { frame: beatToFrame(11, FPS) + 4, src: "brawl/sfx/pop.mp3", volume: 0.8 },
      { frame: beatToFrame(11, FPS) + 6, src: "brawl/sfx/pop.mp3", volume: 0.8 },
      // fight — real Brawl Stars game attack sounds (muted once a brawler is defeated)
      { frame: beatToFrame(14, FPS), src: "brawl/sfx/kenji_atk_sfx_01.mp3", volume: 0.9, brawlerId: "kenji" }, // Kenji slash
      { frame: beatToFrame(15, FPS), src: "brawl/sfx/edgar_punch_01.mp3", volume: 0.85, brawlerId: "edgar" }, // Edgar punch
      { frame: beatToFrame(15, FPS) + 3, src: "brawl/sfx/edgar_punch_impact.mp3", volume: 0.6, brawlerId: "edgar" },
      { frame: beatToFrame(16, FPS), src: "brawl/sfx/shelly_attack.mp3", volume: 0.9, brawlerId: "shelly" }, // Shelly shotgun
      { frame: beatToFrame(17, FPS), src: "brawl/sfx/frank_swing.mp3", volume: 0.85, brawlerId: "frank" }, // Frank hammer swing
      { frame: beatToFrame(17, FPS) + 4, src: "brawl/sfx/frank_hit.mp3", volume: 0.8, brawlerId: "frank" }, // hammer impact
      { frame: beatToFrame(18, FPS), src: "brawl/sfx/edgar_super_01.mp3", volume: 0.95, brawlerId: "edgar" }, // Edgar Let's Fly
      { frame: beatToFrame(19, FPS), src: "brawl/sfx/kenji_tuna_ulti_01.mp3", volume: 1, brawlerId: "kenji" }, // Kenji Hosomaki
      { frame: beatToFrame(20, FPS), src: "brawl/sfx/shelly_super.mp3", volume: 0.95, brawlerId: "shelly" }, // Shelly Super Shell
      { frame: beatToFrame(21, FPS), src: "brawl/sfx/frank_super_swing.mp3", volume: 0.9, brawlerId: "frank" }, // Frank stun swing
      { frame: beatToFrame(21, FPS) + 4, src: "brawl/sfx/frank_super_hit.mp3", volume: 0.9, brawlerId: "frank" }, // stun impact
      { frame: beatToFrame(22, FPS), src: "brawl/sfx/kenji_atk_sfx_02.mp3", volume: 0.85, brawlerId: "kenji" },
      { frame: beatToFrame(23, FPS), src: "brawl/sfx/edgar_punch_01.mp3", volume: 0.85, brawlerId: "edgar" },
      { frame: beatToFrame(24, FPS), src: "brawl/sfx/shelly_attack.mp3", volume: 0.85, brawlerId: "shelly" },
      { frame: beatToFrame(25, FPS), src: "brawl/sfx/frank_swing.mp3", volume: 0.85, brawlerId: "frank" },
      { frame: beatToFrame(25, FPS) + 4, src: "brawl/sfx/frank_hit.mp3", volume: 0.8, brawlerId: "frank" },
      // winner drop
      { frame: beatToFrame(24, FPS), src: "brawl/sfx/brawl_match_win.mp3", volume: 0.95 },
      { frame: beatToFrame(31, FPS) - 6, src: "brawl/sfx/riser.mp3", volume: 0.4 },
      { frame: beatToFrame(35, FPS), src: "brawl/sfx/kenji_tuna_ulti_01.mp3", volume: 0.9 },
      { frame: beatToFrame(37, FPS), src: "brawl/sfx/chime.mp3", volume: 0.6 },
    ],
  },
};