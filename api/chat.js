// Vercel Serverless Function untuk handle chat API
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Simple in-memory rate limiting (resets on cold start)
const requestCounts = new Map();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}

// Helper function untuk sanitasi input
const sanitizeInput = (text) => {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

// Validate request
const validateRequest = (body) => {
  const { content, history, promptMode } = body;

  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Content harus berupa string yang valid' };
  }

  if (content.length > 5000) {
    return { valid: false, error: 'Content terlalu panjang (max 5000 karakter)' };
  }

  if (!Array.isArray(history)) {
    return { valid: false, error: 'History harus berupa array' };
  }

  if (history.length > 50) {
    return { valid: false, error: 'History terlalu panjang (max 50 messages)' };
  }

  const validRoles = ['user', 'assistant', 'ai'];
  for (const msg of history) {
    if (!msg.content || typeof msg.content !== 'string') {
      return { valid: false, error: 'Setiap message harus memiliki content yang valid' };
    }
    if (!msg.role || !validRoles.includes(msg.role)) {
      return { valid: false, error: 'Role message tidak valid' };
    }
    if (msg.content.length > 5000) {
      return { valid: false, error: 'Message dalam history terlalu panjang' };
    }
  }

  if (!promptMode || !['pacar', 'bestfriend'].includes(promptMode)) {
    return { valid: false, error: 'Prompt mode tidak valid' };
  }

  return { valid: true };
};

export default async function handler(req, res) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // In production, set to your domain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Request-ID');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ 
      error: 'Terlalu banyak request. Tunggu 1 menit dan coba lagi.' 
    });
  }

  try {
    const { content, history, promptMode } = req.body;

    // Validate request
    const validation = validateRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Sanitize input
    const sanitizedContent = sanitizeInput(content);

    // Transform history
    const messageHistory = history.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : msg.role,
      content: sanitizeInput(msg.content),
    }));

    // Get prompt
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
      model: 'llama-3.1-8b-instant',
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const aiResponse = reply.choices[0]?.message?.content || 'Maaf, tidak ada response.';

    // Return response
    return res.status(200).json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit tercapai, coba lagi nanti' });
    }
    
    return res.status(500).json({ 
      error: 'Terjadi kesalahan pada server, silakan coba lagi' 
    });
  }
}
