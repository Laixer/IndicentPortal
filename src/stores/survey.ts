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
  Address: '',
  building_id: '', // (use this param format)

  // AddressCharacteristics / FeedbackCharacteristics
  ChainedBuilding: null,
  Owner: null,
  NeighborRecovery: null, //

  // Contact
  Name: '',
  Email: '',
  PhoneNumber: '',

  // EnvironmentDamageCharacteristics
  EnvironmentDamageCharacteristics: [],

  // FoundationDamageCause
  FoundationDamageCause: null, // number

  // FoundationDamageCharacteristics
  FoundationDamageCharacteristics: [],

  // FoundationType
  FoundationType: null, // number

  // Note
  Note: '',

  // Upload
  DocumentFile: []
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
      if (Model.value.Name === '' || Model.value.Email === '' || Model.value.PhoneNumber === '') {
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
