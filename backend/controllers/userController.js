const supabase = require("../config/db");
const User = require("../models/User");
const jwt = require("jsonwebtoken");



// ✅ GET /api/users/all
const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ✅ POST /api/users/all
const getUsersByQuery = async (req, res) => {
  try {
    const {
      query,
      excludeId
    } = req.body;
    const users = await User.getUsersByQuery(query, excludeId);
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ✅ GET /api/users/get/:id
const getUser = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({
      message: "User not found"
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ✅ POST /api/users/register
const addUser = async (req, res) => {
  try {
    const { username, email, password, bio, avatar, userType } = req.body;
    console.debug("addUser request body:", req.body);

    if (!username || !email || !password || !userType) {
      return res.status(400).json({ error: "Username, email, password, and user type are required." });
    }

    // 1. Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, bio, avatar },
      },
    });

    if (error) {
      console.error("Supabase signUp error:", error.message);

      // Handle duplicate email from Supabase Auth (rare, but possible)
      if (error.message.toLowerCase().includes("user already registered")) {
        return res.status(409).json({ error: "User with this email already exists." });
      }

      return res.status(400).json({ error: error.message });
    }

    const authUser = data.user;

    if (!authUser) {
      return res.status(500).json({ error: "Signup succeeded but no user returned." });
    }

    // 2. Add user to public.users table
    try {
      await User.createUser({
        id: authUser.id,
        username: authUser.user_metadata.username,
        email: authUser.email,
        avatar: avatar || null,
        bio: bio || null,
        user_type: userType,
      });
    } catch (dbError) {
      console.error("Database insert error:", dbError);

      if (
        dbError.message.includes('duplicate key') &&
        dbError.message.includes('users_email_key')
      ) {
        return res.status(409).json({ error: "User with this email already exists." });
      }

      return res.status(500).json({ error: "Failed to save user to database." });
    }

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: authUser.id,
        email: authUser.email,
        username,
        bio,
        avatar,
      },
    });

  } catch (err) {
    console.error("Unexpected addUser error:", err);
    return res.status(500).json({ error: "An unexpected error occurred during registration." });
  }
};


// ✅ POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required."
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }

    const token = data.session.access_token;

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const user = await User.getUserById(data.user.id);

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(401).json({
      error: error.message
    });
  }
};

// ✅ PUT /api/users/update/:id
const updateUser = async (req, res) => {
  const userIdFromToken = req.user?.sub;
  const userIdFromParams = req.query.id;

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({
      error: "Forbidden: You can only update your own profile."
    });
  }

  try {
    const updatedUser = await User.updateUser(userIdFromParams, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ✅ PUT /api/users/update/login/:id
const updateUserLogin = async (req, res) => {
  const userIdFromToken = req.user?.sub;
  const userIdFromParams = req.body.id;

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({
      error: "Forbidden: You can only update your own profile.",
    });
  }

  const { currentPassword, newPassword, email } = req.body;

  if (!currentPassword || !newPassword || !email) {
    return res.status(400).json({
      error: "Missing current password, new password, or email.",
    });
  }

  try {
    // Step 1: Try to re-authenticate with current password
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (loginError) {
      return res.status(401).json({
        error: "Current password is incorrect.",
      });
    }

    // Step 2: Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return res.status(400).json({
        error: updateError.message,
      });
    }

    res.json({
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};



// ✅ DELETE /api/users/delete/:id
const deleteUser = async (req, res) => {
  const userIdFromToken = req.user?.sub;
  const userIdFromParams = req.params.id;

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({
      error: "Forbidden: You can only delete your own account."
    });
  }

  try {
    const deletedUser = await User.deleteUser(userIdFromParams);
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    res.json({
      message: "User deleted successfully",
      deletedUser
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  loginUser,
  updateUser,
  deleteUser,
  getUsersByQuery,
  updateUserLogin,
};
