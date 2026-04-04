# iHive — High-Level Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
│                                                                     │
│   Next.js 15 App (Vercel)                                           │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  App Router  │  Zustand Store  │  Supabase SSR Client       │   │
│   │  TailwindCSS │  fetcher.ts     │  Socket.IO Client          │   │
│   └──────────────────────┬──────────────────────────────────────┘   │
└─────────────────────────┬┼───────────────────────────────────────── ┘
                          ││
              REST (HTTPS)││          WebSocket (WSS)
                          ││
┌─────────────────────────┼┼──────────────────────────────────────────┐
│                         ││  EXPRESS BACKEND (Render)                │
│   ┌─────────────────────▼▼──────────────────────────────────────┐   │
│   │                   server.js                                  │   │
│   │   CORS · cookie-parser · express-fileupload · rate-limit     │   │
│   └───────┬──────────────────────────────────────┬──────────────┘   │
│           │ Routes                               │ Socket.IO        │
│   ┌───────▼──────────────────────┐   ┌──────────▼──────────────┐   │
│   │  /users  /ideas  /files      │   │   socketService.js       │   │
│   │  /collabs  /investments      │   │   Events:                │   │
│   │  /tags  /chat                │   │   - message              │   │
│   └───────┬──────────────────────┘   │   - joinRoom             │   │
│           │                          │   - directMessage        │   │
│   ┌───────▼──────────────────────┐   │   - newPitch             │   │
│   │  authMiddleware.js           │   │   - sendNotification     │   │
│   │  supabase.auth.getUser(jwt)  │   └─────────────────────────┘   │
│   └───────┬──────────────────────┘                                  │
│           │                                                          │
│   ┌───────▼──────────────────────┐                                  │
│   │  Controllers → Models        │                                   │
│   │  (business logic + queries)  │                                   │
│   └───────┬──────────────────────┘                                  │
│           │                                                          │
│   ┌───────▼──────────┐  ┌──────────────┐  ┌────────────────────┐   │
│   │  Supabase Client │  │  AWS S3       │  │  OpenAI API        │   │
│   │  (service key)   │  │  (S3 client) │  │  (tag generation)  │   │
│   └───────┬──────────┘  └──────┬───────┘  └────────────────────┘   │
└───────────┼────────────────────┼─────────────────────────────────── ┘
            │                    │
┌───────────▼────────────────────▼─────────────────────────────────── ┐
│                        EXTERNAL SERVICES                             │
│                                                                      │
│   ┌────────────────────────────┐    ┌───────────────────────────┐   │
│   │   Supabase (PostgreSQL)    │    │   AWS S3                  │   │
│   │                            │    │                           │   │
│   │   auth.users               │    │   Bucket: ihive-uploads   │   │
│   │   public.users             │    │   - Profile pictures      │   │
│   │   public.ideas             │    │   - Binary file uploads   │   │
│   │   public.tags              │    │                           │   │
│   │   public.idea_tags         │    └───────────────────────────┘   │
│   │   public.collaborations    │                                     │
│   │   public.investments       │    ┌───────────────────────────┐   │
│   │   public.files             │    │   OpenAI API              │   │
│   │   public.chat_rooms        │    │   - gpt: tag generation   │   │
│   │   public.chat_participants │    │   - gpt: categorization   │   │
│   │   public.chat_messages     │    └───────────────────────────┘   │
│   └────────────────────────────┘                                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

```
frontend/
├── app/
│   ├── layout.tsx              ← Root layout, wraps AppShell (navbar)
│   ├── page.tsx                ← Landing page (public)
│   ├── get-started/page.tsx    ← Login / Register (public)
│   ├── ideas/page.tsx          ← Entrepreneur idea feed (protected)
│   ├── entrepreneur/page.tsx   ← Entrepreneur profile (protected)
│   ├── repository/
│   │   ├── page.tsx            ← Repository shell (Server Component)
│   │   ├── RepositoryClient.tsx← File tree + editor (Client Component)
│   │   └── settings/           ← Collaborator management
│   ├── investor/               ← Investor browse + invest (protected)
│   ├── investments/page.tsx    ← Investment dashboard (protected)
│   ├── setting/page.tsx        ← Account settings (protected)
│   ├── stores/
│   │   └── useAuthStore.ts     ← Zustand: currentUser, isAuthenticated
│   └── utils/
│       ├── fetcher.ts          ← Centralized API client (wraps fetch)
│       └── isAuthenticated.ts  ← Auth check helper
│
├── components/
│   ├── app-shell.tsx           ← Navbar + session init on every page
│   ├── auth-form.tsx           ← Login/register form
│   ├── nav-bar.tsx             ← Shared navigation
│   ├── file-tree.tsx           ← Recursive file tree component
│   ├── file-editor.tsx         ← In-browser text editor
│   ├── file-viewer.tsx         ← Read-only file viewer
│   ├── chat-widget.tsx         ← Socket.IO real-time chat UI
│   ├── notification.tsx        ← Notification bell + list
│   └── repository-modal.tsx    ← Investor's idea preview modal
│
├── lib/supabase/
│   ├── client.ts               ← Browser Supabase client (SSR-aware)
│   └── server.ts               ← Server Supabase client (reads cookies)
│
└── middleware.ts               ← Refreshes Supabase session on every req
```

