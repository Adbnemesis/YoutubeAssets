import React from "react";
import { CharacterProps, CharacterColorScheme } from "./types";
import { DEFAULT_COLOR_SCHEME, VIEW_BOX } from "./constants";
import { EXPRESSION_PRESETS } from "./presets";
import { Head } from "./components/Head";
import { Eyes } from "./components/Eyes";
import { Mouth } from "./components/Mouth";
import { Eyebrows } from "./components/Eyebrows";
import { Emotes } from "./components/Emotes";
import { Body } from "./components/Body";

export const Character: React.FC<CharacterProps> = ({
    expression = "neutral",
    pose = "standing",
    direction = "front",
    size = 560,
    scale = 1,
    eyes: overrideEyes,
    mouth: overrideMouth,
    eyebrows: overrideEyebrows,
    emote: overrideEmote,
    colorScheme: customColors,
    hoodieColor,
    headTilt: customHeadTilt,
    headOffsetY = 0,
    headOffsetX = 0,
    bodyLean = 0,
    breathOffset = 0,
    eyeTargetX = 0,
    eyeTargetY = 0,
    showShadow = true,
    shadowOpacity = 0.25,
    style,
    className,
}) => {
    // Merge colors
    const colors: CharacterColorScheme = {
        ...DEFAULT_COLOR_SCHEME,
        ...customColors,
        ...(hoodieColor ? { hoodieColor, hoodiePocket: hoodieColor, shoeAccent: hoodieColor } : {}),
    };

    // Resolve active preset
    const preset = EXPRESSION_PRESETS[expression] || EXPRESSION_PRESETS.neutral;
    const activeEyes = overrideEyes || preset.eyes;
    const activeMouth = overrideMouth || preset.mouth;
    const activeEyebrows = overrideEyebrows || preset.eyebrows;
    const activeEmote = overrideEmote || preset.emote || "none";
    const activeHeadTilt = (customHeadTilt !== undefined ? customHeadTilt : preset.headTilt) || 0;

    // Aspect ratio calculation
    const width = (size * VIEW_BOX.width) / VIEW_BOX.height * scale;
    const height = size * scale;

    // Direction transform: if left, flip horizontally around centerX (200)
    const isFacingLeft = direction === "left";

    return (
        <div
            className={className}
            style={{
                display: "inline-block",
                width,
                height,
                position: "relative",
                userSelect: "none",
                ...style,
            }}
        >
            <svg
                viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
                width="100%"
                height="100%"
                style={{ overflow: "visible" }}
            >
                {/* Drop Shadow on Ground */}
                {showShadow && (
                    <ellipse
                        cx={200}
                        cy={VIEW_BOX.groundY}
                        rx={95}
                        ry={14}
                        fill="#0F172A"
                        opacity={shadowOpacity}
                    />
                )}

                {/* Master Character Transform (Direction Flip & Body Lean) */}
                <g
                    transform={`${isFacingLeft ? "translate(400, 0) scale(-1, 1)" : ""} rotate(${bodyLean}, 200, 320)`}
                >
                    {/* Body & Poses */}
                    <Body
                        pose={pose}
                        colors={colors}
                        direction={direction}
                        breathOffset={breathOffset}
                    />

                    {/* Head Hierarchy (Rotates and moves with expressions & headTilt) */}
                    <g
                        id="head-anchor-group"
                        transform={`translate(${headOffsetX}, ${headOffsetY}) rotate(${activeHeadTilt}, 200, 150)`}
                    >
                        <Head colors={colors} direction={direction}>
                            {/* Eyebrows */}
                            <Eyebrows type={activeEyebrows} colors={colors} />

                            {/* Eyes */}
                            <Eyes
                                type={activeEyes}
                                colors={colors}
                                targetX={eyeTargetX}
                                targetY={eyeTargetY}
                            />

                            {/* Mouth */}
                            <Mouth type={activeMouth} colors={colors} />

                            {/* Emotional Overlays / Emotes */}
                            <Emotes type={activeEmote} colors={colors} />
                        </Head>
                    </g>
                </g>
            </svg>
        </div>
    );
};
