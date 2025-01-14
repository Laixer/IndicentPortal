/**
 * This store holds information on the survey answers to be sent to the API
 */
import { ref, type Ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useConfigStore } from './config'
import { useRouter } from 'vue-router'
import { saveSurveyData } from '@/services/fundermaps/endpoints/survey'
import type { ISurveyModel } from '@/services/fundermaps/interfaces/survey/ISurveyModel'

const cleanModelState = {
  // Address
  building_id: '', // (use this param format)

  // AddressCharacteristics / FeedbackCharacteristics
  chained_building: null,
  owner: null,
  neighbor_recovery: null, //

  // Contact
  name: '',
  email: '',
  phone_number: '',

  // EnvironmentDamageCharacteristics
  environment_damage_characteristics: [],

  // FoundationDamageCause
  foundation_damage_cause: null, // number

  // FoundationDamageCharacteristics
  foundation_damage_characteristics: [],

  // FoundationType
  foundation_type: null, // number

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
  const { surveyPageSlugs } = storeToRefs(useConfigStore())
  const router = useRouter()

  /**
   * Store the data in the DB
   */
  const saveToDatabase = async function saveToDatabase() {
    saving.value = true

    // TODO: Reminder: This is ad-hoc validation, because it is the only validation
    if (surveyPageSlugs.value.includes('contact')) {
      if (Model.value.name === '' || Model.value.email === '' || Model.value.phone_number === '') {
        saving.value = false

        // TODO: Validation feedback...
        router.push({
          name: 'contact'
        })
        return
      }
    }

    await saveSurveyData(Model.value)
    saving.value = false
  }

  return {
    Model,
    clearSurveyData,
    saveToDatabase
  }
})
