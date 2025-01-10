import type { ISurveyConfig } from './services/fundermaps/interfaces/survey/ISurveyConfig'

/******************************************************************************
 * TODO: Move config data to DB...
 */
const defaultBranding = {
  vendor_name: 'Fundermaps',
  vendor_slug: 'fundermaps',
  vendor_logo_path: '/img/logo.png',
  primary_color: '#000',
  secondary_color: '#000'
}
const defaultPages = [
  // 'address',
  'foundation-damage-cause',
  'foundation-damage-characteristics',
  'address-characteristics',
  'foundation-type',
  'environment-damage-characteristics',
  'upload',
  'note',
  'contact'
]
export const APIResponseByVendorSlug: { [key: string]: ISurveyConfig } = {
  dordrecht: {
    client_id: 26,
    branding: {
      vendor_name: 'Dordrecht',
      vendor_slug: 'dordrecht',
      vendor_logo_path: '/img/logo_dordrecht.png',
      primary_color: 'red',
      secondary_color: 'blue'
    },
    pages: defaultPages
  },
  // lingewaard: 25,
  // lansingerland: 24,
  // regiodeal: 23,
  // veenweidefryslan: 22,
  // schiedam: 21,
  fundermaps: {
    client_id: 20,
    branding: defaultBranding,
    pages: defaultPages
  },
  feedback: {
    client_id: 77,
    branding: defaultBranding,
    pages: [
      // 'address',
      'feedback-characteristics',
      'foundation-type',
      'upload',
      'note',
      'contact'
    ]
  },
  incident: {
    client_id: 10,
    branding: defaultBranding,
    pages: defaultPages
  }
}
