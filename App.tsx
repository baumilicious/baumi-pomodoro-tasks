
import React, { useState, useEffect, useCallback } from 'react';
import { TodoList } from './components/TodoList';
import { PomodoroTimer } from './components/PomodoroTimer';
import type { Todo } from './types';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
      return [];
    }
  });

  const [activeTodoId, setActiveTodoId] = useState<string | null>(() => {
     const activeId = localStorage.getItem('activeTodoId');
     return activeId ? JSON.parse(activeId) : null;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('activeTodoId', JSON.stringify(activeTodoId));
  }, [activeTodoId]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      pomodoros: 0,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    if (activeTodoId === id) {
      setActiveTodoId(null);
    }
  };

  const incrementPomodoro = useCallback(() => {
    if (activeTodoId) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === activeTodoId
            ? { ...todo, pomodoros: todo.pomodoros + 1 }
            : todo
        )
      );
    }
  }, [activeTodoId]);
  
  const activeTodo = todos.find(todo => todo.id === activeTodoId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 font-sans">
      <main className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-800/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-slate-700">
        <div className="md:pr-8 md:border-r border-slate-700">
          <PomodoroTimer onPomodoroComplete={incrementPomodoro} activeTask={activeTodo} />
        </div>
        <div className="md:pl-8">
          <TodoList
            todos={todos}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            activeTodoId={activeTodoId}
            setActiveTodoId={setActiveTodoId}
          />
        </div>
      </main>
      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Built by a world-class senior frontend React engineer.</p>
      </footer>
    </div>
  );
};

export default App;
