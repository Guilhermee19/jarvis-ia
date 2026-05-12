# Jarvis IA - Assistente Virtual com React + Electron + Python

## 🚀 Status da Implementação

### ✅ Fase 1: Reestruturação do Projeto (CONCLUÍDA)

**Estrutura Monorepo Criada:**
```
jarvis-ia/
├── frontend/          # React + Electron + TypeScript
│   ├── src/
│   ├── tailwind.config.js
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Python + FastAPI + WebSocket
│   ├── app.py        # Servidor WebSocket
│   ├── core/         # Lógica do Jarvis
│   ├── actions/      # Ações do sistema
│   ├── config/       # Configurações
│   └── handlers/     # Event handlers
├── shared/           # Tipos compartilhados
│   ├── events.ts
│   └── types.ts
└── package.json      # Root workspace
```

**Tecnologias Configuradas:**
- ✅ React 18 + TypeScript + Vite
- ✅ TailwindCSS (tema cyberpunk customizado)
- ✅ Electron + socket.io-client
- ✅ Framer Motion para animações
- ✅ FastAPI + python-socketio
- ✅ Monorepo com scripts de desenvolvimento

### 🎨 Tema Visual Configurado

**Paleta de Cores Cyberpunk:**
- Primary: `#00dcff` (Azul neon)
- Secondary: `#667eea` (Roxo)
- Accent: `#764ba2` (Roxo escuro)
- Dark: `#050c18` (Background)

**Features CSS:**
- Glassmorphism effects
- Glow effects (primary/secondary)
- Gradient text
- Custom scrollbar
- Animações: fade-in, slide-in, pulse-glow

### 📦 Backend WebSocket

**Servidor Criado:** `backend/app.py`
- FastAPI com CORS configurado
- Socket.IO server integrado
- Health check endpoint (`/health`)
- Autenticação básica com tokens UUID

**Eventos Implementados:**
- `connect` / `disconnect` - Gerenciamento de sessões
- `chat:message` - Mensagens de chat (mock)
- `camera:start` / `camera:stop` / `camera:request` - Controle de webcam
- `action:execute` - Execução de ações

### 🔄 Próximas Etapas

**Em Andamento:**
- [ ] Criar handlers detalhados (chat.py, camera.py, system.py)
- [ ] Refatorar `backend/core/jarvis.py` para usar WebSocket
- [ ] Configurar Electron main process e preload
- [ ] Criar componentes React (ChatPanel, CameraPanel, StatusPanel)
- [ ] Integrar WebSocket no frontend

**Pendente:**
- [ ] Dashboard UI completo com layout responsivo
- [ ] Animações Framer Motion
- [ ] Sistema de notícias (Fase 6)
- [ ] Aprendizado de preferências (Fase 6)

## 🛠️ Como Executar (Desenvolvimento)

### Pré-requisitos
- Node.js >= 18
- Python >= 3.10
- Ollama instalado e rodando

### Setup

1. **Instalar dependências:**
```bash
# Root
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

2. **Rodar em desenvolvimento:**
```bash
# Da raiz do projeto
npm run dev

# Ou separadamente:
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

3. **Acessar:**
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health
- Frontend (temporário): http://localhost:5173

## 📋 Comandos Disponíveis

```bash
npm run dev           # Roda backend + frontend simultaneamente
npm run dev:backend   # Apenas backend Python
npm run dev:frontend  # Apenas frontend Electron
npm run build         # Build do Electron app
npm run clean         # Limpar arquivos de build
```

## 🎯 Objetivos do Projeto

1. **Interface Moderna:** Dashboard cyberpunk com React + Electron
2. **Real-time:** WebSocket para comunicação instantânea
3. **IA Local:** Ollama + llama3 (zero custos)
4. **Webcam:** Análise visual com IA
5. **Notícias:** Integração com APIs de notícias
6. **Aprendizado:** Sistema de rotinas e preferências
7. **Custo Zero:** 100% local, sem serviços pagos

## 📝 Notas de Desenvolvimento

- Backend roda na porta 5000
- Frontend Electron usa porta dinâmica
- WebSocket com reconnect automático
- CORS configurado para desenvolvimento local
- Logs estruturados com Python logging

## 🔒 Segurança

- Autenticação básica com UUID tokens
- CORS restrito a localhost
- Context isolation no Electron
- Sem dados sensíveis em código

## 📚 Documentação

Ver `/docs` para detalhes técnicos:
- `api.md` - Documentação da API
- `WIDGETS.md` - Componentes UI
- `VISAO.md` - Sistema de visão computacional

---

**Última atualização:** Fase 1 concluída - Estrutura monorepo + Backend WebSocket + Frontend base configurados
