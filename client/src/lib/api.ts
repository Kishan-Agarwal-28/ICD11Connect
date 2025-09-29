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
};
