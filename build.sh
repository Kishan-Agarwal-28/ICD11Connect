#!/bin/bash

echo "Building Netlify Functions..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  npm install
fi

# Build the client
echo "Building client..."
npm run build

# Build the Netlify functions
echo "Building functions..."
mkdir -p netlify/functions/dist

# Copy shared schema to functions directory
cp shared/schema.ts netlify/functions/

# Compile the functions
npx esbuild netlify/functions/api.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=netlify/functions \
  --out-extension:.js=.js \
  --external:crypto

echo "Build complete!"