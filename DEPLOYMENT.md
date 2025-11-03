# Vercel Deployment Guide for Med-Ops

## Option 1: Deploy via Vercel CLI (Recommended)

### Step 1: Login to Vercel
1. Open a terminal in the project directory: `E:\New folder\med-ops`
2. Run: `vercel login`
3. This will open your browser - complete the authentication
4. Verify login: `vercel whoami`

### Step 2: Deploy to Production
Run the following command to deploy:
```bash
vercel --prod --yes
```

This will:
- Build your application
- Deploy it to Vercel
- Give you a production URL

## Option 2: Deploy via Vercel Dashboard (GitHub Integration)

### Step 1: Push to GitHub
1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub
3. Push the code:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
5. Click "Deploy"

## Configuration

The `vercel.json` file is already configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ SPA routing: All routes redirect to `index.html` for React Router

## Build Verification

To test the build locally before deploying:
```bash
npm run build
npm run preview
```

This will build and preview your production build at `http://localhost:4173`

## Environment Variables (if needed)

If your app needs environment variables:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add any required variables

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **404 errors on routes**: The `vercel.json` rewrite rules should handle this
- **Authentication issues**: Complete the browser authentication when prompted

## Post-Deployment

After successful deployment:
- ✅ Your app will be live at `https://your-project.vercel.app`
- ✅ Each git push to main branch will trigger automatic deployments
- ✅ You can configure custom domains in Vercel project settings

