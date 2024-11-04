import { type INamedGeoLocationWithWater } from './INamedGeoLocationWithWater'

export interface IMunicipality extends INamedGeoLocationWithWater {
  stateId?: string
}
