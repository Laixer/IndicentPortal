export interface ISurveyConfig {
  client_id: number
  branding: {
    vendor_name: string
    vendor_slug: string
    primary_color: string
    secondary_color: string
    vendor_logo_path: string
    intro_text?: string | null
  }
  pages: string[]
}
