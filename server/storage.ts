import { type IcdCode, type InsertIcdCode, type NamasteCode, type InsertNamasteCode, type Tm2Code, type InsertTm2Code, type CodeMapping, type InsertCodeMapping, type SearchActivity, type InsertSearchActivity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // ICD Code operations
  getIcdCode(id: string): Promise<IcdCode | undefined>;
  getIcdCodeByCode(code: string): Promise<IcdCode | undefined>;
  getIcdCodesByChapter(chapter: string): Promise<IcdCode[]>;
  getIcdCodesHierarchy(): Promise<IcdCode[]>;
  searchIcdCodes(query: string): Promise<IcdCode[]>;
  createIcdCode(code: InsertIcdCode): Promise<IcdCode>;

  // NAMASTE Code operations
  getNamasteCode(id: string): Promise<NamasteCode | undefined>;
  getNamasteCodeByCode(code: string): Promise<NamasteCode | undefined>;
  getNamasteCodesBySystem(system: string): Promise<NamasteCode[]>;
  searchNamasteCodes(query: string): Promise<NamasteCode[]>;
  createNamasteCode(code: InsertNamasteCode): Promise<NamasteCode>;

  // TM2 Code operations
  getTm2Code(id: string): Promise<Tm2Code | undefined>;
  getTm2CodeByCode(code: string): Promise<Tm2Code | undefined>;
  searchTm2Codes(query: string): Promise<Tm2Code[]>;
  createTm2Code(code: InsertTm2Code): Promise<Tm2Code>;

  // Code Mapping operations
  getCodeMapping(id: string): Promise<CodeMapping | undefined>;
  getMappingsForCode(system: string, code: string): Promise<CodeMapping[]>;
  getMappingsBetweenSystems(sourceSystem: string, targetSystem: string): Promise<CodeMapping[]>;
  translateCode(sourceSystem: string, sourceCode: string, targetSystem: string): Promise<CodeMapping[]>;
  createCodeMapping(mapping: InsertCodeMapping): Promise<CodeMapping>;

  // Search Activity
  logSearchActivity(activity: InsertSearchActivity): Promise<SearchActivity>;
  getRecentSearchActivity(): Promise<SearchActivity[]>;

  // Combined search
  globalSearch(query: string): Promise<{
    icdCodes: IcdCode[];
    namasteCodes: NamasteCode[];
    tm2Codes: Tm2Code[];
  }>;
}

export class MemStorage implements IStorage {
  private icdCodes: Map<string, IcdCode>;
  private namasteCodes: Map<string, NamasteCode>;
  private tm2Codes: Map<string, Tm2Code>;
  private codeMappings: Map<string, CodeMapping>;
  private searchActivities: Map<string, SearchActivity>;

  constructor() {
    this.icdCodes = new Map();
    this.namasteCodes = new Map();
    this.tm2Codes = new Map();
    this.codeMappings = new Map();
    this.searchActivities = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize with mock data for prototype demonstration
    // Real data would come from external APIs
    this.seedMockData();
  }

