import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { CameraRig, CinematicAtmosphere, FullScreenGlassExplosion } from "./primitives";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, FPS, RELIEF, TENSION } from "./types";

/**
 * SCENE 01 — PLUNGE & COLD OPEN (0.00s – 3.75s)
 * Full-screen underwater plunge, splashdown crash, giant kinetic 30, sinking car.
 * ZERO boxes, ZERO cards. The ocean itself is the canvas.
 */
export const ScenePlunge: React.FC = () => {
    const frame = useCurrentFrame();

    const flashOpacity = frame < 4 ? 0.9 - frame * 0.22 : 0;

    // Car sinking motion across the full frame
    const carY = interpolate(frame, [0, 110], [180, 520], { extrapolateRight: "clamp" });
    const carX = interpolate(frame, [0, 110], [500, 420], { extrapolateRight: "clamp" });
    const carAngle = interpolate(frame, [0, 110], [15, 34], { extrapolateRight: "clamp" });

    // Giant 30 countdown scale punch
    const countSpring = spring({
        frame: Math.max(0, frame - 6),
        fps: FPS,
        config: { damping: 9, mass: 0.4 },
    });

    return (
        <CameraRig shakeAtFrame={0} shakeDuration={12} shakeIntensity={26}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <CinematicAtmosphere relief={false} intensity={1.3} bubblesCount={24} />

                {/* White Flash at Initial Splash Impact */}
                {flashOpacity > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "#FFFFFF",
                            opacity: flashOpacity,
                            zIndex: 100,
                        }}
                    />
                )}

                {/* Full-Screen Splashdown Shockwave Rings */}
                {frame < 28 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "22%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: frame * 42,
                            height: frame * 20,
                            borderRadius: "50%",
                            border: "3px solid rgba(0, 240, 255, 0.7)",
                            opacity: Math.max(0, 1 - frame / 28),
                            pointerEvents: "none",
                        }}
                    />
                )}

                {/* Full-Size Sinking Car Vector */}
                <div
                    style={{
                        position: "absolute",
                        top: carY,
                        left: carX,
                        transform: `translate(-50%, -50%) rotate(${carAngle}deg)`,
                        width: 720,
                        height: 300,
                        pointerEvents: "none",
                        filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.9))",
                    }}
                >
                    {/* Volumetric Headlight Beam Slicing Through the Ocean */}
                    <div
                        style={{
                            position: "absolute",
                            top: 100,
                            right: -420,
                            width: 540,
                            height: 180,
                            background:
                                "linear-gradient(90deg, rgba(0, 240, 255, 0.65) 0%, rgba(0, 240, 255, 0.2) 60%, transparent 100%)",
                            clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 65%)",
                            filter: "blur(10px)",
                        }}
                    />

                    <svg viewBox="0 0 520 220" width="720" height="300">
                        <defs>
                            <linearGradient id="carGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0D4B68" />
                                <stop offset="60%" stopColor="#062537" />
                                <stop offset="100%" stopColor="#010B12" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M 40 140 L 90 90 L 180 50 L 340 50 L 420 90 L 490 110 L 500 150 L 460 160 L 440 140 A 35 35 0 0 0 370 140 L 160 140 A 35 35 0 0 0 90 140 L 40 140 Z"
                            fill="url(#carGradFull)"
                            stroke="#00F0FF"
                            strokeWidth="4"
                        />
                        {/* Cabin Windows */}
                        <polygon points="185,58 260,58 260,95 125,95" fill="rgba(0, 240, 255, 0.3)" stroke="#00F0FF" strokeWidth="2.5" />
                        <polygon points="275,58 335,58 405,95 275,95" fill="rgba(0, 240, 255, 0.3)" stroke="#00F0FF" strokeWidth="2.5" />
                        {/* Wheels */}
                        <circle cx="125" cy="140" r="28" fill="#01080E" stroke="#00F0FF" strokeWidth="3.5" />
                        <circle cx="405" cy="140" r="28" fill="#01080E" stroke="#00F0FF" strokeWidth="3.5" />
                    </svg>
                </div>

                {/* Giant Floating Kinetic 30 Countdown (No Boxes) */}
                {frame >= 5 && frame < 45 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "42%",
                            left: "50%",
                            transform: `translate(-50%, -50%) scale(${countSpring})`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 60,
                            pointerEvents: "none",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: FONT_DISPLAY,
                                fontSize: 220,
                                fontWeight: 900,
                                color: TENSION.accent,
                                lineHeight: 0.85,
                                WebkitTextStroke: "6px rgba(0, 8, 14, 0.95)",
                                paintOrder: "stroke fill",
                                textShadow: "0 0 60px rgba(255, 122, 24, 0.9), 0 10px 40px rgba(0,0,0,0.9)",
                            }}
                        >
                            30
                        </span>
                        <span
                            style={{
                                fontFamily: FONT_DISPLAY,
                                fontSize: 48,
                                fontWeight: 900,
                                color: "#FFFFFF",
                                letterSpacing: 6,
                                marginTop: 8,
                                textShadow: "0 4px 20px rgba(0,0,0,0.95)",
                            }}
                        >
                            SECONDS
                        </span>
                    </div>
                )}

                {/* Floating Kinetic Title Directly in Water Space (No Boxes) */}
                {frame >= 45 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "34%",
                            left: 0,
                            right: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                            zIndex: 60,
                            pointerEvents: "none",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: FONT_DISPLAY,
                                fontSize: 92,
                                fontWeight: 900,
                                color: "#FFFFFF",
                                textAlign: "center",
                                lineHeight: 1.0,
                                WebkitTextStroke: "4px rgba(0, 8, 14, 0.95)",
                                paintOrder: "stroke fill",
                                textShadow: "0 8px 30px rgba(0,0,0,0.95)",
                            }}
                        >
                            30 SECONDS
                        </div>
                        <div
                            style={{
                                fontFamily: FONT_DISPLAY,
                                fontSize: 92,
                                fontWeight: 900,
                                color: "#FF7A18",
                                textAlign: "center",
                                lineHeight: 1.0,
                                WebkitTextStroke: "4px rgba(0, 8, 14, 0.95)",
                                paintOrder: "stroke fill",
                                textShadow: "0 0 40px rgba(255, 122, 24, 0.8), 0 8px 30px rgba(0,0,0,0.95)",
                            }}
                        >
                            TO SURVIVE
                        </div>
                    </div>
                )}
            </div>
        </CameraRig>
    );
};

