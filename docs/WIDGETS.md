# 💬 Widgets Flutuantes - Jarvis IA

## Visão Geral
O Jarvis agora possui **widgets flutuantes arrastáveis** que você pode mover pela tela! Esses widgets permitem interagir com o Jarvis de forma visual e conveniente.

## 🎯 Widgets Disponíveis

### 1. 💬 Chat Widget
Widget de chat para conversar com o Jarvis por texto, sem precisar usar comandos de voz.

**Recursos:**
- Interface de chat moderna e elegante
- Histórico de conversas em tempo real
- Envio de comandos por texto
- Totalmente arrastável (drag and drop)
- Suporte a todos os comandos do Jarvis
- Detecção automática de perguntas visuais

**Como abrir:**
- Por voz: "Abrir chat", "Abre nossa conversa", "Abre o chat"
- Por ação: `chat`

**Como usar:**
1. Diga "Abrir chat" ou equivalente
2. O widget aparecerá na tela
3. Arraste pela barra de título para mover
4. Digite seus comandos no campo de texto
5. Pressione Enter ou clique em "Enviar"
6. O Jarvis responderá no histórico

**Exemplo:**
```
Você: "Abrir chat"
Jarvis: *abre widget de chat*

[No chat]
Você: "toca uma música do Queen"
Jarvis: "Procurando Queen no Spotify..."
```

### 2. 📹 Webcam Widget
Widget de visualização da webcam em tempo real com análise de imagem integrada.

**Recursos:**
- Feed de vídeo ao vivo da webcam
- Controles de iniciar/parar câmera
- Botão de perguntar sobre o que vê
- Totalmente arrastável (drag and drop)
- Indicador de status da câmera
- Integração com IA de visão

**Como abrir:**
- Por voz: "Abrir webcam", "Abre a câmera", "Quero ver pela câmera"
- Por ação: `webcam`

**Como usar:**
1. Diga "Abrir webcam" ou equivalente
2. O widget aparecerá na tela
3. Clique em "▶ Iniciar Câmera"
4. Arraste pela barra de título para mover
5. Clique em "👁️ Perguntar" para análise visual
6. Clique em "⏸ Parar Câmera" para desligar

**Exemplo:**
```
Você: "Abrir webcam"
Jarvis: *abre widget de webcam*

[No widget]
Você: *clica em Iniciar Câmera*
Você: *posiciona objeto na frente*
Você: *clica em Perguntar*
Jarvis: "Vejo um mouse de computador preto sobre uma mesa..."
```

## 🎨 Características dos Widgets

### Design
- **Interface moderna**: Gradientes, bordas arredondadas, cores vibrantes
- **Tema escuro**: Confortável para os olhos
- **Responsivo**: Adapta-se ao conteúdo
- **Sem bordas**: Interface limpa e minimalista

### Interatividade
- **Drag and Drop**: Arraste pela barra de título
- **Sempre no topo**: Widgets ficam sobre outras janelas
- **Redimensionável**: Ajuste conforme necessário
- **Fechamento fácil**: Botão X na barra de título

### Integração
- **Sincronizado com Jarvis**: Todas as respostas são integradas
- **Histórico compartilhado**: Logs centralizados
- **Ações automáticas**: Comandos executados normalmente
- **Voz + Texto**: Use ambos os modos simultaneamente

## 📖 Comandos de Voz para Widgets

### Abrir Chat
- "Abrir chat"
- "Abre o chat"
- "Abre nossa conversa"
- "Quero conversar por texto"
- "Abrir janela de chat"

### Abrir Webcam
- "Abrir webcam"
- "Abre a câmera"
- "Abre a webcam"
- "Quero ver pela câmera"
- "Ativar câmera"

## 🔧 Integração com Sistema

### No código
```python
from core.jarvis import Jarvis

# Criar instância
jarvis = Jarvis()

# Abrir widgets programaticamente
jarvis.open_chat_widget()
jarvis.open_webcam_widget()
```

### Via ações
```python
# No sistema de ações
[ACTION]
chat        # Abre chat widget

[ACTION]
webcam      # Abre webcam widget
```

## 💡 Casos de Uso

### 1. Trabalho Silencioso
Use o chat widget quando não puder falar em voz alta:
```
Você: [no chat] "cria uma pasta chamada Documentos"
Jarvis: [executa e confirma no chat]
```

### 2. Análise Visual Contínua
Mantenha a webcam aberta para análises rápidas:
```
Você: [abre webcam]
Você: [posiciona diferentes objetos]
Você: [clica em Perguntar para cada um]
Jarvis: [analisa e descreve cada objeto]
```

