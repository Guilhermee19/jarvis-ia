/**
 * useVoiceActivation Hook
 * Sistema de escuta contínua com detecção de gatilhos/wake words
 * Similar a Alexa/Google Assistant
 */
import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceActivationConfig {
  // Palavras-chave que ativam o Jarvis
  wakeWords?: string[];
  // Idioma para reconhecimento
  language?: string;
  // Auto-processar comandos após wake word
  autoProcess?: boolean;
  // Callback quando detecta wake word + comando
  onCommand?: (command: string) => void;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
    length: number;
  };
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

// Tipos para Web Speech API
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useVoiceActivation(config: VoiceActivationConfig = {}) {
  const {
    wakeWords = ['jarvis', 'ok jarvis', 'hey jarvis'],
    language = 'pt-BR',
    autoProcess = true,
    onCommand,
  } = config;

  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [detectedWakeWord, setDetectedWakeWord] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar se wake word foi detectado
  const detectWakeWord = useCallback((transcript: string): string | null => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    for (const wakeWord of wakeWords) {
      if (lowerTranscript.includes(wakeWord.toLowerCase())) {
        return wakeWord;
      }
    }
    
    return null;
  }, [wakeWords]);

  // Extrair comando após wake word
  const extractCommand = useCallback((transcript: string, wakeWord: string): string => {
    const lowerTranscript = transcript.toLowerCase();
    const wakeWordIndex = lowerTranscript.indexOf(wakeWord.toLowerCase());
    
    if (wakeWordIndex === -1) return transcript;
    
    // Pegar tudo após a wake word
    const command = transcript.substring(wakeWordIndex + wakeWord.length).trim();
    return command || transcript;
  }, []);

  // Iniciar reconhecimento de voz
  const startVoiceActivation = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Reconhecimento de voz não suportado neste navegador');
      console.error('❌ Web Speech API não disponível');
      return;
    }

    try {
      setError(null);
      
      // Criar nova instância
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Escuta contínua
      recognition.interimResults = true; // Resultados intermediários
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;

      // Quando começa a escutar
      recognition.onstart = () => {
        setIsActive(true);
        setIsListening(true);
        console.log('👂 Escuta contínua ativada');
      };

      // Quando recebe resultado
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcript = result[0].transcript;
        
        setLastTranscript(transcript);
        
        // Apenas processar resultados finais
        if (result.isFinal) {
          console.log('🗣️ Transcrito:', transcript);
          
          // Detectar wake word
          const detectedWake = detectWakeWord(transcript);
          
          if (detectedWake) {
            setDetectedWakeWord(detectedWake);
            console.log('🎯 Wake word detectada:', detectedWake);
            
            // Extrair comando
            const command = extractCommand(transcript, detectedWake);
            
            if (command && autoProcess) {
              console.log('⚡ Executando comando:', command);
              onCommand?.(command);
            }
            
            // Reset wake word após 3 segundos
            setTimeout(() => setDetectedWakeWord(null), 3000);
          }
        }
      };

      // Quando há erro
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('❌ Erro no reconhecimento:', event.error);
        
        // Ignorar erros de "no-speech" - é normal
        if (event.error === 'no-speech') {
          return;
        }
        
        setError(event.error);
        
        // Para erros críticos, tentar reiniciar
        if (event.error === 'network' || event.error === 'not-allowed') {
          setIsActive(false);
        }
      };

      // Quando termina
      recognition.onend = () => {
        setIsListening(false);
        console.log('🛑 Reconhecimento parou');
        
        // Se ainda está ativo, reiniciar após 1 segundo
        if (isActive && recognitionRef.current) {
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (err) {
              console.error('Erro ao reiniciar:', err);
            }
          }, 1000);
        }
      };

      // Iniciar
      recognition.start();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha ao iniciar reconhecimento';
      setError(errorMessage);
      console.error('❌ Erro ao ativar voz:', err);
    }
  }, [language, detectWakeWord, extractCommand, autoProcess, onCommand, isActive]);

  // Parar reconhecimento
  const stopVoiceActivation = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    setIsActive(false);
    setIsListening(false);
    setDetectedWakeWord(null);
    console.log('🔇 Escuta contínua desativada');
  }, []);

  // Toggle
  const toggleVoiceActivation = useCallback(() => {
    if (isActive) {
      stopVoiceActivation();
    } else {
      startVoiceActivation();
    }
  }, [isActive, startVoiceActivation, stopVoiceActivation]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  return {
    isActive,
    isListening,
    lastTranscript,
    detectedWakeWord,
    error,
    startVoiceActivation,
    stopVoiceActivation,
    toggleVoiceActivation,
  };
}
