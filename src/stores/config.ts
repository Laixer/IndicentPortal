import { computed, reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { getAppConfig } from '@/services/fundermaps/endpoints/app'
import type { ISurveyConfig } from '@/services/fundermaps/interfaces/survey/ISurveyConfig'

// Define interfaces for better type safety
interface ConfigState {
  loading: boolean
  loadingError: boolean
  errorMessage: string | null
  vendorSlug: string | undefined
  clientId: number
  branding: {
    vendorName: string
    vendorLogoPath: string
    vendorPicturePath: string
    primaryColor: string
    secondaryColor: string
    introTextRaw: string
  }
  surveyPageSlugs: string[]
}

/**
 * List of known survey pages
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
]

/**
 * Default intro text template
 */
const DEFAULT_INTRO_TEXT = `
  **Stichting Kennis Centrum Aanpak Funderingsproblematiek (KCAF) is een stichting met als doelstelling het verzamelen, ontwikkelen en ontsluiten van kennis rond de aanpak en preventie van funderingsproblemen.**

  KCAF fungeert als nationaal funderingsloket voor alle vragen rond deze problematiek. Van funderingsonderzoek tot funderingsherstel, van aanpak tot financiering en van preventie tot innovatie. KCAF is een stichting zonder winstoogmerk.
  
  Bij dit loket kunt u een melding maken van een funderingsprobleem aan uw woning. Wij zullen u vrijblijvend van advies voorzien. Dit loket is een initiatief van KCAF (Kennis Centrum Aanpak Funderingsproblematiek) en {{VENDOR}}.`

export const useConfigStore = defineStore('vendorConfig', () => {
  // State using reactive instead of ref for better destructuring
  const state = reactive<ConfigState>({
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
      introTextRaw: DEFAULT_INTRO_TEXT
    },
    surveyPageSlugs: []
  })

  // Only create computed properties for derived values
  const introText = computed(() => {
    return state.branding.introTextRaw.replace('{{VENDOR}}', state.branding.vendorName)
  })

  /**
   * Load vendor configuration from the API
   * @param vendor The vendor slug to load configuration for
   */
  const loadVendorConfig = async (vendor: string): Promise<boolean> => {
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

      // Update branding information
      if (surveyConfig.branding) {
        if (surveyConfig.branding.vendor_name) {
          state.branding.vendorName = surveyConfig.branding.vendor_name
        }
        if (surveyConfig.branding.vendor_logo_path) {
          state.branding.vendorLogoPath = surveyConfig.branding.vendor_logo_path
        }
        if (surveyConfig.branding.vendor_picture_path) {
          state.branding.vendorPicturePath = surveyConfig.branding.vendor_picture_path
        }
        if (surveyConfig.branding.primary_color) {
          state.branding.primaryColor = surveyConfig.branding.primary_color
        }
        if (surveyConfig.branding.secondary_color) {
          state.branding.secondaryColor = surveyConfig.branding.secondary_color
        }
        if (surveyConfig.branding.intro_text && surveyConfig.branding.intro_text.length !== 0) {
          state.branding.introTextRaw = surveyConfig.branding.intro_text
        }
      }

      // Filter survey page slugs against the whitelist
      state.surveyPageSlugs = surveyConfig.pages.filter(page =>
        KNOWN_SURVEY_PAGE_SLUGS.includes(page)
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
    Object.assign(state, {
      loading: false,
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
        introTextRaw: DEFAULT_INTRO_TEXT
      },
      surveyPageSlugs: []
    })
  }

  // Use toRefs to make all properties reactive while allowing destructuring
  return {
    ...toRefs(state),
    // Flattened branding properties for easier access
    ...toRefs(state.branding),
    // Computed properties
    introText,
    // Methods
    loadVendorConfig,
    resetConfig,
  }
})
