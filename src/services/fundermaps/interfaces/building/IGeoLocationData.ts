import type {
  IBuilding,
  IAddress,
  IResidence,
  INeighborhood,
  IDistrict,
  IMunicipality,
  IState
} from './index'
import { type IEnumMethods } from '../util/IEnumMethods'

export interface IGeoLocationData extends IEnumMethods {
  building: IBuilding
  address: IAddress
  neighborhood: null | INeighborhood
  residence: null | IResidence
  district: null | IDistrict
  municipality: null | IMunicipality
  state: null | IState
}
