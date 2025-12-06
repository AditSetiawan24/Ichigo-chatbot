# 🔒 SECURITY.md - Ichigo Chatbot Security Guide

## Security Overview

Aplikasi ini telah ditingkatkan keamanannya untuk melindungi API keys dan data sensitif dari eksposur di browser.

## ✅ Fitur Keamanan yang Diimplementasikan

### 1. **Backend Proxy Architecture**
- API key Groq **TIDAK PERNAH** dikirim ke browser
- Semua request ke Groq API melalui backend server
- Frontend hanya berkomunikasi dengan backend, bukan langsung ke Groq

### 2. **Rate Limiting**
```javascript
// Global rate limit: 50 requests per 15 menit
// Chat endpoint: 10 requests per menit
```
Mencegah abuse dan serangan DDoS

### 3. **CORS Protection**
- Hanya origin yang diizinkan dapat mengakses API
- Configured untuk localhost (development) dan production URL
- Blocking cross-origin requests dari domain yang tidak dikenal

### 4. **Input Validation & Sanitization**
- Validasi semua input sebelum diproses
- Sanitasi untuk mencegah XSS attacks
- Batasan panjang content (5000 karakter)
- Batasan jumlah history (50 messages)

### 5. **Security Headers (Helmet.js)**
```javascript
- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security
```

### 6. **Request Size Limiting**
```javascript
// Body size limit: 10KB
```
Mencegah memory exhaustion attacks

### 7. **Error Handling yang Aman**
- Tidak mengekspos internal error details ke client
- Generic error messages untuk user
- Detailed logs hanya di server

## 🚫 Apa yang TIDAK Boleh Dilakukan

### ❌ JANGAN pernah:
1. Commit file `.env` ke Git
2. Share API key di public repositories
3. Hardcode API keys di kode
4. Disable security middleware tanpa alasan kuat
5. Expose backend errors ke frontend
6. Menggunakan `dangerouslyAllowBrowser: true` di production

## ✅ Best Practices

### 1. **Environment Variables**
```bash
# ✅ BENAR - gunakan .env
GROQ_API_KEY=your_secret_key

# ❌ SALAH - jangan hardcode
const apiKey = "gsk_abc123..."
```

### 2. **Git Security**
Pastikan `.gitignore` includes:
```
.env
.env.local
.env.production
server/.env
server/node_modules
```

### 3. **API Key Rotation**
- Rotate API keys secara berkala (setiap 3-6 bulan)
- Segera rotate jika tercurigai bocor
- Gunakan key yang berbeda untuk development dan production

### 4. **Monitoring**
Monitor untuk aktivitas mencurigakan:
- Spike dalam request count
- Repeated failed requests
- Unusual payload sizes
- Requests dari IP yang tidak dikenal

## 🔍 Cara Memverifikasi Keamanan

### Test 1: API Key Tidak Terekspos
1. Buka browser DevTools (F12)
2. Navigate ke Network tab
3. Kirim message di chatbot
4. Check request headers dan body
5. **Verifikasi**: Tidak ada API key yang terlihat

### Test 2: CORS Protection
```bash
# Coba akses dari origin yang tidak diizinkan
curl -X POST http://localhost:3001/api/chat \
  -H "Origin: http://evil-site.com" \
  -H "Content-Type: application/json" \
  -d '{"content":"test","history":[],"promptMode":"pacar"}'

# Expected: CORS error
```

### Test 3: Rate Limiting
```bash
# Kirim > 10 requests dalam 1 menit
for i in {1..15}; do
  curl -X POST http://localhost:3001/api/chat \
    -H "Content-Type: application/json" \
    -d '{"content":"test","history":[],"promptMode":"pacar"}'
done

# Expected: Rate limit error setelah request ke-10
```

### Test 4: Input Validation
```bash
# Test dengan content kosong
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"content":"","history":[],"promptMode":"pacar"}'

# Expected: 400 Bad Request
```

## 🐛 Melaporkan Kerentanan Keamanan

Jika menemukan kerentanan keamanan:

1. **JANGAN** buat public issue
2. Email langsung ke: [your-email@example.com]
3. Include:
   - Deskripsi vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (jika ada)

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Rate Limiting Guide](https://github.com/express-rate-limit/express-rate-limit)

## 🔄 Security Update History

### Version 2.0.0 (December 2025)
- ✅ Implemented backend proxy server
- ✅ Removed API keys from frontend
- ✅ Added rate limiting
- ✅ Added CORS protection
- ✅ Added input validation
- ✅ Added security headers
- ✅ Added request size limits

### Version 1.0.0 (Initial)
- ⚠️ API keys exposed in browser (VULNERABLE)
- ⚠️ No rate limiting
- ⚠️ No input validation

## 🎯 Compliance

Aplikasi ini mengikuti standar:
- ✅ OWASP API Security Top 10
- ✅ CWE Top 25 Most Dangerous Software Weaknesses
- ✅ GDPR-ready (no personal data collection)

## 📞 Support

Untuk pertanyaan keamanan:
- GitHub Issues: [Link to repo]
- Email: [your-email@example.com]

---

**Remember: Security is not a feature, it's a requirement!** 🔒
