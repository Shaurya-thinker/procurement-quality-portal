import sqlite3
from pathlib import Path
p = Path(__file__).resolve().parents[1] / 'app.db'
print('DB path:', p)
print('Exists:', p.exists())
if p.exists():
    con = sqlite3.connect(p)
    cur = con.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    rows = cur.fetchall()
    print('Tables:')
    for r in rows:
        print(' -', r[0])
    con.close()
else:
    print('No DB file found')
