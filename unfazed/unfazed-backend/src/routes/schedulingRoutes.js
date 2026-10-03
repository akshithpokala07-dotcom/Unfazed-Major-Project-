const express = require("express");

const {
    getAvailableSlots,
    bookSession,
    setAvailability
} = require("../controllers/schedulingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public: clients can view available slots
router.get("/availability", getAvailableSlots);

// Public: clients can book a session
router.post("/book", bookSession);

// Therapist: protected scheduling endpoint
router.get("/therapist/availability", authMiddleware, getAvailableSlots);

router.post(
    "/therapist/availability",
    authMiddleware,
    setAvailability
);

module.exports = router;