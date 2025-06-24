import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { refreshToken, me } from "../controllers/refreshTokenController.js";
import { checkAuth } from "../middelware/checkAuth.js";
import rateLimit from 'express-rate-limit';
const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      status: 'error',
      data: {},
      message: 'Too many requests, please try again later',
      code: 429
    }
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", checkAuth, (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({
      status: 'success',
      data: {},
      message: 'Logout successful',
      code: 200
  });
});
router.get('/me', checkAuth, me);
router.post("/refresh", refreshToken);

export default router;