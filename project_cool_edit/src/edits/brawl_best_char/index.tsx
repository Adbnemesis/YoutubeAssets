import React from "react";
import { Composition } from "remotion";
import { BestCharPhonkTemplate } from "./templates/BestCharPhonkTemplate";
import { defaultBestCharProps } from "./props";

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
    </>
  );
};
