# iHive API Routes

Base URL: `https://ihive-backend.onrender.com` (prod) / `http://localhost:5000` (local)

All routes are prefixed with `/api`. Protected routes require a valid JWT in the `token` HTTP-only cookie.  
Rate limiting is applied globally to all routes.

---

## Users — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Register a new user. Creates a Supabase Auth account and a row in `public.users`. Body: `{ username, email, password, userType, bio?, avatar? }` |
| POST | `/login` | No | Authenticate with email + password. Sets the `token` HTTP-only cookie and returns the user profile. Body: `{ email, password }` |
| POST | `/logout` | No | Clears the `token` cookie. |
| GET | `/me` | Yes | Returns `{ id, email }` for the currently authenticated user (from token). |
| GET | `/all` | Yes | Returns all users. |
| POST | `/all` | Yes | Search users by name/email query string, with optional exclusion. Body: `{ query, excludeId? }` |
| GET | `/get/:id` | Yes | Returns a single user profile by ID. |
| PUT | `/update` | Yes | Update the authenticated user's profile fields (username, bio, avatar, etc). Query param: `?id=<userId>`. Only the owner can update their own profile. |
| PUT | `/update/login` | Yes | Change the authenticated user's password. Re-authenticates with current password before applying the change. Body: `{ id, email, currentPassword, newPassword }` |
| DELETE | `/delete/:id` | Yes | Delete the authenticated user's account. Only the owner can delete their own account. |

---

## Ideas — `/api/ideas`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Returns all ideas (public listing). |
| GET | `/public?id=<ideaId>` | No | Returns a single idea by ID with no access check — used for public idea preview pages. |
| GET | `/user/:id` | Yes | Returns all ideas belonging to a specific user. |
| GET | `/search/title/:title` | Yes | Full-text search on idea titles. |
| GET | `/search/id/:id` | Yes | Returns a single idea by ID. Only accessible to the idea owner or a collaborator. |
| POST | `/search/tags` | Yes | Returns ideas matching any of the provided tag IDs. Body: `{ tags: [{ id }] }` |
| POST | `/` | Yes | Create a new idea. AI generates tags and category asynchronously after creation. Body: `{ title, description }` |
| PUT | `/:id` | Yes | Update an idea's title, description, category, or status. Body: `{ title?, description?, category?, status? }` |
| DELETE | `/:id` | Yes | Delete an idea. |

---

## Tags — `/api/tags`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/all` | No | Returns all tags. |
| GET | `/search?name=<query>` | No | Search tags by name. |
| DELETE | `/:id` | Yes | Delete a tag by ID. |

---

## Files — `/api/files`

Files belong to an idea. Access to individual files is governed by the file's `permission_level` (`public`, `protected`, `private`) and the requesting user's collaborator level on the parent idea.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/public?idea_id=<id>` | No | Returns all files for an idea. Public files include full data; non-public files return metadata only with `is_locked: true`. |
| GET | `/?idea_id=<id>` | Yes | Returns all files for an idea. Files the user cannot access are returned as locked stubs (`is_locked: true`). Access is resolved by ownership or collaborator level. |
| GET | `/:id` | Yes | Returns a single file. Enforces permission check. For uploaded files, returns a 5-minute presigned S3 URL in the `path` field. |
| GET | `/:id/stream` | Yes | Streams an uploaded file directly from S3 to the client (inline, with correct Content-Type). |
| POST | `/` | Yes | Create a text/folder file entry in the DB. Only idea owner or any collaborator can create. Body: `{ name, type, idea_id, parent_id?, content? }` |
| POST | `/upload` | Yes | Upload a binary file to S3 and create the DB record. Only owner or collaborator can upload. Body (multipart): `file`, `idea_id`, `parent_id?` |
| POST | `/move/:id` | Yes | Move a file to a different parent folder. Only the file's creator can move it. Body: `{ parent_id }` |
| PUT | `/:id` | Yes | Update file metadata or content. Only the file's creator can update it. |
| DELETE | `/:id` | Yes | Delete a file. Removes from S3 if it's an upload (S3 failure is non-fatal). |

---

## Collaborators — `/api/collabs`

All collab routes require authentication.

Collaborators have a numeric permission level: `0` = public, `1` = protected, `2` = private.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/:ideaId` | Yes | Returns all collaborators for an idea. |
| POST | `/` | Yes | Add a collaborator to an idea by email. Looks up the user by email, then creates the collaboration record. Body: `{ ideaId, email, permissions }` |
| PUT | `/:ideaId/:userId` | Yes | Update a collaborator's permission level. Body: `{ permissions }` |
| DELETE | `/:ideaId/:userId` | Yes | Remove a collaborator from an idea. |

---

## Investments — `/api/investments`

All investment routes require authentication.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/user/:userId` | Yes | Returns all investments made by an investor (by their user ID). |
| GET | `/entrepreneur/:userId` | Yes | Returns all investments received by an entrepreneur's ideas (by the entrepreneur's user ID). |
| GET | `/:ideaId` | Yes | Returns all investments for a specific idea. |
| POST | `/` | Yes | Submit an investment offer. `user_id` is taken from the authenticated session — not the request body. Body: `{ idea_id, amount }` |
| PUT | `/:investmentId` | Yes | Update the status of an investment (e.g. `pending` → `accepted` / `rejected`). Body: `{ status }` |

---

## Chat — `/api/chat`

All chat routes require authentication. Real-time delivery is handled separately via Socket.IO.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/contacts` | Yes | Returns all DM contacts for the authenticated user — people they share a chat room with, with the latest message per room. |
| GET | `/:roomId/messages` | Yes | Returns the full message history for a chat room. |
| GET | `/:roomId/receiver` | Yes | Returns the profile of the other participant in a DM room (i.e. not the current user). |
| POST | `/send` | Yes | Persist a message to the database. `senderId` is taken from the session. Body: `{ roomId, content }` |
| POST | `/dm-room` | Yes | Get or create a DM room between the authenticated user and another user. Body: `{ user2: <userId> }` |

---

## WebSocket Events (Socket.IO)

Connected via the same server on `/`. All events are scoped to rooms.

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinRoom` | Client → Server | Join a chat room by `roomId`. |
| `message` | Client → Server | Send a message to a room. |
| `directMessage` | Server → Client | Receive a direct message. |
| `newPitch` | Server → Client | Notify room members of a new pitch submission. |
| `interest` | Server → Client | Notify an entrepreneur of investor interest. |
| `sendNotification` | Server → Client | General-purpose notification push. |
