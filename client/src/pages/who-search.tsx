import WhoSearch from "@/components/who-search";
import AppNavigation from "@/components/app-navigation";

export default function WhoSearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">WHO ICD-11 Search</h1>
          <p className="text-muted-foreground">
            Search Traditional Medicine Module 2 (TM2) and Biomedicine codes from WHO ICD-11 API
          </p>
        </div>
        <WhoSearch />
      </div>
    </div>
  );
}
