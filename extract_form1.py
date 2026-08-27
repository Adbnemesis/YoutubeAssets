import cv2
import numpy as np

cap = cv2.VideoCapture('/Users/talus/Downloads/youtube_ai/OpenMontage/project_cool_edit/assets/video/cool_edit.mp4')
fps = cap.get(cv2.CAP_PROP_FPS)

frames = []
for sec in np.arange(1.3, 3.0, 0.05):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(sec * fps))
    ret, frame = cap.read()
    if ret:
        img = cv2.resize(frame, (200, 300))
        cv2.putText(img, f'{sec:.2f}s', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        frames.append(img)

cap.release()

rows = []
for i in range(0, len(frames), 7):
    row = np.hstack(frames[i:min(i+7, len(frames))])
    rows.append(row)

if len(rows) > 0 and rows[-1].shape[1] != rows[0].shape[1]:
    pad_width = rows[0].shape[1] - rows[-1].shape[1]
    pad = np.zeros((rows[-1].shape[0], pad_width, 3), dtype=np.uint8)
    rows[-1] = np.hstack([rows[-1], pad])

collage = np.vstack(rows)
cv2.imwrite('/Users/talus/.gemini/antigravity-ide/brain/f54ef39b-0f1c-425a-bc9c-cc0d23c35259/scratch/form1_directions.jpg', collage)
