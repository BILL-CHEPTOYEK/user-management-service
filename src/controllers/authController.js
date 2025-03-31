const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");

// Register a New User
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if user exists
        let userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with default role "User" and unverified status
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "User",
            isVerified: false
        });

        res.status(201).json({ message: "User registered successfully!", user });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// User Login
exports.loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Validate Request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role, isVerified: user.isVerified },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
