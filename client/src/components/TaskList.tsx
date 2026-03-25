import React from 'react';
import { Task, FilterType } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, filter, onToggle, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="task-list__loading">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    const emptyMessages: Record<FilterType, string> = {
      all: 'No tasks yet. Add one above!',
      active: 'No active tasks. Great job!',
      completed: 'No completed tasks yet.',
    };

    return (
      <div className="task-list__empty">
        <p>{emptyMessages[filter]}</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TaskList;
