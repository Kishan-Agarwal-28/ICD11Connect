import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ExternalLink, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function WhoSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['/api/who/search', activeSearch],
    queryFn: () => api.whoSearch(activeSearch),
    enabled: !!activeSearch,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            WHO ICD-11 Search
          </CardTitle>
          <CardDescription>
            Search the official WHO ICD-11 API for Traditional Medicine (TM2) and Biomedicine codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search WHO ICD-11 (e.g., diabetes, fever, pain)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                Failed to search WHO ICD-11. Please check your API credentials.
              </AlertDescription>
            </Alert>
          )}

          {searchResults && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Results for "{activeSearch}"
                </h3>
                <Badge variant="secondary">
                  {searchResults.results?.length || 0} results
                </Badge>
              </div>

              {searchResults.results && searchResults.results.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.results.map((result: any, index: number) => (
                    <Card key={index} className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{result.title}</h4>
                              {result.theCode && (
                                <Badge variant="outline" className="font-mono text-xs">
                                  {result.theCode}
                                </Badge>
                              )}
                            </div>
                            {result.score && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                Relevance: {(result.score * 100).toFixed(0)}%
                              </div>
                            )}
                          </div>
                          {result.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <a
                                href={result.id}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span className="hidden sm:inline">View</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No results found for "{activeSearch}"
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
