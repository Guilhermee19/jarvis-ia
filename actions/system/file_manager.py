"""
Ações relacionadas ao gerenciamento de arquivos e pastas
"""
import os
import shutil
from typing import Optional
from ..base import BaseAction, ActionResult


class CreateFolderAction(BaseAction):
    """Cria pastas no sistema"""
    
    def __init__(self):
        super().__init__("criar_pasta", "Cria uma nova pasta no sistema")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Cria uma pasta
        
        Args:
            alvo: Tipo de localização (desktop, downloads, documentos)
            param: Localização específica (opcional)
            valor: Nome da pasta
        """
        try:
            if not valor:
                print("  ❌ Nome da pasta não especificado")
                return ActionResult.FAILED
            
            # Definir localizações base
            base_locations = {
                "desktop": os.path.join(os.path.expanduser("~"), "Desktop"),
                "downloads": os.path.join(os.path.expanduser("~"), "Downloads"),
                "documentos": os.path.join(os.path.expanduser("~"), "Documents"),
                "docs": os.path.join(os.path.expanduser("~"), "Documents"),
            }
            
            # Determinar caminho base
            if param and param.lower() in base_locations:
                base_path = base_locations[param.lower()]
            elif alvo and alvo.lower() in base_locations:
                base_path = base_locations[alvo.lower()]
            elif param:
                base_path = param  # Caminho customizado
            else:
                base_path = os.path.expanduser("~")  # Home directory
            
            # Criar caminho final
            final_path = os.path.join(base_path, valor)
            
            # Criar pasta
            os.makedirs(final_path, exist_ok=True)
            print(f"  📁 Pasta criada: {final_path}")
            
            return ActionResult.SUCCESS
            
        except Exception as e:
            print(f"  ❌ Erro ao criar pasta: {e}")
            return ActionResult.FAILED


class DeleteAction(BaseAction):
    """Deleta arquivos ou pastas"""
    
    def __init__(self):
        super().__init__("deletar", "Deleta arquivos ou pastas do sistema")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Deleta arquivo ou pasta
        
        Args:
            alvo: Tipo (arquivo, pasta)
            param: Localização
            valor: Nome do item
        """
        try:
            if not valor:
                print("  ❌ Nome do item não especificado")
                return ActionResult.FAILED
            
            # Determinar caminho
            if param:
                target_path = os.path.join(param, valor)
            else:
                target_path = valor
            
            if not os.path.exists(target_path):
                print(f"  ❌ Item não encontrado: {target_path}")
                return ActionResult.FAILED
            
            # Deletar
            if os.path.isdir(target_path):
                shutil.rmtree(target_path)
                print(f"  🗑️ Pasta deletada: {target_path}")
            else:
                os.remove(target_path)
                print(f"  🗑️ Arquivo deletado: {target_path}")
            
            return ActionResult.SUCCESS
            
        except Exception as e:
            print(f"  ❌ Erro ao deletar: {e}")
            return ActionResult.FAILED


class RenameAction(BaseAction):
    """Renomeia arquivos ou pastas"""
    
    def __init__(self):
        super().__init__("renomear", "Renomeia arquivos ou pastas")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Renomeia arquivo ou pasta
        
        Args:
            alvo: Tipo do item
            param: Nome atual
            valor: Novo nome
        """
        try:
            if not param or not valor:
                print("  ❌ Nome atual e novo nome devem ser especificados")
                return ActionResult.FAILED
            
            # Assumir Downloads como localização padrão se não especificado
            base_path = os.path.join(os.path.expanduser("~"), "Downloads")
            
            old_path = os.path.join(base_path, param)
            new_path = os.path.join(base_path, valor)
            
            if not os.path.exists(old_path):
                print(f"  ❌ Item não encontrado: {old_path}")
                return ActionResult.FAILED
            
            if os.path.exists(new_path):
                print(f"  ❌ Novo nome já existe: {new_path}")
                return ActionResult.FAILED
            
            # Renomear
            os.rename(old_path, new_path)
            print(f"  ✏️ Renomeado: {param} → {valor}")
            
            return ActionResult.SUCCESS
            
        except Exception as e:
            print(f"  ❌ Erro ao renomear: {e}")
            return ActionResult.FAILED