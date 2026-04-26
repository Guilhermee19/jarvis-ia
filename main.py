"""
Jarvis IA - Assistente Virtual
Ponto de entrada principal do sistema
"""
import sys
from PySide6.QtWidgets import QApplication
from ui import JarvisWindow

def main():
    """Função principal do programa"""
    app = QApplication(sys.argv)
    
    # Criar e mostrar a janela
    window = JarvisWindow()
    window.show()
    
    # Executar aplicação
    sys.exit(app.exec())

if __name__ == "__main__":
    main()