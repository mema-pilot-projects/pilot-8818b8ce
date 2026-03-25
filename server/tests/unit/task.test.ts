import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Task, ITask } from '../../src/models/Task';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe('Task Model', () => {
  describe('validation', () => {
    it('should create a task with valid title', async () => {
      const task = new Task({ title: 'Test Task' });
      const saved = await task.save();

      expect(saved._id).toBeDefined();
      expect(saved.title).toBe('Test Task');
      expect(saved.completed).toBe(false);
      expect(saved.priority).toBe('medium');
      expect(saved.createdAt).toBeDefined();
      expect(saved.updatedAt).toBeDefined();
    });

    it('should accept valid priority values', async () => {
      for (const priority of ['high', 'medium', 'low'] as const) {
        const task = new Task({ title: `Task ${priority}`, priority });
        const saved = await task.save();
        expect(saved.priority).toBe(priority);
      }
    });

    it('should fail validation with invalid priority', async () => {
      const task = new Task({ title: 'Task', priority: 'urgent' });
      await expect(task.save()).rejects.toThrow();
    });

    it('should default priority to medium', async () => {
      const task = new Task({ title: 'No Priority Task' });
      const saved = await task.save();
      expect(saved.priority).toBe('medium');
    });

    it('should fail validation when title is missing', async () => {
      const task = new Task({});
      await expect(task.save()).rejects.toThrow();
    });

    it('should fail validation when title is empty string', async () => {
      const task = new Task({ title: '' });
      await expect(task.save()).rejects.toThrow();
    });

    it('should fail validation when title exceeds 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      const task = new Task({ title: longTitle });
      await expect(task.save()).rejects.toThrow();
    });

    it('should accept title with exactly 200 characters', async () => {
      const title = 'a'.repeat(200);
      const task = new Task({ title });
      const saved = await task.save();
      expect(saved.title).toBe(title);
    });

    it('should trim whitespace from title', async () => {
      const task = new Task({ title: '  Test Task  ' });
      const saved = await task.save();
      expect(saved.title).toBe('Test Task');
    });

    it('should default completed to false', async () => {
      const task = new Task({ title: 'Test Task' });
      const saved = await task.save();
      expect(saved.completed).toBe(false);
    });

    it('should allow setting completed to true', async () => {
      const task = new Task({ title: 'Test Task', completed: true });
      const saved = await task.save();
      expect(saved.completed).toBe(true);
    });
  });

  describe('timestamps', () => {
    it('should automatically set createdAt and updatedAt', async () => {
      const before = new Date();
      const task = new Task({ title: 'Test Task' });
      const saved = await task.save();
      const after = new Date();

      expect(saved.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(saved.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(saved.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(saved.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should update updatedAt when task is modified', async () => {
      const task = new Task({ title: 'Test Task' });
      const saved = await task.save() as ITask;

      const originalUpdatedAt = saved.updatedAt.getTime();

      // Wait a short time to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      saved.completed = true;
      const updated = await saved.save();

      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt);
    });
  });

  describe('CRUD operations', () => {
    it('should create multiple tasks', async () => {
      await Task.create([
        { title: 'Task 1' },
        { title: 'Task 2' },
        { title: 'Task 3' },
      ]);

      const count = await Task.countDocuments();
      expect(count).toBe(3);
    });

    it('should find tasks by completed status', async () => {
      await Task.create([
        { title: 'Active Task 1', completed: false },
        { title: 'Active Task 2', completed: false },
        { title: 'Completed Task', completed: true },
      ]);

      const activeTasks = await Task.find({ completed: false });
      const completedTasks = await Task.find({ completed: true });

      expect(activeTasks).toHaveLength(2);
      expect(completedTasks).toHaveLength(1);
    });

    it('should delete a task by id', async () => {
      const task = await Task.create({ title: 'Task to Delete' });
      await Task.findByIdAndDelete(task._id);

      const found = await Task.findById(task._id);
      expect(found).toBeNull();
    });

    it('should update a task', async () => {
      const task = await Task.create({ title: 'Task to Update' });
      const updated = await Task.findByIdAndUpdate(
        task._id,
        { completed: true },
        { new: true }
      );

      expect(updated?.completed).toBe(true);
    });
  });
});
