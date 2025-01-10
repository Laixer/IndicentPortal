import {
  APICallError,
  APIClientError,
  APIConfigError,
  APIErrorResponse,
  APIInputError,
  APITokenError
} from './errors'
import { getAPIKeyAuthHeader, hasAPIKey, setAPIKey } from './api-key'
import { getJwtAuthHeader, hasAccessToken, hasAccessTokenExpired } from './jwt'
import { trimLeadingChar, trimTrailingChar } from './utils'

export interface IClientOptions {
  basePath?: string
  apiKey?: string

  /**
   * Whether api calls require authorization
   */
  requireAuth?: boolean

  /**
   * If set, this callback is called in case auth is required and the auth check failed
   *  if the callback returns a truthy value, the APITokenError exception is cancelled
   */
  authCheckCallback?: Function | undefined
}

export interface IFetchOptions {
  /**
   * If a string is provided, the basePath from the client options is prepended
   */
  endpoint: URL | string

  method: 'GET' | 'POST' | 'PUT'
  body?: BodyInit | any
  queryString?: URLSearchParams | Record<string, string> | string

  /**
   * Whether the api call requires authorization. Overrides client option
   */
  requireAuth?: boolean

  /**
   * If set, this callback is called in case auth is required and the auth check failed
   *  if the callback returns a truthy value, the APITokenError exception is cancelled
   * This overrides the client option
   */
  authCheckCallback?: Function | undefined
}

export interface AuthorizationHeader {
  Authorization: string
}

/******************************************************************************
 * The client options
 */
let ClientOptions: IClientOptions = {
  basePath: import.meta.env.VITE_FUNDERMAPS_URL || undefined,
  apiKey: import.meta.env.VITE_AUTH_KEY || undefined,
  requireAuth: true,
  authCheckCallback: undefined
}

/******************************************************************************
 * Internal helper methods
 */

/**
 * Default to client options if a fetch options is missing
 */
const setDefaults = function setDefaults(options: IFetchOptions) {
  if (options.requireAuth !== true && options.requireAuth !== false) {
    options.requireAuth = ClientOptions.requireAuth
  }
  if (typeof options.authCheckCallback !== 'function') {
    options.authCheckCallback = ClientOptions.authCheckCallback
  }
  return options
}

/**
 * Verify the available authorization information
 */
const verifyAuthorization = function verifyAuthorization() {
  // Having an api key means the auth check is passed
  if (hasAPIKey()) return true

  if (!hasAccessToken()) {
    throw new APITokenError('Missing access token')
  }

  if (hasAccessTokenExpired()) {
    throw new APITokenError('Access token has expired')
  }

  return true
}

/**
 * Combine the endpoint with the base path while removing the trailing & leading / of the two segments
 */
const prepUrl = function prepUrl(endpoint: URL | string) {
  if (endpoint instanceof URL) return endpoint

  if (typeof ClientOptions.basePath !== 'string') {
    throw new APIConfigError('Missing base path')
  }
  if (typeof endpoint !== 'string' || endpoint === '') {
    throw new APIInputError('Endpoint is invalid')
  }

  return new URL(
    `${trimTrailingChar(ClientOptions.basePath || '', '/')}/api/${trimLeadingChar(endpoint, '/')}`
  )
}

/**
 * Apply query string to url
 *
 * TODO: return body as undefined
 */
const prepQueryString = function prepQueryString(
  url: URL,
  method: 'GET' | 'POST' | 'PUT',
  queryString?: URLSearchParams | Record<string, string> | string,
  body?: BodyInit | any
): URL {
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

    return url
  } catch (e) {
    throw new Error('Failed to process query string')
  }
}

/**
 * The body should typically be stringified, but not always
 */
const maybeStringifyBody = function maybeStringifyBody(
  body: BodyInit | any,
  headers: Record<string, string>
) {
  if (body && typeof body !== 'string') {
    try {
      body = JSON.stringify(body)
      headers['Content-Type'] = 'application/json'
    } catch (e) {
      // Ignore failed JSON stringify attempts. Body may be a something fetch accepts directly
    }
  }
  return {
    body,
    headers
  }
}

/**
 * Append an Auth header, if available
 */
const setAuthHeader = function setAuthHeader(headers: Record<string, string>) {
  return Object.assign(headers, getAPIKeyAuthHeader() || getJwtAuthHeader() || {})
}

/**
 * Process the response body, which should be either empty or in JSON format
 */
const processResponseBody = async function processResponseBody(response: Response) {
  let responseBody = null

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

  return responseBody
}

/**
 * The Fundermaps client
 */
class Client {
  /**
   * Constructor
   */
  constructor(options: IClientOptions | undefined = undefined) {
    options && this.config(options)

    if (ClientOptions.apiKey) {
      setAPIKey(ClientOptions.apiKey)
    }
  }

  /**
   * Configure the client
   */
  config(options: IClientOptions) {
    if (typeof options.basePath === 'string') {
      ClientOptions.basePath = options.basePath
    } else if (options.basePath) {
      throw new APIConfigError('Invalid basePath value')
    }

    if (typeof options.apiKey === 'string') {
      ClientOptions.apiKey = options.apiKey
    } else if (options.apiKey) {
      throw new APIConfigError('Invalid apiKey value')
    }

    if (options.requireAuth === true || options.requireAuth === false) {
      ClientOptions.requireAuth = options.requireAuth
    } else if (options.requireAuth) {
      throw new APIConfigError('Invalid requireAuth value')
    }

    if (typeof options.authCheckCallback === 'function') {
      ClientOptions.authCheckCallback = options.authCheckCallback
    } else if (options.authCheckCallback) {
      throw new APIConfigError('Invalid authCheckCallback value')
    }

    if (ClientOptions.apiKey) {
      setAPIKey(ClientOptions.apiKey)
    }
  }

  /******************************************************************************
   * The core fetch mechanism
   */
  async fetch(options: IFetchOptions) {
    let endpoint = options.endpoint || undefined
    let url: URL
    let fetchOptions = {}
    let responseBody = null

    try {
      options = setDefaults(options)

      if (options.requireAuth) {
        verifyAuthorization()
      }

      url = prepUrl(options.endpoint)
      url = prepQueryString(url, options.method, options.queryString, options.body)

      let { body, headers } = maybeStringifyBody(options.body, {})

      if (options.requireAuth) {
        headers = setAuthHeader(headers)
      }

      // TODO: Make dependent on body
      headers['Content-Type'] = 'application/json'

      // Set fetch options
      fetchOptions = {
        method: options.method,
        headers,
        body
      }

      // Make the call
      const response = await fetch(url, fetchOptions)

      // And process the response
      return await processResponseBody(response)
    } catch (e) {
      console.log(e)

      // Intercept exception if authCheckCallback returns truthy
      if (e instanceof APITokenError && options.authCheckCallback) {
        if (options.authCheckCallback()) return
      }

      if (e instanceof APIClientError) {
        throw e
      }

      throw new APICallError(e, endpoint, fetchOptions, responseBody)
    }
  }

  /******************************************************************************
   * Shorthands
   */
  async get(options: IFetchOptions) {
    return await this.fetch(Object.assign(options, { method: 'GET' }))
  }
  async post(options: IFetchOptions) {
    return await this.fetch(Object.assign(options, { method: 'POST' }))
  }
  async put(options: IFetchOptions) {
    return await this.fetch(Object.assign(options, { method: 'PUT' }))
  }
}

export const FundermapsClient = new Client()
