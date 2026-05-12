/**
 * Shared Types for Jarvis IA
 * Common types used across frontend and backend
 */

export type MessageSender = 'user' | 'ai';
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';
export type SystemStatusType = 'online' | 'offline' | 'busy' | 'listening' | 'processing' | 'speaking';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface AuthToken {
  token: string;
  expiresAt: number;
}

// Re-export event types
export * from './events';
