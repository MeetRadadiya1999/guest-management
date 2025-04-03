const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// User Registration
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// User Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        console.log("❌ User not found");
        return res.status(400).json({ message: "Invalid email" });
      }
  
      console.log("🔹 Password from request:", password);
      console.log("🔹 Hashed password from DB:", user.password);
  
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        console.log("❌ Password does not match");
        return res.status(400).json({ message: "Invalid password" });
      }
  
      console.log("✅ Password matched!");
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ message: "Login successful", token });
    } catch (error) {
      console.log("❌ Server error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  

module.exports = { registerUser, loginUser };
