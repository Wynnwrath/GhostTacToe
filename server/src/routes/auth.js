import { Router } from "express";
import { z } from "zod";
import User from "../models/User.js";
import { hashPassword, comparePassword, createToken } from "../utils/jwt.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const registerSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);

    const existing = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { message: "Username or email already taken" },
      });
    }

    const user = await User.create({
      username: data.username,
      email: data.email,
      passwordHash: hashPassword(data.password),
    });

    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, username: user.username, email: user.email, wins: user.wins, losses: user.losses },
      },
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user || !comparePassword(data.password, user.passwordHash)) {
      return res.status(401).json({
        success: false,
        error: { message: "Invalid email or password" },
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = createToken(user._id);
    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, username: user.username, email: user.email, wins: user.wins, losses: user.losses },
      },
    });
  })
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = req.user;
    res.json({
      success: true,
      data: { id: user._id, username: user.username, email: user.email, wins: user.wins, losses: user.losses },
    });
  })
);

export default router;
