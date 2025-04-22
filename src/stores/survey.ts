import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
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
  address: string | null
  coordinates: Coordinates | null
  model: ISurveyModel
}

// Extract clean model to avoid duplication and ensure consistency
const getCleanModelState = (): ISurveyModel => ({
  // Client
  client_id: null,

  // Building
  building: '',

  chained_building: null,
  owner: null,
  neighbor_recovery: null,

  // Contact
  contact_name: '',
  contact: '',
  contact_phone_number: '',

  // EnvironmentDamageCharacteristics
  environment_damage_characteristics: [],

  // FoundationDamageCause
  foundation_damage_cause: null,

  // FoundationDamageCharacteristics
  foundation_damage_characteristics: [],

  // FoundationType
  foundation_type: null,

  // Note
  note: '',

  // Upload
  file_resource_key: null,
  document_file: [],

  // Metadata
  metadata: {}
})

/**
 * Validates the client ID
 * @param {number} clientId - The client ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
const validateClientId = (clientId: number | undefined | null): boolean => {
  return Boolean(
    clientId &&
    clientId > 0
  )
}

/**
 * Validates the building identifier
 * @param {string} building - The building identifier to validate
 * @returns {boolean} True if valid, false otherwise
 */
const validateBuilding = (building: string | undefined | null): boolean => {
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
    submissionError: false,
    isDirty: false,
    vendorSlug: undefined,
    address: null,
    coordinates: null, // Initialize coordinates
    model: getCleanModelState()
  })

  /**
   * Validates if the current store vendor slug matches the provided vendor slug
   * Used to ensure operations are performed in the correct vendor context
   * @param {string} vendorSlug - The vendor slug to validate against the current store state
   * @returns {boolean} True if the vendor slugs match, false otherwise
   */
  const isStoreValid = (vendorSlug: string): boolean => {
    return state.vendorSlug === vendorSlug && state.vendorSlug !== undefined
  }

  /**
   * Reset the survey data while preserving contact details
   */
  const clearStore = () => {
    const contactDetails = {
      contact_name: state.model.contact_name,
      contact: state.model.contact,
      contact_phone_number: state.model.contact_phone_number
    }

    // Reset the model to its clean state
    state.saving = false
    state.saveError = null
    state.submissionError = false
    state.isDirty = false
    state.vendorSlug = undefined
    state.address = null
    state.coordinates = null
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
  const isSurveyModelValid = (): boolean => {
    return Boolean(
      validateClientId(state.model.client_id) &&
      validateBuilding(state.model.building) &&
      state.model.contact &&
      state.model.contact_name
    )
  }

  /**
   * Check if the survey data is dirty and valid
   * Detects if we're loading an invalid state from persistence
   * @returns {boolean} True if dirty and valid, false otherwise
   */
  const isDirtyAndValid = (): boolean => {
    // Check both required fields are valid
    const isValid = validateClientId(state.model.client_id) &&
      validateBuilding(state.model.building);

    // Return false if data is dirty but invalid (likely from invalid persisted state)
    if (state.isDirty && !isValid) {
      console.warn('Detected potentially invalid persisted state');
      return false;
    }

    // Return true only if the state is dirty and valid
    return state.isDirty && isValid;
  }

  /**
   * Sets the vendor slug and client ID for the current survey
   * Used to associate the survey with the specific vendor and client context
   * @param {string} vendorSlug - The unique identifier for the vendor
   * @param {number} clientId - The client ID associated with the vendor
   */
  const setVendorSlug = (vendorSlug: string, clientId: number): void => {
    state.vendorSlug = vendorSlug
    state.model.client_id = clientId
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

      if (!isSurveyModelValid()) {
        const error = 'Survey model validation failed'
        console.error(error)
        state.saveError = error
        state.submissionError = true
        return false
      }

      // Save the incident data
      await saveIncidentData(state.model)

      // Reset the survey data on successful save
      clearStore()
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
  }

  // Use toRefs to make all properties reactive while allowing destructuring
  return {
    ...toRefs(state),
    // Methods
    clearStore,
    saveToDatabase,
    setVendorSlug,
    isDirtyAndValid,
    populateFromParams,
    setBuilding,
    isStoreValid
  }
}, {
  persist: {
    storage: sessionStorage,
    omit: ['saving', 'saveError', 'submissionError'],
  }
})
