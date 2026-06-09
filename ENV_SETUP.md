# 🔐 Environment Variables Setup - Aiven PostgreSQL

Safely store your Aiven connection details locally!

---

## ✅ Already Done

Your project is configured to use environment variables:

- ✓ `.env` file is in `.gitignore` (won't be committed)
- ✓ `backend/src/index.js` loads `.env` automatically with `require('dotenv').config()`
- ✓ `backend/src/db.js` reads from environment variables
- ✓ `.env.example` shows the format for new developers

---

## 🔑 Your Aiven Details (in .env)

File: `backend/.env`

```env
# Your Aiven PostgreSQL
DB_HOST=pg-3a819dde-mahanthreddy-a75e.h.aivencloud.com
DB_PORT=16852
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=AVNS_xs3PBWX3iUey-wKh-qt
```

---

## 📋 How It Works

### 1. Local Development

When you run `npm run dev` from the elections folder:

```bash
cd "c:\Users\Leesha Labs\Documents\elections"
npm run dev
```

**What happens:**
1. Backend starts
2. `require('dotenv').config()` loads `backend/.env`
3. Environment variables are set in `process.env`
4. Database connection uses: `process.env.DB_HOST`, `process.env.DB_PASSWORD`, etc.
5. Connects to your **Aiven PostgreSQL** ✅

### 2. Files

```
elections/
├── backend/
│   ├── .env                    ← Your SECRET credentials (local only)
│   ├── .env.example            ← Template (commit to git)
│   ├── src/
│   │   ├── index.js            ← Loads .env
│   │   └── db.js               ← Uses process.env variables
│   └── package.json
├── frontend/
├── .gitignore                  ← Prevents .env from being committed
└── package.json
```

---

## 🚀 Usage

### First Time Setup

```bash
# 1. Navigate to elections folder
cd "c:\Users\Leesha Labs\Documents\elections"

# 2. Copy .env.example to .env
copy backend\.env.example backend\.env

# 3. Edit backend\.env with your Aiven details
# Use Notepad or VS Code

# 4. Install all dependencies
npm install:all

# 5. Start both backend and frontend
npm run dev
```

### Daily Usage

```bash
# Just run this from elections folder
npm run dev

# Or
npm start
```

That's it! ✨

---

## 🔒 Security Best Practices

### ✅ DO:
- ✓ Keep `.env` file **LOCAL ONLY** (never commit it)
- ✓ Use `.env.example` as template for other developers
- ✓ Rotate passwords periodically
- ✓ Use different passwords for dev/production
- ✓ Never share `.env` file via email/chat

### ❌ DON'T:
- ✗ Commit `.env` to git
- ✗ Share passwords in messages
- ✗ Push `.env` to GitHub
- ✗ Hardcode credentials in code
- ✗ Use same password for multiple systems

---

## 📝 Your Current .env

Your `backend/.env` file contains:

```env
DB_HOST=pg-3a819dde-mahanthreddy-a75e.h.aivencloud.com
DB_PORT=16852
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=AVNS_xs3PBWX3iUey-wKh-qt
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=your-secret-key-here-change-in-production
DEBUG=true
```

---

## 🧪 Test Your Connection

When you run `npm run dev`, you should see:

```
✓ Connected to PostgreSQL database
✓ Server running on http://localhost:5000
✓ Frontend on http://localhost:3000
```

If you see **"Database connection error"**, check:

1. **Aiven service is running**
   - Go to Aiven Console: https://console.aiven.io/
   - Check your `elections-db` service status

2. **Correct credentials in `.env`**
   - Compare with Aiven dashboard
   - Copy-paste exactly (spaces matter!)

3. **IP Whitelisting**
   - In Aiven: Settings → IP Access Control
   - Add your machine's IP or `0.0.0.0/0` for all

4. **Port is correct**
   - Should be `16852` (not 5432)

---

## 🔄 Updating Credentials

If you change your Aiven password:

1. **Get new password from Aiven**
2. **Update `backend/.env`:**
   ```env
   DB_PASSWORD=new-password-here
   ```
3. **Restart:** Stop `npm run dev` and run again
4. **Test connection**

---

## 🚨 If You Accidentally Commit `.env`

If you pushed `.env` to GitHub:

```bash
# Remove it from git (don't delete file)
git rm --cached backend/.env

# Commit
git commit -m "Remove .env from git"

# Push
git push

# Change your Aiven password immediately!
```

---

## ✨ You're All Set!

Your Aiven connection is secure and ready to use! 

```bash
npm run dev
```

Both backend and frontend start automatically, connecting to your Aiven PostgreSQL database! 🎉

---

## 📞 Troubleshooting

**Q: Do I need to install dotenv?**
A: No, it's already in `backend/package.json`. Just run `npm install:all`

**Q: Will `.env` be uploaded to git?**
A: No, it's in `.gitignore`. Only `.env.example` is committed.

**Q: Can I use the same `.env` for production?**
A: No! Create `.env.production` with production credentials for deployment.

**Q: How do other developers get started?**
A: They copy `.env.example` to `.env` and add their own Aiven credentials.

