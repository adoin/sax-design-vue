import { describe, expect, it } from 'vitest'
import {
  catalogGroups,
  catalogLinks,
  currentCatalogGroup,
} from '../../docs/.vuepress/theme/util/catalog-navigation'
import { enNavbar } from '../../docs/.vuepress/app/nav'
import { zhNavbar } from '../../docs/.vuepress/app/nav.zh'
import type { NavbarGroup } from 'vuepress-vite'

describe('documentation catalog navigation', () => {
  for (const [locale, navbar, prefix] of [
    ['English', enNavbar, ''],
    ['Chinese', zhNavbar, '/zh'],
  ] as const) {
    it(`selects the most specific category for ${locale} routes`, () => {
      const catalog = navbar[1] as NavbarGroup
      const groups = catalogGroups(catalog)
      const expected = groups.findIndex((group) =>
        catalogLinks(group).some(({ link }) =>
          link.includes('/components/table/'),
        ),
      )
      expect(expected).toBeGreaterThan(0)
      expect(
        currentCatalogGroup(
          groups,
          `${prefix}/components/table/appearance.html#size`,
        ),
      ).toBe(expected)
      expect(
        currentCatalogGroup(
          groups,
          `${prefix}/components/table.html?view=edit`,
        ),
      ).toBe(expected)
      const general = groups.findIndex((group) =>
        catalogLinks(group).some(
          ({ link }) => link === `${prefix}/components/`,
        ),
      )
      expect(currentCatalogGroup(groups, `${prefix}/components/`)).toBe(general)
      expect(currentCatalogGroup(groups, '/unrelated/')).toBe(0)
    })
    it(`retains every ${locale} component link exactly once`, () => {
      const catalog = navbar[1] as NavbarGroup
      const groups = catalogGroups(catalog)
      const links = groups.flatMap(catalogLinks).map(({ link }) => link)
      expect(groups.length).toBeGreaterThan(4)
      expect(links.length).toBeGreaterThan(70)
      expect(new Set(links).size).toBe(links.length)
    })
  }
})
