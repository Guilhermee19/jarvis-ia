"""
Janela principal do Jarvis IA
Interface gráfica usando PySide6 + QtWebEngine
"""
import os
import sys
import threading
from pathlib import Path
from PySide6.QtCore import Qt, QUrl, QMetaObject, Q_ARG
from PySide6.QtWidgets import QMainWindow
from PySide6.QtWebEngineWidgets import QWebEngineView
from core import Jarvis


class JarvisWindow(QMainWindow):
    """Janela principal do Jarvis com interface HTML/CSS"""
    
    def __init__(self):
        super().__init__()
        self.init_ui()
        self.init_jarvis()
    
    def init_ui(self):
        """Inicializar a interface do usuário"""
        # Configurações da janela
        self.setWindowTitle("Jarvis IA")
        self.setGeometry(100, 100, 800, 600)
        
        # Remover bordas e deixar transparente (opcional)
        # self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint)
        # self.setAttribute(Qt.WA_TranslucentBackground)
        
        # Criar WebEngineView
        self.web_view = QWebEngineView()
        
        # Carregar HTML
        html_path = Path(__file__).parent / "templates" / "index.html"
        if html_path.exists():
            url = QUrl.fromLocalFile(str(html_path.absolute()))
            self.web_view.setUrl(url)
        else:
            print(f"❌ Arquivo HTML não encontrado: {html_path}")
        
        # Definir como widget central
        self.setCentralWidget(self.web_view)
        
        # Configurar fundo
        self.setStyleSheet("background-color: #1a1d26;")
    
    def init_jarvis(self):
        """Inicializar o Jarvis em thread separada"""
        # Criar instância do Jarvis
        self.jarvis = Jarvis()
        
        # Conectar signals para abrir widgets no thread principal
        self.jarvis.open_chat_requested.connect(self.open_chat_widget)
        self.jarvis.open_webcam_requested.connect(self.open_webcam_widget)
        self.jarvis.chat_message_ready.connect(self.add_message_to_chat)
        
        def start_jarvis():
            try:
                self.jarvis.start()
            except Exception as e:
                print(f"❌ Erro ao inicializar Jarvis: {e}")
        
        # Executar Jarvis em thread separada
        self.jarvis_thread = threading.Thread(target=start_jarvis, daemon=True)
        self.jarvis_thread.start()
    
    def open_chat_widget(self):
        """Abre o widget de chat (chamado no thread principal)"""
        try:
            from ui.widgets.chat_widget import ChatWidget
            
            if not hasattr(self.jarvis, 'chat_widget') or self.jarvis.chat_widget is None:
                self.jarvis.chat_widget = ChatWidget()
                # Conectar signal de mensagem enviada
                self.jarvis.chat_widget.message_sent.connect(self.jarvis._handle_chat_message)
                self.jarvis.chat_widget.add_system_message("Chat iniciado! Digite seus comandos aqui.")
            
            self.jarvis.chat_widget.show()
            self.jarvis.chat_widget.raise_()
            self.jarvis.chat_widget.activateWindow()
            print("💬 Widget de chat aberto")
            
        except Exception as e:
            print(f"❌ Erro ao abrir chat: {e}")
    
    def open_webcam_widget(self):
        """Abre o widget de webcam (chamado no thread principal)"""
        try:
            from ui.widgets.webcam_widget import WebcamWidget
            
            if not hasattr(self.jarvis, 'webcam_widget') or self.jarvis.webcam_widget is None:
                self.jarvis.webcam_widget = WebcamWidget()
                # Conectar signal de pergunta
                self.jarvis.webcam_widget.ask_question.connect(self.jarvis._handle_webcam_question)
            
            self.jarvis.webcam_widget.show()
            self.jarvis.webcam_widget.raise_()
            self.jarvis.webcam_widget.activateWindow()
            print("📹 Widget de webcam aberto")
            
        except Exception as e:
            print(f"❌ Erro ao abrir webcam: {e}")
    
    def add_message_to_chat(self, message: str):
        """Adiciona mensagem ao chat widget (chamado no thread principal)"""
        try:
            if hasattr(self.jarvis, 'chat_widget') and self.jarvis.chat_widget:
                if message.startswith("JARVIS: "):
                    self.jarvis.chat_widget.add_jarvis_message(message[8:])
                elif message.startswith("USER: "):
                    self.jarvis.chat_widget.add_user_message(message[6:])
                elif message.startswith("SYSTEM: "):
                    self.jarvis.chat_widget.add_system_message(message[8:])
                else:
                    self.jarvis.chat_widget.add_system_message(message)
        except Exception as e:
            print(f"❌ Erro ao adicionar mensagem ao chat: {e}")
    
    def closeEvent(self, event):
        """Evento de fechamento da janela"""
        print("\n🛑 Encerrando o Jarvis...")
        
        # Parar o Jarvis
        if hasattr(self, 'jarvis'):
            self.jarvis.stop()
        
        # Fechar widgets
        if hasattr(self, 'jarvis'):
            if self.jarvis.chat_widget:
                self.jarvis.chat_widget.close()
            if self.jarvis.webcam_widget:
                self.jarvis.webcam_widget.close()
        
        event.accept()
        os._exit(0)