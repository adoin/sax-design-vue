import type { DefaultThemeOptions } from 'vuepress'
import type { Theme } from '@vuepress/core'

export declare interface SaxDesignVueThemeOptions extends DefaultThemeOptions {
  /**
   * Prev Version
   */
  prevVersion?: string
  linkPrevVersion?: string
  searchPlaceholder?: string
  linkSite?: string
  search?: boolean
  next?: string
  prev?: string
  searchMaxSuggestions?: number
  displayAllHeaders?: boolean
  searchData?: SearchData
}
export declare type SearchData = {
  [x: string]: SearchDataOption[]
}
export declare type SearchDataOption = {
  title: string
  path: string
  headers?: SearchDataHeaderOption[]
}
export declare type SearchDataHeaderOption = {
  title: string
  slug: string
}

export declare const saxDesignVueTheme: ({
  themePlugins,
  ...localeOptions
}?: SaxDesignVueThemeOptions) => Theme
