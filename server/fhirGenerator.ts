/**
 * FHIR R4 Resource Generator
 * Generates FHIR-compliant CodeSystem, ConceptMap, and Condition resources
 * Following India's 2016 EHR Standards and FHIR R4 specifications
 */

import type { IcdCode, NamasteCode, Tm2Code, CodeMapping } from '@shared/schema';

export interface FhirCodeSystem {
  resourceType: 'CodeSystem';
  id: string;
  url: string;
  identifier?: Array<{
    system: string;
    value: string;
  }>;
  version: string;
  name: string;
  title: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  experimental?: boolean;
  date: string;
  publisher?: string;
  contact?: Array<{
    name?: string;
    telecom?: Array<{
      system: string;
      value: string;
    }>;
  }>;
  description?: string;
  purpose?: string;
  copyright?: string;
  caseSensitive?: boolean;
  valueSet?: string;
  hierarchyMeaning?: 'grouped-by' | 'is-a' | 'part-of' | 'classified-with';
  compositional?: boolean;
  versionNeeded?: boolean;
  content: 'not-present' | 'example' | 'fragment' | 'complete' | 'supplement';
  supplements?: string;
  count?: number;
  filter?: Array<{
    code: string;
    description?: string;
    operator: string[];
    value: string;
  }>;
  property?: Array<{
    code: string;
    uri?: string;
    description?: string;
    type: 'code' | 'Coding' | 'string' | 'integer' | 'boolean' | 'dateTime' | 'decimal';
  }>;
  concept?: Array<FhirConcept>;
}

export interface FhirConcept {
  code: string;
  display: string;
  definition?: string;
  designation?: Array<{
    language?: string;
    use?: {
      system: string;
      code: string;
      display: string;
    };
    value: string;
  }>;
  property?: Array<{
    code: string;
    valueCode?: string;
    valueString?: string;
    valueInteger?: number;
    valueBoolean?: boolean;
  }>;
  concept?: FhirConcept[];
}

export interface FhirConceptMap {
  resourceType: 'ConceptMap';
  id: string;
  url: string;
  identifier?: Array<{
    system: string;
    value: string;
  }>;
  version: string;
  name: string;
  title: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  experimental?: boolean;
  date: string;
  publisher?: string;
  contact?: Array<{
    name?: string;
    telecom?: Array<{
      system: string;
      value: string;
    }>;
  }>;
  description?: string;
  purpose?: string;
  copyright?: string;
  sourceUri?: string;
  sourceCanonical?: string;
  targetUri?: string;
  targetCanonical?: string;
  group?: Array<{
    source?: string;
    sourceVersion?: string;
    target?: string;
    targetVersion?: string;
    element: Array<{
      code: string;
      display?: string;
      target?: Array<{
        code: string;
        display?: string;
        equivalence: 'relatedto' | 'equivalent' | 'equal' | 'wider' | 'subsumes' | 'narrower' | 'specializes' | 'inexact' | 'unmatched' | 'disjoint';
        comment?: string;
      }>;
    }>;
    unmapped?: {
      mode: 'provided' | 'fixed' | 'other-map';
      code?: string;
      display?: string;
    };
  }>;
}

export interface FhirCondition {
  resourceType: 'Condition';
  id: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
  };
  identifier?: Array<{
    use?: string;
    system: string;
    value: string;
  }>;
  clinicalStatus?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  verificationStatus?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  category?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  severity?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
      version?: string;
    }>;
    text?: string;
  };
  subject: {
    reference: string;
    display?: string;
  };
  encounter?: {
    reference: string;
  };
  onsetDateTime?: string;
  recordedDate?: string;
  recorder?: {
    reference: string;
    display?: string;
  };
  note?: Array<{
    text: string;
  }>;
}

export class FhirGenerator {
  /**
   * Generate FHIR CodeSystem from NAMASTE codes
   */
  generateNamasteCodeSystem(codes: NamasteCode[], version: string = '1.0.0'): FhirCodeSystem {
    const concepts: FhirConcept[] = codes.map(code => ({
      code: code.code,
      display: code.title,
      definition: code.description || undefined,
      property: [
        {
          code: 'system',
          valueCode: code.system,
        },
        {
          code: 'category',
          valueString: code.category,
        },
      ],
    }));

    return {
      resourceType: 'CodeSystem',
      id: 'namaste-terminology',
      url: 'http://medisutra.in/fhir/CodeSystem/namaste',
      identifier: [
        {
          system: 'urn:ietf:rfc:3986',
          value: 'urn:oid:2.16.840.1.113883.6.345', // Example OID for NAMASTE
        },
      ],
      version,
      name: 'NAMASTETerminology',
      title: 'NAMASTE - National Ayush Morbidity And Standardized Terminologies Electronic',
      status: 'active',
      experimental: false,
      date: new Date().toISOString(),
      publisher: 'Ministry of AYUSH, Government of India',
      contact: [
        {
          name: 'MediSutra Team',
          telecom: [
            {
              system: 'url',
              value: 'http://medisutra.in',
            },
          ],
        },
      ],
      description: 'Standardized terminology codes for Ayurveda, Siddha, and Unani traditional medicine systems in India',
      purpose: 'To provide standardized coding for traditional medicine diagnoses in EMR systems, enabling dual-coding with biomedical systems',
      copyright: '© 2024 Ministry of AYUSH, Government of India',
      caseSensitive: true,
      valueSet: 'http://medisutra.in/fhir/ValueSet/namaste',
      hierarchyMeaning: 'is-a',
      compositional: false,
      versionNeeded: false,
      content: 'complete',
      count: codes.length,
      property: [
        {
          code: 'system',
          uri: 'http://medisutra.in/fhir/property/system',
          description: 'Traditional medicine system (AYU, SID, UNA)',
          type: 'code',
        },
        {
          code: 'category',
          uri: 'http://medisutra.in/fhir/property/category',
          description: 'Body system or category',
          type: 'string',
        },
      ],
      concept: concepts,
    };
  }

