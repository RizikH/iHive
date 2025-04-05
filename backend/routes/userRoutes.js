const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

// ✅ Public Routes (Authentication)
router.post("/register", controller.addUser);
router.post("/login", controller.loginUser);

// ✅ Protected Routes (Require Authentication)
router.get("/all", authMiddleware, controller.getUsers);
router.get("/get/:id", authMiddleware, controller.getUser);
router.put("/update/:id", authMiddleware, controller.updateUser);
router.delete("/delete/:id", authMiddleware, controller.deleteUser);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
});
// ✅ NEW: Get current user info from token
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
router.get("/me", authRateLimiter, authMiddleware, (req, res) => {
  const user = req.user;
  res.json({
    id: user.sub,
    email: user.email,
    username: user.user_metadata?.username || null
  });
});


module.exports = router;
