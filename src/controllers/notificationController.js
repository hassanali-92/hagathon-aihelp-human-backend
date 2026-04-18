import Notification from '../models/Notification.js';

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'name') // Sender ka naam dikhane ke liye
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification && notification.recipient.toString() === req.user.id) {
            notification.read = true;
            await notification.save();
            res.json({ message: "Notification marked as read" });
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};