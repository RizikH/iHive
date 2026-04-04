# iHive — Wireframes & UI Design

> ASCII wireframes representing the layout and key interactions for each page.
> These are layout blueprints — not pixel-perfect designs.

---

## Design Tokens (Planned)

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#F5A623` (amber/gold) | CTAs, brand accents, hover states |
| Surface | `#1A1A2E` (dark navy) | Page backgrounds |
| Card | `#16213E` | Card backgrounds |
| Border | `#2A2A4A` | Card borders, dividers |
| Text Primary | `#FFFFFF` | Headings, body |
| Text Muted | `#8888AA` | Labels, metadata |
| Success | `#22C55E` | Accepted status |
| Warning | `#F59E0B` | Pending status |
| Danger | `#EF4444` | Rejected, delete |

Typography: Inter (sans-serif), monospace for code/file content.

---

## 1. Landing Page (`/`)

```
┌──────────────────────────────────────────────────────────────────┐
│  [🐝 iHive]                              [Login / Register]       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│         Hi, welcome to  iHive 🐝                                 │
│                                                                  │
│    iHive is your collaborative launchpad for turning bold        │
│    ideas into reality. Think of it as GitHub for innovation —    │
│    a platform where entrepreneurs showcase projects,             │
│    collaborate with others, and connect with investors.          │
│                                                                  │
│    Are you ready to make your goals come true?                   │
│                                                                  │
│              ┌─────────────────────────┐                         │
│              │    Login / Register     │  ← primary CTA          │
│              └─────────────────────────┘                         │
│                                                                  │
│                                                                  │
│  [animated particles background]                                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  © 2025 iHive  |  Terms  |  Privacy                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Auth Page (`/get-started`)

```
┌──────────────────────────────────────────────────────────────────┐
│  [🐝 iHive]                                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│    ┌────────────────────────────────────────────────────────┐    │
│    │                                                        │    │
│    │   [ Login ]  [ Register ]   ← tab toggle              │    │
│    │   ─────────────────────────────────────────           │    │
│    │                                                        │    │
│    │   LOGIN VIEW:                                          │    │
│    │   Email      [________________________]                │    │
│    │   Password   [________________________]  [👁]          │    │
│    │                                                        │    │
│    │              [ Sign In → ]                             │    │
│    │                                                        │    │
│    │   ─────────────────────────────────────────           │    │
│    │                                                        │    │
│    │   REGISTER VIEW (additional fields):                   │    │
│    │   Username   [________________________]                │    │
│    │   Email      [________________________]                │    │
│    │   Password   [________________________]                │    │
│    │   I am a:    ( ) Entrepreneur  ( ) Investor            │    │
│    │                                                        │    │
│    │              [ Create Account → ]                      │    │
│    │                                                        │    │
│    │   [error message if any]                               │    │
│    │                                                        │    │
│    └────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Entrepreneur — Ideas Feed (`/ideas`)

```
┌──────────────────────────────────────────────────────────────────┐
│  [🐝 iHive-Entrepreneur]   Profile  Settings  Sponsors  Sign Out  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [🔍 Search ideas...]   [Category ▼]   [+ New Idea]            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│   │ My Startup Idea │  │ EcoTrack App    │  │ AI Writing Tool │ │
│   │ [Technology]    │  │ [Sustainability]│  │ [AI/ML]         │ │
│   │                 │  │                 │  │                 │ │
│   │ Build a SaaS    │  │ Track carbon    │  │ Generate high   │ │
│   │ platform for... │  │ footprint for...│  │ quality copy... │ │
│   │                 │  │                 │  │                 │ │
│   │ Jan 15, 2025    │  │ Jan 10, 2025    │  │ Dec 28, 2024    │ │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│   ┌─────────────────┐  ┌──────────────────────────────────────┐  │
│   │ + Create your   │  │ NEW IDEA FORM (inline when open):    │  │
│   │   first idea    │  │ Title    [_______________________]   │  │
│   └─────────────────┘  │ Desc     [_______________________]   │  │
│                         │          [_______________________]   │  │
│                         │   [Submit]  [Cancel]                 │  │
│                         └──────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Repository Page (`/repository?id=X`)

```
┌──────────────────────────────────────────────────────────────────┐
│  [🐝 iHive]   Profile  Repo Settings  Settings  Offers  Sign Out  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐  ┌────────────────────────────────┐ │
│  │  MY STARTUP IDEA        │  │                                │ │
│  │                         │  │   Welcome to iHive Editor!     │ │
│  │  📁 docs/               │  │                                │ │
│  │    📄 README.md   [···] │  │   Select or create a file      │ │
│  │    📄 pitch.md    [···] │  │   to begin editing.            │ │
│  │  📁 research/           │  │                                │ │
│  │    📄 market.md   [···] │  │                                │ │
│  │    🖼 diagram.png [···] │  │   ← FILE EDITOR when selected: │ │
│  │  📄 notes.txt     [···] │  │   ┌────────────────────────┐  │ │
│  │                         │  │   │ # README               │  │ │
│  │  [+ New File]           │  │   │                        │  │ │
│  │  [+ New Folder]         │  │   │ This is my project...  │  │ │
│  │                         │  │   │                        │  │ │
│  │                         │  │   └────────────────────────┘  │ │
│  │                         │  │   [Save]  [visibility: 🔒]    │ │
│  └─────────────────────────┘  └────────────────────────────────┘ │
│   SIDEBAR (20%)                  EDITOR PANE (80%)                │
├──────────────────────────────────────────────────────────────────┤
│  © 2025 iHive  |  Terms  |  Privacy                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Repository Settings (`/repository/settings?id=X`)

