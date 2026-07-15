import type { PageFrontmatter } from 'vuepress-vite'

export type SThemeHomeActionOption = {
  /**
   * Action name
   */
  text: string

  /**
   * Action link
   */
  link: string
}

export type SThemeHomeFeature = {
  /**
   * Feature name
   */
  title: string

  /**
   * Feature description
   */
  details: string
}

export type SThemeHomeFeatureOption = SThemeHomeFeature & {
  /**
   * Feature actions
   */
  action?: SThemeHomeActionOption
}

export type SThemeProjectHomePageFrontmatter = PageFrontmatter & {
  home: true
  heroText?: string
  tagline?: string

  action: SThemeHomeActionOption
  features?: SThemeHomeFeatureOption[]
  suscribe?: string
  premiumThemes?: SThemeHomeFeature
}
