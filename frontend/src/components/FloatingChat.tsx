/**
 * FloatingChat Component
 * Chat flutuante arrastável que mostra transcrições e respostas do Jarvis
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minimize2, Send, Bot, User } from "lucide-react";
import { useChat } from "../hooks";
import websocketService from "../services/websocket";
import { useAppStore } from "../store/appStore";

interface FloatingChatProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FloatingChat({
  isOpen = true,
  onClose,
}: FloatingChatProps) {
  const { messages } = useChat();
  const { addMessage } = useAppStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef(null);

  // Auto-scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para enviar mensagem de texto
  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;

    // Adicionar mensagem do usuário ao chat
    const userMessage = {
      id: Date.now().toString(),
      sender: "user" as const,
      text: text,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    console.log("📤 Enviando mensagem de texto:", text);

    // Enviar via WebSocket
    websocketService.sendChatMessage(text);

    // Limpar input
    setInputValue("");
  };

  // Enviar com Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Listener para reproduzir áudio das respostas do Jarvis
  useEffect(() => {
    const handleAudioResponse = (data: any) => {
      console.log("🔊 Reproduzindo áudio do Jarvis");
      if (data.audio) {
        try {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
          audio.volume = 0.8;
          audio
            .play()
            .then(() => console.log("✅ Áudio reproduzido com sucesso"))
            .catch((err) => {
              console.error("❌ Erro ao reproduzir áudio:", err);
              // Tentar novamente se falhar por política de autoplay
              document.addEventListener(
                "click",
                () => {
                  audio
                    .play()
                    .catch((e) => console.error("Erro após click:", e));
                },
                { once: true },
              );
            });
        } catch (err) {
          console.error("❌ Erro ao criar áudio:", err);
        }
      }
    };

    websocketService.on("audio:response", handleAudioResponse);

    return () => {
      websocketService.off("audio:response", handleAudioResponse);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-40"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        initial={{ x: 20, y: 80 }}
        className="absolute pointer-events-auto"
        style={{ touchAction: "none" }}
      >
        <AnimatePresence mode="wait">
          {isMinimized ? (
            // Versão Minimizada
            <motion.div
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-dark-light/95 backdrop-blur-md border border-primary/30 rounded-full shadow-2xl cursor-move"
            >
              <button
                onClick={() => setIsMinimized(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-primary/10 rounded-full transition-colors"
              >
                <MessageCircle size={20} className="text-primary" />
                <span className="text-sm font-medium text-white">
                  Chat ({messages.length})
                </span>
              </button>
            </motion.div>
          ) : (
            // Versão Expandida
            <motion.div
              key="expanded"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-96 h-[500px] bg-dark/95 backdrop-blur-md border border-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header - Área de Drag */}
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-2 py-1 border-b border-primary/30 cursor-move flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-primary" />
                  <h3 className="text-sm font-semibold text-white">
                    Chat com Jarvis
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Minimizar"
                  >
                    <Minimize2
                      size={16}
                      className="text-gray-400 hover:text-white"
                    />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Fechar"
                  >
                    <X size={16} className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-2 space-y-3">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <MessageCircle
                        size={48}
                        className="text-primary/30 mb-3"
                      />
                      <p className="text-gray-400 text-sm">
                        Comece a falar para aparecer suas mensagens aqui
                      </p>
                    </motion.div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={message.id || index}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className={`max-w-[85%] rounded-md px-2 py-1 ${
                            message.sender === "user"
                              ? "text-white rounded-br-none"
                              : "text-gray-200/70 rounded-bl-none"
                          }`}
                        >
                          <p className="flex items-start text-xs leading-relaxed whitespace-pre-wrap">
                            <span className="mr-2 mt-1">
                              {message.sender === "user" ? (
                                <User size={14} />
                              ) : (
                                <Bot size={14} />
                              )}
                            </span>
                            {message.text}
                          </p>
                          {/* <p
                            className={`text-xs mt-1 ${
                              message.sender === "user"
                                ? "text-white/70"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p> */}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-4 py-3 border-t border-primary/20 bg-dark-light/50">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 border border-primary/10 rounded-lg px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="disabled:text-white/50 disabled:cursor-not-allowed text-white rounded-lg p-2.5 transition-all duration-200 flex items-center justify-center"
                    title="Enviar mensagem"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
