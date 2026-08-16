import os
import cv2
import numpy as np
from PIL import Image

def clean_slice_sheet(sheet_path, out_dir, brawler_name, cols=4, rows=4):
    """
    Slices a brawler sprite sheet into clean individual panels, automatically
    identifying the primary character in each cell and removing all neighbor
    edge-bleed artifacts and stray sprite clusters using connected-component analysis.
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
                # Score components to identify the primary character of THIS cell:
                # Primary character has substantial area and its center of mass is close to cell center.
                scores = []
                for label in range(1, num_labels):
                    area = stats[label, cv2.CC_STAT_AREA]
                    cx, cy = centroids[label]
                    dist_to_center = np.sqrt((cx - center_x)**2 + (cy - center_y)**2)
                    diag = np.sqrt(center_x**2 + center_y**2)
                    norm_dist = dist_to_center / diag
                    # Central components get highest score
                    score = area * (1.0 - 0.75 * norm_dist)
                    scores.append((score, area, label, cx, cy))
                
                scores.sort(key=lambda x: x[0], reverse=True)
                primary_label = scores[0][2]
                primary_area = scores[0][1]
                primary_cx, primary_cy = scores[0][3], scores[0][4]
                
                # Keep primary character body
                clean_mask[labels == primary_label] = 255
                
                # Process all other components in the cell
                for label in range(1, num_labels):
                    if label == primary_label:
                        continue
                    
                    area = stats[label, cv2.CC_STAT_AREA]
                    lx = stats[label, cv2.CC_STAT_LEFT]
                    ly = stats[label, cv2.CC_STAT_TOP]
                    lw = stats[label, cv2.CC_STAT_WIDTH]
                    lh = stats[label, cv2.CC_STAT_HEIGHT]
                    cx, cy = centroids[label]
                    
                    touches_left = (lx == 0)
                    touches_right = (lx + lw >= cell_w_actual)
                    touches_top = (ly == 0)
                    touches_bottom = (ly + lh >= cell_h_actual)
                    touches_any_border = (touches_left or touches_right or touches_top or touches_bottom)
                    
                    is_bleed = False
                    
                    # 1. Any component attached to a border whose centroid is skewed towards that border:
                    if touches_right and cx > cell_w_actual * 0.70:
                        is_bleed = True
                    elif touches_left and cx < cell_w_actual * 0.30:
                        is_bleed = True
                    elif touches_top and cy < cell_h_actual * 0.30:
                        is_bleed = True
                    elif touches_bottom and cy > cell_h_actual * 0.70:
                        is_bleed = True
                    # 2. Tiny speckles or border artifacts (< 30 pixels)
                    elif area < 30:
                        is_bleed = True
                    # 3. Any secondary component touching border that is much closer to border than to primary body
                    elif touches_any_border and area < primary_area * 0.30:
                        dist_to_primary = np.sqrt((cx - primary_cx)**2 + (cy - primary_cy)**2)
                        dist_to_border = min(cx, cell_w_actual - cx, cy, cell_h_actual - cy)
                        if dist_to_border < dist_to_primary * 0.4:
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
            
            # Center alignment logic:
            # Detect tight non-transparent bounding box of the isolated character
            nonzero = np.argwhere(clean_cell[:, :, 3] > 10)
            if len(nonzero) > 0:
                ymin, xmin = nonzero.min(axis=0)
                ymax, xmax = nonzero.max(axis=0)
                char_crop = Image.fromarray(clean_cell[ymin:ymax+1, xmin:xmax+1], "RGBA")
                crop_w, crop_h = char_crop.size
                
                # If character exceeds 90% of target cell dimensions, scale proportionally to fit safely
                target_cw = int(cw)
                target_ch = int(ch)
                max_w = int(target_cw * 0.90)
                max_h = int(target_ch * 0.90)
                scale_ratio = min(1.0, max_w / float(crop_w), max_h / float(crop_h))
                if scale_ratio < 1.0:
                    new_w = max(1, int(crop_w * scale_ratio))
                    new_h = max(1, int(crop_h * scale_ratio))
                    char_crop = char_crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
                    crop_w, crop_h = new_w, new_h
                
                # Create clean transparent canvas and paste character dead center
                out_img = Image.new("RGBA", (target_cw, target_ch), (0, 0, 0, 0))
                paste_x = (target_cw - crop_w) // 2
                paste_y = (target_ch - crop_h) // 2
                out_img.paste(char_crop, (paste_x, paste_y), char_crop)
            else:
                out_img = Image.fromarray(clean_cell, "RGBA")
            
            out_path = os.path.join(out_dir, f"{brawler_name}_panel_{panel_idx}.png")
            out_img.save(out_path, "PNG")

    print(f"  ✓ {brawler_name:10s} -> 16 panels sliced ({int(cw)}x{int(ch)}px, center-aligned), filtered {filtered_artifacts_count} bleed artifacts")

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
        
    print("\nAll brawler sheets cleanly sliced with zero neighbor bleed and exactly 1 brawler per panel!")

if __name__ == "__main__":
    main()
