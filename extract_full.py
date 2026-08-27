import cv2

cap = cv2.VideoCapture('/Users/talus/Downloads/youtube_ai/OpenMontage/project_cool_edit/assets/video/cool_edit.mp4')
fps = cap.get(cv2.CAP_PROP_FPS)
print(f"FPS: {fps}")

# We want to check around 1.0s to 2.5s to see if there are 4 panels.
for idx in [30, 45, 60, 75]:
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(f'/Users/talus/.gemini/antigravity-ide/brain/f54ef39b-0f1c-425a-bc9c-cc0d23c35259/scratch/full_frame_{idx}.jpg', frame)

cap.release()
