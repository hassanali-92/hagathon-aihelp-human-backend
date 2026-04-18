import Chat from '../models/Chat.js';

export const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('participants', 'name email')
            .populate('requestId', 'title');
            
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        // Check karein ke request karne wala chat ka hissa hai ya nahi
        const isParticipant = chat.participants.some(p => p._id.toString() === req.user.id);
        if (!isParticipant) return res.status(403).json({ message: "Unauthorized access to this chat" });

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Naya message bhejne ka logic
export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const chatId = req.params.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        // Message object create karein
        const newMessage = {
            sender: req.user._id,
            text,
            timestamp: new Date()
        };

        // Chat ke messages array mein push karein
        chat.messages.push(newMessage);
        await chat.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};