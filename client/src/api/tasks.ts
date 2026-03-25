import axios from 'axios';
import { Task, FilterType } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchTasks(filter: FilterType = 'all'): Promise<Task[]> {
  const params: Record<string, string> = {};
  if (filter === 'active') params.status = 'active';
  if (filter === 'completed') params.status = 'completed';

  const res = await api.get<{ success: boolean; data: Task[] }>('/tasks', { params });
  return res.data.data;
}

export async function createTask(title: string): Promise<Task> {
  const res = await api.post<{ success: boolean; data: Task }>('/tasks', { title });
  return res.data.data;
}

export async function updateTask(id: string, completed: boolean): Promise<Task> {
  const res = await api.put<{ success: boolean; data: Task }>(`/tasks/${id}`, { completed });
  return res.data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