  private async seedMockData() {
    // Mock ICD-11 codes
    const mockIcdCodes = [
      {
        code: "01",
        title: "Certain infectious or parasitic diseases",
        description: "Diseases generally recognized as communicable or transmissible",
        chapter: "01",
        category: "Chapter",
        parentCode: null,
        children: ["1A00-1A9Z", "1B10-1B1Z"],
        metadata: { level: 1 }
      },
      {
        code: "1A00-1A9Z",
        title: "Gastroenteritis and colitis of infectious origin",
        description: "Gastroenteritis is characterized by inflammation of the gastrointestinal tract",
        chapter: "01",
        category: "Block",
        parentCode: "01",
        children: ["1A00", "1A0Y"],
        metadata: { level: 2 }
      },
      {
        code: "1A00",
        title: "Cholera",
        description: "An acute diarrhoeal infection caused by ingestion of food or water contaminated with the bacterium Vibrio cholerae",
        chapter: "01",
        category: "Category",
        parentCode: "1A00-1A9Z",
        children: null,
        metadata: { level: 3 }
      },
      {
        code: "1B20",
        title: "Dermatophytosis",
        description: "Fungal infection of the skin",
        chapter: "01",
        category: "Category",
        parentCode: "1B10-1B1Z",
        children: null,
        metadata: { level: 3 }
      },
      {
        code: "BA00",
        title: "Heart failure",
        description: "Inability of the heart to pump blood effectively",
        chapter: "BA",
        category: "Category",
        parentCode: null,
        children: null,
        metadata: { level: 2 }
      },
      {
        code: "J06.9",
        title: "Acute upper respiratory infection, unspecified",
        description: "Common cold or similar upper respiratory tract infection",
        chapter: "J",
        category: "Category",
        parentCode: null,
        children: null,
        metadata: { level: 2 }
      },
      {
        code: "26",
        title: "Traditional Medicine Module 2 (TM2)",
        description: "Traditional medicine diagnoses and patterns",
        chapter: "26",
        category: "Chapter",
        parentCode: null,
        children: ["TM-GI-001", "TM-RE-001", "TM-FE-001", "TM-SK-001", "TM-CA-001"],
        metadata: { level: 1 }
      }
    ];

    // Mock NAMASTE codes (expanded for comprehensive one-to-one mapping)
    const mockNamasteCodes = [
      {
        code: "AYU-DIG-001",
        title: "Grahani Roga",
        description: "Digestive disorders characterized by irregular bowel movements and abdominal discomfort in Ayurveda",
        system: "AYU",
        category: "Digestive System",
        icdMapping: "1A00-1A9Z",
        tm2Mapping: "TM-GI-001",
        metadata: { tradition: "Ayurveda", severity: "moderate" }
      },
      {
        code: "SID-DIG-003",
        title: "Vayvu Gunma",
        description: "Wind-related digestive imbalance in Siddha medicine",
        system: "SID",
        category: "Digestive System", 
        icdMapping: "1A0Z",
        tm2Mapping: "TM-GI-002",
        metadata: { tradition: "Siddha", dosha: "vata" }
      },
      {
        code: "UNA-RES-005",
        title: "Nazla Zukam",
        description: "Upper respiratory tract infection in Unani medicine",
        system: "UNA",
        category: "Respiratory System",
        icdMapping: "J06.9",
        tm2Mapping: "TM-RE-001",
        metadata: { tradition: "Unani", temperament: "cold" }
      },
      {
        code: "AYU-FEV-002",
        title: "Jwara",
        description: "Fever conditions in Ayurveda",
        system: "AYU",
        category: "Fever",
        icdMapping: "1A00",
        tm2Mapping: "TM-FE-001",
        metadata: { tradition: "Ayurveda", severity: "mild" }
      },
      {
        code: "SID-SKI-004",
        title: "Tol Noygal",
        description: "Skin disorders in Siddha medicine",
        system: "SID",
        category: "Skin",
        icdMapping: "1B20",
        tm2Mapping: "TM-SK-001",
        metadata: { tradition: "Siddha", dosha: "pitta" }
      },
      {
        code: "UNA-CAR-006",
        title: "Khaafqaan",
        description: "Heart palpitations in Unani medicine",
        system: "UNA",
        category: "Cardiovascular",
        icdMapping: "BA00",
        tm2Mapping: "TM-CA-001",
        metadata: { tradition: "Unani", temperament: "hot" }
      }
    ];

    // Mock TM2 codes (expanded for one-to-one mapping)
    const mockTm2Codes = [
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
        title: "Wind-type digestive disorder",
        description: "Digestive imbalance related to wind element patterns",
        pattern: "Wind-Digestive Pattern",
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
        code: "TM-FE-001",
        title: "Fever pattern disorder",
        description: "Traditional medicine fever patterns",
        pattern: "Heat-Fever Pattern",
        icdMapping: "1A00",
        namasteMapping: "AYU-FEV-002",
        metadata: { system: "Traditional Medicine", category: "Fever" }
      },
      {
        code: "TM-SK-001",
        title: "Skin pattern disorder",
        description: "Traditional medicine skin condition patterns",
        pattern: "Heat-Skin Pattern",
        icdMapping: "1B20",
        namasteMapping: "SID-SKI-004",
        metadata: { system: "Traditional Medicine", category: "Skin" }
      },
      {
        code: "TM-CA-001",
        title: "Heart pattern disorder",
        description: "Traditional medicine heart and cardiovascular patterns",
        pattern: "Heart-Fire Pattern",
        icdMapping: "BA00",
        namasteMapping: "UNA-CAR-006",
        metadata: { system: "Traditional Medicine", category: "Cardiovascular" }
      },
      {
        code: "26",
        title: "Traditional Medicine Conditions",
        description: "Root category for all traditional medicine pattern-based diagnoses",
        pattern: "Root Category",
        icdMapping: null,
        namasteMapping: null,
        metadata: { system: "Traditional Medicine", category: "Root" }
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
      // AYU-FEV-002 → 1A00 (ICD-11) & TM-FE-001 (TM2)
      {
        sourceSystem: "NAMASTE",
        sourceCode: "AYU-FEV-002",
        targetSystem: "ICD-11",
        targetCode: "1A00",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "AYU-FEV-002",
        targetSystem: "TM2",
        targetCode: "TM-FE-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // SID-SKI-004 → 1B20 (ICD-11) & TM-SK-001 (TM2)
      {
        sourceSystem: "NAMASTE",
        sourceCode: "SID-SKI-004",
        targetSystem: "ICD-11",
        targetCode: "1B20",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "SID-SKI-004",
        targetSystem: "TM2",
        targetCode: "TM-SK-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // UNA-CAR-006 → BA00 (ICD-11) & TM-CA-001 (TM2)
      {
        sourceSystem: "NAMASTE",
        sourceCode: "UNA-CAR-006",
        targetSystem: "ICD-11",
        targetCode: "BA00",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "NAMASTE",
        sourceCode: "UNA-CAR-006",
        targetSystem: "TM2",
        targetCode: "TM-CA-001",
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
        code: "1A00",
        title: "Cholera",
        description: "An acute diarrhoeal infection caused by ingestion of food or water contaminated with the bacterium Vibrio cholerae",
        chapter: "01",
        category: "Category",
        parentCode: "1A00-1A9Z",
        children: null,
        metadata: { level: 3 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "1A0Z",
        title: "Other gastroenteritis and colitis of infectious origin",
        description: "Other specified forms of gastroenteritis and colitis of infectious origin",
        chapter: "01",
        category: "Category",
        parentCode: "1A00-1A9Z",
        children: null,
        metadata: { level: 3 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "J06.9",
        title: "Acute upper respiratory infection, unspecified",
        description: "Acute upper respiratory infection without specification of site",
        chapter: "10",
        category: "Category",
        parentCode: null,
        children: null,
        metadata: { level: 3 },
        createdAt: new Date()
      }
    ];

    const namasteData = [
      {
        id: randomUUID(),
        code: "AYU-DIG-001",
        title: "Grahani Roga",
        description: "Digestive disorders characterized by irregular bowel movements and abdominal discomfort in Ayurveda",
        system: "AYU",
        category: "Digestive System",
        icdMapping: "1A00-1A9Z",
        tm2Mapping: "TM-GI-001",
        metadata: { tradition: "Ayurveda", severity: "moderate" },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "SID-DIG-003",
        title: "Vayvu Gunma",
        description: "Wind-related digestive imbalance in Siddha medicine",
        system: "SID",
        category: "Digestive System",
        icdMapping: "1A0Z",
        tm2Mapping: "TM-GI-002",
        metadata: { tradition: "Siddha", dosha: "vata" },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "UNA-RES-005",
        title: "Nazla Zukam",
        description: "Upper respiratory tract infection in Unani medicine",
        system: "UNA",
        category: "Respiratory System",
        icdMapping: "J06.9",
        tm2Mapping: "TM-RE-001",
        metadata: { tradition: "Unani", temperament: "cold" },
        createdAt: new Date()
      }
    ];

    const tm2Data = [
      {
        id: randomUUID(),
        code: "26",
        title: "Traditional Medicine Module 2 (TM2)",
        description: "Traditional medicine diagnoses and patterns for integrative healthcare",
        pattern: "Traditional Medicine Module",
        icdMapping: "26",
        namasteMapping: null,
        metadata: { system: "Traditional Medicine", category: "Root", level: 1 },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "TM-GI-001",
        title: "Digestive system pattern disorder",
        description: "Traditional medicine pattern involving digestive system imbalances",
        pattern: "Digestive Fire Imbalance",
        icdMapping: "1A00-1A9Z",
        namasteMapping: "AYU-DIG-001",
        metadata: { system: "Traditional Medicine", category: "Digestive" },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "TM-RE-001",
        title: "Respiratory system pattern disorder",
        description: "Traditional medicine pattern involving respiratory system imbalances",
        pattern: "Wind-Cold Pattern",
        icdMapping: "J06.9",
        namasteMapping: "UNA-RES-005",
        metadata: { system: "Traditional Medicine", category: "Respiratory" },
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        code: "TM-GI-002",
        title: "Wind-type digestive disorder",
        description: "Traditional medicine pattern involving wind-related digestive imbalances",
        pattern: "Wind-Digestive Pattern",
        icdMapping: "1A0Z",
        namasteMapping: "SID-DIG-003",
        metadata: { system: "Traditional Medicine", category: "Digestive" },
        createdAt: new Date()
      }
    ];

    // Populate the maps
    for (const item of icdData) {
      this.icdCodes.set(item.id, item as IcdCode);
    }

    for (const item of namasteData) {
      this.namasteCodes.set(item.id, item as NamasteCode);
    }

    for (const item of tm2Data) {
      this.tm2Codes.set(item.id, item as Tm2Code);
    }

    // Strict one-to-one bidirectional mappings for all codes
    const enhancedMappings = [
      ...mockMappings,
      // ICD-11 to NAMASTE reverse mappings
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
        sourceCode: "1A00",
        targetSystem: "NAMASTE",
        targetCode: "AYU-FEV-002",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "1B20",
        targetSystem: "NAMASTE",
        targetCode: "SID-SKI-004",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "BA00",
        targetSystem: "NAMASTE",
        targetCode: "UNA-CAR-006",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // TM2 to NAMASTE reverse mappings
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
        sourceCode: "TM-FE-001",
        targetSystem: "NAMASTE",
        targetCode: "AYU-FEV-002",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-SK-001",
        targetSystem: "NAMASTE",
        targetCode: "SID-SKI-004",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-CA-001",
        targetSystem: "NAMASTE",
        targetCode: "UNA-CAR-006",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // Cross-system mappings (TM2 ↔ ICD-11)
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
        sourceCode: "TM-FE-001",
        targetSystem: "ICD-11",
        targetCode: "1A00",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-SK-001",
        targetSystem: "ICD-11",
        targetCode: "1B20",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "TM2",
        sourceCode: "TM-CA-001",
        targetSystem: "ICD-11",
        targetCode: "BA00",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // Reverse ICD-11 to TM2
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
        sourceCode: "1A00",
        targetSystem: "TM2",
        targetCode: "TM-FE-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "1B20",
        targetSystem: "TM2",
        targetCode: "TM-SK-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      {
        sourceSystem: "ICD-11",
        sourceCode: "BA00",
        targetSystem: "TM2",
        targetCode: "TM-CA-001",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      }
    ];

    for (const mapping of enhancedMappings) {
      await this.createCodeMapping(mapping);
    }
  }

  async getIcdCode(id: string): Promise<IcdCode | undefined> {
    return this.icdCodes.get(id);
  }

  async getIcdCodeByCode(code: string): Promise<IcdCode | undefined> {
    return Array.from(this.icdCodes.values()).find(icd => icd.code === code);
  }

  async getIcdCodesByChapter(chapter: string): Promise<IcdCode[]> {
    return Array.from(this.icdCodes.values()).filter(icd => icd.chapter === chapter);
  }

  async getIcdCodesHierarchy(): Promise<IcdCode[]> {
    return Array.from(this.icdCodes.values()).filter(icd => !icd.parentCode);
  }

  async searchIcdCodes(query: string): Promise<IcdCode[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.icdCodes.values()).filter(icd => 
      icd.code.toLowerCase().includes(searchTerm) ||
      icd.title.toLowerCase().includes(searchTerm) ||
      icd.description?.toLowerCase().includes(searchTerm)
    );
  }

  async createIcdCode(insertCode: InsertIcdCode): Promise<IcdCode> {
    const id = randomUUID();
    const code: IcdCode = {
      ...insertCode,
      id,
      description: insertCode.description || null,
      parentCode: insertCode.parentCode || null,
      children: insertCode.children ? [...insertCode.children] : null,
      metadata: insertCode.metadata || null,
      createdAt: new Date(),
    };
    this.icdCodes.set(id, code);
    return code;
  }

  async getNamasteCode(id: string): Promise<NamasteCode | undefined> {
    return this.namasteCodes.get(id);
  }

  async getNamasteCodeByCode(code: string): Promise<NamasteCode | undefined> {
    return Array.from(this.namasteCodes.values()).find(namaste => namaste.code === code);
  }

  async getNamasteCodesBySystem(system: string): Promise<NamasteCode[]> {
    return Array.from(this.namasteCodes.values()).filter(namaste => namaste.system === system);
  }

  async searchNamasteCodes(query: string): Promise<NamasteCode[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.namasteCodes.values()).filter(namaste => 
      namaste.code.toLowerCase().includes(searchTerm) ||
      namaste.title.toLowerCase().includes(searchTerm) ||
      namaste.description?.toLowerCase().includes(searchTerm)
    );
  }

  async createNamasteCode(insertCode: InsertNamasteCode): Promise<NamasteCode> {
    const id = randomUUID();
    const code: NamasteCode = {
      ...insertCode,
      id,
      description: insertCode.description || null,
      icdMapping: insertCode.icdMapping || null,
      tm2Mapping: insertCode.tm2Mapping || null,
      metadata: insertCode.metadata || null,
      createdAt: new Date(),
    };
    this.namasteCodes.set(id, code);
    return code;
  }

  async getTm2Code(id: string): Promise<Tm2Code | undefined> {
    return this.tm2Codes.get(id);
  }

  async getTm2CodeByCode(code: string): Promise<Tm2Code | undefined> {
    return Array.from(this.tm2Codes.values()).find(tm2 => tm2.code === code);
  }

  async searchTm2Codes(query: string): Promise<Tm2Code[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.tm2Codes.values()).filter(tm2 => 
      tm2.code.toLowerCase().includes(searchTerm) ||
      tm2.title.toLowerCase().includes(searchTerm) ||
      tm2.description?.toLowerCase().includes(searchTerm)
    );
  }

