"""
Sistema base de ações do Jarvis
Define interfaces e comportamentos comuns para todas as ações
"""
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from enum import Enum


class ActionResult(Enum):
    """Resultados possíveis de uma ação"""
    SUCCESS = "success"
    FAILED = "failed"
    PARTIAL = "partial"
    SKIPPED = "skipped"


class BaseAction(ABC):
    """
    Classe base para todas as ações do Jarvis
    """
    
    def __init__(self, name: str, description: str):
        """
        Inicializa a ação
        
        Args:
            name: Nome da ação
            description: Descrição do que a ação faz
        """
        self.name = name
        self.description = description
    
    @abstractmethod
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Executa a ação
        
        Args:
            alvo: Alvo da ação
            param: Parâmetro adicional
            valor: Valor específico
            
        Returns:
            Resultado da execução
        """
        pass
    
    def validate_params(self, alvo: str = None, param: str = None, valor: str = None) -> bool:
        """
        Valida parâmetros antes da execução
        
        Args:
            alvo: Alvo da ação
            param: Parâmetro adicional
            valor: Valor específico
            
        Returns:
            True se parâmetros são válidos
        """
        return True
    
    def get_info(self) -> Dict[str, Any]:
        """
        Retorna informações sobre a ação
        
        Returns:
            Dicionário com informações da ação
        """
        return {
            "name": self.name,
            "description": self.description,
            "class": self.__class__.__name__
        }
    
    def __str__(self) -> str:
        return f"{self.name}: {self.description}"


class ActionManager:
    """
    Gerenciador central de ações
    Registra e executa ações do sistema
    """
    
    def __init__(self):
        """Inicializa o gerenciador de ações"""
        self.actions = {}
        self._register_default_actions()
    
    def register_action(self, verb: str, action: BaseAction) -> None:
        """
        Registra uma nova ação
        
        Args:
            verb: Verbo que ativa a ação
            action: Instância da ação
        """
        self.actions[verb.lower()] = action
    
    def execute_actions(self, action_list: list) -> None:
        """
        Executa uma lista de ações
        
        Args:
            action_list: Lista de ações para executar
        """
        if not action_list:
            return
        
        for action_data in action_list:
            self.execute_single_action(action_data)
    
    def execute_single_action(self, action_data: dict) -> ActionResult:
        """
        Executa uma única ação
        
        Args:
            action_data: Dados da ação (verbo, alvo, param, valor)
            
        Returns:
            Resultado da execução
        """
        verb = action_data.get("verbo", "").lower()
        alvo = action_data.get("alvo")
        param = action_data.get("param")
        valor = action_data.get("valor")
        
        print(f"  ▶ Executando: {verb} | {alvo} | {param} | {valor}")
        
        if verb not in self.actions:
            print(f"  ⚠️ Verbo desconhecido: '{verb}'")
            return ActionResult.FAILED
        
        action = self.actions[verb]
        
        try:
            # Validar parâmetros
            if not action.validate_params(alvo, param, valor):
                print(f"  ❌ Parâmetros inválidos para ação '{verb}'")
                return ActionResult.FAILED
            
            # Executar ação
            result = action.execute(alvo, param, valor)
            
            # Log do resultado
            if result == ActionResult.SUCCESS:
                print(f"  ✅ Ação '{verb}' executada com sucesso")
            elif result == ActionResult.FAILED:
                print(f"  ❌ Falha ao executar ação '{verb}'")
            elif result == ActionResult.PARTIAL:
                print(f"  ⚠️ Ação '{verb}' executada parcialmente")
            
            return result
            
        except Exception as e:
            print(f"  ❌ Erro ao executar ação '{verb}': {e}")
            return ActionResult.FAILED
    
    def list_actions(self) -> Dict[str, BaseAction]:
        """
        Lista todas as ações registradas
        
        Returns:
            Dicionário com todas as ações
        """
        return self.actions.copy()
    
    def get_action_info(self, verb: str) -> Optional[Dict[str, Any]]:
        """
        Obtém informações sobre uma ação específica
        
        Args:
            verb: Verbo da ação
            
        Returns:
            Informações da ação ou None se não encontrada
        """
        action = self.actions.get(verb.lower())
        return action.get_info() if action else None
    
    def _register_default_actions(self) -> None:
        """Registra ações padrão do sistema"""
        # As ações específicas serão registradas pelos módulos específicos
        pass