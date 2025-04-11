import type { AuthorizationHeader } from './client'

let apiKey: string | null = import.meta.env.VITE_AUTH_KEY || null

export const hasAPIKey = (): boolean => {
  return apiKey !== null && apiKey.length !== 0
}
export const setAPIKey = (key: string | null): void => {
  apiKey = key
}
export const getAPIKey = (): string | null => {
  return apiKey
}
export const getAPIKeyAuthHeader = (): AuthorizationHeader | null => {
  if (!hasAPIKey()) return null
  return {
    Authorization: 'authkey ' + getAPIKey()
  }
}
