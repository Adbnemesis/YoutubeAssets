import React from "react";
import { Composition } from "remotion";
import { defaultMonsterTrioProps, defaultKenjiLeonTaraProps } from "./props";
import { MonsterTrioPhonkTemplate } from "./templates/MonsterTrioPhonkTemplate";

export const MonsterTrioCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="BrawlStarsMonsterTrio"
        component={MonsterTrioPhonkTemplate}
        durationInFrames={defaultMonsterTrioProps.durationInFrames}
        fps={defaultMonsterTrioProps.fps}
        width={defaultMonsterTrioProps.width}
        height={defaultMonsterTrioProps.height}
        defaultProps={defaultMonsterTrioProps}
      />

      <Composition
        id="KenjiLeonTara"
        component={MonsterTrioPhonkTemplate}
        durationInFrames={defaultKenjiLeonTaraProps.durationInFrames}
        fps={defaultKenjiLeonTaraProps.fps}
        width={defaultKenjiLeonTaraProps.width}
        height={defaultKenjiLeonTaraProps.height}
        defaultProps={defaultKenjiLeonTaraProps}
      />
    </>
  );
};
