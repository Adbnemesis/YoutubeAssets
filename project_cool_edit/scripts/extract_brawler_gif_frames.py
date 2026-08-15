import os
from PIL import Image

def extract_all_gif_frames():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.abspath(os.path.join(script_dir, ".."))
    
    gif_dir = os.path.join(project_dir, "assets", "brawler_gifs")
    out_base_dir = os.path.join(project_dir, "assets", "brawler_gif_frames")
    
    os.makedirs(out_base_dir, exist_ok=True)
    
    gif_files = sorted([f for f in os.listdir(gif_dir) if f.endswith("_win.gif")])
    print(f"Found {len(gif_files)} GIF files in {gif_dir}:\n")
    
    for f in gif_files:
        brawler_name = f.replace("_win.gif", "")
        gif_path = os.path.join(gif_dir, f)
        b_out_dir = os.path.join(out_base_dir, brawler_name)
        os.makedirs(b_out_dir, exist_ok=True)
        
        img = Image.open(gif_path)
        frame_idx = 1
        
        try:
            while True:
                frame_img = img.convert("RGBA")
                out_filename = f"{frame_idx:04d}.png"
                out_path = os.path.join(b_out_dir, out_filename)
                frame_img.save(out_path, "PNG")
                
                frame_idx += 1
                img.seek(img.tell() + 1)
        except EOFError:
            pass
            
        total = frame_idx - 1
        print(f"  ✓ {brawler_name:10s} -> {total:3d} frame PNGs saved to assets/brawler_gif_frames/{brawler_name}/")
        
    print("\nAll GIF frames extracted successfully!")

if __name__ == "__main__":
    extract_all_gif_frames()
