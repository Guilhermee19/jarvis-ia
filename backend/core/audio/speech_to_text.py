"""
Módulo de reconhecimento de voz
Converte fala em texto usando Google Speech Recognition
"""
import speech_recognition as sr
from typing import Optional
from config.settings import SETTINGS


class SpeechToText:
    def __init__(self, microphone_index: int = None):
        """
        Inicializa o reconhecedor de voz
        
        Args:
            microphone_index: Índice do microfone a ser usado
        """
        self.recognizer = sr.Recognizer()
        self.microphone_index = microphone_index or SETTINGS["audio"]["microphone_index"]
        self.language = SETTINGS["audio"]["language"]
        self._configure_recognizer()
    
    def _configure_recognizer(self):
        """Configura o reconhecedor com os parâmetros otimizados"""
        self.recognizer.pause_threshold = 1
        self.recognizer.energy_threshold = 300
    
    def list_microphones(self) -> None:
        """Lista todos os microfones disponíveis no sistema"""
        print("🎙️ Microfones disponíveis:")
        print("-" * 40)
        for i, nome in enumerate(sr.Microphone.list_microphone_names()):
            print(f"[{i}] {nome}")
        print("-" * 40)
    
    def listen(self) -> Optional[str]:
        """
        Captura e reconhece uma fala do microfone
        
        Returns:
            Texto reconhecido ou None se houve erro
        """
        try:
            with sr.Microphone(self.microphone_index) as source:
                # Ajustar para ruído ambiente
                self.recognizer.adjust_for_ambient_noise(source, duration=0.3)
                print("Ouvindo...")
                
                # Capturar áudio sem timeout para não encerrar o programa
                audio = self.recognizer.listen(source)
                
            print("Reconhecendo...")
            
            # Reconhecer usando Google
            texto = self.recognizer.recognize_google(
                audio, 
                language=self.language
            )
            
            print(f"📝 {texto}\n")
            return texto
            
        except sr.UnknownValueError:
            print("⚠️  Não entendi, pode repetir?\n")
            return None
            
        except sr.RequestError as e:
            print(f"❌ Erro na API do Google: {e}\n")
            return None
            
        except Exception as e:
            print(f"❌ Erro inesperado: {e}\n")
            return None
    
    def listen_continuously(self) -> str:
        """
        Loop contínuo de escuta até capturar algo válido
        
        Returns:
            Texto reconhecido
        """
        while True:
            try:
                result = self.listen()
                if result:
                    return result
                # Se não capturou nada, continue tentando
                    
            except KeyboardInterrupt:
                print("\n🛑 Escuta interrompida pelo usuário.")
                raise