const Client = require("../models/Client");
const Session = require("../models/Session");
const Payment = require("../models/Payment");

// Get basic therapist analytics
const getAnalytics = async (req, res) => {
    try {
        const therapistId = req.therapistId;

        const activeClients = await Client.countDocuments({
            therapist: therapistId
        });

        const revenueResult = await Payment.aggregate([
            {
                $match: {
                    therapist: therapistId,
                    status: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const sessionStats = await Session.aggregate([
            {
                $match: {
                    therapist: therapistId
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);

        const noShows = sessionStats.find(
            (item) => item._id === "no-show"
        );

        res.json({
            analytics: {
                activeClients,
                totalRevenue:
                    revenueResult[0]?.totalRevenue || 0,
                noShows: noShows?.count || 0,
                sessionStats
            }
        });

    } catch (error) {
        console.error(
            "Get analytics error:",
            error
        );

        res.status(500).json({
            message: "Could not load analytics"
        });
    }
};

module.exports = {
    getAnalytics
};