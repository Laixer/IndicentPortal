<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import { useSurveyStore } from '@/stores/survey.js'

const { Model } = storeToRefs(useSurveyStore())
</script>

<template>
  <div class="Note__Wrapper">
    <Title
      message="Aanvullende informatie of beschrijving"
      subtitle="Heeft u aanvullende informatie over het pand? Meld deze in het onderstaande tekstveld."
      :center="true"
    />

    <div class="FormField">
      <div class="FormField__Wrapper">
        <textarea
          id="toelichting"
          autocomplete="off"
          rows="25"
          class="FormField__Field"
          v-model="Model.note"
        />
      </div>
    </div>
  </div>
</template>

<style>
.Note__Wrapper {
  padding: 20px 20px;

  width: 100%;
  margin: 0 auto;
}

@media only screen and (min-width: 900px) {
  .Note .Form__Row {
    display: flex;
    justify-content: space-between;
  }

  .Note .Form__Row .FormField {
    width: calc(50% - 10px);
  }
}
</style>
