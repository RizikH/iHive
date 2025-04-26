const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");
const isProduction = process.env.NODE_ENV === "production";


// ✅ NEW: Get current user info from token
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// ✅ Public Routes (Authentication)
router.post("/register", authRateLimiter, controller.addUser);
router.post("/login", authRateLimiter, controller.loginUser);


router.use(authRateLimiter);
// ✅ Protected Routes (Require Authentication)
router.get("/all", authMiddleware, controller.getUsers);
router.post("/all", authMiddleware, controller.getUsersByQuery);

router.get("/get/:id", authMiddleware, controller.getUser);
router.put("/update", authMiddleware, controller.updateUser);
router.delete("/delete/:id", authMiddleware, controller.deleteUser);

router.put("/update/login/", authMiddleware, controller.updateUserLogin);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
});


router.get("/me", authMiddleware, (req, res) => {
  const user = req.user;
  res.json({
    id: user.sub,
    email: user.email,
    username: user.user_metadata?.username || null
  });
});

module.exports = router;
