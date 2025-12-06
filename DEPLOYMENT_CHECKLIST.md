# ✅ DEPLOYMENT CHECKLIST - Ichigo Chatbot

## 📋 Pre-Deployment
- [x] Code sudah di push ke GitHub
- [x] File `.env` tidak terupload (ada di `.gitignore`)
- [x] Backend tested locally
- [x] Frontend tested locally

---

## 🚀 STEP 1: DEPLOY BACKEND KE RAILWAY

### 1.1 Setup Railway Account
- [ ] Buka https://railway.app/
- [ ] Click **"Start a New Project"**
- [ ] Login dengan **GitHub account**
- [ ] Authorize Railway

### 1.2 Create New Project
- [ ] Click **"Deploy from GitHub repo"**
- [ ] Select: **Ichigo-chatbot**
- [ ] Click **"Deploy Now"**

### 1.3 Configure Build Settings
- [ ] Click tab **"Settings"**
- [ ] Scroll ke **"Build"** section
- [ ] Set **Root Directory**: `.` (default)
- [ ] Set **Build Command**: `cd server && npm install`
- [ ] Set **Start Command**: `cd server && npm start`
- [ ] Click **"Save Changes"**

### 1.4 Add Environment Variables
- [ ] Click tab **"Variables"**
- [ ] Click **"New Variable"**
- [ ] Add satu per satu:

```
Variable 1:
Name: NODE_ENV
Value: production

Variable 2:
Name: PORT
Value: 3001

Variable 3:
Name: GROQ_API_KEY
Value: [COPY dari server/.env lokal Anda]

Variable 4:
Name: PROMPT_PACAR
Value: [COPY dari server/.env lokal Anda]

Variable 5:
Name: PROMPT_BESTFRIEND
Value: [COPY dari server/.env lokal Anda]

Variable 6:
Name: FRONTEND_URL
Value: https://temporary-placeholder.com
(akan diupdate nanti setelah deploy Vercel)
```

### 1.5 Deploy & Get URL
- [ ] Railway akan auto-deploy
- [ ] Tunggu hingga status: **"Success"** (2-3 menit)
- [ ] Click **"Settings"** → **"Networking"**
- [ ] Click **"Generate Domain"**
- [ ] **COPY URL** (contoh: `ichigo-backend-production.up.railway.app`)
- [ ] **SIMPAN URL ini** untuk Step 2

**Railway Backend URL saya:**
```
https://_____________________________________
```

---

## 🌐 STEP 2: DEPLOY FRONTEND KE VERCEL

### 2.1 Setup Vercel Account
- [ ] Buka https://vercel.com/
- [ ] Click **"Sign Up"**
- [ ] Login dengan **GitHub account**
- [ ] Authorize Vercel

### 2.2 Import Project
- [ ] Click **"Add New..."** → **"Project"**
- [ ] Cari dan pilih: **Ichigo-chatbot**
- [ ] Click **"Import"**

### 2.3 Configure Build Settings
- [ ] **Framework Preset**: Vite (auto-detected)
- [ ] **Root Directory**: `./`
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`
- [ ] **Install Command**: `npm install`

### 2.4 Add Environment Variable
- [ ] Click **"Environment Variables"**
- [ ] Add variable:
  ```
  Name: VITE_API_URL
  Value: https://[URL-RAILWAY-DARI-STEP-1]
  ```
- [ ] Pilih semua environments: **Production, Preview, Development**
- [ ] Click **"Add"**

### 2.5 Deploy
- [ ] Click **"Deploy"**
- [ ] Tunggu build selesai (2-3 menit)
- [ ] Status akan berubah jadi **"Ready"**
- [ ] Click **"Visit"** untuk buka aplikasi
- [ ] **COPY URL Vercel** (contoh: `ichigo-chatbot.vercel.app`)

**Vercel Frontend URL saya:**
```
https://_____________________________________
```

---

## 🔄 STEP 3: UPDATE BACKEND CORS

### 3.1 Update FRONTEND_URL di Railway
- [ ] Kembali ke Railway dashboard
- [ ] Click project **Ichigo-chatbot**
- [ ] Click tab **"Variables"**
- [ ] Find variable: **FRONTEND_URL**
- [ ] Click **"Edit"**
- [ ] Ganti value dengan **URL Vercel dari Step 2**
  ```
  https://ichigo-chatbot.vercel.app
  ```
- [ ] Click **"Update"**
- [ ] Railway akan **auto-redeploy** (tunggu 1-2 menit)

---

## ✅ STEP 4: TESTING PRODUCTION

### 4.1 Test Backend Health
- [ ] Buka browser
- [ ] Navigate ke: `https://[RAILWAY-URL]/api/health`
- [ ] Expected response:
  ```json
  {"status":"ok","timestamp":"2025-12-06T..."}
  ```

