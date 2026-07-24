import argparse
import re
from pathlib import Path

def parse_transcript_timestamps(transcript_path):
    if not transcript_path.exists():
        raise FileNotFoundError(f"Transcript not found at {transcript_path}")
        
    lines = transcript_path.read_text(encoding="utf-8").splitlines()
    timestamps = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        m = re.match(r'\[(\d{2}):(\d{2})\]', line)
        if m:
            timestamps.append(f"{m.group(1)}-{m.group(2)}")
    return timestamps

def main():
    parser = argparse.ArgumentParser(description="Shift image filenames when an image generation gap causes a timestamp mismatch.")
    parser.add_argument("--project_dir", required=True, help="Path to the project directory (e.g., projects/qwen_vs_kimi_project_12)")
    parser.add_argument("--transcript_name", help="Name of the transcript file (default: auto-detect project_n_transcript)")
    parser.add_argument("--gap_time", required=True, help="The timestamp string that was skipped in generation (e.g., 02-11)")
    parser.add_argument("--end_time", help="Optional. The last timestamp string that is out of sync / needs to be shifted (e.g., 02-27)")
    parser.add_argument("--dry_run", action="store_true", help="Print the rename actions without executing them")
    
    args = parser.parse_args()
    
    project_dir = Path(args.project_dir)
    if not project_dir.exists():
        print(f"Error: Project directory {project_dir} does not exist.")
        return
        
    # Find transcript
    transcript_path = None
    if args.transcript_name:
        transcript_path = project_dir / args.transcript_name
    else:
        # Auto-detect transcript file (starts with project_ and ends with _transcript)
        for p in project_dir.iterdir():
            if p.is_file() and p.name.endswith("_transcript"):
                transcript_path = p
                break
                
    if not transcript_path or not transcript_path.exists():
        print(f"Error: Could not find transcript file in {project_dir}. Please specify --transcript_name.")
        return
        
    print(f"Using transcript: {transcript_path.name}")
    
    # Parse timestamps
    try:
        timestamps = parse_transcript_timestamps(transcript_path)
    except Exception as e:
        print(f"Error parsing transcript: {e}")
        return
        
    # Normalize gap_time (replace colon with hyphen if user typed e.g. 02:11)
    gap_time = args.gap_time.replace(":", "-")
    
    if gap_time not in timestamps:
        print(f"Error: Gap timestamp '{gap_time}' is not in the transcript list of timestamps:")
        print(timestamps)
        return
        
    gap_idx = timestamps.index(gap_time)
    print(f"Gap detected at index {gap_idx} (timestamp: [{gap_time}])")
    
    # Handle end_time
    end_idx = len(timestamps) - 2 # Default to second to last timestamp
    if args.end_time:
        end_time = args.end_time.replace(":", "-")
        if end_time not in timestamps:
            print(f"Error: End timestamp '{end_time}' is not in the transcript list of timestamps.")
            return
        end_idx = timestamps.index(end_time)
        print(f"Shift boundary defined up to index {end_idx} (timestamp: [{end_time}])")
        if end_idx < gap_idx:
            print("Error: end_time must be after or equal to gap_time.")
            return

    images_dir = project_dir / "images"
    if not images_dir.exists():
        print(f"Error: Images directory {images_dir} does not exist.")
        return
        
    rename_ops = []
    
    for i in range(gap_idx, end_idx + 1):
        target_time = timestamps[i]      # what it should be
        current_time = timestamps[i+1]   # what it currently is named
        
        # Find the file that starts with [current_time]
        matching_files = [f for f in images_dir.iterdir() if f.is_file() and f.name.startswith(f"[{current_time}]_")]
        if not matching_files:
            print(f"Warning: No image file found starting with [{current_time}]")
            continue
            
        if len(matching_files) > 1:
            print(f"Error: Multiple files found starting with [{current_time}]: {[f.name for f in matching_files]}")
            return
            
        old_file = matching_files[0]
        
        # Determine new filename
        new_name = old_file.name.replace(f"[{current_time}]", f"[{target_time}]")
        new_file = images_dir / new_name
        
        rename_ops.append((old_file, new_file))
        
    if not rename_ops:
        print("No files to rename.")
        return
        
    print("\nProposed rename operations:")
    for old_f, new_f in rename_ops:
        print(f"  {old_f.name}  ==>  {new_f.name}")
        
    if args.dry_run:
        print("\nDry run completed. No files were renamed.")
        return
        
    print("\nExecuting rename operations...")
    # Rename in order (or reverse order if we are shifting forward, but since we are shifting backward
    # and timestamps[i] is smaller than timestamps[i+1], there are no collision issues if target_time
    # file doesn't exist. Since timestamps[i] (target_time) is the gap, it shouldn't exist. So we can rename sequentially.)
    for old_f, new_f in rename_ops:
        if new_f.exists():
            print(f"Error: Target file {new_f.name} already exists. Aborting to prevent overwrite.")
            return
        old_f.rename(new_f)
        print(f"Renamed: {old_f.name} to {new_f.name}")
        
    print("\nSuccess! All matching files shifted and renamed.")

if __name__ == "__main__":
    main()
