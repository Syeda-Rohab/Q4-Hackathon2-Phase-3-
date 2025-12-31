'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage, getChatHistory, type ChatMessage } from '@/lib/chatApi';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // DON'T load chat history - always start fresh
  useEffect(() => {
    if (isOpen) {
      // Clear messages for fresh start
      setMessages([]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    const history = await getChatHistory(20);
    setMessages(history);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    const newUserMsg: ChatMessage = {
      message: userMessage,
      isUser: true,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // Send to API
      const response = await sendChatMessage(userMessage);

      // Add bot response
      const botMsg: ChatMessage = {
        message: response.response,
        isUser: false,
        intent: response.action,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, botMsg]);

      // Trigger task refresh if needed
      if (response.action && response.action !== 'general') {
        // Emit custom event to refresh tasks
        window.dispatchEvent(new CustomEvent('taskUpdated'));
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        message: 'Error: ' + (error.message || 'Failed to send message'),
        isUser: false,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice recognition (basic browser API)
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in your browser. Try Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const quickActions = [
    { label: 'Show tasks', action: 'Show my tasks', icon: '📋' },
    { label: 'Add task', action: 'Add task ', icon: '➕' },
    { label: 'Help', action: 'help', icon: '❓' },
  ];

  return (
    <>
      {/* Toggle Button - SUPER VIBRANT! */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white p-6 rounded-full shadow-2xl z-50 border-4 border-white/30"
        whileHover={{ scale: 1.15, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 30px rgba(236, 72, 153, 0.6)',
            '0 0 60px rgba(147, 51, 234, 0.8)',
            '0 0 30px rgba(59, 130, 246, 0.6)',
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
          default: { type: "spring", stiffness: 400, damping: 10 }
        }}
      >
        <motion.span
          className="text-4xl"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {isOpen ? '✕' : '🤖'}
        </motion.span>
      </motion.button>

      {/* Chat Window - AMAZING DESIGN! */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-6 w-[450px] h-[700px] rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 border-2 border-purple-400/50"
            style={{
              boxShadow: '0 0 80px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.3)'
            }}
          >
            {/* Header - VIBRANT GRADIENT */}
            <div className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 p-6 rounded-t-3xl overflow-hidden">
              {/* Animated background particles */}
              <div className="absolute inset-0 opacity-30">
                <motion.div
                  className="absolute w-40 h-40 bg-white rounded-full -top-16 -left-16 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-32 h-32 bg-pink-300 rounded-full -bottom-12 -right-12 blur-2xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.4, 0.6, 0.4]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-md border-2 border-white/40 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <span className="text-3xl">🤖</span>
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-xl text-white tracking-wide">AI Assistant</h3>
                    <p className="text-xs text-pink-100 font-medium">FREE • Instant • Smart</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/30 rounded-xl p-2.5 transition-all backdrop-blur-sm border border-white/20"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Messages - BEAUTIFUL SCROLLING AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-900/50 via-purple-900/20 to-slate-900/50">
              {messages.length === 0 && (
                <motion.div
                  className="text-center mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="text-7xl mb-6"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👋
                  </motion.div>
                  <h2 className="font-bold text-2xl text-white mb-3">Welcome!</h2>
                  <p className="text-gray-300 mb-2">I'm your AI task assistant</p>
                  <motion.div
                    className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-semibold mt-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    Try: "Add task buy groceries"
                  </motion.div>
                </motion.div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.isUser ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl shadow-xl backdrop-blur-md ${
                      msg.isUser
                        ? 'bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white rounded-br-md border-2 border-pink-400/50'
                        : 'bg-gradient-to-br from-slate-800/90 to-purple-900/40 text-gray-100 rounded-bl-md border-2 border-purple-500/30'
                    }`}
                  >
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-2 font-mono">
                      {new Date(msg.created_at || '').toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-br from-slate-800/90 to-purple-900/40 p-5 rounded-2xl shadow-xl border-2 border-purple-500/30 rounded-bl-md backdrop-blur-md">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-purple-200 font-semibold">AI thinking</div>
                      <div className="flex space-x-1.5">
                        <motion.div
                          className="w-2.5 h-2.5 bg-pink-500 rounded-full"
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.4, 1, 0.4],
                            y: [0, -8, 0]
                          }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2.5 h-2.5 bg-purple-500 rounded-full"
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.4, 1, 0.4],
                            y: [0, -8, 0]
                          }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.4, 1, 0.4],
                            y: [0, -8, 0]
                          }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions - VIBRANT CHIPS */}
            {messages.length === 0 && !isLoading && (
              <motion.div
                className="px-6 py-4 bg-gradient-to-r from-slate-900/80 via-purple-900/30 to-slate-900/80 border-t-2 border-purple-500/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-purple-300 mb-3 font-bold uppercase tracking-wider">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((qa, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setInput(qa.action)}
                      className="text-sm bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-2 border-purple-400/50 px-4 py-2.5 rounded-xl hover:from-pink-600/50 hover:to-purple-600/50 transition-all text-white font-semibold shadow-lg backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-2">{qa.icon}</span>
                      {qa.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area - MODERN & SLEEK */}
            <div className="p-6 bg-gradient-to-r from-slate-900/90 via-purple-900/40 to-slate-900/90 border-t-2 border-purple-500/30 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                {/* Voice Button */}
                <motion.button
                  onClick={startVoiceRecognition}
                  disabled={isListening}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3.5 rounded-xl transition-all shadow-lg backdrop-blur-md border-2 ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-400 animate-pulse shadow-red-500/60'
                      : 'bg-gradient-to-r from-slate-700 to-purple-700 border-purple-400/50 hover:from-slate-600 hover:to-purple-600'
                  }`}
                  title="Voice input"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </motion.button>

                {/* Text Input */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? 'Listening...' : 'Type your message...'}
                  disabled={isLoading || isListening}
                  className="flex-1 px-5 py-3.5 bg-slate-800/80 border-2 border-purple-500/40 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-slate-800/40 disabled:cursor-not-allowed backdrop-blur-sm font-medium transition-all"
                />

                {/* Send Button */}
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white p-3.5 rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg border-2 border-white/30"
                  style={{
                    boxShadow: !input.trim() ? 'none' : '0 0 20px rgba(236, 72, 153, 0.5)'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
