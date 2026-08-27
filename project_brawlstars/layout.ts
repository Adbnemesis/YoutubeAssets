import { BrawlerEntry, TierKey } from "./types";

/**
 * Shared tier-list layout math. Single source of truth for row geometry and
 * card slot positions so the fight camera can compute exactly where each
 * brawler card sits at any frame (used by both TierList and config files).
 */

export const ROW_TOP: Record<TierKey, number> = {
  S: 0,
  A: 384,
  B: 768,
  C: 1152,
  D: 1536,
  F: 1536,
};

export const ROW_BOTTOM: Record<TierKey, number> = {
  S: 384,
  A: 768,
  B: 1152,
  C: 1536,
  D: 1920,
  F: 1920,
};

export const rowCenter = (tier: TierKey): number =>
  (ROW_TOP[tier] + ROW_BOTTOM[tier]) / 2;

export const STRIP_W = 140;
export const CONTENT_X = STRIP_W + 30;
export const CONTENT_W = 1080 - CONTENT_X;
export const CARD_SIZE = 175;
export const CARD_GAP = 20;
export const FLY_DURATION = 14;

export const cardSlotX = (slot: number): number => {
  const total = 4 * CARD_SIZE + 3 * CARD_GAP;
  const startX = CONTENT_X + (CONTENT_W - total) / 2;
  return startX + slot * (CARD_SIZE + CARD_GAP) + CARD_SIZE / 2;
};

/** Tier of an entry at a given frame (null = not yet dropped). */
export const tierAt = (entry: BrawlerEntry, frame: number): TierKey | null => {
  if (frame < entry.dropFrame) return null;
  let t = entry.initialTier;
  for (const m of entry.moves) if (frame >= m.frame) t = m.tier;
  return t;
};

export const slotAt = (
  entries: BrawlerEntry[],
  id: string,
  tier: TierKey,
  frame: number
): number => {
  const members = entries
    .filter((e) => tierAt(e, frame) === tier)
    .sort((a, b) => a.dropFrame - b.dropFrame || a.id.localeCompare(b.id));
  const idx = members.findIndex((e) => e.id === id);
  return Math.max(0, idx);
};

/**
 * Slot for an entry in a row, honoring an explicit `slot` override on its most
 * recent move into that tier (lets the winner land anywhere in the row).
 */
export const slotFor = (
  entries: BrawlerEntry[],
  id: string,
  tier: TierKey,
  frame: number
): number => {
  const entry = entries.find((e) => e.id === id);
  if (entry) {
    let overridden: number | undefined;
    for (const m of entry.moves) {
      if (m.frame <= frame && m.tier === tier && m.slot !== undefined) {
        overridden = m.slot;
      }
    }
    if (overridden !== undefined) return overridden;
  }
  return slotAt(entries, id, tier, frame);
};

/** Card center position (px in the 1080x1920 board) for an entry at a frame. */
export const cardPos = (
  entries: BrawlerEntry[],
  id: string,
  frame: number
): { x: number; y: number } | null => {
  const entry = entries.find((e) => e.id === id);
  if (!entry) return null;
  const tier = tierAt(entry, frame);
  if (!tier) return null;
  const slot = slotFor(entries, id, tier, frame);
  return { x: cardSlotX(slot), y: rowCenter(tier) };
};

/** Convert board px to transform-origin percentages (of 1080x1920). */
export const pxToOrigin = (x: number, y: number): { originX: number; originY: number } => ({
  originX: (x / 1080) * 100,
  originY: (y / 1920) * 100,
});

/**
 * Transform-origin that CENTERS content point (x,y) on the 1080x1920 screen at
 * scale S. With `transform: scale(S)` + `transformOrigin: o`, a content point p
 * maps to screen `o + (p - o)*S`. Solving for o so p lands at screen center:
 *
 *   o = (p*S - H/2) / (S - 1)
 *
 * The naive `pxToOrigin` (o = p) keeps the point in place but pushes everything
 * else off-screen asymmetrically, which clips the fighting pair — this is the
 * correct centering version.
 */
export const centerOrigin = (
  x: number,
  y: number,
  scale: number
): { originX: number; originY: number } => {
  const W = 1080;
  const H = 1920;
  const ox = (x * scale - W / 2) / (scale - 1);
  const oy = (y * scale - H / 2) / (scale - 1);
  return {
    originX: Math.max(0, Math.min(W, ox)) / W * 100,
    originY: Math.max(0, Math.min(H, oy)) / H * 100,
  };
};
