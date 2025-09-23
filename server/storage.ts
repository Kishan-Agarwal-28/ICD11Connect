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
        code: "26",
        title: "Traditional Medicine Module 2 (TM2)",
        description: "Traditional medicine diagnoses and patterns",
        chapter: "26",
        category: "Chapter",
        parentCode: null,
        children: ["TM-GI-001", "TM-RE-001"],
        metadata: { level: 1 }
      }
    ];

    // Mock NAMASTE codes
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
      }
    ];

    // Mock TM2 codes
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
        code: "TM-RE-001",
        title: "Respiratory system pattern disorder",
        description: "Traditional medicine pattern involving respiratory system imbalances",
        pattern: "Wind-Cold Pattern",
        icdMapping: "J06.9",
        namasteMapping: "UNA-RES-005",
        metadata: { system: "Traditional Medicine", category: "Respiratory" }
      }
    ];

    // Mock code mappings
    const mockMappings = [
      {
        sourceSystem: "NAMASTE",
        sourceCode: "AYU-DIG-001",
        targetSystem: "ICD-11",
        targetCode: "1A00-1A9Z",
        mappingType: "related",
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
      }
    ];

    // Seed the data
    for (const icdCode of mockIcdCodes) {
      await this.createIcdCode(icdCode);
    }

    for (const namasteCode of mockNamasteCodes) {
      await this.createNamasteCode(namasteCode);
    }

    for (const tm2Code of mockTm2Codes) {
      await this.createTm2Code(tm2Code);
    }

    for (const mapping of mockMappings) {
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
      children: insertCode.children || null,
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
    return Array.from(this.codeMappings.values()).filter(mapping => 
      (mapping.sourceSystem === system && mapping.sourceCode === code) ||
      (mapping.targetSystem === system && mapping.targetCode === code)
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
}

export const storage = new MemStorage();
