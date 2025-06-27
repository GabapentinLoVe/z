import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setFilters } from '../store/postsSlice';

const POST_TYPES = ['Контент', 'Событие', 'Вакансия'];
const DIRECTIONS = ['Frontend', 'Backend', 'QA', 'Design', 'HR', 'Manager'];

const FilterBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.posts.filters);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ ...filters, type: e.target.value || undefined }));
  };
  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ ...filters, direction: e.target.value || undefined }));
  };

  return (
    <div className="filter-bar">
      <select value={filters.type || ''} onChange={handleTypeChange}>
        <option value="">Все типы</option>
        {POST_TYPES.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <select value={filters.direction || ''} onChange={handleDirectionChange}>
        <option value="">Все направления</option>
        {DIRECTIONS.map(dir => (
          <option key={dir} value={dir}>{dir}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar; 