const express = require("express");

const {
    getClients,
    getClientDetails,
    updateClientIntake
} = require("../controllers/clientController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Therapist: get all clients
router.get(
    "/",
    authMiddleware,
    getClients
);

// Therapist: get a specific client
router.get(
    "/:clientId",
    authMiddleware,
    getClientDetails
);

// Therapist: update client intake and consent
router.put(
    "/:clientId/intake",
    authMiddleware,
    updateClientIntake
);

module.exports = router;