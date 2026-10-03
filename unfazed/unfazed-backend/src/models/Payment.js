const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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

        package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
            default: null
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        currency: {
            type: String,
            default: "INR"
        },

        razorpayOrderId: {
            type: String,
            default: null
        },

        razorpayPaymentId: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: [
                "created",
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "created"
        },

        paymentDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Payment",
    paymentSchema
);