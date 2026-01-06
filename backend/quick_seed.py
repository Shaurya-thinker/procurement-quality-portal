#!/usr/bin/env python3
"""Quick seed script - runs in current terminal"""
import subprocess
import sys
from pathlib import Path

# Change to backend directory
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir.parent))

# Run the seed
print("\n" + "=" * 60)
print("🌱 Running Database Seeding...")
print("=" * 60 + "\n")

result = subprocess.run([sys.executable, str(backend_dir / "seed_data.py")])
sys.exit(result.returncode)
