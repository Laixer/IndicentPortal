<script setup lang="ts">
import { computed } from 'vue'

import SvgIconArrowPrevious from '@/components/icons/SvgIconArrowPrevious.vue'
import SvgIconArrowNext from '@/components/icons/SvgIconArrowNext.vue'
import { useNavigationStore } from '@/stores/navigation.js'
import { useSurveyStore } from '@/stores/survey.js'
import { storeToRefs } from 'pinia'
import router from '@/router/index.js'

const { getNextSurveyPageSlug, getPreviousSurveyPageSlug } = useNavigationStore()

const { showNext, showPrev, isNextDisabled, isHomePage, isLastSurveyPage } =
  storeToRefs(useNavigationStore())

const { saveToDatabase } = useSurveyStore()

const handlePrevStepNavigation = function handlePrevStepNavigation() {
  router.push({
    name: getPreviousSurveyPageSlug() || 'home'
  })
}

const handleNextStepNavigation = async function handleNextStepNavigation() {
  let nextPageName = getNextSurveyPageSlug() || 'finish'
  if (isLastSurveyPage.value) {
    nextPageName = (await saveToDatabase()) || nextPageName
  }

  router.push({
    name: nextPageName
  })
}

const nextStepLabel = computed(() => {
  if (isHomePage.value) {
    return 'Melding maken of vraag stellen'
  }

  if (isLastSurveyPage.value) {
    return 'Versturen'
  }

  return 'Volgende'
})
</script>

<template>
  <footer class="Footer">
    <div v-if="showPrev" @click="handlePrevStepNavigation">
      <button class="Button Button--ghost">
        <div class="SvgIcon svg-container">
          <SvgIconArrowPrevious />
        </div>
        <span>Vorige</span>
      </button>
    </div>

    <div v-if="showNext && !isNextDisabled" @click="handleNextStepNavigation">
      <button class="Button">
        <span>{{ nextStepLabel }}</span>
        <div class="SvgIcon svg-container">
          <SvgIconArrowNext />
        </div>
      </button>
    </div>

    <button v-else-if="showNext" class="Button" disabled="true">
      <span>{{ nextStepLabel }}</span>
      <div class="SvgIcon svg-container">
        <SvgIconArrowNext />
      </div>
    </button>
  </footer>
</template>
