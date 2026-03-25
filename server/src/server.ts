import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export { app };

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = parseInt(process.env.PORT || '5000', 10);
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';

  connectDatabase(MONGODB_URI).then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}
