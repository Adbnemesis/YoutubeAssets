#!/usr/bin/env python3
"""Slice ONLY the newly added brawler sheets (bo, colt, nita, shelly)
that don't yet have sliced panels under assets/images/.
Reuses the exact slicing logic from slice_brawler_sheets.py but targets
just the missing brawlers so already-sliced ones are left untouched.
"""
import os
from slice_brawler_sheets import clean_slice_sheet

NEW_BRAWLERS = ["bo", "colt", "nita", "shelly"]

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.abspath(os.path.join(script_dir, ".."))
    sheet_dir = os.path.join(project_dir, "assets", "brawler_sheet")
    output_base_dir = os.path.join(project_dir, "assets", "images")

    if not os.path.exists(sheet_dir):
        print(f"Sheet directory not found: {sheet_dir}")
        return

    print("Slicing new brawler sheets (bo, colt, nita, shelly)...\n")
    for brawler in NEW_BRAWLERS:
        sheet_file = f"{brawler}_sheet.png"
        sheet_path = os.path.join(sheet_dir, sheet_file)
        if not os.path.exists(sheet_path):
            print(f"  ! missing sheet, skipping: {sheet_file}")
            continue
        brawler_out_dir = os.path.join(output_base_dir, brawler)
        clean_slice_sheet(sheet_path, brawler_out_dir, brawler)

    print("\nDone slicing new brawler sheets.")

if __name__ == "__main__":
    main()