import { get } from '../client'
import type { AppConfig } from '../interfaces/AppConfig'

export const getAppConfig = async (slug: string): Promise<AppConfig | null> => {
  try {
    return await get({
      endpoint: `app/${slug}`,
      requireAuth: false
    })
  } catch (e) {
    console.error(e)

    // TODO: Refactor API client to handle errors properly
    return new Promise((_, reject) => {
      reject(null)
    })
  }
}
