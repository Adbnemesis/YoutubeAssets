import os
import subprocess
import random

VIDEO_PATH = "project_cool_edit/assets/video/kenji_gameplay.mp4"
OUTPUT_DIR = "project_cool_edit/assets/clips"
DURATION = 812
NUM_SAMPLES = 50
NUM_KEEP = 20

# Clean existing clips
for f in os.listdir(OUTPUT_DIR):
    if f.endswith(".mp4"):
        os.remove(os.path.join(OUTPUT_DIR, f))

# Generate non-overlapping random start times
start_times = sorted(random.sample(range(60, int(DURATION) - 60, 5), NUM_SAMPLES))

clip_sizes = []

for i, start in enumerate(start_times):
    out_file = os.path.join(OUTPUT_DIR, f"temp_clip_{i:02d}.mp4")
    # Extract 1.5 second clip
    cmd = f'ffmpeg -y -ss {start} -i {VIDEO_PATH} -t 1.5 -c:v libx264 -preset ultrafast -crf 18 -an {out_file} 2>/dev/null'
    subprocess.run(cmd, shell=True)
    
    if os.path.exists(out_file):
        size = os.path.getsize(out_file)
        clip_sizes.append((size, out_file))

# Sort by size (largest = most motion/complexity)
clip_sizes.sort(reverse=True, key=lambda x: x[0])

# Keep top NUM_KEEP
print(f"Keeping top {NUM_KEEP} clips based on bitrate/motion proxy...")
for i, (size, filepath) in enumerate(clip_sizes[:NUM_KEEP]):
    new_name = os.path.join(OUTPUT_DIR, f"clip_{i+1:02d}.mp4")
    os.rename(filepath, new_name)
    print(f"Kept clip {i+1} (Size: {size/1024:.1f} KB)")

# Remove the rest
for size, filepath in clip_sizes[NUM_KEEP:]:
    if os.path.exists(filepath):
        os.remove(filepath)

print("High action clips extracted successfully!")
