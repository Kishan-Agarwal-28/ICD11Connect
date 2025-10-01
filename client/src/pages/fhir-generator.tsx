import FhirGenerator from "@/components/fhir-generator";
import AppNavigation from "@/components/app-navigation";

export default function FhirGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">FHIR Resource Generator</h1>
          <p className="text-muted-foreground">
            Generate FHIR R4 compliant resources including CodeSystem, ConceptMap, Condition, and Bundle
          </p>
        </div>
        <FhirGenerator />
      </div>
    </div>
  );
}
