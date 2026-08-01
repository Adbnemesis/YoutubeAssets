import React from "react";
import { AbsoluteFill } from "remotion";
import { RankingVideoTemplate } from "../../components/RankingVideoTemplate";
import { sampleSceneConfig } from "./config";

/**
 * Sample scene — "Who is the best epic brawler in Brawl Stars?"
 *
 * Uses the supplied assets:
 *  - BGM:  brawl/sfx/ranking_tier_list.mp3 (starting at the 8.499s beat grid)
 *  - Voice: brawl/sfx/scene01_kenji.wav ("Who is the best brawler in Brawl Stars?")
 *  - Visual: brawl/images/tier_list.png (tier grid backdrop)
 */
export const SampleScene01: React.FC = () => {
  return (
    <AbsoluteFill>
      <RankingVideoTemplate config={sampleSceneConfig} />
    </AbsoluteFill>
  );
};

export { sampleSceneConfig };