### 4.2 Test Frontend
- [ ] Buka URL Vercel di browser
- [ ] Click **"Pilih Mode"**
- [ ] Pilih: **Pacar** atau **Bestfriend**
- [ ] Type test message: "Halo!"
- [ ] Click **Send**
- [ ] **Verify**: Bot merespon dengan benar

### 4.3 Verify Security (PENTING!)
- [ ] Buka **DevTools** (tekan F12)
- [ ] Click tab **"Network"**
- [ ] Click **"Clear"** untuk clear network log
- [ ] Kirim message di chatbot
- [ ] Click request **POST /api/chat**
- [ ] Check tab **"Headers"** dan **"Payload"**
- [ ] **✅ VERIFY: TIDAK ada API key yang terlihat!**

### 4.4 Test Rate Limiting
- [ ] Kirim 10 messages dalam 1 menit
- [ ] Message ke-11 seharusnya error: "Rate limit exceeded"
- [ ] Tunggu 1 menit, lalu coba lagi
- [ ] **✅ VERIFY: Rate limiting berfungsi!**

---

## 🎉 DEPLOYMENT SELESAI!

### Your Live URLs:
```
✅ Frontend: https://[your-vercel-url]
✅ Backend:  https://[your-railway-url]
✅ GitHub:   https://github.com/AditSetiawan24/Ichigo-chatbot
```

### Security Status:
- ✅ API key tersimpan aman di backend
- ✅ Rate limiting aktif
- ✅ CORS protection aktif
- ✅ Security headers aktif
- ✅ Input validation aktif

---

## 🔧 TROUBLESHOOTING

### ❌ Problem: "ERR_CONNECTION_REFUSED"
**Cause**: Backend belum deploy atau crash
**Solution**:
1. Check Railway dashboard → Deployments
2. Verify status: "Success"
3. Check logs untuk error messages

### ❌ Problem: "CORS Error"
**Cause**: FRONTEND_URL di Railway tidak sesuai
**Solution**:
1. Go to Railway → Variables
2. Update FRONTEND_URL dengan exact Vercel URL
3. Include `https://` dan tanpa trailing slash `/`

### ❌ Problem: "Rate limit exceeded"
**Cause**: Terlalu banyak request
**Solution**:
1. Normal! Ini fitur keamanan
2. Tunggu 1 menit
3. Coba lagi

### ❌ Problem: "500 Internal Server Error"
**Cause**: Environment variables belum diset
**Solution**:
1. Check Railway → Variables
2. Verify semua variables ada:
   - NODE_ENV
   - PORT
   - GROQ_API_KEY
   - PROMPT_PACAR
   - PROMPT_BESTFRIEND
   - FRONTEND_URL
3. Redeploy jika perlu

### ❌ Problem: Build Failed di Vercel
**Cause**: VITE_API_URL tidak diset atau salah
**Solution**:
1. Go to Vercel → Project Settings
2. Environment Variables
3. Verify VITE_API_URL ada dan correct
4. Redeploy

---

## 📱 BONUS: Custom Domain (Optional)

### Add Custom Domain di Vercel
1. Go to Project Settings → Domains
2. Add your domain (contoh: `ichigo.yourdomain.com`)
3. Update DNS records:
   ```
   Type: CNAME
   Name: ichigo
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-30 menit)

### Add Custom Domain di Railway
1. Go to Settings → Networking
2. Click "Custom Domain"
3. Add your domain (contoh: `api.yourdomain.com`)
4. Update DNS records sesuai instruksi
5. Railway provides free SSL!

**Jangan lupa update FRONTEND_URL di Railway dengan domain baru!**

---

## 🔄 FUTURE UPDATES

### Cara Update Aplikasi:
```bash
# 1. Make changes locally
# 2. Test locally
# 3. Commit & push
git add .
git commit -m "Update: your changes"
git push origin master

# 4. Auto-deploy! ✨
# - Vercel: Auto-deploy dari GitHub
# - Railway: Auto-deploy dari GitHub
```

### Monitor Your App:
- **Railway**: Dashboard → Deployments → View Logs
- **Vercel**: Dashboard → Deployments → Function Logs

---

## 💰 COST ESTIMATE

**Railway Free Tier:**
- $5 credit per month
- ~500 hours uptime
- Good for personal projects

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for hobby projects

**Total: $0/month** untuk usage normal! 🎉

---

## 📞 NEED HELP?

- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: https://github.com/AditSetiawan24/Ichigo-chatbot/issues
- Review: [SECURITY.md](./SECURITY.md)

---

**🎉 Selamat! Aplikasi Anda sekarang live dan aman!**
