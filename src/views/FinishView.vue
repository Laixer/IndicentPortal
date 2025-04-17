<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import Title from '@/components/Title.vue'

import SvgIconKCAF from '@/components/icons/SvgIconKCAF.vue'

import { useConfigStore } from '@/stores/config.js'
import { useSurveyStore } from '@/stores/survey.js'

const configStore = useConfigStore()
const surveyStore = useSurveyStore()
const { vendorSlug } = storeToRefs(configStore)
const { submissionError } = storeToRefs(surveyStore)
const isFeedback = computed(() => vendorSlug.value === 'feedback')
</script>

<template>
  <div class="Finish">
    <div class="Finish__Wrapper">
      <template v-if="submissionError">
        <Title message="Er is iets misgegaan" />

        <p class="BodyText BodyText--bold error-text" style="margin-bottom: 26px">
          <span>De melding kon niet worden ingediend</span>
        </p>

        <p class="BodyText" style="margin-bottom: 26px">
          <span>
            Er is helaas een fout opgetreden bij het verwerken van uw gegevens.
            Probeer het later nog eens of neem contact op met onze helpdesk.
          </span>
        </p>
      </template>
      <template v-else-if="isFeedback">
        <Title message="Afgerond!" />

        <p class="BodyText BodyText--bold" style="margin-bottom: 26px">
          <span>Bedankt voor het doorgeven van uw wijzigingen</span>
        </p>

        <p class="BodyText" style="margin-bottom: 26px">
          <span>
            Wij zullen de verstrekte gegevens zorgvuldig beoordelen en, indien nodig, verwerken in
            onze systemen. Voor verdere vragen of terugkoppeling zullen wij contact met u opnemen.
          </span>
        </p>

        <a href="https://www.kcaf.nl/wat-doet-het-kcaf/fundermaps/" target="_blank" alt="meer informatie"><button
            class="Button Button--line">
            <span>Meer informatie</span>
            <div class="SvgIcon svg-container">
              <SvgIconKCAF />
            </div>
          </button></a>
      </template>
      <template v-else>
        <Title message="Advies" />

        <p class="BodyText BodyText--bold" style="margin-bottom: 26px">
          <span>Bedankt voor het doorgeven van uw melding</span>
        </p>

        <p class="BodyText" style="margin-bottom: 26px">
          <span>
            Wij nemen contact met u op om u van een persoonlijk advies te voorzien. Uw gegevens
            blijven strikt vertrouwelijk en worden niet buiten het KCAF gedeeld.
          </span>
        </p>
        <p class="BodyText" style="margin-bottom: 26px">
          <span>
            In ons stappenplan voor funderingsherstel leggen wij duidelijk uit welke stappen u
            alvast kunt nemen en voor welke stappen professionele hulp noodzakelijk is om grip te
            krijgen op funderingsproblemen.
          </span>
        </p>

        <a href="https://www.kcaf.nl/publicaties/stappenplan-funderingsherstel/" target="_blank"
          alt="stappenplann"><button class="Button Button--line">
            <span>Bekijk het stappenplan</span>
            <div class="SvgIcon svg-container">
              <SvgIconKCAF />
            </div>
          </button></a>
      </template>
    </div>
  </div>
</template>

<style>
.Finish__Wrapper {
  padding: 20px 20px;

  max-width: 550px;
  margin: 0 auto;
}

@media only screen and (min-width: 900px) {
  .Finish__Wrapper {
    padding: 50px 80px;
  }
}

a {
  text-decoration: none;
}

.Finish .Title,
.Finish .BodyText {
  margin-bottom: 26px;
}

.error-text {
  color: #e74c3c;
  /* Red color for error text */
}

.Button--primary {
  background-color: #00c95d;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}


.Footer {
  color: #202122;
  font-size: 18px;
}

.Footer.SvgIcon {
  font-size: 24px;
  /* color: #00c95d; */
  margin-right: 6px;
}

/*  */

.Footer .Copyright {
  display: none;
}
</style>
