// Vite only exposes env vars prefixed with VITE_ to client code. "local" can't be
// used as a mode name (it conflicts with the .env.local override suffix), so
// `npm run local` uses --mode mock, and .env.local (loaded for every mode) sets VITE_ENV.
export const isLocalEnv = import.meta.env.VITE_ENV === 'local' || import.meta.env.MODE === 'mock'
export const apiBaseUrl = import.meta.env.VITE_APP_BASE_URI ?? ''