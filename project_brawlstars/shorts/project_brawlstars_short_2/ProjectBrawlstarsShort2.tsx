import React from "react";
import { AbsoluteFill } from "remotion";
import { RankingVideoTemplate } from "../../components/RankingVideoTemplate";
import { mbgcSceneConfig } from "./config";

/**
 * Short #2 — Melodie / Bibi / Gale / Crow tier list.
 * Same dialogue + BGM as the sample; winner = MELODIE.
 *
 * Assets:
 *  - BGM:  brawl/sfx/ranking_tier_list.mp3 (starting at the 8.499s beat grid)
 *  - Voice: brawl/sfx/scene01_kenji.wav ("Who is the best brawler in Brawl Stars?")
 *  - Visual: brawl/images/tier_list.png (tier grid backdrop)
 */
export const ProjectBrawlstarsShort2: React.FC = () => {
  return (
    <AbsoluteFill>
      <RankingVideoTemplate config={mbgcSceneConfig} />
    </AbsoluteFill>
  );
};

export { mbgcSceneConfig };