/**
 * SCENE 02 — DO NOT OPEN THE DOOR (3.75s – 8.60s)
 * Full-screen door interior, physical handle pull strain, water current lines crashing against window, giant 800 numerals.
 * ZERO boxes, ZERO cards.
 */
export const SceneDoorMistake: React.FC = () => {
    const frame = useCurrentFrame();

    const handlePull = frame > 12 && frame < 52;
    const handleJiggle = handlePull ? Math.sin(frame * 1.6) * 10 : 0;
    const pressurePeak = frame > 38;

    return (
        <CameraRig shakeAtFrame={40} shakeDuration={10} shakeIntensity={20}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <CinematicAtmosphere relief={false} intensity={1.4} bubblesCount={28} />

                {/* Full-Screen Car Door & Window Silhouette */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    {/* Car Door Frame & Window Outline spanning the full scene */}
                    <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
                        <defs>
                            <linearGradient id="doorMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0B3044" />
                                <stop offset="100%" stopColor="#02101A" />
                            </linearGradient>
                        </defs>

                        {/* Main Door Inner Panel */}
                        <path
                            d="M 60 300 L 980 300 L 1020 1450 L 60 1450 Z"
                            fill="url(#doorMetalGrad)"
                            stroke={pressurePeak ? "#FF2A4B" : "#00F0FF"}
                            strokeWidth="4"
                        />

                        {/* Window Glass Area with Deep Ocean Outside */}
                        <path
                            d="M 120 360 L 920 360 L 900 820 L 120 820 Z"
                            fill="rgba(0, 180, 240, 0.18)"
                            stroke="#00F0FF"
                            strokeWidth="3"
                        />

                        {/* Inward Water Pressure Flow Lines Outside the Window */}
                        {Array.from({ length: 7 }).map((_, i) => {
                            const y = 420 + i * 55;
                            const xOffset = Math.sin((frame + i * 12) * 0.1) * 20;
                            return (
                                <path
                                    key={i}
                                    d={`M ${180 + xOffset} ${y} Q ${520 + xOffset} ${y + 20} ${860 + xOffset} ${y}`}
                                    fill="none"
                                    stroke={pressurePeak ? "rgba(255, 42, 75, 0.6)" : "rgba(0, 240, 255, 0.45)"}
                                    strokeWidth={pressurePeak ? "4" : "2.5"}
                                    strokeDasharray="16 8"
                                />
                            );
                        })}
                    </svg>

                    {/* Mechanical Door Handle in the Center */}
                    <div
                        style={{
                            position: "absolute",
                            top: "52%",
                            left: "50%",
                            transform: `translate(-50%, ${handleJiggle}px)`,
                            width: 360,
                            height: 100,
                            borderRadius: 20,
                            background: "linear-gradient(180deg, #103B52 0%, #03141F 100%)",
                            border: `4px solid ${pressurePeak ? "#FF2A4B" : "#00F0FF"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: handlePull
                                ? "0 0 50px rgba(255, 42, 75, 0.9), 0 20px 40px rgba(0,0,0,0.9)"
                                : "0 20px 40px rgba(0,0,0,0.8)",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: FONT_DISPLAY,
                                fontSize: 38,
                                fontWeight: 900,
                                color: pressurePeak ? "#FF2A4B" : "#FFFFFF",
                                letterSpacing: 2,
                                textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                            }}
                        >
                            {handlePull ? "JAMMED / LOCKED" : "DOOR HANDLE"}
                        </span>
                    </div>
                </div>

                {/* Floating Warning Typography in Upper Space (No Box) */}
                <div
                    style={{
                        position: "absolute",
                        top: "16%",
                        left: 0,
                        right: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        zIndex: 60,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            fontFamily: FONT_DISPLAY,
                            fontSize: 100,
                            fontWeight: 900,
                            color: "#FF2A4B",
                            lineHeight: 0.95,
                            WebkitTextStroke: "4px rgba(0, 8, 14, 0.95)",
                            paintOrder: "stroke fill",
                            textShadow: "0 0 50px rgba(255, 42, 75, 0.9), 0 8px 30px rgba(0,0,0,0.95)",
                        }}
                    >
                        DO NOT
                    </div>
                    <div
                        style={{
                            fontFamily: FONT_DISPLAY,
                            fontSize: 64,
                            fontWeight: 900,
                            color: "#FFFFFF",
                            letterSpacing: 2,
                            WebkitTextStroke: "3px rgba(0, 8, 14, 0.95)",
                            paintOrder: "stroke fill",
                            textShadow: "0 6px 24px rgba(0,0,0,0.95)",
                        }}
                    >
                        OPEN THE DOOR
                    </div>
                </div>

                {/* Giant 800 Numerals Floating Outside Window (No Box) */}
                {pressurePeak && (
                    <div
                        style={{
                            position: "absolute",
                            top: "32%",
                            left: 0,
                            right: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 60,
                            pointerEvents: "none",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: FONT_DISPLAY,
                                fontSize: 140,
                                fontWeight: 900,
                                color: "#FF2A4B",
                                lineHeight: 0.9,
                                WebkitTextStroke: "5px rgba(0, 8, 14, 0.95)",
                                paintOrder: "stroke fill",
                                textShadow: "0 0 50px rgba(255, 42, 75, 0.8), 0 8px 30px rgba(0,0,0,0.95)",
                            }}
                        >
                            800+
                        </span>
                        <span
                            style={{
                                fontFamily: FONT_DISPLAY,
                                fontSize: 40,
                                fontWeight: 900,
                                color: "#FFFFFF",
                                letterSpacing: 4,
                                marginTop: 6,
                                textShadow: "0 4px 20px rgba(0,0,0,0.95)",
                            }}
                        >
                            LBS WATER PRESSURE
                        </span>
                    </div>
                )}
            </div>
        </CameraRig>
    );
};

/**
 * SCENE 03 — STAY CALM & WATER FILLING CABIN (8.60s – 12.87s)
 * Full-screen cabin cross-section, physical waterline rising from chest to chin, nose/mouth air pocket.
 * ZERO boxes, ZERO progress cards.
 */
export const SceneWaterRise: React.FC = () => {
    const frame = useCurrentFrame();

    // Waterline physically rises across the full 1080x1920 screen (y from 1400px down to 600px)
    const waterY = interpolate(frame, [0, 110], [1350, 680], { extrapolateRight: "clamp" });
    const waterWave = Math.sin(frame * 0.18) * 14;

    return (
        <CameraRig translateY={Math.sin(frame * 0.08) * 6}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <CinematicAtmosphere relief={false} intensity={1.5} bubblesCount={32} />

                {/* Full-Screen Car Interior & Character Silhouette */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    {/* Car Roof & Pillars */}
                    <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
                        {/* Windshield & Roof Frame */}
                        <path d="M 0 200 L 1080 200 L 1080 320 L 0 320 Z" fill="#041824" stroke="#00F0FF" strokeWidth="4" />
                        <path d="M 60 320 L 160 1200 L 0 1200 Z" fill="#02101A" />
                        <path d="M 1020 320 L 920 1200 L 1080 1200 Z" fill="#02101A" />

                        {/* Car Seat */}
                        <rect x="360" y="700" width="360" height="800" rx="40" fill="#061F2E" stroke="#00F0FF" strokeWidth="3" />
                        <rect x="420" y="520" width="240" height="180" rx="30" fill="#061F2E" stroke="#00F0FF" strokeWidth="3" />
                    </svg>

                    {/* Full-Size Human Character Silhouette */}
                    <div
                        style={{
                            position: "absolute",
                            top: 500,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 320,
                            height: 700,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 30,
                        }}
                    >
                        {/* Head & Air Pocket */}
                        <div
                            style={{
                                width: 140,
                                height: 140,
                                borderRadius: "50%",
                                border: "4px solid #00F0FF",
                                background: "rgba(0, 240, 255, 0.25)",
                                position: "relative",
                                boxShadow: waterY < 800 ? "0 0 50px rgba(255, 184, 0, 0.95)" : "0 0 20px rgba(0, 240, 255, 0.5)",
                            }}
                        >
                            {/* Glowing Golden Breathing Air Pocket Callout */}
                            <div
                                style={{
                                    position: "absolute",
                                    right: -240,
                                    top: 30,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: FONT_DISPLAY,
                                        fontSize: 28,
                                        color: "#FFD666",
                                        fontWeight: 900,
                                        letterSpacing: 2,
                                        textShadow: "0 0 25px rgba(255, 184, 0, 0.9)",
                                    }}
                                >
                                    AIR POCKET
                                </span>
                                <span
                                    style={{
                                        fontFamily: FONT_MONO,
                                        fontSize: 20,
                                        color: "#FFFFFF",
                                        fontWeight: 700,
                                    }}
                                >
                                    BREATHE HERE
                                </span>
                            </div>
                        </div>

                        {/* Neck */}
                        <div style={{ width: 44, height: 40, background: "rgba(0, 240, 255, 0.4)" }} />

                        {/* Torso & Seatbelt Strap */}
                        <div
                            style={{
                                width: 260,
                                height: 380,
                                border: "4.5px solid #00F0FF",
                                borderRadius: "36px 36px 0 0",
                                background: "rgba(0, 240, 255, 0.18)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Diagonal Seatbelt Line across torso */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: -20,
                                    left: 20,
                                    width: 30,
                                    height: 440,
                                    background: "#FF7A18",
                                    transform: "rotate(35deg)",
                                    boxShadow: "0 0 15px rgba(255, 122, 24, 0.8)",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Real Physical Rising Water Mass (Full Width 1080px) */}
                <div
                    style={{
                        position: "absolute",
                        top: waterY + waterWave,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "linear-gradient(180deg, rgba(0, 240, 255, 0.6) 0%, rgba(3, 26, 42, 0.96) 30%, #010A10 100%)",
                        borderTop: "5px solid #00F0FF",
                        boxShadow: "0 0 40px rgba(0, 240, 255, 0.8)",
                        zIndex: 40,
                        pointerEvents: "none",
                    }}
                />

                {/* Floating Spatial Typography in Upper Space (No Box) */}
                <div
                    style={{
                        position: "absolute",
                        top: "16%",
                        left: 0,
                        right: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        zIndex: 60,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            fontFamily: FONT_DISPLAY,
                            fontSize: 90,
                            fontWeight: 900,
                            color: "#00FFA3",
                            lineHeight: 0.95,
                            WebkitTextStroke: "4px rgba(0, 8, 14, 0.95)",
                            paintOrder: "stroke fill",
                            textShadow: "0 0 40px rgba(0, 255, 163, 0.8), 0 8px 30px rgba(0,0,0,0.95)",
                        }}
                    >
                        STAY CALM
                    </div>
                    <div
                        style={{
                            fontFamily: FONT_DISPLAY,
                            fontSize: 54,
                            fontWeight: 900,
                            color: "#FFFFFF",
                            letterSpacing: 2,
                            WebkitTextStroke: "3px rgba(0, 8, 14, 0.95)",
                            paintOrder: "stroke fill",
                            textShadow: "0 6px 24px rgba(0,0,0,0.95)",
                        }}
                    >
                        LET WATER FILL TO CHIN
                    </div>
                </div>
            </div>
        </CameraRig>
    );
};

/**
 * SCENE 04 — ESCAPE EXECUTION (12.87s – 18.80s)
 * Pressure equalizes -> Unbuckle buckle snap -> Foot strike on window corner -> Full-screen tempered glass explosion.
 * ZERO boxes, ZERO cards.
 */
export const SceneEscapeAction: React.FC = () => {
    const frame = useCurrentFrame();

    const isKickPhase = frame > 70;
    const isShattered = frame > 95;

    return (
        <CameraRig shakeAtFrame={95} shakeDuration={14} shakeIntensity={28}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <CinematicAtmosphere relief={false} intensity={1.3} bubblesCount={24} />

                {/* Phase 1: Full-Screen Equalization Glow / Unbuckle */}
                {!isKickPhase && (
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                        {/* Emerald Equalization Light Wave */}
                        <div
                            style={{
                                position: "absolute",
                                top: "32%",
                                left: 0,
                                right: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 12,
                                zIndex: 50,
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: FONT_DISPLAY,
                                    fontSize: 82,
                                    fontWeight: 900,
                                    color: "#00FFA3",
                                    textAlign: "center",
                                    lineHeight: 1.0,
                                    WebkitTextStroke: "4px rgba(0, 8, 14, 0.95)",
                                    paintOrder: "stroke fill",
                                    textShadow: "0 0 50px rgba(0, 255, 163, 0.9), 0 8px 30px rgba(0,0,0,0.95)",
                                }}
                            >
                                PRESSURE EQUALIZED
                            </span>
                            <span
                                style={{
                                    fontFamily: FONT_DISPLAY,
                                    fontSize: 54,
                                    fontWeight: 900,
                                    color: "#FFFFFF",
                                    letterSpacing: 4,
                                    textShadow: "0 6px 20px rgba(0,0,0,0.95)",
                                }}
                            >
                                DOORS UNLOCKED
                            </span>
                        </div>

                        {/* Giant Seatbelt Release Indicator */}
                        <div
                            style={{
                                position: "absolute",
                                top: "54%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: "flex",
                                alignItems: "center",
                                gap: 20,
                                zIndex: 50,
                            }}
                        >
                            <span style={{ fontSize: 72 }}>🔓</span>
                            <span
                                style={{
                                    fontFamily: FONT_DISPLAY,
                                    fontSize: 72,
                                    fontWeight: 900,
                                    color: "#00FFA3",
                                    WebkitTextStroke: "3px rgba(0, 8, 14, 0.95)",
                                    paintOrder: "stroke fill",
                                    textShadow: "0 0 35px rgba(0, 255, 163, 0.8)",
                                }}
                            >
                                UNBUCKLE
                            </span>
                        </div>
                    </div>
                )}

                {/* Phase 2: Full-Screen Side Window Kick & Shatter */}
                {isKickPhase && (
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                        {/* Full-Screen Side Window Frame */}
                        <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
                            {/* Window Outer Frame */}
                            <path
                                d="M 100 320 L 980 320 L 920 1200 L 100 1200 Z"
                                fill={isShattered ? "none" : "rgba(0, 240, 255, 0.18)"}
                                stroke={isShattered ? "#FF7A18" : "#00F0FF"}
                                strokeWidth="6"
                            />

                            {/* Radial Fracture Lines at Kick Corner */}
                            {isShattered && (
                                <g stroke="#FFFFFF" strokeWidth="3" opacity="0.9">
                                    <line x1="200" y1="1100" x2="600" y2="400" />
                                    <line x1="200" y1="1100" x2="900" y2="700" />
                                    <line x1="200" y1="1100" x2="800" y2="1150" />
                                    <line x1="200" y1="1100" x2="350" y2="350" />
                                    <line x1="200" y1="1100" x2="120" y2="600" />
                                </g>
                            )}
                        </svg>

                        {/* Floating Kinetic Action Text */}
                        <div
                            style={{
                                position: "absolute",
                                top: "18%",
                                left: 0,
                                right: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                zIndex: 60,
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: FONT_DISPLAY,
                                    fontSize: 90,
                                    fontWeight: 900,
                                    color: isShattered ? "#FF7A18" : "#FFFFFF",
                                    lineHeight: 0.95,
                                    WebkitTextStroke: "4px rgba(0, 8, 14, 0.95)",
                                    paintOrder: "stroke fill",
                                    textShadow: isShattered
                                        ? "0 0 50px rgba(255, 122, 24, 0.9), 0 8px 30px rgba(0,0,0,0.95)"
                                        : "0 8px 30px rgba(0,0,0,0.95)",
                                }}
                            >
                                {isShattered ? "WINDOW SHATTERED" : "KICK THE CORNER"}
                            </div>
                        </div>

                        {/* Full-Screen Glass Shard Explosion */}
                        {isShattered && <FullScreenGlassExplosion activeFrame={95} />}
                    </div>
                )}
            </div>
        </CameraRig>
    );
};

/**
 * SCENE 05 — SWIM TO THE SURFACE & RELIEF (18.80s – 23.80s)
 * Full-screen deep ocean to sunlit surface, ascending swimmer, golden volumetric godrays.
 * ZERO boxes, ZERO cards.
 */
export const SceneSurfacePayoff: React.FC = () => {
    const frame = useCurrentFrame();

    // Swimmer ascends rapidly toward the radiant surface
    const swimmerY = interpolate(frame, [0, 150], [420, -180], { extrapolateRight: "clamp" });
    const legKick = Math.sin(frame * 0.5) * 14;

    return (
        <CameraRig translateY={-frame * 1.0}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <CinematicAtmosphere relief={true} intensity={1.0} bubblesCount={36} />

                {/* Full-Size Ascending Swimmer Silhouette */}
                <div
                    style={{
                        position: "absolute",
                        top: "38%",
                        left: "50%",
                        transform: `translate(-50%, ${swimmerY}px)`,
                        width: 180,
                        height: 360,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        filter: "drop-shadow(0 0 35px rgba(255, 184, 0, 0.95))",
                        zIndex: 30,
                        pointerEvents: "none",
                    }}
                >
                    {/* Head & Extended Arms Reaching for Sunlight */}
                    <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
                        <div style={{ width: 16, height: 70, background: "#FFD666", borderRadius: 10 }} />
                        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#FFD666" }} />
                        <div style={{ width: 16, height: 70, background: "#FFD666", borderRadius: 10 }} />
                    </div>

                    {/* Torso */}
                    <div
                        style={{
                            width: 65,
                            height: 130,
                            background: "linear-gradient(180deg, #FFD666 0%, #FF7A18 100%)",
                            borderRadius: 18,
                            marginTop: 6,
                        }}
                    />

                    {/* Kicking Legs */}
                    <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
                        <div
                            style={{
                                width: 16,
                                height: 110,
                                background: "#FF7A18",
                                borderRadius: 10,
                                transform: `rotate(${legKick}deg)`,
                                transformOrigin: "top center",
                            }}
                        />
                        <div
                            style={{
                                width: 16,
                                height: 110,
                                background: "#FF7A18",
                                borderRadius: 10,
                                transform: `rotate(${-legKick}deg)`,
                                transformOrigin: "top center",
                            }}
                        />
                    </div>
                </div>

                {/* Floating Spatial Typography in Sunlit Ocean (No Box) */}
                <div
                    style={{
                        position: "absolute",
                        top: "16%",
                        left: 0,
                        right: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        zIndex: 60,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            fontFamily: FONT_DISPLAY,
                            fontSize: 88,
                            fontWeight: 900,
                            color: "#FFFFFF",
                            textAlign: "center",
                            lineHeight: 1.0,
                            WebkitTextStroke: "4px rgba(0, 8, 14, 0.95)",
                            paintOrder: "stroke fill",
                            textShadow: "0 0 50px rgba(255, 214, 102, 0.9), 0 8px 30px rgba(0,0,0,0.95)",
                        }}
                    >
                        SWIM TO THE SURFACE
                    </div>
                </div>
            </div>
        </CameraRig>
    );
};
