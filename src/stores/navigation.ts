/**
 * The state of navigation element based on the route
 */

import { computed, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import { useRoute } from 'vue-router'
import { useConfigStore } from './config'

export const useNavigationStore = defineStore('navigation', () => {
  /**
   * Nav UI state set through route watcher
   */
  const showPrev = ref(false)
  const showNext = ref(false)
  const isProgressVisible = ref(false)
  const isHomePage = ref(false)
  const isFinishPage = ref(false)
  const isLastSurveyPage = ref(false)

  // Nav UI state set on survey page
  const isNextDisabled = ref(false)

  const disableNextButton = () => {
    isNextDisabled.value = true
  }

  const enableNextButton = () => {
    isNextDisabled.value = false
  }

  const route = useRoute()
  const { surveyPageSlugs } = storeToRefs(useConfigStore())

  /**
   * Slug of the last survey page
   */
  const lastPageSlug = computed(() => {
    return surveyPageSlugs.value[surveyPageSlugs.value.length - 1]
  })

  /**
   * The route & set of survey pages determines several UI states
   */
  watch(
    () => route,
    (to) => {
      // Avoid unnamed routes
      if (typeof to.name !== 'string') {
        return false
      }

      // Navigation progress is visible on survey pages
      isProgressVisible.value = to.meta.survey === true

      // Previous button should only show up on survey pages
      showPrev.value = to.meta.survey === true

      // Do not show the next button on the finish page
      showNext.value = to.name !== 'finish'

      // By default, enable the next btn.
      isNextDisabled.value = false

      // Whether we're on home page
      isHomePage.value = to.name === 'home'
      isFinishPage.value = to.name === 'finish'

      // Whether we're moving on to the finish page
      isLastSurveyPage.value = lastPageSlug.value === to.name
    },
    { flush: 'pre', immediate: true, deep: true }
  )

  /**
   * State of the progress navigation,
   * determined by the current route name & known pages
   */
  const surveyNavigationState = computed(() => {
    if (!surveyPageSlugs.value.length) {
      return []
    }

    let currentIndex = -1

    return surveyPageSlugs.value.map((slug, index) => {
      // update the current index when arriving at the current page
      if (route.name === slug) {
        currentIndex = index
      }

      return {
        number: index + 1,
        slug,
        current: currentIndex === index,
        finished: currentIndex > index,
        future: currentIndex < index
      }
    })
  })

  /**
   * Return the slug of the next survey page.
   * If not currently on a survey page, return the first
   * If on the last page, return null
   * If there are no known pages, return null
   */
  const getNextSurveyPageSlug = (): string | null => {
    if (!surveyNavigationState.value.length) {
      return null
    }

    const current = surveyNavigationState.value.findIndex((state) => state.current)
    if (current !== -1) {
      return surveyNavigationState.value[current + 1]?.slug || null
    }

    // Get the slug of the first page if none are marked as current
    return surveyNavigationState.value[0]?.slug || null
  }

  /**
   * Return the slug of the previous survey page.
   * If not currently on a survey page, return null
   * If on the first page, return null
   * If there are no known pages, return null
   */
  const getPreviousSurveyPageSlug = (): string | null => {
    if (!surveyNavigationState.value.length) {
      return null
    }

    const current = surveyNavigationState.value.findIndex((state) => state.current)
    if (current > 0) {
      return surveyNavigationState.value[current - 1].slug
    }

    return null
  }

  return {
    isProgressVisible,

    showPrev,
    showNext,
    isNextDisabled,

    isHomePage,
    isFinishPage,
    isLastSurveyPage,

    surveyNavigationState,

    getPreviousSurveyPageSlug,
    getNextSurveyPageSlug,

    disableNextButton,
    enableNextButton
  }
})
