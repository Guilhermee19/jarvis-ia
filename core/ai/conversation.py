"""
Gerenciador de conversas com IA
Processa entradas do usuário e gera respostas estruturadas
"""
import ollama
import re
from typing import Dict, List, Any
from config.settings import SETTINGS
from config.prompts import SYSTEM_PROMPT


class ConversationManager:
    def __init__(self, model: str = None):
        """
        Inicializa o gerenciador de conversas
        
        Args:
            model: Modelo de IA a ser usado
        """
        self.model = model or SETTINGS["ai"]["model"]
        self.conversation_history = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        self.max_history = SETTINGS["ai"]["max_conversation_history"]
    
    def process_input(self, user_input: str) -> Dict[str, Any]:
        """
        Processa entrada do usuário e retorna resposta estruturada
        
        Args:
            user_input: Entrada do usuário
            
        Returns:
            Dicionário com resposta estruturada
        """
        try:
            # Adicionar input do usuário ao histórico
            self._add_to_history("user", user_input)
            
            # Gerar resposta
            response = self._generate_response()
            
            # Adicionar resposta ao histórico
            self._add_to_history("assistant", response)
            
            # Parsear e estruturar resposta
            structured_response = self._parse_response(response)
            
            return structured_response
            
        except Exception as e:
            print(f"❌ Erro ao processar entrada: {e}")
            return self._create_error_response(str(e))
    
    def _generate_response(self) -> str:
        """
        Gera resposta usando o modelo de IA
        
        Returns:
            Resposta bruta do modelo
        """
        try:
            response = ollama.chat(
                model=self.model,
                messages=self.conversation_history
            )
            return response["message"]["content"]
            
        except Exception as e:
            raise Exception(f"Erro na comunicação com IA: {e}")
    
    def _add_to_history(self, role: str, content: str) -> None:
        """
        Adiciona mensagem ao histórico de conversas
        
        Args:
            role: Papel (user, assistant, system)
            content: Conteúdo da mensagem
        """
        self.conversation_history.append({
            "role": role,
            "content": content
        })
        
        # Manter apenas as últimas N mensagens (preservando system prompt)
        if len(self.conversation_history) > self.max_history:
            # Manter system prompt + últimas mensagens
            system_prompt = self.conversation_history[0]
            recent_messages = self.conversation_history[-(self.max_history-1):]
            self.conversation_history = [system_prompt] + recent_messages
    
    def _parse_response(self, raw_text: str) -> Dict[str, Any]:
        """
        Parseia resposta bruta em estrutura organizada
        
        Args:
            raw_text: Texto bruto da resposta
            
        Returns:
            Resposta estruturada
        """
        result = {
            "trigger": None,
            "text": None,
            "speech": None,
            "actions": []
        }
        
        # Regex patterns para extrair seções
        patterns = {
            "trigger": r'\[TRIGGER\]\s*(.*?)\s*\[TEXT\]',
            "text": r'\[TEXT\]\s*(.*?)\s*\[SPEECH\]',
            "speech": r'\[SPEECH\]\s*(.*?)(?:\[ACTION\]|$)',
            "action": r'\[ACTION\]\s*(.*?)$'
        }
        
        # Extrair seções
        for key, pattern in patterns.items():
            match = re.search(pattern, raw_text, re.DOTALL)
            if match:
                if key == "action":
                    result["actions"] = self._parse_actions(match.group(1))
                else:
                    result[key] = match.group(1).strip()
        
        return result
    
    def _parse_actions(self, action_text: str) -> List[Dict[str, str]]:
        """
        Parseia texto de ações em lista estruturada
        
        Args:
            action_text: Texto bruto das ações
            
        Returns:
            Lista de ações estruturadas
        """
        actions = []
        
        for line in action_text.strip().splitlines():
            line = line.strip()
            if not line:
                continue
                
            parts = [part.strip() for part in line.split("|")]
            
            action = {
                "verbo": parts[0] if len(parts) > 0 else None,
                "alvo": parts[1] if len(parts) > 1 else None,
                "param": parts[2] if len(parts) > 2 else None,
                "valor": parts[3] if len(parts) > 3 else None,
            }
            
            actions.append(action)
        
        return actions
    
    def _create_error_response(self, error_msg: str) -> Dict[str, Any]:
        """
        Cria resposta de erro padrão
        
        Args:
            error_msg: Mensagem de erro
            
        Returns:
            Resposta de erro estruturada
        """
        return {
            "trigger": "ERROR",
            "text": f"Desculpe, houve um erro: {error_msg}",
            "speech": "Desculpe, não consegui processar sua solicitação no momento.",
            "actions": []
        }
    
    def clear_history(self) -> None:
        """Limpa histórico de conversas mantendo apenas o system prompt"""
        system_prompt = self.conversation_history[0]
        self.conversation_history = [system_prompt]
        print("🗑️ Histórico de conversas limpo!")
    
    def get_conversation_summary(self) -> str:
        """
        Retorna resumo da conversa atual
        
        Returns:
            Resumo da conversa
        """
        user_msgs = [msg["content"] for msg in self.conversation_history if msg["role"] == "user"]
        return f"Conversa com {len(user_msgs)} mensagens do usuário"