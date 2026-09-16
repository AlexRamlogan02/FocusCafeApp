// Vite only exposes env vars prefixed with VITE_ to client code, so
// `npm run local` (vite --mode local) loads VITE_ENV from .env.local.
export const isLocalEnv = import.meta.env.VITE_ENV === 'local' || import.meta.env.MODE === 'local'

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
