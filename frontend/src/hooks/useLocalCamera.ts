/**
 * useLocalCamera Hook
 * Captura webcam LOCAL no navegador/Electron
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Iniciar captura da câmera
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      console.log('📹 Requesting camera access...');

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsActive(true);
      console.log('✅ Camera started successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      console.error('❌ Camera error:', err);
    }
  }, []);

  // Parar câmera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('🛑 Camera track stopped');
      });
      setStream(null);
    }
    setIsActive(false);
  }, [stream]);

  // Capturar frame atual como base64
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Ajustar tamanho do canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenhar frame do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converter para base64 (JPEG com 80% de qualidade)
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    
    // Retornar apenas a parte base64 (sem o prefixo data:image/jpeg;base64,)
    return base64.split(',')[1];
  }, []);

  // Obter elemento de vídeo para exibição
  const getVideoElement = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(err => console.error('Video play error:', err));
    }
  }, [stream]);

  // Obter canvas para captura
  const getCanvasElement = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    isActive,
    error,
    startCamera,
    stopCamera,
    captureFrame,
    getVideoElement,
    getCanvasElement,
  };
}
