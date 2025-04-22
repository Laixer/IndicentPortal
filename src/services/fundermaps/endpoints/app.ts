import { get } from '../client'
import type { AppConfig } from '../interfaces/AppConfig'

export const getAppConfig = (slug: string): Promise<AppConfig | null> => {
  return get({
    endpoint: `app/${slug}`,
    requireAuth: false
  })
}