  /**
   * Generate FHIR ConceptMap for code translations
   */
  generateConceptMap(
    mappings: CodeMapping[],
    sourceSystem: string,
    targetSystem: string,
    version: string = '1.0.0'
  ): FhirConceptMap {
    const systemUrls: Record<string, string> = {
      'ICD-11': 'http://id.who.int/icd/release/11/mms',
      'NAMASTE': 'http://medisutra.in/fhir/CodeSystem/namaste',
      'TM2': 'http://id.who.int/icd/release/11/tm2',
    };

    const elements = mappings.map(mapping => ({
      code: mapping.sourceCode,
      display: undefined,
      target: [
        {
          code: mapping.targetCode,
          display: undefined,
          equivalence: this.mapToFhirEquivalence(mapping.mappingType),
          comment: mapping.confidence ? `Confidence: ${mapping.confidence}` : undefined,
        },
      ],
    }));

    return {
      resourceType: 'ConceptMap',
      id: `${sourceSystem.toLowerCase()}-to-${targetSystem.toLowerCase()}`,
      url: `http://medisutra.in/fhir/ConceptMap/${sourceSystem}-to-${targetSystem}`,
      identifier: [
        {
          system: 'urn:ietf:rfc:3986',
          value: `urn:uuid:${this.generateUUID()}`,
        },
      ],
      version,
      name: `${sourceSystem}To${targetSystem}Map`,
      title: `${sourceSystem} to ${targetSystem} Concept Map`,
      status: 'active',
      experimental: false,
      date: new Date().toISOString(),
      publisher: 'MediSutra',
      description: `Mapping between ${sourceSystem} and ${targetSystem} terminology codes`,
      purpose: 'Enable dual-coding and cross-system terminology translation for EMR integration',
      sourceUri: systemUrls[sourceSystem],
      targetUri: systemUrls[targetSystem],
      group: [
        {
          source: systemUrls[sourceSystem],
          target: systemUrls[targetSystem],
          element: elements,
        },
      ],
    };
  }

  /**
   * Generate FHIR Condition (ProblemList entry) with dual coding
   */
  generateCondition(
    patientReference: string,
    primaryCode: { system: string; code: string; display: string },
    secondaryCodes: Array<{ system: string; code: string; display: string }> = [],
    options?: {
      clinicalStatus?: string;
      verificationStatus?: string;
      category?: string;
      severity?: string;
      onsetDateTime?: string;
      notes?: string;
    }
  ): FhirCondition {
    const systemUrls: Record<string, string> = {
      'ICD-11': 'http://id.who.int/icd/release/11/mms',
      'NAMASTE': 'http://medisutra.in/fhir/CodeSystem/namaste',
      'TM2': 'http://id.who.int/icd/release/11/tm2',
      'SNOMED-CT': 'http://snomed.info/sct',
      'LOINC': 'http://loinc.org',
    };

    const codings = [
      {
        system: systemUrls[primaryCode.system] || primaryCode.system,
        code: primaryCode.code,
        display: primaryCode.display,
        version: '2024-01',
      },
      ...secondaryCodes.map(sc => ({
        system: systemUrls[sc.system] || sc.system,
        code: sc.code,
        display: sc.display,
        version: '2024-01',
      })),
    ];

    return {
      resourceType: 'Condition',
      id: this.generateUUID(),
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString(),
        profile: ['http://hl7.org/fhir/StructureDefinition/Condition'],
      },
      clinicalStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
            code: options?.clinicalStatus || 'active',
            display: options?.clinicalStatus || 'Active',
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
            code: options?.verificationStatus || 'confirmed',
            display: options?.verificationStatus || 'Confirmed',
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-category',
              code: options?.category || 'problem-list-item',
              display: options?.category || 'Problem List Item',
            },
          ],
        },
      ],
      code: {
        coding: codings,
        text: primaryCode.display,
      },
      subject: {
        reference: patientReference,
      },
      onsetDateTime: options?.onsetDateTime || new Date().toISOString(),
      recordedDate: new Date().toISOString(),
      note: options?.notes ? [{ text: options.notes }] : undefined,
    };
  }

  /**
   * Map internal mapping type to FHIR equivalence
   */
  private mapToFhirEquivalence(mappingType: string): 'relatedto' | 'equivalent' | 'equal' | 'wider' | 'subsumes' | 'narrower' | 'specializes' | 'inexact' | 'unmatched' | 'disjoint' {
    const mappingMap: Record<string, 'relatedto' | 'equivalent' | 'equal' | 'wider' | 'subsumes' | 'narrower' | 'specializes' | 'inexact' | 'unmatched' | 'disjoint'> = {
      'exact': 'equal',
      'broader': 'wider',
      'narrower': 'narrower',
      'related': 'relatedto',
      'equivalent': 'equivalent',
    };

    return mappingMap[mappingType] || 'relatedto';
  }

  /**
   * Generate UUID for FHIR resources
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generate FHIR Bundle containing multiple resources
   */
  generateBundle(
    resources: Array<FhirCodeSystem | FhirConceptMap | FhirCondition>,
    type: 'document' | 'message' | 'transaction' | 'collection' = 'collection'
  ): any {
    return {
      resourceType: 'Bundle',
      id: this.generateUUID(),
      type,
      timestamp: new Date().toISOString(),
      total: resources.length,
      entry: resources.map(resource => ({
        fullUrl: `${resource.resourceType}/${resource.id}`,
        resource,
      })),
    };
  }
}

// Export singleton instance
export const fhirGenerator = new FhirGenerator();
