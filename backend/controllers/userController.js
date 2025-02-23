const User = require("../models/User");

<<<<<<< HEAD
// GET /api/users
=======
// GET /api/users/all
>>>>>>> ad799857b41ed223965f1f08d12ef6e74912981f
const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

<<<<<<< HEAD
// GET /api/users/:id
=======
// GET /api/users/get/:id
>>>>>>> ad799857b41ed223965f1f08d12ef6e74912981f
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

<<<<<<< HEAD
// POST /api/users
=======
// POST /api/users/new
>>>>>>> ad799857b41ed223965f1f08d12ef6e74912981f
const addUser = async (req, res) => {
    try {
        const { username, email, password, bio } = req.body;
        const newUser = await User.createUser(username, email, password, bio);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

<<<<<<< HEAD
// PUT /api/users/:id
=======
// PUT /api/users/update/:id
>>>>>>> ad799857b41ed223965f1f08d12ef6e74912981f
const updateUser = async (req, res) => {
    try {
        const { username, email, bio } = req.body;
        const updatedUser = await User.updateUser(req.params.id, username, email, bio);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

<<<<<<< HEAD
// DELETE /api/users/:id
=======
// DELETE /api/users/delete/:id
>>>>>>> ad799857b41ed223965f1f08d12ef6e74912981f
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
