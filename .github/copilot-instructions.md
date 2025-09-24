# MediSutra Copilot Instructions

## Project Overview
MediSutra is a FHIR R4-compliant terminology microservice that integrates India's NAMASTE codes, WHO ICD-11 Traditional Medicine Module 2 (TM2), and biomedicine codes for EMR systems. It enables dual-coding for traditional medicine (Ayurveda, Siddha, Unani) and biomedical diagnoses.

## Architecture Patterns

### Full-Stack Structure
- **Client**: React + TypeScript frontend in `client/` using Vite, shadcn/ui components
- **Server**: Express.js backend in `server/` with REST API endpoints
- **Shared**: Common types and database schema in `shared/schema.ts`
- **Database**: PostgreSQL with Drizzle ORM for multi-system code storage

### Key Directories
```
client/src/
├── components/     # Reusable UI components (search, navigation, code mapping)
├── pages/         # Route components (dashboard, not-found)
├── lib/           # API client, query configuration, utilities
└── types/         # TypeScript interfaces extending shared schema

server/
├── index.ts       # Express app setup with Vite integration
├── routes.ts      # REST API endpoints for code operations
└── storage.ts     # Database abstraction with mock data fallback

shared/
└── schema.ts      # Drizzle schema + Zod validation for all code systems
```

### Core Data Model
Four main code systems with cross-references:
- `icdCodes`: ICD-11 biomedicine + TM2 with hierarchical structure
- `namasteeCodes`: India's standardized traditional medicine terms (AYU/SID/UNA)
- `tm2Codes`: WHO Traditional Medicine Module 2 pattern-based codes
- `codeMappings`: Cross-system translations with confidence levels

## Development Workflows

### Key Commands
```bash
npm run dev        # Start development server (client + API)
npm run build      # Production build (client + server bundle)
npm run db:push    # Apply schema changes to database
npm run check      # TypeScript compilation check
```

### Database Setup
Uses Drizzle ORM with PostgreSQL. Schema defined in `shared/schema.ts`:
- All tables use UUID primary keys with `gen_random_uuid()`
- JSONB fields for metadata and hierarchical children arrays
- Zod validation schemas auto-generated from Drizzle tables
- Mock data initialization in `storage.ts` for development

### API Patterns
REST endpoints follow `/api/{system}/{operation}` pattern:
- Global search: `GET /api/search?q={query}`
- System-specific: `GET /api/{icd11|namaste|tm2}/code/{code}`
- Code translation: `GET /api/mapping/{sourceSystem}/{sourceCode}/{targetSystem}`
- All responses include error handling with proper HTTP status codes

## Component Architecture

### State Management
- React Query for server state with query keys like `['/api/icd11/code', selectedCode]`
- Local state for UI interactions (selected codes, filters, navigation)
- Props-based communication between layout components

### UI Components
Built with shadcn/ui + Radix primitives:
- `sidebar-navigation.tsx`: Multi-system filter checkboxes + tree navigation
- `main-content.tsx`: Code details with mapping tables and FHIR export
- `details-panel.tsx`: Related codes and cross-system relationships
- `code-mapping.tsx`: Translation confidence indicators and bidirectional mapping

### Query Patterns
Enable queries conditionally based on selected system:
```typescript
const { data: icdCode } = useQuery({
  queryKey: ['/api/icd11/code', selectedCode],
  queryFn: () => api.getIcdByCode(selectedCode!),
  enabled: !!selectedCode && selectedSystem === 'icd11',
});
```

## FHIR Compliance & Integration

### Standards Adherence
- FHIR R4 resource structures for CodeSystem and ConceptMap
- OAuth 2.0 authentication with ABHA token integration
- Audit trails for search activity and code access
- ISO 22600 access control patterns

### Code Mapping Logic
- Exact, broader, narrower, related mapping types
- Confidence levels (high/medium/low) for translation quality
- Bidirectional mapping support between all three systems
- Automatic ICD-11 coding rule compliance validation

## Project-Specific Conventions

### Type Safety
- Shared TypeScript interfaces in `shared/schema.ts` imported as `@shared/schema`
- Client types extend shared types in `client/src/types/icd.ts`
- Zod validation on both client and server sides

### Path Aliases
```typescript
"@": "client/src"           # Client source root
"@shared": "shared"         # Shared schema and types
"@assets": "attached_assets" # Documentation and requirements
```

### Error Handling
- Server: Try-catch with proper HTTP status codes and error messages
- Client: React Query error boundaries with user-friendly messages
- Database: Graceful fallback to mock data if connection fails

### Component Patterns
- Props interfaces for all components with specific typing
- Conditional rendering based on selected system and loading states
- Consistent loading patterns with skeleton components
- Badge components for system identification (ICD-11, NAMASTE, TM2)

## Testing & Validation

### Data Validation
- All API inputs validated against Zod schemas
- Database constraints enforce referential integrity
- Mock data includes realistic medical terminology examples

### Development Tools
- TypeScript strict mode enabled
- Drizzle Kit for database migrations
- Vite for fast development builds with HMR
- ESBuild for production server bundling

When working on this codebase, prioritize FHIR compliance, maintain the dual-coding architecture, and ensure proper error handling for medical data accuracy.