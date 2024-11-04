import { ref, watch, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { getSurveyConfig } from '@/services/fundermaps/endpoints/survey'
import { useSurveyStore } from './survey'

/**
 * A loading state
 */
const loading: Ref<boolean> = ref(true)

/**
 * Synchronised to route path
 */
const vendorSlug: Ref<string | undefined> = ref()

/**
 * Retrieved from API
 */
const clientId = ref(10)
const vendorName = ref('Fundermaps')
const vendorLogoPath = ref()
const primaryColor = ref('#000')
const secondaryColor = ref('#000')
const surveyPageSlugs: Ref<string[]> = ref([])

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
      const config = await getSurveyConfig(slug)

      /**
       * The client id
       */
      clientId.value = config.clientId

      /**
       * Branding
       */
      vendorName.value = config.branding.vendorName
      vendorLogoPath.value = config.branding.vendorLogoPath
      primaryColor.value = config.branding.primaryColor
      secondaryColor.value = config.branding.secondaryColor

      /**
       * The provided survey page slugs are filtered through a whitelist of known slugs
       */
      surveyPageSlugs.value = config.pages.filter((page) => knownSurveyPageSlug.includes(page))

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
    // identifiers
    clientId,
    vendorSlug,
    // branding
    vendorName,
    vendorLogoPath,
    primaryColor,
    secondaryColor,
    // survey
    surveyPageSlugs
  }
}

export const useConfigStore = defineStore('Config', useConfig)
