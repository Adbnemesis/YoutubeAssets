import React from "react";
import { Composition } from "remotion";
import { TrioPhonkTemplate } from "./templates/TrioPhonkTemplate";
import { trioPhonkProps, taraLeonCrowProps } from "./props";

export const TrioCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="BrawlCoolTrio"
        component={TrioPhonkTemplate}
        durationInFrames={869}
        fps={60}
        width={1080}
        height={1080}
        defaultProps={trioPhonkProps}
      />

      <Composition
        id="TaraLeonCrow"
        component={TrioPhonkTemplate}
        durationInFrames={869}
        fps={60}
        width={1080}
        height={1080}
        defaultProps={taraLeonCrowProps}
      />
    </>
  );
};
