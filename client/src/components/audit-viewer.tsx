import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Filter, Download, RefreshCw, Eye } from "lucide-react";
import { api } from "@/lib/api";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  outcome: string;
  details?: any;
}

export default function AuditViewer() {
  const [filters, setFilters] = useState({
    userId: "",
    action: "all",
    startDate: "",
    endDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Fetch audit trail
  const { data: auditLogs, isLoading, refetch } = useQuery({
    queryKey: ["/api/audit/trail", appliedFilters],
    queryFn: async () => {
      // Note: The current API signature is auditGetTrail(entityType?, entityId?, limit?)
      // For now, we'll return empty array. This would need backend endpoint updates
      // to support filtering by userId, action, dates
      return await api.auditGetTrail();
    },
  });

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      userId: "",
      action: "all",
      startDate: "",
      endDate: "",
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const handleExport = () => {
    if (auditLogs) {
      const csv = convertToCSV(auditLogs);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-trail-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const convertToCSV = (logs: AuditLogEntry[]): string => {
    const headers = ["Timestamp", "User ID", "Action", "Resource Type", "Resource ID", "IP Address", "Outcome"];
    const rows = logs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.userId,
      log.action,
      log.resourceType,
      log.resourceId || "",
      log.ipAddress || "",
      log.outcome,
    ]);

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(timestamp));
  };

  const getOutcomeBadge = (outcome: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      success: "default",
      failure: "destructive",
      partial: "secondary",
    };

    return (
      <Badge variant={variants[outcome.toLowerCase()] || "secondary"}>
        {outcome}
      </Badge>
    );
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: "text-green-600",
      READ: "text-blue-600",
      UPDATE: "text-yellow-600",
      DELETE: "text-red-600",
      SEARCH: "text-purple-600",
      EXPORT: "text-indigo-600",
    };

    return colors[action.toUpperCase()] || "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Audit Trail Viewer
          </CardTitle>
          <CardDescription>
            View and filter audit logs per ISO 22600 compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="Filter by user..."
                    value={filters.userId}
                    onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action">Action Type</Label>
                  <Select
                    value={filters.action}
                    onValueChange={(value) => setFilters({ ...filters, action: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="CREATE">Create</SelectItem>
                      <SelectItem value="READ">Read</SelectItem>
                      <SelectItem value="UPDATE">Update</SelectItem>
                      <SelectItem value="DELETE">Delete</SelectItem>
                      <SelectItem value="SEARCH">Search</SelectItem>
                      <SelectItem value="EXPORT">Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleApplyFilters} className="flex-1">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {auditLogs?.length || 0} log entries
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm" disabled={!auditLogs?.length}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Audit Log Table */}
          <Card>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Loading audit logs...
                      </TableCell>
                    </TableRow>
                  ) : auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log: AuditLogEntry) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.userId}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{log.resourceType}</div>
                            {log.resourceId && (
                              <div className="text-xs text-muted-foreground font-mono">
                                {log.resourceId}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.ipAddress || "—"}
                        </TableCell>
                        <TableCell>
                          {getOutcomeBadge(log.outcome)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>

          {/* Compliance Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-blue-900">ISO 22600 Compliance</p>
                  <p className="text-blue-700">
                    All access to patient records and terminology data is logged per India's 2016
                    EHR Standards. Audit trails are retained for regulatory compliance and security
                    monitoring.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
