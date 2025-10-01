import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function NamesteImport() {
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setValidationResult(null);
      setImportResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await api.namasteGetTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'namaste_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download template:', error);
    }
  };

  const handleValidate = async () => {
    if (!file) return;

    setIsValidating(true);
    setValidationResult(null);
    setImportResult(null);

    try {
      const result = await api.namasteValidateCSV(file);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: ['Failed to validate file. Please check the format.'],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!file || !validationResult?.valid) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await api.namasteImportCSV(file);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to import file. Please try again.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const successRate = validationResult
    ? (validationResult.successfulValidations / validationResult.totalRows) * 100
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            NAMASTE CSV Import
          </CardTitle>
          <CardDescription>
            Import NAMASTE terminology codes from CSV files. Download the template to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">CSV Template</p>
                <p className="text-sm text-muted-foreground">
                  Download the template with sample data
                </p>
              </div>
            </div>
            <Button onClick={handleDownloadTemplate} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-1">
                {file ? file.name : 'Click to upload CSV file'}
              </p>
              <p className="text-xs text-muted-foreground">
                or drag and drop your CSV file here
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {file && (
              <div className="flex gap-2">
                <Button
                  onClick={handleValidate}
                  disabled={isValidating}
                  variant="outline"
                  className="flex-1"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Validate
                    </>
                  )}
                </Button>

                {validationResult?.valid && (
                  <Button
                    onClick={handleImport}
                    disabled={isImporting}
                    className="flex-1"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-4">
              <Alert variant={validationResult.valid ? "default" : "destructive"}>
                {validationResult.valid ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {validationResult.valid ? 'Validation Passed' : 'Validation Failed'}
                </AlertTitle>
                <AlertDescription>
                  {validationResult.valid
                    ? `Ready to import ${validationResult.successfulValidations} codes`
                    : `Found ${validationResult.failedValidations} errors`}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {validationResult.successfulValidations || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Valid Rows</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {validationResult.failedValidations || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Invalid Rows</div>
                  </CardContent>
                </Card>
              </div>

              {validationResult.valid && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Success Rate</span>
                    <Badge variant="outline">{successRate.toFixed(0)}%</Badge>
                  </div>
                  <Progress value={successRate} />
                </div>
              )}

              {validationResult.errors && validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Errors:</h4>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {validationResult.errors.slice(0, 10).map((err: any, idx: number) => (
                      <div
                        key={idx}
                        className="text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                      >
                        <span className="font-medium">Row {err.row}:</span> {err.error}
                      </div>
                    ))}
                    {validationResult.errors.length > 10 && (
                      <p className="text-xs text-muted-foreground text-center">
                        ... and {validationResult.errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <Alert variant={importResult.success ? "default" : "destructive"}>
              {importResult.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {importResult.success ? 'Import Successful!' : 'Import Failed'}
              </AlertTitle>
              <AlertDescription>
                {importResult.message}
                {importResult.codesImported && (
                  <div className="mt-2 space-y-1">
                    <div>• {importResult.codesImported} codes imported</div>
                    <div>• {importResult.mappingsCreated} mappings created</div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
