"""
Jarvis IA - Classe principal do assistente virtual
"""
import os
import threading
from typing import Dict, List, Any
from config.settings import SETTINGS
from core.audio.speech_to_text import SpeechToText
from core.audio.text_to_speech import TextToSpeech  
from core.ai.conversation import ConversationManager
from core.logging.chat_logger import ChatLogger
from actions import get_action_manager


class Jarvis:
    def __init__(self):
        """Inicializa o Jarvis com todos os componentes necessários"""
        self.settings = SETTINGS
        self.speech_to_text = SpeechToText()
        self.text_to_speech = TextToSpeech()
        self.conversation = ConversationManager()
        self.chat_logger = ChatLogger()
        self.action_manager = get_action_manager()
        
        # Controle de execução
        self.running = threading.Event()
        self.running.set()
    
    def start(self):
        """Inicia o loop principal do Jarvis"""
        os.system('cls' if os.name == 'nt' else 'clear')
        print("       _         _______      _______  _____  ")
        print("      | |  /\   |  __ \ \    / /_   _|/ ____| ")
        print("      | | /  \  | |__) \ \  / /  | | | (___   ")
        print("  _   | |/ /\ \ |  _  / \ \/ /   | |  \___ \  ")
        print(" | |__| / ____ \| | \ \  \  /   _| |_ ____) | ")
        print("  \____/_/    \_\_|  \_\  \/   |_____|_____/  ")
        print("                                              ")
                
        print("🎙️ Jarvis iniciado! Pressione ESC para encerrar.\n")
        
        while self.running.is_set():
            try:
                # Capturar entrada do usuário
                user_input = self.speech_to_text.listen_continuously()
                
                if not self.running.is_set() or not user_input:
                    break
                    
                # Log da entrada do usuário
                self.chat_logger.log_user_message(user_input)
                
                # Verificar se é uma pergunta visual
                image_data = None
                if self._is_visual_question(user_input):
                    print("👁️ Detectada pergunta visual, capturando webcam...")
                    image_data = self._capture_webcam_for_analysis()
                
                # Processar com IA (com ou sem imagem)
                response_data = self.conversation.process_input(user_input, image_data)
                
                self._display_response_info(response_data)
                
                # Log da resposta
                self.chat_logger.log_jarvis_message(response_data['text'])
                
                # Executar ações se necessário
                if response_data.get("actions"):
                    print("🤖 ACTIONS :")
                    self.action_manager.execute_actions(response_data["actions"])
                
                # Falar resposta
                if response_data.get("speech"):
                    self.text_to_speech.speak(response_data["speech"])
                    
            except KeyboardInterrupt:
                # Usuário pressionou Ctrl+C
                break
            except Exception as e:
                print(f"⚠️ Erro: {e}")
                # Continuar o loop mesmo com erro
                continue
    
    def stop(self):
        """Para a execução do Jarvis"""
        print("\n🛑 Encerrando o Jarvis...")
        self.running.clear()
        
    def _display_response_info(self, data: Dict[str, Any]):
        """Exibe informações da resposta"""
        print(f"⚡ TRIGGER : {data.get('trigger', '')}")
        print(f"📄 TEXT    : {data.get('text', '')}")
        print(f"🔊 SPEECH  : {data.get('speech', '')}\n")
    
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
            "me diz o que é"
        ]
        
        user_input_lower = user_input.lower()
        return any(keyword in user_input_lower for keyword in visual_keywords)
    
    def _capture_webcam_for_analysis(self) -> str:
        """
        Captura imagem da webcam para análise
        
        Returns:
            Imagem em base64 ou None se falhar
        """
        try:
            import cv2
            import base64
            
            # Abrir webcam
            cap = cv2.VideoCapture(0)
            
            if not cap.isOpened():
                print("❌ Não foi possível abrir a webcam")
                return None
            
            # Ler frame
            ret, frame = cap.read()
            
            # Liberar webcam
            cap.release()
            
            if not ret:
                print("❌ Não foi possível capturar frame")
                return None
            
            # Converter para JPEG em memória
            _, buffer = cv2.imencode('.jpg', frame)
            
            # Converter para base64
            image_base64 = base64.b64encode(buffer).decode('utf-8')
            
            print("✅ Imagem capturada com sucesso")
            return image_base64
            
        except Exception as e:
            print(f"❌ Erro ao capturar webcam: {e}")
            return None