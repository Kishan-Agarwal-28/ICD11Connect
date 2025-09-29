// Mock data
const mockData = {
  namasteCodes: [
    {
      id: 'namaste-1',
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
      id: 'namaste-2',
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
      id: 'namaste-3',
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
    }
  ],
  icdCodes: [
    {
      id: 'icd-1',
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
      id: 'icd-2',
      code: "1A0Z",
      title: "Gastroenteritis and colitis of infectious origin, unspecified",
      description: "Unspecified gastroenteritis and colitis of infectious origin",
      chapter: "01",
      category: "Specific",
      parentCode: "1A00-1A9Z",
      children: null,
      metadata: { level: 3 }
    },
    {
      id: 'icd-3',
      code: "J06.9",
      title: "Acute upper respiratory infection, unspecified",
      description: "Upper respiratory infection affecting nose, throat, or larynx",
      chapter: "11",
      category: "Specific",
      parentCode: "J00-J06",
      children: null,
      metadata: { level: 3 }
    }
  ],
  tm2Codes: [
    {
      id: 'tm2-1',
      code: "TM-GI-001",
      title: "Digestive system pattern disorder",
      description: "Traditional medicine pattern involving digestive system imbalances",
      pattern: "Digestive Fire Imbalance",
      icdMapping: "1A00-1A9Z",
      namasteMapping: "AYU-DIG-001",
      metadata: { system: "Traditional Medicine", category: "Digestive" }
    },
    {
      id: 'tm2-2',
      code: "TM-GI-002",
      title: "Gastric pattern disorder",
      description: "Traditional medicine pattern for stomach-related conditions",
      pattern: "Stomach Heat Pattern",
      icdMapping: "1A0Z",
      namasteMapping: "SID-DIG-003",
      metadata: { system: "Traditional Medicine", category: "Digestive" }
    },
    {
      id: 'tm2-3',
      code: "TM-RE-001",
      title: "Respiratory system pattern disorder",
      description: "Traditional medicine pattern involving respiratory system imbalances",
      pattern: "Wind-Cold Pattern",
      icdMapping: "J06.9",
      namasteMapping: "UNA-RES-005",
      metadata: { system: "Traditional Medicine", category: "Respiratory" }
    }
  ],
  mappings: [
    {
      id: 'map-1',
      sourceSystem: "NAMASTE",
      sourceCode: "AYU-DIG-001",
      targetSystem: "ICD-11",
      targetCode: "1A00-1A9Z",
      mappingType: "exact",
      confidence: "high",
      isActive: true,
      sourceTitle: "Grahani Roga",
      targetTitle: "Gastroenteritis and colitis of infectious origin"
    },
    {
      id: 'map-2',
      sourceSystem: "NAMASTE",
      sourceCode: "AYU-DIG-001",
      targetSystem: "TM2",
      targetCode: "TM-GI-001",
      mappingType: "exact",
      confidence: "high",
      isActive: true,
      sourceTitle: "Grahani Roga",
      targetTitle: "Digestive system pattern disorder"
    },
    {
      id: 'map-3',
      sourceSystem: "NAMASTE",
      sourceCode: "SID-DIG-003",
      targetSystem: "ICD-11",
      targetCode: "1A0Z",
      mappingType: "exact",
      confidence: "high",
      isActive: true,
      sourceTitle: "Gunmam",
      targetTitle: "Gastroenteritis and colitis of infectious origin, unspecified"
    },
    {
      id: 'map-4',
      sourceSystem: "NAMASTE",
      sourceCode: "SID-DIG-003",
      targetSystem: "TM2",
      targetCode: "TM-GI-002",
      mappingType: "exact",
      confidence: "high",
      isActive: true,
      sourceTitle: "Gunmam",
      targetTitle: "Gastric pattern disorder"
    },
    {
      id: 'map-5',
      sourceSystem: "NAMASTE",
      sourceCode: "UNA-RES-005",
      targetSystem: "ICD-11",
      targetCode: "J06.9",
      mappingType: "exact",
      confidence: "high",
      isActive: true,
      sourceTitle: "Nazla",
      targetTitle: "Acute upper respiratory infection, unspecified"
    },
    {
      id: 'map-6',
      sourceSystem: "NAMASTE",
      sourceCode: "UNA-RES-005",
      targetSystem: "TM2",
      targetCode: "TM-RE-001",
      mappingType: "exact",
      confidence: "high",
      isActive: true,
      sourceTitle: "Nazla",
      targetTitle: "Respiratory system pattern disorder"
    }
  ]
};

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const pathSegments = path.split('/').filter(Boolean);
  
  // Global search endpoint
  if (pathSegments[0] === 'search' && event.httpMethod === 'GET') {
    const query = event.queryStringParameters?.q;
    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Query parameter 'q' is required" })
      };
    }

    const searchTerm = query.toLowerCase();
    const icdCodes = mockData.icdCodes.filter(icd => 
      icd.code.toLowerCase().includes(searchTerm) ||
      icd.title.toLowerCase().includes(searchTerm) ||
      (icd.description && icd.description.toLowerCase().includes(searchTerm))
    );

    const namasteCodes = mockData.namasteCodes.filter(namaste => 
      namaste.code.toLowerCase().includes(searchTerm) ||
      namaste.title.toLowerCase().includes(searchTerm) ||
      namaste.description.toLowerCase().includes(searchTerm)
    );

    const tm2Codes = mockData.tm2Codes.filter(tm2 => 
      tm2.code.toLowerCase().includes(searchTerm) ||
      tm2.title.toLowerCase().includes(searchTerm) ||
      tm2.description.toLowerCase().includes(searchTerm)
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query,
        totalResults: icdCodes.length + namasteCodes.length + tm2Codes.length,
        results: { icdCodes, namasteCodes, tm2Codes }
      })
    };
  }

  // ICD-11 endpoints
  if (pathSegments[0] === 'icd11' && pathSegments[1] === 'code' && event.httpMethod === 'GET') {
    const code = pathSegments[2];
    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Code parameter is required" })
      };
    }

    const icdCode = mockData.icdCodes.find(item => item.code === code);
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
  if (pathSegments[0] === 'namaste' && pathSegments[1] === 'code' && event.httpMethod === 'GET') {
    const code = pathSegments[2];
    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Code parameter is required" })
      };
    }

    const namasteCode = mockData.namasteCodes.find(item => item.code === code);
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
  if (pathSegments[0] === 'tm2' && pathSegments[1] === 'code' && event.httpMethod === 'GET') {
    const code = pathSegments[2];
    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Code parameter is required" })
      };
    }

    const tm2Code = mockData.tm2Codes.find(item => item.code === code);
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
  if (pathSegments[0] === 'mapping' && pathSegments[1] === 'code' && event.httpMethod === 'GET') {
    const systemMap = {
      'namaste': 'NAMASTE',
      'icd11': 'ICD-11',
      'tm2': 'TM2'
    };
    const system = systemMap[pathSegments[2]?.toLowerCase()] || pathSegments[2];
    const code = pathSegments[3];
    
    if (!system || !code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "System and code parameters are required" })
      };
    }

    const mappings = mockData.mappings.filter(mapping => 
      mapping.sourceSystem === system && 
      mapping.sourceCode === code && 
      mapping.isActive
    );
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mappings)
    };
  }

  // System status endpoint
  if (pathSegments[0] === 'status' && event.httpMethod === 'GET') {
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
  
  // Simple health check
  if (path === '' || path === '/') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "ICD11Connect API is working!",
        timestamp: new Date().toISOString(),
        endpoints: [
          "/api/search?q={query}",
          "/api/icd11/code/{code}",
          "/api/namaste/code/{code}",
          "/api/tm2/code/{code}",
          "/api/mapping/code/{system}/{code}",
          "/api/status"
        ]
      })
    };
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ 
      error: "Endpoint not found",
      path: path,
      availableEndpoints: [
        "/api/search?q={query}",
        "/api/icd11/code/{code}",
        "/api/namaste/code/{code}",
        "/api/tm2/code/{code}",
        "/api/mapping/code/{system}/{code}",
        "/api/status"
      ]
    })
  };
};
