const supabase = require("../config/db");

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        // Validate Supabase Auth token
        const { data, error } = await supabase.auth.getUser(token.replace("Bearer ", ""));

        if (error || !data || !data.user) {
            return res.status(401).jssson({ message: "Invalid or expired token.", error });
        }

        // Attach authenticated user to request
        req.user = data.user;
        next();
    } catch (err) {
        console.error("Error verifying token:", err);
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
