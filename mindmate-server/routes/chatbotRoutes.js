// routes/chatbotRoutes.js
import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai'; // Importing the OpenAI library

// Load environment variables from .env file
dotenv.config();

const router = express.Router();

// --- Environment Variable Check ---
// It's good practice to log if the API key is missing during server startup,
// especially for debugging deployment issues.
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing from .env. Please ensure it's set for your Render deployment.");
  // Optionally, you might want to throw an error or exit the process if the key is critical
  // process.exit(1);
}

// --- OpenAI API Client Initialization ---
// Initialize the OpenAI client with OpenRouter's base URL and your API key.
// The defaultHeaders are for OpenRouter's tracking/attribution.
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://mind-mate-dun.vercel.app', // This should be your frontend's deployed URL
    'X-Title': 'MindMate',                               // A title for your application
  },
});

// --- POST /chat Endpoint ---
// Handles incoming chat messages from the frontend and sends them to the OpenRouter AI.
router.post('/', async (req, res) => {
  const { message } = req.body; // Extract the message from the request body

  // --- Input Validation ---
  // Ensure the message is provided and is a string.
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message must be a non-empty string.' });
  }

  try {
    // --- Call to OpenRouter GPT API ---
    // Create a chat completion using the specified model and user message.
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o', // The model you want to use (e.g., 'openai/gpt-4o', 'mistralai/mistral-7b-instruct')
      messages: [{ role: 'user', content: message }], // The conversation history (here, just the current user message)
      max_tokens: 400, // Limit the length of the bot's response
    });

    // Extract the bot's reply from the completion response.
    // Use optional chaining and fallback for safety.
    const reply = completion.choices?.[0]?.message?.content || "I couldn't generate a reply.";

    // Send the bot's reply back to the client with a 200 OK status.
    return res.status(200).json({ reply });
  } catch (error) {
    // --- Error Handling ---
    // Log the detailed error on the server side for debugging.
    // Try to get specific error data from OpenRouter's response, or fallback to general error messages.
    console.error('❌ OpenRouter GPT Error:', error?.response?.data || error?.message || error);

    // Send a generic 500 Internal Server Error response to the client,
    // optionally including more details for client-side debugging (though be cautious with sensitive info).
    return res.status(500).json({
      error: 'Failed to get response from OpenRouter GPT',
      details: error?.response?.data || error?.message, // Provide more details to client if available
    });
  }
});

export default router;
