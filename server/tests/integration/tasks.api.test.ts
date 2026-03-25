import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/server';
import { Task } from '../../src/models/Task';

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

describe('Tasks API', () => {
  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return all tasks sorted by createdAt desc', async () => {
      await Task.create({ title: 'First Task' });
      await new Promise((resolve) => setTimeout(resolve, 10));
      await Task.create({ title: 'Second Task' });

      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].title).toBe('Second Task');
      expect(res.body.data[1].title).toBe('First Task');
    });

    it('should filter active tasks', async () => {
      await Task.create({ title: 'Active Task', completed: false });
      await Task.create({ title: 'Completed Task', completed: true });

      const res = await request(app).get('/api/tasks?status=active');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Active Task');
    });

    it('should filter completed tasks', async () => {
      await Task.create({ title: 'Active Task', completed: false });
      await Task.create({ title: 'Completed Task', completed: true });

      const res = await request(app).get('/api/tasks?status=completed');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Completed Task');
    });

    it('should return all tasks when status filter is not recognized', async () => {
      await Task.create({ title: 'Active Task', completed: false });
      await Task.create({ title: 'Completed Task', completed: true });

      const res = await request(app).get('/api/tasks?status=unknown');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Task');
      expect(res.body.data.completed).toBe(false);
      expect(res.body.data._id).toBeDefined();
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when title is empty string', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when title is only whitespace', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should trim whitespace from title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '  Trimmed Task  ' });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Trimmed Task');
    });

    it('should return 400 when title exceeds 200 characters', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'a'.repeat(201) });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should create task with completed defaulting to false', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task' });

      expect(res.status).toBe(201);
      expect(res.body.data.completed).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task completed status to true', async () => {
      const task = await Task.create({ title: 'Task to Update' });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.completed).toBe(true);
    });

    it('should update task completed status to false', async () => {
      const task = await Task.create({ title: 'Completed Task', completed: true });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({ completed: false });

      expect(res.status).toBe(200);
      expect(res.body.data.completed).toBe(false);
    });

    it('should return 404 when task not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .send({ completed: true });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid task ID', async () => {
      const res = await request(app)
        .put('/api/tasks/invalid-id')
        .send({ completed: true });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when completed is not boolean', async () => {
      const task = await Task.create({ title: 'Task' });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({ completed: 'yes' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await Task.create({ title: 'Task to Delete' });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const found = await Task.findById(task._id);
      expect(found).toBeNull();
    });

    it('should return 404 when task not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/tasks/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid task ID', async () => {
      const res = await request(app)
        .delete('/api/tasks/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return deleted task in response', async () => {
      const task = await Task.create({ title: 'Task to Delete' });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Task to Delete');
    });
  });
});
