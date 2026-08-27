import { RankingVideoConfig, CameraPathPoint, BrawlerEntry } from "../../types";
import { beatToFrame } from "../../beatGrid";
import { FIGHT_TURNS_GMHW } from "../../abilities";
import { cardPos, centerOrigin, CARD_SIZE } from "../../layout";

const FPS = 30;

/**
 * Short #3 — "Who is the best Epic Brawler?" (Gale / Mortis / Hank / Willow).
 * Winner: GALE 🔥
 *
 * Focus: attack mechanics with real .sc attack VFX (GaleScAttack,
 * MortisScDash, HankScAttack, WillowScAttack) + the reference fight flow:
 *  - Pitch-black tier list (no neon glow) like the reference body.
 *  - All 4 candidates slam into D-tier with dislike pins.
 *  - BGM ducks to zero during the fight; clean single projectile per attack.
 *  - Winner reveal on the gold drop at Beat 28.
 */

// Build the fight camera path — the brawlers move between tiers during the
// fight, so the camera follows the combat across rows: smoothing between each
// attacker/target pair gives constant motion.
// CLEAN BATTLE (reference look): hold a STEADY ~1.3x close-up on the fighting
// pair for the whole fight — no per-beat crash zooms, no shake, and BOTH
// fighters are always fully visible. The zoom drops bystanders out of frame,
// which is what kills the "cluttered full board" look.
const buildFightPath = (entries: BrawlerEntry[]): CameraPathPoint[] => {
  const fightStart = beatToFrame(14, FPS);
  const fightEnd = beatToFrame(28, FPS);
  const BASE_ZOOM = 1.3;
  const points: CameraPathPoint[] = [{ frame: fightStart - 8, scale: 1, originX: 50, originY: 50 }];
  const turns = [...FIGHT_TURNS_GMHW].sort((a, b) => a.beat - b.beat);
  for (const t of turns) {
    const bf = beatToFrame(t.beat, FPS);
    const atk = cardPos(entries, t.id, bf);
    const tgt = t.targetId ? cardPos(entries, t.targetId, bf) : null;
    if (!atk || !tgt) continue;
    let stand = atk;
    // For controllers/melee, position the attacker a short gap from the target
    // so both sit close in frame; ranged keep their spread so the projectile
    // travels a visible distance.
    if (t.melee || t.mechanic === "control") {
      const sameRow = Math.abs(atk.y - tgt.y) < 100;
      if (sameRow) {
        const dir = tgt.x >= atk.x ? -1 : 1;
        stand = { x: tgt.x + dir * (CARD_SIZE + 24), y: tgt.y };
      } else {
        const dir = tgt.y >= atk.y ? -1 : 1;
        stand = { x: tgt.x, y: tgt.y + dir * (CARD_SIZE + 24) };
      }
    }
    // Bounding box of BOTH cards (with card-size margin) — guarantee the whole
    // pair is always in frame; pull back naturally for far-apart ranged pairs.
    const minX = Math.min(stand.x, tgt.x) - CARD_SIZE;
    const maxX = Math.max(stand.x, tgt.x) + CARD_SIZE;
    const minY = Math.min(stand.y, tgt.y) - CARD_SIZE;
    const maxY = Math.max(stand.y, tgt.y) + CARD_SIZE;
    const bw = maxX - minX;
    const bh = maxY - minY;
    const zoom = Math.min(BASE_ZOOM, Math.min(1080 / (bw * 1.12), 1920 / (bh * 1.12)));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const { originX, originY } = centerOrigin(cx, cy, zoom);
    // Ease in just before the beat, hold the steady zoom through the exchange,
    // then the next pair pulls the camera along — continuous clean motion.
    points.push({ frame: bf - 4, scale: zoom, originX, originY });
    points.push({ frame: bf + 13, scale: zoom, originX, originY });
  }
  // At the winner drop, ease back out to the full board (no re-zoom bounce).
  points.push({ frame: fightEnd - 2, scale: 1, originX: 50, originY: 50 });
  return points.sort((a, b) => a.frame - b.frame);
};

