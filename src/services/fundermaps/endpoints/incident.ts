import { post } from '../client'
import type { ISurveyModel } from '../interfaces/survey/ISurveyModel'

export const saveIncidentData = async function saveIncidentData(body: ISurveyModel) {
  return await post({
    endpoint: 'incident',
    requireAuth: false,
    body
  })
}

export default {
  saveIncidentData
}
