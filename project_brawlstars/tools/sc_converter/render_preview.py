#!/usr/bin/env python3
"""Render a composite preview showing Gale Attack with new reference-rendered frames."""
from pathlib import Path
from PIL import Image
import math

BASE = Path(__file__).resolve().parents[1] / "commonassets" / "brawler_effects"

def load_frame(brawler: str, part: str, frame_idx: int) -> Image.Image | None:
    p = BASE / brawler / part / f"frame_{frame_idx:04d}.png"
    if p.exists():
        return Image.open(p).convert("RGBA")
    return None

def lerp(a, b, t): return a + (b - a) * t
def ease_out(t): return 1 - (1 - t) ** 2

# Use a larger canvas for the composited scene
W, H = 1080, 720
canvas = Image.new("RGBA", (W, H), (60, 50, 35, 255))  # Dark game ground

# Scale factor: the extraction is at 4x. For our 1080px canvas, use 0.35 to show full attack
SC = 0.35

# Attack origin and target
cx, cy = 200, 360
targetX = 900

FRAME = 18  # Mid-flight

# 1. Muzzle flash
print("Compositing muzzle flash...")
muzzle = load_frame("gale", "gale_006_atk_muzzle_01", min(FRAME, 29))
if muzzle:
    s = 1.8 * SC
    mw, mh = int(muzzle.width * s), int(muzzle.height * s)
    mr = muzzle.resize((mw, mh), Image.LANCZOS)
    canvas.alpha_composite(mr, (int(cx + 15 - mw/2), int(cy - mh/2)))
    print(f"  muzzle: {mw}x{mh} at ({cx+15},{cy})")

# 2. Six projectile shards
print("Compositing 6 shards...")
spread_deg = 30
half = spread_deg / 2
for i in range(6):
    af = i / 5
    deg = -half + af * spread_deg
    rad = deg * math.pi / 180
    dist = targetX - cx

    stagger = int(i * 0.8)
    t = FRAME - (4 + stagger)
    if t < 0:
        continue

    prog = min(1.0, t / 28.0)
    e = ease_out(prog)
    x = lerp(cx + 30, cx + math.cos(rad) * dist, e)
    y = lerp(cy + math.sin(rad) * 15, cy + math.sin(rad) * dist * 0.5, e)

    fidx = min(int(t), 5)
    proj = load_frame("gale", "gale_006_atk_projectile", fidx)
    if proj:
        s = 1.2 * SC
        pw, ph = int(proj.width * s), int(proj.height * s)
        pr = proj.resize((pw, ph), Image.LANCZOS)
        pr_rot = pr.rotate(-deg, expand=True, resample=Image.BICUBIC)
        px = int(x - pr_rot.width / 2)
        py = int(y - pr_rot.height / 2)
        # Clamp to canvas
        px = max(0, min(px, W - pr_rot.width))
        py = max(0, min(py, H - pr_rot.height))
        canvas.alpha_composite(pr_rot, (px, py))
        print(f"  shard {i}: {pw}x{ph} at ({int(x)},{int(y)}) deg={deg:.1f}")

# 3. Trail twinkles
print("Compositing trail effects...")
for i in range(0, 6, 2):
    af = i / 5
    deg = -half + af * spread_deg
    rad = deg * math.pi / 180
    dist = targetX - cx
    stagger = int(i * 0.8)
    t = FRAME - (8 + stagger)
    if t < 0:
        continue
    prog = min(1.0, t / 24.0)
    e = ease_out(prog)
    x = lerp(cx + 60, cx + math.cos(rad) * dist - 40, e)
    y = lerp(cy + math.sin(rad) * 20, cy + math.sin(rad) * dist * 0.5, e)
    tw = load_frame("gale", "gale_006_atk_trail_twinkle", int(t) % 60)
    if tw:
        s = 0.5 * SC
        tww, twh = int(tw.width * s), int(tw.height * s)
        twr = tw.resize((tww, twh), Image.LANCZOS)
        px = max(0, min(int(x - tww/2), W - tww))
        py = max(0, min(int(y - twh/2), H - twh))
        canvas.alpha_composite(twr, (px, py))

out = Path(__file__).resolve().parent / "preview_composite.png"
canvas.save(str(out))
print(f"\n✓ Preview saved to {out}")
print(f"  Canvas: {W}x{H}, scale factor: {SC}")
