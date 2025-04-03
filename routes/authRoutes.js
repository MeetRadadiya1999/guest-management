const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Example of a protected route
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Access granted!", user: req.user });
});



module.exports = router;
