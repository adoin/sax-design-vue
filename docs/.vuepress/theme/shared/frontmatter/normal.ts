import type { PageFrontmatter } from 'vuepress-vite'

export type ApiState = {
  text: string
  type?: string
}

export interface ThemeNormalPropsFrontmatter {
  name: string
  state?: ApiState
  type?: string
  values?: unknown
  description?: string
  default?: unknown
  link?: string
  code?: string
}

export type ThemeNormalApiTableKey =
  'PROPS' | 'CHILD_PROPS' | 'SLOTS' | 'EVENTS' | 'EXPOSES'

export interface ThemeNormalApiFrontmatter extends PageFrontmatter {
  description?: string
  API_TITLES?: Partial<Record<ThemeNormalApiTableKey, string>>
  PROPS?: ThemeNormalPropsFrontmatter[]
  CHILD_PROPS?: ThemeNormalPropsFrontmatter[]
  SLOTS?: ThemeNormalPropsFrontmatter[]
  EVENTS?: ThemeNormalPropsFrontmatter[]
  EXPOSES?: ThemeNormalPropsFrontmatter[]
  NEWS: string[]
  UPDATES: string[]
}

export interface ThemePageFrontmatter extends ThemeNormalApiFrontmatter {
  next: boolean
  prev: boolean
}
