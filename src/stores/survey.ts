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
 * Reset the survey data while preserving contact details
 */
const clearSurveyData = () => {
  const contactDetails = {
    contact_name: Model.value.contact_name,
    contact: Model.value.contact,
    contact_phone_number: Model.value.contact_phone_number
  }

  // Reset all data
  Model.value = JSON.parse(JSON.stringify(cleanModelState))

  // Restore contact details
  Model.value.contact_name = contactDetails.contact_name
  Model.value.contact = contactDetails.contact
  Model.value.contact_phone_number = contactDetails.contact_phone_number
}

export const useSurveyStore = defineStore('Survey', () => {
  /**
   * Store the survey data as a new Incident record
   */
  const saveToDatabase = async () => {
    const { clientId, surveyPageSlugs } = storeToRefs(useConfigStore())

    try {
      saving.value = true

      // TODO: Reminder: This is ad-hoc validation, because it is the only validation
      if (surveyPageSlugs.value.includes('contact')) {
        if (Model.value.contact_name === '' || Model.value.contact === '') {
          saving.value = false
          // TODO: Refactor redirect to contact page.
          return 'contact'
        }
      }

      // Model.value.client_id = clientId.value

      await saveIncidentData(Model.value)

      // Reset the survey data
      clearSurveyData()
    } catch (error) {
      console.error('Failed to save incident data:', error)
    } finally {
      saving.value = false
    }
  }

  return {
    Model,
    clearSurveyData,
    saveToDatabase
  }
}, { persist: true })
