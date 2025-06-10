import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

export default app;