/**
 * Zustand Store - Estado Global da Aplicação
 */
import { create } from 'zustand';
import type { ChatMessage, SystemStatus } from '@shared/events';

export type { ChatMessage, SystemStatus };

interface AppState {
  // Connection
  isConnected: boolean;
  backendUrl: string;
  setConnected: (connected: boolean) => void;
  setBackendUrl: (url: string) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;

  // Camera
  isCameraActive: boolean;
  cameraFrame: string | null;
  setCameraActive: (active: boolean) => void;
  setCameraFrame: (frame: string | null) => void;

  // System
  systemStatus: SystemStatus;
  setSystemStatus: (status: Partial<SystemStatus>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Connection
  isConnected: false,
  backendUrl: '',
  setConnected: (connected) => set({ isConnected: connected }),
  setBackendUrl: (url) => set({ backendUrl: url }),

  // Chat
  messages: [
    {
      id: '0',
      sender: 'ai',
      text: 'Olá! Sou o J.A.R.V.I.S, seu assistente virtual. Como posso ajudá-lo hoje?',
      timestamp: Date.now(),
    },
  ],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  // Camera
  isCameraActive: false,
  cameraFrame: null,
  setCameraActive: (active) => set({ isCameraActive: active }),
  setCameraFrame: (frame) => set({ cameraFrame: frame }),

  // System
  systemStatus: {
    cpu: 0,
    memory: 0,
    backend: 'offline',
    websocket: 'disconnected',
  },
  setSystemStatus: (status) =>
    set((state) => ({
      systemStatus: { ...state.systemStatus, ...status },
    })),
}));
