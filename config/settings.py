"""
Configurações centralizadas do Jarvis IA
Todas as configurações do sistema em um local
"""
import os
from typing import Dict, Any

# Configurações principais do sistema
SETTINGS: Dict[str, Any] = {
    # Configurações de áudio
    "audio": {
        "microphone_index": 3,  # Índice do microfone padrão
        "language": "pt-BR",    # Idioma para reconhecimento
        "voice": "pt-BR-AntonioNeural",  # Voz para síntese
        "volume_steps": 5,      # Passos para controle de volume
    },
    
    # Configurações de IA
    "ai": {
        "model": "llama3",      # Modelo padrão do Ollama
        "max_conversation_history": 20,  # Máx mensagens no histórico
        "timeout": 30,          # Timeout para requests (segundos)
    },
    
    # Configurações de logging
    "logging": {
        "chat_log_file": "chat_log.txt",
        "log_directory": "logs",
        "max_log_size": 10 * 1024 * 1024,  # 10MB
        "backup_count": 5,
    },
    
    # Configurações do sistema
    "system": {
        "screenshots_dir": os.path.join(os.path.expanduser("~"), "Pictures", "Screenshots"),
        "temp_cleanup_limit": 100,  # Máximo de arquivos temporários a limpar
        "auto_create_dirs": True,   # Criar diretórios automaticamente
    },
    
    # Configurações de interface
    "ui": {
        "show_timestamps": True,
        "show_debug_info": True,
        "console_width": 80,
    },
    
    # Configurações de segurança
    "security": {
        "allow_system_shutdown": False,
        "allow_file_deletion": True,
        "require_confirmation": ["shutdown", "delete_all", "format"],
    },
    
    # Caminhos de aplicativos
    "apps": {
        "spotify": r"C:\Users\%USERNAME%\AppData\Roaming\Spotify\Spotify.exe",
        "notepad": "notepad.exe",
        "calculator": "calc.exe",
        "paint": "mspaint.exe",
        "browser": "default",  # Usar navegador padrão
    },
    
    # Configurações de desenvolvimento
    "dev": {
        "debug_mode": False,
        "verbose_logging": False,
        "test_mode": False,
    }
}

# Configurações de ambiente (podem ser sobrescritas por variáveis de ambiente)
ENV_OVERRIDES = {
    "JARVIS_MICROPHONE_INDEX": ("audio", "microphone_index", int),
    "JARVIS_AI_MODEL": ("ai", "model", str),
    "JARVIS_DEBUG": ("dev", "debug_mode", bool),
    "JARVIS_LOG_DIR": ("logging", "log_directory", str),
}


def load_env_overrides():
    """Carrega sobrescrições das variáveis de ambiente"""
    for env_var, (section, key, type_func) in ENV_OVERRIDES.items():
        env_value = os.environ.get(env_var)
        if env_value:
            try:
                if type_func == bool:
                    # Converter string para boolean
                    value = env_value.lower() in ('true', '1', 'yes', 'on')
                else:
                    value = type_func(env_value)
                
                SETTINGS[section][key] = value
                print(f"⚙️ Configuração sobrescrita: {section}.{key} = {value}")
                
            except (ValueError, TypeError) as e:
                print(f"⚠️ Erro ao converter variável de ambiente {env_var}: {e}")


def get_setting(path: str, default=None):
    """
    Obtém uma configuração usando notação de ponto
    
    Args:
        path: Caminho da configuração (ex: "audio.microphone_index")
        default: Valor padrão se não encontrado
        
    Returns:
        Valor da configuração
    """
    try:
        keys = path.split('.')
        value = SETTINGS
        
        for key in keys:
            value = value[key]
        
        return value
    except (KeyError, TypeError):
        return default


def set_setting(path: str, value):
    """
    Define uma configuração usando notação de ponto
    
    Args:
        path: Caminho da configuração (ex: "audio.microphone_index")
        value: Novo valor
    """
    try:
        keys = path.split('.')
        setting = SETTINGS
        
        # Navegar até o penúltimo nível
        for key in keys[:-1]:
            if key not in setting:
                setting[key] = {}
            setting = setting[key]
        
        # Definir valor final
        setting[keys[-1]] = value
        print(f"⚙️ Configuração atualizada: {path} = {value}")
        
    except Exception as e:
        print(f"❌ Erro ao definir configuração {path}: {e}")


def get_app_path(app_name: str) -> str:
    """
    Obtém caminho de um aplicativo
    
    Args:
        app_name: Nome do aplicativo
        
    Returns:
        Caminho do aplicativo
    """
    app_path = get_setting(f"apps.{app_name}")
    if app_path:
        return os.path.expandvars(app_path)
    return app_name  # Retorna o nome se não encontrar caminho específico


def is_debug_mode() -> bool:
    """Verifica se está em modo debug"""
    return get_setting("dev.debug_mode", False)


def get_microphone_index() -> int:
    """Obtém índice do microfone configurado"""
    return get_setting("audio.microphone_index", 1)


def get_ai_model() -> str:
    """Obtém modelo de IA configurado"""
    return get_setting("ai.model", "llama3")


# Carregar sobrescrições do ambiente ao importar
load_env_overrides()