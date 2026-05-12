"""
Jarvis IA - Backend Server
FastAPI + WebSocket Server para comunicação com frontend Electron
"""
import os
import uuid
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import socketio

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Criar instância do FastAPI
app = FastAPI(
    title="Jarvis IA API",
    description="Backend com WebSocket para assistente virtual",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar instância do Socket.IO
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    logger=False,
    engineio_logger=False
)

# Integrar Socket.IO com FastAPI
socket_app = socketio.ASGIApp(sio, app)

# Armazenar sessões ativas
active_sessions = {}


@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "app": "Jarvis IA Backend",
        "status": "online",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "active_connections": len(active_sessions)
    }


@sio.event
async def connect(sid, environ, auth):
    """
    Evento de conexão WebSocket
    Valida token de autenticação e registra sessão
    """
    logger.info(f"Cliente tentando conectar: {sid}")
    
    # Validar token (simplificado por enquanto)
    token = auth.get('token') if auth else None
    if not token:
        # Gerar token para desenvolvimento
        token = str(uuid.uuid4())
        logger.warning(f"Token não fornecido, gerando: {token}")
    
    # Registrar sessão
    active_sessions[sid] = {
        'token': token,
        'connected_at': None,  # Adicionar timestamp se necessário
    }
    
    logger.info(f"Cliente conectado: {sid}")
    await sio.emit('connection:ready', {'session_id': sid}, room=sid)
    return True


@sio.event
async def disconnect(sid):
    """Evento de desconexão WebSocket"""
    if sid in active_sessions:
        del active_sessions[sid]
    logger.info(f"Cliente desconectado: {sid}")


@sio.event
async def chat_message(sid, data):
    """
    Handler para mensagens de chat
    data: { text: str, timestamp: int }
    """
    logger.info(f"Mensagem recebida de {sid}: {data.get('text', '')[:50]}...")
    
    # TODO: Integrar com Jarvis/IA aqui
    # Por enquanto, resposta mock
    response = {
        'id': str(uuid.uuid4()),
        'sender': 'ai',
        'text': f"Recebi sua mensagem: {data.get('text', '')}",
        'timestamp': data.get('timestamp', 0),
        'metadata': {'model': 'llama3'}
    }
    
    await sio.emit('chat:message', response, room=sid)
    return {'status': 'received'}


@sio.event
async def camera_start(sid, data):
    """
    Iniciar streaming de webcam
    """
    logger.info(f"Iniciando camera para {sid}")
    
    # TODO: Integrar com OpenCV aqui
    await sio.emit('camera:started', {'status': 'active'}, room=sid)
    return {'status': 'started'}


@sio.event
async def camera_stop(sid, data):
    """
    Parar streaming de webcam
    """
    logger.info(f"Parando camera para {sid}")
    
    # TODO: Parar captura OpenCV
    await sio.emit('camera:stopped', {'status': 'inactive'}, room=sid)
    return {'status': 'stopped'}


@sio.event
async def camera_request(sid, data):
    """
    Requisitar frame da webcam
    """
    logger.info(f"Frame requisitado por {sid}")
    
    # TODO: Capturar e enviar frame
    # Mock frame por enquanto
    mock_frame = {
        'frameData': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'timestamp': data.get('timestamp', 0),
        'width': 640,
        'height': 480
    }
    
    await sio.emit('camera:frame', mock_frame, room=sid)
    return {'status': 'sent'}


@sio.event
async def action_execute(sid, data):
    """
    Executar ação do sistema
    data: { action: str, params: dict }
    """
    action = data.get('action', 'unknown')
    logger.info(f"Ação requisitada por {sid}: {action}")
    
    # TODO: Integrar com sistema de ações
    result = {
        'action': action,
        'success': True,
        'message': f'Ação {action} executada com sucesso',
        'timestamp': data.get('timestamp', 0),
        'data': {}
    }
    
    await sio.emit('action:complete', result, room=sid)
    return result


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv('PORT', 5000))
    logger.info(f"Iniciando servidor na porta {port}")
    
    uvicorn.run(
        socket_app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
