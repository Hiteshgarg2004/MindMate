// routes/chatbotRoutes.js
import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173', // ✅ Optional: for tracking on openrouter
    'X-Title': 'MindMate',                   // ✅ Optional: name of your app/site
  },
});

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: message }],
       max_tokens: 400

    });

    const reply = completion.choices?.[0]?.message?.content || "I couldn't generate a reply.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenRouter GPT Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from OpenRouter GPT' });
  }
});

export default router;
