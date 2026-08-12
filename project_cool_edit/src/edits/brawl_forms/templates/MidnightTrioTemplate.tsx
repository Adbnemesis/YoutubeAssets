import React from "react";
import { PhonkFormsMasterTemplate, PhonkMasterProps } from "./PhonkFormsMasterTemplate";

export const MidnightTrioTemplate: React.FC<PhonkMasterProps> = (props) => {
  return (
    <PhonkFormsMasterTemplate
      titleText={props.titleText || "MIDNIGHT TRIO"}
      titleColor={props.titleColor || "#a855f7"}
      titleAccentColor={props.titleAccentColor || "#22c55e"}
      {...props}
    />
  );
};
