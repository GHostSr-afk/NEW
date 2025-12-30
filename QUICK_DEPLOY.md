# 🚀 Quick Deploy to Vercel

## Step-by-Step (5 minutes)

### 1️⃣ Push to GitHub
```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/smartcloset.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy to Vercel

**Option A: Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your `smartcloset` repository
5. Configure:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build:vercel`
   - **Output Directory:** `client/build`
6. Click **"Environment Variables"** and add:
   ```
   JWT_SECRET = your-very-secret-key-change-this
   NODE_ENV = production
   ```
7. Click **"Deploy"** 
8. Wait 2-3 minutes ⏰
9. **Done!** 🎉 Visit your live URL

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 3️⃣ Update API URL (After First Deploy)

After deployment, Vercel gives you a URL like: `https://smartcloset-xyz.vercel.app`

**Add this environment variable in Vercel Dashboard:**
```
REACT_APP_API_URL = https://smartcloset-xyz.vercel.app/api
```

Then redeploy by pushing a new commit or clicking "Redeploy" in Vercel.

---

## ✅ Verify Deployment

Visit your Vercel URL and test:
- [ ] Landing page loads
- [ ] Auto-login works
- [ ] Navigation works
- [ ] Can add items (images may not persist - see note below)
- [ ] Closet shows items
- [ ] Outfit planner works
- [ ] AI recommendations work

---

## ⚠️ Important Notes

### Database & Uploads
- **SQLite database** will reset on each deployment (Vercel is serverless)
- **Uploaded images** won't persist (ephemeral file system)

**For Production:**
- Migrate to cloud database (Supabase, PlanetScale, MongoDB Atlas)
- Use cloud storage (Vercel Blob, Cloudinary, AWS S3)

### For Demo/Testing
- Current setup works fine!
- Just re-add items after redeployment

---

## 🎉 You're Live!

Your SmartCloset is now online! Share your URL:
```
https://smartcloset-xyz.vercel.app
```

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
