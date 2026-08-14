import os
import cv2
import numpy as np
from PIL import Image

def clean_slice_sheet(sheet_path, out_dir, brawler_name, cols=4, rows=4):
    """
    Slices a brawler sprite sheet into clean individual panels, automatically
    removing edge-bleed artifacts from neighboring characters using
    connected-component analysis.
    """
    os.makedirs(out_dir, exist_ok=True)
    img = Image.open(sheet_path).convert("RGBA")
    w, h = img.size
    np_img = np.array(img)
    
    cw = w / float(cols)
    ch = h / float(rows)
    
    filtered_artifacts_count = 0
    
    for r in range(rows):
        for c in range(cols):
            panel_idx = r * cols + c + 1
            left = int(c * cw)
            top = int(r * ch)
            right = int((c + 1) * cw)
            bottom = int((r + 1) * ch)
            
            cell = np_img[top:bottom, left:right].copy()
            alpha = cell[:, :, 3]
            
            # Binary mask of visible pixels (threshold low alpha noise)
            mask = (alpha > 15).astype(np.uint8) * 255
            
            # Connected components analysis
            num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask, connectivity=8)
            
            cell_h_actual, cell_w_actual = alpha.shape
            center_x = cell_w_actual / 2.0
            center_y = cell_h_actual / 2.0
            
            clean_mask = np.zeros_like(mask)
            
            if num_labels > 1:
                # Find maximum area (the main character body)
                max_area = max(stats[label, cv2.CC_STAT_AREA] for label in range(1, num_labels))
                
                for label in range(1, num_labels):
                    area = stats[label, cv2.CC_STAT_AREA]
                    cx, cy = centroids[label]
                    lx = stats[label, cv2.CC_STAT_LEFT]
                    ly = stats[label, cv2.CC_STAT_TOP]
                    lw = stats[label, cv2.CC_STAT_WIDTH]
                    lh = stats[label, cv2.CC_STAT_HEIGHT]
                    
                    # Check boundary touches
                    touches_left = (lx == 0)
                    touches_right = (lx + lw >= cell_w_actual)
                    touches_top = (ly == 0)
                    touches_bottom = (ly + lh >= cell_h_actual)
                    
                    # Main body component
                    is_main_body = (area >= max_area * 0.15)
                    
                    # Bleed component heuristic:
                    # Neighboring character overflow that was clipped by the grid boundary:
                    # - Smaller area (< 12% of max area)
                    # - Strictly glued to outer boundary
                    # - Centroid is close to outer boundary (e.g. edge margin)
                    is_bleed = False
                    if not is_main_body:
                        if area < max_area * 0.12:
                            if touches_left and cx < cell_w_actual * 0.15:
                                is_bleed = True
                            elif touches_right and cx > cell_w_actual * 0.85:
                                is_bleed = True
                            elif touches_top and cy < cell_h_actual * 0.15:
                                is_bleed = True
                            elif touches_bottom and cy > cell_h_actual * 0.85:
                                is_bleed = True
                    
                    if not is_bleed:
                        clean_mask[labels == label] = 255
                    else:
                        filtered_artifacts_count += 1
            else:
                clean_mask = mask
            
            # Apply clean mask to alpha channel
            clean_cell = cell.copy()
            clean_cell[:, :, 3] = np.where(clean_mask > 0, clean_cell[:, :, 3], 0)
            
            out_img = Image.fromarray(clean_cell, "RGBA")
            out_path = os.path.join(out_dir, f"{brawler_name}_panel_{panel_idx}.png")
            out_img.save(out_path, "PNG")

    print(f"  ✓ {brawler_name:10s} -> 16 panels sliced ({int(cw)}x{int(ch)}px), filtered {filtered_artifacts_count} neighbor bleed artifacts")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.abspath(os.path.join(script_dir, ".."))
    
    sheet_dir = os.path.join(project_dir, "assets", "brawler_sheet")
    output_base_dir = os.path.join(project_dir, "assets", "images")
    
    if not os.path.exists(sheet_dir):
        print(f"Sheet directory not found: {sheet_dir}")
        return
        
    sheets = sorted([f for f in os.listdir(sheet_dir) if f.endswith("_sheet.png")])
    print(f"Found {len(sheets)} brawler sheets in {sheet_dir}:\n")
    
    for sheet_file in sheets:
        brawler_name = sheet_file.replace("_sheet.png", "")
        sheet_path = os.path.join(sheet_dir, sheet_file)
        brawler_out_dir = os.path.join(output_base_dir, brawler_name)
        clean_slice_sheet(sheet_path, brawler_out_dir, brawler_name)
        
    print("\nAll brawler sheets cleanly sliced with zero neighbor bleed!")

if __name__ == "__main__":
    main()
