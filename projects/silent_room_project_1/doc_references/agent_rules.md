# Antigravity Agent Rules for Project 1

To prevent hallucinations, inconsistencies, and errors, all agents executing tasks in this workspace must follow these rules strictly:

1. **Check references first:** Before calling `generate_image`, `replace_file_content`, or running scripts, read the reference files in the `doc_references/` folder.
2. **Follow Storyboard prompts exactly:** When generating images, use the exact prompt string and name the output file matching the exact timestamp specified in `doc_references/storyboard_reference.md` (e.g. `[01:24]_image_1.png`).
3. **Never delete or skip prompts without user permission.**
4. **Follow the timeline structure:** When compiling and editing the video, verify that `project_1_props.json` aligns precisely with the timings and segment mapping in `doc_references/video_props_reference.md`.
