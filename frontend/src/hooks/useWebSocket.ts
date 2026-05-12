/**
 * useWebSocket Hook
 * Gerencia conexão WebSocket
 */
import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import websocketService from '../services/websocket';

export function useWebSocket(backendUrl: string) {
  const { isConnected, setConnected, setSystemStatus } = useAppStore();

  // Conectar ao WebSocket
  const connect = useCallback(async () => {
    if (!backendUrl) {
      console.warn('Backend URL not set');
      return;
    }

    try {
      await websocketService.connect(backendUrl);
      setConnected(true);
      setSystemStatus({ websocket: 'connected' });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnected(false);
      setSystemStatus({ websocket: 'disconnected' });
    }
  }, [backendUrl, setConnected, setSystemStatus]);

  // Desconectar
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setConnected(false);
    setSystemStatus({ websocket: 'disconnected' });
  }, [setConnected, setSystemStatus]);

  // Conectar automaticamente ao montar
  useEffect(() => {
    if (backendUrl && !isConnected) {
      connect();
    }

    // Cleanup ao desmontar
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [backendUrl]); // Apenas backendUrl como dependência

  // Listener para status de conexão
  useEffect(() => {
    const handleConnectionStatus = (data: { connected: boolean }) => {
      setConnected(data.connected);
      setSystemStatus({
        websocket: data.connected ? 'connected' : 'disconnected',
      });
    };

    websocketService.on('connection:status', handleConnectionStatus);

    return () => {
      websocketService.off('connection:status', handleConnectionStatus);
    };
  }, [setConnected, setSystemStatus]);

  return {
    isConnected,
    connect,
    disconnect,
  };
}
