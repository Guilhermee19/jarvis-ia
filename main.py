"""
Jarvis IA - Assistente Virtual
Ponto de entrada principal do sistema
"""
import os
import threading
import keyboard
from core import Jarvis

def main():
    """Função principal do programa"""
    # Criar instância do Jarvis
    jarvis = Jarvis()
    
    # Flag de controle
    running = threading.Event()
    running.set()
    
    def encerrar():
        """Função para encerrar o programa"""
        print("\n🛑 Encerrando o Jarvis...")
        running.clear()
        jarvis.stop()
        os._exit(0)
    
    # Configurar hotkey para encerramento
    keyboard.add_hotkey('esc', encerrar)
    
    def loop_jarvis():
        """Loop principal do Jarvis em thread separada"""
        try:
            jarvis.start()
        except KeyboardInterrupt:
            encerrar()
        except Exception as e:
            print(f"❌ Erro crítico: {e}")
            encerrar()
    
    # Executar Jarvis em thread separada
    jarvis_thread = threading.Thread(target=loop_jarvis, daemon=True)
    jarvis_thread.start()
    
    # Thread principal fica livre para hotkeys
    try:
        jarvis_thread.join()
    except KeyboardInterrupt:
        encerrar()

if __name__ == "__main__":
    main()