'use client';

import { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import TodoDetail from '@/components/TodoDetail';

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setErrorMessage('Failed to load todos. Please check the console for more details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (title: string, description: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error adding todo:', error);
      setErrorMessage('Failed to add todo. Please check the console for more details.');
    }
  };

  const handleUpdateTodo = async (id: string, title: string, description: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
      setSelectedTodo(updatedTodo);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error updating todo:', error);
      setErrorMessage('Failed to update todo. Please check the console for more details.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Todo App</h1>
        
        {errorMessage && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {loading && todos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg">Loading todos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <TodoForm onSubmit={handleAddTodo} />
              <TodoList 
                todos={todos} 
                onTodoClick={setSelectedTodo}
                selectedTodoId={selectedTodo?._id}
              />
            </div>
            <div>
              {selectedTodo && (
                <TodoDetail 
                  todo={selectedTodo}
                  onUpdate={handleUpdateTodo}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
