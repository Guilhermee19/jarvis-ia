/**
 * useSystemStatus Hook
 * Monitora status do sistema via WebSocket
 */
import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import websocketService from '../services/websocket';

export function useSystemStatus() {
  const { systemStatus, setSystemStatus } = useAppStore();

  useEffect(() => {
    const handleSystemStatus = (data: any) => {
      console.log('📊 System status update:', data);
      
      setSystemStatus({
        cpu: data.cpu || 0,
        memory: data.memory || 0,
        backend: data.backend || 'online',
      });
    };

    websocketService.on('system_status', handleSystemStatus);

    return () => {
      websocketService.off('system_status', handleSystemStatus);
    };
  }, [setSystemStatus]);

  return {
    systemStatus,
  };
}
