'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { removeToken } from '@/lib/auth';
import ChatWidget from '@/components/ChatWidget';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
  const { theme } = useTheme();

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
      <div className={`min-h-screen relative overflow-hidden flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        {/* Background */}
        <div className={`fixed inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#000208] via-[#00050f] to-black opacity-95'
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
        }`} />

        <div className="relative z-10 text-center">
          <motion.div
            className={`w-20 h-20 mx-auto mb-6 border-4 rounded-full ${
              theme === 'dark'
                ? 'border-blue-900 border-t-blue-700'
                : 'border-blue-300 border-t-blue-600'
            }`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Background */}
      <div className={`fixed inset-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#000208] via-[#00050f] to-black opacity-95'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
      }`} />
      <div className={`fixed inset-0 ${
        theme === 'dark'
          ? 'bg-[linear-gradient(to_right,#0a1929_1px,transparent_1px),linear-gradient(to_bottom,#0a1929_1px,transparent_1px)] bg-[size:40px_40px]'
          : 'bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:40px_40px]'
      }`} />

      {/* Animated Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(5, 15, 35, 0.12) 0%, rgba(5, 15, 35, 0) 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)',
            filter: 'blur(80px)',
            top: '-200px',
            left: '-150px',
          }}
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(8, 20, 45, 0.1) 0%, rgba(8, 20, 45, 0) 70%)'
              : 'radial-gradient(circle, rgba(147, 197, 253, 0.2) 0%, rgba(147, 197, 253, 0) 70%)',
            filter: 'blur(80px)',
            bottom: '-200px',
            right: '-150px',
          }}
          animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 3 }}
        />
      </div>

      {/* Navbar */}
      <nav className={`relative z-50 border-b backdrop-blur-2xl ${
        theme === 'dark'
          ? 'border-[#0a1929]/50 bg-black/70'
          : 'border-blue-200/50 bg-white/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative group">
                <div className={`absolute -inset-2 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/40'
                    : 'bg-gradient-to-r from-blue-400/20 to-blue-300/20'
                }`} />
                <div className={`relative px-8 py-4 rounded-2xl border-2 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#000510] to-[#00080f] border-blue-900/40'
                    : 'bg-gradient-to-br from-white to-blue-50 border-blue-400/40'
                }`}>
                  <h1 className="text-3xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                      TODO
                    </span>
                    <span className={`ml-3 text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI</span>
                  </h1>
                </div>
              </div>
              <Link
                href="/"
                className={`group transition-colors ${
                  theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                <div className={`border-2 rounded-xl p-3 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#00080f]/60 group-hover:bg-[#000c15]/80 border-blue-900/40 group-hover:border-blue-800/60'
                    : 'bg-white/60 group-hover:bg-blue-50/80 border-blue-300/40 group-hover:border-blue-500/60'
                }`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </Link>
            </motion.div>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ThemeToggle />
              <motion.button
                onClick={handleLogout}
                className={`group relative px-8 py-3 font-black text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl ${
                  theme === 'dark' ? 'shadow-red-900/50' : 'shadow-red-500/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`absolute inset-0 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-red-900 via-red-800 to-red-900'
                    : 'bg-gradient-to-r from-red-600 via-red-500 to-red-600'
                }`} />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-red-900 via-red-800 to-red-900'
                    : 'bg-gradient-to-r from-red-600 via-red-500 to-red-600'
                }`} />
                <span className="relative">Logout</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="absolute inset-0 bg-red-900/20 rounded-2xl blur-lg" />
              <div className="relative bg-red-900/20 border-2 border-red-700/40 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-sm text-red-300 font-semibold">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Task */}
        <motion.div
          className="relative group mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-500 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30'
              : 'bg-gradient-to-r from-blue-400/20 to-blue-300/20'
          }`} />

          <div className={`relative p-8 rounded-3xl border-2 backdrop-blur-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#00080f]/90 to-[#000510]/90 border-blue-900/40'
              : 'bg-gradient-to-br from-white/90 to-blue-50/90 border-blue-400/40'
          }`}>
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-xl mr-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900 to-blue-800'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500'
              }`}>
                <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-200' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Create New Task</h3>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none transition-all backdrop-blur-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-[#00080f]/80 border-blue-900/40 text-white placeholder-blue-300/30 focus:border-blue-700/60 focus:bg-[#000c15]/90'
                      : 'bg-white/80 border-blue-300/40 text-gray-900 placeholder-gray-400 focus:border-blue-500/60 focus:bg-white'
                  }`}
                  placeholder="What needs to be done?"
                  required
                />
              </div>
              <div>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none transition-all backdrop-blur-sm resize-none font-medium ${
                    theme === 'dark'
                      ? 'bg-[#00080f]/80 border-blue-900/40 text-white placeholder-blue-300/30 focus:border-blue-700/60 focus:bg-[#000c15]/90'
                      : 'bg-white/80 border-blue-300/40 text-gray-900 placeholder-gray-400 focus:border-blue-500/60 focus:bg-white'
                  }`}
                  placeholder="Add some details (optional)..."
                  rows={3}
                />
              </div>
              <motion.button
                type="submit"
                className={`group relative px-8 py-4 text-white font-black text-lg rounded-2xl overflow-hidden transition-all shadow-2xl ${
                  theme === 'dark' ? 'shadow-blue-900/50' : 'shadow-blue-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'
                }`} />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'
                }`} />
                <span className="relative">Add Task</span>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-500 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30'
              : 'bg-gradient-to-r from-blue-400/20 to-blue-300/20'
          }`} />

          <div className={`relative p-8 rounded-3xl border-2 backdrop-blur-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#00080f]/90 to-[#000510]/90 border-blue-900/40'
              : 'bg-gradient-to-br from-white/90 to-blue-50/90 border-blue-400/40'
          }`}>
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-xl mr-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900 to-blue-800'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500'
              }`}>
                <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-200' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Your Tasks <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>({tasks.length})</span></h3>
            </div>

            {tasks.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border-2 border-blue-900/40">
                  <svg className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-blue-200/80 text-lg font-bold">No tasks yet. Create one above!</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-[#00080f]/80 p-6 rounded-2xl border-2 border-blue-900/40 hover:border-blue-800/60 transition-all backdrop-blur-sm shadow-lg hover:shadow-blue-900/20"
                  >
                    {editingTaskId === task.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-5 py-4 bg-[#000510]/80 border-2 border-blue-900/40 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-700/60 focus:ring-2 focus:ring-blue-700/50 transition-all font-medium"
                          placeholder="Task title..."
                          autoFocus
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-5 py-4 bg-[#000510]/80 border-2 border-blue-900/40 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-700/60 focus:ring-2 focus:ring-blue-700/50 transition-all resize-none font-medium"
                          placeholder="Description (optional)..."
                          rows={3}
                        />
                        <div className="flex gap-3">
                          <motion.button
                            onClick={() => handleSaveEdit(task.id)}
                            className="px-6 py-3 bg-gradient-to-r from-green-900 to-green-800 text-white font-black rounded-xl hover:from-green-800 hover:to-green-700 transition-all shadow-lg shadow-green-900/30"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Save
                          </motion.button>
                          <motion.button
                            onClick={handleCancelEdit}
                            className="px-6 py-3 bg-[#00080f]/80 border-2 border-blue-900/40 text-white font-black rounded-xl hover:bg-[#000c15]/80 transition-all"
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
                            <h4 className={`text-xl font-black mb-2 ${task.status === 'Complete' ? 'line-through text-blue-600/50' : 'text-white'}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-blue-200/80 leading-relaxed">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                              <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-sm text-blue-400 font-bold">
                                {new Date(task.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <motion.span
                            className={`px-4 py-2 rounded-xl text-sm font-black backdrop-blur-sm ${
                              task.status === 'Complete'
                                ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 text-green-300 border-2 border-green-800/50'
                                : 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 text-blue-300 border-2 border-blue-800/50'
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
                                ? 'bg-gradient-to-r from-blue-900 to-blue-800'
                                : 'bg-gradient-to-r from-green-900 to-green-800'
                            } text-white font-black rounded-xl hover:opacity-90 transition-all shadow-lg`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {task.status === 'Complete' ? 'Undo' : 'Complete'}
                          </motion.button>
                          <motion.button
                            onClick={() => handleStartEdit(task)}
                            className="px-5 py-2.5 bg-gradient-to-r from-cyan-900 to-blue-900 text-white font-black rounded-xl hover:opacity-90 transition-all shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteTask(task.id)}
                            className="px-5 py-2.5 bg-gradient-to-r from-red-900 to-red-800 text-white font-black rounded-xl hover:opacity-90 transition-all shadow-lg"
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
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 border-t backdrop-blur-2xl py-12 mt-32 ${
        theme === 'dark'
          ? 'border-[#0a1929]/50 bg-black/70'
          : 'border-blue-200/50 bg-white/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`text-xl mb-2 ${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>
            Build with D/O :{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent font-black text-2xl">
              Syed Rashid Ali
            </span>
          </p>
          <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-400/60' : 'text-blue-600/60'}`}>Phase III • AI-Powered Task Management</p>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}
