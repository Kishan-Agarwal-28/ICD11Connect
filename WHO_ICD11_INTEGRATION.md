# WHO ICD-11 Integration & FHIR Compliance Guide

## Overview

MediSutra now includes full WHO ICD-11 API integration with support for:
1. **NAMASTE CSV Import**: Ingest NAMASTE terminology and generate FHIR CodeSystem + ConceptMap resources
2. **WHO ICD-11 API Integration**: Fetch TM2 and Biomedicine updates from WHO ICD-API
3. **FHIR R4 Compliance**: Generate ProblemList entries with dual-coding support
4. **India's 2016 EHR Standards**: Version tracking, consent metadata, ISO 22600 audit trails

---

## Prerequisites

### WHO ICD-11 API Credentials

To use the WHO ICD-11 API integration, you need to obtain API credentials:

1. Register at: https://icd.who.int/icdapi
2. Create an application to get your Client ID and Client Secret
3. Add credentials to your environment variables:

```bash
WHO_CLIENT_ID=your_client_id_here
WHO_CLIENT_SECRET=your_client_secret_here
```

### Install Dependencies

```bash
npm install
```

New dependencies added:
- `csv-parse`: CSV file parsing for NAMASTE imports
- `multer`: File upload handling
- `@types/multer`: TypeScript types for multer

---

## Features Implementation

### 1. NAMASTE CSV Import & FHIR Generation

#### Download CSV Template

```bash
GET /api/namaste/import/template
```

Returns a CSV template with the following columns:
- `code`: Unique NAMASTE code (e.g., AYU-DIG-001)
- `title`: Display name
- `description`: Detailed description
- `system`: AYU (Ayurveda), SID (Siddha), or UNA (Unani)
- `category`: Body system category
- `icd_mapping`: Pipe-separated ICD-11 codes (e.g., K59.9|K58.0)
- `tm2_mapping`: Pipe-separated TM2 codes
- `synonyms`: Pipe-separated alternative terms
- `metadata`: JSON object with additional properties

#### Validate CSV File

```bash
POST /api/namaste/import/validate
Content-Type: multipart/form-data

file: <CSV file>
```

Response:
```json
{
  "valid": true,
  "totalRows": 150,
  "successfulValidations": 148,
  "failedValidations": 2,
  "errors": [
    {
      "row": 15,
      "error": "System must be AYU, SID, or UNA",
      "data": { ... }
    }
  ],
  "warnings": [
    "Optional column not found: synonyms"
  ]
}
```

#### Import NAMASTE Codes

```bash
POST /api/namaste/import
Content-Type: multipart/form-data

file: <CSV file>
```

Response:
```json
{
  "success": true,
  "message": "NAMASTE codes imported successfully",
  "totalRows": 150,
  "codesImported": 148,
  "mappingsCreated": 296,
  "errors": []
}
```

This automatically:
- Creates NAMASTE code entries
- Generates code mappings to ICD-11 and TM2
- Validates data integrity

### 2. WHO ICD-11 API Integration

#### Search WHO ICD-11

```bash
GET /api/who/search?q=diabetes&releaseId=2024-01
```

Response:
```json
{
  "query": "diabetes",
  "results": [
    {
      "id": "http://id.who.int/icd/entity/1234567890",
      "title": "Type 2 diabetes mellitus",
      "theCode": "5A11",
      "score": 0.95
    }
  ],
  "guessType": "Diabetes mellitus"
}
```

#### Get Entity by Code

```bash
GET /api/who/code/5A11?releaseId=2024-01
```

Response:
```json
{
  "@id": "http://id.who.int/icd/entity/1234567890",
  "title": {
    "@language": "en",
    "@value": "Type 2 diabetes mellitus"
  },
  "definition": {
    "@language": "en",
    "@value": "A type of diabetes mellitus..."
  },
  "code": "5A11",
  "parent": ["http://id.who.int/icd/entity/parent123"],
  "browserUrl": "https://icd.who.int/browse11/l-m/en#/http://id.who.int/icd/entity/1234567890"
}
```

#### Get TM2 (Traditional Medicine Module 2)

```bash
GET /api/who/tm2?releaseId=2024-01
```

Returns the complete TM2 hierarchy from Chapter 26 of ICD-11.

#### Sync WHO Updates

```bash
POST /api/who/sync
Content-Type: application/json

{
  "syncType": "tm2",  // or "biomedicine" or "full"
  "releaseId": "2024-01"
}
```

Response:
```json
{
  "message": "Sync process started",
  "syncId": "sync-1234567890",
  "syncType": "tm2",
  "status": "in_progress",
  "note": "This is a background process. Check /api/who/sync/status/{syncId} for updates."
}
```

### 3. FHIR R4 Resource Generation

#### Generate FHIR CodeSystem

