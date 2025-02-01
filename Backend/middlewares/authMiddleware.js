//authMiddlewares.js
const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  // Try to get the token from cookie OR from the Authorization header.
  const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains at least { id: userId }
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
