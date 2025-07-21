import User from "../models/User.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

// =============================
// ✅ SIGNUP
// =============================
export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",     // ✅ for cross-site cookies
      secure: true,         // ✅ must be true when using "None"
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};

// =============================
// ✅ LOGIN
// =============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please enter email and password." });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",     // ✅
      secure: true,         // ✅
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

// =============================
// ✅ LOGOUT
// =============================
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None", // ✅ match above
      secure: true,     // ✅
    });
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};

// =============================
// ✅ GET ME
// =============================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Get Me error:", error.message);
    res.status(500).json({ message: `Get Me error: ${error.message}` });
  }
};
