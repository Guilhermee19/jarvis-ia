# 🚀 Guia Rápido - Widgets Flutuantes

## Instalação
Os widgets já estão incluídos! Nenhuma instalação adicional necessária (além das dependências básicas do Jarvis).

## Teste Rápido (Demonstração)
```bash
python demo_widgets.py
```

Isso abrirá ambos os widgets para você explorar sem executar o Jarvis completo.

## Uso no Jarvis

### 1️⃣ Abrir Chat Widget
```
Você: "Abrir chat"
```
ou
```
Você: "Abre nossa conversa"
```

**O que acontece:**
- Widget de chat aparece na tela
- Você pode arrastar pela barra roxa
- Digite comandos no campo de texto
- Histórico de conversa é exibido
- Funciona junto com comandos de voz

### 2️⃣ Abrir Webcam Widget
```
Você: "Abrir webcam"
```
ou
```
Você: "Abre a câmera"
```

**O que acontece:**
- Widget de webcam aparece na tela
- Clique em "Iniciar Câmera" para ligar
- Arraste pela barra rosa
- Feed ao vivo da webcam é exibido
- Clique em "Perguntar" para análise visual

## Fluxo de Uso Típico

### Cenário 1: Trabalho Silencioso
```
1. Inicie o Jarvis: python main.py
2. Diga (sussurrando): "abrir chat"
3. Use o chat para todos os comandos
4. Sem precisar falar alto!
```

### Cenário 2: Análise Visual Contínua
```
1. Diga: "abrir webcam"
2. Clique em "Iniciar Câmera"
3. Posicione objetos na frente da câmera
4. Clique em "Perguntar" para cada objeto
5. Jarvis descreve o que vê
```

### Cenário 3: Modo Híbrido
```
1. Diga: "abrir chat"
2. Diga: "abrir webcam"
3. Use voz para alguns comandos
4. Use chat para outros
5. Use webcam para análise visual
= Controle total!
```

## Comandos no Chat Widget

Você pode usar QUALQUER comando do Jarvis no chat, por exemplo:

```
toca uma música do Queen
cria uma pasta chamada Projetos
abrir Spotify
o que você vê? (com webcam aberta)
tira um print da tela
volume aumentar
```

## Recursos Especiais

### Drag and Drop
- Clique e segure na **barra de título colorida**
- Arraste para qualquer posição
- Solte para fixar

### Integração com Visão
- Se webcam estiver aberta
- E você perguntar "o que você vê?" no chat
- Jarvis usará o feed da webcam automaticamente!

### Histórico no Chat
- Todas as mensagens são salvas
- Scroll para ver histórico
- Formatação colorida para clareza

### Controles da Webcam
- **▶ Iniciar**: Liga a câmera
- **⏸ Parar**: Desliga a câmera
- **👁️ Perguntar**: Analisa o que vê
- **X**: Fecha e desliga

## Atalhos e Dicas

### Chat
- `Enter` para enviar mensagem
- Clique na barra roxa para arrastar
- `X` para fechar

### Webcam
- Controle manual de liga/desliga
- Indicador de status (● verde/vermelho)
- Feed em tempo real (~30 FPS)

## Solução Rápida de Problemas

### Chat não responde
```
1. Verifique se Ollama está rodando
2. Veja o terminal para mensagens de erro
3. Tente reenviar a mensagem
```

### Webcam não inicia
```
1. Feche outros programas usando a câmera
2. Verifique se a câmera está conectada
3. Reinicie o widget (feche e abra novamente)
```

### Widget não move
```
1. Arraste apenas pela BARRA DE TÍTULO (parte colorida)
2. Não arraste pelo corpo do widget
```

## Exemplos Práticos

### Exemplo 1: Chat Rápido
```bash
# Inicie o Jarvis
python main.py

# No Jarvis
Você: "abrir chat"

# No Chat Widget
Você: "toca música relaxante"
Você: "cria pasta Downloads/Importante"
Você: "info do sistema"
```

### Exemplo 2: Identificação Visual
```bash
# Inicie o Jarvis
python main.py

# No Jarvis
Você: "abrir webcam"

# No Webcam Widget
1. Clique "Iniciar Câmera"
2. Posicione objeto
3. Clique "Perguntar"
4. Jarvis descreve!
```

### Exemplo 3: Multitarefa
```bash
# Abra ambos
Você: "abrir chat"
Você: "abrir webcam"

# Posicione lado a lado
[Chat à esquerda] [Webcam à direita]

# Use ambos simultaneamente!
Chat: "toca música"
Webcam: *Iniciar Câmera*
Webcam: *Perguntar*
Chat: [resposta aparece aqui também]
```

## Próximos Passos

1. **Teste a demonstração**: `python demo_widgets.py`
2. **Leia a documentação completa**: [docs/WIDGETS.md](docs/WIDGETS.md)
3. **Experimente no Jarvis real**: `python main.py`

## Feedback e Sugestões

Encontrou algum problema? Tem sugestões?
- Veja os logs no terminal
- Consulte a documentação completa
- Execute os testes: `python tests/test_widgets.py`

---

💡 **Dica Final**: Os widgets são totalmente independentes. Você pode:
- Usar só o chat
- Usar só a webcam
- Usar ambos
- Não usar nenhum e só usar voz!

A escolha é sua! 🚀
