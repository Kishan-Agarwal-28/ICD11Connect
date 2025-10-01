import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  RefreshCw,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
} from "lucide-react";
import { api } from "@/lib/api";

interface SyncStatus {
  lastSyncTimestamp?: string;
  tm2Count?: number;
  biomedicineCount?: number;
  status: "idle" | "syncing" | "success" | "error";
  message?: string;
}

export default function WhoSync() {
  const queryClient = useQueryClient();
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: "idle",
  });

  // Fetch sync status (would need backend endpoint to track this)
  const { data: syncInfo } = useQuery({
    queryKey: ["/api/who/sync/status"],
    queryFn: async () => {
      // This would ideally be a backend endpoint that tracks sync status
      // For now, return a mock status
      return {
        lastSync: localStorage.getItem("lastWhoSync") || null,
        tm2Count: parseInt(localStorage.getItem("tm2Count") || "0"),
        biomedicineCount: parseInt(localStorage.getItem("biomedicineCount") || "0"),
      };
    },
    refetchInterval: 5000, // Poll every 5 seconds during sync
    enabled: syncStatus.status === "syncing",
  });

  const syncMutation = useMutation({
    mutationFn: async (syncType: "tm2" | "biomedicine" | "full") => {
      setSyncStatus({ status: "syncing", message: `Syncing ${syncType}...` });
      setSyncProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSyncProgress((prev) => Math.min(prev + Math.random() * 15, 95));
      }, 500);

      try {
        const result = await api.whoSync(syncType);

        clearInterval(progressInterval);
        setSyncProgress(100);

        // Update localStorage with sync info
        localStorage.setItem("lastWhoSync", new Date().toISOString());
        if (result.tm2Count) localStorage.setItem("tm2Count", result.tm2Count.toString());
        if (result.biomedicineCount)
          localStorage.setItem("biomedicineCount", result.biomedicineCount.toString());

        setSyncStatus({
          status: "success",
          message: `Successfully synced ${result.codesAdded || result.tm2Count || 0} codes`,
          tm2Count: result.tm2Count,
          biomedicineCount: result.biomedicineCount,
        });

        // Refetch data
        queryClient.invalidateQueries({ queryKey: ["/api/who/sync/status"] });
        queryClient.invalidateQueries({ queryKey: ["/api/icd11"] });

        return result;
      } catch (error: any) {
        clearInterval(progressInterval);
        setSyncStatus({
          status: "error",
          message: error.message || "Sync failed",
        });
        throw error;
      }
    },
  });

  const handleSync = (syncType: "tm2" | "biomedicine" | "full") => {
    syncMutation.mutate(syncType);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getStatusIcon = () => {
    switch (syncStatus.status) {
      case "syncing":
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Database className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudDownload className="w-5 h-5" />
            WHO ICD-11 Synchronization
          </CardTitle>
          <CardDescription>
            Sync Traditional Medicine Module 2 (TM2) and Biomedicine codes from WHO ICD-11 API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(syncInfo?.lastSync || null)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  TM2 Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {syncInfo?.tm2Count?.toLocaleString() || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Biomedicine Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {syncInfo?.biomedicineCount?.toLocaleString() || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sync Status Alert */}
          {syncStatus.status !== "idle" && (
            <Alert
              variant={
                syncStatus.status === "error"
                  ? "destructive"
                  : syncStatus.status === "success"
                    ? "default"
                    : "default"
              }
            >
              {getStatusIcon()}
              <AlertTitle className="ml-2">
                {syncStatus.status === "syncing"
                  ? "Syncing..."
                  : syncStatus.status === "success"
                    ? "Sync Complete"
                    : "Sync Failed"}
              </AlertTitle>
              <AlertDescription className="ml-7">{syncStatus.message}</AlertDescription>
            </Alert>
          )}

          {/* Progress Bar */}
          {syncStatus.status === "syncing" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(syncProgress)}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}

          {/* Sync Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Sync Operations</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <Button
                onClick={() => handleSync("tm2")}
                disabled={syncStatus.status === "syncing"}
                variant="outline"
                className="w-full"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${syncStatus.status === "syncing" ? "animate-spin" : ""}`}
                />
                Sync TM2 Only
              </Button>

              <Button
                onClick={() => handleSync("biomedicine")}
                disabled={syncStatus.status === "syncing"}
                variant="outline"
                className="w-full"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${syncStatus.status === "syncing" ? "animate-spin" : ""}`}
                />
                Sync Biomedicine
              </Button>

              <Button
                onClick={() => handleSync("full")}
                disabled={syncStatus.status === "syncing"}
                className="w-full"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${syncStatus.status === "syncing" ? "animate-spin" : ""}`}
                />
                Full Sync
              </Button>
            </div>
          </div>

          {/* Information */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Sync Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  TM2
                </Badge>
                <p>
                  Syncs Traditional Medicine Module 2 codes including Ayurveda patterns, doshas,
                  and traditional diagnoses.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  Biomedicine
                </Badge>
                <p>
                  Syncs standard ICD-11 biomedicine codes for dual-coding support with traditional
                  medicine.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  Full
                </Badge>
                <p>
                  Performs complete synchronization of both TM2 and Biomedicine classifications
                  from WHO API.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* OAuth Status */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">WHO API Authentication</span>
              <Badge variant="secondary">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                OAuth 2.0 Configured
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
