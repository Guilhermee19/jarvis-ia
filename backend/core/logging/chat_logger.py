"""
Sistema de logging de conversas
Registra todas as interações entre usuário e Jarvis
"""
import os
from datetime import datetime
from typing import Optional
from config.settings import SETTINGS


class ChatLogger:
    def __init__(self, log_file: str = None):
        """
        Inicializa o sistema de logging
        
        Args:
            log_file: Caminho do arquivo de log (opcional)
        """
        self.log_file = log_file or SETTINGS["logging"]["chat_log_file"]
        self.log_dir = SETTINGS["logging"]["log_directory"]
        self._ensure_log_directory()
    
    def _ensure_log_directory(self):
        """Garante que o diretório de logs existe"""
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)
    
    def _get_timestamp(self) -> str:
        """
        Gera timestamp para o log
        
        Returns:
            Timestamp formatado
        """
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def _write_log(self, sender: str, message: str) -> None:
        """
        Escreve mensagem no arquivo de log
        
        Args:
            sender: Remetente da mensagem
            message: Conteúdo da mensagem
        """
        try:
            log_path = os.path.join(self.log_dir, self.log_file)
            timestamp = self._get_timestamp()
            
            with open(log_path, "a", encoding="utf-8") as file:
                file.write(f"[{timestamp}] [{sender.upper()}]: {message}\n")
                
        except Exception as e:
            print(f"❌ Erro ao escrever log: {e}")
    
    def log_user_message(self, message: str) -> None:
        """
        Registra mensagem do usuário
        
        Args:
            message: Mensagem do usuário
        """
        if message and message.strip():
            self._write_log("USER", message.strip())
    
    def log_jarvis_message(self, message: str) -> None:
        """
        Registra mensagem do Jarvis
        
        Args:
            message: Resposta do Jarvis
        """
        if message and message.strip():
            self._write_log("JARVIS", message.strip())
    
    def log_system_message(self, message: str) -> None:
        """
        Registra mensagem do sistema
        
        Args:
            message: Mensagem do sistema
        """
        if message and message.strip():
            self._write_log("SYSTEM", message.strip())
    
    def log_error(self, error: str, context: str = "") -> None:
        """
        Registra erro no sistema
        
        Args:
            error: Descrição do erro
            context: Contexto onde ocorreu o erro
        """
        error_msg = f"ERROR: {error}"
        if context:
            error_msg += f" (Context: {context})"
        
        self._write_log("SYSTEM", error_msg)
    
    def get_recent_conversations(self, lines: int = 50) -> list:
        """
        Recupera conversas recentes
        
        Args:
            lines: Número de linhas a recuperar
            
        Returns:
            Lista com as últimas conversas
        """
        try:
            log_path = os.path.join(self.log_dir, self.log_file)
            
            if not os.path.exists(log_path):
                return []
            
            with open(log_path, "r", encoding="utf-8") as file:
                all_lines = file.readlines()
                return all_lines[-lines:] if len(all_lines) > lines else all_lines
                
        except Exception as e:
            print(f"❌ Erro ao ler log: {e}")
            return []
    
    def clear_logs(self) -> None:
        """Limpa todos os logs"""
        try:
            log_path = os.path.join(self.log_dir, self.log_file)
            
            if os.path.exists(log_path):
                with open(log_path, "w", encoding="utf-8") as file:
                    file.write("")
                print("🗑️ Logs limpos com sucesso!")
            
        except Exception as e:
            print(f"❌ Erro ao limpar logs: {e}")