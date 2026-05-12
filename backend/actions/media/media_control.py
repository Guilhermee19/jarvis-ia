"""
Ações de controle de mídia e áudio
"""
import webbrowser
import pyautogui
from ..base import BaseAction, ActionResult


class PlayMusicAction(BaseAction):
    """Controla reprodução de música"""
    
    def __init__(self):
        super().__init__("tocar", "Toca música ou controla reprodução")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Toca música
        
        Args:
            alvo: Tipo (musica, spotify, youtube)
            param: Parâmetro adicional
            valor: Nome da música/artista
        """
        try:
            if not alvo:
                # Se não especificou alvo, assume controle de reprodução
                return self._toggle_playback()
            
            alvo = alvo.lower()
            
            if "musica" in alvo and valor:
                return self._play_song_on_spotify(valor)
            elif alvo == "spotify":
                return self._open_spotify()
            elif alvo == "youtube" and valor:
                return self._play_on_youtube(valor)
            else:
                return self._toggle_playback()
                
        except Exception as e:
            print(f"  ❌ Erro ao controlar música: {e}")
            return ActionResult.FAILED
    
    def _play_song_on_spotify(self, song_name: str) -> ActionResult:
        """Busca e toca música no Spotify"""
        try:
            search_term = song_name.replace(' ', '%20')
            spotify_url = f"https://open.spotify.com/search/{search_term}"
            webbrowser.open(spotify_url)
            print(f"  🎵 Buscando no Spotify: {song_name}")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao buscar no Spotify: {e}")
            return ActionResult.FAILED
    
    def _open_spotify(self) -> ActionResult:
        """Abre o Spotify"""
        try:
            webbrowser.open("https://open.spotify.com")
            print("  🎵 Spotify Web aberto")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao abrir Spotify: {e}")
            return ActionResult.FAILED
    
    def _play_on_youtube(self, query: str) -> ActionResult:
        """Busca música no YouTube"""
        try:
            search_term = query.replace(' ', '+')
            youtube_url = f"https://www.youtube.com/results?search_query={search_term}+music"
            webbrowser.open(youtube_url)
            print(f"  🎵 Buscando no YouTube: {query}")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao buscar no YouTube: {e}")
            return ActionResult.FAILED
    
    def _toggle_playback(self) -> ActionResult:
        """Alterna reprodução (play/pause)"""
        try:
            pyautogui.press("playpause")
            print("  ⏯️ Reprodução alternada")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao alternar reprodução: {e}")
            return ActionResult.FAILED


class PauseAction(BaseAction):
    """Pausa reprodução de mídia"""
    
    def __init__(self):
        super().__init__("pausar", "Pausa reprodução de mídia")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """Pausa mídia em reprodução"""
        try:
            pyautogui.press("playpause")
            print("  ⏸️ Mídia pausada")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao pausar: {e}")
            return ActionResult.FAILED


class VolumeAction(BaseAction):
    """Controla volume do sistema"""
    
    def __init__(self):
        super().__init__("volume", "Controla volume do sistema")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Controla volume
        
        Args:
            alvo: Tipo de controle (mudo, aumentar, diminuir, definir)
            param: Parâmetro adicional
            valor: Valor específico (para quantidade)
        """
        try:
            if not alvo:
                print("  ❌ Tipo de controle de volume não especificado")
                return ActionResult.FAILED
            
            alvo = alvo.lower()
            
            if alvo in ["mudo", "mute", "silenciar"]:
                return self._toggle_mute()
            elif alvo in ["aumentar", "subir", "up"]:
                return self._increase_volume(valor)
            elif alvo in ["diminuir", "baixar", "down", "abaixar"]:
                return self._decrease_volume(valor)
            elif alvo in ["definir", "set"] and valor:
                return self._set_volume(valor)
            else:
                print(f"  ❌ Controle de volume não reconhecido: {alvo}")
                return ActionResult.FAILED
                
        except Exception as e:
            print(f"  ❌ Erro ao controlar volume: {e}")
            return ActionResult.FAILED
    
    def _toggle_mute(self) -> ActionResult:
        """Alterna mudo"""
        try:
            pyautogui.press("volumemute")
            print("  🔇 Volume alternado (mudo/som)")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao alternar mudo: {e}")
            return ActionResult.FAILED
    
    def _increase_volume(self, amount: str = None) -> ActionResult:
        """Aumenta volume"""
        try:
            steps = int(amount) if amount and amount.isdigit() else 5
            
            for _ in range(steps):
                pyautogui.press("volumeup")
            
            print(f"  🔊 Volume aumentado ({steps} níveis)")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao aumentar volume: {e}")
            return ActionResult.FAILED
    
    def _decrease_volume(self, amount: str = None) -> ActionResult:
        """Diminui volume"""
        try:
            steps = int(amount) if amount and amount.isdigit() else 5
            
            for _ in range(steps):
                pyautogui.press("volumedown")
            
            print(f"  🔉 Volume diminuído ({steps} níveis)")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao diminuir volume: {e}")
            return ActionResult.FAILED
    
    def _set_volume(self, level: str) -> ActionResult:
        """Define volume em nível específico (não implementado via pyautogui)"""
        print("  ⚠️ Definição de volume específico não implementada")
        return ActionResult.SKIPPED