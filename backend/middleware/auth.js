const supabase = require("../config/db");

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    console.error("❌ Token verification failed:", error?.message);
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = { ...user, sub: user.id };
  next();
};

module.exports = authenticate;
