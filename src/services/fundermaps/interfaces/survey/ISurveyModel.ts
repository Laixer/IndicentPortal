import type {
  EnvironmentDamageCharacteristics,
  FoundationDamageCause,
  FoundationDamageCharacteristics,
  FoundationType
} from '@/enums'

export interface ISurveyModel {
  // Address
  building: string | undefined // use this key format for consistency throughout Fundermaps

  // AddressCharacteristics / FeedbackCharacteristics
  chained_building: boolean | null
  owner: boolean | null
  neighbor_recovery: boolean | null

  // Contact
  contact_name: string
  contact: string // email
  contact_phone_number: string

  // EnvironmentDamageCharacteristics
  environment_damage_characteristics: string[] // (keyof EnvironmentDamageCharacteristics)[] // string[] // keyof EnvironmentDamageCharacteristics[] //

  // FoundationDamageCause
  foundation_damage_cause: keyof FoundationDamageCause | null // string

  // FoundationDamageCharacteristics
  foundation_damage_characteristics: string[] // (keyof FoundationDamageCharacteristics)[] // string[] //  (keyof FoundationDamageCharacteristics)[] //

  // FoundationType
  foundation_type: keyof FoundationType | null // string

  // Note
  note: string

  // Upload
  document_file: string[]
}
