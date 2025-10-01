import WhoSync from "@/components/who-sync";
import AppNavigation from "@/components/app-navigation";

export default function WhoSyncPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">WHO ICD-11 Synchronization</h1>
          <p className="text-muted-foreground">
            Sync TM2 and Biomedicine codes from WHO ICD-11 API and monitor sync status
          </p>
        </div>
        <WhoSync />
      </div>
    </div>
  );
}
