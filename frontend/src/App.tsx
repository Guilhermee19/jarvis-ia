/**
 * Jarvis IA - Main App Component
 * Dashboard principal do assistente virtual
 */
import { useEffect } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./components/Dashboard";
import TitleBar from "./components/TitleBar";
import { useWebSocket } from "./hooks";
import { useAppStore } from "./store/appStore";

function App() {
  const { setBackendUrl } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Obter URL do backend
    let url = "";
    if (window.electronAPI) {
      url = await window.electronAPI.getBackendUrl();
      const version = await window.electronAPI.getAppVersion();
      console.log("🚀 Jarvis IA v" + version);
    } else {
      url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      console.log("🚀 Jarvis IA (Web Mode)");
    }

    console.log("🔗 Backend:", url);
    setBackendUrl(url);
  };

  // Conectar ao WebSocket
  const backendUrl = useAppStore((state) => state.backendUrl);
  const { isConnected } = useWebSocket(backendUrl);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Custom Title Bar - apenas quando estiver no Electron */}
      {window.electronAPI && <TitleBar />}

      {/* Main App */}
      <div className="flex-1 overflow-auto">
        <DashboardLayout isConnected={isConnected}>
          <Dashboard />
        </DashboardLayout>
      </div>
    </div>
  );
}

export default App;
