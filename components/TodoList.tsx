
import React, { useState } from 'react';
import type { Todo } from '../types';
import { TodoItem } from './TodoItem';
import { PlusIcon } from './Icons';

interface TodoListProps {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  activeTodoId: string | null;
  setActiveTodoId: (id: string | null) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, addTodo, toggleTodo, deleteTodo, activeTodoId, setActiveTodoId }) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-slate-200">Tasks</h2>
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow bg-slate-700 border border-slate-600 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-r-md hover:bg-red-600 transition-colors duration-200 flex items-center">
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-grow overflow-y-auto pr-2 space-y-2">
        {uncompletedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onSelect={setActiveTodoId}
            isSelected={activeTodoId === todo.id}
          />
        ))}
        {completedTodos.length > 0 && uncompletedTodos.length > 0 && <hr className="border-slate-700 my-4"/>}
        {completedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onSelect={setActiveTodoId}
            isSelected={activeTodoId === todo.id}
          />
        ))}
      </div>
    </div>
  );
};
