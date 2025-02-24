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
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ POST /api/users/register (User Registration)
const addUser = async (req, res) => {
    try {
        const { username, email, password, bio } = req.body;

        // Register user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw new Error(error.message);

        const userId = data.user.id; // Supabase Auth user ID

        // Store additional user info in the database
        const newUser = await User.createUser(userId, username, email, bio);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ POST /api/users/login (User Login)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw new Error(error.message);

        res.json({ token: data.session.access_token, user: data.user });
    } catch (error) {
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
        // Remove from Supabase Auth
        const { error: authError } = await supabase.auth.admin.deleteUser(req.params.id);
        if (authError) throw new Error(authError.message);

        // Remove from database
        const deletedUser = await User.deleteUser(req.params.id);
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
