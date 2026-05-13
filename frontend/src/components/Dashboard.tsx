"use client";

import { motion } from "framer-motion";
import { Button } from "./ui";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMicrophone } from "../hooks/useMicrophone";
import websocketService from "../services/websocket";
import FloatingChat from "./FloatingChat";
import MicrophoneSelector from "./MicrophoneSelector";
import { useAppStore } from "../store/appStore";

interface DashboardProps {
  isConnected?: boolean;
}

export default function Dashboard({ isConnected = false }: DashboardProps) {
  const [isMicOn, setIsMicOn] = useState(false);
  const { selectedMicrophoneId } = useAppStore();
  const { startRecording, stopRecording } = useMicrophone({
    deviceId: selectedMicrophoneId,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCapturingRef = useRef(false);

  // Função para capturar e enviar áudio
  const captureAndSendAudio = useCallback(() => {
    if (isCapturingRef.current || !isConnected) {
      return;
    }

    isCapturingRef.current = true;

    startRecording((audioBlob: Blob) => {
      // Validar tamanho mínimo do áudio
      if (audioBlob.size < 5000) {
        console.warn(
          "⚠️ Áudio muito pequeno, ignorando:",
          audioBlob.size,
          "bytes",
        );
        isCapturingRef.current = false;
        return;
      }

      // Converter áudio para base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result?.toString().split(",")[1];
        if (base64Audio && isConnected) {
          console.log(
            "🎤 Enviando áudio para transcrição...",
            audioBlob.size,
            "bytes",
          );
          websocketService.sendAudio(base64Audio);
        }
      };
      reader.readAsDataURL(audioBlob);
      isCapturingRef.current = false;
    });

    // Parar gravação após 4 segundos (tempo suficiente para capturar fala)
    setTimeout(() => {
      stopRecording();
    }, 4000);
  }, [isConnected, startRecording, stopRecording]);

  // Gerenciar gravação contínua quando microfone está ligado
  useEffect(() => {
    if (isMicOn && isConnected) {
      console.log("🎙️ Iniciando escuta contínua...");

      // Primeira captura
      captureAndSendAudio();

      // Capturar a cada 5 segundos (4s gravação + 1s processamento)
      intervalRef.current = setInterval(() => {
        captureAndSendAudio();
      }, 5000);
    } else {
      // Parar intervalo
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopRecording();
      isCapturingRef.current = false;
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopRecording();
      isCapturingRef.current = false;
    };
  }, [isMicOn, isConnected, captureAndSendAudio, stopRecording]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full h-full bg-radial from-[#0d1727] from-30% to-[#060a0f] to-80% backdrop-blur-lg flex justify-center items-center"
    >
      <div className="absolute text-sm border-2 border-primary/50 aspect-square flex justify-center items-center rounded-full p-10">
        <div className="font-light p-0 m-0 text-2xl">J A R V I S</div>
      </div>

      <div className="fixed bottom-0 flex justify-center items-center gap-6 w-full px-6 py-4">
        <Button
          variant="ghost"
          className="col-span-2 h-max cursor-pointer"
          onClick={() => setIsMicOn(!isMicOn)}
          disabled={!isConnected}
        >
          {isMicOn ? (
            <Mic size={18} className="text-primary" />
          ) : (
            <MicOff size={18} className="text-gray-500" />
          )}
        </Button>
      </div>

      {/* Seletor de Microfone */}
      <div className="fixed top-0 right-2">
        <MicrophoneSelector />
      </div>

      {/* Indicador de gravação quando microfone está ligado */}
      {isMicOn && isConnected && (
        <div className="fixed top-4 right-4 flex items-center gap-2 bg-red-500/20 border border-red-500 rounded-full px-4 py-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm text-red-500 font-medium">Ouvindo...</span>
        </div>
      )}

      {/* Indicador de desconectado */}
      {!isConnected && (
        <div className="fixed top-4 right-4 flex items-center gap-2 bg-yellow-500/20 border border-yellow-500 rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-sm text-yellow-500 font-medium">
            Conectando...
          </span>
        </div>
      )}

      {/* Chat Flutuante Arrastável */}
      <FloatingChat />
    </motion.div>
  );
}
