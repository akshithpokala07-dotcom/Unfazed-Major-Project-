const Package = require("../models/Package");
const ClientPackage = require("../models/ClientPackage");
const Client = require("../models/Client");
const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");
const crypto = require("crypto");

// Get all packages belonging to the logged-in therapist
const getPackages = async (req, res) => {
    try {
        const therapistId = req.therapistId;

        const packages = await Package.find({
            therapist: therapistId
        }).sort({
            createdAt: -1
        });

        res.json({
            packages
        });

    } catch (error) {
        console.error("Get packages error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Create a new package
const createPackage = async (req, res) => {
    try {
        const therapistId = req.therapistId;

        const {
            name,
            sessionCount,
            price,
            validityDays,
            description
        } = req.body;

        if (!name || !sessionCount || price === undefined) {
            return res.status(400).json({
                message: "Name, session count and price are required"
            });
        }

        const newPackage = await Package.create({
            therapist: therapistId,
            name,
            sessionCount,
            price,
            validityDays,
            description
        });

        res.status(201).json({
            message: "Package created successfully",
            package: newPackage
        });

    } catch (error) {
        console.error("Create package error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Assign a package to a client
const assignPackageToClient = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const clientId = req.params.clientId;

        const {
            packageId
        } = req.body;

        if (!packageId) {
            return res.status(400).json({
                message: "Package ID is required"
            });
        }

        // Make sure the package belongs to this therapist
        const selectedPackage = await Package.findOne({
            _id: packageId,
            therapist: therapistId,
            active: true
        });

        if (!selectedPackage) {
            return res.status(404).json({
                message: "Package not found"
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

        const expiryDate = new Date();

        expiryDate.setDate(
            expiryDate.getDate() + selectedPackage.validityDays
        );

        const clientPackage = await ClientPackage.create({
            therapist: therapistId,
            client: clientId,
            package: selectedPackage._id,
            sessionsTotal: selectedPackage.sessionCount,
            sessionsUsed: 0,
            expiryDate
        });

        res.status(201).json({
            message: "Package assigned to client successfully",
            clientPackage
        });

    } catch (error) {
        console.error("Assign package error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get all packages assigned to a client
const getClientPackages = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const clientId = req.params.clientId;

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

        const clientPackages = await ClientPackage.find({
            therapist: therapistId,
            client: clientId
        })
            .populate(
                "package",
                "name sessionCount price validityDays description"
            )
            .sort({
                createdAt: -1
            });

        res.json({
            clientPackages
        });

    } catch (error) {
        console.error("Get client packages error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Create a Razorpay order for a package purchase
const createPaymentOrder = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const clientId = req.params.clientId;
        const { packageId } = req.body;

        if (!packageId) {
            return res.status(400).json({
                message: "Package ID is required"
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

        // Make sure the package belongs to this therapist
        const selectedPackage = await Package.findOne({
            _id: packageId,
            therapist: therapistId,
            active: true
        });

        if (!selectedPackage) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        // Razorpay expects the amount in paise
        const options = {
            amount: selectedPackage.price * 100,
            currency: "INR",
            receipt: `pkg_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        const payment = await Payment.create({
    therapist: therapistId,
    client: clientId,
    package: selectedPackage._id,
    amount: selectedPackage.price,
    currency: "INR",
    razorpayOrderId: order.id,
    status: "created"
});

        res.status(201).json({
    message: "Razorpay order created successfully",

    paymentId: payment._id,

    order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
    },
            package: {
                id: selectedPackage._id,
                name: selectedPackage.name,
                price: selectedPackage.price,
                sessionCount: selectedPackage.sessionCount
            },
            clientId
        });

    } catch (error) {
        console.error("Create payment order error:", error);

        res.status(500).json({
            message: "Could not create payment order"
        });
    }
};

// Verify a successful Razorpay payment
const verifyPayment = async (req, res) => {
    try {
        const therapistId = req.therapistId;

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment verification details are required"
            });
        }

        // Find the payment created when the Razorpay order was created
        const payment = await Payment.findOne({
            therapist: therapistId,
            razorpayOrderId: razorpay_order_id
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment record not found"
            });
        }

        // If this payment was already processed,
        // do not create another client package
        if (payment.status === "paid") {
            return res.json({
                message: "Payment was already verified",
                payment
            });
        }

        // Generate the signature using our Razorpay secret
        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        // Compare Razorpay's signature with our generated signature
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid payment signature"
            });
        }

        // Find the purchased package
        const selectedPackage = await Package.findOne({
            _id: payment.package,
            therapist: therapistId,
            active: true
        });

        if (!selectedPackage) {
            return res.status(404).json({
                message: "Purchased package not found"
            });
        }

        // Calculate package expiry date
        const expiryDate = new Date();

        expiryDate.setDate(
            expiryDate.getDate() +
            selectedPackage.validityDays
        );

        // Create the package for the client
        const clientPackage = await ClientPackage.create({
            therapist: therapistId,
            client: payment.client,
            package: selectedPackage._id,
            sessionsTotal: selectedPackage.sessionCount,
            sessionsUsed: 0,
            expiryDate
        });

        // Mark payment as paid
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.status = "paid";
        payment.paymentDate = new Date();

        await payment.save();

        res.json({
            message: "Payment verified successfully",
            payment,
            clientPackage
        });

    } catch (error) {
        console.error("Verify payment error:", error);

        res.status(500).json({
            message: "Could not verify payment"
        });
    }
};

module.exports = {
    getPackages,
    createPackage,
    assignPackageToClient,
    getClientPackages,
    createPaymentOrder,
    verifyPayment
};