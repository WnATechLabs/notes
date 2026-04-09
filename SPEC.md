# Technical Specification: Note-Taking Web Application

## 1. System Overview

A robust, fast, and minimalistic web application allowing authenticated users to create, manage, and publicly share rich-text notes. The application leverages a server-first architecture, minimizing client-side state management by relying on Next.js Server Components and native caching.

## 2. Technology Stack

- **Framework:** Next.js (using the **App Router** paradigm)
- **Runtime & Package Manager:** Bun
- **Language:** TypeScript
- **Database:** SQLite (via Bun's native `bun:sqlite` module)
- **Authentication:** `better-auth`
- **Rich Text Editor:** TipTap
- **Styling:** Pure TailwindCSS (no external UI libraries)
- **Deployment Environment:** DigitalOcean VPS (Linux)

---

## 3. Architecture Decisions

### App Router & Server Actions

Since we rely on server-side rendering and Next.js caching rather than client-side state libraries like Zustand, the **App Router** is the ideal choice.

- **Data Fetching:** Handled in Server Components. Next.js will cache these database reads.
- **Mutations:** Handled via **Server Actions**. When a user creates, updates, or deletes a note, a Server Action will execute the raw SQL, followed by `revalidatePath()` to purge the cache and immediately reflect the new state in the UI.

### Ephemeral State vs. Server State

- **Client State:** Strictly limited to the TipTap editor instance (managing the active document before saving) and minor UI toggles (e.g., mobile menu open/close).
- **Server State:** Auth status, note lists, and current note content are fetched directly from the SQLite database on request.

---

## 4. Database Schema

The database consists of the `better-auth` core tables and a custom `notes` table. SQLite stores JSON natively as `TEXT`, which can be queried using SQLite's built-in JSON functions if needed.

### Table: `user` (Managed by better-auth)

| Column          | Type    | Constraints        | Description                                |
| :-------------- | :------ | :----------------- | :----------------------------------------- |
| `id`            | TEXT    | PRIMARY KEY        | Unique identifier for each user            |
| `name`          | TEXT    | NOT NULL           | User's chosen display name                 |
| `email`         | TEXT    | UNIQUE, NOT NULL   | User's email address                       |
| `emailVerified` | INTEGER | NOT NULL           | Whether the user's email is verified (0/1) |
| `image`         | TEXT    |                    | User's image URL (optional)                |
| `createdAt`     | INTEGER | NOT NULL           | Timestamp of when the user was created     |
| `updatedAt`     | INTEGER | NOT NULL           | Timestamp of last update to user info      |

### Table: `session` (Managed by better-auth)

| Column      | Type    | Constraints              | Description                         |
| :---------- | :------ | :----------------------- | :---------------------------------- |
| `id`        | TEXT    | PRIMARY KEY              | Unique identifier for each session  |
| `userId`    | TEXT    | NOT NULL, FOREIGN KEY    | References `user(id)`               |
| `token`     | TEXT    | UNIQUE, NOT NULL         | Unique session token                |
| `expiresAt` | INTEGER | NOT NULL                 | Time when the session expires       |
| `ipAddress` | TEXT    |                          | IP address of the device (optional) |
| `userAgent` | TEXT    |                          | User agent of the device (optional) |
| `createdAt` | INTEGER | NOT NULL                 | Timestamp of when session was created |
| `updatedAt` | INTEGER | NOT NULL                 | Timestamp of when session was updated |

### Table: `account` (Managed by better-auth)

| Column                 | Type    | Constraints           | Description                                              |
| :--------------------- | :------ | :-------------------- | :------------------------------------------------------- |
| `id`                   | TEXT    | PRIMARY KEY           | Unique identifier for each account                       |
| `userId`               | TEXT    | NOT NULL, FOREIGN KEY | References `user(id)`                                    |
| `accountId`            | TEXT    | NOT NULL              | Provider's account ID (or equal to userId for credential) |
| `providerId`           | TEXT    | NOT NULL              | The ID of the auth provider                              |
| `accessToken`          | TEXT    |                       | Access token from the provider (optional)                |
| `refreshToken`         | TEXT    |                       | Refresh token from the provider (optional)               |
| `accessTokenExpiresAt` | INTEGER |                       | Access token expiration time (optional)                  |
| `refreshTokenExpiresAt`| INTEGER |                       | Refresh token expiration time (optional)                 |
| `scope`                | TEXT    |                       | OAuth scope from the provider (optional)                 |
| `idToken`              | TEXT    |                       | ID token from the provider (optional)                    |
| `password`             | TEXT    |                       | Hashed password for email/password auth (optional)       |
| `createdAt`            | INTEGER | NOT NULL              | Timestamp of when account was created                    |
| `updatedAt`            | INTEGER | NOT NULL              | Timestamp of when account was updated                    |

### Table: `verification` (Managed by better-auth)

| Column       | Type    | Constraints  | Description                                     |
| :----------- | :------ | :----------- | :---------------------------------------------- |
| `id`         | TEXT    | PRIMARY KEY  | Unique identifier for each verification         |
| `identifier` | TEXT    | NOT NULL     | The identifier for the verification request     |
| `value`      | TEXT    | NOT NULL     | The value to be verified                        |
| `expiresAt`  | INTEGER | NOT NULL     | Time when the verification expires              |
| `createdAt`  | INTEGER | NOT NULL     | Timestamp of when verification was created      |
| `updatedAt`  | INTEGER | NOT NULL     | Timestamp of when verification was updated      |

### Table: `notes`

| Column       | Type    | Constraints           | Description                                              |
| :----------- | :------ | :-------------------- | :------------------------------------------------------- |
| `id`         | TEXT    | PRIMARY KEY           | NanoID or UUID                                           |
| `userId`     | TEXT    | NOT NULL, FOREIGN KEY | References `user(id)`                                    |
| `content`    | TEXT    | NOT NULL              | TipTap document state stringified to JSON                |
| `isPublic`   | INTEGER | DEFAULT 0             | `1` for true, `0` for false (SQLite lacks boolean)       |
| `createdAt`  | INTEGER | DEFAULT CURRENT_TIMESTAMP | Unix timestamp                                       |
| `updatedAt`  | INTEGER | DEFAULT CURRENT_TIMESTAMP | Unix timestamp                                       |

---

## 5. Application Flow & Routing

### Public Routes

- **`/` (Landing Page):** Brief explanation of the app and a Login/Signup button.
- **`/auth/login` & `/auth/signup`:** Handled by `better-auth` views.
- **`/share/[noteId]`:** Publicly accessible route. The server component fetches the note. If `isPublic === 0` and the current user is not the owner, it returns a 404.

### Protected Routes (Require Authentication)

- **`/dashboard`:** Lists all notes belonging to the authenticated user. Includes a "Create New Note" button.
- **`/notes/[noteId]`:** The editor view. Contains the TipTap client component initialized with the server-fetched `content`.

---

## 6. TipTap Configuration

The TipTap editor will be packaged as a Client Component (`"use client"`) embedded within Server Components.

**Required TipTap Extensions:**

- `@tiptap/starter-kit` (Bundles paragraph, bold, italic, lists, and history)
- `@tiptap/extension-heading` (Configured for levels 1, 2, and 3 only)
- `@tiptap/extension-code` (Inline code)
- `@tiptap/extension-code-block` (Code snippets)
- `@tiptap/extension-horizontal-rule`

**Autosave Implementation:**

A debounced function in the client component will trigger a Server Action (`updateNoteContent(noteId, content)`) every few seconds after the user stops typing, ensuring data is not lost.

---

## 7. Deployment Strategy (DigitalOcean VPS)

Because SQLite writes to a local file, the application must be deployed in a persistent environment.

**Recommended Setup:**

1. **Node/Bun Environment:** Install Bun globally on the VPS.
2. **Process Manager:** Use `pm2` (or a `systemd` service) to keep the Next.js process running continuously.
3. **Reverse Proxy:** Use Nginx or Caddy to listen on port 80/443, handle SSL certificates (via Let's Encrypt), and route traffic to the Next.js/Bun server running on a local port (e.g., 3000).
4. **Database Storage:** Keep the `database.sqlite` file in a dedicated, backed-up directory on the VPS (e.g., outside of the immediate Git repository folder to prevent accidental overwrites during deployment pulls).
