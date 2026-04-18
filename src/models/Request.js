import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, 
    
    // Status mein 'Assigned' lazmi add karein taake help offer work kare
    status: { 
        type: String, 
        enum: ['Open', 'Assigned', 'Solved'], 
        default: 'Open' 
    },

    urgency: { 
        type: String, 
        enum: ['Normal', 'High'], 
        default: 'Normal' 
    },

    tags: [String],

    // Single helper field (Jo help accept karega)
    helper: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },

    // Agar aap multiple offers track karna chahte hain toh ye rakhein, 
    // warna isay delete bhi kar sakte hain
    offers: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }]

}, { timestamps: true });

export default mongoose.model('Request', requestSchema);