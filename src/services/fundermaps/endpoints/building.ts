import { get } from '../client'
import type { IGeoLocationData } from '../interfaces/building/IGeoLocationData'

/******************************************************************************
 *    Location
 *****************************************************************************/

/**
 * Location information from the geocoder, based on buildingId
 */
export const getLocationInformationByBuildingId = async function getLocationInformationByBuildingId(
  buildingId: string
): Promise<IGeoLocationData> {
  return await get({ endpoint: `/geocoder/${buildingId}`, requireAuth: false })
}

export default {
  getLocationInformationByBuildingId
}
