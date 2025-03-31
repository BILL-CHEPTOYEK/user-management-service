const User = require("../models/userModel");
const { sendEmail } = require("../services/emailService");

exports.verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Only moderators can verify users
        if (req.user.role !== "Moderator") {
            return res.status(403).json({ message: "Access denied. Only moderators can verify users." });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        // Update user verification status
        user.isVerified = true;
        await user.save();

        res.json({ message: "User verified successfully!" });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ message: "Server error while verifying user." });
    }
};

//  Suspend User (with Email Notification)
exports.suspendUserByModerator = async (req, res) => {
    try {
        if (req.user.role !== "Moderator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isSuspended = true;
        await user.save();

        // Send email notification
        await sendEmail(user.email, "Account Suspended", "Your account has been suspended.");

        res.json({ message: "User account suspended and email sent" });
    } catch (error) {
        res.status(500).json({ message: "Error suspending user", error });
    }
};

//  Soft Delete (Moderator Deletes a User)
exports.softDeleteUserByModerator = async (req, res) => {
    try {
        if (req.user.role !== "Moderator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isDeleted = true;
        await user.save();

        // Send email notification
        await sendEmail(user.email, "Account Deactivated", "Your account has been deactivated.");

        res.json({ message: "User account deactivated and email sent" });
    } catch (error) {
        res.status(500).json({ message: "Error deactivating user", error });
    }
};

// Get Any User Profile (Moderator)
exports.getUserProfileById = async (req, res) => {
    try {
        if (req.user.role !== "Moderator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error });
    }
};

// Review User Appeals
exports.reviewAppeal = async (req, res) => {
    try {
        if (req.user.role !== "Moderator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isSuspended = false;
        await user.save();

        // Notify user by email
        await sendEmail(user.email, "Account Reinstated", "Your suspension has been lifted.");

        res.json({ message: "User reinstated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error processing appeal", error });
    }
};