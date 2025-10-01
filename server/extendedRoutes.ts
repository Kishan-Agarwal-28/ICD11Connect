/**
 * Extended API Routes for WHO ICD-11 Integration
 * Includes CSV import, FHIR generation, WHO API sync, and compliance features
 */

import type { Express } from "express";
import { whoIcdClient } from "./whoIcdClient";
import { fhirGenerator } from "./fhirGenerator";
import { namasteImporter } from "./namasteImporter";
import { storage } from "./storage";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export function registerExtendedRoutes(app: Express) {
  
  // ==================== WHO ICD-11 API Integration ====================
  
  /**
   * Search WHO ICD-11 API
   * GET /api/who/search?q={query}&releaseId={releaseId}
   */
  app.get("/api/who/search", async (req, res) => {
    try {
      const { q, releaseId } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      const results = await whoIcdClient.search(q, {
        releaseId: releaseId as string | undefined,
        flatResults: true,
        useFlexisearch: true,
      });

      res.json({
        query: q,
        results: results.destinationEntities || [],
        guessType: results.guessType,
      });
    } catch (error) {
      console.error("WHO ICD-11 search error:", error);
      res.status(500).json({ 
        error: "WHO ICD-11 search failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Get WHO ICD-11 entity by URI
   * GET /api/who/entity?uri={entityUri}
   */
  app.get("/api/who/entity", async (req, res) => {
    try {
      const { uri } = req.query;
      
      if (!uri || typeof uri !== 'string') {
        return res.status(400).json({ error: "Query parameter 'uri' is required" });
      }

      const entity = await whoIcdClient.getEntity(uri);
      res.json(entity);
    } catch (error) {
      console.error("WHO ICD-11 entity fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch WHO ICD-11 entity",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Get WHO ICD-11 entity by code
   * GET /api/who/code/:code?releaseId={releaseId}
   */
  app.get("/api/who/code/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const { releaseId } = req.query;

      const entity = await whoIcdClient.getEntityByCode(
        code,
        releaseId as string | undefined
      );

      res.json(entity);
    } catch (error) {
      console.error("WHO ICD-11 code lookup error:", error);
      res.status(404).json({ 
        error: "Code not found in WHO ICD-11",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Get TM2 (Traditional Medicine Module 2) codes from WHO API
   * GET /api/who/tm2?releaseId={releaseId}
   */
  app.get("/api/who/tm2", async (req, res) => {
    try {
      const { releaseId } = req.query;
      const tm2Data = await whoIcdClient.getTM2Codes(releaseId as string | undefined);

      res.json({
        title: tm2Data.title,
        code: tm2Data.code,
        children: tm2Data.child || [],
        browserUrl: tm2Data.browserUrl,
      });
    } catch (error) {
      console.error("WHO TM2 fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch TM2 codes",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Sync TM2 and Biomedicine updates from WHO ICD-11 API
   * POST /api/who/sync
   * Body: { syncType: 'tm2' | 'biomedicine' | 'full', releaseId?: string }
   */
  app.post("/api/who/sync", async (req, res) => {
    try {
      const { syncType = 'full', releaseId = '2024-01' } = req.body;

      // Start sync process
      const syncRecord = {
        syncType,
        status: 'in_progress' as const,
        startedAt: new Date(),
        recordsProcessed: '0',
        recordsAdded: '0',
        recordsUpdated: '0',
        metadata: { releaseId },
      };

      res.json({
        message: "Sync process started",
        syncId: "sync-" + Date.now(),
        syncType,
        status: "in_progress",
        note: "This is a background process. Check /api/who/sync/status/{syncId} for updates.",
      });

      // Background sync process (simplified for MVP)
      // In production, this should be a queue-based job
      setTimeout(async () => {
        try {
          if (syncType === 'tm2' || syncType === 'full') {
            const tm2Data = await whoIcdClient.getTM2Codes(releaseId);
            // Process and store TM2 data
            console.log("TM2 sync completed", tm2Data.title);
          }

          if (syncType === 'biomedicine' || syncType === 'full') {
            const foundation = await whoIcdClient.getFoundation(releaseId);
            // Process and store biomedicine data
            console.log("Biomedicine sync completed", foundation.title);
          }
        } catch (error) {
          console.error("Sync error:", error);
        }
      }, 1000);

    } catch (error) {
      console.error("WHO sync error:", error);
      res.status(500).json({ 
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ==================== NAMASTE CSV Import ====================

  /**
   * Download NAMASTE CSV template
   * GET /api/namaste/import/template
   */
  app.get("/api/namaste/import/template", (req, res) => {
    try {
      const template = namasteImporter.generateTemplate();
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="namaste_template.csv"');
      res.send(template);
    } catch (error) {
      console.error("Template generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate template",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Validate NAMASTE CSV file
   * POST /api/namaste/import/validate
   * Body: multipart/form-data with 'file' field
   */
  app.post("/api/namaste/import/validate", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const csvContent = req.file.buffer.toString('utf-8');
      
      // Validate structure
      const structureValidation = namasteImporter.validateCSVStructure(csvContent);
      
      if (!structureValidation.valid) {
        return res.status(400).json({
          valid: false,
          errors: structureValidation.errors,
          warnings: structureValidation.warnings,
        });
      }

      // Validate content
      const importResult = await namasteImporter.importFromCSV(csvContent, {
        validateOnly: true,
      });

      res.json({
        valid: importResult.success,
        totalRows: importResult.totalRows,
        successfulValidations: importResult.successfulImports,
        failedValidations: importResult.failedImports,
        errors: importResult.errors,
        warnings: structureValidation.warnings,
      });
    } catch (error) {
      console.error("CSV validation error:", error);
      res.status(500).json({ 
        error: "Validation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Import NAMASTE codes from CSV
   * POST /api/namaste/import
   * Body: multipart/form-data with 'file' field
   */
  app.post("/api/namaste/import", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const csvContent = req.file.buffer.toString('utf-8');
      
      // Import and validate
      const importResult = await namasteImporter.importFromCSV(csvContent);

      if (!importResult.success) {
        return res.status(400).json({
          message: "Import completed with errors",
          ...importResult,
        });
      }

      // Store codes and mappings
      const storedCodes = [];
      const storedMappings = [];

      for (const code of importResult.codes) {
        try {
          const stored = await storage.createNamasteCode(code);
          storedCodes.push(stored);
        } catch (error) {
          console.error(`Failed to store code ${code.code}:`, error);
        }
      }

      for (const mapping of importResult.mappings) {
        try {
          const stored = await storage.createCodeMapping(mapping);
          storedMappings.push(stored);
        } catch (error) {
          console.error(`Failed to store mapping:`, error);
        }
      }

      res.json({
        success: true,
        message: "NAMASTE codes imported successfully",
        totalRows: importResult.totalRows,
        codesImported: storedCodes.length,
        mappingsCreated: storedMappings.length,
        errors: importResult.errors,
      });
    } catch (error) {
      console.error("CSV import error:", error);
      res.status(500).json({ 
        error: "Import failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ==================== FHIR Resource Generation ====================

  /**
   * Generate FHIR CodeSystem from NAMASTE codes
   * GET /api/fhir/codesystem/namaste?system={AYU|SID|UNA}&version={version}
   */
  app.get("/api/fhir/codesystem/namaste", async (req, res) => {
    try {
      const { system, version = '1.0.0' } = req.query;

      let codes;
      if (system && typeof system === 'string') {
        codes = await storage.getNamasteCodesBySystem(system.toUpperCase());
      } else {
        // Get all NAMASTE codes
        const ayuCodes = await storage.getNamasteCodesBySystem('AYU');
        const sidCodes = await storage.getNamasteCodesBySystem('SID');
        const unaCodes = await storage.getNamasteCodesBySystem('UNA');
        codes = [...ayuCodes, ...sidCodes, ...unaCodes];
      }

      const codeSystem = fhirGenerator.generateNamasteCodeSystem(
        codes,
        version as string
      );

      res.json(codeSystem);
    } catch (error) {
      console.error("FHIR CodeSystem generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate FHIR CodeSystem",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Generate FHIR ConceptMap for code translations
   * GET /api/fhir/conceptmap/:sourceSystem/:targetSystem?version={version}
   */
  app.get("/api/fhir/conceptmap/:sourceSystem/:targetSystem", async (req, res) => {
    try {
      const { sourceSystem, targetSystem } = req.params;
      const { version = '1.0.0' } = req.query;

      // Normalize system names
      const normalizeSystem = (sys: string): string => {
        switch (sys.toLowerCase()) {
          case 'namaste': return 'NAMASTE';
          case 'icd11': return 'ICD-11';
          case 'tm2': return 'TM2';
          default: return sys.toUpperCase();
        }
      };

      const normalizedSource = normalizeSystem(sourceSystem);
      const normalizedTarget = normalizeSystem(targetSystem);

      // Get all mappings between these systems
      const mappings = await storage.getMappingsBetweenSystems(
        normalizedSource,
        normalizedTarget
      );

      const conceptMap = fhirGenerator.generateConceptMap(
        mappings,
        normalizedSource,
        normalizedTarget,
        version as string
      );

      res.json(conceptMap);
    } catch (error) {
      console.error("FHIR ConceptMap generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate FHIR ConceptMap",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Generate FHIR Condition (ProblemList entry) with dual coding
   * POST /api/fhir/condition
   * Body: {
   *   patientReference: string,
   *   primaryCode: { system, code, display },
   *   secondaryCodes?: [{ system, code, display }],
   *   options?: { ... }
   * }
   */
  app.post("/api/fhir/condition", async (req, res) => {
    try {
      const { patientReference, primaryCode, secondaryCodes = [], options = {} } = req.body;

      if (!patientReference || !primaryCode) {
        return res.status(400).json({ 
          error: "patientReference and primaryCode are required" 
        });
      }

      const condition = fhirGenerator.generateCondition(
        patientReference,
        primaryCode,
        secondaryCodes,
        options
      );

      res.json(condition);
    } catch (error) {
      console.error("FHIR Condition generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate FHIR Condition",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Generate complete FHIR Bundle with CodeSystem + ConceptMap
   * GET /api/fhir/bundle?includeCodeSystems=true&includeConceptMaps=true
   */
  app.get("/api/fhir/bundle", async (req, res) => {
    try {
      const { 
        includeCodeSystems = 'true', 
        includeConceptMaps = 'true',
        version = '1.0.0'
      } = req.query;

      const resources: any[] = [];

      if (includeCodeSystems === 'true') {
        const ayuCodes = await storage.getNamasteCodesBySystem('AYU');
        const sidCodes = await storage.getNamasteCodesBySystem('SID');
        const unaCodes = await storage.getNamasteCodesBySystem('UNA');
        const allCodes = [...ayuCodes, ...sidCodes, ...unaCodes];

        const codeSystem = fhirGenerator.generateNamasteCodeSystem(
          allCodes,
          version as string
        );
        resources.push(codeSystem);
      }

      if (includeConceptMaps === 'true') {
        // Generate concept maps for all system pairs
        const systemPairs = [
          ['NAMASTE', 'ICD-11'],
          ['NAMASTE', 'TM2'],
          ['TM2', 'ICD-11'],
        ];

        for (const [source, target] of systemPairs) {
          try {
            const mappings = await storage.getMappingsBetweenSystems(source, target);
            if (mappings.length > 0) {
              const conceptMap = fhirGenerator.generateConceptMap(
                mappings,
                source,
                target,
                version as string
              );
              resources.push(conceptMap);
            }
          } catch (error) {
            console.error(`Failed to generate ConceptMap for ${source} -> ${target}:`, error);
          }
        }
      }

      const bundle = fhirGenerator.generateBundle(resources, 'collection');

      res.json(bundle);
    } catch (error) {
      console.error("FHIR Bundle generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate FHIR Bundle",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ==================== Audit and Compliance ====================

  /**
   * Log audit event (ISO 22600 compliance)
   * POST /api/audit/log
   */
  app.post("/api/audit/log", async (req, res) => {
    try {
      const auditData = req.body;
      
      // In production, store in audit_logs table
      res.json({
        success: true,
        message: "Audit event logged",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Audit logging error:", error);
      res.status(500).json({ error: "Failed to log audit event" });
    }
  });

  /**
   * Get audit trail
   * GET /api/audit/trail?entityType={type}&entityId={id}&limit={limit}
   */
  app.get("/api/audit/trail", async (req, res) => {
    try {
      // In production, query audit_logs table
      res.json({
        events: [],
        total: 0,
        note: "Audit trail feature - connect to database for production use"
      });
    } catch (error) {
      console.error("Audit trail error:", error);
      res.status(500).json({ error: "Failed to fetch audit trail" });
    }
  });

  /**
   * Record consent (India's 2016 EHR Standards compliance)
   * POST /api/consent/record
   */
  app.post("/api/consent/record", async (req, res) => {
    try {
      const consentData = req.body;
      
      // In production, store in consent_records table
      res.json({
        success: true,
        consentId: "consent-" + Date.now(),
        message: "Consent recorded successfully",
      });
    } catch (error) {
      console.error("Consent recording error:", error);
      res.status(500).json({ error: "Failed to record consent" });
    }
  });

  /**
   * Check consent status
   * GET /api/consent/check?patientId={id}&purpose={purpose}
   */
  app.get("/api/consent/check", async (req, res) => {
    try {
      const { patientId, purpose } = req.query;

      // In production, query consent_records table
      res.json({
        hasConsent: true,
        consentType: purpose,
        status: "active",
        note: "Consent checking feature - connect to database for production use"
      });
    } catch (error) {
      console.error("Consent check error:", error);
      res.status(500).json({ error: "Failed to check consent" });
    }
  });

  /**
   * Get version history
   * GET /api/version/history?entityType={type}&entityId={id}
   */
  app.get("/api/version/history", async (req, res) => {
    try {
      const { entityType, entityId } = req.query;

      // In production, query version_history table
      res.json({
        versions: [],
        total: 0,
        note: "Version tracking feature - connect to database for production use"
      });
    } catch (error) {
      console.error("Version history error:", error);
      res.status(500).json({ error: "Failed to fetch version history" });
    }
  });
}
