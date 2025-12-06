# 🚀 How to Deploy

## Quick Deploy to Vercel (5 minutes)

### Step 1: Vercel Setup
1. Go to https://vercel.com/
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import `Ichigo-chatbot` repository

### Step 2: Configure
Framework: **Vite** (auto-detected)

### Step 3: Environment Variables
Add these 4 variables:

```
VITE_API_URL = 
GROQ_API_KEY = your_groq_api_key
PROMPT_PACAR = your_pacar_prompt
PROMPT_BESTFRIEND = your_bestfriend_prompt
```

Get Groq API Key: https://console.groq.com/keys

### Step 4: Deploy
Click **"Deploy"** and wait 2-3 minutes.

### Step 5: Test
1. Visit your app URL
2. Select chat mode
3. Send a test message
4. Open DevTools (F12) → Network tab
5. Verify: No API key visible ✅

---

## Architecture

```
Browser → Vercel (Frontend + Serverless API) → Groq API
```

- Frontend: React + Vite in `/src`
- Backend: Serverless functions in `/api`
- Security: API keys stored in Vercel environment variables

---

## Local Development

```bash
npm install
npm run dev
```

Create `.env` file:
```
VITE_API_URL=
```

For local API testing, you'll need to run the serverless functions locally or use Vercel CLI.

---

## Troubleshooting

**Build failed?**
- Check environment variables are set
- Verify GROQ_API_KEY is valid

**Bot not responding?**
- Check browser console for errors
- Verify Vercel deployment succeeded

**CORS error?**
- Clear browser cache
- Redeploy on Vercel

---

## Security Features

✅ API keys stored securely in Vercel  
✅ Serverless functions (no exposed backend)  
✅ Input validation and sanitization  
✅ HTTPS by default  

---

For detailed security information, see [SECURITY.md](./SECURITY.md)
