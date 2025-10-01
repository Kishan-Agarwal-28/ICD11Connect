#!/usr/bin/env node
/**
 * MediSutra CLI
 * Command-line interface for searching NAMASTE terms, viewing mapped TM2 codes,
 * and constructing FHIR ProblemList entries
 */

import { api } from './client/src/lib/api';

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

interface CLIOptions {
  command: string;
  args: string[];
}

function parseArgs(): CLIOptions {
  const [, , command, ...args] = process.argv;
  return { command: command || 'help', args };
}

function showHelp() {
  console.log(`
MediSutra CLI - Traditional Medicine Terminology Service

Usage: node cli.mjs <command> [options]

Commands:

  search <query>                    Search across all code systems
  
  who-search <query>                Search WHO ICD-11 API
  
  namaste <code>                    Get NAMASTE code details and mappings
  
  icd11 <code>                      Get ICD-11 code details
  
  tm2 <code>                        Get TM2 code details
  
  translate <source-system> <code>  Translate code to other systems
                                    (source-system: namaste, icd11, tm2)
  
  condition <patient-ref> <system>  Generate FHIR Condition resource
            <code> <display>        Example: condition Patient/123 NAMASTE 
                                    AYU-DIG-001 "Grahani Roga"
  
  import <csv-file>                 Import NAMASTE codes from CSV
  
  validate <csv-file>               Validate CSV file before import
  
  sync <type>                       Sync WHO ICD-11 data (tm2|biomedicine|full)
  
  codesystem [system]               Generate FHIR CodeSystem (AYU|SID|UNA|all)
  
  conceptmap <source> <target>      Generate FHIR ConceptMap
                                    Example: conceptmap NAMASTE ICD-11
  
  bundle                            Generate complete FHIR Bundle
  
  help                              Show this help message

Examples:

  # Search for digestive disorders
  node cli.mjs search "digestive disorder"
  
  # Get NAMASTE code details
  node cli.mjs namaste AYU-DIG-001
  
  # Translate NAMASTE code to ICD-11
  node cli.mjs translate namaste AYU-DIG-001
  
  # Search WHO ICD-11 API
  node cli.mjs who-search diabetes
  
  # Generate FHIR Condition
  node cli.mjs condition Patient/123 NAMASTE AYU-DIG-001 "Grahani Roga"
  
  # Import NAMASTE CSV
  node cli.mjs import namaste_codes.csv
  
  # Generate FHIR Bundle
  node cli.mjs bundle > fhir_bundle.json

Environment Variables:

  API_URL                           Base URL for API (default: http://localhost:5000)
  WHO_CLIENT_ID                     WHO ICD-11 API client ID
  WHO_CLIENT_SECRET                 WHO ICD-11 API client secret
`);
}

