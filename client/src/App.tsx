import React, { useState, useEffect, useCallback } from 'react';
import { Task, FilterType } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import './App.css';

const App: React.FC = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tasks = await fetchTasks('all');
      setAllTasks(tasks);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = allTasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const taskCounts = {
    all: allTasks.length,
    active: allTasks.filter((t) => !t.completed).length,
    completed: allTasks.filter((t) => t.completed).length,
  };

  const handleAddTask = async (title: string) => {
    try {
      setIsAdding(true);
      setError(null);
      const newTask = await createTask(title);
      setAllTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Failed to add task:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      setError(null);
      const updated = await updateTask(id, completed);
      setAllTasks((prev) =>
        prev.map((task) => (task._id === id ? updated : task))
      );
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      await deleteTask(id);
      setAllTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Failed to delete task:', err);
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Simple TODO App</h1>
        <p className="app__subtitle">Stay organized and productive</p>
      </header>

      <main className="app__main">
        <TaskForm onAddTask={handleAddTask} isLoading={isAdding} />

        {error && (
          <div className="app__error" role="alert">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="app__error-close">
              &times;
            </button>
          </div>
        )}

        <FilterBar
          currentFilter={filter}
          onFilterChange={handleFilterChange}
          taskCounts={taskCounts}
        />

        <TaskList
          tasks={filteredTasks}
          filter={filter}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          isLoading={isLoading}
        />

        {!isLoading && allTasks.length > 0 && (
          <div className="app__summary">
            <p>
              {taskCounts.completed} of {taskCounts.all} tasks completed
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
