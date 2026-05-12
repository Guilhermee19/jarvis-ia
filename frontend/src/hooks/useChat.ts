/**
 * useChat Hook
 * Gerencia mensagens de chat via WebSocket
 */
import { useEffect, useCallback } from 'react';
import { useAppStore, type ChatMessage } from '../store/appStore';
import websocketService from '../services/websocket';

export function useChat() {
  const { messages, addMessage } = useAppStore();

  // Enviar mensagem
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Adicionar mensagem do usuário ao store
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    addMessage(userMessage);

    // Enviar para o backend
    websocketService.sendChatMessage(text.trim());
  }, [addMessage]);

  // Listener para respostas do AI
  useEffect(() => {
    const handleChatResponse = (data: any) => {
      console.log('📨 Received chat response:', data);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || data.response || 'Sem resposta',
        timestamp: Date.now(),
      };

      addMessage(aiMessage);
    };

    websocketService.on('chat_message', handleChatResponse);
    websocketService.on('chat_response', handleChatResponse);

    return () => {
      websocketService.off('chat_message', handleChatResponse);
      websocketService.off('chat_response', handleChatResponse);
    };
  }, [addMessage]);

  return {
    messages,
    sendMessage,
  };
}
