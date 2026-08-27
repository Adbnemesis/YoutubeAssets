import cv2
import numpy as np
import glob

# Load frames 0 to 90
frames = []
for i in range(0, 92, 4):
    img = cv2.imread(f'/Users/talus/.gemini/antigravity-ide/brain/f54ef39b-0f1c-425a-bc9c-cc0d23c35259/scratch/frame_{i}.jpg')
    if img is not None:
        # Resize to 200x300 for collage
        img = cv2.resize(img, (200, 300))
        # add text of frame number
        cv2.putText(img, str(i), (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        frames.append(img)

# Combine into a grid (6x4)
rows = []
for i in range(0, len(frames), 6):
    row = np.hstack(frames[i:min(i+6, len(frames))])
    rows.append(row)

# pad last row if necessary
if len(rows) > 0 and rows[-1].shape[1] != rows[0].shape[1]:
    pad_width = rows[0].shape[1] - rows[-1].shape[1]
    pad = np.zeros((rows[-1].shape[0], pad_width, 3), dtype=np.uint8)
    rows[-1] = np.hstack([rows[-1], pad])

collage = np.vstack(rows)
cv2.imwrite('/Users/talus/.gemini/antigravity-ide/brain/f54ef39b-0f1c-425a-bc9c-cc0d23c35259/scratch/collage_analysis.jpg', collage)
