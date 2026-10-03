const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
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

        sessionCount: {
            type: Number,
            required: true,
            enum: [3, 6, 12]
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        validityDays: {
            type: Number,
            default: 90
        },

        description: {
            type: String,
            default: ""
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Package",
    packageSchema
);