import { randomUUID } from "crypto";
import type { IcdCode, NamasteCode, Tm2Code, CodeMapping, SearchActivity } from "../shared/schema";

class NetlifyStorage {
  private icdCodes = new Map<string, IcdCode>();
  private namasteCodes = new Map<string, NamasteCode>();
  private tm2Codes = new Map<string, Tm2Code>();
  private codeMappings = new Map<string, CodeMapping>();
  private searchActivities = new Map<string, SearchActivity>();

  constructor() {
    this.initializeMockData();
  }

  private async initializeMockData() {
    // NAMASTE mock data with comprehensive traditional medicine codes
    const namasteData = [
      {
        code: "AYU-DIG-001",
        title: "Grahani Roga",
        description: "Digestive disorders characterized by irregular bowel movements and abdominal discomfort in Ayurveda",
        traditionalSystem: "AYU",
        category: "Digestive System",
        metadata: { 
          system: "Ayurveda", 
          category: "Digestive System",
          sanskritTerm: "ग्रहणी रोग"
        }
      },
      {
        code: "SID-DIG-003",
        title: "Gunmam",
        description: "Digestive fire disorders in Siddha medicine affecting stomach and intestines",
        traditionalSystem: "SID",
        category: "Digestive System",
        metadata: { 
          system: "Siddha", 
          category: "Digestive System",
          tamilTerm: "குன்மம்"
        }
      },
      {
        code: "UNA-RES-005",
        title: "Nazla",
        description: "Upper respiratory tract disorders with nasal congestion in Unani medicine",
        traditionalSystem: "UNA",
        category: "Respiratory System",
        metadata: { 
          system: "Unani", 
          category: "Respiratory System",
          arabicTerm: "نزلة"
        }
      },
      {
        code: "AYU-CIR-002",
        title: "Raktapitta",
        description: "Blood disorders with bleeding tendencies in Ayurveda",
        traditionalSystem: "AYU",
        category: "Circulatory System",
        metadata: { 
          system: "Ayurveda", 
          category: "Circulatory System",
          sanskritTerm: "रक्तपित्त"
        }
      },
      {
        code: "SID-NEU-004",
        title: "Vata Naadi",
        description: "Neurological disorders affecting movement and coordination in Siddha",
        traditionalSystem: "SID",
        category: "Nervous System",
        metadata: { 
          system: "Siddha", 
          category: "Nervous System",
          tamilTerm: "வாத நாடி"
        }
      },
      {
        code: "UNA-SKI-006",
        title: "Juzam",
        description: "Chronic skin conditions with discoloration in Unani medicine",
        traditionalSystem: "UNA",
        category: "Skin",
        metadata: { 
          system: "Unani", 
          category: "Skin",
          arabicTerm: "جذام"
        }
      }
    ];

    // TM2 mock data
    const tm2Data = [
      {
        code: "TM-GI-001",
        title: "Digestive system pattern disorder",
        description: "Traditional medicine pattern involving digestive system imbalances",
        pattern: "Digestive Fire Imbalance",
        icdMapping: "1A00-1A9Z",
        namasteMapping: "AYU-DIG-001",
        metadata: { system: "Traditional Medicine", category: "Digestive" }
      },
      {
        code: "TM-GI-002",
        title: "Gastric pattern disorder",
        description: "Traditional medicine pattern for stomach-related conditions",
        pattern: "Stomach Heat Pattern",
        icdMapping: "1A0Z",
        namasteMapping: "SID-DIG-003",
        metadata: { system: "Traditional Medicine", category: "Digestive" }
      },
      {
        code: "TM-RE-001",
        title: "Respiratory system pattern disorder",
        description: "Traditional medicine pattern involving respiratory system imbalances",
        pattern: "Wind-Cold Pattern",
        icdMapping: "J06.9",
        namasteMapping: "UNA-RES-005",
        metadata: { system: "Traditional Medicine", category: "Respiratory" }
      },
      {
        code: "TM-CI-001",
        title: "Blood circulation pattern disorder",
        description: "Traditional medicine pattern for blood and circulation issues",
        pattern: "Blood Stasis Pattern",
        icdMapping: "D69.9",
        namasteMapping: "AYU-CIR-002",
        metadata: { system: "Traditional Medicine", category: "Circulatory" }
      },
      {
        code: "TM-NE-001",
        title: "Nervous system pattern disorder",
        description: "Traditional medicine pattern for neurological conditions",
        pattern: "Wind Disturbance Pattern",
        icdMapping: "G93.9",
        namasteMapping: "SID-NEU-004",
        metadata: { system: "Traditional Medicine", category: "Nervous" }
      },
      {
        code: "TM-SK-001",
        title: "Skin pattern disorder",
        description: "Traditional medicine pattern for chronic skin conditions",
        pattern: "Heat-Toxin Pattern",
        icdMapping: "L99",
        namasteMapping: "UNA-SKI-006",
        metadata: { system: "Traditional Medicine", category: "Skin" }
      }
    ];

    // One-to-one mappings: Each NAMASTE code maps to exactly one ICD-11 and one TM2 code
    const mockMappings = [
      // AYU-DIG-001 → 1A00-1A9Z (ICD-11) & TM-GI-001 (TM2)
      {
        sourceSystem: "NAMASTE",
        sourceCode: "AYU-DIG-001",
        targetSystem: "ICD-11",
        targetCode: "1A00-1A9Z",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "AYU-DIG-001",
        targetSystem: "TM2",
        targetCode: "TM-GI-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // SID-DIG-003 → 1A0Z (ICD-11) & TM-GI-002 (TM2)
      {
        sourceSystem: "NAMASTE",
        sourceCode: "SID-DIG-003",
        targetSystem: "ICD-11",
        targetCode: "1A0Z",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "SID-DIG-003",
        targetSystem: "TM2",
        targetCode: "TM-GI-002",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // UNA-RES-005 → J06.9 (ICD-11) & TM-RE-001 (TM2)
      {
        sourceSystem: "NAMASTE",
        sourceCode: "UNA-RES-005",
        targetSystem: "ICD-11",
        targetCode: "J06.9",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "UNA-RES-005",
        targetSystem: "TM2",
        targetCode: "TM-RE-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // Additional mappings for new codes
      {
        sourceSystem: "NAMASTE",
        sourceCode: "AYU-CIR-002",
        targetSystem: "ICD-11",
        targetCode: "D69.9",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "AYU-CIR-002",
        targetSystem: "TM2",
        targetCode: "TM-CI-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "SID-NEU-004",
        targetSystem: "ICD-11",
        targetCode: "G93.9",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "SID-NEU-004",
        targetSystem: "TM2",
        targetCode: "TM-NE-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "UNA-SKI-006",
        targetSystem: "ICD-11",
        targetCode: "L99",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "UNA-SKI-006",
        targetSystem: "TM2",
        targetCode: "TM-SK-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      }
    ];

    // Seed the data directly into maps
    const icdData = [
      {
        id: randomUUID(),
        code: "01",
        title: "Certain infectious or parasitic diseases",
        description: "Diseases generally recognized as communicable or transmissible",
        chapter: "01",
        category: "Chapter",
        parentCode: null,
        children: ["1A00-1A9Z", "1B10-1B1Z"],
        metadata: { level: 1 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "1A00-1A9Z",
        title: "Gastroenteritis and colitis of infectious origin",
        description: "Gastroenteritis is characterized by inflammation of the gastrointestinal tract",
        chapter: "01",
        category: "Block",
        parentCode: "01",
        children: ["1A00", "1A0Y"],
        metadata: { level: 2 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "1A0Z",
        title: "Gastroenteritis and colitis of infectious origin, unspecified",
        description: "Unspecified gastroenteritis and colitis of infectious origin",
        chapter: "01",
        category: "Specific",
        parentCode: "1A00-1A9Z",
        children: null,
        metadata: { level: 3 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "J06.9",
        title: "Acute upper respiratory infection, unspecified",
        description: "Upper respiratory infection affecting nose, throat, or larynx",
        chapter: "11",
        category: "Specific",
        parentCode: "J00-J06",
        children: null,
        metadata: { level: 3 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "D69.9",
        title: "Bleeding disorder, unspecified",
        description: "Unspecified bleeding or hemorrhagic condition",
        chapter: "03",
        category: "Specific",
        parentCode: "D69",
        children: null,
        metadata: { level: 3 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "G93.9",
        title: "Disorder of brain, unspecified",
        description: "Unspecified disorder affecting brain function",
        chapter: "08",
        category: "Specific",
        parentCode: "G93",
        children: null,
        metadata: { level: 3 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "L99",
        title: "Other disorders of skin and subcutaneous tissue in diseases classified elsewhere",
        description: "Skin conditions secondary to other diseases",
        chapter: "12",
        category: "Specific",
        parentCode: "L80-L99",
        children: null,
        metadata: { level: 3 },
        createdAt: new Date()
      }
    ];

    for (const namasteItem of namasteData) {
      const id = randomUUID();
      await this.createNamasteCode({
        ...namasteItem,
        id,
        createdAt: new Date()
      });
    }

    for (const tm2Item of tm2Data) {
      const id = randomUUID();
      await this.createTm2Code({
        ...tm2Item,
        id,
        createdAt: new Date()
      });
    }

    for (const icdItem of icdData) {
      this.icdCodes.set(icdItem.id, icdItem);
    }

    // Strict one-to-one bidirectional mappings
    const enhancedMappings = [
      ...mockMappings,
      // Reverse mappings - exactly one mapping per code pair
      // ICD-11 to NAMASTE
      {
        sourceSystem: "ICD-11",
        sourceCode: "1A00-1A9Z",
        targetSystem: "NAMASTE",
        targetCode: "AYU-DIG-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "1A0Z",
        targetSystem: "NAMASTE",
        targetCode: "SID-DIG-003",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "J06.9",
        targetSystem: "NAMASTE",
        targetCode: "UNA-RES-005",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "D69.9",
        targetSystem: "NAMASTE",
        targetCode: "AYU-CIR-002",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "G93.9",
        targetSystem: "NAMASTE",
        targetCode: "SID-NEU-004",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "L99",
        targetSystem: "NAMASTE",
        targetCode: "UNA-SKI-006",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // TM2 to NAMASTE
      {
        sourceSystem: "TM2",
        sourceCode: "TM-GI-001",
        targetSystem: "NAMASTE",
        targetCode: "AYU-DIG-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-GI-002",
        targetSystem: "NAMASTE",
        targetCode: "SID-DIG-003",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-RE-001",
        targetSystem: "NAMASTE",
        targetCode: "UNA-RES-005",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-CI-001",
        targetSystem: "NAMASTE",
        targetCode: "AYU-CIR-002",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-NE-001",
        targetSystem: "NAMASTE",
        targetCode: "SID-NEU-004",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-SK-001",
        targetSystem: "NAMASTE",
        targetCode: "UNA-SKI-006",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // TM2 to ICD-11
      {
        sourceSystem: "TM2",
        sourceCode: "TM-GI-001",
        targetSystem: "ICD-11",
        targetCode: "1A00-1A9Z",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-GI-002",
        targetSystem: "ICD-11",
        targetCode: "1A0Z",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-RE-001",
        targetSystem: "ICD-11",
        targetCode: "J06.9",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-CI-001",
        targetSystem: "ICD-11",
        targetCode: "D69.9",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-NE-001",
        targetSystem: "ICD-11",
        targetCode: "G93.9",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-SK-001",
        targetSystem: "ICD-11",
        targetCode: "L99",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // ICD-11 to TM2
      {
        sourceSystem: "ICD-11",
        sourceCode: "1A00-1A9Z",
        targetSystem: "TM2",
        targetCode: "TM-GI-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "1A0Z",
        targetSystem: "TM2",
        targetCode: "TM-GI-002",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "J06.9",
        targetSystem: "TM2",
        targetCode: "TM-RE-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "D69.9",
        targetSystem: "TM2",
        targetCode: "TM-CI-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "G93.9",
        targetSystem: "TM2",
        targetCode: "TM-NE-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "L99",
        targetSystem: "TM2",
        targetCode: "TM-SK-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      }
    ];

    for (const mapping of enhancedMappings) {
      await this.createCodeMapping(mapping);
    }
  }

  // Helper methods for creating data
  async createNamasteCode(data: any): Promise<NamasteCode> {
    const namasteCode: NamasteCode = {
      id: data.id,
      code: data.code,
      title: data.title,
      description: data.description,
      traditionalSystem: data.traditionalSystem,
      category: data.category,
      metadata: data.metadata,
      createdAt: data.createdAt
    };
    this.namasteCodes.set(data.id, namasteCode);
    return namasteCode;
  }

  async createTm2Code(data: any): Promise<Tm2Code> {
    const tm2Code: Tm2Code = {
      id: data.id,
      code: data.code,
      title: data.title,
      description: data.description,
      pattern: data.pattern,
      icdMapping: data.icdMapping,
      namasteMapping: data.namasteMapping,
      metadata: data.metadata,
      createdAt: data.createdAt
    };
    this.tm2Codes.set(data.id, tm2Code);
    return tm2Code;
  }

  async createCodeMapping(mapping: any): Promise<CodeMapping> {
    const id = randomUUID();
    const codeMapping: CodeMapping = {
      id,
      sourceSystem: mapping.sourceSystem,
      sourceCode: mapping.sourceCode,
      targetSystem: mapping.targetSystem,
      targetCode: mapping.targetCode,
      mappingType: mapping.mappingType,
      confidence: mapping.confidence,
      isActive: mapping.isActive,
      createdAt: new Date()
    };
    this.codeMappings.set(id, codeMapping);
    return codeMapping;
  }

  // Getter methods for Netlify functions
  async getIcdCodeByCode(code: string): Promise<IcdCode | undefined> {
    return Array.from(this.icdCodes.values()).find(icd => icd.code === code);
  }

  async getNamasteCodeByCode(code: string): Promise<NamasteCode | undefined> {
    return Array.from(this.namasteCodes.values()).find(namaste => namaste.code === code);
  }

  async getTm2CodeByCode(code: string): Promise<Tm2Code | undefined> {
    return Array.from(this.tm2Codes.values()).find(tm2 => tm2.code === code);
  }

  async getMappingsWithNames(system: string, code: string) {
    const mappings = Array.from(this.codeMappings.values()).filter(mapping => 
      mapping.sourceSystem === system && 
      mapping.sourceCode === code && 
      mapping.isActive
    );

    const enhancedMappings = [];
    const seenTargets = new Set<string>();

    for (const mapping of mappings) {
      const targetKey = `${mapping.targetSystem}-${mapping.targetCode}`;
      if (seenTargets.has(targetKey)) continue;
      seenTargets.add(targetKey);

      let sourceTitle = '';
      let targetTitle = '';

      // Get source title
      if (mapping.sourceSystem === 'NAMASTE') {
        const sourceCode = await this.getNamasteCodeByCode(mapping.sourceCode);
        sourceTitle = sourceCode?.title || mapping.sourceCode;
      } else if (mapping.sourceSystem === 'ICD-11') {
        const sourceCode = await this.getIcdCodeByCode(mapping.sourceCode);
        sourceTitle = sourceCode?.title || mapping.sourceCode;
      } else if (mapping.sourceSystem === 'TM2') {
        const sourceCode = await this.getTm2CodeByCode(mapping.sourceCode);
        sourceTitle = sourceCode?.title || mapping.sourceCode;
      }

      // Get target title
      if (mapping.targetSystem === 'NAMASTE') {
        const targetCode = await this.getNamasteCodeByCode(mapping.targetCode);
        targetTitle = targetCode?.title || mapping.targetCode;
      } else if (mapping.targetSystem === 'ICD-11') {
        const targetCode = await this.getIcdCodeByCode(mapping.targetCode);
        targetTitle = targetCode?.title || mapping.targetCode;
      } else if (mapping.targetSystem === 'TM2') {
        const targetCode = await this.getTm2CodeByCode(mapping.targetCode);
        targetTitle = targetCode?.title || mapping.targetCode;
      }

      enhancedMappings.push({
        ...mapping,
        sourceTitle,
        targetTitle
      });
    }

    return enhancedMappings;
  }

  async globalSearch(query: string) {
    const searchTerm = query.toLowerCase();
    
    const icdCodes = Array.from(this.icdCodes.values()).filter(icd => 
      icd.code.toLowerCase().includes(searchTerm) ||
      icd.title.toLowerCase().includes(searchTerm) ||
      icd.description?.toLowerCase().includes(searchTerm)
    );

    const namasteCodes = Array.from(this.namasteCodes.values()).filter(namaste => 
      namaste.code.toLowerCase().includes(searchTerm) ||
      namaste.title.toLowerCase().includes(searchTerm) ||
      namaste.description?.toLowerCase().includes(searchTerm)
    );

    const tm2Codes = Array.from(this.tm2Codes.values()).filter(tm2 => 
      tm2.code.toLowerCase().includes(searchTerm) ||
      tm2.title.toLowerCase().includes(searchTerm) ||
      tm2.description?.toLowerCase().includes(searchTerm)
    );

    return { icdCodes, namasteCodes, tm2Codes };
  }

  async logSearchActivity(data: { query: string; resultCount: string }) {
    const id = randomUUID();
    const activity: SearchActivity = {
      id,
      query: data.query,
      resultCount: data.resultCount,
      timestamp: new Date()
    };
    this.searchActivities.set(id, activity);
    return activity;
  }
}

export const netlifyStorage = new NetlifyStorage();