```bash
GET /api/fhir/codesystem/namaste?system=AYU&version=1.0.0
```

Generates a complete FHIR R4 CodeSystem resource with all NAMASTE codes.

#### Generate FHIR ConceptMap

```bash
GET /api/fhir/conceptmap/NAMASTE/ICD-11?version=1.0.0
```

Creates a FHIR ConceptMap showing translations between NAMASTE and ICD-11 codes.

#### Generate FHIR Condition (ProblemList Entry)

```bash
POST /api/fhir/condition
Content-Type: application/json

{
  "patientReference": "Patient/12345",
  "primaryCode": {
    "system": "NAMASTE",
    "code": "AYU-DIG-001",
    "display": "Grahani Roga"
  },
  "secondaryCodes": [
    {
      "system": "ICD-11",
      "code": "K59.9",
      "display": "Functional intestinal disorder, unspecified"
    },
    {
      "system": "TM2",
      "code": "TM-GI-001",
      "display": "Spleen-Stomach pattern"
    }
  ],
  "options": {
    "clinicalStatus": "active",
    "verificationStatus": "confirmed",
    "category": "problem-list-item",
    "onsetDateTime": "2024-01-15T10:00:00Z",
    "notes": "Patient reports chronic digestive discomfort"
  }
}
```

Response: Complete FHIR R4 Condition resource with dual-coding (traditional + biomedical).

#### Generate FHIR Bundle

```bash
GET /api/fhir/bundle?includeCodeSystems=true&includeConceptMaps=true&version=1.0.0
```

Creates a complete FHIR Bundle containing:
- NAMASTE CodeSystem
- ConceptMaps for all system pairs (NAMASTE↔ICD-11, NAMASTE↔TM2, TM2↔ICD-11)

### 4. Compliance Features (India's 2016 EHR Standards)

#### Audit Logging (ISO 22600)

```bash
POST /api/audit/log
Content-Type: application/json

{
  "eventType": "access",
  "entityType": "namaste_code",
  "entityId": "AYU-DIG-001",
  "userId": "doctor123",
  "userRole": "physician",
  "action": "view_diagnosis",
  "outcome": "success",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "requestData": { "system": "AYU" },
  "responseData": { "code": "AYU-DIG-001" }
}
```

#### Get Audit Trail

```bash
GET /api/audit/trail?entityType=namaste_code&entityId=AYU-DIG-001&limit=50
```

#### Consent Management

Record patient consent:
```bash
POST /api/consent/record
Content-Type: application/json

{
  "patientId": "P12345",
  "consentType": "traditional_medicine",
  "status": "active",
  "scope": ["diagnosis", "treatment", "data_sharing"],
  "grantedBy": "patient",
  "grantedTo": ["doctor_id_123", "hospital_system"],
  "purpose": "Traditional medicine diagnosis and treatment",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2025-01-01T00:00:00Z",
  "abhaId": "12-3456-7890-1234"
}
```

Check consent:
```bash
GET /api/consent/check?patientId=P12345&purpose=traditional_medicine
```

#### Version Tracking

```bash
GET /api/version/history?entityType=namaste_code&entityId=AYU-DIG-001
```

Returns version history including:
- Version number
- Change type (created, updated, deprecated)
- Change description
- Effective date
- Changed by (user)

---

## Client Integration

### Frontend API Usage

```typescript
import { api } from '@/lib/api';

// Search WHO ICD-11
const whoResults = await api.whoSearch('diabetes', '2024-01');

// Import NAMASTE CSV
const file = event.target.files[0];
const validationResult = await api.namasteValidateCSV(file);
if (validationResult.valid) {
  const importResult = await api.namasteImportCSV(file);
  console.log(`Imported ${importResult.codesImported} codes`);
}

// Generate FHIR Condition
const condition = await api.fhirGenerateCondition({
  patientReference: 'Patient/123',
  primaryCode: {
    system: 'NAMASTE',
    code: 'AYU-DIG-001',
    display: 'Grahani Roga'
  },
  secondaryCodes: [
    {
      system: 'ICD-11',
      code: 'K59.9',
      display: 'Functional intestinal disorder'
    }
  ]
});

// Log audit event
await api.auditLog({
  eventType: 'create',
  entityType: 'condition',
  entityId: condition.id,
  userId: currentUser.id,
  action: 'create_diagnosis',
  outcome: 'success'
});
```

---

## Database Schema Updates

New tables added for compliance:

### `fhir_code_systems`
Stores generated FHIR CodeSystem resources

### `fhir_concept_maps`
Stores generated FHIR ConceptMap resources

### `version_history`
Tracks all changes to code systems with:
- Version numbers
- Change descriptions
- Effective dates
- User who made changes

