"""
Ações para abrir e fechar aplicativos
"""
import subprocess
import os
import webbrowser
from typing import Dict
from ..base import BaseAction, ActionResult


class OpenAppAction(BaseAction):
    """Abre aplicativos do sistema"""
    
    def __init__(self):
        super().__init__("abrir", "Abre aplicativos e páginas web")
        
        # Mapeamento de aplicativos conhecidos com múltiplos caminhos possíveis
        self.app_paths = {
            "spotify": [
                r"C:\Users\%USERNAME%\AppData\Roaming\Spotify\Spotify.exe",
                r"C:\Users\%USERNAME%\AppData\Local\Microsoft\WindowsApps\Spotify.exe",
                "spotify:"  # Protocolo URI como fallback
            ],
            "notepad": ["notepad.exe"],
            "calc": ["calc.exe"],
            "paint": ["mspaint.exe"],
            # Jogos
            "fortnite": [r"C:\Program Files\Epic Games\Fortnite\FortniteGame\Binaries\Win64\FortniteClient-Win64-Shipping.exe"]
        }
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Abre aplicativo ou página web
        
        Args:
            alvo: Tipo (app, site, jogo, pasta)
            param: Parâmetro específico
            valor: Valor/nome específico
        """
        try:
            if not alvo:
                print("  ❌ Tipo de abertura não especificado")
                return ActionResult.FAILED
            
            alvo = alvo.lower()
            
            # Abrir aplicativos
            if alvo in self.app_paths:
                return self._open_application(self.app_paths[alvo])
            
            # Abrir sites específicos
            elif alvo == "youtube":
                return self._open_youtube(param, valor)
            
            elif alvo == "google":
                return self._open_google(valor)
            
            elif alvo == "site":
                return self._open_website(valor)
            
            # Abrir jogos
            elif alvo == "jogo":
                return self._open_game(valor)
            
            # Abrir pastas
            elif alvo == "pasta":
                return self._open_folder(param, valor)
            
            else:
                print(f"  ❌ Tipo de abertura não reconhecido: {alvo}")
                return ActionResult.FAILED
                
        except Exception as e:
            print(f"  ❌ Erro ao abrir: {e}")
            return ActionResult.FAILED
    
    def _open_application(self, app_paths) -> ActionResult:
        """Abre um aplicativo específico, tentando múltiplos caminhos"""
        # Se for string única, converte para lista
        if isinstance(app_paths, str):
            app_paths = [app_paths]
        
        last_error = None
        
        for app_path in app_paths:
            try:
                # Se é protocolo URI (termina com :)
                if app_path.endswith(':'):
                    subprocess.Popen(['start', '', app_path], shell=True)
                    print(f"  🚀 Aplicativo aberto via URI: {app_path}")
                    return ActionResult.SUCCESS
                
                # Expande variáveis de ambiente
                expanded_path = os.path.expandvars(app_path)
                
                # Verifica se o arquivo existe antes de tentar abrir
                if os.path.isfile(expanded_path):
                    subprocess.Popen(expanded_path)
                    print(f"  🚀 Aplicativo aberto: {expanded_path}")
                    return ActionResult.SUCCESS
                else:
                    # Se não encontrou, continua tentando próximo caminho
                    continue
                    
            except Exception as e:
                last_error = e
                continue
        
        # Se chegou aqui, nenhum caminho funcionou
        print(f"  ❌ Erro ao abrir aplicativo: {last_error}")
        return ActionResult.FAILED
    
    def _open_youtube(self, param: str = None, valor: str = None) -> ActionResult:
        """Abre YouTube ou canal específico"""
        try:
            if param == "canal" and valor:
                url = f"https://www.youtube.com/@{valor}"
            elif valor:
                # Buscar no YouTube
                search_term = valor.replace(" ", "+")
                url = f"https://www.youtube.com/results?search_query={search_term}"
            else:
                url = "https://www.youtube.com"
            
            webbrowser.open(url)
            print(f"  🌐 YouTube aberto: {url}")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao abrir YouTube: {e}")
            return ActionResult.FAILED
    
    def _open_google(self, query: str = None) -> ActionResult:
        """Abre Google com busca opcional"""
        try:
            if query:
                search_term = query.replace(" ", "+")
                url = f"https://www.google.com/search?q={search_term}"
            else:
                url = "https://www.google.com"
            
            webbrowser.open(url)
            print(f"  🌐 Google aberto: {url}")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao abrir Google: {e}")
            return ActionResult.FAILED
    
    def _open_website(self, url: str) -> ActionResult:
        """Abre um site específico"""
        try:
            if not url:
                print("  ❌ URL não especificada")
                return ActionResult.FAILED
            
            # Adicionar protocolo se não especificado
            if not url.startswith(("http://", "https://")):
                url = "https://" + url
            
            webbrowser.open(url)
            print(f"  🌐 Site aberto: {url}")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao abrir site: {e}")
            return ActionResult.FAILED
    
    def _open_game(self, game_name: str) -> ActionResult:
        """Abre um jogo específico"""
        try:
            if not game_name:
                print("  ❌ Nome do jogo não especificado")
                return ActionResult.FAILED
            
            game_name_lower = game_name.lower()
            
            if game_name_lower in self.app_paths:
                return self._open_application(self.app_paths[game_name_lower])
            else:
                print(f"  ❌ Jogo não encontrado: {game_name}")
                return ActionResult.FAILED
        except Exception as e:
            print(f"  ❌ Erro ao abrir jogo: {e}")
            return ActionResult.FAILED
    
    def _open_folder(self, location: str = None, folder_name: str = None) -> ActionResult:
        """Abre uma pasta específica"""
        try:
            if location and folder_name:
                folder_path = os.path.join(os.path.expanduser("~"), location, folder_name)
            elif folder_name:
                folder_path = os.path.join(os.path.expanduser("~"), folder_name)
            elif location:
                folder_path = os.path.join(os.path.expanduser("~"), location)
            else:
                folder_path = os.path.expanduser("~")  # Home folder
            
            if os.path.exists(folder_path):
                os.startfile(folder_path)
                print(f"  📁 Pasta aberta: {folder_path}")
                return ActionResult.SUCCESS
            else:
                print(f"  ❌ Pasta não encontrada: {folder_path}")
                return ActionResult.FAILED
        except Exception as e:
            print(f"  ❌ Erro ao abrir pasta: {e}")
            return ActionResult.FAILED


class CloseAppAction(BaseAction):
    """Fecha aplicativos do sistema"""
    
    def __init__(self):
        super().__init__("fechar", "Fecha aplicativos em execução")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Fecha aplicativos
        
        Args:
            alvo: Nome do aplicativo ou 'tudo'
            param: Parâmetro adicional
            valor: Valor específico
        """
        try:
            if not alvo:
                print("  ❌ Aplicativo não especificado")
                return ActionResult.FAILED
            
            if alvo.lower() == "tudo" or alvo.lower() == "todo":
                return self._close_all_apps()
            else:
                return self._close_specific_app(alvo)
                
        except Exception as e:
            print(f"  ❌ Erro ao fechar aplicativo: {e}")
            return ActionResult.FAILED
    
    def _close_specific_app(self, app_name: str) -> ActionResult:
        """Fecha um aplicativo específico"""
        try:
            # Adicionar .exe se não especificado
            if not app_name.endswith('.exe'):
                app_name += '.exe'
            
            result = subprocess.call(f"taskkill /F /IM {app_name}", shell=True)
            
            if result == 0:
                print(f"  ✅ Aplicativo fechado: {app_name}")
                return ActionResult.SUCCESS
            else:
                print(f"  ⚠️ Aplicativo não encontrado ou já fechado: {app_name}")
                return ActionResult.PARTIAL
                
        except Exception as e:
            print(f"  ❌ Erro ao fechar aplicativo: {e}")
            return ActionResult.FAILED
    
    def _close_all_apps(self) -> ActionResult:
        """Fecha todos os aplicativos não essenciais"""
        print("  ⚠️ Funcionalidade de fechar tudo não implementada por segurança")
        return ActionResult.SKIPPED