```
┌──────────────────────────────────────────────────────────────────┐
│  [🐝 iHive]                                          [← Back]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Repository Settings — My Startup Idea                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  COLLABORATORS                                             │  │
│  │                                                            │  │
│  │  Email: [_______________________________]                  │  │
│  │  Level: [ Public ▼ ]    [+ Add Collaborator]               │  │
│  │                                                            │  │
│  │  ────────────────────────────────────────────────          │  │
│  │                                                            │  │
│  │  jane@example.com          [Protected ▼]  [Remove]         │  │
│  │  bob@example.com           [Private   ▼]  [Remove]         │  │
│  │  alice@example.com         [Public    ▼]  [Remove]         │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  IDEA DETAILS                                              │  │
│  │                                                            │  │
│  │  Title:    [________________________________]               │  │
│  │  Status:   [ Open ▼ ]                                       │  │
│  │                                                            │  │
│  │  [Save Changes]                    [Delete Idea 🗑]         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Investor — Browse Page (`/investor`)

```
┌──────────────────────────────────────────────────────────────────┐
│  [🐝 iHive-Investors]   Investments   [🔍 Search ideas...]  [Filter]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│   │ My Startup Idea │  │ EcoTrack App    │  │ AI Writing Tool │ │
│   │ [Technology]    │  │ [Sustainability]│  │ [AI/ML]         │ │
│   │                 │  │                 │  │                 │ │
│   │ Build a SaaS    │  │ Track carbon    │  │ Generate high   │ │
│   │ platform that   │  │ footprint for   │  │ quality copy    │ │
│   │ helps teams...  │  │ enterprises...  │  │ using AI...     │ │
│   │                 │  │                 │  │                 │ │
│   │ Tags: saas,api  │  │ Tags: green,b2b │  │ Tags: ai,nlp    │ │
│   │                 │  │                 │  │                 │ │
│   │ [Learn More →]  │  │ [Learn More →]  │  │ [Learn More →]  │ │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │  FILTER POPUP (when Filter clicked):                    │    │
│   │                                                         │    │
│   │  Tags: [Search tags...   ] [Active: saas ×] [nlp ×]    │    │
│   │         ↓ dropdown list of matching tags                │    │
│   │                                                         │    │
│   │  Price Range:  $[───────●──────────────]  $0 – $5,000   │    │
│   │                                                         │    │
│   │  [Apply Filters]                    [Clear All]         │    │
│   └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Repository Modal (Investor View)

