import type {
  EnvironmentDamageCharacteristics,
  FoundationDamageCause,
  FoundationDamageCharacteristics,
  FoundationType
} from '@/enums'

export interface ISurveyModel {
  // Address
  Address: string
  building_id: string | undefined // use this key format for consistency throughout Fundermaps

  // AddressCharacteristics / FeedbackCharacteristics
  ChainedBuilding: boolean | null
  Owner: boolean | null
  NeighborRecovery: boolean | null

  // Contact
  Name: string
  Email: string
  PhoneNumber: string

  // EnvironmentDamageCharacteristics
  EnvironmentDamageCharacteristics: keyof EnvironmentDamageCharacteristics[] // number[]

  // FoundationDamageCause
  FoundationDamageCause: keyof FoundationDamageCause | null // number

  // FoundationDamageCharacteristics
  FoundationDamageCharacteristics: keyof FoundationDamageCharacteristics[] // number[]

  // FoundationType
  FoundationType: keyof FoundationType | null // number

  // Note
  Note: string

  // Upload
  DocumentFile: string[]
}
