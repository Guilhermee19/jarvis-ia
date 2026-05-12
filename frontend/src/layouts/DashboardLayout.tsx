/**
 * DashboardLayout Component
 * Layout principal com header, sidebar e área de conteúdo
 */
import { useState, type ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  isConnected: boolean;
}

export default function DashboardLayout({
  children,
  isConnected,
}: DashboardLayoutProps) {
  const [activeView, setActiveView] = useState("dashboard");

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    // TODO: Abrir modal de configurações
  };

  const handleMinimize = () => {
    // TODO: Implementar minimize window
    console.log("Minimize");
  };

  const handleMaximize = () => {
    // TODO: Implementar maximize window
    console.log("Maximize");
  };

  const handleClose = () => {
    // TODO: Implementar close window
    console.log("Close");
  };

  return (
    <div className="h-svh bg-dark flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        isConnected={isConnected}
        onSettingsClick={handleSettingsClick}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem={activeView} onItemClick={setActiveView} />

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
