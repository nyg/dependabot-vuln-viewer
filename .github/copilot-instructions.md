# Copilot Instructions

## Build & Run

```sh
pnpm install
pnpm run dev    # starts Next.js dev server on localhost:3000
pnpm run debug  # starts Next.js dev server with --inspect for debugging
```

ESLint is configured and can be run via:

```sh
pnpm run lint  # runs eslint . --fix
```

## Architecture

This is a **Next.js app** that queries GitHub's GraphQL API directly from the browser. The only server-side code is two API routes for the OAuth login flow (`/api/auth/login` and `/api/auth/callback`). The user can alternatively provide a GitHub PAT which is sent as a Bearer token in the Authorization header straight to `api.github.com/graphql`.

### Authentication

Two mutually exclusive auth methods:

1. **GitHub OAuth** — user clicks "Login with GitHub", which triggers the standard OAuth code exchange flow through the two API routes. The callback stores the token in a short-lived non-httpOnly cookie (60s), which the client transfers to `localStorage` on app load via `transferOAuthToken()` in `utils/auth.js`. Logout is client-side only (clear `localStorage`, dispatch event).
2. **Personal Access Token** — user enters a PAT directly in the settings form. No server involvement.

The `oauth_state` cookie is a CSRF protection token: `login.js` generates a random value, stores it in an httpOnly cookie, and passes it as the `state` param to GitHub. `callback.js` validates the returned `state` matches the cookie before exchanging the code.

### Local settings persistence

Search form settings are persisted in `localStorage` via `utils/settings.js` and restored on app load. Persisted values include:

- `query`
- `githubApiUrl`
- `githubApiToken`
- `repoCount`
- `vulnCount`

This means a manually entered GitHub PAT remains in browser storage until the user replaces or clears it.

### Data flow

1. User enters a search query and PAT in `SearchForm`
2. Form submit dispatches a `search.form.submitted` event via the custom event bus (`utils/event-bus.js`)
3. `SearchResults` listens for that event and fires an Apollo `useLazyQuery` against GitHub's GraphQL API
4. Apollo's custom cache merge policies (`graphql/apollo-policies.js`) sort and categorize results — repos are split into vulnerable, inaccessible, alerts-disabled, and clean buckets, sorted by vulnerability count
5. Pagination ("load more") for both repos and vulnerabilities uses Apollo `fetchMore` with cursor-based pagination, triggered via additional event bus events

### Cross-component communication

Components communicate through a **custom event bus** built on native DOM `CustomEvent` (SSR-safe). Events use dot-separated hierarchical names:

- `search.form.submitted`
- `menu.item.settings.clicked`
- `load.more.repos.clicked`
- `load.more.vulns.clicked`
- `auth.state.changed`

There is no Redux, Zustand, or React Context — state lives in Apollo Client's cache and the event bus. Shared auth state is encapsulated in the `useAuthenticated()` custom hook (`utils/hooks.js`).

### Apollo Client

- Queries are in `graphql/queries.js`; cache merge policies in `graphql/apollo-policies.js`
- `useLazyQuery` is used for manual query execution (not auto-on-mount)
- Auth headers and API URI are passed per-query via Apollo `context`, not on the link
- Cache policies use `keyArgs: false` with custom merge functions that handle sorting and deduplication

## Code Style

Enforced via ESLint (`eslint.config.mjs`):

- **3-space indentation**
- **No semicolons**
- **Single quotes**
- **Imports sorted alphabetically** (case-insensitive)

Additional conventions:

- All components are **functional** (arrow functions, hooks) — no class components
- **Default exports** for components
- **Tailwind CSS v4** utility classes only — no CSS modules, no CSS-in-JS
- Custom Tailwind `@utility` directives defined in `styles/global.css` for tooltips
- Client-exposed config uses `NEXT_PUBLIC_*` variables; server-only secrets (e.g. `GITHUB_OAUTH_CLIENT_SECRET`) do not use the prefix

## Dependencies of Note

- `rxjs` is listed as a dependency but **not currently imported anywhere** in the source
- `marked-react` renders vulnerability advisory descriptions as Markdown
- `github-markdown-css` styles the rendered Markdown content
