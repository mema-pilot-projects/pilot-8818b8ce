import { Router, Request, Response } from 'express';
import { Task } from '../models/Task';

const router = Router();

// GET /api/tasks - Get all tasks with optional status filter
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const filter: Record<string, unknown> = {};

    if (status === 'active') {
      filter.completed = false;
    } else if (status === 'completed') {
      filter.completed = true;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ success: false, message: 'Title is required' });
      return;
    }

    if (title.trim().length > 200) {
      res.status(400).json({ success: false, message: 'Title cannot exceed 200 characters' });
      return;
    }

    const task = new Task({ title: title.trim() });
    await task.save();

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Failed to create task', error });
  }
});

// PUT /api/tasks/:id - Update task completed status
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      res.status(400).json({ success: false, message: 'completed must be a boolean' });
      return;
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.json({ success: true, data: task });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      res.status(400).json({ success: false, message: 'Invalid task ID' });
      return;
    }
    res.status(500).json({ success: false, message: 'Failed to update task', error });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      res.status(400).json({ success: false, message: 'Invalid task ID' });
      return;
    }
    res.status(500).json({ success: false, message: 'Failed to delete task', error });
  }
});

export default router;
