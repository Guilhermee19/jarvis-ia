/**
 * Global Type Declarations
 * Declara tipos globais para TypeScript
 */

interface ElectronAPI {
  getBackendUrl: () => Promise<string>;
  getAppVersion: () => Promise<string>;
  platform: NodeJS.Platform;
  isDev: boolean;
}

interface Window {
  electronAPI: ElectronAPI;
}
