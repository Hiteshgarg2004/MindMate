import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // ✅ Add this
dotenv.config();

import connectDb from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import chatbotRoutes from './routes/chatbotRoutes.js';


const app = express();
const port = process.env.PORT || 5000;

connectDb();
// ✅ CORS setup for credentials + specific origin
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // ✅ required for res.cookie to work properly

app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use('/api/chat', chatbotRoutes);

// Optional: Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
