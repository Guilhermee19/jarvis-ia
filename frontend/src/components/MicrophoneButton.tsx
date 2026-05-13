/**
 * MicrophoneButton Component
 * Botão de controle de microfone com feedback visual
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMicrophone } from "../hooks";
import websocketService from "../services/websocket";

interface MicrophoneButtonProps {
  onTranscript?: (text: string) => void;
  className?: string;
}

export default function MicrophoneButton({
  onTranscript,
  className = "",
}: MicrophoneButtonProps) {
  const {
    isRecording,
    audioLevel,
    audioBlob,
    error: micError,
    startRecording,
    stopRecording,
    clearAudio,
  } = useMicrophone();

  const [networkError, setNetworkError] = useState<string | null>(null);

  // Ouvir erros do WebSocket
  useEffect(() => {
    const handleAudioError = (data: any) => {
      console.error("📢 Audio error from backend:", data.error);
      setNetworkError(data.error);

      // Limpar erro após 5 segundos
      setTimeout(() => setNetworkError(null), 5000);
    };

    websocketService.on("audio:error", handleAudioError);

    return () => {
      websocketService.off("audio:error", handleAudioError);
    };
  }, []);

  // Enviar áudio ao backend quando disponível
  useEffect(() => {
    if (audioBlob) {
      console.log("🎤 Audio recorded, size:", audioBlob.size, "bytes");

      // Limpar erro de rede anterior
      setNetworkError(null);

      // Converter blob para base64 para enviar via WebSocket
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        // Remover prefixo data:audio/...;base64,
        const audioData = base64Audio.split(",")[1];
        websocketService.sendAudio(audioData);
      };
      reader.onerror = () => {
        setNetworkError("Erro ao processar áudio");
      };
      reader.readAsDataURL(audioBlob);

      // Limpar blob após enviar
      clearAudio();
    }
  }, [audioBlob, clearAudio]);

  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      // Limpar erros antes de começar
      setNetworkError(null);
      startRecording();
    }
  };

  // Calcular cor baseado no nível de áudio
  const getAudioLevelColor = () => {
    if (audioLevel < 20) return "bg-green-500";
    if (audioLevel < 50) return "bg-yellow-500";
    if (audioLevel < 80) return "bg-orange-500";
    return "bg-red-500";
  };

  const displayError = micError || networkError;

  return (
    <div className={`relative ${className}`}>
      {/* Botão do microfone */}
      <motion.button
        onClick={handleToggle}
        disabled={!!micError}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isRecording
            ? "bg-error hover:bg-error/90"
            : "bg-primary hover:bg-primary/90"
        } ${micError ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isRecording ? (
          // Ícone de Stop (quadrado)
          <div className="w-4 h-4 bg-white rounded-sm" />
        ) : (
          // Ícone de Microfone
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}

        {/* Animação de pulso quando gravando */}
        {isRecording && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
            className="absolute inset-0 rounded-full bg-error"
          />
        )}
      </motion.button>

      {/* Indicador de nível de áudio */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 glass px-3 py-2 rounded-lg"
        >
          {/* Barra de nível */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${audioLevel}%` }}
                transition={{ duration: 0.1 }}
                className={`h-full ${getAudioLevelColor()}`}
              />
            </div>
            <span className="text-xs text-white font-mono">{audioLevel}</span>
          </div>
        </motion.div>
      )}

      {/* Mensagem de erro */}
      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 bg-error/20 border border-error text-white text-xs px-4 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-start gap-2">
            <span className="text-error text-lg">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold mb-1">
                {networkError ? "Erro de Rede" : "Erro no Microfone"}
              </p>
              <p className="text-xs opacity-90">{displayError}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
