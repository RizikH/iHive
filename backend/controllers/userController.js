const User = require("../models/User");

// GET /api/users/all
const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users/get/:id
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

// POST /api/users/new
const addUser = async (req, res) => {
    try {
        const { username, email, password, bio } = req.body;
        const newUser = await User.createUser(username, email, password, bio);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/update/:id
const updateUser = async (req, res) => {
    try {
        const { username, email, bio } = req.body;
        const updatedUser = await User.updateUser(req.params.id, username, email, bio);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/users/delete/:id
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.deleteUser(req.params.id);
        if (deletedUser) {
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
};
