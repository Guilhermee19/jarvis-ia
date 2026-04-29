# 👁️ Recurso de Visão - Jarvis IA

## Visão Geral
O Jarvis agora possui capacidade de **análise visual** usando a webcam! Você pode fazer perguntas sobre o que a câmera está vendo e a IA responderá com base na imagem capturada.

## Como Usar

### Instalação
Primeiro, instale as novas dependências:
```bash
pip install -r requirements.txt
```

### Modelo de IA com Visão
O recurso usa o modelo **llama3.2-vision** do Ollama. Instale-o com:
```bash
ollama pull llama3.2-vision
```

Alternativamente, você pode usar o modelo **llava**:
```bash
ollama pull llava
```

Para usar o llava, edite `config/settings.py` e altere:
```python
"vision_model": "llava"
```

### Comandos de Visão

Faça perguntas naturais como:
- **"O que é isso?"**
- **"O que você vê?"**
- **"O que está vendo?"**
- **"Me mostre o que aparece"**
- **"Analisa isso"**
- **"Identifica isso"**
- **"Descreve o que vê"**
- **"Qual é esse objeto?"**

### Como Funciona

1. **Detecção automática**: Quando você faz uma pergunta visual, o sistema detecta automaticamente
2. **Captura da webcam**: A webcam é ativada e captura uma imagem
3. **Análise**: A imagem é enviada para o modelo de IA com visão
4. **Resposta**: A IA descreve o que vê na imagem

### Exemplos de Uso

**Exemplo 1: Identificar objeto**
```
Você: "O que é isso?"
Jarvis: *captura webcam* "Estou vendo uma caneca azul sobre uma mesa de madeira..."
```

**Exemplo 2: Descrever cena**
```
Você: "Descreve o que você vê"
Jarvis: *captura webcam* "Vejo um ambiente de escritório com um monitor, teclado..."
```

**Exemplo 3: Identificar texto**
```
Você: "O que está escrito aqui?"
Jarvis: *captura webcam* "O texto diz: 'Bem-vindo ao Jarvis IA'..."
```

## Configurações

### Ajustar modelo de visão
Edite `config/settings.py`:
```python
"ai": {
    "vision_model": "llama3.2-vision",  # ou "llava"
}
```

### Pasta de capturas
As imagens capturadas são salvas temporariamente em:
- **Windows**: `C:\Users\[SeuUsuário]\Pictures\Jarvis_Vision\`
- **Linux/Mac**: `~/Pictures/Jarvis_Vision/`

## Palavras-chave Detectadas

O sistema detecta automaticamente estas frases:
- o que é isso
- o que você vê
- o que está vendo
- me mostre
- olha isso
- vê isso
- analisa isso
- identifica isso
- reconhece isso
- o que tem aqui
- o que aparece
- descreve o que vê
- o que é esta coisa
- qual é esse objeto
- me diz o que é

## Solução de Problemas

### "Não foi possível abrir a webcam"
- Verifique se a webcam está conectada
- Verifique se outra aplicação não está usando a webcam
- Tente fechar outros programas que usam câmera

### "Erro ao processar visão"
- Verifique se o modelo de visão está instalado: `ollama list`
- Instale o modelo: `ollama pull llama3.2-vision`
- Verifique se o Ollama está rodando: `ollama serve`

### "Modelo não encontrado"
- Instale o modelo correto conforme configurado em settings.py
- Modelos suportados: `llama3.2-vision`, `llava`, `bakllava`

## Arquitetura Técnica

### Componentes Criados
1. **`actions/vision/visual_qa.py`**: Ação de captura e análise visual
2. **`ConversationManager.process_visual_input()`**: Processa perguntas com imagem
3. **`Jarvis._is_visual_question()`**: Detecta perguntas visuais
4. **`Jarvis._capture_webcam_for_analysis()`**: Captura imagem da webcam

### Fluxo de Execução
```
Usuário faz pergunta
    ↓
Sistema detecta palavras-chave de visão
    ↓
Captura imagem da webcam (base64)
    ↓
Envia para modelo de IA com visão
    ↓
IA analisa e responde
    ↓
Resposta falada ao usuário
```

## Limitações

- Requer webcam conectada e funcionando
- Requer modelo de visão instalado no Ollama
- A qualidade da análise depende do modelo usado
- Captura apenas uma imagem estática (não vídeo contínuo)

## Próximas Melhorias

- [ ] Suporte a múltiplas câmeras
- [ ] Análise de vídeo em tempo real
- [ ] OCR melhorado para leitura de textos
- [ ] Reconhecimento facial
- [ ] Detecção de objetos específicos
