import React from "react";
import { Composition } from "remotion";
import { BestCharPhonkTemplate } from "./templates/BestCharPhonkTemplate";
import { defaultBestCharProps, bestLegendaryProps } from "./props";

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
    </>
  );
};
