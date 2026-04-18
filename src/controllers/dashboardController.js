import Request from '../models/Request.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
    try {
        // 1. User ke apne stats (Live from Database)
        const user = await User.findById(req.user.id).select('name trustScore helpCount badges');

        // 2. User ne kitni requests post ki hain
        const myRequestsCount = await Request.countDocuments({ user: req.user.id });

        // 3. Poori community ke stats (Global)
        const totalCommunityRequests = await Request.countDocuments();
        const resolvedGlobal = await Request.countDocuments({ status: 'Solved' });

        res.status(200).json({
            welcomeMessage: `Welcome back, ${user.name}!`,
            // User-specific cards ke liye data
            personalStats: {
                trustScore: user.trustScore,
                totalHelpGiven: user.helpCount,
                myRequests: myRequestsCount,
                badges: user.badges
            },
            // Community overview cards ke liye data
            communityStats: {
                activeIssues: totalCommunityRequests - resolvedGlobal,
                totalResolved: resolvedGlobal,
                communityTrust: "High" // Ye hum logic se bhi set kar sakte hain
            },
            lastLogin: new Date().toLocaleString(),
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: error.message });
    }
};