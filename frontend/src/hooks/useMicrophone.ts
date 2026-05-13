/**
 * useMicrophone Hook
 * Captura áudio do microfone LOCAL no navegador/Electron
 */
import { useState, useCallback, useRef } from 'react';

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Iniciar gravação de áudio
  const startRecording = useCallback(async (
    onDataAvailable?: (audioBlob: Blob) => void
  ) => {
    try {
      setError(null);
      console.log('🎤 Requesting microphone access...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Criar MediaRecorder com limite de tamanho
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handler para dados disponíveis
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handler quando a gravação para
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (onDataAvailable && audioBlob.size > 0) {
          onDataAvailable(audioBlob);
        }
        
        audioChunksRef.current = [];
        console.log('🛑 Recording stopped, audio blob size:', audioBlob.size);
      };

      // Iniciar gravação com chunks de 1 segundo (limita tamanho)
      mediaRecorder.start(1000);
      setIsRecording(true);
      console.log('✅ Recording started');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
      setError(errorMessage);
      console.error('❌ Microphone error:', err);
    }
  }, []);

  // Parar gravação
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Parar todas as tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  // Modo "push-to-talk" - gravar enquanto pressionado
  const startPushToTalk = useCallback(async (
    onTranscript: (audioBlob: Blob) => void
  ) => {
    await startRecording(onTranscript);
  }, [startRecording]);

  // Modo "escuta contínua" usando Web Speech API (se disponível)
  const startListening = useCallback((
    onTranscript: (transcript: string) => void
  ) => {
    // @ts-ignore - Web Speech API não tem tipos oficiais
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser');
      console.error('❌ Speech Recognition not available');
      return;
    }

    try {
      // @ts-ignore
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('👂 Listening started');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        // Apenas enviar quando tiver resultado final
        if (event.results[event.results.length - 1].isFinal) {
          console.log('🗣️ Transcript:', transcript);
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        setError(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('🛑 Listening stopped');
      };

      recognition.start();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start listening';
      setError(errorMessage);
      console.error('❌ Listening error:', err);
    }
  }, []);

  // Parar escuta contínua
  const stopListening = useCallback(() => {
    // Speech recognition será parado automaticamente pelo onend handler
    setIsListening(false);
  }, []);

  // Converter Blob de áudio para base64
  const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remover prefixo data:audio/webm;base64,
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  return {
    isRecording,
    isListening,
    error,
    startRecording,
    stopRecording,
    startPushToTalk,
    startListening,
    stopListening,
    blobToBase64,
  };
}
