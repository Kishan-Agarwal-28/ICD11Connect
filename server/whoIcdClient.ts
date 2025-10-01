/**
 * WHO ICD-11 API Client
 * Documentation: https://id.who.int/swagger/index.html
 * 
 * This client integrates with the WHO ICD-11 API to fetch:
 * - Traditional Medicine Module 2 (TM2) codes
 * - Biomedicine codes
 * - Entity lookups and searches
 */

export interface WhoIcdConfig {
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  apiEndpoint: string;
}

export interface WhoAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expiresAt: number;
}

export interface WhoIcdEntity {
  '@id': string;
  '@context': string;
  title: {
    '@language': string;
    '@value': string;
  };
  definition?: {
    '@language': string;
    '@value': string;
  };
  code?: string;
  parent?: string[];
  child?: string[];
  classKind?: string;
  browserUrl?: string;
}

export interface WhoSearchResult {
  destinationEntities: Array<{
    id: string;
    title: string;
    theCode?: string;
    score?: number;
  }>;
  guessType?: string;
  uniqueSearchId?: string;
}

export class WhoIcdClient {
  private config: WhoIcdConfig;
  private token: WhoAuthToken | null = null;

  constructor(config?: Partial<WhoIcdConfig>) {
    this.config = {
      clientId: config?.clientId || process.env.WHO_CLIENT_ID || '',
      clientSecret: config?.clientSecret || process.env.WHO_CLIENT_SECRET || '',
      tokenEndpoint: config?.tokenEndpoint || 'https://icdaccessmanagement.who.int/connect/token',
      apiEndpoint: config?.apiEndpoint || 'https://id.who.int/icd',
    };
  }

  /**
   * Authenticate with WHO ICD-11 API using OAuth 2.0 client credentials
   */
  async authenticate(): Promise<WhoAuthToken> {
    if (this.token && this.token.expiresAt > Date.now()) {
      return this.token!;
    }

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: 'icdapi_access',
    });

    const response = await fetch(this.config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`WHO ICD Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.token = {
      ...data,
      expiresAt: Date.now() + (data.expires_in * 1000) - 60000, // Subtract 1 min for safety
    };

    return this.token!;
  }

  /**
   * Get authorization header with valid token
   */
  private async getAuthHeader(): Promise<Record<string, string>> {
    const token = await this.authenticate();
    return {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
      'API-Version': 'v2',
      'Accept-Language': 'en',
    };
  }

  /**
   * Fetch ICD-11 entity by URI
   */
  async getEntity(uri: string): Promise<WhoIcdEntity> {
    const headers = await this.getAuthHeader();
    const response = await fetch(uri, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch entity ${uri}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search ICD-11 entities
   */
  async search(query: string, options?: {
    flatResults?: boolean;
    useFlexisearch?: boolean;
    releaseId?: string;
  }): Promise<WhoSearchResult> {
    const headers = await this.getAuthHeader();
    const releaseId = options?.releaseId || '2024-01';
    const flatResults = options?.flatResults !== false;
    const useFlexisearch = options?.useFlexisearch !== false;

    const url = `${this.config.apiEndpoint}/release/${releaseId}/mms/search?q=${encodeURIComponent(query)}&flatResults=${flatResults}&useFlexisearch=${useFlexisearch}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get Traditional Medicine Module 2 (TM2) codes
   */
  async getTM2Codes(releaseId: string = '2024-01'): Promise<WhoIcdEntity> {
    const headers = await this.getAuthHeader();
    // TM2 is Chapter 26 in ICD-11
    const tm2Uri = `${this.config.apiEndpoint}/release/${releaseId}/mms/26`;
    
    const response = await fetch(tm2Uri, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch TM2 codes: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get entity by code
   */
  async getEntityByCode(code: string, releaseId: string = '2024-01'): Promise<WhoIcdEntity> {
    const headers = await this.getAuthHeader();
    const url = `${this.config.apiEndpoint}/release/${releaseId}/mms/codeinfo/${code}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch entity by code ${code}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all children of an entity (recursive)
   */
  async getEntityChildren(uri: string): Promise<WhoIcdEntity[]> {
    const entity = await this.getEntity(uri);
    const children: WhoIcdEntity[] = [];

    if (entity.child && entity.child.length > 0) {
      for (const childUri of entity.child) {
        try {
          const child = await this.getEntity(childUri);
          children.push(child);
        } catch (error) {
          console.error(`Failed to fetch child ${childUri}:`, error);
        }
      }
    }

    return children;
  }

  /**
   * Lookup entity by linearization and code
   */
  async lookupEntity(
    linearization: string,
    code: string,
    releaseId: string = '2024-01'
  ): Promise<WhoIcdEntity> {
    const headers = await this.getAuthHeader();
    const url = `${this.config.apiEndpoint}/release/${releaseId}/${linearization}/codeinfo/${code}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Lookup failed for ${code}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get ICD-11 MMS (Mortality and Morbidity Statistics) foundation
   */
  async getFoundation(releaseId: string = '2024-01'): Promise<WhoIcdEntity> {
    const headers = await this.getAuthHeader();
    const url = `${this.config.apiEndpoint}/release/${releaseId}/mms`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch foundation: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Batch fetch multiple entities
   */
  async batchGetEntities(uris: string[]): Promise<WhoIcdEntity[]> {
    const entities: WhoIcdEntity[] = [];
    
    // Fetch in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < uris.length; i += batchSize) {
      const batch = uris.slice(i, i + batchSize);
      const promises = batch.map(uri => this.getEntity(uri).catch(err => {
        console.error(`Failed to fetch ${uri}:`, err);
        return null;
      }));
      
      const results = await Promise.all(promises);
      entities.push(...results.filter((e): e is WhoIcdEntity => e !== null));
      
      // Small delay between batches
      if (i + batchSize < uris.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return entities;
  }
}

// Export singleton instance
export const whoIcdClient = new WhoIcdClient();