async function search(query: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    console.log(`\nSearch Results for: "${query}"`);
    console.log(`Total Results: ${data.totalResults}\n`);
    
    if (data.results.icdCodes.length > 0) {
      console.log('ICD-11 Codes:');
      data.results.icdCodes.forEach((code: any) => {
        console.log(`  ${code.code} - ${code.title}`);
        if (code.description) console.log(`    ${code.description}`);
      });
      console.log();
    }
    
    if (data.results.namasteCodes.length > 0) {
      console.log('NAMASTE Codes:');
      data.results.namasteCodes.forEach((code: any) => {
        console.log(`  ${code.code} (${code.system}) - ${code.title}`);
        if (code.description) console.log(`    ${code.description}`);
      });
      console.log();
    }
    
    if (data.results.tm2Codes.length > 0) {
      console.log('TM2 Codes:');
      data.results.tm2Codes.forEach((code: any) => {
        console.log(`  ${code.code} - ${code.title}`);
        if (code.pattern) console.log(`    Pattern: ${code.pattern}`);
      });
      console.log();
    }
  } catch (error) {
    console.error('Search failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function whoSearch(query: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/who/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    console.log(`\nWHO ICD-11 Search Results for: "${query}"\n`);
    
    if (data.results && data.results.length > 0) {
      data.results.forEach((result: any) => {
        console.log(`  ${result.theCode || 'N/A'} - ${result.title}`);
        if (result.score) console.log(`    Relevance: ${(result.score * 100).toFixed(1)}%`);
        console.log(`    URL: ${result.id}`);
        console.log();
      });
    } else {
      console.log('  No results found');
    }
  } catch (error) {
    console.error('WHO search failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function getNamesteCode(code: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/namaste/code/${code}`);
    const data = await response.json();
    
    console.log(`\nNAMASTE Code: ${data.code}`);
    console.log(`System: ${data.system}`);
    console.log(`Title: ${data.title}`);
    if (data.description) console.log(`Description: ${data.description}`);
    console.log(`Category: ${data.category}`);
    
    // Get mappings
    const mappingsResponse = await fetch(`${BASE_URL}/api/mapping/code/NAMASTE/${code}`);
    const mappings = await mappingsResponse.json();
    
    if (mappings.length > 0) {
      console.log('\nMappings:');
      mappings.forEach((mapping: any) => {
        console.log(`  → ${mapping.targetSystem}: ${mapping.targetCode}`);
        console.log(`    Type: ${mapping.mappingType}, Confidence: ${mapping.confidence}`);
      });
    }
  } catch (error) {
    console.error('Failed to get NAMASTE code:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function translate(sourceSystem: string, sourceCode: string) {
  try {
    const normalizedSystem = sourceSystem.toUpperCase() === 'NAMASTE' ? 'NAMASTE' :
                             sourceSystem.toUpperCase() === 'ICD11' ? 'ICD-11' :
                             sourceSystem.toUpperCase() === 'TM2' ? 'TM2' : sourceSystem;
    
    const response = await fetch(`${BASE_URL}/api/mapping/code/${normalizedSystem}/${sourceCode}`);
    const mappings = await response.json();
    
    console.log(`\nTranslations for ${normalizedSystem} code: ${sourceCode}\n`);
    
    if (mappings.length > 0) {
      const grouped = mappings.reduce((acc: any, mapping: any) => {
        if (!acc[mapping.targetSystem]) acc[mapping.targetSystem] = [];
        acc[mapping.targetSystem].push(mapping);
        return acc;
      }, {});
      
      Object.entries(grouped).forEach(([system, maps]: [string, any]) => {
        console.log(`${system}:`);
        maps.forEach((mapping: any) => {
          console.log(`  ${mapping.targetCode}`);
          console.log(`    Type: ${mapping.mappingType}, Confidence: ${mapping.confidence}`);
        });
        console.log();
      });
    } else {
      console.log('  No translations found');
    }
  } catch (error) {
    console.error('Translation failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function generateCondition(patientRef: string, system: string, code: string, display: string) {
  try {
    const body = {
      patientReference: patientRef,
      primaryCode: { system, code, display },
      secondaryCodes: [],
      options: {
        clinicalStatus: 'active',
        verificationStatus: 'confirmed',
      }
    };
    
    const response = await fetch(`${BASE_URL}/api/fhir/condition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const condition = await response.json();
    console.log(JSON.stringify(condition, null, 2));
  } catch (error) {
    console.error('Failed to generate condition:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function generateBundle() {
  try {
    const response = await fetch(`${BASE_URL}/api/fhir/bundle?includeCodeSystems=true&includeConceptMaps=true`);
    const bundle = await response.json();
    console.log(JSON.stringify(bundle, null, 2));
  } catch (error) {
    console.error('Failed to generate bundle:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function main() {
  const { command, args } = parseArgs();
  
  switch (command) {
    case 'help':
      showHelp();
      break;
      
    case 'search':
      if (args.length === 0) {
        console.error('Error: Query required');
        console.log('Usage: node cli.mjs search <query>');
        process.exit(1);
      }
      await search(args.join(' '));
      break;
      
    case 'who-search':
      if (args.length === 0) {
        console.error('Error: Query required');
        console.log('Usage: node cli.mjs who-search <query>');
        process.exit(1);
      }
      await whoSearch(args.join(' '));
      break;
      
    case 'namaste':
      if (args.length === 0) {
        console.error('Error: Code required');
        console.log('Usage: node cli.mjs namaste <code>');
        process.exit(1);
      }
      await getNamesteCode(args[0]);
      break;
      
    case 'translate':
      if (args.length < 2) {
        console.error('Error: Source system and code required');
        console.log('Usage: node cli.mjs translate <source-system> <code>');
        process.exit(1);
      }
      await translate(args[0], args[1]);
      break;
      
    case 'condition':
      if (args.length < 4) {
        console.error('Error: Patient reference, system, code, and display required');
        console.log('Usage: node cli.mjs condition <patient-ref> <system> <code> <display>');
        process.exit(1);
      }
      await generateCondition(args[0], args[1], args[2], args.slice(3).join(' ').replace(/['"]/g, ''));
      break;
      
    case 'bundle':
      await generateBundle();
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      console.log('Run "node cli.mjs help" for usage information');
      process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