```
┌──────────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════════════╗ │
│  ║  Repository Preview — My Startup Idea              [✕ Close]║ │
│  ╠══════════════════════════════════════════════════════════════╣ │
│  ║                                                              ║ │
│  ║  ┌───────────────────┐  ┌───────────────────────────────┐   ║ │
│  ║  │ 📁 docs/          │  │  # README                     │   ║ │
│  ║  │   📄 README.md    │  │                               │   ║ │
│  ║  │   📄 pitch.md     │  │  This project aims to solve   │   ║ │
│  ║  │ 📁 research/      │  │  the problem of...            │   ║ │
│  ║  │   📄 market.md    │  │                               │   ║ │
│  ║  └───────────────────┘  └───────────────────────────────┘   ║ │
│  ║                                                              ║ │
│  ║  ──────────────────────────────────────────────────────     ║ │
│  ║                                                              ║ │
│  ║  Investment Amount: $[________________]                      ║ │
│  ║                                                              ║ │
│  ║                        [💰 Invest Now]                       ║ │
│  ║                                                              ║ │
│  ╚══════════════════════════════════════════════════════════════╝ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Investments Dashboard (`/investments`)

```
┌──────────────────────────────────────────────────────────────────┐
│  [🐝 iHive]                                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  My Investments                                                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Idea                   Amount    Status      Date         │  │
│  │  ──────────────────────────────────────────────────────    │  │
│  │  My Startup Idea        $5,000   ● Pending   Jan 15       │  │
│  │  EcoTrack App           $2,500   ● Accepted  Jan 12       │  │
│  │  AI Writing Tool        $1,000   ● Rejected  Jan 08       │  │
│  │  HealthSync             $3,000   ● Pending   Jan 05       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ENTREPRENEUR VIEW (same page, different data):                  │
│                                                                  │
│  Offers on My Ideas                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Investor               Idea             Amount   Action   │  │
│  │  ──────────────────────────────────────────────────────    │  │
│  │  john@example.com       My Startup Idea  $5,000  [✓][✗]   │  │
│  │  sara@example.com       My Startup Idea  $2,000  [✓][✗]   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. Account Settings (`/setting`)

```
┌──────────────────────────────────────────────────────────────────┐
│  [🐝 iHive]                                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌─────────────────────────────────────┐  │
│  │                  │  │  PROFILE                            │  │
│  │   [  avatar  ]   │  │  Username  [______________________] │  │
│  │   [Change pic]   │  │  Bio       [______________________] │  │
│  │                  │  │            [______________________] │  │
│  │  John Doe        │  │                                     │  │
│  │  Entrepreneur    │  │  [Save Profile]                     │  │
│  │                  │  │                                     │  │
│  └──────────────────┘  │  ─────────────────────────────────  │  │
│                         │  CHANGE PASSWORD                   │  │
│                         │  Current  [______________________] │  │
│                         │  New      [______________________] │  │
│                         │  Confirm  [______________________] │  │
│                         │                                    │  │
│                         │  [Update Password]                 │  │
│                         │                                    │  │
│                         │  ─────────────────────────────────  │  │
│                         │  DANGER ZONE                       │  │
│                         │  [Delete Account 🗑]                │  │
│                         └─────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Chat Widget (Overlay — all pages)

```
                            ┌─────────────────────────────────┐
                            │  💬 Messages                [✕] │
                            ├─────────────────────────────────┤
                            │  CONTACTS                       │
                            │  ┌─────────────────────────┐   │
                            │  │ 🟢 Jane Smith           │   │
                            │  │ 🔘 Bob Johnson          │   │
                            │  │ 🔘 Alice Wang           │   │
                            │  └─────────────────────────┘   │
                            ├─────────────────────────────────┤
                            │  [Search users to message...]   │
                            ├─────────────────────────────────┤
                            │  CONVERSATION — Jane Smith      │
                            │                                 │
                            │       Hi! Interested in your    │
                            │       startup idea.        [→]  │
                            │                                 │
                            │  [←] Thanks! Happy to chat.     │
                            │                                 │
                            │       What's your timeline?[→]  │
                            │                                 │
                            │  ─────────────────────────────  │
                            │  [Type a message...      ] [▶]  │
                            └─────────────────────────────────┘
                                                    [💬] ← FAB
```

---

## Navigation Structure

```
Guest:
  / → /get-started

Entrepreneur (logged in):
  /ideas                     ← home dashboard
  /repository?id=X           ← per-idea editor
  /repository/settings?id=X  ← collaborators + idea config
  /entrepreneur              ← public profile
  /setting                   ← account settings
  /investments               ← view offers + accept/reject
  /sponsors                  ← sponsor offers

Investor (logged in):
  /investor                  ← browse + invest
  /investments               ← portfolio dashboard
  /setting                   ← account settings

Shared:
  /terms  /privacy           ← static pages
```
