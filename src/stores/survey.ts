import { reactive, toRefs } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useConfigStore } from './config'
import { saveIncidentData } from '@/services/fundermaps/endpoints/incident'
import type { ISurveyModel } from '@/services/fundermaps/interfaces/survey/ISurveyModel'
import type { LocationQuery } from 'vue-router'

// Define interface for coordinates
interface Coordinates {
  lat: number;
  lng: number;
}

// Define interface for better type safety
interface SurveyState {
  saving: boolean
  saveError: string | null
  submissionError: boolean
  isDirty: boolean
  vendorSlug: string | undefined
  clientId: number
  address: string | null
  coordinates: Coordinates | null
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
  const configStore = useConfigStore()
  const { vendorSlug, clientId } = storeToRefs(configStore)

  // State using reactive instead of ref for better destructuring
  const state = reactive<SurveyState>({
    saving: false,
    saveError: null,
    submissionError: false,
    isDirty: false,
    vendorSlug: vendorSlug.value,
    clientId: clientId.value,
    address: null,
    coordinates: null, // Initialize coordinates
    model: getCleanModelState()
  })

  // Reset the state to its initial clean state
  const resetState = () => {
    state.saving = false
    state.saveError = null
    state.submissionError = false
    state.isDirty = false
    state.vendorSlug = vendorSlug.value
    state.clientId = clientId.value
    state.address = null
    state.coordinates = null // Reset coordinates
    state.model = getCleanModelState()
  }

  /**
   * Reset the survey data while preserving contact details
   */
  const clearSurveyData = () => {
    const contactDetails = {
      contact_name: state.model.contact_name,
      contact: state.model.contact,
      contact_phone_number: state.model.contact_phone_number
    }

    // Reset the model to its clean state
    resetState()

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
   * Validates if the current store context matches the config store
   * Used to detect when loading potentially stale data from persistence
   * @returns {boolean} True if the context is valid, false otherwise
   */
  const validateStoreContext = (): boolean => {
    if (state.vendorSlug !== vendorSlug.value ||
      state.clientId !== clientId.value) {
      console.warn('Vendor or client mismatch detected in persisted state')
      return false;
    }
    return true;
  }

  /**
   * Check if the survey data is dirty and valid
   * Detects if we're loading an invalid state from persistence
   * @returns {boolean} True if dirty and valid, false otherwise
   */
  const isDirtyAndValid = (): boolean => {
    // First check if store context is valid
    const isContextValid = validateStoreContext();

    // Check if it's dirty and has a valid building
    const hasDirtyValidBuilding = state.isDirty &&
      state.model.building ? validateBuilding(state.model.building) : false;

    // If either context is invalid or the building is invalid but we have dirty data,
    // this likely means we loaded an invalid state from persistence
    if (!isContextValid || (state.isDirty && !hasDirtyValidBuilding)) {
      console.warn('Detected potentially invalid persisted state');
      return false;
    }

    return hasDirtyValidBuilding;
  }

  /**
   * Reset the survey store if invalid persisted state is detected
   * Call this when navigating to survey pages to ensure valid state
   * @returns {boolean} True if state was valid, false if it was reset
   */
  const resetIfInvalid = (): boolean => {
    if (!isDirtyAndValid()) {
      clearSurveyData();
      return false;
    }
    return true;
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
      state.isDirty = true
      return true
    }
    // If validation fails, clear building and related data (like coordinates)
    state.model.building = ''
    state.coordinates = null
    return false
  }

  /**
   * Store the survey data as a new Incident record
   * @returns {Promise<boolean>} True if save was successful, false otherwise
   */
  const saveToDatabase = async (): Promise<boolean> => {
    if (state.saving) {
      console.warn('Save already in progress')
      return false
    }

    try {
      state.saving = true
      state.saveError = null
      state.submissionError = false

      // Ensure client ID is set correctly
      state.model.client_id = state.clientId

      if (!validateSurveyModel()) {
        const error = 'Survey model validation failed'
        console.error(error)
        state.saveError = error
        state.submissionError = true
        return false
      }

      // Save the incident data
      await saveIncidentData(state.model)

      // Reset the survey data on successful save
      clearSurveyData()
      state.isDirty = false
      state.saveError = null
      state.submissionError = false
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error saving data'
      console.error('Failed to save incident data:', error)
      state.saveError = errorMessage
      state.submissionError = true
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
    isDirtyAndValid,
    populateFromParams,
    setBuilding,
    resetIfInvalid
  }
}, { persist: { storage: sessionStorage } })
