# Neo Circular Ledger — Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy via Vercel CLI
```bash
cd frontend
npx vercel
```

### Option 2: Deploy via Vercel Dashboard
1. Push the `frontend/` folder to a GitHub/GitLab repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Configure project settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`
   - **Install Command:** `yarn install`

### Environment Variables (Optional)
Since this is a **frontend-only app** with localStorage, no env vars are required. However, if you want to point to a backend later:

| Variable | Value | Required |
|---|---|---|
| `REACT_APP_BACKEND_URL` | `https://your-api-domain.com` | No |

## Project Structure
```
frontend/
├── vercel.json          # SPA rewrites + caching headers
├── package.json         # Dependencies & build scripts
├── craco.config.js      # Webpack alias (@/ → src/)
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── public/              # Static assets
└── src/                 # React source code
    ├── App.js           # Main app + routing
    ├── context/         # React Context (state management)
    ├── data/            # Seed data + constants
    ├── pages/           # Page components
    ├── components/      # Shared components
    └── utils/           # Utility functions
```

## What Vercel Handles
- **SPA Routing:** `vercel.json` rewrites all routes to `/index.html`
- **Static Asset Caching:** 1-year cache for `/static/*` files
- **Build:** Runs `craco build` which compiles React + Tailwind CSS
- **CDN:** Global edge network for fast delivery

## Notes
- No backend/database needed — all data stored in browser localStorage
- Build size: ~253 KB JS + ~11 KB CSS (gzipped)
- The `@/` import alias is handled by CRACO webpack config
