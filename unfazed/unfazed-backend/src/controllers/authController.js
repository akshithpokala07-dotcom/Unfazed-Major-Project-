const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Therapist = require("../models/Therapist");
const generateSlug = require("../utils/generateSlug");

// ==============================
// REGISTER THERAPIST
// ==============================
const register = async (req, res) => {
    try {
        const {
            email,
            password,
            name,
            bio,
            specializations,
            languages
        } = req.body;

        // Check required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                message: "Email, password and name are required"
            });
        }

        // Check if email already exists
        const existingTherapist = await Therapist.findOne({
            email: email.toLowerCase()
        });

        if (existingTherapist) {
            return res.status(409).json({
                message: "A therapist with this email already exists"
            });
        }

        // Generate base slug
        let slug = generateSlug(name);

        // Make sure slug is unique
        let existingSlug = await Therapist.findOne({ slug });
        let counter = 1;

        while (existingSlug) {
            slug = `${generateSlug(name)}-${counter}`;
            existingSlug = await Therapist.findOne({ slug });
            counter++;
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create therapist
        const therapist = await Therapist.create({
            email: email.toLowerCase(),
            password_hash,
            name,
            slug,
            bio: bio || "",
            specializations: specializations || [],
            languages: languages || []
        });

        // Create JWT
        const token = jwt.sign(
            {
                therapistId: therapist._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            message: "Therapist registered successfully",
            token,
            therapist: {
                id: therapist._id,
                name: therapist.name,
                email: therapist.email,
                slug: therapist.slug,
                bio: therapist.bio,
                specializations: therapist.specializations,
                languages: therapist.languages
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// ==============================
// LOGIN THERAPIST
// ==============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find therapist
        const therapist = await Therapist.findOne({
            email: email.toLowerCase()
        });

        if (!therapist) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            therapist.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                therapistId: therapist._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            therapist: {
                id: therapist._id,
                name: therapist.name,
                email: therapist.email,
                slug: therapist.slug,
                bio: therapist.bio,
                specializations: therapist.specializations,
                languages: therapist.languages
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};


module.exports = {
    register,
    login
};