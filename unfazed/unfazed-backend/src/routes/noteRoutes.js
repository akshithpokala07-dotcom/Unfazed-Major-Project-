const express = require("express");

const {
    getClientNotes,
    createNote,
    updateNote,
    deleteNote
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");
const entitlementMiddleware = require("../middleware/entitlementMiddleware");

const router = express.Router();

// Therapist: get all notes for a client
router.get(
    "/client/:clientId",
    authMiddleware,
    entitlementMiddleware("notes"),
    getClientNotes
);

// Therapist: create a note for a client
router.post(
    "/client/:clientId",
    authMiddleware,
    entitlementMiddleware("notes"),
    createNote
);

// Therapist: update a note
router.put(
    "/:noteId",
    authMiddleware,
    entitlementMiddleware("notes"),
    updateNote
);

// Therapist: delete a note
router.delete(
    "/:noteId",
    authMiddleware,
    entitlementMiddleware("notes"),
    deleteNote
);

module.exports = router;