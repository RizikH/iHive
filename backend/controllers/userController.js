const supabase = require("../config/db");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ GET /api/users/all
const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET /api/users/get/:id
const getUser = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ POST /api/users/register
const addUser = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, bio }
      }
    });

    if (error) throw new Error(error.message);

    res.status(201).json({ message: "User registered successfully!", user: data.user });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    // Ensure you're sending the token back correctly
    const token = data.session.access_token;
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000
    });
    

    // Send response with user details (without the password)
    res.json({
      token,
      user: {
        id: data.user.id,
        username: data.user.user_metadata.username,
        email: data.user.email
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(401).json({ error: error.message });
  }
};


// ✅ PUT /api/users/update/:id
const updateUser = async (req, res) => {
  const userIdFromToken = req.user?.sub;
  const userIdFromParams = req.params.id;

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({ error: "Forbidden: You can only update your own profile." });
  }

  try {
    const { username, email, bio } = req.body;
    const updatedUser = await User.updateUser(userIdFromParams, username, email, bio);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE /api/users/delete/:id
const deleteUser = async (req, res) => {
  const userIdFromToken = req.user?.sub;
  const userIdFromParams = req.params.id;

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({ error: "Forbidden: You can only delete your own account." });
  }

  try {
    const deletedUser = await User.deleteUser(userIdFromParams);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  loginUser,
  updateUser,
  deleteUser
};
