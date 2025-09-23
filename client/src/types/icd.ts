import { type IcdCode, type NamasteCode, type Tm2Code, type CodeMapping } from "@shared/schema";

export interface SearchResults {
  query: string;
  totalResults: number;
  results: {
    icdCodes: IcdCode[];
    namasteCodes: NamasteCode[];
    tm2Codes: Tm2Code[];
  };
}

export interface SystemStatus {
  status: string;
  services: {
    whoIcd11Api: string;
    namasteImport: string;
    fhirCompliance: string;
    abhaOauth: string;
  };
  lastSync: string;
}

export interface TreeNode {
  id: string;
  code: string;
  title: string;
  children?: TreeNode[];
  expanded?: boolean;
  type: 'icd11' | 'namaste' | 'tm2';
}

export interface FhirBundle {
  resourceType: "Bundle";
  id: string;
  type: string;
  entry?: Array<{
    resource: {
      resourceType: string;
      id: string;
      code?: {
        coding: Array<{
          system: string;
          code: string;
          display: string;
        }>;
      };
      subject?: {
        reference: string;
      };
    };
  }>;
}

export { type IcdCode, type NamasteCode, type Tm2Code, type CodeMapping };
