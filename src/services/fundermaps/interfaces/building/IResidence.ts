import { type IEnumMethods } from '../util/IEnumMethods'

export interface IResidence extends IEnumMethods {
  id: string
  addressId: string
  buildingId: string
  latitude: number
  longitude: number
}
