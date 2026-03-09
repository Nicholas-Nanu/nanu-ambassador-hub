# Nanu Ambassador Hub

Ambassador management platform for the Nanu Ambassador Programme.

## Deploy to Vercel

### Option A: GitHub (recommended)

1. **Create a GitHub repo:**
   - Go to github.com → New repository
   - Name it `nanu-ambassador-hub`
   - Set to Private

2. **Push this code:**
   ```bash
   cd nanu-ambassador-hub
   git init
   git add .
   git commit -m "Nanu Ambassador Hub v1"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nanu-ambassador-hub.git
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Go to vercel.com → "Add New Project"
   - Import your GitHub repo
   - Framework preset: **Vite** (should auto-detect)
   - Click **Deploy**
   - Done — Vercel gives you a URL like `nanu-ambassador-hub.vercel.app`

4. **Custom domain (optional):**
   - In Vercel project → Settings → Domains
   - Add e.g. `ambassadors.nanu-app.com`
   - Update DNS as Vercel instructs

### Option B: Vercel CLI (quick)

```bash
npm install -g vercel
cd nanu-ambassador-hub
npm install
vercel
```

Follow the prompts. First deploy gives you a preview URL, then `vercel --prod` for production.

## Local Development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Default Credentials

- **Admin:** username `admin` / PIN `nanu2026`
- **Master recovery code:** `NANU-MASTER-2026`
- **Ambassadors:** log in with their invite code

## Storage

Data is stored in the browser's localStorage. This means:
- Data persists per browser/device
- Each visitor has their own data
- For a shared team tool, you'd eventually want a backend database

## Tech Stack

- React 18 + Vite
- No external dependencies beyond React
- localStorage for persistence
- Deployed as a static site on Vercel
