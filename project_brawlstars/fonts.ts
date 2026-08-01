import { delayRender, continueRender, staticFile } from "remotion";

export const FONT_FAMILY = "BrawlStars";

let fontReady = false;
let fontPromise: Promise<void> | null = null;

/**
 * Load the official Brawl Stars font (from public/brawl/fonts/brawl_stars.ttf)
 * and register it under "BrawlStars". Called once; subsequent calls no-op.
 */
export const ensureBrawlFont = (): Promise<void> => {
  if (fontReady) return Promise.resolve();
  if (fontPromise) return fontPromise;

  const handle = delayRender("Loading Brawl Stars font");
  fontPromise = (async () => {
    try {
      const face = new FontFace(
        FONT_FAMILY,
        `url('${staticFile("brawl/fonts/brawl_stars_2.ttf")}') format('truetype')`
      );
      await face.load();
      document.fonts.add(face);
      fontReady = true;
    } finally {
      continueRender(handle);
    }
  })();
  return fontPromise;
};

// Kick off loading as soon as the module is imported.
ensureBrawlFont();
