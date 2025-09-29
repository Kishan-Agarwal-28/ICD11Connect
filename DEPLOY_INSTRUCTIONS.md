# 🚀 Deploy ICD11Connect to Netlify

## Option 1: Deploy via Git (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment with serverless functions"
git push origin main
```

### Step 2: Connect to Netlify
1. Go to [https://netlify.com](https://netlify.com)
2. Sign up/login with your GitHub account
3. Click "Add new site" → "Import an existing project"
4. Choose "Deploy with GitHub"
5. Select your `ICD11Connect` repository

### Step 3: Configure Build Settings
- **Build command**: `npm run netlify:build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions` (auto-detected)

### Step 4: Deploy
- Click "Deploy site"
- Wait for build to complete
- Your site will be live at `https://[random-name].netlify.app`

## Option 2: Manual Deploy

### Step 1: Create Production Build
```bash
npm run netlify:build
```

### Step 2: Deploy to Netlify
1. Go to [https://netlify.com](https://netlify.com)
2. Drag and drop your `dist` folder to the deploy area
3. Your functions in `netlify/functions` will be auto-detected

## 🔧 Configuration Files Ready

Your project includes:

✅ **netlify.toml** - Netlify configuration
✅ **Package.json** - Build scripts configured  
✅ **Functions** - Compiled and ready in `netlify/functions/`
✅ **Frontend** - Built and optimized in `dist/`

## 🌐 After Deployment

Your API will be available at:
- `https://your-site.netlify.app/api/search?q=grahani`
- `https://your-site.netlify.app/api/namaste/code/AYU-DIG-001`
- `https://your-site.netlify.app/api/mapping/code/NAMASTE/AYU-DIG-001`

## 🏥 Medical Features Live

Once deployed, your platform will provide:
- **One-to-one code mappings** between NAMASTE, ICD-11, and TM2
- **Traditional medicine integration** (Ayurveda, Siddha, Unani)
- **Responsive design** for all devices
- **FHIR R4 compliance** for medical data exchange

## 🐛 Troubleshooting

If deployment fails:
1. Check build logs in Netlify dashboard
2. Ensure all files are committed to Git
3. Verify `netlify.toml` is in root directory
4. Test local build: `npm run netlify:build`

## ⚡ Performance

Expected performance:
- **Cold start**: ~200-500ms for serverless functions
- **Frontend**: ~1-2s initial load
- **API responses**: ~50-100ms for code lookups
- **Search**: ~100-200ms for global search

Your traditional medicine platform is ready for global healthcare deployment! 🏥🌍