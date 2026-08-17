# NEMI EXPLAINS — AUDIO SYSTEM & BROADCAST STANDARDS

## 1. Loudness & Mastering Standards
Nemi Explains audio is calibrated specifically for mobile phone speakers and headphones:

| Metric | Target Standard | Permitted Tolerance | Rationale |
|:---|:---|:---|:---|
| **Master Integrated Loudness ($I$)** | `-14.0 LUFS` | $\pm 0.5$ LUFS | Standard for Instagram Reels, YouTube Shorts, TikTok. |
| **Voice Track Normalization** | `-16.0 LUFS` | $\pm 0.5$ LUFS | Vocal clarity sitting forward in the mix. |
| **True Peak ($TP$)** | `-1.5 dBTP` | $\le -1.5$ dBTP | Prevents inter-sample clipping and compression distortion on mobile codecs. |
| **Loudness Range ($LRA$)** | `1.5 – 3.5 dB` | Controlled | Consistent, fatigue-free listening across noisy environments. |

---

## 2. Dynamic BGM Mixing & Sidechain Compression
* **Music Library:** Synthwave / Cyberpunk orchestral ambient (e.g. *Synthwave Goose - Blade Runner 2049*, *Joel Sunny Luminary*).
* **Pre-Gain:** Volume `0.24` (audible and rich during music-only moments).
* **Sidechain Compressor Filter (FFmpeg):**
  ```bash
  sidechaincompress=threshold=0.06:ratio=10:attack=15:release=300
  ```
  * **Attack (15ms):** Instantly dips music volume the moment speech starts.
  * **Release (300ms):** Smoothly raises music volume during pauses, reveals, and payoffs.
  * **Ratio (10:1):** Decisive vocal foregrounding.

---

## 3. Sound Effects (SFX) Taxonomy
* **Sub Impact:** Bass drop on Beat 1 (Allocation surge) and Beat 5 (Freeze reveal).
* **Laser Scanline / Sweep:** Luminous digital hum during graph traversal.
* **Pop / Vaporize:** High-frequency snappy pop when garbage nodes delete.
* **Success Chime:** Pleasant harmonic chime on Beat 10 payoff.
