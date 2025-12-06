# 🚀 Quick Start Guide - Ichigo Chatbot

## Prerequisites
- Node.js v20.13.1 atau lebih tinggi
- NPM v10.5.2 atau lebih tinggi

## 📦 Installation Steps

### 1. Install Dependencies

#### Install Frontend Dependencies
```bash
npm install
```

#### Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 2. Setup Environment Variables

#### Backend Environment (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env` dan isi dengan credentials Anda:
```env
NODE_ENV=development
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
PROMPT_PACAR=your_prompt_here
PROMPT_BESTFRIEND=your_prompt_here
FRONTEND_URL=http://localhost:5173
```

**Cara mendapatkan Groq API Key:**
1. Kunjungi https://console.groq.com/keys
2. Buat akun atau login
3. Generate new API key
4. Copy dan paste ke `.env`

#### Frontend Environment (.env)
```bash
# Kembali ke root directory
cd ..
cp example.env .env
```

File `.env` frontend sudah siap digunakan dengan default value:
```env
VITE_API_URL=http://localhost:3001
```

### 3. Run the Application

Anda perlu membuka **2 terminal** untuk menjalankan backend dan frontend secara bersamaan.

#### Terminal 1: Start Backend Server
```bash
cd server
npm start
```

Output yang diharapkan:
```
🔒 Secure backend server running on port 3001
Environment: development
```

#### Terminal 2: Start Frontend
```bash
# Di root directory
npm run dev
```

Output yang diharapkan:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Access the Application

Buka browser dan navigate ke:
```
http://localhost:5173
```

## 🧪 Testing

### Test 1: Verify Backend is Running
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-12-06T..."}
```

### Test 2: Verify Security (API Key Not Exposed)
1. Buka DevTools (F12) di browser
2. Navigate ke Network tab
3. Kirim pesan di chatbot
4. Periksa request - **API key seharusnya TIDAK terlihat**

## 🔧 Troubleshooting

### Backend tidak bisa start?
```bash
# Check apakah port 3001 sudah digunakan
# Windows:
netstat -ano | findstr :3001

# Stop process jika perlu dan restart backend
```

### Frontend tidak bisa connect ke backend?
1. Pastikan backend server berjalan di terminal 1
2. Check `.env` frontend, pastikan `VITE_API_URL=http://localhost:3001`
3. Check console browser untuk error messages

### CORS Error?
- Pastikan `FRONTEND_URL` di `server/.env` sudah benar
- Default adalah `http://localhost:5173`
- Jika frontend running di port lain, update nilai ini

### "Rate limit exceeded" error?
- Tunggu 1 menit dan coba lagi
- Rate limit: 10 requests per menit per IP

## 📝 Development Tips

### Hot Reload
- Frontend: Sudah otomatis dengan Vite
- Backend: Gunakan `npm run dev` untuk auto-restart dengan Node.js watch mode

### Clear Local Storage
Jika ingin reset chat history:
```javascript
// Di browser console
localStorage.clear()
```

### View Logs
- Backend logs: Lihat terminal 1
- Frontend logs: Browser console (F12)

## 🎨 Customization

### Mengganti Bot Name
1. Klik icon settings di aplikasi
2. Masukkan nama baru
3. Save

### Mengganti Bot Profile Picture
1. Klik icon settings
2. Upload gambar baru
3. Crop sesuai keinginan
4. Save

### Mengganti Prompt
Edit file `server/.env`:
```env
PROMPT_PACAR="Kamu adalah pacar virtual yang..."
PROMPT_BESTFRIEND="Kamu adalah sahabat yang..."
```

Restart backend server setelah mengubah prompt.

## 🚀 Next Steps

- Read [SECURITY.md](./SECURITY.md) untuk memahami fitur keamanan
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) untuk deploy ke production
- Customize prompts sesuai kebutuhan Anda

## 💡 Support

Jika ada pertanyaan atau issues:
1. Check troubleshooting section di atas
2. Check GitHub Issues
3. Baca dokumentasi lengkap

---

Happy chatting! 🎉
