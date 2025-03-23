const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Public Routes (Authentication)
router.post("/register", controller.addUser);
router.post("/login", controller.loginUser);

// ✅ Protected Routes (Require Authentication)
router.get("/all", authMiddleware, controller.getUsers);
router.get("/get/:id", authMiddleware, controller.getUser);
router.put("/update/:id", authMiddleware, controller.updateUser);
router.delete("/delete/:id", authMiddleware, controller.deleteUser);

// ✅ NEW: Get current user info from token
router.get("/me", authMiddleware, (req, res) => {
    const user = req.user;
    res.json({
      id: user.sub,
      email: user.email,
      username: user.user_metadata?.username || null
    });
  });
  

module.exports = router;
