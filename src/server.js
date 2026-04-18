import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Database Connection
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js'; // <--- 1. Chat routes import karein

const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || '*', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS add kiya safe requests ke liye
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. API Routes Configuration
app.use('/api/auth', authRoutes);           
app.use('/api/users', userRoutes);         
app.use('/api/requests', requestRoutes);   
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);          // <--- 2. Chat API endpoint register karein

// 4. Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Helplytics AI API is running smoothly',
        version: '1.0.0'
    });
});

// 5. 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 7. Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});