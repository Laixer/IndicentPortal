<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import { useNavigationStore } from '@/stores/navigation.js'
import { useSurveyStore } from '@/stores/survey.js'

const { disableNextButton, enableNextButton } = useNavigationStore()

const { Model } = storeToRefs(useSurveyStore())

// This is the only page with input requirements, so the validation is ad-hoc
// The validation is repeated right before submit, and if validation fails, the user is redirected to this page
// Although currently the contact page is actually always the last page in which the data is submitted.
const handleValidateModel = function () {
  if (
    !Model.value.contact ||
    Model.value.contact === '' ||
    !Model.value.contact_name ||
    Model.value.contact_name === ''
  ) {
    disableNextButton()
  } else {
    enableNextButton()
  }
}

onBeforeMount(() => {
  // Works as long as we do not show any feedback...
  handleValidateModel()
})
</script>

<template>
  <div class="Profile__Wrapper">
    <Title
      message="Uw gegevens"
      subtitle="Uw persoonsgegevens worden vertrouwelijk behandeld en niet gedeeld met derden."
      :center="true"
    />

    <div class="FormField">
      <label for="naam" class="FormField__Label">Naam</label>
      <div class="FormField__Wrapper">
        <input
          id="naam"
          autocomplete="given-name"
          class="FormField__Field"
          @focus="handleValidateModel"
          @blur="handleValidateModel"
          v-model="Model.contact_name"
        />
      </div>
    </div>

    <div class="FormField">
      <label for="email" class="FormField__Label">E-mail</label>
      <div class="FormField__Wrapper">
        <input
          id="email"
          autocomplete="email"
          class="FormField__Field"
          @focus="handleValidateModel"
          @blur="handleValidateModel"
          v-model="Model.contact"
        />
      </div>
    </div>

    <div class="FormField">
      <label for="telefoon" class="FormField__Label">Telefoonnummer</label>
      <div class="FormField__Wrapper">
        <input
          id="telefoon"
          placeholder="+31"
          autocomplete="given-name"
          class="FormField__Field"
          @focus="handleValidateModel"
          @blur="handleValidateModel"
          v-model="Model.contact_phone_number"
        />
      </div>
    </div>
  </div>
</template>

<style>
.Profile__Wrapper {
  padding: 20px 20px;

  max-width: 550px;
  width: 100%;
  margin: 0 auto;
}

@media only screen and (min-width: 900px) {
  .Profile__Wrapper {
    padding: 20px 80px;
  }

  .Profile .Form__Row {
    display: flex;
    justify-content: space-between;
  }

  .Profile .Form__Row .FormField {
    width: calc(50% - 10px);
  }
}
</style>
