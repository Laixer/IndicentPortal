import { get } from '../client'
import type { IGeoLocationData } from '../interfaces/building/IGeoLocationData'

const getLocationInformationByBuildingId = async (buildingId: string): Promise<IGeoLocationData> => {
  return await get({ endpoint: `/geocoder/${buildingId}`, requireAuth: false })
}

export default {
  getLocationInformationByBuildingId
}
