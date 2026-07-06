import type { PageFrontmatter } from 'vuepress-vite'

export type VsThemeHomeActionOption = {
  /**
   * Action name
   */
  text: string

  /**
   * Action link
   */
  link: string
}

export type VsThemeHomeFeature = {
  /**
   * Feature name
   */
  title: string

  /**
   * Feature description
   */
  details: string
}

export type VsThemeHomeFeatureOption = VsThemeHomeFeature & {
  /**
   * Feature actions
   */
  action?: VsThemeHomeActionOption
}

export type VsThemeProjectHomePageFrontmatter = PageFrontmatter & {
  home: true
  heroText?: string
  tagline?: string

  action: VsThemeHomeActionOption
  features?: VsThemeHomeFeatureOption[]
  suscribe?: string
  premiumThemes?: VsThemeHomeFeature
}
