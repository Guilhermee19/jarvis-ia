#!/bin/bash
# Script de instalação do recurso de Visão para Jarvis IA

echo "🤖 Instalando recurso de Visão do Jarvis..."
echo ""

# Instalar dependências Python
echo "📦 Instalando dependências Python..."
pip install opencv-python ollama
echo "✅ Dependências instaladas!"
echo ""

# Verificar se Ollama está instalado
echo "🔍 Verificando Ollama..."
if ! command -v ollama &> /dev/null
then
    echo "❌ Ollama não encontrado!"
    echo "📥 Instale o Ollama em: https://ollama.ai"
    echo "   Depois execute este script novamente."
    exit 1
fi
echo "✅ Ollama encontrado!"
echo ""

# Baixar modelo de visão
echo "🧠 Baixando modelo de IA com visão (llama3.2-vision)..."
echo "⚠️  Isso pode levar alguns minutos..."
ollama pull llama3.2-vision

if [ $? -eq 0 ]; then
    echo "✅ Modelo instalado com sucesso!"
else
    echo "❌ Erro ao instalar modelo"
    echo "💡 Tente manualmente: ollama pull llama3.2-vision"
    exit 1
fi

echo ""
echo "🎉 Instalação completa!"
echo ""
echo "📖 Como usar:"
echo "   1. Inicie o Jarvis: python main.py"
echo "   2. Faça perguntas como: 'O que é isso?', 'O que você vê?'"
echo "   3. O Jarvis capturará a webcam automaticamente!"
echo ""
echo "📚 Documentação completa em: docs/VISAO.md"
