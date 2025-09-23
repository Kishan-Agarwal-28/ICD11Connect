import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  onSearchResults?: (results: any) => void;
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/search", searchQuery],
    queryFn: () => searchQuery ? api.search(searchQuery) : null,
    enabled: searchQuery.length >= 2,
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchResults && onSearchResults) {
      onSearchResults(searchResults);
    }
  };

  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium text-foreground mb-2">
        Search ICD-11 & NAMASTE Codes
      </Label>
      <div className="relative">
        <Input
          type="text"
          className="w-full px-4 py-3 pr-10 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Search codes, descriptions, or symptoms..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          data-testid="input-search"
        />
        <Search className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground" />
        {isLoading && (
          <div className="absolute right-10 top-3.5 w-4 h-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground flex items-center">
        <Info className="w-3 h-3 mr-1" />
        Auto-complete enabled for 4,500+ NAMASTE terms
      </div>
      
      {searchResults && (
        <div className="mt-2 text-xs text-muted-foreground">
          Found {searchResults.totalResults} results for "{searchQuery}"
          {searchResults.totalResults > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto border border-border rounded-md bg-white">
              {searchResults.results.icdCodes.slice(0, 3).map((code: any) => (
                <div key={code.id} className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0">
                  <div className="text-xs font-medium text-primary">{code.code}</div>
                  <div className="text-xs text-foreground">{code.title}</div>
                </div>
              ))}
              {searchResults.results.namasteCodes.slice(0, 3).map((code: any) => (
                <div key={code.id} className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0">
                  <div className="text-xs font-medium text-secondary">{code.code}</div>
                  <div className="text-xs text-foreground">{code.title}</div>
                </div>
              ))}
              {searchResults.results.tm2Codes.slice(0, 3).map((code: any) => (
                <div key={code.id} className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0">
                  <div className="text-xs font-medium text-accent">{code.code}</div>
                  <div className="text-xs text-foreground">{code.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
