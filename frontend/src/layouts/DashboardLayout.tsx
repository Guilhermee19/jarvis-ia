/**
 * DashboardLayout Component
 * Layout principal com header, sidebar e área de conteúdo
 */
import { useState, type ReactNode } from "react";
import Sidebar from "../components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  isConnected: boolean;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="h-full bg-dark flex flex-col overflow-hidden">
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