### `consent_records`
Manages patient consent with:
- Consent type and status
- Scope and purpose
- ABHA ID integration
- Start/end dates

### `audit_logs`
ISO 22600 compliant audit trail with:
- Event types (access, create, update, delete)
- User details and roles
- IP address and user agent
- Request/response data
- Timestamps

### `who_sync_status`
Tracks WHO ICD-11 API synchronization:
- Sync type (TM2, biomedicine, full)
- Status and progress
- Records processed/added/updated
- Error messages

---

## Development Workflow

### 1. Setup Environment

```bash
# Install dependencies
npm install

# Set WHO API credentials
export WHO_CLIENT_ID=your_client_id
export WHO_CLIENT_SECRET=your_client_secret

# Push database schema
npm run db:push
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Import NAMASTE Data

1. Download template: `GET /api/namaste/import/template`
2. Fill in CSV with NAMASTE codes
3. Validate: `POST /api/namaste/import/validate` with file
4. Import: `POST /api/namaste/import` with file

### 4. Sync WHO Data

```bash
# Sync TM2 codes
curl -X POST http://localhost:5000/api/who/sync \
  -H "Content-Type: application/json" \
  -d '{"syncType": "tm2", "releaseId": "2024-01"}'

# Sync biomedicine codes
curl -X POST http://localhost:5000/api/who/sync \
  -H "Content-Type: application/json" \
  -d '{"syncType": "biomedicine", "releaseId": "2024-01"}'
```

### 5. Generate FHIR Resources

```bash
# Get FHIR CodeSystem
curl http://localhost:5000/api/fhir/codesystem/namaste

# Get FHIR ConceptMap
curl http://localhost:5000/api/fhir/conceptmap/NAMASTE/ICD-11

# Get complete bundle
curl http://localhost:5000/api/fhir/bundle
```

---

## Production Deployment

### Environment Variables

```bash
# Required
WHO_CLIENT_ID=your_client_id_here
WHO_CLIENT_SECRET=your_client_secret_here
DATABASE_URL=postgresql://user:pass@host:5432/medisutra

# Optional
WHO_API_ENDPOINT=https://id.who.int/icd
WHO_TOKEN_ENDPOINT=https://icdaccessmanagement.who.int/connect/token
PORT=5000
NODE_ENV=production
```

### Database Migration

```bash
npm run db:push
```

This creates all required tables:
- `icd_codes`
- `namaste_codes`
- `tm2_codes`
- `code_mappings`
- `fhir_code_systems`
- `fhir_concept_maps`
- `version_history`
- `consent_records`
- `audit_logs`
- `who_sync_status`

### Security Considerations

1. **API Authentication**: Implement OAuth 2.0 for client applications
2. **ABHA Integration**: Connect to Ayushman Bharat Health Account system
3. **Audit Logs**: Store in secure, append-only storage
4. **Consent Validation**: Verify consent before accessing patient data
5. **WHO API Rate Limiting**: Implement exponential backoff for API calls

---

## Testing

### Test WHO API Connection

```bash
curl "http://localhost:5000/api/who/search?q=fever"
```

### Test CSV Import

```bash
# Download template
curl http://localhost:5000/api/namaste/import/template -o template.csv

# Validate
curl -X POST http://localhost:5000/api/namaste/import/validate \
  -F "file=@template.csv"

# Import
curl -X POST http://localhost:5000/api/namaste/import \
  -F "file=@template.csv"
```

### Test FHIR Generation

```bash
# Generate FHIR Condition
curl -X POST http://localhost:5000/api/fhir/condition \
  -H "Content-Type: application/json" \
  -d '{
    "patientReference": "Patient/test123",
    "primaryCode": {
      "system": "NAMASTE",
      "code": "AYU-DIG-001",
      "display": "Grahani Roga"
    }
  }'
```

---

## Troubleshooting

### WHO API Authentication Fails

- Verify credentials are correct
- Check if API access is active
- Ensure network allows connections to icdaccessmanagement.who.int

### CSV Import Errors

- Download and check the template format
- Ensure all required columns are present
- Validate system values are AYU, SID, or UNA
- Check for proper CSV encoding (UTF-8)

### FHIR Resource Generation Issues

- Verify code mappings exist in database
- Check that referenced codes are valid
- Ensure version numbers are consistent

---

## API Reference

Full API documentation available at:
- WHO ICD-11 API: https://id.who.int/swagger/index.html
- FHIR R4: http://hl7.org/fhir/R4/
- India EHR Standards: https://www.mohfw.gov.in/

---

## Support

For issues or questions:
1. Check this documentation
2. Review WHO ICD-11 API documentation
3. Consult FHIR R4 specifications
4. Review India's 2016 EHR Standards documentation

---

## License

© 2024 MediSutra - Ministry of AYUSH Integration Project
