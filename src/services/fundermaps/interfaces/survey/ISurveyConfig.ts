export interface ISurveyConfig {
  clientId: number
  branding: {
    vendorName: string
    vendorLogoPath: string
    primaryColor: string
    secondaryColor: string
  }
  pages: string[]
}
