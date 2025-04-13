const baseUrl = import.meta.env.VITE_PDOK_LOCATIONSERVICE || 'https://api.pdok.nl/bzk/locatieserver/search/v3_1'

/**
 * Makes a request to the PDOK API.
 *
 * @param endpoint - The API endpoint to call
 * @returns The JSON response or null if the request failed
 */
const callPDOK = async (endpoint: string): Promise<any | null> => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`)
    if (response.ok) {
      return await response.json()
    } else {
      console.error(`PDOK API error: ${response.status} ${response.statusText}`)
      return null
    }
  } catch (e) {
    console.error('Failed to process PDOK request:', e)
    return null
  }
}

/**
 * Gets address suggestions based on a search query.
 *
 * @param query - The search text
 * @param count - The number of results to return (default: 5)
 * @returns Suggestion results or null
 */
export const getSuggestions = async (
  query: string,
  count: number | undefined | null = 5
): Promise<any | null> => {
  return callPDOK(
    `suggest?q=${query}&rows=${count || 5}&fq=type:(adres)`
  )
}

/**
 * Gets address suggestions based on a search query and coordinates.
 *
 * @param query - The search text
 * @param lat - Latitude coordinate (decimal degrees)
 * @param lon - Longitude coordinate (decimal degrees)
 * @param count - The number of results to return (default: 5)
 * @returns Object containing suggestion results or null if the request failed.
 *          Results include address properties like street, city, and id.
 */
export const getSuggestionsNearCoordinates = async (
  query: string,
  lat: string | number,
  lon: string | number,
  count: number | undefined | null = 5
): Promise<any | null> => {
  return callPDOK(
    `suggest?q=${query}&lat=${lat.toString()}&lon=${lon.toString()}&rows=${count || 5}&fq=type:(adres)`
  )
}

/**
 * Gets an address based on coordinates (reverse geocoding).
 *
 * @param lat - Latitude coordinate in decimal degrees
 * @param lon - Longitude coordinate in decimal degrees
 * @param count - The number of results to return (default: 5)
 * @returns Object containing address results sorted by distance or null if the request failed.
 *          Results include detailed address information like street, house number, city, etc.
 */
export const getReverse = async (
  lat: string | number,
  lon: string | number,
  count: number | undefined | null = 5
): Promise<any | null> => {
  return callPDOK(
    `reverse?lat=${lat.toString()}&lon=${lon.toString()}&rows=${count || 5}&fq=type:(adres)`
  )
}

/**
 * Looks up address details by its ID from the PDOK database.
 *
 * @param id - The PDOK address ID (nummeraanduiding id)
 * @returns Detailed address object or null if not found or request failed.
 *          Contains complete address information, geographic coordinates, and related identifiers.
 */
export const getLookup = async (id: string): Promise<any | null> => {
  return callPDOK(`lookup?id=${id}`)
}
