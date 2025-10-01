import { apiRequest } from "./queryClient";
import { type SearchResults, type SystemStatus, type IcdCode, type NamasteCode, type Tm2Code, type CodeMapping, type FhirBundle } from "../types/icd";

export const api = {
  // Search endpoints
  search: async (query: string): Promise<SearchResults> => {
    const res = await apiRequest("GET", `/api/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // ICD-11 endpoints
  getIcdHierarchy: async (): Promise<IcdCode[]> => {
    const res = await apiRequest("GET", "/api/icd11/hierarchy");
    return res.json();
  },

  getIcdByChapter: async (chapter: string): Promise<IcdCode[]> => {
    const res = await apiRequest("GET", `/api/icd11/chapter/${chapter}`);
    return res.json();
  },

  getIcdByCode: async (code: string): Promise<IcdCode> => {
    const res = await apiRequest("GET", `/api/icd11/code/${code}`);
    return res.json();
  },

  // NAMASTE endpoints
  getNamasteBySystem: async (system: string): Promise<NamasteCode[]> => {
    const res = await apiRequest("GET", `/api/namaste/system/${system}`);
    return res.json();
  },

  getNamasteByCode: async (code: string): Promise<NamasteCode> => {
    const res = await apiRequest("GET", `/api/namaste/code/${code}`);
    return res.json();
  },

  // TM2 endpoints
  getTm2ByCode: async (code: string): Promise<Tm2Code> => {
    const res = await apiRequest("GET", `/api/tm2/code/${code}`);
    return res.json();
  },

  // Code mapping endpoints
  translateCode: async (sourceSystem: string, sourceCode: string, targetSystem: string): Promise<CodeMapping[]> => {
    const res = await apiRequest("GET", `/api/mapping/${sourceSystem}/${sourceCode}/${targetSystem}`);
    return res.json();
  },

  getCodeMappings: async (system: string, code: string): Promise<CodeMapping[]> => {
    const res = await apiRequest("GET", `/api/mapping/code/${system}/${code}`);
    return res.json();
  },

  // FHIR endpoints
  submitFhirBundle: async (bundle: FhirBundle): Promise<any> => {
    const res = await apiRequest("POST", "/api/fhir/bundle", bundle);
    return res.json();
  },

  // System endpoints
  getSystemStatus: async (): Promise<SystemStatus> => {
    const res = await apiRequest("GET", "/api/status");
    return res.json();
  },

  getRecentActivity: async (): Promise<any[]> => {
    const res = await apiRequest("GET", "/api/activity/recent");
    return res.json();
  },

  // Validation endpoints
  validateMappings: async (): Promise<{mappingType: string, isValid: boolean, violations: string[]}> => {
    const res = await apiRequest("GET", "/api/validate/mappings");
    return res.json();
  },

  // WHO ICD-11 API endpoints
  whoSearch: async (query: string, releaseId?: string): Promise<any> => {
    const params = new URLSearchParams({ q: query });
    if (releaseId) params.append('releaseId', releaseId);
    const res = await apiRequest("GET", `/api/who/search?${params}`);
    return res.json();
  },

  whoGetEntity: async (uri: string): Promise<any> => {
    const res = await apiRequest("GET", `/api/who/entity?uri=${encodeURIComponent(uri)}`);
    return res.json();
  },

  whoGetCode: async (code: string, releaseId?: string): Promise<any> => {
    const params = releaseId ? `?releaseId=${releaseId}` : '';
    const res = await apiRequest("GET", `/api/who/code/${code}${params}`);
    return res.json();
  },

  whoGetTM2: async (releaseId?: string): Promise<any> => {
    const params = releaseId ? `?releaseId=${releaseId}` : '';
    const res = await apiRequest("GET", `/api/who/tm2${params}`);
    return res.json();
  },

  whoSync: async (syncType: 'tm2' | 'biomedicine' | 'full', releaseId?: string): Promise<any> => {
    const res = await apiRequest("POST", "/api/who/sync", { syncType, releaseId });
    return res.json();
  },

  // NAMASTE CSV import endpoints
  namasteGetTemplate: async (): Promise<Blob> => {
    const res = await apiRequest("GET", "/api/namaste/import/template");
    return res.blob();
  },

  namasteValidateCSV: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/namaste/import/validate', {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  namasteImportCSV: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/namaste/import', {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // FHIR generation endpoints
  fhirGenerateCodeSystem: async (system?: string, version?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (system) params.append('system', system);
    if (version) params.append('version', version);
    const res = await apiRequest("GET", `/api/fhir/codesystem/namaste?${params}`);
    return res.json();
  },

  fhirGenerateConceptMap: async (sourceSystem: string, targetSystem: string, version?: string): Promise<any> => {
    const params = version ? `?version=${version}` : '';
    const res = await apiRequest("GET", `/api/fhir/conceptmap/${sourceSystem}/${targetSystem}${params}`);
    return res.json();
  },

  fhirGenerateCondition: async (conditionData: any): Promise<any> => {
    const res = await apiRequest("POST", "/api/fhir/condition", conditionData);
    return res.json();
  },

  fhirGenerateBundle: async (includeCodeSystems: boolean = true, includeConceptMaps: boolean = true, version?: string): Promise<any> => {
    const params = new URLSearchParams({
      includeCodeSystems: includeCodeSystems.toString(),
      includeConceptMaps: includeConceptMaps.toString(),
    });
    if (version) params.append('version', version);
    const res = await apiRequest("GET", `/api/fhir/bundle?${params}`);
    return res.json();
  },

  // Audit and compliance endpoints
  auditLog: async (auditData: any): Promise<any> => {
    const res = await apiRequest("POST", "/api/audit/log", auditData);
    return res.json();
  },

  auditGetTrail: async (entityType?: string, entityId?: string, limit?: number): Promise<any> => {
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId);
    if (limit) params.append('limit', limit.toString());
    const res = await apiRequest("GET", `/api/audit/trail?${params}`);
    return res.json();
  },

  consentRecord: async (consentData: any): Promise<any> => {
    const res = await apiRequest("POST", "/api/consent/record", consentData);
    return res.json();
  },

  consentCheck: async (patientId: string, purpose: string): Promise<any> => {
    const params = new URLSearchParams({ patientId, purpose });
    const res = await apiRequest("GET", `/api/consent/check?${params}`);
    return res.json();
  },

  versionHistory: async (entityType: string, entityId: string): Promise<any> => {
    const params = new URLSearchParams({ entityType, entityId });
    const res = await apiRequest("GET", `/api/version/history?${params}`);
    return res.json();
  },
};
