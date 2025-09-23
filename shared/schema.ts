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
