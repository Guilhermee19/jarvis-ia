import { BrowserWindow, app, ipcMain } from "electron";
import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
//#region src/main.ts
/**
* Electron Main Process
* Gerencia janela principal, processo Python e lifecycle do app
*/
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var mainWindow = null;
var pythonProcess = null;
var isDev = process.env.NODE_ENV === "development";
var BACKEND_PORT = process.env.BACKEND_PORT || 5e3;
/**
* Aguarda o servidor backend estar pronto
*/
async function waitForServer(url, timeout = 3e4) {
	const startTime = Date.now();
	while (Date.now() - startTime < timeout) try {
		if ((await fetch(`${url}/health`)).ok) {
			console.log("✅ Backend servidor está pronto");
			return true;
		}
	} catch (error) {
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
	console.error("❌ Timeout aguardando backend");
	return false;
}
/**
* Inicia o processo Python do backend
*/
async function startPythonBackend() {
	return new Promise((resolve) => {
		console.log("🐍 Iniciando backend Python...");
		let pythonPath;
		let backendPath;
		if (isDev) {
			pythonPath = process.platform === "win32" ? path.join(app.getAppPath(), "..", ".venv", "Scripts", "python.exe") : path.join(app.getAppPath(), "..", ".venv", "bin", "python");
			backendPath = path.join(app.getAppPath(), "..", "backend", "app.py");
		} else {
			pythonPath = process.platform === "win32" ? path.join(process.resourcesPath, "python", "python.exe") : path.join(process.resourcesPath, "python", "bin", "python");
			backendPath = path.join(process.resourcesPath, "backend", "app.py");
		}
		console.log(`Python path: ${pythonPath}`);
		console.log(`Backend path: ${backendPath}`);
		if (!fs.existsSync(pythonPath)) {
			console.error(`❌ Python não encontrado em: ${pythonPath}`);
			pythonPath = "python";
		}
		if (!fs.existsSync(backendPath)) {
			console.error(`❌ Backend não encontrado em: ${backendPath}`);
			resolve(false);
			return;
		}
		pythonProcess = spawn(pythonPath, [backendPath], {
			env: {
				...process.env,
				PORT: String(BACKEND_PORT),
				PYTHONUNBUFFERED: "1"
			},
			cwd: path.dirname(backendPath)
		});
		pythonProcess.stdout?.on("data", (data) => {
			console.log(`[Backend] ${data.toString().trim()}`);
		});
		pythonProcess.stderr?.on("data", (data) => {
			console.error(`[Backend Error] ${data.toString().trim()}`);
		});
		pythonProcess.on("error", (error) => {
			console.error("❌ Erro ao iniciar backend:", error);
			resolve(false);
		});
		pythonProcess.on("exit", (code) => {
			console.log(`Backend finalizou com código: ${code}`);
			pythonProcess = null;
		});
		setTimeout(async () => {
			resolve(await waitForServer(`http://localhost:${BACKEND_PORT}`));
		}, 2e3);
	});
}
/**
* Cria a janela principal do Electron
*/
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 900,
		minWidth: 1200,
		minHeight: 700,
		backgroundColor: "#050c18",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false
		},
		titleBarStyle: "hidden",
		show: false
	});
	mainWindow.setMenuBarVisibility(false);
	if (isDev) {
		const VITE_DEV_SERVER = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
		mainWindow.loadURL(VITE_DEV_SERVER);
		mainWindow.webContents.openDevTools();
	} else mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
	mainWindow.once("ready-to-show", () => {
		mainWindow?.show();
		console.log("✅ Janela principal pronta");
	});
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}
/**
* Finalizar processo Python ao fechar app
*/
function killPythonProcess() {
	if (pythonProcess) {
		console.log("🛑 Finalizando backend Python...");
		pythonProcess.kill();
		pythonProcess = null;
	}
}
app.on("ready", async () => {
	console.log("🚀 Jarvis IA iniciando...");
	if (!await startPythonBackend()) {
		console.error("❌ Falha ao iniciar backend");
		app.quit();
		return;
	}
	createWindow();
});
app.on("window-all-closed", () => {
	killPythonProcess();
	if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on("before-quit", () => {
	killPythonProcess();
});
ipcMain.handle("get-backend-url", () => {
	return `http://localhost:${BACKEND_PORT}`;
});
ipcMain.handle("app-version", () => {
	return app.getVersion();
});
process.on("uncaughtException", (error) => {
	console.error("❌ Uncaught Exception:", error);
});
process.on("unhandledRejection", (reason) => {
	console.error("❌ Unhandled Rejection:", reason);
});
//#endregion
