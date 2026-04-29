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
        
        # Configurar ações de UI com referência ao Jarvis
        self._setup_ui_actions()
        
        # Widgets flutuantes (serão criados quando solicitados)
        self.chat_widget = None
        self.webcam_widget = None
        
        # Controle de execução
        self.running = threading.Event()
        self.running.set()
    
    def _setup_ui_actions(self):
        """Configura ações de UI com referência a esta instância"""
        try:
            chat_action = self.action_manager.actions.get('chat')
            if chat_action:
                chat_action.set_jarvis_instance(self)
            
            webcam_action = self.action_manager.actions.get('webcam')
            if webcam_action:
                webcam_action.set_jarvis_instance(self)
        except Exception as e:
            print(f"⚠️ Erro ao configurar ações de UI: {e}")
    
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
            from config.settings import get_camera_index
            
            # Obter índice da câmera configurado
            camera_index = get_camera_index()
            
            # Abrir webcam
            cap = cv2.VideoCapture(camera_index)
            
            if not cap.isOpened():
                print(f"❌ Não foi possível abrir a webcam (câmera {camera_index})")
                print("💡 Dica: Execute 'python -c \"from config.settings import list_available_cameras; list_available_cameras()\"' para ver câmeras disponíveis")
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
    
    def open_chat_widget(self):
        """Abre o widget de chat"""
        try:
            from ui.widgets.chat_widget import ChatWidget
            
            if self.chat_widget is None:
                self.chat_widget = ChatWidget()
                # Conectar signal de mensagem enviada
                self.chat_widget.message_sent.connect(self._handle_chat_message)
                self.chat_widget.add_system_message("Chat iniciado! Digite seus comandos aqui.")
            
            self.chat_widget.show()
            self.chat_widget.raise_()
            self.chat_widget.activateWindow()
            print("💬 Widget de chat aberto")
            
        except Exception as e:
            print(f"❌ Erro ao abrir chat: {e}")
    
    def open_webcam_widget(self):
        """Abre o widget de webcam"""
        try:
            from ui.widgets.webcam_widget import WebcamWidget
            
            if self.webcam_widget is None:
                self.webcam_widget = WebcamWidget()
                # Conectar signal de pergunta
                self.webcam_widget.ask_question.connect(self._handle_webcam_question)
            
            self.webcam_widget.show()
            self.webcam_widget.raise_()
            self.webcam_widget.activateWindow()
            print("📹 Widget de webcam aberto")
            
        except Exception as e:
            print(f"❌ Erro ao abrir webcam: {e}")
    
    def _handle_chat_message(self, message: str):
        """
        Processa mensagem enviada pelo chat widget
        
        Args:
            message: Mensagem do usuário
        """
        try:
            print(f"💬 Mensagem do chat: {message}")
            
            # Log da entrada
            self.chat_logger.log_user_message(message)
            
            # Verificar se é pergunta visual
            image_data = None
            if self._is_visual_question(message):
                print("👁️ Pergunta visual detectada do chat")
                # Se webcam widget estiver aberto, usar frame dele
                if self.webcam_widget and self.webcam_widget.isVisible():
                    image_data = self.webcam_widget.get_current_frame_base64()
                else:
                    image_data = self._capture_webcam_for_analysis()
            
            # Processar com IA
            response_data = self.conversation.process_input(message, image_data)
            
            # Adicionar resposta ao chat
            if self.chat_widget:
                self.chat_widget.add_jarvis_message(response_data.get('text', ''))
            
            # Log da resposta
            self.chat_logger.log_jarvis_message(response_data['text'])
            
            # Executar ações se necessário
            if response_data.get("actions"):
                if self.chat_widget:
                    self.chat_widget.add_system_message("Executando ações...")
                self.action_manager.execute_actions(response_data["actions"])
            
            # Falar resposta (opcional)
            if response_data.get("speech"):
                self.text_to_speech.speak(response_data["speech"])
                
        except Exception as e:
            print(f"❌ Erro ao processar mensagem do chat: {e}")
            if self.chat_widget:
                self.chat_widget.add_jarvis_message(f"Desculpe, ocorreu um erro: {e}")
    
    def _handle_webcam_question(self):
        """Processa pergunta sobre o que a webcam está vendo"""
        try:
            print("👁️ Pergunta sobre webcam solicitada")
            
            if not self.webcam_widget:
                print("❌ Widget de webcam não está aberto")
                return
            
            # Capturar frame atual
            image_data = self.webcam_widget.get_current_frame_base64()
            
            if not image_data:
                print("❌ Não foi possível capturar frame")
                return
            
            # Usar pergunta padrão
            question = "O que você está vendo nesta imagem?"
            
            # Processar com IA
            response_data = self.conversation.process_input(question, image_data)
            
            # Mostrar resposta
            print(f"👁️ Resposta da visão: {response_data.get('text', '')}")
            
            # Se chat estiver aberto, adicionar lá também
            if self.chat_widget and self.chat_widget.isVisible():
                self.chat_widget.add_system_message("[Análise da webcam]")
                self.chat_widget.add_jarvis_message(response_data.get('text', ''))
            
            # Falar resposta
            if response_data.get("speech"):
                self.text_to_speech.speak(response_data["speech"])
                
        except Exception as e:
            print(f"❌ Erro ao processar pergunta da webcam: {e}")