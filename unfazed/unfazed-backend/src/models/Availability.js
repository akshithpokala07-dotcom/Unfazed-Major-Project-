const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true,
            unique: true
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata"
        },

        sessionDuration: {
            type: Number,
            enum: [30, 45, 60, 90],
            default: 60
        },

        bufferMinutes: {
            type: Number,
            default: 0
        },

        weeklySchedule: {
            monday: {
                enabled: { type: Boolean, default: false },
                startTime: { type: String, default: "09:00" },
                endTime: { type: String, default: "17:00" }
            },

            tuesday: {
                enabled: { type: Boolean, default: false },
                startTime: { type: String, default: "09:00" },
                endTime: { type: String, default: "17:00" }
            },

            wednesday: {
                enabled: { type: Boolean, default: false },
                startTime: { type: String, default: "09:00" },
                endTime: { type: String, default: "17:00" }
            },

            thursday: {
                enabled: { type: Boolean, default: false },
                startTime: { type: String, default: "09:00" },
                endTime: { type: String, default: "17:00" }
            },

            friday: {
                enabled: { type: Boolean, default: false },
                startTime: { type: String, default: "09:00" },
                endTime: { type: String, default: "17:00" }
            },

            saturday: {
                enabled: { type: Boolean, default: false },
                startTime: { type: String, default: "09:00" },
                endTime: { type: String, default: "13:00" }
            },

            sunday: {
                enabled: { type: Boolean, default: false },
                startTime: { type: String, default: "09:00" },
                endTime: { type: String, default: "13:00" }
            }
        },

        overrides: [
            {
                date: {
                    type: Date,
                    required: true
                },

                enabled: {
                    type: Boolean,
                    default: true
                },

                startTime: {
                    type: String
                },

                endTime: {
                    type: String
                }
            }
        ],

        blockedSlots: [
            {
                start: {
                    type: Date,
                    required: true
                },

                end: {
                    type: Date,
                    required: true
                },

                reason: {
                    type: String,
                    default: ""
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Availability",
    availabilitySchema
);