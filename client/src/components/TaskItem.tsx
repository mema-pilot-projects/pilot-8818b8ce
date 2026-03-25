import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const handleToggle = () => {
    onToggle(task._id, !task.completed);
  };

  const handleDelete = () => {
    onDelete(task._id);
  };

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <label className="task-item__checkbox-label">
        <input
          type="checkbox"
          className="task-item__checkbox"
          checked={task.completed}
          onChange={handleToggle}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="task-item__checkmark"></span>
      </label>
      <span className="task-item__title">{task.title}</span>
      <button
        className="task-item__delete"
        onClick={handleDelete}
        aria-label={`Delete "${task.title}"`}
        title="Delete task"
      >
        &times;
      </button>
    </li>
  );
};

export default TaskItem;
