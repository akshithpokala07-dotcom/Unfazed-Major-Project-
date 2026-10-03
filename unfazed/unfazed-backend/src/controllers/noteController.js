const SessionNote = require("../models/SessionNote");
const Client = require("../models/Client");

// Get all notes for a client
// Therapist can see both private and shared notes
const getClientNotes = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const clientId = req.params.clientId;

        // Make sure this client belongs to the logged-in therapist
        const client = await Client.findOne({
            _id: clientId,
            therapist: therapistId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        const notes = await SessionNote.find({
    therapist: therapistId,
    client: clientId
})
.select(
    "client session content visibility createdAt updatedAt"
)
.sort({
    createdAt: -1
});

        res.json({
            notes
        });

    } catch (error) {
        console.error("Get client notes error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Create a new clinical note
const createNote = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const clientId = req.params.clientId;

        const {
            content,
            visibility,
            session
        } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Note content is required"
            });
        }

        // Make sure the client belongs to this therapist
        const client = await Client.findOne({
            _id: clientId,
            therapist: therapistId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        const note = await SessionNote.create({
            therapist: therapistId,
            client: clientId,
            session: session || null,
            content,
            visibility: visibility || "private"
        });

        res.status(201).json({
            message: "Clinical note created successfully",
            note
        });

    } catch (error) {
        console.error("Create note error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update an existing clinical note
const updateNote = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const noteId = req.params.noteId;

        const {
            content,
            visibility
        } = req.body;

        const note = await SessionNote.findOne({
            _id: noteId,
            therapist: therapistId
        });

        if (!note) {
            return res.status(404).json({
                message: "Clinical note not found"
            });
        }

        if (typeof content === "string") {
            note.content = content;
        }

        if (
            visibility === "private" ||
            visibility === "shared"
        ) {
            note.visibility = visibility;
        }

        await note.save();

        res.json({
            message: "Clinical note updated successfully",
            note
        });

    } catch (error) {
        console.error("Update note error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Delete a clinical note
const deleteNote = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const noteId = req.params.noteId;

        const note = await SessionNote.findOneAndDelete({
            _id: noteId,
            therapist: therapistId
        });

        if (!note) {
            return res.status(404).json({
                message: "Clinical note not found"
            });
        }

        res.json({
            message: "Clinical note deleted successfully"
        });

    } catch (error) {
        console.error("Delete note error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getClientNotes,
    createNote,
    updateNote,
    deleteNote
};