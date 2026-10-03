const Therapist = require("../models/Therapist");

// Get logged-in therapist profile
const getProfile = async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.therapistId)
            .select("-password_hash");

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        res.json({
            therapist
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update logged-in therapist profile
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            bio,
            specializations,
            languages
        } = req.body;

        const therapist = await Therapist.findById(req.therapistId);

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        if (name !== undefined) {
            therapist.name = name;
        }

        if (bio !== undefined) {
            therapist.bio = bio;
        }

        if (specializations !== undefined) {
            therapist.specializations = specializations;
        }

        if (languages !== undefined) {
            therapist.languages = languages;
        }

        await therapist.save();

        res.json({
            message: "Profile updated successfully",
            therapist: {
                id: therapist._id,
                email: therapist.email,
                name: therapist.name,
                slug: therapist.slug,
                bio: therapist.bio,
                specializations: therapist.specializations,
                languages: therapist.languages
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getPublicTherapistProfile = async (req, res) => {
    try {
        const therapist = await Therapist.findOne({
            slug: req.params.slug
        }).select(
            "name slug bio specializations languages"
        );

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }

        res.json({
            therapist
        });

    } catch (error) {
        console.error("Public profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    getPublicTherapistProfile
};