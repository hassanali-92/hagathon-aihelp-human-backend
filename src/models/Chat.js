import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;