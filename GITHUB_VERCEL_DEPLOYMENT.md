# 🚀 Panduan Lengkap Upload GitHub & Deploy Vercel

## 📋 Checklist Sebelum Deploy

- [ ] Backend server sudah jalan dan tested locally
- [ ] File `.env` dan `server/.env` sudah di `.gitignore`
- [ ] API key sudah dipindah dari frontend ke backend
- [ ] Semua perubahan sudah disimpan

---

## STEP 1: Upload ke GitHub

### 1.1 Add Semua File Baru ke Git
```bash
cd "/c/Users/Adit Setiawan/Code Project/ichigo/Ichigo-chatbot"

# Add semua file baru dan perubahan
git add .
```

### 1.2 Commit dengan Message yang Jelas
```bash
git commit -m "🔒 Major Security Update v2.0.0

- Added secure backend proxy server
- Removed API keys from frontend
- Implemented rate limiting and CORS protection
- Added comprehensive security features
- Updated documentation"
```

### 1.3 Push ke GitHub
```bash
git push origin master
```

**✅ Setelah ini, code Anda sudah di GitHub!**

---

## STEP 2: Deploy Backend ke Railway (Recommended)

### Kenapa Railway?
- ✅ Free tier tersedia
- ✅ Easy deployment
- ✅ Auto HTTPS
- ✅ Environment variables support

### 2.1 Daftar Railway
1. Buka https://railway.app/
2. Sign up dengan GitHub account
3. Authorize Railway

### 2.2 Deploy Backend
1. Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Select repository: **Ichigo-chatbot**
4. Klik **"Add variables"**
5. Add environment variables (copy dari file `server/.env` lokal Anda):
   ```
   NODE_ENV=production
   PORT=3001
   GROQ_API_KEY=your_actual_groq_api_key_here
   PROMPT_PACAR=(copy dari server/.env lokal)
   PROMPT_BESTFRIEND=(copy dari server/.env lokal)
   FRONTEND_URL=https://your-app.vercel.app
   ```
   **⚠️ PENTING**: Jangan copy-paste API key ke dokumen publik!
6. Klik **"Deploy"**

### 2.3 Configure Build Settings
Railway akan auto-detect Node.js. Pastikan settings:
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Root Directory**: `/`

### 2.4 Get Backend URL
Setelah deploy selesai:
1. Klik tab **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"**
4. Copy URL (contoh: `ichigo-backend.railway.app`)

**✅ Backend sekarang live!**

---

## STEP 3: Deploy Frontend ke Vercel

### 3.1 Login ke Vercel
1. Buka https://vercel.com/
2. Sign up dengan GitHub account
3. Authorize Vercel

### 3.2 Import Project
1. Klik **"Add New..."** → **"Project"**
2. Import **Ichigo-chatbot** repository
3. Klik **"Import"**

### 3.3 Configure Project
**Framework Preset**: Vite
**Root Directory**: `./`
**Build Command**: `npm run build`
**Output Directory**: `dist`

### 3.4 Add Environment Variables
Klik **"Environment Variables"** dan tambahkan:
```
VITE_API_URL=https://ichigo-backend.railway.app
```
(Ganti dengan URL backend Railway Anda)

### 3.5 Deploy
1. Klik **"Deploy"**
2. Tunggu proses build selesai (2-3 menit)
3. Vercel akan memberikan URL (contoh: `ichigo-chatbot.vercel.app`)

**✅ Frontend sekarang live!**

---

## STEP 4: Update CORS di Backend

### 4.1 Update Environment Variables di Railway
1. Buka Railway dashboard
2. Klik project Anda
3. Go to **"Variables"**
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://ichigo-chatbot.vercel.app
   ```
   (Ganti dengan URL Vercel Anda yang sebenarnya)
5. Railway akan auto-redeploy

---

## STEP 5: Testing Production

### 5.1 Test Backend
```bash
curl https://ichigo-backend.railway.app/api/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### 5.2 Test Frontend
1. Buka `https://ichigo-chatbot.vercel.app`
2. Pilih mode chat
3. Kirim test message
4. ✅ Seharusnya berfungsi!

### 5.3 Verify Security
1. Buka DevTools (F12)
2. Network tab
3. Kirim message
4. Check request ke `/api/chat`
5. ✅ **API key TIDAK terlihat!**

---

## 🔧 Troubleshooting

### CORS Error?
**Problem**: Frontend tidak bisa connect ke backend
**Solution**: 
1. Pastikan `FRONTEND_URL` di Railway sesuai dengan Vercel URL
2. Redeploy backend di Railway

### 500 Error di Backend?
**Problem**: Backend error saat process request
**Solution**:
1. Check Railway logs: Dashboard → Deployments → View logs
2. Pastikan semua environment variables terisi
3. Verify model name: `llama-3.1-8b-instant`

### Build Failed di Vercel?
**Problem**: Frontend build gagal
**Solution**:
1. Check build logs di Vercel
2. Pastikan `VITE_API_URL` sudah diset
3. Verify package.json scripts

---

## 📱 Custom Domain (Optional)

### Vercel Custom Domain
1. Buka Vercel project settings
2. Go to **"Domains"**
3. Add your domain
4. Update DNS records sesuai instruksi
5. Wait for DNS propagation

### Railway Custom Domain
1. Buka Railway project settings
2. Go to **"Settings"** → **"Domains"**
3. Add custom domain
4. Update DNS records
5. Railway provides free SSL

---

## 🎉 Selesai!

Aplikasi Anda sekarang:
- ✅ Live di internet
- ✅ Secure (API key tersimpan aman)
- ✅ Scalable
- ✅ Auto HTTPS
- ✅ Professional deployment

### URLs Summary
- **Frontend**: https://ichigo-chatbot.vercel.app
- **Backend**: https://ichigo-backend.railway.app
- **GitHub**: https://github.com/AditSetiawan24/Ichigo-chatbot

---

## 💰 Cost Estimate

### Free Tier Limits:
**Railway**: 
- $5 credit per month
- ~500 hours runtime
- Good for hobby projects

**Vercel**:
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for personal projects

**Total Cost**: $0/month untuk usage normal! 🎉

---

## 🔄 Future Updates

Untuk update aplikasi:
```bash
# 1. Make changes locally
# 2. Test locally
# 3. Commit and push
git add .
git commit -m "Update: description"
git push origin master

# 4. Auto-deploy di Vercel & Railway! ✨
```

---

## 📞 Support

Butuh bantuan? Check:
- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: https://github.com/AditSetiawan24/Ichigo-chatbot/issues
