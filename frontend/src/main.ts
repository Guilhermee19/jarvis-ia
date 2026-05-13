/**
 * Electron Main Process
 * Gerencia janela principal, processo Python e lifecycle do app
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let pythonProcess: ChildProcess | null = null;
const isDev = process.env.NODE_ENV === 'development';
const BACKEND_PORT = process.env.BACKEND_PORT || 5000;

/**
 * Aguarda o servidor backend estar pronto
 */
async function waitForServer(url: string, timeout: number = 30000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) {
        console.log('✅ Backend servidor está pronto');
        return true;
      }
    } catch (error) {
      // Servidor ainda não está pronto
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.error('❌ Timeout aguardando backend');
  return false;
}

/**
 * Inicia o processo Python do backend
 */
async function startPythonBackend(): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('🐍 Iniciando backend Python...');
    
    // Determinar caminho do Python
    let pythonPath: string;
    let backendPath: string;
    
    if (isDev) {
      // Em desenvolvimento: usa Python do venv
      pythonPath = process.platform === 'win32'
        ? path.join(app.getAppPath(), '..', '.venv', 'Scripts', 'python.exe')
        : path.join(app.getAppPath(), '..', '.venv', 'bin', 'python');
      
      backendPath = path.join(app.getAppPath(), '..', 'backend', 'app.py');
    } else {
      // Em produção: usa Python bundled
      pythonPath = process.platform === 'win32'
        ? path.join(process.resourcesPath, 'python', 'python.exe')
        : path.join(process.resourcesPath, 'python', 'bin', 'python');
      
      backendPath = path.join(process.resourcesPath, 'backend', 'app.py');
    }
    
    console.log(`Python path: ${pythonPath}`);
    console.log(`Backend path: ${backendPath}`);
    
    // Verificar se os arquivos existem
    if (!fs.existsSync(pythonPath)) {
      console.error(`❌ Python não encontrado em: ${pythonPath}`);
      // Em dev, tentar python global
      pythonPath = 'python';
    }
    
    if (!fs.existsSync(backendPath)) {
      console.error(`❌ Backend não encontrado em: ${backendPath}`);
      resolve(false);
      return;
    }
    
    // Spawn processo Python
    pythonProcess = spawn(pythonPath, [backendPath], {
      env: {
        ...process.env,
        PORT: String(BACKEND_PORT),
        PYTHONUNBUFFERED: '1',
      },
      cwd: path.dirname(backendPath),
    });
    
    // Logs do processo Python
    pythonProcess.stdout?.on('data', (data: Buffer) => {
      console.log(`[Backend] ${data.toString().trim()}`);
    });
    
    pythonProcess.stderr?.on('data', (data: Buffer) => {
      console.error(`[Backend Error] ${data.toString().trim()}`);
    });
    
    pythonProcess.on('error', (error: Error) => {
      console.error('❌ Erro ao iniciar backend:', error);
      resolve(false);
    });
    
    pythonProcess.on('exit', (code: number | null) => {
      console.log(`Backend finalizou com código: ${code}`);
      pythonProcess = null;
    });
    
    // Aguarda servidor estar pronto
    setTimeout(async () => {
      const ready = await waitForServer(`http://localhost:${BACKEND_PORT}`);
      resolve(ready);
    }, 2000);
  });
}

/**
 * Cria a janela principal do Electron
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#050c18',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    // Remover frame padrão para UI customizada
    frame: false,
    show: false, // Não mostrar até estar pronto
  });
  
  // Remover menu bar
  mainWindow.setMenuBarVisibility(false);
  
  // Carregar app
  if (isDev) {
    // Em dev: carregar do Vite dev server
    const VITE_DEV_SERVER = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    mainWindow.loadURL(VITE_DEV_SERVER);
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção: carregar arquivo HTML
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
  
  // Mostrar quando pronto
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    console.log('✅ Janela principal pronta');
  });
  
  // Cleanup
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Finalizar processo Python ao fechar app
 */
function killPythonProcess(): void {
  if (pythonProcess) {
    console.log('🛑 Finalizando backend Python...');
    pythonProcess.kill();
    pythonProcess = null;
  }
}

// Lifecycle do App
app.on('ready', async () => {
  console.log('🚀 Jarvis IA iniciando...');
  
  // Iniciar backend
  const backendStarted = await startPythonBackend();
  
  if (!backendStarted) {
    console.error('❌ Falha ao iniciar backend');
    app.quit();
    return;
  }
  
  // Criar janela
  createWindow();
});

app.on('window-all-closed', () => {
  killPythonProcess();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  killPythonProcess();
});

// IPC Handlers
ipcMain.handle('get-backend-url', () => {
  return `http://localhost:${BACKEND_PORT}`;
});

ipcMain.handle('app-version', () => {
  return app.getVersion();
});

// Window Controls
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window-close', () => {
  mainWindow?.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized() || false;
});

// Log não tratado
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});
