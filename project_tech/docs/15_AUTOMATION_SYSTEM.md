# NEMI EXPLAINS — AUTOMATION ENGINE & RENDERING PIPELINE

## 1. End-to-End Autonomous Pipeline Architecture
The Nemi Explains production engine is completely automated:

```mermaid
graph LR
    Script[1. Narration Script & Beats] --> TTS[2. Chatterbox Neural TTS]
    TTS --> Trim[3. Librosa Silence Trim & LUFS Norm]
    Trim --> Mix[4. FFmpeg Sidechain Ducking BGM]
    Mix --> Cues[5. JSON Timing Cues]
    Cues --> Remotion[6. Remotion React Rendering]
    Remotion --> QA[7. Scene Diversity & Loudness QC]
    QA --> Output[8. Master 1080x1920 MP4]
```

---

## 2. Production CLI Commands
```bash
# 1. Generate Voice, BGM, and JSON Timing Cues
python3 scripts/generate_nemi_v7_audio.py

# 2. Run Automated Scene Diversity & Pacing QA
python3 scripts/scene_diversity_v7_check.py

# 3. Render Master Production MP4
npx remotion render src/index.ts NemiExplainsV7 out/NemiExplains_07.mp4

# 4. Measure Broadcast Loudness & Peak Headroom
ffmpeg -i out/NemiExplains_07.mp4 -af "loudnorm=print_format=json" -f null -
```
