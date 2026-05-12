# Jarvis IA - Assistente Virtual Desktop

Assistente virtual inteligente com interface desktop moderna usando React + Electron, integrado com AI (Ollama Llama3) e recursos de visão computacional.

## 🚀 Tecnologias

### Frontend
- **React 18** + **TypeScript 5** - Interface reativa e type-safe
- **Electron 42** - Desktop app multi-plataforma
- **Vite 8** - Build ultra-rápido
- **TailwindCSS 4** - Styling com tema cyberpunk customizado
- **Framer Motion 12** - Animações fluidas
- **Socket.IO Client** - WebSocket real-time
- **Zustand 5** - State management global

### Backend
- **FastAPI** + **Python Socket.IO** - WebSocket server
- **Ollama** (llama3, llama3.2-vision) - LLM local
- **OpenCV** - Processamento de imagem
- **Edge TTS** - Text-to-speech neural
- **SpeechRecognition** - Speech-to-text

## 📦 Estrutura do Projeto

```
jarvis_ia/
├── frontend/               # Electron + React app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── layouts/        # Layout components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # WebSocket service
│   │   ├── store/          # Zustand store
│   │   ├── main.ts         # Electron main process
│   │   ├── preload.ts      # Electron preload script
│   │   └── App.tsx         # Root component
│   ├── dist/               # Built web files
│   └── dist-electron/      # Built Electron files
│
├── backend/                # Python FastAPI server
│   ├── app.py              # WebSocket server
│   ├── core/               # Core logic (Jarvis, AI, Audio)
│   ├── actions/            # Action modules
│   ├── config/             # Configuration
│   └── requirements.txt    # Python dependencies
│
└── shared/                 # Shared TypeScript types
    ├── events.ts           # WebSocket event types
    └── types.ts            # Common types
```

## 🛠️ Instalação

### 1. Backend (Python)

```bash
cd backend

# Criar virtual environment
python -m venv venv

# Ativar venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### 2. Frontend (Node.js)

```bash
cd frontend

# Instalar dependências
npm install
```

### 3. Ollama (LLM Local)

Instale o Ollama: https://ollama.ai/

```bash
# Baixar modelo llama3
ollama pull llama3

# Baixar modelo de visão
ollama pull llama3.2-vision
```

## ▶️ Executar

### Modo Desenvolvimento

Terminal 1 - Backend:
```bash
cd backend
python app.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

O Electron abrirá automaticamente conectando-se ao backend em `http://localhost:5000`.

### Build para Produção

```bash
cd frontend
npm run build
```

Isso criará:
- `dist/` - Web files
- `dist-electron/` - Electron executável
- Electron Builder criará instalador em `dist/` (Windows: `.exe`, Linux: `.AppImage`, Mac: `.dmg`)

## 🎨 Componentes Principais

### Dashboard
- **ChatPanel** - Interface de conversa com AI
- **CameraPanel** - Visualização e controle da webcam
- **StatusPanel** - Métricas do sistema e status

### Hooks Customizados
- `useWebSocket` - Gerencia conexão WebSocket
- `useChat` - Envia/recebe mensagens de chat
- `useCamera` - Controla câmera (15 FPS stream)
- `useSystemStatus` - Monitora métricas do sistema

### WebSocket Events

```typescript
// Client -> Server
chat_message      // Enviar mensagem
camera_start      // Iniciar câmera
camera_stop       // Parar câmera
camera_request    // Solicitar frame
action_execute    // Executar ação

// Server -> Client
chat_response     // Resposta do AI
camera_frame      // Frame da câmera (base64)
camera_status     // Status da câmera
system_status     // Métricas do sistema
```

## 🎨 Tema Cyberpunk

```css
Primary: #00dcff (Azul ciano)
Secondary: #667eea (Azul roxeado)
Accent: #764ba2 (Roxo)
Dark: #050c18 (Azul escuro profundo)
Dark-light: #0f1925 (Azul escuro claro)
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@shared/events'"
- Verifique se `shared/` existe na raiz do projeto
- Rode `npm run build` novamente

### Backend não conecta
- Verifique se Python está rodando em `localhost:5000`
- Verifique logs no terminal do backend
- Teste endpoint: `http://localhost:5000/health`

### Ollama não responde
- Verifique se Ollama está rodando: `ollama list`
- Baixe o modelo: `ollama pull llama3`
- Teste: `ollama run llama3 "hello"`

### Câmera não funciona
- Permita acesso à câmera no sistema operacional
- Verifique se OpenCV detecta: `python configure_camera.py`

## 📄 Licença

MIT License - Use livremente para projetos pessoais e comerciais.

## 👤 Autor

**Guilherme**
- GitHub: [@GuiDev](https://github.com/guilherme)

---

**Versão**: 1.0.0  
**Status**: ✅ Funcional (Phase 5 completa)
