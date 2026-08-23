import asyncio, subprocess, edge_tts
from pathlib import Path

BLOCKS = Path("/Users/talus/Downloads/youtube_ai/OpenMontage/project_tech/reels/trash_12/audio/blocks")
BLOCKS.mkdir(parents=True, exist_ok=True)
CLIPS = {
    "nc03_nemi_guess": "Wait... then where did my files go?!",
    "nc07_nemi_payoff": "So my trash bin was always a lie?",
}

async def gen(text, out):
    comm = edge_tts.Communicate(text, "en-US-AnaNeural", pitch="+12Hz", rate="+20%")
    await comm.save(str(out))

for eid, text in CLIPS.items():
    tmp = BLOCKS / f"{eid}_temp.mp3"
    asyncio.run(gen(text, tmp))
    wav = BLOCKS / f"{eid}.wav"
    subprocess.run(["ffmpeg", "-y", "-i", str(tmp), "-ar", "24000", "-ac", "1", str(wav)], check=True, capture_output=True)
    tmp.unlink()
    print("OK", eid)