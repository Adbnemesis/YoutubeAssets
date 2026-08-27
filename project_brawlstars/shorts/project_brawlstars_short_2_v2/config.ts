import { RankingVideoConfig, CameraPathPoint, BrawlerEntry } from "../../types";
import { beatToFrame } from "../../beatGrid";
import { FIGHT_TURNS_MBGC } from "../../abilities";
import { cardPos, centerOrigin, CARD_SIZE } from "../../layout";

const FPS = 30;

/**
 * Short #2 v2 — "Who is the best brawler in Brawl Stars?" (Melodie / Bibi /
 * Gale / Crow). Winner: MELODIE 🔥
 *
 * Changes vs v1 (per reference-frame analysis of the real video):
 *  1. PITCH-BLACK tier list — no neon glows on cards/letters, no tint over the
 *     grid. The reference body is solid black; only the winner showcase keeps
 *     the per-beat color switches.
 *  2. BATTLE CAMERA — during the fight the camera zooms in toward the battling
 *     brawler pair (reference: icon fills ~50% of frame height), making each
 *     exchange clear instead of a static full-board view.
 *  3. CLEAN BATTLE — one small projectile per attack (no full-board streaks,
 *     no glow trails), matching the reference's clean single-projectile look.
 *
 * Same dialogue + BGM + beat grid as v1.
 */

// Build the fight camera path: hold a STEADY close-up on the battling brawler
// pair for the whole fight, smoothly shifting origin between attack pairs.
// Reference behavior: camera is locked on the fighting icons — no per-beat
// zoom pulses, no shake, and BOTH fighters are always fully visible. The zoom
// is strong (~1.7x) so the pair fills the frame and bystanders drop out of
// view — this is what kills the "cluttered full board" look.
const buildFightPath = (entries: BrawlerEntry[]): CameraPathPoint[] => {
  const fightStart = beatToFrame(14, FPS);
  const fightEnd = beatToFrame(27, FPS);
  // Reference: moderate ~1.3x zoom locks the camera on the fighting pair,
  // dropping bystanders out of view. Only pull back for far-apart ranged pairs.
  const BASE_ZOOM = 1.3;
  const points: CameraPathPoint[] = [
    { frame: fightStart - 6, scale: 1, originX: 50, originY: 50 },
  ];
  const turns = [...FIGHT_TURNS_MBGC].sort((a, b) => a.beat - b.beat);
  for (const t of turns) {
    const bf = beatToFrame(t.beat, FPS);
    const atk = cardPos(entries, t.id, bf);
    const tgt = t.targetId ? cardPos(entries, t.targetId, bf) : null;
    if (!atk || !tgt) continue;
    // Where the attacker actually stands during the turn (same as TierList):
    // melee slides adjacent to the target; ranged STAYS in its own slot and
    // the projectile flies the gap (reference: Meeple throws from D up to S).
    let stand = atk;
    if (t.melee) {
      const sameRow = Math.abs(atk.y - tgt.y) < 100;
      if (sameRow) {
        const dir = tgt.x >= atk.x ? -1 : 1;
        stand = { x: tgt.x + dir * (CARD_SIZE + 24), y: tgt.y };
      } else {
        const dir = tgt.y >= atk.y ? -1 : 1;
        stand = { x: tgt.x, y: tgt.y + dir * (CARD_SIZE + 24) };
      }
    }
    // Bounding box of BOTH cards (with margin) — guarantee full visibility.
    const minX = Math.min(stand.x, tgt.x) - CARD_SIZE;
    const maxX = Math.max(stand.x, tgt.x) + CARD_SIZE;
    const minY = Math.min(stand.y, tgt.y) - CARD_SIZE;
    const maxY = Math.max(stand.y, tgt.y) + CARD_SIZE;
    const bw = maxX - minX;
    const bh = maxY - minY;
    // Strong zoom; only pull back if a far-apart ranged pair needs it.
    const zoom = Math.min(BASE_ZOOM, Math.min(1080 / (bw * 1.12), 1920 / (bh * 1.12)));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const { originX, originY } = centerOrigin(cx, cy, zoom);
    // Ease in to the pair just before the beat, hold the steady zoom.
    points.push({ frame: bf - 4, scale: zoom, originX, originY });
    points.push({ frame: bf + 13, scale: zoom, originX, originY });
  }
  // At the winner drop, ease back out to the full board.
  points.push({ frame: fightEnd - 6, scale: 1, originX: 50, originY: 50 });
  return points.sort((a, b) => a.frame - b.frame);
};

