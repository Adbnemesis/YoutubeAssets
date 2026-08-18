import React from "react";
import { Composition } from "remotion";
import { BestCharPhonkTemplate } from "./templates/BestCharPhonkTemplate";
import { defaultBestCharProps, bestLegendaryProps, bestRangedProps, bestBrawlerKazeNoriProps } from "./props";

export const BestCharCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="BrawlBestChar"
        component={BestCharPhonkTemplate}
        durationInFrames={defaultBestCharProps.durationInFrames}
        fps={defaultBestCharProps.fps}
        width={defaultBestCharProps.width}
        height={defaultBestCharProps.height}
        defaultProps={defaultBestCharProps}
      />

      <Composition
        id="BrawlBestChar-BestLegendary"
        component={BestCharPhonkTemplate}
        durationInFrames={bestLegendaryProps.durationInFrames}
        fps={bestLegendaryProps.fps}
        width={bestLegendaryProps.width}
        height={bestLegendaryProps.height}
        defaultProps={bestLegendaryProps}
      />

      <Composition
        id="BrawlBestChar-BestRanged"
        component={BestCharPhonkTemplate}
        durationInFrames={bestRangedProps.durationInFrames}
        fps={bestRangedProps.fps}
        width={bestRangedProps.width}
        height={bestRangedProps.height}
        defaultProps={bestRangedProps}
      />

      <Composition
        id="BrawlBestChar-KazeNori"
        component={BestCharPhonkTemplate}
        durationInFrames={bestBrawlerKazeNoriProps.durationInFrames}
        fps={bestBrawlerKazeNoriProps.fps}
        width={bestBrawlerKazeNoriProps.width}
        height={bestBrawlerKazeNoriProps.height}
        defaultProps={bestBrawlerKazeNoriProps}
      />
    </>
  );
};
