#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

mkdir -p out

echo "🚀 Rendering Character Performance & Comedy Motion Test (8.5s)..."
npx remotion render src/index.ts CharacterPerformanceComedyTest out/character_performance_comedy_test.mp4 --gl=angle

echo "🚀 Rendering Three-Size Readability Test (8.5s)..."
npx remotion render src/index.ts ThreeSizeReadabilityTest out/three_size_readability_test.mp4 --gl=angle

echo "📸 Rendering Performance Key Beat Frames..."
# Beat 1: Idle (Frame 20)
npx remotion still src/index.ts CharacterPerformanceComedyTest out/perf_01_idle.png --frame=20 --gl=angle
# Beat 2: Suspicious (Frame 55)
npx remotion still src/index.ts CharacterPerformanceComedyTest out/perf_02_suspicious.png --frame=55 --gl=angle
# Beat 3: Confused "Huh?" (Frame 85)
npx remotion still src/index.ts CharacterPerformanceComedyTest out/perf_03_confused.png --frame=85 --gl=angle
# Beat 4: Realization "OH." (Frame 105)
npx remotion still src/index.ts CharacterPerformanceComedyTest out/perf_04_realization.png --frame=105 --gl=angle
# Beat 5: Panic Onset (Frame 135)
npx remotion still src/index.ts CharacterPerformanceComedyTest out/perf_05_panic.png --frame=135 --gl=angle
# Beat 6: Full Panic Peak (Frame 165)
npx remotion still src/index.ts CharacterPerformanceComedyTest out/perf_06_full_panic.png --frame=165 --gl=angle
# Beat 7: Complete Silence / Deadpan (Frame 195)
npx remotion still src/index.ts CharacterPerformanceComedyTest out/perf_07_deadpan_cut.png --frame=195 --gl=angle
# Beat 8: Final Understated Reaction (Frame 235)
npx remotion still src/index.ts CharacterPerformanceComedyTest out/perf_08_final_reaction.png --frame=235 --gl=angle

# Three-Size Comparison Frame
npx remotion still src/index.ts ThreeSizeReadabilityTest out/three_size_comparison.png --frame=165 --gl=angle

echo "✅ All comedy performance renders complete in $DIR/out/"
