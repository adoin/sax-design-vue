import type { Component } from 'vue'

export function iconNameToKebab(name: string): string {
  const bold = name.endsWith('Bold')
  const base = bold ? name.slice(0, -4) : name
  const kebab = base
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
  return bold ? `${kebab}-bold` : kebab
}

export function buildIconCatalog(icons: Record<string, Component>) {
  return Object.entries(icons)
    .filter(([name]) => /^[A-Z]/.test(name))
    .map(([name, component]) => ({
      name,
      kebab: iconNameToKebab(name),
      component,
    }))
}

export function filterIconCatalog(
  catalog: ReturnType<typeof buildIconCatalog>,
  query: string
) {
  const q = query.trim().toLowerCase()
  if (!q) return catalog

  return catalog.filter(
    ({ name, kebab }) => name.toLowerCase().includes(q) || kebab.includes(q)
  )
}
