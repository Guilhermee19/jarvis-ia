# Jarvis IA - Assistente Virtual
# Importações principais do projeto

from src.modules.chatLogger import ChatLogger
from src.modules.jarvisVoice import speak_jarvis
from src.modules.speechToText import listen_continuously
from src.modules.triggers import action_trigger
from src.modules.ollamaIA import perguntar_ia

__version__ = "1.0.0"
__author__ = "Guilherme"
__description__ = "Jarvis IA - Assistente Virtual com reconhecimento de voz"

__all__ = [
    'ChatLogger',
    'speak_jarvis', 
    'listen_continuously',
    'action_trigger',
    'perguntar_ia'
]