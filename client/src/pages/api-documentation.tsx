import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code2, 
  ArrowLeft, 
  Globe, 
  Database, 
  Search, 
  FileText,
  ArrowRight,
  CheckCircle,
  Copy,
  Play
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Define proper types for endpoints
type EndpointParam = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

type ApiEndpoint = {
  method: string;
  path: string;
  description: string;
  params: EndpointParam[];
  requestBody?: any;
  response: any;
};

type EndpointCategory = {
  category: string;
  icon: React.ReactNode;
  endpoints: ApiEndpoint[];
};

export default function ApiDocumentation() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "Code example copied successfully" });
  };

  const endpoints: EndpointCategory[] = [
    {
      category: "Search",
      icon: <Search className="w-5 h-5" />,
      endpoints: [
        {
          method: "GET",
          path: "/api/search",
          description: "Global search across all code systems",
          params: [
            { name: "q", type: "string", required: true, description: "Search query string" }
          ],
          response: {
            query: "cholera",
            totalResults: 3,
            results: {
              icdCodes: [
                {
                  id: "uuid-1",
                  code: "1A00",
                  title: "Cholera",
                  description: "An acute diarrhoeal infection...",
                  chapter: "01",
                  category: "Category"
                }
              ],
              namasteCodes: [],
              tm2Codes: []
            }
          }
        }
      ]
    },
    {
      category: "ICD-11",
      icon: <Globe className="w-5 h-5" />,
      endpoints: [
        {
          method: "GET",
          path: "/api/icd11/hierarchy",
          description: "Get ICD-11 hierarchical structure",
          params: [],
          response: [
            {
              id: "uuid-1",
              code: "01",
              title: "Certain infectious or parasitic diseases",
              children: ["1A00-1A9Z", "1B10-1B1Z"]
            }
          ]
        },
        {
          method: "GET",
          path: "/api/icd11/code/{code}",
          description: "Get specific ICD-11 code details",
          params: [
            { name: "code", type: "string", required: true, description: "ICD-11 code identifier" }
          ],
          response: {
            id: "uuid-1",
            code: "1A00",
            title: "Cholera",
            description: "An acute diarrhoeal infection caused by ingestion of food or water...",
            chapter: "01",
            category: "Category",
            parentCode: "1A00-1A9Z"
          }
        }
      ]
    },
    {
      category: "NAMASTE",
      icon: <Database className="w-5 h-5" />,
      endpoints: [
        {
          method: "GET",
          path: "/api/namaste/system/{system}",
          description: "Get codes by traditional medicine system",
          params: [
            { name: "system", type: "string", required: true, description: "System code (AYU, SID, UNA)" }
          ],
          response: [
            {
              id: "uuid-1",
              code: "AYU-DIG-001",
              title: "Grahani Roga",
              system: "AYU",
              category: "Digestive System",
              icdMapping: "1A00-1A9Z"
            }
          ]
        },
        {
          method: "GET",
          path: "/api/namaste/code/{code}",
          description: "Get specific NAMASTE code details",
          params: [
            { name: "code", type: "string", required: true, description: "NAMASTE code identifier" }
          ],
          response: {
            id: "uuid-1",
            code: "AYU-DIG-001",
            title: "Grahani Roga",
            description: "Digestive disorders characterized by irregular bowel movements...",
            system: "AYU",
            category: "Digestive System",
            icdMapping: "1A00-1A9Z",
            tm2Mapping: "TM-GI-001"
          }
        }
      ]
    },
    {
      category: "Code Mapping",
      icon: <ArrowRight className="w-5 h-5" />,
      endpoints: [
        {
          method: "GET",
          path: "/api/mapping/{sourceSystem}/{sourceCode}/{targetSystem}",
          description: "Translate code between systems",
          params: [
            { name: "sourceSystem", type: "string", required: true, description: "Source system (NAMASTE, ICD-11, TM2)" },
            { name: "sourceCode", type: "string", required: true, description: "Source code identifier" },
            { name: "targetSystem", type: "string", required: true, description: "Target system for translation" }
          ],
          response: [
            {
              id: "uuid-1",
              sourceSystem: "NAMASTE",
              sourceCode: "AYU-DIG-001",
              targetSystem: "ICD-11",
              targetCode: "1A00-1A9Z",
              mappingType: "related",
              confidence: "high"
            }
          ]
        }
      ]
    },
    {
      category: "FHIR",
      icon: <FileText className="w-5 h-5" />,
      endpoints: [
        {
          method: "POST",
          path: "/api/fhir/bundle",
          description: "Submit FHIR Bundle with traditional medicine codes",
          params: [],
          requestBody: {
            resourceType: "Bundle",
            id: "traditional-medicine-diagnosis",
            type: "collection",
            entry: [
              {
                resource: {
                  resourceType: "Condition",
                  id: "condition-1",
                  code: {
                    coding: [
                      {
                        system: "http://namaste.gov.in/codes",
                        code: "AYU-DIG-001",
                        display: "Grahani Roga"
                      }
                    ]
                  }
                }
              }
            ]
          },
          response: {
            message: "FHIR Bundle processed successfully",
            bundleId: "traditional-medicine-diagnosis",
            entries: 1
          }
        }
      ]
    }
  ];

  const authExample = `// Authentication with ABHA OAuth 2.0
const response = await fetch('/api/auth/abha', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-abha-token'
  },
  body: JSON.stringify({
    client_id: 'your-client-id',
    redirect_uri: 'https://your-app.com/callback'
  })
});`;

  const sdkExample = `// JavaScript SDK Example
import { MediSutra } from '@MediSutra/sdk';

const client = new MediSutra({
  apiKey: 'your-api-key',
  baseURL: 'https://api.MediSutra.org'
});

// Search for codes
const results = await client.search('grahani roga');

// Get code mappings
const mappings = await client.translateCode('NAMASTE', 'AYU-DIG-001', 'ICD-11');

// Create FHIR bundle
const bundle = await client.createFHIRBundle({
  patientId: 'ABHA-123456',
  codes: ['AYU-DIG-001', '1A00-1A9Z']
});`;

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
                <h1 className="text-xl font-bold text-foreground">API Documentation</h1>
                <p className="text-sm text-muted-foreground">RESTful API for Traditional Medicine Integration</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/docs">
                <Button variant="outline" size="sm">
                  Documentation
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Try API
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">REST API Reference</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Complete API documentation for integrating traditional medicine codes with modern EMR systems.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">REST</div>
                <div className="text-sm text-muted-foreground">RESTful API Design</div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">JSON</div>
                <div className="text-sm text-muted-foreground">JSON Request/Response</div>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">FHIR</div>
                <div className="text-sm text-muted-foreground">FHIR R4 Compliant</div>
              </CardContent>
            </Card>
          </div>

          {/* Base URL */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Base URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between bg-muted rounded-lg p-4">
                <code className="text-sm font-mono">https://api.MediSutra.org/v1</code>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard('https://api.MediSutra.org/v1')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                All API requests should be made to the above base URL. For local development, use <code>http://localhost:5000</code>.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* API Tabs */}
        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="sdk">SDK & Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-8">
            {endpoints.map((category) => (
              <div key={category.category}>
                <div className="flex items-center space-x-3 mb-6">
                  {category.icon}
                  <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
                </div>

                <div className="space-y-6">
                  {category.endpoints.map((endpoint, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono">{endpoint.path}</code>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`${endpoint.method} ${endpoint.path}`)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{endpoint.description}</p>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                          <div>
                            {/* Parameters */}
                            {endpoint.params.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-medium text-foreground mb-2">Parameters</h4>
                                <div className="space-y-2">
                                  {endpoint.params.map((param, pidx) => (
                                    <div key={pidx} className="flex items-center justify-between p-2 bg-muted rounded">
                                      <div>
                                        <code className="text-sm font-mono text-primary">{param.name}</code>
                                        <span className="text-sm text-muted-foreground ml-2">({param.type})</span>
                                        {param.required && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Request Body */}
                            {endpoint.requestBody && (
                              <div className="mb-4">
                                <h4 className="font-medium text-foreground mb-2">Request Body</h4>
                                <div className="bg-muted rounded-lg p-3">
                                  <pre className="text-xs overflow-x-auto">
                                    {JSON.stringify(endpoint.requestBody, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            {/* Response */}
                            <div>
                              <h4 className="font-medium text-foreground mb-2 flex items-center">
                                <CheckCircle className="w-4 h-4 text-primary mr-2" />
                                Response (200 OK)
                              </h4>
                              <div className="bg-muted rounded-lg p-3">
                                <pre className="text-xs overflow-x-auto">
                                  {JSON.stringify(endpoint.response, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ABHA OAuth 2.0 Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  MediSutra uses ABHA (Ayushman Bharat Health Account) OAuth 2.0 for secure authentication 
                  in compliance with India's digital health standards.
                </p>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Authorization Flow</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Redirect user to ABHA authorization server</li>
                    <li>User authorizes your application</li>
                    <li>Receive authorization code via callback</li>
                    <li>Exchange code for access token</li>
                    <li>Include token in API requests</li>
                  </ol>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Example Implementation</h4>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(authExample)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">{authExample}</pre>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-primary/5">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-foreground mb-2">Required Scopes</h4>
                      <ul className="text-sm space-y-1">
                        <li><code>read:codes</code> - Read access to terminology codes</li>
                        <li><code>read:mappings</code> - Access to code mappings</li>
                        <li><code>write:fhir</code> - Submit FHIR bundles</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/5">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-foreground mb-2">Rate Limits</h4>
                      <ul className="text-sm space-y-1">
                        <li>1000 requests/hour (authenticated)</li>
                        <li>100 requests/hour (public endpoints)</li>
                        <li>10 requests/second (burst limit)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>JavaScript SDK</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Use our official JavaScript SDK for seamless integration with your web applications.
                </p>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Installation</h4>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard('npm install @MediSutra/sdk')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <code className="text-sm">npm install @MediSutra/sdk</code>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Usage Example</h4>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(sdkExample)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">{sdkExample}</pre>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>cURL Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm font-medium text-foreground mb-2">Search Codes</div>
                    <pre className="text-xs">
{`curl -X GET \\
  "https://api.MediSutra.org/v1/api/search?q=cholera" \\
  -H "Authorization: Bearer your-token"`}
                    </pre>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm font-medium text-foreground mb-2">Get Code Mappings</div>
                    <pre className="text-xs">
{`curl -X GET \\
  "https://api.MediSutra.org/v1/api/mapping/NAMASTE/AYU-DIG-001/ICD-11" \\
  -H "Authorization: Bearer your-token"`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Python Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-3">
                    <pre className="text-xs">
{`import requests

# Search for codes
response = requests.get(
    "https://api.MediSutra.org/v1/api/search",
    params={"q": "grahani roga"},
    headers={"Authorization": "Bearer your-token"}
)

codes = response.json()
print(f"Found {codes['totalResults']} results")`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Support Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border-0">
          <CardContent className="p-8 text-center">
            <Code2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Explore our interactive demo or dive into the full documentation to begin integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button>
                  <Play className="w-4 h-4 mr-2" />
                  Interactive Demo
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline">
                  Complete Documentation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}