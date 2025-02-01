const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Add the /me route to verify the user.
router.get("/me", protect, (req, res) => {
  // Send back the decoded token (or you could query the DB for more details)
  res.json(req.user);
});

module.exports = router;
