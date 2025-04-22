const baseUrl = import.meta.env.VITE_PDOK_LOCATIONSERVICE || 'https://api.pdok.nl/bzk/locatieserver/search/v3_1'

/**
 * Interface for PDOK suggestion response
 */
export interface PDOKSuggestion {
  id: string;
  weergavenaam: string;
  type: string;
  score: number;
  [key: string]: any;
}

/**
 * Interface for PDOK suggestion response
 */
export interface PDOKSuggestionResponse {
  response: {
    numFound: number;
    start: number;
    maxScore: number;
    docs: PDOKSuggestion[];
  };
  highlighting: Record<string, any>;
  spellcheck?: any;
}

/**
 * Interface for PDOK lookup response
 */
export interface PDOKLookupResponse {
  response: {
    numFound: number;
    start: number;
    docs: Array<{
      id: string;
      weergavenaam: string;
      straatnaam: string;
      huisnummer: number;
      huisletter?: string;
      huisnummertoevoeging?: string;
      postcode: string;
      woonplaatsnaam: string;
      gemeentenaam: string;
      provincienaam: string;
      centroide_rd: string;
      centroide_ll: string;
      [key: string]: any;
    }>;
  };
}

/**
 * Makes a request to the PDOK API.
 *
 * @param endpoint - The API endpoint to call
 * @returns The JSON response or null if the request failed
 */
const fetchPDOK = async <T>(endpoint: string): Promise<T | null> => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`)
    if (response.ok) {
      return await response.json() as T;
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
 * Encodes URL parameters safely
 * 
 * @param params - Object containing URL parameters
 * @returns Encoded URL parameter string
 */
const encodeParams = (params: Record<string, string | number | boolean | undefined | null>): string => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
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
): Promise<PDOKSuggestionResponse | null> => {
  const params = encodeParams({
    q: query,
    rows: count || 5,
    fq: 'type:(adres)'
  });
  return fetchPDOK<PDOKSuggestionResponse>(`suggest?${params}`);
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
): Promise<PDOKSuggestionResponse | null> => {
  const params = encodeParams({
    q: query,
    lat: lat.toString(),
    lon: lon.toString(),
    rows: count || 5,
    fq: 'type:(adres)'
  });
  return fetchPDOK<PDOKSuggestionResponse>(`suggest?${params}`);
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
): Promise<PDOKLookupResponse | null> => {
  const params = encodeParams({
    lat: lat.toString(),
    lon: lon.toString(),
    rows: count || 5,
    fq: 'type:(adres)'
  });
  return fetchPDOK<PDOKLookupResponse>(`reverse?${params}`);
}

/**
 * Looks up address details by its ID from the PDOK database.
 *
 * @param id - The PDOK address ID (nummeraanduiding id)
 * @returns Detailed address object or null if not found or request failed.
 *          Contains complete address information, geographic coordinates, and related identifiers.
 */
export const getLookup = async (id: string): Promise<PDOKLookupResponse | null> => {
  const params = encodeParams({ id });
  return fetchPDOK<PDOKLookupResponse>(`lookup?${params}`);
}
