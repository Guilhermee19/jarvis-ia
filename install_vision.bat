@echo off
REM Script de instalação do recurso de Visão para Jarvis IA (Windows)

echo 🤖 Instalando recurso de Visão do Jarvis...
echo.

REM Instalar dependências Python
echo 📦 Instalando dependências Python...
pip install opencv-python ollama
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)
echo ✅ Dependências instaladas!
echo.

REM Verificar se Ollama está instalado
echo 🔍 Verificando Ollama...
where ollama >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ollama não encontrado!
    echo 📥 Instale o Ollama em: https://ollama.ai
    echo    Depois execute este script novamente.
    pause
    exit /b 1
)
echo ✅ Ollama encontrado!
echo.

REM Baixar modelo de visão
echo 🧠 Baixando modelo de IA com visão (llama3.2-vision)...
echo ⚠️  Isso pode levar alguns minutos...
ollama pull llama3.2-vision
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar modelo
    echo 💡 Tente manualmente: ollama pull llama3.2-vision
    pause
    exit /b 1
)
echo ✅ Modelo instalado com sucesso!
echo.

echo 🎉 Instalação completa!
echo.
echo 📖 Como usar:
echo    1. Inicie o Jarvis: python main.py
echo    2. Faça perguntas como: "O que é isso?", "O que você vê?"
echo    3. O Jarvis capturará a webcam automaticamente!
echo.
echo 📚 Documentação completa em: docs\VISAO.md
echo.
pause
