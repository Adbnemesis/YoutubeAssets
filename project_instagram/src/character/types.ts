import React from "react";

export type CharacterExpression =
    | "neutral"
    | "happy"
    | "shocked"
    | "confused"
    | "angry"
    | "scared"
    | "embarrassed"
    | "sad"
    | "smug"
    | "deadpan"
    | "excited"
    | "crying"
    | "screaming"
    | "tired"
    | "thinking";

export type CharacterPose =
    | "standing"
    | "standing_arms_down"
    | "pointing"
    | "hands_on_hips"
    | "shocked_raised"
    | "running"
    | "sitting"
    | "falling_defeated"
    | "thinking"
    | "celebrating";

export type EyeType =
    | "normal"
    | "happy"
    | "wide_shocked"
    | "narrowed"
    | "tired"
    | "confused"
    | "deadpan"
    | "crying"
    | "smug"
    | "sparkle"
    | "closed_tight"
    | "squint";

export type MouthType =
    | "neutral"
    | "smile"
    | "open_talk"
    | "shocked_gasp"
    | "frown"
    | "nervous_grimace"
    | "laughing"
    | "smirk"
    | "screaming"
    | "deadpan"
    | "tongue_out";

export type EyebrowType =
    | "neutral"
    | "raised"
    | "angry"
    | "worried"
    | "confused"
    | "smug"
    | "flat";

export type EmoteType =
    | "none"
    | "sweat_drop"
    | "question_mark"
    | "exclamation"
    | "shock_lines"
    | "blush"
    | "anger_vein"
    | "stars";

export type CharacterDirection = "left" | "right" | "front";

export interface CharacterColorScheme {
    skinColor: string;       // Clean off-white / light cream (#FFFDF9)
    lineColor: string;       // Crisp dark ink (#1E2028)
    hoodieColor: string;     // Signature vibrant hoodie (#FF5238 Sunset Coral or #00D2FF)
    hoodieDark: string;      // Shadow/cuff/crease color (#E03820)
    hoodiePocket: string;    // Front pouch pocket (#FF6850)
    drawstringColor: string; // White drawstrings (#FFFFFF)
    pantsColor: string;      // Dark charcoal slate (#2D3139)
    shoesColor: string;      // Vibrant matching or bright white sneakers (#FFFFFF)
    shoeAccent: string;      // Sneaker stripe / sole accent (#FF5238)
    hairColor: string;       // Dark ink tuft (#1E2028)
    blushColor: string;      // Soft rosy pink (#FF8BA7)
    mouthInside: string;     // Dark crimson (#7C1D2A)
    tongueColor: string;     // Warm pink (#FF6B8B)
    teethColor: string;      // Pure white (#FFFFFF)
}

export interface CharacterPresetExpression {
    eyes: EyeType;
    mouth: MouthType;
    eyebrows: EyebrowType;
    emote?: EmoteType;
    headTilt?: number; // degrees
}

export interface CharacterProps {
    expression?: CharacterExpression;
    pose?: CharacterPose;
    direction?: CharacterDirection;
    size?: number; // Base height in pixels (e.g. 500)
    scale?: number;

    // Direct overrides
    eyes?: EyeType;
    mouth?: MouthType;
    eyebrows?: EyebrowType;
    emote?: EmoteType;

    // Customization & color theme
    colorScheme?: Partial<CharacterColorScheme>;
    hoodieColor?: string;

    // Dynamic kinematics / animation parameters
    headTilt?: number;      // degrees
    headOffsetY?: number;   // px
    headOffsetX?: number;   // px
    bodyLean?: number;      // degrees
    breathOffset?: number;  // 0 to 1 breathing cycle
    eyeTargetX?: number;    // -1 to 1 look direction
    eyeTargetY?: number;    // -1 to 1 look direction

    // Visual tweaks
    showShadow?: boolean;
    shadowOpacity?: number;

    style?: React.CSSProperties;
    className?: string;
}
