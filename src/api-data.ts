import type { ISurveyConfig } from './services/fundermaps/interfaces/survey/ISurveyConfig'

/******************************************************************************
 * TODO: Move config data to DB...
 */
const defaultBranding = {
  vendorName: 'Fundermaps',
  vendorLogoPath: '/img/logo.png',
  primaryColor: '#000',
  secondaryColor: '#000'
}
const defaultPages = [
  'address',
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
    clientId: 26,
    branding: {
      vendorName: 'Dordrecht',
      vendorLogoPath: '/img/logo_dordrecht.png',
      primaryColor: 'red',
      secondaryColor: 'blue'
    },
    pages: defaultPages
  },
  // lingewaard: 25,
  // lansingerland: 24,
  // regiodeal: 23,
  // veenweidefryslan: 22,
  // schiedam: 21,
  fundermaps: {
    clientId: 20,
    branding: defaultBranding,
    pages: defaultPages
  },
  feedback: {
    clientId: 77,
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
    clientId: 10,
    branding: defaultBranding,
    pages: defaultPages
  }
}
