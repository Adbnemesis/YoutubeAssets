import json
from pathlib import Path
import sys

# Ensure OpenMontage root is in python path
ROOT = Path("/Users/talus/Downloads/youtube_ai/OpenMontage")
sys.path.append(str(ROOT))

from tools.audio.piper_tts import PiperTTS

def main():
    script_path = ROOT / "projects" / "fifa_90th_minute_project_8" / "script_fifa_90th_minute.txt"
    output_path = ROOT / "projects" / "fifa_90th_minute_project_8" / "voiceover.wav"
    
    script_text = script_path.read_text(encoding="utf-8")
    
    # Load voice profile parameters
    profile_path = ROOT / "projects" / "common_assets" / "voice_profile.json"
    with open(profile_path, "r", encoding="utf-8") as f:
        profile = json.load(f)
        
    print("Generating audio using Piper TTS...")
    print(f"Model: {profile['voice_model']}")
    print(f"Output: {output_path}")
    
    tts = PiperTTS()
    result = tts.execute({
        "text": script_text,
        "model": profile["voice_model"],
        "length_scale": profile["length_scale"],
        "sentence_silence": profile["sentence_silence"],
        "noise_scale": profile["noise_scale"],
        "noise_w": profile["noise_w"],
        "output_path": str(output_path)
    })
    
    print("Success:", result.success)
    if not result.success:
        print("Error:", result.error)
        sys.exit(1)
    else:
        print(f"Audio generated successfully at {output_path} (Duration: {result.duration_seconds}s)")

if __name__ == "__main__":
    main()
