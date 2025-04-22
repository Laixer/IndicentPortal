import { post } from '../client'
import type { ISurveyModel } from '../interfaces/survey/ISurveyModel'

export const saveIncidentData = async (body: ISurveyModel): Promise<any> => {
  return post({
    endpoint: 'incident',
    requireAuth: false,
    body
  })
}

export const uploadIncidentFiles = async (files: FileList): Promise<any> => {
  const body = new FormData()
  for (const file of files) {
    body.append('files', file)
  }
  return post({
    endpoint: 'incident/upload',
    requireAuth: false,
    body
  })
}
