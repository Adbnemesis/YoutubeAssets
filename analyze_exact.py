import cv2
import numpy as np
import glob

# Open ExactTimestampPrototype.mp4
cap = cv2.VideoCapture('/Users/talus/.gemini/antigravity-ide/brain/f54ef39b-0f1c-425a-bc9c-cc0d23c35259/ExactTimestampPrototype.mp4')
fps = cap.get(cv2.CAP_PROP_FPS)

frames = []
frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret or frame_idx > 300:
        break
    
    # Take 1 frame every 15 frames (0.5s)
    if frame_idx % 15 == 0:
        img = cv2.resize(frame, (200, 300))
        cv2.putText(img, f'{frame_idx}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        frames.append(img)
    
    frame_idx += 1

cap.release()

rows = []
for i in range(0, len(frames), 5):
    row = np.hstack(frames[i:min(i+5, len(frames))])
    rows.append(row)

if len(rows) > 0 and rows[-1].shape[1] != rows[0].shape[1]:
    pad_width = rows[0].shape[1] - rows[-1].shape[1]
    pad = np.zeros((rows[-1].shape[0], pad_width, 3), dtype=np.uint8)
    rows[-1] = np.hstack([rows[-1], pad])

collage = np.vstack(rows)
cv2.imwrite('/Users/talus/.gemini/antigravity-ide/brain/f54ef39b-0f1c-425a-bc9c-cc0d23c35259/scratch/exact_timestamp_collage.jpg', collage)
