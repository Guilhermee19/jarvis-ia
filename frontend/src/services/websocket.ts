/**
 * WebSocket Service
 * Gerencia conexão WebSocket com o backend
 */
import { io, Socket } from 'socket.io-client';
import type { ChatMessage } from '@shared/events';

type EventCallback = (data: any) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private eventHandlers: Map<string, EventCallback[]> = new Map();

  /**
   * Conectar ao servidor WebSocket
   */
  connect(url: string, token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Connecting to WebSocket:', url);

        this.socket = io(url, {
          transports: ['websocket', 'polling'],
          auth: {
            token: token || 'dev-token',
          },
          reconnection: true,
          reconnectionDelay: this.reconnectDelay,
          reconnectionAttempts: this.maxReconnectAttempts,
        });

        // Event: Connected
        this.socket.on('connect', () => {
          console.log('✅ WebSocket connected');
          this.reconnectAttempts = 0;
          this.emit('connection:status', { connected: true });
          resolve();
        });

        // Event: Disconnected
        this.socket.on('disconnect', (reason) => {
          console.warn('❌ WebSocket disconnected:', reason);
          this.emit('connection:status', { connected: false });
        });

        // Event: Connect Error
        this.socket.on('connect_error', (error) => {
          console.error('❌ WebSocket connection error:', error.message);
          this.reconnectAttempts++;
          
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.emit('connection:error', { error: error.message });
            reject(error);
          }
        });

        // Event: Reconnect
        this.socket.on('reconnect', (attempt) => {
          console.log('🔄 WebSocket reconnected after', attempt, 'attempts');
          this.reconnectAttempts = 0;
        });

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Desconectar do servidor
   */
  disconnect(): void {
    if (this.socket) {
      console.log('👋 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Verificar se está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Enviar mensagem de chat
   */
  sendChatMessage(message: string): void {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    const payload: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: Date.now(),
    };

    console.log('📤 Sending chat message:', payload);
    this.socket.emit('chat_message', payload);
  }

  /**
   * Solicitar frame da câmera
   */
  requestCameraFrame(): void {
    if (!this.socket) return;
    console.log('📸 Requesting camera frame');
    this.socket.emit('camera_request');
  }

  /**
   * Iniciar câmera
   */
  startCamera(): void {
    if (!this.socket) return;
    console.log('🎥 Starting camera');
    this.socket.emit('camera_start');
  }

  /**
   * Parar câmera
   */
  stopCamera(): void {
    if (!this.socket) return;
    console.log('⏹️ Stopping camera');
    this.socket.emit('camera_stop');
  }

  /**
   * Enviar frame capturado da câmera
   */
  sendCameraFrame(frameBase64: string): void {
    if (!this.socket) return;
    this.socket.emit('camera_frame', { frame: frameBase64 });
  }

  /**
   * Solicitar análise de imagem
   */
  analyzeImage(frameBase64: string): void {
    if (!this.socket) return;
    console.log('🔍 Requesting image analysis');
    this.socket.emit('analyze_image', { frame: frameBase64 });
  }

  /**
   * Enviar áudio gravado para processamento
   */
  sendAudio(audioBase64: string): void {
    if (!this.socket) return;
    console.log('🎤 Sending audio for transcription');
    this.socket.emit('audio_data', { audio: audioBase64 });
  }

  /**
   * Executar ação do sistema
   */
  executeAction(action: string, params?: Record<string, any>): void {
    if (!this.socket) return;
    console.log('⚡ Executing action:', action, params);
    this.socket.emit('action_execute', { action, params });
  }

  /**
   * Registrar listener para evento
   */
  on(event: string, callback: EventCallback): void {
    if (!this.socket) {
      console.warn('Cannot register event listener: socket not connected');
      return;
    }

    // Adicionar ao mapa de handlers locais
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(callback);

    // Registrar no socket
    this.socket.on(event, callback);
  }

  /**
   * Remover listener de evento
   */
  off(event: string, callback?: EventCallback): void {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
      
      // Remover do mapa local
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(callback);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    } else {
      this.socket.off(event);
      this.eventHandlers.delete(event);
    }
  }

  /**
   * Emitir evento interno
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  /**
   * Obter instância do socket
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
export default websocketService;
