import React from 'react';
import { FilterType } from '../types';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange, taskCounts }) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="filter-bar">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          className={`filter-bar__button ${currentFilter === value ? 'filter-bar__button--active' : ''}`}
          onClick={() => onFilterChange(value)}
          aria-pressed={currentFilter === value}
        >
          {label}
          <span className="filter-bar__count">{taskCounts[value]}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
