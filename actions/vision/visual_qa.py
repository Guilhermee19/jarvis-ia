"""
Ação de perguntas visuais usando webcam
Permite fazer perguntas sobre o que a câmera está vendo
"""
import cv2
import os
import base64
from datetime import datetime
from actions.base import BaseAction, ActionResult


class VisualQuestionAction(BaseAction):
    """
    Ação para responder perguntas visuais usando a webcam
    """
    
    def __init__(self):
        super().__init__(
            name="ver",
            description="Captura imagem da webcam para responder perguntas visuais"
        )
        self.camera = None
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Captura imagem da webcam
        
        Args:
            alvo: Não usado nesta ação
            param: Não usado nesta ação
            valor: Não usado nesta ação
            
        Returns:
            ActionResult.SUCCESS ou ActionResult.FAILED
        """
        try:
            print("📸 Capturando imagem da webcam...")
            
            # Capturar imagem
            image_path = self._capture_image()
            
            if not image_path:
                print("❌ Falha ao capturar imagem")
                return ActionResult.FAILED
            
            print(f"✅ Imagem capturada: {image_path}")
            return ActionResult.SUCCESS
            
        except Exception as e:
            print(f"❌ Erro ao capturar imagem: {e}")
            return ActionResult.FAILED
    
    def _capture_image(self) -> str:
        """
        Captura imagem da webcam e salva em arquivo
        
        Returns:
            Caminho do arquivo da imagem ou None se falhar
        """
        try:
            # Abrir webcam
            cap = cv2.VideoCapture(0)
            
            if not cap.isOpened():
                print("❌ Não foi possível abrir a webcam")
                return None
            
            # Ler frame
            ret, frame = cap.read()
            
            # Liberar webcam
            cap.release()
            
            if not ret:
                print("❌ Não foi possível capturar frame")
                return None
            
            # Criar diretório se não existir
            screenshots_dir = os.path.join(os.path.expanduser("~"), "Pictures", "Jarvis_Vision")
            os.makedirs(screenshots_dir, exist_ok=True)
            
            # Salvar imagem com timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            image_path = os.path.join(screenshots_dir, f"vision_{timestamp}.jpg")
            
            cv2.imwrite(image_path, frame)
            
            return image_path
            
        except Exception as e:
            print(f"❌ Erro ao capturar imagem: {e}")
            return None
    
    def capture_for_analysis(self) -> str:
        """
        Captura imagem e retorna em base64 para envio à IA
        
        Returns:
            String base64 da imagem ou None se falhar
        """
        try:
            # Abrir webcam
            cap = cv2.VideoCapture(0)
            
            if not cap.isOpened():
                return None
            
            # Ler frame
            ret, frame = cap.read()
            
            # Liberar webcam
            cap.release()
            
            if not ret:
                return None
            
            # Converter para JPEG em memória
            _, buffer = cv2.imencode('.jpg', frame)
            
            # Converter para base64
            image_base64 = base64.b64encode(buffer).decode('utf-8')
            
            return image_base64
            
        except Exception as e:
            print(f"❌ Erro ao capturar imagem para análise: {e}")
            return None
    
    def validate_params(self, alvo: str = None, param: str = None, valor: str = None) -> bool:
        """
        Valida parâmetros (nenhum necessário para esta ação)
        
        Returns:
            True sempre
        """
        return True
