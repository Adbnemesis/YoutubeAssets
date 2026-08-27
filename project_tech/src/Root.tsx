import React from "react";
import { Composition } from "remotion";
import { OxAlphaComp } from "../reels/ox_alpha_14/OxAlphaComp";
import { BinaryComp } from "../reels/binary_13/BinaryComp";
import { TrashComp } from "../reels/trash_12/TrashComp";
import { NoiseComp } from "../reels/noise_11/NoiseComp";
import { McpComp } from "../reels/mcp_09/McpComp";
import { GpsComp } from "../reels/gps_10/GpsComp";
import { TokenizeComp } from "../reels/tokenize_08/TokenizeComp";
import { ShazamComp } from "../reels/shazam_07/ShazamComp";
import { QrCodeComp } from "../reels/qr_06/QrCodeComp";
import { RiddleDeadlockComp } from "../reels/riddle_05/RiddleDeadlockComp";
import { ChatGPTExplainsComp } from "../reels/chatgpt_04/ChatGPTExplainsComp";
import { TwoSumComp } from "../reels/twosum_03/TwoSumComp";
import { GoogleExplainsComp } from "../reels/google_02/GoogleExplainsComp";
import { CaptchaExplainsComp } from "./compositions/CaptchaExplainsComp";
import { ExecutionSimulatorComp } from "./compositions/ExecutionSimulatorComp";
import { KineticAlgorithmDuelComp } from "./compositions/KineticAlgorithmDuelComp";
import { NemiExplainsComp } from "./compositions/NemiExplainsComp";
import { NemiExplainsV2Comp } from "./compositions/NemiExplainsV2Comp";
import { NemiExplainsV3Comp } from "./compositions/NemiExplainsV3Comp";
import { NemiExplainsV4Comp } from "./compositions/NemiExplainsV4Comp";
import { NemiExplainsV5Comp } from "./compositions/NemiExplainsV5Comp";
import { NemiExplainsV6Comp } from "./compositions/NemiExplainsV6Comp";
import { NemiExplainsV7Comp } from "./compositions/NemiExplainsV7Comp";
import { NemiExplainsV8Comp } from "./compositions/NemiExplainsV8Comp";
import { NemiExplainsV9Comp } from "./compositions/NemiExplainsV9Comp";
import { NemiExplainsV10Comp } from "./compositions/NemiExplainsV10Comp";
import { NemiExplainsV11Comp } from "./compositions/NemiExplainsV11Comp";
import { NemiExplainsV12Comp } from "./compositions/NemiExplainsV12Comp";
import { NemiExplainsV13Comp } from "./compositions/NemiExplainsV13Comp";
import { NemiExplainsV14Comp } from "./compositions/NemiExplainsV14Comp";
import { OutputPredictorComp } from "./compositions/OutputPredictorComp";
import { SpotTheBugComp } from "./compositions/SpotTheBugComp";
import { ThingsExplainedComp } from "./compositions/ThingsExplainedComp";
import { AdaShowcaseComp } from "./components/AdaShowcaseComp";
import { ClaudeCodeSkillsCarouselComp } from "./compositions/ClaudeCodeSkillsCarouselComp";
import { THEME } from "./constants/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClaudeCodeSkillsCarousel"
        component={ClaudeCodeSkillsCarouselComp}
        durationInFrames={7} // 7 slides (frames 0 to 6)
        fps={THEME.dimensions.fps}
        width={1080}
        height={1350} // 4:5 Instagram Portrait Standard
      />
      <Composition
        id="AdaShowcase"
        component={AdaShowcaseComp}
        durationInFrames={30}
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsOxAlpha"
        component={OxAlphaComp}
        durationInFrames={644} // 21.46s @ 30fps — Reel #14: The Mysterious Free 0x-alpha AI Model (Natural Crisp Mascot Ending)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsBinary"
        component={BinaryComp}
        durationInFrames={742} // 24.73s @ 30fps — Reel #13: Number Guessing to 1 Billion (Binary Search)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsTrash"
        component={TrashComp}
        durationInFrames={629} // 20.97s @ 30fps — Reel #12: POV: You Just Emptied Your Trash (file deletion / free-space marking)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsNoise"
        component={NoiseComp}
        durationInFrames={580} // 19.34s @ 30fps — Reel #11: Silence Is Made of Sound. (Active Noise Cancelling / inverse phase)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsGps"
        component={GpsComp}
        durationInFrames={674} // 22.47s @ 30fps — Reel #10: Your Phone Is Silent. They Still Find You. (GPS Trilateration)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsMcp"
        component={McpComp}
        durationInFrames={713} // 23.77s @ 30fps — Reel #9: MCP vs API: What's the Actual Difference? (Side-by-Side Split Architecture)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsTokenize"
        component={TokenizeComp}
        durationInFrames={665} // 22.17s @ 30fps — Reel #8: ChatGPT Has Never Seen a Single Letter of This Word (Tokenization & BPE)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsShazam"
        component={ShazamComp}
        durationInFrames={608} // 20.27s @ 30fps — Reel #7: It Heard 1 Second of Noise. And Named the Song. (Shazam Fingerprints)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsQrCode"
        component={QrCodeComp}
        durationInFrames={544} // 18.13s @ 30fps — Reel #6: You Destroyed This QR Code. It Still Scanned. (Reed-Solomon)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsRiddleDeadlock"
        component={RiddleDeadlockComp}
        durationInFrames={775} // 25.83s @ 30fps — Reel #5: The Deadly Riddle: The Dining Philosophers & The System Deadlock
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsChatGPT"
        component={ChatGPTExplainsComp}
        durationInFrames={768} // 25.61s @ 30fps — Transformer Network with Dynamic Karaoke Captions & Enhanced BGM
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsTwoSum"
        component={TwoSumComp}
        durationInFrames={734} // 24.47s @ 30fps — Reel #3: Two Sum (LeetCode #1) — The O(N^2) Trap vs The 1-Pass Hash Map
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsGoogle"
        component={GoogleExplainsComp}
        durationInFrames={592} // 19.72s @ 30fps — Reel #2: What Actually Happens When You Type google.com? (Fluid Multi-Stage Engine + Synthwave BGM + SFX)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsCaptcha"
        component={CaptchaExplainsComp}
        durationInFrames={683} // 22.79s @ 30fps — Debut Reel #1: How CAPTCHA Knows You're Human (Dual-voice Snappy AnaNeural Nemi + Chatterbox Narrator with SFX & UI)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV14"
        component={NemiExplainsV14Comp}
        durationInFrames={666} // 22.20s @ 30fps — V14 Full-Screen Vertical Composition & Dynamic BGM
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV13"
        component={NemiExplainsV13Comp}
        durationInFrames={666} // 22.20s @ 30fps — V13 Physical Bit World & Truncation (Preserved Baseline)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV12"
        component={NemiExplainsV12Comp}
        durationInFrames={666} // 22.20s @ 30fps — V12 0.1 + 0.2 Mystery (Floating Point Binary Bits)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV11"
        component={NemiExplainsV11Comp}
        durationInFrames={571} // 19.03s @ 30fps — V11 Google.com Journey (Continuous Cinematic World)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV10"
        component={NemiExplainsV10Comp}
        durationInFrames={586} // 19.53s @ 30fps — V10 Final Master Standard (10-Beat Story + Camera Journey)
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV9"
        component={NemiExplainsV9Comp}
        durationInFrames={677} // 22.57s @ 30fps — V9 Speaker Orchestration & Continuous Camera Choreography
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV8"
        component={NemiExplainsV8Comp}
        durationInFrames={712} // 23.73s @ 30fps — V8 coherent performance architecture & semantic choreography
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV7"
        component={NemiExplainsV7Comp}
        durationInFrames={662} // 22.08s @ 30fps — V7 approved production master micro-story
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV6"
        component={NemiExplainsV6Comp}
        durationInFrames={756} // 25.2s @ 30fps — V6 creative re-architecture with scene-driven story
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV5"
        component={NemiExplainsV5Comp}
        durationInFrames={775} // 25.85s @ 30fps synced with trimmed Chatterbox V5 narration
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV4"
        component={NemiExplainsV4Comp}
        durationInFrames={1032} // 34.42s @ 30fps synced with Chatterbox narration
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV3"
        component={NemiExplainsV3Comp}
        durationInFrames={1006}
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplainsV2"
        component={NemiExplainsV2Comp}
        durationInFrames={870}
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="NemiExplains"
        component={NemiExplainsComp}
        durationInFrames={750}
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="ThingsExplained"
        component={ThingsExplainedComp}
        durationInFrames={750}
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="ExecutionSimulator"
        component={ExecutionSimulatorComp}
        durationInFrames={360}
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />

      <Composition
        id="KineticAlgorithmDuel"
        component={KineticAlgorithmDuelComp}
        durationInFrames={360}
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />
      <Composition
        id="OutputPredictor"
        component={OutputPredictorComp}
        durationInFrames={360} // 12 seconds @ 30fps
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
        defaultProps={{
          id: "reel-01",
          seriesTitle: "WHAT DOES THIS PRINT?",
          difficulty: "MEDIUM" as const,
          language: "JavaScript" as const,
          hookQuestion: "Why Does [1, 2, 3] + [4, 5, 6] Equal This?",
          subHook: "90% of JS Developers Guess Wrong",
          codeLines: [
            { number: 1, code: "const a = [1, 2, 3];" },
            { number: 2, code: "const b = [4, 5, 6];" },
            { number: 3, code: "console.log(a + b);" },
          ],
          countdownSeconds: 5,
          options: [
            { id: "A", label: "[1,2,3,4,5,6]", isCorrect: false },
            { id: "B", label: "\"1,2,34,5,6\"", isCorrect: true },
            { id: "C", label: "TypeError", isCorrect: false },
            { id: "D", label: "NaN", isCorrect: false },
          ],
          correctOptionId: "B",
          explanationHeading: "Result: \"1,2,34,5,6\"",
          explanationPoints: [
            "The + operator converts both arrays into strings via .toString().",
            "[1,2,3].toString() -> '1,2,3'",
            "[4,5,6].toString() -> '4,5,6'",
            "'1,2,3' + '4,5,6' = '1,2,34,5,6' (concatenation).",
          ],
          complexityTime: "O(N)",
          complexitySpace: "O(N)",
          callToAction: "Save this JS interview trap 📌",
          brandTag: "@codemind.dev",
        }}
      />

      <Composition
        id="SpotTheBug"
        component={SpotTheBugComp}
        durationInFrames={360}
        fps={THEME.dimensions.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
        defaultProps={{
          id: "reel-02",
          seriesTitle: "SPOT THE BUG",
          difficulty: "SENIOR" as const,
          language: "Python",
          hookQuestion: "Can You Spot the Memory Trap?",
          buggyCodeLines: [
            { number: 1, code: "def append_to(element, target=[]):" },
            { number: 2, code: "    target.append(element)" },
            { number: 3, code: "    return target" },
            { number: 4, code: "print(append_to(1)) # [1]" },
            { number: 5, code: "print(append_to(2)) # ?" },
          ],
          fixedCodeLines: [
            { number: 1, code: "def append_to(element, target=None):" },
            { number: 2, code: "    if target is None: target = []" },
            { number: 3, code: "    target.append(element)" },
            { number: 4, code: "    return target" },
          ],
          buggyLineNumber: 1,
          countdownSeconds: 5,
          bugExplanation: "Default Mutable Argument Trap",
          whyItHappens: "Python evaluates default parameters ONCE at function definition time. The same list object is mutated across subsequent calls.",
          callToAction: "Did you catch it? Drop your answer below 👇",
          brandTag: "@codemind.dev",
        }}
      />
    </>
  );
};
