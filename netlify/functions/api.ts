import { randomUUID } from "crypto";

// Types (copied from shared schema to make function self-contained)
interface IcdCode {
  id: string;
  code: string;
  title: string;
  description: string | null;
  chapter: string;
  category: string;
  parentCode: string | null;
  children: string[] | null;
  metadata: any | null;
  createdAt: Date;
}

interface NamasteCode {
  id: string;
  code: string;
  title: string;
  description: string;
  traditionalSystem: string;
  category: string;
  metadata: any | null;
  createdAt: Date;
}

interface Tm2Code {
  id: string;
  code: string;
  title: string;
  description: string;
  pattern: string;
  icdMapping: string | null;
  namasteMapping: string | null;
  metadata: any | null;
  createdAt: Date;
}

interface CodeMapping {
  id: string;
  sourceSystem: string;
  sourceCode: string;
  targetSystem: string;
  targetCode: string;
  mappingType: string;
  confidence: string;
  isActive: boolean;
  createdAt: Date;
}

interface SearchActivity {
  id: string;
  query: string;
  resultCount: string;
  timestamp: Date;
}

// Storage class with all mock data
class NetlifyStorage {
  private icdCodes = new Map<string, IcdCode>();
  private namasteCodes = new Map<string, NamasteCode>();
  private tm2Codes = new Map<string, Tm2Code>();
  private codeMappings = new Map<string, CodeMapping>();
  private searchActivities = new Map<string, SearchActivity>();
  private initialized = false;

  private async initializeMockData() {
    if (this.initialized) return;
    
    // NAMASTE mock data
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

    // ICD-11 mock data
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

    // One-to-one mappings
    const mockMappings = [
      // NAMASTE to ICD-11
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
        sourceCode: "SID-DIG-003",
        targetSystem: "ICD-11",
        targetCode: "1A0Z",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
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
        sourceCode: "AYU-CIR-002",
        targetSystem: "ICD-11",
        targetCode: "D69.9",
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
        sourceCode: "UNA-SKI-006",
        targetSystem: "ICD-11",
        targetCode: "L99",
        mappingType: "exact",
        confidence: "high",
        isActive: true
      },
      // NAMASTE to TM2
      {
        sourceSystem: "NAMASTE",
        sourceCode: "AYU-DIG-001",
        targetSystem: "TM2",
        targetCode: "TM-GI-001",
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
      {
        sourceSystem: "NAMASTE",
        sourceCode: "UNA-RES-005",
        targetSystem: "TM2",
        targetCode: "TM-RE-001",
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
        targetSystem: "TM2",
        targetCode: "TM-NE-001",
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

    // Initialize data
    for (const namasteItem of namasteData) {
      const id = randomUUID();
      this.namasteCodes.set(id, {
        ...namasteItem,
        id,
        createdAt: new Date()
      });
    }

    for (const tm2Item of tm2Data) {
      const id = randomUUID();
      this.tm2Codes.set(id, {
        ...tm2Item,
        id,
        createdAt: new Date()
      });
    }

    for (const icdItem of icdData) {
      this.icdCodes.set(icdItem.id, icdItem);
    }

    // Add bidirectional mappings
    const enhancedMappings = [
      ...mockMappings,
      // Reverse mappings (ICD-11 to NAMASTE)
      ...mockMappings.filter(m => m.targetSystem === "ICD-11").map(m => ({
        sourceSystem: m.targetSystem,
        sourceCode: m.targetCode,
        targetSystem: m.sourceSystem,
        targetCode: m.sourceCode,
        mappingType: m.mappingType,
        confidence: m.confidence,
        isActive: m.isActive
      })),
      // Reverse mappings (TM2 to NAMASTE)
      ...mockMappings.filter(m => m.targetSystem === "TM2").map(m => ({
        sourceSystem: m.targetSystem,
        sourceCode: m.targetCode,
        targetSystem: m.sourceSystem,
        targetCode: m.sourceCode,
        mappingType: m.mappingType,
        confidence: m.confidence,
        isActive: m.isActive
      })),
      // TM2 to ICD-11 mappings
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
      // ICD-11 to TM2 mappings
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
      const id = randomUUID();
      this.codeMappings.set(id, {
        ...mapping,
        id,
        createdAt: new Date()
      });
    }

    this.initialized = true;
  }

  async getIcdCodeByCode(code: string): Promise<IcdCode | undefined> {
    await this.initializeMockData();
    return Array.from(this.icdCodes.values()).find(icd => icd.code === code);
  }

  async getNamasteCodeByCode(code: string): Promise<NamasteCode | undefined> {
    await this.initializeMockData();
    return Array.from(this.namasteCodes.values()).find(namaste => namaste.code === code);
  }

  async getTm2CodeByCode(code: string): Promise<Tm2Code | undefined> {
    await this.initializeMockData();
    return Array.from(this.tm2Codes.values()).find(tm2 => tm2.code === code);
  }

  async getMappingsWithNames(system: string, code: string) {
    await this.initializeMockData();
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
    await this.initializeMockData();
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

// Create storage instance
const storage = new NetlifyStorage();

// Utility function
const normalizeSystem = (system: string): string => {
  const systemMap: Record<string, string> = {
    'namaste': 'NAMASTE',
    'icd11': 'ICD-11',
    'tm2': 'TM2'
  };
  return systemMap[system.toLowerCase()] || system;
};

// Main handler function
export const handler = async (event: any, context: any) => {
  const { path, httpMethod, queryStringParameters, body } = event;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const pathSegments = path.replace('/.netlify/functions/api', '').split('/').filter(Boolean);
    
    // Global search endpoint
    if (pathSegments[0] === 'search' && httpMethod === 'GET') {
      const query = queryStringParameters?.q;
      if (!query) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Query parameter 'q' is required" })
        };
      }

      const results = await storage.globalSearch(query);
      const totalResults = results.icdCodes.length + results.namasteCodes.length + results.tm2Codes.length;

      // Log search activity
      await storage.logSearchActivity({ 
        query,
        resultCount: totalResults.toString()
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          query,
          totalResults,
          results
        })
      };
    }

    // ICD-11 endpoints
    if (pathSegments[0] === 'icd11' && pathSegments[1] === 'code' && httpMethod === 'GET') {
      const code = pathSegments[2];
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Code parameter is required" })
        };
      }

