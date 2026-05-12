"""
Script para listar e configurar câmeras disponíveis
Execute este script para ver todas as webcams detectadas no sistema
"""
import sys
import os

# Adicionar diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def main():
    """Lista câmeras e ajuda a configurar"""
    print("=" * 60)
    print("🎥 JARVIS IA - CONFIGURAÇÃO DE WEBCAM")
    print("=" * 60)
    print()
    
    from config.settings import list_available_cameras, get_camera_index, set_setting
    
    # Mostrar configuração atual
    current_index = get_camera_index()
    print(f"📌 Câmera atual configurada: {current_index}")
    print()
    
    # Listar câmeras disponíveis
    cameras = list_available_cameras()
    
    if not cameras:
        print()
        print("❌ Nenhuma câmera detectada!")
        print()
        print("💡 Soluções:")
        print("   1. Conecte uma webcam USB")
        print("   2. Verifique se a câmera está habilitada no Windows")
        print("   3. Feche outros programas que possam estar usando a câmera")
        print("   4. Reinicie o computador")
        print()
        return
    
    print()
    print("=" * 60)
    
    # Verificar se a câmera atual está disponível
    if current_index in cameras:
        print(f"✅ Câmera configurada ({current_index}) está disponível!")
    else:
        print(f"⚠️  Câmera configurada ({current_index}) NÃO está disponível!")
        print(f"   Recomendamos usar uma das câmeras detectadas acima.")
    
    print()
    print("=" * 60)
    print()
    
    # Perguntar se quer alterar
    response = input("Deseja alterar a câmera padrão? (s/n): ").strip().lower()
    
    if response in ['s', 'sim', 'y', 'yes']:
        print()
        print("Câmeras disponíveis:")
        for i, cam in enumerate(cameras, 1):
            marker = "← ATUAL" if cam == current_index else ""
            print(f"  {i}. Câmera {cam} {marker}")
        print()
        
        try:
            choice = input(f"Escolha uma câmera (1-{len(cameras)}): ").strip()
            choice_idx = int(choice) - 1
            
            if 0 <= choice_idx < len(cameras):
                new_camera = cameras[choice_idx]
                
                # Atualizar configuração
                set_setting("video.camera_index", new_camera)
                
                # Salvar no arquivo
                print()
                print(f"✅ Câmera alterada para: {new_camera}")
                print()
                print("⚠️  ATENÇÃO: Para persistir essa mudança, edite:")
                print(f"   config/settings.py")
                print(f"   Altere 'camera_index': {new_camera}")
                print()
                print("Ou adicione variável de ambiente:")
                print(f"   set JARVIS_CAMERA_INDEX={new_camera}  (Windows)")
                print(f"   export JARVIS_CAMERA_INDEX={new_camera}  (Linux/Mac)")
                print()
            else:
                print("❌ Opção inválida")
        
        except ValueError:
            print("❌ Entrada inválida")
        except Exception as e:
            print(f"❌ Erro: {e}")
    
    print()
    print("=" * 60)
    print()
    print("💡 Dicas:")
    print("   • A maioria dos computadores tem a câmera integrada como índice 0")
    print("   • Webcams USB geralmente aparecem como índices 1, 2, etc.")
    print("   • Se tiver múltiplas câmeras, teste cada uma para ver qual funciona melhor")
    print()
    print("🚀 Para testar a câmera configurada, execute:")
    print("   python demo_widgets.py")
    print()
    print("📚 Documentação completa:")
    print("   docs/VISAO.md")
    print("   docs/WIDGETS.md")
    print()


if __name__ == "__main__":
    main()
