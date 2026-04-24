# 📚 Jarvis IA - API Documentation

## Core Classes

### Jarvis

Classe principal do assistente virtual.

```python
from core import Jarvis

jarvis = Jarvis()
jarvis.start()  # Inicia o loop principal
jarvis.stop()   # Para a execução
```

### SpeechToText

Converte fala em texto.

```python
from core.audio import SpeechToText

stt = SpeechToText(microphone_index=3)
text = stt.listen()  # Escuta uma vez
text = stt.listen_continuously()  # Loop até capturar algo
```

### TextToSpeech

Converte texto em fala.

```python
from core.audio import TextToSpeech

tts = TextToSpeech()
tts.speak("Olá, mundo!")
tts.set_voice("pt-BR-FranciscaNeural")
```

### ConversationManager

Gerencia conversas com IA.

```python
from core.ai import ConversationManager

cm = ConversationManager()
response = cm.process_input("Como você está?")
# Returns: {"trigger": "CONVERSA", "text": "...", "speech": "...", "actions": []}
```

### ChatLogger

Sistema de logging de conversas.

```python
from core.logging import ChatLogger

logger = ChatLogger()
logger.log_user_message("Olá Jarvis")
logger.log_jarvis_message("Olá! Como posso ajudar?")
recent = logger.get_recent_conversations(10)
```

## Actions System

### BaseAction

Classe base para criar novas ações.

```python
from actions.base import BaseAction, ActionResult

class MyAction(BaseAction):
    def __init__(self):
        super().__init__("my_action", "Minha ação customizada")
    
    def execute(self, alvo=None, param=None, valor=None):
        # Implementar lógica
        return ActionResult.SUCCESS
```

### ActionManager

Gerencia e executa ações.

```python
from actions import get_action_manager

am = get_action_manager()
am.register_action("nova_acao", MinhaAction())
am.execute_single_action({"verbo": "nova_acao", "alvo": "teste"})
```

### ActionResult

Enum para resultados de ações.

```python
from actions.base import ActionResult

# Possíveis valores:
ActionResult.SUCCESS    # Sucesso
ActionResult.FAILED     # Falha
ActionResult.PARTIAL    # Sucesso parcial
ActionResult.SKIPPED    # Pulado
```

## Configuration

### Settings

Sistema de configuração centralizada.

```python
from config import SETTINGS, get_setting, set_setting

# Ler configuração
mic_index = get_setting("audio.microphone_index", default=1)

# Definir configuração
set_setting("audio.voice", "pt-BR-FranciscaNeural")

# Acessar caminho de app
spotify_path = get_app_path("spotify")
```

### Prompts

Sistema de prompts para IA.

```python
from config import get_prompt

# Prompt principal
main_prompt = get_prompt("main")

# Prompt específico
help_prompt = get_prompt("help")

# Prompt combinado
combined = get_combined_prompt("main", ["help", "context"])
```

## Built-in Actions

### Sistema

```python
# Abrir aplicativos
{"verbo": "abrir", "alvo": "spotify"}
{"verbo": "abrir", "alvo": "youtube", "param": "canal", "valor": "PewDiePie"}

# Fechar aplicativos
{"verbo": "fechar", "alvo": "notepad"}

# Screenshots
{"verbo": "print", "alvo": "tela"}

# Informações do sistema
{"verbo": "info", "alvo": "sistema"}
```

### Arquivos

```python
# Criar pastas
{"verbo": "criar", "alvo": "pasta", "param": "desktop", "valor": "MinhasPasta"}

# Deletar arquivos
{"verbo": "deletar", "alvo": "arquivo", "valor": "arquivo.txt"}

# Renomear
{"verbo": "renomear", "param": "nome_antigo.txt", "valor": "nome_novo.txt"}
```

### Mídia

```python
# Tocar música
{"verbo": "tocar", "alvo": "musica", "valor": "Imagine Dragons"}

# Pausar
{"verbo": "pausar"}

# Volume
{"verbo": "volume", "alvo": "aumentar", "valor": "5"}
{"verbo": "volume", "alvo": "mudo"}
```

### Limpeza

```python
# Limpar lixeira
{"verbo": "limpar", "alvo": "lixeira"}

# Limpar temporários
{"verbo": "limpar", "alvo": "temp"}
```

## Error Handling

### Exceções Customizadas

```python
class JarvisException(Exception):
    """Exceção base do Jarvis"""
    pass

class AudioException(JarvisException):
    """Erros relacionados ao áudio"""
    pass

class AIException(JarvisException):
    """Erros da IA"""
    pass
```

### Tratamento de Erros

```python
try:
    jarvis.start()
except AudioException as e:
    print(f"Erro de áudio: {e}")
except AIException as e:
    print(f"Erro da IA: {e}")
except JarvisException as e:
    print(f"Erro do Jarvis: {e}")
```

## Events and Hooks

### Hooks de Eventos

```python
def on_user_input(text):
    print(f"Usuário disse: {text}")

def on_action_executed(action, result):
    print(f"Ação {action} executada com resultado {result}")

# Registrar hooks
jarvis.register_hook("user_input", on_user_input)
jarvis.register_hook("action_executed", on_action_executed)
```

## Testing

### Testes de Unidade

```python
import unittest
from core.audio import SpeechToText

class TestSpeechToText(unittest.TestCase):
    def setUp(self):
        self.stt = SpeechToText()
    
    def test_microphone_list(self):
        # Test microphone listing
        self.stt.list_microphones()
```

### Testes de Integração

```python
from core import Jarvis

def test_full_conversation():
    jarvis = Jarvis()
    
    # Simular entrada
    response = jarvis.conversation.process_input("Olá")
    
    assert response["trigger"] == "CONVERSA"
    assert "text" in response
    assert "speech" in response
```

## Performance

### Profiling

```python
import cProfile
from core import Jarvis

def profile_jarvis():
    jarvis = Jarvis()
    # Executar operações para profile
    jarvis.conversation.process_input("teste")

cProfile.run('profile_jarvis()', 'jarvis_profile.prof')
```

### Otimizações

- Use cache para modelos de IA
- Otimize buffers de áudio
- Implemente throttling para ações
- Use threads para operações I/O

## Security

### Validação de Entrada

```python
def validate_action_input(action_data):
    """Valida dados de ação antes da execução"""
    required_fields = ["verbo"]
    
    for field in required_fields:
        if field not in action_data:
            raise ValueError(f"Campo obrigatório: {field}")
    
    return True
```

### Sandboxing

```python
# Limitar ações perigosas
DANGEROUS_ACTIONS = ["format", "shutdown", "delete_all"]

def is_action_safe(verb):
    return verb not in DANGEROUS_ACTIONS
```