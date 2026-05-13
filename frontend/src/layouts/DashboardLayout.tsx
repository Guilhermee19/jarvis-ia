/**
 * DashboardLayout Component
 * Layout principal com header, sidebar e área de conteúdo
 */
import { type ReactNode } from "react";
interface DashboardLayoutProps {
  children: ReactNode;
  isConnected: boolean;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-full bg-dark flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