### 3. Modo Híbrido
Use voz e texto simultaneamente:
```
Você: [voz] "abrir chat"
Você: [chat] "toca música relaxante"
Você: [voz] "abrir webcam"
Você: [webcam] *clica em Perguntar*
```

### 4. Multitarefa
Mantenha ambos os widgets abertos:
```
[Chat aberto à esquerda]
[Webcam aberta à direita]
[Terminal no centro]
= Controle total!
```

## 🎯 Teclas e Atalhos

### Chat Widget
- **Enter**: Enviar mensagem
- **Arrastar barra de título**: Mover widget
- **X**: Fechar widget

### Webcam Widget
- **Arrastar barra de título**: Mover widget
- **▶**: Iniciar câmera
- **⏸**: Parar câmera
- **👁️**: Fazer pergunta visual
- **X**: Fechar widget e desligar câmera

## 🔒 Privacidade e Segurança

### Webcam
- **Indicador visual**: Status da câmera sempre visível
- **Controle manual**: Você decide quando ligar/desligar
- **Sem gravação**: Nenhum vídeo é salvo automaticamente
- **Capturas temporárias**: Imagens para análise são temporárias

### Chat
- **Logs locais**: Conversas salvas apenas no seu PC
- **Sem envio externo**: Dados não saem do seu sistema
- **Histórico limpo**: Pode limpar a qualquer momento

## 🐛 Solução de Problemas

### Chat não abre
- Verifique se há erros no console
- Tente fechar e abrir novamente
- Reinicie o Jarvis

### Webcam não inicia
- **Primeiro**: Execute `python configure_camera.py` para verificar câmeras disponíveis
- Verifique se a câmera está conectada e funcionando
- Feche outros programas usando a câmera (Zoom, Teams, etc.)
- Verifique permissões da câmera no Windows (Configurações → Privacidade)
- Confirme o índice correto em `config/settings.py` → `camera_index`
- **Guia completo**: Ver [docs/TROUBLESHOOTING_CAMERA.md](TROUBLESHOOTING_CAMERA.md)

### Widget não se move
- Clique e arraste apenas na barra de título (parte colorida do topo)
- Não arraste pelo corpo do widget

### Resposta não aparece no chat
- Verifique conexão com o Ollama
- Veja mensagens de erro no console
- Tente enviar o comando novamente

## 📚 Exemplos Práticos

### Exemplo 1: Trabalho Silencioso
```
[Situação: Biblioteca, não pode falar]

Você: *inicia Jarvis normalmente*
Você: [sussurrando] "abrir chat"
Jarvis: *abre chat widget*

[No chat]
Você: "pesquisa sobre inteligência artificial"
Você: "cria uma pasta chamada Estudos"
Você: "tira um print da tela"
```

### Exemplo 2: Identificação de Objetos
```
[Situação: Quer identificar vários objetos]

Você: "abrir webcam"
Jarvis: *abre webcam widget*

Você: *clica Iniciar Câmera*
Você: *coloca caneca na frente*
Você: *clica Perguntar*
Jarvis: "Vejo uma caneca azul..."

Você: *troca por celular*
Você: *clica Perguntar*
Jarvis: "Vejo um smartphone..."
```

### Exemplo 3: Assistência Completa
```
[Situação: Trabalhando, quer assistência total]

Você: "abrir chat"
Você: "abrir webcam"
*ambos os widgets abertos*

[No chat]
Você: "toca música de fundo"

[Na webcam]
Você: *clica Iniciar Câmera*
*câmera monitora ambiente*

[Voz]
Você: "cria um arquivo importante.txt"

= Controle total via múltiplos canais!
```

## 🚀 Próximas Melhorias

- [ ] Widget de notas rápidas
- [ ] Widget de histórico de comandos
- [ ] Widget de configurações
- [ ] Temas personalizáveis
- [ ] Atalhos de teclado customizáveis
- [ ] Modo compacto para widgets
- [ ] Notificações no sistema
- [ ] Integração com clipboard

## 📝 Notas Importantes

1. **Performance**: Os widgets são leves e não afetam o desempenho
2. **Memória**: Webcam consome mais memória quando ativa
3. **Compatibilidade**: Funciona em Windows, Linux e Mac
4. **Qt Framework**: Usa PySide6 para interface moderna
5. **Thread-safe**: Widgets são thread-safe e estáveis
