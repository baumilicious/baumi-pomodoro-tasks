
import React from 'react';
import type { Todo } from '../types';
import { TrashIcon } from './Icons';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string | null) => void;
  isSelected: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onSelect, isSelected }) => {
  const handleSelect = () => {
    if (todo.completed) return;
    onSelect(isSelected ? null : todo.id);
  };
  
  return (
    <div className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${isSelected ? 'bg-red-500/20 ring-2 ring-red-500' : 'bg-slate-700/50 hover:bg-slate-700'}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="form-checkbox h-5 w-5 text-red-500 bg-slate-600 border-slate-500 rounded focus:ring-red-500 cursor-pointer"
      />
      <div className="flex-grow ml-4" onClick={handleSelect}>
        <span className={` ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
          {todo.text}
        </span>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <span className="text-sm text-slate-400 font-mono">{todo.pomodoros}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }} 
          className="text-slate-500 hover:text-red-400 transition-colors duration-200"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
