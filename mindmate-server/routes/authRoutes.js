// routes/authRoutes.js
import express from "express";

import { signUp, login, logOut, getMe } from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logOut);
router.get("/", auth, getMe); // ✅ Login status check route


export default router;
