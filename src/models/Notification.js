import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Jisay notification milna hai (Ali Seeker)
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Jisne action kiya (Mobeen Helper)
    message: { 
        type: String, 
        required: true 
    },
    request: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Request' 
    }, // Kis request ke bare mein hai
    read: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;