import React from "react";
import { PhonkCompositions } from "./edits/brawl_forms";
import { TrioCompositions } from "./edits/brawl_cool_trio";
import { BestCharCompositions } from "./edits/brawl_best_char";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PhonkCompositions />
      <TrioCompositions />
      <BestCharCompositions />
    </>
  );
};

