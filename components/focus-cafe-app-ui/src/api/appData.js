import { isLocalEnv } from '../config/env.js'
import { appDataMock } from '../mocks/appData.mock.js'
import { apiFetch } from './client.js'

export async function getAppData() {
  if (isLocalEnv) {
    return appDataMock
  }

  return apiFetch('/app-data')
}
