import React from "react";
import { CharacterPose, CharacterColorScheme } from "../types";
import { STROKE } from "../constants";

interface BodyProps {
    pose: CharacterPose;
    colors: CharacterColorScheme;
    direction?: "left" | "right" | "front";
    breathOffset?: number; // 0 to 1
}

export const Body: React.FC<BodyProps> = ({
    pose = "standing",
    colors,
    direction = "front",
    breathOffset = 0,
}) => {
    // Subtle breathing expansion on torso
    const breathY = breathOffset * -3;

    // Common components: Hand helper
    const renderMittenHand = (cx: number, cy: number, rot: number = 0, scale: number = 1) => (
        <g transform={`translate(${cx}, ${cy}) rotate(${rot}) scale(${scale})`}>
            {/* Palm */}
            <circle
                cx={0}
                cy={0}
                r={10.5}
                fill={colors.skinColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
            />
            {/* Thumb */}
            <ellipse
                cx={-7}
                cy={-3}
                rx={5}
                ry={4}
                fill={colors.skinColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
            />
        </g>
    );

    const renderPointingHand = (cx: number, cy: number, rot: number = 0) => (
        <g transform={`translate(${cx}, ${cy}) rotate(${rot})`}>
            {/* Palm base */}
            <circle cx={0} cy={0} r={9.5} fill={colors.skinColor} stroke={colors.lineColor} strokeWidth={STROKE.medium} />
            {/* Outstretched index finger */}
            <path
                d="M 5 -4 L 25 -4 C 28 -4, 28 2, 25 2 L 5 2 Z"
                fill={colors.skinColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
                strokeLinecap="round"
            />
            {/* Folded thumb */}
            <circle cx={-3} cy={3} r={4.5} fill={colors.skinColor} stroke={colors.lineColor} strokeWidth={STROKE.fine} />
        </g>
    );

    // Common sneaker renderer
    const renderSneaker = (cx: number, cy: number, facingRight: boolean = true, angle: number = 0) => (
        <g transform={`translate(${cx}, ${cy}) rotate(${angle}) ${facingRight ? "" : "scale(-1, 1)"}`}>
            {/* Sneaker main body */}
            <path
                d="M -16 0 
           C -16 -12, 10 -12, 18 -4 
           C 25 -2, 26 8, 20 10 
           L -16 10 Z"
                fill={colors.shoesColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
                strokeLinecap={STROKE.lineCap}
                strokeLinejoin={STROKE.lineJoin}
            />
            {/* Sneaker sole / accent */}
            <path
                d="M -16 7 L 21 7 L 20 12 L -16 12 Z"
                fill={colors.shoeAccent}
                stroke={colors.lineColor}
                strokeWidth={STROKE.fine}
                strokeLinejoin={STROKE.lineJoin}
            />
            {/* Sneaker toe cap curve */}
            <path
                d="M 12 7 C 12 0, 19 0, 20 7"
                fill="none"
                stroke={colors.lineColor}
                strokeWidth={STROKE.fine}
            />
        </g>
    );

    // Torso / Hoodie Core
    const renderTorsoAndHoodie = (torsoY: number = 205 + breathY, lean: number = 0) => (
        <g id="character-torso" transform={`rotate(${lean}, 200, ${torsoY})`}>
            {/* Back Hood Cushion (Visible behind shoulders) */}
            <path
                d={`M 160 ${torsoY + 6} C 160 ${torsoY - 8}, 240 ${torsoY - 8}, 240 ${torsoY + 6} Z`}
                fill={colors.hoodieDark}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
                strokeLinejoin={STROKE.lineJoin}
            />

            {/* Main Hoodie Silhouette */}
            <path
                d={`M 152 ${torsoY + 12} 
           C 168 ${torsoY + 2}, 232 ${torsoY + 2}, 248 ${torsoY + 12} 
           L 254 ${torsoY + 105} 
           C 254 ${torsoY + 115}, 146 ${torsoY + 115}, 146 ${torsoY + 105} 
           Z`}
                fill={colors.hoodieColor}
                stroke={colors.lineColor}
                strokeWidth={STROKE.thick}
                strokeLinecap={STROKE.lineCap}
                strokeLinejoin={STROKE.lineJoin}
            />

            {/* Hoodie Bottom Hem Band */}
            <path
                d={`M 148 ${torsoY + 98} 
           C 174 ${torsoY + 104}, 226 ${torsoY + 104}, 252 ${torsoY + 98} 
           L 250 ${torsoY + 112} 
           C 226 ${torsoY + 118}, 174 ${torsoY + 118}, 150 ${torsoY + 112} 
           Z`}
                fill={colors.hoodieDark}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
                strokeLinejoin={STROKE.lineJoin}
            />

            {/* Front Kangaroo Pouch Pocket */}
            <path
                d={`M 170 ${torsoY + 68} 
           L 230 ${torsoY + 68} 
           L 236 ${torsoY + 98} 
           L 164 ${torsoY + 98} 
           Z`}
                fill={colors.hoodiePocket}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
                strokeLinecap={STROKE.lineCap}
                strokeLinejoin={STROKE.lineJoin}
            />

            {/* Pocket side slit accents */}
            <line
                x1={170}
                y1={torsoY + 68}
                x2={164}
                y2={torsoY + 98}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
            />
            <line
                x1={230}
                y1={torsoY + 68}
                x2={236}
                y2={torsoY + 98}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
            />

            {/* Hoodie Collar Fold / Neck V */}
            <path
                d={`M 178 ${torsoY + 4} 
           Q 200 ${torsoY + 28} 222 ${torsoY + 4} 
           Q 200 ${torsoY + 15} 178 ${torsoY + 4} Z`}
                fill={colors.hoodieDark}
                stroke={colors.lineColor}
                strokeWidth={STROKE.medium}
                strokeLinejoin={STROKE.lineJoin}
            />

            {/* Hanging Drawstrings with Aglets */}
            <path
                d={`M 193 ${torsoY + 16} Q 191 ${torsoY + 45} 190 ${torsoY + 60}`}
                fill="none"
                stroke={colors.drawstringColor}
                strokeWidth={STROKE.fine}
                strokeLinecap="round"
            />
            <rect
                x={188.5}
                y={torsoY + 59}
                width={3}
                height={6}
                rx={1}
                fill="#E2E8F0"
                stroke={colors.lineColor}
                strokeWidth={1}
            />

            <path
                d={`M 207 ${torsoY + 16} Q 209 ${torsoY + 45} 210 ${torsoY + 60}`}
                fill="none"
                stroke={colors.drawstringColor}
                strokeWidth={STROKE.fine}
                strokeLinecap="round"
            />
            <rect
                x={208.5}
                y={torsoY + 59}
                width={3}
                height={6}
                rx={1}
                fill="#E2E8F0"
                stroke={colors.lineColor}
                strokeWidth={1}
            />
        </g>
    );

    // Pose-specific renderings
    switch (pose) {
        case "standing_arms_down":
            return (
                <g id="pose-standing-arms-down">
                    {/* Straight Legs */}
                    <line x1={180} y1={315} x2={180} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={180} y1={315} x2={180} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    <line x1={220} y1={315} x2={220} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={220} y1={315} x2={220} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    {/* Shoes */}
                    {renderSneaker(180, 480, false, 0)}
                    {renderSneaker(220, 480, true, 0)}

                    {/* Torso */}
                    {renderTorsoAndHoodie()}

                    {/* Arms hanging straight down */}
                    {/* Left arm */}
                    <path
                        d="M 152 215 L 140 280 L 140 325"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 215 L 140 280 L 140 325"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(140, 335, 90)}

                    {/* Right arm */}
                    <path
                        d="M 248 215 L 260 280 L 260 325"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 215 L 260 280 L 260 325"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(260, 335, -90)}
                </g>
            );

        case "pointing":
            return (
                <g id="pose-pointing">
                    {/* Legs with slight confident shift */}
                    <line x1={175} y1={315} x2={170} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={175} y1={315} x2={170} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    <line x1={225} y1={315} x2={230} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={225} y1={315} x2={230} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    {renderSneaker(168, 480, false, 0)}
                    {renderSneaker(232, 480, true, 0)}

                    {/* Torso */}
                    {renderTorsoAndHoodie()}

                    {/* Left hand on hip */}
                    <path
                        d="M 152 215 L 126 260 L 152 280"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 215 L 126 260 L 152 280"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(155, 282, -45)}

                    {/* Right arm extended pointing to right/upwards */}
                    <path
                        d="M 248 215 L 290 210 L 330 200"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 215 L 290 210 L 330 200"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderPointingHand(335, 198, -10)}
                </g>
            );

        case "hands_on_hips":
            return (
                <g id="pose-hands-on-hips">
                    {/* Sturdy stance */}
                    <line x1={175} y1={315} x2={165} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={175} y1={315} x2={165} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    <line x1={225} y1={315} x2={235} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={225} y1={315} x2={235} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    {renderSneaker(162, 480, false, 0)}
                    {renderSneaker(238, 480, true, 0)}

                    {/* Torso */}
                    {renderTorsoAndHoodie()}

                    {/* Left arm bent to hip */}
                    <path
                        d="M 152 215 L 120 260 L 152 280"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 215 L 120 260 L 152 280"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(155, 282, -45)}

                    {/* Right arm bent to hip */}
                    <path
                        d="M 248 215 L 280 260 L 248 280"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 215 L 280 260 L 248 280"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(245, 282, 45)}
                </g>
            );

        case "shocked_raised":
            return (
                <g id="pose-shocked-raised">
                    {/* Slightly knees-buckled legs */}
                    <path
                        d="M 175 315 L 170 395 L 175 475"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 175 315 L 170 395 L 175 475"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M 225 315 L 230 395 L 225 475"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 225 315 L 230 395 L 225 475"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {renderSneaker(172, 480, false, 0)}
                    {renderSneaker(228, 480, true, 0)}

                    {/* Torso */}
                    {renderTorsoAndHoodie(200 + breathY)}

                    {/* Left arm raised to cheek */}
                    <path
                        d="M 152 210 L 110 175 L 132 142"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 210 L 110 175 L 132 142"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(132, 140, 50)}

                    {/* Right arm raised to cheek */}
                    <path
                        d="M 248 210 L 290 175 L 268 142"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 210 L 290 175 L 268 142"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(268, 140, -50)}
                </g>
            );

        case "running":
            return (
                <g id="pose-running">
                    {/* Action speed lines behind trailing foot */}
                    <g id="run-dust-puff">
                        <line x1={70} y1={360} x2={45} y2={360} stroke="#94A3B8" strokeWidth={STROKE.medium} strokeLinecap="round" opacity={0.6} />
                        <line x1={80} y1={375} x2={50} y2={375} stroke="#94A3B8" strokeWidth={STROKE.medium} strokeLinecap="round" opacity={0.6} />
                        <circle cx={60} cy={390} r={5} fill="#E2E8F0" opacity={0.5} />
                        <circle cx={48} cy={395} r={3} fill="#E2E8F0" opacity={0.5} />
                    </g>

                    {/* Back leg (bent high behind) */}
                    <path
                        d="M 175 315 L 140 370 L 105 340"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 175 315 L 140 370 L 105 340"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderSneaker(100, 335, false, -30)}

                    {/* Front leg (lunging forward to ground) */}
                    <path
                        d="M 225 315 L 255 385 L 290 465"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 225 315 L 255 385 L 290 465"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderSneaker(295, 470, true, 15)}

                    {/* Torso leaning forward */}
                    {renderTorsoAndHoodie(205 + breathY, 12)}

                    {/* Left arm swinging back */}
                    <path
                        d="M 152 215 L 110 250 L 80 230"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 215 L 110 250 L 80 230"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(75, 226, -30)}

                    {/* Right arm swinging forward */}
                    <path
                        d="M 248 215 L 290 240 L 315 200"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 215 L 290 240 L 315 200"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(320, 195, 40)}
                </g>
            );

        case "sitting":
            return (
                <g id="pose-sitting">
                    {/* Sitting bench / stool */}
                    <rect x={140} y={380} width={120} height={12} rx={6} fill="#334155" stroke={colors.lineColor} strokeWidth={STROKE.medium} />
                    <line x1={152} y1={392} x2={152} y2={480} stroke={colors.lineColor} strokeWidth={STROKE.medium} />
                    <line x1={248} y1={392} x2={248} y2={480} stroke={colors.lineColor} strokeWidth={STROKE.medium} />

                    {/* Bent 90-degree sitting legs */}
                    <path
                        d="M 175 315 L 175 380 L 175 470"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 175 315 L 175 380 L 175 470"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M 225 315 L 225 380 L 225 470"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 225 315 L 225 380 L 225 470"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {renderSneaker(175, 475, true, 0)}
                    {renderSneaker(225, 475, true, 0)}

                    {/* Torso */}
                    {renderTorsoAndHoodie(220 + breathY)}

                    {/* Hands resting forward on knees */}
                    <path
                        d="M 152 230 L 140 295 L 170 350"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 230 L 140 295 L 170 350"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(172, 355, 60)}

                    <path
                        d="M 248 230 L 260 295 L 230 350"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 230 L 260 295 L 230 350"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(228, 355, -60)}
                </g>
            );

        case "falling_defeated":
            return (
                <g id="pose-falling-defeated">
                    {/* Slumped legs collapsed outward */}
                    <path
                        d="M 180 325 L 145 400 L 130 480"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 180 325 L 145 400 L 130 480"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M 220 325 L 255 400 L 270 480"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 220 325 L 255 400 L 270 480"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {renderSneaker(125, 482, false, 45)}
                    {renderSneaker(275, 482, true, -45)}

                    {/* Slumped low torso */}
                    {renderTorsoAndHoodie(225 + breathY)}

                    {/* Limp arms dangling to knees/floor */}
                    <path
                        d="M 152 235 L 135 315 L 145 390"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 235 L 135 315 L 145 390"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(146, 398, 90)}

                    <path
                        d="M 248 235 L 265 315 L 255 390"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 235 L 265 315 L 255 390"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(254, 398, -90)}
                </g>
            );

        case "thinking":
            return (
                <g id="pose-thinking">
                    {/* Thoughtful relaxed weight-shift stance */}
                    <line x1={180} y1={315} x2={175} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={180} y1={315} x2={175} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    <line x1={220} y1={315} x2={228} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={220} y1={315} x2={228} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    {renderSneaker(172, 480, false, 0)}
                    {renderSneaker(230, 480, true, 0)}

                    {/* Torso */}
                    {renderTorsoAndHoodie()}

                    {/* Left arm crossed under right elbow */}
                    <path
                        d="M 152 215 L 140 270 L 210 275"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 215 L 140 270 L 210 275"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(214, 275, 0)}

                    {/* Right arm bent up with hand supporting chin */}
                    <path
                        d="M 248 215 L 265 270 L 218 190"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 215 L 265 270 L 218 190"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(215, 185, -70)}
                </g>
            );

        case "celebrating":
            return (
                <g id="pose-celebrating">
                    {/* Joyful jumpy feet */}
                    <path
                        d="M 180 315 L 170 395 L 165 470"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 180 315 L 170 395 L 165 470"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M 220 315 L 230 395 L 235 470"
                        fill="none"
                        stroke={colors.pantsColor}
                        strokeWidth={STROKE.thick + 4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 220 315 L 230 395 L 235 470"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.medium}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {renderSneaker(162, 475, false, -10)}
                    {renderSneaker(238, 475, true, 10)}

                    {/* Torso */}
                    {renderTorsoAndHoodie(200 + breathY)}

                    {/* Left arm raised high in V */}
                    <path
                        d="M 152 210 L 115 150 L 95 90"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 210 L 115 150 L 95 90"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(90, 85, -30)}

                    {/* Right arm raised high in V */}
                    <path
                        d="M 248 210 L 285 150 L 305 90"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 210 L 285 150 L 305 90"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(310, 85, 30)}
                </g>
            );

        case "standing":
        default:
            return (
                <g id="pose-standing">
                    {/* Relaxed stance legs */}
                    <line x1={180} y1={315} x2={178} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={180} y1={315} x2={178} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    <line x1={220} y1={315} x2={222} y2={475} stroke={colors.pantsColor} strokeWidth={STROKE.thick + 4} strokeLinecap="round" />
                    <line x1={220} y1={315} x2={222} y2={475} stroke={colors.lineColor} strokeWidth={STROKE.medium} strokeLinecap="round" />

                    {renderSneaker(175, 480, false, 0)}
                    {renderSneaker(225, 480, true, 0)}

                    {/* Torso */}
                    {renderTorsoAndHoodie()}

                    {/* Relaxed arms curved slightly outwards */}
                    {/* Left arm */}
                    <path
                        d="M 152 215 L 132 275 L 142 320"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 152 215 L 132 275 L 142 320"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(144, 328, 70)}

                    {/* Right arm */}
                    <path
                        d="M 248 215 L 268 275 L 258 320"
                        fill="none"
                        stroke={colors.hoodieColor}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 248 215 L 268 275 L 258 320"
                        fill="none"
                        stroke={colors.lineColor}
                        strokeWidth={STROKE.thick}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {renderMittenHand(256, 328, -70)}
                </g>
            );
    }
};
