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
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // First test if backend is reachable
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => {
        console.log('Backend connection successful:', data);
        setBackendStatus('connected');
        fetchTodos();
      })
      .catch(error => {
        console.error('Error connecting to backend:', error);
        setBackendStatus('error');
        setErrorMessage('Cannot connect to backend server. Make sure it is running on port 5000.');
      });
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setErrorMessage('Failed to load todos. Please check the console for more details.');
    }
  };

  const handleAddTodo = async (title: string, description: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
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
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
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
        
        {backendStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p><strong>Connection Error:</strong> {errorMessage}</p>
            <p className="mt-2">Please make sure:</p>
            <ul className="list-disc ml-6">
              <li>MongoDB is running</li>
              <li>Backend server is running on port 5000</li>
              <li>You have started the backend with: cd backend; npm run dev</li>
            </ul>
          </div>
        )}
        
        {errorMessage && backendStatus !== 'error' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {backendStatus === 'loading' && (
          <div className="text-center py-10">
            <p className="text-lg">Connecting to backend...</p>
          </div>
        )}
        
        {(backendStatus === 'connected' || todos.length > 0) && (
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
