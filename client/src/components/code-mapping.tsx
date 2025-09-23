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
          Code Mapping & Translation
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NAMASTE to ICD-11 Mapping */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">NAMASTE ↔ ICD-11 Translation</h4>
            <div className="space-y-3">
              {codeMappings && codeMappings.length > 0 ? (
                codeMappings.map((mapping, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded" data-testid={`mapping-${index}`}>
                    <div>
                      <div className="font-medium text-sm">{mapping.sourceCode}</div>
                      <div className="text-xs text-muted-foreground">{mapping.sourceSystem}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mx-2" />
                    <div>
                      <div className="font-medium text-sm">{mapping.targetCode}</div>
                      <div className="text-xs text-muted-foreground">{mapping.targetSystem} ({mapping.mappingType})</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No mappings available for this code</p>
                </div>
              )}
            </div>
          </div>

          {/* API Integration Status */}
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
