const jwt = require("jsonwebtoken");

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

const authenticate = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
<<<<<<< HEAD
    // Decode token without verifying to inspect its payload
    const decoded = jwt.decode(token);
    console.log("Decoded token:", decoded);

    // Verify the token with the JWT secret
    const verified = jwt.verify(token, SUPABASE_JWT_SECRET);
    console.log("🔐 Token verified successfully:", verified);

    // If verification is successful, attach the user to the request object
    req.user = verified;

    next(); // Proceed to the next middleware or route handler
=======
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
>>>>>>> 3db0a07ea6c002eef2169dd3a08d3b97afae6387
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticate;