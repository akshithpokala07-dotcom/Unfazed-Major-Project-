const express = require("express");

const {
    getAnalytics
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const entitlementMiddleware = require("../middleware/entitlementMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    entitlementMiddleware("analytics"),
    getAnalytics
);

module.exports = router;