# iHive — User Stories & Requirements

## User Roles

| Role | Description |
|------|-------------|
| **Guest** | Unauthenticated visitor. Can view the landing page only. |
| **Entrepreneur** | Authenticated user who creates and manages ideas + repositories. |
| **Investor** | Authenticated user who browses ideas and makes investment offers. |
| **Collaborator** | An entrepreneur invited to contribute to another user's idea. |

---

## Authentication

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| AUTH-01 | As a guest, I want to register with email, password, username, and role so I can access the platform. | Form validates all fields. Duplicate email shows error. On success, user is created in both `auth.users` and `public.users`. |
| AUTH-02 | As a registered user, I want to log in with email and password so I can access my account. | Invalid credentials show error. Valid login sets an HTTP-only cookie and redirects to the correct dashboard by role. |
| AUTH-03 | As a logged-in user, I want to log out so my session is ended. | Cookie is cleared. User is redirected to landing page. |
| AUTH-04 | As a logged-in user, I want to change my password from the settings page. | Current password is verified before update. Supabase Auth is updated via admin API. |
| AUTH-05 | As a logged-in user, I want my session to persist across page refreshes. | Zustand store is rehydrated from sessionStorage on load. Token is re-validated against the backend. |

---

## Entrepreneur — Ideas

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| IDEA-01 | As an entrepreneur, I want to create a new idea with a title and description so I can publish my project. | Form requires title + description. On submit, idea is saved. OpenAI auto-generates tags and a category. |
| IDEA-02 | As an entrepreneur, I want to see all my ideas in a grid so I can manage them. | Ideas page shows all ideas owned by the current user, ordered by most recent. |
| IDEA-03 | As an entrepreneur, I want to search my ideas by title so I can quickly find one. | Search filters the visible grid in real time. |
| IDEA-04 | As an entrepreneur, I want to filter ideas by category so I can view a specific type. | Category dropdown is populated from existing idea categories. |
| IDEA-05 | As an entrepreneur, I want to edit my idea's title, description, category, and status. | Changes persist on save. Status can be `open`, `funded`, or `closed`. |
| IDEA-06 | As an entrepreneur, I want to delete an idea I own. | Idea and all associated files, tags, and collaborations are deleted. |

---

## Entrepreneur — Repository

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| REPO-01 | As an entrepreneur, I want to view the file tree for my idea's repository. | File tree shows folders and files in a nested structure. Clicking an idea card navigates to `/repository?id=X`. |
| REPO-02 | As an entrepreneur, I want to create files and folders in my repository. | New file/folder appears in the tree immediately. |
| REPO-03 | As an entrepreneur, I want to edit a text file in the browser. | Clicking a text file opens an in-browser editor. Saving persists content to Supabase. |
| REPO-04 | As an entrepreneur, I want to upload binary files (images, PDFs) to S3. | File is uploaded to AWS S3. A record referencing the S3 key is stored in `public.files`. |
| REPO-05 | As an entrepreneur, I want to set a file's visibility to public, protected, or private. | Permission level is stored per file. Access control is enforced server-side on read. |
| REPO-06 | As an entrepreneur, I want to delete a file or folder from the repository. | File/folder and all children are removed from DB and S3. |

---

## Entrepreneur — Collaboration

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| COLLAB-01 | As an entrepreneur, I want to invite a collaborator by email and assign them a permission level. | Invited user must exist. Row is inserted into `collaborations`. |
| COLLAB-02 | As an entrepreneur, I want to view all collaborators on my idea. | Settings page lists collaborators with their email and permission level. |
| COLLAB-03 | As an entrepreneur, I want to update a collaborator's permission level. | `collaborations.permissions` is updated. Access is re-enforced immediately. |
| COLLAB-04 | As an entrepreneur, I want to remove a collaborator from my idea. | Row is deleted from `collaborations`. They can no longer access the idea. |
| COLLAB-05 | As a collaborator, I can access an idea's repository according to my permission level. | `public` = read-only public files. `protected` = read-only protected files. `private` = read/write all files. |

---

## Investor

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| INV-01 | As an investor, I want to browse all open ideas in a card grid. | All ideas with `status = 'open'` are shown. |
| INV-02 | As an investor, I want to search ideas by title in real time. | Search hits the backend title search endpoint on each keystroke (debounced). |
| INV-03 | As an investor, I want to filter ideas by tags so I can find relevant startups. | Tag filter popup allows multi-select. Results are filtered client-side. |
| INV-04 | As an investor, I want to open an idea's repository preview in a modal before investing. | Modal shows the file tree and idea details. |
| INV-05 | As an investor, I want to submit an investment offer with an amount. | Investment row is created with `status = 'pending'`. Entrepreneur is notified. |
| INV-06 | As an investor, I want to view all my past and pending investments on a dashboard. | `/investments` page shows all investments with idea name, amount, and status. |

---

## Investment Management (Entrepreneur Side)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| INVMGMT-01 | As an entrepreneur, I want to see all investment offers on my ideas. | Entrepreneur dashboard shows pending offers grouped by idea. |
| INVMGMT-02 | As an entrepreneur, I want to accept an investment offer. | `investments.status` → `accepted`. Investor is notified. |
| INVMGMT-03 | As an entrepreneur, I want to reject an investment offer. | `investments.status` → `rejected`. Investor is notified. |

---

## Messaging

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| MSG-01 | As any user, I want to start a direct message conversation with another user. | A chat room is created (or reused if one exists) and the conversation opens. |
| MSG-02 | As any user, I want to send and receive messages in real time. | Messages are delivered via Socket.IO without page refresh. |
| MSG-03 | As any user, I want to see my message history when I reopen a conversation. | Messages are loaded from `chat_messages` on room open. |
| MSG-04 | As any user, I want to see all my active conversations. | Contacts list shows all users I have a DM room with. |

---

## Notifications

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| NOTIF-01 | As an entrepreneur, I want to be notified when an investor expresses interest in my idea. | Notification is pushed via Socket.IO and stored. |
| NOTIF-02 | As a user, I want to see a notification badge on the navbar when I have unread notifications. | Badge count updates in real time. |

---

## Profile & Settings

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| PROF-01 | As any user, I want to view and edit my profile (username, bio, avatar). | Changes persist to `public.users`. |
| PROF-02 | As any user, I want to upload a profile picture. | Image is stored in S3. `users.avatar` stores the S3 URL. |
| PROF-03 | As any user, I want to delete my account. | Auth user and all owned data are removed. |

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Security | All protected API routes require a valid Supabase JWT cookie. |
| Security | Users can only modify their own profile/ideas unless explicitly granted access. |
| Security | File access is enforced server-side based on permission level and collaborator status. |
| Performance | Ideas feed loads in under 2 seconds. |
| Performance | File tree for a repository loads in under 1.5 seconds. |
| Reliability | API errors return structured JSON with appropriate HTTP status codes. |
| Usability | All forms validate client-side and display field-level error messages. |
| Usability | Unauthenticated users are redirected to `/get-started` automatically. |
