# DeepReads 📚

DeepReads is a high-performance discovery and bookmarking platform for **long-form content**. Originally built for a client who ghosted, it's now a template for **Astro 6**, **Better Auth**, and **Drizzle ORM** integrations.

## 🚀 The App
- **High-Quality Discovery**: Discover curated long-form articles, research, and essays.
- **Smart Bookmarking**: Save and organize your favorite reads (stored in D1/SQLite).
- **Hybrid Data Model**: Uses **Astro Content Collections** for zero-latency content and **Drizzle/SQL** for user-specific data.
- **Instant Search**: Pre-built search index powered by `fuse.js`.
- **Premium Design**: Modern, typography-first aesthetic built with **Tailwind CSS v4**.

## 🛠️ Tech Stack
- **Framework**: Astro 6 (React for interactions)
- **Auth**: Better Auth (GitHub OAuth ready)
- **ORM**: Drizzle (with custom D1 HTTP Proxy driver for prod)
- **DB**: SQLite (Local) / Cloudflare D1 (Production)
- **Search**: Fuse.js

## 🏁 Getting Started
1. **Clone & Install**: `bun install`
2. **Setup Env**: `cp .env.example .env` (Add Cloudflare & Auth keys)
3. **Init DB**: `bun run db:push`
4. **Run**: `bun run dev`

### Database Commands
- `bun run db:push`: Update **LOCAL** SQLite.
- `bun run db:push:prod`: Update **PRODUCTION** D1.
- `bun run db:studio`: Explore your local data.

## 📝 License
Released under the [MIT License](LICENSE) as an open-source example and starter kit.
