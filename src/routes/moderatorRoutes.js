const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { verifyUser, softDeleteUserByModerator, getUserProfileById, suspendUserByModerator, reviewAppeal } = require("../controllers/moderatorController");

const router = express.Router();

// Moderator verifies a user
router.patch("/verify-user/:userId", authMiddleware, verifyUser);

// Moderator Routes
router.get("/profile/:id", authMiddleware, getUserProfileById);
router.delete("/delete-user/:id", authMiddleware, softDeleteUserByModerator);
router.put("/suspend-user/:id", authMiddleware, suspendUserByModerator); // Suspend user
router.put("/review-appeal/:id", authMiddleware, reviewAppeal);

module.exports = router;
