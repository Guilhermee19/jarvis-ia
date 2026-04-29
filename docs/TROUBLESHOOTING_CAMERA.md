# 🎥 Solução de Problemas - Webcam

## Problema: Webcam não é reconhecida

### Sintomas:
- Mensagem: "Não foi possível abrir a webcam"
- Erro ao iniciar câmera no widget
- Tela preta no widget de webcam

### Soluções:

## 1️⃣ Verificar Câmeras Disponíveis

Execute o script de configuração:
```bash
python configure_camera.py
```

Ou manualmente:
```bash
python -c "from config.settings import list_available_cameras; list_available_cameras()"
```

**O que esperar:**
```
🔍 Procurando câmeras disponíveis...
  ✓ Câmera 0: 640x480 @ 30fps
  ✓ Câmera 1: 1920x1080 @ 30fps

📹 Total: 2 câmera(s) disponível(is)
```

## 2️⃣ Configurar Índice Correto

### Opção A: Via Script Interativo
```bash
python configure_camera.py
```
Siga as instruções na tela.

### Opção B: Editar Manualmente

Edite `config/settings.py`:
```python
"video": {
    "camera_index": 0,  # Altere para o índice correto
    ...
},
```

### Opção C: Variável de Ambiente
```bash
# Windows (PowerShell)
$env:JARVIS_CAMERA_INDEX=1

# Windows (CMD)
set JARVIS_CAMERA_INDEX=1

# Linux/Mac
export JARVIS_CAMERA_INDEX=1
```

## 3️⃣ Verificações Comuns

### ✅ Câmera está conectada?
- USB conectado corretamente
- LED da câmera aceso (se houver)
- Reconhecida pelo Windows (Gerenciador de Dispositivos)

### ✅ Outra aplicação usando a câmera?
Feche programas que podem estar usando:
- Zoom, Teams, Skype
- OBS Studio
- Navegador com sites que usam câmera
- Outros assistentes virtuais

### ✅ Permissões do Windows
1. Configurações → Privacidade → Câmera
2. Permitir que aplicativos acessem sua câmera: **Ativado**
3. Permitir que aplicativos da área de trabalho acessem sua câmera: **Ativado**

### ✅ Driver atualizado?
1. Gerenciador de Dispositivos
2. Encontre sua webcam em "Câmeras" ou "Dispositivos de imagem"
3. Clique com botão direito → Atualizar driver

### ✅ OpenCV instalado?
```bash
pip install opencv-python
```

## 4️⃣ Teste Isolado

Teste a câmera fora do Jarvis:
```python
import cv2

cap = cv2.VideoCapture(0)  # Tente 0, 1, 2...
if cap.isOpened():
    ret, frame = cap.read()
    if ret:
        print("✅ Câmera funcionando!")
        print(f"Resolução: {frame.shape}")
    else:
        print("❌ Não conseguiu ler frame")
else:
    print("❌ Não conseguiu abrir câmera")
cap.release()
```

## 5️⃣ Índices Comuns

| Situação | Índice Provável |
|----------|----------------|
| Webcam integrada do notebook | 0 |
| Webcam USB (única) | 0 ou 1 |
| Notebook + Webcam USB | 0 (integrada), 1 (USB) |
| Múltiplas webcams USB | 0, 1, 2... |

## 6️⃣ Erros Específicos e Soluções

### Erro: "Câmera 0 não disponível"
**Causa:** Índice incorreto  
**Solução:** Execute `python configure_camera.py` para descobrir o índice correto

### Erro: "OpenCV não instalado"
**Causa:** Pacote opencv-python não instalado  
**Solução:** `pip install opencv-python`

### Erro: Tela preta no widget
**Causa:** Câmera bloqueada por outro app  
**Solução:** Feche outros programas e reinicie o Jarvis

### Erro: "Access denied"
**Causa:** Sem permissão no Windows  
**Solução:** Verifique Configurações → Privacidade → Câmera

### Erro: Frame muito lento ou travando
**Causa:** Resolução muito alta ou hardware fraco  
**Solução:** Reduza resolução em `config/settings.py`:
```python
"video": {
    "camera_width": 320,   # Menor resolução
    "camera_height": 240,
    "camera_fps": 15,      # Menos FPS
},
```

## 7️⃣ Debug Avançado

### Verificar logs detalhados
```python
import cv2

# Testar câmera com mais detalhes
for i in range(5):
    print(f"\nTestando câmera {i}...")
    cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)  # Windows
    # cap = cv2.VideoCapture(i, cv2.CAP_V4L2)  # Linux
    
    if cap.isOpened():
        print(f"  ✓ Aberta")
        
        # Propriedades
        width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
        height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
        fps = cap.get(cv2.CAP_PROP_FPS)
        backend = cap.getBackendName()
        
        print(f"  Resolução: {int(width)}x{int(height)}")
        print(f"  FPS: {int(fps)}")
        print(f"  Backend: {backend}")
        
        # Tentar ler
        ret, frame = cap.read()
        if ret:
            print(f"  ✓ Frame lido com sucesso")
        else:
            print(f"  ✗ Falha ao ler frame")
    else:
        print(f"  ✗ Não foi possível abrir")
    
    cap.release()
```

### Backend específico (Windows)
Se tiver problemas, force o backend DirectShow:
```python
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
```

Edite os arquivos para usar CAP_DSHOW em vez de apenas o índice.

## 8️⃣ Casos Especiais

### Câmera Virtual (OBS, etc.)
Câmeras virtuais podem aparecer como índices normais. Teste cada uma para identificar.

### Múltiplas Câmeras
Se você tem várias câmeras e quer escolher:
1. Liste todas: `python configure_camera.py`
2. Anote qual é qual (teste visualmente)
3. Configure o índice desejado

### Câmera USB não detectada
1. Troque porta USB
2. Use USB 2.0 em vez de 3.0 (ou vice-versa)
3. Teste em outro computador
4. Verifique se o cabo USB está bom

## 9️⃣ Ainda não funciona?

### Checklist final:
- [ ] OpenCV instalado?
- [ ] Câmera aparece no Gerenciador de Dispositivos?
- [ ] Permissões do Windows ativadas?
- [ ] Nenhum outro app usando a câmera?
- [ ] Índice correto em settings.py?
- [ ] Testou com script isolado?
- [ ] Driver atualizado?

### Obter ajuda:
1. Execute: `python configure_camera.py`
2. Anote a saída completa
3. Execute o teste isolado acima
4. Anote todos os erros
5. Verifique os logs do Jarvis

## 🎯 Configuração Recomendada

Para a maioria dos casos:
```python
# config/settings.py
"video": {
    "camera_index": 0,      # Primeira câmera
    "camera_width": 640,    # Resolução padrão
    "camera_height": 480,
    "camera_fps": 30,       # 30 FPS
},
```

## ✅ Teste Final

Depois de configurar, teste:
```bash
# 1. Teste a câmera
python configure_camera.py

# 2. Teste os widgets
python demo_widgets.py

# 3. Use no Jarvis
python main.py
# Diga: "Abrir webcam"
```

Se tudo funcionar, você verá o feed da câmera ao vivo! 🎉
