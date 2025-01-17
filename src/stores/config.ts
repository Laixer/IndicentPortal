import { computed, ref, watch, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useSurveyStore } from './survey'
import { getAppConfig } from '@/services/fundermaps/endpoints/app'
import type { ISurveyConfig } from '@/services/fundermaps/interfaces/survey/ISurveyConfig'

/**
 * A loading state
 */
const loading: Ref<boolean> = ref(true)

/**
 * Whether an error occurred during loading the survey config
 */
const loadingError: Ref<boolean> = ref(false)

/**
 * Synchronised to route path
 */
const vendorSlug: Ref<string | undefined> = ref()

/**
 * Retrieved from API
 */
const clientId = ref(10)
const vendorName = ref('Fundermaps')
const vendorLogoPath = ref('/img/logo.png')
const primaryColor = ref('#000')
const secondaryColor = ref('#000')
const surveyPageSlugs: Ref<string[]> = ref([])

// Default intro text
const introText: Ref<string> = ref(`
  **Stichting Kennis Centrum Aanpak Funderingsproblematiek (KCAF) is een stichting met als doelstelling het verzamelen, ontwikkelen en ontsluiten van kennis rond de aanpak en preventie van funderingsproblemen.**

  KCAF fungeert als nationaal funderingsloket voor alle vragen rond deze problematiek. Van funderingsonderzoek tot funderingsherstel, van aanpak tot financiering en van preventie tot innovatie. KCAF is een stichting zonder winstoogmerk.
  
  Bij dit loket kunt u een melding maken van een funderingsprobleem aan uw woning. Wij zullen u vrijblijvend van advies voorzien. Dit loket is een initiatief van KCAF (Kennis Centrum Aanpak Funderingsproblematiek) en {{VENDOR}}.`)

/**
 * List of known survey pages
 */
const knownSurveyPageSlug = [
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

function useConfig() {
  const route = useRoute()
  const router = useRouter()

  const { clearSurveyData } = useSurveyStore()

  /**
   * Whenever the vendor slug changes we got to retrieve some info & reset the survey
   */
  watch(
    () => vendorSlug.value,
    async (slug) => {
      if (typeof slug !== 'string') {
        return
      }

      loading.value = true
      loadingError.value = false

      router.push({
        name: 'home',
        params: {
          vendor: vendorSlug.value
        }
      })

      clearSurveyData()

      // TODO: Handle errors
      //  - failed api call (after retry)
      //  - unkonwn vendor (404)
      //  - incomplete config
      //  - mismatch in vendor slug ?
      let appConfig = null
      try {
        appConfig = await getAppConfig(slug)
      } catch (err) {}

      if (!appConfig || !appConfig.data) {
        loadingError.value = true
        // TODO: Error handling...
        return
      }

      // Obtain the survey config information from the app config
      const surveyConfig: ISurveyConfig =
        typeof appConfig.data === 'string' ? JSON.parse(appConfig.data) : appConfig.data

      /**
       * The client id
       */
      clientId.value = surveyConfig.client_id

      /**
       * Branding
       */
      if (surveyConfig.branding.vendor_name) {
        vendorName.value = surveyConfig.branding.vendor_name
      }
      if (surveyConfig.branding.vendor_logo_path) {
        vendorLogoPath.value = surveyConfig.branding.vendor_logo_path
      }
      if (surveyConfig.branding.primary_color) {
        primaryColor.value = surveyConfig.branding.primary_color
      }
      if (surveyConfig.branding.secondary_color) {
        secondaryColor.value = surveyConfig.branding.secondary_color
      }
      if (surveyConfig.branding.intro_text && surveyConfig.branding.intro_text.length !== 0) {
        introText.value = surveyConfig.branding.intro_text
      }

      /**
       * The provided survey page slugs are filtered through a whitelist of known slugs
       */
      surveyPageSlugs.value = surveyConfig.pages.filter((page) =>
        knownSurveyPageSlug.includes(page)
      )

      /**
       * Hide the loading state
       */
      loading.value = false
    }
  )

  /**
   * Keep the vendor slug in the store in sync with the vendor slug in the route path
   */
  watch(
    route,
    (to) => {
      if (typeof to.params.vendor !== 'string') {
        return
      }

      // update the vendor slug if the route vendor param has changed
      const slug = to.params.vendor.toLowerCase()
      if (slug !== vendorSlug.value) {
        vendorSlug.value = slug
      }
    },
    { flush: 'pre', immediate: true, deep: true }
  )

  return {
    // state
    loading,
    loadingError,
    // identifiers
    clientId,
    vendorSlug,
    // branding
    vendorName,
    vendorLogoPath,
    primaryColor,
    secondaryColor,
    // intro text
    introText: computed(() => {
      return introText.value.replace('{{VENDOR}}', vendorName.value)
    }),
    // survey
    surveyPageSlugs
  }
}

export const useConfigStore = defineStore('Config', useConfig)
