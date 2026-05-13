/**
 * Global Type Declarations
 * Declara tipos globais para TypeScript
 */

interface ElectronAPI {
  getBackendUrl: () => Promise<string>;
  getAppVersion: () => Promise<string>;
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => Promise<boolean>;
  };
  platform: NodeJS.Platform;
  isDev: boolean;
}

interface Window {
  electronAPI: ElectronAPI;
}
