import React from "react";
import { Composition, staticFile } from "remotion";
import { MasterPhonkTemplate } from "./templates/MasterPhonkTemplate";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhonkPrototype"
        component={MasterPhonkTemplate}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          audioSrc: staticFile("extracted_audio.wav"),
          introForms: [
            { 
              iconSrc: "", auraColor: "#facc15", startTime: 0, endTime: 3.60,
              panels: [
                { quadrant: 1, startOffsetSeconds: 0.1, color: "#fef08a" },
                { quadrant: 2, startOffsetSeconds: 1.45, color: "#fde047" },
                { quadrant: 3, startOffsetSeconds: 1.85, color: "#eab308" },
                { quadrant: 4, startOffsetSeconds: 2.22, color: "#ca8a04" },
              ]
            },
            { 
              iconSrc: "", auraColor: "#ef4444", startTime: 3.60, endTime: 5.95,
              panels: [
                { quadrant: 4, startOffsetSeconds: 0.1, color: "#7f1d1d" },
                { quadrant: 1, startOffsetSeconds: 0.8, color: "#991b1b" },
                { quadrant: 3, startOffsetSeconds: 1.45, color: "#b91c1c" },
                { quadrant: 2, startOffsetSeconds: 1.85, color: "#ef4444" },
              ]
            },
            { 
              iconSrc: "", auraColor: "#3b82f6", startTime: 5.95, endTime: 8.33,
              panels: [
                { quadrant: 2, startOffsetSeconds: 0.05, color: "#1e3a8a" },
                { quadrant: 3, startOffsetSeconds: 0.85, color: "#1e40af" },
                { quadrant: 1, startOffsetSeconds: 1.45, color: "#2563eb" },
                { quadrant: 4, startOffsetSeconds: 1.85, color: "#3b82f6" },
              ]
            },
            { 
              iconSrc: "", auraColor: "#a855f7", startTime: 8.33, endTime: 10.55,
              panels: [
                { quadrant: 1, startOffsetSeconds: 0.07, color: "#581c87" },
                { quadrant: 4, startOffsetSeconds: 0.87, color: "#7e22ce" },
                { quadrant: 2, startOffsetSeconds: 1.45, color: "#9333ea" },
                { quadrant: 3, startOffsetSeconds: 1.85, color: "#a855f7" },
              ]
            },
          ],
          dropColors: ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"],
          dropCuts: [
            11.083, 11.750, 12.333, 12.883, 13.483, 13.967, 14.600, 
            15.117, 15.683, 16.250, 16.833, 17.383, 17.967, 18.533, 19.100, 19.683
          ]
        }}
      />
    </>
  );
};
