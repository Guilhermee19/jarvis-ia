"""
Ações do sistema (screenshots, limpeza, etc.)
"""
import pyautogui
import subprocess
import os
import time
from ..base import BaseAction, ActionResult


class ScreenshotAction(BaseAction):
    """Captura screenshots da tela"""
    
    def __init__(self):
        super().__init__("print", "Captura screenshots da tela")
        self.screenshot_dir = os.path.join(os.path.expanduser("~"), "Pictures", "Screenshots")
        self._ensure_screenshot_dir()
    
    def _ensure_screenshot_dir(self):
        """Garante que o diretório de screenshots existe"""
        if not os.path.exists(self.screenshot_dir):
            os.makedirs(self.screenshot_dir)
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Captura screenshot
        
        Args:
            alvo: Tipo (tela, janela, area)
            param: Parâmetro adicional
            valor: Nome do arquivo (opcional)
        """
        try:
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            
            if valor:
                filename = f"{valor}_{timestamp}.png"
            else:
                filename = f"screenshot_{timestamp}.png"
            
            filepath = os.path.join(self.screenshot_dir, filename)
            
            # Capturar screenshot
            screenshot = pyautogui.screenshot()
            screenshot.save(filepath)
            
            print(f"  📸 Screenshot salvo: {filename}")
            return ActionResult.SUCCESS
            
        except Exception as e:
            print(f"  ❌ Erro ao capturar screenshot: {e}")
            return ActionResult.FAILED


class CleanupAction(BaseAction):
    """Ações de limpeza do sistema"""
    
    def __init__(self):
        super().__init__("limpar", "Executa limpezas no sistema")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Executa limpeza
        
        Args:
            alvo: Tipo de limpeza (lixeira, temp, cache)
            param: Parâmetro adicional
            valor: Valor específico
        """
        try:
            if not alvo:
                print("  ❌ Tipo de limpeza não especificado")
                return ActionResult.FAILED
            
            alvo = alvo.lower()
            
            if alvo in ["lixeira", "recycle"]:
                return self._clean_recycle_bin()
            elif alvo in ["temp", "temporarios"]:
                return self._clean_temp_files()
            elif alvo in ["cache"]:
                return self._clean_cache()
            else:
                print(f"  ❌ Tipo de limpeza não reconhecido: {alvo}")
                return ActionResult.FAILED
                
        except Exception as e:
            print(f"  ❌ Erro durante limpeza: {e}")
            return ActionResult.FAILED
    
    def _clean_recycle_bin(self) -> ActionResult:
        """Limpa a lixeira (com cuidado)"""
        try:
            # Implementação mais segura - não deletar automaticamente
            print("  🗑️ Limpeza de lixeira solicitada")
            print("  ⚠️ Por segurança, abra a lixeira manualmente para esvaziar")
            
            # Abrir lixeira para o usuário decidir
            os.system("explorer shell:RecycleBinFolder")
            
            return ActionResult.PARTIAL
        except Exception as e:
            print(f"  ❌ Erro ao acessar lixeira: {e}")
            return ActionResult.FAILED
    
    def _clean_temp_files(self) -> ActionResult:
        """Limpa arquivos temporários"""
        try:
            temp_paths = [
                os.environ.get('TEMP'),
                os.environ.get('TMP'),
                os.path.join(os.environ.get('USERPROFILE', ''), 'AppData', 'Local', 'Temp')
            ]
            
            cleaned_files = 0
            
            for temp_path in temp_paths:
                if temp_path and os.path.exists(temp_path):
                    try:
                        files = os.listdir(temp_path)
                        for file in files[:5]:  # Limitar para segurança
                            file_path = os.path.join(temp_path, file)
                            try:
                                if os.path.isfile(file_path):
                                    os.remove(file_path)
                                    cleaned_files += 1
                            except:
                                continue  # Arquivos em uso
                    except:
                        continue
            
            print(f"  🧹 {cleaned_files} arquivos temporários removidos")
            return ActionResult.SUCCESS if cleaned_files > 0 else ActionResult.PARTIAL
            
        except Exception as e:
            print(f"  ❌ Erro ao limpar temporários: {e}")
            return ActionResult.FAILED
    
    def _clean_cache(self) -> ActionResult:
        """Limpa cache do sistema"""
        print("  🧹 Limpeza de cache não implementada por segurança")
        return ActionResult.SKIPPED


class SystemInfoAction(BaseAction):
    """Obtém informações do sistema"""
    
    def __init__(self):
        super().__init__("info", "Obtém informações do sistema")
    
    def execute(self, alvo: str = None, param: str = None, valor: str = None) -> ActionResult:
        """
        Obtém informações do sistema
        
        Args:
            alvo: Tipo de informação (cpu, memoria, disco)
            param: Parâmetro adicional
            valor: Valor específico
        """
        try:
            if not alvo:
                alvo = "geral"
            
            alvo = alvo.lower()
            
            if alvo in ["geral", "sistema"]:
                return self._show_system_info()
            elif alvo in ["cpu", "processador"]:
                return self._show_cpu_info()
            elif alvo in ["memoria", "ram"]:
                return self._show_memory_info()
            elif alvo in ["disco", "storage"]:
                return self._show_disk_info()
            else:
                return self._show_system_info()
                
        except Exception as e:
            print(f"  ❌ Erro ao obter informações: {e}")
            return ActionResult.FAILED
    
    def _show_system_info(self) -> ActionResult:
        """Mostra informações gerais do sistema"""
        try:
            import platform
            print(f"  💻 Sistema: {platform.system()} {platform.release()}")
            print(f"  💻 Arquitetura: {platform.architecture()[0]}")
            print(f"  💻 Processador: {platform.processor()}")
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao obter info do sistema: {e}")
            return ActionResult.FAILED
    
    def _show_cpu_info(self) -> ActionResult:
        """Mostra informações da CPU"""
        print("  💻 Informações detalhadas de CPU não implementadas")
        return ActionResult.PARTIAL
    
    def _show_memory_info(self) -> ActionResult:
        """Mostra informações de memória"""
        print("  💻 Informações detalhadas de memória não implementadas")
        return ActionResult.PARTIAL
    
    def _show_disk_info(self) -> ActionResult:
        """Mostra informações de disco"""
        try:
            import shutil
            
            drives = ['C:\\', 'D:\\', 'E:\\']
            
            for drive in drives:
                if os.path.exists(drive):
                    total, used, free = shutil.disk_usage(drive)
                    total_gb = total // (1024**3)
                    free_gb = free // (1024**3)
                    print(f"  💾 {drive} - Total: {total_gb}GB, Livre: {free_gb}GB")
            
            return ActionResult.SUCCESS
        except Exception as e:
            print(f"  ❌ Erro ao obter info de disco: {e}")
            return ActionResult.FAILED