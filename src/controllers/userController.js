import User from '../models/User.js';

// @desc    Get Leaderboard (Top 10)
// @route   GET /api/users/leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const topHelpers = await User.find()
            .sort({ trustScore: -1 })
            .limit(10)
            .select('name trustScore badges helpCount role');
        res.json(topHelpers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
};

// @desc    Get User Profile
// @route   GET /api/users/profile
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update Onboarding Data
// @route   PUT /api/users/onboarding
// controllers/userController.js

export const completeOnboarding = async (req, res) => {
    try {
        const { skills, interests, location, role, bio } = req.body;
        
        // Debugging: Check karein ke req.user.id mil raha hai ya nahi
        console.log("User ID from Token:", req.user.id);

        const user = await User.findById(req.user.id);

        if (user) {
            // Check karein ke kya aapke Schema mein ye fields exist karti hain?
            user.skills = skills || user.skills;
            user.interests = interests || user.interests;
            user.location = location || user.location;
            user.role = role || user.role;
            user.bio = bio || user.bio;
            user.onboarded = true;

            const updatedUser = await user.save();
            res.json({ message: "Profile updated successfully!", user: updatedUser });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        // YE LINE ZAROORI HAI: Terminal check karein jab request fail ho
        console.error("Update Error Details:", error); 
        res.status(500).json({ message: "Update failed", details: error.message });
    }
};
// @desc    Get User Stats for Dashboard
// @route   GET /api/users/stats
export const getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('trustScore helpCount badges');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};
