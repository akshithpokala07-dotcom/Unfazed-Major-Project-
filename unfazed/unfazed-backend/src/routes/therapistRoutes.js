const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
    getPublicTherapistProfile
} = require("../controllers/therapistController");

// Get logged-in therapist profile
router.get("/profile", authMiddleware, getProfile);

// Update logged-in therapist profile
router.put("/profile", authMiddleware, updateProfile);

router.get("/public/:slug", getPublicTherapistProfile);

module.exports = router;