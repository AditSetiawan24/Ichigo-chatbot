@echo off
echo ========================================
echo   STEP-BY-STEP DEPLOYMENT GUIDE
echo ========================================
echo.
echo ✅ STEP 1: UPLOAD KE GITHUB - SELESAI!
echo    Repository: https://github.com/AditSetiawan24/Ichigo-chatbot
echo.
echo ========================================
echo   STEP 2: DEPLOY BACKEND KE RAILWAY
echo ========================================
echo.
echo 1. Buka browser dan kunjungi: https://railway.app/
echo 2. Klik "Start a New Project"
echo 3. Login dengan GitHub account
echo 4. Klik "Deploy from GitHub repo"
echo 5. Pilih repository: Ichigo-chatbot
echo.
echo 6. Configure Settings:
echo    - Click "Settings" tab
echo    - Scroll to "Build Command"
echo    - Build Command: cd server ^&^& npm install
echo    - Start Command: cd server ^&^& npm start
echo.
echo 7. Add Environment Variables:
echo    Click "Variables" tab, lalu add satu-per-satu:
echo.
echo    NODE_ENV=production
echo    PORT=3001
echo    GROQ_API_KEY=(copy dari server\.env Anda)
echo    PROMPT_PACAR=(copy dari server\.env Anda)
echo    PROMPT_BESTFRIEND=(copy dari server\.env Anda)
echo    FRONTEND_URL=https://your-app.vercel.app
echo.
echo    NOTE: Untuk FRONTEND_URL, isi dulu dengan placeholder
echo          Nanti akan diupdate setelah deploy Vercel
echo.
echo 8. Click "Deploy"
echo 9. Tunggu deployment selesai (2-3 menit)
echo 10. Click "Settings" -^> "Domains" -^> "Generate Domain"
echo 11. COPY URL backend Anda (contoh: ichigo-backend.railway.app)
echo.
echo ========================================
echo   STEP 3: DEPLOY FRONTEND KE VERCEL
echo ========================================
echo.
echo 1. Buka browser: https://vercel.com/
echo 2. Login dengan GitHub account
echo 3. Click "Add New..." -^> "Project"
echo 4. Import "Ichigo-chatbot" repository
echo.
echo 5. Configure Project:
echo    Framework Preset: Vite
echo    Root Directory: ./
echo    Build Command: npm run build
echo    Output Directory: dist
echo.
echo 6. Environment Variables:
echo    Click "Environment Variables"
echo    Add:
echo      Name: VITE_API_URL
echo      Value: https://[YOUR-RAILWAY-URL]
echo      (Ganti dengan URL Railway dari Step 2)
echo.
echo 7. Click "Deploy"
echo 8. Tunggu build selesai (2-3 menit)
echo 9. COPY URL Vercel Anda
echo.
echo ========================================
echo   STEP 4: UPDATE CORS DI BACKEND
echo ========================================
echo.
echo 1. Kembali ke Railway dashboard
echo 2. Click project Anda
echo 3. Click "Variables"
echo 4. Edit FRONTEND_URL:
echo    Ganti dengan URL Vercel yang baru saja di-copy
echo    Contoh: https://ichigo-chatbot.vercel.app
echo 5. Railway akan auto-redeploy
echo.
echo ========================================
echo   STEP 5: TESTING
echo ========================================
echo.
echo 1. Buka URL Vercel Anda di browser
echo 2. Pilih mode chat (Pacar/Bestfriend)
echo 3. Kirim test message
echo 4. Buka DevTools (F12) -^> Network tab
echo 5. Verify: API key TIDAK terlihat!
echo.
echo ========================================
echo   🎉 DEPLOYMENT SELESAI!
echo ========================================
echo.
echo Frontend: https://[your-app].vercel.app
echo Backend: https://[your-app].railway.app
echo GitHub: https://github.com/AditSetiawan24/Ichigo-chatbot
echo.
echo ========================================
echo   TROUBLESHOOTING
echo ========================================
echo.
echo Problem: CORS Error?
echo Solution: Pastikan FRONTEND_URL di Railway sesuai Vercel URL
echo.
echo Problem: 500 Error?
echo Solution: Check Railway logs, verify environment variables
echo.
echo Problem: Build Failed?
echo Solution: Check Vercel build logs, verify VITE_API_URL
echo.
echo ========================================
echo.
pause
