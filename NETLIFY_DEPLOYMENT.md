# Netlify Deployment Guide for ICD11Connect

This project has been configured to deploy on Netlify with serverless functions.

## Project Structure for Netlify

```
├── netlify.toml              # Netlify configuration
├── netlify/functions/        # Netlify serverless functions
│   ├── api.ts               # Main API handler
│   └── storage.ts           # Data storage utility
├── client/                   # React frontend
├── dist/                     # Built frontend (auto-generated)
└── shared/                   # Shared types and schemas
```

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run netlify:build
```

### 3. Deploy to Netlify

#### Option A: Using Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to draft URL for testing
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Option B: Using Git Integration
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build command: `npm run netlify:build`
4. Set publish directory: `dist`
5. Deploy automatically on push

### 4. Environment Variables (if needed)
In Netlify dashboard, go to Site settings > Environment variables and add:
- Any database URLs
- API keys
- Environment-specific configurations

## Local Development with Netlify

To test the Netlify functions locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local development server
netlify dev
```

This will start both the frontend and backend functions locally, mimicking the production environment.

## Key Configuration Files

### netlify.toml
- Defines build settings
- Sets up redirects from `/api/*` to functions
- Configures CORS headers

### Package.json Scripts
- `netlify:build`: Builds both functions and frontend
- `build:functions`: Compiles TypeScript functions to JavaScript
- `netlify:dev`: Local development with Netlify CLI

## API Endpoints

All API endpoints are available at:
- Production: `https://your-site.netlify.app/api/*`
- Local: `http://localhost:8888/api/*` (with netlify dev)

### Available Endpoints:
- `GET /api/search?q={query}` - Global search
- `GET /api/icd11/code/{code}` - Get ICD-11 code
- `GET /api/namaste/code/{code}` - Get NAMASTE code  
- `GET /api/tm2/code/{code}` - Get TM2 code
- `GET /api/mapping/code/{system}/{code}` - Get code mappings
- `GET /api/status` - System status

## Features Configured for Netlify

✅ **Serverless Functions**: API endpoints as Netlify functions
✅ **One-to-One Mapping**: Clean NAMASTE ↔ ICD-11 mappings
✅ **Responsive Design**: Mobile-first approach
✅ **CORS Handling**: Proper headers for API access
✅ **Environment Detection**: Automatic dev/prod URL handling
✅ **TypeScript Support**: Full TypeScript compilation
✅ **Build Optimization**: Efficient bundling and deployment

## Troubleshooting

### Functions Not Working
- Check function logs in Netlify dashboard
- Ensure `netlify.toml` is in root directory
- Verify function files are in `netlify/functions/`

### API Calls Failing
- Check browser console for CORS errors
- Verify API URLs in network tab
- Test endpoints directly: `https://your-site.netlify.app/api/status`

### Build Failures
- Check build logs in Netlify dashboard
- Run `npm run netlify:build` locally first
- Ensure all dependencies are in package.json

## Medical Data & Compliance

The application maintains:
- FHIR R4 compliance for medical data exchange
- One-to-one mapping integrity between coding systems
- Proper medical terminology handling
- Traditional medicine integration (Ayurveda, Siddha, Unani)

## Performance Optimizations

- Functions are bundled for faster cold starts
- Client-side routing with proper redirects
- Optimized build process
- Efficient data structures for medical code lookups