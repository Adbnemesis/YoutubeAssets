import React from "react";
import { Composition } from "remotion";
import { MasterPhonkTemplate } from "./templates/MasterPhonkTemplate";
import { MangaPhonkTemplate } from "./templates/MangaPhonkTemplate";
import { MidnightTrioTemplate } from "./templates/MidnightTrioTemplate";
import { phonkPrototypeProps, mangaPhonkProps, midnightTrioProps, superheroTrioProps, bibiEdgarFrankProps } from "./props";

export const PhonkCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="PhonkPrototype"
        component={MasterPhonkTemplate}
        durationInFrames={585}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={phonkPrototypeProps}
      />

      <Composition
        id="MangaPhonkEdit"
        component={MangaPhonkTemplate}
        durationInFrames={585}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={mangaPhonkProps}
      />

      <Composition
        id="MidnightTrio"
        component={MidnightTrioTemplate}
        durationInFrames={585}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={midnightTrioProps}
      />

      <Composition
        id="BrawlForms-SuperheroTrio"
        component={MidnightTrioTemplate}
        durationInFrames={585}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={superheroTrioProps}
      />

      <Composition
        id="BrawlForms-BibiEdgarFrank"
        component={MidnightTrioTemplate}
        durationInFrames={585}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={bibiEdgarFrankProps}
      />
    </>
  );
};
