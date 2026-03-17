import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { connectDB } from './config/db';
import { startScheduler } from './services/scheduler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('Digital Career Guidance Backend API is running!');
});

// Start the server only after the DB is connected
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    // Start the college data sync scheduler
    startScheduler();
  });
};

startServer();

