# bandumanamperi-mono

pnpm monorepo containing the Bandu Manamperi website, studio, and CMS.

## Apps

| App | Path | Description |
|-----|------|-------------|
| web | `apps/web` | Portfolio website |
| studio | `apps/studio` | Viewing room for works offered for sale. No cart or checkout. |
| cms | `apps/cms` | Content management system |

## Commands

```bash
pnpm dev          # Run all apps
pnpm dev:web      # Web only
pnpm dev:studio   # Studio only, http://localhost:3002
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
