import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, UserCheck, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ConsentManager() {
  const [recordForm, setRecordForm] = useState({
    patientId: "",
    abhaAddress: "",
    purposeOfUse: "TREATMENT",
    dataSharing: true,
    traditionalMedicine: true,
    biomedicine: true,
    expiryDate: "",
    notes: "",
  });

  const [checkPatientId, setCheckPatientId] = useState("");
  const [recordSuccess, setRecordSuccess] = useState(false);

  // Record consent mutation
  const recordMutation = useMutation({
    mutationFn: async () => {
      const consentData = {
        patientId: recordForm.patientId,
        abhaAddress: recordForm.abhaAddress || undefined,
        consentGiven: recordForm.dataSharing,
        purposeOfUse: recordForm.purposeOfUse,
        scope: {
          traditionalMedicine: recordForm.traditionalMedicine,
          biomedicine: recordForm.biomedicine,
        },
        expiryDate: recordForm.expiryDate
          ? new Date(recordForm.expiryDate).toISOString()
          : undefined,
        metadata: recordForm.notes
          ? { notes: recordForm.notes }
          : undefined,
      };

      return await api.consentRecord(consentData);
    },
    onSuccess: () => {
      setRecordSuccess(true);
      setTimeout(() => setRecordSuccess(false), 3000);
      // Reset form
      setRecordForm({
        patientId: "",
        abhaAddress: "",
        purposeOfUse: "TREATMENT",
        dataSharing: true,
        traditionalMedicine: true,
        biomedicine: true,
        expiryDate: "",
        notes: "",
      });
    },
  });

  // Check consent query
  const { data: consentStatus, refetch: checkConsent, isFetching: isChecking } = useQuery({
    queryKey: ["/api/consent/check", checkPatientId],
    queryFn: async () => {
      if (!checkPatientId) return null;
      return await api.consentCheck(checkPatientId, "TREATMENT");
    },
    enabled: false, // Manual trigger only
  });

  const handleRecordConsent = () => {
    recordMutation.mutate();
  };

  const handleCheckConsent = () => {
    if (checkPatientId) {
      checkConsent();
    }
  };

  return (
    <div className="space-y-6">
      {/* Record Consent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Record Patient Consent
          </CardTitle>
          <CardDescription>
            Record patient consent for traditional medicine and biomedicine data sharing per India
            EHR Standards 2016
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This form complies with ISO 22600 access control and ABDM (Ayushman Bharat Digital
              Mission) consent requirements.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID *</Label>
              <Input
                id="patientId"
                placeholder="PAT-123456"
                value={recordForm.patientId}
                onChange={(e) => setRecordForm({ ...recordForm, patientId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abhaAddress">
                ABHA Address
                <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
              </Label>
              <Input
                id="abhaAddress"
                placeholder="patient@abha"
                value={recordForm.abhaAddress}
                onChange={(e) => setRecordForm({ ...recordForm, abhaAddress: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">
              Consent Expiry Date
              <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
            </Label>
            <Input
              id="expiryDate"
              type="date"
              value={recordForm.expiryDate}
              onChange={(e) => setRecordForm({ ...recordForm, expiryDate: e.target.value })}
            />
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <Label className="text-sm font-medium">Consent Scope</Label>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dataSharing" className="text-sm font-normal">
                  Data Sharing Consent
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow sharing of health records with authorized providers
                </p>
              </div>
              <Switch
                id="dataSharing"
                checked={recordForm.dataSharing}
                onCheckedChange={(checked) =>
                  setRecordForm({ ...recordForm, dataSharing: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="traditionalMedicine" className="text-sm font-normal">
                  Traditional Medicine Data
                </Label>
                <p className="text-xs text-muted-foreground">
                  Include Ayurveda, Siddha, Unani diagnoses and treatments
                </p>
              </div>
              <Switch
                id="traditionalMedicine"
                checked={recordForm.traditionalMedicine}
                onCheckedChange={(checked) =>
                  setRecordForm({ ...recordForm, traditionalMedicine: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="biomedicine" className="text-sm font-normal">
                  Biomedicine Data
                </Label>
                <p className="text-xs text-muted-foreground">
                  Include ICD-11 biomedical diagnoses and conventional treatments
                </p>
              </div>
              <Switch
                id="biomedicine"
                checked={recordForm.biomedicine}
                onCheckedChange={(checked) => setRecordForm({ ...recordForm, biomedicine: checked })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Purpose of use, special instructions, limitations..."
              value={recordForm.notes}
              onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
              rows={3}
            />
          </div>

          {recordSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                Consent recorded successfully!
              </AlertDescription>
            </Alert>
          )}

          {recordMutation.isError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Failed to record consent: {(recordMutation.error as Error)?.message}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleRecordConsent}
            disabled={!recordForm.patientId || recordMutation.isPending}
            className="w-full"
          >
            {recordMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Recording...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Record Consent
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Check Consent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Check Patient Consent
          </CardTitle>
          <CardDescription>
            Verify consent status before accessing patient records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter Patient ID"
                value={checkPatientId}
                onChange={(e) => setCheckPatientId(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCheckConsent}
              disabled={!checkPatientId || isChecking}
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Check"
              )}
            </Button>
          </div>

          {consentStatus && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Consent Status</span>
                <Badge
                  variant={consentStatus.consentGiven ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {consentStatus.consentGiven ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Granted
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      Not Granted
                    </>
                  )}
                </Badge>
              </div>

              {consentStatus.consentGiven && (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Patient ID:</span>
                      <p className="font-medium">{consentStatus.patientId}</p>
                    </div>
                    {consentStatus.abhaAddress && (
                      <div>
                        <span className="text-muted-foreground">ABHA:</span>
                        <p className="font-medium">{consentStatus.abhaAddress}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Purpose:</span>
                      <p className="font-medium">{consentStatus.purposeOfUse || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recorded:</span>
                      <p className="font-medium">
                        {new Date(consentStatus.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {consentStatus.scope && (
                    <div className="space-y-2 pt-2 border-t">
                      <span className="text-sm font-medium">Data Access Scope:</span>
                      <div className="flex flex-wrap gap-2">
                        {consentStatus.scope.traditionalMedicine && (
                          <Badge variant="secondary">Traditional Medicine</Badge>
                        )}
                        {consentStatus.scope.biomedicine && (
                          <Badge variant="secondary">Biomedicine</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {consentStatus.expiryDate && (
                    <Alert>
                      <AlertDescription className="text-sm">
                        Consent expires on{" "}
                        {new Date(consentStatus.expiryDate).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
