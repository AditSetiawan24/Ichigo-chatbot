# Changelog - Ichigo Chatbot

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-12-06

### 🔒 MAJOR SECURITY UPDATE

#### Added
- **Backend Proxy Server**: Implemented Express.js backend server to act as a secure proxy between frontend and Groq API
- **Rate Limiting**: Added express-rate-limit middleware
  - Global: 50 requests per 15 minutes
  - Chat endpoint: 10 requests per minute
- **CORS Protection**: Implemented strict CORS policy with whitelist
- **Security Headers**: Added Helmet.js for security headers
  - Content-Security-Policy
  - X-Content-Type-Options
  - X-Frame-Options
  - Strict-Transport-Security
- **Input Validation**: Comprehensive validation for all user inputs
  - Content length limits (5000 characters)
  - History length limits (50 messages)
  - Role validation
- **Input Sanitization**: XSS protection through input sanitization
- **Request Size Limits**: Body parser with 10KB limit
- **Error Handling**: Secure error handling that doesn't expose internal details
- **Health Check Endpoint**: `/api/health` for monitoring
- **Environment Variables**: Proper separation of frontend and backend env vars
- **Documentation**: Added comprehensive security documentation
  - SECURITY.md - Security guide
  - DEPLOYMENT.md - Deployment instructions
  - QUICKSTART.md - Quick start guide
- **Setup Scripts**: Added automation scripts
  - setup.bat / setup.sh - Automated setup
  - start.bat / start.sh - Easy server startup
- **Vercel Configuration**: Added vercel.json for easy deployment

#### Changed
- **API Key Storage**: Moved API keys from frontend to backend (BREAKING CHANGE)
- **API Communication**: Changed from direct Groq SDK calls to backend API calls
- **groq.js**: Completely refactored to use fetch API instead of Groq SDK
- **Environment Variables**: Split into frontend (.env) and backend (server/.env)
- **README**: Updated with new setup and security information
- **README(id)**: Updated Indonesian documentation

#### Removed
- **dangerouslyAllowBrowser**: Removed unsafe Groq SDK browser usage
- **Frontend API Keys**: No more API keys or prompts in frontend code
- **Direct Groq Calls**: Frontend no longer calls Groq API directly

#### Security Fixes
- 🚨 **CRITICAL**: API keys no longer exposed in browser
- 🚨 **CRITICAL**: Prompts no longer visible in client-side code
- ✅ Protected against DDoS with rate limiting
- ✅ Protected against XSS attacks with input sanitization
- ✅ Protected against CSRF with CORS policy
- ✅ Protected against common web vulnerabilities with Helmet
- ✅ Protected against memory exhaustion with request size limits

### Migration Guide (v1 to v2)

#### For Users
1. Pull latest changes
2. Run `setup.bat` (Windows) or `./setup.sh` (Linux/Mac)
3. Edit `server/.env` with your API key and prompts
4. Run `start.bat` or `./start.sh`

#### For Developers
```bash
# Old way (v1.x) - INSECURE
# Frontend directly called Groq API with exposed keys
const groq = new Groq({ apiKey: EXPOSED_KEY })

# New way (v2.x) - SECURE
# Frontend calls backend, backend calls Groq API
fetch('http://localhost:3001/api/chat', {...})
```

### Technical Details

#### Architecture Changes
```
Before (v1.x):
Browser --> Groq API (API key exposed!)

After (v2.x):
Browser --> Backend Server --> Groq API (API key secure!)
```

#### New File Structure
```
Ichigo-chatbot/
├── server/              # NEW: Backend server
│   ├── index.js        # Express server with security
│   ├── package.json    # Backend dependencies
│   └── .env           # Backend environment (gitignored)
├── src/
│   └── utils/
│       └── groq.js    # CHANGED: Now calls backend API
├── SECURITY.md        # NEW: Security documentation
├── DEPLOYMENT.md      # NEW: Deployment guide
├── QUICKSTART.md      # NEW: Quick start guide
├── setup.bat/sh       # NEW: Setup scripts
├── start.bat/sh       # NEW: Start scripts
└── vercel.json        # NEW: Vercel deployment config
```

#### Dependencies Added
Backend:
- express: ^4.19.2
- cors: ^2.8.5
- helmet: ^7.1.0
- express-rate-limit: ^7.4.0
- dotenv: ^16.4.5

#### Breaking Changes
- Frontend environment variables changed:
  - ❌ Removed: VITE_GROQ, VITE_PROMPT_PACAR, VITE_PROMPT_BESTFRIEND
  - ✅ Added: VITE_API_URL
- Backend server required to run application
- Two separate processes needed (frontend + backend)

### Performance
- Minimal performance impact
- Backend adds ~50-100ms latency (acceptable for security)
- Rate limiting prevents abuse and maintains stability

### Browser Compatibility
- Same as before - all modern browsers supported
- No client-side changes affecting compatibility

## [1.0.0] - 2024

### Initial Release
- Basic chatbot functionality
- Groq API integration with llama3 model
- Profile picture customization
- Bot name customization
- Two chat modes: Pacar and Bestfriend
- Vite + React + Tailwind stack

### Known Issues (v1.x)
- ⚠️ API keys exposed in browser (FIXED in v2.0.0)
- ⚠️ No rate limiting (FIXED in v2.0.0)
- ⚠️ No input validation (FIXED in v2.0.0)
- ⚠️ Vulnerable to abuse (FIXED in v2.0.0)

---

## Upcoming Features

### [2.1.0] - Planned
- [ ] User authentication system
- [ ] Chat history cloud sync
- [ ] Multiple AI model support
- [ ] Custom theme support
- [ ] Export chat history
- [ ] Mobile app (React Native)

### [2.2.0] - Planned
- [ ] Voice input/output
- [ ] Image generation integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API key management UI

---

## Support

For security issues, please review [SECURITY.md](./SECURITY.md)

For questions or feature requests, open an issue on GitHub.

---

**Version Naming Convention**: MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)
