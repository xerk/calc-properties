# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript type checking
```

Database migrations (Drizzle):
```bash
pnpm drizzle-kit generate   # Generate migrations from schema changes
pnpm drizzle-kit push       # Push schema directly to database
pnpm drizzle-kit studio     # Open Drizzle Studio GUI
```

## Architecture

**Stack**: Next.js 16 (App Router) + React 19 + TypeScript + SQLite (Drizzle ORM) + shadcn/ui + Tailwind CSS v4

**Domain**: Real estate property investment analyzer - compares properties, calculates affordability, tracks payment schedules, and manages financial scenarios.

### Directory Structure

- `app/` - Next.js App Router pages and API routes
- `app/api/scenarios/` - REST endpoints for scenario CRUD (GET, POST, DELETE)
- `components/features/properties/` - Main application components (PropertyAnalyzer, PropertyCard, etc.)
- `components/ui/` - shadcn/ui components
- `lib/db/` - Drizzle schema and database connection
- `lib/data.ts` - Property dataset and formatting utilities
- `hooks/` - Custom React hooks (exchange rate fetcher, mobile detection)

### Data Flow

PropertyAnalyzer is the root component managing all state:
- Financial inputs (balance, salary, exchange rate)
- Filtering (area range, plan type, size category)
- Selection state (selected property IDs for comparison)
- Privacy mode toggle

State flows down via props; updates flow up via callbacks.

### Database

SQLite database (`sqlite.db`) with Drizzle ORM. Schema in `lib/db/schema.ts`:
- `scenarios` table stores saved financial profiles

### Key Utilities (lib/data.ts)

- `fmt(n)` - Format number with commas (1,234,567)
- `fmtK(n)` - Compact format (8.76M, 377K)
- `pct(n)` - Decimal to percentage string
- `parseCompact(s)` - Parse "1.5k" or "2m" to number
- `isCoreAndShell(project)` - Check if property needs finishing costs

### Styling

Tailwind CSS v4 with CSS custom properties (OKLch color space). Dark mode via `.dark` class. Prettier sorts Tailwind classes automatically.
