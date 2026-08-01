import os
import soundfile as sf
import torch

# Monkey patch PerthImplicitWatermarker to prevent NoneType callable error
import chatterbox.tts
class DummyWatermarker:
    def apply_watermark(self, wav, *args, **kwargs):
        return wav
chatterbox.tts.perth = type('perth', (), {'PerthImplicitWatermarker': DummyWatermarker})

from chatterbox import ChatterboxTTS

def run_resemble_chatterbox():
    print("🤖 Loading Resemble AI Chatterbox TTS Neural Model...")
    model = ChatterboxTTS.from_pretrained(device="cpu")
    print("✅ ChatterboxTTS model loaded successfully!")

    scripts = {
        'Shelly': ("Hi I'm Shelly, my ability is Super Shell shotgun blast!", "project_brawlstars/ref_audio/shelly_ref.wav"),
        'Edgar': ("Hi I'm Edgar, my ability is Scarf lifesteal vault jump!", "project_brawlstars/ref_audio/edgar_ref.wav"),
        'Kenji': ("Hi I'm Kenji, my ability is Hosomaki X-slice!", "project_brawlstars/ref_audio/kenji_ref.wav"),
        'Melodie': ("Hi I'm Melodie, my ability is K-pop note orbit!", "project_brawlstars/ref_audio/melodie_ref.wav"),
        'Frank': ("Hi I'm Frank, my ability is Tombstone hammer smash!", "project_brawlstars/ref_audio/frank_ref.wav")
    }

    out_dir = "project_brawlstars/resemble_chatterbox_voices"
    os.makedirs(out_dir, exist_ok=True)

    for brawler, (text, ref_path) in scripts.items():
        out_wav = os.path.join(out_dir, f"{brawler.lower()}_resemble_chatterbox.wav")
        out_mp3 = os.path.join(out_dir, f"{brawler.lower()}_resemble_chatterbox.mp3")

        print(f"\n🗣️ [Resemble AI Chatterbox] Cloning [{brawler}]...")
        print(f"   Ref Audio: {ref_path}")
        print(f"   Script: \"{text}\"")

        try:
            wav = model.generate(text=text, audio_prompt_path=ref_path)
            sf.write(out_wav, wav[0].cpu().numpy(), model.sr)
            os.system(f"ffmpeg -y -i {out_wav} {out_mp3} > /dev/null 2>&1")
            print(f"🎉 Successfully generated cloned voice for {brawler} -> {out_mp3}")
        except Exception as e:
            print(f"❌ Error cloning {brawler}: {e}")

if __name__ == "__main__":
    run_resemble_chatterbox()
