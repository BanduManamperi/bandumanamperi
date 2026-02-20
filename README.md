# bandumanamperi-mono

pnpm monorepo containing the Bandu Manamperi website and CMS.

## Apps

| App | Path | Description |
|-----|------|-------------|
| web | `apps/web` | Portfolio/frontend website |
| cms | `apps/cms` | Content management system |

## Commands

```bash
pnpm dev          # Run all apps
pnpm dev:web      # Web only
pnpm dev:cms      # CMS only
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm clean        # Remove .next and node_modules from apps
pnpm clean:all    # Remove all node_modules
```

## Setup

```bash
pnpm install
```

Each app requires its own `.env.local` — see the app's README for required variables.
