import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const router = express.Router();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing from .env");
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://mind-mate-dun.vercel.app', // ✅ frontend URL for tracking
    'X-Title': 'MindMate',
  },
});

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message must be a non-empty string.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: message }],
      max_tokens: 400,
    });

    const reply = completion.choices?.[0]?.message?.content || "I couldn't generate a reply.";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('❌ OpenRouter GPT Error:', error?.response?.data || error?.message || error);
    return res.status(500).json({
      error: 'Failed to get response from OpenRouter GPT',
      details: error?.response?.data || error?.message,
    });
  }
});

export default router;
