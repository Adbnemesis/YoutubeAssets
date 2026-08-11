import React from "react";
import { PhonkCompositions } from "./edits/brawl_forms";
import { TrioCompositions } from "./edits/brawl_cool_trio";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PhonkCompositions />
      <TrioCompositions />
    </>
  );
};
