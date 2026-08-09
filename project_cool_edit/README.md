# Brawl Stars Phonk Edit (project_cool_edit)

This project contains the complete, self-contained Remotion setup for generating dynamic "Brawl Stars Phonk" edit videos. It has been fully isolated from the parent `remotion-composer` workspace so it can be cloned, installed, and run entirely on its own.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
- `npm` (comes with Node.js)

### Installation
To set up the project on a new device, simply clone the repository, navigate to this directory, and install the dependencies:

```bash
cd project_cool_edit
npm install
```

### Running the Studio (Preview)
To open the interactive Remotion Studio where you can preview the animation, tweak timings, and view changes in real-time, run:

```bash
npm start
```
This will launch a local server (typically at `http://localhost:3000`).

### Rendering the Video
To render the final `PhonkPrototype.mp4` video directly to the `out/` folder, run:

```bash
npm run build
```

## 📂 Project Structure

- **`src/`**: Contains all React and Remotion code.
  - `index.tsx`: The main entrypoint that registers the root composition.
  - `Root.tsx`: Defines the `PhonkPrototype` composition and its props (including exact sync timings, colors, and cuts).
  - `templates/`: Contains the modular components (`MasterPhonkTemplate`, `DynamicGridReveal`, `DynamicPhonkClip`, etc.) that make up the video.
- **`public/`**: Contains static assets like `extracted_audio.wav` that are bundled directly into the video.
- **`assets/`**: Contains source video references and working assets (like the original `cool_edit.mp4` reference video).
- **`docs/`**: Documentation and analysis notes (e.g., `brawl_stars_edit_blueprint.md`).
- **`out/`**: The destination folder where the rendered `.mp4` files are saved.

## 🛠️ Modifying the Edit
If you want to change the timing of the drops, the colors, or the slide offset gaps, you can do so directly in `src/Root.tsx` inside the `defaultProps` passed to the `Composition`.

The slide-in animations (Left, Top, Bottom, Right) for the 4-panel grid are handled inside `src/templates/DynamicGridReveal.tsx`.