### State Management

```
┌──────────────────────────────────────────────────────┐
│                  useAuthStore (Zustand)               │
│                                                       │
│  currentUser: { id, email, username, user_type, ... } │
│  isAuthenticated: boolean                             │
│                                                       │
│  initializeFromSession() — called in AppShell         │
│    1. Read from sessionStorage                        │
│    2. Re-validate against /users/me                   │
│    3. Set store state                                 │
└──────────────────────────────────────────────────────┘
```

---

## Backend Architecture

```
backend/
├── server.js            ← Express app + Socket.IO setup + route mounting
├── config/
│   ├── db.js            ← Supabase singleton (service key)
│   └── s3.js            ← AWS S3 client
├── middleware/
│   └── authMiddleware.js← JWT verification via supabase.auth.getUser()
├── routes/              ← Route definitions (auth guard applied here)
├── controllers/         ← Request handling, input validation, responses
├── models/              ← Supabase query functions (data access layer)
├── services/
│   ├── socketService.js ← Socket.IO singleton (io)
│   └── chatgptService.js← OpenAI tag + category generation
├── utils/
│   ├── getLevel.js      ← Fetch collaborator permission level
│   └── permissions.js   ← canAccess(required, userLevel) comparator
└── policies/
    └── fileAccessPolicy.js ← File-level access control logic
```

### Request Lifecycle

```
HTTP Request
    │
    ▼
server.js (CORS, cookies, rate-limit)
    │
    ▼
routes/*.js  ──── public route? ──► controller directly
    │
    │ protected route
    ▼
authMiddleware.js
  supabase.auth.getUser(cookie token)
  → sets req.user = { sub: uuid, ... }
    │
    ▼
controller (validate inputs, call model)
    │
    ▼
model (Supabase query)
    │
    ▼
JSON Response
```

### Permission System

```
Permission Levels:
  public    = 0   (anyone can read)
  protected = 1   (collaborators can read)
  private   = 2   (only owner and private collaborators)

Collaborations table: { idea_id, user_id, permissions }

Check flow:
  1. Is requester the idea owner?  → full access
  2. getLevel(userId, ideaId)      → fetch from collaborations
  3. canAccess(fileLevel, userLevel) → numeric comparison
```

---

## Database Schema (ERD)

```
auth.users (Supabase managed)
    │ 1
    │ ▼
public.users ──────────────────────────────────────────────────────┐
    │ id, username, email, bio, user_type, avatar, created_at      │
    │                                                               │
    │ 1                   1                  1                     │
    ▼ *                   ▼ *                ▼ *                   │
public.ideas         public.investments  public.chat_participants  │
    │ id, user_id,       id, idea_id,        room_id, user_id      │
    │ title, desc,       user_id, amount,         │                │
    │ category, status   status, invested_at      │                │
    │                                             ▼ *              │
    │ 1                                   public.chat_rooms        │
    ▼ *                                       id, created_at       │
public.idea_tags                               │ 1                 │
    │ idea_id, tag_id                          ▼ *                 │
    │                                  public.chat_messages        │
    ▼ *                                    id, room_id,            │
public.tags                                sender_id, content      │
    id, name                                                       │
                                                                   │
    │ 1                                                            │
    ▼ *                                                            │
public.collaborations                                              │
    idea_id, user_id, permissions ─────────────────────────────────┘
    │
    │ 1
    ▼ *
public.files
    id, idea_id, parent_id (self-ref),
    name, type, path, content, mime_type,
    is_public, permission_level
```

---

## Deployment

```
┌─────────────────────┐         ┌─────────────────────┐
│       Vercel        │         │       Render        │
│                     │         │                     │
│  Next.js Frontend   │◄───────►│  Express Backend    │
│  ihive.vercel.app   │  HTTPS  │  Port 5000          │
│                     │         │                     │
│  Branch: dev-main   │         │  Branch: dev-main   │
│  Auto-deploy ✓      │         │  Auto-deploy ✓      │
└─────────────────────┘         └─────────────────────┘
           │                               │
           └───────────────┬───────────────┘
                           │
              ┌────────────▼────────────┐
              │        Supabase         │
              │  wdqkntzoqijvywhnozto   │
              │  PostgreSQL + Auth      │
              └─────────────────────────┘
```
