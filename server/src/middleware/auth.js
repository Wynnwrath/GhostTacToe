import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: { message: "Not authenticated" } });
  }

  const payload = verifyToken(header.split(" ")[1]);
  if (!payload) {
    return res.status(401).json({ success: false, error: { message: "Invalid token" } });
  }

  const user = await User.findById(payload.sub).lean();
  if (!user) {
    return res.status(404).json({ success: false, error: { message: "User not found" } });
  }

  req.user = user;
  next();
}

export function getUserIdFromToken(token) {
  const payload = verifyToken(token);
  return payload ? payload.sub : null;
}
