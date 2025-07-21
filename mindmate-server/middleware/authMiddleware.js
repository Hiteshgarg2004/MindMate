import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.cookies.token; // JWT token cookie se mil raha hai

  if (!token) {
    return res.status(401).json({ error: "No token found in cookies." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Yahan decoded.userId lena hai, kyunki token me aise hi sign kiya hai
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default auth;
