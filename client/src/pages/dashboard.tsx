import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SidebarNavigation from "@/components/sidebar-navigation";
import MainContent from "@/components/main-content";
import DetailsPanel from "@/components/details-panel";
import { Stethoscope, Plug } from "lucide-react";

export default function Dashboard() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearchResults = (selection: { code: string; system: string; data: any }) => {
    setSelectedCode(selection.code);
    setSelectedSystem(selection.system);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleCodeSelect = (code: string | null) => {
    setSelectedCode(code);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleSystemSelect = (system: string | null) => {
    setSelectedSystem(system);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-full px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Stethoscope className="text-primary-foreground text-sm lg:text-lg" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-bold text-foreground">ICD-11 & NAMASTE Integration Platform</h1>
                  <p className="text-xs lg:text-sm text-muted-foreground">EMR Healthcare System - FHIR R4 Compliant</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-base font-bold text-foreground">MediSutra</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="bg-gradient-to-r from-primary to-accent text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                <Plug className="w-3 h-3 lg:w-4 lg:h-4 mr-1 inline" />
                <span className="hidden sm:inline">API Connected</span>
                <span className="sm:hidden">Live</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation - Responsive */}
        <div className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-border transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex lg:flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-80 lg:w-80 xl:w-96
        `}>
          <SidebarNavigation 
            onCodeSelect={handleCodeSelect}
            onSystemSelect={handleSystemSelect}
            onSearchResults={handleSearchResults}
          />
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area - Responsive */}
        <div className="flex-1 flex flex-col xl:flex-row min-h-0">
          <div className="flex-1 xl:flex-[2] min-h-0">
            <MainContent 
              selectedCode={selectedCode}
              selectedSystem={selectedSystem}
            />
          </div>
          
          {/* Right Details Panel - Hidden on mobile when no selection, shown on tablet+ */}
          <div className={`
            xl:flex-1 xl:border-l xl:border-border
            ${selectedCode ? 'block' : 'hidden xl:block'}
          `}>
            <DetailsPanel 
              selectedCode={selectedCode}
              selectedSystem={selectedSystem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
