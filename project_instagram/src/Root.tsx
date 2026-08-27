import { Composition } from "remotion";
import { CharacterDevTest } from "./compositions/CharacterDevTest";
import { CharacterPerformanceComedyTest } from "./compositions/CharacterPerformanceComedyTest";
import { ThreeSizeReadabilityTest } from "./compositions/ThreeSizeReadabilityTest";
import { Section1Neutral } from "./compositions/sections/Section1Neutral";
import { Section2Expressions } from "./compositions/sections/Section2Expressions";
import { Section3Poses } from "./compositions/sections/Section3Poses";
import { Section4ReactionStory } from "./compositions/sections/Section4ReactionStory";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* 8.5-Second Character Performance & Comedy Timing Master Test */}
            <Composition
                id="CharacterPerformanceComedyTest"
                component={CharacterPerformanceComedyTest}
                durationInFrames={255}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* 3-Tier Mobile Phone Readability Test (Large, Medium, Small) */}
            <Composition
                id="ThreeSizeReadabilityTest"
                component={ThreeSizeReadabilityTest}
                durationInFrames={255}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* Master Review Composition (All 4 Sections Combined) */}
            <Composition
                id="CharacterDevTest"
                component={CharacterDevTest}
                durationInFrames={600}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* Standalone Section Compositions for Granular Testing */}
            <Composition
                id="Section1Hero"
                component={Section1Neutral}
                durationInFrames={120}
                fps={30}
                width={1080}
                height={1920}
            />

            <Composition
                id="Section2Expressions"
                component={Section2Expressions}
                durationInFrames={150}
                fps={30}
                width={1080}
                height={1920}
            />

            <Composition
                id="Section3Poses"
                component={Section3Poses}
                durationInFrames={150}
                fps={30}
                width={1080}
                height={1920}
            />

            <Composition
                id="Section4ReactionStory"
                component={Section4ReactionStory}
                durationInFrames={180}
                fps={30}
                width={1080}
                height={1920}
            />
        </>
    );
};
