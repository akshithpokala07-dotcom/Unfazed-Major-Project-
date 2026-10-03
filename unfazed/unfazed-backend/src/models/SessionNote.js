const mongoose = require("mongoose");

const sessionNoteSchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            default: null
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        visibility: {
            type: String,
            enum: ["private", "shared"],
            default: "private"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SessionNote",
    sessionNoteSchema
);