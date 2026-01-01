#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Get all Python files in the app directory
backend_dir = Path(".")
python_files = list(backend_dir.glob("app/**/*.py"))

print(f"Found {len(python_files)} Python files to check")

fixed_count = 0
for file_path in python_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                content = f.read()
        except:
            print(f"⚠️ Skipped: {file_path} (encoding error)")
            continue
    
    # Replace all backend.app imports with app
    new_content = content.replace("from backend.app.", "from app.")
    new_content = new_content.replace("import backend.app.", "import app.")
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Fixed: {file_path}")
        fixed_count += 1

print(f"\n✅ Fixed {fixed_count} files")
