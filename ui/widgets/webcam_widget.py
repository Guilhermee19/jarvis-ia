"""
Widget flutuante de webcam para visualização em tempo real
Mostra o feed da câmera em uma janela arrastável
"""
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton
)
from PySide6.QtCore import Qt, QPoint, QTimer, Signal
from PySide6.QtGui import QImage, QPixmap
import cv2
import numpy as np


class WebcamWidget(QWidget):
    """Widget flutuante de webcam com drag and drop"""
    
    # Signal emitido quando usuário quer fazer uma pergunta sobre o que vê
    ask_question = Signal()
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowFlags(
            Qt.Window | 
            Qt.FramelessWindowHint | 
            Qt.WindowStaysOnTopHint
        )
        
        # Variáveis para arrastar janela
        self.dragging = False
        self.drag_position = QPoint()
        
        # Webcam
        self.camera = None
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_frame)
        
        self.setup_ui()
        
        # Tamanho e posição inicial
        self.resize(640, 520)
        self.move(500, 100)
    
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
                    stop:0 #f093fb, stop:1 #f5576c
                );
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }
        """)
        
        header_layout = QHBoxLayout(self.header)
        header_layout.setContentsMargins(15, 0, 10, 0)
        
        # Título
        title = QLabel("📹 Jarvis Webcam")
        title.setStyleSheet("color: white; font-weight: bold; font-size: 14px;")
        header_layout.addWidget(title)
        
        # Status
        self.status_label = QLabel("●")
        self.status_label.setStyleSheet("color: #4ade80; font-size: 16px;")
        self.status_label.setToolTip("Câmera ativa")
        header_layout.addWidget(self.status_label)
        
        header_layout.addStretch()
        
        # Botão minimizar
        minimize_btn = QPushButton("−")
        minimize_btn.setFixedSize(30, 30)
        minimize_btn.setStyleSheet("""
            QPushButton {
                background: transparent;
                color: white;
                border: none;
                font-size: 20px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 15px;
            }
        """)
        minimize_btn.clicked.connect(self.showMinimized)
        header_layout.addWidget(minimize_btn)
        
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
        close_btn.clicked.connect(self.close_camera)
        header_layout.addWidget(close_btn)
        
        layout.addWidget(self.header)
        
        # Área de vídeo
        video_container = QWidget()
        video_container.setStyleSheet("""
            QWidget {
                background: #1e1e2e;
            }
        """)
        video_layout = QVBoxLayout(video_container)
        video_layout.setContentsMargins(10, 10, 10, 10)
        video_layout.setSpacing(10)
        
        # Label para mostrar o frame da webcam
        self.video_label = QLabel()
        self.video_label.setAlignment(Qt.AlignCenter)
        self.video_label.setStyleSheet("""
            QLabel {
                background: #000000;
                border: 2px solid #3a3a4e;
                border-radius: 8px;
            }
        """)
        self.video_label.setMinimumSize(640, 480)
        self.video_label.setText("📹 Câmera desligada\nClique em 'Iniciar Câmera' para começar")
        self.video_label.setStyleSheet("""
            QLabel {
                background: #2a2a3e;
                border: 2px solid #3a3a4e;
                border-radius: 8px;
                color: #888;
                font-size: 14px;
            }
        """)
        video_layout.addWidget(self.video_label)
        
        # Botões de controle
        control_layout = QHBoxLayout()
        control_layout.setSpacing(10)
        
        self.start_btn = QPushButton("▶ Iniciar Câmera")
        self.start_btn.setFixedHeight(40)
        self.start_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:0,
                    stop:0 #4ade80, stop:1 #22c55e
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
                    stop:0 #5de890, stop:1 #32d56e
                );
            }
        """)
        self.start_btn.clicked.connect(self.start_camera)
        control_layout.addWidget(self.start_btn)
        
        self.stop_btn = QPushButton("⏸ Parar Câmera")
        self.stop_btn.setFixedHeight(40)
        self.stop_btn.setEnabled(False)
        self.stop_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(
                    x1:0, y1:0, x2:1, y2:0,
                    stop:0 #ef4444, stop:1 #dc2626
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
                    stop:0 #ff5454, stop:1 #ec3636
                );
            }
            QPushButton:disabled {
                background: #3a3a4e;
                color: #666;
            }
        """)
        self.stop_btn.clicked.connect(self.stop_camera)
        control_layout.addWidget(self.stop_btn)
        
        self.ask_btn = QPushButton("👁️ Perguntar")
        self.ask_btn.setFixedHeight(40)
        self.ask_btn.setEnabled(False)
        self.ask_btn.setStyleSheet("""
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
            QPushButton:disabled {
                background: #3a3a4e;
                color: #666;
            }
        """)
        self.ask_btn.clicked.connect(self.ask_question.emit)
        control_layout.addWidget(self.ask_btn)
        
        video_layout.addLayout(control_layout)
        layout.addWidget(video_container)
        
        # Estilo geral
        self.setStyleSheet("""
            QWidget {
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
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
    
    def start_camera(self):
        """Inicia a captura da webcam"""
        if self.camera is None or not self.camera.isOpened():
            # Importar configuração
            from config.settings import get_camera_index
            camera_index = get_camera_index()
            
            self.camera = cv2.VideoCapture(camera_index)
            
            if self.camera.isOpened():
                self.timer.start(30)  # 30ms = ~33 FPS
                self.start_btn.setEnabled(False)
                self.stop_btn.setEnabled(True)
                self.ask_btn.setEnabled(True)
                self.status_label.setStyleSheet("color: #4ade80; font-size: 16px;")
                self.status_label.setToolTip("Câmera ativa")
                print(f"📹 Webcam iniciada (câmera {camera_index})")
            else:
                self.video_label.setText(f"❌ Erro ao abrir câmera {camera_index}\n\nDica: Verifique o índice em config/settings.py\nExecute: python -c \"from config.settings import list_available_cameras; list_available_cameras()\"")
                print(f"❌ Erro ao abrir webcam (câmera {camera_index})")
    
    def stop_camera(self):
        """Para a captura da webcam"""
        self.timer.stop()
        if self.camera:
            self.camera.release()
            self.camera = None
        
        self.video_label.setPixmap(QPixmap())
        self.video_label.setText("📹 Câmera desligada\nClique em 'Iniciar Câmera' para começar")
        self.start_btn.setEnabled(True)
        self.stop_btn.setEnabled(False)
        self.ask_btn.setEnabled(False)
        self.status_label.setStyleSheet("color: #ef4444; font-size: 16px;")
        self.status_label.setToolTip("Câmera desligada")
        print("📹 Webcam parada")
    
    def close_camera(self):
        """Fecha a câmera e esconde o widget"""
        self.stop_camera()
        self.hide()
    
    def update_frame(self):
        """Atualiza o frame da webcam"""
        if self.camera and self.camera.isOpened():
            ret, frame = self.camera.read()
            
            if ret:
                # Converter BGR para RGB
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Criar QImage
                h, w, ch = frame.shape
                bytes_per_line = ch * w
                qt_image = QImage(frame.data, w, h, bytes_per_line, QImage.Format_RGB888)
                
                # Redimensionar mantendo proporção
                pixmap = QPixmap.fromImage(qt_image)
                scaled_pixmap = pixmap.scaled(
                    self.video_label.size(),
                    Qt.KeepAspectRatio,
                    Qt.SmoothTransformation
                )
                
                self.video_label.setPixmap(scaled_pixmap)
    
    def get_current_frame_base64(self) -> str:
        """
        Captura o frame atual e retorna em base64
        
        Returns:
            String base64 da imagem ou None
        """
        if self.camera and self.camera.isOpened():
            ret, frame = self.camera.read()
            
            if ret:
                # Converter para JPEG
                _, buffer = cv2.imencode('.jpg', frame)
                import base64
                image_base64 = base64.b64encode(buffer).decode('utf-8')
                return image_base64
        
        return None
    
    def closeEvent(self, event):
        """Cleanup ao fechar"""
        self.stop_camera()
        event.accept()
