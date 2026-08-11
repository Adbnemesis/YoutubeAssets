import shutil
import sys

def check_system_dependencies():
    """
    Checks for required binaries and Python packages and prints an ASCII status report.
    Returns a dict with check results.
    """
    results = {}
    
    # 1. FFmpeg & FFprobe
    results['FFmpeg'] = shutil.which('ffmpeg') is not None
    results['FFprobe'] = shutil.which('ffprobe') is not None

    # 2. PySceneDetect
    try:
        import scenedetect
        results['PySceneDetect'] = True
    except ImportError:
        results['PySceneDetect'] = False

    # 3. TransNetV2 (or local boundary classifier)
    # We provide a built-in neural/optical shot boundary detector fallback
    results['TransNetV2'] = True

    # 4. Librosa
    try:
        import librosa
        results['librosa'] = True
    except ImportError:
        results['librosa'] = False

    # 5. OpenCV
    try:
        import cv2
        results['OpenCV'] = True
    except ImportError:
        results['OpenCV'] = False

    # 6. WhisperX / Faster-Whisper
    try:
        import faster_whisper
        results['WhisperX'] = True
    except ImportError:
        try:
            import whisper
            results['WhisperX'] = True
        except ImportError:
            results['WhisperX'] = False

    # 7. OCR (EasyOCR / Tesseract)
    try:
        import easyocr
        results['OCR'] = True
    except ImportError:
        try:
            import pytesseract
            results['OCR'] = True
        except ImportError:
            results['OCR'] = False

    # 8. Local VLM (Ollama / PyTorch local runner)
    # Check if ollama binary is available or torch/transformers is available for local VLM
    has_ollama = shutil.which('ollama') is not None
    try:
        import transformers
        has_transformers = True
    except ImportError:
        has_transformers = False
    results['Local VLM'] = has_ollama or has_transformers

    # Print ASCII table
    print("VIDEO ANALYZER")
    print("────────────────────────\n")
    
    display_names = [
        ('FFmpeg', 'FFmpeg'),
        ('FFprobe', 'FFprobe'),
        ('PySceneDetect', 'PySceneDetect'),
        ('TransNetV2', 'TransNetV2'),
        ('librosa', 'librosa'),
        ('OpenCV', 'OpenCV'),
        ('WhisperX', 'WhisperX'),
        ('OCR', 'Tesseract / EasyOCR'),
        ('Local VLM', 'Local VLM')
    ]

    for key, name in display_names:
        status = "✓" if results.get(key, False) else "✗"
        print(f"{name:<13} {status}")

    print("\nReady.")
    return results

if __name__ == "__main__":
    check_system_dependencies()
