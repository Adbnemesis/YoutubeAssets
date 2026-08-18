import React from "react";
import { Composition } from "remotion";
import { TrioPhonkTemplate } from "./templates/TrioPhonkTemplate";
import { trioPhonkProps, taraLeonCrowProps, bibiEdgarFrankTrioProps, maxLeonSurgeTrioProps } from "./props";

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

      <Composition
        id="BrawlCoolTrio-BibiEdgarFrank"
        component={TrioPhonkTemplate}
        durationInFrames={869}
        fps={60}
        width={1080}
        height={1080}
        defaultProps={bibiEdgarFrankTrioProps}
      />

      <Composition
        id="BrawlCoolTrio-MaxLeonSurge"
        component={TrioPhonkTemplate}
        durationInFrames={869}
        fps={60}
        width={1080}
        height={1080}
        defaultProps={maxLeonSurgeTrioProps}
      />
    </>
  );
};
