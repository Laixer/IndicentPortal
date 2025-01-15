/**
 * This store holds information on the survey answers to be sent to the API
 */
import { ref, type Ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useConfigStore } from './config'
import { saveIncidentData } from '@/services/fundermaps/endpoints/incident'
import type { ISurveyModel } from '@/services/fundermaps/interfaces/survey/ISurveyModel'

const cleanModelState: ISurveyModel = {
  // Address
  building: '', // (use this param format)

  // AddressCharacteristics / FeedbackCharacteristics
  chained_building: null,
  owner: null,
  neighbor_recovery: null, //

  // Contact
  contact_name: '',
  contact: '',
  contact_phone_number: '',

  // EnvironmentDamageCharacteristics
  environment_damage_characteristics: [],

  // FoundationDamageCause
  foundation_damage_cause: null, // string

  // FoundationDamageCharacteristics
  foundation_damage_characteristics: [],

  // FoundationType
  foundation_type: null, // string

  // Note
  note: '',

  // Upload
  document_file: []
}

const saving: Ref<boolean> = ref(false)

/**
 * The survey data model, to be submitted to the API
 */
const Model: Ref<ISurveyModel> = ref(JSON.parse(JSON.stringify(cleanModelState)))

/**
 * Reset the survey data
 */
const clearSurveyData = function clearSurveyData() {
  Model.value = JSON.parse(JSON.stringify(cleanModelState))
}

export const useSurveyStore = defineStore('Survey', function useSurvey() {
  /**
   * Store the survey data as a new Incident record
   */
  const saveToDatabase = async function saveToDatabase() {
    const { surveyPageSlugs } = storeToRefs(useConfigStore())

    saving.value = true

    // TODO: Reminder: This is ad-hoc validation, because it is the only validation
    if (surveyPageSlugs.value.includes('contact')) {
      if (Model.value.contact_name === '' || Model.value.contact === '') {
        saving.value = false
        // TODO: Refactor redirect to contact page.
        return 'contact'
      }
    }

    await saveIncidentData(Model.value)
    saving.value = false
  }

  return {
    Model,
    clearSurveyData,
    saveToDatabase
  }
})
