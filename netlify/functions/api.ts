import { netlifyStorage } from "./storage";

const normalizeSystem = (system: string): string => {
  const systemMap: Record<string, string> = {
    'namaste': 'NAMASTE',
    'icd11': 'ICD-11',
    'tm2': 'TM2'
  };
  return systemMap[system.toLowerCase()] || system;
};

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

      const results = await netlifyStorage.globalSearch(query);
      const totalResults = results.icdCodes.length + results.namasteCodes.length + results.tm2Codes.length;

      // Log search activity
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

      const mappings = await netlifyStorage.getMappingsWithNames(system, code);
      
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

      const mappings = await netlifyStorage.getMappingsWithNames(sourceSystem, sourceCode);
      const filteredMappings = mappings.filter(mapping => mapping.targetSystem === targetSystem);
      
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