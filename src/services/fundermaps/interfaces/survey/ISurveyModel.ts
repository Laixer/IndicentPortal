import type { FoundationDamageCause, FoundationType } from '@/enums'

export interface ISurveyModel {
  // Address
  building_id: string | undefined // use this key format for consistency throughout Fundermaps

  // AddressCharacteristics / FeedbackCharacteristics
  chained_building: boolean | null
  owner: boolean | null
  neighbor_recovery: boolean | null

  // Contact
  name: string
  email: string
  phone_number: string

  // EnvironmentDamageCharacteristics
  environment_damage_characteristics: number[] // keyof EnvironmentDamageCharacteristics[] //

  // FoundationDamageCause
  foundation_damage_cause: keyof FoundationDamageCause | null // number

  // FoundationDamageCharacteristics
  foundation_damage_characteristics: number[] //  keyof FoundationDamageCharacteristics[] //

  // FoundationType
  foundation_type: keyof FoundationType | null // number

  // Note
  note: string

  // Upload
  document_file: string[]
}
