const Availability = require("../models/Availability");
const Session = require("../models/Session");
const Client = require("../models/Client");
const Therapist = require("../models/Therapist");

// Get available slots for a therapist on a specific date
const getAvailableSlots = async (req, res) => {
    try {
        const { therapistId, date } = req.query;

        if (!therapistId || !date) {
            return res.status(400).json({
                message: "therapistId and date are required"
            });
        }

        const availability = await Availability.findOne({
            therapist: therapistId
        });

        if (!availability) {
            return res.status(404).json({
                message: "Availability not configured"
            });
        }

        const requestedDate = new Date(`${date}T00:00:00`);

        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date"
            });
        }

        const dayNames = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        const dayName = dayNames[requestedDate.getDay()];

        let daySchedule = availability.weeklySchedule[dayName];

        // Check for a one-time override
        const override = availability.overrides.find((item) => {
            const overrideDate = new Date(item.date);

            return (
                overrideDate.getFullYear() === requestedDate.getFullYear() &&
                overrideDate.getMonth() === requestedDate.getMonth() &&
                overrideDate.getDate() === requestedDate.getDate()
            );
        });

        if (override) {
            if (!override.enabled) {
                return res.json({
                    date,
                    slots: []
                });
            }

            daySchedule = {
                enabled: true,
                startTime: override.startTime,
                endTime: override.endTime
            };
        }

        if (!daySchedule || !daySchedule.enabled) {
            return res.json({
                date,
                slots: []
            });
        }

        const [startHour, startMinute] =
            daySchedule.startTime.split(":").map(Number);

        const [endHour, endMinute] =
            daySchedule.endTime.split(":").map(Number);

        const dayStart = new Date(requestedDate);
        dayStart.setHours(startHour, startMinute, 0, 0);

        const dayEnd = new Date(requestedDate);
        dayEnd.setHours(endHour, endMinute, 0, 0);

        const sessions = await Session.find({
            therapist: therapistId,
            status: "booked",
            startTime: { $lt: dayEnd },
            endTime: { $gt: dayStart }
        });

        const slots = [];

        let currentStart = new Date(dayStart);

        while (currentStart < dayEnd) {
            const currentEnd = new Date(
                currentStart.getTime() +
                availability.sessionDuration * 60 * 1000
            );

            if (currentEnd > dayEnd) {
                break;
            }

            const overlaps = sessions.some((session) => {
                return (
                    currentStart < session.endTime &&
                    currentEnd > session.startTime
                );
            });

            // Check blocked slots
            const blocked = availability.blockedSlots.some((blockedSlot) => {
                return (
                    currentStart < blockedSlot.end &&
                    currentEnd > blockedSlot.start
                );
            });

            if (!overlaps && !blocked) {
                slots.push({
                    startTime: currentStart.toISOString(),
                    endTime: currentEnd.toISOString()
                });
            }

            currentStart = new Date(
                currentEnd.getTime() +
                availability.bufferMinutes * 60 * 1000
            );
        }

        res.json({
            date,
            sessionDuration: availability.sessionDuration,
            timezone: availability.timezone,
            slots
        });

    } catch (error) {
        console.error("Get available slots error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Book a session
const bookSession = async (req, res) => {
    try {
        const {
            therapistId,
            name,
            email,
            phone,
            startTime
        } = req.body;

        if (!therapistId || !name || !email || !startTime) {
            return res.status(400).json({
                message: "therapistId, name, email and startTime are required"
            });
        }

        const therapist = await Therapist.findById(therapistId);

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        const availability = await Availability.findOne({
            therapist: therapistId
        });

        if (!availability) {
            return res.status(404).json({
                message: "Therapist availability is not configured"
            });
        }

        const start = new Date(startTime);

        if (isNaN(start.getTime())) {
            return res.status(400).json({
                message: "Invalid start time"
            });
        }

        const end = new Date(
            start.getTime() +
            availability.sessionDuration * 60 * 1000
        );

        // Prevent double booking
        const existingSession = await Session.findOne({
            therapist: therapistId,
            status: "booked",
            startTime: { $lt: end },
            endTime: { $gt: start }
        });

        if (existingSession) {
            return res.status(409).json({
                message: "This time slot is already booked"
            });
        }

        // Find existing client or create a new one
        let client = await Client.findOne({
            therapist: therapistId,
            email: email.toLowerCase()
        });

        if (!client) {
            client = await Client.create({
                therapist: therapistId,
                name,
                email: email.toLowerCase(),
                phone: phone || ""
            });
        }

        const session = await Session.create({
            therapist: therapistId,
            client: client._id,
            startTime: start,
            endTime: end,
            status: "booked"
        });

        res.status(201).json({
            message: "Session booked successfully",
            session
        });

    } catch (error) {
        console.error("Book session error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const setAvailability = async (req, res) => {
    try {
        const therapistId = req.therapistId;

        const {
            timezone,
            sessionDuration,
            bufferMinutes,
            weeklySchedule,
            overrides,
            blockedSlots
        } = req.body;

        const availability = await Availability.findOneAndUpdate(
            { therapist: therapistId },
            {
                therapist: therapistId,
                timezone: timezone || "Asia/Kolkata",
                sessionDuration: sessionDuration || 60,
                bufferMinutes: bufferMinutes || 0,
                weeklySchedule,
                overrides: overrides || [],
                blockedSlots: blockedSlots || []
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            message: "Availability saved successfully",
            availability
        });

    } catch (error) {
        console.error("Set availability error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getAvailableSlots,
    bookSession,
    setAvailability
};