# AGENTS.md — Fintrack Web

## Stack

- **React 19** + **TypeScript 5.9** (strict mode)
- **Vite 8** — build tool
- **pnpm** — package manager (locked at 10.33.0 via `packageManager` field)
- **Tailwind CSS 4** with ShadCN UI components
- **TanStack Query 5** — server state + caching
- **Zustand 5** — auth state (persisted to localStorage)
- **Vitest 4** + Testing Library — 99%+ coverage

## Architecture

### Feature-based structure

```
src/
├── app/           # Router, providers, entry point
├── components/ui/ # ShadCN base components
├── features/      # Self-contained feature modules
│   └── <name>/
│       ├── components/
│       ├── hooks/     # TanStack Query hooks
│       ├── pages/
│       ├── schemas/   # Zod validation
│       ├── services/  # API calls
│       ├── stores/   # Zustand stores (auth only)
│       └── types/
└── shared/       # Reusable across features
    ├── components/  # DataTable, ErrorBoundary, PageLoader
    ├── constants/   # Routes (centralized, no magic strings)
    ├── layouts/     # AppLayout, AuthLayout
    └── services/    # Centralized axios instance with interceptors
```

**Key pattern**: Each feature owns its hooks/services/types. Shared utilities go in `shared/`.

### API layer

- Axios instance at `src/shared/services/api.ts`
- Base URL from `VITE_API_URL` env variable (required at build time)
- Request interceptor attaches `Authorization: Bearer {accessToken}` automatically
- Response interceptor handles:
  - **401**: Attempts token refresh via `/auth/refresh`, retries original request, or redirects to login
  - **429**: Returns a clear error (no retry)
  - Auth routes (`/auth/login`, `/auth/register`, `/auth/refresh`): 401 means invalid credentials — never triggers refresh

### Auth flow

- `useAuthStore` in `src/features/auth/stores/auth.store.ts` — Zustand + persist middleware
- `isAuthenticated` is **derived from `accessToken` presence** on rehydration (critical bug fix)
- Never store `isAuthenticated` directly

## Git Workflow

### Branch naming

```
feature/<name>    # New features
feat/<name>       # Completed features (merged to develop)
fix/<name>        # Bug fixes
docs/<name>       # Documentation
refactor/<name>   # Code refactoring
```

### Commit convention (Conventional Commits)

```
feat: new feature
fix: bug fix
docs: documentation only
refactor: code restructure (no behavior change)
test: adding tests
chore: maintenance
```

### Merge strategy

All changes go through **pull requests** into `develop`. The README documents a complete PR workflow with issue-first enforcement.

## Scripts

| Command              | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `pnpm dev`           | Dev server with HMR (typecheck via IDE, not in watch) |
| `pnpm build`         | **TypeScript check + Vite build** (both required)     |
| `pnpm lint`          | ESLint                                                |
| `pnpm test`          | Run all tests once                                    |
| `pnpm test:watch`    | Watch mode                                            |
| `pnpm test:coverage` | Coverage report (thresholds: 80% minimum)             |
| `pnpm docker:prod`   | Build + start Docker container                        |

**Important**: `pnpm dev` does NOT run typecheck — only `pnpm build` does. Don't rely on `pnpm dev` to catch type errors.

## Testing Patterns

### Hook testing

Tests mock at the service layer (`vi.mock('@/features/auth/services/auth.service')`), not at the axios level. Each test gets a fresh `QueryClient`.

```typescript
// Pattern: mock service + clear mocks in beforeEach
vi.mock("@/features/auth/services/auth.service", () => ({
  loginService: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.getState().clearTokens(); // Reset auth state
});
```

### Test structure

```
src/__tests__/
├── setup.ts           # @testing-library/jest-dom import
└── unit/
    ├── hooks/         # One test file per hook file
    └── utils/          # One test file per util file
```

## Environment Variables

- **Development**: Copy `.env.example` → `.env`, set `VITE_API_URL`
- **Production**: Pass `VITE_API_URL` as Docker `--build-arg` (injected at build time, not runtime)
- **Critical**: `VITE_API_URL` is required — the app throws at startup if missing

## Docker

Multi-stage build: Node.js compiles → Nginx serves static files.

- Port: `80` inside container, mapped to `80` on host
- SPA routing handled by Nginx `try_files $uri $uri/ /index.html`
- Static assets cached 1 year with `Cache-Control: immutable`

## Path Aliases

All imports use `@/` which maps to `src/`:

```typescript
import { ROUTES } from "@/shared/constants/routes";
```

Configure in both `tsconfig.app.json` and `vite.config.ts`.

## UI Components

ShadCN components live in `src/components/ui/`. New components added via `pnpm shadcn@latest add <component>`.

## API Contract

This frontend connects to [fintrack-api](https://github.com/W1lson17/fintrack-api). The backend must be running for the app to work. Default: `http://localhost:3001/api`.
