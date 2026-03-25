import React, { useState } from 'react';
import { Priority } from '../types';

interface TaskFormProps {
  onAddTask: (title: string, priority: Priority) => Promise<void>;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isLoading }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Please enter a task title');
      return;
    }

    if (trimmed.length > 200) {
      setError('Title cannot exceed 200 characters');
      return;
    }

    setError('');
    await onAddTask(trimmed, priority);
    setTitle('');
    setPriority('medium');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__input-group">
        <input
          type="text"
          className="task-form__input"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          disabled={isLoading}
          maxLength={200}
          aria-label="New task title"
        />
        <select
          className="task-form__priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          disabled={isLoading}
          aria-label="Task priority"
        >
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>
        <button
          type="submit"
          className="task-form__button"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      {error && <p className="task-form__error">{error}</p>}
    </form>
  );
};

export default TaskForm;
