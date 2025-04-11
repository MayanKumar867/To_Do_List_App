'use client';

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
}

interface TodoListProps {
  todos: Todo[];
  onTodoClick: (todo: Todo) => void;
  selectedTodoId?: string;
}

export default function TodoList({ todos, onTodoClick, selectedTodoId }: TodoListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="divide-y divide-gray-200">
        {todos.map((todo) => (
          <div
            key={todo._id}
            onClick={() => onTodoClick(todo)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedTodoId === todo._id ? 'bg-blue-50' : ''
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
            <p className="text-gray-600 mt-1 line-clamp-2">{todo.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(todo.date).toLocaleDateString()}
            </p>
          </div>
        ))}
        {todos.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No todos yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
} 