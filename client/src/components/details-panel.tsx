import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, ArrowLeftRight, Download, Settings } from "lucide-react";
import { api } from "@/lib/api";

interface DetailsPanelProps {
  selectedCode: string | null;
  selectedSystem: string | null;
}

export default function DetailsPanel({ selectedCode, selectedSystem }: DetailsPanelProps) {
  const { data: systemStatus } = useQuery({
    queryKey: ["/api/status"],
    queryFn: api.getSystemStatus,
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/activity/recent"],
    queryFn: api.getRecentActivity,
  });

  const mockApiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/namaste/search", 
      description: "Auto-complete search",
      color: "text-accent"
    },
    {
      method: "POST",
      endpoint: "/api/fhir/bundle",
      description: "Upload FHIR Bundle", 
      color: "text-secondary"
    },
    {
      method: "GET",
      endpoint: "/api/icd11/tm2/translate",
      description: "Code translation",
      color: "text-primary"
    }
  ];

  const mockActivity = [
    {
      id: 1,
      type: "mapping",
      title: "Code mapping updated",
      description: "AYU-DIG-001 → 1A00",
      time: "5 minutes ago",
      color: "bg-primary"
    },
    {
      id: 2,
      type: "export", 
      title: "FHIR Bundle exported",
      description: "Patient ID: ABHA-123456",
      time: "12 minutes ago",
      color: "bg-secondary"
    },
    {
      id: 3,
      type: "sync",
      title: "Terminology sync", 
      description: "WHO ICD-11 updated",
      time: "2 hours ago",
      color: "bg-accent"
    }
  ];

  return (
    <aside className="w-80 bg-white border-l border-border overflow-y-auto">
      <div className="p-6">
        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              className="w-full justify-start h-auto p-4 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-add-to-emr"
            >
              <PlusCircle className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Add to EMR</div>
                <div className="text-xs opacity-90">Create FHIR Condition</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              data-testid="button-map-codes"
            >
              <ArrowLeftRight className="w-5 h-5 mr-3 text-accent" />
              <div className="text-left">
                <div className="font-medium">Map Codes</div>
                <div className="text-xs text-muted-foreground">NAMASTE ↔ ICD-11</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              data-testid="button-export-data"
            >
              <Download className="w-5 h-5 mr-3 text-secondary" />
              <div className="text-left">
                <div className="font-medium">Export Data</div>
                <div className="text-xs text-muted-foreground">CSV, JSON, XML</div>
              </div>
            </Button>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            API Endpoints
          </h3>
          <div className="space-y-3 text-sm">
            {mockApiEndpoints.map((endpoint, index) => (
              <Card key={index} className="bg-muted">
                <CardContent className="p-3">
                  <div className={`font-mono text-xs mb-1 ${endpoint.color}`}>{endpoint.method}</div>
                  <div className="font-mono text-xs text-foreground">{endpoint.endpoint}</div>
                  <div className="text-xs text-muted-foreground mt-1">{endpoint.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">NAMASTE Codes</span>
              <span className="text-sm font-medium text-secondary" data-testid="text-namaste-count">4,532 loaded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">ICD-11 TM2</span>
              <span className="text-sm font-medium text-secondary" data-testid="text-icd11-status">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Last Sync</span>
              <span className="text-sm font-medium text-muted-foreground" data-testid="text-last-sync">
                {systemStatus?.lastSync ? new Date(systemStatus.lastSync).toLocaleString() : "2 hours ago"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">API Health</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                <span className="text-sm font-medium text-secondary" data-testid="text-api-health">Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-${activity.id}`}>
                <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
                <div>
                  <div className="text-sm font-medium text-foreground">{activity.title}</div>
                  <div className="text-xs text-muted-foreground">{activity.description}</div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
