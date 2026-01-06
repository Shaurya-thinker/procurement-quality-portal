# ⚡ Quick Start (3 Minutes)

## Step 1: Open Terminal
Press `Ctrl + Backtick` in VS Code OR open Command Prompt/Terminal

## Step 2: Run This
```bash
cd backend && python seed_data.py && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Step 3: Refresh Browser
Go back to your dashboard and refresh (F5)

---

## ✨ Done!
Your dashboard now shows:
- ✅ 10 Real Employees
- ✅ 5 Real Events  
- ✅ Purchase Orders
- ✅ Recent Activity

---

## 🆘 Issues?

### Error: "Connection Refused"
→ Backend didn't start, check step 2 output

### Error: "ModuleNotFoundError"  
→ Run: `pip install -r requirements.txt`

### All Stats Show 0
→ Seeding failed, check step 2 output

### Port Already in Use
→ Kill other process on port 8000 or use:
```bash
python -m uvicorn app.main:app --port 8001
```

---

**Need detailed help?** → See DASHBOARD_SETUP_GUIDE.md
**Want full details?** → See IMPLEMENTATION_SUMMARY.md
