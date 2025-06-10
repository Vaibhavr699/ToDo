import dotenv from 'dotenv';
dotenv.config();
console.log('Loaded MONGO_URI from .env:', process.env.MONGO_URI);

import app from './app.js';
import http from 'http';
import { scheduleDueDateNotifications } from './utils/scheduler.js';
import cors from 'cors';

const corsOptions = { origin: 'http://localhost:3000', credentials: true };
app.use(cors(corsOptions));

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

scheduleDueDateNotifications();