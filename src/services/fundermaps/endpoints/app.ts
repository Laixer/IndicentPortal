import { get } from '../client'
import type { IAppConfig } from '../interfaces/IAppConfig'

export const getAppConfig = async function getAppConfig(slug: string): Promise<IAppConfig | null> {
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
