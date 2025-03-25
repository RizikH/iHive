const jwt = require("jsonwebtoken");

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!SUPABASE_JWT_SECRET) {
  console.error("❌ SUPABASE_JWT_SECRET is not set in the environment variables.");
}

const authenticate = (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {  // Check for token in cookies
    token = req.cookies.token;
  }

  // If no token, return unauthorized error
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Decode token without verifying to inspect its payload
    const decoded = jwt.decode(token);
    console.log("Decoded token:", decoded);

    // Verify the token with the JWT secret
    const verified = jwt.verify(token, SUPABASE_JWT_SECRET);
    console.log("🔐 Token verified successfully:", verified);

    // If verification is successful, attach the user to the request object
    req.user = verified;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("❌ JWT verification failed:", err);

    // If the error is a token expiration error, handle it differently
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }

    // Handle other types of JWT verification errors
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticate;
