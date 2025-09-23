import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Plus, Download, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import CodeMapping from "./code-mapping";

interface MainContentProps {
  selectedCode: string | null;
  selectedSystem: string | null;
}

export default function MainContent({ selectedCode, selectedSystem }: MainContentProps) {
  // Fetch code data from API based on selected code and system
  const { data: icdCode, isLoading: icdLoading } = useQuery({
    queryKey: ['/api/icd11/code', selectedCode],
    queryFn: () => api.getIcdByCode(selectedCode!),
    enabled: !!selectedCode && selectedSystem === 'icd11',
  });

  const { data: namasteCode, isLoading: namasteLoading } = useQuery({
    queryKey: ['/api/namaste/code', selectedCode],
    queryFn: () => api.getNamasteByCode(selectedCode!),
    enabled: !!selectedCode && selectedSystem === 'namaste',
  });

  const { data: tm2Code, isLoading: tm2Loading } = useQuery({
    queryKey: ['/api/tm2/code', selectedCode],
    queryFn: () => api.getTm2ByCode(selectedCode!),
    enabled: !!selectedCode && selectedSystem === 'tm2',
  });

  // Fetch code mappings for the selected code
  const { data: codeMappings } = useQuery({
    queryKey: ['/api/mapping/code', selectedSystem, selectedCode],
    queryFn: () => api.getCodeMappings(selectedSystem!, selectedCode!),
    enabled: !!selectedCode && !!selectedSystem,
  });

  const isLoading = icdLoading || namasteLoading || tm2Loading;
  const currentCodeData = icdCode || namasteCode || tm2Code;

  const relatedCodes = [
    {
      code: "1A0Y",
      title: "Viral gastroenteritis",
      description: "Acute inflammation caused by viral infection",
      tm2Code: "TM-VI-002",
    },
    {
      code: "1A1Y", 
      title: "Bacterial gastroenteritis",
      description: "Inflammation due to bacterial infection",
      tm2Code: "TM-BA-001",
    },
    {
      code: "AYU-DIG-002",
      title: "Ama Dosha",
      description: "Toxin accumulation in digestive system",
      icdCode: "1A9Z",
    },
  ];

  const fhirBundleExample = {
    resourceType: "Bundle",
    id: "namaste-icd11-mapping",
    type: "collection",
    entry: [
      {
        resource: {
          resourceType: "Condition",
          id: "gastroenteritis-condition",
          code: {
            coding: [
              {
                system: "http://id.who.int/icd/release/11/mms",
                code: "1A00",
                display: "Gastroenteritis and colitis"
              },
              {
                system: "http://namaste.gov.in/codes",
                code: "AYU-DIG-001",
                display: "Grahani Roga"
              },
              {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "TM-GI-001",
                display: "Digestive system pattern disorder"
              }
            ]
          },
          subject: {
            reference: "Patient/patient-abha-123456"
          }
        }
      }
    ]
  };

  if (!selectedCode) {
    return (
      <main className="flex-1 overflow-y-auto bg-muted">
        <div className="p-6 h-full flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select a Code to View Details
                </h3>
                <p className="text-muted-foreground">
                  Choose an ICD-11, NAMASTE, or TM2 code from the navigation tree to view detailed information, mappings, and FHIR examples.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto bg-muted">
        <div className="p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  if (!currentCodeData) {
    return (
      <main className="flex-1 overflow-y-auto bg-muted">
        <div className="p-6 h-full flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Code Not Found
                </h3>
                <p className="text-muted-foreground">
                  The selected code "{selectedCode}" could not be found in the {selectedSystem?.toUpperCase()} system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-muted">
      <div className="p-6">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{selectedSystem?.toUpperCase()}</span>
            <ChevronRight className="w-4 h-4" />
            {selectedSystem === 'icd11' && icdCode && (
              <>
                <span>Chapter {icdCode.chapter}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-foreground font-medium">{currentCodeData.title} ({currentCodeData.code})</span>
          </div>
        </nav>

        {/* Main Content Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{currentCodeData.title}</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {selectedSystem?.toUpperCase()}: {currentCodeData.code}
                  </Badge>
                  {codeMappings && codeMappings.map((mapping, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-secondary text-secondary-foreground">
                      {mapping.targetSystem}: {mapping.targetCode}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button data-testid="button-add-problem-list">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Problem List
                </Button>
                <Button variant="outline" data-testid="button-export-fhir">
                  <Download className="w-4 h-4 mr-2" />
                  Export FHIR
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Description */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {selectedSystem === 'icd11' ? 'Clinical Description' : 
                   selectedSystem === 'namaste' ? 'Traditional Medicine Description' :
                   'Pattern Description'}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {currentCodeData.description || 'No description available.'}
                </p>
                
                {selectedSystem === 'namaste' && namasteCode && (
                  <>
                    <h4 className="font-semibold text-foreground mb-2">
                      System: {namasteCode.system === 'AYU' ? 'Ayurveda' : 
                                namasteCode.system === 'SID' ? 'Siddha' : 
                                namasteCode.system === 'UNA' ? 'Unani' : namasteCode.system}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Category: {namasteCode.category}
                    </p>
                  </>
                )}
                
                {selectedSystem === 'tm2' && tm2Code && (
                  <>
                    <h4 className="font-semibold text-foreground mb-2">Pattern Type</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {tm2Code.pattern}
                    </p>
                  </>
                )}
              </div>

              {/* Quick Facts */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Classification Details</h3>
                <div className="space-y-3">
                  {selectedSystem === 'icd11' && icdCode && (
                    <>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-sm font-medium text-foreground">ICD-11 Chapter</div>
                        <div className="text-sm text-muted-foreground">{icdCode.chapter}</div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-sm font-medium text-foreground">Category</div>
                        <div className="text-sm text-muted-foreground">{icdCode.category}</div>
                      </div>
                      {icdCode.parentCode && (
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm font-medium text-foreground">Parent Code</div>
                          <div className="text-sm text-muted-foreground">{icdCode.parentCode}</div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedSystem === 'namaste' && namasteCode && (
                    <>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-sm font-medium text-foreground">Traditional System</div>
                        <div className="text-sm text-muted-foreground">{namasteCode.system}</div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-sm font-medium text-foreground">Category</div>
                        <div className="text-sm text-muted-foreground">{namasteCode.category}</div>
                      </div>
                    </>
                  )}
                  
                  {selectedSystem === 'tm2' && tm2Code && (
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-sm font-medium text-foreground">Pattern</div>
                      <div className="text-sm text-muted-foreground">{tm2Code.pattern}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Mapping Section */}
        <CodeMapping selectedCode={selectedCode} selectedSystem={selectedSystem} codeMappings={codeMappings} />

        {/* Related Codes Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-secondary" />
              Related Classifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCodes.map((code, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-related-${code.code}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-primary">{code.code}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium text-foreground text-sm mb-1">{code.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{code.description}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {code.tm2Code ? `TM2: ${code.tm2Code}` : `ICD-11: ${code.icdCode}`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FHIR Bundle Example */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <span className="text-accent mr-2">&lt;/&gt;</span>
              FHIR R4 Bundle Example
            </h3>
            
            <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-foreground">
                {JSON.stringify({
                  resourceType: "Bundle",
                  id: `${selectedSystem}-${selectedCode}-mapping`,
                  type: "collection",
                  entry: [{
                    resource: {
                      resourceType: "Condition",
                      id: `condition-${selectedCode}`,
                      code: {
                        coding: [
                          {
                            system: selectedSystem === 'icd11' ? "http://id.who.int/icd/release/11/mms" :
                                   selectedSystem === 'namaste' ? "http://namaste.gov.in/codes" :
                                   "http://id.who.int/icd/release/11/tm2",
                            code: currentCodeData.code,
                            display: currentCodeData.title
                          },
                          ...(codeMappings ? codeMappings.map(mapping => ({
                            system: mapping.targetSystem === 'ICD-11' ? "http://id.who.int/icd/release/11/mms" :
                                   mapping.targetSystem === 'NAMASTE' ? "http://namaste.gov.in/codes" :
                                   "http://id.who.int/icd/release/11/tm2",
                            code: mapping.targetCode,
                            display: mapping.targetCode
                          })) : [])
                        ]
                      },
                      subject: {
                        reference: "Patient/patient-abha-123456"
                      }
                    }
                  }]
                }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
