import { reactive, toRefs } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useConfigStore } from './config'
import { saveIncidentData } from '@/services/fundermaps/endpoints/incident'
import type { ISurveyModel } from '@/services/fundermaps/interfaces/survey/ISurveyModel'
import type { LocationQuery } from 'vue-router'

// Define interface for better type safety
interface SurveyState {
  saving: boolean
  model: ISurveyModel
}

const cleanModelState: ISurveyModel = {
  // Client
  client_id: null, // number

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

export const useSurveyStore = defineStore('survey', () => {
  // State using reactive instead of ref for better destructuring
  const state = reactive<SurveyState>({
    saving: false,
    model: JSON.parse(JSON.stringify(cleanModelState))
  })

  /**
   * Reset the survey data while preserving contact details
   */
  const clearSurveyData = () => {
    const contactDetails = {
      contact_name: state.model.contact_name,
      contact: state.model.contact,
      contact_phone_number: state.model.contact_phone_number
    }

    // Reset all data
    state.model = JSON.parse(JSON.stringify(cleanModelState))

    // Restore contact details
    state.model.contact_name = contactDetails.contact_name
    state.model.contact = contactDetails.contact
    state.model.contact_phone_number = contactDetails.contact_phone_number
  }

  /**
   * Validate the survey model to ensure required fields are filled
   */
  const validateSurveyModel = () => {
    return state.model.building !== ''
      && state.model.contact !== ''
      && state.model.contact_name !== ''
  }

  /**
   * Store the survey data as a new Incident record
   */
  const saveToDatabase = async () => {
    const { clientId } = storeToRefs(useConfigStore())

    try {
      state.saving = true

      state.model.client_id = clientId.value

      if (!validateSurveyModel()) {
        console.error('Survey model validation failed')
        state.saving = false
        return
      }

      await saveIncidentData(state.model)

      // Reset the survey data
      clearSurveyData()
    } catch (error) {
      console.error('Failed to save incident data:', error)
    } finally {
      state.saving = false
    }
  }

  /**
   * Populate the model from URL parameters
   */
  const populateFromParams = (params: LocationQuery) => {
    // TODO: Validate params
    if (params.building && typeof params.building === 'string') {
      state.model.building = params.building;
    }
  }

  // Use toRefs to make all properties reactive while allowing destructuring
  return {
    ...toRefs(state),
    // Methods
    clearSurveyData,
    saveToDatabase,
    validateSurveyModel,
    populateFromParams,
  }
}, { persist: { storage: sessionStorage } })
