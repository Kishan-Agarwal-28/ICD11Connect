/**
 * NAMASTE CSV Import Utility
 * Imports NAMASTE terminology from CSV exports and generates FHIR resources
 */

import { parse } from 'csv-parse/sync';
import type { InsertNamasteCode, InsertCodeMapping } from '@shared/schema';

export interface NamasteCSVRow {
  code: string;
  title: string;
  description?: string;
  system: string; // AYU, SID, UNA
  category: string;
  icd_mapping?: string;
  tm2_mapping?: string;
  synonyms?: string;
  metadata?: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successfulImports: number;
  failedImports: number;
  codes: InsertNamasteCode[];
  mappings: InsertCodeMapping[];
  errors: Array<{
    row: number;
    error: string;
    data?: any;
  }>;
}

export class NamasteImporter {
  /**
   * Parse CSV content and extract NAMASTE codes
   */
  parseCSV(csvContent: string, options?: {
    delimiter?: string;
    columns?: boolean | string[];
    skipEmptyLines?: boolean;
  }): NamasteCSVRow[] {
    try {
      const records = parse(csvContent, {
        delimiter: options?.delimiter || ',',
        columns: options?.columns !== false ? (options?.columns || true) : false,
        skip_empty_lines: options?.skipEmptyLines !== false,
        trim: true,
        cast: true,
        cast_date: false,
        relax_column_count: true,
      });

      return records;
    } catch (error) {
      throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate and transform CSV row to NAMASTE code
   */
  validateRow(row: NamasteCSVRow, rowIndex: number): {
    valid: boolean;
    code?: InsertNamasteCode;
    mappings?: InsertCodeMapping[];
    error?: string;
  } {
    const errors: string[] = [];

    // Required fields validation
    if (!row.code || typeof row.code !== 'string' || row.code.trim() === '') {
      errors.push('Code is required');
    }

    if (!row.title || typeof row.title !== 'string' || row.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!row.system || !['AYU', 'SID', 'UNA'].includes(row.system.toUpperCase())) {
      errors.push('System must be AYU, SID, or UNA');
    }

    if (!row.category || typeof row.category !== 'string') {
      errors.push('Category is required');
    }

    if (errors.length > 0) {
      return {
        valid: false,
        error: errors.join('; '),
      };
    }

    // Parse metadata if present
    let metadata: Record<string, any> = {};
    if (row.metadata) {
      try {
        metadata = typeof row.metadata === 'string' 
          ? JSON.parse(row.metadata) 
          : row.metadata;
      } catch {
        metadata = { raw: row.metadata };
      }
    }

    // Add synonyms to metadata if present
    if (row.synonyms) {
      metadata.synonyms = typeof row.synonyms === 'string'
        ? row.synonyms.split('|').map(s => s.trim())
        : row.synonyms;
    }

    const code: InsertNamasteCode = {
      code: row.code.trim(),
      title: row.title.trim(),
      description: row.description?.trim() || null,
      system: row.system.toUpperCase() as 'AYU' | 'SID' | 'UNA',
      category: row.category.trim(),
      icdMapping: row.icd_mapping?.trim() || null,
      tm2Mapping: row.tm2_mapping?.trim() || null,
      metadata,
    };

    // Generate mappings if ICD or TM2 codes are provided
    const mappings: InsertCodeMapping[] = [];

    if (row.icd_mapping && row.icd_mapping.trim()) {
      const icdCodes = row.icd_mapping.split('|').map(c => c.trim());
      icdCodes.forEach(icdCode => {
        if (icdCode) {
          mappings.push({
            sourceSystem: 'NAMASTE',
            sourceCode: row.code.trim(),
            targetSystem: 'ICD-11',
            targetCode: icdCode,
            mappingType: 'related',
            confidence: 'medium',
            isActive: true,
          });
        }
      });
    }

    if (row.tm2_mapping && row.tm2_mapping.trim()) {
      const tm2Codes = row.tm2_mapping.split('|').map(c => c.trim());
      tm2Codes.forEach(tm2Code => {
        if (tm2Code) {
          mappings.push({
            sourceSystem: 'NAMASTE',
            sourceCode: row.code.trim(),
            targetSystem: 'TM2',
            targetCode: tm2Code,
            mappingType: 'related',
            confidence: 'high',
            isActive: true,
          });
        }
      });
    }

    return {
      valid: true,
      code,
      mappings: mappings.length > 0 ? mappings : undefined,
    };
  }

  /**
   * Import NAMASTE codes from CSV content
   */
  async importFromCSV(csvContent: string, options?: {
    validateOnly?: boolean;
    delimiter?: string;
  }): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      totalRows: 0,
      successfulImports: 0,
      failedImports: 0,
      codes: [],
      mappings: [],
      errors: [],
    };

    try {
      // Parse CSV
      const rows = this.parseCSV(csvContent, {
        delimiter: options?.delimiter,
      });

      result.totalRows = rows.length;

      // Validate and transform each row
      rows.forEach((row, index) => {
        const validation = this.validateRow(row, index + 1);

        if (validation.valid && validation.code) {
          result.codes.push(validation.code);
          if (validation.mappings) {
            result.mappings.push(...validation.mappings);
          }
          result.successfulImports++;
        } else {
          result.failedImports++;
          result.errors.push({
            row: index + 1,
            error: validation.error || 'Unknown validation error',
            data: row,
          });
        }
      });

      result.success = result.failedImports === 0;

      return result;
    } catch (error) {
      result.errors.push({
        row: 0,
        error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      return result;
    }
  }

  /**
   * Generate sample CSV template for NAMASTE codes
   */
  generateTemplate(): string {
    const headers = [
      'code',
      'title',
      'description',
      'system',
      'category',
      'icd_mapping',
      'tm2_mapping',
      'synonyms',
      'metadata',
    ];

    const sampleRows = [
      {
        code: 'AYU-DIG-001',
        title: 'Grahani Roga',
        description: 'Digestive disorder with irregular bowel movements',
        system: 'AYU',
        category: 'Digestive System',
        icd_mapping: 'K59.9',
        tm2_mapping: 'TM-GI-001',
        synonyms: 'Sprue|Malabsorption',
        metadata: '{"severity":"moderate","dosha":"vata-pitta"}',
      },
      {
        code: 'SID-RES-001',
        title: 'Swasa Kasam',
        description: 'Respiratory disorders including asthma',
        system: 'SID',
        category: 'Respiratory System',
        icd_mapping: 'J45.9|J44.9',
        tm2_mapping: 'TM-RE-001',
        synonyms: 'Breathing difficulty|Wheezing',
        metadata: '{"severity":"severe","type":"chronic"}',
      },
      {
        code: 'UNA-SKN-001',
        title: 'Barse',
        description: 'Skin condition characterized by white patches',
        system: 'UNA',
        category: 'Skin Diseases',
        icd_mapping: 'L80',
        tm2_mapping: 'TM-SK-001',
        synonyms: 'Vitiligo|Leucoderma',
        metadata: '{"type":"pigmentation","progressive":true}',
      },
    ];

    const csvLines = [
      headers.join(','),
      ...sampleRows.map(row => 
        headers.map(h => {
          const value = row[h as keyof typeof row];
          // Escape values containing commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ),
    ];

    return csvLines.join('\n');
  }

  /**
   * Validate CSV structure and headers
   */
  validateCSVStructure(csvContent: string): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const rows = this.parseCSV(csvContent);

      if (rows.length === 0) {
        errors.push('CSV file is empty');
        return { valid: false, errors, warnings };
      }

      // Check required columns
      const requiredColumns = ['code', 'title', 'system', 'category'];
      const firstRow = rows[0];
      const columns = Object.keys(firstRow);

      requiredColumns.forEach(col => {
        if (!columns.includes(col)) {
          errors.push(`Missing required column: ${col}`);
        }
      });

      // Check optional but recommended columns
      const recommendedColumns = ['description', 'icd_mapping', 'tm2_mapping'];
      recommendedColumns.forEach(col => {
        if (!columns.includes(col)) {
          warnings.push(`Optional column not found: ${col}`);
        }
      });

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      errors.push(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { valid: false, errors, warnings };
    }
  }
}

// Export singleton instance
export const namasteImporter = new NamasteImporter();
