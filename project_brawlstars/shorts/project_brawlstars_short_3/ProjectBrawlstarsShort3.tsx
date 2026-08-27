import React from "react";
import { AbsoluteFill } from "remotion";
import { RankingVideoTemplate } from "../../components/RankingVideoTemplate";
import short3SceneConfig from "./config";

/**
 * Short #3 — "Who is the best Epic Brawler?" (Gale / Mortis / Hank / Willow).
 * Winner: GALE 🔥
 *
 * Focus: brawl mechanics with real .sc attack VFX.
 * Four attack vectors, each using its extracted Supercell effect:
 *  - Gale   → snowball fan (muzzle + projectile + hit + reached)
 *  - Mortis → forward shovel dash + slash hit
 *  - Hank   → expanding watermark balloon + impact burst
 *  - Willow → lob muzzle + trail + poison pond pool
 */
export const ProjectBrawlstarsShort3: React.FC = () => {
  return (
    <AbsoluteFill>
      <RankingVideoTemplate config={short3SceneConfig} />
    </AbsoluteFill>
  );
};

export { short3SceneConfig };