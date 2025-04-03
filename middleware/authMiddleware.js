const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next(); // Proceed to next middleware or route
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
