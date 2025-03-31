const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../services/emailService");
const { Op } = require("sequelize");

// request verification
exports.requestVerification = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "You are already verified" });
        }

        // Here, we assume a system where verification requests are stored/logged
        console.log(`User ${user.username} has requested verification.`);

        res.json({ message: "Verification request sent. A moderator will review it." });
    } catch (error) {
        console.error("Error requesting verification:", error);
        res.status(500).json({ message: "Server error while requesting verification." });
    }
};

// Get all users (Moderator only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Get a single user
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user.id;
        const requestingUserRole = req.user.role;

        // Allow user to get their own data or moderator to fetch any user
        if (id !== requestingUserId && requestingUserRole !== 'Moderator') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Get Logged-in User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error });
    }
};

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.profilePicture = req.file.path;
        await user.save();
        res.json({ message: "Profile picture updated", profilePicture: user.profilePicture });
    } catch (error) {
        res.status(500).json({ message: "Error uploading profile picture", error });
    }
};

// Soft Delete Account (Instead of Permanent Deletion)
exports.softDeleteAccount = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isDeleted = true;
        await user.save();

        res.json({ message: "Account deactivated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deactivating account", error });
    }
};

// user makes suspension appeal
exports.requestSuspensionAppeal = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.isSuspended) {
            return res.status(400).json({ message: "Your account is not suspended" });
        }

        console.log(`User ${user.username} has requested an appeal.`);

        await sendEmail(process.env.MODERATOR_EMAIL, "User Appeal Request",
            `User ${user.username} (${user.email}) has requested an appeal for suspension.`);

        res.json({ message: "Appeal request sent to moderators." });
    } catch (error) {
        res.status(500).json({ message: "Error requesting appeal", error });
    }
};

// Advanced Search & Filtering for Users
exports.searchUsers = async (req, res) => {
    try {
        const { username, email, role, isVerified, startDate, endDate } = req.query;
        const filters = {};

        if (username) filters.username = { [Op.like]: `%${username}%` }; // Partial match  
        if (email) filters.email = email; // Exact match  
        if (role) filters.role = role; // Moderator/User  
        if (isVerified !== undefined) filters.isVerified = isVerified === "true"; // Convert string to boolean  

        // Date Range Filtering (createdAt column)
        if (startDate && endDate) {
            filters.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const users = await User.findAll({
            where: filters,
            attributes: { exclude: ["password"] },
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error searching users", error });
    }
};
