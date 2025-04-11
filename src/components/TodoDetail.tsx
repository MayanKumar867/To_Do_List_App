'use client';

import { useState, useEffect } from 'react';

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
}

interface TodoDetailProps {
  todo: Todo;
  onUpdate: (id: string, title: string, description: string) => void;
}

export default function TodoDetail({ todo, onUpdate }: TodoDetailProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description);
    setIsEditing(false);
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onUpdate(todo._id, title, description);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Todo Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-500 hover:text-blue-600"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-title" className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
              placeholder="Enter title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-description" className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
              rows={5}
              placeholder="Enter description"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 whitespace-pre-wrap">{description}</p>
          <p className="text-sm text-gray-500">
            Created on: {new Date(todo.date).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
} 