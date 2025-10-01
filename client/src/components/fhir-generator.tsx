import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileJson, Download, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FhirGenerator() {
  const [activeTab, setActiveTab] = useState("condition");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResource, setGeneratedResource] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Condition form state
  const [conditionForm, setConditionForm] = useState({
    patientReference: "Patient/example-123",
    primarySystem: "NAMASTE",
    primaryCode: "",
    primaryDisplay: "",
    secondarySystem: "ICD-11",
    secondaryCode: "",
    secondaryDisplay: "",
    notes: "",
  });

  const handleGenerateCondition = async () => {
    setIsGenerating(true);
    setGeneratedResource(null);

    try {
      const secondaryCodes = conditionForm.secondaryCode
        ? [
            {
              system: conditionForm.secondarySystem,
              code: conditionForm.secondaryCode,
              display: conditionForm.secondaryDisplay,
            },
          ]
        : [];

      const result = await api.fhirGenerateCondition({
        patientReference: conditionForm.patientReference,
        primaryCode: {
          system: conditionForm.primarySystem,
          code: conditionForm.primaryCode,
          display: conditionForm.primaryDisplay,
        },
        secondaryCodes,
        options: {
          notes: conditionForm.notes || undefined,
        },
      });

      setGeneratedResource(result);
    } catch (error) {
      console.error("Failed to generate condition:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCodeSystem = async () => {
    setIsGenerating(true);
    setGeneratedResource(null);

    try {
      const result = await api.fhirGenerateCodeSystem();
      setGeneratedResource(result);
    } catch (error) {
      console.error("Failed to generate CodeSystem:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateConceptMap = async (source: string, target: string) => {
    setIsGenerating(true);
    setGeneratedResource(null);

    try {
      const result = await api.fhirGenerateConceptMap(source, target);
      setGeneratedResource(result);
    } catch (error) {
      console.error("Failed to generate ConceptMap:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBundle = async () => {
    setIsGenerating(true);
    setGeneratedResource(null);

    try {
      const result = await api.fhirGenerateBundle(true, true);
      setGeneratedResource(result);
    } catch (error) {
      console.error("Failed to generate Bundle:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedResource) {
      navigator.clipboard.writeText(JSON.stringify(generatedResource, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedResource) {
      const blob = new Blob([JSON.stringify(generatedResource, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fhir-${generatedResource.resourceType || "resource"}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            FHIR R4 Resource Generator
          </CardTitle>
          <CardDescription>
            Generate FHIR-compliant resources for CodeSystem, ConceptMap, Condition, and Bundle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="condition">Condition</TabsTrigger>
              <TabsTrigger value="codesystem">CodeSystem</TabsTrigger>
              <TabsTrigger value="conceptmap">ConceptMap</TabsTrigger>
              <TabsTrigger value="bundle">Bundle</TabsTrigger>
            </TabsList>

            <TabsContent value="condition" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Generate a FHIR Condition resource (ProblemList entry) with dual-coding support
                  for traditional and biomedical systems.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientRef">Patient Reference</Label>
                  <Input
                    id="patientRef"
                    placeholder="Patient/123"
                    value={conditionForm.patientReference}
                    onChange={(e) =>
                      setConditionForm({ ...conditionForm, patientReference: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primarySystem">Primary System</Label>
                    <Select
                      value={conditionForm.primarySystem}
                      onValueChange={(value) =>
                        setConditionForm({ ...conditionForm, primarySystem: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NAMASTE">NAMASTE</SelectItem>
                        <SelectItem value="ICD-11">ICD-11</SelectItem>
                        <SelectItem value="TM2">TM2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryCode">Code</Label>
                    <Input
                      id="primaryCode"
                      placeholder="AYU-DIG-001"
                      value={conditionForm.primaryCode}
                      onChange={(e) =>
                        setConditionForm({ ...conditionForm, primaryCode: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryDisplay">Display</Label>
                    <Input
                      id="primaryDisplay"
                      placeholder="Grahani Roga"
                      value={conditionForm.primaryDisplay}
                      onChange={(e) =>
                        setConditionForm({ ...conditionForm, primaryDisplay: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Secondary Coding (Optional)
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="secondarySystem">System</Label>
                      <Select
                        value={conditionForm.secondarySystem}
                        onValueChange={(value) =>
                          setConditionForm({ ...conditionForm, secondarySystem: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ICD-11">ICD-11</SelectItem>
                          <SelectItem value="TM2">TM2</SelectItem>
                          <SelectItem value="NAMASTE">NAMASTE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryCode">Code</Label>
                      <Input
                        id="secondaryCode"
                        placeholder="K59.9"
                        value={conditionForm.secondaryCode}
                        onChange={(e) =>
                          setConditionForm({ ...conditionForm, secondaryCode: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryDisplay">Display</Label>
                      <Input
                        id="secondaryDisplay"
                        placeholder="Functional disorder"
                        value={conditionForm.secondaryDisplay}
                        onChange={(e) =>
                          setConditionForm({ ...conditionForm, secondaryDisplay: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional clinical notes..."
                    value={conditionForm.notes}
                    onChange={(e) =>
                      setConditionForm({ ...conditionForm, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerateCondition}
                  disabled={
                    isGenerating ||
                    !conditionForm.primaryCode ||
                    !conditionForm.primaryDisplay ||
                    !conditionForm.patientReference
                  }
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileJson className="w-4 h-4 mr-2" />
                      Generate Condition
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="codesystem" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Generate a complete FHIR CodeSystem resource containing all NAMASTE codes
                  (Ayurveda, Siddha, Unani).
                </AlertDescription>
              </Alert>

              <Button onClick={handleGenerateCodeSystem} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileJson className="w-4 h-4 mr-2" />
                    Generate NAMASTE CodeSystem
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="conceptmap" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Generate FHIR ConceptMap resources showing code translations between different
                  terminology systems.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={() => handleGenerateConceptMap("NAMASTE", "ICD-11")}
                  disabled={isGenerating}
                  variant="outline"
                >
                  NAMASTE → ICD-11
                </Button>
                <Button
                  onClick={() => handleGenerateConceptMap("NAMASTE", "TM2")}
                  disabled={isGenerating}
                  variant="outline"
                >
                  NAMASTE → TM2
                </Button>
                <Button
                  onClick={() => handleGenerateConceptMap("TM2", "ICD-11")}
                  disabled={isGenerating}
                  variant="outline"
                >
                  TM2 → ICD-11
                </Button>
                <Button
                  onClick={() => handleGenerateConceptMap("ICD-11", "TM2")}
                  disabled={isGenerating}
                  variant="outline"
                >
                  ICD-11 → TM2
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="bundle" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Generate a complete FHIR Bundle containing all CodeSystems and ConceptMaps for
                  easy distribution and integration.
                </AlertDescription>
              </Alert>

              <Button onClick={handleGenerateBundle} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileJson className="w-4 h-4 mr-2" />
                    Generate Complete Bundle
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Generated Resource Display */}
          {generatedResource && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Resource Generated</span>
                  <Badge variant="secondary">{generatedResource.resourceType}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
                <pre className="text-xs font-mono">
                  {JSON.stringify(generatedResource, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
