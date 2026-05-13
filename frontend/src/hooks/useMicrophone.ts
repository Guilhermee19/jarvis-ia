/**
 * useMicrophone Hook
 * Captura áudio do microfone LOCAL no navegador/Electron
 */
import { useState, useCallback, useRef } from 'react';

interface UseMicrophoneProps {
  deviceId?: string | null;
}

export function useMicrophone(props?: UseMicrophoneProps) {
  const deviceId = props?.deviceId;
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Iniciar gravação de áudio
  const startRecording = useCallback(async (
    onDataAvailable?: (audioBlob: Blob) => void
  ) => {
    try {
      setError(null);
      setAudioBlob(null);
      console.log('🎤 Requesting microphone access...');
      if (deviceId) {
        console.log('🎤 Using device:', deviceId);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000, // Taxa de amostragem padrão
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Criar AudioContext para monitorar nível de áudio
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Monitorar nível de áudio
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 255) * 100));
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

      // Criar MediaRecorder com configurações otimizadas
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000, // Bitrate adequado para voz
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handler para dados disponíveis
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          // console.log('📦 Audio chunk received:', event.data.size, 'bytes');
        }
      };

      // Handler quando a gravação para
      mediaRecorder.onstop = () => {
        // Criar blob final com tipo correto
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        
        console.log('🛑 Recording stopped, audio blob size:', blob.size, 'bytes');
        
        // Verificar se blob tem tamanho mínimo (pelo menos 5KB)
        if (blob.size < 5000) {
          console.warn('⚠️ Audio too small:', blob.size, 'bytes - provavelmente vazio ou inválido');
          setError('Gravação muito curta ou sem áudio detectado');
          setAudioBlob(null);
        } else if (blob.size > 1024 * 1024) {
          console.warn('⚠️ Audio too large, truncating...');
          setError('Gravação muito longa, tente novamente com áudio mais curto');
          setAudioBlob(null);
        } else {
          setAudioBlob(blob);
          
          if (onDataAvailable && blob.size > 0) {
            onDataAvailable(blob);
          }
        }
        
        audioChunksRef.current = [];
      };

      // Iniciar gravação SEM timeslice para garantir arquivo completo
      mediaRecorder.start();
      setIsRecording(true);
      console.log('✅ Recording started');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
      setError(errorMessage);
      console.error('❌ Microphone error:', err);
    }
  }, [deviceId]);

  // Parar gravação
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      // Solicitar dados finais antes de parar
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.requestData();
        // Pequeno delay para garantir que os dados sejam escritos
        setTimeout(() => {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
          }
        }, 100);
      }
      
      setIsRecording(false);
      setAudioLevel(0);
      
      // Parar animação de nível de áudio
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Fechar AudioContext
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      // Parar todas as tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  // Limpar áudio gravado
  const clearAudio = useCallback(() => {
    setAudioBlob(null);
    audioChunksRef.current = [];
  }, []);

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
    audioBlob,
    audioLevel,
    startRecording,
    stopRecording,
    clearAudio,
    startPushToTalk,
    startListening,
    stopListening,
    blobToBase64,
  };
}
