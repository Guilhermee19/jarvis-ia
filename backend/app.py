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

# Importar Jarvis WebSocket
from core.jarvis_websocket import get_jarvis

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inicializar Jarvis
jarvis = get_jarvis()

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
    try:
        text = data.get('text', '')
        logger.info(f"💬 Chat de {sid}: {text[:50]}...")
        
        # Processar com Jarvis
        response = await jarvis.process_text_message(text)
        
        # 1. Enviar resposta de texto IMEDIATAMENTE
        await sio.emit('chat:response', response, room=sid)
        logger.info(f"📤 Resposta enviada: {response.get('text', '')[:50]}...")
        
        # 2. Se tem áudio, enviar IMEDIATAMENTE
        if response.get('audio'):
            await sio.emit('audio:response', {'audio': response['audio']}, room=sid)
            logger.info("🔊 Áudio de resposta enviado")
        
        # 3. Executar ações em background (não bloqueante)
        if response.get('actions'):
            logger.info(f"🤖 Iniciando execução de {len(response['actions'])} ações em background")
            
            import asyncio
            from concurrent.futures import ThreadPoolExecutor
            
            def execute_actions_sync():
                try:
                    jarvis.action_manager.execute_actions(response['actions'])
                    return True
                except Exception as e:
                    logger.error(f"❌ Erro ao executar ações: {e}")
                    return False
            
            # Executar em background
            loop = asyncio.get_event_loop()
            with ThreadPoolExecutor() as executor:
                success = await loop.run_in_executor(executor, execute_actions_sync)
            
            if success:
                logger.info("✅ Ações executadas com sucesso")
        
        return {'status': 'processed'}
        
    except Exception as e:
        logger.error(f"❌ Erro no chat: {e}")
        await sio.emit('chat:error', {'error': str(e)}, room=sid)
        return {'status': 'error', 'message': str(e)}


@sio.event
async def audio_data(sid, data):
    """
    Handler para áudio do microfone
    data: { audio: str (base64) }
    """
    try:
        audio_base64 = data.get('audio', '')
        logger.info(f"🎤 Áudio recebido de {sid}, tamanho: {len(audio_base64)}")
        
        # Processar com Jarvis
        response = await jarvis.process_audio_data(audio_base64, sid)
        
        # 1. Enviar transcrição primeiro
        if response.get('transcription'):
            await sio.emit('audio:transcription', {
                'text': response['transcription']
            }, room=sid)
            logger.info(f"📝 Transcrição enviada: {response['transcription']}")
        
        # 2. Enviar resposta do Jarvis IMEDIATAMENTE
        logger.info(f"📦 Objeto resposta completo: text={response.get('text', 'VAZIO')[:50]}, speech={response.get('speech', 'VAZIO')[:30]}, actions={len(response.get('actions', []))}, has_audio={bool(response.get('audio'))}")
        await sio.emit('chat:response', response, room=sid)
        logger.info(f"📤 Resposta enviada para frontend")
        
        # 3. Se tem áudio de resposta, enviar IMEDIATAMENTE
        if response.get('audio'):
            await sio.emit('audio:response', {'audio': response['audio']}, room=sid)
            logger.info("🔊 Áudio de resposta enviado")
        
        # 4. Executar ações em background (não bloqueante)
        if response.get('actions'):
            logger.info(f"🤖 Iniciando execução de {len(response['actions'])} ações em background")
            
            import asyncio
            from concurrent.futures import ThreadPoolExecutor
            
            def execute_actions_sync():
                try:
                    jarvis.action_manager.execute_actions(response['actions'])
                    return True
                except Exception as e:
                    logger.error(f"❌ Erro ao executar ações: {e}")
                    return False
            
            # Executar em background
            loop = asyncio.get_event_loop()
            with ThreadPoolExecutor() as executor:
                success = await loop.run_in_executor(executor, execute_actions_sync)
            
            if success:
                logger.info("✅ Ações executadas com sucesso")
        
        return {'status': 'processed'}
        
    except Exception as e:
        logger.error(f"❌ Erro ao processar áudio: {e}", exc_info=True)
        await sio.emit('audio:error', {'error': str(e)}, room=sid)
        return {'status': 'error', 'message': str(e)}


@sio.event
async def camera_frame(sid, data):
    """
    Handler para frames da webcam
    data: { frame: str (base64) }
    """
    try:
        frame_base64 = data.get('frame', '')
        logger.info(f"📸 Frame recebido de {sid}, tamanho: {len(frame_base64)}")
        
        # Armazenar frame para uso posterior
        jarvis.store_camera_frame(sid, frame_base64)
        
        await sio.emit('camera:frame_received', {'status': 'stored'}, room=sid)
        return {'status': 'stored'}
        
    except Exception as e:
        logger.error(f"❌ Erro ao processar frame: {e}")
        return {'status': 'error', 'message': str(e)}


@sio.event
async def analyze_image(sid, data):
    """
    Handler para análise visual de imagem
    data: { frame: str (base64) }
    """
    try:
        frame_base64 = data.get('frame', '')
        logger.info(f"🔍 Análise de imagem solicitada por {sid}")
        
        # Processar com pergunta padrão de análise visual
        question = "O que você está vendo nesta imagem? Descreva detalhadamente."
        response = await jarvis.process_text_message(question, frame_base64)
        
        # Enviar resultado da análise
        await sio.emit('vision:analysis', response, room=sid)
        logger.info(f"👁️ Análise enviada: {response['text'][:100]}...")
        
        # Se tem áudio, enviar
        if response.get('audio'):
            await sio.emit('audio:response', {'audio': response['audio']}, room=sid)
        
        return {'status': 'analyzed'}
        
    except Exception as e:
        logger.error(f"❌ Erro na análise de imagem: {e}", exc_info=True)
        await sio.emit('vision:error', {'error': str(e)}, room=sid)
        return {'status': 'error', 'message': str(e)}


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
