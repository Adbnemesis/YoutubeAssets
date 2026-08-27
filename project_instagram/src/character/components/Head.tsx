import React from "react";
import { CharacterColorScheme } from "../types";
import { STROKE } from "../constants";

interface HeadProps {
    colors: CharacterColorScheme;
    direction?: "left" | "right" | "front";
    children?: React.ReactNode;
}

export const Head: React.FC<HeadProps> = ({
    colors,
    direction = "front",
    children,
}) => {
    // Slight profile / 3-quarter shift based on direction
    const xOffset = direction === "left" ? -4 : direction === "right" ? 4 : 0;

    return (
        <g id="character-head-group">
            {/* Neck */}
            <path
                d={`M ${190 + xOffset} 185 L ${190 + xOffset} 212 L ${210 + xOffset} 212 L ${210 + xOffset} 185`}
                fill={colors.skinColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
                strokeLinecap={STROKE.lineCap}
                strokeLinejoin={STROKE.lineJoin}
            />

            {/* Left Ear */}
            <path
                d="M 132 130 C 122 130, 122 146, 132 148"
                fill={colors.skinColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.thick}
                strokeLinecap={STROKE.lineCap}
            />
            <path
                d="M 129 136 C 126 138, 126 142, 129 144"
                fill="none"
                stroke={colors.lineColor}
                strokeWidth={STROKE.fine}
                strokeLinecap={STROKE.lineCap}
            />

            {/* Right Ear */}
            <path
                d="M 268 130 C 278 130, 278 146, 268 148"
                fill={colors.skinColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.thick}
                strokeLinecap={STROKE.lineCap}
            />
            <path
                d="M 271 136 C 274 138, 274 142, 271 144"
                fill="none"
                stroke={colors.lineColor}
                strokeWidth={STROKE.fine}
                strokeLinecap={STROKE.lineCap}
            />

            {/* Main Head Base (Stylized friendly rounded oval with subtle soft jaw) */}
            <path
                d="M 200 68 
           C 252 68, 270 100, 270 138 
           C 270 178, 246 195, 200 195 
           C 154 195, 130 178, 130 138 
           C 130 100, 148 68, 200 68 Z"
                fill={colors.skinColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.thick}
                strokeLinecap={STROKE.lineCap}
                strokeLinejoin={STROKE.lineJoin}
            />

            {/* Signature Animated Cowlick / Hair Tuft (Iconic Brand Asset) */}
            <g id="signature-hair-tuft">
                {/* Main curved tuft */}
                <path
                    d="M 194 69 
             C 192 48, 178 38, 166 42 
             C 180 50, 186 58, 188 69 Z"
                    fill={colors.hairColor}
                    stroke={colors.lineColor}
                    strokeWidth={STROKE.medium}
                    strokeLinecap={STROKE.lineCap}
                    strokeLinejoin={STROKE.lineJoin}
                />
                {/* Secondary perky tuft */}
                <path
                    d="M 198 68 
             C 202 44, 218 36, 226 44 
             C 214 50, 206 58, 204 68 Z"
                    fill={colors.hairColor}
                    stroke={colors.lineColor}
                    strokeWidth={STROKE.medium}
                    strokeLinecap={STROKE.lineCap}
                    strokeLinejoin={STROKE.lineJoin}
                />
            </g>

            {/* Subtle nose hint - minimal comic dot / curve */}
            <path
                d={`M ${199 + xOffset} 142 Q ${202 + xOffset} 144 ${199 + xOffset} 146`}
                fill="none"
                stroke={colors.lineColor}
                strokeWidth={STROKE.fine}
                strokeLinecap={STROKE.lineCap}
            />

            {/* Facial features rendered inside head context */}
            {children}
        </g>
    );
};
