import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import storyRoutes from './src/routes/storyRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';

dotenv.config();
connectDB();

const app = express();

/* -------------------- 🔥 CORS MUST BE FIRST -------------------- */

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4000',
    'https://final-project-alpha-neon-27.vercel.app',
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// 🔥 Handle preflight BEFORE anything else
app.options('*', cors());

/* -------------------- MIDDLEWARE -------------------- */

// Trust proxy (Render)
app.set('trust proxy', 1);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/* -------------------- ROUTES -------------------- */

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Server is ready');
});

/* -------------------- ERROR HANDLING -------------------- */

app.use(notFound);
app.use(errorHandler);

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
