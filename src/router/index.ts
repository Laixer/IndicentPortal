import { createRouter, createWebHistory } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { useSurveyStore } from '@/stores/survey'
import { storeToRefs } from 'pinia'
import HomeView from '@/views/HomeView.vue'
import FinishView from '@/views/FinishView.vue'

/**
 * Extract vendor slug from subdomain
 * @returns {string|undefined} The vendor slug from subdomain, or undefined if not found
 */
export const extractVendorSlugFromSubdomain = (): string | undefined => {
  const hostname = window.location.hostname

  // Check if there's a query param like ?vendor=acme
  const urlParams = new URLSearchParams(window.location.search)
  const vendorParam = urlParams.get('vendor')
  if (vendorParam) return vendorParam.toLowerCase()

  // Check if we're on a fundermaps.com subdomain
  if (hostname.endsWith('.fundermaps.com') && hostname !== 'fundermaps.com') {
    // Extract the subdomain (everything before the first dot)
    const subdomain = hostname.split('.')[0]
    return subdomain.toLowerCase()
  }

  return undefined
}

/**
 * Determine which vendor slug to use
 * @returns {string} The determined vendor slug
 */
export const determineVendorSlug = (): string => {
  const vendorFromSubdomain = extractVendorSlugFromSubdomain()
  if (vendorFromSubdomain) {
    return vendorFromSubdomain
  }
  return import.meta.env.VITE_DEFAULT_APP_ID || 'incident'
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/finish',
      name: 'finish',
      component: FinishView
    },
    {
      path: '/address',
      name: 'address',
      component: () => import('@/views/survey/Address.vue'),
      meta: { survey: true }
    },
    {
      path: '/feedback-characteristics',
      name: 'feedback-characteristics',
      component: () => import('@/views/survey/FeedbackCharacteristics.vue'),
      meta: { survey: true }
    },
    {
      path: '/foundation-damage-cause',
      name: 'foundation-damage-cause',
      component: () => import('@/views/survey/FoundationDamageCause.vue'),
      meta: { survey: true }
    },
    {
      path: '/foundation-damage-characteristics',
      name: 'foundation-damage-characteristics',
      component: () => import('@/views/survey/FoundationDamageCharacteristics.vue'),
      meta: { survey: true }
    },
    {
      path: '/address-characteristics',
      name: 'address-characteristics',
      component: () => import('@/views/survey/AddressCharacteristics.vue'),
      meta: { survey: true }
    },
    {
      path: '/foundation-type',
      name: 'foundation-type',
      component: () => import('@/views/survey/FoundationType.vue'),
      meta: { survey: true }
    },
    {
      path: '/environment-damage-characteristics',
      name: 'environment-damage-characteristics',
      component: () => import('@/views/survey/EnvironmentDamageCharacteristics.vue'),
      meta: { survey: true }
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('@/views/survey/Upload.vue'),
      meta: { survey: true }
    },
    {
      path: '/note',
      name: 'note',
      component: () => import('@/views/survey/Note.vue'),
      meta: { survey: true }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/survey/Contact.vue'),
      meta: { survey: true }
    },
    {
      path: '/:catchAll(.*)',
      redirect: { name: 'home' }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const configStore = useConfigStore()
  const { vendorSlug } = storeToRefs(configStore)
  const surveyStore = useSurveyStore()

  try {
    // Only load vendor config if not already set
    if (!vendorSlug.value) {
      const vendor = determineVendorSlug()
      const success = await configStore.loadVendorConfig(vendor)

      if (!success) {
        console.error('Failed to load vendor configuration')
        return next(false)
      }

      if (!surveyStore.isStoreValid(configStore.vendorSlug as string)) {
        surveyStore.clearStore()
      }
      surveyStore.setVendorSlug(configStore.vendorSlug as string, configStore.clientId)
    }

    // Populate the survey model with URL parameters on initial load only
    if (from.name === undefined && to.query && Object.keys(to.query).length > 0) {
      surveyStore.populateFromParams(to.query)
    }

    // Check if trying to access a survey page without valid data
    if (from.name === undefined && to.meta.survey && !surveyStore.isDirtyAndValid()) {
      surveyStore.clearStore()
      return next({ name: 'home' })
    }

    next()
  } catch (error) {
    console.error('Router navigation error:', error)
    next(false)
  }
})

export default router
