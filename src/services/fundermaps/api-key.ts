import type { AuthorizationHeader } from './client'

/******************************************************************************
 * API Key overrides JWT auth
 */
let apiKey: string | null = import.meta.env.VITE_AUTH_KEY || null

export const hasAPIKey = function hasAPIKey() {
  return apiKey !== null && apiKey.length !== 0
}
export const setAPIKey = function setAPIKey(key: string | null) {
  apiKey = key
}
export const getAPIKey = function getAPIKey() {
  return apiKey
}
export const getAPIKeyAuthHeader = function getAPIKeyAuthHeader(): AuthorizationHeader | null {
  if (!hasAPIKey()) return null
  return {
    Authorization: 'authkey ' + getAPIKey()
  }
}
