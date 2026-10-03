const express = require("express");

const {
    getPackages,
    createPackage,
    assignPackageToClient,
    getClientPackages,
    createPaymentOrder,
    verifyPayment
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const entitlementMiddleware = require("../middleware/entitlementMiddleware");

const router = express.Router();

// Get all packages for the logged-in therapist
router.get(
    "/packages",
    authMiddleware,
    entitlementMiddleware("payments"),
    getPackages
);

// Create a new package
router.post(
    "/packages",
    authMiddleware,
    entitlementMiddleware("payments"),
    createPackage
);

// Assign a package to a client
router.post(
    "/clients/:clientId/packages",
    authMiddleware,
    entitlementMiddleware("payments"),
    assignPackageToClient
);

// Get packages assigned to a client
router.get(
    "/clients/:clientId/packages",
    authMiddleware,
    entitlementMiddleware("payments"),
    getClientPackages
);

// Create a Razorpay payment order
router.post(
    "/clients/:clientId/payment-order",
    authMiddleware,
    entitlementMiddleware("payments"),
    createPaymentOrder
);

// Verify a Razorpay payment
router.post(
    "/verify",
    authMiddleware,
    entitlementMiddleware("payments"),
    verifyPayment
);

module.exports = router;