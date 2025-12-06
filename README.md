# ARID

Frontend for **ARID** – upload a floor plan and prompt, get back a 3D scene rendered with React Three Fiber.

This repo currently contains the **Next.js frontend** in the root (or in `frontend/` if you moved it). Below are the steps to install and run it locally.

## Prerequisites

- Node.js (LTS recommended)
- `pnpm` installed globally:

```bash
npm install -g pnpm
```

## Install dependencies

If the app is in the root (you see `app/`, `components/`, `package.json` in this folder):

```bash
cd arid
pnpm install
```

If the app is inside `frontend/`:

```bash
cd arid/frontend
pnpm install
```

## Run the development server

From the frontend folder (`.` or `frontend/` depending on layout):

```bash
pnpm dev
```

Next.js will print a URL, usually:

- `http://localhost:3000` (or another port like `3001`/`3002` if 3000 is in use)

Open that URL in your browser.

### If you see a lock error

If you get:

```text
Unable to acquire lock at .next/dev/lock, is another instance of next dev running?
```

Stop all `node` dev processes and clear the `.next` cache, then start again (PowerShell example):

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
cd D:\arid-frontend\frontend   # adjust if your path is different
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
pnpm dev
```

## Usage flow

1. Open the app in your browser.
2. Upload a floor plan image (PNG/JPG/WEBP).
3. Type a text prompt describing the desired room.
4. Click **Generate 3D Design**.
5. Frontend sends `file` + `prompt` to the backend endpoint `/api/generate`.
6. Backend responds with a `.glb` URL.
7. The viewer loads that `.glb` via `useGLTF` and displays the 3D room.

## Backend API

For the expected backend contract (`POST /generate` and the JSON shape with `glbUrl`), see `BACKEND_API_SPEC.md` in this repo.

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/dhafabiz-8336s-projects/v0-interior-design-app](https://vercel.com/dhafabiz-8336s-projects/v0-interior-design-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/hbwKiMpQEyk](https://v0.app/chat/hbwKiMpQEyk)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
