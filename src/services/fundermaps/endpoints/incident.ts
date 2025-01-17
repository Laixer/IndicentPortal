import { post } from '../client'
import type { ISurveyModel } from '../interfaces/survey/ISurveyModel'

export const saveIncidentData = async function saveIncidentData(body: ISurveyModel) {
  return await post({
    endpoint: 'incident',
    requireAuth: false,
    body
  })
}

export const uploadIncidentFiles = async function uploadIncidentFiles(files: FileList) {
  const body = new FormData()
  for (const file of files) {
    body.append('files', file)
  }
  return await post({
    endpoint: 'incident/upload',
    requireAuth: false,
    body
  })
}

export default {
  saveIncidentData,
  uploadIncidentFiles
}
