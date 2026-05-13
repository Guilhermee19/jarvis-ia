/**
 * VoiceActivation Component
 * Interface para ativação por voz contínua com feedback visual
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceActivation } from '../hooks/useVoiceActivation';

interface VoiceActivationProps {
  onCommand: (command: string) => void;
  className?: string;
}

export default function VoiceActivation({ onCommand, className = '' }: VoiceActivationProps) {
  const {
    isActive,
    isListening,
    lastTranscript,
    detectedWakeWord,
    error,
    toggleVoiceActivation,
  } = useVoiceActivation({
    wakeWords: ['jarvis', 'ok jarvis', 'hey jarvis', 'ei jarvis'],
    language: 'pt-BR',
    autoProcess: true,
    onCommand,
  });

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Botão Toggle */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={toggleVoiceActivation}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive
              ? 'bg-primary text-white shadow-lg shadow-primary/50'
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          {/* Ícone animado */}
          <div className="relative w-6 h-6">
            {isActive ? (
              <>
                {/* Ondas de som animadas */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-white opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-white opacity-20"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* Ícone central */}
                <svg
                  className="w-6 h-6 text-white relative z-10"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <svg
                className="w-6 h-6"
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
          </div>

          {/* Texto */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">
              {isActive ? 'Escuta Ativa' : 'Ativar Escuta Contínua'}
            </span>
            {isActive && (
              <span className="text-xs opacity-75">
                {isListening ? 'Ouvindo...' : 'Aguardando...'}
              </span>
            )}
          </div>

          {/* Indicador de status */}
          {isActive && (
            <motion.div
              className="w-2 h-2 rounded-full bg-success ml-auto"
              animate={{
                opacity: [1, 0.4, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Feedback de Wake Word Detectada */}
      <AnimatePresence>
        {detectedWakeWord && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-2 rounded-lg bg-success/20 border border-success/30"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-success">
                  Comando detectado!
                </p>
                <p className="text-xs text-success/80">
                  "{detectedWakeWord}" reconhecido
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Última transcrição */}
      {isActive && lastTranscript && !detectedWakeWord && (
        <div className="px-4 py-2 rounded-lg bg-base-200">
          <p className="text-xs text-base-content/60 mb-1">Escutando:</p>
          <p className="text-sm text-base-content/80">{lastTranscript}</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="px-4 py-2 rounded-lg bg-error/20 border border-error/30">
          <div className="flex items-center gap-2">
            <span className="text-error">⚠️</span>
            <p className="text-sm text-error">{error}</p>
          </div>
        </div>
      )}

      {/* Instruções */}
      {isActive && !error && (
        <div className="px-4 py-2 rounded-lg bg-info/10 border border-info/20">
          <div className="flex items-start gap-2">
            <span className="text-info text-lg">💡</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-info mb-1">
                Como usar:
              </p>
              <p className="text-xs text-info/80">
                Diga "Jarvis" ou "Ok Jarvis" seguido do seu comando.
                <br />
                Exemplo: <strong>"Jarvis, abre o Spotify"</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
