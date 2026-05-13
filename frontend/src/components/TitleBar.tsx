/**
 * TitleBar Component
 * Barra de título customizada premium com controles de janela
 * Design moderno com glassmorphism e gradientes
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Verificar estado inicial
    if (window.electronAPI) {
      window.electronAPI.window.isMaximized().then(setIsMaximized);
    }

    // Atualizar relógio
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMinimize = () => {
    window.electronAPI?.window.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI?.window.maximize();
    setIsMaximized((prev) => !prev);
  };

  const handleClose = () => {
    window.electronAPI?.window.close();
  };

  return (
    <div className="relative flex items-center justify-between h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-b border-gray-700/50 select-none">
      {/* Linha de destaque superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Área draggável - App Name */}
      <div
        className="flex-1 flex items-center gap-3 px-6 cursor-move"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        {/* Logo Jarvis */}
        <div className="relative">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 10px rgba(0, 191, 255, 0.3)",
                "0 0 20px rgba(0, 191, 255, 0.5)",
                "0 0 10px rgba(0, 191, 255, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-blue-500 to-secondary flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-sm font-bold">J</span>
          </motion.div>
        </div>

        {/* Nome e Status */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white tracking-wide">
            JARVIS IA
          </span>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-400"
            />
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* Centro - Relógio */}
      <div
        className="flex items-center gap-2 px-4"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <svg
          className="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs font-medium text-gray-400 tabular-nums">
          {currentTime.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Window Controls - Não draggável */}
      <div
        className="flex items-center gap-1 px-3 h-full"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        {/* Minimize */}
        <motion.button
          onClick={handleMinimize}
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(100, 100, 100, 0.3)",
          }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-white transition-all"
          title="Minimizar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeWidth={2} d="M6 12h12" />
          </svg>
        </motion.button>

        {/* Maximize/Restore */}
        <motion.button
          onClick={handleMaximize}
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(100, 100, 100, 0.3)",
          }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-white transition-all"
          title={isMaximized ? "Restaurar" : "Maximizar"}
        >
          {isMaximized ? (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V5a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1h-2M5 9h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V10a1 1 0 011-1z"
              />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="5"
                y="5"
                width="14"
                height="14"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                rx="1"
              />
            </svg>
          )}
        </motion.button>

        {/* Close */}
        <motion.button
          onClick={handleClose}
          whileHover={{ scale: 1.1, backgroundColor: "#dc2626" }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-white transition-all"
          title="Fechar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
