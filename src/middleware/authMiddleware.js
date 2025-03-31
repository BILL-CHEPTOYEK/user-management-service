const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    console.log("🔍 Received Header:", authHeader); // Debugging

    if (!authHeader) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // ✅ Strip "Bearer " if it exists, otherwise use raw token
    const token = authHeader.replace(/^Bearer\s+/i, "");

    console.log("🔍 Extracted Token:", token); // Debugging

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

const moderatorMiddleware = (req, res, next) => {
    if (req.user.role !== "Moderator") {
        return res.status(403).json({ message: "Access denied. Moderator only." });
    }
    next();
};

module.exports = authMiddleware; // Export only the authMiddleware function
module.exports.moderatorMiddleware = moderatorMiddleware; // Export moderator middleware
