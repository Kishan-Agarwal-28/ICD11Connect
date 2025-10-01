import ConsentManager from "@/components/consent-manager";
import AuditViewer from "@/components/audit-viewer";
import AppNavigation from "@/components/app-navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Compliance Management</h1>
          <p className="text-muted-foreground">
            Manage patient consent and view audit trails per India's 2016 EHR Standards and ISO 22600
          </p>
        </div>

      <Tabs defaultValue="consent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="consent">Consent Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="consent" className="mt-6">
          <ConsentManager />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditViewer />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
