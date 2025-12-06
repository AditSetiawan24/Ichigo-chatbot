<h1 align="center">Ichigo - 015</h1>
<div align="center">
  <img height="200" src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHdhM2MwcWlyODczeG42MmFjeXM2aHFwaWFvc3RhYnk4Nm56bHplaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NE7apWL5vatkPY7f0z/giphy.gif" />
</div>

##
<h2>Ichigo - 015</h2> 
Ini merupakan project chatbot untuk menyelesaikan masalah codingan dengan bumbu girlfriend/boyfriend experience. Anda bisa mengubah foto profile ataupun usernamenya. Project ini dibuat menggunakan Vite, React, Tailwind, dan Groq dengan base model llama3.

## Preview
Link : [Ichigo - 015](https://ichigo.aditproject.my.id/)

## Requirement
- Node.Js Ver: 20.13.1
- NPM Ver: 10.5.2

## Cara Menggunakan?

### 🔒 Setup Aman (Direkomendasikan)
Project ini sekarang menggunakan backend server yang aman untuk melindungi API key Anda!

1. **Clone Repository**
   ```sh
   git clone https://github.com/AditSetiawan24/Ichigo-chatbot.git
   cd Ichigo-chatbot
   ```

2. **Setup Otomatis (Windows)**
   ```sh
   setup.bat
   ```
   
   **Setup Otomatis (Linux/Mac)**
   ```sh
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Konfigurasi Environment (PENTING!)**
   Edit file `server/.env` dan isi dengan credentials Anda:
   ```env
   GROQ_API_KEY=api_key_anda_disini
   PROMPT_PACAR=prompt_anda_disini
   PROMPT_BESTFRIEND=prompt_anda_disini
   ```
   Dapatkan Groq API Key [DISINI](https://console.groq.com/keys)

## Cara Menjalankan?

### Opsi 1: Menggunakan Script (Mudah)
**Windows:**
```sh
start.bat
```

**Linux/Mac:**
```sh
chmod +x start.sh
./start.sh
```

### Opsi 2: Manual (2 Terminal)
**Terminal 1 - Backend:**
```sh
cd server
npm start
```

**Terminal 2 - Frontend:**
```sh
npm run dev
```

Buka browser: `http://localhost:5173`

## Fitur Keamanan ✅
- ✅ API key tersimpan aman di backend
- ✅ Rate limiting (50 request per 15 menit)
- ✅ CORS protection
- ✅ Input validation & sanitization
- ✅ Security headers dengan Helmet
- ✅ Tidak ada data sensitif yang terekspos di browser
- ✅ Request size limits

## Dokumentasi Lengkap
- 📖 [Panduan Cepat](./QUICKSTART.md)
- 🔒 [Panduan Keamanan](./SECURITY.md)
- 🚀 [Panduan Deployment](./DEPLOYMENT.md)

## Source
[VITE+React](https://v4.vite.dev/guide/)
</br>
[Tailwind](https://tailwindcss.com/docs/guides/vite)
</br>
[Groq](https://console.groq.com/docs/quickstart)
</br>
[Vercel](https://vercel.com/docs)

<h2 align="center">If You Want To Support Me, You Can Scan Here : 😊</h2>
<div align="center">
  <img height="200" src="https://i.ibb.co.com/5jLWPTH/Untitled-1-1.png"/>
  <p align="center"> Saweria </p>
</div>
