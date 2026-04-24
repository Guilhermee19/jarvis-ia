# Actions package - Sistema de ações do Jarvis
from .base import BaseAction, ActionManager, ActionResult

# Importar e registrar todas as ações
from .system.app_launcher import OpenAppAction, CloseAppAction
from .system.file_manager import CreateFolderAction, DeleteAction, RenameAction
from .system.system_utils import ScreenshotAction, CleanupAction, SystemInfoAction
from .media.media_control import PlayMusicAction, PauseAction, VolumeAction

# Função para registrar todas as ações
def register_all_actions(action_manager: ActionManager):
    """Registra todas as ações disponíveis no ActionManager"""
    
    # Ações do sistema
    action_manager.register_action("abrir", OpenAppAction())
    action_manager.register_action("fechar", CloseAppAction())
    
    # Ações de arquivos
    action_manager.register_action("criar", CreateFolderAction())
    action_manager.register_action("deletar", DeleteAction())
    action_manager.register_action("renomear", RenameAction())
    
    # Ações de sistema
    action_manager.register_action("print", ScreenshotAction())
    action_manager.register_action("limpar", CleanupAction())
    action_manager.register_action("info", SystemInfoAction())
    
    # Ações de mídia
    action_manager.register_action("tocar", PlayMusicAction())
    action_manager.register_action("pausar", PauseAction())
    action_manager.register_action("volume", VolumeAction())

# Criar e configurar ActionManager padrão
_default_action_manager = ActionManager()
register_all_actions(_default_action_manager)

# Função de conveniência
def get_action_manager() -> ActionManager:
    """Obtém o ActionManager padrão com todas as ações registradas"""
    return _default_action_manager

__all__ = [
    'BaseAction', 
    'ActionManager', 
    'ActionResult',
    'register_all_actions',
    'get_action_manager'
]