import { APIResponseByVendorSlug } from '@/api-data'
import { get, post } from '../client'
import type { ISurveyConfig } from '../interfaces/survey/ISurveyConfig'
import type { ISurveyModel } from '../interfaces/survey/ISurveyModel'

export const getSurveyConfig = async function getSurveyConfig(
  slug: string
): Promise<ISurveyConfig> {
  try {
    return await get({
      endpoint: `app/${slug}`,
      requireAuth: false
    })
  } catch (e) {
    console.error(e)
    return APIResponseByVendorSlug[slug]
  }
}

export const saveSurveyData = async function saveSurveyData(body: ISurveyModel) {
  return await post({
    endpoint: 'incident',
    requireAuth: false,
    body
  })
}

export default {
  getSurveyConfig,
  saveSurveyData
}
