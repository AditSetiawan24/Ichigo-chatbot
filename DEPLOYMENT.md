# 🚀 Deployment Guide - Ichigo Chatbot

## Deployment Options

### Option 1: Vercel (Frontend) + Vercel Serverless Functions (Backend)

#### Step 1: Prepare Backend as Serverless Function

Create `api/chat.js` in the root directory:
```javascript
// This file will be used for Vercel Serverless deployment
export { default } from '../server/index.js';
```

#### Step 2: Update `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

#### Step 3: Deploy to Vercel
```sh
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard:
# - GROQ_API_KEY
# - PROMPT_PACAR
# - PROMPT_BESTFRIEND
# - FRONTEND_URL (your Vercel app URL)
```

---

### Option 2: Separate Deployment (Recommended for Production)

#### Backend: Deploy to Railway/Render/Fly.io

**Railway:**
```sh
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy backend
cd server
railway init
railway up

# Add environment variables in Railway dashboard
```

**Render:**
1. Push code to GitHub
2. Connect Render to your repo
3. Create new Web Service
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add environment variables

#### Frontend: Deploy to Vercel/Netlify

**Vercel:**
```sh
# In root directory
vercel

# Set VITE_API_URL to your backend URL
# Example: https://your-backend.railway.app
```

**Netlify:**
```sh
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod

# Set environment variable VITE_API_URL in Netlify dashboard
```

---

### Option 3: VPS/Cloud Server (Full Control)

**Using PM2 for Process Management:**

```sh
# Install PM2
npm install -g pm2

# Start backend
cd server
pm2 start index.js --name "ichigo-backend"

# Start frontend with serve
cd ..
npm run build
pm2 serve dist 5173 --name "ichigo-frontend"

# Save PM2 configuration
pm2 save
pm2 startup
```

**Nginx Configuration:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Environment Variables Checklist

### Backend (.env)
```
NODE_ENV=production
PORT=3001
GROQ_API_KEY=your_key_here
PROMPT_PACAR=your_prompt
PROMPT_BESTFRIEND=your_prompt
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
```

---

## Security Best Practices for Production

1. **Enable HTTPS** - Always use SSL certificates (Let's Encrypt)
2. **Update CORS origins** - Set specific frontend URLs, not wildcards
3. **Increase rate limits** carefully based on your usage
4. **Monitor logs** - Use services like LogRocket, Sentry
5. **Set up alerts** - Monitor for unusual traffic patterns
6. **Regular updates** - Keep dependencies updated
7. **Backup strategy** - Regular backups of configurations

---

## Testing Production Build Locally

```sh
# Build frontend
npm run build

# Test frontend build
npm run preview

# Start backend in production mode
cd server
NODE_ENV=production npm start
```

---

## Troubleshooting

**CORS errors:**
- Check FRONTEND_URL in backend .env
- Verify VITE_API_URL in frontend .env

**API not responding:**
- Check backend server is running
- Verify firewall rules
- Check environment variables are set

**Rate limit errors:**
- Adjust rate limiting in server/index.js
- Consider implementing user authentication

---

## Support

If you encounter issues, check:
1. Server logs
2. Browser console
3. Network tab in DevTools
4. Environment variables are correctly set
