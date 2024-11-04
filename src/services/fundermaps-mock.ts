import { APIResponseByVendorSlug } from '@/api-data'

import { variableSleep } from '@/utils/sleep'
import type { ISurveyConfig } from './fundermaps/interfaces/survey/ISurveyConfig'
import type { ISurveyModel } from './fundermaps/interfaces/survey/ISurveyModel'
import { getLocationInformationByBuildingId } from './fundermaps/endpoints/building'

/**
 * remove fake delay & implement actual API call
 */
export const getConfigBySlug = async function getConfigBySlug(
  slug: string
): Promise<ISurveyConfig> {
  try {
    await variableSleep(200)

    slug = slug.toLowerCase()

    if (!APIResponseByVendorSlug[slug]) {
      throw new Error('404')
    }

    return APIResponseByVendorSlug[slug]
  } catch (e) {
    console.log(e)
    throw e
  }
}

// TODO: Implement saving Model data...
export const postSaveToDatabase = async function postSaveToDatabase(model: ISurveyModel) {
  await variableSleep(300)
  console.log(model)
}

export const getGeocoder = async function getGeocoder(id: string) {
  return await getLocationInformationByBuildingId(id)
}
