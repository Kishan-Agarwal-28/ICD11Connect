import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const icdCodes = pgTable("icd_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  chapter: text("chapter").notNull(),
  category: text("category").notNull(),
  parentCode: text("parent_code"),
  children: jsonb("children").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const namasteeCodes = pgTable("namaste_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  system: text("system").notNull(), // AYU, SID, UNA
  category: text("category").notNull(),
  icdMapping: text("icd_mapping"),
  tm2Mapping: text("tm2_mapping"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tm2Codes = pgTable("tm2_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  pattern: text("pattern").notNull(),
  icdMapping: text("icd_mapping"),
  namasteMapping: text("namaste_mapping"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const codeMappings = pgTable("code_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceSystem: text("source_system").notNull(),
  sourceCode: text("source_code").notNull(),
  targetSystem: text("target_system").notNull(),
  targetCode: text("target_code").notNull(),
  mappingType: text("mapping_type").notNull(), // exact, broader, narrower, related
  confidence: text("confidence").default("high"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchActivity = pgTable("search_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  resultCount: text("result_count"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// FHIR CodeSystem resources
export const fhirCodeSystems = pgTable("fhir_code_systems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull().unique(),
  version: text("version").notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(), // draft, active, retired
  experimental: boolean("experimental").default(false),
  date: timestamp("date").notNull(),
  publisher: text("publisher"),
  description: text("description"),
  content: text("content").notNull(), // complete, example, fragment, supplement
  count: text("count"),
  resource: jsonb("resource").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// FHIR ConceptMap resources
export const fhirConceptMaps = pgTable("fhir_concept_maps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull().unique(),
  version: text("version").notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  experimental: boolean("experimental").default(false),
  date: timestamp("date").notNull(),
  publisher: text("publisher"),
  sourceUri: text("source_uri"),
  targetUri: text("target_uri"),
  resource: jsonb("resource").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Version tracking for code systems
export const versionHistory = pgTable("version_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(), // icd, namaste, tm2, codesystem, conceptmap
  entityId: text("entity_id").notNull(),
  version: text("version").notNull(),
  changeType: text("change_type").notNull(), // created, updated, deprecated
  changeDescription: text("change_description"),
  changedBy: text("changed_by"),
  previousVersion: text("previous_version"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  effectiveDate: timestamp("effective_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Consent metadata for India's 2016 EHR Standards
export const consentRecords = pgTable("consent_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  consentType: text("consent_type").notNull(), // data_sharing, research, traditional_medicine
  status: text("status").notNull(), // active, revoked, expired
  scope: jsonb("scope").$type<string[]>().default([]),
  grantedBy: text("granted_by").notNull(),
  grantedTo: jsonb("granted_to").$type<string[]>().default([]),
  purpose: text("purpose").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  abhaId: text("abha_id"), // India's Ayushman Bharat Health Account
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit trail for ISO 22600 compliance
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(), // access, create, update, delete, search
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  userId: text("user_id").notNull(),
  userRole: text("user_role"),
  action: text("action").notNull(),
  outcome: text("outcome").notNull(), // success, failure
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  requestData: jsonb("request_data").$type<Record<string, any>>(),
  responseData: jsonb("response_data").$type<Record<string, any>>(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// WHO ICD-11 API sync status
export const whoSyncStatus = pgTable("who_sync_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  syncType: text("sync_type").notNull(), // tm2, biomedicine, full
  status: text("status").notNull(), // pending, in_progress, completed, failed
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  recordsProcessed: text("records_processed").default("0"),
  recordsAdded: text("records_added").default("0"),
  recordsUpdated: text("records_updated").default("0"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertIcdCodeSchema = createInsertSchema(icdCodes).omit({
  id: true,
  createdAt: true,
});

export const insertNamasteCodeSchema = createInsertSchema(namasteeCodes).omit({
  id: true,
  createdAt: true,
});

export const insertTm2CodeSchema = createInsertSchema(tm2Codes).omit({
  id: true,
  createdAt: true,
});

export const insertCodeMappingSchema = createInsertSchema(codeMappings).omit({
  id: true,
  createdAt: true,
});

export const insertSearchActivitySchema = createInsertSchema(searchActivity).omit({
  id: true,
  timestamp: true,
});

export const insertFhirCodeSystemSchema = createInsertSchema(fhirCodeSystems).omit({
  id: true,
  createdAt: true,
});

export const insertFhirConceptMapSchema = createInsertSchema(fhirConceptMaps).omit({
  id: true,
  createdAt: true,
});

export const insertVersionHistorySchema = createInsertSchema(versionHistory).omit({
  id: true,
  createdAt: true,
});

export const insertConsentRecordSchema = createInsertSchema(consentRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export const insertWhoSyncStatusSchema = createInsertSchema(whoSyncStatus).omit({
  id: true,
  createdAt: true,
});

// Types
export type IcdCode = typeof icdCodes.$inferSelect;
export type InsertIcdCode = z.infer<typeof insertIcdCodeSchema>;

export type NamasteCode = typeof namasteeCodes.$inferSelect;
export type InsertNamasteCode = z.infer<typeof insertNamasteCodeSchema>;

export type Tm2Code = typeof tm2Codes.$inferSelect;
export type InsertTm2Code = z.infer<typeof insertTm2CodeSchema>;

export type CodeMapping = typeof codeMappings.$inferSelect;
export type InsertCodeMapping = z.infer<typeof insertCodeMappingSchema>;

export type SearchActivity = typeof searchActivity.$inferSelect;
export type InsertSearchActivity = z.infer<typeof insertSearchActivitySchema>;

export type FhirCodeSystem = typeof fhirCodeSystems.$inferSelect;
export type InsertFhirCodeSystem = z.infer<typeof insertFhirCodeSystemSchema>;

export type FhirConceptMap = typeof fhirConceptMaps.$inferSelect;
export type InsertFhirConceptMap = z.infer<typeof insertFhirConceptMapSchema>;

export type VersionHistory = typeof versionHistory.$inferSelect;
export type InsertVersionHistory = z.infer<typeof insertVersionHistorySchema>;

export type ConsentRecord = typeof consentRecords.$inferSelect;
export type InsertConsentRecord = z.infer<typeof insertConsentRecordSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export type WhoSyncStatus = typeof whoSyncStatus.$inferSelect;
export type InsertWhoSyncStatus = z.infer<typeof insertWhoSyncStatusSchema>;
