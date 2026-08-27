import cv2
import numpy as np

cap = cv2.VideoCapture('/Users/talus/Downloads/youtube_ai/OpenMontage/project_cool_edit/assets/video/cool_edit.mp4')
fps = cap.get(cv2.CAP_PROP_FPS)

# We know form 1 is in the first 3 seconds
frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret or frame_idx > 3 * fps:
        break
    
    # Save frames to look at manually to determine direction and exact frame index
    if frame_idx % 2 == 0:
        cv2.imwrite(f'/Users/talus/.gemini/antigravity-ide/brain/f54ef39b-0f1c-425a-bc9c-cc0d23c35259/scratch/frame_{frame_idx}.jpg', frame)
    
    frame_idx += 1

cap.release()
