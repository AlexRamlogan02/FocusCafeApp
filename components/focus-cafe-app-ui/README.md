# Focus Cafe App UI

React + Vite front end for PomoCha

## Getting started

```bash
npm install
```

## Scripts

- `npm run dev` — runs the app against the real API (`focus-cafe-app-api`). Set `APP_BASE_URI` to point at your API's base URL.
- `npm run local` — runs the app in `local` mode (`vite --mode local`) using mock data instead of live API calls. Loads `VITE_ENV=local` from `.env.local`.
- `npm run build` — builds the app for production.
- `npm run preview` — previews the production build locally.
- `npm run lint` — runs ESLint.

## Mock data

When `VITE_ENV=local` (set via `.env.local` and the `local` script), API modules in `src/api/` return data from `src/mocks/` instead of calling the real server. See [src/api/appData.js](src/api/appData.js) and [src/mocks/appData.mock.js](src/mocks/appData.mock.js) for an example.

To add mock data for a new endpoint:

1. Add a `*.mock.js` file to `src/mocks/` with the mock response shape.
2. Export it from `src/mocks/index.js`.
3. In the corresponding `src/api/*.js` module, return the mock when `isLocalEnv` is `true` (from `src/config/env.js`), otherwise call the real API via `apiFetch`.