  async createTm2Code(insertCode: InsertTm2Code): Promise<Tm2Code> {
    const id = randomUUID();
    const code: Tm2Code = {
      ...insertCode,
      id,
      description: insertCode.description || null,
      icdMapping: insertCode.icdMapping || null,
      namasteMapping: insertCode.namasteMapping || null,
      metadata: insertCode.metadata || null,
      createdAt: new Date(),
    };
    this.tm2Codes.set(id, code);
    return code;
  }

  async getCodeMapping(id: string): Promise<CodeMapping | undefined> {
    return this.codeMappings.get(id);
  }

  async getMappingsForCode(system: string, code: string): Promise<CodeMapping[]> {
    const allMappings = Array.from(this.codeMappings.values());
    
    const filteredMappings = allMappings.filter(mapping => 
      (mapping.sourceSystem === system && mapping.sourceCode === code) ||
      (mapping.targetSystem === system && mapping.targetCode === code)
    );
    
    return filteredMappings;
  }

  // Enhanced method to get mappings with medical names (1:1 only)
  async getMappingsWithNames(system: string, code: string): Promise<any[]> {
    const mappings = await this.getMappingsForCode(system, code);
    
    // For clean 1:1 display, filter to show only primary mappings for NAMASTE codes
    const filteredMappings = system === 'NAMASTE' 
      ? mappings.filter(mapping => 
          mapping.sourceSystem === 'NAMASTE' && 
          mapping.mappingType === 'exact' &&
          (mapping.targetSystem === 'ICD-11' || mapping.targetSystem === 'TM2')
        )
      : mappings;
    
    // Group by target system to ensure only one mapping per system
    const uniqueMappings = new Map();
    for (const mapping of filteredMappings) {
      const key = `${mapping.sourceSystem}-${mapping.targetSystem}`;
      if (!uniqueMappings.has(key)) {
        uniqueMappings.set(key, mapping);
      }
    }
    
    const enhancedMappings = [];
    
    for (const mapping of Array.from(uniqueMappings.values())) {
      // Get source code details
      let sourceTitle = mapping.sourceCode;
      if (mapping.sourceSystem === 'ICD-11') {
        const icdCode = await this.getIcdCodeByCode(mapping.sourceCode);
        sourceTitle = icdCode?.title || mapping.sourceCode;
      } else if (mapping.sourceSystem === 'NAMASTE') {
        const namasteCode = await this.getNamasteCodeByCode(mapping.sourceCode);
        sourceTitle = namasteCode?.title || mapping.sourceCode;
      } else if (mapping.sourceSystem === 'TM2') {
        const tm2Code = await this.getTm2CodeByCode(mapping.sourceCode);
        sourceTitle = tm2Code?.title || mapping.sourceCode;
      }

      // Get target code details
      let targetTitle = mapping.targetCode;
      if (mapping.targetSystem === 'ICD-11') {
        const icdCode = await this.getIcdCodeByCode(mapping.targetCode);
        targetTitle = icdCode?.title || mapping.targetCode;
      } else if (mapping.targetSystem === 'NAMASTE') {
        const namasteCode = await this.getNamasteCodeByCode(mapping.targetCode);
        targetTitle = namasteCode?.title || mapping.targetCode;
      } else if (mapping.targetSystem === 'TM2') {
        const tm2Code = await this.getTm2CodeByCode(mapping.targetCode);
        targetTitle = tm2Code?.title || mapping.targetCode;
      }

      enhancedMappings.push({
        ...mapping,
        sourceTitle,
        targetTitle
      });
    }
    
    return enhancedMappings;
  }

