import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SearchBar from "./search-bar";
import TreeNavigation from "./tree-navigation";
import { Table } from "lucide-react";

interface SidebarNavigationProps {
  onCodeSelect: (code: string | null) => void;
  onSystemSelect: (system: string | null) => void;
  onSearchResults?: (selection: { code: string; system: string; data: any }) => void;
}

export default function SidebarNavigation({ onCodeSelect, onSystemSelect, onSearchResults }: SidebarNavigationProps) {
  const [filters, setFilters] = useState({
    icd11: true,
    namaste: true,
    tm2: true,
  });

  const handleFilterChange = (filter: keyof typeof filters, checked: boolean) => {
    setFilters(prev => ({ ...prev, [filter]: checked }));
  };

  return (
    <aside className="w-80 bg-white border-r border-border overflow-y-auto">
      <div className="p-6">
        {/* Search Bar */}
        <SearchBar onSearchResults={onSearchResults} />

        {/* Filter Options */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Filter by System</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-icd11"
                checked={filters.icd11}
                onCheckedChange={(checked) => handleFilterChange('icd11', checked as boolean)}
                data-testid="checkbox-filter-icd11"
              />
              <Label htmlFor="filter-icd11" className="text-sm text-foreground">
                ICD-11 (International)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-namaste"
                checked={filters.namaste}
                onCheckedChange={(checked) => handleFilterChange('namaste', checked as boolean)}
                data-testid="checkbox-filter-namaste"
              />
              <Label htmlFor="filter-namaste" className="text-sm text-foreground">
                NAMASTE (India)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-tm2"
                checked={filters.tm2}
                onCheckedChange={(checked) => handleFilterChange('tm2', checked as boolean)}
                data-testid="checkbox-filter-tm2"
              />
              <Label htmlFor="filter-tm2" className="text-sm text-foreground">
                Traditional Medicine (TM2)
              </Label>
            </div>
          </div>
        </div>

        {/* Hierarchical Navigation Tree */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Table className="w-4 h-4 mr-2" />
            ICD-11 Categories
          </h3>
          
          <TreeNavigation 
            filters={filters}
            onCodeSelect={onCodeSelect}
            onSystemSelect={onSystemSelect}
          />
        </div>
      </div>
    </aside>
  );
}
