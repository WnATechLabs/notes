# CLAUDE.md

We're building the app described in the spec (SPEC.md). Read the file for general architectural tasks or to doble-check the exact database structure tech stack or application architecture.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippts.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.
Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint (flat config with core-web-vitals + typescript rules)

## Tech Stack

- **Framework:** Next.js 16 with App Router (React 19)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`
- **Rich Text:** Tiptap v3 (installed but not yet integrated)
- **Auth:** better-auth (installed but not yet integrated)
- **Validation:** Zod v4
- **Database:** SQLite at `data/app.db` (per `.env.example`)
- **Fonts:** Geist Sans + Geist Mono via `next/font`

## Project Structure

This is an early-stage Next.js App Router project. All pages/layouts live under `app/`. The path alias `@/*` maps to the project root. There are no API routes, components directory, or lib folder yet — the app currently consists of a single landing page.

## Environment

Copy `.env.example` to `.env` and set `BETTER_AUTH_SECRET` (must be 32+ chars) and `DB_PATH`.
