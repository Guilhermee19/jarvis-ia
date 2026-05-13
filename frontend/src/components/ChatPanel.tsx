/**
 * ChatPanel Component
 * Painel de chat com mensagens do usuário e assistente
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Input, Avatar, LoadingSpinner } from "./ui";
import { useChat } from "../hooks";
import MicrophoneButton from "./MicrophoneButton";
import websocketService from "../services/websocket";

export default function ChatPanel() {
  const { messages, sendMessage } = useChat();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Escutar respostas do Jarvis via WebSocket
  useEffect(() => {
    const handleChatResponse = (data: any) => {
      console.log("📨 Resposta do Jarvis recebida:", data);
      // A resposta já é adicionada automaticamente pelo hook useChat
      setIsLoading(false);
    };

    const handleTranscription = (data: any) => {
      console.log("📝 Transcrição recebida:", data.text);
      // Adicionar transcrição ao input
      setInputText(data.text);
    };

    // Registrar listeners
    websocketService.on("chat:response", handleChatResponse);
    websocketService.on("audio:transcription", handleTranscription);

    // Cleanup
    return () => {
      websocketService.off("chat:response", handleChatResponse);
      websocketService.off("audio:transcription", handleTranscription);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    sendMessage(inputText);
    setInputText("");

    // Não precisamos mais do timeout, a resposta virá do backend
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTranscript = (text: string) => {
    // Quando receber transcrição do áudio, adicionar ao input
    setInputText(text);
  };

  return (
    <Card className="h-full flex flex-col" padding="none">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Chat Assistant</h2>
        <p className="text-sm text-gray-400">Converse com o Jarvis</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar
                name={message.sender === "user" ? "User" : "Jarvis"}
                size="sm"
                status="online"
              />

              <div
                className={`flex-1 max-w-[70%] ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-dark-light text-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <Avatar name="Jarvis" size="sm" />
            <div className="bg-dark-light px-4 py-3 rounded-lg">
              <LoadingSpinner size="sm" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            rightIcon={
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="text-primary hover:text-secondary transition-colors disabled:opacity-50"
                title="Send message"
                aria-label="Send message"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            }
          />
        </div>

        <div className="flex gap-2 mt-3 items-center">
          {/* Botão de microfone com feedback de áudio */}
          <MicrophoneButton onTranscript={handleTranscript} className="mr-2" />

          <Button variant="ghost" size="sm">
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
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            Attach
          </Button>
        </div>
      </div>
    </Card>
  );
}
