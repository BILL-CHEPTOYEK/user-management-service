const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { requestVerification } = require("../controllers/userController");
const { getAllUsers, getUserById } = require('../controllers/userController');
const upload = require("../middleware/uploadMiddleware"); // Multer for file uploads
const {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePicture,
    softDeleteAccount,
    requestSuspensionAppeal,
    searchUsers
} = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "User API working!" });
});

// User Profile Routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/upload-profile-pic", authMiddleware, upload.single("profilePic"), uploadProfilePicture);
router.delete("/delete-account", authMiddleware, softDeleteAccount);

// User Requests Appeal
router.post("/appeal-suspension", authMiddleware, requestSuspensionAppeal);


// User requests to be verified
router.post("/request-verification", authMiddleware, requestVerification);

// GET all users (Moderator only)
router.get('/get-all-users', authMiddleware, getAllUsers);

// GET single user (User can fetch their own, Moderator can fetch any)
router.get('/get-user/:id', authMiddleware, getUserById);

// search users
router.get("/search", authMiddleware, searchUsers);

module.exports = router;
