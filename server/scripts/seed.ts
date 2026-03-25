import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Task } from '../src/models/Task';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';

const sampleTasks = [
  { title: 'Set up project structure and development environment', completed: true, priority: 'high' },
  { title: 'Implement backend API with Express and MongoDB', completed: true, priority: 'high' },
  { title: 'Create React frontend with TypeScript', completed: false, priority: 'high' },
  { title: 'Write unit and integration tests', completed: false, priority: 'medium' },
  { title: 'Deploy application to production', completed: false, priority: 'low' },
];

async function seed(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Insert sample tasks
    const tasks = await Task.insertMany(sampleTasks);
    console.log(`Inserted ${tasks.length} sample tasks:`);
    tasks.forEach((task) => {
      console.log(`  - [${task.completed ? 'x' : ' '}] [${task.priority}] ${task.title}`);
    });

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
