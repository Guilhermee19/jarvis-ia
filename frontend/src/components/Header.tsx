/**
 * Header Component
 * Barra superior com logo, status e controles
 */
import { motion } from "framer-motion";
import { Avatar, Badge } from "./ui";

interface HeaderProps {
  isConnected: boolean;
  onSettingsClick?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export default function Header({
  isConnected,
  onSettingsClick,
  onMinimize,
  onMaximize,
  onClose,
}: HeaderProps) {
  const currentTime = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass border-b border-gray-800 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo e Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">J.A.R.V.I.S</h1>
              <p className="text-xs text-gray-500">Virtual Assistant</p>
            </div>
          </div>

          <Badge variant={isConnected ? "success" : "error"} size="sm" dot>
            {isConnected ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Info Central */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
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
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-3">
          {/* Avatar do Usuário */}
          <Avatar
            name="User"
            size="sm"
            status={isConnected ? "online" : "offline"}
          />

          {/* Botão Settings */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSettingsClick}
            className="w-8 h-8 rounded-lg bg-dark-light hover:bg-dark-lighter flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
          >
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </motion.button>

          {/* Window Controls (apenas no Electron) */}
          {window.electronAPI && (
            <div className="flex items-center gap-1 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMinimize}
                className="w-8 h-8 rounded hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <rect x="3" y="8" width="10" height="1" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMaximize}
                className="w-8 h-8 rounded hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 3h10v10H3V3zm1 1v8h8V4H4z" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-8 h-8 rounded hover:bg-error flex items-center justify-center text-gray-400 hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
