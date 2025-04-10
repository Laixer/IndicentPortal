import { reactive, toRefs } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useConfigStore } from './config'
import { saveIncidentData } from '@/services/fundermaps/endpoints/incident'
import type { ISurveyModel } from '@/services/fundermaps/interfaces/survey/ISurveyModel'
import type { LocationQuery } from 'vue-router'

// Define interface for better type safety
interface SurveyState {
  saving: boolean
  saveError: string | null
  isDirty: boolean
  model: ISurveyModel
}

// Extract clean model to avoid duplication and ensure consistency
const getCleanModelState = (): ISurveyModel => ({
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
})

/**
 * Validates the building identifier
 * @param {string} building - The building identifier to validate
 * @returns {boolean} True if valid, false otherwise
 */
const validateBuilding = (building: string): boolean => {
  return Boolean(
    building &&
    building.trim().length > 0 &&
    building.trim().startsWith('NL.IMBAG.')
  )
}

export const useSurveyStore = defineStore('survey', () => {
  // State using reactive instead of ref for better destructuring
  const state = reactive<SurveyState>({
    saving: false,
    saveError: null,
    isDirty: false,
    model: getCleanModelState()
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

    // Reset all data with a clean copy to avoid reference issues
    state.model = getCleanModelState()

    // Restore contact details
    state.model.contact_name = contactDetails.contact_name
    state.model.contact = contactDetails.contact
    state.model.contact_phone_number = contactDetails.contact_phone_number

    // Clear any previous save errors
    state.saveError = null
  }

  /**
   * Validate the survey model to ensure required fields are filled
   * @returns {boolean} True if the model is valid, false otherwise
   */
  const validateSurveyModel = (): boolean => {
    // Basic validation - could be expanded with more detailed validation
    return Boolean(
      state.model.building &&
      state.model.contact &&
      state.model.contact_name
    )
  }

  /**
   * Check if the survey data is dirty and valid
   * @returns {boolean} True if dirty and valid, false otherwise
   */
  const isDirtyAndValid = (): boolean => {
    return state.isDirty && state.model.building ? validateBuilding(state.model.building) : false
  }

  /**
   * Mark the survey as dirty when user makes changes
   */
  const markAsDirty = (): void => {
    state.isDirty = true
  }

  /**
   * Update building ID and validate it
   * @param {string} buildingId - The building ID to set
   * @returns {boolean} True if valid, false otherwise
   */
  const setBuilding = (buildingId: string): boolean => {
    const trimmedId = buildingId.trim()
    if (validateBuilding(trimmedId)) {
      state.model.building = trimmedId
      markAsDirty()
      return true
    }
    return false
  }

  /**
   * Store the survey data as a new Incident record
   * @returns {Promise<boolean>} True if save was successful, false otherwise
   */
  const saveToDatabase = async (): Promise<boolean> => {
    const { clientId } = storeToRefs(useConfigStore())

    if (state.saving) {
      console.warn('Save already in progress')
      return false
    }

    try {
      state.saving = true
      state.saveError = null

      // Ensure client ID is set correctly
      state.model.client_id = clientId.value

      if (!validateSurveyModel()) {
        const error = 'Survey model validation failed'
        console.error(error)
        state.saveError = error
        return false
      }

      await saveIncidentData(state.model)

      // Reset the survey data on successful save
      clearSurveyData()
      state.isDirty = false
      state.saveError = null
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error saving data'
      console.error('Failed to save incident data:', error)
      state.saveError = errorMessage
      return false
    } finally {
      state.saving = false
    }
  }

  /**
   * Populate the model from URL parameters
   * @param {LocationQuery} params - URL query parameters
   */
  const populateFromParams = (params: LocationQuery): void => {
    if (params.building && typeof params.building === 'string') {
      setBuilding(params.building);
    }

    // Additional parameters could be handled here
  }

  // Use toRefs to make all properties reactive while allowing destructuring
  return {
    ...toRefs(state),
    // Methods
    clearSurveyData,
    saveToDatabase,
    validateSurveyModel,
    isDirtyAndValid,
    populateFromParams,
    setBuilding
  }
}, { persist: { storage: sessionStorage } })
