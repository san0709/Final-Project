# Deployment Checklist

## Pre-Deployment

### Backend
- [ ] All environment variables documented in `.env.production.example`
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for Render)
- [ ] Strong JWT secrets generated
- [ ] CORS configuration updated for production
- [ ] Cookie settings configured for cross-origin (sameSite: 'none', secure: true)
- [ ] Error handling tested
- [ ] All routes tested locally

### Frontend
- [ ] API URL environment variable configured
- [ ] Production build tested locally (`npm run build && npm run preview`)
- [ ] `_redirects` file created for SPA routing
- [ ] `netlify.toml` configuration file created
- [ ] All console errors resolved
- [ ] Mobile responsiveness verified
- [ ] Images and assets optimized

## Deployment Steps

### 1. MongoDB Atlas Setup
- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Free M0 cluster created
- [ ] Database user created
- [ ] IP whitelist: 0.0.0.0/0 added
- [ ] Connection string copied

### 2. Backend Deployment (Render)
- [ ] Render account created
- [ ] New Web Service created
- [ ] GitHub repository connected
- [ ] Build settings configured:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Environment variables added:
  - [ ] NODE_ENV=production
  - [ ] PORT=5000
  - [ ] MONGO_URI
  - [ ] JWT_SECRET
  - [ ] JWT_REFRESH_SECRET
  - [ ] JWT_EXPIRE
  - [ ] JWT_REFRESH_EXPIRE
  - [ ] FRONTEND_URL (will update after Netlify)
- [ ] Service deployed successfully
- [ ] Backend URL copied: ___________________________

### 3. Frontend Deployment (Netlify)
- [ ] Netlify account created
- [ ] New site created from Git
- [ ] Build settings configured:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- [ ] Environment variables added:
  - [ ] VITE_API_URL (backend URL from Render)
- [ ] Site deployed successfully
- [ ] Frontend URL copied: ___________________________

### 4. Update Backend CORS
- [ ] Return to Render dashboard
- [ ] Update FRONTEND_URL environment variable with Netlify URL
- [ ] Trigger manual redeploy

## Post-Deployment Testing

### Authentication Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] Verify JWT cookie is set in browser DevTools
- [ ] Access protected route
- [ ] Logout successfully

### Core Features
- [ ] Create a post
- [ ] Like a post
- [ ] Comment on a post
- [ ] Send friend request
- [ ] Accept friend request
- [ ] View notifications
- [ ] Create a story
- [ ] View news feed
- [ ] Update profile

### Technical Verification
- [ ] No CORS errors in browser console
- [ ] Cookies are being sent with requests
- [ ] API responses are fast (< 500ms)
- [ ] Frontend loads quickly (< 3s)
- [ ] All images load properly
- [ ] No JavaScript errors in console

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Mobile Responsiveness
- [ ] Test on actual mobile device
- [ ] All pages render correctly
- [ ] Touch interactions work
- [ ] Navigation is accessible
- [ ] Forms are usable

### Security Checks
- [ ] JWT tokens are HttpOnly cookies
- [ ] Passwords never visible in responses
- [ ] Protected routes require authentication
- [ ] CORS only allows frontend domain
- [ ] HTTPS enforced on both frontend and backend

## Monitoring Setup

### Render
- [ ] Email notifications enabled for deployment failures
- [ ] Logs reviewed for errors
- [ ] Service health checked

### Netlify
- [ ] Build notifications configured
- [ ] Deploy logs reviewed
- [ ] Bandwidth usage monitored

### MongoDB Atlas
- [ ] Alerts configured for high usage
- [ ] Backup schedule set
- [ ] Connection metrics reviewed

## Documentation

- [ ] README.md updated with live URLs
- [ ] DEPLOYMENT.md reviewed and accurate
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Known issues documented

## Final Steps

- [ ] Share live URLs with stakeholders
- [ ] Create backup of database
- [ ] Document admin credentials securely
- [ ] Set up monitoring/alerting
- [ ] Plan for regular updates and maintenance

---

## Live URLs

**Frontend**: ___________________________

**Backend**: ___________________________

**Deployment Date**: ___________________________

**Deployed By**: ___________________________
