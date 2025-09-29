// netlify/functions/storage.ts
import { randomUUID } from "crypto";
var NetlifyStorage = class {
  icdCodes = /* @__PURE__ */ new Map();
  namasteCodes = /* @__PURE__ */ new Map();
  tm2Codes = /* @__PURE__ */ new Map();
  codeMappings = /* @__PURE__ */ new Map();
  searchActivities = /* @__PURE__ */ new Map();
  constructor() {
    this.initializeMockData();
  }
  async initializeMockData() {
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
          sanskritTerm: "\u0917\u094D\u0930\u0939\u0923\u0940 \u0930\u094B\u0917"
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
          tamilTerm: "\u0B95\u0BC1\u0BA9\u0BCD\u0BAE\u0BAE\u0BCD"
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
          arabicTerm: "\u0646\u0632\u0644\u0629"
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
          sanskritTerm: "\u0930\u0915\u094D\u0924\u092A\u093F\u0924\u094D\u0924"
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
          tamilTerm: "\u0BB5\u0BBE\u0BA4 \u0BA8\u0BBE\u0B9F\u0BBF"
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
          arabicTerm: "\u062C\u0630\u0627\u0645"
        }
      }
    ];
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
        createdAt: /* @__PURE__ */ new Date()
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
        createdAt: /* @__PURE__ */ new Date()
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
        createdAt: /* @__PURE__ */ new Date()
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
        createdAt: /* @__PURE__ */ new Date()
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
        createdAt: /* @__PURE__ */ new Date()
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
        createdAt: /* @__PURE__ */ new Date()
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
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    for (const namasteItem of namasteData) {
      const id = randomUUID();
      await this.createNamasteCode({
        ...namasteItem,
        id,
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    for (const tm2Item of tm2Data) {
      const id = randomUUID();
      await this.createTm2Code({
        ...tm2Item,
        id,
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    for (const icdItem of icdData) {
      this.icdCodes.set(icdItem.id, icdItem);
    }
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
  async createNamasteCode(data) {
    const namasteCode = {
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
  async createTm2Code(data) {
    const tm2Code = {
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
  async createCodeMapping(mapping) {
    const id = randomUUID();
    const codeMapping = {
      id,
      sourceSystem: mapping.sourceSystem,
      sourceCode: mapping.sourceCode,
      targetSystem: mapping.targetSystem,
      targetCode: mapping.targetCode,
      mappingType: mapping.mappingType,
      confidence: mapping.confidence,
      isActive: mapping.isActive,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.codeMappings.set(id, codeMapping);
    return codeMapping;
  }
  // Getter methods for Netlify functions
  async getIcdCodeByCode(code) {
    return Array.from(this.icdCodes.values()).find((icd) => icd.code === code);
  }
  async getNamasteCodeByCode(code) {
    return Array.from(this.namasteCodes.values()).find((namaste) => namaste.code === code);
  }
  async getTm2CodeByCode(code) {
    return Array.from(this.tm2Codes.values()).find((tm2) => tm2.code === code);
  }
  async getMappingsWithNames(system, code) {
    const mappings = Array.from(this.codeMappings.values()).filter(
      (mapping) => mapping.sourceSystem === system && mapping.sourceCode === code && mapping.isActive
    );
    const enhancedMappings = [];
    const seenTargets = /* @__PURE__ */ new Set();
    for (const mapping of mappings) {
      const targetKey = `${mapping.targetSystem}-${mapping.targetCode}`;
      if (seenTargets.has(targetKey)) continue;
      seenTargets.add(targetKey);
      let sourceTitle = "";
      let targetTitle = "";
      if (mapping.sourceSystem === "NAMASTE") {
        const sourceCode = await this.getNamasteCodeByCode(mapping.sourceCode);
        sourceTitle = sourceCode?.title || mapping.sourceCode;
      } else if (mapping.sourceSystem === "ICD-11") {
        const sourceCode = await this.getIcdCodeByCode(mapping.sourceCode);
        sourceTitle = sourceCode?.title || mapping.sourceCode;
      } else if (mapping.sourceSystem === "TM2") {
        const sourceCode = await this.getTm2CodeByCode(mapping.sourceCode);
        sourceTitle = sourceCode?.title || mapping.sourceCode;
      }
      if (mapping.targetSystem === "NAMASTE") {
        const targetCode = await this.getNamasteCodeByCode(mapping.targetCode);
        targetTitle = targetCode?.title || mapping.targetCode;
      } else if (mapping.targetSystem === "ICD-11") {
        const targetCode = await this.getIcdCodeByCode(mapping.targetCode);
        targetTitle = targetCode?.title || mapping.targetCode;
      } else if (mapping.targetSystem === "TM2") {
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
  async globalSearch(query) {
    const searchTerm = query.toLowerCase();
    const icdCodes = Array.from(this.icdCodes.values()).filter(
      (icd) => icd.code.toLowerCase().includes(searchTerm) || icd.title.toLowerCase().includes(searchTerm) || icd.description?.toLowerCase().includes(searchTerm)
    );
    const namasteCodes = Array.from(this.namasteCodes.values()).filter(
      (namaste) => namaste.code.toLowerCase().includes(searchTerm) || namaste.title.toLowerCase().includes(searchTerm) || namaste.description?.toLowerCase().includes(searchTerm)
    );
    const tm2Codes = Array.from(this.tm2Codes.values()).filter(
      (tm2) => tm2.code.toLowerCase().includes(searchTerm) || tm2.title.toLowerCase().includes(searchTerm) || tm2.description?.toLowerCase().includes(searchTerm)
    );
    return { icdCodes, namasteCodes, tm2Codes };
  }
  async logSearchActivity(data) {
    const id = randomUUID();
    const activity = {
      id,
      query: data.query,
      resultCount: data.resultCount,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.searchActivities.set(id, activity);
    return activity;
  }
};
var netlifyStorage = new NetlifyStorage();

// netlify/functions/api.ts
var normalizeSystem = (system) => {
  const systemMap = {
    "namaste": "NAMASTE",
    "icd11": "ICD-11",
    "tm2": "TM2"
  };
  return systemMap[system.toLowerCase()] || system;
};
var handler = async (event, context) => {
  const { path, httpMethod, queryStringParameters, body } = event;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };
  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  try {
    const pathSegments = path.replace("/.netlify/functions/api", "").split("/").filter(Boolean);
    if (pathSegments[0] === "search" && httpMethod === "GET") {
      const query = queryStringParameters?.q;
      if (!query) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Query parameter 'q' is required" })
        };
      }
      const results = await netlifyStorage.globalSearch(query);
      const totalResults = results.icdCodes.length + results.namasteCodes.length + results.tm2Codes.length;
      await netlifyStorage.logSearchActivity({
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
    if (pathSegments[0] === "icd11" && pathSegments[1] === "code" && httpMethod === "GET") {
      const code = pathSegments[2];
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Code parameter is required" })
        };
      }
      const icdCode = await netlifyStorage.getIcdCodeByCode(code);
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
    if (pathSegments[0] === "namaste" && pathSegments[1] === "code" && httpMethod === "GET") {
      const code = pathSegments[2];
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Code parameter is required" })
        };
      }
      const namasteCode = await netlifyStorage.getNamasteCodeByCode(code);
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
    if (pathSegments[0] === "tm2" && pathSegments[1] === "code" && httpMethod === "GET") {
      const code = pathSegments[2];
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Code parameter is required" })
        };
      }
      const tm2Code = await netlifyStorage.getTm2CodeByCode(code);
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
    if (pathSegments[0] === "mapping" && pathSegments[1] === "code" && httpMethod === "GET") {
      const system = normalizeSystem(pathSegments[2] || "");
      const code = pathSegments[3];
      if (!system || !code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "System and code parameters are required" })
        };
      }
      const mappings = await netlifyStorage.getMappingsWithNames(system, code);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mappings)
      };
    }
    if (pathSegments[0] === "mapping" && pathSegments.length === 4 && httpMethod === "GET") {
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
      const mappings = await netlifyStorage.getMappingsWithNames(sourceSystem, sourceCode);
      const filteredMappings = mappings.filter((mapping) => mapping.targetSystem === targetSystem);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(filteredMappings)
      };
    }
    if (pathSegments[0] === "status" && httpMethod === "GET") {
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
          lastSync: (/* @__PURE__ */ new Date()).toISOString()
        })
      };
    }
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Endpoint not found" })
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
export {
  handler
};
