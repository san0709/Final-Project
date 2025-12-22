# Quick Reference: Environment Variables

## Frontend (.env)
```
VITE_API_URL=http://localhost:4000
```

## Production (Vercel)
```
VITE_API_URL=https://zenchat-social-app.onrender.com
```

## How to Add on Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `VITE_API_URL` = `https://zenchat-social-app.onrender.com`
5. Redeploy from Deployments tab

## Testing
After deploy, check browser console for:
```
Current API URL being used: https://zenchat-social-app.onrender.com
```
