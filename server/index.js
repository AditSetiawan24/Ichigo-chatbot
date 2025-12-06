import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq client (server-side only, secure)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration - restrict to your frontend domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-ID'],
}));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Terlalu banyak request dari IP ini, coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: 'Terlalu banyak request, tunggu sebentar.',
});

app.use('/api/', limiter);
app.use('/api/chat', strictLimiter);

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

// Input validation middleware
const validateChatRequest = (req, res, next) => {
  const { content, history, promptMode } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content harus berupa string yang valid' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ error: 'Content terlalu panjang (max 5000 karakter)' });
  }

  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'History harus berupa array' });
  }

  if (history.length > 50) {
    return res.status(400).json({ error: 'History terlalu panjang (max 50 messages)' });
  }

  // Validate history messages
  const validRoles = ['user', 'assistant', 'ai'];
  for (const msg of history) {
    if (!msg.content || typeof msg.content !== 'string') {
      return res.status(400).json({ error: 'Setiap message harus memiliki content yang valid' });
    }
    if (!msg.role || !validRoles.includes(msg.role)) {
      return res.status(400).json({ error: 'Role message tidak valid' });
    }
    if (msg.content.length > 5000) {
      return res.status(400).json({ error: 'Message dalam history terlalu panjang' });
    }
  }

  if (!promptMode || !['pacar', 'bestfriend'].includes(promptMode)) {
    return res.status(400).json({ error: 'Prompt mode tidak valid' });
  }

  next();
};

// Sanitize input to prevent injection
const sanitizeInput = (text) => {
  // Remove potentially dangerous characters but keep normal text
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main chat endpoint
app.post('/api/chat', validateChatRequest, async (req, res) => {
  try {
    const { content, history, promptMode } = req.body;

    // Sanitize user content
    const sanitizedContent = sanitizeInput(content);

    // Transform history from frontend format to Groq format
    const messageHistory = history.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : msg.role,
      content: sanitizeInput(msg.content),
    }));

    // Get prompt based on mode
    const prompt = promptMode === 'pacar' 
      ? process.env.PROMPT_PACAR 
      : process.env.PROMPT_BESTFRIEND;

    if (!prompt) {
      return res.status(500).json({ error: 'Prompt tidak ditemukan' });
    }

    // Call Groq API
    const reply = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        ...messageHistory,
        {
          role: 'user',
          content: sanitizedContent,
        },
      ],
      model: 'llama-3.1-8b-instant', // Updated to supported model
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const aiResponse = reply.choices[0]?.message?.content || 'Maaf, tidak ada response.';

    // Return only the response, no sensitive data
    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Don't expose internal error details
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit tercapai, coba lagi nanti' });
    }
    
    res.status(500).json({ 
      error: 'Terjadi kesalahan pada server, silakan coba lagi' 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
  console.log(`🔒 Secure backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
