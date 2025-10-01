import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Globe, 
  Shield, 
  Code, 
  ArrowRight, 
  CheckCircle,
  BookOpen,
  Database,
  Users,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const features = [
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Global Standards Compliance",
      description: "Full FHIR R4 compliance with WHO ICD-11 and Traditional Medicine Module 2 integration"
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Secure Authentication",
      description: "ABHA OAuth 2.0 integration with ISO 22600 access control patterns"
    },
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: "Comprehensive Code Library",
      description: "4,500+ NAMASTE codes covering Ayurveda, Siddha, and Unani systems"
    },
    {
      icon: <Code className="w-6 h-6 text-primary" />,
      title: "Dual-Coding Architecture",
      description: "Seamless mapping between traditional medicine and biomedical codes"
    }
  ];

  const stats = [
    { number: "4,500+", label: "NAMASTE Codes" },
    { number: "529", label: "TM2 Categories" },
    { number: "196", label: "Pattern Codes" },
    { number: "100%", label: "FHIR R4 Compliant" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="text-primary-foreground text-sm lg:text-lg" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-foreground">MediSutra</h1>
                <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">Traditional Medicine Integration Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/docs">
                  <Button variant="outline" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </Link>
                <Link href="/api-docs">
                  <Button variant="outline" size="sm">
                    <Code className="w-4 h-4 mr-2" />
                    API Docs
                  </Button>
                </Link>
              </div>
              <Link href="/dashboard">
                <Button size="sm">
                  <span className="hidden sm:inline">Launch Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
          <Badge className="mb-4 lg:mb-6 bg-primary/10 text-primary hover:bg-primary/20 text-xs lg:text-sm">
            FHIR R4 Compliant • Traditional Medicine Integration
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6 leading-tight">
            Bridging Traditional Medicine<br className="hidden sm:block" />
            <span className="text-primary">with Global Standards</span>
          </h1>
          <p className="text-base lg:text-xl text-muted-foreground mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
            MediSutra integrates India's NAMASTE codes with WHO ICD-11 Traditional Medicine Module 2, 
            enabling dual-coding for traditional medicine systems while maintaining full FHIR R4 compliance 
            for modern EMR systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                <Zap className="w-5 h-5 mr-2" />
                Try Live Demo
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <BookOpen className="w-5 h-5 mr-2" />
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Enterprise-Ready Healthcare Integration
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for healthcare providers who need to integrate traditional medicine 
              practices with modern EMR systems while maintaining international standards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/10 text-secondary">
                Traditional Medicine Systems
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Comprehensive Coverage of Indian Traditional Medicine
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                MediSutra provides complete integration with India's traditional medicine systems, 
                supporting healthcare providers in documenting and managing traditional treatments 
                alongside modern medical practices.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Ayurveda (AYU) - Complete diagnostic terminology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Siddha (SID) - Traditional South Indian medicine</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Unani (UNA) - Greco-Arabic medical system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">WHO TM2 - Global traditional medicine patterns</span>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Dual-Coding Architecture
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-border">
                      <div className="text-sm font-medium text-primary mb-1">NAMASTE Code</div>
                      <div className="text-foreground">AYU-DIG-001: Grahani Roga</div>
                      <div className="text-xs text-muted-foreground mt-1">Ayurveda digestive disorder</div>
                    </div>
                    <div className="text-center text-muted-foreground">
                      <ArrowRight className="w-4 h-4 mx-auto" />
                      <div className="text-xs mt-1">Maps to</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-border">
                      <div className="text-sm font-medium text-secondary mb-1">ICD-11 Code</div>
                      <div className="text-foreground">1A00-1A9Z: Gastroenteritis</div>
                      <div className="text-xs text-muted-foreground mt-1">International standard</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* WHO ICD-11 Integration Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              NEW: WHO ICD-11 API Integration
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Powered by WHO ICD-11 API
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Direct integration with WHO's ICD-11 API provides real-time access to Traditional 
              Medicine Module 2 (TM2) and Biomedicine codes with automatic synchronization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">WHO ICD-11 Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Search TM2 and Biomedicine codes directly from WHO's API with real-time results
                </p>
                <Link href="/who-search">
                  <Button variant="outline" size="sm" className="w-full">
                    Try WHO Search
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">NAMASTE CSV Import</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Import NAMASTE codes from CSV and auto-generate FHIR resources
                </p>
                <Link href="/namaste-import">
                  <Button variant="outline" size="sm" className="w-full">
                    Import Codes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">FHIR Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Generate FHIR R4 resources including CodeSystem, ConceptMap, and Condition
                </p>
                <Link href="/fhir-generator">
                  <Button variant="outline" size="sm" className="w-full">
                    Generate FHIR
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Auto-Sync with WHO</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Keep your terminology database up-to-date with automatic synchronization from WHO ICD-11
                </p>
                <Link href="/who-sync">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Sync
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Compliance Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Patient consent and audit trails per India's 2016 EHR Standards and ISO 22600
                </p>
                <Link href="/compliance">
                  <Button variant="outline" size="sm" className="w-full">
                    View Compliance
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Healthcare System?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join healthcare providers worldwide who are bridging traditional medicine 
            with modern EMR systems using MediSutra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Users className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Code className="w-5 h-5 mr-2" />
                Explore API
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Stethoscope className="text-primary-foreground text-sm" />
                </div>
                <span className="font-semibold text-foreground">MediSutra</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Bridging traditional medicine with global healthcare standards.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Documentation</h4>
              <div className="space-y-2 text-sm">
                <Link href="/docs" className="text-muted-foreground hover:text-foreground block">Getting Started</Link>
                <Link href="/api-docs" className="text-muted-foreground hover:text-foreground block">API Reference</Link>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground block">Live Demo</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Standards</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>FHIR R4 Compliant</div>
                <div>WHO ICD-11 Integration</div>
                <div>NAMASTE Certified</div>
                <div>ISO 22600 Security</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Technology</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>React + TypeScript</div>
                <div>Express.js API</div>
                <div>PostgreSQL Database</div>
                <div>Drizzle ORM</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 MediSutra. Built for healthcare innovation and traditional medicine integration.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}