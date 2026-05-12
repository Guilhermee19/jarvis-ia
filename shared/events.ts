/**
 * Shared Event Types for WebSocket Communication
 * Used by both frontend (TypeScript) and backend (Python)
 */

// Chat Events
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Camera Events
export interface CameraFrame {
  frameData: string; // base64 encoded image
  timestamp: number;
  width?: number;
  height?: number;
}

export interface DetectedObject {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

// System Status Events
// Status do Sistema
export interface SystemStatus {
  cpu: number;
  memory: number;
  backend: 'online' | 'offline';
  websocket?: 'connected' | 'disconnected';
  cameraActive?: boolean;
  microphoneActive?: boolean;
  aiModel?: string;
}

// Action Events
export interface ActionResult {
  action: string;
  success: boolean;
  message: string;
  timestamp: number;
  data?: any;
}

// News Events (Phase 6)
export interface NewsHeadline {
  id: string;
  title: string;
  source: string;
  snippet: string;
  url: string;
  publishedAt: number;
}

// Learning Events (Phase 6)
export interface RoutineSuggestion {
  id: string;
  type: 'routine' | 'preference';
  message: string;
  action?: string;
  confidence: number;
  timestamp: number;
}

// WebSocket Event Names
export const SocketEvents = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Chat
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  CHAT_ERROR: 'chat:error',
  
  // Camera
  CAMERA_REQUEST: 'camera:request',
  CAMERA_FRAME: 'camera:frame',
  CAMERA_START: 'camera:start',
  CAMERA_STOP: 'camera:stop',
  CAMERA_DETECTED: 'camera:detected',
  CAMERA_ERROR: 'camera:error',
  
  // System
  SYSTEM_STATUS: 'system:status',
  ACTION_EXECUTE: 'action:execute',
  ACTION_COMPLETE: 'action:complete',
  
  // News (Phase 6)
  NEWS_FETCH: 'news:fetch',
  NEWS_UPDATE: 'news:update',
  
  // Learning (Phase 6)
  LEARNING_SUGGESTION: 'learning:suggestion',
} as const;
