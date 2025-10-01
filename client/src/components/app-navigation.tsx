import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Upload, FileJson, RefreshCw, ShieldCheck, Stethoscope, GraduationCap } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function AppNavigation() {
  const [isDashboard] = useRoute("/dashboard");
  const [isWhoSearch] = useRoute("/who-search");
  const [isImport] = useRoute("/namaste-import");
  const [isFhir] = useRoute("/fhir-generator");
  const [isSync] = useRoute("/who-sync");
  const [isCompliance] = useRoute("/compliance");
  const [isLearn] = useRoute("/learn-ayurveda");

  const getVariant = (isActive: boolean) => (isActive ? "default" : "ghost");

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-full px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Stethoscope className="text-primary-foreground text-sm lg:text-lg" />
                </div>
                <div>
                  <h1 className="text-lg lg:text-xl font-bold text-foreground">MediSutra</h1>
                  <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">
                    WHO ICD-11 Integration Platform
                  </p>
                </div>
              </div>
            </Link>
            <Badge variant="secondary" className="text-xs">
              FHIR R4 • ISO 22600
            </Badge>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-full px-4 lg:px-6">
          <div className="flex items-center space-x-1 overflow-x-auto py-2">
            <Link href="/dashboard">
              <Button variant={getVariant(isDashboard)} size="sm" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Code Browser</span>
                <span className="sm:hidden">Browser</span>
              </Button>
            </Link>
            <Link href="/who-search">
              <Button variant={getVariant(isWhoSearch)} size="sm" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">WHO Search</span>
                <span className="sm:hidden">Search</span>
                <Badge variant="secondary" className="hidden md:inline text-xs">NEW</Badge>
              </Button>
            </Link>
            <Link href="/namaste-import">
              <Button variant={getVariant(isImport)} size="sm" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">CSV Import</span>
                <span className="sm:hidden">Import</span>
              </Button>
            </Link>
            <Link href="/fhir-generator">
              <Button variant={getVariant(isFhir)} size="sm" className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                <span className="hidden sm:inline">FHIR Generator</span>
                <span className="sm:hidden">FHIR</span>
              </Button>
            </Link>
            <Link href="/who-sync">
              <Button variant={getVariant(isSync)} size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">WHO Sync</span>
                <span className="sm:hidden">Sync</span>
              </Button>
            </Link>
            <Link href="/compliance">
              <Button variant={getVariant(isCompliance)} size="sm" className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Compliance</span>
              </Button>
            </Link>
            <Link href="/learn-ayurveda">
              <Button variant={getVariant(isLearn)} size="sm" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Learn Ayurveda</span>
                <span className="sm:hidden">Learn</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