  async getMappingsBetweenSystems(sourceSystem: string, targetSystem: string): Promise<CodeMapping[]> {
    return Array.from(this.codeMappings.values()).filter(mapping => 
      mapping.sourceSystem === sourceSystem && 
      mapping.targetSystem === targetSystem &&
      mapping.isActive
    );
  }

  async translateCode(sourceSystem: string, sourceCode: string, targetSystem: string): Promise<CodeMapping[]> {
    return Array.from(this.codeMappings.values()).filter(mapping => 
      mapping.sourceSystem === sourceSystem && 
      mapping.sourceCode === sourceCode && 
      mapping.targetSystem === targetSystem &&
      mapping.isActive
    );
  }

  async createCodeMapping(insertMapping: InsertCodeMapping): Promise<CodeMapping> {
    const id = randomUUID();
    const mapping: CodeMapping = {
      ...insertMapping,
      id,
      confidence: insertMapping.confidence || null,
      isActive: insertMapping.isActive ?? null,
      createdAt: new Date(),
    };
    this.codeMappings.set(id, mapping);
    return mapping;
  }

  async logSearchActivity(insertActivity: InsertSearchActivity): Promise<SearchActivity> {
    const id = randomUUID();
    const activity: SearchActivity = {
      ...insertActivity,
      id,
      resultCount: insertActivity.resultCount || null,
      timestamp: new Date(),
    };
    this.searchActivities.set(id, activity);
    return activity;
  }

