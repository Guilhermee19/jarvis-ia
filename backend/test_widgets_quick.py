"""
Teste rápido dos widgets sem o Jarvis completo
"""
import sys
from PySide6.QtWidgets import QApplication
from ui.widgets.chat_widget import ChatWidget
from ui.widgets.webcam_widget import WebcamWidget


def main():
    """Teste simples dos widgets"""
    app = QApplication(sys.argv)
    
    # Criar widgets
    chat = ChatWidget()
    webcam = WebcamWidget()
    
    # Posicionar
    chat.move(100, 100)
    webcam.move(550, 100)
    
    # Adicionar mensagem de teste
    chat.add_system_message("Widget de chat funcionando! ✅")
    chat.add_jarvis_message("Olá! Este é um teste do chat widget.")
    
    # Mostrar
    chat.show()
    webcam.show()
    
    print("✅ Widgets abertos! Pressione Ctrl+C ou feche as janelas para sair.")
    
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
