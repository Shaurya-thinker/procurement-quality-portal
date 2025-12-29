#!/usr/bin/env python3
import sqlite3

# Connect to the database
conn = sqlite3.connect('app.db')
cursor = conn.cursor()

print("Adding new columns to events table...")
try:
    cursor.execute('ALTER TABLE events ADD COLUMN location VARCHAR(255)')
    print("  ✓ Added location column")
except:
    print("  - location column already exists")

try:
    cursor.execute('ALTER TABLE events ADD COLUMN agenda TEXT')
    print("  ✓ Added agenda column")
except:
    print("  - agenda column already exists")

try:
    cursor.execute('ALTER TABLE events ADD COLUMN organizer VARCHAR(255)')
    print("  ✓ Added organizer column")
except:
    print("  - organizer column already exists")

print("\nAdding new columns to trainings table...")
try:
    cursor.execute('ALTER TABLE trainings ADD COLUMN location VARCHAR(255)')
    print("  ✓ Added location column")
except:
    print("  - location column already exists")

try:
    cursor.execute('ALTER TABLE trainings ADD COLUMN trainer_name VARCHAR(255)')
    print("  ✓ Added trainer_name column")
except:
    print("  - trainer_name column already exists")

try:
    cursor.execute('ALTER TABLE trainings ADD COLUMN agenda TEXT')
    print("  ✓ Added agenda column")
except:
    print("  - agenda column already exists")

print("\nAdding new columns to meetings table...")
try:
    cursor.execute('ALTER TABLE meetings ADD COLUMN location VARCHAR(255)')
    print("  ✓ Added location column")
except:
    print("  - location column already exists")

try:
    cursor.execute('ALTER TABLE meetings ADD COLUMN agenda TEXT')
    print("  ✓ Added agenda column")
except:
    print("  - agenda column already exists")

try:
    cursor.execute('ALTER TABLE meetings ADD COLUMN organizer VARCHAR(255)')
    print("  ✓ Added organizer column")
except:
    print("  - organizer column already exists")

conn.commit()
conn.close()
print("\n✅ Database schema update completed!")
