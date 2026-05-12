import { contextBridge, ipcRenderer } from "electron";
//#region src/preload.ts
/**
* Electron Preload Script
* Expõe APIs seguras do Electron para o renderer process via contextBridge
*/
var electronAPI = {
	/**
	* Obter URL do backend
	*/
	getBackendUrl: () => {
		return ipcRenderer.invoke("get-backend-url");
	},
	/**
	* Obter versão do app
	*/
	getAppVersion: () => {
		return ipcRenderer.invoke("app-version");
	},
	/**
	* Informações da plataforma
	*/
	platform: process.platform,
	/**
	* Verificar se está em modo desenvolvimento
	*/
	isDev: process.env.NODE_ENV === "development"
};
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
console.log("⚡ Preload script carregado");
//#endregion
