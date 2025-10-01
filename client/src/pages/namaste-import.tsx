import NamesteImport from "@/components/namaste-import";
import AppNavigation from "@/components/app-navigation";

export default function NamesteImportPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">NAMASTE Code Import</h1>
          <p className="text-muted-foreground">
            Import NAMASTE codes from CSV and generate FHIR CodeSystem and ConceptMap resources
          </p>
        </div>
        <NamesteImport />
      </div>
    </div>
  );
}
