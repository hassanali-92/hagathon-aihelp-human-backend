import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // Role bhi lein

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Both' // Model ke mutabiq role lazmi save karein
        });

        if (user) {
            // FIXED: Response structure login jaisa kar diya
            res.status(201).json({
                token: generateToken(user._id),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    trustScore: user.trustScore
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        res.status(200).json({
            token: generateToken(user._id),
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role, // Dashboard ke liye role zaroori hai
                trustScore: user.trustScore
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};

// Forgot Password (Keep as is, but good to add actual logic later)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist" });
        }

        const resetToken = "mock-reset-token-123"; 
        console.log(`RESET LINK: http://localhost:3000/reset-password/${resetToken}`);

        res.status(200).json({ message: "Reset link sent to your email" });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};