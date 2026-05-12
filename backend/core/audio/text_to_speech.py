"""
Módulo de síntese de voz
Converte texto em fala usando Edge TTS
"""
import edge_tts
import asyncio
import pygame
import io
from typing import Optional
from config.settings import SETTINGS


class TextToSpeech:
    def __init__(self, voice: str = None):
        """
        Inicializa o sintetizador de voz
        
        Args:
            voice: Voz a ser usada (padrão configurado em settings)
        """
        self.voice = voice or SETTINGS["audio"]["voice"]
        self._init_pygame()
    
    def _init_pygame(self):
        """Inicializa o pygame mixer para reprodução de áudio"""
        try:
            pygame.mixer.init()
        except pygame.error as e:
            print(f"⚠️ Erro ao inicializar pygame mixer: {e}")
    
    async def _generate_speech_async(self, text: str) -> bytes:
        """
        Gera áudio a partir do texto de forma assíncrona
        
        Args:
            text: Texto a ser convertido em fala
            
        Returns:
            Bytes do áudio gerado
        """
        try:
            communicate = edge_tts.Communicate(text, self.voice)
            audio_bytes = b""
            
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_bytes += chunk["data"]
            
            return audio_bytes
            
        except Exception as e:
            print(f"❌ Erro ao gerar fala: {e}")
            return b""
    
    def _play_audio(self, audio_bytes: bytes) -> None:
        """
        Reproduz o áudio gerado
        
        Args:
            audio_bytes: Bytes do áudio a ser reproduzido
        """
        try:
            if not audio_bytes:
                return
                
            audio_stream = io.BytesIO(audio_bytes)
            pygame.mixer.music.load(audio_stream)
            pygame.mixer.music.play()
            
            # Aguardar conclusão da reprodução
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
                
        except Exception as e:
            print(f"❌ Erro ao reproduzir áudio: {e}")
    
    def speak(self, text: str) -> None:
        """
        Converte texto em fala e reproduz
        
        Args:
            text: Texto a ser falado
        """
        if not text or not text.strip():
            return
            
        try:
            print(f"🔊 Falando: {text[:50]}{'...' if len(text) > 50 else ''}")
            
            # Gerar e reproduzir áudio
            audio_bytes = asyncio.run(self._generate_speech_async(text))
            self._play_audio(audio_bytes)
            
        except Exception as e:
            print(f"❌ Erro ao falar: {e}")
    
    def set_voice(self, voice: str) -> None:
        """
        Altera a voz utilizada
        
        Args:
            voice: Nova voz a ser utilizada
        """
        self.voice = voice
        print(f"🎤 Voz alterada para: {voice}")
    
    @staticmethod
    def list_available_voices() -> None:
        """Lista as vozes disponíveis"""
        # Esta implementação seria expandida para listar vozes do Edge TTS
        print("🎤 Vozes disponíveis:")
        voices = [
            "pt-BR-AntonioNeural",
            "pt-BR-FranciscaNeural", 
            "pt-BR-BrendaNeural",
            "pt-BR-DonatoNeural"
        ]
        for voice in voices:
            print(f"  - {voice}")