const V3_ENTRIES: BrawlerEntry[] = [
  {
    id: "gale",
    name: "Gale",
    imageSrc: "brawl/portraits/gale.png",
    dropFrame: 0,
    initialTier: "S",
    moves: [
      { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
      // Gale rides the win — climbs back up as the fight turns in his favor.
      { frame: beatToFrame(13, FPS), tier: "S", fx: "domino", duration: 16 },
      { frame: beatToFrame(23, FPS), tier: "S", duration: 14 },
    ],
    dislikeFrame: beatToFrame(11, FPS),
    defeatFrame: beatToFrame(29, FPS), // survives -> winner
    accentColor: "#38BDF8",
    heartFrame: beatToFrame(28, FPS),
  },
  {
    id: "mortis",
    name: "Mortis",
    imageSrc: "brawl/portraits/mortis.png",
    dropFrame: 2,
    initialTier: "S",
    moves: [
      { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
      // Mortis rushes UP to clash — he's aggressive and closes distance.
      { frame: beatToFrame(13, FPS), tier: "A", fx: "glitch", duration: 14 },
      // Gets double-teamed (Willow control + Gale snowballs) and drops hard.
      { frame: beatToFrame(19, FPS), tier: "C", duration: 16 },
    ],
    dislikeFrame: beatToFrame(11, FPS),
    defeatFrame: beatToFrame(20, FPS), // KO'd by the double at B18
    accentColor: "#A855F7",
  },
  {
    id: "hank",
    name: "Hank",
    imageSrc: "brawl/portraits/hank.png",
    dropFrame: 4,
    initialTier: "S",
    moves: [
      { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
      // Hank steps up to assert himself — a big body swell into B-tier.
      { frame: beatToFrame(13, FPS), tier: "B", fx: "splash", duration: 20 },
      // Willow's mind-control drags him, cracking his standing.
      { frame: beatToFrame(21, FPS), tier: "C", duration: 18 },
    ],
    dislikeFrame: beatToFrame(11, FPS),
    defeatFrame: beatToFrame(22, FPS), // KO'd by controlled Mortis at B20
    accentColor: "#0EA5E9",
  },
  {
    id: "willow",
    name: "Willow",
    imageSrc: "brawl/portraits/willow.png",
    dropFrame: 8,
    initialTier: "S",
    moves: [
      { frame: beatToFrame(7, FPS), tier: "D", duration: 42 },
      // Willow trims in high — the tactician hangs near the top.
      { frame: beatToFrame(13, FPS), tier: "S", fx: "domino", duration: 16 },
      // Gale's Gale Force shoves her down to C.
      { frame: beatToFrame(23, FPS), tier: "C", duration: 16 },
    ],
    dislikeFrame: beatToFrame(11, FPS),
    defeatFrame: beatToFrame(27, FPS), // KO'd by Gale final at B26
    accentColor: "#22C55E",
  },
];

export const short3SceneConfig: RankingVideoConfig = {
  fps: FPS,
  durationInFrames: beatToFrame(42, FPS), // reference-length outro tail

  // Intro — one word at a time on the same kenji "who is best" voiceover.
  titleWords: [
    { text: "WHO", frame: 0, fontSize: 170, color: "#22C55E" },
    { text: "IS", frame: 14, fontSize: 170, color: "#22C55E" },
    { text: "THE", frame: 20, fontSize: 170, color: "#22C55E" },
    { text: "BEST", frame: 24, fontSize: 170, color: "#22C55E" },
    { text: "BRAWLER", frame: 32, fontSize: 140, color: "#22C55E" },
    { text: "IN", frame: 40, fontSize: 170, color: "#22C55E" },
    { text: "BRAWL", frame: 47, fontSize: 140, color: "#FFD60A" },
    { text: "STARS?", frame: 55, fontSize: 145, color: "#FFD60A" },
  ],

  roster: [
    { id: "gale", name: "Gale", imageSrc: "brawl/portraits/gale.png", tier: "S", accentColor: "#38BDF8" },
    { id: "mortis", name: "Mortis", imageSrc: "brawl/portraits/mortis.png", tier: "S", accentColor: "#A855F7" },
    { id: "hank", name: "Hank", imageSrc: "brawl/portraits/hank.png", tier: "S", accentColor: "#0EA5E9" },
    { id: "willow", name: "Willow", imageSrc: "brawl/portraits/willow.png", tier: "S", accentColor: "#22C55E" },
  ],
  introPin: { emoji: "😎", color: "#FFD60A" },

  // Tier list — pitch black body, NO glow effects.
  tierList: {
    rows: [
      { key: "S", label: "S", color: "#E0245E", textColor: "#FFFFFF" },
      { key: "A", label: "A", color: "#FF9F0A", textColor: "#1F2937" },
      { key: "B", label: "B", color: "#FFD60A", textColor: "#1F2937" },
      { key: "C", label: "C", color: "#30D158", textColor: "#FFFFFF" },
      { key: "D", label: "D", color: "#0A84FF", textColor: "#FFFFFF" },
    ],
    labelStripSrc: "brawl/images/tier_list.png",
    glow: false,
    letterGlow: false,
    entries: V3_ENTRIES,
  },

  gridRevealFrame: beatToFrame(7, FPS),
  gridSettleFrame: beatToFrame(7, FPS),
  slamFrame: beatToFrame(11, FPS),

  // Fight window: starts on the music drop, ends at the winner drop.
  fight: {
    start: beatToFrame(14, FPS),
    end: beatToFrame(28, FPS),
    turns: FIGHT_TURNS_GMHW,
    cleanVfx: true,
    vfxScale: 0.85,
  },

  // Background: pitch black during grid + fight, per-beat color in showcase.
  colorCycle: [
    { beat: 1, color: "#0A0A08" },
    { beat: 2, color: "#14140E" },
    { beat: 3, color: "#1C1810" },
    { beat: 4, color: "#242016" },
    { beat: 5, color: "#2E2A1A" },
    { beat: 6, color: "#3A341E" },
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
    { beat: 27, color: "#000000" },
    { beat: 28, color: "#7C3AED" },
    { beat: 29, color: "#D97706" },
    { beat: 30, color: "#DB2777" },
    { beat: 31, color: "#0E7490" },
    { beat: 32, color: "#9333EA" },
    { beat: 33, color: "#CA8A04" },
    { beat: 34, color: "#67E8F9" },
    { beat: 35, color: "#0E7490" },
    { beat: 36, color: "#0369A1" },
    { beat: 39, color: "#0369A1" },
  ],

  flashes: [
    { frame: beatToFrame(7, FPS), color: "#FF2A2A", maxOpacity: 0.8, duration: 6 },
    { frame: beatToFrame(11, FPS), color: "#22C55E", maxOpacity: 0.9, duration: 8 },
    { frame: beatToFrame(18, FPS), color: "#C084FC", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(22, FPS), color: "#22C55E", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(27, FPS), color: "#FFD60A", maxOpacity: 0.6, duration: 4 },
    { frame: beatToFrame(28, FPS), color: "#FFD60A", maxOpacity: 0.9, duration: 6 },
    { frame: beatToFrame(37, FPS), color: "#FFFFFF", maxOpacity: 0.9, duration: 6 },
    { frame: beatToFrame(38, FPS), color: "#FFFFFF", maxOpacity: 0.6, duration: 5 },
  ],

  transitions: [
    { frame: beatToFrame(7, FPS) },
    { frame: beatToFrame(28, FPS) },
  ],

  // Winner phases — GALE 🔥 (reveal on B28, the gold drop)
  winner: {
    phases: [
      {
        type: "title",
        frame: beatToFrame(28, FPS),
        endFrame: beatToFrame(29, FPS),
        backgroundColor: "#7C3AED",
        accentColor: "#FFD60A",
        entryId: "gale",
        title: "GALE",
      },
      {
        type: "spin",
        frame: beatToFrame(29, FPS),
        endFrame: beatToFrame(37, FPS),
        backgroundColor: "#1E3A5F",
        accentColor: "#FFD60A",
        entryId: "gale",
        title: "GALE",
        spinSpeed: 9,
      },
      {
        type: "outro",
        frame: beatToFrame(37, FPS),
        endFrame: beatToFrame(42, FPS),
        backgroundColor: "#0284C7",
        accentColor: "#FFD60A",
        entryId: "gale",
        title: "GALE",
        subtitle: "IS #1 BRAWLER! 🔥",
      },
    ],
  },

  camera: {
    baseScale: 1,
    introPath: [
      { frame: 0, scale: 1.0, originX: 50, originY: 50 },
      { frame: 8, scale: 1.35, originX: 26, originY: 11 },
      { frame: 30, scale: 1.35, originX: 26, originY: 11 },
      { frame: 55, scale: 1.35, originX: 74, originY: 11 },
      { frame: 72, scale: 1.15, originX: 55, originY: 16 },
      { frame: 82, scale: 1.0, originX: 50, originY: 50 },
      { frame: 92, scale: 1.0, originX: 50, originY: 50 },
    ],
    fightPath: buildFightPath(V3_ENTRIES),
    // Clean battle — camera stays locked on the fighting pair the whole fight
    // (steady zoom, no per-beat crash-zooms or shakes). Only the grid reveal,
    // the D-slam and the winner drop get a punch, matching the reference.
    events: [
      { frame: beatToFrame(7, FPS), type: "punch", intensity: 1 },
      { frame: beatToFrame(11, FPS), type: "shakeBig", intensity: 1 },
      // staggered rise at B13 dust
      { frame: beatToFrame(13, FPS), type: "punch", intensity: 0.9 },
      { frame: beatToFrame(28, FPS), type: "punch", intensity: 1.1 },
      { frame: beatToFrame(29, FPS), type: "shake", intensity: 0.6 },
      { frame: beatToFrame(37, FPS), type: "shakeBig", intensity: 1 },
    ],
  },

  cameraZoomOut: {
    from: beatToFrame(7, FPS),
    to: beatToFrame(7, FPS) + 16,
    fromScale: 1,
    toScale: 1,
  },

  introGlow: false,
  gridParticles: false,

  audio: {
    bgmSrc: "brawl/sfx/ranking_tier_list.mp3",
    bgmStartSeconds: 8.499,
    bgmVolume: 1,
    duck: { from: 0, to: 3.1, volume: 0.4 },
    fightDuck: { from: 6.2, to: 13.2, volume: 0.0 },
    voiceSrc: "brawl/sfx/scene01_kenji.wav",
    voiceVolume: 1,
    fadeOutFrames: 26,
    sfx: [
      { frame: beatToFrame(7, FPS), src: "brawl/sfx/whoosh.mp3", volume: 0.95 },
      { frame: beatToFrame(11, FPS), src: "brawl/sfx/pop.mp3", volume: 0.8 },
      { frame: beatToFrame(14, FPS), src: "brawl/sfx/mortis_atk_01.ogg", volume: 0.9, brawlerId: "mortis" },
      { frame: beatToFrame(16, FPS), src: "brawl/sfx/hank_atk_01.ogg", volume: 0.9, brawlerId: "hank" },
      { frame: beatToFrame(18, FPS), src: "brawl/sfx/gale_atk_01.mp3", volume: 0.9, brawlerId: "gale" },
      { frame: beatToFrame(18, FPS) + 2, src: "brawl/sfx/willow_atk_01.ogg", volume: 0.85, brawlerId: "willow" },
      { frame: beatToFrame(20, FPS), src: "brawl/sfx/willow_atk_01.ogg", volume: 0.85, brawlerId: "willow" },
      { frame: beatToFrame(24, FPS), src: "brawl/sfx/willow_atk_01.ogg", volume: 0.85, brawlerId: "willow" },
      { frame: beatToFrame(26, FPS), src: "brawl/sfx/gale_atk_01.mp3", volume: 0.95, brawlerId: "gale" },
      { frame: beatToFrame(28, FPS), src: "brawl/sfx/brawl_match_win.mp3", volume: 0.95 },
      { frame: beatToFrame(37, FPS) - 6, src: "brawl/sfx/riser.mp3", volume: 0.4 },
      { frame: beatToFrame(37, FPS), src: "brawl/sfx/chime.mp3", volume: 0.6 },
    ],
  },
};

export default short3SceneConfig;