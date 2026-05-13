/**
 * Electron Preload Script
 * Expõe APIs seguras do Electron para o renderer process via contextBridge
 */
import { contextBridge, ipcRenderer } from 'electron';

// APIs expostas para o renderer
const electronAPI = {
  /**
   * Obter URL do backend
   */
  getBackendUrl: (): Promise<string> => {
    return ipcRenderer.invoke('get-backend-url');
  },
  
  /**
   * Obter versão do app
   */
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke('app-version');
  },
  
  /**
   * Controles de janela
   */
  window: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window-is-maximized'),
  },
  
  /**
   * Informações da plataforma
   */
  platform: process.platform,
  
  /**
   * Verificar se está em modo desenvolvimento
   */
  isDev: process.env.NODE_ENV === 'development',
};

// Expor APIs de forma segura
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Types para TypeScript (opcional - pode ser declarado em um .d.ts separado)
export type ElectronAPI = typeof electronAPI;

// Log de inicialização
console.log('⚡ Preload script carregado');
