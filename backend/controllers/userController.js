const User = require("../models/User");
const supabase = require("../config/db");

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
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
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
            return res.status(400).json({ error: "All fields (username, email, password) are required." });
        }

        const newUser = await User.createUser(username, email, password, bio || "");
        res.status(201).json({ message: "User registered successfully!", user: newUser });
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

        // Return the token and user info
        res.json({ token: data.session.access_token, user: data.user });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(401).json({ error: error.message });
    }
};

// ✅ PUT /api/users/update/:id
const updateUser = async (req, res) => {
    try {
        const { username, email, bio } = req.body;
        const updatedUser = await User.updateUser(req.params.id, username, email, bio);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ DELETE /api/users/delete/:id
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.deleteUser(req.params.id);
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
