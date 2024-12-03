const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    jwt.verify(token, "dswTM", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user; // Add decoded user info to the request object
      next(); // Proceed to the next middleware/route
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error during authentication" });
  }
};

module.exports = { authenticateToken };
