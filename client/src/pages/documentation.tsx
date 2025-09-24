import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Code2, 
  Database, 
  Globe, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Users,
  FileText
} from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
  const sections = [
    {
      id: "overview",
      title: "Overview",
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        "What is MediSutra?",
        "Key Features",
        "Architecture Overview",
        "Standards Compliance"
      ]
    },
    {
      id: "getting-started",
      title: "Getting Started", 
      icon: <Zap className="w-5 h-5" />,
      items: [
        "Installation",
        "Configuration",
        "First Steps",
        "Basic Usage"
      ]
    },
    {
      id: "code-systems",
      title: "Code Systems",
      icon: <Database className="w-5 h-5" />,
      items: [
        "NAMASTE Codes",
        "ICD-11 Integration",
        "TM2 Patterns",
        "Code Mappings"
      ]
    },
    {
      id: "integration",
      title: "EMR Integration",
      icon: <Globe className="w-5 h-5" />,
      items: [
        "FHIR Resources",
        "Authentication",
        "Data Exchange",
        "Security"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Documentation</h1>
                <p className="text-sm text-muted-foreground">MediSutra Integration Guide</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/api-docs">
                <Button variant="outline" size="sm">
                  <Code2 className="w-4 h-4 mr-2" />
                  API Reference
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">
                  Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Table of Contents</h2>
              {sections.map((section) => (
                <Card key={section.id} className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    {section.icon}
                    <h3 className="font-medium text-sm">{section.title}</h3>
                  </div>
                  <ul className="space-y-1 ml-7">
                    {section.items.map((item, idx) => (
                      <li key={idx}>
                        <a href={`#${section.id}-${idx}`} className="text-xs text-muted-foreground hover:text-foreground">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Overview Section */}
            <section id="overview">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Overview</h1>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="overview-0">What is MediSutra?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    MediSutra is a FHIR R4-compliant terminology microservice that bridges India's traditional medicine 
                    systems with international healthcare standards. It integrates NAMASTE codes (covering Ayurveda, Siddha, 
                    and Unani systems) with WHO ICD-11 Traditional Medicine Module 2 and biomedicine codes.
                  </p>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Dual-Coding Architecture</h4>
                        <p className="text-sm text-muted-foreground">
                          Enables clinicians to record traditional medicine diagnoses using NAMASTE codes while 
                          automatically mapping them to global ICD-11 identifiers for interoperability, analytics, 
                          and insurance claims.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="overview-1">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">4,500+ NAMASTE terminologies</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">WHO ICD-11 TM2 integration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">FHIR R4 compliance</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Auto-complete value-set lookup</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">ABHA OAuth 2.0 security</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Audit-ready metadata</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="overview-2">Architecture Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
{`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   EMR System    │    │  MediSutra   │    │   WHO ICD-11    │
│   (Frontend)    │◄──►│  Microservice   │◄──►│      API        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │              ┌─────────────────┐              
         └─────────────►│  NAMASTE CSV    │              
                        │     Import      │              
                        └─────────────────┘`}
                    </pre>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The system acts as a terminology bridge, ingesting NAMASTE CSV data and synchronizing 
                    with WHO ICD-11 API to provide seamless code translation and mapping services.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Getting Started Section */}
            <section id="getting-started">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Getting Started</h1>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="getting-started-0">Installation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm">
{`# Clone the repository
git clone https://github.com/your-org/MediSutra.git
cd MediSutra

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure database
npm run db:push

# Start development server
npm run dev`}
                    </pre>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">Prerequisites</h4>
                        <p className="text-sm text-amber-700">
                          Requires Node.js 18+, PostgreSQL 14+, and access to WHO ICD-11 API credentials.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="getting-started-1">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Configure your environment variables for database connection and API integration:
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm">
{`# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/MediSutra"

# WHO ICD-11 API
ICD11_API_URL="https://id.who.int/icd/release/11/2024-01"
ICD11_CLIENT_ID="your-client-id"
ICD11_CLIENT_SECRET="your-client-secret"

# ABHA OAuth 2.0
ABHA_CLIENT_ID="your-abha-client-id"
ABHA_CLIENT_SECRET="your-abha-client-secret"
ABHA_REDIRECT_URI="https://your-domain.com/auth/callback"

# Application Settings
PORT=5000
NODE_ENV=development`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Code Systems Section */}
            <section id="code-systems">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Code Systems</h1>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="code-systems-0">NAMASTE Codes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    NAMASTE (National AYUSH Morbidity & Standardized Terminologies Electronic) provides 
                    standardized terms for traditional Indian medicine systems.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-primary/5">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground mb-2">Ayurveda (AYU)</h4>
                        <p className="text-sm text-muted-foreground">Ancient Indian medical system based on doshas and natural healing</p>
                        <Badge className="mt-2 bg-primary/10 text-primary">1,800+ codes</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/5">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground mb-2">Siddha (SID)</h4>
                        <p className="text-sm text-muted-foreground">Traditional South Indian medicine focusing on body constitution</p>
                        <Badge className="mt-2 bg-secondary/10 text-secondary">1,200+ codes</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-accent/5">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground mb-2">Unani (UNA)</h4>
                        <p className="text-sm text-muted-foreground">Greco-Arabic system emphasizing temperament balance</p>
                        <Badge className="mt-2 bg-accent/10 text-accent">1,500+ codes</Badge>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Example NAMASTE Code Structure:</h4>
                    <pre className="text-sm">
{`{
  "code": "AYU-DIG-001",
  "title": "Grahani Roga",
  "description": "Digestive disorders in Ayurveda",
  "system": "AYU",
  "category": "Digestive System",
  "icdMapping": "1A00-1A9Z",
  "tm2Mapping": "TM-GI-001"
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="code-systems-2">TM2 Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    WHO Traditional Medicine Module 2 provides pattern-based coding for traditional medicine 
                    diagnoses within the ICD-11 framework.
                  </p>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">TM2 Pattern Categories:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Digestive system patterns (196 codes)</li>
                      <li>• Respiratory system patterns (145 codes)</li>
                      <li>• Circulatory system patterns (122 codes)</li>
                      <li>• Musculoskeletal patterns (98 codes)</li>
                      <li>• Neurological patterns (87 codes)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Integration Section */}
            <section id="integration">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">EMR Integration</h1>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="integration-0">FHIR Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    MediSutra generates FHIR R4 compliant resources for seamless EMR integration.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          CodeSystem Resource
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Defines NAMASTE code systems and their properties
                        </p>
                        <code className="text-xs bg-background p-1 rounded">CodeSystem/namaste-ayu</code>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          ConceptMap Resource
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Provides mappings between code systems
                        </p>
                        <code className="text-xs bg-background p-1 rounded">ConceptMap/namaste-to-icd11</code>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Example FHIR Bundle:</h4>
                    <pre className="text-sm overflow-x-auto">
{`{
  "resourceType": "Bundle",
  "id": "traditional-medicine-diagnosis",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Condition",
        "id": "condition-grahani-roga",
        "code": {
          "coding": [
            {
              "system": "http://namaste.gov.in/codes",
              "code": "AYU-DIG-001",
              "display": "Grahani Roga"
            },
            {
              "system": "http://id.who.int/icd/release/11/mms",
              "code": "1A00-1A9Z",
              "display": "Gastroenteritis"
            }
          ]
        },
        "subject": {
          "reference": "Patient/patient-abha-123456"
        }
      }
    }
  ]
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle id="integration-3" className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Authentication Standards</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>ABHA OAuth 2.0 integration</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>ISO 22600 access control</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>JWT token validation</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>Role-based permissions</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Data Protection</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>End-to-end encryption</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>Audit trail logging</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>Patient consent tracking</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>Data anonymization</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Support Section */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-0">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Need Help?</h3>
                <p className="text-muted-foreground mb-6">
                  Our team is here to help you integrate MediSutra with your healthcare system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/api-docs">
                    <Button variant="outline">
                      <Code2 className="w-4 h-4 mr-2" />
                      API Documentation
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button>
                      <Zap className="w-4 h-4 mr-2" />
                      Try Live Demo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}