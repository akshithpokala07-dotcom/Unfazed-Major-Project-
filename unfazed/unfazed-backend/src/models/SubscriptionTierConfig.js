const mongoose = require("mongoose");

const subscriptionTierConfigSchema = new mongoose.Schema(
    {
        therapist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true,
            unique: true
        },

        tier: {
            type: String,
            enum: ["free", "pro", "premium"],
            default: "free"
        },

        features: {
            notes: {
                type: Boolean,
                default: true
            },

            payments: {
                type: Boolean,
                default: true
            },

            analytics: {
                type: Boolean,
                default: false
            },

            chat: {
                type: Boolean,
                default: false
            },

            advancedAnalytics: {
                type: Boolean,
                default: false
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "SubscriptionTierConfig",
    subscriptionTierConfigSchema
);