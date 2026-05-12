/**
 * CameraPanel Component
 * Painel de visualização da webcam com controles
 */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, Button, Badge } from "./ui";
import { useLocalCamera } from "../hooks";
import websocketService from "../services/websocket";

export default function CameraPanel() {
  const {
    isActive,
    error,
    startCamera,
    stopCamera,
    captureFrame,
    getVideoElement,
    getCanvasElement,
  } = useLocalCamera();

  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Conectar refs ao hook
  useEffect(() => {
    getVideoElement(videoRef.current);
    getCanvasElement(canvasRef.current);
  }, [getVideoElement, getCanvasElement]);

  // Stream de frames para o backend quando ativo
  useEffect(() => {
    if (!isActive || !isStreaming) return;

    const interval = setInterval(() => {
      const frame = captureFrame();
      if (frame) {
        // Enviar frame para o backend via WebSocket
        websocketService.sendCameraFrame(frame);
      }
    }, 1000 / 15); // 15 FPS

    return () => clearInterval(interval);
  }, [isActive, isStreaming, captureFrame]);

  const handleToggleCamera = async () => {
    if (isActive) {
      stopCamera();
      setIsStreaming(false);
    } else {
      await startCamera();
      setIsStreaming(true);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implementar gravação de vídeo
    console.log("Recording toggle:", !isRecording);
  };

  const handleCapture = () => {
    const frame = captureFrame();
    if (frame) {
      console.log("📸 Frame captured, size:", frame.length);
      // Enviar para análise
      websocketService.analyzeImage(frame);
    }
  };

  const handleAnalyze = () => {
    const frame = captureFrame();
    if (frame) {
      console.log("🔍 Analyzing scene...");
      websocketService.analyzeImage(frame);
    }
  };

  return (
    <Card className="h-full flex flex-col" padding="none">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Camera View</h2>
          <p className="text-sm text-gray-400">
            Visão computacional em tempo real
          </p>
        </div>
        <Badge variant={isActive ? "success" : "error"} dot>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Camera View */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full h-full bg-dark-light rounded-lg overflow-hidden relative">
          {error && (
            <div className="absolute top-4 left-4 right-4 z-50">
              <div className="bg-error/20 border border-error text-white px-4 py-2 rounded-lg">
                ❌ {error}
              </div>
            </div>
          )}

          {isActive ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex items-center justify-center relative"
            >
              {/* Vídeo da câmera LOCAL */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />

              {/* Canvas oculto para captura de frames */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Status overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <div className="glass px-4 py-2 rounded-lg">
                  <p className="text-xs text-gray-400">Resolution</p>
                  <p className="text-sm font-semibold text-white">1280x720</p>
                </div>

                {isRecording && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="glass px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-error rounded-full" />
                    <span className="text-sm font-semibold text-white">
                      REC
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <div className="glass px-3 py-1.5 rounded text-xs text-gray-400">
                  FPS: 15
                </div>
                <div className="glass px-3 py-1.5 rounded text-xs text-gray-400">
                  Streaming: {isStreaming ? "Yes" : "No"}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col items-center justify-center text-gray-500"
            >
              <svg
                className="w-24 h-24 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium mb-2">Camera Inactive</p>
              <p className="text-sm">Click "Start Camera" to begin</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Button
            variant={isActive ? "danger" : "primary"}
            onClick={handleToggleCamera}
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            }
          >
            {isActive ? "Stop Camera" : "Start Camera"}
          </Button>

          <Button
            variant={isRecording ? "danger" : "ghost"}
            onClick={handleToggleRecording}
            disabled={!isActive}
            leftIcon={
              <div
                className={`w-3 h-3 rounded-full ${isRecording ? "bg-white" : "bg-error"}`}
              />
            }
          >
            {isRecording ? "Stop Recording" : "Record"}
          </Button>

          <Button
            variant="ghost"
            onClick={handleCapture}
            disabled={!isActive}
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          >
            Capture
          </Button>

          <div className="flex-1" />

          <Button
            variant="secondary"
            onClick={handleAnalyze}
            disabled={!isActive}
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            }
          >
            Analyze Scene
          </Button>
        </div>
      </div>
    </Card>
  );
}
