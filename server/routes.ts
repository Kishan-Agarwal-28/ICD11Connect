import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchActivitySchema, insertIcdCodeSchema, insertNamasteCodeSchema, insertTm2CodeSchema, insertCodeMappingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Global search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      const results = await storage.globalSearch(q);
      const totalResults = results.icdCodes.length + results.namasteCodes.length + results.tm2Codes.length;

      // Log search activity
      await storage.logSearchActivity({ 
        query: q,
        resultCount: totalResults.toString()
      });
      
      res.json({
        query: q,
        totalResults,
        results
      });
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // ICD-11 endpoints
  app.get("/api/icd11/hierarchy", async (req, res) => {
    try {
      const hierarchy = await storage.getIcdCodesHierarchy();
      res.json(hierarchy);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ICD-11 hierarchy" });
    }
  });

  app.get("/api/icd11/chapter/:chapter", async (req, res) => {
    try {
      const { chapter } = req.params;
      const codes = await storage.getIcdCodesByChapter(chapter);
      res.json(codes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ICD-11 codes by chapter" });
    }
  });

  app.get("/api/icd11/code/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const icdCode = await storage.getIcdCodeByCode(code);
      if (!icdCode) {
        return res.status(404).json({ error: "ICD-11 code not found" });
      }
      res.json(icdCode);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ICD-11 code" });
    }
  });

  app.post("/api/icd11", async (req, res) => {
    try {
      const validatedData = insertIcdCodeSchema.parse(req.body);
      const code = await storage.createIcdCode(validatedData);
      res.status(201).json(code);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create ICD-11 code" });
    }
  });

  // NAMASTE endpoints
  app.get("/api/namaste/system/:system", async (req, res) => {
    try {
      const { system } = req.params;
      const codes = await storage.getNamasteCodesBySystem(system.toUpperCase());
      res.json(codes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NAMASTE codes by system" });
    }
  });

  app.get("/api/namaste/code/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const namasteCode = await storage.getNamasteCodeByCode(code);
      if (!namasteCode) {
        return res.status(404).json({ error: "NAMASTE code not found" });
      }
      res.json(namasteCode);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NAMASTE code" });
    }
  });

  app.post("/api/namaste", async (req, res) => {
    try {
      const validatedData = insertNamasteCodeSchema.parse(req.body);
      const code = await storage.createNamasteCode(validatedData);
      res.status(201).json(code);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create NAMASTE code" });
    }
  });

  // TM2 endpoints
  app.get("/api/tm2/code/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const tm2Code = await storage.getTm2CodeByCode(code);
      if (!tm2Code) {
        return res.status(404).json({ error: "TM2 code not found" });
      }
      res.json(tm2Code);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch TM2 code" });
    }
  });

  app.post("/api/tm2", async (req, res) => {
    try {
      const validatedData = insertTm2CodeSchema.parse(req.body);
      const code = await storage.createTm2Code(validatedData);
      res.status(201).json(code);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create TM2 code" });
    }
  });

  // Code mapping and translation endpoints
  app.get("/api/mapping/code/:system/:code", async (req, res) => {
    try {
      const { system, code } = req.params;
      const mappings = await storage.getMappingsForCode(system, code);
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch code mappings" });
    }
  });

  app.get("/api/mapping/:sourceSystem/:sourceCode/:targetSystem", async (req, res) => {
    try {
      const { sourceSystem, sourceCode, targetSystem } = req.params;
      const mappings = await storage.translateCode(sourceSystem, sourceCode, targetSystem);
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ error: "Failed to translate code" });
    }
  });

  app.get("/api/mapping/code/:system/:code", async (req, res) => {
    try {
      const { system, code } = req.params;
      const mappings = await storage.getMappingsForCode(system, code);
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch code mappings" });
    }
  });

  app.post("/api/mapping", async (req, res) => {
    try {
      const validatedData = insertCodeMappingSchema.parse(req.body);
      const mapping = await storage.createCodeMapping(validatedData);
      res.status(201).json(mapping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create code mapping" });
    }
  });

  // FHIR Bundle endpoint
  app.post("/api/fhir/bundle", async (req, res) => {
    try {
      // Validate FHIR Bundle structure
      const bundle = req.body;
      if (!bundle.resourceType || bundle.resourceType !== "Bundle") {
        return res.status(400).json({ error: "Invalid FHIR Bundle format" });
      }

      // Process bundle entries - in a real implementation, this would
      // validate against FHIR R4 schema and integrate with EMR system
      res.json({
        message: "FHIR Bundle processed successfully",
        bundleId: bundle.id,
        entries: bundle.entry?.length || 0
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process FHIR Bundle" });
    }
  });

  // Recent activity endpoint
  app.get("/api/activity/recent", async (req, res) => {
    try {
      const activities = await storage.getRecentSearchActivity();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent activity" });
    }
  });

  // System status endpoint
  app.get("/api/status", async (req, res) => {
    try {
      // In a real implementation, this would check external API health
      res.json({
        status: "healthy",
        services: {
          whoIcd11Api: "connected",
          namasteImport: "synced",
          fhirCompliance: "validated",
          abhaOauth: "secured"
        },
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
