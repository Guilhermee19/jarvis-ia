/**
 * useCamera Hook
 * Gerencia câmera via WebSocket
 */
import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import websocketService from '../services/websocket';

export function useCamera() {
  const { isCameraActive, cameraFrame, setCameraActive, setCameraFrame } =
    useAppStore();

  // Iniciar câmera
  const startCamera = useCallback(() => {
    console.log('📹 Starting camera...');
    websocketService.startCamera();
    setCameraActive(true);
  }, [setCameraActive]);

  // Parar câmera
  const stopCamera = useCallback(() => {
    console.log('⏹️ Stopping camera...');
    websocketService.stopCamera();
    setCameraActive(false);
    setCameraFrame(null);
  }, [setCameraActive, setCameraFrame]);

  // Solicitar frame
  const requestFrame = useCallback(() => {
    if (!isCameraActive) return;
    websocketService.requestCameraFrame();
  }, [isCameraActive]);

  // Listener para frames da câmera
  useEffect(() => {
    const handleCameraFrame = (data: any) => {
      console.log('📸 Received camera frame');
      
      if (data.frame) {
        // Frame em base64
        setCameraFrame(data.frame);
      }
    };

    const handleCameraStatus = (data: any) => {
      console.log('📹 Camera status:', data);
      setCameraActive(data.active || false);
    };

    websocketService.on('camera_frame', handleCameraFrame);
    websocketService.on('camera_status', handleCameraStatus);

    return () => {
      websocketService.off('camera_frame', handleCameraFrame);
      websocketService.off('camera_status', handleCameraStatus);
    };
  }, [setCameraActive, setCameraFrame]);

  // Auto-request frames quando câmera está ativa
  useEffect(() => {
    if (!isCameraActive) return;

    const interval = setInterval(() => {
      requestFrame();
    }, 1000 / 15); // 15 FPS

    return () => clearInterval(interval);
  }, [isCameraActive, requestFrame]);

  return {
    isCameraActive,
    cameraFrame,
    startCamera,
    stopCamera,
    requestFrame,
  };
}
