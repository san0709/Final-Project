import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors
import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import storyRoutes from './src/routes/storyRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://localhost:5175',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        // Allow any localhost origin for development
        if (origin.startsWith('http://localhost') || allowedOrigins.indexOf(origin) !== -1 || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin); // Log the blocked origin for debugging
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('Server is ready');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
