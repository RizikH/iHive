# iHive — Project Proposal & Scope

## Overview

iHive is a web platform that connects entrepreneurs with investors and collaborators. It acts as a "GitHub for innovation" — entrepreneurs publish and manage startup ideas with file repositories, collaborators contribute under permission-controlled access, and investors browse, filter, and fund projects they believe in.

The current codebase is a rewrite of a capstone project being elevated to portfolio quality. The goal is a production-ready, well-architected full-stack application.

---

## Problem Statement

Early-stage entrepreneurs lack a single platform to:
- Document and present their startup idea professionally
- Manage project files and collaborate with teammates
- Get discovered by investors without cold outreach
- Track investor interest and funding status in one place

Existing tools (Notion for docs, GitHub for code, LinkedIn for networking, AngelList for fundraising) are siloed. iHive combines them into one purpose-built product.

---

## Goals

| Priority | Goal |
|----------|------|
| P0 | Entrepreneurs can create, manage, and share project ideas |
| P0 | Investors can browse, filter, and invest in ideas |
| P0 | Auth is secure and role-aware (entrepreneur vs investor) |
| P1 | File repository with editor for project documentation |
| P1 | Collaborator access with 3-tier permission system |
| P1 | Real-time direct messaging between users |
| P2 | AI-generated tags and categories on idea creation |
| P2 | Notifications for investor interest and collab invites |
| P2 | Investment tracking dashboard for both sides |

---

## Scope

### In Scope

- **Authentication** — Register, login, logout via Supabase Auth. Role selection at signup (entrepreneur / investor).
- **Idea Feed** — Entrepreneurs see and manage their own ideas. Investors browse all public ideas.
- **Repository** — Per-idea file system with folder tree, text editor, and file viewer. Files have public/protected/private access levels.
- **Collaboration** — Idea owners invite collaborators by email. Three permission tiers: `public`, `protected`, `private`.
- **Investments** — Investors submit investment amounts. Entrepreneurs can accept or reject. Both sides have a dashboard.
- **Chat** — Real-time 1:1 DMs using Socket.IO. Message history persisted in Supabase.
- **Search & Filtering** — Full-text search by title. Tag-based filtering. Category filtering. Investor price-range filter.
- **AI Tagging** — On idea creation, OpenAI generates relevant tags and a category automatically.
- **User Profiles** — Avatar, bio, user type. Entrepreneurs see their ideas; investors see their portfolio.
- **Account Settings** — Update profile info, change password.
- **Notifications** — In-app alerts for investment offers, collab invites, and messages.

### Out of Scope (Current Phase)

- Mobile app
- Payment processing (investments are tracked, not transacted)
- Video pitching
- OAuth (Google, GitHub login)
- Public API

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, TailwindCSS, Zustand |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (ECC P-256 JWT) |
| File Storage | AWS S3 |
| AI | OpenAI API (GPT for tag/category generation) |
| Real-time | Socket.IO |
| Frontend Host | Vercel |
| Backend Host | Render |

---

## Constraints & Assumptions

- Single-tenant SaaS (no multi-org support)
- Users self-identify as entrepreneur or investor at signup — no verification
- Investments are intent-based (no real money movement)
- Backend uses service-role Supabase key — RLS is a secondary defense layer
- Free tier limits apply (Supabase, Render, Vercel, OpenAI, Stream)

---

## Success Metrics

- A user can register, create an idea, upload files, invite a collaborator, and receive an investment offer — end to end — without errors
- Page load times under 2 seconds on initial load
- All API endpoints return appropriate HTTP status codes and error messages
- Zero auth bypass vulnerabilities (verified via manual testing)
