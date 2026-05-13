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

        // Event: Chat Response (resposta do Jarvis)
        this.socket.on('chat:response', (data) => {
          console.log('💬 Resposta do Jarvis:', data);
          this.emit('chat:response', data);
        });

        // Event: Audio Transcription (transcrição do áudio)
        this.socket.on('audio:transcription', (data) => {
          console.log('📝 Transcrição:', data.text);
          this.emit('audio:transcription', data);
        });

        // Event: Audio Response (áudio de resposta do Jarvis)
        this.socket.on('audio:response', (data) => {
          console.log('🔊 Áudio recebido do Jarvis');
          this.emit('audio:response', data);
          
          // Reproduzir áudio automaticamente
          if (data.audio) {
            try {
              const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
              audio.play().catch(err => console.error('Erro ao reproduzir áudio:', err));
            } catch (err) {
              console.error('Erro ao criar áudio:', err);
            }
          }
        });

        // Event: Vision Analysis (análise visual)
        this.socket.on('vision:analysis', (data) => {
          console.log('👁️ Análise visual:', data);
          this.emit('vision:analysis', data);
        });

        // Event: Camera Frame Received
        this.socket.on('camera:frame_received', (data) => {
          console.log('📸 Frame recebido pelo backend');
          this.emit('camera:frame_received', data);
        });

        // Event: Errors
        this.socket.on('chat:error', (data) => {
          console.error('❌ Erro no chat:', data.error);
          this.emit('chat:error', data);
        });

        this.socket.on('audio:error', (data) => {
          console.error('❌ Erro no áudio:', data.error);
          this.emit('audio:error', data);
        });

        this.socket.on('vision:error', (data) => {
          console.error('❌ Erro na visão:', data.error);
          this.emit('vision:error', data);
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
    if (!this.socket) {
      console.error('❌ WebSocket not connected');
      this.emit('audio:error', { error: 'Not connected' });
      return;
    }

    // Validar tamanho do áudio (max ~750KB em base64)
    const sizeInBytes = (audioBase64.length * 3) / 4;
    const sizeInKB = Math.round(sizeInBytes / 1024);
    
    console.log('🎤 Sending audio for transcription, size:', sizeInKB, 'KB');
    
    if (sizeInBytes > 800 * 1024) { // 800KB limit
      console.error('❌ Audio too large:', sizeInKB, 'KB');
      this.emit('audio:error', { 
        error: 'Áudio muito grande. Tente gravar uma mensagem mais curta (max 5 segundos).' 
      });
      return;
    }

    try {
      this.socket.emit('audio_data', { audio: audioBase64 });
    } catch (error) {
      console.error('❌ Error sending audio:', error);
      this.emit('audio:error', { 
        error: error instanceof Error ? error.message : 'Erro ao enviar áudio' 
      });
    }
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
