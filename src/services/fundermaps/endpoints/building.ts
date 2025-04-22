import { get } from '../client'
import type { GeoLocationData } from '../interfaces/building/GeoLocationData'

const getLocationInformationByBuildingId = (buildingId: string): Promise<GeoLocationData> => {
  return get({
    endpoint: `/geocoder/${buildingId}`,
    requireAuth: false
  })
}

export default {
  getLocationInformationByBuildingId
}
