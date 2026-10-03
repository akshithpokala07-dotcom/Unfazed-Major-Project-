const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
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

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "booked",
                "completed",
                "cancelled",
                "no-show"
            ],
            default: "booked"
        },

        sessionType: {
            type: String,
            default: "Therapy Session"
        },

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Session", sessionSchema);