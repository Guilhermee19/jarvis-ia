/**
 * CameraPanel Component
 * Painel de visualização da webcam com controles
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Button, Badge } from "./ui";
import { useCamera } from "../hooks";

export default function CameraPanel() {
  const { isCameraActive, cameraFrame, startCamera, stopCamera } = useCamera();
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implementar gravação
    console.log("Recording toggle:", !isRecording);
  };

  const handleCapture = () => {
    // TODO: Capturar frame e enviar para análise
    console.log("Capture frame");
  };

  const handleAnalyze = () => {
    // TODO: Solicitar análise visual da cena
    console.log("Analyze scene");
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
        <Badge variant={isCameraActive ? "success" : "error"} dot>
          {isCameraActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Camera View */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full h-full bg-dark-light rounded-lg overflow-hidden relative">
          {isCameraActive ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex items-center justify-center relative"
            >
              {/* Mostrar frame da câmera se disponível */}
              {cameraFrame ? (
                <img
                  src={`data:image/jpeg;base64,${cameraFrame}`}
                  alt="Camera feed"
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  {/* Placeholder para vídeo da câmera */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

                  {/* Grid overlay */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-primary/30">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-primary/20" />
                    ))}
                  </div>

                  {/* Centro - Indicador de câmera ativa */}
                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-20 h-20 rounded-full border-4 border-primary/50 flex items-center justify-center"
                    >
                      <svg
                        className="w-10 h-10 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </motion.div>
                    <p className="text-center mt-4 text-sm text-gray-400">
                      Camera Ready
                    </p>
                  </div>
                </>
              )}

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
                  FPS: 30
                </div>
                <div className="glass px-3 py-1.5 rounded text-xs text-gray-400">
                  Objects: 0
                </div>
                <div className="glass px-3 py-1.5 rounded text-xs text-gray-400">
                  Faces: 0
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
            variant={isCameraActive ? "danger" : "primary"}
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
            {isCameraActive ? "Stop Camera" : "Start Camera"}
          </Button>

          <Button
            variant={isRecording ? "danger" : "ghost"}
            onClick={handleToggleRecording}
            disabled={!isCameraActive}
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
            disabled={!isCameraActive}
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
            disabled={!isCameraActive}
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
