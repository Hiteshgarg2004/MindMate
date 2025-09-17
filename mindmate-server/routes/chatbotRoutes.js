// routes/chatbotRoutes.js
import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai'; // Groq's API is compatible with the OpenAI SDK

// Load environment variables from .env file
dotenv.config();

console.log('Groq API Key Loaded:', process.env.GROQ_API_KEY ? 'Yes' : 'No');
// console.log('Full Key (for debugging):', process.env.GROQ_API_KEY); // Use cautiously, don't leave in production
const router = express.Router();

// --- OpenAI API Client Initialization for Groq ---
// Initialize the OpenAI client, pointing its baseURL to Groq's API endpoint.
// The API key will be read from the GROQ_API_KEY environment variable.
const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1', // Groq's API base URL
  apiKey: process.env.GROQ_API_KEY,        // Your Groq API Key
  // Note: OpenRouter-specific headers like HTTP-Referer and X-Title are not needed for Groq.
});

// --- POST /chat Endpoint ---
// Handles incoming chat messages from the frontend and sends them to the Groq AI.
router.post('/', async (req, res) => {
  const { message } = req.body; // Extract the message from the request body

  // --- Input Validation ---
  // Ensure the message is provided and is a non-empty string.
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message must be a non-empty string.' });
  }

  try {
    // --- Call to Groq API ---
    // Create a chat completion using a Groq-supported model and the user message.
    const completion = await openai.chat.completions.create({
      // IMPORTANT: Choose a model available on Groq.
      // Common Groq models include 'llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768'.
      // 'openai/gpt-4o' is an OpenAI model and will not work directly with Groq.

      model: 'llama-3.1-8b-instant',

      messages: [{ role: 'user', content: message }], // The conversation history
      max_tokens: 400, // Limit the length of the bot's response
    });

    // Extract the bot's reply from the completion response.
    const reply = completion.choices?.[0]?.message?.content || "I couldn't generate a reply.";

    // Send the bot's reply back to the client with a 200 OK status.
    return res.status(200).json({ reply });
  } catch (error) {
    // --- Error Handling ---
    // Log the detailed error on the server side for debugging.
    console.error('❌ Groq API Error:', error?.response?.data || error?.message || error);

    // Send a generic 500 Internal Server Error response to the client.
    return res.status(500).json({
      error: 'Failed to get response from Groq AI',
      details: error?.response?.data || error?.message, // Provide details if available
    });
  }
});

export default router;
