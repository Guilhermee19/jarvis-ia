"""
Script de teste para o recurso de Visão do Jarvis
Testa captura da webcam e integração com IA
"""
import sys
import os

# Adicionar diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_webcam_capture():
    """Testa captura básica da webcam"""
    print("🧪 Testando captura da webcam...")
    
    try:
        import cv2
        
        # Tentar abrir webcam
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("❌ FALHOU: Não foi possível abrir a webcam")
            return False
        
        # Tentar ler um frame
        ret, frame = cap.read()
        cap.release()
        
        if not ret:
            print("❌ FALHOU: Não foi possível capturar frame")
            return False
        
        print(f"✅ PASSOU: Webcam funcionando! Frame capturado: {frame.shape}")
        return True
        
    except Exception as e:
        print(f"❌ FALHOU: {e}")
        return False


def test_visual_action():
    """Testa a ação de visão"""
    print("\n🧪 Testando ação de visão...")
    
    try:
        from actions.vision.visual_qa import VisualQuestionAction
        
        action = VisualQuestionAction()
        print(f"✅ PASSOU: Ação criada - {action.name}")
        
        # Testar captura para análise
        image_data = action.capture_for_analysis()
        
        if image_data:
            print(f"✅ PASSOU: Imagem capturada em base64 (tamanho: {len(image_data)} chars)")
            return True
        else:
            print("❌ FALHOU: Não foi possível capturar imagem")
            return False
            
    except Exception as e:
        print(f"❌ FALHOU: {e}")
        return False


def test_conversation_manager():
    """Testa o ConversationManager com suporte a visão"""
    print("\n🧪 Testando ConversationManager...")
    
    try:
        from core.ai.conversation import ConversationManager
        
        cm = ConversationManager()
        print(f"✅ PASSOU: ConversationManager criado")
        
        # Verificar se método de visão existe
        if hasattr(cm, 'process_visual_input'):
            print("✅ PASSOU: Método process_visual_input existe")
            return True
        else:
            print("❌ FALHOU: Método process_visual_input não encontrado")
            return False
            
    except Exception as e:
        print(f"❌ FALHOU: {e}")
        return False


def test_ollama_vision_model():
    """Testa se o modelo de visão está instalado"""
    print("\n🧪 Testando modelo de visão do Ollama...")
    
    try:
        import ollama
        
        # Listar modelos instalados
        models = ollama.list()
        model_names = [m['name'] for m in models.get('models', [])]
        
        vision_models = ['llama3.2-vision', 'llava', 'bakllava']
        found = None
        
        for vm in vision_models:
            if any(vm in name for name in model_names):
                found = vm
                break
        
        if found:
            print(f"✅ PASSOU: Modelo de visão encontrado ({found})")
            return True
        else:
            print(f"⚠️  AVISO: Nenhum modelo de visão instalado")
            print(f"   Modelos disponíveis: {model_names}")
            print(f"   Execute: ollama pull llama3.2-vision")
            return False
            
    except Exception as e:
        print(f"❌ FALHOU: {e}")
        print("   Certifique-se de que o Ollama está instalado e rodando")
        return False


def test_jarvis_integration():
    """Testa integração com Jarvis"""
    print("\n🧪 Testando integração com Jarvis...")
    
    try:
        from core.jarvis import Jarvis
        
        jarvis = Jarvis()
        
        # Verificar métodos de visão
        if hasattr(jarvis, '_is_visual_question'):
            print("✅ PASSOU: Método _is_visual_question existe")
            
            # Testar detecção
            test_questions = [
                ("o que é isso", True),
                ("o que você vê", True),
                ("toca uma música", False),
                ("analisa isso", True)
            ]
            
            all_correct = True
            for question, expected in test_questions:
                result = jarvis._is_visual_question(question)
                status = "✅" if result == expected else "❌"
                print(f"  {status} '{question}' -> {result} (esperado: {expected})")
                if result != expected:
                    all_correct = False
            
            if all_correct:
                print("✅ PASSOU: Detecção de perguntas visuais funcionando")
                return True
            else:
                print("❌ FALHOU: Detecção incorreta em alguns casos")
                return False
        else:
            print("❌ FALHOU: Método _is_visual_question não encontrado")
            return False
            
    except Exception as e:
        print(f"❌ FALHOU: {e}")
        return False


def main():
    """Executa todos os testes"""
    print("=" * 60)
    print("🤖 JARVIS IA - TESTE DO RECURSO DE VISÃO")
    print("=" * 60)
    print()
    
    tests = [
        ("Captura da Webcam", test_webcam_capture),
        ("Ação de Visão", test_visual_action),
        ("ConversationManager", test_conversation_manager),
        ("Modelo de Visão Ollama", test_ollama_vision_model),
        ("Integração com Jarvis", test_jarvis_integration)
    ]
    
    results = []
    for name, test_func in tests:
        result = test_func()
        results.append((name, result))
    
    # Resumo
    print("\n" + "=" * 60)
    print("📊 RESUMO DOS TESTES")
    print("=" * 60)
    
    passed = sum(1 for _, r in results if r)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASSOU" if result else "❌ FALHOU"
        print(f"{status}: {name}")
    
    print(f"\n🎯 Total: {passed}/{total} testes passaram")
    
    if passed == total:
        print("\n🎉 Todos os testes passaram! O recurso de visão está pronto para uso!")
    elif passed >= total - 1:
        print("\n⚠️  Quase lá! Verifique o modelo de visão do Ollama.")
        print("   Execute: ollama pull llama3.2-vision")
    else:
        print("\n⚠️  Alguns testes falharam. Verifique os erros acima.")
    
    print("\n💡 Para instalar tudo automaticamente, execute:")
    print("   Windows: install_vision.bat")
    print("   Linux/Mac: bash install_vision.sh")
    print()


if __name__ == "__main__":
    main()
