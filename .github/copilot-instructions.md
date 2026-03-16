# Copilot Instructions

## Build & Run

```sh
pnpm install
pnpm run dev  # starts Next.js dev server on localhost:3000 with --inspect and --turbo
```

There are no test or lint scripts in `package.json`. ESLint is configured but must be run manually:

```sh
npx eslint .
```

## Architecture

This is a **client-side-only** Next.js app that queries GitHub's GraphQL API directly from the browser. There is no backend — the user provides a GitHub PAT which is sent as a Bearer token in the Authorization header straight to `api.github.com/graphql`.

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

There is no Redux, Zustand, or React Context — state lives in Apollo Client's cache and the event bus.

### Apollo Client

- Queries are in `graphql/queries.js`; cache merge policies in `graphql/apollo-policies.js`
- `useLazyQuery` is used for manual query execution (not auto-on-mount)
- Auth headers and API URI are passed per-query via Apollo `context`, not on the link
- Cache policies use `keyArgs: false` with custom merge functions that handle sorting and deduplication

## Code Style

Enforced via ESLint (`.eslintrc.json`):

- **3-space indentation**
- **No semicolons**
- **Single quotes**
- **Imports sorted alphabetically** (case-insensitive)

Additional conventions:

- All components are **functional** (arrow functions, hooks) — no class components
- **Default exports** for components
- **Tailwind CSS v4** utility classes only — no CSS modules, no CSS-in-JS
- Custom Tailwind `@utility` directives defined in `styles/global.css` for tooltips
- All environment config uses `NEXT_PUBLIC_*` variables (client-exposed)

## Dependencies of Note

- `rxjs` is listed as a dependency but **not currently imported anywhere** in the source
- `marked-react` renders vulnerability advisory descriptions as Markdown
- `github-markdown-css` styles the rendered Markdown content