// Entries shared between the config and the fight-path builder.
const V2_ENTRIES: BrawlerEntry[] = [
  {
    id: "bibi",
    name: "Bibi",
    imageSrc: "brawl/portraits/bibi.png",
    dropFrame: 0,
    initialTier: "S",
    moves: [
      { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
      { frame: beatToFrame(13, FPS), tier: "B", fx: "splash" },
      { frame: beatToFrame(21, FPS), tier: "S", fx: "domino" },
    ],
    dislikeFrame: beatToFrame(11, FPS),
    defeatFrame: beatToFrame(27, FPS), // loses the final clash → winner reveal
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
    defeatFrame: beatToFrame(19, FPS), // KO'd by Bibi's Spitball at B18
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
      { frame: beatToFrame(18, FPS), tier: "A", fx: "glitch" },
    ],
    dislikeFrame: beatToFrame(11, FPS),
    defeatFrame: beatToFrame(25, FPS), // KO'd by Melodie's Dash at B24
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
      { frame: beatToFrame(19, FPS), tier: "S", fx: "domino", slot: 3 },
    ],
    dislikeFrame: beatToFrame(11, FPS),
    heartFrame: beatToFrame(19, FPS),
    accentColor: "#EC4899",
  },
];

export const mbgcSceneConfigV2: RankingVideoConfig = {
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

  roster: [
    { id: "melodie", name: "Melodie", imageSrc: "brawl/portraits/melodie.png", tier: "S", accentColor: "#EC4899" },
    { id: "bibi", name: "Bibi", imageSrc: "brawl/portraits/bibi.png", tier: "S", accentColor: "#F43F5E" },
    { id: "gale", name: "Gale", imageSrc: "brawl/portraits/gale.png", tier: "S", accentColor: "#38BDF8" },
    { id: "crow", name: "Crow", imageSrc: "brawl/portraits/crow.png", tier: "S", accentColor: "#A855F7" },
  ],
  introPin: { emoji: "😎", color: "#FFD60A" },

  // ── Tier list grid — pitch black body, NO glow effects ──────────────────
  tierList: {
    rows: [
      { key: "S", label: "S", color: "#E0245E", textColor: "#FFFFFF" },
      { key: "A", label: "A", color: "#FF9F0A", textColor: "#1F2937" },
      { key: "B", label: "B", color: "#FFD60A", textColor: "#1F2937" },
      { key: "C", label: "C", color: "#30D158", textColor: "#FFFFFF" },
      { key: "D", label: "D", color: "#0A84FF", textColor: "#FFFFFF" },
    ],
    labelStripSrc: "brawl/images/tier_list.png",
    glow: false,        // no neon glow on cards (reference: clean, soft shadow)
    letterGlow: false,  // no glow on S/A/B/C/D letters
    entries: V2_ENTRIES,
  },

  gridRevealFrame: beatToFrame(7, FPS),
  gridSettleFrame: beatToFrame(7, FPS),
  slamFrame: beatToFrame(11, FPS),

  // Fight window — starts on the BGM's music-volume drop, ends at the winner drop.
  fight: {
    start: beatToFrame(14, FPS),
    end: beatToFrame(27, FPS),
    turns: FIGHT_TURNS_MBGC,
    cleanVfx: true,   // single clean projectile per attack (reference look)
    vfxScale: 0.85,
  },

  // ── Background: PITCH BLACK during grid + fight (reference), per-beat color
  //    switches only during the winner showcase ─────────────────────────────
  colorCycle: [
    // intro — progressive brightening
    { beat: 1, color: "#0A0A08" },
    { beat: 2, color: "#14140E" },
    { beat: 3, color: "#1C1810" },
    { beat: 4, color: "#242016" },
    { beat: 5, color: "#2E2A1A" },
    { beat: 6, color: "#3A341E" },
    // grid reveal + slam + fight — SOLID BLACK (no tint, no glow)
    { beat: 7, color: "#000000" },
    { beat: 8, color: "#000000" },
    { beat: 9, color: "#000000" },
    { beat: 10, color: "#000000" },
    { beat: 11, color: "#000000" },
    { beat: 12, color: "#000000" },
    { beat: 13, color: "#000000" },
    { beat: 14, color: "#000000" },
    { beat: 15, color: "#000000" },
    { beat: 16, color: "#000000" },
    { beat: 17, color: "#000000" },
    { beat: 18, color: "#000000" },
    { beat: 19, color: "#000000" },
    { beat: 20, color: "#000000" },
    { beat: 21, color: "#000000" },
    { beat: 22, color: "#000000" },
    { beat: 23, color: "#000000" },
    { beat: 24, color: "#000000" },
    { beat: 25, color: "#000000" },
    { beat: 26, color: "#000000" },
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
    // Intro camera — the roster icons sit at the top (top:150px ≈ 8% of 1920,
    // card center ≈ 11%). Zoom in gently toward them, pan left→right across
    // the icons while the words pop, then settle back to the full board.
    // Reference: gentle ~1.35x zoom, left-to-right pan, no per-word zooms.
    introPath: [
      { frame: 0, scale: 1.0, originX: 50, originY: 50 },
      { frame: 8, scale: 1.35, originX: 26, originY: 11 },
      { frame: 30, scale: 1.35, originX: 26, originY: 11 },
      { frame: 55, scale: 1.35, originX: 74, originY: 11 },
      { frame: 72, scale: 1.15, originX: 55, originY: 16 },
      { frame: 82, scale: 1.0, originX: 50, originY: 50 },
      { frame: 92, scale: 1.0, originX: 50, originY: 50 },
    ],
    // Battle camera — STEADY close-up on the battling brawler pair, no shake.
    fightPath: buildFightPath(V2_ENTRIES),
    events: [
      { frame: beatToFrame(7, FPS), type: "punch", intensity: 1 },
      { frame: beatToFrame(10, FPS), type: "shakeBig", intensity: 1 },
      { frame: beatToFrame(13, FPS), type: "punch", intensity: 0.9 },
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

  introGlow: false,    // no warm glow behind the title (pitch-black reference look)
  gridParticles: false, // no twinkle particles over the grid

  audio: {
    bgmSrc: "brawl/sfx/ranking_tier_list.mp3",
    bgmStartSeconds: 8.499,
    bgmVolume: 1,
    duck: { from: 0, to: 3.1, volume: 0.4 },
    fightDuck: { from: 6.2, to: 12.8, volume: 0.0 },
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
      { frame: beatToFrame(13, FPS), src: "brawl/sfx/brawl_super.mp3", volume: 0.7 },
      { frame: beatToFrame(18, FPS), src: "brawl/sfx/brawl_super.mp3", volume: 0.8 },
      { frame: beatToFrame(19, FPS), src: "brawl/sfx/brawl_hypercharge.mp3", volume: 0.95 },
      { frame: beatToFrame(19, FPS) + 4, src: "brawl/sfx/riser.mp3", volume: 0.45 },
      { frame: beatToFrame(21, FPS), src: "brawl/sfx/brawl_super.mp3", volume: 0.8 },
      // Fight SFX — ONE attacker sound per exchange, spaced 2 beats (~0.96s)
      // apart so nothing overlaps and you always know who is attacking.
      { frame: beatToFrame(14, FPS), src: "brawl/sfx/bibi_swing_03.mp3", volume: 0.9, brawlerId: "bibi" },
      { frame: beatToFrame(16, FPS), src: "brawl/sfx/gale_atk_01.mp3", volume: 0.9, brawlerId: "gale" },
      { frame: beatToFrame(18, FPS), src: "brawl/sfx/bibi_ulti_02.mp3", volume: 0.95, brawlerId: "bibi" },
      { frame: beatToFrame(18, FPS) + 4, src: "brawl/sfx/bibi_ulti_hit_01.mp3", volume: 0.8, brawlerId: "bibi" },
      { frame: beatToFrame(20, FPS), src: "brawl/sfx/melodie_atk_sfx_01.mp3", volume: 0.9, brawlerId: "melodie" },
      { frame: beatToFrame(22, FPS), src: "brawl/sfx/crow_ulti_01.mp3", volume: 0.95, brawlerId: "crow" },
      { frame: beatToFrame(24, FPS), src: "brawl/sfx/melodie_ulti_sfx_01.mp3", volume: 1, brawlerId: "melodie" },
      { frame: beatToFrame(26, FPS), src: "brawl/sfx/bibi_swing_03.mp3", volume: 0.85, brawlerId: "bibi" },
      { frame: beatToFrame(27, FPS), src: "brawl/sfx/brawl_match_win.mp3", volume: 0.95 },
      { frame: beatToFrame(36, FPS) - 6, src: "brawl/sfx/riser.mp3", volume: 0.4 },
      { frame: beatToFrame(37, FPS), src: "brawl/sfx/chime.mp3", volume: 0.6 },
      { frame: beatToFrame(38, FPS), src: "brawl/sfx/melodie_ulti_sfx_01.mp3", volume: 0.85 },
    ],
  },
};
