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
      console.log('📨 Resposta completa do Jarvis:', data);
      console.log('📝 Campos da resposta:', {
        text: data.text,
        speech: data.speech,
        trigger: data.trigger,
        actions: data.actions,
        hasAudio: !!data.audio,
        metadata: data.metadata
      });

      // Verificar se tem texto na resposta
      const responseText = data.text || data.speech || data.response || 'Sem resposta';
      
      if (!data.text && !data.speech) {
        console.warn('⚠️ Resposta sem texto:', data);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: Date.now(),
      };

      addMessage(aiMessage);
      console.log('✅ Mensagem do Jarvis adicionada ao chat:', aiMessage);
    };

    // Listener para transcrições de áudio (adicionar mensagem do usuário)
    const handleTranscription = (data: any) => {
      console.log('📝 Transcrição recebida:', data.text);

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: data.text,
        timestamp: Date.now(),
      };

      addMessage(userMessage);
      console.log('✅ Mensagem do usuário adicionada ao chat:', userMessage);
    };

    websocketService.on('chat:response', handleChatResponse);
    websocketService.on('audio:transcription', handleTranscription);

    return () => {
      websocketService.off('chat:response', handleChatResponse);
      websocketService.off('audio:transcription', handleTranscription);
    };
  }, [addMessage]);

  return {
    messages,
    sendMessage,
  };
}
