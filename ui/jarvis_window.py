"""
Janela principal do Jarvis IA
Interface gráfica usando PySide6 + QtWebEngine
"""
import os
import sys
import threading
from pathlib import Path
from PySide6.QtCore import Qt, QUrl
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
        def start_jarvis():
            try:
                jarvis = Jarvis()
                jarvis.start()
            except Exception as e:
                print(f"❌ Erro ao inicializar Jarvis: {e}")
        
        # Executar Jarvis em thread separada
        jarvis_thread = threading.Thread(target=start_jarvis, daemon=True)
        jarvis_thread.start()
    
    def closeEvent(self, event):
        """Evento de fechamento da janela"""
        print("\n🛑 Encerrando o Jarvis...")
        event.accept()
        os._exit(0)