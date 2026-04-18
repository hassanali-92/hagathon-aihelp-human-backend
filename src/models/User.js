import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Seeker', 'Helper', 'Both'], default: 'Both' },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    onboarded: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    helpCount: { type: Number, default: 0 },
    badges: { type: [String], default: [] }
}, { timestamps: true });

// Password hashing logic - FIXED (Removed 'next')
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error("Password hashing failed: " + error.message);
    }
});

const User = mongoose.model('User', userSchema);
export default User;