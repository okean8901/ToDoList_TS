'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/lib/types';
import Cookies from 'js-cookie';

export function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await apiClient.get('/todos');
      setTodos(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to fetch todos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const payload: CreateTodoRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
      };
      const response = await apiClient.post('/todos', payload);
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError('Failed to create todo');
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const payload: UpdateTodoRequest = {
        isCompleted: !todo.isCompleted,
      };
      const response = await apiClient.put(`/todos/${todo.id}`, payload);
      setTodos(todos.map((t) => (t.id === todo.id ? response.data : t)));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await apiClient.delete(`/todos/${todoId}`);
      setTodos(todos.filter((t) => t.id !== todoId));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Todos</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Todo</h2>
          <form onSubmit={handleAddTodo} className="space-y-4">
            <input
              type="text"
              placeholder="Todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add Todo
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">No todos yet. Create one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition"
              >
                <div className="flex-1">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => handleToggleTodo(todo)}
                    className="mr-4 cursor-pointer"
                  />
                  <div className="inline-block">
                    <h3
                      className={`font-semibold ${
                        todo.isCompleted
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
