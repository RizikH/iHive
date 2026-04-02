# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (`cd backend`)
```sh
npm run dev      # Start with nodemon (kills port 5000 first)
npm start        # Production start
```

### Frontend (`cd frontend`)
```sh
npm run dev      # Start Next.js with Turbopack (kills port 3000 first)
npm run build    # Production build
npm run lint     # ESLint
```

### Tests
```sh
cd backend && node tests/applicationPostReq.js   # Manual API test script
```

No automated test runner is configured — tests in `backend/tests/` are standalone Node scripts run directly.

## Architecture

iHive is a monorepo with a **Next.js frontend** and an **Express.js backend**, both in separate directories with their own `node_modules`.

### Backend (`backend/`)

- **Entry point:** `server.js` — sets up Express, CORS (allowlist), cookie-parser, Socket.IO, and mounts all route modules.
- **Database:** Supabase (PostgreSQL) via service key in `config/db.js`. The client is a singleton imported across models and controllers.
- **File storage:** AWS S3 via `config/s3.js`. File uploads use `express-fileupload`; files are keyed with UUID-prefixed names.
- **Auth:** JWT verification via `middleware/authMiddleware.js`. Tokens come from HTTP-only cookies. The JWT secret is Supabase's `SUPABASE_JWT_SECRET`. `req.user.sub` holds the authenticated user ID.
- **Permissions system:** Collaborators have one of three levels — `public` (0), `protected` (1), `private` (2). `utils/getLevel.js` fetches a user's level from the `collaborations` table; `utils/permissions.js` (`canAccess`) compares numeric levels. Idea owners bypass permission checks entirely.
- **WebSockets:** `services/socketService.js` exports a singleton `io`. Events: `message`, `joinRoom`, `directMessage`, `newPitch`, `interest`, `sendNotification`.
- **AI:** `services/chatgptService.js` uses the OpenAI API (for tag generation).
- **Request flow:** `routes/` → `controllers/` → `models/` (Supabase queries).

### Frontend (`frontend/`)

- **Framework:** Next.js 15 App Router with TypeScript and TailwindCSS.
- **Auth state:** Zustand store at `app/stores/useAuthStore.ts`. User is persisted to `sessionStorage` under `auth_user`. `initializeFromSession()` re-validates against the backend on load.
- **API calls:** Centralized through `app/utils/fetcher.ts` (wraps `NEXT_PUBLIC_API_BASE_URL`).
- **Supabase clients:** `lib/supabase/client.ts` (browser, for Client Components) and `lib/supabase/server.ts` (server, reads cookies for Server Components/Route Handlers). `middleware.ts` at the root refreshes the session on every request.
- **Layout:** `app/layout.tsx` wraps everything in `AppShell` (`components/app-shell.tsx`), which includes the navbar.
- **Key pages:** `app/ideas/`, `app/repository/`, `app/entrepreneur/`, `app/investor/`, `app/investments/`, `app/get-started/`.
- **Components:** `components/file-tree.tsx`, `components/file-editor.tsx`, `components/file-viewer.tsx` implement the repository file browser. `components/chat-widget.tsx` handles Socket.IO-based real-time chat.

## Environment Variables

**Backend `.env`:**
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_JWT_SECRET=
OPENAI_API_KEY=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
PORT=5000
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_KEY=
```

## Deployment

- **Frontend:** Vercel (`vercel-build` script runs `next build`)
- **Backend:** Render (auto-deploy from `main`/`dev-main`)
- Live: https://ihive.vercel.app/
