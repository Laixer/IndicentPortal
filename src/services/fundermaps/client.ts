import { trimLeadingChar, trimTrailingChar } from '@/utils/string'

import { getJwtAuthHeader, hasAccessToken, hasAccessTokenExpired } from './jwt'

import { useRouter, useRoute } from 'vue-router'
import { getAPIKeyAuthHeader, hasAPIKey } from './api-key'
import { APICallError, APIClientError, APIErrorResponse, APITokenError } from './errors'

export interface AuthorizationHeader {
  Authorization: string
}

/******************************************************************************
 * The function thats is calling the shots
 */

const passAuthCheckOrExit = function passAuthOrThrowException(
  requireAuth: boolean,
  autoredirect: boolean
) {
  // Check for auth
  try {
    if (requireAuth && !hasAPIKey()) {
      if (!hasAccessToken()) {
        throw new APITokenError('Missing access token')
      }

      if (hasAccessTokenExpired()) {
        throw new APITokenError('Access token has expired')
      }
    }
  } catch (e) {
    console.log('failed to pass auth check')
    console.log(e)

    // When auth is required & missing / expired => redirect to login
    if (autoredirect) {
      const route = useRoute()
      if (route.name !== 'Login') {
        const router = useRouter()
        router.push({ name: 'login' })
      }
      return
    } else {
      throw e
    }
  }
}

const makeCall = async function makeCall({
  endpoint,
  method = 'GET',
  body,
  queryString,
  requireAuth = true,
  autoredirect = true
}: {
  endpoint: string | URL
  method?: 'GET' | 'POST' | 'PUT'
  body?: BodyInit | any
  queryString?: URLSearchParams | Record<string, string> | string
  requireAuth?: boolean
  autoredirect?: boolean
}) {
  let fetchOptions = {}
  let authHeader: AuthorizationHeader | {} = {}
  let headers: Record<string, string> = {}
  let responseBody = null
  let url: URL

  console.log(endpoint, body, requireAuth)

  try {
    passAuthCheckOrExit(requireAuth, autoredirect)

    // Auth header
    if (requireAuth) {
      authHeader = getAPIKeyAuthHeader() || getJwtAuthHeader() || {}
    }

    if (typeof endpoint === 'string') {
      url = combineEndpoint(endpoint)
    } else {
      url = endpoint
    }

    try {
      // If queryString is empty, and body either contains URLSearchParams, or is GET and contains a string
      if (
        !queryString &&
        (body instanceof URLSearchParams || (method === 'GET' && typeof body === 'string'))
      ) {
        queryString = body
        body = undefined
      }

      // Convert Record<string, string> or string into URLSearchParams
      if (queryString && !(queryString instanceof URLSearchParams)) {
        queryString = new URLSearchParams(queryString)
      }

      if (queryString instanceof URLSearchParams) {
        queryString.forEach((value, key) => {
          url.searchParams.append(key, value)
        })
      }
    } catch (e) {
      throw new Error('Failed to process query string')
    }

    if (body && typeof body !== 'string' && !(body instanceof FormData)) {
      try {
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
      } catch (e) {
        // Ignore failed JSON stringify attempts. Body may be a something fetch accepts directly
      }
    }

    // Options
    fetchOptions = {
      method,
      headers: Object.assign(authHeader, headers),
      body
    }

    const response = await fetch(url, fetchOptions)

    // Get the response body, preferrably processed as json
    // Note: A failed call can often still have a valid json body, containing info about the error
    try {
      if (response.status !== 204) {
        responseBody = await response.json()
      }
    } catch (e) {
      console.log(e)

      if (response.ok && response.status !== 204) {
        throw new Error('Failed to process response body')
      }
    }

    if (!response.ok) {
      throw new APIErrorResponse(response.status, responseBody)
    }

    passAuthCheckOrExit(requireAuth, autoredirect)

    return responseBody
  } catch (err: unknown) {
    console.log(err)

    if (err instanceof APIClientError) {
      throw err
    }

    throw new APICallError(err, endpoint, fetchOptions, responseBody)
  }
}

/******************************************************************************
 * Shortcuts
 */
export const get = async function get({
  endpoint,
  body,
  queryString,
  requireAuth,
  autoredirect
}: {
  endpoint: string
  body?: BodyInit | any
  queryString?: URLSearchParams | Record<string, string> | string
  requireAuth?: boolean
  autoredirect?: boolean
}) {
  return await makeCall({ endpoint, method: 'GET', body, queryString, requireAuth, autoredirect })
}

export const post = async function post({
  endpoint,
  body,
  queryString,
  requireAuth,
  autoredirect
}: {
  endpoint: string
  body?: BodyInit | any
  queryString?: URLSearchParams | Record<string, string> | string
  requireAuth?: boolean
  autoredirect?: boolean
}) {
  return await makeCall({ endpoint, method: 'POST', body, queryString, requireAuth, autoredirect })
}

export const put = async function put({
  endpoint,
  body,
  queryString,
  requireAuth,
  autoredirect
}: {
  endpoint: string
  body?: BodyInit | any
  queryString?: URLSearchParams | Record<string, string> | string
  requireAuth?: boolean
  autoredirect?: boolean
}) {
  return await makeCall({ endpoint, method: 'PUT', body, queryString, requireAuth, autoredirect })
}

/******************************************************************************
 * Internal helper methods
 */

/**
 * Combine the endpoint with the base path while removing the trailing & leading / of the two segments
 */
function combineEndpoint(endpoint: string) {
  return new URL(
    `${trimTrailingChar(import.meta.env.VITE_FUNDERMAPS_URL || '', '/')}/api/${trimLeadingChar(endpoint, '/')}`
  )
}
