import type { IGeoLocationData } from '../interfaces/building'
import { get } from '../client'

/******************************************************************************
 *    Location
 *****************************************************************************/

/**
 * Location information from the geocoder, based on buildingId
 */
export const getLocationInformationByBuildingId = async function getLocationInformationByBuildingId(
  buildingId: string
): Promise<IGeoLocationData> {
  return await get({ endpoint: `/geocoder/${buildingId}` })
}

export default {
  getLocationInformationByBuildingId
}
