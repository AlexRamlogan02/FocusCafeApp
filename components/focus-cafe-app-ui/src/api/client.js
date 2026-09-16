import { apiBaseUrl } from '../config/env.js'

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, options)

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }

  return response.json()
}
