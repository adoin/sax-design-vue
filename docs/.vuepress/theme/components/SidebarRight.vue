<template>
  <aside v-if="anchorItems.length" class="sidebar">
    <div class="content-sidebar">
      <s-anchor
        class="docs-outline"
        :items="anchorItems"
        :offset="124"
        :target-offset="124"
        replace
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePageData, usePageFrontmatter } from '@vuepress/client'
import { useDocLocaleUi } from '../composables/docLocale'
import type { MarkdownItHeader } from '@mdit-vue/types'
import type { AnchorItem } from '@vuesax-alpha/components/anchor'
import type {
  ThemeNormalApiFrontmatter,
  ThemeNormalApiTableKey,
} from '../shared/frontmatter/normal'

const pageFrontmatter = usePageFrontmatter<ThemeNormalApiFrontmatter>()
const pageData = usePageData()
const { t } = useDocLocaleUi()
const domPageItems = ref<AnchorItem[]>([])
let collectFrame: number | undefined
let headingObserver: MutationObserver | undefined

const apiTableKeys: ThemeNormalApiTableKey[] = [
  'PROPS',
  'CHILD_PROPS',
  'EVENTS',
  'SLOTS',
  'EXPOSES',
]
const tableSlug = (key: ThemeNormalApiTableKey) =>
  `api-${key.toLowerCase().replaceAll('_', '-')}`
const tableLabel = (key: ThemeNormalApiTableKey) =>
  pageFrontmatter.value.API_TITLES?.[key] || t.value.apiTables[key]

const headerHref = (header: MarkdownItHeader) =>
  header.link || `#${header.slug}`

const plainTitle = (title: string) =>
  title
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()

const headerTitle = (header: MarkdownItHeader) => {
  const title = plainTitle(header.title)
  return pageFrontmatter.value.UPDATES?.includes(header.slug)
    ? `${title} · ${t.value.shell.update}`
    : title
}

const flattenChildren = (headers: MarkdownItHeader[]): MarkdownItHeader[] =>
  headers.flatMap((header) => [
    header,
    ...flattenChildren(header.children || []),
  ])

const toAnchorItem = (header: MarkdownItHeader): AnchorItem => ({
  href: headerHref(header),
  title: headerTitle(header),
  children: header.children?.length
    ? flattenChildren(header.children).map((child) => ({
        href: headerHref(child),
        title: headerTitle(child),
      }))
    : undefined,
})

const collectPageHeadings = () => {
  const headings = document.querySelectorAll<HTMLElement>(
    [
      '.page .content__default > h2[id]',
      '.page .content__default > h3[id]',
      '.page .content__default > .card > .text > h2[id]',
      '.page .content__default > .card > .text > h3[id]',
    ].join(', '),
  )
  const items: AnchorItem[] = []

  headings.forEach((heading) => {
    const item: AnchorItem = {
      href: `#${heading.id}`,
      title: heading.textContent?.trim() || heading.id,
    }

    if (heading.tagName === 'H2') {
      items.push(item)
      return
    }

    const parent = items.at(-1)
    if (parent) parent.children = [...(parent.children || []), item]
    else items.push(item)
  })

  domPageItems.value = items
}

const scheduleHeadingCollection = async () => {
  await nextTick()
  if (collectFrame !== undefined) cancelAnimationFrame(collectFrame)
  collectFrame = requestAnimationFrame(collectPageHeadings)
}

const observePageHeadings = () => {
  nextTick(() => {
    const content = document.querySelector('.page .content__default')

    if (!content) {
      collectFrame = requestAnimationFrame(observePageHeadings)
      return
    }

    headingObserver?.disconnect()
    headingObserver = new MutationObserver(scheduleHeadingCollection)
    headingObserver.observe(content, { childList: true })
    collectPageHeadings()
  })
}

const anchorItems = computed<AnchorItem[]>(() => {
  const pageHeaders = pageData.value.headers ?? []
  const isComponentDocument = pageData.value.path.includes('/components/')

  if (!isComponentDocument) {
    return pageHeaders.length
      ? pageHeaders.map(toAnchorItem)
      : domPageItems.value
  }

  const exampleHeaders = pageHeaders.filter(
    (header) => header.level === 2 && header.slug !== 'api',
  )
  const exampleItems = exampleHeaders.length
    ? exampleHeaders.map((header) => ({
        href: headerHref(header),
        title: headerTitle(header),
      }))
    : domPageItems.value.map(({ href, title }) => ({ href, title }))
  const apiChildren = apiTableKeys
    .filter((key) => {
      const rows = pageFrontmatter.value[key]
      return Array.isArray(rows) && rows.length > 0
    })
    .map((key): AnchorItem => ({
      title: tableLabel(key),
      href: `#${tableSlug(key)}`,
    }))

  const groups: AnchorItem[] = []

  groups.push({
    href: '#examples',
    title: t.value.outline.examples,
    children: exampleItems.length ? exampleItems : undefined,
  })

  if (apiChildren.length) {
    groups.push({
      href: '#api',
      title: 'API',
      children: apiChildren,
    })
  }

  return groups
})

watch(
  () => pageData.value.path,
  () => {
    domPageItems.value = []
    observePageHeadings()
  },
)
onMounted(observePageHeadings)
onBeforeUnmount(() => {
  if (collectFrame !== undefined) cancelAnimationFrame(collectFrame)
  headingObserver?.disconnect()
})
</script>

<style lang="scss">
@use '../styles/use' as *;

.page .sidebar .docs-outline {
  width: 196px;

  > .s-anchor__group > .s-anchor__item {
    font-weight: 650;
  }

  .s-anchor__children {
    margin-top: 2px;
    margin-bottom: 7px;
  }
}

@media (max-width: 1080px) {
  .no-sidebar {
    .sidebar {
      .nav-links {
        display: block !important;
        & > .nav-item {
          &:nth-child(1) {
            display: block;
          }
          &:nth-child(2) {
            display: block;
          }
        }
        .nav-item {
          .dropdown-wrapper {
            .nav-dropdown {
              display: block !important;
              transform: translate(0px) !important;
              box-shadow: none !important;
              opacity: 1 !important;
              visibility: visible !important;
              h4 {
                padding-left: 0px !important;
              }
            }
          }
        }
      }
    }
  }

  .sidebar {
    .nav-links {
      & > .nav-item {
        &:nth-child(1) {
          display: none;
        }
        &:nth-child(2) {
          display: none;
        }
        & > .dropdown-wrapper {
          & > a {
            pointer-events: none;
          }
        }
      }
      .nav-item {
        .nav-dropdown {
          padding-left: 0.4rem;
          li {
            padding: 5px;
            font-weight: normal;
            font-size: 0.95rem;
          }
        }
      }
    }
  }
}
</style>
