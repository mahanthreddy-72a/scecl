# ☁️ Cloud Deployment Guide - Aiven + Vercel

Deploy your school election system to the cloud!

---

## 📋 Table of Contents

1. [Aiven PostgreSQL Setup](#aiven-postgresql-setup)
2. [Migrate Data to Aiven](#migrate-data-to-aiven)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment on Vercel](#frontend-deployment-on-vercel)
5. [Environment Configuration](#environment-configuration)
6. [Testing & Troubleshooting](#testing--troubleshooting)

---

## 🐘 Aiven PostgreSQL Setup

### Step 1: Create Aiven Account

1. **Sign up:** https://aiven.io/
2. **Create project** for your school
3. **Add payment method**

### Step 2: Create PostgreSQL Service

1. **Go to:** Console → Create Service
2. **Select:** PostgreSQL
3. **Choose:**
   - **Service Name:** `elections-db`
   - **Cloud Region:** Closest to your school (e.g., Asia Pacific if in India)
   - **Plan:** Startup (free tier) or Business (paid)
4. **Click:** Create Service

⏳ Wait 5-10 minutes for service to initialize.

### Step 3: Get Connection Details

Once service is ready:

1. **Go to:** Service Overview
2. **Connection Information section:**
   - **Host:** `your-service-xxx.aivencloud.com`
   - **Port:** `12345` (usually 12345-12398)
   - **Database:** `defaultdb`
   - **Username:** `avnadmin`
   - **Password:** Copy from "Show" button

### Step 4: Whitelist IP Addresses

1. **Go to:** IP Access Control
2. **Add IPs:**
   ```
   0.0.0.0/0  (allows all - for development)
   ```
   
   **For production:** Add specific IPs (Vercel IPs)

---

## 📦 Migrate Data to Aiven

### Option 1: Via `pg_dump` (Recommended)

#### Step 1: Backup Local Database

```bash
# Backup your local elections database
pg_dump -U postgres elections > elections_backup.sql
```

#### Step 2: Create Tables on Aiven

```bash
# Connect to Aiven PostgreSQL
psql -h your-service-xxx.aivencloud.com \
  -p 12345 \
  -U avnadmin \
  -d defaultdb \
  -c "CREATE DATABASE elections;"
```

#### Step 3: Restore Data

```bash
# Restore from backup
psql -h your-service-xxx.aivencloud.com \
  -p 12345 \
  -U avnadmin \
  -d elections < elections_backup.sql
```

#### Step 4: Verify Data

```bash
# Check tables
psql -h your-service-xxx.aivencloud.com \
  -p 12345 \
  -U avnadmin \
  -d elections \
  -c "SELECT COUNT(*) FROM students;"
```

### Option 2: Via DBeaver (GUI)

1. **Download:** https://dbeaver.io/
2. **New Connection:**
   - Database: PostgreSQL
   - Host: `your-service-xxx.aivencloud.com`
   - Port: `12345`
   - Database: `defaultdb`
   - Username: `avnadmin`
   - Password: (from Aiven)
3. **Export/Import** your local database

---

## 🚀 Backend Deployment

### Option A: Render (Recommended - Easy)

#### Step 1: Prepare Backend

```bash
# Create production environment file
cat > backend/.env.production << 'EOF'
DB_HOST=your-service-xxx.aivencloud.com
DB_PORT=12345
DB_NAME=elections
DB_USER=avnadmin
DB_PASSWORD=your-password-here
SESSION_SECRET=generate-random-key-here
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-app.vercel.app
EOF
```

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 2: Create Render Account

1. **Sign up:** https://render.com/
2. **New Web Service**

#### Step 3: Deploy

1. **Connect GitHub** repo
2. **Build Command:**
   ```bash
   npm install
   ```

3. **Start Command:**
   ```bash
   cd backend && npm run start
   ```

4. **Environment Variables:** Add from `.env.production`

5. **Deploy** 🚀

Your backend URL: `https://elections-backend.onrender.com`

---

### Option B: Railway (Alternative)

1. **Sign up:** https://railway.app/
2. **New Project** → GitHub
3. **Select backend folder**
4. **Add variables** from `.env.production`
5. **Deploy**

---

## 🎨 Frontend Deployment on Vercel

### Step 1: Prepare Frontend

Update `frontend/vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://elections-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
}
```

Or update `frontend/src/utils/api.js`:

```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Use environment variable instead of hardcoded localhost
```

### Step 2: Create Vercel Account

1. **Sign up:** https://vercel.com/
2. **Import Project** → GitHub

### Step 3: Deploy Frontend

1. **Select** your elections repo
2. **Framework:** Vite
3. **Environment Variables:**
   ```
   VITE_API_URL=https://elections-backend.onrender.com/api
   ```

4. **Deploy** 🚀

Your app URL: `https://elections.vercel.app`

---

## ⚙️ Environment Configuration

### Backend (.env.production)

```env
# Database
DB_HOST=your-service-xxx.aivencloud.com
DB_PORT=12345
DB_NAME=elections
DB_USER=avnadmin
DB_PASSWORD=your-password-here

# Server
NODE_ENV=production
PORT=5000

# Security
SESSION_SECRET=your-random-secret-key
CORS_ORIGIN=https://elections.vercel.app

# Optional
DEBUG=false
```

### Frontend (.env.production)

```env
VITE_API_URL=https://elections-backend.onrender.com/api
```

---

## 🔒 Security Checklist

- [ ] Change Aiven default admin password
- [ ] Whitelist only necessary IPs in Aiven
- [ ] Use strong SESSION_SECRET (32+ characters)
- [ ] Enable SSL/TLS in Aiven (Settings → SSL/TLS)
- [ ] Enable HTTPS on Vercel (automatic)
- [ ] Set `NODE_ENV=production`
- [ ] Change admin password from `admin123`
- [ ] Enable backups in Aiven (automatic daily)

---

## 🧪 Testing & Troubleshooting

### Test Database Connection

```bash
# From your local machine
psql -h your-service-xxx.aivencloud.com \
  -p 12345 \
  -U avnadmin \
  -d elections \
  -c "SELECT * FROM students LIMIT 1;"
```

### Common Issues

#### 1. **Connection Refused**
```
Error: connect ECONNREFUSED
```
**Solution:**
- Check IP is whitelisted in Aiven
- Verify host/port/credentials
- Check firewall settings

#### 2. **CORS Errors**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Update `CORS_ORIGIN` in backend `.env`
- Make sure frontend URL matches exactly

#### 3. **Session Not Persisting**
**Solution:**
- Ensure `connect-pg-simple` is configured
- Check session table exists: `SELECT * FROM session LIMIT 1;`
- Verify SESSION_SECRET is set

#### 4. **Images Not Loading**
**Solution:**
- Backend images folder is local (Render doesn't persist)
- **Fix:** Upload images to cloud storage (AWS S3, Cloudinary)
- Update image paths in database

---

## 📸 Image Storage (For Production)

Images need cloud storage since Render filesystem is ephemeral.

### Use Cloudinary (Free Tier Available)

#### Step 1: Create Cloudinary Account
1. **Sign up:** https://cloudinary.com/
2. **Dashboard:** Get API credentials

#### Step 2: Update Backend

```javascript
// backend/src/routes/candidates.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'elections/candidates' },
      (error, result) => {
        if (error) return res.status(500).json({ error: 'Upload failed' });
        // Use result.secure_url as image path
      }
    ).end(req.file.buffer);
  }
  // ... rest of code
});
```

#### Step 3: Set Environment Variables
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📊 Cost Estimate (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| **Aiven PostgreSQL** | Startup | $25-50 |
| **Render Backend** | Starter | Free - $7 |
| **Vercel Frontend** | Pro | Free - $20 |
| **Cloudinary Images** | Free | Free |
| | **TOTAL** | **~$25-77/month** |

**Free tier options available!** Start free and scale as needed.

---

## 🎯 Deployment Checklist

- [ ] Aiven PostgreSQL service created
- [ ] Data migrated from local database
- [ ] Backend environment variables set
- [ ] Backend deployed (Render/Railway)
- [ ] Frontend environment variables set
- [ ] Frontend deployed (Vercel)
- [ ] Test student login works
- [ ] Test voting works end-to-end
- [ ] Test results dashboard
- [ ] Images loading from cloud storage
- [ ] Backups configured in Aiven
- [ ] SSL/TLS enabled
- [ ] Admin password changed

---

## 📞 Quick Reference

**Aiven Console:** https://console.aiven.io/  
**Vercel Dashboard:** https://vercel.com/dashboard  
**Render Dashboard:** https://dashboard.render.com/  
**Cloudinary Dashboard:** https://cloudinary.com/console/

---

## 🚀 You're Live!

Your school election system is now on the cloud!

- **Database:** PostgreSQL on Aiven ✅
- **Backend:** Running on Render/Railway ✅
- **Frontend:** Deployed on Vercel ✅
- **Images:** Cloud storage with Cloudinary ✅

**Access:** https://elections.vercel.app 🎉

---

## 📈 Next Steps

1. **Monitor:** Set up alerts in Aiven/Render/Vercel
2. **Backups:** Verify daily Aiven backups
3. **Scaling:** Upgrade plans as student count grows
4. **Analytics:** Add tracking (Vercel Analytics is free)
5. **Custom Domain:** Add your school domain name

Good luck with your elections! 🗳️✨
