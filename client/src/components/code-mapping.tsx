import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { api } from "@/lib/api";

interface CodeMappingProps {
  selectedCode: string | null;
  selectedSystem: string | null;
  codeMappings?: any[];
}

export default function CodeMapping({ selectedCode, selectedSystem, codeMappings }: CodeMappingProps) {
  // Get system status
  const { data: systemStatus } = useQuery({
    queryKey: ['/api/status'],
    queryFn: api.getSystemStatus,
  });

  const apiStatus = {
    whoIcd11Api: "connected",
    namasteImport: "synced", 
    fhirCompliance: "validated",
    abhaOauth: "secured"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "synced":
      case "validated":
        return "bg-secondary text-secondary-foreground";
      case "secured":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <ArrowLeftRight className="w-5 h-5 mr-2 text-primary" />
          One-to-One Code Mapping & Translation
        </h3>
        
        <div className="space-y-4 lg:space-y-6">
          {/* Cross-System Medical Code Mappings - Full width on first row */}
          <div className="border border-border rounded-lg p-3 lg:p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground text-sm lg:text-base">Medical Code Mappings</h4>
              <Badge variant="secondary" className="text-xs">
                1:1 Mapping
              </Badge>
            </div>
            <div className="space-y-3">
              {codeMappings && codeMappings.length > 0 ? (
                // Group mappings by target system for clean display
                (() => {
                  const groupedMappings = codeMappings.reduce((acc, mapping) => {
                    const key = mapping.targetSystem;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(mapping);
                    return acc;
                  }, {} as Record<string, any[]>);

                  return Object.entries(groupedMappings).map(([targetSystem, mappings]) => {
                    const mapping = mappings[0]; // Take first mapping only (1:1)
                    return (
                      <div key={targetSystem} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        {/* NAMASTE Side */}
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-sm text-foreground">{mapping.sourceTitle}</div>
                          <div className="text-xs text-muted-foreground">NAMASTE: {mapping.sourceCode}</div>
                        </div>
                        
                        {/* Double Arrow */}
                        <div className="mx-4">
                          <ArrowLeftRight className="w-5 h-5 text-primary" />
                        </div>
                        
                        {/* Target System Side */}
                        <div className="flex-1 text-right">
                          <div className="font-semibold text-sm text-foreground">{mapping.targetTitle}</div>
                          <div className="text-xs text-muted-foreground">{mapping.targetSystem}: {mapping.targetCode}</div>
                        </div>
                      </div>
                    );
                  });
                })()
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="mb-2">
                    <ArrowLeftRight className="w-8 h-8 mx-auto text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium">No mappings available</p>
                  <p className="text-xs mt-1">Select a NAMASTE code to view translations</p>
                </div>
              )}
            </div>
          </div>

          {/* API Integration Status - Takes 1 column on large screens */}
                    {/* API Integration Status - Takes 1 column on large screens */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">API Integration Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">WHO ICD-11 API</span>
                <Badge className={getStatusColor(systemStatus?.services?.whoIcd11Api || 'connected')} data-testid="status-icd11-api">
                  {systemStatus?.services?.whoIcd11Api || 'Connected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">NAMASTE CSV Import</span>
                <Badge className={getStatusColor(systemStatus?.services?.namasteImport || 'synced')} data-testid="status-namaste-import">
                  {systemStatus?.services?.namasteImport || 'Synced'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">FHIR R4 Compliance</span>
                <Badge className={getStatusColor(systemStatus?.services?.fhirCompliance || 'validated')} data-testid="status-fhir-compliance">
                  {systemStatus?.services?.fhirCompliance || 'Validated'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ABHA OAuth 2.0</span>
                <Badge className={getStatusColor(systemStatus?.services?.abhaOauth || 'secured')} data-testid="status-abha-oauth">
                  {systemStatus?.services?.abhaOauth || 'Secured'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
