'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { removeToken } from '@/lib/auth';
import ChatWidget from '@/components/ChatWidget';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Add a small delay to ensure localStorage is available
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }
      fetchTasks();
    };
    checkAuth();

    // Listen for task updates from chat
    const handleTaskUpdate = () => {
      fetchTasks();
    };
    window.addEventListener('taskUpdated', handleTaskUpdate);

    return () => {
      window.removeEventListener('taskUpdated', handleTaskUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/api/tasks/');
      setTasks(response.data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await apiClient.post('/api/tasks/', {
        title: newTaskTitle,
        description: newTaskDescription || null
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create task');
    }
  };

  const handleToggleStatus = async (taskId: number) => {
    try {
      await apiClient.post(`/api/tasks/${taskId}/toggle`);
      fetchTasks();
    } catch (err: any) {
      setError('Failed to toggle task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await apiClient.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err: any) {
      setError('Failed to delete task');
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (taskId: number) => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    try {
      await apiClient.put(`/api/tasks/${taskId}`, {
        title: editTitle,
        description: editDescription || null
      });
      setEditingTaskId(null);
      setEditTitle('');
      setEditDescription('');
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Loading...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -top-48 -right-48"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-1/3 left-0"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/3"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 40, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 14, repeat: Infinity, delay: 4 }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative bg-black/40 backdrop-blur-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Todo AI
                </span>
                <span className="text-white ml-2 text-xl">Dashboard</span>
              </h1>
              <Link
                href="/"
                className="text-purple-400 hover:text-purple-300 transition-colors backdrop-blur-sm bg-purple-500/10 p-2 rounded-lg border border-purple-500/30"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </motion.div>
            <motion.button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg shadow-red-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 backdrop-blur-sm"
            >
              <p className="text-red-300 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Task */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/90 to-purple-900/50 p-8 rounded-3xl border-2 border-purple-500/30 mb-8 backdrop-blur-xl shadow-2xl shadow-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl mr-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Create New Task</h3>
          </div>
          <form onSubmit={handleCreateTask} className="space-y-5">
            <div>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-5 py-4 bg-slate-900/80 border-2 border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all backdrop-blur-sm"
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full px-5 py-4 bg-slate-900/80 border-2 border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all backdrop-blur-sm resize-none"
                placeholder="Add some details (optional)..."
                rows={3}
              />
            </div>
            <motion.button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all shadow-lg shadow-purple-500/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Task
            </motion.button>
          </form>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/90 to-purple-900/50 p-8 rounded-3xl border-2 border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Your Tasks <span className="text-purple-400">({tasks.length})</span></h3>
          </div>

          {tasks.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border-2 border-purple-500/30">
                <svg className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-300 text-lg font-medium">No tasks yet. Create one above!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-slate-900/80 p-6 rounded-2xl border-2 border-purple-500/30 hover:border-pink-500/50 transition-all backdrop-blur-sm shadow-lg hover:shadow-pink-500/20"
                >
                  {editingTaskId === task.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-800/80 border-2 border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
                        placeholder="Task title..."
                        autoFocus
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-800/80 border-2 border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all resize-none"
                        placeholder="Description (optional)..."
                        rows={3}
                      />
                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => handleSaveEdit(task.id)}
                          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Save
                        </motion.button>
                        <motion.button
                          onClick={handleCancelEdit}
                          className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className={`text-xl font-bold mb-2 ${task.status === 'Complete' ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-gray-300 leading-relaxed">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-purple-400 font-medium">
                              {new Date(task.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <motion.span
                          className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm ${
                            task.status === 'Complete'
                              ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border-2 border-green-500/50'
                              : 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-300 border-2 border-yellow-500/50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {task.status}
                        </motion.span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          onClick={() => handleToggleStatus(task.id)}
                          className={`px-5 py-2.5 ${
                            task.status === 'Complete'
                              ? 'bg-gradient-to-r from-yellow-600 to-orange-600'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600'
                          } text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {task.status === 'Complete' ? 'Undo' : 'Complete'}
                        </motion.button>
                        <motion.button
                          onClick={() => handleStartEdit(task)}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black/40 backdrop-blur-xl border-t border-purple-500/30 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300 text-lg">
            Built with passion by{' '}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-bold">
              Syed Rashid Ali
            </span>
            {' • '}
            <span className="text-purple-400 font-semibold">Phase III: AI-Powered</span>
          </p>
          <p className="text-purple-400 text-sm mt-2 font-medium">
            FREE Local AI • No API Keys Required
          </p>
        </div>
      </footer>

      {/* AI Chat Widget - FREE Local AI (No API key needed!) */}
      <ChatWidget />
    </div>
  );
}