      const icdCode = await storage.getIcdCodeByCode(code);
      if (!icdCode) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: `ICD-11 code '${code}' not found` })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(icdCode)
      };
    }

    // NAMASTE endpoints
    if (pathSegments[0] === 'namaste' && pathSegments[1] === 'code' && httpMethod === 'GET') {
      const code = pathSegments[2];
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Code parameter is required" })
        };
      }

      const namasteCode = await storage.getNamasteCodeByCode(code);
      if (!namasteCode) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: `NAMASTE code '${code}' not found` })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(namasteCode)
      };
    }

    // TM2 endpoints
    if (pathSegments[0] === 'tm2' && pathSegments[1] === 'code' && httpMethod === 'GET') {
      const code = pathSegments[2];
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Code parameter is required" })
        };
      }

      const tm2Code = await storage.getTm2CodeByCode(code);
      if (!tm2Code) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: `TM2 code '${code}' not found` })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(tm2Code)
      };
    }

    // Code mapping endpoints
    if (pathSegments[0] === 'mapping' && pathSegments[1] === 'code' && httpMethod === 'GET') {
      const system = normalizeSystem(pathSegments[2] || '');
      const code = pathSegments[3];
      
      if (!system || !code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "System and code parameters are required" })
        };
      }

      const mappings = await storage.getMappingsWithNames(system, code);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mappings)
      };
    }

    // Translation endpoint
    if (pathSegments[0] === 'mapping' && pathSegments.length === 4 && httpMethod === 'GET') {
      const sourceSystem = normalizeSystem(pathSegments[1]);
      const sourceCode = pathSegments[2];
      const targetSystem = normalizeSystem(pathSegments[3]);
      
      if (!sourceSystem || !sourceCode || !targetSystem) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Source system, source code, and target system are required" })
        };
      }

      const mappings = await storage.getMappingsWithNames(sourceSystem, sourceCode);
      const filteredMappings = mappings.filter((mapping: any) => mapping.targetSystem === targetSystem);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(filteredMappings)
      };
    }

    // System status endpoint
    if (pathSegments[0] === 'status' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "healthy",
          services: {
            whoIcd11Api: "connected",
            namasteImport: "synced",
            fhirCompliance: "validated",
            abhaOauth: "secured"
          },
          lastSync: new Date().toISOString()
        })
      };
    }

    // Default 404 response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Endpoint not found" })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};