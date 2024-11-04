/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Default Application id
  readonly VITE_DEFAULT_APP_ID: string

  // Base path to fundermaps API
  readonly VITE_FUNDERMAPS_URL: string

  // Mapbox access token
  readonly VITE_MAPBOX_TOKEN: string
}
