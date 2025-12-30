# SmartCloset - Vercel Deployment Guide

This guide will help you deploy your SmartCloset application to Vercel.

## 🚀 Quick Deployment Steps

### Prerequisites
- A GitHub account
- A Vercel account (free) - Sign up at [vercel.com](https://vercel.com)
- Git installed on your computer

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository
```bash
cd C:\Users\Maann\Desktop\NEW
git init
git add .
git commit -m "Initial commit - SmartCloset app with AI features"
```

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New Repository"
3. Name it: `smartcloset`
4. Keep it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/smartcloset.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com) and log in**
2. **Click "Add New" → "Project"**
3. **Import your GitHub repository:**
   - Click "Import Git Repository"
   - Find and select your `smartcloset` repository
4. **Configure the project:**
   - Framework Preset: **Other**
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build:vercel`
   - Output Directory: `client/build`
5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   JWT_SECRET = your-secret-key-here-make-it-strong-and-random
   NODE_ENV = production
   ```
6. **Click "Deploy"**
7. **Wait 2-3 minutes** for deployment to complete

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: [Select your account]
# - Link to existing project: N
# - Project name: smartcloset
# - Directory: ./
# - Override settings: N

# Deploy to production
vercel --prod
```

---

## Step 3: Post-Deployment Configuration

### 3.1 Update Client API URL

After deployment, Vercel will give you a URL like: `https://smartcloset-xyz.vercel.app`

Update your client API configuration:

**Option 1: Using Environment Variable (Recommended)**
1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `REACT_APP_API_URL = https://smartcloset-xyz.vercel.app/api`
3. Redeploy: `vercel --prod` or push a new commit

**Option 2: Manual Update**
Edit `client/src/services/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://smartcloset-xyz.vercel.app/api';
```

### 3.2 Database Considerations

⚠️ **Important:** Vercel has serverless functions with ephemeral file systems. SQLite database will be reset on each deployment.

**Solutions:**

**For Testing/Demo:**
- Current SQLite setup works fine
- Database resets on each deployment (good for demos)

**For Production:**
- Migrate to a cloud database:
  - **PostgreSQL** (Vercel Postgres, Supabase, Railway)
  - **MongoDB** (MongoDB Atlas - free tier)
  - **PlanetScale** (MySQL-compatible, free tier)

---

## Step 4: File Upload Configuration

Vercel's serverless functions have read-only file systems. For image uploads:

### Option A: Use Vercel Blob (Recommended for Vercel)
```bash
npm install @vercel/blob
```

### Option B: Use Cloudinary (Free tier available)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Install: `npm install cloudinary multer-storage-cloudinary`
3. Update upload configuration

### Option C: Use AWS S3 / Google Cloud Storage

For now, your current setup will work for testing, but uploaded images will be lost on redeployment.

---

## Step 5: Verify Deployment

1. **Visit your Vercel URL**: `https://smartcloset-xyz.vercel.app`
2. **Test the following:**
   - ✅ Auto-login works
   - ✅ Landing page loads
   - ✅ Navigation works
   - ✅ Upload page (may need cloud storage for persistence)
   - ✅ Closet page
   - ✅ Outfit Planner
   - ✅ AI Analysis (after upload)

---

## 🔧 Troubleshooting

### Issue: API calls failing
- Check CORS settings in `server/index.js`
- Verify environment variables are set in Vercel
- Check browser console for errors

### Issue: Build fails
```bash
# Try building locally first
npm run build:vercel

# If successful, commit and push
git add .
git commit -m "Fix build"
git push
```

### Issue: Database not persisting
- This is expected with SQLite on Vercel
- Migrate to a cloud database (see Step 3.2)

### Issue: Images not showing
- Set up cloud storage (Vercel Blob, Cloudinary, S3)
- See Step 4 for options

---

## 📊 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables set
- [ ] First deployment successful
- [ ] Auto-login works
- [ ] All pages accessible
- [ ] Consider database migration for production
- [ ] Consider cloud storage for images
- [ ] Custom domain (optional)

---

## 🎨 Optional: Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `smartcloset.com`)
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

---

## 🔒 Security Recommendations

Before going live:

1. **Change JWT Secret:**
   - Generate a strong random string
   - Add to Vercel environment variables
   - Never commit secrets to Git

2. **Enable Rate Limiting:**
   - Add express-rate-limit to prevent abuse

3. **Add Input Validation:**
   - Validate all user inputs
   - Sanitize file uploads

4. **HTTPS Only:**
   - Vercel provides SSL automatically
   - Ensure all API calls use HTTPS

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Review this guide
4. Check Vercel documentation

---

## 🎉 Success!

Your SmartCloset app is now live! Share your URL with friends and enjoy your AI-powered wardrobe assistant.

**Next Steps:**
- Add more clothing items
- Test AI recommendations
- Share with friends
- Consider upgrading storage for production use
