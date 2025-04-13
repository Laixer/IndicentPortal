<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import { useNavigationStore } from '@/stores/navigation.js'
import { useSurveyStore } from '@/stores/survey.js'

const { disableNextButton, enableNextButton } = useNavigationStore()
const { model } = storeToRefs(useSurveyStore())

/**
 * Email validation according to browser standards
 *  see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
 */
const mailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const isEmailValid = computed(() => {
  return model.value.contact === '' || mailRegex.test(model.value.contact)
})

// Ref to control error message visibility, only show after interaction
const emailTouched = ref(false)
const showEmailError = computed(() => emailTouched.value && !isEmailValid.value)

// Computed property for overall form validity
const isFormValid = computed(() => {
  return model.value.contact_name && model.value.contact_name.trim() !== '' &&
    model.value.contact && model.value.contact.trim() !== '' &&
    isEmailValid.value
})

// Watch for validity changes to enable/disable the next button
watch(isFormValid, (isValid) => {
  if (isValid) {
    enableNextButton()
  } else {
    disableNextButton()
  }
}, { immediate: true }) // Use immediate to set initial state

// Function to mark email as touched (e.g., on blur)
const handleEmailBlur = () => {
  emailTouched.value = true
}

// Set initial button state on mount based on pre-filled data
onMounted(() => {
  if (isFormValid.value) {
    enableNextButton()
  } else {
    disableNextButton()
  }
  // If email has initial value, mark as touched to show potential error
  if (model.value.contact && model.value.contact !== '') {
    emailTouched.value = true;
  }
})
</script>

<template>
  <div class="Profile__Wrapper">
    <Title message="Uw gegevens"
      subtitle="Uw persoonsgegevens worden vertrouwelijk behandeld en niet gedeeld met derden." :center="true" />

    <div class="FormField">
      <label for="naam" class="FormField__Label">Naam (vereist)</label>
      <div class="FormField__Wrapper">
        <input id="naam" autocomplete="given-name" class="FormField__Field" v-model.trim="model.contact_name" />
      </div>
    </div>

    <div class="FormField">
      <label for="email" class="FormField__Label">E-mail (vereist)</label>
      <div v-if="showEmailError" class="FormField__Error">Voer een geldig e-mail adres in</div>
      <div class="FormField__Wrapper">
        <input id="email" autocomplete="email" class="FormField__Field" @blur="handleEmailBlur"
          v-model.trim="model.contact" />
      </div>
    </div>

    <div class="FormField">
      <label for="telefoon" class="FormField__Label">Telefoonnummer (optioneel)</label>
      <div class="FormField__Wrapper">
        <input id="telefoon" placeholder="+31" autocomplete="tel" class="FormField__Field"
          v-model="model.contact_phone_number" />
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

.FormField__Error {
  color: rgb(211, 0, 0);
  margin-bottom: 2px;
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
