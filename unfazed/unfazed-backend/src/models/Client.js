const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            default: ""
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata"
        },

        intakeCompleted: {
            type: Boolean,
            default: false
        },

        consentGiven: {
            type: Boolean,
            default: false
        },

        consentTimestamp: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Client", clientSchema);