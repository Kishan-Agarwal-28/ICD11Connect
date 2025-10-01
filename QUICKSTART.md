# Quick Start Guide - WHO ICD-11 Integration

## Installation & Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Get WHO ICD-11 API Credentials

1. Visit: https://icd.who.int/icdapi
2. Create an account
3. Register a new application
4. Copy your Client ID and Client Secret

### 3. Configure Environment

Create `.env` file in project root:

```env
WHO_CLIENT_ID=your_client_id_here
WHO_CLIENT_SECRET=your_client_secret_here
DATABASE_URL=postgresql://localhost:5432/medisutra
PORT=5000
```

### 4. Initialize Database

```bash
npm run db:push
```

### 5. Start Server

```bash
npm run dev
```

Server will start at: http://localhost:5000

---

## Quick Test (2 minutes)

### Test WHO ICD-11 API Connection

```bash
curl "http://localhost:5000/api/who/search?q=fever"
```

Expected response: JSON with WHO ICD-11 search results

### Test NAMASTE Import

1. Download CSV template:
```bash
curl http://localhost:5000/api/who/search?q=fever -o namaste_template.csv
```

2. Import the template:
```bash
curl -X POST http://localhost:5000/api/namaste/import \
  -F "file=@namaste_template.csv"
```

### Test FHIR Generation

Generate FHIR Bundle:
```bash
curl http://localhost:5000/api/fhir/bundle | json_pp
```

---

## CLI Usage Examples

### Search Across All Systems

```bash
node cli.mjs search "digestive disorder"
```

### Search WHO ICD-11

```bash
node cli.mjs who-search diabetes
```

### Get NAMASTE Code Details

```bash
node cli.mjs namaste AYU-DIG-001
```

### Translate Between Systems

```bash
node cli.mjs translate namaste AYU-DIG-001
```

### Generate FHIR Condition

```bash
node cli.mjs condition Patient/123 NAMASTE AYU-DIG-001 "Grahani Roga"
```

### Generate Complete FHIR Bundle

```bash
node cli.mjs bundle > fhir_bundle.json
```

---

## Common Tasks

### Import NAMASTE Codes from CSV

1. Prepare your CSV file with these columns:
   - code, title, description, system, category, icd_mapping, tm2_mapping

2. Validate:
```bash
curl -X POST http://localhost:5000/api/namaste/import/validate \
  -F "file=@your_codes.csv"
```

3. Import:
```bash
curl -X POST http://localhost:5000/api/namaste/import \
  -F "file=@your_codes.csv"
```

### Sync WHO ICD-11 Updates

Sync Traditional Medicine Module 2:
```bash
curl -X POST http://localhost:5000/api/who/sync \
  -H "Content-Type: application/json" \
  -d '{"syncType": "tm2", "releaseId": "2024-01"}'
```

Sync Biomedicine codes:
```bash
curl -X POST http://localhost:5000/api/who/sync \
  -H "Content-Type: application/json" \
  -d '{"syncType": "biomedicine", "releaseId": "2024-01"}'
```

### Generate FHIR Resources

CodeSystem for NAMASTE:
```bash
curl "http://localhost:5000/api/fhir/codesystem/namaste?system=AYU"
```

ConceptMap (NAMASTE to ICD-11):
```bash
curl http://localhost:5000/api/fhir/conceptmap/NAMASTE/ICD-11
```

Complete Bundle:
```bash
curl http://localhost:5000/api/fhir/bundle > medisutra_bundle.json
```

---

## Web Interface

Navigate to: http://localhost:5000

Features:
- **Search Bar**: Search across all code systems
- **Sidebar**: Filter by system (ICD-11, NAMASTE, TM2)
- **Code Details**: View code information and mappings
- **Translation**: See cross-system mappings

---

## Troubleshooting

### WHO API Authentication Fails

**Error:** `WHO ICD Authentication failed`

**Solution:**
1. Verify `WHO_CLIENT_ID` and `WHO_CLIENT_SECRET` in `.env`
2. Check credentials at https://icd.who.int/icdapi
3. Ensure network access to icdaccessmanagement.who.int

### Database Connection Error

**Error:** `Failed to connect to database`

**Solution:**
1. Verify `DATABASE_URL` in `.env`
2. Ensure PostgreSQL is running
3. Run `npm run db:push` to create tables

### CSV Import Validation Errors

**Error:** `System must be AYU, SID, or UNA`

**Solution:**
1. Download template: `curl http://localhost:5000/api/namaste/import/template -o template.csv`
2. Check CSV format matches template
3. Ensure system column contains only: AYU, SID, or UNA

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
1. Change port in `.env`: `PORT=5001`
2. Or kill process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <pid> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```

---

## Next Steps

1. **Import Your Data**: Prepare NAMASTE CSV and import
2. **Sync WHO Data**: Run WHO ICD-11 sync for latest codes
3. **Generate FHIR**: Create FHIR resources for your EMR system
4. **Explore API**: Check `WHO_ICD11_INTEGRATION.md` for full API reference
5. **Deploy**: Follow deployment guide for production setup

---

## Resources

- **Full Documentation**: `WHO_ICD11_INTEGRATION.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **WHO ICD-11 API**: https://id.who.int/swagger/index.html
- **FHIR R4 Spec**: http://hl7.org/fhir/R4/

---

## Support

For issues:
1. Check troubleshooting section above
2. Review error logs in console
3. Verify environment variables
4. Check database connection

Happy coding! 🎉
