"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Task_1 = require("../src/models/Task");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
const sampleTasks = [
    { title: 'Set up project structure and development environment', completed: true },
    { title: 'Implement backend API with Express and MongoDB', completed: true },
    { title: 'Create React frontend with TypeScript', completed: false },
    { title: 'Write unit and integration tests', completed: false },
    { title: 'Deploy application to production', completed: false },
];
async function seed() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Clear existing tasks
        await Task_1.Task.deleteMany({});
        console.log('Cleared existing tasks');
        // Insert sample tasks
        const tasks = await Task_1.Task.insertMany(sampleTasks);
        console.log(`Inserted ${tasks.length} sample tasks:`);
        tasks.forEach((task) => {
            console.log(`  - [${task.completed ? 'x' : ' '}] ${task.title}`);
        });
        console.log('Seed completed successfully');
    }
    catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
seed();
