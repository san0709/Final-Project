# MERN Social Media Platform - Deployment Guide

## 📋 Table of Contents
1. [Environment Variables Setup](#environment-variables-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
4. [Production Build Steps](#production-build-steps)
5. [Final Testing Checklist](#final-testing-checklist)

---

## 🔐 Environment Variables Setup

### Backend Environment Variables (.env)

Create these environment variables in Render:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/social_media_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=https://your-app-name.netlify.app

# Optional: Email Configuration (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourapp.com
```

### Frontend Environment Variables (.env.production)

Create in Netlify:

```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

---

## 🚀 Backend Deployment (Render)

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user with password
4. Whitelist all IPs: `0.0.0.0/0` (for production, restrict to Render IPs)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/social_media_db
   ```

### Step 2: Prepare Backend for Render

**No additional files needed!** Your backend is already configured.

### Step 3: Deploy to Render

1. **Sign up/Login** to [Render](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**:
   ```
   Name: social-media-backend (or your choice)
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**:
   - Click "Environment" tab
   - Add all variables from the Backend .env section above
   - **IMPORTANT**: Update `MONGO_URI` with your MongoDB Atlas connection string
   - **IMPORTANT**: Generate strong secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://your-backend-app.onrender.com`

### Step 4: Update CORS

Your backend is already configured to accept the `FRONTEND_URL` environment variable. Just ensure it's set correctly in Render.

---

## 🌐 Frontend Deployment (Netlify)

### Step 1: Prepare Frontend Build

1. **Update Environment Variable**:
   Create `.env.production` in frontend folder:
   ```env
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

2. **Test Production Build Locally**:
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

### Step 2: Deploy to Netlify

**Option A: Netlify CLI (Recommended)**

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   netlify deploy --prod
   ```

4. **Follow prompts**:
   - Create & configure a new site
   - Build command: `npm run build`
   - Publish directory: `dist`

**Option B: Netlify Dashboard**

1. **Sign up/Login** to [Netlify](https://www.netlify.com)

2. **New Site from Git**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure Build Settings**:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Add Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-app.onrender.com/api`

5. **Deploy**:
   - Click "Deploy site"
   - Wait for build (2-5 minutes)
   - Copy your frontend URL: `https://your-app-name.netlify.app`

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable to your Netlify URL
3. Trigger a manual deploy to apply changes

---

## 🔨 Production Build Steps

### Backend Production Checklist

- [x] CORS configured with production frontend URL
- [x] Environment variables set in Render
- [x] MongoDB Atlas connection string configured
- [x] JWT secrets are strong and unique
- [x] Error handling middleware in place
- [x] Cookie settings configured for production

### Frontend Production Checklist

- [x] API URL points to production backend
- [x] `_redirects` file created for SPA routing
- [x] Build tested locally
- [x] Environment variables set in Netlify
- [x] `withCredentials: true` set in axios config

---

## ✅ Final Testing Checklist

### 1. Backend Health Check
```bash
curl https://your-backend-app.onrender.com/
# Should return: "Server is ready"
```

### 2. Test Authentication Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] Verify JWT cookie is set
- [ ] Access protected route (e.g., /api/users/profile/me)
- [ ] Logout

### 3. Test Core Features
- [ ] Create a post
- [ ] Like a post
- [ ] Comment on a post
- [ ] Send friend request
- [ ] Accept friend request
- [ ] View notifications
- [ ] Create a story
- [ ] View feed

### 4. Test CORS
- [ ] Open browser DevTools → Network tab
- [ ] Perform login from frontend
- [ ] Verify no CORS errors
- [ ] Check that cookies are being sent with requests

### 5. Performance Check
- [ ] Frontend loads in < 3 seconds
- [ ] API responses are < 500ms
- [ ] Images load properly
- [ ] No console errors

### 6. Mobile Responsiveness
- [ ] Test on mobile device or DevTools mobile view
- [ ] All pages render correctly
- [ ] Touch interactions work
- [ ] Navigation is accessible

### 7. Security Verification
- [ ] JWT tokens are HttpOnly cookies
- [ ] Passwords are hashed (never visible in responses)
- [ ] Protected routes require authentication
- [ ] CORS only allows your frontend domain

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution**: 
- Verify `FRONTEND_URL` in Render matches your Netlify URL exactly (including https://)
- Check that `withCredentials: true` is set in frontend axios config

### Issue: "Cannot GET /profile" on page refresh
**Solution**: 
- Ensure `_redirects` file exists in `frontend/public/`
- Content should be: `/*  /index.html  200`

### Issue: Backend not connecting to MongoDB
**Solution**:
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has read/write permissions

### Issue: Cookies not being set
**Solution**:
- Set `sameSite: 'none'` and `secure: true` in cookie options for production
- Verify both frontend and backend use HTTPS

### Issue: Render service sleeping (free tier)
**Solution**:
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid tier or using a service like UptimeRobot to ping every 14 minutes

---

## 📊 Monitoring & Maintenance

### Render Dashboard
- Monitor logs for errors
- Check service health
- View deployment history

### Netlify Dashboard
- Check build logs
- Monitor bandwidth usage
- View deploy history

### MongoDB Atlas
- Monitor database size
- Check connection metrics
- Set up alerts for high usage

---

## 🎉 Deployment Complete!

Your social media platform is now live! Share your URLs:
- **Frontend**: https://your-app-name.netlify.app
- **Backend API**: https://your-backend-app.onrender.com

Remember to:
1. Update README with live URLs
2. Test all features thoroughly
3. Monitor error logs regularly
4. Keep dependencies updated
5. Back up your database regularly
