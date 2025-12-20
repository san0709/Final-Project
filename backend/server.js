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

/* -------------------- MIDDLEWARE -------------------- */

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// 🔥 TRUST PROXY (IMPORTANT FOR RENDER)
app.set('trust proxy', 1);

// 🔥 CORS OPTIONS (FINAL)
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://zenchatsocialapp.netlify.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// 🔥 Enable CORS
app.use(cors(corsOptions));

// 🔥 ENABLE PREFLIGHT (THIS WAS MISSING)
app.options('*', cors(corsOptions));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
