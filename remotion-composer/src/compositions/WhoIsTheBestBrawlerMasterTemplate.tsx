import React from "react";
import { AbsoluteFill } from "remotion";
import { RankingVideoTemplate } from "../../../project_brawlstars/components/RankingVideoTemplate";
import { RankingVideoConfig } from "../../../project_brawlstars/types";

/**
 * "Who is the Best Epic Brawler" master template composition.
 * Renders the reusable ranking template using dynamic JSON configuration
 * passed through Remotion's defaultProps (or CLI props).
 */
export const WhoIsTheBestBrawlerMasterTemplate: React.FC<{ config: RankingVideoConfig }> = ({ config }) => {
  return (
    <AbsoluteFill>
      <RankingVideoTemplate config={config} />
    </AbsoluteFill>
  );
};