  async getRecentSearchActivity(): Promise<SearchActivity[]> {
    return Array.from(this.searchActivities.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, 10);
  }

  // Debug method to list all mappings
  async getAllMappings(): Promise<CodeMapping[]> {
    return Array.from(this.codeMappings.values());
  }

  async globalSearch(query: string): Promise<{
    icdCodes: IcdCode[];
    namasteCodes: NamasteCode[];
    tm2Codes: Tm2Code[];
  }> {
    const [icdCodes, namasteCodes, tm2Codes] = await Promise.all([
      this.searchIcdCodes(query),
      this.searchNamasteCodes(query),
      this.searchTm2Codes(query)
    ]);

    return { icdCodes, namasteCodes, tm2Codes };
  }

  // Validation method to ensure one-to-one mapping integrity
  async validateOneToOneMappings(): Promise<{isValid: boolean, violations: string[]}> {
    const violations: string[] = [];
    const namasteToIcd = new Map<string, string[]>();
    const namasteToTm2 = new Map<string, string[]>();
    
    // Group mappings by NAMASTE source codes
    const mappings = Array.from(this.codeMappings.values());
    
    for (const mapping of mappings) {
      if (mapping.sourceSystem === 'NAMASTE' && mapping.isActive) {
        if (mapping.targetSystem === 'ICD-11') {
          if (!namasteToIcd.has(mapping.sourceCode)) {
            namasteToIcd.set(mapping.sourceCode, []);
          }
          namasteToIcd.get(mapping.sourceCode)!.push(mapping.targetCode);
        } else if (mapping.targetSystem === 'TM2') {
          if (!namasteToTm2.has(mapping.sourceCode)) {
            namasteToTm2.set(mapping.sourceCode, []);
          }
          namasteToTm2.get(mapping.sourceCode)!.push(mapping.targetCode);
        }
      }
    }
    
    // Check for violations (more than one mapping per NAMASTE code)
    namasteToIcd.forEach((targets, source) => {
      if (targets.length > 1) {
        violations.push(`NAMASTE code '${source}' maps to multiple ICD-11 codes: ${targets.join(', ')}`);
      }
    });
    
    namasteToTm2.forEach((targets, source) => {
      if (targets.length > 1) {
        violations.push(`NAMASTE code '${source}' maps to multiple TM2 codes: ${targets.join(', ')}`);
      }
    });
    
    return {
      isValid: violations.length === 0,
      violations
    };
  }
}

export const storage = new MemStorage();
