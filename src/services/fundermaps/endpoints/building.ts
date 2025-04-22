import { get } from '../client'
import type { GeoLocationData } from '../interfaces/building/GeoLocationData'

const getLocationInformationByBuildingId = async (buildingId: string): Promise<GeoLocationData> => {
  return await get({ endpoint: `/geocoder/${buildingId}`, requireAuth: false })
}

export default {
  getLocationInformationByBuildingId
}
