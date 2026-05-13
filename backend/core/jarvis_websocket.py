"""
Jarvis WebSocket - Versão do assistente para WebSocket
Sem PySide6, preparado para uso assíncrono com Socket.IO
"""
import os
import base64
import io
import logging
from typing import Dict, Any, Optional

from config.settings import SETTINGS
from core.audio.text_to_speech import TextToSpeech  
from core.ai.conversation import ConversationManager
from core.logging.chat_logger import ChatLogger
from actions import get_action_manager

logger = logging.getLogger(__name__)


class JarvisWebSocket:
    """Versão do Jarvis otimizada para WebSocket (sem PySide6)"""
    
    def __init__(self):
        """Inicializa o Jarvis com todos os componentes necessários"""
        self.settings = SETTINGS
        self.text_to_speech = TextToSpeech()
        self.conversation = ConversationManager()
        self.chat_logger = ChatLogger()
        self.action_manager = get_action_manager()
        
        # Armazenar último frame da câmera (por sessão)
        self.camera_frames: Dict[str, str] = {}
        
        logger.info("✅ JarvisWebSocket inicializado")
    
    async def process_text_message(self, text: str, image_data: Optional[str] = None) -> Dict[str, Any]:
        """
        Processa mensagem de texto do usuário
        
        Args:
            text: Texto do usuário
            image_data: Imagem em base64 (opcional)
            
        Returns:
            Dict com resposta estruturada
        """
        try:
            logger.info(f"📝 Processando: {text[:50]}...")
            
            # Log da entrada do usuário
            self.chat_logger.log_user_message(text)
            
            # Processar com IA (com ou sem imagem)
            response_data = self.conversation.process_input(text, image_data)
            
            # Log da resposta
            self.chat_logger.log_jarvis_message(response_data['text'])
            
            # Gerar áudio da resposta se necessário
            audio_base64 = None
            if response_data.get("speech"):
                audio_base64 = await self._generate_audio_response(response_data["speech"])
            
            # Preparar resposta completa
            result = {
                'text': response_data.get('text', ''),
                'speech': response_data.get('speech', ''),
                'trigger': response_data.get('trigger', ''),
                'actions': response_data.get('actions', []),
                'audio': audio_base64,
                'metadata': {
                    'model': response_data.get('metadata', {}).get('model', 'unknown'),
                    'has_image': image_data is not None
                }
            }
            
            logger.info(f"✅ Resposta gerada: {result['text'][:50]}...")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erro ao processar mensagem: {e}")
            return {
                'text': f'Desculpe, ocorreu um erro: {str(e)}',
                'speech': 'Desculpe, ocorreu um erro ao processar sua mensagem.',
                'trigger': 'error',
                'actions': [],
                'audio': None
            }
    
    async def process_audio_data(self, audio_base64: str, session_id: str) -> Dict[str, Any]:
        """
        Processa áudio do microfone e converte para texto
        
        Args:
            audio_base64: Áudio em base64
            session_id: ID da sessão (para armazenar frame se necessário)
            
        Returns:
            Dict com transcrição e resposta
        """
        try:
            logger.info(f"🎤 Processando áudio da sessão {session_id}")
            
            # Converter base64 para bytes
            audio_bytes = base64.b64decode(audio_base64)
            
            # Transcrever áudio usando SpeechRecognition
            text = await self._transcribe_audio(audio_bytes)
            
            if not text:
                return {
                    'text': '',
                    'transcription': None,
                    'error': 'Não foi possível reconhecer o áudio'
                }
            
            logger.info(f"📝 Transcrição: {text}")
            
            # Verificar se é uma pergunta visual
            image_data = None
            if self._is_visual_question(text):
                logger.info("👁️ Pergunta visual detectada")
                # Usar frame armazenado se disponível
                image_data = self.camera_frames.get(session_id)
            
            # Processar mensagem com Jarvis
            response = await self.process_text_message(text, image_data)
            
            # Adicionar transcrição à resposta
            response['transcription'] = text
            
            return response
            
        except Exception as e:
            logger.error(f"❌ Erro ao processar áudio: {e}")
            return {
                'text': f'Erro ao processar áudio: {str(e)}',
                'transcription': None,
                'error': str(e)
            }
    
    async def _transcribe_audio(self, audio_bytes: bytes) -> Optional[str]:
        """
        Transcreve áudio usando SpeechRecognition
        
        Args:
            audio_bytes: Bytes do áudio
            
        Returns:
            Texto transcrito ou None
        """
        try:
            import speech_recognition as sr
            
            recognizer = sr.Recognizer()
            
            # Converter bytes para AudioData
            # O MediaRecorder do navegador envia em formato WebM/Opus
            # Precisamos converter para formato WAV que o SpeechRecognition entende
            
            # Criar arquivo temporário para conversão
            import tempfile
            import os
            
            # Salvar áudio recebido
            with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as temp_input:
                temp_input.write(audio_bytes)
                temp_input_path = temp_input.name
            
            # Converter para WAV usando pydub (se disponível) ou ffmpeg
            try:
                from pydub import AudioSegment
                audio = AudioSegment.from_file(temp_input_path)
                
                # Exportar como WAV
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_output:
                    temp_output_path = temp_output.name
                
                audio.export(temp_output_path, format='wav')
                
                # Ler WAV com SpeechRecognition
                with sr.AudioFile(temp_output_path) as source:
                    audio_data = recognizer.record(source)
                
                # Limpar arquivos temporários
                os.unlink(temp_input_path)
                os.unlink(temp_output_path)
                
            except ImportError:
                logger.warning("⚠️ pydub não disponível, tentando conversão direta")
                # Tentar conversão direta (pode não funcionar com todos os formatos)
                audio_data = sr.AudioData(audio_bytes, 48000, 2)
            
            # Reconhecer usando Google
            text = recognizer.recognize_google(
                audio_data,
                language=self.settings["audio"]["language"]
            )
            
            return text
            
        except sr.UnknownValueError:
            logger.warning("⚠️ Não foi possível entender o áudio")
            return None
        except sr.RequestError as e:
            logger.error(f"❌ Erro na API do Google: {e}")
            return None
        except Exception as e:
            logger.error(f"❌ Erro ao transcrever áudio: {e}")
            return None
    
    async def _generate_audio_response(self, text: str) -> Optional[str]:
        """
        Gera áudio da resposta usando edge-tts
        
        Args:
            text: Texto para sintetizar
            
        Returns:
            Áudio em base64 ou None
        """
        try:
            import edge_tts
            
            voice = self.settings["audio"]["voice"]
            
            # Gerar áudio em memória
            communicate = edge_tts.Communicate(text, voice)
            audio_chunks = []
            
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_chunks.append(chunk["data"])
            
            # Concatenar chunks
            audio_bytes = b''.join(audio_chunks)
            
            # Converter para base64
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            
            logger.info(f"🔊 Áudio gerado: {len(audio_base64)} chars")
            return audio_base64
            
        except Exception as e:
            logger.error(f"❌ Erro ao gerar áudio: {e}")
            return None
    
    def store_camera_frame(self, session_id: str, frame_base64: str):
        """
        Armazena frame da câmera para análise posterior
        
        Args:
            session_id: ID da sessão
            frame_base64: Frame em base64
        """
        self.camera_frames[session_id] = frame_base64
        logger.info(f"📸 Frame armazenado para sessão {session_id}")
    
    def _is_visual_question(self, user_input: str) -> bool:
        """
        Verifica se a pergunta do usuário requer análise visual
        
        Args:
            user_input: Texto do usuário
            
        Returns:
            True se for uma pergunta visual
        """
        visual_keywords = [
            "o que é isso",
            "o que você vê",
            "o que está vendo",
            "me mostre",
            "olha isso",
            "vê isso",
            "analisa isso",
            "identifica isso",
            "reconhece isso",
            "o que tem aqui",
            "o que aparece",
            "descreve o que vê",
            "o que é esta coisa",
            "qual é esse objeto",
            "me diz o que é",
            "visual",
            "imagem",
            "foto",
            "câmera",
            "webcam"
        ]
        
        user_input_lower = user_input.lower()
        return any(keyword in user_input_lower for keyword in visual_keywords)


# Instância singleton
_jarvis_instance: Optional[JarvisWebSocket] = None


def get_jarvis() -> JarvisWebSocket:
    """Obtém instância singleton do Jarvis"""
    global _jarvis_instance
    if _jarvis_instance is None:
        _jarvis_instance = JarvisWebSocket()
    return _jarvis_instance
