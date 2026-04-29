"""
Ações de controle da interface do usuário
Abre widgets flutuantes e controla elementos de UI
"""
from actions.base import BaseAction, ActionResult


class OpenChatAction(BaseAction):
    """Ação para abrir o widget de chat"""
    
    def __init__(self):
        super().__init__(
            name="chat",
            description="Abre widget flutuante de chat para interação por texto"
        )
        self.jarvis_instance = None
    
    def set_jarvis_instance(self, jarvis):
        """Define a instância do Jarvis para callback"""
        self.jarvis_instance = jarvis
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Abre o widget de chat
        
        Returns:
            ActionResult.SUCCESS ou ActionResult.FAILED
        """
        try:
            print("💬 Abrindo widget de chat...")
            
            if self.jarvis_instance:
                self.jarvis_instance.open_chat_widget()
                return ActionResult.SUCCESS
            else:
                print("❌ Instância do Jarvis não configurada")
                return ActionResult.FAILED
                
        except Exception as e:
            print(f"❌ Erro ao abrir chat: {e}")
            return ActionResult.FAILED
    
    def validate_params(self, alvo: str = None, param: str = None, valor: str = None) -> bool:
        """Sem parâmetros necessários"""
        return True


class OpenWebcamAction(BaseAction):
    """Ação para abrir o widget de webcam"""
    
    def __init__(self):
        super().__init__(
            name="webcam",
            description="Abre widget flutuante de webcam para visualização em tempo real"
        )
        self.jarvis_instance = None
    
    def set_jarvis_instance(self, jarvis):
        """Define a instância do Jarvis para callback"""
        self.jarvis_instance = jarvis
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Abre o widget de webcam
        
        Returns:
            ActionResult.SUCCESS ou ActionResult.FAILED
        """
        try:
            print("📹 Abrindo widget de webcam...")
            
            if self.jarvis_instance:
                self.jarvis_instance.open_webcam_widget()
                return ActionResult.SUCCESS
            else:
                print("❌ Instância do Jarvis não configurada")
                return ActionResult.FAILED
                
        except Exception as e:
            print(f"❌ Erro ao abrir webcam: {e}")
            return ActionResult.FAILED
    
    def validate_params(self, alvo: str = None, param: str = None, valor: str = None) -> bool:
        """Sem parâmetros necessários"""
        return True
