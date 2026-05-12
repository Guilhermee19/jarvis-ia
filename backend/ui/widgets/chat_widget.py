"""
Widget flutuante de chat para interação com o Jarvis
Permite enviar comandos por texto em uma janela arrastável
"""
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QTextEdit, 
    QLineEdit, QPushButton, QLabel
)
from PySide6.QtCore import Qt, QPoint, Signal
from PySide6.QtGui import QFont, QPalette, QColor
from datetime import datetime


class ChatWidget(QWidget):
    """Widget flutuante de chat com drag and drop"""
    
    # Signal emitido quando usuário envia mensagem
    message_sent = Signal(str)
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowFlags(
            Qt.Window | 
            Qt.FramelessWindowHint | 
            Qt.WindowStaysOnTopHint
        )
        self.setAttribute(Qt.WA_TranslucentBackground, False)
        
        # Variáveis para arrastar janela
        self.dragging = False
        self.drag_position = QPoint()
        
        self.setup_ui()
        self.apply_styles()
        
        # Tamanho e posição inicial
        self.resize(400, 500)
        self.move(100, 100)
    
    def setup_ui(self):
        """Configura a interface do widget"""
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        
        # Header (barra de título arrastável)
        self.header = QWidget()
        self.header.setFixedHeight(40)
        self.header.setStyleSheet("""
            QWidget {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:0,
                    stop:0 #667eea, stop:1 #764ba2
                );
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }
        """)
        
        header_layout = QHBoxLayout(self.header)
        header_layout.setContentsMargins(15, 0, 10, 0)
        
        # Título
        title = QLabel("💬 Jarvis Chat")
        title.setStyleSheet("color: white; font-weight: bold; font-size: 14px;")
        header_layout.addWidget(title)
        
        header_layout.addStretch()
        
        # Botão fechar
        close_btn = QPushButton("✕")
        close_btn.setFixedSize(30, 30)
        close_btn.setStyleSheet("""
            QPushButton {
                background: transparent;
                color: white;
                border: none;
                font-size: 18px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 15px;
            }
        """)
        close_btn.clicked.connect(self.hide)
        header_layout.addWidget(close_btn)
        
        layout.addWidget(self.header)
        
        # Área de chat
        chat_container = QWidget()
        chat_container.setStyleSheet("""
            QWidget {
                background: #1e1e2e;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
            }
        """)
        chat_layout = QVBoxLayout(chat_container)
        chat_layout.setContentsMargins(10, 10, 10, 10)
        chat_layout.setSpacing(10)
        
        # Área de histórico
        self.chat_history = QTextEdit()
        self.chat_history.setReadOnly(True)
        self.chat_history.setStyleSheet("""
            QTextEdit {
                background: #2a2a3e;
                color: #e0e0e0;
                border: 1px solid #3a3a4e;
                border-radius: 8px;
                padding: 10px;
                font-size: 13px;
                font-family: 'Segoe UI', Arial;
            }
        """)
        chat_layout.addWidget(self.chat_history)
        
        # Área de input
        input_layout = QHBoxLayout()
        input_layout.setSpacing(10)
        
        self.message_input = QLineEdit()
        self.message_input.setPlaceholderText("Digite seu comando...")
        self.message_input.setStyleSheet("""
            QLineEdit {
                background: #2a2a3e;
                color: #e0e0e0;
                border: 2px solid #3a3a4e;
                border-radius: 8px;
                padding: 10px 15px;
                font-size: 13px;
            }
            QLineEdit:focus {
                border: 2px solid #667eea;
            }
        """)
        self.message_input.returnPressed.connect(self.send_message)
        input_layout.addWidget(self.message_input)
        
        # Botão enviar
        send_btn = QPushButton("Enviar")
        send_btn.setFixedSize(80, 40)
        send_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:0,
                    stop:0 #667eea, stop:1 #764ba2
                );
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                font-size: 13px;
            }
            QPushButton:hover {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:0,
                    stop:0 #7a8ff0, stop:1 #8a5bb2
                );
            }
            QPushButton:pressed {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:0,
                    stop:0 #5568d3, stop:1 #653a92
                );
            }
        """)
        send_btn.clicked.connect(self.send_message)
        input_layout.addWidget(send_btn)
        
        chat_layout.addLayout(input_layout)
        layout.addWidget(chat_container)
    
    def apply_styles(self):
        """Aplica estilos gerais"""
        self.setStyleSheet("""
            QWidget {
                border-radius: 10px;
            }
        """)
    
    def mousePressEvent(self, event):
        """Inicia o arrasto quando clica no header"""
        if event.button() == Qt.LeftButton:
            # Verifica se clicou no header
            if event.position().y() <= self.header.height():
                self.dragging = True
                self.drag_position = event.globalPosition().toPoint() - self.frameGeometry().topLeft()
                event.accept()
    
    def mouseMoveEvent(self, event):
        """Move a janela durante o arrasto"""
        if self.dragging and event.buttons() == Qt.LeftButton:
            self.move(event.globalPosition().toPoint() - self.drag_position)
            event.accept()
    
    def mouseReleaseEvent(self, event):
        """Finaliza o arrasto"""
        if event.button() == Qt.LeftButton:
            self.dragging = False
            event.accept()
    
    def send_message(self):
        """Envia mensagem do usuário"""
        message = self.message_input.text().strip()
        if message:
            # Adicionar mensagem do usuário ao histórico
            self.add_user_message(message)
            
            # Limpar input
            self.message_input.clear()
            
            # Emitir signal
            self.message_sent.emit(message)
    
    def add_user_message(self, message: str):
        """Adiciona mensagem do usuário ao histórico"""
        timestamp = datetime.now().strftime("%H:%M")
        html = f"""
        <div style='margin-bottom: 10px;'>
            <span style='color: #667eea; font-weight: bold;'>Você</span>
            <span style='color: #888; font-size: 11px;'> {timestamp}</span><br>
            <span style='color: #e0e0e0;'>{message}</span>
        </div>
        """
        self.chat_history.append(html)
        self.chat_history.ensureCursorVisible()
    
    def add_jarvis_message(self, message: str):
        """Adiciona resposta do Jarvis ao histórico"""
        timestamp = datetime.now().strftime("%H:%M")
        html = f"""
        <div style='margin-bottom: 10px;'>
            <span style='color: #764ba2; font-weight: bold;'>🤖 Jarvis</span>
            <span style='color: #888; font-size: 11px;'> {timestamp}</span><br>
            <span style='color: #e0e0e0;'>{message}</span>
        </div>
        """
        self.chat_history.append(html)
        self.chat_history.ensureCursorVisible()
    
    def add_system_message(self, message: str):
        """Adiciona mensagem do sistema ao histórico"""
        timestamp = datetime.now().strftime("%H:%M")
        html = f"""
        <div style='margin-bottom: 10px;'>
            <span style='color: #888; font-size: 11px;'>[{timestamp}]</span>
            <span style='color: #aaa; font-style: italic;'> {message}</span>
        </div>
        """
        self.chat_history.append(html)
        self.chat_history.ensureCursorVisible()
    
    def clear_chat(self):
        """Limpa o histórico de chat"""
        self.chat_history.clear()
        self.add_system_message("Chat limpo")
