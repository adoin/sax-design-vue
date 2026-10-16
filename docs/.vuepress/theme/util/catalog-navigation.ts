import type { NavbarGroup, NavbarItem } from 'vuepress-vite'

export const catalogGroups = (item: NavbarGroup) =>
  item.children.filter(
    (entry): entry is NavbarGroup =>
      typeof entry !== 'string' && 'children' in entry,
  )

export const catalogLinks = (group: NavbarGroup): NavbarItem[] =>
  group.children.filter(
    (entry): entry is NavbarItem =>
      typeof entry !== 'string' && !('children' in entry),
  )

const canonicalPath = (path: string) =>
  path
    .split(/[?#]/)[0]
    .replace(/\.html$/, '')
    .replace(/\/$/, '')

export function currentCatalogGroup(groups: NavbarGroup[], path: string) {
  const current = canonicalPath(path)
  let selected = 0
  let length = -1
  groups.forEach((group, index) => {
    catalogLinks(group).forEach(({ link }) => {
      const target = canonicalPath(link)
      // Table links to its first guide, while sibling guides share the family.
      const family = target.match(/^(.*\/components\/[^/]+)\//)?.[1]
      for (const candidate of family ? [target, family] : [target]) {
        if (
          candidate.length > length &&
          (current === candidate || current.startsWith(`${candidate}/`))
        ) {
          length = candidate.length
          selected = index
        }
      }
    })
  })
  return selected
}
