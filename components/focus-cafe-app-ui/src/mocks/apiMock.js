import { sessions } from './session'

const STORAGE_KEY = 'focusCafeAppSession'

const readSessionStorage = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeSessionStorage = (session) => {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // ignore storage write failures
  }
}

const createInitialSession = () => {
  const stored = readSessionStorage()
  if (stored) return stored
  const initialSession = JSON.parse(JSON.stringify(sessions[0]))
  writeSessionStorage(initialSession)
  return initialSession
}

export async function startSession() {
  return Promise.resolve(createInitialSession())
}

export async function saveSession(session) {
  const persisted = JSON.parse(JSON.stringify(session))
  writeSessionStorage(persisted)
  return Promise.resolve(persisted)
}
