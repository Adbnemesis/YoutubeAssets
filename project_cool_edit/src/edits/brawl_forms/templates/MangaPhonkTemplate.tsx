import React from "react";
import { PhonkFormsMasterTemplate, PhonkMasterProps } from "./PhonkFormsMasterTemplate";

export const MangaPhonkTemplate: React.FC<PhonkMasterProps> = (props) => {
  return (
    <PhonkFormsMasterTemplate
      titleText="TOXIC"
      subTitleText="ASSASSINS"
      titleColor="#ef4444"
      titleAccentColor="#fff"
      {...props}
    />
  );
};
