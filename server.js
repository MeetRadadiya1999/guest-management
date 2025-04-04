const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // Corrected import
const protectedRoutes = require("./routes/protected");
const eventRoutes = require("./routes/eventRoutes");
const guestRoutes = require("./routes/guestRoutes");
require("dotenv").config();



// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to Guest Management System API");
});

app.use("/api/protected", protectedRoutes);

// event routes
app.use("/api/events", eventRoutes);

//guest invite 
app.use("/api/guests", guestRoutes);


app.use(cors({ origin: "https://guest-management-frontend.vercel.app", credentials: true }));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
