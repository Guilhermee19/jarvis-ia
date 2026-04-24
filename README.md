# 🤖 Jarvis IA - Assistente Virtual

Um assistente virtual inteligente em Python que utiliza reconhecimento de voz, processamento de linguagem natural e automação do sistema para ajudar com tarefas do dia a dia.

## 📋 Características

- **🎙️ Reconhecimento de Voz**: Converte fala em texto usando Google Speech Recognition
- **🔊 Síntese de Voz**: Responde com voz natural usando Edge TTS
- **🧠 IA Integrada**: Processamento de linguagem natural com Ollama/LLaMA
- **⚡ Automação**: Controla aplicativos, gerencia arquivos e executa comandos do sistema
- **📝 Logging**: Registra todas as conversas e interações
- **🎛️ Configurável**: Sistema de configuração centralizada
- **🔧 Extensível**: Arquitetura modular para adicionar novas funcionalidades

## 🏗️ Estrutura do Projeto

```
jarvis_ia/
├── main.py                     # Ponto de entrada principal
├── requirements.txt            # Dependências do projeto
├── README.md                   # Este arquivo
├── 
├── config/                     # Configurações
│   ├── __init__.py
│   ├── settings.py            # Configurações centralizadas
│   └── prompts.py            # Prompts para IA
├── 
├── core/                      # Funcionalidades principais
│   ├── __init__.py
│   ├── jarvis.py             # Classe principal
│   ├── audio/                # Módulos de áudio
│   │   ├── __init__.py
│   │   ├── speech_to_text.py # Reconhecimento de voz
│   │   └── text_to_speech.py # Síntese de voz
│   ├── ai/                   # Módulos de IA
│   │   ├── __init__.py
│   │   └── conversation.py   # Gerenciamento de conversas
│   └── logging/              # Sistema de logs
│       ├── __init__.py
│       └── chat_logger.py    # Logger de conversas
├── 
├── actions/                   # Sistema de ações
│   ├── __init__.py
│   ├── base.py               # Classes base para ações
│   ├── system/               # Ações do sistema
│   │   ├── __init__.py
│   │   ├── app_launcher.py   # Abrir/fechar apps
│   │   ├── file_manager.py   # Gerenciar arquivos
│   │   └── system_utils.py   # Utilitários do sistema
│   ├── media/                # Ações de mídia
│   │   ├── __init__.py
│   │   └── media_control.py  # Controle de áudio/vídeo
│   └── web/                  # Ações web (futuro)
│       └── __init__.py
├── 
├── utils/                     # Utilitários gerais
│   └── __init__.py
├── 
├── tests/                     # Testes (futuro)
│   └── __init__.py
├── 
├── docs/                      # Documentação adicional
└── logs/                      # Arquivos de log gerados
```

## 🚀 Instalação

### Pré-requisitos

- Python 3.8 ou superior
- Microfone configurado no sistema
- Conexão com internet (para APIs de voz)
- [Ollama](https://ollama.ai/) instalado com modelo LLaMA

### Passos de Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/jarvis_ia.git
cd jarvis_ia
```

2. **Crie um ambiente virtual:**
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou
.venv\\Scripts\\activate   # Windows
```

3. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

4. **Configure o Ollama:**
```bash
ollama pull llama3
```

5. **Configure o microfone:**
```bash
python -c "from core.audio.speech_to_text import SpeechToText; SpeechToText().list_microphones()"
```
Anote o índice do seu microfone e ajuste em `config/settings.py`.

## 🎯 Uso

### Execução Básica

```bash
python main.py
```

O Jarvis iniciará e ficará ouvindo comandos de voz. Pressione **ESC** para encerrar.

### Comandos Disponíveis

#### 🖥️ Sistema
- "Abrir Spotify" - Abre o aplicativo Spotify
- "Abrir YouTube" - Abre o YouTube no navegador
- "Fechar Notepad" - Fecha o aplicativo especificado
- "Tirar print da tela" - Captura screenshot

#### 📁 Arquivos
- "Criar pasta MinhaPasta na área de trabalho" - Cria nova pasta
- "Renomear arquivo.txt para novo_nome.txt" - Renomeia arquivo
- "Deletar arquivo antigo.txt" - Remove arquivo/pasta

#### 🎵 Mídia
- "Tocar música Imagine Dragons" - Busca música no Spotify
- "Pausar música" - Pausa reprodução atual
- "Aumentar volume" - Aumenta volume do sistema
- "Silenciar" - Ativa/desativa mudo

#### 🧹 Manutenção
- "Limpar lixeira" - Abre lixeira para limpeza
- "Informações do sistema" - Mostra info do computador

### Exemplos de Conversas

```
Usuário: "Olá Jarvis, como você está?"
Jarvis: "Olá! Estou funcionando perfeitamente e pronto para ajudar!"

Usuário: "Abra o Spotify e toque Bohemian Rhapsody"
Jarvis: "Abrindo Spotify e buscando Bohemian Rhapsody para você!"

Usuário: "Crie uma pasta chamada Projetos na área de trabalho"
Jarvis: "Pasta 'Projetos' criada na área de trabalho com sucesso!"
```

## ⚙️ Configuração

### Configurações Principais

Edite `config/settings.py` para personalizar:

```python
SETTINGS = {
    "audio": {
        "microphone_index": 3,  # Seu microfone
        "language": "pt-BR",
        "voice": "pt-BR-AntonioNeural",
    },
    "ai": {
        "model": "llama3",
        "max_conversation_history": 20,
    },
    # ... outras configurações
}
```

### Variáveis de Ambiente

```bash
export JARVIS_MICROPHONE_INDEX=3
export JARVIS_AI_MODEL=llama3
export JARVIS_DEBUG=true
```

## 🔧 Desenvolvimento

### Adicionando Novas Ações

1. Crie uma nova classe herdando de `BaseAction`:

```python
from actions.base import BaseAction, ActionResult

class MinhaNovaAction(BaseAction):
    def __init__(self):
        super().__init__("minha_acao", "Descrição da minha ação")
    
    def execute(self, alvo=None, param=None, valor=None):
        # Implementar lógica aqui
        return ActionResult.SUCCESS
```

2. Registre a ação em `actions/__init__.py`:

```python
action_manager.register_action("minha_acao", MinhaNovaAction())
```

### Executando Testes

```bash
python -m pytest tests/
```

### Logs e Debug

- Logs de conversa: `logs/chat_log.txt`
- Debug mode: Defina `JARVIS_DEBUG=true`
- Logs verbosos: Configure em `settings.py`

## 📦 Dependências Principais

- **edge-tts**: Síntese de voz
- **SpeechRecognition**: Reconhecimento de voz
- **ollama**: Interface com IA
- **pygame**: Reprodução de áudio
- **pyautogui**: Automação de interface
- **keyboard**: Captura de hotkeys

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja `LICENSE` para mais detalhes.

## 🆘 Suporte

### Problemas Comuns

**Microfone não detectado:**
- Verifique se o microfone está conectado e configurado
- Execute o comando de listagem de microfones
- Ajuste o `microphone_index` nas configurações

**Ollama não responde:**
- Verifique se o Ollama está rodando: `ollama serve`
- Confirme se o modelo está instalado: `ollama list`

**Erro de permissões:**
- Execute como administrador no Windows
- Verifique permissões de microfone no sistema

### Contato

- 📧 Email: seu-email@exemplo.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/jarvis_ia/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/seu-usuario/jarvis_ia/discussions)

---

**Feito com ❤️ em Python**