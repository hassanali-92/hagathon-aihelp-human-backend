import Request from '../models/Request.js';
import User from '../models/User.js';

// 1. Create Request
export const createRequest = async (req, res) => {
    try {
        const { title, description, category, tags } = req.body;
        const urgentKeywords = ['urgent', 'asap', 'blocking', 'stuck', 'deadline', 'error'];
        const isUrgent = urgentKeywords.some(word => description.toLowerCase().includes(word));
        
        const suggestedTags = Array.isArray(tags) ? [...tags] : [];
        if(description.toLowerCase().includes('react')) suggestedTags.push('frontend');
        if(description.toLowerCase().includes('database')) suggestedTags.push('backend');

        const request = await Request.create({
            user: req.user._id, // Consistently use _id
            title,
            description,
            category,
            tags: [...new Set(suggestedTags)],
            urgency: isUrgent ? 'High' : 'Normal',
            status: 'Open' // Default status
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Offer Help
// export const offerHelp = async (req, res) => {
//     try {
//         const requestId = req.params.id;
//         const userId = req.user._id;

//         // 1. Check if ID is valid
//         const request = await Request.findById(requestId);
//         if (!request) return res.status(404).json({ message: "Request not found" });

//         // 2. Self-help check
//         if (request.user.toString() === userId.toString()) {
//             return res.status(400).json({ message: "Apni hi request help nahi kar sakte!" });
//         }

//         // 3. Status check
//         if (request.status !== 'Open') {
//             return res.status(400).json({ message: "Task already assigned or solved" });
//         }

//         // 4. Update
//         request.status = 'Assigned';
//         request.helper = userId; 
//         await request.save();

//         return res.status(200).json({ message: "Offer successful", request });
//     } catch (error) {
//         console.error("CRITICAL ERROR:", error); // Terminal mein error check karein
//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

export const offerHelp = async (req, res) => {
    try {
        const requestId = req.params.id;
        const userId = req.user._id;

        const request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });

        if (request.user.toString() === userId.toString()) {
            return res.status(400).json({ message: "Apni hi request help nahi kar sakte!" });
        }

        if (request.status !== 'Open') {
            return res.status(400).json({ message: "Task already assigned or solved" });
        }

        request.status = 'Assigned';
        request.helper = userId; 
        await request.save();

        res.status(200).json({ message: "Offer successful", request });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// 3. Mark as Solved
export const markAsSolved = async (req, res) => {
    const requestId = req.params.id;
    // Helper ID aksar request object mein pehle se hota hai (from offerHelp)
    try {
        const request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.status = 'Solved';
        await request.save();

        // Helper ka Trust Score barhao
        if (request.helper) {
            await User.findByIdAndUpdate(request.helper, { 
                $inc: { trustScore: 10, helpCount: 1 } 
            });
        }

        res.json({ message: "Request solved and Trust Score updated!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Personalized Feed
export const getRecommendedRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('skills');
        const userSkills = user?.skills || [];
        
        let recommended = [];
        if (userSkills.length > 0) {
            const skillRegex = userSkills.map(skill => new RegExp(skill, 'i'));
            recommended = await Request.find({
                status: 'Open',
                user: { $ne: req.user._id }, // Dusron ki requests dikhao
                tags: { $in: skillRegex } 
            })
            .populate('user', 'name trustScore')
            .sort({ urgency: -1, createdAt: -1 });
        }

        // Fix: Use "else" or "return" properly to avoid double response
        if (recommended.length > 0) {
            return res.json({ 
                type: "personalized", 
                requests: recommended 
            });
        }

        const general = await Request.find({ status: 'Open', user: { $ne: req.user._id } })
            .populate('user', 'name trustScore')
            .limit(10)
            .sort({ createdAt: -1 });

        res.json({ type: "general", requests: general });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. My Tasks & Requests
export const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ user: req.user._id });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching my requests" });
    }
};

export const getMyTasks = async (req, res) => {
    try {
        const tasks = await Request.find({ helper: req.user._id }).populate('user', 'name trustScore');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching active tasks" });
    }
};
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('user', 'name trustScore')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Baqi functions (getAllRequests etc.) ko bhi aise hi _id ke saath update rakhein.