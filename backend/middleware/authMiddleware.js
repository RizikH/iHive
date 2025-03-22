const supabase = require("../config/db");

const authMiddleware = async (req, res, next) => {
    const token =
        req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        req.user = data.user;
        next();
    } catch (err) {
        console.error("Token error:", err);
        res.status(400).json({ message: "Invalid Token" });
    }
};


module.exports = authMiddleware;
