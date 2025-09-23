# ICD-11 & NAMASTE Integration Platform

## Overview

This is a healthcare terminology integration platform designed to bridge India's NAMASTE (National AYUSH Morbidity and Standardized Terminologies Electronic) coding system with WHO's ICD-11 Traditional Medicine Module 2 (TM2) and biomedicine codes. The platform serves as a lightweight FHIR R4-compliant terminology microservice that enables EMR systems to seamlessly integrate multiple coding standards for traditional medicine and modern healthcare.

The application provides search functionality across different medical coding systems, code mapping and translation capabilities, and FHIR-compliant data structures to support healthcare interoperability standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built as a React single-page application using modern web technologies:
- **React 18** with TypeScript for component-based UI development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management and API caching
- **Tailwind CSS** with shadcn/ui component library for consistent styling
- **Radix UI** primitives for accessible, unstyled UI components

The UI follows a three-panel layout: sidebar navigation for browsing code hierarchies, main content area for displaying detailed code information, and a details panel for system status and recent activity.

### Backend Architecture
The backend follows a Node.js/Express REST API pattern:
- **Express.js** server with TypeScript for type-safe API development
- **RESTful API design** with endpoints organized by medical coding system (ICD-11, NAMASTE, TM2)
- **In-memory storage** with interface-based design allowing for future database integration
- **Modular routing** with dedicated handlers for search, code lookup, and mapping operations
- **Request logging middleware** for API monitoring and debugging

The server implements a clean separation between storage interfaces and business logic, making it easy to swap storage implementations.

### Data Storage Solutions
Currently uses in-memory storage with Maps for rapid prototyping:
- **IStorage interface** defines contracts for all data operations
- **MemStorage implementation** provides in-memory data persistence
- **Drizzle ORM configuration** prepared for PostgreSQL database integration
- **Database schema** defined for ICD codes, NAMASTE codes, TM2 codes, code mappings, and search activities

The architecture is designed to easily transition from in-memory storage to PostgreSQL using Drizzle ORM without changing business logic.

### Authentication and Authorization
Prepared for OAuth 2.0 integration with ABHA (Ayushman Bharat Health Account) tokens:
- **Placeholder authentication** in current implementation
- **Audit-ready metadata** structure for tracking user activities
- **Session management** infrastructure for future OAuth implementation

### Code Integration and Mapping
The system supports multiple medical coding standards:
- **ICD-11 integration** with hierarchical chapter/category organization
- **NAMASTE codes** supporting Ayurveda (AYU), Siddha (SID), and Unani (UNA) systems
- **TM2 pattern-based codes** for traditional medicine classification
- **Bidirectional code mapping** with support for exact, broader, narrower, and related mappings
- **Global search** across all coding systems simultaneously

### FHIR Compliance
Designed to support FHIR R4 standard:
- **FHIR data structures** for CodeSystem, ConceptMap, and Bundle resources
- **FHIR-compliant endpoints** for terminology operations
- **India's 2016 EHR Standards** compliance with ISO 22600 and SNOMED-CT/LOINC semantics support

## External Dependencies

### Development and Build Tools
- **@vitejs/plugin-react** - React integration for Vite build system
- **@replit/vite-plugin-runtime-error-modal** - Development error handling
- **@replit/vite-plugin-cartographer** and **@replit/vite-plugin-dev-banner** - Replit-specific development enhancements
- **esbuild** - Fast JavaScript bundler for production builds
- **tsx** - TypeScript execution for Node.js development

### Database and ORM
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon database
- **drizzle-orm** and **drizzle-kit** - Type-safe ORM and migration toolkit
- **drizzle-zod** - Integration between Drizzle ORM and Zod validation
- **connect-pg-simple** - PostgreSQL session store for Express sessions

### UI and Styling Framework
- **shadcn/ui component system** built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **class-variance-authority** and **clsx** for conditional styling
- **Lucide React** for consistent iconography
- **cmdk** for command palette functionality
- **embla-carousel-react** for carousel components

### State Management and API
- **@tanstack/react-query** - Server state management with caching and synchronization
- **wouter** - Minimalist routing library for React applications

### Form Handling and Validation
- **react-hook-form** with **@hookform/resolvers** - Performance-focused form management
- **zod** - Runtime type validation and schema parsing

### Utility Libraries
- **date-fns** - Modern date utility library
- **nanoid** - URL-safe unique string ID generator
- **tailwind-merge** - Utility for merging Tailwind CSS classes

The architecture emphasizes modularity, type safety, and healthcare standards compliance while maintaining flexibility for future enhancements and integrations.