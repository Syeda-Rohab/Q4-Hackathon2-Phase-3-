/**
 * Chat API client for AI-powered task management
 */

import api from './api';

export interface ChatMessage {
  id?: number;
  message: string;
  response?: string;
  intent?: string;
  created_at?: string;
  isUser: boolean;
}

export interface ChatResponse {
  response: string;
  action?: string;
  task_id?: number;
  confidence?: number;
}

export interface ChatHistoryResponse {
  messages: Array<{
    id: number;
    message: string;
    response: string;
    intent: string;
    created_at: string;
  }>;
}

/**
 * Send a message to the AI chatbot
 */
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await api.post<ChatResponse>('/chat/message', { message });
    return response.data;
  } catch (error: any) {
    console.error('Chat API error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to send message');
  }
}

/**
 * Get chat history
 */
export async function getChatHistory(limit: number = 50): Promise<ChatMessage[]> {
  try {
    const response = await api.get<ChatHistoryResponse>('/chat/history', {
      params: { limit }
    });

    // Convert to ChatMessage format
    return response.data.messages.flatMap((msg) => [
      {
        id: msg.id,
        message: msg.message,
        isUser: true,
        created_at: msg.created_at
      },
      {
        id: msg.id + 0.1, // Slight offset for bot response
        message: msg.response,
        isUser: false,
        intent: msg.intent,
        created_at: msg.created_at
      }
    ]);
  } catch (error: any) {
    console.error('Chat history error:', error);
    return [];
  }
}

/**
 * Clear chat history
 */
export async function clearChatHistory(): Promise<void> {
  try {
    await api.delete('/chat/history');
  } catch (error: any) {
    console.error('Clear history error:', error);
    throw new Error('Failed to clear chat history');
  }
}
