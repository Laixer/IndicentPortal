import { computed, reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { getAppConfig } from '@/services/fundermaps/endpoints/app'
import type { ISurveyConfig } from '@/services/fundermaps/interfaces/survey/ISurveyConfig'

// Define interfaces for better type safety
interface BrandingState {
  vendorName: string
  vendorLogoPath: string
  vendorPicturePath: string
  primaryColor: string
  secondaryColor: string
  introTextRaw: string
  mapCenter?: {
    lat: number
    lng: number
  }
}

interface ConfigState {
  loading: boolean
  loadingError: boolean
  errorMessage: string | null
  vendorSlug: string | undefined
  clientId: number
  branding: BrandingState
  surveyPageSlugs: string[]
}

/**
 * List of known survey pages - make this a constant to avoid recreation
 */
const KNOWN_SURVEY_PAGE_SLUGS = [
  'address',
  'feedback-characteristics',
  'foundation-damage-cause',
  'foundation-damage-characteristics',
  'address-characteristics',
  'foundation-type',
  'environment-damage-characteristics',
  'upload',
  'note',
  'contact'
] as const;

/**
 * Default intro text template
 */
const DEFAULT_INTRO_TEXT = `
  **Stichting Kennis Centrum Aanpak Funderingsproblematiek (KCAF) is een stichting met als doelstelling het verzamelen, ontwikkelen en ontsluiten van kennis rond de aanpak en preventie van funderingsproblemen.**

  KCAF fungeert als nationaal funderingsloket voor alle vragen rond deze problematiek. Van funderingsonderzoek tot funderingsherstel, van aanpak tot financiering en van preventie tot innovatie. KCAF is een stichting zonder winstoogmerk.
  
  Bij dit loket kunt u een melding maken van een funderingsprobleem aan uw woning. Wij zullen u vrijblijvend van advies voorzien. Dit loket is een initiatief van KCAF (Kennis Centrum Aanpak Funderingsproblematiek) en {{VENDOR}}.`

// Initial state to use for both initialization and reset
const getInitialState = (): ConfigState => ({
  loading: true,
  loadingError: false,
  errorMessage: null,
  vendorSlug: undefined,
  clientId: 0,
  branding: {
    vendorName: 'Fundermaps',
    vendorLogoPath: '/img/logo.png',
    vendorPicturePath: '/img/home.jpg',
    primaryColor: '#000',
    secondaryColor: '#000',
    introTextRaw: DEFAULT_INTRO_TEXT,
    mapCenter: undefined
  },
  surveyPageSlugs: []
})

export const useConfigStore = defineStore('vendorConfig', () => {
  // State using reactive instead of ref for better destructuring
  const state = reactive<ConfigState>(getInitialState())

  // Only create computed properties for derived values
  const introText = computed(() => {
    return state.branding.introTextRaw.replace('{{VENDOR}}', state.branding.vendorName)
  })

  /**
   * Load vendor configuration from the API
   * @param vendor The vendor slug to load configuration for
   * @returns Promise that resolves to boolean indicating success
   */
  const loadVendorConfig = async (vendor: string): Promise<boolean> => {
    if (!vendor || typeof vendor !== 'string') {
      console.error('Invalid vendor slug provided')
      state.loadingError = true
      state.errorMessage = 'Invalid vendor slug'
      state.loading = false
      return false
    }

    state.loading = true
    state.loadingError = false
    state.errorMessage = null

    try {
      const appConfig = await getAppConfig(vendor)

      if (!appConfig || !appConfig.data) {
        throw new Error('No app config data found')
      }

      // Parse the survey config
      const surveyConfig: ISurveyConfig =
        typeof appConfig.data === 'string' ? JSON.parse(appConfig.data) : appConfig.data

      // Update store state with the new configuration
      state.vendorSlug = vendor
      state.clientId = surveyConfig.client_id

      // Update branding information if available
      if (surveyConfig.branding) {
        const { branding } = surveyConfig

        // Use optional chaining and nullish coalescing for cleaner code
        state.branding.vendorName = branding.vendor_name ?? state.branding.vendorName
        state.branding.vendorLogoPath = branding.vendor_logo_path ?? state.branding.vendorLogoPath
        state.branding.vendorPicturePath = branding.vendor_picture_path ?? state.branding.vendorPicturePath
        state.branding.primaryColor = branding.primary_color ?? state.branding.primaryColor
        state.branding.secondaryColor = branding.secondary_color ?? state.branding.secondaryColor

        if (branding.intro_text && branding.intro_text.trim().length !== 0) {
          state.branding.introTextRaw = branding.intro_text
        }

        // Add mapCenter if it exists in the API response
        if (branding.map_center && typeof branding.map_center.lat === 'number' && typeof branding.map_center.lng === 'number') {
          state.branding.mapCenter = {
            lat: branding.map_center.lat,
            lng: branding.map_center.lng
          }
        }
      }

      // Check if remote config contains required pages (address and contact)
      const availablePages = Array.isArray(surveyConfig.pages) ? surveyConfig.pages : []
      const hasAddressPage = availablePages.includes('address')
      const hasContactPage = availablePages.includes('contact')

      if (!hasAddressPage || !hasContactPage) {
        throw new Error(
          `Configuration is missing required pages: ${[
            !hasAddressPage ? 'address' : '',
            !hasContactPage ? 'contact' : ''
          ].filter(Boolean).join(', ')}`
        )
      }

      // Filter survey page slugs against the whitelist
      state.surveyPageSlugs = availablePages.filter(page =>
        KNOWN_SURVEY_PAGE_SLUGS.includes(page as any)
      )

      state.loading = false
      return true
    } catch (error) {
      state.loadingError = true
      state.errorMessage = error instanceof Error ? error.message : 'Unknown error loading config'
      console.error('Failed to load vendor config:', error)
      state.loading = false
      return false
    }
  }

  /**
   * Reset store to default values
   */
  const resetConfig = () => {
    Object.assign(state, getInitialState())
  }

  // Use toRefs to make all properties reactive while allowing destructuring
  return {
    ...toRefs(state),
    // Computed properties
    introText,
    // Methods
    loadVendorConfig,
    resetConfig,
  }
})
