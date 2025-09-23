import { useState } from "react";
import SidebarNavigation from "@/components/sidebar-navigation";
import MainContent from "@/components/main-content";
import DetailsPanel from "@/components/details-panel";
import { Stethoscope, Plug } from "lucide-react";

export default function Dashboard() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Stethoscope className="text-primary-foreground text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">ICD-11 & NAMASTE Integration Platform</h1>
                  <p className="text-sm text-muted-foreground">EMR Healthcare System - FHIR R4 Compliant</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                <Plug className="w-4 h-4 mr-1 inline" />
                API Connected
              </div>
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <SidebarNavigation 
          onCodeSelect={setSelectedCode}
          onSystemSelect={setSelectedSystem}
        />

        {/* Main Content Area */}
        <MainContent 
          selectedCode={selectedCode}
          selectedSystem={selectedSystem}
        />

        {/* Right Details Panel */}
        <DetailsPanel 
          selectedCode={selectedCode}
          selectedSystem={selectedSystem}
        />
      </div>
    </div>
  );
}
