const Client = require("../models/Client");

// Get all clients belonging to the logged-in therapist
const getClients = async (req, res) => {
    try {
        const therapistId = req.therapistId;

        const clients = await Client.find({
            therapist: therapistId
        }).sort({
            createdAt: -1
        });

        res.json({
            clients
        });

    } catch (error) {
        console.error("Get clients error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get a single client belonging to the logged-in therapist
const getClientDetails = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const clientId = req.params.clientId;

        const client = await Client.findOne({
            _id: clientId,
            therapist: therapistId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json({
            client
        });

    } catch (error) {
        console.error("Get client details error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Update client intake and consent
const updateClientIntake = async (req, res) => {
    try {
        const therapistId = req.therapistId;
        const clientId = req.params.clientId;

        const {
            intakeCompleted,
            consentGiven
        } = req.body;

        const client = await Client.findOne({
            _id: clientId,
            therapist: therapistId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        if (typeof intakeCompleted === "boolean") {
            client.intakeCompleted = intakeCompleted;
        }

        if (typeof consentGiven === "boolean") {
            client.consentGiven = consentGiven;

            if (consentGiven) {
                client.consentTimestamp = new Date();
            } else {
                client.consentTimestamp = null;
            }
        }

        await client.save();

        res.json({
            message: "Client intake updated successfully",
            client
        });

    } catch (error) {
        console.error("Update client intake error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    getClients,
    getClientDetails,
    updateClientIntake
};